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
exports.SwapQuoter = exports.Orderbook = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const axios_1 = require("axios");
const ethereum_types_1 = require("ethereum-types");
const fast_abi_1 = require("fast-abi");
const http_1 = require("http");
const https_1 = require("https");
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
            const order = new protocol_utils_1.LimitOrder(limitOrder.order);
            const isOpenOrder = order.taker === constants_1.constants.NULL_ADDRESS;
            const willOrderExpire = order.willExpire(this.expiryBufferMs / constants_1.constants.ONE_SECOND_MS); // tslint:disable-line:boolean-naming
            const isFeeTypeAllowed = this.permittedOrderFeeTypes.has(types_1.OrderPrunerPermittedFeeTypes.NoFees) &&
                order.takerTokenFeeAmount.eq(constants_1.constants.ZERO_AMOUNT);
            return isOpenOrder && !willOrderExpire && isFeeTypeAllowed;
        }; // tslint:disable-line:semicolon
        const { chainId, expiryBufferMs, permittedOrderFeeTypes, samplerGasLimit, rfqt, tokenAdjacencyGraph, liquidityProviderRegistry, } = Object.assign(Object.assign({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS), options);
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
        this._contractAddresses = options.contractAddresses || Object.assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(chainId));
        this._protocolFeeUtils = protocol_fee_utils_1.ProtocolFeeUtils.getInstance(constants_1.constants.PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS, options.ethGasStationUrl);
        // Allow the sampler bytecode to be overwritten using geths override functionality
        const samplerBytecode = _.get(artifacts_1.artifacts.ERC20BridgeSampler, 'compilerOutput.evm.deployedBytecode.object');
        // Allow address of the Sampler to be overridden, i.e in Ganache where overrides do not work
        // We default the sampler address to be FlashWallet to account for allowances being set on tokens
        const samplerAddress = (options.samplerOverrides && options.samplerOverrides.to) ||
            this._contractAddresses.exchangeProxyFlashWallet;
        const defaultCodeOverrides = samplerBytecode
            ? {
                [samplerAddress]: { code: samplerBytecode, balance: constants_2.MAX_UINT256 },
            }
            : {};
        const samplerOverrides = _.assign({ block: ethereum_types_1.BlockParamLiteral.Latest, overrides: defaultCodeOverrides }, options.samplerOverrides);
        const fastAbi = new fast_abi_1.FastABI(wrappers_1.ERC20BridgeSamplerContract.ABI(), { BigNumber: utils_1.BigNumber });
        const samplerContract = new wrappers_1.ERC20BridgeSamplerContract(samplerAddress, this.provider, {
            gas: samplerGasLimit,
        }, {}, undefined, {
            encodeInput: (fnName, values) => fastAbi.encodeInput(fnName, values),
            decodeOutput: (fnName, data) => fastAbi.decodeOutput(fnName, data),
        });
        this._marketOperationUtils = new market_operation_utils_1.MarketOperationUtils(new sampler_1.DexOrderSampler(this.chainId, samplerContract, samplerOverrides, undefined, // pools caches for balancer and cream
        tokenAdjacencyGraph, liquidityProviderRegistry, this.chainId === contract_addresses_1.ChainId.Mainnet // Enable Bancor only on Mainnet
            ? () => __awaiter(this, void 0, void 0, function* () { return bancor_service_1.BancorService.createAsync(provider); })
            : () => __awaiter(this, void 0, void 0, function* () { return undefined; })), this._contractAddresses, {
            chainId,
            exchangeAddress: this._contractAddresses.exchange,
        });
        this._quoteRequestorHttpClient = axios_1.default.create(Object.assign({ httpAgent: new http_1.Agent({ keepAlive: true, timeout: constants_1.KEEP_ALIVE_TTL }), httpsAgent: new https_1.Agent({ keepAlive: true, timeout: constants_1.KEEP_ALIVE_TTL }) }, (rfqt ? rfqt.axiosInstanceOpts : {})));
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
            const optimizerResults = yield this._marketOperationUtils.getBatchMarketBuyOrdersAsync(allOrders, makerTokenBuyAmounts, gasPrice, opts);
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
            assert_1.assert.isString('makerToken', makerToken);
            assert_1.assert.isString('takerToken', takerToken);
            const sourceFilters = new source_filters_1.SourceFilters([], options.excludedSources, options.includedSources);
            let [sellOrders, buyOrders] = !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)
                ? [[], []]
                : yield Promise.all([
                    this.orderbook.getOrdersAsync(makerToken, takerToken),
                    this.orderbook.getOrdersAsync(takerToken, makerToken),
                ]);
            if (!sellOrders || sellOrders.length === 0) {
                sellOrders = [createDummyOrder(makerToken, takerToken)];
            }
            if (!buyOrders || buyOrders.length === 0) {
                buyOrders = [createDummyOrder(takerToken, makerToken)];
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
                            gasUsed: constants_2.NATIVE_LIMIT_ORDER_GAS_USED,
                        };
                    }),
                ];
            };
            const [bids, asks] = yield Promise.all([
                this._marketOperationUtils.getMarketBuyLiquidityAsync(buyOrders, takerAssetAmount, options),
                this._marketOperationUtils.getMarketSellLiquidityAsync(sellOrders, takerAssetAmount, options),
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
            const calcOpts = Object.assign(Object.assign({}, cloneOpts), { exchangeProxyOverhead: flags => gasPrice.times(opts.exchangeProxyOverhead(flags)), gasPrice });
            // pass the QuoteRequestor on if rfqt enabled
            if (calcOpts.rfqt !== undefined) {
                calcOpts.rfqt.quoteRequestor = new quote_requestor_1.QuoteRequestor(rfqtOptions ? rfqtOptions.makerAssetOfferings || {} : {}, {}, this._quoteRequestorHttpClient, rfqtOptions ? rfqtOptions.altRfqCreds : undefined, rfqtOptions ? rfqtOptions.warningLogger : undefined, rfqtOptions ? rfqtOptions.infoLogger : undefined, this.expiryBufferMs);
            }
            const result = yield this._marketOperationUtils.getOptimizerResultAsync(nativeOrders, assetFillAmount, marketOperation, calcOpts);
            const swapQuote = createSwapQuote(result, makerToken, takerToken, marketOperation, assetFillAmount, gasPrice, opts.bridgeSlippage);
            // Use the raw gas, not scaled by gas price
            const exchangeProxyOverhead = opts.exchangeProxyOverhead(result.sourceFlags).toNumber();
            swapQuote.bestCaseQuoteInfo.gas += exchangeProxyOverhead;
            swapQuote.worstCaseQuoteInfo.gas += exchangeProxyOverhead;
            return swapQuote;
        });
    }
    _isApiKeyWhitelisted(apiKey) {
        if (!apiKey) {
            return false;
        }
        const whitelistedApiKeys = this._rfqtOptions ? this._rfqtOptions.takerApiKeyWhitelist : [];
        return whitelistedApiKeys.includes(apiKey);
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
        const { apiKey, nativeExclusivelyRFQ, intentOnFilling, txOrigin } = rfqt;
        // If RFQ-T is enabled and `nativeExclusivelyRFQ` is set, then `ERC20BridgeSource.Native` should
        // never be excluded.
        if (nativeExclusivelyRFQ === true && !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)) {
            throw new Error('Native liquidity cannot be excluded if "rfqt.nativeExclusivelyRFQ" is set');
        }
        // If an API key was provided, but the key is not whitelisted, raise a warning and disable RFQ
        if (!this._isApiKeyWhitelisted(apiKey)) {
            if (this._rfqtOptions && this._rfqtOptions.warningLogger) {
                this._rfqtOptions.warningLogger({
                    apiKey,
                }, 'Attempt at using an RFQ API key that is not whitelisted. Disabling RFQ for the request lifetime.');
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
            this._isApiKeyWhitelisted(apiKey) && // A valid API key was provided
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
function createSwapQuote(optimizerResult, makerToken, takerToken, operation, assetFillAmount, gasPrice, slippage) {
    const { optimizedOrders, quoteReport, sourceFlags, takerAmountPerEth, makerAmountPerEth, priceComparisonsReport, } = optimizerResult;
    const isTwoHop = sourceFlags === constants_2.SOURCE_FLAGS[types_2.ERC20BridgeSource.MultiHop];
    // Calculate quote info
    const { bestCaseQuoteInfo, worstCaseQuoteInfo, sourceBreakdown } = isTwoHop
        ? calculateTwoHopQuoteInfo(optimizedOrders, operation, slippage)
        : calculateQuoteInfo(optimizedOrders, operation, assetFillAmount, gasPrice, slippage);
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
        takerAmountPerEth,
        makerAmountPerEth,
        quoteReport,
        isTwoHop,
        priceComparisonsReport,
    };
    if (operation === types_1.MarketOperation.Buy) {
        return Object.assign(Object.assign({}, swapQuote), { type: types_1.MarketOperation.Buy, makerTokenFillAmount: assetFillAmount });
    }
    else {
        return Object.assign(Object.assign({}, swapQuote), { type: types_1.MarketOperation.Sell, takerTokenFillAmount: assetFillAmount });
    }
}
function calculateQuoteInfo(optimizedOrders, operation, assetFillAmount, gasPrice, slippage) {
    const bestCaseFillResult = quote_simulation_1.simulateBestCaseFill({
        gasPrice,
        orders: optimizedOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: {},
    });
    const worstCaseFillResult = quote_simulation_1.simulateWorstCaseFill({
        gasPrice,
        orders: optimizedOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { slippage },
    });
    return {
        bestCaseQuoteInfo: fillResultsToQuoteInfo(bestCaseFillResult),
        worstCaseQuoteInfo: fillResultsToQuoteInfo(worstCaseFillResult),
        sourceBreakdown: getSwapQuoteOrdersBreakdown(bestCaseFillResult.fillAmountBySource),
    };
}
function calculateTwoHopQuoteInfo(optimizedOrders, operation, slippage) {
    const [firstHopOrder, secondHopOrder] = optimizedOrders;
    const [firstHopFill] = firstHopOrder.fills;
    const [secondHopFill] = secondHopOrder.fills;
    const gas = (firstHopOrder.gasUsed || constants_2.ZERO_AMOUNT).plus(secondHopFill.gasUsed || constants_2.ZERO_AMOUNT).toNumber();
    return {
        bestCaseQuoteInfo: {
            makerAmount: operation === types_1.MarketOperation.Sell ? secondHopFill.output : secondHopFill.input,
            takerAmount: operation === types_1.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
            totalTakerAmount: operation === types_1.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
            feeTakerTokenAmount: constants_1.constants.ZERO_AMOUNT,
            protocolFeeInWeiAmount: constants_1.constants.ZERO_AMOUNT,
            gas,
        },
        // TODO jacob consolidate this with quote simulation worstCase
        worstCaseQuoteInfo: {
            makerAmount: types_1.MarketOperation.Sell
                ? secondHopOrder.makerAmount.times(1 - slippage).integerValue()
                : secondHopOrder.makerAmount,
            takerAmount: types_1.MarketOperation.Sell
                ? firstHopOrder.takerAmount
                : firstHopOrder.takerAmount.times(1 + slippage).integerValue(),
            totalTakerAmount: types_1.MarketOperation.Sell
                ? firstHopOrder.takerAmount
                : firstHopOrder.takerAmount.times(1 + slippage).integerValue(),
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