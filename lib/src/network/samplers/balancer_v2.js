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
exports.BalancerV2Sampler = exports.BalancerV2PoolsCache = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const graphql_request_1 = require("graphql-request");
const constants_1 = require("../../constants");
const wrappers_1 = require("../../wrappers");
const constants_2 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const utils_2 = require("../utils");
const balancer_sor_v2_1 = require("./utils/balancer_sor_v2");
const pools_cache_1 = require("./utils/pools_cache");
const BALANCER_V2_CONFIG_BY_CHAIN = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    },
    [contract_addresses_1.ChainId.Polygon]: {
        vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
    },
}, {
    vault: constants_2.NULL_ADDRESS,
    subgraphUrl: '',
});
const BALANCER_TOP_POOLS_FETCHED = 250;
const BALANCER_MAX_POOLS_FETCHED = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
class BalancerV2PoolsCache extends pools_cache_1.PoolsCache {
    constructor(subgraphUrl, maxPoolsFetched = BALANCER_MAX_POOLS_FETCHED, _topPoolsFetched = BALANCER_TOP_POOLS_FETCHED, _warningLogger = constants_1.DEFAULT_WARNING_LOGGER, cache = {}) {
        super(cache);
        this.subgraphUrl = subgraphUrl;
        this.maxPoolsFetched = maxPoolsFetched;
        this._topPoolsFetched = _topPoolsFetched;
        this._warningLogger = _warningLogger;
        void this._loadTopPoolsAsync();
        // Reload the top pools every 12 hours
        setInterval(() => __awaiter(this, void 0, void 0, function* () { return void this._loadTopPoolsAsync(); }), ONE_DAY_MS / 2);
    }
    static _parseSubgraphPoolData(pool, takerToken, makerToken) {
        const tToken = pool.tokens.find((t) => t.address === takerToken);
        const mToken = pool.tokens.find((t) => t.address === makerToken);
        const swap = pool.swaps && pool.swaps[0];
        const tokenAmountOut = swap ? swap.tokenAmountOut : undefined;
        const tokenAmountIn = swap ? swap.tokenAmountIn : undefined;
        const spotPrice = tokenAmountOut && tokenAmountIn ? new utils_1.BigNumber(tokenAmountOut).div(tokenAmountIn) : undefined; // TODO: xianny check
        return {
            id: pool.id,
            balanceIn: new utils_1.BigNumber(tToken.balance),
            balanceOut: new utils_1.BigNumber(mToken.balance),
            weightIn: new utils_1.BigNumber(tToken.weight),
            weightOut: new utils_1.BigNumber(mToken.weight),
            swapFee: new utils_1.BigNumber(pool.swapFee),
            spotPrice,
        };
    }
    // protected async _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]> {
    //     try {
    //         const poolData = (await getPoolsWithTokens(takerToken, makerToken)).pools;
    //         // Sort by maker token balance (descending)
    //         const pools = parsePoolData(poolData, takerToken, makerToken).sort((a, b) =>
    //             b.balanceOut.minus(a.balanceOut).toNumber(),
    //         );
    //         return pools.length > this.maxPoolsFetched ? pools.slice(0, this.maxPoolsFetched) : pools;
    //     } catch (err) {
    //         return [];
    //     }
    // }
    _fetchTopPoolsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
            query fetchTopPools($topPoolsFetched: Int!) {
                pools(
                    first: $topPoolsFetched
                    where: { totalLiquidity_gt: 0 }
                    orderBy: swapsCount
                    orderDirection: desc
                ) {
                    id
                    swapFee
                    totalWeight
                    tokensList
                    amp
                    totalShares
                    tokens {
                        id
                        address
                        balance
                        decimals
                        symbol
                        weight
                    }
                }
            }
        `;
            const { pools } = yield graphql_request_1.request(this.subgraphUrl, query, {
                topPoolsFetched: this._topPoolsFetched,
            });
            return pools;
        });
    }
    _loadTopPoolsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const fromToPools = {};
            const pools = yield this._fetchTopPoolsAsync();
            for (const pool of pools) {
                const { tokensList } = pool;
                for (const from of tokensList) {
                    for (const to of tokensList.filter(t => t.toLowerCase() !== from.toLowerCase())) {
                        fromToPools[from] = fromToPools[from] || {};
                        fromToPools[from][to] = fromToPools[from][to] || [];
                        try {
                            // The list of pools must be relevant to `from` and `to`  for `parsePoolData`
                            const [poolData] = balancer_sor_v2_1.parsePoolData({ [pool.id]: pool }, from, to);
                            fromToPools[from][to].push(BalancerV2PoolsCache._parseSubgraphPoolData(poolData[pool.id], from, to));
                            // Cache this as we progress through
                            const expiresAt = Date.now() + this._cacheTimeMs;
                            this._cachePoolsForPair(from, to, fromToPools[from][to], expiresAt);
                        }
                        catch (err) {
                            this._warningLogger(err, `Failed to load Balancer V2 top pools`);
                            // soldier on
                        }
                    }
                }
            }
        });
    }
    _fetchPoolsForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
        query getPools {
            pools(
              first: ${this.maxPoolsFetched},
              where: {
                tokensList_contains: ["${takerToken}", "${makerToken}"]
              }
            ) {
                id
                tokens {
                    address
                    balance
                    weight
                }
              swapFee
              swaps(
                orderBy: timestamp, orderDirection: desc, first: 1,
                  where:{
                  tokenIn: "${takerToken}",
                  tokenOut: "${makerToken}"
                }
              ) {
                tokenAmountIn
                tokenAmountOut
              }
            }
          }
          `;
            try {
                const { pools } = yield graphql_request_1.request(this.subgraphUrl, query);
                return pools.map((pool) => BalancerV2PoolsCache._parseSubgraphPoolData(pool, takerToken, makerToken));
            }
            catch (e) {
                return [];
            }
        });
    }
}
exports.BalancerV2PoolsCache = BalancerV2PoolsCache;
const GAS_PER_SAMPLE = 500e3;
class BalancerV2Sampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _cache, _vaultAddress) {
        super({
            chain,
            name: types_1.ERC20BridgeSource.BalancerV2,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromBalancerV2',
            buyContractBuyFunctionName: 'sampleBuysFromBalancerV2',
        });
        this._cache = _cache;
        this._vaultAddress = _vaultAddress;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = BALANCER_V2_CONFIG_BY_CHAIN[chain.chainId];
            if (!config.subgraphUrl) {
                throw new Error(`No BalancerV2 subgraph for chain ${chain.chainId}`);
            }
            return new BalancerV2Sampler(chain, new BalancerV2PoolsCache(config.subgraphUrl), config.vault);
        });
    }
    canConvertTokens(tokenAddressPath) {
        if (tokenAddressPath.length !== 2) {
            return false;
        }
        const [takerToken, makerToken] = tokenAddressPath;
        const pools = this._cache.getCachedPoolAddressesForPair(takerToken, makerToken) || [];
        return pools.length > 0;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            const pools = this._cache.getCachedPoolAddressesForPair(takerToken, makerToken) || [];
            return pools.map(poolId => ({
                args: [{ poolId, vault: this._vaultAddress }, takerToken, makerToken, takerFillAmounts],
                getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                    source: types_1.ERC20BridgeSource.BalancerV2,
                    fillData: { poolId, vault: this._vaultAddress },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * takerFillAmounts.length,
            }));
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            const pools = this._cache.getCachedPoolAddressesForPair(takerToken, makerToken) || [];
            return pools.map(poolId => ({
                args: [{ poolId, vault: this._vaultAddress }, takerToken, makerToken, makerFillAmounts],
                getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                    source: types_1.ERC20BridgeSource.BalancerV2,
                    fillData: { poolId, vault: this._vaultAddress },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * makerFillAmounts.length,
            }));
        });
    }
}
exports.BalancerV2Sampler = BalancerV2Sampler;
//# sourceMappingURL=balancer_v2.js.map