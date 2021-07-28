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
exports.PoolsCache = exports.ONE_HOUR_IN_SECONDS = exports.ONE_SECOND_MS = void 0;
exports.ONE_SECOND_MS = 1000;
exports.ONE_HOUR_IN_SECONDS = 60 * 60;
// Cache results for 30mins
const DEFAULT_CACHE_TIME_MS = (exports.ONE_HOUR_IN_SECONDS / 2) * exports.ONE_SECOND_MS;
const DEFAULT_TIMEOUT_MS = exports.ONE_SECOND_MS;
class PoolsCache {
    constructor(_cache, _cacheTimeMs = DEFAULT_CACHE_TIME_MS) {
        this._cache = _cache;
        this._cacheTimeMs = _cacheTimeMs;
        this._refreshPromises = {};
    }
    static _isExpired(value) {
        return Date.now() >= value.expiresAt;
    }
    getFreshPoolsForPairAsync(takerToken, makerToken, timeoutMs = DEFAULT_TIMEOUT_MS) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only allow one outstanding refresh per pair at a time.
            const pairId = [takerToken, makerToken].sort().join('/');
            if (this._refreshPromises[pairId]) {
                return this._refreshPromises[pairId];
            }
            return (this._refreshPromises[pairId] = (() => __awaiter(this, void 0, void 0, function* () {
                const timeout = new Promise(resolve => setTimeout(resolve, timeoutMs, []));
                const r = yield Promise.race([this._getAndSaveFreshPoolsForPairAsync(takerToken, makerToken), timeout]);
                delete this._refreshPromises[pairId];
                return r;
            }))());
        });
    }
    getCachedPoolAddressesForPair(takerToken, makerToken, ignoreExpired = true) {
        const key = JSON.stringify([takerToken, makerToken]);
        const value = this._cache[key];
        if (ignoreExpired) {
            return value === undefined ? [] : value.pools.map(pool => pool.id);
        }
        if (!value) {
            return undefined;
        }
        if (PoolsCache._isExpired(value)) {
            // Auto-refresh the pools if expired.
            // tslint:disable-next-line: no-console
            this.getFreshPoolsForPairAsync(takerToken, makerToken).catch(err => console.error(err));
            return undefined;
        }
        return (value || []).pools.map(pool => pool.id);
    }
    isFresh(takerToken, makerToken) {
        const cached = this.getCachedPoolAddressesForPair(takerToken, makerToken, false);
        return cached !== undefined;
    }
    _getAndSaveFreshPoolsForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = JSON.stringify([takerToken, makerToken]);
            const value = this._cache[key];
            if (value === undefined || value.expiresAt >= Date.now()) {
                const pools = yield this._fetchPoolsForPairAsync(takerToken, makerToken);
                const expiresAt = Date.now() + this._cacheTimeMs;
                this._cachePoolsForPair(takerToken, makerToken, pools, expiresAt);
            }
            return this._cache[key].pools;
        });
    }
    _cachePoolsForPair(takerToken, makerToken, pools, expiresAt) {
        const key = JSON.stringify([takerToken, makerToken]);
        this._cache[key] = {
            pools,
            expiresAt,
        };
    }
}
exports.PoolsCache = PoolsCache;
//# sourceMappingURL=pools_cache.js.map