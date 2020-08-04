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
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var types_1 = require("../../types");
var utils_2 = require("../utils");
var quote_report_generator_1 = require("./../quote_report_generator");
var constants_1 = require("./constants");
var fills_1 = require("./fills");
var orders_1 = require("./orders");
var path_optimizer_1 = require("./path_optimizer");
var sampler_1 = require("./sampler");
var types_2 = require("./types");
/**
 * Returns a indicative quotes or an empty array if RFQT is not enabled or requested
 * @param makerAssetData the maker asset data
 * @param takerAssetData the taker asset data
 * @param marketOperation Buy or Sell
 * @param assetFillAmount the amount to fill, in base units
 * @param opts market request options
 */
function getRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, marketOperation, assetFillAmount, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var hasExcludedNativeLiquidity;
        return __generator(this, function (_a) {
            hasExcludedNativeLiquidity = opts.excludedSources && opts.excludedSources.includes(types_2.ERC20BridgeSource.Native);
            if (!hasExcludedNativeLiquidity && opts.rfqt && opts.rfqt.isIndicative === true && opts.rfqt.quoteRequestor) {
                return [2 /*return*/, opts.rfqt.quoteRequestor.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, opts.rfqt)];
            }
            else {
                return [2 /*return*/, Promise.resolve([])];
            }
            return [2 /*return*/];
        });
    });
}
exports.getRfqtIndicativeQuotesAsync = getRfqtIndicativeQuotesAsync;
var MarketOperationUtils = /** @class */ (function () {
    function MarketOperationUtils(_sampler, contractAddresses, _orderDomain, _liquidityProviderRegistry) {
        if (_liquidityProviderRegistry === void 0) { _liquidityProviderRegistry = utils_1.NULL_ADDRESS; }
        this._sampler = _sampler;
        this.contractAddresses = contractAddresses;
        this._orderDomain = _orderDomain;
        this._liquidityProviderRegistry = _liquidityProviderRegistry;
        this._wethAddress = contractAddresses.etherToken.toLowerCase();
        this._multiBridge = contractAddresses.multiBridge.toLowerCase();
    }
    /**
     * Gets the liquidity available for a market sell operation
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    MarketOperationUtils.prototype.getMarketSellLiquidityAsync = function (nativeOrders, takerAmount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, _a, makerToken, takerToken, sampleAmounts, samplerPromise, _b, _c, _d, rfqtPromise, balancerPromise, _e, _f, orderFillableAmounts, liquidityProviderAddress, ethToMakerAssetRate, dexQuotes, rfqtIndicativeQuotes, _g, balancerQuotes;
            var _this = this;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (nativeOrders.length === 0) {
                            throw new Error(types_2.AggregationError.EmptyOrders);
                        }
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        _a = __read(orders_1.getNativeOrderTokens(nativeOrders[0]), 2), makerToken = _a[0], takerToken = _a[1];
                        sampleAmounts = sampler_1.getSampleAmounts(takerAmount, _opts.numSamples, _opts.sampleDistributionBase);
                        _c = (_b = this._sampler).executeAsync;
                        _d = [
                            // Get native order fillable amounts.
                            sampler_1.DexOrderSampler.ops.getOrderFillableTakerAmounts(nativeOrders, this.contractAddresses.devUtils),
                            // Get the custom liquidity provider from registry.
                            sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(this._liquidityProviderRegistry, makerToken, takerToken)];
                        // Get ETH -> maker token price.
                        return [4 /*yield*/, sampler_1.DexOrderSampler.ops.getMedianSellRateAsync(utils_2.difference(constants_1.FEE_QUOTE_SOURCES.concat(this._optionalSources()), _opts.excludedSources), makerToken, this._wethAddress, constants_1.ONE_ETHER, this._wethAddress, this._sampler.balancerPoolsCache, this._liquidityProviderRegistry, this._multiBridge, this._sampler.bancorService)];
                    case 1:
                        _d = _d.concat([
                            // Get ETH -> maker token price.
                            _h.sent()]);
                        // Get sell quotes for taker -> maker.
                        return [4 /*yield*/, sampler_1.DexOrderSampler.ops.getSellQuotesAsync(utils_2.difference(constants_1.SELL_SOURCES.concat(this._optionalSources()), _opts.excludedSources.concat(types_2.ERC20BridgeSource.Balancer)), makerToken, takerToken, sampleAmounts, this._wethAddress, this._sampler.balancerPoolsCache, this._liquidityProviderRegistry, this._multiBridge, this._sampler.bancorService)];
                    case 2:
                        samplerPromise = _c.apply(_b, _d.concat([
                            // Get sell quotes for taker -> maker.
                            _h.sent()]));
                        rfqtPromise = getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Sell, takerAmount, _opts);
                        balancerPromise = sampler_1.DexOrderSampler.ops
                            .getSellQuotesAsync(utils_2.difference([types_2.ERC20BridgeSource.Balancer], _opts.excludedSources), makerToken, takerToken, sampleAmounts, this._wethAddress, this._sampler.balancerPoolsCache, this._liquidityProviderRegistry, this._multiBridge, this._sampler.bancorService)
                            .then(function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, this._sampler.executeAsync(r)];
                        }); }); });
                        return [4 /*yield*/, Promise.all([samplerPromise, rfqtPromise, balancerPromise])];
                    case 3:
                        _e = __read.apply(void 0, [_h.sent(), 3]), _f = __read(_e[0], 4), orderFillableAmounts = _f[0], liquidityProviderAddress = _f[1], ethToMakerAssetRate = _f[2], dexQuotes = _f[3], rfqtIndicativeQuotes = _e[1], _g = __read(_e[2], 1), balancerQuotes = _g[0];
                        // Attach the LiquidityProvider address to the sample fillData
                        (dexQuotes.find(function (quotes) { return quotes[0] && quotes[0].source === types_2.ERC20BridgeSource.LiquidityProvider; }) || []).forEach(function (q) { return (q.fillData = { poolAddress: liquidityProviderAddress }); });
                        // Attach the MultiBridge address to the sample fillData
                        (dexQuotes.find(function (quotes) { return quotes[0] && quotes[0].source === types_2.ERC20BridgeSource.MultiBridge; }) || []).forEach(function (q) { return (q.fillData = { poolAddress: _this._multiBridge }); });
                        return [2 /*return*/, {
                                side: types_1.MarketOperation.Sell,
                                inputAmount: takerAmount,
                                inputToken: takerToken,
                                outputToken: makerToken,
                                dexQuotes: dexQuotes.concat(balancerQuotes),
                                nativeOrders: nativeOrders,
                                orderFillableAmounts: orderFillableAmounts,
                                ethToOutputRate: ethToMakerAssetRate,
                                rfqtIndicativeQuotes: rfqtIndicativeQuotes,
                            }];
                }
            });
        });
    };
    /**
     * Gets the liquidity available for a market buy operation
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    MarketOperationUtils.prototype.getMarketBuyLiquidityAsync = function (nativeOrders, makerAmount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, _a, makerToken, takerToken, sampleAmounts, samplerPromise, _b, _c, _d, balancerPromise, _e, _f, rfqtPromise, _g, _h, orderFillableAmounts, liquidityProviderAddress, ethToTakerAssetRate, dexQuotes, rfqtIndicativeQuotes, _j, balancerQuotes;
            var _this = this;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (nativeOrders.length === 0) {
                            throw new Error(types_2.AggregationError.EmptyOrders);
                        }
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        _a = __read(orders_1.getNativeOrderTokens(nativeOrders[0]), 2), makerToken = _a[0], takerToken = _a[1];
                        sampleAmounts = sampler_1.getSampleAmounts(makerAmount, _opts.numSamples, _opts.sampleDistributionBase);
                        _c = (_b = this._sampler).executeAsync;
                        _d = [
                            // Get native order fillable amounts.
                            sampler_1.DexOrderSampler.ops.getOrderFillableMakerAmounts(nativeOrders, this.contractAddresses.devUtils),
                            // Get the custom liquidity provider from registry.
                            sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(this._liquidityProviderRegistry, makerToken, takerToken)];
                        // Get ETH -> taker token price.
                        return [4 /*yield*/, sampler_1.DexOrderSampler.ops.getMedianSellRateAsync(utils_2.difference(constants_1.FEE_QUOTE_SOURCES.concat(this._optionalSources()), _opts.excludedSources), takerToken, this._wethAddress, constants_1.ONE_ETHER, this._wethAddress, this._sampler.balancerPoolsCache, this._liquidityProviderRegistry, this._multiBridge, this._sampler.bancorService)];
                    case 1:
                        _d = _d.concat([
                            // Get ETH -> taker token price.
                            _k.sent()]);
                        // Get buy quotes for taker -> maker.
                        return [4 /*yield*/, sampler_1.DexOrderSampler.ops.getBuyQuotesAsync(utils_2.difference(constants_1.BUY_SOURCES.concat(this._liquidityProviderRegistry !== utils_1.NULL_ADDRESS ? [types_2.ERC20BridgeSource.LiquidityProvider] : []), _opts.excludedSources.concat(types_2.ERC20BridgeSource.Balancer)), makerToken, takerToken, sampleAmounts, this._wethAddress, this._sampler.balancerPoolsCache, this._liquidityProviderRegistry, this._sampler.bancorService)];
                    case 2:
                        samplerPromise = _c.apply(_b, _d.concat([
                            // Get buy quotes for taker -> maker.
                            _k.sent()]));
                        _f = (_e = this._sampler).executeAsync;
                        return [4 /*yield*/, sampler_1.DexOrderSampler.ops.getBuyQuotesAsync(utils_2.difference([types_2.ERC20BridgeSource.Balancer], _opts.excludedSources), makerToken, takerToken, sampleAmounts, this._wethAddress, this._sampler.balancerPoolsCache, this._liquidityProviderRegistry, this._sampler.bancorService)];
                    case 3:
                        balancerPromise = _f.apply(_e, [_k.sent()]);
                        rfqtPromise = getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Buy, makerAmount, _opts);
                        return [4 /*yield*/, Promise.all([samplerPromise, rfqtPromise, balancerPromise])];
                    case 4:
                        _g = __read.apply(void 0, [_k.sent(), 3]), _h = __read(_g[0], 4), orderFillableAmounts = _h[0], liquidityProviderAddress = _h[1], ethToTakerAssetRate = _h[2], dexQuotes = _h[3], rfqtIndicativeQuotes = _g[1], _j = __read(_g[2], 1), balancerQuotes = _j[0];
                        // Attach the LiquidityProvider address to the sample fillData
                        (dexQuotes.find(function (quotes) { return quotes[0] && quotes[0].source === types_2.ERC20BridgeSource.LiquidityProvider; }) || []).forEach(function (q) { return (q.fillData = { poolAddress: liquidityProviderAddress }); });
                        // Attach the MultiBridge address to the sample fillData
                        (dexQuotes.find(function (quotes) { return quotes[0] && quotes[0].source === types_2.ERC20BridgeSource.MultiBridge; }) || []).forEach(function (q) { return (q.fillData = { poolAddress: _this._multiBridge }); });
                        return [2 /*return*/, {
                                side: types_1.MarketOperation.Buy,
                                inputAmount: makerAmount,
                                inputToken: makerToken,
                                outputToken: takerToken,
                                dexQuotes: dexQuotes.concat(balancerQuotes),
                                nativeOrders: nativeOrders,
                                orderFillableAmounts: orderFillableAmounts,
                                ethToOutputRate: ethToTakerAssetRate,
                                rfqtIndicativeQuotes: rfqtIndicativeQuotes,
                            }];
                }
            });
        });
    };
    /**
     * gets the orders required for a market sell operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return object with optimized orders and a QuoteReport
     */
    MarketOperationUtils.prototype.getMarketSellOrdersAsync = function (nativeOrders, takerAmount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, marketSideLiquidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        return [4 /*yield*/, this.getMarketSellLiquidityAsync(nativeOrders, takerAmount, _opts)];
                    case 1:
                        marketSideLiquidity = _a.sent();
                        return [2 /*return*/, this._generateOptimizedOrdersAsync(marketSideLiquidity, {
                                bridgeSlippage: _opts.bridgeSlippage,
                                maxFallbackSlippage: _opts.maxFallbackSlippage,
                                excludedSources: _opts.excludedSources,
                                feeSchedule: _opts.feeSchedule,
                                allowFallback: _opts.allowFallback,
                                shouldBatchBridgeOrders: _opts.shouldBatchBridgeOrders,
                            })];
                }
            });
        });
    };
    /**
     * gets the orders required for a market buy operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return object with optimized orders and a QuoteReport
     */
    MarketOperationUtils.prototype.getMarketBuyOrdersAsync = function (nativeOrders, makerAmount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, marketSideLiquidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        return [4 /*yield*/, this.getMarketBuyLiquidityAsync(nativeOrders, makerAmount, _opts)];
                    case 1:
                        marketSideLiquidity = _a.sent();
                        return [2 /*return*/, this._generateOptimizedOrdersAsync(marketSideLiquidity, {
                                bridgeSlippage: _opts.bridgeSlippage,
                                maxFallbackSlippage: _opts.maxFallbackSlippage,
                                excludedSources: _opts.excludedSources,
                                feeSchedule: _opts.feeSchedule,
                                allowFallback: _opts.allowFallback,
                                shouldBatchBridgeOrders: _opts.shouldBatchBridgeOrders,
                                quoteRequestor: _opts.rfqt ? _opts.rfqt.quoteRequestor : undefined,
                            })];
                }
            });
        });
    };
    /**
     * gets the orders required for a batch of market buy operations by (potentially) merging native orders with
     * generated bridge orders.
     *
     * NOTE: Currently `getBatchMarketBuyOrdersAsync()` does not support external liquidity providers.
     *
     * @param batchNativeOrders Batch of Native orders.
     * @param makerAmounts Array amount of maker asset to buy for each batch.
     * @param opts Options object.
     * @return orders.
     */
    MarketOperationUtils.prototype.getBatchMarketBuyOrdersAsync = function (batchNativeOrders, makerAmounts, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, sources, ops, _a, executeResults, batchOrderFillableAmounts, batchEthToTakerAssetRate, batchDexQuotes;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (batchNativeOrders.length === 0) {
                            throw new Error(types_2.AggregationError.EmptyOrders);
                        }
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        sources = utils_2.difference(constants_1.BUY_SOURCES, _opts.excludedSources);
                        _a = [batchNativeOrders.map(function (orders) {
                                return sampler_1.DexOrderSampler.ops.getOrderFillableMakerAmounts(orders, _this.contractAddresses.devUtils);
                            })];
                        return [4 /*yield*/, Promise.all(batchNativeOrders.map(function (orders) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, sampler_1.DexOrderSampler.ops.getMedianSellRateAsync(utils_2.difference(constants_1.FEE_QUOTE_SOURCES, _opts.excludedSources), orders_1.getNativeOrderTokens(orders[0])[1], this._wethAddress, constants_1.ONE_ETHER, this._wethAddress, this._sampler.balancerPoolsCache)];
                                });
                            }); }))];
                    case 1:
                        _a = _a.concat([(_b.sent())]);
                        return [4 /*yield*/, Promise.all(batchNativeOrders.map(function (orders, i) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, sampler_1.DexOrderSampler.ops.getBuyQuotesAsync(sources, orders_1.getNativeOrderTokens(orders[0])[0], orders_1.getNativeOrderTokens(orders[0])[1], [makerAmounts[i]], this._wethAddress, this._sampler.balancerPoolsCache)];
                                });
                            }); }))];
                    case 2:
                        ops = __spread.apply(void 0, _a.concat([(_b.sent())]));
                        return [4 /*yield*/, this._sampler.executeBatchAsync(ops)];
                    case 3:
                        executeResults = _b.sent();
                        batchOrderFillableAmounts = executeResults.splice(0, batchNativeOrders.length);
                        batchEthToTakerAssetRate = executeResults.splice(0, batchNativeOrders.length);
                        batchDexQuotes = executeResults.splice(0, batchNativeOrders.length);
                        return [2 /*return*/, Promise.all(batchNativeOrders.map(function (nativeOrders, i) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, makerToken, takerToken, orderFillableAmounts, ethToTakerAssetRate, dexQuotes, makerAmount, optimizedOrders, e_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (nativeOrders.length === 0) {
                                                throw new Error(types_2.AggregationError.EmptyOrders);
                                            }
                                            _a = __read(orders_1.getNativeOrderTokens(nativeOrders[0]), 2), makerToken = _a[0], takerToken = _a[1];
                                            orderFillableAmounts = batchOrderFillableAmounts[i];
                                            ethToTakerAssetRate = batchEthToTakerAssetRate[i];
                                            dexQuotes = batchDexQuotes[i];
                                            makerAmount = makerAmounts[i];
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this._generateOptimizedOrdersAsync({
                                                    side: types_1.MarketOperation.Buy,
                                                    nativeOrders: nativeOrders,
                                                    orderFillableAmounts: orderFillableAmounts,
                                                    dexQuotes: dexQuotes,
                                                    inputAmount: makerAmount,
                                                    ethToOutputRate: ethToTakerAssetRate,
                                                    rfqtIndicativeQuotes: [],
                                                    inputToken: makerToken,
                                                    outputToken: takerToken,
                                                }, {
                                                    bridgeSlippage: _opts.bridgeSlippage,
                                                    maxFallbackSlippage: _opts.maxFallbackSlippage,
                                                    excludedSources: _opts.excludedSources,
                                                    feeSchedule: _opts.feeSchedule,
                                                    allowFallback: _opts.allowFallback,
                                                    shouldBatchBridgeOrders: _opts.shouldBatchBridgeOrders,
                                                })];
                                        case 2:
                                            optimizedOrders = (_b.sent()).optimizedOrders;
                                            return [2 /*return*/, optimizedOrders];
                                        case 3:
                                            e_1 = _b.sent();
                                            // It's possible for one of the pairs to have no path
                                            // rather than throw NO_OPTIMAL_PATH we return undefined
                                            return [2 /*return*/, undefined];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                }
            });
        });
    };
    MarketOperationUtils.prototype._generateOptimizedOrdersAsync = function (marketSideLiquidity, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var inputToken, outputToken, side, inputAmount, nativeOrders, orderFillableAmounts, rfqtIndicativeQuotes, dexQuotes, ethToOutputRate, maxFallbackSlippage, paths, optimalPath, nativeSubPath, nonNativePaths, nonNativeOptimalPath, fallbackSlippage, _a, last, penultimateIfExists, lastNativeFillIfExists_1, optimizedOrders, quoteReport;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        inputToken = marketSideLiquidity.inputToken, outputToken = marketSideLiquidity.outputToken, side = marketSideLiquidity.side, inputAmount = marketSideLiquidity.inputAmount, nativeOrders = marketSideLiquidity.nativeOrders, orderFillableAmounts = marketSideLiquidity.orderFillableAmounts, rfqtIndicativeQuotes = marketSideLiquidity.rfqtIndicativeQuotes, dexQuotes = marketSideLiquidity.dexQuotes, ethToOutputRate = marketSideLiquidity.ethToOutputRate;
                        maxFallbackSlippage = opts.maxFallbackSlippage || 0;
                        paths = fills_1.createFillPaths({
                            side: side,
                            // Augment native orders with their fillable amounts.
                            orders: __spread(orders_1.createSignedOrdersWithFillableAmounts(side, nativeOrders, orderFillableAmounts), orders_1.createSignedOrdersFromRfqtIndicativeQuotes(rfqtIndicativeQuotes)),
                            dexQuotes: dexQuotes,
                            targetInput: inputAmount,
                            ethToOutputRate: ethToOutputRate,
                            excludedSources: opts.excludedSources,
                            feeSchedule: opts.feeSchedule,
                        });
                        return [4 /*yield*/, path_optimizer_1.findOptimalPathAsync(side, paths, inputAmount, opts.runLimit)];
                    case 1:
                        optimalPath = (_b.sent()) || [];
                        if (optimalPath.length === 0) {
                            throw new Error(types_2.AggregationError.NoOptimalPath);
                        }
                        nativeSubPath = optimalPath.filter(function (f) { return f.source === types_2.ERC20BridgeSource.Native; });
                        if (!(opts.allowFallback && nativeSubPath.length !== 0)) return [3 /*break*/, 3];
                        nonNativePaths = paths.filter(function (p) { return p.length > 0 && p[0].source !== types_2.ERC20BridgeSource.Native; });
                        return [4 /*yield*/, path_optimizer_1.findOptimalPathAsync(side, nonNativePaths, inputAmount, opts.runLimit)];
                    case 2:
                        nonNativeOptimalPath = (_b.sent()) || [];
                        fallbackSlippage = fills_1.getPathAdjustedSlippage(side, nonNativeOptimalPath, inputAmount, fills_1.getPathAdjustedRate(side, optimalPath, inputAmount));
                        if (nativeSubPath.length === optimalPath.length || fallbackSlippage <= maxFallbackSlippage) {
                            _a = __read(optimalPath.slice().reverse(), 2), last = _a[0], penultimateIfExists = _a[1];
                            lastNativeFillIfExists_1 = last.source === types_2.ERC20BridgeSource.Native &&
                                penultimateIfExists &&
                                penultimateIfExists.source !== types_2.ERC20BridgeSource.Native
                                ? last
                                : undefined;
                            // By prepending native paths to the front they cannot split on-chain sources and incur
                            // an additional protocol fee. I.e [Uniswap,Native,Kyber] becomes [Native,Uniswap,Kyber]
                            // In the previous step we dropped any hanging Native partial fills, as to not fully fill
                            optimalPath = __spread(nativeSubPath.filter(function (f) { return f !== lastNativeFillIfExists_1; }), nonNativeOptimalPath);
                        }
                        _b.label = 3;
                    case 3:
                        optimizedOrders = orders_1.createOrdersFromPath(optimalPath, {
                            side: side,
                            inputToken: inputToken,
                            outputToken: outputToken,
                            orderDomain: this._orderDomain,
                            contractAddresses: this.contractAddresses,
                            bridgeSlippage: opts.bridgeSlippage || 0,
                            shouldBatchBridgeOrders: !!opts.shouldBatchBridgeOrders,
                        });
                        quoteReport = new quote_report_generator_1.QuoteReportGenerator(side, _.flatten(dexQuotes), nativeOrders, orderFillableAmounts, _.flatten(optimizedOrders.map(function (o) { return o.fills; })), opts.quoteRequestor).generateReport();
                        return [2 /*return*/, { optimizedOrders: optimizedOrders, quoteReport: quoteReport }];
                }
            });
        });
    };
    MarketOperationUtils.prototype._optionalSources = function () {
        return (this._liquidityProviderRegistry !== utils_1.NULL_ADDRESS ? [types_2.ERC20BridgeSource.LiquidityProvider] : []).concat(this._multiBridge !== utils_1.NULL_ADDRESS ? [types_2.ERC20BridgeSource.MultiBridge] : []);
    };
    return MarketOperationUtils;
}());
exports.MarketOperationUtils = MarketOperationUtils;
// tslint:disable: max-file-line-count
//# sourceMappingURL=index.js.map