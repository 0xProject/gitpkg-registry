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
const _ = require("lodash");
const types_1 = require("../../types");
const utils_2 = require("../utils");
const quote_report_generator_1 = require("./../quote_report_generator");
const comparison_price_1 = require("./comparison_price");
const constants_1 = require("./constants");
const fills_1 = require("./fills");
const multihop_utils_1 = require("./multihop_utils");
const orders_1 = require("./orders");
const path_optimizer_1 = require("./path_optimizer");
const sampler_1 = require("./sampler");
const source_filters_1 = require("./source_filters");
const types_2 = require("./types");
// tslint:disable:boolean-naming
/**
 * Returns a indicative quotes or an empty array if RFQT is not enabled or requested
 * @param makerAssetData the maker asset data
 * @param takerAssetData the taker asset data
 * @param marketOperation Buy or Sell
 * @param assetFillAmount the amount to fill, in base units
 * @param opts market request options
 */
function getRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, marketOperation, assetFillAmount, comparisonPrice, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opts.rfqt && opts.rfqt.isIndicative === true && opts.rfqt.quoteRequestor) {
            return opts.rfqt.quoteRequestor.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, comparisonPrice, opts.rfqt);
        }
        else {
            return Promise.resolve([]);
        }
    });
}
exports.getRfqtIndicativeQuotesAsync = getRfqtIndicativeQuotesAsync;
class MarketOperationUtils {
    constructor(_sampler, contractAddresses, _orderDomain) {
        this._sampler = _sampler;
        this.contractAddresses = contractAddresses;
        this._orderDomain = _orderDomain;
        this._feeSources = new source_filters_1.SourceFilters(constants_1.FEE_QUOTE_SOURCES);
        this._wethAddress = contractAddresses.etherToken.toLowerCase();
        this._buySources = constants_1.BUY_SOURCE_FILTER;
        this._sellSources = constants_1.SELL_SOURCE_FILTER;
    }
    static _computeQuoteReport(nativeOrders, quoteRequestor, marketSideLiquidity, optimizerResult, comparisonPrice) {
        const { side, dexQuotes, twoHopQuotes, orderFillableAmounts } = marketSideLiquidity;
        const { liquidityDelivered } = optimizerResult;
        return quote_report_generator_1.generateQuoteReport(side, _.flatten(dexQuotes), twoHopQuotes, nativeOrders, orderFillableAmounts, liquidityDelivered, comparisonPrice, quoteRequestor);
    }
    /**
     * Gets the liquidity available for a market sell operation
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketSellLiquidityAsync(nativeOrders, takerAmount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (nativeOrders.length === 0) {
                throw new Error(types_2.AggregationError.EmptyOrders);
            }
            const _opts = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
            const [makerToken, takerToken] = orders_1.getNativeOrderTokens(nativeOrders[0]);
            const sampleAmounts = sampler_1.getSampleAmounts(takerAmount, _opts.numSamples, _opts.sampleDistributionBase);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._sellSources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            const { onChain: sampleBalancerOnChain, offChain: sampleBalancerOffChain, } = this._sampler.balancerPoolsCache.howToSampleBalancer(takerToken, makerToken, quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Balancer));
            const { onChain: sampleCreamOnChain, offChain: sampleCreamOffChain, } = this._sampler.creamPoolsCache.howToSampleCream(takerToken, makerToken, quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Cream));
            const offChainSources = [
                ...(!sampleCreamOnChain ? [types_2.ERC20BridgeSource.Cream] : []),
                ...(!sampleBalancerOnChain ? [types_2.ERC20BridgeSource.Balancer] : []),
            ];
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeAsync(this._sampler.getTokenDecimals(makerToken, takerToken), 
            // Get native order fillable amounts.
            this._sampler.getOrderFillableTakerAmounts(nativeOrders, this.contractAddresses.exchange), 
            // Get ETH -> maker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._wethAddress, constants_1.ONE_ETHER), 
            // Get ETH -> taker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._wethAddress, constants_1.ONE_ETHER), 
            // Get sell quotes for taker -> maker.
            this._sampler.getSellQuotes(quoteSourceFilters.exclude(offChainSources).sources, makerToken, takerToken, sampleAmounts), this._sampler.getTwoHopSellQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, takerAmount));
            const isPriceAwareRfqEnabled = _opts.rfqt && utils_2.getPriceAwareRFQRolloutFlags(_opts.rfqt.priceAwareRFQFlag).isIndicativePriceAwareEnabled;
            const rfqtPromise = !isPriceAwareRfqEnabled && quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)
                ? getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Sell, takerAmount, undefined, _opts)
                : Promise.resolve([]);
            const offChainBalancerPromise = sampleBalancerOffChain
                ? this._sampler.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, sampleAmounts)
                : Promise.resolve([]);
            const offChainCreamPromise = sampleCreamOffChain
                ? this._sampler.getCreamSellQuotesOffChainAsync(makerToken, takerToken, sampleAmounts)
                : Promise.resolve([]);
            const offChainBancorPromise = quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Bancor)
                ? this._sampler.getBancorSellQuotesOffChainAsync(makerToken, takerToken, [takerAmount])
                : Promise.resolve([]);
            const [[tokenDecimals, orderFillableAmounts, ethToMakerAssetRate, ethToTakerAssetRate, dexQuotes, twoHopQuotes], rfqtIndicativeQuotes, offChainBalancerQuotes, offChainCreamQuotes, offChainBancorQuotes,] = yield Promise.all([
                samplerPromise,
                rfqtPromise,
                offChainBalancerPromise,
                offChainCreamPromise,
                offChainBancorPromise,
            ]);
            const [makerTokenDecimals, takerTokenDecimals] = tokenDecimals;
            return {
                side: types_1.MarketOperation.Sell,
                inputAmount: takerAmount,
                inputToken: takerToken,
                outputToken: makerToken,
                dexQuotes: dexQuotes.concat([...offChainBalancerQuotes, ...offChainCreamQuotes, offChainBancorQuotes]),
                nativeOrders,
                orderFillableAmounts,
                ethToOutputRate: ethToMakerAssetRate,
                ethToInputRate: ethToTakerAssetRate,
                rfqtIndicativeQuotes,
                twoHopQuotes,
                quoteSourceFilters,
                makerTokenDecimals: makerTokenDecimals.toNumber(),
                takerTokenDecimals: takerTokenDecimals.toNumber(),
            };
        });
    }
    /**
     * Gets the liquidity available for a market buy operation
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketBuyLiquidityAsync(nativeOrders, makerAmount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (nativeOrders.length === 0) {
                throw new Error(types_2.AggregationError.EmptyOrders);
            }
            const _opts = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
            const [makerToken, takerToken] = orders_1.getNativeOrderTokens(nativeOrders[0]);
            const sampleAmounts = sampler_1.getSampleAmounts(makerAmount, _opts.numSamples, _opts.sampleDistributionBase);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._buySources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            const { onChain: sampleBalancerOnChain, offChain: sampleBalancerOffChain, } = this._sampler.balancerPoolsCache.howToSampleBalancer(takerToken, makerToken, quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Balancer));
            const { onChain: sampleCreamOnChain, offChain: sampleCreamOffChain, } = this._sampler.creamPoolsCache.howToSampleCream(takerToken, makerToken, quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Cream));
            const offChainSources = [
                ...(!sampleCreamOnChain ? [types_2.ERC20BridgeSource.Cream] : []),
                ...(!sampleBalancerOnChain ? [types_2.ERC20BridgeSource.Balancer] : []),
            ];
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeAsync(this._sampler.getTokenDecimals(makerToken, takerToken), 
            // Get native order fillable amounts.
            this._sampler.getOrderFillableMakerAmounts(nativeOrders, this.contractAddresses.exchange), 
            // Get ETH -> makerToken token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._wethAddress, constants_1.ONE_ETHER), 
            // Get ETH -> taker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._wethAddress, constants_1.ONE_ETHER), 
            // Get buy quotes for taker -> maker.
            this._sampler.getBuyQuotes(quoteSourceFilters.exclude(offChainSources).sources, makerToken, takerToken, sampleAmounts), this._sampler.getTwoHopBuyQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, makerAmount));
            const isPriceAwareRfqEnabled = _opts.rfqt && utils_2.getPriceAwareRFQRolloutFlags(_opts.rfqt.priceAwareRFQFlag).isIndicativePriceAwareEnabled;
            const rfqtPromise = !isPriceAwareRfqEnabled && quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)
                ? getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Buy, makerAmount, undefined, _opts)
                : Promise.resolve([]);
            const offChainBalancerPromise = sampleBalancerOffChain
                ? this._sampler.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, sampleAmounts)
                : Promise.resolve([]);
            const offChainCreamPromise = sampleCreamOffChain
                ? this._sampler.getCreamBuyQuotesOffChainAsync(makerToken, takerToken, sampleAmounts)
                : Promise.resolve([]);
            const [[tokenDecimals, orderFillableAmounts, ethToMakerAssetRate, ethToTakerAssetRate, dexQuotes, twoHopQuotes], rfqtIndicativeQuotes, offChainBalancerQuotes, offChainCreamQuotes,] = yield Promise.all([samplerPromise, rfqtPromise, offChainBalancerPromise, offChainCreamPromise]);
            const [makerTokenDecimals, takerTokenDecimals] = tokenDecimals;
            return {
                side: types_1.MarketOperation.Buy,
                inputAmount: makerAmount,
                inputToken: makerToken,
                outputToken: takerToken,
                dexQuotes: dexQuotes.concat(offChainBalancerQuotes, offChainCreamQuotes),
                nativeOrders,
                orderFillableAmounts,
                ethToOutputRate: ethToTakerAssetRate,
                ethToInputRate: ethToMakerAssetRate,
                rfqtIndicativeQuotes,
                twoHopQuotes,
                quoteSourceFilters,
                makerTokenDecimals: makerTokenDecimals.toNumber(),
                takerTokenDecimals: takerTokenDecimals.toNumber(),
            };
        });
    }
    /**
     * gets the orders required for a market sell operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return object with optimized orders and a QuoteReport
     */
    getMarketSellOrdersAsync(nativeOrders, takerAmount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getMarketSideOrdersAsync(nativeOrders, takerAmount, types_1.MarketOperation.Sell, opts);
        });
    }
    /**
     * gets the orders required for a market buy operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return object with optimized orders and a QuoteReport
     */
    getMarketBuyOrdersAsync(nativeOrders, makerAmount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getMarketSideOrdersAsync(nativeOrders, makerAmount, types_1.MarketOperation.Buy, opts);
        });
    }
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
    getBatchMarketBuyOrdersAsync(batchNativeOrders, makerAmounts, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (batchNativeOrders.length === 0) {
                throw new Error(types_2.AggregationError.EmptyOrders);
            }
            const _opts = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._buySources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            const ops = [
                ...batchNativeOrders.map(orders => this._sampler.getOrderFillableMakerAmounts(orders, this.contractAddresses.exchange)),
                ...batchNativeOrders.map(orders => this._sampler.getMedianSellRate(feeSourceFilters.sources, orders_1.getNativeOrderTokens(orders[0])[1], this._wethAddress, constants_1.ONE_ETHER)),
                ...batchNativeOrders.map((orders, i) => this._sampler.getBuyQuotes(quoteSourceFilters.sources, orders_1.getNativeOrderTokens(orders[0])[0], orders_1.getNativeOrderTokens(orders[0])[1], [makerAmounts[i]])),
                ...batchNativeOrders.map(orders => this._sampler.getTokenDecimals(orders_1.getNativeOrderTokens(orders[0])[0], orders_1.getNativeOrderTokens(orders[0])[1])),
            ];
            const executeResults = yield this._sampler.executeBatchAsync(ops);
            const batchOrderFillableAmounts = executeResults.splice(0, batchNativeOrders.length);
            const batchEthToTakerAssetRate = executeResults.splice(0, batchNativeOrders.length);
            const batchDexQuotes = executeResults.splice(0, batchNativeOrders.length);
            const batchTokenDecimals = executeResults.splice(0, batchNativeOrders.length);
            const ethToInputRate = constants_1.ZERO_AMOUNT;
            return Promise.all(batchNativeOrders.map((nativeOrders, i) => __awaiter(this, void 0, void 0, function* () {
                if (nativeOrders.length === 0) {
                    throw new Error(types_2.AggregationError.EmptyOrders);
                }
                const [makerToken, takerToken] = orders_1.getNativeOrderTokens(nativeOrders[0]);
                const orderFillableAmounts = batchOrderFillableAmounts[i];
                const ethToTakerAssetRate = batchEthToTakerAssetRate[i];
                const dexQuotes = batchDexQuotes[i];
                const makerAmount = makerAmounts[i];
                try {
                    const optimizerResult = yield this._generateOptimizedOrdersAsync({
                        side: types_1.MarketOperation.Buy,
                        nativeOrders,
                        orderFillableAmounts,
                        dexQuotes,
                        inputAmount: makerAmount,
                        ethToOutputRate: ethToTakerAssetRate,
                        ethToInputRate,
                        rfqtIndicativeQuotes: [],
                        inputToken: makerToken,
                        outputToken: takerToken,
                        twoHopQuotes: [],
                        quoteSourceFilters,
                        makerTokenDecimals: batchTokenDecimals[i][0],
                        takerTokenDecimals: batchTokenDecimals[i][1],
                    }, {
                        bridgeSlippage: _opts.bridgeSlippage,
                        maxFallbackSlippage: _opts.maxFallbackSlippage,
                        excludedSources: _opts.excludedSources,
                        feeSchedule: _opts.feeSchedule,
                        allowFallback: _opts.allowFallback,
                    });
                    return optimizerResult;
                }
                catch (e) {
                    // It's possible for one of the pairs to have no path
                    // rather than throw NO_OPTIMAL_PATH we return undefined
                    return undefined;
                }
            })));
        });
    }
    _generateOptimizedOrdersAsync(marketSideLiquidity, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { inputToken, outputToken, side, inputAmount, nativeOrders, orderFillableAmounts, rfqtIndicativeQuotes, dexQuotes, ethToOutputRate, ethToInputRate, } = marketSideLiquidity;
            const maxFallbackSlippage = opts.maxFallbackSlippage || 0;
            const orderOpts = {
                side,
                inputToken,
                outputToken,
                orderDomain: this._orderDomain,
                contractAddresses: this.contractAddresses,
                bridgeSlippage: opts.bridgeSlippage || 0,
            };
            // Convert native orders and dex quotes into `Fill` objects.
            const fills = fills_1.createFills({
                side,
                // Augment native orders with their fillable amounts.
                orders: [
                    ...orders_1.createSignedOrdersWithFillableAmounts(side, nativeOrders, orderFillableAmounts),
                    ...orders_1.createSignedOrdersFromRfqtIndicativeQuotes(rfqtIndicativeQuotes),
                ],
                dexQuotes,
                targetInput: inputAmount,
                ethToOutputRate,
                ethToInputRate,
                excludedSources: opts.excludedSources,
                feeSchedule: opts.feeSchedule,
            });
            // Find the optimal path.
            const optimizerOpts = {
                ethToOutputRate,
                ethToInputRate,
                exchangeProxyOverhead: opts.exchangeProxyOverhead || (() => constants_1.ZERO_AMOUNT),
            };
            const optimalPath = yield path_optimizer_1.findOptimalPathAsync(side, fills, inputAmount, opts.runLimit, optimizerOpts);
            const optimalPathRate = optimalPath ? optimalPath.adjustedRate() : constants_1.ZERO_AMOUNT;
            const { adjustedRate: bestTwoHopRate, quote: bestTwoHopQuote } = multihop_utils_1.getBestTwoHopQuote(marketSideLiquidity, opts.feeSchedule, opts.exchangeProxyOverhead);
            if (bestTwoHopQuote && bestTwoHopRate.isGreaterThan(optimalPathRate)) {
                const twoHopOrders = orders_1.createOrdersFromTwoHopSample(bestTwoHopQuote, orderOpts);
                return {
                    optimizedOrders: twoHopOrders,
                    liquidityDelivered: bestTwoHopQuote,
                    sourceFlags: constants_1.SOURCE_FLAGS[types_2.ERC20BridgeSource.MultiHop],
                    marketSideLiquidity,
                    adjustedRate: bestTwoHopRate,
                };
            }
            // If there is no optimal path AND we didn't return a MultiHop quote, then throw
            if (optimalPath === undefined) {
                throw new Error(types_2.AggregationError.NoOptimalPath);
            }
            // Generate a fallback path if native orders are in the optimal path.
            const nativeFills = optimalPath.fills.filter(f => f.source === types_2.ERC20BridgeSource.Native);
            if (opts.allowFallback && nativeFills.length !== 0) {
                // We create a fallback path that is exclusive of Native liquidity
                // This is the optimal on-chain path for the entire input amount
                const nonNativeFills = fills.filter(p => p.length > 0 && p[0].source !== types_2.ERC20BridgeSource.Native);
                const nonNativeOptimalPath = yield path_optimizer_1.findOptimalPathAsync(side, nonNativeFills, inputAmount, opts.runLimit);
                // Calculate the slippage of on-chain sources compared to the most optimal path
                if (nonNativeOptimalPath !== undefined &&
                    (nativeFills.length === optimalPath.fills.length ||
                        nonNativeOptimalPath.adjustedSlippage(optimalPathRate) <= maxFallbackSlippage)) {
                    optimalPath.addFallback(nonNativeOptimalPath);
                }
            }
            const collapsedPath = optimalPath.collapse(orderOpts);
            return {
                optimizedOrders: collapsedPath.orders,
                liquidityDelivered: collapsedPath.collapsedFills,
                sourceFlags: collapsedPath.sourceFlags,
                marketSideLiquidity,
                adjustedRate: optimalPathRate,
            };
        });
    }
    _getMarketSideOrdersAsync(nativeOrders, amount, side, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
            const optimizerOpts = {
                bridgeSlippage: _opts.bridgeSlippage,
                maxFallbackSlippage: _opts.maxFallbackSlippage,
                excludedSources: _opts.excludedSources,
                feeSchedule: _opts.feeSchedule,
                allowFallback: _opts.allowFallback,
                exchangeProxyOverhead: _opts.exchangeProxyOverhead,
            };
            // Compute an optimized path for on-chain DEX and open-orderbook. This should not include RFQ liquidity.
            const marketLiquidityFnAsync = side === types_1.MarketOperation.Sell
                ? this.getMarketSellLiquidityAsync.bind(this)
                : this.getMarketBuyLiquidityAsync.bind(this);
            const marketSideLiquidity = yield marketLiquidityFnAsync(nativeOrders, amount, _opts);
            let optimizerResult;
            try {
                optimizerResult = yield this._generateOptimizedOrdersAsync(marketSideLiquidity, optimizerOpts);
            }
            catch (e) {
                // If no on-chain or off-chain Open Orderbook orders are present, a `NoOptimalPath` will be thrown.
                // If this happens at this stage, there is still a chance that an RFQ order is fillable, therefore
                // we catch the error and continue.
                if (e.message !== types_2.AggregationError.NoOptimalPath) {
                    throw e;
                }
            }
            // If RFQ liquidity is enabled, make a request to check RFQ liquidity
            let wholeOrderPrice;
            const { rfqt } = _opts;
            if (rfqt && rfqt.quoteRequestor && marketSideLiquidity.quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)) {
                // Calculate a suggested price. For now, this is simply the overall price of the aggregation.
                if (optimizerResult) {
                    wholeOrderPrice = comparison_price_1.getComparisonPrices(optimizerResult.adjustedRate, amount, marketSideLiquidity, _opts.feeSchedule).wholeOrder;
                }
                const { isFirmPriceAwareEnabled, isIndicativePriceAwareEnabled } = utils_2.getPriceAwareRFQRolloutFlags(rfqt.priceAwareRFQFlag);
                if (rfqt.isIndicative && isIndicativePriceAwareEnabled) {
                    // An indicative quote is beingh requested, and indicative quotes price-aware enabled. Make the RFQT request and then re-run the sampler if new orders come back.
                    const indicativeQuotes = yield getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, side, amount, wholeOrderPrice, _opts);
                    // Re-run optimizer with the new indicative quote
                    if (indicativeQuotes.length > 0) {
                        optimizerResult = yield this._generateOptimizedOrdersAsync(Object.assign({}, marketSideLiquidity, { rfqtIndicativeQuotes: indicativeQuotes }), optimizerOpts);
                    }
                }
                else if (!rfqt.isIndicative && isFirmPriceAwareEnabled) {
                    // A firm quote is being requested, and firm quotes price-aware enabled. Ensure that `intentOnFilling` is enabled.
                    if (rfqt.intentOnFilling) {
                        // Extra validation happens when requesting a firm quote, such as ensuring that the takerAddress
                        // is indeed valid.
                        if (!rfqt.takerAddress || rfqt.takerAddress === utils_1.NULL_ADDRESS) {
                            throw new Error('RFQ-T requests must specify a taker address');
                        }
                        const firmQuotes = yield rfqt.quoteRequestor.requestRfqtFirmQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, amount, side, wholeOrderPrice, rfqt);
                        if (firmQuotes.length > 0) {
                            // Compute the RFQ order fillable amounts. This is done by performing a "soft" order
                            // validation and by checking order balances that are monitored by our worker.
                            // If a firm quote validator does not exist, then we assume that all orders are valid.
                            const firmQuoteSignedOrders = firmQuotes.map(quote => quote.signedOrder);
                            const rfqOrderFillableAmounts = rfqt.firmQuoteValidator === undefined
                                ? firmQuoteSignedOrders.map(signedOrder => signedOrder.takerAssetAmount)
                                : yield rfqt.firmQuoteValidator.getRfqtTakerFillableAmountsAsync(firmQuoteSignedOrders);
                            // Re-run optimizer with the new firm quote. This is the second and last time
                            // we run the optimized in a block of code. In this case, we don't catch a potential `NoOptimalPath` exception
                            // and we let it bubble up if it happens.
                            optimizerResult = yield this._generateOptimizedOrdersAsync(Object.assign({}, marketSideLiquidity, { nativeOrders: marketSideLiquidity.nativeOrders.concat(firmQuoteSignedOrders), orderFillableAmounts: marketSideLiquidity.orderFillableAmounts.concat(rfqOrderFillableAmounts) }), optimizerOpts);
                        }
                    }
                }
            }
            // At this point we should have at least one valid optimizer result, therefore we manually raise
            // `NoOptimalPath` if no optimizer result was ever set.
            if (optimizerResult === undefined) {
                throw new Error(types_2.AggregationError.NoOptimalPath);
            }
            // Compute Quote Report and return the results.
            let quoteReport;
            if (_opts.shouldGenerateQuoteReport) {
                quoteReport = MarketOperationUtils._computeQuoteReport(nativeOrders, _opts.rfqt ? _opts.rfqt.quoteRequestor : undefined, marketSideLiquidity, optimizerResult, wholeOrderPrice);
            }
            return Object.assign({}, optimizerResult, { quoteReport });
        });
    }
}
exports.MarketOperationUtils = MarketOperationUtils;
// tslint:disable: max-file-line-count
//# sourceMappingURL=index.js.map