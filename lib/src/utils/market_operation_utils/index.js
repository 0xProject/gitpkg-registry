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
exports.MarketOperationUtils = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../../constants");
const types_1 = require("../../types");
const alt_mm_implementation_utils_1 = require("../alt_mm_implementation_utils");
const rfq_client_mappers_1 = require("../rfq_client_mappers");
const utils_2 = require("../utils");
const quote_report_generator_1 = require("./../quote_report_generator");
const comparison_price_1 = require("./comparison_price");
const constants_2 = require("./constants");
const identity_fill_adjustor_1 = require("./identity_fill_adjustor");
const multihop_utils_1 = require("./multihop_utils");
const orders_1 = require("./orders");
const path_optimizer_1 = require("./path_optimizer");
const sampler_1 = require("./sampler");
const source_filters_1 = require("./source_filters");
const types_2 = require("./types");
// tslint:disable:boolean-naming
class MarketOperationUtils {
    constructor(_sampler, contractAddresses, _orderDomain) {
        this._sampler = _sampler;
        this.contractAddresses = contractAddresses;
        this._orderDomain = _orderDomain;
        this._buySources = constants_2.BUY_SOURCE_FILTER_BY_CHAIN_ID[_sampler.chainId];
        this._sellSources = constants_2.SELL_SOURCE_FILTER_BY_CHAIN_ID[_sampler.chainId];
        this._feeSources = new source_filters_1.SourceFilters(constants_2.FEE_QUOTE_SOURCES_BY_CHAIN_ID[_sampler.chainId]);
        this._nativeFeeToken = constants_2.NATIVE_FEE_TOKEN_BY_CHAIN_ID[_sampler.chainId];
        this._nativeFeeTokenAmount = constants_2.NATIVE_FEE_TOKEN_AMOUNT_BY_CHAIN_ID[_sampler.chainId];
    }
    static _computeQuoteReport(quoteRequestor, marketSideLiquidity, optimizerResult, comparisonPrice) {
        const { side, quotes } = marketSideLiquidity;
        const { liquidityDelivered } = optimizerResult;
        return (0, quote_report_generator_1.generateQuoteReport)(side, quotes.nativeOrders, liquidityDelivered, comparisonPrice, quoteRequestor);
    }
    static _computeExtendedQuoteReportSources(quoteRequestor, marketSideLiquidity, amount, optimizerResult, comparisonPrice) {
        const { side, quotes } = marketSideLiquidity;
        const { liquidityDelivered } = optimizerResult;
        return (0, quote_report_generator_1.generateExtendedQuoteReportSources)(side, quotes, liquidityDelivered, amount, comparisonPrice, quoteRequestor);
    }
    static _computePriceComparisonsReport(quoteRequestor, marketSideLiquidity, comparisonPrice) {
        const { side, quotes } = marketSideLiquidity;
        const dexSources = _.flatten(quotes.dexQuotes).map(quote => (0, quote_report_generator_1.dexSampleToReportSource)(quote, side));
        const multiHopSources = quotes.twoHopQuotes.map(quote => (0, quote_report_generator_1.multiHopSampleToReportSource)(quote, side));
        const nativeSources = quotes.nativeOrders.map(order => (0, quote_report_generator_1.nativeOrderToReportEntry)(order.type, order, order.fillableTakerAmount, comparisonPrice, quoteRequestor));
        return { dexSources, multiHopSources, nativeSources };
    }
    /**
     * Gets the liquidity available for a market sell operation
     * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketSellLiquidityAsync(nativeOrders, takerAmount, opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_2.DEFAULT_GET_MARKET_ORDERS_OPTS), opts);
            const { makerToken, takerToken } = nativeOrders[0].order;
            const sampleAmounts = (0, sampler_1.getSampleAmounts)(takerAmount, _opts.numSamples, _opts.sampleDistributionBase);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._sellSources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            // Used to determine whether the tx origin is an EOA or a contract
            const txOrigin = (_opts.rfqt && _opts.rfqt.txOrigin) || utils_1.NULL_ADDRESS;
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeAsync(this._sampler.getBlockNumber(), this._sampler.getGasLeft(), this._sampler.getTokenDecimals([makerToken, takerToken]), 
            // Get native order fillable amounts.
            this._sampler.getLimitOrderFillableTakerAmounts(nativeOrders, this.contractAddresses.exchangeProxy), 
            // Get ETH -> maker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._nativeFeeToken, this._nativeFeeTokenAmount), 
            // Get ETH -> taker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._nativeFeeToken, this._nativeFeeTokenAmount), 
            // Get sell quotes for taker -> maker.
            this._sampler.getSellQuotes(quoteSourceFilters.sources, makerToken, takerToken, sampleAmounts), this._sampler.getTwoHopSellQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, takerAmount), this._sampler.isAddressContract(txOrigin), this._sampler.getGasLeft());
            // Refresh the cached pools asynchronously if required
            void this._refreshPoolCacheIfRequiredAsync(takerToken, makerToken);
            const [[blockNumber, gasBefore, tokenDecimals, orderFillableTakerAmounts, outputAmountPerEth, inputAmountPerEth, dexQuotes, rawTwoHopQuotes, isTxOriginContract, gasAfter,],] = yield Promise.all([samplerPromise]);
            // Log the gas metrics
            (_a = _opts.samplerMetrics) === null || _a === void 0 ? void 0 : _a.logGasDetails({ gasBefore, gasAfter });
            (_b = _opts.samplerMetrics) === null || _b === void 0 ? void 0 : _b.logBlockNumber(blockNumber);
            // Filter out any invalid two hop quotes where we couldn't find a route
            const twoHopQuotes = rawTwoHopQuotes.filter(q => q && q.fillData && q.fillData.firstHopSource && q.fillData.secondHopSource);
            const [makerTokenDecimals, takerTokenDecimals] = tokenDecimals;
            const isRfqSupported = !!(_opts.rfqt && !isTxOriginContract);
            const limitOrdersWithFillableAmounts = nativeOrders.map((order, i) => (Object.assign(Object.assign({}, order), (0, utils_2.getNativeAdjustedFillableAmountsFromTakerAmount)(order, orderFillableTakerAmounts[i]))));
            return {
                side: types_1.MarketOperation.Sell,
                inputAmount: takerAmount,
                inputToken: takerToken,
                outputToken: makerToken,
                outputAmountPerEth,
                inputAmountPerEth,
                quoteSourceFilters,
                makerTokenDecimals: makerTokenDecimals.toNumber(),
                takerTokenDecimals: takerTokenDecimals.toNumber(),
                quotes: {
                    nativeOrders: limitOrdersWithFillableAmounts,
                    rfqtIndicativeQuotes: [],
                    twoHopQuotes,
                    dexQuotes,
                },
                isRfqSupported,
                blockNumber: blockNumber.toNumber(),
            };
        });
    }
    /**
     * Gets the liquidity available for a market buy operation
     * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketBuyLiquidityAsync(nativeOrders, makerAmount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_2.DEFAULT_GET_MARKET_ORDERS_OPTS), opts);
            const { makerToken, takerToken } = nativeOrders[0].order;
            const sampleAmounts = (0, sampler_1.getSampleAmounts)(makerAmount, _opts.numSamples, _opts.sampleDistributionBase);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._buySources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            // Used to determine whether the tx origin is an EOA or a contract
            const txOrigin = (_opts.rfqt && _opts.rfqt.txOrigin) || utils_1.NULL_ADDRESS;
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeAsync(this._sampler.getBlockNumber(), this._sampler.getTokenDecimals([makerToken, takerToken]), 
            // Get native order fillable amounts.
            this._sampler.getLimitOrderFillableMakerAmounts(nativeOrders, this.contractAddresses.exchangeProxy), 
            // Get ETH -> makerToken token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._nativeFeeToken, this._nativeFeeTokenAmount), 
            // Get ETH -> taker token price.
            this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._nativeFeeToken, this._nativeFeeTokenAmount), 
            // Get buy quotes for taker -> maker.
            this._sampler.getBuyQuotes(quoteSourceFilters.sources, makerToken, takerToken, sampleAmounts), this._sampler.getTwoHopBuyQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, makerAmount), this._sampler.isAddressContract(txOrigin));
            // Refresh the cached pools asynchronously if required
            void this._refreshPoolCacheIfRequiredAsync(takerToken, makerToken);
            const [[blockNumber, tokenDecimals, orderFillableMakerAmounts, ethToMakerAssetRate, ethToTakerAssetRate, dexQuotes, rawTwoHopQuotes, isTxOriginContract,],] = yield Promise.all([samplerPromise]);
            // Filter out any invalid two hop quotes where we couldn't find a route
            const twoHopQuotes = rawTwoHopQuotes.filter(q => q && q.fillData && q.fillData.firstHopSource && q.fillData.secondHopSource);
            const [makerTokenDecimals, takerTokenDecimals] = tokenDecimals;
            const isRfqSupported = !isTxOriginContract;
            const limitOrdersWithFillableAmounts = nativeOrders.map((order, i) => (Object.assign(Object.assign({}, order), (0, utils_2.getNativeAdjustedFillableAmountsFromMakerAmount)(order, orderFillableMakerAmounts[i]))));
            return {
                side: types_1.MarketOperation.Buy,
                inputAmount: makerAmount,
                inputToken: makerToken,
                outputToken: takerToken,
                outputAmountPerEth: ethToTakerAssetRate,
                inputAmountPerEth: ethToMakerAssetRate,
                quoteSourceFilters,
                makerTokenDecimals: makerTokenDecimals.toNumber(),
                takerTokenDecimals: takerTokenDecimals.toNumber(),
                quotes: {
                    nativeOrders: limitOrdersWithFillableAmounts,
                    rfqtIndicativeQuotes: [],
                    twoHopQuotes,
                    dexQuotes,
                },
                isRfqSupported,
                blockNumber: blockNumber.toNumber(),
            };
        });
    }
    /**
     * gets the orders required for a batch of market buy operations by (potentially) merging native orders with
     * generated bridge orders.
     *
     * NOTE: Currently `getBatchMarketBuyOrdersAsync()` does not support external liquidity providers.
     *
     * @param batchNativeOrders Batch of Native orders. Assumes LimitOrders not RfqOrders
     * @param makerAmounts Array amount of maker asset to buy for each batch.
     * @param opts Options object.
     * @return orders.
     */
    getBatchMarketBuyOrdersAsync(batchNativeOrders, makerAmounts, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (batchNativeOrders.length === 0) {
                throw new Error(types_2.AggregationError.EmptyOrders);
            }
            const _opts = Object.assign(Object.assign({}, constants_2.DEFAULT_GET_MARKET_ORDERS_OPTS), opts);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._buySources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            const ops = [
                this._sampler.getBlockNumber(),
                ...batchNativeOrders.map(orders => this._sampler.getLimitOrderFillableMakerAmounts(orders, this.contractAddresses.exchangeProxy)),
                ...batchNativeOrders.map(orders => this._sampler.getMedianSellRate(feeSourceFilters.sources, orders[0].order.takerToken, this._nativeFeeToken, this._nativeFeeTokenAmount)),
                ...batchNativeOrders.map((orders, i) => this._sampler.getBuyQuotes(quoteSourceFilters.sources, orders[0].order.makerToken, orders[0].order.takerToken, [makerAmounts[i]])),
                ...batchNativeOrders.map(orders => this._sampler.getTokenDecimals([orders[0].order.makerToken, orders[0].order.takerToken])),
            ];
            const [blockNumberRaw, ...executeResults] = yield this._sampler.executeBatchAsync(ops);
            const batchOrderFillableMakerAmounts = executeResults.splice(0, batchNativeOrders.length);
            const batchEthToTakerAssetRate = executeResults.splice(0, batchNativeOrders.length);
            const batchDexQuotes = executeResults.splice(0, batchNativeOrders.length);
            const batchTokenDecimals = executeResults.splice(0, batchNativeOrders.length);
            const inputAmountPerEth = constants_2.ZERO_AMOUNT;
            const blockNumber = blockNumberRaw.toNumber();
            return Promise.all(batchNativeOrders.map((nativeOrders, i) => __awaiter(this, void 0, void 0, function* () {
                if (nativeOrders.length === 0) {
                    throw new Error(types_2.AggregationError.EmptyOrders);
                }
                const { makerToken, takerToken } = nativeOrders[0].order;
                const orderFillableMakerAmounts = batchOrderFillableMakerAmounts[i];
                const outputAmountPerEth = batchEthToTakerAssetRate[i];
                const dexQuotes = batchDexQuotes[i];
                const makerAmount = makerAmounts[i];
                try {
                    const optimizerResult = yield this._generateOptimizedOrdersAsync({
                        side: types_1.MarketOperation.Buy,
                        inputToken: makerToken,
                        outputToken: takerToken,
                        inputAmount: makerAmount,
                        outputAmountPerEth,
                        inputAmountPerEth,
                        quoteSourceFilters,
                        makerTokenDecimals: batchTokenDecimals[i][0],
                        takerTokenDecimals: batchTokenDecimals[i][1],
                        quotes: {
                            nativeOrders: nativeOrders.map((o, k) => (Object.assign(Object.assign({}, o), (0, utils_2.getNativeAdjustedFillableAmountsFromMakerAmount)(o, orderFillableMakerAmounts[k])))),
                            dexQuotes,
                            rfqtIndicativeQuotes: [],
                            twoHopQuotes: [],
                        },
                        isRfqSupported: false,
                        blockNumber,
                    }, {
                        bridgeSlippage: _opts.bridgeSlippage,
                        maxFallbackSlippage: _opts.maxFallbackSlippage,
                        excludedSources: _opts.excludedSources,
                        feeSchedule: _opts.feeSchedule,
                        allowFallback: _opts.allowFallback,
                        gasPrice: _opts.gasPrice,
                        neonRouterNumSamples: _opts.neonRouterNumSamples,
                        fillAdjustor: _opts.fillAdjustor,
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
            const { inputToken, outputToken, side, inputAmount, quotes, outputAmountPerEth, inputAmountPerEth, } = marketSideLiquidity;
            const { nativeOrders, rfqtIndicativeQuotes, dexQuotes } = quotes;
            const orderOpts = {
                side,
                inputToken,
                outputToken,
                orderDomain: this._orderDomain,
                contractAddresses: this.contractAddresses,
                bridgeSlippage: opts.bridgeSlippage || 0,
            };
            const augmentedRfqtIndicativeQuotes = rfqtIndicativeQuotes.map(q => 
            // tslint:disable-next-line: no-object-literal-type-assertion
            ({
                order: Object.assign({}, new protocol_utils_1.RfqOrder(Object.assign({}, q))),
                signature: constants_1.INVALID_SIGNATURE,
                fillableMakerAmount: new utils_1.BigNumber(q.makerAmount),
                fillableTakerAmount: new utils_1.BigNumber(q.takerAmount),
                fillableTakerFeeAmount: constants_2.ZERO_AMOUNT,
                type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
            }));
            // Find the optimal path.
            const penaltyOpts = {
                outputAmountPerEth,
                inputAmountPerEth,
                exchangeProxyOverhead: opts.exchangeProxyOverhead || (() => constants_2.ZERO_AMOUNT),
                gasPrice: opts.gasPrice,
            };
            // NOTE: For sell quotes input is the taker asset and for buy quotes input is the maker asset
            const takerAmountPerEth = side === types_1.MarketOperation.Sell ? inputAmountPerEth : outputAmountPerEth;
            const makerAmountPerEth = side === types_1.MarketOperation.Sell ? outputAmountPerEth : inputAmountPerEth;
            // Find the optimal path using Rust router if enabled, otherwise fallback to JS Router
            let optimalPath;
            optimalPath = (0, path_optimizer_1.findOptimalPathFromSamples)(side, dexQuotes, [...nativeOrders, ...augmentedRfqtIndicativeQuotes], inputAmount, penaltyOpts, opts.feeSchedule, this._sampler.chainId, opts.neonRouterNumSamples, opts.fillAdjustor, opts.samplerMetrics);
            const optimalPathAdjustedRate = optimalPath ? optimalPath.adjustedRate() : constants_2.ZERO_AMOUNT;
            const { adjustedRate: bestTwoHopAdjustedRate, quote: bestTwoHopQuote } = (0, multihop_utils_1.getBestTwoHopQuote)(marketSideLiquidity, opts.feeSchedule, opts.exchangeProxyOverhead, opts.fillAdjustor);
            if (bestTwoHopQuote && bestTwoHopAdjustedRate.isGreaterThan(optimalPathAdjustedRate)) {
                const twoHopOrders = (0, orders_1.createOrdersFromTwoHopSample)(bestTwoHopQuote, orderOpts);
                return {
                    optimizedOrders: twoHopOrders,
                    liquidityDelivered: bestTwoHopQuote,
                    sourceFlags: constants_2.SOURCE_FLAGS[types_2.ERC20BridgeSource.MultiHop],
                    marketSideLiquidity,
                    adjustedRate: bestTwoHopAdjustedRate,
                    takerAmountPerEth,
                    makerAmountPerEth,
                };
            }
            // If there is no optimal path AND we didn't return a MultiHop quote, then throw
            if (optimalPath === undefined) {
                throw new Error(types_2.AggregationError.NoOptimalPath);
            }
            const finalizedPath = optimalPath.finalize(orderOpts);
            return {
                optimizedOrders: finalizedPath.orders,
                liquidityDelivered: finalizedPath.fills,
                sourceFlags: finalizedPath.sourceFlags,
                marketSideLiquidity,
                adjustedRate: optimalPathAdjustedRate,
                takerAmountPerEth,
                makerAmountPerEth,
            };
        });
    }
    /**
     * @param nativeOrders: Assumes LimitOrders not RfqOrders
     */
    getOptimizerResultAsync(nativeOrders, amount, side, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_2.DEFAULT_GET_MARKET_ORDERS_OPTS), opts);
            const optimizerOpts = {
                bridgeSlippage: _opts.bridgeSlippage,
                maxFallbackSlippage: _opts.maxFallbackSlippage,
                excludedSources: _opts.excludedSources,
                feeSchedule: _opts.feeSchedule,
                allowFallback: _opts.allowFallback,
                exchangeProxyOverhead: _opts.exchangeProxyOverhead,
                gasPrice: _opts.gasPrice,
                neonRouterNumSamples: _opts.neonRouterNumSamples,
                samplerMetrics: _opts.samplerMetrics,
                fillAdjustor: _opts.fillAdjustor,
            };
            if (nativeOrders.length === 0) {
                throw new Error(types_2.AggregationError.EmptyOrders);
            }
            // Compute an optimized path for on-chain DEX and open-orderbook. This should not include RFQ liquidity.
            const marketLiquidityFnAsync = side === types_1.MarketOperation.Sell
                ? this.getMarketSellLiquidityAsync.bind(this)
                : this.getMarketBuyLiquidityAsync.bind(this);
            const marketSideLiquidity = yield marketLiquidityFnAsync(nativeOrders, amount, _opts);
            // Phase 1 Routing
            // We find an optimized path for ALL the DEX and open-orderbook liquidity
            let optimizerResult;
            try {
                optimizerResult = yield this._generateOptimizedOrdersAsync(marketSideLiquidity, Object.assign(Object.assign({}, optimizerOpts), { fillAdjustor: new identity_fill_adjustor_1.IdentityFillAdjustor() }));
            }
            catch (e) {
                // If no on-chain or off-chain Open Orderbook orders are present, a `NoOptimalPath` will be thrown.
                // If this happens at this stage, there is still a chance that an RFQ order is fillable, therefore
                // we catch the error and continue.
                if (e.message !== types_2.AggregationError.NoOptimalPath) {
                    throw e;
                }
            }
            // Calculate a suggested price. For now, this is simply the overall price of the aggregation.
            // We can use this as a comparison price for RFQ
            let wholeOrderPrice;
            if (optimizerResult) {
                wholeOrderPrice = (0, comparison_price_1.getComparisonPrices)(optimizerResult.adjustedRate, amount, marketSideLiquidity, _opts.feeSchedule, _opts.exchangeProxyOverhead).wholeOrder;
            }
            // If RFQ liquidity is enabled, make a request to check RFQ liquidity against the first optimizer result
            // Phase 2 Routing
            // Mix in any off-chain RFQ quotes
            // Apply any fill adjustments i
            const phaseTwoOptimizerOpts = Object.assign(Object.assign({}, optimizerOpts), { 
                // Pass in the FillAdjustor for Phase 2 adjustment, in the future we may perform this adjustment
                // in Phase 1.
                fillAdjustor: _opts.fillAdjustor });
            const { rfqt } = _opts;
            if (marketSideLiquidity.isRfqSupported &&
                rfqt &&
                rfqt.quoteRequestor &&
                marketSideLiquidity.quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)) {
                // Timing of RFQT lifecycle
                const timeStart = new Date().getTime();
                const { makerToken, takerToken } = nativeOrders[0].order;
                // Filter Alt Rfq Maker Asset Offerings to the current pair
                const filteredOfferings = {};
                if (rfqt.altRfqAssetOfferings) {
                    const endpoints = Object.keys(rfqt.altRfqAssetOfferings);
                    for (const endpoint of endpoints) {
                        // Get the current pair if being offered
                        const offering = (0, alt_mm_implementation_utils_1.getAltMarketInfo)(rfqt.altRfqAssetOfferings[endpoint], makerToken, takerToken);
                        if (offering) {
                            filteredOfferings[endpoint] = [offering];
                        }
                    }
                }
                if (rfqt.isIndicative) {
                    // An indicative quote is being requested, and indicative quotes price-aware enabled
                    // Make the RFQT request and then re-run the sampler if new orders come back.
                    const indicativeQuotes = rfqt.rfqClient !== undefined
                        ? (yield rfqt.rfqClient.getV1PricesAsync({
                            altRfqAssetOfferings: filteredOfferings,
                            assetFillAmount: amount,
                            chainId: this._sampler.chainId,
                            comparisonPrice: wholeOrderPrice,
                            integratorId: rfqt.integrator.integratorId,
                            intentOnFilling: rfqt.intentOnFilling,
                            makerToken,
                            marketOperation: side,
                            takerAddress: rfqt.takerAddress,
                            takerToken,
                            txOrigin: rfqt.txOrigin,
                        })).prices
                        : yield rfqt.quoteRequestor.requestRfqtIndicativeQuotesAsync(makerToken, takerToken, amount, side, wholeOrderPrice, rfqt);
                    const deltaTime = new Date().getTime() - timeStart;
                    (0, constants_1.DEFAULT_INFO_LOGGER)({
                        rfqQuoteType: 'indicative',
                        deltaTime,
                    });
                    // Re-run optimizer with the new indicative quote
                    if (indicativeQuotes.length > 0) {
                        // Attach the indicative quotes to the market side liquidity
                        marketSideLiquidity.quotes.rfqtIndicativeQuotes = indicativeQuotes;
                        // Phase 2 Routing
                        const phase1OptimalSources = optimizerResult
                            ? optimizerResult.optimizedOrders.map(o => o.source)
                            : [];
                        const phase2MarketSideLiquidity = Object.assign(Object.assign({}, marketSideLiquidity), { quotes: Object.assign(Object.assign({}, marketSideLiquidity.quotes), { 
                                // Select only the quotes that were chosen in Phase 1
                                dexQuotes: marketSideLiquidity.quotes.dexQuotes.filter(q => phase1OptimalSources.includes(q[0].source)) }) });
                        optimizerResult = yield this._generateOptimizedOrdersAsync(phase2MarketSideLiquidity, phaseTwoOptimizerOpts);
                    }
                }
                else {
                    // A firm quote is being requested, and firm quotes price-aware enabled.
                    // Ensure that `intentOnFilling` is enabled and make the request.
                    const firmQuotes = rfqt.rfqClient !== undefined
                        ? (yield rfqt.rfqClient.getV1QuotesAsync({
                            altRfqAssetOfferings: filteredOfferings,
                            assetFillAmount: amount,
                            chainId: this._sampler.chainId,
                            comparisonPrice: wholeOrderPrice,
                            integratorId: rfqt.integrator.integratorId,
                            intentOnFilling: rfqt.intentOnFilling,
                            makerToken,
                            marketOperation: side,
                            takerAddress: rfqt.takerAddress,
                            takerToken,
                            txOrigin: rfqt.txOrigin,
                        })).quotes.map(rfq_client_mappers_1.toSignedNativeOrder)
                        : yield rfqt.quoteRequestor.requestRfqtFirmQuotesAsync(makerToken, takerToken, amount, side, wholeOrderPrice, rfqt);
                    const deltaTime = new Date().getTime() - timeStart;
                    (0, constants_1.DEFAULT_INFO_LOGGER)({
                        rfqQuoteType: 'firm',
                        deltaTime,
                    });
                    if (firmQuotes.length > 0) {
                        // Compute the RFQ order fillable amounts. This is done by performing a "soft" order
                        // validation and by checking order balances that are monitored by our worker.
                        // If a firm quote validator does not exist, then we assume that all orders are valid.
                        const rfqTakerFillableAmounts = rfqt.firmQuoteValidator === undefined
                            ? firmQuotes.map(signedOrder => signedOrder.order.takerAmount)
                            : yield rfqt.firmQuoteValidator.getRfqtTakerFillableAmountsAsync(firmQuotes.map(q => new protocol_utils_1.RfqOrder(q.order)));
                        const quotesWithOrderFillableAmounts = firmQuotes.map((order, i) => (Object.assign(Object.assign({}, order), { fillableTakerAmount: rfqTakerFillableAmounts[i], 
                            // Adjust the maker amount by the available taker fill amount
                            fillableMakerAmount: (0, utils_2.getNativeAdjustedMakerFillAmount)(order.order, rfqTakerFillableAmounts[i]), fillableTakerFeeAmount: constants_2.ZERO_AMOUNT })));
                        // Attach the firm RFQt quotes to the market side liquidity
                        marketSideLiquidity.quotes.nativeOrders = [
                            ...quotesWithOrderFillableAmounts,
                            ...marketSideLiquidity.quotes.nativeOrders,
                        ];
                        // Re-run optimizer with the new firm quote. This is the second and last time
                        // we run the optimized in a block of code. In this case, we don't catch a potential `NoOptimalPath` exception
                        // and we let it bubble up if it happens.
                        // Phase 2 Routing
                        // Optimization: Filter by what is already currently in the Phase1 output as it doesn't
                        // seem possible that inclusion of RFQT could impact the sources chosen from Phase 1.
                        const phase1OptimalSources = optimizerResult
                            ? optimizerResult.optimizedOrders.map(o => o.source)
                            : [];
                        const phase2MarketSideLiquidity = Object.assign(Object.assign({}, marketSideLiquidity), { quotes: Object.assign(Object.assign({}, marketSideLiquidity.quotes), { 
                                // Select only the quotes that were chosen in Phase 1
                                dexQuotes: marketSideLiquidity.quotes.dexQuotes.filter(q => phase1OptimalSources.includes(q[0].source)) }) });
                        optimizerResult = yield this._generateOptimizedOrdersAsync(phase2MarketSideLiquidity, phaseTwoOptimizerOpts);
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
                quoteReport = MarketOperationUtils._computeQuoteReport(_opts.rfqt ? _opts.rfqt.quoteRequestor : undefined, marketSideLiquidity, optimizerResult, wholeOrderPrice);
            }
            // Always compute the Extended Quote Report
            let extendedQuoteReportSources;
            extendedQuoteReportSources = MarketOperationUtils._computeExtendedQuoteReportSources(_opts.rfqt ? _opts.rfqt.quoteRequestor : undefined, marketSideLiquidity, amount, optimizerResult, wholeOrderPrice);
            let priceComparisonsReport;
            if (_opts.shouldIncludePriceComparisonsReport) {
                priceComparisonsReport = MarketOperationUtils._computePriceComparisonsReport(_opts.rfqt ? _opts.rfqt.quoteRequestor : undefined, marketSideLiquidity, wholeOrderPrice);
            }
            return Object.assign(Object.assign({}, optimizerResult), { quoteReport, extendedQuoteReportSources, priceComparisonsReport });
        });
    }
    _refreshPoolCacheIfRequiredAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            void Promise.all(Object.values(this._sampler.poolsCaches).map((cache) => __awaiter(this, void 0, void 0, function* () {
                if (!cache || cache.isFresh(takerToken, makerToken)) {
                    return Promise.resolve([]);
                }
                return cache.getFreshPoolsForPairAsync(takerToken, makerToken);
            })));
        });
    }
}
exports.MarketOperationUtils = MarketOperationUtils;
// tslint:disable: max-file-line-count
//# sourceMappingURL=index.js.map