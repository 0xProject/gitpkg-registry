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
const quote_report_generator_1 = require("./../quote_report_generator");
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
function getRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, marketOperation, assetFillAmount, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opts.rfqt && opts.rfqt.isIndicative === true && opts.rfqt.quoteRequestor) {
            return opts.rfqt.quoteRequestor.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, opts.rfqt);
        }
        else {
            return Promise.resolve([]);
        }
    });
}
exports.getRfqtIndicativeQuotesAsync = getRfqtIndicativeQuotesAsync;
class MarketOperationUtils {
    constructor(_sampler, contractAddresses, _orderDomain, _liquidityProviderRegistry = utils_1.NULL_ADDRESS, _tokenAdjacencyGraph = {}) {
        this._sampler = _sampler;
        this.contractAddresses = contractAddresses;
        this._orderDomain = _orderDomain;
        this._liquidityProviderRegistry = _liquidityProviderRegistry;
        this._tokenAdjacencyGraph = _tokenAdjacencyGraph;
        this._feeSources = new source_filters_1.SourceFilters(constants_1.FEE_QUOTE_SOURCES);
        this._wethAddress = contractAddresses.etherToken.toLowerCase();
        this._multiBridge = contractAddresses.multiBridge.toLowerCase();
        const optionalQuoteSources = [];
        if (this._liquidityProviderRegistry !== utils_1.NULL_ADDRESS) {
            optionalQuoteSources.push(types_2.ERC20BridgeSource.LiquidityProvider);
        }
        if (this._multiBridge !== utils_1.NULL_ADDRESS) {
            optionalQuoteSources.push(types_2.ERC20BridgeSource.MultiBridge);
        }
        this._buySources = constants_1.BUY_SOURCE_FILTER.validate(optionalQuoteSources);
        this._sellSources = constants_1.SELL_SOURCE_FILTER.validate(optionalQuoteSources);
    }
    static _computeQuoteReport(nativeOrders, quoteRequestor, marketSideLiquidity, optimizerResult) {
        const { side, dexQuotes, twoHopQuotes, orderFillableAmounts } = marketSideLiquidity;
        const { liquidityDelivered } = optimizerResult;
        return quote_report_generator_1.generateQuoteReport(side, _.flatten(dexQuotes), twoHopQuotes, nativeOrders, orderFillableAmounts, liquidityDelivered, quoteRequestor);
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
            const feeSourceFilters = this._feeSources.merge(requestFilters);
            const quoteSourceFilters = this._sellSources.merge(requestFilters);
            const { onChain: sampleBalancerOnChain, offChain: sampleBalancerOffChain, } = this._sampler.balancerPoolsCache.howToSampleBalancer(takerToken, makerToken, quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Balancer));
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeAsync(
            // Get native order fillable amounts.
            this._sampler.getOrderFillableTakerAmounts(nativeOrders, this.contractAddresses.exchange), 
            // Get ETH -> maker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._wethAddress, constants_1.ONE_ETHER, this._wethAddress, this._liquidityProviderRegistry, this._multiBridge), 
            // Get ETH -> taker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._wethAddress, constants_1.ONE_ETHER, this._wethAddress, this._liquidityProviderRegistry, this._multiBridge), 
            // Get sell quotes for taker -> maker.
            this._sampler.getSellQuotes(quoteSourceFilters.exclude(sampleBalancerOnChain ? [] : types_2.ERC20BridgeSource.Balancer).sources, makerToken, takerToken, sampleAmounts, this._wethAddress, this._liquidityProviderRegistry, this._multiBridge), this._sampler.getTwoHopSellQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, takerAmount, this._tokenAdjacencyGraph, this._wethAddress, this._liquidityProviderRegistry));
            const rfqtPromise = quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)
                ? getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Sell, takerAmount, _opts)
                : Promise.resolve([]);
            const offChainBalancerPromise = sampleBalancerOffChain
                ? this._sampler.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, sampleAmounts)
                : Promise.resolve([]);
            const offChainBancorPromise = quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Bancor)
                ? this._sampler.getBancorSellQuotesOffChainAsync(makerToken, takerToken, [takerAmount])
                : Promise.resolve([]);
            const [[orderFillableAmounts, ethToMakerAssetRate, ethToTakerAssetRate, dexQuotes, twoHopQuotes], rfqtIndicativeQuotes, offChainBalancerQuotes, offChainBancorQuotes,] = yield Promise.all([samplerPromise, rfqtPromise, offChainBalancerPromise, offChainBancorPromise]);
            return {
                side: types_1.MarketOperation.Sell,
                inputAmount: takerAmount,
                inputToken: takerToken,
                outputToken: makerToken,
                dexQuotes: dexQuotes.concat([...offChainBalancerQuotes, offChainBancorQuotes]),
                nativeOrders,
                orderFillableAmounts,
                ethToOutputRate: ethToMakerAssetRate,
                ethToInputRate: ethToTakerAssetRate,
                rfqtIndicativeQuotes,
                twoHopQuotes,
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
            const feeSourceFilters = this._feeSources.merge(requestFilters);
            const quoteSourceFilters = this._buySources.merge(requestFilters);
            const { onChain: sampleBalancerOnChain, offChain: sampleBalancerOffChain, } = this._sampler.balancerPoolsCache.howToSampleBalancer(takerToken, makerToken, quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Balancer));
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeAsync(
            // Get native order fillable amounts.
            this._sampler.getOrderFillableMakerAmounts(nativeOrders, this.contractAddresses.exchange), 
            // Get ETH -> makerToken token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._wethAddress, constants_1.ONE_ETHER, this._wethAddress, this._liquidityProviderRegistry, this._multiBridge), 
            // Get ETH -> taker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._wethAddress, constants_1.ONE_ETHER, this._wethAddress, this._liquidityProviderRegistry, this._multiBridge), 
            // Get buy quotes for taker -> maker.
            this._sampler.getBuyQuotes(quoteSourceFilters.exclude(sampleBalancerOnChain ? [] : types_2.ERC20BridgeSource.Balancer).sources, makerToken, takerToken, sampleAmounts, this._wethAddress, this._liquidityProviderRegistry), this._sampler.getTwoHopBuyQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, makerAmount, this._tokenAdjacencyGraph, this._wethAddress, this._liquidityProviderRegistry));
            const rfqtPromise = quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)
                ? getRfqtIndicativeQuotesAsync(nativeOrders[0].makerAssetData, nativeOrders[0].takerAssetData, types_1.MarketOperation.Buy, makerAmount, _opts)
                : Promise.resolve([]);
            const offChainBalancerPromise = sampleBalancerOffChain
                ? this._sampler.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, sampleAmounts)
                : Promise.resolve([]);
            const [[orderFillableAmounts, ethToMakerAssetRate, ethToTakerAssetRate, dexQuotes, twoHopQuotes], rfqtIndicativeQuotes, offChainBalancerQuotes,] = yield Promise.all([samplerPromise, rfqtPromise, offChainBalancerPromise]);
            // Attach the MultiBridge address to the sample fillData
            (dexQuotes.find(quotes => quotes[0] && quotes[0].source === types_2.ERC20BridgeSource.MultiBridge) || []).forEach(q => (q.fillData = { poolAddress: this._multiBridge }));
            return {
                side: types_1.MarketOperation.Buy,
                inputAmount: makerAmount,
                inputToken: makerToken,
                outputToken: takerToken,
                dexQuotes: dexQuotes.concat(offChainBalancerQuotes),
                nativeOrders,
                orderFillableAmounts,
                ethToOutputRate: ethToTakerAssetRate,
                ethToInputRate: ethToMakerAssetRate,
                rfqtIndicativeQuotes,
                twoHopQuotes,
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
            const _opts = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
            const marketSideLiquidity = yield this.getMarketSellLiquidityAsync(nativeOrders, takerAmount, _opts);
            const optimizerResult = yield this._generateOptimizedOrdersAsync(marketSideLiquidity, {
                bridgeSlippage: _opts.bridgeSlippage,
                maxFallbackSlippage: _opts.maxFallbackSlippage,
                excludedSources: _opts.excludedSources,
                feeSchedule: _opts.feeSchedule,
                allowFallback: _opts.allowFallback,
                shouldBatchBridgeOrders: _opts.shouldBatchBridgeOrders,
            });
            // Compute Quote Report and return the results.
            let quoteReport;
            if (_opts.shouldGenerateQuoteReport) {
                quoteReport = MarketOperationUtils._computeQuoteReport(nativeOrders, _opts.rfqt ? _opts.rfqt.quoteRequestor : undefined, marketSideLiquidity, optimizerResult);
            }
            return Object.assign({}, optimizerResult, { quoteReport });
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
            const _opts = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS, opts);
            const marketSideLiquidity = yield this.getMarketBuyLiquidityAsync(nativeOrders, makerAmount, _opts);
            const optimizerResult = yield this._generateOptimizedOrdersAsync(marketSideLiquidity, {
                bridgeSlippage: _opts.bridgeSlippage,
                maxFallbackSlippage: _opts.maxFallbackSlippage,
                excludedSources: _opts.excludedSources,
                feeSchedule: _opts.feeSchedule,
                allowFallback: _opts.allowFallback,
                shouldBatchBridgeOrders: _opts.shouldBatchBridgeOrders,
            });
            let quoteReport;
            if (_opts.shouldGenerateQuoteReport) {
                quoteReport = MarketOperationUtils._computeQuoteReport(nativeOrders, _opts.rfqt ? _opts.rfqt.quoteRequestor : undefined, marketSideLiquidity, optimizerResult);
            }
            return Object.assign({}, optimizerResult, { quoteReport });
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
            const feeSourceFilters = this._feeSources.merge(requestFilters);
            const quoteSourceFilters = this._buySources.merge(requestFilters);
            const ops = [
                ...batchNativeOrders.map(orders => this._sampler.getOrderFillableMakerAmounts(orders, this.contractAddresses.exchange)),
                ...batchNativeOrders.map(orders => this._sampler.getMedianSellRate(feeSourceFilters.sources, orders_1.getNativeOrderTokens(orders[0])[1], this._wethAddress, constants_1.ONE_ETHER, this._wethAddress)),
                ...batchNativeOrders.map((orders, i) => this._sampler.getBuyQuotes(quoteSourceFilters.sources, orders_1.getNativeOrderTokens(orders[0])[0], orders_1.getNativeOrderTokens(orders[0])[1], [makerAmounts[i]], this._wethAddress)),
            ];
            const executeResults = yield this._sampler.executeBatchAsync(ops);
            const batchOrderFillableAmounts = executeResults.splice(0, batchNativeOrders.length);
            const batchEthToTakerAssetRate = executeResults.splice(0, batchNativeOrders.length);
            const batchDexQuotes = executeResults.splice(0, batchNativeOrders.length);
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
                    const { optimizedOrders } = yield this._generateOptimizedOrdersAsync({
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
                    }, {
                        bridgeSlippage: _opts.bridgeSlippage,
                        maxFallbackSlippage: _opts.maxFallbackSlippage,
                        excludedSources: _opts.excludedSources,
                        feeSchedule: _opts.feeSchedule,
                        allowFallback: _opts.allowFallback,
                        shouldBatchBridgeOrders: _opts.shouldBatchBridgeOrders,
                    });
                    return optimizedOrders;
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
                shouldBatchBridgeOrders: !!opts.shouldBatchBridgeOrders,
            };
            // Convert native orders and dex quotes into fill paths.
            const paths = fills_1.createFillPaths({
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
            let optimalPath = (yield path_optimizer_1.findOptimalPathAsync(side, paths, inputAmount, opts.runLimit)) || [];
            if (optimalPath.length === 0) {
                throw new Error(types_2.AggregationError.NoOptimalPath);
            }
            const optimalPathRate = fills_1.getPathAdjustedRate(side, optimalPath, inputAmount);
            const { adjustedRate: bestTwoHopRate, quote: bestTwoHopQuote } = multihop_utils_1.getBestTwoHopQuote(marketSideLiquidity, opts.feeSchedule);
            if (bestTwoHopQuote && bestTwoHopRate.isGreaterThan(optimalPathRate)) {
                const twoHopOrders = orders_1.createOrdersFromTwoHopSample(bestTwoHopQuote, orderOpts);
                return { optimizedOrders: twoHopOrders, liquidityDelivered: bestTwoHopQuote, isTwoHop: true };
            }
            // Generate a fallback path if native orders are in the optimal path.
            const nativeSubPath = optimalPath.filter(f => f.source === types_2.ERC20BridgeSource.Native);
            if (opts.allowFallback && nativeSubPath.length !== 0) {
                // We create a fallback path that is exclusive of Native liquidity
                // This is the optimal on-chain path for the entire input amount
                const nonNativePaths = paths.filter(p => p.length > 0 && p[0].source !== types_2.ERC20BridgeSource.Native);
                const nonNativeOptimalPath = (yield path_optimizer_1.findOptimalPathAsync(side, nonNativePaths, inputAmount, opts.runLimit)) || [];
                // Calculate the slippage of on-chain sources compared to the most optimal path
                const fallbackSlippage = fills_1.getPathAdjustedSlippage(side, nonNativeOptimalPath, inputAmount, optimalPathRate);
                if (nativeSubPath.length === optimalPath.length || fallbackSlippage <= maxFallbackSlippage) {
                    // If the last fill is Native and penultimate is not, then the intention was to partial fill
                    // In this case we drop it entirely as we can't handle a failure at the end and we don't
                    // want to fully fill when it gets prepended to the front below
                    const [last, penultimateIfExists] = optimalPath.slice().reverse();
                    const lastNativeFillIfExists = last.source === types_2.ERC20BridgeSource.Native &&
                        penultimateIfExists &&
                        penultimateIfExists.source !== types_2.ERC20BridgeSource.Native
                        ? last
                        : undefined;
                    // By prepending native paths to the front they cannot split on-chain sources and incur
                    // an additional protocol fee. I.e [Uniswap,Native,Kyber] becomes [Native,Uniswap,Kyber]
                    // In the previous step we dropped any hanging Native partial fills, as to not fully fill
                    optimalPath = [...nativeSubPath.filter(f => f !== lastNativeFillIfExists), ...nonNativeOptimalPath];
                }
            }
            const optimizedOrders = orders_1.createOrdersFromPath(optimalPath, orderOpts);
            const liquidityDelivered = _.flatten(optimizedOrders.map(order => order.fills));
            return { optimizedOrders, liquidityDelivered, isTwoHop: false };
        });
    }
}
exports.MarketOperationUtils = MarketOperationUtils;
// tslint:disable: max-file-line-count
//# sourceMappingURL=index.js.map