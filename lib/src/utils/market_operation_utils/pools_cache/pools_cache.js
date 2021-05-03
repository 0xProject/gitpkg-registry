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
exports.PoolsCache = void 0;
// tslint:disable:custom-no-magic-numbers
const FIVE_SECONDS_MS = 5 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 1000;
// tslint:enable:custom-no-magic-numbers
class PoolsCache {
    constructor(_cache) {
        this._cache = _cache;
    }
    getFreshPoolsForPairAsync(takerToken, makerToken, timeoutMs = DEFAULT_TIMEOUT_MS) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeout = new Promise(resolve => setTimeout(resolve, timeoutMs, []));
            return Promise.race([this._getAndSaveFreshPoolsForPairAsync(takerToken, makerToken), timeout]);
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
    isFresh(takerToken, makerToken) {
        const cached = this.getCachedPoolAddressesForPair(takerToken, makerToken, ONE_DAY_MS);
        return cached !== undefined && cached.length > 0;
    }
    _getAndSaveFreshPoolsForPairAsync(takerToken, makerToken, cacheExpiryMs = FIVE_SECONDS_MS) {
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
}
exports.PoolsCache = PoolsCache;
//# sourceMappingURL=pools_cache.js.map