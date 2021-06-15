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
const ethjs = require("ethereumjs-util");
const _ = require("lodash");
const __1 = require("../..");
const constants_1 = require("../../constants");
const types_1 = require("../../types");
const utils_2 = require("../utils");
const quote_report_generator_1 = require("./../quote_report_generator");
const comparison_price_1 = require("./comparison_price");
const constants_2 = require("./constants");
const fills_1 = require("./fills");
const multihop_utils_1 = require("./multihop_utils");
const orders_1 = require("./orders");
const path_optimizer_1 = require("./path_optimizer");
const sampler_1 = require("./sampler");
const source_filters_1 = require("./source_filters");
const types_2 = require("./types");
const HACKED_ERC20_BYTECODE = _.get(__1.artifacts.HackedERC20, 'compilerOutput.evm.deployedBytecode.object');
const GAS_OVERHEAD_BYTECODE = _.get(__1.artifacts.GasOverhead, 'compilerOutput.evm.deployedBytecode.object');
const DELEGEATE_HACKED_ERC20_BYTECODE = _.get(__1.artifacts.DelegateHackedERC20, 'compilerOutput.evm.deployedBytecode.object');
const HACKED_ERC20_ADDRESS = '0xDEf1000000000000000000000000000000DE7d37';
const GAS_OVERHEAD_ADDRESS = '0xDeF1000000000000000000000000000000001337';
// tslint:disable:boolean-naming
class MarketOperationUtils {
    constructor(_sampler, contractAddresses, _orderDomain) {
        this._sampler = _sampler;
        this.contractAddresses = contractAddresses;
        this._orderDomain = _orderDomain;
        this._contractCodeByAddress = {};
        this._buySources = constants_2.BUY_SOURCE_FILTER_BY_CHAIN_ID[_sampler.chainId];
        this._sellSources = constants_2.SELL_SOURCE_FILTER_BY_CHAIN_ID[_sampler.chainId];
        this._feeSources = new source_filters_1.SourceFilters(constants_2.FEE_QUOTE_SOURCES_BY_CHAIN_ID[_sampler.chainId]);
        this._nativeFeeToken = constants_2.NATIVE_FEE_TOKEN_BY_CHAIN_ID[_sampler.chainId];
        this._nativeFeeTokenAmount = constants_2.NATIVE_FEE_TOKEN_AMOUNT_BY_CHAIN_ID[_sampler.chainId];
    }
    static _computeQuoteReport(quoteRequestor, marketSideLiquidity, optimizerResult, comparisonPrice) {
        const { side, quotes } = marketSideLiquidity;
        const { liquidityDelivered } = optimizerResult;
        return quote_report_generator_1.generateQuoteReport(side, quotes.nativeOrders, liquidityDelivered, comparisonPrice, quoteRequestor);
    }
    static _computePriceComparisonsReport(quoteRequestor, marketSideLiquidity, comparisonPrice) {
        const { side, quotes } = marketSideLiquidity;
        const dexSources = _.flatten(quotes.dexQuotes).map(quote => quote_report_generator_1.dexSampleToReportSource(quote, side));
        const multiHopSources = quotes.twoHopQuotes.map(quote => quote_report_generator_1.multiHopSampleToReportSource(quote, side));
        const nativeSources = quotes.nativeOrders.map(order => quote_report_generator_1.nativeOrderToReportEntry(order.type, order, order.fillableTakerAmount, comparisonPrice, quoteRequestor));
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
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_2.DEFAULT_GET_MARKET_ORDERS_OPTS), opts);
            const { makerToken, takerToken } = nativeOrders[0].order;
            const sampleAmounts = sampler_1.getSampleAmounts(takerAmount, _opts.numSamples, _opts.sampleDistributionBase);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._sellSources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            // Used to determine whether the tx origin is an EOA or a contract
            const txOrigin = (_opts.rfqt && _opts.rfqt.txOrigin) || utils_1.NULL_ADDRESS;
            const { overrides } = yield this._fetchTokenOverridesAsync(takerToken, makerToken);
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeBatchAsync([
                this._sampler.getTokenDecimals([makerToken, takerToken]),
                // Get native order fillable amounts.
                this._sampler.getLimitOrderFillableTakerAmounts(nativeOrders, this.contractAddresses.exchangeProxy),
                // Get ETH -> maker token price.
                this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._nativeFeeToken, this._nativeFeeTokenAmount),
                // Get ETH -> taker token price.
                this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._nativeFeeToken, this._nativeFeeTokenAmount),
                // Get sell quotes for taker -> maker.
                this._sampler.getSellQuotes(quoteSourceFilters.sources, makerToken, takerToken, sampleAmounts),
                this._sampler.isAddressContract(txOrigin),
            ], {
                overrides,
            });
            // Perform the MultiHop sell quotes in a separate request
            const multiHopsamplerPromise = this._sampler.executeBatchAsync([
                this._sampler.getTwoHopSellQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, takerAmount),
            ], {
                overrides,
            });
            // Refresh the cached pools asynchronously if required
            void this._refreshPoolCacheIfRequiredAsync(takerToken, makerToken);
            const [[tokenDecimals, orderFillableTakerAmounts, outputAmountPerEth, inputAmountPerEth, dexQuotes, isTxOriginContract,], [rawTwoHopQuotes],] = yield Promise.all([samplerPromise, multiHopsamplerPromise]);
            // Filter out any invalid two hop quotes where we couldn't find a route
            const twoHopQuotes = rawTwoHopQuotes.filter((q) => q && q.fillData && q.fillData.firstHopSource && q.fillData.secondHopSource);
            const [makerTokenDecimals, takerTokenDecimals] = tokenDecimals;
            const isRfqSupported = !!(_opts.rfqt && !isTxOriginContract);
            const limitOrdersWithFillableAmounts = nativeOrders.map((order, i) => (Object.assign(Object.assign({}, order), utils_2.getNativeAdjustedFillableAmountsFromTakerAmount(order, orderFillableTakerAmounts[i]))));
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
            const sampleAmounts = sampler_1.getSampleAmounts(makerAmount, _opts.numSamples, _opts.sampleDistributionBase);
            const requestFilters = new source_filters_1.SourceFilters().exclude(_opts.excludedSources).include(_opts.includedSources);
            const quoteSourceFilters = this._buySources.merge(requestFilters);
            const feeSourceFilters = this._feeSources.exclude(_opts.excludedFeeSources);
            // Used to determine whether the tx origin is an EOA or a contract
            const txOrigin = (_opts.rfqt && _opts.rfqt.txOrigin) || utils_1.NULL_ADDRESS;
            const { overrides } = yield this._fetchTokenOverridesAsync(takerToken, makerToken);
            // Call the sampler contract.
            const samplerPromise = this._sampler.executeBatchAsync([
                this._sampler.getTokenDecimals([makerToken, takerToken]),
                // Get native order fillable amounts.
                this._sampler.getLimitOrderFillableMakerAmounts(nativeOrders, this.contractAddresses.exchangeProxy),
                // Get ETH -> makerToken token price.
                this._sampler.getMedianSellRate(feeSourceFilters.sources, makerToken, this._nativeFeeToken, this._nativeFeeTokenAmount),
                // Get ETH -> taker token price.
                this._sampler.getMedianSellRate(feeSourceFilters.sources, takerToken, this._nativeFeeToken, this._nativeFeeTokenAmount),
                // Get buy quotes for taker -> maker.
                this._sampler.getBuyQuotes(quoteSourceFilters.sources, makerToken, takerToken, sampleAmounts),
                this._sampler.getTwoHopBuyQuotes(quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.MultiHop) ? quoteSourceFilters.sources : [], makerToken, takerToken, makerAmount),
                this._sampler.isAddressContract(txOrigin),
            ], { overrides });
            // Refresh the cached pools asynchronously if required
            void this._refreshPoolCacheIfRequiredAsync(takerToken, makerToken);
            const [[tokenDecimals, orderFillableMakerAmounts, ethToMakerAssetRate, ethToTakerAssetRate, dexQuotes, rawTwoHopQuotes, isTxOriginContract,],] = yield Promise.all([samplerPromise]);
            // Filter out any invalid two hop quotes where we couldn't find a route
            const twoHopQuotes = rawTwoHopQuotes.filter((q) => q && q.fillData && q.fillData.firstHopSource && q.fillData.secondHopSource);
            const [makerTokenDecimals, takerTokenDecimals] = tokenDecimals;
            const isRfqSupported = !isTxOriginContract;
            const limitOrdersWithFillableAmounts = nativeOrders.map((order, i) => (Object.assign(Object.assign({}, order), utils_2.getNativeAdjustedFillableAmountsFromMakerAmount(order, orderFillableMakerAmounts[i]))));
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
                ...batchNativeOrders.map(orders => this._sampler.getLimitOrderFillableMakerAmounts(orders, this.contractAddresses.exchangeProxy)),
                ...batchNativeOrders.map(orders => this._sampler.getMedianSellRate(feeSourceFilters.sources, orders[0].order.takerToken, this._nativeFeeToken, this._nativeFeeTokenAmount)),
                ...batchNativeOrders.map((orders, i) => this._sampler.getBuyQuotes(quoteSourceFilters.sources, orders[0].order.makerToken, orders[0].order.takerToken, [makerAmounts[i]])),
                ...batchNativeOrders.map(orders => this._sampler.getTokenDecimals([orders[0].order.makerToken, orders[0].order.takerToken])),
            ];
            const executeResults = yield this._sampler.executeBatchAsync(ops);
            const batchOrderFillableMakerAmounts = executeResults.splice(0, batchNativeOrders.length);
            const batchEthToTakerAssetRate = executeResults.splice(0, batchNativeOrders.length);
            const batchDexQuotes = executeResults.splice(0, batchNativeOrders.length);
            const batchTokenDecimals = executeResults.splice(0, batchNativeOrders.length);
            const inputAmountPerEth = constants_2.ZERO_AMOUNT;
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
                            nativeOrders: nativeOrders.map((o, k) => (Object.assign(Object.assign({}, o), utils_2.getNativeAdjustedFillableAmountsFromMakerAmount(o, orderFillableMakerAmounts[k])))),
                            dexQuotes,
                            rfqtIndicativeQuotes: [],
                            twoHopQuotes: [],
                        },
                        isRfqSupported: false,
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
            const { inputToken, outputToken, side, inputAmount, quotes, outputAmountPerEth, inputAmountPerEth, } = marketSideLiquidity;
            const { nativeOrders, rfqtIndicativeQuotes, dexQuotes } = quotes;
            const maxFallbackSlippage = opts.maxFallbackSlippage || 0;
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
            // Convert native orders and dex quotes into `Fill` objects.
            const fills = fills_1.createFills({
                side,
                orders: [...nativeOrders, ...augmentedRfqtIndicativeQuotes],
                dexQuotes,
                targetInput: inputAmount,
                outputAmountPerEth,
                inputAmountPerEth,
                excludedSources: opts.excludedSources,
                feeSchedule: opts.feeSchedule,
                gasPrice: opts.gasPrice,
            });
            // Find the optimal path.
            const penaltyOpts = {
                outputAmountPerEth,
                inputAmountPerEth,
                exchangeProxyOverhead: opts.exchangeProxyOverhead || (() => constants_2.ZERO_AMOUNT),
            };
            // NOTE: For sell quotes input is the taker asset and for buy quotes input is the maker asset
            const takerAmountPerEth = side === types_1.MarketOperation.Sell ? inputAmountPerEth : outputAmountPerEth;
            const makerAmountPerEth = side === types_1.MarketOperation.Sell ? outputAmountPerEth : inputAmountPerEth;
            // Find the unoptimized best rate to calculate savings from optimizer
            const _unoptimizedPath = path_optimizer_1.fillsToSortedPaths(fills, side, inputAmount, penaltyOpts)[0];
            const unoptimizedPath = _unoptimizedPath ? _unoptimizedPath.collapse(orderOpts) : undefined;
            // Find the optimal path
            const optimalPath = yield path_optimizer_1.findOptimalPathAsync(side, fills, inputAmount, opts.runLimit, penaltyOpts);
            const optimalPathRate = optimalPath ? optimalPath.adjustedRate() : constants_2.ZERO_AMOUNT;
            const { adjustedRate: bestTwoHopRate, quote: bestTwoHopQuote } = multihop_utils_1.getBestTwoHopQuote(marketSideLiquidity, opts.feeSchedule, opts.exchangeProxyOverhead);
            if (bestTwoHopQuote && bestTwoHopRate.isGreaterThan(optimalPathRate)) {
                const twoHopOrders = orders_1.createOrdersFromTwoHopSample(bestTwoHopQuote, orderOpts);
                return {
                    optimizedOrders: twoHopOrders,
                    liquidityDelivered: bestTwoHopQuote,
                    sourceFlags: constants_2.SOURCE_FLAGS[types_2.ERC20BridgeSource.MultiHop],
                    marketSideLiquidity,
                    adjustedRate: bestTwoHopRate,
                    unoptimizedPath,
                    takerAmountPerEth,
                    makerAmountPerEth,
                };
            }
            // If there is no optimal path AND we didn't return a MultiHop quote, then throw
            if (optimalPath === undefined) {
                throw new Error(types_2.AggregationError.NoOptimalPath);
            }
            // Generate a fallback path if sources requiring a fallback (fragile) are in the optimal path.
            // Native is relatively fragile (limit order collision, expiry, or lack of available maker balance)
            // LiquidityProvider is relatively fragile (collision)
            const fragileSources = [types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.LiquidityProvider];
            const fragileFills = optimalPath.fills.filter(f => fragileSources.includes(f.source));
            if (opts.allowFallback && fragileFills.length !== 0) {
                // We create a fallback path that is exclusive of Native liquidity
                // This is the optimal on-chain path for the entire input amount
                const sturdyFills = fills.filter(p => p.length > 0 && !fragileSources.includes(p[0].source));
                const sturdyOptimalPath = yield path_optimizer_1.findOptimalPathAsync(side, sturdyFills, inputAmount, opts.runLimit, Object.assign(Object.assign({}, penaltyOpts), { exchangeProxyOverhead: (sourceFlags) => 
                    // tslint:disable-next-line: no-bitwise
                    penaltyOpts.exchangeProxyOverhead(sourceFlags | optimalPath.sourceFlags) }));
                // Calculate the slippage of on-chain sources compared to the most optimal path
                // if within an acceptable threshold we enable a fallback to prevent reverts
                if (sturdyOptimalPath !== undefined &&
                    (fragileFills.length === optimalPath.fills.length ||
                        sturdyOptimalPath.adjustedSlippage(optimalPathRate) <= maxFallbackSlippage)) {
                    optimalPath.addFallback(sturdyOptimalPath);
                }
            }
            const collapsedPath = optimalPath.collapse(orderOpts);
            return {
                optimizedOrders: collapsedPath.orders,
                liquidityDelivered: collapsedPath.collapsedFills,
                sourceFlags: collapsedPath.sourceFlags,
                marketSideLiquidity,
                adjustedRate: optimalPathRate,
                unoptimizedPath,
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
            };
            if (nativeOrders.length === 0) {
                throw new Error(types_2.AggregationError.EmptyOrders);
            }
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
            // Calculate a suggested price. For now, this is simply the overall price of the aggregation.
            // We can use this as a comparison price for RFQ
            let wholeOrderPrice;
            if (optimizerResult) {
                wholeOrderPrice = comparison_price_1.getComparisonPrices(optimizerResult.adjustedRate, amount, marketSideLiquidity, _opts.feeSchedule, _opts.exchangeProxyOverhead).wholeOrder;
            }
            // If RFQ liquidity is enabled, make a request to check RFQ liquidity against the first optimizer result
            const { rfqt } = _opts;
            if (marketSideLiquidity.isRfqSupported &&
                rfqt &&
                rfqt.quoteRequestor &&
                marketSideLiquidity.quoteSourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)) {
                // Timing of RFQT lifecycle
                const timeStart = new Date().getTime();
                const { makerToken, takerToken } = nativeOrders[0].order;
                if (rfqt.isIndicative) {
                    // An indicative quote is being requested, and indicative quotes price-aware enabled
                    // Make the RFQT request and then re-run the sampler if new orders come back.
                    const indicativeQuotes = yield rfqt.quoteRequestor.requestRfqtIndicativeQuotesAsync(makerToken, takerToken, amount, side, wholeOrderPrice, rfqt);
                    const deltaTime = new Date().getTime() - timeStart;
                    constants_1.DEFAULT_INFO_LOGGER({
                        rfqQuoteType: 'indicative',
                        deltaTime,
                    });
                    // Re-run optimizer with the new indicative quote
                    if (indicativeQuotes.length > 0) {
                        marketSideLiquidity.quotes.rfqtIndicativeQuotes = indicativeQuotes;
                        optimizerResult = yield this._generateOptimizedOrdersAsync(marketSideLiquidity, optimizerOpts);
                    }
                }
                else {
                    // A firm quote is being requested, and firm quotes price-aware enabled.
                    // Ensure that `intentOnFilling` is enabled and make the request.
                    const firmQuotes = yield rfqt.quoteRequestor.requestRfqtFirmQuotesAsync(makerToken, takerToken, amount, side, wholeOrderPrice, rfqt);
                    const deltaTime = new Date().getTime() - timeStart;
                    constants_1.DEFAULT_INFO_LOGGER({
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
                            fillableMakerAmount: utils_2.getNativeAdjustedMakerFillAmount(order.order, rfqTakerFillableAmounts[i]), fillableTakerFeeAmount: constants_2.ZERO_AMOUNT })));
                        marketSideLiquidity.quotes.nativeOrders = [
                            ...quotesWithOrderFillableAmounts,
                            ...marketSideLiquidity.quotes.nativeOrders,
                        ];
                        // Re-run optimizer with the new firm quote. This is the second and last time
                        // we run the optimized in a block of code. In this case, we don't catch a potential `NoOptimalPath` exception
                        // and we let it bubble up if it happens.
                        optimizerResult = yield this._generateOptimizedOrdersAsync(marketSideLiquidity, optimizerOpts);
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
            let priceComparisonsReport;
            if (_opts.shouldIncludePriceComparisonsReport) {
                priceComparisonsReport = MarketOperationUtils._computePriceComparisonsReport(_opts.rfqt ? _opts.rfqt.quoteRequestor : undefined, marketSideLiquidity, wholeOrderPrice);
            }
            return Object.assign(Object.assign({}, optimizerResult), { quoteReport, priceComparisonsReport });
        });
    }
    _refreshPoolCacheIfRequiredAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            void Promise.all(Object.values(this._sampler.poolsCaches).map((cache) => __awaiter(this, void 0, void 0, function* () {
                if (cache.isFresh(takerToken, makerToken)) {
                    return Promise.resolve([]);
                }
                return cache.getFreshPoolsForPairAsync(takerToken, makerToken);
            })));
        });
    }
    _fetchTokenOverridesAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Allow the tokens bytecode to be overwritten using geths override functionality
            const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, this._sampler.tokenAdjacencyGraph);
            const tokens = [takerToken, makerToken, ...intermediateTokens].map(t => t.toLowerCase());
            // Fetch all of the missing token codes
            const missingTokenCodesTokens = tokens.filter(t => !this._contractCodeByAddress[t]);
            if (missingTokenCodesTokens.length > 0) {
                const missingTokenCodes = yield this._sampler.executeBatchAsync(missingTokenCodesTokens.map(t => this._sampler.getCode(t)));
                missingTokenCodes.forEach((code, i) => {
                    this._contractCodeByAddress[missingTokenCodesTokens[i]] = code;
                });
            }
            const tokenCodes = tokens.map(t => this._contractCodeByAddress[t]);
            const nativeWrappedToken = constants_2.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this._sampler.chainId];
            const overrides = {};
            tokens.forEach((token, i) => {
                // Skip overriding WETH like token as this can be used directly with a deposit
                if (token === nativeWrappedToken) {
                    return;
                }
                const tokenImplAddress = ethjs.bufferToHex(ethjs.setLengthLeft(
                // tslint:disable-next-line: custom-no-magic-numbers prefer-template
                ethjs.toBuffer('0x' + new utils_1.BigNumber(token.toLowerCase()).plus(1).toString(16)), 20));
                // Override the original implementation with the HackedERC20 delegate
                overrides[token] = { code: DELEGEATE_HACKED_ERC20_BYTECODE };
                // Specify the original implementation at a new address (+1)
                overrides[tokenImplAddress] = { code: tokenCodes[i] };
            });
            // Set the gas overhead counter to a known address
            overrides[GAS_OVERHEAD_ADDRESS] = { code: GAS_OVERHEAD_BYTECODE };
            // Set the fixed impl of a HackedERC20 bytecode, all other tokens use a delegate call
            overrides[HACKED_ERC20_ADDRESS] = { code: HACKED_ERC20_BYTECODE };
            return { overrides };
        });
    }
}
exports.MarketOperationUtils = MarketOperationUtils;
// tslint:disable: max-file-line-count
//# sourceMappingURL=index.js.map