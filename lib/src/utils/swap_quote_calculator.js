"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var order_utils_1 = require("@0x/order-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var types_2 = require("../types");
var orders_1 = require("./market_operation_utils/orders");
var utils_2 = require("./utils");
var quote_simulation_1 = require("./quote_simulation");
// TODO(dave4506) How do we want to reintroduce InsufficientAssetLiquidityError?
var SwapQuoteCalculator = /** @class */ (function () {
    function SwapQuoteCalculator(marketOperationUtils) {
        this._marketOperationUtils = marketOperationUtils;
    }
    SwapQuoteCalculator.prototype.calculateMarketSellSwapQuoteAsync = function (prunedOrders, takerAssetFillAmount, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._calculateSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, types_2.MarketOperation.Sell, opts)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    SwapQuoteCalculator.prototype.calculateMarketBuySwapQuoteAsync = function (prunedOrders, takerAssetFillAmount, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._calculateSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, types_2.MarketOperation.Buy, opts)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    SwapQuoteCalculator.prototype.calculateBatchMarketBuySwapQuoteAsync = function (batchPrunedOrders, takerAssetFillAmounts, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._calculateBatchBuySwapQuoteAsync(batchPrunedOrders, takerAssetFillAmounts, gasPrice, types_2.MarketOperation.Buy, opts)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    SwapQuoteCalculator.prototype._calculateBatchBuySwapQuoteAsync = function (batchPrunedOrders, assetFillAmounts, gasPrice, operation, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var batchSignedOrders, batchSwapQuotes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._marketOperationUtils.getBatchMarketBuyOrdersAsync(batchPrunedOrders, assetFillAmounts, opts)];
                    case 1:
                        batchSignedOrders = _a.sent();
                        return [4 /*yield*/, Promise.all(batchSignedOrders.map(function (orders, i) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, makerAssetData, takerAssetData;
                                return __generator(this, function (_b) {
                                    if (orders) {
                                        _a = batchPrunedOrders[i][0], makerAssetData = _a.makerAssetData, takerAssetData = _a.takerAssetData;
                                        return [2 /*return*/, createSwapQuote(makerAssetData, takerAssetData, orders, operation, assetFillAmounts[i], gasPrice, opts.gasSchedule)];
                                    }
                                    else {
                                        return [2 /*return*/, undefined];
                                    }
                                    return [2 /*return*/];
                                });
                            }); }))];
                    case 2:
                        batchSwapQuotes = _a.sent();
                        return [2 /*return*/, batchSwapQuotes];
                }
            });
        });
    };
    SwapQuoteCalculator.prototype._calculateSwapQuoteAsync = function (prunedOrders, assetFillAmount, gasPrice, operation, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var resultOrders, _opts, firstOrderMakerAssetData, _a, makerAssetData, takerAssetData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // checks if maker asset is ERC721 or ERC20 and taker asset is ERC20
                        if (!utils_2.isSupportedAssetDataInOrders(prunedOrders)) {
                            throw Error(types_2.SwapQuoterError.AssetDataUnsupported);
                        }
                        resultOrders = [];
                        _opts = __assign({}, opts, { feeSchedule: _.mapValues(opts.feeSchedule, function (gasCost) { return function (fillData) {
                                return gasCost === undefined ? 0 : gasPrice.times(gasCost(fillData));
                            }; }) });
                        firstOrderMakerAssetData = !!prunedOrders[0]
                            ? order_utils_1.assetDataUtils.decodeAssetDataOrThrow(prunedOrders[0].makerAssetData)
                            : { assetProxyId: '' };
                        if (!(firstOrderMakerAssetData.assetProxyId === types_1.AssetProxyId.ERC721)) return [3 /*break*/, 1];
                        // HACK: to conform ERC721 orders to the output of market operation utils, assumes complete fillable
                        resultOrders = prunedOrders.map(function (o) { return orders_1.convertNativeOrderToFullyFillableOptimizedOrders(o); });
                        return [3 /*break*/, 5];
                    case 1:
                        if (!(operation === types_2.MarketOperation.Buy)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._marketOperationUtils.getMarketBuyOrdersAsync(prunedOrders, assetFillAmount, _opts)];
                    case 2:
                        resultOrders = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this._marketOperationUtils.getMarketSellOrdersAsync(prunedOrders, assetFillAmount, _opts)];
                    case 4:
                        resultOrders = _b.sent();
                        _b.label = 5;
                    case 5:
                        _a = prunedOrders[0], makerAssetData = _a.makerAssetData, takerAssetData = _a.takerAssetData;
                        return [2 /*return*/, createSwapQuote(makerAssetData, takerAssetData, resultOrders, operation, assetFillAmount, gasPrice, opts.gasSchedule)];
                }
            });
        });
    };
    return SwapQuoteCalculator;
}());
exports.SwapQuoteCalculator = SwapQuoteCalculator;
function createSwapQuote(makerAssetData, takerAssetData, resultOrders, operation, assetFillAmount, gasPrice, gasSchedule) {
    var bestCaseFillResult = quote_simulation_1.simulateBestCaseFill({
        gasPrice: gasPrice,
        orders: resultOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { gasSchedule: gasSchedule },
    });
    var worstCaseFillResult = quote_simulation_1.simulateWorstCaseFill({
        gasPrice: gasPrice,
        orders: resultOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { gasSchedule: gasSchedule },
    });
    var quoteBase = {
        takerAssetData: takerAssetData,
        makerAssetData: makerAssetData,
        gasPrice: gasPrice,
        bestCaseQuoteInfo: fillResultsToQuoteInfo(bestCaseFillResult),
        worstCaseQuoteInfo: fillResultsToQuoteInfo(worstCaseFillResult),
        sourceBreakdown: getSwapQuoteOrdersBreakdown(bestCaseFillResult.fillAmountBySource),
        orders: resultOrders,
    };
    if (operation === types_2.MarketOperation.Buy) {
        return __assign({}, quoteBase, { type: types_2.MarketOperation.Buy, makerAssetFillAmount: assetFillAmount });
    }
    else {
        return __assign({}, quoteBase, { type: types_2.MarketOperation.Sell, takerAssetFillAmount: assetFillAmount });
    }
}
function getSwapQuoteOrdersBreakdown(fillAmountBySource) {
    var totalFillAmount = utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(Object.values(fillAmountBySource)));
    var breakdown = {};
    Object.entries(fillAmountBySource).forEach(function (_a) {
        var _b = __read(_a, 2), source = _b[0], fillAmount = _b[1];
        breakdown[source] = fillAmount.div(totalFillAmount);
    });
    return breakdown;
}
function fillResultsToQuoteInfo(fr) {
    return {
        makerAssetAmount: fr.totalMakerAssetAmount,
        takerAssetAmount: fr.takerAssetAmount,
        totalTakerAssetAmount: fr.totalTakerAssetAmount,
        feeTakerAssetAmount: fr.takerFeeTakerAssetAmount,
        protocolFeeInWeiAmount: fr.protocolFeeAmount,
        gas: fr.gas,
    };
}
//# sourceMappingURL=swap_quote_calculator.js.map