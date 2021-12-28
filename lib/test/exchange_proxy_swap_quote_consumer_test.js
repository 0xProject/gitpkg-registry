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
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const chai = require("chai");
const _ = require("lodash");
require("mocha");
const constants_1 = require("../src/constants");
const exchange_proxy_swap_quote_consumer_1 = require("../src/quote_consumers/exchange_proxy_swap_quote_consumer");
const types_1 = require("../src/types");
const types_2 = require("../src/utils/market_operation_utils/types");
const chai_setup_1 = require("./utils/chai_setup");
const utils_2 = require("./utils/utils");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const { NULL_ADDRESS } = constants_1.constants;
const { MAX_UINT256, ZERO_AMOUNT } = contracts_test_utils_1.constants;
// tslint:disable: custom-no-magic-numbers
describe('ExchangeProxySwapQuoteConsumer', () => {
    const CHAIN_ID = 1;
    const TAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const MAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const INTERMEDIATE_TOKEN = contracts_test_utils_1.randomAddress();
    const TRANSFORMER_DEPLOYER = contracts_test_utils_1.randomAddress();
    const contractAddresses = Object.assign(Object.assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID)), { exchangeProxy: contracts_test_utils_1.randomAddress(), exchangeProxyAllowanceTarget: contracts_test_utils_1.randomAddress(), exchangeProxyTransformerDeployer: TRANSFORMER_DEPLOYER, transformers: {
            wethTransformer: protocol_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 1),
            payTakerTransformer: protocol_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 2),
            fillQuoteTransformer: protocol_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 3),
            affiliateFeeTransformer: protocol_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 4),
            positiveSlippageFeeTransformer: protocol_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 5),
        } });
    let consumer;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        consumer = new exchange_proxy_swap_quote_consumer_1.ExchangeProxySwapQuoteConsumer(contractAddresses, { chainId: CHAIN_ID });
    }));
    function getRandomOrder(orderFields) {
        return Object.assign({ chainId: CHAIN_ID, verifyingContract: contractAddresses.exchangeProxy, expiry: contracts_test_utils_1.getRandomInteger(1, 2e9), feeRecipient: contracts_test_utils_1.randomAddress(), sender: contracts_test_utils_1.randomAddress(), pool: utils_1.hexUtils.random(32), maker: contracts_test_utils_1.randomAddress(), makerAmount: utils_2.getRandomAmount(), takerAmount: utils_2.getRandomAmount(), takerTokenFeeAmount: utils_2.getRandomAmount(), salt: utils_2.getRandomAmount(2e9), taker: NULL_ADDRESS, makerToken: MAKER_TOKEN, takerToken: TAKER_TOKEN }, orderFields);
    }
    function getRandomOptimizedMarketOrder(optimizerFields, orderFields) {
        const order = getRandomOrder(orderFields);
        return Object.assign({ source: types_2.ERC20BridgeSource.Native, fillData: {
                order,
                signature: utils_2.getRandomSignature(),
                maxTakerTokenFillAmount: order.takerAmount,
            }, type: protocol_utils_1.FillQuoteTransformerOrderType.Limit, makerToken: order.makerToken, takerToken: order.takerToken, makerAmount: order.makerAmount, takerAmount: order.takerAmount, fills: [] }, optimizerFields);
    }
    function getRandomQuote(side) {
        const order = getRandomOptimizedMarketOrder();
        const makerTokenFillAmount = order.makerAmount;
        const takerTokenFillAmount = order.takerAmount;
        return Object.assign({ gasPrice: contracts_test_utils_1.getRandomInteger(1, 1e9), makerToken: MAKER_TOKEN, takerToken: TAKER_TOKEN, orders: [order], makerTokenDecimals: 18, takerTokenDecimals: 18, sourceBreakdown: {}, isTwoHop: false, bestCaseQuoteInfo: {
                makerAmount: makerTokenFillAmount,
                takerAmount: takerTokenFillAmount,
                totalTakerAmount: takerTokenFillAmount,
                gas: Math.floor(Math.random() * 8e6),
                protocolFeeInWeiAmount: utils_2.getRandomAmount(),
                feeTakerTokenAmount: utils_2.getRandomAmount(),
            }, worstCaseQuoteInfo: {
                makerAmount: makerTokenFillAmount,
                takerAmount: takerTokenFillAmount,
                totalTakerAmount: takerTokenFillAmount,
                gas: Math.floor(Math.random() * 8e6),
                protocolFeeInWeiAmount: utils_2.getRandomAmount(),
                feeTakerTokenAmount: utils_2.getRandomAmount(),
            }, makerAmountPerEth: contracts_test_utils_1.getRandomInteger(1, 1e9), takerAmountPerEth: contracts_test_utils_1.getRandomInteger(1, 1e9) }, (side === types_1.MarketOperation.Buy
            ? { type: types_1.MarketOperation.Buy, makerTokenFillAmount }
            : { type: types_1.MarketOperation.Sell, takerTokenFillAmount }));
    }
    function getRandomTwoHopQuote(side) {
        return Object.assign(Object.assign({}, getRandomQuote(side)), { orders: [
                getRandomOptimizedMarketOrder({ makerToken: INTERMEDIATE_TOKEN }, { makerToken: INTERMEDIATE_TOKEN }),
                getRandomOptimizedMarketOrder({ takerToken: INTERMEDIATE_TOKEN }, { takerToken: INTERMEDIATE_TOKEN }),
            ], isTwoHop: true });
    }
    function getRandomSellQuote() {
        return getRandomQuote(types_1.MarketOperation.Sell);
    }
    function getRandomBuyQuote() {
        return getRandomQuote(types_1.MarketOperation.Buy);
    }
    function cleanOrders(orders) {
        return orders.map(o => _.omit(Object.assign(Object.assign({}, o.fillData), { order: _.omit(o.fillData.order, [
                'chainId',
                'verifyingContract',
            ]) }), [
            'fillableMakerAssetAmount',
            'fillableTakerAssetAmount',
            'fillableTakerFeeAmount',
            'fills',
            'chainId',
            'verifyingContract',
        ]));
    }
    const transformERC20Encoder = utils_1.AbiEncoder.createMethod('transformERC20', [
        { type: 'address', name: 'inputToken' },
        { type: 'address', name: 'outputToken' },
        { type: 'uint256', name: 'inputTokenAmount' },
        { type: 'uint256', name: 'minOutputTokenAmount' },
        {
            type: 'tuple[]',
            name: 'transformations',
            components: [
                { type: 'uint32', name: 'deploymentNonce' },
                { type: 'bytes', name: 'data' },
            ],
        },
    ]);
    // const liquidityProviderEncoder = AbiEncoder.createMethod('sellToLiquidityProvider', [
    //     { type: 'address', name: 'inputToken' },
    //     { type: 'address', name: 'outputToken' },
    //     { type: 'address', name: 'target' },
    //     { type: 'address', name: 'recipient' },
    //     { type: 'uint256', name: 'sellAmount' },
    //     { type: 'uint256', name: 'minBuyAmount' },
    //     { type: 'bytes', name: 'auxiliaryData' },
    // ]);
    // interface LiquidityProviderArgs {
    //     inputToken: string;
    //     outputToken: string;
    //     target: string;
    //     recipient: string;
    //     sellAmount: BigNumber;
    //     minBuyAmount: BigNumber;
    //     auxiliaryData: string;
    // }
    describe('getCalldataOrThrow()', () => {
        it('can produce a sell quote', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote);
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
            expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
            expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAmount);
            expect(callArgs.minOutputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.makerAmount);
            expect(callArgs.transformations).to.be.length(2);
            expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                consumer.transformerNonces.payTakerTransformer);
            const fillQuoteTransformerData = protocol_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
            expect(fillQuoteTransformerData.side).to.eq(protocol_utils_1.FillQuoteTransformerSide.Sell);
            expect(fillQuoteTransformerData.fillAmount).to.bignumber.eq(quote.takerTokenFillAmount);
            expect(fillQuoteTransformerData.limitOrders).to.deep.eq(cleanOrders(quote.orders));
            expect(fillQuoteTransformerData.limitOrders.map(o => o.signature)).to.deep.eq(quote.orders.map(o => o.fillData.signature));
            expect(fillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
            expect(fillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
            const payTakerTransformerData = protocol_utils_1.decodePayTakerTransformerData(callArgs.transformations[1].data);
            expect(payTakerTransformerData.amounts).to.deep.eq([]);
            expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, protocol_utils_1.ETH_TOKEN_ADDRESS]);
        }));
        it('can produce a buy quote', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomBuyQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote);
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
            expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
            expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAmount);
            expect(callArgs.minOutputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.makerAmount);
            expect(callArgs.transformations).to.be.length(2);
            expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                consumer.transformerNonces.payTakerTransformer);
            const fillQuoteTransformerData = protocol_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
            expect(fillQuoteTransformerData.side).to.eq(protocol_utils_1.FillQuoteTransformerSide.Buy);
            expect(fillQuoteTransformerData.fillAmount).to.bignumber.eq(quote.makerTokenFillAmount);
            expect(fillQuoteTransformerData.limitOrders).to.deep.eq(cleanOrders(quote.orders));
            expect(fillQuoteTransformerData.limitOrders.map(o => o.signature)).to.deep.eq(quote.orders.map(o => o.fillData.signature));
            expect(fillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
            expect(fillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
            const payTakerTransformerData = protocol_utils_1.decodePayTakerTransformerData(callArgs.transformations[1].data);
            expect(payTakerTransformerData.amounts).to.deep.eq([]);
            expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, protocol_utils_1.ETH_TOKEN_ADDRESS]);
        }));
        it('ERC20 -> ERC20 does not have a WETH transformer', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote);
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            const nonces = callArgs.transformations.map(t => t.deploymentNonce);
            expect(nonces).to.not.include(consumer.transformerNonces.wethTransformer);
        }));
        it('ETH -> ERC20 has a WETH transformer before the fill', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { isFromETH: true },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.transformations[0].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.wethTransformer);
            const wethTransformerData = protocol_utils_1.decodeWethTransformerData(callArgs.transformations[0].data);
            expect(wethTransformerData.amount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAmount);
            expect(wethTransformerData.token).to.eq(protocol_utils_1.ETH_TOKEN_ADDRESS);
        }));
        it('ERC20 -> ETH has a WETH transformer after the fill', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { isToETH: true },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.transformations[1].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.wethTransformer);
            const wethTransformerData = protocol_utils_1.decodeWethTransformerData(callArgs.transformations[1].data);
            expect(wethTransformerData.amount).to.bignumber.eq(MAX_UINT256);
            expect(wethTransformerData.token).to.eq(contractAddresses.etherToken);
        }));
        it('Appends an affiliate fee transformer after the fill if a buy token affiliate fee is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const affiliateFee = {
                recipient: contracts_test_utils_1.randomAddress(),
                buyTokenFeeAmount: utils_2.getRandomAmount(),
                sellTokenFeeAmount: ZERO_AMOUNT,
                feeType: types_1.AffiliateFeeType.PercentageFee,
            };
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { affiliateFee },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.transformations[1].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.affiliateFeeTransformer);
            const affiliateFeeTransformerData = protocol_utils_1.decodeAffiliateFeeTransformerData(callArgs.transformations[1].data);
            expect(affiliateFeeTransformerData.fees).to.deep.equal([
                { token: MAKER_TOKEN, amount: affiliateFee.buyTokenFeeAmount, recipient: affiliateFee.recipient },
            ]);
        }));
        it('Appends a positive slippage affiliate fee transformer after the fill if the positive slippage fee feeType is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const affiliateFee = {
                recipient: contracts_test_utils_1.randomAddress(),
                buyTokenFeeAmount: ZERO_AMOUNT,
                sellTokenFeeAmount: ZERO_AMOUNT,
                feeType: types_1.AffiliateFeeType.PositiveSlippageFee,
            };
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { affiliateFee },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.transformations[1].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.positiveSlippageFeeTransformer);
            const positiveSlippageFeeTransformerData = protocol_utils_1.decodePositiveSlippageFeeTransformerData(callArgs.transformations[1].data);
            const bestCaseAmount = quote.bestCaseQuoteInfo.makerAmount.plus(constants_1.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS.multipliedBy(quote.gasPrice).multipliedBy(quote.makerAmountPerEth));
            expect(positiveSlippageFeeTransformerData).to.deep.equal({
                token: MAKER_TOKEN,
                bestCaseAmount,
                recipient: affiliateFee.recipient,
            });
        }));
        it('Throws if a sell token affiliate fee is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const affiliateFee = {
                recipient: contracts_test_utils_1.randomAddress(),
                buyTokenFeeAmount: ZERO_AMOUNT,
                sellTokenFeeAmount: utils_2.getRandomAmount(),
                feeType: types_1.AffiliateFeeType.PercentageFee,
            };
            expect(consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { affiliateFee },
            })).to.eventually.be.rejectedWith('Affiliate fees denominated in sell token are not yet supported');
        }));
        it('Uses two `FillQuoteTransformer`s if given two-hop sell quote', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomTwoHopQuote(types_1.MarketOperation.Sell);
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { isTwoHop: true },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
            expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
            expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAmount);
            expect(callArgs.minOutputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.makerAmount);
            expect(callArgs.transformations).to.be.length(3);
            expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[2].deploymentNonce.toNumber() ===
                consumer.transformerNonces.payTakerTransformer);
            const [firstHopOrder, secondHopOrder] = quote.orders;
            const firstHopFillQuoteTransformerData = protocol_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
            expect(firstHopFillQuoteTransformerData.side).to.eq(protocol_utils_1.FillQuoteTransformerSide.Sell);
            expect(firstHopFillQuoteTransformerData.fillAmount).to.bignumber.eq(firstHopOrder.takerAmount);
            expect(firstHopFillQuoteTransformerData.limitOrders).to.deep.eq(cleanOrders([firstHopOrder]));
            expect(firstHopFillQuoteTransformerData.limitOrders.map(o => o.signature)).to.deep.eq([
                firstHopOrder.fillData.signature,
            ]);
            expect(firstHopFillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
            expect(firstHopFillQuoteTransformerData.buyToken).to.eq(INTERMEDIATE_TOKEN);
            const secondHopFillQuoteTransformerData = protocol_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[1].data);
            expect(secondHopFillQuoteTransformerData.side).to.eq(protocol_utils_1.FillQuoteTransformerSide.Sell);
            expect(secondHopFillQuoteTransformerData.fillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
            expect(secondHopFillQuoteTransformerData.limitOrders).to.deep.eq(cleanOrders([secondHopOrder]));
            expect(secondHopFillQuoteTransformerData.limitOrders.map(o => o.signature)).to.deep.eq([
                secondHopOrder.fillData.signature,
            ]);
            expect(secondHopFillQuoteTransformerData.sellToken).to.eq(INTERMEDIATE_TOKEN);
            expect(secondHopFillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
            const payTakerTransformerData = protocol_utils_1.decodePayTakerTransformerData(callArgs.transformations[2].data);
            expect(payTakerTransformerData.amounts).to.deep.eq([]);
            expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, INTERMEDIATE_TOKEN, protocol_utils_1.ETH_TOKEN_ADDRESS]);
        }));
        // it.skip('Uses the `LiquidityProviderFeature` if given a single LiquidityProvider order', async () => {
        //     const quote = {
        //         ...getRandomSellQuote(),
        //         orders: [
        //             {
        //                 ...getRandomOrder(),
        //                 fills: [
        //                     {
        //                         source: ERC20BridgeSource.LiquidityProvider,
        //                         sourcePathId: '',
        //                         input: constants.ZERO_AMOUNT,
        //                         output: constants.ZERO_AMOUNT,
        //                         subFills: [],
        //                     },
        //                 ],
        //             },
        //         ],
        //     };
        //     const callInfo = await consumer.getCalldataOrThrowAsync(quote);
        //     const callArgs = liquidityProviderEncoder.decode(callInfo.calldataHexString) as LiquidityProviderArgs;
        //     expect(callArgs).to.deep.equal({
        //         inputToken: TAKER_TOKEN,
        //         outputToken: MAKER_TOKEN,
        //         target: quote.orders[0].makerAddress,
        //         recipient: constants.NULL_ADDRESS,
        //         sellAmount: quote.worstCaseQuoteInfo.feeTakerTokenAmount,
        //         minBuyAmount: getSwapMinBuyAmount(quote),
        //         auxiliaryData: constants.NULL_BYTES,
        //     });
        // });
        it('allows selling the entire balance for CFL', () => __awaiter(void 0, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { shouldSellEntireBalance: true },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
            expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
            expect(callArgs.inputTokenAmount).to.bignumber.eq(MAX_UINT256);
            expect(callArgs.minOutputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.makerAmount);
            expect(callArgs.transformations).to.be.length(2);
            expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                consumer.transformerNonces.payTakerTransformer);
            const fillQuoteTransformerData = protocol_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
            expect(fillQuoteTransformerData.side).to.eq(protocol_utils_1.FillQuoteTransformerSide.Sell);
            expect(fillQuoteTransformerData.fillAmount).to.bignumber.eq(MAX_UINT256);
            expect(fillQuoteTransformerData.limitOrders).to.deep.eq(cleanOrders(quote.orders));
            expect(fillQuoteTransformerData.limitOrders.map(o => o.signature)).to.deep.eq(quote.orders.map(o => o.fillData.signature));
            expect(fillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
            expect(fillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
            const payTakerTransformerData = protocol_utils_1.decodePayTakerTransformerData(callArgs.transformations[1].data);
            expect(payTakerTransformerData.amounts).to.deep.eq([]);
            expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, protocol_utils_1.ETH_TOKEN_ADDRESS]);
        }));
    });
});
//# sourceMappingURL=exchange_proxy_swap_quote_consumer_test.js.map