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
const contract_wrappers_1 = require("@0x/contract-wrappers");
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const assert_1 = require("../utils/assert");
const types_2 = require("../utils/market_operation_utils/types");
const utils_2 = require("../utils/utils");
const utils_3 = require("./utils");
// tslint:disable-next-line:custom-no-magic-numbers
const MAX_UINT256 = new utils_1.BigNumber(2).pow(256).minus(1);
const { NULL_ADDRESS, ZERO_AMOUNT } = constants_1.constants;
class ExchangeProxySwapQuoteConsumer {
    constructor(supportedProvider, contractAddresses, options = {}) {
        this.contractAddresses = contractAddresses;
        const { chainId } = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        assert_1.assert.isNumber('chainId', chainId);
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        this.provider = provider;
        this.chainId = chainId;
        this.contractAddresses = contractAddresses;
        this._exchangeProxy = new contract_wrappers_1.IZeroExContract(contractAddresses.exchangeProxy, supportedProvider);
        this.transformerNonces = {
            wethTransformer: order_utils_1.findTransformerNonce(contractAddresses.transformers.wethTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            payTakerTransformer: order_utils_1.findTransformerNonce(contractAddresses.transformers.payTakerTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            fillQuoteTransformer: order_utils_1.findTransformerNonce(contractAddresses.transformers.fillQuoteTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            affiliateFeeTransformer: order_utils_1.findTransformerNonce(contractAddresses.transformers.affiliateFeeTransformer, contractAddresses.exchangeProxyTransformerDeployer),
        };
    }
    getCalldataOrThrowAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isValidSwapQuote('quote', quote);
            const optsWithDefaults = Object.assign({}, constants_1.constants.DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS, opts.extensionContractOpts);
            // tslint:disable-next-line:no-object-literal-type-assertion
            const { refundReceiver, affiliateFee, isFromETH, isToETH } = optsWithDefaults;
            const sellToken = utils_2.getTokenFromAssetData(quote.takerAssetData);
            const buyToken = utils_2.getTokenFromAssetData(quote.makerAssetData);
            const sellAmount = quote.worstCaseQuoteInfo.totalTakerAssetAmount;
            let minBuyAmount = utils_3.getSwapMinBuyAmount(quote);
            let ethAmount = quote.worstCaseQuoteInfo.protocolFeeInWeiAmount;
            if (isFromETH) {
                ethAmount = ethAmount.plus(sellAmount);
            }
            const { buyTokenFeeAmount, sellTokenFeeAmount, recipient: feeRecipient } = affiliateFee;
            // VIP routes.
            if (isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.UniswapV2, types_2.ERC20BridgeSource.SushiSwap])) {
                const source = quote.orders[0].fills[0].source;
                const fillData = quote.orders[0].fills[0].fillData;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToUniswap(fillData.tokenAddressPath.map((a, i) => {
                        if (i === 0 && isFromETH) {
                            return order_utils_1.ETH_TOKEN_ADDRESS;
                        }
                        if (i === fillData.tokenAddressPath.length - 1 && isToETH) {
                            return order_utils_1.ETH_TOKEN_ADDRESS;
                        }
                        return a;
                    }), sellAmount, minBuyAmount, source === types_2.ERC20BridgeSource.SushiSwap)
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this.contractAddresses.exchangeProxyAllowanceTarget,
                };
            }
            // Build up the transforms.
            const transforms = [];
            if (isFromETH) {
                // Create a WETH wrapper if coming from ETH.
                transforms.push({
                    deploymentNonce: this.transformerNonces.wethTransformer,
                    data: order_utils_1.encodeWethTransformerData({
                        token: order_utils_1.ETH_TOKEN_ADDRESS,
                        amount: sellAmount,
                    }),
                });
            }
            const intermediateToken = quote.isTwoHop ? utils_2.getTokenFromAssetData(quote.orders[0].makerAssetData) : NULL_ADDRESS;
            // This transformer will fill the quote.
            if (quote.isTwoHop) {
                const [firstHopOrder, secondHopOrder] = quote.orders;
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: order_utils_1.encodeFillQuoteTransformerData({
                        sellToken,
                        buyToken: intermediateToken,
                        side: order_utils_1.FillQuoteTransformerSide.Sell,
                        refundReceiver: refundReceiver || NULL_ADDRESS,
                        fillAmount: firstHopOrder.takerAssetAmount,
                        maxOrderFillAmounts: [],
                        rfqtTakerAddress: NULL_ADDRESS,
                        orders: [firstHopOrder],
                        signatures: [firstHopOrder.signature],
                    }),
                });
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: order_utils_1.encodeFillQuoteTransformerData({
                        buyToken,
                        sellToken: intermediateToken,
                        refundReceiver: refundReceiver || NULL_ADDRESS,
                        side: order_utils_1.FillQuoteTransformerSide.Sell,
                        fillAmount: MAX_UINT256,
                        maxOrderFillAmounts: [],
                        rfqtTakerAddress: NULL_ADDRESS,
                        orders: [secondHopOrder],
                        signatures: [secondHopOrder.signature],
                    }),
                });
            }
            else {
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: order_utils_1.encodeFillQuoteTransformerData({
                        sellToken,
                        buyToken,
                        refundReceiver: refundReceiver || NULL_ADDRESS,
                        side: isBuyQuote(quote) ? order_utils_1.FillQuoteTransformerSide.Buy : order_utils_1.FillQuoteTransformerSide.Sell,
                        fillAmount: isBuyQuote(quote) ? quote.makerAssetFillAmount : quote.takerAssetFillAmount,
                        maxOrderFillAmounts: [],
                        rfqtTakerAddress: NULL_ADDRESS,
                        orders: quote.orders,
                        signatures: quote.orders.map(o => o.signature),
                    }),
                });
            }
            if (isToETH) {
                // Create a WETH unwrapper if going to ETH.
                transforms.push({
                    deploymentNonce: this.transformerNonces.wethTransformer,
                    data: order_utils_1.encodeWethTransformerData({
                        token: this.contractAddresses.etherToken,
                        amount: MAX_UINT256,
                    }),
                });
            }
            // This transformer pays affiliate fees.
            if (buyTokenFeeAmount.isGreaterThan(0) && feeRecipient !== NULL_ADDRESS) {
                transforms.push({
                    deploymentNonce: this.transformerNonces.affiliateFeeTransformer,
                    data: order_utils_1.encodeAffiliateFeeTransformerData({
                        fees: [
                            {
                                token: isToETH ? order_utils_1.ETH_TOKEN_ADDRESS : buyToken,
                                amount: buyTokenFeeAmount,
                                recipient: feeRecipient,
                            },
                        ],
                    }),
                });
                // Adjust the minimum buy amount by the fee.
                minBuyAmount = utils_1.BigNumber.max(0, minBuyAmount.minus(buyTokenFeeAmount));
            }
            if (sellTokenFeeAmount.isGreaterThan(0) && feeRecipient !== NULL_ADDRESS) {
                throw new Error('Affiliate fees denominated in sell token are not yet supported');
            }
            // The final transformer will send all funds to the taker.
            transforms.push({
                deploymentNonce: this.transformerNonces.payTakerTransformer,
                data: order_utils_1.encodePayTakerTransformerData({
                    tokens: [sellToken, buyToken, order_utils_1.ETH_TOKEN_ADDRESS].concat(quote.isTwoHop ? intermediateToken : []),
                    amounts: [],
                }),
            });
            const calldataHexString = this._exchangeProxy
                .transformERC20(isFromETH ? order_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? order_utils_1.ETH_TOKEN_ADDRESS : buyToken, sellAmount, minBuyAmount, transforms)
                .getABIEncodedTransactionData();
            return {
                calldataHexString,
                ethAmount,
                toAddress: this._exchangeProxy.address,
                allowanceTarget: this.contractAddresses.exchangeProxyAllowanceTarget,
            };
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    executeSwapQuoteOrThrowAsync(_quote, _opts) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Execution not supported for Exchange Proxy quotes');
        });
    }
}
exports.ExchangeProxySwapQuoteConsumer = ExchangeProxySwapQuoteConsumer;
function isBuyQuote(quote) {
    return quote.type === types_1.MarketOperation.Buy;
}
function isDirectSwapCompatible(quote, opts, directSources) {
    // Must not be a mtx.
    if (opts.isMetaTransaction) {
        return false;
    }
    // Must not have an affiliate fee.
    if (!opts.affiliateFee.buyTokenFeeAmount.eq(0) || !opts.affiliateFee.sellTokenFeeAmount.eq(0)) {
        return false;
    }
    // Must be a single order.
    if (quote.orders.length !== 1) {
        return false;
    }
    const order = quote.orders[0];
    // With a single underlying fill/source.
    if (order.fills.length !== 1) {
        return false;
    }
    const fill = order.fills[0];
    if (!directSources.includes(fill.source)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.js.map