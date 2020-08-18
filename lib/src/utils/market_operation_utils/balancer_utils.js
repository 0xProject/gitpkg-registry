"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var sor_1 = require("@balancer-labs/sor");
var decimal_js_1 = require("decimal.js");
// tslint:disable:custom-no-magic-numbers
var FIVE_SECONDS_MS = 5 * 1000;
var DEFAULT_TIMEOUT_MS = 1000;
var MAX_POOLS_FETCHED = 2;
var Decimal20 = decimal_js_1.Decimal.clone({ precision: 20 });
// tslint:enable:custom-no-magic-numbers
var BalancerPoolsCache = /** @class */ (function () {
    function BalancerPoolsCache(_cache, cacheExpiryMs, maxPoolsFetched) {
        if (_cache === void 0) { _cache = {}; }
        if (cacheExpiryMs === void 0) { cacheExpiryMs = FIVE_SECONDS_MS; }
        if (maxPoolsFetched === void 0) { maxPoolsFetched = MAX_POOLS_FETCHED; }
        this._cache = _cache;
        this.cacheExpiryMs = cacheExpiryMs;
        this.maxPoolsFetched = maxPoolsFetched;
    }
    BalancerPoolsCache.prototype.getPoolsForPairAsync = function (takerToken, makerToken, timeoutMs) {
        if (timeoutMs === void 0) { timeoutMs = DEFAULT_TIMEOUT_MS; }
        return __awaiter(this, void 0, void 0, function () {
            var timeout;
            return __generator(this, function (_a) {
                timeout = new Promise(function (resolve) { return setTimeout(resolve, timeoutMs, []); });
                return [2 /*return*/, Promise.race([this._getPoolsForPairAsync(takerToken, makerToken), timeout])];
            });
        });
    };
    BalancerPoolsCache.prototype._getPoolsForPairAsync = function (takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function () {
            var key, value, minTimestamp, pools, timestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = JSON.stringify([takerToken, makerToken]);
                        value = this._cache[key];
                        minTimestamp = Date.now() - this.cacheExpiryMs;
                        if (!(value === undefined || value.timestamp < minTimestamp)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._fetchPoolsForPairAsync(takerToken, makerToken)];
                    case 1:
                        pools = _a.sent();
                        timestamp = Date.now();
                        this._cache[key] = {
                            pools: pools,
                            timestamp: timestamp,
                        };
                        _a.label = 2;
                    case 2: return [2 /*return*/, this._cache[key].pools];
                }
            });
        });
    };
    // tslint:disable-next-line:prefer-function-over-method
    BalancerPoolsCache.prototype._fetchPoolsForPairAsync = function (takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function () {
            var poolData, pools, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, sor_1.getPoolsWithTokens(takerToken, makerToken)];
                    case 1:
                        poolData = (_a.sent()).pools;
                        pools = sor_1.parsePoolData(poolData, takerToken, makerToken).sort(function (a, b) {
                            return b.balanceOut.minus(a.balanceOut).toNumber();
                        });
                        return [2 /*return*/, pools.length > this.maxPoolsFetched ? pools.slice(0, this.maxPoolsFetched) : pools];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return BalancerPoolsCache;
}());
exports.BalancerPoolsCache = BalancerPoolsCache;
// tslint:disable completed-docs
function computeBalancerSellQuote(pool, takerFillAmount) {
    var weightRatio = pool.weightIn.dividedBy(pool.weightOut);
    var adjustedIn = sor_1.bmath.BONE.minus(pool.swapFee)
        .dividedBy(sor_1.bmath.BONE)
        .times(takerFillAmount);
    var y = pool.balanceIn.dividedBy(pool.balanceIn.plus(adjustedIn));
    var foo = Math.pow(y.toNumber(), weightRatio.toNumber());
    var bar = new utils_1.BigNumber(1).minus(foo);
    var tokenAmountOut = pool.balanceOut.times(bar);
    return tokenAmountOut.integerValue();
}
exports.computeBalancerSellQuote = computeBalancerSellQuote;
function computeBalancerBuyQuote(pool, makerFillAmount) {
    if (makerFillAmount.isGreaterThanOrEqualTo(pool.balanceOut)) {
        return new utils_1.BigNumber(0);
    }
    var weightRatio = pool.weightOut.dividedBy(pool.weightIn);
    var diff = pool.balanceOut.minus(makerFillAmount);
    var y = pool.balanceOut.dividedBy(diff);
    var foo = Math.pow(y.toNumber(), weightRatio.toNumber()) - 1;
    if (!Number.isFinite(foo)) {
        foo = new Decimal20(y.toString()).pow(weightRatio.toString()).minus(1);
    }
    var tokenAmountIn = sor_1.bmath.BONE.minus(pool.swapFee).dividedBy(sor_1.bmath.BONE);
    tokenAmountIn = pool.balanceIn.times(foo.toString()).dividedBy(tokenAmountIn);
    return tokenAmountIn.integerValue();
}
exports.computeBalancerBuyQuote = computeBalancerBuyQuote;
//# sourceMappingURL=balancer_utils.js.map