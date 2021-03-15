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
const contracts_erc20_1 = require("@0x/contracts-erc20");
const contracts_zero_ex_1 = require("@0x/contracts-zero-ex");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const assert_1 = require("../utils/assert");
const constants_2 = require("../utils/market_operation_utils/constants");
const orders_1 = require("../utils/market_operation_utils/orders");
const types_2 = require("../utils/market_operation_utils/types");
const quote_consumer_utils_1 = require("./quote_consumer_utils");
// tslint:disable-next-line:custom-no-magic-numbers
const MAX_UINT256 = new utils_1.BigNumber(2).pow(256).minus(1);
const { NULL_ADDRESS, NULL_BYTES, ZERO_AMOUNT } = constants_1.constants;
const transformERC20Encoder = utils_1.AbiEncoder.create([
    {
        name: 'transformations',
        type: 'tuple[]',
        components: [{ name: 'deploymentNonce', type: 'uint32' }, { name: 'data', type: 'bytes' }],
    },
    { name: 'ethValue', type: 'uint256' },
]);
const rfqDataEncoder = utils_1.AbiEncoder.create([
    { name: 'order', type: 'tuple', components: protocol_utils_1.RfqOrder.STRUCT_ABI },
    { name: 'signature', type: 'tuple', components: protocol_utils_1.SIGNATURE_ABI },
]);
const uniswapDataEncoder = utils_1.AbiEncoder.create([
    { name: 'tokens', type: 'address[]' },
    { name: 'isSushi', type: 'bool' },
]);
const plpDataEncoder = utils_1.AbiEncoder.create([
    { name: 'provider', type: 'address' },
    { name: 'auxiliaryData', type: 'bytes' },
]);
class ExchangeProxySwapQuoteConsumer {
    constructor(supportedProvider, contractAddresses, options = {}) {
        this.contractAddresses = contractAddresses;
        const { chainId } = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        assert_1.assert.isNumber('chainId', chainId);
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        this.provider = provider;
        this.chainId = chainId;
        this.contractAddresses = contractAddresses;
        this._exchangeProxy = new contracts_zero_ex_1.IZeroExContract(contractAddresses.exchangeProxy, supportedProvider);
        this.transformerNonces = {
            wethTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.wethTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            payTakerTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.payTakerTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            fillQuoteTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.fillQuoteTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            affiliateFeeTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.affiliateFeeTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            positiveSlippageFeeTransformer: protocol_utils_1.findTransformerNonce(contractAddresses.transformers.positiveSlippageFeeTransformer, contractAddresses.exchangeProxyTransformerDeployer),
        };
    }
    getCalldataOrThrowAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
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
            // VIP routes.
            if (quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.UniswapV2, types_2.ERC20BridgeSource.SushiSwap])) {
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
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.LiquidityProvider])) {
                const fillData = quote.orders[0].fillData;
                const target = fillData.poolAddress;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, target, NULL_ADDRESS, sellAmount, minBuyAmount, NULL_BYTES)
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.Curve, types_2.ERC20BridgeSource.Swerve])) {
                const fillData = quote.orders[0].fills[0].fillData;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, constants_2.CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID[this.chainId], NULL_ADDRESS, sellAmount, minBuyAmount, protocol_utils_1.encodeCurveLiquidityProviderData({
                        curveAddress: fillData.pool.poolAddress,
                        exchangeFunctionSelector: fillData.pool.exchangeFunctionSelector,
                        fromCoinIdx: new utils_1.BigNumber(fillData.fromTokenIdx),
                        toCoinIdx: new utils_1.BigNumber(fillData.toTokenIdx),
                    }))
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.Mooniswap])) {
                const fillData = quote.orders[0].fills[0].fillData;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, constants_2.MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID[this.chainId], NULL_ADDRESS, sellAmount, minBuyAmount, orders_1.poolEncoder.encode([fillData.poolAddress]))
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this.contractAddresses.exchangeProxy,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (quote_consumer_utils_1.isMultiplexBatchFillCompatible(quote, optsWithDefaults)) {
                return {
                    calldataHexString: this._encodeMultiplexBatchFillCalldata(quote),
                    ethAmount,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (quote_consumer_utils_1.isMultiplexMultiHopFillCompatible(quote, optsWithDefaults)) {
                return {
                    calldataHexString: this._encodeMultiplexMultiHopFillCalldata(quote, optsWithDefaults),
                    ethAmount,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
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
            // If it's two hop we have an intermediate token this is needed to encode the individual FQT
            // and we also want to ensure no dust amount is left in the flash wallet
            const intermediateToken = quote.isTwoHop ? quote.orders[0].makerToken : NULL_ADDRESS;
            // This transformer will fill the quote.
            if (quote.isTwoHop) {
                const [firstHopOrder, secondHopOrder] = quote.orders;
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: protocol_utils_1.encodeFillQuoteTransformerData(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken, buyToken: intermediateToken }, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders([firstHopOrder]), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: shouldSellEntireBalance ? MAX_UINT256 : firstHopOrder.takerAmount })),
                });
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: protocol_utils_1.encodeFillQuoteTransformerData(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, buyToken, sellToken: intermediateToken }, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders([secondHopOrder]), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: MAX_UINT256 })),
                });
            }
            else {
                const fillAmount = quote_consumer_utils_1.isBuyQuote(quote) ? quote.makerTokenFillAmount : quote.takerTokenFillAmount;
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: protocol_utils_1.encodeFillQuoteTransformerData(Object.assign({ side: quote_consumer_utils_1.isBuyQuote(quote) ? protocol_utils_1.FillQuoteTransformerSide.Buy : protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken,
                        buyToken }, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders(quote.orders), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: !quote_consumer_utils_1.isBuyQuote(quote) && shouldSellEntireBalance ? MAX_UINT256 : fillAmount })),
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
            const { feeType, buyTokenFeeAmount, sellTokenFeeAmount, recipient: feeRecipient } = affiliateFee;
            let gasOverhead = ZERO_AMOUNT;
            if (feeType === types_1.AffiliateFeeType.PositiveSlippageFee && feeRecipient !== NULL_ADDRESS) {
                // bestCaseAmountWithSurplus is used to cover gas cost of sending positive slipapge fee to fee recipient
                // this helps avoid sending dust amounts which are not worth the gas cost to transfer
                let bestCaseAmountWithSurplus = quote.bestCaseQuoteInfo.makerAmount
                    .plus(constants_1.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS.multipliedBy(quote.gasPrice).multipliedBy(quote.makerAmountPerEth))
                    .integerValue();
                // In the event makerAmountPerEth is unknown, we only allow for positive slippage which is greater than
                // the best case amount
                bestCaseAmountWithSurplus = utils_1.BigNumber.max(bestCaseAmountWithSurplus, quote.bestCaseQuoteInfo.makerAmount);
                transforms.push({
                    deploymentNonce: this.transformerNonces.positiveSlippageFeeTransformer,
                    data: protocol_utils_1.encodePositiveSlippageFeeTransformerData({
                        token: isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken,
                        bestCaseAmount: utils_1.BigNumber.max(bestCaseAmountWithSurplus, quote.bestCaseQuoteInfo.makerAmount),
                        recipient: feeRecipient,
                    }),
                });
                // This may not be visible at eth_estimateGas time, so we explicitly add overhead
                gasOverhead = constants_1.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS;
            }
            else if (feeType === types_1.AffiliateFeeType.PercentageFee && feeRecipient !== NULL_ADDRESS) {
                // This transformer pays affiliate fees.
                if (buyTokenFeeAmount.isGreaterThan(0)) {
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
                if (sellTokenFeeAmount.isGreaterThan(0)) {
                    throw new Error('Affiliate fees denominated in sell token are not yet supported');
                }
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
                allowanceTarget: this._exchangeProxy.address,
                gasOverhead,
            };
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    executeSwapQuoteOrThrowAsync(_quote, _opts) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Execution not supported for Exchange Proxy quotes');
        });
    }
    _encodeMultiplexBatchFillCalldata(quote) {
        const multiplex = new contracts_zero_ex_1.MultiplexFeatureContract(NULL_ADDRESS, this.provider);
        const wrappedBatchCalls = [];
        for_loop: for (const [i, order] of quote.orders.entries()) {
            switch_statement: switch (order.source) {
                case types_2.ERC20BridgeSource.Native:
                    if (order.type !== protocol_utils_1.FillQuoteTransformerOrderType.Rfq) {
                        // Should never happen because we check `isMultiplexBatchFillCompatible`
                        // before calling this function.
                        throw new Error('Multiplex batch fill only supported for RFQ native orders');
                    }
                    wrappedBatchCalls.push({
                        selector: multiplex.getSelector('_fillRfqOrder'),
                        sellAmount: order.takerAmount,
                        data: rfqDataEncoder.encode({
                            order: order.fillData.order,
                            signature: order.fillData.signature,
                        }),
                    });
                    break switch_statement;
                case types_2.ERC20BridgeSource.UniswapV2:
                case types_2.ERC20BridgeSource.SushiSwap:
                    wrappedBatchCalls.push({
                        selector: multiplex.getSelector('_sellToUniswap'),
                        sellAmount: order.takerAmount,
                        data: uniswapDataEncoder.encode({
                            tokens: order.fillData.tokenAddressPath,
                            isSushi: order.source === types_2.ERC20BridgeSource.SushiSwap,
                        }),
                    });
                    break switch_statement;
                case types_2.ERC20BridgeSource.LiquidityProvider:
                    wrappedBatchCalls.push({
                        selector: multiplex.getSelector('_sellToLiquidityProvider'),
                        sellAmount: order.takerAmount,
                        data: plpDataEncoder.encode({
                            provider: order.fillData.poolAddress,
                            auxiliaryData: NULL_BYTES,
                        }),
                    });
                    break switch_statement;
                default:
                    const fqtData = protocol_utils_1.encodeFillQuoteTransformerData(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken: quote.takerToken, buyToken: quote.makerToken }, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders(quote.orders.slice(i)), { refundReceiver: NULL_ADDRESS, fillAmount: MAX_UINT256 }));
                    const transformations = [
                        { deploymentNonce: this.transformerNonces.fillQuoteTransformer, data: fqtData },
                        {
                            deploymentNonce: this.transformerNonces.payTakerTransformer,
                            data: protocol_utils_1.encodePayTakerTransformerData({
                                tokens: [quote.takerToken, quote.makerToken],
                                amounts: [],
                            }),
                        },
                    ];
                    wrappedBatchCalls.push({
                        selector: this._exchangeProxy.getSelector('_transformERC20'),
                        sellAmount: utils_1.BigNumber.sum(...quote.orders.slice(i).map(o => o.takerAmount)),
                        data: transformERC20Encoder.encode({
                            transformations,
                            ethValue: constants_1.constants.ZERO_AMOUNT,
                        }),
                    });
                    break for_loop;
            }
        }
        return this._exchangeProxy
            .batchFill({
            inputToken: quote.takerToken,
            outputToken: quote.makerToken,
            sellAmount: quote.worstCaseQuoteInfo.totalTakerAmount,
            calls: wrappedBatchCalls,
        }, quote.worstCaseQuoteInfo.makerAmount)
            .getABIEncodedTransactionData();
    }
    _encodeMultiplexMultiHopFillCalldata(quote, opts) {
        const multiplex = new contracts_zero_ex_1.MultiplexFeatureContract(NULL_ADDRESS, this.provider);
        const weth = new contracts_erc20_1.WETH9Contract(NULL_ADDRESS, this.provider);
        const wrappedMultiHopCalls = [];
        if (opts.isFromETH) {
            wrappedMultiHopCalls.push({
                selector: weth.getSelector('deposit'),
                data: NULL_BYTES,
            });
        }
        const [firstHopOrder, secondHopOrder] = quote.orders;
        const intermediateToken = firstHopOrder.makerToken;
        for (const order of [firstHopOrder, secondHopOrder]) {
            switch (order.source) {
                case types_2.ERC20BridgeSource.UniswapV2:
                case types_2.ERC20BridgeSource.SushiSwap:
                    wrappedMultiHopCalls.push({
                        selector: multiplex.getSelector('_sellToUniswap'),
                        data: uniswapDataEncoder.encode({
                            tokens: order.fillData.tokenAddressPath,
                            isSushi: order.source === types_2.ERC20BridgeSource.SushiSwap,
                        }),
                    });
                    break;
                case types_2.ERC20BridgeSource.LiquidityProvider:
                    wrappedMultiHopCalls.push({
                        selector: multiplex.getSelector('_sellToLiquidityProvider'),
                        data: plpDataEncoder.encode({
                            tokens: order.fillData.poolAddress,
                            auxiliaryData: NULL_BYTES,
                        }),
                    });
                    break;
                default:
                    // Note: we'll need to redeploy TransformERC20Feature before we can
                    //       use other sources
                    // Should never happen because we check `isMultiplexMultiHopFillCompatible`
                    // before calling this function.
                    throw new Error(`Multiplex multi-hop unsupported source: ${order.source}`);
            }
        }
        if (opts.isToETH) {
            wrappedMultiHopCalls.push({
                selector: weth.getSelector('withdraw'),
                data: NULL_BYTES,
            });
        }
        return this._exchangeProxy
            .multiHopFill({
            tokens: [quote.takerToken, intermediateToken, quote.makerToken],
            sellAmount: quote.worstCaseQuoteInfo.totalTakerAmount,
            calls: wrappedMultiHopCalls,
        }, quote.worstCaseQuoteInfo.makerAmount)
            .getABIEncodedTransactionData();
    }
}
exports.ExchangeProxySwapQuoteConsumer = ExchangeProxySwapQuoteConsumer;
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.js.map