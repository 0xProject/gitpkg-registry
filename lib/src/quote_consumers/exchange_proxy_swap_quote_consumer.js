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
exports.ExchangeProxySwapQuoteConsumer = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const contract_wrappers_1 = require("@0x/contract-wrappers");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const assert_1 = require("../utils/assert");
const constants_2 = require("../utils/market_operation_utils/constants");
const orders_1 = require("../utils/market_operation_utils/orders");
const types_2 = require("../utils/market_operation_utils/types");
const multiplex_encoders_1 = require("./multiplex_encoders");
const quote_consumer_utils_1 = require("./quote_consumer_utils");
// tslint:disable-next-line:custom-no-magic-numbers
const MAX_UINT256 = new utils_1.BigNumber(2).pow(256).minus(1);
const { NULL_ADDRESS, NULL_BYTES, ZERO_AMOUNT } = constants_1.constants;
// use the same order in IPancakeSwapFeature.sol
const PANCAKE_SWAP_FORKS = [
    types_2.ERC20BridgeSource.PancakeSwap,
    types_2.ERC20BridgeSource.PancakeSwapV2,
    types_2.ERC20BridgeSource.BakerySwap,
    types_2.ERC20BridgeSource.SushiSwap,
    types_2.ERC20BridgeSource.ApeSwap,
    types_2.ERC20BridgeSource.CafeSwap,
    types_2.ERC20BridgeSource.CheeseSwap,
    types_2.ERC20BridgeSource.JulSwap,
];
const FAKE_PROVIDER = {
    sendAsync() {
        return;
    },
};
class ExchangeProxySwapQuoteConsumer {
    constructor(contractAddresses, options = {}) {
        this.contractAddresses = contractAddresses;
        const { chainId } = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        assert_1.assert.isNumber('chainId', chainId);
        this.chainId = chainId;
        this.contractAddresses = contractAddresses;
        this._exchangeProxy = new contract_wrappers_1.IZeroExContract(contractAddresses.exchangeProxy, FAKE_PROVIDER);
        this.transformerNonces = {
            wethTransformer: (0, protocol_utils_1.findTransformerNonce)(contractAddresses.transformers.wethTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            payTakerTransformer: (0, protocol_utils_1.findTransformerNonce)(contractAddresses.transformers.payTakerTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            fillQuoteTransformer: (0, protocol_utils_1.findTransformerNonce)(contractAddresses.transformers.fillQuoteTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            affiliateFeeTransformer: (0, protocol_utils_1.findTransformerNonce)(contractAddresses.transformers.affiliateFeeTransformer, contractAddresses.exchangeProxyTransformerDeployer),
            positiveSlippageFeeTransformer: (0, protocol_utils_1.findTransformerNonce)(contractAddresses.transformers.positiveSlippageFeeTransformer, contractAddresses.exchangeProxyTransformerDeployer),
        };
    }
    getCalldataOrThrowAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const optsWithDefaults = Object.assign(Object.assign({}, constants_1.constants.DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS), opts.extensionContractOpts);
            // tslint:disable-next-line:no-object-literal-type-assertion
            const { refundReceiver, affiliateFee, isFromETH, isToETH, shouldSellEntireBalance } = optsWithDefaults;
            const sellToken = quote.takerToken;
            const buyToken = quote.makerToken;
            // Take the bounds from the worst case
            const sellAmount = utils_1.BigNumber.max(quote.bestCaseQuoteInfo.totalTakerAmount, quote.worstCaseQuoteInfo.totalTakerAmount);
            let minBuyAmount = quote.worstCaseQuoteInfo.makerAmount;
            let ethAmount = quote.worstCaseQuoteInfo.protocolFeeInWeiAmount;
            if (isFromETH) {
                ethAmount = ethAmount.plus(sellAmount);
            }
            const slippedOrders = slipNonNativeOrders(quote);
            // VIP routes.
            if (this.chainId === contract_addresses_1.ChainId.Mainnet &&
                (0, quote_consumer_utils_1.isDirectSwapCompatible)(quote, optsWithDefaults, [types_2.ERC20BridgeSource.UniswapV2, types_2.ERC20BridgeSource.SushiSwap])) {
                const source = slippedOrders[0].source;
                const fillData = slippedOrders[0].fillData;
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
            if (this.chainId === contract_addresses_1.ChainId.Mainnet &&
                (0, quote_consumer_utils_1.isDirectSwapCompatible)(quote, optsWithDefaults, [types_2.ERC20BridgeSource.UniswapV3])) {
                const fillData = slippedOrders[0].fillData;
                let _calldataHexString;
                if (isFromETH) {
                    _calldataHexString = this._exchangeProxy
                        .sellEthForTokenToUniswapV3(fillData.uniswapPath, minBuyAmount, NULL_ADDRESS)
                        .getABIEncodedTransactionData();
                }
                else if (isToETH) {
                    _calldataHexString = this._exchangeProxy
                        .sellTokenForEthToUniswapV3(fillData.uniswapPath, sellAmount, minBuyAmount, NULL_ADDRESS)
                        .getABIEncodedTransactionData();
                }
                else {
                    _calldataHexString = this._exchangeProxy
                        .sellTokenForTokenToUniswapV3(fillData.uniswapPath, sellAmount, minBuyAmount, NULL_ADDRESS)
                        .getABIEncodedTransactionData();
                }
                return {
                    calldataHexString: _calldataHexString,
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (this.chainId === contract_addresses_1.ChainId.BSC &&
                (0, quote_consumer_utils_1.isDirectSwapCompatible)(quote, optsWithDefaults, [
                    types_2.ERC20BridgeSource.PancakeSwap,
                    types_2.ERC20BridgeSource.PancakeSwapV2,
                    types_2.ERC20BridgeSource.BakerySwap,
                    types_2.ERC20BridgeSource.SushiSwap,
                    types_2.ERC20BridgeSource.ApeSwap,
                    types_2.ERC20BridgeSource.CafeSwap,
                    types_2.ERC20BridgeSource.CheeseSwap,
                    types_2.ERC20BridgeSource.JulSwap,
                ])) {
                const source = slippedOrders[0].source;
                const fillData = slippedOrders[0].fillData;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToPancakeSwap(fillData.tokenAddressPath.map((a, i) => {
                        if (i === 0 && isFromETH) {
                            return protocol_utils_1.ETH_TOKEN_ADDRESS;
                        }
                        if (i === fillData.tokenAddressPath.length - 1 && isToETH) {
                            return protocol_utils_1.ETH_TOKEN_ADDRESS;
                        }
                        return a;
                    }), sellAmount, minBuyAmount, PANCAKE_SWAP_FORKS.indexOf(source))
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if ([contract_addresses_1.ChainId.Mainnet, contract_addresses_1.ChainId.BSC].includes(this.chainId) &&
                (0, quote_consumer_utils_1.isDirectSwapCompatible)(quote, optsWithDefaults, [types_2.ERC20BridgeSource.LiquidityProvider])) {
                const fillData = slippedOrders[0].fillData;
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
            if (this.chainId === contract_addresses_1.ChainId.Mainnet &&
                (0, quote_consumer_utils_1.isDirectSwapCompatible)(quote, optsWithDefaults, [types_2.ERC20BridgeSource.Curve, types_2.ERC20BridgeSource.Swerve]) &&
                // Curve VIP cannot currently support WETH buy/sell as the functionality needs to WITHDRAW or DEPOSIT
                // into WETH prior/post the trade.
                // ETH buy/sell is supported
                ![sellToken, buyToken].includes(constants_2.NATIVE_FEE_TOKEN_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet])) {
                const fillData = slippedOrders[0].fills[0].fillData;
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, constants_2.CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID[this.chainId], NULL_ADDRESS, sellAmount, minBuyAmount, (0, protocol_utils_1.encodeCurveLiquidityProviderData)({
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
            if (this.chainId === contract_addresses_1.ChainId.Mainnet &&
                (0, quote_consumer_utils_1.isDirectSwapCompatible)(quote, optsWithDefaults, [types_2.ERC20BridgeSource.Mooniswap])) {
                const fillData = slippedOrders[0].fills[0].fillData;
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
            // RFQT VIP
            if ([contract_addresses_1.ChainId.Mainnet, contract_addresses_1.ChainId.Polygon].includes(this.chainId) &&
                !isToETH &&
                !isFromETH &&
                quote.orders.every(o => o.type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq) &&
                !(0, quote_consumer_utils_1.requiresTransformERC20)(optsWithDefaults)) {
                const rfqOrdersData = quote.orders.map(o => o.fillData);
                const fillAmountPerOrder = (() => {
                    // Don't think order taker amounts are clipped to actual sell amount
                    // (the last one might be too large) so figure them out manually.
                    let remaining = sellAmount;
                    const fillAmounts = [];
                    for (const o of quote.orders) {
                        const fillAmount = utils_1.BigNumber.min(o.takerAmount, remaining);
                        fillAmounts.push(fillAmount);
                        remaining = remaining.minus(fillAmount);
                    }
                    return fillAmounts;
                })();
                const callData = quote.orders.length === 1
                    ? this._exchangeProxy
                        .fillRfqOrder(rfqOrdersData[0].order, rfqOrdersData[0].signature, fillAmountPerOrder[0])
                        .getABIEncodedTransactionData()
                    : this._exchangeProxy
                        .batchFillRfqOrders(rfqOrdersData.map(d => d.order), rfqOrdersData.map(d => d.signature), fillAmountPerOrder, true)
                        .getABIEncodedTransactionData();
                return {
                    calldataHexString: callData,
                    ethAmount: ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (this.chainId === contract_addresses_1.ChainId.Mainnet && (0, quote_consumer_utils_1.isMultiplexBatchFillCompatible)(quote, optsWithDefaults)) {
                return {
                    calldataHexString: this._encodeMultiplexBatchFillCalldata(Object.assign(Object.assign({}, quote), { orders: slippedOrders }), optsWithDefaults),
                    ethAmount,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (this.chainId === contract_addresses_1.ChainId.Mainnet && (0, quote_consumer_utils_1.isMultiplexMultiHopFillCompatible)(quote, optsWithDefaults)) {
                return {
                    calldataHexString: this._encodeMultiplexMultiHopFillCalldata(Object.assign(Object.assign({}, quote), { orders: slippedOrders }), optsWithDefaults),
                    ethAmount,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            // Build up the transforms.
            const transforms = [];
            // Create a WETH wrapper if coming from ETH.
            // Dont add the wethTransformer to CELO. There is no wrap/unwrap logic for CELO.
            if (isFromETH && this.chainId !== contract_addresses_1.ChainId.Celo) {
                transforms.push({
                    deploymentNonce: this.transformerNonces.wethTransformer,
                    data: (0, protocol_utils_1.encodeWethTransformerData)({
                        token: protocol_utils_1.ETH_TOKEN_ADDRESS,
                        amount: shouldSellEntireBalance ? MAX_UINT256 : sellAmount,
                    }),
                });
            }
            // If it's two hop we have an intermediate token this is needed to encode the individual FQT
            // and we also want to ensure no dust amount is left in the flash wallet
            const intermediateToken = quote.isTwoHop ? slippedOrders[0].makerToken : NULL_ADDRESS;
            // This transformer will fill the quote.
            if (quote.isTwoHop) {
                const [firstHopOrder, secondHopOrder] = slippedOrders;
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: (0, protocol_utils_1.encodeFillQuoteTransformerData)(Object.assign(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken, buyToken: intermediateToken }, (0, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders)([firstHopOrder])), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: shouldSellEntireBalance ? MAX_UINT256 : firstHopOrder.takerAmount })),
                });
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: (0, protocol_utils_1.encodeFillQuoteTransformerData)(Object.assign(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, buyToken, sellToken: intermediateToken }, (0, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders)([secondHopOrder])), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: MAX_UINT256 })),
                });
            }
            else {
                const fillAmount = (0, quote_consumer_utils_1.isBuyQuote)(quote) ? quote.makerTokenFillAmount : quote.takerTokenFillAmount;
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: (0, protocol_utils_1.encodeFillQuoteTransformerData)(Object.assign(Object.assign({ side: (0, quote_consumer_utils_1.isBuyQuote)(quote) ? protocol_utils_1.FillQuoteTransformerSide.Buy : protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken,
                        buyToken }, (0, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders)(slippedOrders)), { refundReceiver: refundReceiver || NULL_ADDRESS, fillAmount: !(0, quote_consumer_utils_1.isBuyQuote)(quote) && shouldSellEntireBalance ? MAX_UINT256 : fillAmount })),
                });
            }
            // Create a WETH unwrapper if going to ETH.
            // Dont add the wethTransformer on CELO. There is no wrap/unwrap logic for CELO.
            if (isToETH && this.chainId !== contract_addresses_1.ChainId.Celo) {
                transforms.push({
                    deploymentNonce: this.transformerNonces.wethTransformer,
                    data: (0, protocol_utils_1.encodeWethTransformerData)({
                        token: constants_2.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId],
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
                    data: (0, protocol_utils_1.encodePositiveSlippageFeeTransformerData)({
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
                        data: (0, protocol_utils_1.encodeAffiliateFeeTransformerData)({
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
            // Return any unspent sell tokens.
            const payTakerTokens = [sellToken];
            // Return any unspent intermediate tokens for two-hop swaps.
            if (quote.isTwoHop) {
                payTakerTokens.push(intermediateToken);
            }
            // Return any unspent ETH. If ETH is the buy token, it will
            // be returned in TransformERC20Feature rather than PayTakerTransformer.
            if (!isToETH) {
                payTakerTokens.push(protocol_utils_1.ETH_TOKEN_ADDRESS);
            }
            // The final transformer will send all funds to the taker.
            transforms.push({
                deploymentNonce: this.transformerNonces.payTakerTransformer,
                data: (0, protocol_utils_1.encodePayTakerTransformerData)({
                    tokens: payTakerTokens,
                    amounts: [],
                }),
            });
            const TO_ETH_ADDRESS = this.chainId === contract_addresses_1.ChainId.Celo ? this.contractAddresses.etherToken : protocol_utils_1.ETH_TOKEN_ADDRESS;
            const calldataHexString = this._exchangeProxy
                .transformERC20(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? TO_ETH_ADDRESS : buyToken, shouldSellEntireBalance ? MAX_UINT256 : sellAmount, minBuyAmount, transforms)
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
    _encodeMultiplexBatchFillCalldata(quote, opts) {
        const subcalls = [];
        for_loop: for (const [i, order] of quote.orders.entries()) {
            switch_statement: switch (order.source) {
                case types_2.ERC20BridgeSource.Native:
                    if (order.type !== protocol_utils_1.FillQuoteTransformerOrderType.Rfq) {
                        // Should never happen because we check `isMultiplexBatchFillCompatible`
                        // before calling this function.
                        throw new Error('Multiplex batch fill only supported for RFQ native orders');
                    }
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.Rfq,
                        sellAmount: order.takerAmount,
                        data: multiplex_encoders_1.multiplexRfqEncoder.encode({
                            order: order.fillData.order,
                            signature: order.fillData.signature,
                        }),
                    });
                    break switch_statement;
                case types_2.ERC20BridgeSource.UniswapV2:
                case types_2.ERC20BridgeSource.SushiSwap:
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.UniswapV2,
                        sellAmount: order.takerAmount,
                        data: multiplex_encoders_1.multiplexUniswapEncoder.encode({
                            tokens: order.fillData.tokenAddressPath,
                            isSushi: order.source === types_2.ERC20BridgeSource.SushiSwap,
                        }),
                    });
                    break switch_statement;
                case types_2.ERC20BridgeSource.LiquidityProvider:
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.LiquidityProvider,
                        sellAmount: order.takerAmount,
                        data: multiplex_encoders_1.multiplexPlpEncoder.encode({
                            provider: order.fillData.poolAddress,
                            auxiliaryData: NULL_BYTES,
                        }),
                    });
                    break switch_statement;
                case types_2.ERC20BridgeSource.UniswapV3:
                    const fillData = order.fillData;
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.UniswapV3,
                        sellAmount: order.takerAmount,
                        data: fillData.uniswapPath,
                    });
                    break switch_statement;
                default:
                    const fqtData = (0, protocol_utils_1.encodeFillQuoteTransformerData)(Object.assign(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken: quote.takerToken, buyToken: quote.makerToken }, (0, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders)(quote.orders.slice(i))), { refundReceiver: NULL_ADDRESS, fillAmount: MAX_UINT256 }));
                    const transformations = [
                        { deploymentNonce: this.transformerNonces.fillQuoteTransformer, data: fqtData },
                        {
                            deploymentNonce: this.transformerNonces.payTakerTransformer,
                            data: (0, protocol_utils_1.encodePayTakerTransformerData)({
                                tokens: [quote.takerToken],
                                amounts: [],
                            }),
                        },
                    ];
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.TransformERC20,
                        sellAmount: utils_1.BigNumber.sum(...quote.orders.slice(i).map(o => o.takerAmount)),
                        data: multiplex_encoders_1.multiplexTransformERC20Encoder.encode({
                            transformations,
                        }),
                    });
                    break for_loop;
            }
        }
        if (opts.isFromETH) {
            return this._exchangeProxy
                .multiplexBatchSellEthForToken(quote.makerToken, subcalls, quote.worstCaseQuoteInfo.makerAmount)
                .getABIEncodedTransactionData();
        }
        else if (opts.isToETH) {
            return this._exchangeProxy
                .multiplexBatchSellTokenForEth(quote.takerToken, subcalls, quote.worstCaseQuoteInfo.totalTakerAmount, quote.worstCaseQuoteInfo.makerAmount)
                .getABIEncodedTransactionData();
        }
        else {
            return this._exchangeProxy
                .multiplexBatchSellTokenForToken(quote.takerToken, quote.makerToken, subcalls, quote.worstCaseQuoteInfo.totalTakerAmount, quote.worstCaseQuoteInfo.makerAmount)
                .getABIEncodedTransactionData();
        }
    }
    _encodeMultiplexMultiHopFillCalldata(quote, opts) {
        const subcalls = [];
        const [firstHopOrder, secondHopOrder] = quote.orders;
        const intermediateToken = firstHopOrder.makerToken;
        const tokens = [quote.takerToken, intermediateToken, quote.makerToken];
        for (const order of [firstHopOrder, secondHopOrder]) {
            switch (order.source) {
                case types_2.ERC20BridgeSource.UniswapV2:
                case types_2.ERC20BridgeSource.SushiSwap:
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.UniswapV2,
                        data: multiplex_encoders_1.multiplexUniswapEncoder.encode({
                            tokens: order.fillData.tokenAddressPath,
                            isSushi: order.source === types_2.ERC20BridgeSource.SushiSwap,
                        }),
                    });
                    break;
                case types_2.ERC20BridgeSource.LiquidityProvider:
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.LiquidityProvider,
                        data: multiplex_encoders_1.multiplexPlpEncoder.encode({
                            provider: order.fillData.poolAddress,
                            auxiliaryData: NULL_BYTES,
                        }),
                    });
                    break;
                case types_2.ERC20BridgeSource.UniswapV3:
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.UniswapV3,
                        data: order.fillData.uniswapPath,
                    });
                    break;
                default:
                    // Should never happen because we check `isMultiplexMultiHopFillCompatible`
                    // before calling this function.
                    throw new Error(`Multiplex multi-hop unsupported source: ${order.source}`);
            }
        }
        if (opts.isFromETH) {
            return this._exchangeProxy
                .multiplexMultiHopSellEthForToken(tokens, subcalls, quote.worstCaseQuoteInfo.makerAmount)
                .getABIEncodedTransactionData();
        }
        else if (opts.isToETH) {
            return this._exchangeProxy
                .multiplexMultiHopSellTokenForEth(tokens, subcalls, quote.worstCaseQuoteInfo.totalTakerAmount, quote.worstCaseQuoteInfo.makerAmount)
                .getABIEncodedTransactionData();
        }
        else {
            return this._exchangeProxy
                .multiplexMultiHopSellTokenForToken(tokens, subcalls, quote.worstCaseQuoteInfo.totalTakerAmount, quote.worstCaseQuoteInfo.makerAmount)
                .getABIEncodedTransactionData();
        }
    }
}
exports.ExchangeProxySwapQuoteConsumer = ExchangeProxySwapQuoteConsumer;
function slipNonNativeOrders(quote) {
    const slippage = getMaxQuoteSlippageRate(quote);
    if (slippage === 0) {
        return quote.orders;
    }
    return quote.orders.map(o => {
        if (o.source === types_2.ERC20BridgeSource.Native) {
            return o;
        }
        return Object.assign(Object.assign({}, o), (quote.type === types_1.MarketOperation.Sell
            ? {
                makerAmount: o.makerAmount.eq(MAX_UINT256)
                    ? MAX_UINT256
                    : o.makerAmount.times(1 - slippage).integerValue(utils_1.BigNumber.ROUND_DOWN),
            }
            : {
                takerAmount: o.takerAmount.eq(MAX_UINT256)
                    ? MAX_UINT256
                    : o.takerAmount.times(1 + slippage).integerValue(utils_1.BigNumber.ROUND_UP),
            }));
    });
}
function getMaxQuoteSlippageRate(quote) {
    return quote.worstCaseQuoteInfo.slippage;
}
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.js.map