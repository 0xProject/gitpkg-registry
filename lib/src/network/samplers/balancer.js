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
exports.BalancerSampler = exports.CreamPoolsCache = exports.BalancerPoolsCache = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const sor_1 = require("@balancer-labs/sor");
const cream_sor_1 = require("cream-sor");
const graphql_request_1 = require("graphql-request");
const wrappers_1 = require("../../wrappers");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const pools_cache_1 = require("./utils/pools_cache");
const BALANCER_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer';
const BALANCER_TOP_POOLS_FETCHED = 250;
const BALANCER_MAX_POOLS_FETCHED = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
class BalancerPoolsCache extends pools_cache_1.PoolsCache {
    constructor(_subgraphUrl = BALANCER_SUBGRAPH_URL, cache = {}, maxPoolsFetched = BALANCER_MAX_POOLS_FETCHED, _topPoolsFetched = BALANCER_TOP_POOLS_FETCHED) {
        super(cache);
        this._subgraphUrl = _subgraphUrl;
        this.maxPoolsFetched = maxPoolsFetched;
        this._topPoolsFetched = _topPoolsFetched;
        void this._loadTopPoolsAsync();
        // Reload the top pools every 12 hours
        setInterval(() => __awaiter(this, void 0, void 0, function* () { return void this._loadTopPoolsAsync(); }), ONE_DAY_MS / 2);
    }
    _fetchPoolsForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const poolData = (yield sor_1.getPoolsWithTokens(takerToken, makerToken)).pools;
                // Sort by maker token balance (descending)
                const pools = sor_1.parsePoolData(poolData, takerToken, makerToken).sort((a, b) => b.balanceOut.minus(a.balanceOut).toNumber());
                return pools.length > this.maxPoolsFetched ? pools.slice(0, this.maxPoolsFetched) : pools;
            }
            catch (err) {
                return [];
            }
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
                            const poolData = sor_1.parsePoolData([pool], from, to);
                            fromToPools[from][to].push(poolData[0]);
                            // Cache this as we progress through
                            const expiresAt = Date.now() + this._cacheTimeMs;
                            this._cachePoolsForPair(from, to, fromToPools[from][to], expiresAt);
                        }
                        catch (_a) {
                            // soldier on
                        }
                    }
                }
            }
        });
    }
    _fetchTopPoolsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
            query fetchTopPools($topPoolsFetched: Int!) {
                pools(
                    first: $topPoolsFetched
                    where: { publicSwap: true, liquidity_gt: 0 }
                    orderBy: swapsCount
                    orderDirection: desc
                ) {
                    id
                    publicSwap
                    swapFee
                    totalWeight
                    tokensList
                    tokens {
                        id
                        address
                        balance
                        decimals
                        symbol
                        denormWeight
                    }
                }
            }
        `;
            try {
                const { pools } = yield graphql_request_1.request(this._subgraphUrl, query, { topPoolsFetched: this._topPoolsFetched });
                return pools;
            }
            catch (err) {
                return [];
            }
        });
    }
}
exports.BalancerPoolsCache = BalancerPoolsCache;
class CreamPoolsCache extends pools_cache_1.PoolsCache {
    constructor(_cache = {}, maxPoolsFetched = BALANCER_MAX_POOLS_FETCHED) {
        super(_cache);
        this.maxPoolsFetched = maxPoolsFetched;
    }
    _fetchPoolsForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const poolData = (yield cream_sor_1.getPoolsWithTokens(takerToken, makerToken)).pools;
                // Sort by maker token balance (descending)
                const pools = cream_sor_1.parsePoolData(poolData, takerToken, makerToken).sort((a, b) => b.balanceOut.minus(a.balanceOut).toNumber());
                return pools.slice(0, this.maxPoolsFetched);
            }
            catch (err) {
                return [];
            }
        });
    }
}
exports.CreamPoolsCache = CreamPoolsCache;
const GAS_PER_SAMPLE = 450e3;
class BalancerSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, fork, _cache) {
        super({
            chain,
            name: fork,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromBalancer',
            buyContractBuyFunctionName: 'sampleBuysFromBalancer',
        });
        this.fork = fork;
        this._cache = _cache;
    }
    static createAsync(chain, fork) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chain.chainId !== contract_addresses_1.ChainId.Mainnet) {
                throw new Error(`Balancer forks are only available on mainnet`);
            }
            let cache;
            switch (fork) {
                case types_1.ERC20BridgeSource.Balancer:
                    cache = new BalancerPoolsCache();
                    break;
                case types_1.ERC20BridgeSource.Cream:
                    cache = new CreamPoolsCache();
                    break;
                default:
                    throw new Error(`Invalid Balancer fork: ${fork}`);
            }
            return new BalancerSampler(chain, fork, cache);
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
            return pools.map(poolAddress => ({
                args: [poolAddress, takerToken, makerToken, takerFillAmounts],
                getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                    source: this.fork,
                    fillData: { poolAddress },
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
            return pools.map(poolAddress => ({
                args: [poolAddress, takerToken, makerToken, makerFillAmounts],
                getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                    source: this.fork,
                    fillData: { poolAddress },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * makerFillAmounts.length,
            }));
        });
    }
}
exports.BalancerSampler = BalancerSampler;
//# sourceMappingURL=balancer.js.map