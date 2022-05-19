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
exports.BalancerPoolsCache = void 0;
const balancer_labs_sor_v1_1 = require("balancer-labs-sor-v1");
const graphql_request_1 = require("graphql-request");
const constants_1 = require("../constants");
const pools_cache_1 = require("./pools_cache");
// tslint:disable:custom-no-magic-numbers
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
class BalancerPoolsCache extends pools_cache_1.PoolsCache {
    constructor(_subgraphUrl = constants_1.BALANCER_SUBGRAPH_URL, cache = {}, maxPoolsFetched = constants_1.BALANCER_MAX_POOLS_FETCHED, _topPoolsFetched = constants_1.BALANCER_TOP_POOLS_FETCHED) {
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
                const poolData = (yield (0, balancer_labs_sor_v1_1.getPoolsWithTokens)(takerToken, makerToken)).pools;
                // Sort by maker token balance (descending)
                const pools = (0, balancer_labs_sor_v1_1.parsePoolData)(poolData, takerToken, makerToken).sort((a, b) => b.balanceOut.minus(a.balanceOut).toNumber());
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
                            const poolData = (0, balancer_labs_sor_v1_1.parsePoolData)([pool], from, to);
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
            const query = (0, graphql_request_1.gql) `
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
                const { pools } = yield (0, graphql_request_1.request)(this._subgraphUrl, query, { topPoolsFetched: this._topPoolsFetched });
                return pools;
            }
            catch (err) {
                return [];
            }
        });
    }
}
exports.BalancerPoolsCache = BalancerPoolsCache;
//# sourceMappingURL=balancer_utils.js.map