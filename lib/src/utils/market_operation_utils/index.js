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
var types_1 = require("../../types");
var utils_2 = require("../utils");
var constants_1 = require("./constants");
var fills_1 = require("./fills");
var orders_1 = require("./orders");
var path_optimizer_1 = require("./path_optimizer");
var sampler_1 = require("./sampler");
var types_2 = require("./types");
function getRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, marketOperation, assetFillAmount, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (opts.rfqt && opts.rfqt.quoteRequestor) {
                return [2 /*return*/, opts.rfqt.quoteRequestor.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, opts.rfqt)];
            }
            else {
                return [2 /*return*/, Promise.resolve([])];
            }
            return [2 /*return*/];
        });
    });
}
var MarketOperationUtils = /** @class */ (function () {
    function MarketOperationUtils(_sampler, contractAddresses, _orderDomain, _liquidityProviderRegistry) {
        if (_liquidityProviderRegistry === void 0) { _liquidityProviderRegistry = utils_1.NULL_ADDRESS; }
        this._sampler = _sampler;
        this.contractAddresses = contractAddresses;
        this._orderDomain = _orderDomain;
        this._liquidityProviderRegistry = _liquidityProviderRegistry;
        this._wethAddress = contractAddresses.etherToken.toLowerCase();
    }
    /**
     * gets the orders required for a market sell operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return orders.
     */
    MarketOperationUtils.prototype.getMarketSellOrdersAsync = function (nativeOrders, takerAmount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, _a, makerToken, takerToken, samplerPromise, rfqtPromise, _b, _c, orderFillableAmounts, liquidityProviderAddress, ethToMakerAssetRate, dexQuotes, rfqtIndicativeQuotes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (nativeOrders.length === 0) {
                            throw new Error(types_2.AggregationError.EmptyOrders);
                        }
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        _a = __read(orders_1.getNativeOrderTokens(nativeOrders[0]), 2), makerToken = _a[0], takerToken = _a[1];
                        samplerPromise = this._sampler.executeAsync(
                        // Get native order fillable amounts.
                        sampler_1.DexOrderSampler.ops.getOrderFillableTakerAmounts(nativeOrders), 
                        // Get the custom liquidity provider from registry.
                        sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(this._liquidityProviderRegistry, makerToken, takerToken), 
                        // Get ETH -> maker token price.
                        sampler_1.DexOrderSampler.ops.getMedianSellRate(utils_2.difference(constants_1.FEE_QUOTE_SOURCES, _opts.excludedSources).concat(this._liquidityProviderSourceIfAvailable(_opts.excludedSources)), makerToken, this._wethAddress, constants_1.ONE_ETHER, this._liquidityProviderRegistry), 
                        // Get sell quotes for taker -> maker.
                        sampler_1.DexOrderSampler.ops.getSellQuotes(utils_2.difference(constants_1.SELL_SOURCES, _opts.excludedSources).concat(this._liquidityProviderSourceIfAvailable(_opts.excludedSources)), makerToken, takerToken, sampler_1.getSampleAmounts(takerAmount, _opts.numSamples, _opts.sampleDistributionBase), this._liquidityProviderRegistry));
                        rfqtPromise = getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Sell, takerAmount, _opts);
                        return [4 /*yield*/, Promise.all([samplerPromise, rfqtPromise])];
                    case 1:
                        _b = __read.apply(void 0, [_d.sent(), 2]), _c = __read(_b[0], 4), orderFillableAmounts = _c[0], liquidityProviderAddress = _c[1], ethToMakerAssetRate = _c[2], dexQuotes = _c[3], rfqtIndicativeQuotes = _b[1];
                        utils_1.logUtils.log(__filename + ": getMarketSellOrdersAsync(): got indicative quotes: " + JSON.stringify(rfqtIndicativeQuotes, null, '\t'));
                        utils_1.logUtils.log(__filename + ": getMarketBuyOrdersAsync() got fillable amounts " + JSON.stringify(orderFillableAmounts, null, '\t'));
                        return [2 /*return*/, this._generateOptimizedOrders({
                                orderFillableAmounts: orderFillableAmounts,
                                nativeOrders: nativeOrders,
                                dexQuotes: dexQuotes,
                                rfqtIndicativeQuotes: rfqtIndicativeQuotes,
                                liquidityProviderAddress: liquidityProviderAddress,
                                inputToken: takerToken,
                                outputToken: makerToken,
                                side: types_1.MarketOperation.Sell,
                                inputAmount: takerAmount,
                                ethToOutputRate: ethToMakerAssetRate,
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
     * @return orders.
     */
    MarketOperationUtils.prototype.getMarketBuyOrdersAsync = function (nativeOrders, makerAmount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, _a, makerToken, takerToken, samplerPromise, rfqtPromise, _b, _c, orderFillableAmounts, liquidityProviderAddress, ethToTakerAssetRate, dexQuotes, rfqtIndicativeQuotes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (nativeOrders.length === 0) {
                            throw new Error(types_2.AggregationError.EmptyOrders);
                        }
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        _a = __read(orders_1.getNativeOrderTokens(nativeOrders[0]), 2), makerToken = _a[0], takerToken = _a[1];
                        samplerPromise = this._sampler.executeAsync(
                        // Get native order fillable amounts.
                        sampler_1.DexOrderSampler.ops.getOrderFillableMakerAmounts(nativeOrders), 
                        // Get the custom liquidity provider from registry.
                        sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(this._liquidityProviderRegistry, makerToken, takerToken), 
                        // Get ETH -> taker token price.
                        sampler_1.DexOrderSampler.ops.getMedianSellRate(utils_2.difference(constants_1.FEE_QUOTE_SOURCES, _opts.excludedSources).concat(this._liquidityProviderSourceIfAvailable(_opts.excludedSources)), takerToken, this._wethAddress, constants_1.ONE_ETHER, this._liquidityProviderRegistry), 
                        // Get buy quotes for taker -> maker.
                        sampler_1.DexOrderSampler.ops.getBuyQuotes(utils_2.difference(constants_1.BUY_SOURCES, _opts.excludedSources).concat(this._liquidityProviderSourceIfAvailable(_opts.excludedSources)), makerToken, takerToken, sampler_1.getSampleAmounts(makerAmount, _opts.numSamples, _opts.sampleDistributionBase), this._liquidityProviderRegistry));
                        rfqtPromise = getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Buy, makerAmount, _opts);
                        return [4 /*yield*/, Promise.all([samplerPromise, rfqtPromise])];
                    case 1:
                        _b = __read.apply(void 0, [_d.sent(), 2]), _c = __read(_b[0], 4), orderFillableAmounts = _c[0], liquidityProviderAddress = _c[1], ethToTakerAssetRate = _c[2], dexQuotes = _c[3], rfqtIndicativeQuotes = _b[1];
                        return [2 /*return*/, this._generateOptimizedOrders({
                                orderFillableAmounts: orderFillableAmounts,
                                nativeOrders: nativeOrders,
                                dexQuotes: dexQuotes,
                                rfqtIndicativeQuotes: rfqtIndicativeQuotes,
                                liquidityProviderAddress: liquidityProviderAddress,
                                inputToken: makerToken,
                                outputToken: takerToken,
                                side: types_1.MarketOperation.Buy,
                                inputAmount: makerAmount,
                                ethToOutputRate: ethToTakerAssetRate,
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
            var _opts, sources, ops, executeResults, batchOrderFillableAmounts, batchEthToTakerAssetRate, batchDexQuotes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (batchNativeOrders.length === 0) {
                            throw new Error(types_2.AggregationError.EmptyOrders);
                        }
                        _opts = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
                        sources = utils_2.difference(constants_1.BUY_SOURCES, _opts.excludedSources);
                        ops = __spread(batchNativeOrders.map(function (orders) { return sampler_1.DexOrderSampler.ops.getOrderFillableMakerAmounts(orders); }), batchNativeOrders.map(function (orders) {
                            return sampler_1.DexOrderSampler.ops.getMedianSellRate(utils_2.difference(constants_1.FEE_QUOTE_SOURCES, _opts.excludedSources), orders_1.getNativeOrderTokens(orders[0])[1], _this._wethAddress, constants_1.ONE_ETHER);
                        }), batchNativeOrders.map(function (orders, i) {
                            return sampler_1.DexOrderSampler.ops.getBuyQuotes(sources, orders_1.getNativeOrderTokens(orders[0])[0], orders_1.getNativeOrderTokens(orders[0])[1], [makerAmounts[i]]);
                        }));
                        return [4 /*yield*/, this._sampler.executeBatchAsync(ops)];
                    case 1:
                        executeResults = _a.sent();
                        batchOrderFillableAmounts = executeResults.splice(0, batchNativeOrders.length);
                        batchEthToTakerAssetRate = executeResults.splice(0, batchNativeOrders.length);
                        batchDexQuotes = executeResults.splice(0, batchNativeOrders.length);
                        return [2 /*return*/, batchNativeOrders.map(function (nativeOrders, i) {
                                if (nativeOrders.length === 0) {
                                    throw new Error(types_2.AggregationError.EmptyOrders);
                                }
                                var _a = __read(orders_1.getNativeOrderTokens(nativeOrders[0]), 2), makerToken = _a[0], takerToken = _a[1];
                                var orderFillableAmounts = batchOrderFillableAmounts[i];
                                var ethToTakerAssetRate = batchEthToTakerAssetRate[i];
                                var dexQuotes = batchDexQuotes[i];
                                var makerAmount = makerAmounts[i];
                                try {
                                    return _this._generateOptimizedOrders({
                                        orderFillableAmounts: orderFillableAmounts,
                                        nativeOrders: nativeOrders,
                                        dexQuotes: dexQuotes,
                                        rfqtIndicativeQuotes: [],
                                        inputToken: makerToken,
                                        outputToken: takerToken,
                                        side: types_1.MarketOperation.Buy,
                                        inputAmount: makerAmount,
                                        ethToOutputRate: ethToTakerAssetRate,
                                        bridgeSlippage: _opts.bridgeSlippage,
                                        maxFallbackSlippage: _opts.maxFallbackSlippage,
                                        excludedSources: _opts.excludedSources,
                                        feeSchedule: _opts.feeSchedule,
                                        allowFallback: _opts.allowFallback,
                                        shouldBatchBridgeOrders: _opts.shouldBatchBridgeOrders,
                                    });
                                }
                                catch (e) {
                                    // It's possible for one of the pairs to have no path
                                    // rather than throw NO_OPTIMAL_PATH we return undefined
                                    return undefined;
                                }
                            })];
                }
            });
        });
    };
    MarketOperationUtils.prototype._generateOptimizedOrders = function (opts) {
        var inputToken = opts.inputToken, outputToken = opts.outputToken, side = opts.side, inputAmount = opts.inputAmount;
        var maxFallbackSlippage = opts.maxFallbackSlippage || 0;
        // Convert native orders and dex quotes into fill paths.
        var paths = fills_1.createFillPaths({
            side: side,
            // Augment native orders with their fillable amounts.
            orders: __spread(orders_1.createSignedOrdersWithFillableAmounts(side, opts.nativeOrders, opts.orderFillableAmounts), orders_1.createSignedOrdersFromRfqtIndicativeQuotes(opts.rfqtIndicativeQuotes)),
            dexQuotes: opts.dexQuotes,
            targetInput: inputAmount,
            ethToOutputRate: opts.ethToOutputRate,
            excludedSources: opts.excludedSources,
            feeSchedule: opts.feeSchedule,
        });
        // Find the optimal path.
        var optimalPath = path_optimizer_1.findOptimalPath(side, paths, inputAmount, opts.runLimit) || [];
        // TODO(dorothy-zbornak): Ensure the slippage on the optimal path is <= maxFallbackSlippage
        // once we decide on a good baseline.
        if (optimalPath.length === 0) {
            throw new Error(types_2.AggregationError.NoOptimalPath);
        }
        // Generate a fallback path if native orders are in the optimal paath.
        var fallbackPath = [];
        var nativeSubPath = optimalPath.filter(function (f) { return f.source === types_2.ERC20BridgeSource.Native; });
        if (opts.allowFallback && nativeSubPath.length !== 0) {
            // The fallback path is, at most, as large as the native path.
            var fallbackInputAmount = utils_1.BigNumber.min(inputAmount, fills_1.getPathSize(nativeSubPath, inputAmount)[0]);
            fallbackPath =
                path_optimizer_1.findOptimalPath(side, fills_1.getFallbackSourcePaths(optimalPath, paths), fallbackInputAmount, opts.runLimit) ||
                    [];
            var fallbackSlippage = fills_1.getPathAdjustedSlippage(side, fallbackPath, fallbackInputAmount, fills_1.getPathAdjustedRate(side, optimalPath, inputAmount));
            if (fallbackSlippage > maxFallbackSlippage) {
                fallbackPath = [];
            }
        }
        return orders_1.createOrdersFromPath(__spread(optimalPath, fallbackPath), {
            side: side,
            inputToken: inputToken,
            outputToken: outputToken,
            orderDomain: this._orderDomain,
            contractAddresses: this.contractAddresses,
            bridgeSlippage: opts.bridgeSlippage || 0,
            liquidityProviderAddress: opts.liquidityProviderAddress,
            shouldBatchBridgeOrders: !!opts.shouldBatchBridgeOrders,
        });
    };
    MarketOperationUtils.prototype._liquidityProviderSourceIfAvailable = function (excludedSources) {
        return this._liquidityProviderRegistry !== utils_1.NULL_ADDRESS &&
            !excludedSources.includes(types_2.ERC20BridgeSource.LiquidityProvider)
            ? [types_2.ERC20BridgeSource.LiquidityProvider]
            : [];
    };
    return MarketOperationUtils;
}());
exports.MarketOperationUtils = MarketOperationUtils;
// tslint:disable: max-file-line-count
//# sourceMappingURL=index.js.map