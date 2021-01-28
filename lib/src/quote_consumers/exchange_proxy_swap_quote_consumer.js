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
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const assert_1 = require("../utils/assert");
const orders_1 = require("../utils/market_operation_utils/orders");
const types_2 = require("../utils/market_operation_utils/types");
// tslint:disable-next-line:custom-no-magic-numbers
const MAX_UINT256 = new utils_1.BigNumber(2).pow(256).minus(1);
const { NULL_ADDRESS, NULL_BYTES, ZERO_AMOUNT } = constants_1.constants;
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
            wethTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.wethTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            payTakerTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.payTakerTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            fillQuoteTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.fillQuoteTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            affiliateFeeTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.affiliateFeeTransformer, contractAddresses.exchangeProxyTransformerDeployer),
        };
    }
    getCalldataOrThrowAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // assert.isValidSwapQuote('quote', quote);
            const optsWithDefaults = Object.assign({}, constants_1.constants.DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS, opts.extensionContractOpts);
            // tslint:disable-next-line:no-object-literal-type-assertion
            const { refundReceiver, affiliateFee, isFromETH, isToETH, shouldSellEntireBalance } = optsWithDefaults;
            const sellToken = quote.takerToken;
            const buyToken = quote.makerToken;
            // Take the bounds from the worst case
            const sellAmount = quote.worstCaseQuoteInfo.totalTakerAmount;
            let minBuyAmount = quote.worstCaseQuoteInfo.makerAmount;
            let ethAmount = quote.worstCaseQuoteInfo.protocolFeeInWeiAmount;
            if (isFromETH) {
                ethAmount = ethAmount.plus(sellAmount);
            }
            const { buyTokenFeeAmount, sellTokenFeeAmount, recipient: feeRecipient } = affiliateFee;
            // VIP routes.
            if (isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.UniswapV2, types_2.ERC20BridgeSource.SushiSwap])) {
                const source = quote.orders[0].source;
                const fillData = quote.orders[0].fillData;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToUniswap(fillData.tokenAddressPath.map((a, i) => {
                        if (i === 0 && isFromETH) {
                            return protocol_utils_1.ETH_TOKEN_ADDRESS;
                        }
                        if (i === fillData.tokenAddressPath.length - 1 && isToETH) {
                            return protocol_utils_1.ETH_TOKEN_ADDRESS;
                        }
                        return a;
                    }), sellAmount, minBuyAmount, source === types_2.ERC20BridgeSource.SushiSwap)
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this.contractAddresses.exchangeProxyAllowanceTarget,
                };
            }
            if (isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.LiquidityProvider])) {
                const fillData = quote.orders[0].fillData;
                const target = fillData.poolAddress;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, target, NULL_ADDRESS, sellAmount, minBuyAmount, NULL_BYTES)
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
                    data: protocol_utils_1.encodeWethTransformerData({
                        token: protocol_utils_1.ETH_TOKEN_ADDRESS,
                        amount: shouldSellEntireBalance ? MAX_UINT256 : sellAmount,
                    }),
                });
            }
            const intermediateToken = quote.isTwoHop ? quote.orders[0].makerToken : NULL_ADDRESS;
            // This transformer will fill the quote.
            if (quote.isTwoHop) {
                const [firstHopOrder, secondHopOrder] = quote.orders;
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: protocol_utils_1.encodeFillQuoteTransformerData(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken, buyToken: intermediateToken }, getFQTTransformerDataFromOptimizedOrders([firstHopOrder]), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: shouldSellEntireBalance ? MAX_UINT256 : firstHopOrder.takerAmount })),
                });
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: protocol_utils_1.encodeFillQuoteTransformerData(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, buyToken, sellToken: intermediateToken }, getFQTTransformerDataFromOptimizedOrders([secondHopOrder]), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: MAX_UINT256 })),
                });
            }
            else {
                const fillAmount = isBuyQuote(quote) ? quote.makerTokenFillAmount : quote.takerTokenFillAmount;
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: protocol_utils_1.encodeFillQuoteTransformerData(Object.assign({ side: isBuyQuote(quote) ? protocol_utils_1.FillQuoteTransformerSide.Buy : protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken,
                        buyToken }, getFQTTransformerDataFromOptimizedOrders(quote.orders), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: !isBuyQuote(quote) && shouldSellEntireBalance ? MAX_UINT256 : fillAmount })),
                });
            }
            if (isToETH) {
                // Create a WETH unwrapper if going to ETH.
                transforms.push({
                    deploymentNonce: this.transformerNonces.wethTransformer,
                    data: protocol_utils_1.encodeWethTransformerData({
                        token: this.contractAddresses.etherToken,
                        amount: MAX_UINT256,
                    }),
                });
            }
            // This transformer pays affiliate fees.
            if (buyTokenFeeAmount.isGreaterThan(0) && feeRecipient !== NULL_ADDRESS) {
                transforms.push({
                    deploymentNonce: this.transformerNonces.affiliateFeeTransformer,
                    data: protocol_utils_1.encodeAffiliateFeeTransformerData({
                        fees: [
                            {
                                token: isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken,
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
                data: protocol_utils_1.encodePayTakerTransformerData({
                    tokens: [sellToken, buyToken, protocol_utils_1.ETH_TOKEN_ADDRESS].concat(quote.isTwoHop ? intermediateToken : []),
                    amounts: [],
                }),
            });
            const calldataHexString = this._exchangeProxy
                .transformERC20(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, shouldSellEntireBalance ? MAX_UINT256 : sellAmount, minBuyAmount, transforms)
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
    if (!directSources.includes(order.source)) {
        return false;
    }
    // VIP does not support selling the entire balance
    if (opts.shouldSellEntireBalance) {
        return false;
    }
    return true;
}
function getFQTTransformerDataFromOptimizedOrders(orders) {
    const fqtData = {
        bridgeOrders: [],
        limitOrders: [],
        rfqOrders: [],
        fillSequence: [],
    };
    for (const order of orders) {
        switch (order.type) {
            case protocol_utils_1.FillQuoteTransformerOrderType.Bridge:
                // remap human readable sources into the ints required in FQT
                // tslint:disable-next-line: no-object-literal-type-assertion
                fqtData.bridgeOrders.push({
                    bridgeData: orders_1.createBridgeDataForBridgeOrder(order),
                    makerTokenAmount: order.makerAmount,
                    takerTokenAmount: order.takerAmount,
                    source: orders_1.getERC20BridgeSourceToBridgeSource(order.source),
                });
                break;
            case protocol_utils_1.FillQuoteTransformerOrderType.Rfq:
                const rfqData = order.fillData;
                fqtData.rfqOrders.push({
                    order: rfqData.order,
                    signature: rfqData.signature,
                    maxTakerTokenFillAmount: order.takerAmount,
                });
                break;
            case protocol_utils_1.FillQuoteTransformerOrderType.Limit:
                const limitData = order.fillData;
                fqtData.limitOrders.push({
                    order: limitData.order,
                    signature: limitData.signature,
                    maxTakerTokenFillAmount: order.takerAmount,
                });
                break;
            default:
                // Should never happen
                throw new Error('Unknown Order type');
        }
        fqtData.fillSequence.push(order.type);
    }
    return fqtData;
}
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.js.map