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
const constants_1 = require("../constants");
const types_1 = require("../types");
const utils_2 = require("../utils/utils");
const constants_2 = require("../utils/market_operation_utils/constants");
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
const CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x561b94454b65614ae3db0897b74303f4acf7cc75',
    [contract_addresses_1.ChainId.Ropsten]: '0xae241c6fc7f28f6dc0cb58b4112ba7f63fcaf5e2',
}, NULL_ADDRESS);
const MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xa2033d6ba88756ce6a87584d69dc87bda9a4f889',
    [contract_addresses_1.ChainId.Ropsten]: '0x87e0393aee0fb8c10b8653c6507c182264fe5a34',
}, NULL_ADDRESS);
class ExchangeProxySwapQuoteConsumer {
    constructor(contractAddresses, options) {
        this.contractAddresses = contractAddresses;
        const { chainId } = options;
        this.chainId = chainId;
        this.contractAddresses = contractAddresses;
        this._exchangeProxy = new contract_wrappers_1.IZeroExContract(contractAddresses.exchangeProxy, FAKE_PROVIDER);
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
            // VIP routes.
            if (this.chainId === contract_addresses_1.ChainId.Mainnet &&
                quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.UniswapV2, types_2.ERC20BridgeSource.SushiSwap])) {
                const order = quote.hops[0].orders[0];
                const { source } = order;
                const { fillData } = order;
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
                quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.UniswapV3])) {
                const order = quote.hops[0].orders[0];
                const { fillData } = order;
                let _calldataHexString;
                if (isFromETH) {
                    _calldataHexString = this._exchangeProxy
                        .sellEthForTokenToUniswapV3(fillData.encodedPath, minBuyAmount, NULL_ADDRESS)
                        .getABIEncodedTransactionData();
                }
                else if (isToETH) {
                    _calldataHexString = this._exchangeProxy
                        .sellTokenForEthToUniswapV3(fillData.encodedPath, sellAmount, minBuyAmount, NULL_ADDRESS)
                        .getABIEncodedTransactionData();
                }
                else {
                    _calldataHexString = this._exchangeProxy
                        .sellTokenForTokenToUniswapV3(fillData.encodedPath, sellAmount, minBuyAmount, NULL_ADDRESS)
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
                quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [
                    types_2.ERC20BridgeSource.PancakeSwap,
                    types_2.ERC20BridgeSource.PancakeSwapV2,
                    types_2.ERC20BridgeSource.BakerySwap,
                    types_2.ERC20BridgeSource.SushiSwap,
                    types_2.ERC20BridgeSource.ApeSwap,
                    types_2.ERC20BridgeSource.CafeSwap,
                    types_2.ERC20BridgeSource.CheeseSwap,
                    types_2.ERC20BridgeSource.JulSwap,
                ])) {
                const order = quote.hops[0].orders[0];
                const { source, fillData } = order;
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
                quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.LiquidityProvider])) {
                const { fillData } = quote.hops[0].orders[0];
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, fillData.poolAddress, NULL_ADDRESS, sellAmount, minBuyAmount, NULL_BYTES)
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (this.chainId === contract_addresses_1.ChainId.Mainnet &&
                quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.Curve, types_2.ERC20BridgeSource.Swerve]) &&
                // Curve VIP cannot currently support WETH buy/sell as the functionality needs to WITHDRAW or DEPOSIT
                // into WETH prior/post the trade.
                // ETH buy/sell is supported
                ![sellToken, buyToken].includes(constants_2.NATIVE_FEE_TOKEN_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet])) {
                const { fillData } = quote.hops[0].orders[0];
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID[this.chainId], NULL_ADDRESS, sellAmount, minBuyAmount, protocol_utils_1.encodeCurveLiquidityProviderData({
                        curveAddress: fillData.poolAddress,
                        exchangeFunctionSelector: fillData.exchangeFunctionSelector,
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
                quote_consumer_utils_1.isDirectSwapCompatible(quote, optsWithDefaults, [types_2.ERC20BridgeSource.Mooniswap])) {
                const { fillData } = quote.hops[0].orders[0];
                return {
                    calldataHexString: this._exchangeProxy
                        .sellToLiquidityProvider(isFromETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : sellToken, isToETH ? protocol_utils_1.ETH_TOKEN_ADDRESS : buyToken, MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID[this.chainId], NULL_ADDRESS, sellAmount, minBuyAmount, encodeAddress(fillData.poolAddress))
                        .getABIEncodedTransactionData(),
                    ethAmount: isFromETH ? sellAmount : ZERO_AMOUNT,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this.contractAddresses.exchangeProxy,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            if (this.chainId === contract_addresses_1.ChainId.Mainnet && quote_consumer_utils_1.isMultiplexBatchFillCompatible(quote, optsWithDefaults)) {
                return {
                    calldataHexString: this._encodeMultiplexBatchFillCalldata(quote.hops[0], optsWithDefaults),
                    ethAmount,
                    toAddress: this._exchangeProxy.address,
                    allowanceTarget: this._exchangeProxy.address,
                    gasOverhead: ZERO_AMOUNT,
                };
            }
            // Sort hops so they always flow taker -> maker
            const orderedHops = quote_consumer_utils_1.isBuyQuote(quote) ? quote.hops.slice().reverse() : quote.hops;
            if (this.chainId === contract_addresses_1.ChainId.Mainnet && quote_consumer_utils_1.isMultiplexMultiHopFillCompatible(quote, optsWithDefaults)) {
                return {
                    calldataHexString: this._encodeMultiplexMultiHopFillCalldata(orderedHops, optsWithDefaults),
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
                    data: protocol_utils_1.encodeWethTransformerData({
                        token: protocol_utils_1.ETH_TOKEN_ADDRESS,
                        amount: shouldSellEntireBalance ? MAX_UINT256 : sellAmount,
                    }),
                });
            }
            for (const [i, hop] of orderedHops.entries()) {
                let fillAmount = !quote_consumer_utils_1.isBuyQuote(quote)
                    ? shouldSellEntireBalance ? MAX_UINT256 : hop.takerAmount
                    : hop.makerAmount;
                let side = !quote_consumer_utils_1.isBuyQuote(quote) ? protocol_utils_1.FillQuoteTransformerSide.Sell : protocol_utils_1.FillQuoteTransformerSide.Buy;
                if (orderedHops.length > 1) { // Multi-hop.
                    // Multi-hop is always a sell.
                    side = protocol_utils_1.FillQuoteTransformerSide.Sell;
                    // Subsequent multi-hops always sell entire balance.
                    fillAmount = i > 0 ? MAX_UINT256 : hop.takerAmount;
                }
                transforms.push({
                    deploymentNonce: this.transformerNonces.fillQuoteTransformer,
                    data: protocol_utils_1.encodeFillQuoteTransformerData(Object.assign(Object.assign({ side,
                        fillAmount, sellToken: hop.takerToken, buyToken: hop.makerToken }, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders(hop.orders)), { refundReceiver: refundReceiver || NULL_ADDRESS })),
                });
            }
            // Create a WETH unwrapper if going to ETH.
            // Dont add the wethTransformer on CELO. There is no wrap/unwrap logic for CELO.
            if (isToETH && this.chainId !== contract_addresses_1.ChainId.Celo) {
                transforms.push({
                    deploymentNonce: this.transformerNonces.wethTransformer,
                    data: protocol_utils_1.encodeWethTransformerData({
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
            // Return any unspent sell tokens.
            const payTakerTokens = [sellToken];
            // Return any unspent ETH. If ETH is the buy token, it will
            // be returned in TransformERC20Feature rather than PayTakerTransformer.
            if (!isToETH) {
                payTakerTokens.push(protocol_utils_1.ETH_TOKEN_ADDRESS);
            }
            // The final transformer will send all funds to the taker.
            transforms.push({
                deploymentNonce: this.transformerNonces.payTakerTransformer,
                data: protocol_utils_1.encodePayTakerTransformerData({
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
    _encodeMultiplexBatchFillCalldata(hop, opts) {
        const subcalls = this._getMultiplexBatchSellSubcalls(hop.orders);
        if (opts.isFromETH) {
            return this._exchangeProxy
                .multiplexBatchSellEthForToken(hop.makerToken, subcalls, hop.minMakerAmount)
                .getABIEncodedTransactionData();
        }
        else if (opts.isToETH) {
            return this._exchangeProxy
                .multiplexBatchSellTokenForEth(hop.takerToken, subcalls, hop.maxTakerAmount, hop.minMakerAmount)
                .getABIEncodedTransactionData();
        }
        else {
            return this._exchangeProxy
                .multiplexBatchSellTokenForToken(hop.takerToken, hop.makerToken, subcalls, hop.maxTakerAmount, hop.minMakerAmount)
                .getABIEncodedTransactionData();
        }
    }
    _encodeMultiplexMultiHopFillCalldata(hops, opts) {
        const subcalls = [];
        for (const hop of hops) {
            if (hop.orders.length !== 1) {
                subcalls.push({
                    id: multiplex_encoders_1.MultiplexSubcall.BatchSell,
                    data: multiplex_encoders_1.multiplexBatchSellEncoder.encode({ subcalls: this._getMultiplexBatchSellSubcalls(hop.orders) }),
                });
                continue;
            }
            const order = hop.orders[0];
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
                        data: order.fillData.encodedPath,
                    });
                    break;
                default:
                    // Should never happen because we check `isMultiplexMultiHopFillCompatible`
                    // before calling this function.
                    throw new Error(`Multiplex multi-hop unsupported source: ${order.source}`);
            }
        }
        const tokenPath = getTokenPathFromHops(hops);
        const firstHop = hops[0];
        const lastHop = hops[hops.length - 1];
        if (opts.isFromETH) {
            return this._exchangeProxy
                .multiplexMultiHopSellEthForToken(tokenPath, subcalls, lastHop.minMakerAmount)
                .getABIEncodedTransactionData();
        }
        else if (opts.isToETH) {
            return this._exchangeProxy
                .multiplexMultiHopSellTokenForEth(tokenPath, subcalls, firstHop.maxTakerAmount, lastHop.minMakerAmount)
                .getABIEncodedTransactionData();
        }
        else {
            return this._exchangeProxy
                .multiplexMultiHopSellTokenForToken(tokenPath, subcalls, firstHop.maxTakerAmount, lastHop.minMakerAmount)
                .getABIEncodedTransactionData();
        }
    }
    _getMultiplexBatchSellSubcalls(orders) {
        const subcalls = [];
        for_loop: for (const [i, order] of orders.entries()) {
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
                        sellAmount: order.maxTakerAmount,
                        data: multiplex_encoders_1.multiplexUniswapEncoder.encode({
                            tokens: order.fillData.tokenAddressPath,
                            isSushi: order.source === types_2.ERC20BridgeSource.SushiSwap,
                        }),
                    });
                    break switch_statement;
                case types_2.ERC20BridgeSource.LiquidityProvider:
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.LiquidityProvider,
                        sellAmount: order.maxTakerAmount,
                        data: multiplex_encoders_1.multiplexPlpEncoder.encode({
                            provider: order.fillData.poolAddress,
                            auxiliaryData: NULL_BYTES,
                        }),
                    });
                    break switch_statement;
                case types_2.ERC20BridgeSource.UniswapV3:
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.UniswapV3,
                        sellAmount: order.maxTakerAmount,
                        data: order.fillData.encodedPath,
                    });
                    break switch_statement;
                default:
                    const fqtData = protocol_utils_1.encodeFillQuoteTransformerData(Object.assign(Object.assign({ side: protocol_utils_1.FillQuoteTransformerSide.Sell, sellToken: order.takerToken, buyToken: order.makerToken }, quote_consumer_utils_1.getFQTTransformerDataFromOptimizedOrders(orders.slice(i))), { refundReceiver: NULL_ADDRESS, fillAmount: MAX_UINT256 }));
                    const transformations = [
                        { deploymentNonce: this.transformerNonces.fillQuoteTransformer, data: fqtData },
                        // TODO(lawrence): needed?
                        // {
                        //     deploymentNonce: this.transformerNonces.payTakerTransformer,
                        //     data: encodePayTakerTransformerData({
                        //         tokens: [hop.takerToken],
                        //         amounts: [],
                        //     }),
                        // },
                    ];
                    subcalls.push({
                        id: multiplex_encoders_1.MultiplexSubcall.TransformERC20,
                        sellAmount: utils_1.BigNumber.sum(...orders.slice(i)
                            .map(o => o.maxTakerAmount)),
                        data: multiplex_encoders_1.multiplexTransformERC20Encoder.encode({
                            transformations,
                        }),
                    });
                    break for_loop;
            }
        }
        return subcalls;
    }
}
exports.ExchangeProxySwapQuoteConsumer = ExchangeProxySwapQuoteConsumer;
function getTokenPathFromHops(hops) {
    const path = [];
    for (const [i, hop] of hops.entries()) {
        path.push(hop.takerToken);
        if (i === hops.length - 1) {
            path.push(hop.makerToken);
        }
    }
    return path;
}
function encodeAddress(address) {
    return utils_1.hexUtils.leftPad(utils_1.hexUtils.slice(address, 0, 20));
}
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.js.map