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
exports.CreamPoolsCache = void 0;
const cream_sor_1 = require("cream-sor");
const constants_1 = require("./constants");
// tslint:disable:custom-no-magic-numbers
const FIVE_SECONDS_MS = 5 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 1000;
// tslint:enable:custom-no-magic-numbers
class CreamPoolsCache {
    constructor(_cache = {}, maxPoolsFetched = constants_1.BALANCER_MAX_POOLS_FETCHED) {
        this._cache = _cache;
        this.maxPoolsFetched = maxPoolsFetched;
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
    howToSampleCream(takerToken, makerToken, isAllowedSource) {
        // If CREAM is excluded as a source, do not sample.
        if (!isAllowedSource) {
            return { onChain: false, offChain: false };
        }
        const cachedCreamPools = this.getCachedPoolAddressesForPair(takerToken, makerToken, ONE_DAY_MS);
        // Sample CREAM on-chain (i.e. via the ERC20BridgeSampler contract) if:
        // - Cached values are not stale
        // - There is at least one CREAM pool for this pair
        const onChain = cachedCreamPools !== undefined && cachedCreamPools.length > 0;
        // Sample CREAM off-chain (i.e. via GraphQL query + `computeCreamBuy/SellQuote`)
        // if cached values are stale
        const offChain = cachedCreamPools === undefined;
        return { onChain, offChain };
    }
    _getPoolsForPairAsync(takerToken, makerToken, cacheExpiryMs = FIVE_SECONDS_MS) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = JSON.stringify([takerToken, makerToken]);
            const value = this._cache[key];
            const minTimestamp = Date.now() - cacheExpiryMs;
            if (value === undefined || value.timestamp < minTimestamp) {
                const pools = yield this._fetchPoolsForPairAsync(takerToken, makerToken);
                const timestamp = Date.now();
                this._cache[key] = {
                    pools,
                    timestamp,
                };
            }
            return this._cache[key].pools;
        });
    }
    // tslint:disable-next-line: prefer-function-over-method
    _loadTopPoolsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // Do nothing
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    _fetchPoolsForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const poolData = (yield cream_sor_1.getPoolsWithTokens(takerToken, makerToken)).pools;
                // Sort by maker token balance (descending)
                const pools = cream_sor_1.parsePoolData(poolData, takerToken, makerToken).sort((a, b) => b.balanceOut.minus(a.balanceOut).toNumber());
                return pools.length > this.maxPoolsFetched ? pools.slice(0, this.maxPoolsFetched) : pools;
            }
            catch (err) {
                return [];
            }
        });
    }
}
exports.CreamPoolsCache = CreamPoolsCache;
//# sourceMappingURL=cream_utils.js.map