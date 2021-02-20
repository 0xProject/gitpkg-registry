"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sor_1 = require("@balancer-labs/sor");
const constants_1 = require("./constants");
// tslint:disable:custom-no-magic-numbers
const FIVE_SECONDS_MS = 5 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 1000;
class BalancerPoolsCache {
    constructor(_cache = {}, maxPoolsFetched = constants_1.BALANCER_MAX_POOLS_FETCHED, subgraphUrl = constants_1.BALANCER_SUBGRAPH_URL, topPoolsFetched = constants_1.BALANCER_TOP_POOLS_FETCHED) {
        this._cache = _cache;
        this.maxPoolsFetched = maxPoolsFetched;
        this.subgraphUrl = subgraphUrl;
        this.topPoolsFetched = topPoolsFetched;
        void this._loadTopPoolsAsync();
        // Reload the top pools every 12 hours
        setInterval(() => __awaiter(this, void 0, void 0, function* () { return void this._loadTopPoolsAsync(); }), ONE_DAY_MS / 2);
    }
    getPoolsForPairAsync(takerToken, makerToken, timeoutMs = DEFAULT_TIMEOUT_MS) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeout = new Promise(resolve => setTimeout(resolve, timeoutMs, []));
            return Promise.race([this._getPoolsForPairAsync(takerToken, makerToken), timeout]);
        });
    }
    getCachedPoolAddressesForPair(takerToken, makerToken, cacheExpiryMs) {
        const key = JSON.stringify([takerToken, makerToken]);
        const value = this._cache[key];
        if (cacheExpiryMs === undefined) {
            return value === undefined ? [] : value.pools.map(pool => pool.id);
        }
        const minTimestamp = Date.now() - cacheExpiryMs;
        if (value === undefined || value.timestamp < minTimestamp) {
            return undefined;
        }
        else {
            return value.pools.map(pool => pool.id);
        }
    }
    howToSampleBalancer(takerToken, makerToken, isAllowedSource) {
        // If Balancer is excluded as a source, do not sample.
        if (!isAllowedSource) {
            return { onChain: false, offChain: false };
        }
        const cachedBalancerPools = this.getCachedPoolAddressesForPair(takerToken, makerToken, ONE_DAY_MS);
        // Sample Balancer on-chain (i.e. via the ERC20BridgeSampler contract) if:
        // - Cached values are not stale
        // - There is at least one Balancer pool for this pair
        const onChain = cachedBalancerPools !== undefined && cachedBalancerPools.length > 0;
        // Sample Balancer off-chain (i.e. via GraphQL query + `computeBalancerBuy/SellQuote`)
        // if cached values are stale
        const offChain = cachedBalancerPools === undefined;
        return { onChain, offChain };
    }
    _getPoolsForPairAsync(takerToken, makerToken, cacheExpiryMs = FIVE_SECONDS_MS) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = JSON.stringify([takerToken, makerToken]);
            const value = this._cache[key];
            const minTimestamp = Date.now() - cacheExpiryMs;
            if (value === undefined || value.timestamp < minTimestamp) {
                const pools = yield this._fetchPoolsForPairAsync(takerToken, makerToken);
                this._cachePoolsForPair(takerToken, makerToken, pools);
            }
            return this._cache[key].pools;
        });
    }
    _cachePoolsForPair(takerToken, makerToken, pools) {
        const key = JSON.stringify([takerToken, makerToken]);
        this._cache[key] = {
            pools,
            timestamp: Date.now(),
        };
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
            pools.forEach(pool => {
                const { tokensList } = pool;
                for (const from of tokensList) {
                    for (const to of tokensList.filter(t => t.toLowerCase() !== from.toLowerCase())) {
                        if (!fromToPools[from]) {
                            fromToPools[from] = {};
                        }
                        if (!fromToPools[from][to]) {
                            fromToPools[from][to] = [];
                        }
                        try {
                            // The list of pools must be relevant to `from` and `to`  for `parsePoolData`
                            const poolData = sor_1.parsePoolData([pool], from, to);
                            fromToPools[from][to].push(poolData[0]);
                            // Cache this as we progress through
                            this._cachePoolsForPair(from, to, fromToPools[from][to]);
                        }
                        catch (_a) {
                            // soldier on
                        }
                    }
                }
            });
        });
    }
    _fetchTopPoolsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query {
          pools (first: ${this.topPoolsFetched}, where: {publicSwap: true, liquidity_gt: 0}, orderBy: swapsCount, orderDirection: desc) {
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
                const response = yield fetch(this.subgraphUrl, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                    }),
                });
                const { data } = yield response.json();
                return data.pools;
            }
            catch (err) {
                return [];
            }
        });
    }
}
exports.BalancerPoolsCache = BalancerPoolsCache;
//# sourceMappingURL=balancer_utils.js.map