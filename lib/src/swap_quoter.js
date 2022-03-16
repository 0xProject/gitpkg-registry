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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapQuoter = exports.Orderbook = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const axios_1 = require("axios");
const http_1 = require("http");
const https_1 = require("https");
const _ = require("lodash");
const constants_1 = require("./constants");
const types_1 = require("./types");
const assert_1 = require("./utils/assert");
const market_operation_utils_1 = require("./utils/market_operation_utils");
const constants_2 = require("./utils/market_operation_utils/constants");
const sampler_1 = require("./utils/market_operation_utils/sampler");
const source_filters_1 = require("./utils/market_operation_utils/source_filters");
const types_2 = require("./utils/market_operation_utils/types");
const protocol_fee_utils_1 = require("./utils/protocol_fee_utils");
const quote_requestor_1 = require("./utils/quote_requestor");
const quote_simulation_1 = require("./utils/quote_simulation");
class Orderbook {
    // tslint:disable-next-line:prefer-function-over-method
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.Orderbook = Orderbook;
// tslint:disable:max-classes-per-file
class SwapQuoter {
    /**
     * Instantiates a new SwapQuoter instance
     * @param   supportedProvider   The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   orderbook           An object that conforms to Orderbook, see type for definition.
     * @param   options             Initialization options for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    constructor(supportedProvider, orderbook, options) {
        var _a;
        this._limitOrderPruningFn = (limitOrder) => {
            const order = new protocol_utils_1.LimitOrder(limitOrder.order);
            const isOpenOrder = order.taker === constants_1.constants.NULL_ADDRESS;
            const willOrderExpire = order.willExpire(this.expiryBufferMs / constants_1.constants.ONE_SECOND_MS); // tslint:disable-line:boolean-naming
            const isFeeTypeAllowed = this.permittedOrderFeeTypes.has(types_1.OrderPrunerPermittedFeeTypes.NoFees) &&
                order.takerTokenFeeAmount.eq(constants_1.constants.ZERO_AMOUNT);
            return isOpenOrder && !willOrderExpire && isFeeTypeAllowed;
        }; // tslint:disable-line:semicolon
        const { chainId, expiryBufferMs, permittedOrderFeeTypes, rfqt, } = options;
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        assert_1.assert.isValidOrderbook('orderbook', orderbook);
        this.chainId = chainId;
        this.provider = provider;
        this.orderbook = orderbook;
        this.expiryBufferMs = expiryBufferMs;
        this.permittedOrderFeeTypes = permittedOrderFeeTypes;
        this._rfqtOptions = rfqt;
        this._contractAddresses = options.contractAddresses || Object.assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(chainId));
        this._protocolFeeUtils = protocol_fee_utils_1.ProtocolFeeUtils.getInstance(constants_1.constants.PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS, options.ethGasStationUrl);
        this._marketOperationUtils = new market_operation_utils_1.MarketOperationUtils(sampler_1.SamplerClient.createFromChainIdAndEndpoint(this.chainId, options.samplerServiceUrl));
        this._quoteRequestorHttpClient = axios_1.default.create(Object.assign({ httpAgent: new http_1.Agent({ keepAlive: true, timeout: constants_1.KEEP_ALIVE_TTL }), httpsAgent: new https_1.Agent({ keepAlive: true, timeout: constants_1.KEEP_ALIVE_TTL }) }, (rfqt ? rfqt.axiosInstanceOpts : {})));
        const integratorIds = ((_a = this._rfqtOptions) === null || _a === void 0 ? void 0 : _a.integratorsWhitelist.map(integrator => integrator.integratorId)) || [];
        this._integratorIdsSet = new Set(integratorIds);
    }
    getBatchMarketBuySwapQuoteAsync(makerTokens, targetTakerToken, makerTokenBuyAmounts, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            makerTokenBuyAmounts.map((a, i) => assert_1.assert.isBigNumber(`makerAssetBuyAmounts[${i}]`, a));
            let gasPrice;
            if (!!options.gasPrice) {
                gasPrice = options.gasPrice;
                assert_1.assert.isBigNumber('gasPrice', gasPrice);
            }
            else {
                gasPrice = yield this.getGasPriceEstimationOrThrowAsync();
            }
            const allOrders = yield this.orderbook.getBatchOrdersAsync(makerTokens, targetTakerToken, this._limitOrderPruningFn);
            // Orders could be missing from the orderbook, so we create a dummy one as a placeholder
            allOrders.forEach((orders, i) => {
                if (!orders || orders.length === 0) {
                    allOrders[i] = [createDummyOrder(makerTokens[i], targetTakerToken)];
                }
            });
            const opts = Object.assign(Object.assign({}, constants_1.constants.DEFAULT_SWAP_QUOTE_REQUEST_OPTS), options);
            const optimizerResults = yield this._marketOperationUtils.getBatchMarketBuyOrdersAsync(allOrders, makerTokenBuyAmounts, opts);
            const batchSwapQuotes = yield Promise.all(optimizerResults.map((result, i) => __awaiter(this, void 0, void 0, function* () {
                if (result) {
                    const { makerToken, takerToken } = allOrders[i][0].order;
                    return createSwapQuote(result, makerToken, takerToken, types_1.MarketOperation.Buy, makerTokenBuyAmounts[i], gasPrice, opts.bridgeSlippage);
                }
                else {
                    return undefined;
                }
            })));
            return batchSwapQuotes.filter(x => x !== undefined);
        });
    }
    /**
     * Returns the bids and asks liquidity for the entire market.
     * For certain sources (like AMM's) it is recommended to provide a practical maximum takerAssetAmount.
     * @param   makerTokenAddress The address of the maker asset
     * @param   takerTokenAddress The address of the taker asset
     * @param   takerAssetAmount  The amount to sell and buy for the bids and asks.
     *
     * @return  An object that conforms to MarketDepth that contains all of the samples and liquidity
     *          information for the source.
     */
    getBidAskLiquidityForMakerTakerAssetPairAsync(makerToken, takerToken, takerAssetAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`Not implemented`);
            // assert.isString('makerToken', makerToken);
            // assert.isString('takerToken', takerToken);
            // const sourceFilters = new SourceFilters([], options.excludedSources, options.includedSources);
            //
            // let [sellOrders, buyOrders] = !sourceFilters.isAllowed(ERC20BridgeSource.Native)
            //     ? [[], []]
            //     : await Promise.all([
            //           this.orderbook.getOrdersAsync(makerToken, takerToken),
            //           this.orderbook.getOrdersAsync(takerToken, makerToken),
            //       ]);
            // if (!sellOrders || sellOrders.length === 0) {
            //     sellOrders = [createDummyOrder(makerToken, takerToken)];
            // }
            // if (!buyOrders || buyOrders.length === 0) {
            //     buyOrders = [createDummyOrder(takerToken, makerToken)];
            // }
            //
            // const getMarketDepthSide = (marketSideLiquidity: MarketSideLiquidity): MarketDepthSide => {
            //     const { dexQuotes, nativeOrders } = marketSideLiquidity.quotes;
            //     const { side } = marketSideLiquidity;
            //
            //     return [
            //         ...dexQuotes,
            //         nativeOrders.map(o => {
            //             return {
            //                 input: side === MarketOperation.Sell ? o.fillableTakerAmount : o.fillableMakerAmount,
            //                 output: side === MarketOperation.Sell ? o.fillableMakerAmount : o.fillableTakerAmount,
            //                 fillData: o,
            //                 source: ERC20BridgeSource.Native,
            //             };
            //         }),
            //     ];
            // };
            // const [bids, asks] = await Promise.all([
            //     this._marketOperationUtils.getMarketBuyLiquidityAsync(buyOrders, takerAssetAmount, options),
            //     this._marketOperationUtils.getMarketSellLiquidityAsync(sellOrders, takerAssetAmount, options),
            // ]);
            // return {
            //     bids: getMarketDepthSide(bids),
            //     asks: getMarketDepthSide(asks),
            //     makerTokenDecimals: asks.makerTokenDecimals,
            //     takerTokenDecimals: asks.takerTokenDecimals,
            // };
        });
    }
    /**
     * Returns the recommended gas price for a fast transaction
     */
    getGasPriceEstimationOrThrowAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._protocolFeeUtils.getGasPriceEstimationOrThrowAsync();
        });
    }
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._protocolFeeUtils.destroyAsync();
            yield this.orderbook.destroyAsync();
        });
    }
    /**
     * Utility function to get Ether token address
     */
    getEtherToken() {
        return this._contractAddresses.etherToken;
    }
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerToken       The address of the maker asset
     * @param   takerToken       The address of the taker asset
     * @param   assetFillAmount  If a buy, the amount of maker asset to buy. If a sell, the amount of taker asset to sell.
     * @param   marketOperation  Either a Buy or a Sell quote
     * @param   options          Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getSwapQuoteAsync(makerToken, takerToken, assetFillAmount, marketOperation, options) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isETHAddressHex('makerToken', makerToken);
            assert_1.assert.isETHAddressHex('takerToken', takerToken);
            assert_1.assert.isBigNumber('assetFillAmount', assetFillAmount);
            const opts = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTE_REQUEST_OPTS, options);
            let gasPrice;
            if (!!opts.gasPrice) {
                gasPrice = opts.gasPrice;
                assert_1.assert.isBigNumber('gasPrice', gasPrice);
            }
            else {
                gasPrice = yield this.getGasPriceEstimationOrThrowAsync();
            }
            const sourceFilters = new source_filters_1.SourceFilters([], opts.excludedSources, opts.includedSources);
            opts.rfqt = this._validateRfqtOpts(sourceFilters, opts.rfqt);
            const rfqtOptions = this._rfqtOptions;
            // Get SRA orders (limit orders)
            const shouldSkipOpenOrderbook = !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native) ||
                (opts.rfqt && opts.rfqt.nativeExclusivelyRFQ === true);
            const nativeOrders = shouldSkipOpenOrderbook
                ? yield Promise.resolve([])
                : yield this.orderbook.getOrdersAsync(makerToken, takerToken, this._limitOrderPruningFn);
            // if no native orders, pass in a dummy order for the sampler to have required metadata for sampling
            if (nativeOrders.length === 0) {
                nativeOrders.push(createDummyOrder(makerToken, takerToken));
            }
            //  ** Prepare options for fetching market side liquidity **
            // Scale fees by gas price.
            const cloneOpts = _.omit(opts, 'gasPrice');
            const calcOpts = Object.assign(Object.assign({}, cloneOpts), { gasPrice, exchangeProxyOverhead: opts.exchangeProxyOverhead });
            // pass the QuoteRequestor on if rfqt enabled
            if (calcOpts.rfqt !== undefined) {
                calcOpts.rfqt.quoteRequestor = new quote_requestor_1.QuoteRequestor((rfqtOptions === null || rfqtOptions === void 0 ? void 0 : rfqtOptions.makerAssetOfferings) || {}, {}, this._quoteRequestorHttpClient, rfqtOptions === null || rfqtOptions === void 0 ? void 0 : rfqtOptions.altRfqCreds, rfqtOptions === null || rfqtOptions === void 0 ? void 0 : rfqtOptions.warningLogger, rfqtOptions === null || rfqtOptions === void 0 ? void 0 : rfqtOptions.infoLogger, this.expiryBufferMs, rfqtOptions === null || rfqtOptions === void 0 ? void 0 : rfqtOptions.metricsProxy);
            }
            const result = yield this._marketOperationUtils.getOptimizerResultAsync(nativeOrders, assetFillAmount, marketOperation, calcOpts);
            const swapQuote = createSwapQuote(result, makerToken, takerToken, marketOperation, assetFillAmount, gasPrice, opts.bridgeSlippage);
            // Use the raw gas, not scaled by gas price
            const exchangeProxyOverhead = utils_1.BigNumber.sum(...result.hops.map(h => opts.exchangeProxyOverhead(h.sourceFlags))).toNumber();
            swapQuote.bestCaseQuoteInfo.gas += exchangeProxyOverhead;
            swapQuote.worstCaseQuoteInfo.gas += exchangeProxyOverhead;
            return swapQuote;
        });
    }
    _isIntegratorIdWhitelisted(integratorId) {
        if (!integratorId) {
            return false;
        }
        return this._integratorIdsSet.has(integratorId);
    }
    _isTxOriginBlacklisted(txOrigin) {
        if (!txOrigin) {
            return false;
        }
        const blacklistedTxOrigins = this._rfqtOptions ? this._rfqtOptions.txOriginBlacklist : new Set();
        return blacklistedTxOrigins.has(txOrigin.toLowerCase());
    }
    _validateRfqtOpts(sourceFilters, rfqt) {
        if (!rfqt) {
            return rfqt;
        }
        // tslint:disable-next-line: boolean-naming
        const { integrator, nativeExclusivelyRFQ, intentOnFilling, txOrigin } = rfqt;
        // If RFQ-T is enabled and `nativeExclusivelyRFQ` is set, then `ERC20BridgeSource.Native` should
        // never be excluded.
        if (nativeExclusivelyRFQ === true && !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)) {
            throw new Error('Native liquidity cannot be excluded if "rfqt.nativeExclusivelyRFQ" is set');
        }
        // If an integrator ID was provided, but the ID is not whitelisted, raise a warning and disable RFQ
        if (!this._isIntegratorIdWhitelisted(integrator.integratorId)) {
            if (this._rfqtOptions && this._rfqtOptions.warningLogger) {
                this._rfqtOptions.warningLogger(Object.assign({}, integrator), 'Attempt at using an RFQ API key that is not whitelisted. Disabling RFQ for the request lifetime.');
            }
            return undefined;
        }
        // If the requested tx origin is blacklisted, raise a warning and disable RFQ
        if (this._isTxOriginBlacklisted(txOrigin)) {
            if (this._rfqtOptions && this._rfqtOptions.warningLogger) {
                this._rfqtOptions.warningLogger({
                    txOrigin,
                }, 'Attempt at using a tx Origin that is blacklisted. Disabling RFQ for the request lifetime.');
            }
            return undefined;
        }
        // Otherwise check other RFQ options
        if (intentOnFilling && // The requestor is asking for a firm quote
            this._isIntegratorIdWhitelisted(integrator.integratorId) && // A valid API key was provided
            sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native) // Native liquidity is not excluded
        ) {
            if (!txOrigin || txOrigin === constants_1.constants.NULL_ADDRESS) {
                throw new Error('RFQ-T firm quote requests must specify a tx origin');
            }
        }
        return rfqt;
    }
}
exports.SwapQuoter = SwapQuoter;
// tslint:disable-next-line: max-file-line-count
// begin formatting and report generation functions
function createSwapQuote(optimizerResult, makerToken, takerToken, side, assetFillAmount, gasPrice, slippage) {
    const { hops, quoteReport, extendedQuoteReportSources, takerAmountPerEth, makerAmountPerEth, priceComparisonsReport, } = optimizerResult;
    const quoteHops = hops.map(hop => toSwapQuoteHop(hop, side, slippage));
    const { bestCaseQuoteInfo, worstCaseQuoteInfo, sourceBreakdown } = calculateQuoteInfo(quoteHops, side, assetFillAmount, gasPrice, slippage);
    // Put together the swap quote
    const { makerTokenDecimals, takerTokenDecimals } = optimizerResult.marketSideLiquidity;
    const swapQuote = {
        makerToken,
        takerToken,
        gasPrice,
        bestCaseQuoteInfo,
        worstCaseQuoteInfo,
        sourceBreakdown,
        makerTokenDecimals,
        takerTokenDecimals,
        takerAmountPerEth,
        makerAmountPerEth,
        quoteReport,
        extendedQuoteReportSources,
        priceComparisonsReport,
    };
    if (side === types_1.MarketOperation.Buy) {
        return Object.assign(Object.assign({}, swapQuote), { type: types_1.MarketOperation.Buy, makerTokenFillAmount: assetFillAmount, maxSlippage: slippage, hops: quoteHops });
    }
    else {
        return Object.assign(Object.assign({}, swapQuote), { type: types_1.MarketOperation.Sell, takerTokenFillAmount: assetFillAmount, maxSlippage: slippage, hops: quoteHops });
    }
}
function toSwapQuoteHop(hop, side, slippage) {
    const orders = hop.orders.map(o => toSwapQuoteOrder(o, side, slippage));
    const takerAmount = side === types_1.MarketOperation.Sell ? hop.inputAmount : hop.outputAmount;
    const makerAmount = side === types_1.MarketOperation.Sell ? hop.outputAmount : hop.inputAmount;
    return {
        orders,
        makerAmount: roundMakerAmount(side, makerAmount),
        takerAmount: roundTakerAmount(side, takerAmount),
        makerToken: side === types_1.MarketOperation.Sell ? hop.outputToken : hop.inputToken,
        takerToken: side === types_1.MarketOperation.Sell ? hop.inputToken : hop.outputToken,
        minMakerAmount: slipMakerAmount(side, makerAmount, slippage),
        maxTakerAmount: slipTakerAmount(side, takerAmount, slippage),
        sourceFlags: hop.sourceFlags,
    };
}
function roundMakerAmount(side, makerAmount) {
    const rm = side === types_1.MarketOperation.Sell ? utils_1.BigNumber.ROUND_DOWN : utils_1.BigNumber.ROUND_UP;
    return makerAmount.integerValue(rm);
}
function roundTakerAmount(side, takerAmount) {
    const rm = side === types_1.MarketOperation.Sell ? utils_1.BigNumber.ROUND_UP : utils_1.BigNumber.ROUND_UP;
    return takerAmount.integerValue(rm);
}
function slipMakerAmount(side, makerAmount, slippage) {
    return roundMakerAmount(side, side === types_1.MarketOperation.Sell ? makerAmount.times(1 - slippage) : makerAmount);
}
function slipTakerAmount(side, takerAmount, slippage) {
    return roundTakerAmount(side, side === types_1.MarketOperation.Sell ? takerAmount : takerAmount.times(1 + slippage));
}
function toSwapQuoteOrder(order, side, slippage) {
    const { inputToken, outputToken, inputAmount, outputAmount } = order, rest = __rest(order, ["inputToken", "outputToken", "inputAmount", "outputAmount"]);
    const common = Object.assign(Object.assign({}, rest), { takerToken: side === types_1.MarketOperation.Sell ? inputToken : outputToken, makerToken: side === types_1.MarketOperation.Sell ? outputToken : inputToken, takerAmount: side === types_1.MarketOperation.Sell ? inputAmount : outputAmount, makerAmount: side === types_1.MarketOperation.Sell ? outputAmount : inputAmount });
    if (isBridgeOrder(order)) {
        return Object.assign(Object.assign({}, common), { minMakerAmount: slipMakerAmount(side, side === types_1.MarketOperation.Sell
                ? order.outputAmount
                : order.inputAmount, slippage), maxTakerAmount: slipTakerAmount(side, side === types_1.MarketOperation.Sell
                ? order.inputAmount
                : order.outputAmount, slippage) });
    }
    return common;
}
function isBridgeOrder(order) {
    return order.type === protocol_utils_1.FillQuoteTransformerOrderType.Bridge;
}
function calculateQuoteInfo(hops, side, fillAmount, gasPrice, slippage) {
    const getNextFillAmount = (fillResults) => {
        if (fillResults.length === 0) {
            return fillAmount;
        }
        const lastFillResult = fillResults[fillResults.length - 1];
        const { totalTakerAssetAmount, makerAssetAmount } = lastFillResult;
        return side === types_1.MarketOperation.Sell
            ? makerAssetAmount : totalTakerAssetAmount;
    };
    const bestCaseFillResults = [];
    const worstCaseFillResults = [];
    const tokenPath = [];
    for (const [i, hop] of hops.entries()) {
        if (i === 0 || i < hops.length - 1) {
            if (side == types_1.MarketOperation.Sell) {
                tokenPath.push(hop.takerToken);
            }
            else {
                tokenPath.unshift(hop.makerToken);
            }
        }
        if (i === tokenPath.length - 1) {
            if (side === types_1.MarketOperation.Sell) {
                tokenPath.push(hop.makerToken);
            }
            else {
                tokenPath.unshift(hop.takerToken);
            }
        }
        const bestCaseFillResult = quote_simulation_1.simulateBestCaseFill({
            gasPrice,
            side,
            orders: hop.orders,
            fillAmount: getNextFillAmount(bestCaseFillResults),
            opts: {},
        });
        bestCaseFillResults.push(bestCaseFillResult);
        const worstCaseFillResult = quote_simulation_1.simulateWorstCaseFill({
            gasPrice,
            side,
            orders: hop.orders,
            fillAmount: getNextFillAmount(worstCaseFillResults),
            opts: { slippage },
        });
        worstCaseFillResults.push(worstCaseFillResult);
    }
    const combinedBestCaseFillResult = combineQuoteFillResults(side, bestCaseFillResults);
    const combinedWorstCaseFillResult = combineQuoteFillResults(side, worstCaseFillResults);
    const sourceBreakdown = getSwapQuoteOrdersBreakdown(side, tokenPath, bestCaseFillResults);
    return {
        sourceBreakdown,
        bestCaseQuoteInfo: fillResultsToQuoteInfo(combinedBestCaseFillResult),
        worstCaseQuoteInfo: fillResultsToQuoteInfo(combinedWorstCaseFillResult),
    };
}
function combineQuoteFillResults(side, fillResults) {
    if (fillResults.length === 0) {
        throw new Error(`Empty fillResults array`);
    }
    const orderedFillResults = side === types_1.MarketOperation.Sell ? fillResults : fillResults.slice().reverse();
    const lastResult = orderedFillResults[orderedFillResults.length - 1];
    const r = Object.assign(Object.assign({}, orderedFillResults[0]), { makerAssetAmount: lastResult.makerAssetAmount, totalMakerAssetAmount: lastResult.totalMakerAssetAmount });
    for (const fr of orderedFillResults.slice(1)) {
        r.gas += fr.gas + 30e3;
        r.protocolFeeAmount = r.protocolFeeAmount.plus(fr.protocolFeeAmount);
    }
    return r;
}
function getSwapQuoteOrdersBreakdown(side, tokenPath, hopFillResults) {
    const cumulativeFillRatioBySource = {};
    for (const hop of hopFillResults) {
        const hopTotalFillAmount = side === types_1.MarketOperation.Sell
            ? hop.totalTakerAssetAmount
            : hop.totalMakerAssetAmount;
        for (const [source, sourceFillAmount] of Object.entries(hop.fillAmountBySource)) {
            cumulativeFillRatioBySource[source] =
                (cumulativeFillRatioBySource[source] || 0)
                    + sourceFillAmount.div(hopTotalFillAmount).toNumber();
        }
    }
    const globalFillRatiosSum = Object.values(cumulativeFillRatioBySource).reduce((a, v) => a + v, 0);
    if (!globalFillRatiosSum) {
        return {};
    }
    const breakdown = {};
    for (const [source, fillRatio] of Object.entries(cumulativeFillRatioBySource)) {
        breakdown[source] = fillRatio / globalFillRatiosSum;
    }
    const hopBreakdowns = hopFillResults.map(hop => {
        const hopTotalFillAmount = side === types_1.MarketOperation.Sell
            ? hop.totalTakerAssetAmount
            : hop.totalMakerAssetAmount;
        return Object.assign({}, ...Object.entries(hop.fillAmountBySource).map(([source, sourceFillAmount]) => ({
            [source]: sourceFillAmount.div(hopTotalFillAmount).toNumber(),
        })));
    });
    if (hopFillResults.length > 1) {
        return {
            [types_2.ERC20BridgeSource.MultiHop]: {
                proportion: 1,
                tokenPath: tokenPath,
                breakdowns: side === types_1.MarketOperation.Sell ? hopBreakdowns : hopBreakdowns.reverse(),
            },
        };
    }
    return breakdown;
}
function fillResultsToQuoteInfo(fr) {
    return {
        makerAmount: fr.totalMakerAssetAmount,
        takerAmount: fr.takerAssetAmount,
        totalTakerAmount: fr.totalTakerAssetAmount,
        feeTakerTokenAmount: fr.takerFeeTakerAssetAmount,
        protocolFeeInWeiAmount: fr.protocolFeeAmount,
        gas: fr.gas,
    };
}
function createDummyOrder(makerToken, takerToken) {
    return {
        type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
        order: Object.assign({}, new protocol_utils_1.LimitOrder({
            makerToken,
            takerToken,
            makerAmount: constants_2.ZERO_AMOUNT,
            takerAmount: constants_2.ZERO_AMOUNT,
            takerTokenFeeAmount: constants_2.ZERO_AMOUNT,
        })),
        signature: constants_1.INVALID_SIGNATURE,
    };
}
//# sourceMappingURL=swap_quoter.js.map