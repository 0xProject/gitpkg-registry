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
const contract_addresses_1 = require("@0x/contract-addresses");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const ethereum_types_1 = require("ethereum-types");
const _ = require("lodash");
const artifacts_1 = require("./artifacts");
const constants_1 = require("./constants");
const types_1 = require("./types");
const assert_1 = require("./utils/assert");
const market_operation_utils_1 = require("./utils/market_operation_utils");
const bancor_service_1 = require("./utils/market_operation_utils/bancor_service");
const constants_2 = require("./utils/market_operation_utils/constants");
const sampler_1 = require("./utils/market_operation_utils/sampler");
const source_filters_1 = require("./utils/market_operation_utils/source_filters");
const types_2 = require("./utils/market_operation_utils/types");
const protocol_fee_utils_1 = require("./utils/protocol_fee_utils");
const quote_requestor_1 = require("./utils/quote_requestor");
const quote_simulation_1 = require("./utils/quote_simulation");
const utils_2 = require("./utils/utils");
const wrappers_1 = require("./wrappers");
class Orderbook {
    // tslint:disable-next-line:prefer-function-over-method
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.Orderbook = Orderbook;
function formatSignedLimitOrder(order) {
    return {
        type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
        // tslint:disable-next-line
        signature: order.signature,
        order: order,
    };
}
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
    constructor(supportedProvider, orderbook, options = {}) {
        this._limitOrderPruningFn = (limitOrder) => {
            const order = new protocol_utils_1.LimitOrder(limitOrder);
            const isOpenOrder = order.taker === constants_1.constants.NULL_ADDRESS;
            const willOrderExpire = order.willExpire(this.expiryBufferMs / constants_1.constants.ONE_SECOND_MS); // tslint:disable-line:boolean-naming
            const isFeeTypeAllowed = this.permittedOrderFeeTypes.has(types_1.OrderPrunerPermittedFeeTypes.NoFees) &&
                order.takerTokenFeeAmount.eq(constants_1.constants.ZERO_AMOUNT);
            return isOpenOrder && !willOrderExpire && isFeeTypeAllowed;
        }; // tslint:disable-line:semicolon
        const { chainId, expiryBufferMs, permittedOrderFeeTypes, samplerGasLimit, rfqt, tokenAdjacencyGraph, liquidityProviderRegistry, } = Object.assign({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        assert_1.assert.isValidOrderbook('orderbook', orderbook);
        assert_1.assert.isNumber('chainId', chainId);
        assert_1.assert.isNumber('expiryBufferMs', expiryBufferMs);
        this.chainId = chainId;
        this.provider = provider;
        this.orderbook = orderbook;
        this.expiryBufferMs = expiryBufferMs;
        this.permittedOrderFeeTypes = permittedOrderFeeTypes;
        this._rfqtOptions = rfqt;
        this._contractAddresses = options.contractAddresses || Object.assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(chainId), constants_1.BRIDGE_ADDRESSES_BY_CHAIN[chainId]);
        this._protocolFeeUtils = protocol_fee_utils_1.ProtocolFeeUtils.getInstance(constants_1.constants.PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS, options.ethGasStationUrl);
        // Allow the sampler bytecode to be overwritten using geths override functionality
        const samplerBytecode = _.get(artifacts_1.artifacts.ERC20BridgeSampler, 'compilerOutput.evm.deployedBytecode.object');
        const defaultCodeOverrides = samplerBytecode
            ? {
                [this._contractAddresses.erc20BridgeSampler]: { code: samplerBytecode },
            }
            : {};
        const samplerOverrides = _.assign({ block: ethereum_types_1.BlockParamLiteral.Latest, overrides: defaultCodeOverrides }, options.samplerOverrides);
        const samplerContract = new wrappers_1.ERC20BridgeSamplerContract(this._contractAddresses.erc20BridgeSampler, this.provider, {
            gas: samplerGasLimit,
        });
        this._marketOperationUtils = new market_operation_utils_1.MarketOperationUtils(new sampler_1.DexOrderSampler(samplerContract, samplerOverrides, undefined, // balancer pool cache
        undefined, // cream pool cache
        tokenAdjacencyGraph, liquidityProviderRegistry, this.chainId === contract_addresses_1.ChainId.Mainnet // Enable Bancor only on Mainnet
            ? () => __awaiter(this, void 0, void 0, function* () { return bancor_service_1.BancorService.createAsync(provider); })
            : () => __awaiter(this, void 0, void 0, function* () { return undefined; })), this._contractAddresses, {
            chainId,
            exchangeAddress: this._contractAddresses.exchange,
        });
    }
    getBatchMarketBuySwapQuoteAsync(makerTokens, targetTakerToken, makerAssetBuyAmounts, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            makerAssetBuyAmounts.map((a, i) => assert_1.assert.isBigNumber(`makerAssetBuyAmounts[${i}]`, a));
            let gasPrice;
            if (!!options.gasPrice) {
                gasPrice = options.gasPrice;
                assert_1.assert.isBigNumber('gasPrice', gasPrice);
            }
            else {
                gasPrice = yield this.getGasPriceEstimationOrThrowAsync();
            }
            const batchLimitOrders = yield this.orderbook.getBatchOrdersAsync(makerTokens, targetTakerToken, this._limitOrderPruningFn);
            const allOrders = batchLimitOrders.map(orders => orders.map(o => formatSignedLimitOrder(o)));
            const opts = Object.assign({}, constants_1.constants.DEFAULT_SWAP_QUOTE_REQUEST_OPTS, options);
            const optimizerResults = yield this._marketOperationUtils.getBatchMarketBuyOrdersAsync(allOrders, makerAssetBuyAmounts, opts);
            const batchSwapQuotes = yield Promise.all(optimizerResults.map((result, i) => __awaiter(this, void 0, void 0, function* () {
                if (result) {
                    const { makerToken, takerToken } = allOrders[i][0].order;
                    return createSwapQuote(result, makerToken, takerToken, types_1.MarketOperation.Buy, makerAssetBuyAmounts[i], gasPrice, opts.gasSchedule, opts.bridgeSlippage);
                }
                else {
                    return undefined;
                }
            })));
            return batchSwapQuotes.filter(x => x !== undefined);
        });
    }
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerTokenAddress       The address of the maker asset
     * @param   takerTokenAddress       The address of the taker asset
     * @param   makerAssetBuyAmount     The amount of maker asset to swap for.
     * @param   options                 Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getMarketBuySwapQuoteAsync(makerToken, takerToken, makerAssetBuyAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isETHAddressHex('makerToken', makerToken);
            assert_1.assert.isETHAddressHex('takerToken', takerToken);
            assert_1.assert.isBigNumber('makerAssetBuyAmount', makerAssetBuyAmount);
            return this._getSwapQuoteAsync(makerToken, takerToken, makerAssetBuyAmount, types_1.MarketOperation.Buy, options);
        });
    }
    getSwapQuoteAsync(makerToken, takerToken, amount, side, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getSwapQuoteAsync(makerToken, takerToken, amount, side, options);
        });
    }
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerTokenAddress       The address of the maker asset
     * @param   takerTokenAddress       The address of the taker asset
     * @param   takerAssetSellAmount     The amount of taker asset to sell.
     * @param   options                  Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getMarketSellSwapQuoteAsync(makerToken, takerToken, takerAssetSellAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isETHAddressHex('makerToken', makerToken);
            assert_1.assert.isETHAddressHex('takerToken', takerToken);
            assert_1.assert.isBigNumber('takerAssetSellAmount', takerAssetSellAmount);
            return this._getSwapQuoteAsync(makerToken, takerToken, takerAssetSellAmount, types_1.MarketOperation.Sell, options);
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
            assert_1.assert.isString('makerToken', makerToken);
            assert_1.assert.isString('takerToken', takerToken);
            const sourceFilters = new source_filters_1.SourceFilters([], options.excludedSources, options.includedSources);
            const [sellOrdersRaw, buyOrdersRaw] = !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)
                ? [[], []]
                : yield Promise.all([
                    this.orderbook.getOrdersAsync(makerToken, takerToken),
                    this.orderbook.getOrdersAsync(takerToken, makerToken),
                ]);
            let sellOrders = sellOrdersRaw.map(formatSignedLimitOrder);
            let buyOrders = buyOrdersRaw.map(formatSignedLimitOrder);
            if (!sellOrders || sellOrders.length === 0) {
                sellOrders = [
                    {
                        type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
                        order: new protocol_utils_1.LimitOrder({
                            makerToken,
                            takerToken,
                            maker: this._contractAddresses.uniswapBridge,
                        }),
                        signature: {},
                    },
                ];
            }
            if (!buyOrders || buyOrders.length === 0) {
                buyOrders = [
                    {
                        type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
                        order: new protocol_utils_1.LimitOrder({
                            takerToken,
                            makerToken,
                            maker: this._contractAddresses.uniswapBridge,
                        }),
                        signature: {},
                    },
                ];
            }
            const getMarketDepthSide = (marketSideLiquidity) => {
                const { dexQuotes, nativeOrders } = marketSideLiquidity.quotes;
                const { side } = marketSideLiquidity;
                return [
                    ...dexQuotes,
                    nativeOrders.map(o => {
                        return {
                            input: side === types_1.MarketOperation.Sell ? o.fillableTakerAmount : o.fillableMakerAmount,
                            output: side === types_1.MarketOperation.Sell ? o.fillableMakerAmount : o.fillableTakerAmount,
                            fillData: o,
                            source: types_2.ERC20BridgeSource.Native,
                        };
                    }),
                ];
            };
            const [bids, asks] = yield Promise.all([
                this._marketOperationUtils.getMarketBuyLiquidityAsync((buyOrders || []).map(o => ({
                    order: o.order,
                    type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
                    // TODO jacob
                    // tslint:disable-next-line: no-object-literal-type-assertion
                    signature: {},
                })), takerAssetAmount, options),
                this._marketOperationUtils.getMarketSellLiquidityAsync((sellOrders || []).map(o => ({
                    order: o.order,
                    type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
                    // TODO jacob
                    // tslint:disable-next-line: no-object-literal-type-assertion
                    signature: {},
                })), takerAssetAmount, options),
            ]);
            return {
                bids: getMarketDepthSide(bids),
                asks: getMarketDepthSide(asks),
                makerTokenDecimals: asks.makerTokenDecimals,
                takerTokenDecimals: asks.takerTokenDecimals,
            };
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
     * General function for getting swap quote, conditionally uses different logic per specified marketOperation
     */
    _getSwapQuoteAsync(makerToken, takerToken, assetFillAmount, marketOperation, options) {
        return __awaiter(this, void 0, void 0, function* () {
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
            // If RFQT is enabled and `nativeExclusivelyRFQT` is set, then `ERC20BridgeSource.Native` should
            // never be excluded.
            if (opts.rfqt &&
                opts.rfqt.nativeExclusivelyRFQT === true &&
                !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)) {
                throw new Error('Native liquidity cannot be excluded if "rfqt.nativeExclusivelyRFQT" is set');
            }
            // If an API key was provided, but the key is not whitelisted, raise a warning and disable RFQ
            if (opts.rfqt && opts.rfqt.apiKey && !this._isApiKeyWhitelisted(opts.rfqt.apiKey)) {
                if (this._rfqtOptions && this._rfqtOptions.warningLogger) {
                    this._rfqtOptions.warningLogger({
                        apiKey: opts.rfqt.apiKey,
                    }, 'Attempt at using an RFQ API key that is not whitelisted. Disabling RFQ for the request lifetime.');
                }
                opts.rfqt = undefined;
            }
            // Otherwise check other RFQ options
            let shouldProceedWithRfq = false;
            if (opts.rfqt && // This is an RFQT-enabled API request
                !utils_2.getPriceAwareRFQRolloutFlags(opts.rfqt.priceAwareRFQFlag).isFirmPriceAwareEnabled && // If Price-aware RFQ is enabled, firm quotes are requested later on in the process.
                opts.rfqt.intentOnFilling && // The requestor is asking for a firm quote
                opts.rfqt.apiKey &&
                this._isApiKeyWhitelisted(opts.rfqt.apiKey) && // A valid API key was provided
                sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native) // Native liquidity is not excluded
            ) {
                if (!opts.rfqt.takerAddress || opts.rfqt.takerAddress === constants_1.constants.NULL_ADDRESS) {
                    throw new Error('RFQ-T firm quote requests must specify a taker address');
                }
                shouldProceedWithRfq = true;
            }
            const rfqtOptions = this._rfqtOptions;
            const quoteRequestor = new quote_requestor_1.QuoteRequestor(rfqtOptions ? rfqtOptions.makerAssetOfferings || {} : {}, rfqtOptions ? rfqtOptions.warningLogger : undefined, rfqtOptions ? rfqtOptions.infoLogger : undefined, this.expiryBufferMs);
            // Get RFQ orders if valid
            const rfqOrdersPromise = shouldProceedWithRfq
                ? quoteRequestor.requestRfqtFirmQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, undefined, opts.rfqt)
                : [];
            // Get SRA orders (limit orders)
            const skipOpenOrderbook = !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native) ||
                (opts.rfqt && opts.rfqt.nativeExclusivelyRFQT === true);
            const limitOrdersPromise = skipOpenOrderbook
                ? Promise.resolve([])
                : this.orderbook
                    .getOrdersAsync(makerToken, takerToken, this._limitOrderPruningFn)
                    .then(orders => orders.map(formatSignedLimitOrder));
            // Join the results together
            const nativeOrders = _.flatten(yield Promise.all([limitOrdersPromise, rfqOrdersPromise]));
            // if no native orders, pass in a dummy order for the sampler to have required metadata for sampling
            if (nativeOrders.length === 0) {
                nativeOrders.push({
                    // tslint:disable-next-line: no-object-literal-type-assertion
                    signature: {},
                    order: Object.assign({}, new protocol_utils_1.LimitOrder({
                        makerToken,
                        takerToken,
                        chainId: 1,
                        maker: this._contractAddresses.uniswapBridge,
                    })),
                    type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
                });
            }
            //  ** Prepare options for fetching market side liquidity **
            // Scale fees by gas price.
            const cloneOpts = _.omit(opts, 'gasPrice');
            const calcOpts = Object.assign({}, cloneOpts, { feeSchedule: _.mapValues(opts.feeSchedule, gasCost => (fillData) => gasCost === undefined ? 0 : gasPrice.times(gasCost(fillData))), exchangeProxyOverhead: flags => gasPrice.times(opts.exchangeProxyOverhead(flags)) });
            // pass the QuoteRequestor on if rfqt enabled
            if (calcOpts.rfqt !== undefined) {
                calcOpts.rfqt.quoteRequestor = quoteRequestor;
            }
            const result = yield this._marketOperationUtils.getOptimizerResultAsync(nativeOrders, assetFillAmount, marketOperation, calcOpts);
            const swapQuote = createSwapQuote(result, makerToken, takerToken, marketOperation, assetFillAmount, gasPrice, opts.gasSchedule, opts.bridgeSlippage);
            // Use the raw gas, not scaled by gas price
            const exchangeProxyOverhead = opts.exchangeProxyOverhead(result.sourceFlags).toNumber();
            swapQuote.bestCaseQuoteInfo.gas += exchangeProxyOverhead;
            swapQuote.worstCaseQuoteInfo.gas += exchangeProxyOverhead;
            return swapQuote;
        });
    }
    _isApiKeyWhitelisted(apiKey) {
        const whitelistedApiKeys = this._rfqtOptions ? this._rfqtOptions.takerApiKeyWhitelist : [];
        return whitelistedApiKeys.includes(apiKey);
    }
}
exports.SwapQuoter = SwapQuoter;
// tslint:disable-next-line: max-file-line-count
// begin formatting and report generation functions
function createSwapQuote(optimizerResult, makerToken, takerToken, operation, assetFillAmount, gasPrice, gasSchedule, slippage) {
    const { optimizedOrders, quoteReport, sourceFlags, takerTokenToEthRate, makerTokenToEthRate } = optimizerResult;
    const isTwoHop = sourceFlags === constants_2.SOURCE_FLAGS[types_2.ERC20BridgeSource.MultiHop];
    // Calculate quote info
    const { bestCaseQuoteInfo, worstCaseQuoteInfo, sourceBreakdown } = isTwoHop
        ? calculateTwoHopQuoteInfo(optimizedOrders, operation, gasSchedule)
        : calculateQuoteInfo(optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule, slippage);
    // Put together the swap quote
    const { makerTokenDecimals, takerTokenDecimals } = optimizerResult.marketSideLiquidity;
    const swapQuote = {
        makerToken,
        takerToken,
        gasPrice,
        orders: optimizedOrders,
        bestCaseQuoteInfo,
        worstCaseQuoteInfo,
        sourceBreakdown,
        makerTokenDecimals,
        takerTokenDecimals,
        takerTokenToEthRate,
        makerTokenToEthRate,
        quoteReport,
        isTwoHop,
    };
    if (operation === types_1.MarketOperation.Buy) {
        return Object.assign({}, swapQuote, { type: types_1.MarketOperation.Buy, makerTokenFillAmount: assetFillAmount });
    }
    else {
        return Object.assign({}, swapQuote, { type: types_1.MarketOperation.Sell, takerTokenFillAmount: assetFillAmount });
    }
}
function calculateQuoteInfo(optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule, slippage) {
    const bestCaseFillResult = quote_simulation_1.simulateBestCaseFill({
        gasPrice,
        orders: optimizedOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { gasSchedule },
    });
    const worstCaseFillResult = quote_simulation_1.simulateWorstCaseFill({
        gasPrice,
        orders: optimizedOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { gasSchedule, slippage },
    });
    return {
        bestCaseQuoteInfo: fillResultsToQuoteInfo(bestCaseFillResult),
        worstCaseQuoteInfo: fillResultsToQuoteInfo(worstCaseFillResult),
        sourceBreakdown: getSwapQuoteOrdersBreakdown(bestCaseFillResult.fillAmountBySource),
    };
}
function calculateTwoHopQuoteInfo(optimizedOrders, operation, gasSchedule) {
    const [firstHopOrder, secondHopOrder] = optimizedOrders;
    const [firstHopFill] = firstHopOrder.fills;
    const [secondHopFill] = secondHopOrder.fills;
    const gas = new utils_1.BigNumber(gasSchedule[types_2.ERC20BridgeSource.MultiHop]({
        firstHopSource: _.pick(firstHopFill, 'source', 'fillData'),
        secondHopSource: _.pick(secondHopFill, 'source', 'fillData'),
    })).toNumber();
    return {
        bestCaseQuoteInfo: {
            makerAmount: operation === types_1.MarketOperation.Sell ? secondHopFill.output : secondHopFill.input,
            takerAmount: operation === types_1.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
            totalTakerAmount: operation === types_1.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
            feeTakerTokenAmount: constants_1.constants.ZERO_AMOUNT,
            protocolFeeInWeiAmount: constants_1.constants.ZERO_AMOUNT,
            gas,
        },
        worstCaseQuoteInfo: {
            makerAmount: secondHopOrder.makerAmount,
            takerAmount: firstHopOrder.takerAmount,
            totalTakerAmount: firstHopOrder.takerAmount,
            feeTakerTokenAmount: constants_1.constants.ZERO_AMOUNT,
            protocolFeeInWeiAmount: constants_1.constants.ZERO_AMOUNT,
            gas,
        },
        sourceBreakdown: {
            [types_2.ERC20BridgeSource.MultiHop]: {
                proportion: new utils_1.BigNumber(1),
                intermediateToken: secondHopOrder.takerToken,
                hops: [firstHopFill.source, secondHopFill.source],
            },
        },
    };
}
function getSwapQuoteOrdersBreakdown(fillAmountBySource) {
    const totalFillAmount = utils_1.BigNumber.sum(...Object.values(fillAmountBySource));
    const breakdown = {};
    Object.entries(fillAmountBySource).forEach(([s, fillAmount]) => {
        const source = s;
        if (source === types_2.ERC20BridgeSource.MultiHop) {
            // TODO jacob has a different breakdown
        }
        else {
            breakdown[source] = fillAmount.div(totalFillAmount);
        }
    });
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
//# sourceMappingURL=swap_quoter.js.map