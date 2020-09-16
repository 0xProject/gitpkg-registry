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
const utils_1 = require("@0x/utils");
const sor_1 = require("@balancer-labs/sor");
const decimal_js_1 = require("decimal.js");
// tslint:disable:custom-no-magic-numbers
const FIVE_SECONDS_MS = 5 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 1000;
const MAX_POOLS_FETCHED = 3;
const Decimal20 = decimal_js_1.Decimal.clone({ precision: 20 });
// tslint:enable:custom-no-magic-numbers
class BalancerPoolsCache {
    constructor(_cache = {}, maxPoolsFetched = MAX_POOLS_FETCHED) {
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
                const timestamp = Date.now();
                this._cache[key] = {
                    pools,
                    timestamp,
                };
            }
            return this._cache[key].pools;
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
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
}
exports.BalancerPoolsCache = BalancerPoolsCache;
// tslint:disable completed-docs
function computeBalancerSellQuote(pool, takerFillAmount) {
    const weightRatio = pool.weightIn.dividedBy(pool.weightOut);
    const adjustedIn = sor_1.bmath.BONE.minus(pool.swapFee)
        .dividedBy(sor_1.bmath.BONE)
        .times(takerFillAmount);
    const y = pool.balanceIn.dividedBy(pool.balanceIn.plus(adjustedIn));
    const foo = Math.pow(y.toNumber(), weightRatio.toNumber());
    const bar = new utils_1.BigNumber(1).minus(foo);
    const tokenAmountOut = pool.balanceOut.times(bar);
    return tokenAmountOut.integerValue();
}
exports.computeBalancerSellQuote = computeBalancerSellQuote;
function computeBalancerBuyQuote(pool, makerFillAmount) {
    if (makerFillAmount.isGreaterThanOrEqualTo(pool.balanceOut)) {
        return new utils_1.BigNumber(0);
    }
    const weightRatio = pool.weightOut.dividedBy(pool.weightIn);
    const diff = pool.balanceOut.minus(makerFillAmount);
    const y = pool.balanceOut.dividedBy(diff);
    let foo = Math.pow(y.toNumber(), weightRatio.toNumber()) - 1;
    if (!Number.isFinite(foo)) {
        foo = new Decimal20(y.toString()).pow(weightRatio.toString()).minus(1);
    }
    let tokenAmountIn = sor_1.bmath.BONE.minus(pool.swapFee).dividedBy(sor_1.bmath.BONE);
    tokenAmountIn = pool.balanceIn.times(foo.toString()).dividedBy(tokenAmountIn);
    return tokenAmountIn.integerValue();
}
exports.computeBalancerBuyQuote = computeBalancerBuyQuote;
//# sourceMappingURL=balancer_utils.js.map