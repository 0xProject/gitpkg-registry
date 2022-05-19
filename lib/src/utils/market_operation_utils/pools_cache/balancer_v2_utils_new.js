"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancerV2SwapInfoCache = void 0;
const utils_1 = require("@0x/utils");
const sdk_1 = require("@balancer-labs/sdk");
const constants_1 = require("../../../constants");
const constants_2 = require("../constants");
const pair_swaps_cache_1 = require("./pair_swaps_cache");
const sgPoolDataService_1 = require("./sgPoolDataService");
// tslint:disable-next-line:custom-no-magic-numbers
const ONE_DAY_MS = 24 * 60 * 60 * constants_2.ONE_SECOND_MS;
class BalancerV2SwapInfoCache extends pair_swaps_cache_1.SwapInfoCache {
    constructor(chainId, subgraphUrl = constants_2.BALANCER_V2_SUBGRAPH_URL_BY_CHAIN[chainId], _warningLogger = constants_1.DEFAULT_WARNING_LOGGER, cache = {}) {
        super(cache);
        this._warningLogger = _warningLogger;
        const config = {
            network: chainId,
            rpcUrl: '', // Not actually used by SDK for this.
        };
        const balancerSdk = new sdk_1.BalancerSDK(config);
        // The RouteProposer finds paths between a token pair using direct/multihop/linearPool routes
        this._routeProposer = balancerSdk.sor.routeProposer;
        // Uses Subgraph to retrieve up to date pool data required for routeProposer
        this._poolDataService = new sgPoolDataService_1.SubgraphPoolDataService({
            chainId,
            subgraphUrl,
        });
        void this._loadTopPoolsAsync();
        // Reload the top pools every 12 hours
        setInterval(() => __awaiter(this, void 0, void 0, function* () { return void this._loadTopPoolsAsync(); }), ONE_DAY_MS / 2);
    }
    _loadTopPoolsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const fromToSwapInfo = {};
            // Retrieve pool data from Subgraph
            const pools = yield this._poolDataService.getPools();
            // timestamp is used for Element pools
            const timestamp = Math.floor(Date.now() / constants_2.ONE_SECOND_MS);
            const poolsDict = (0, sdk_1.parseToPoolsDict)(pools, timestamp);
            for (const pool of pools) {
                const { tokensList } = pool;
                // tslint:disable-next-line: await-promise
                yield null; // This loop can be CPU heavy so yield to event loop.
                for (const from of tokensList) {
                    for (const to of tokensList.filter(t => t.toLowerCase() !== from.toLowerCase())) {
                        fromToSwapInfo[from] = fromToSwapInfo[from] || {};
                        // If a record for pair already exists skip as all paths alreay found
                        if (fromToSwapInfo[from][to]) {
                            continue;
                        }
                        else {
                            try {
                                const expiresAt = Date.now() + this._cacheTimeMs;
                                // Retrieve swap steps and assets for a token pair
                                // This only needs to be called once per pair as all paths will be created from single call
                                const pairSwapInfo = this._getPoolPairSwapInfo(poolsDict, from, to);
                                fromToSwapInfo[from][to] = pairSwapInfo;
                                this._cacheSwapInfoForPair(from, to, fromToSwapInfo[from][to], expiresAt);
                            }
                            catch (err) {
                                this._warningLogger(err, `Failed to load Balancer V2 top pools`);
                                // soldier on
                            }
                        }
                    }
                }
            }
        });
    }
    /**
     * Will retrieve fresh pair and path data from Subgraph and return and array of swap info for pair..
     * @param takerToken Address of takerToken.
     * @param makerToken Address of makerToken.
     * @returns Swap data for pair consisting of assets and swap steps for ExactIn and ExactOut swap types.
     */
    _fetchSwapInfoForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // retrieve up to date pools from SG
                const pools = yield this._poolDataService.getPools();
                // timestamp is used for Element pools
                const timestamp = Math.floor(Date.now() / constants_2.ONE_SECOND_MS);
                const poolDictionary = (0, sdk_1.parseToPoolsDict)(pools, timestamp);
                return this._getPoolPairSwapInfo(poolDictionary, takerToken, makerToken);
            }
            catch (e) {
                return pair_swaps_cache_1.EMPTY_BALANCER_SWAPS;
            }
        });
    }
    /**
     * Uses pool data from provided dictionary to find top swap paths for token pair.
     * @param pools Dictionary of pool data.
     * @param takerToken Address of taker token.
     * @param makerToken Address of maker token.
     * @returns Swap data for pair consisting of assets and swap steps for ExactIn and ExactOut swap types.
     */
    _getPoolPairSwapInfo(pools, takerToken, makerToken) {
        /*
        Uses Balancer SDK to construct available paths for pair.
        Paths can be direct, i.e. both tokens are in same pool or multihop.
        Will also create paths for the new Balancer Linear pools.
        These are returned in order of available liquidity which is useful for filtering.
        */
        const paths = this._routeProposer.getCandidatePathsFromDict(takerToken, makerToken, sdk_1.SwapTypes.SwapExactIn, pools, BalancerV2SwapInfoCache._MAX_POOLS_PER_PATH);
        if (paths.length === 0) {
            return pair_swaps_cache_1.EMPTY_BALANCER_SWAPS;
        }
        // Convert paths data to swap information suitable for queryBatchSwap. Only use top 2 liquid paths
        return formatSwaps(paths.slice(0, BalancerV2SwapInfoCache._MAX_CANDIDATE_PATHS_PER_PAIR));
    }
}
exports.BalancerV2SwapInfoCache = BalancerV2SwapInfoCache;
BalancerV2SwapInfoCache._MAX_POOLS_PER_PATH = 4;
BalancerV2SwapInfoCache._MAX_CANDIDATE_PATHS_PER_PAIR = 2;
/**
 * Given an array of Balancer paths, returns swap information that can be passed to queryBatchSwap.
 * @param paths Array of Balancer paths.
 * @returns Formatted swap data consisting of assets and swap steps for ExactIn and ExactOut swap types.
 */
function formatSwaps(paths) {
    const formattedSwapsExactIn = [];
    const formattedSwapsExactOut = [];
    let assets;
    paths.forEach(path => {
        // Add a swap amount for each swap so we can use formatSequence. (This will be overwritten with actual amount during query)
        path.swaps.forEach(s => (s.swapAmount = '0'));
        const tokenAddresses = (0, sdk_1.getTokenAddressesForSwap)(path.swaps);
        // Formats for both ExactIn and ExactOut swap types
        const swapsExactIn = (0, sdk_1.formatSequence)(sdk_1.SwapTypes.SwapExactIn, path.swaps, tokenAddresses);
        const swapsExactOut = (0, sdk_1.formatSequence)(sdk_1.SwapTypes.SwapExactOut, path.swaps, tokenAddresses);
        assets = tokenAddresses;
        formattedSwapsExactIn.push({
            assets,
            swapSteps: swapsExactIn.map(s => (Object.assign(Object.assign({}, s), { amount: new utils_1.BigNumber(s.amount) }))),
        });
        formattedSwapsExactOut.push({
            assets,
            swapSteps: swapsExactOut.map(s => (Object.assign(Object.assign({}, s), { amount: new utils_1.BigNumber(s.amount) }))),
        });
    });
    const formattedSwaps = {
        swapInfoExactIn: formattedSwapsExactIn,
        swapInfoExactOut: formattedSwapsExactOut,
    };
    return formattedSwaps;
}
//# sourceMappingURL=balancer_v2_utils_new.js.map