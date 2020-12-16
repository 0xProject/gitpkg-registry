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
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const chai = require("chai");
const _ = require("lodash");
require("mocha");
const constants_1 = require("../src/constants");
const exchange_proxy_swap_quote_consumer_1 = require("../src/quote_consumers/exchange_proxy_swap_quote_consumer");
const utils_2 = require("../src/quote_consumers/utils");
const types_1 = require("../src/types");
const types_2 = require("../src/utils/market_operation_utils/types");
const chai_setup_1 = require("./utils/chai_setup");
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
    const contractAddresses = Object.assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID), { exchangeProxy: contracts_test_utils_1.randomAddress(), exchangeProxyAllowanceTarget: contracts_test_utils_1.randomAddress(), exchangeProxyTransformerDeployer: TRANSFORMER_DEPLOYER, transformers: {
            wethTransformer: order_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 1),
            payTakerTransformer: order_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 2),
            fillQuoteTransformer: order_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 3),
            affiliateFeeTransformer: order_utils_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 4),
        } });
    let consumer;
    before(() => __awaiter(this, void 0, void 0, function* () {
        const fakeProvider = {
            sendAsync() {
                return __awaiter(this, void 0, void 0, function* () {
                    /* noop */
                });
            },
        };
        consumer = new exchange_proxy_swap_quote_consumer_1.ExchangeProxySwapQuoteConsumer(fakeProvider, contractAddresses, { chainId: CHAIN_ID });
    }));
    function getRandomAmount(maxAmount = '1e18') {
        return contracts_test_utils_1.getRandomInteger(1, maxAmount);
    }
    function createAssetData(token) {
        return order_utils_1.assetDataUtils.encodeERC20AssetData(token || contracts_test_utils_1.randomAddress());
    }
    function getRandomOrder() {
        return {
            fillableMakerAssetAmount: getRandomAmount(),
            fillableTakerFeeAmount: getRandomAmount(),
            fillableTakerAssetAmount: getRandomAmount(),
            fills: [],
            chainId: CHAIN_ID,
            exchangeAddress: contractAddresses.exchange,
            expirationTimeSeconds: contracts_test_utils_1.getRandomInteger(1, 2e9),
            feeRecipientAddress: contracts_test_utils_1.randomAddress(),
            makerAddress: contracts_test_utils_1.randomAddress(),
            makerAssetAmount: getRandomAmount(),
            takerAssetAmount: getRandomAmount(),
            makerFee: getRandomAmount(),
            takerFee: getRandomAmount(),
            salt: getRandomAmount(2e9),
            signature: utils_1.hexUtils.random(66),
            senderAddress: NULL_ADDRESS,
            takerAddress: NULL_ADDRESS,
            makerAssetData: createAssetData(MAKER_TOKEN),
            takerAssetData: createAssetData(TAKER_TOKEN),
            makerFeeAssetData: createAssetData(),
            takerFeeAssetData: createAssetData(),
        };
    }
    function getRandomQuote(side) {
        return Object.assign({ gasPrice: contracts_test_utils_1.getRandomInteger(1, 1e9), type: side, makerAssetData: createAssetData(MAKER_TOKEN), takerAssetData: createAssetData(TAKER_TOKEN), orders: [getRandomOrder()], bestCaseQuoteInfo: {
                feeTakerAssetAmount: getRandomAmount(),
                makerAssetAmount: getRandomAmount(),
                gas: Math.floor(Math.random() * 8e6),
                protocolFeeInWeiAmount: getRandomAmount(),
                takerAssetAmount: getRandomAmount(),
                totalTakerAssetAmount: getRandomAmount(),
            }, worstCaseQuoteInfo: {
                feeTakerAssetAmount: getRandomAmount(),
                makerAssetAmount: getRandomAmount(),
                gas: Math.floor(Math.random() * 8e6),
                protocolFeeInWeiAmount: getRandomAmount(),
                takerAssetAmount: getRandomAmount(),
                totalTakerAssetAmount: getRandomAmount(),
            } }, (side === types_1.MarketOperation.Buy
            ? { makerAssetFillAmount: getRandomAmount() }
            : { takerAssetFillAmount: getRandomAmount() }));
    }
    function getRandomTwoHopQuote(side) {
        const intermediateTokenAssetData = createAssetData(INTERMEDIATE_TOKEN);
        return Object.assign({}, getRandomQuote(side), { orders: [
                Object.assign({}, getRandomOrder(), { makerAssetData: intermediateTokenAssetData }),
                Object.assign({}, getRandomOrder(), { takerAssetData: intermediateTokenAssetData }),
            ], isTwoHop: true });
    }
    function getRandomSellQuote() {
        return getRandomQuote(types_1.MarketOperation.Sell);
    }
    function getRandomBuyQuote() {
        return getRandomQuote(types_1.MarketOperation.Buy);
    }
    function cleanOrders(orders) {
        return orders.map(o => _.omit(o, [
            'chainId',
            'exchangeAddress',
            'fillableMakerAssetAmount',
            'fillableTakerAssetAmount',
            'fillableTakerFeeAmount',
            'fills',
            'signature',
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
            components: [{ type: 'uint32', name: 'deploymentNonce' }, { type: 'bytes', name: 'data' }],
        },
    ]);
    const liquidityProviderEncoder = utils_1.AbiEncoder.createMethod('sellToLiquidityProvider', [
        { type: 'address', name: 'inputToken' },
        { type: 'address', name: 'outputToken' },
        { type: 'address', name: 'target' },
        { type: 'address', name: 'recipient' },
        { type: 'uint256', name: 'sellAmount' },
        { type: 'uint256', name: 'minBuyAmount' },
        { type: 'bytes', name: 'auxiliaryData' },
    ]);
    describe('getCalldataOrThrow()', () => {
        it('can produce a sell quote', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote);
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
            expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
            expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAssetAmount);
            expect(callArgs.minOutputTokenAmount).to.bignumber.eq(utils_2.getSwapMinBuyAmount(quote));
            expect(callArgs.transformations).to.be.length(2);
            expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                consumer.transformerNonces.payTakerTransformer);
            const fillQuoteTransformerData = order_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
            expect(fillQuoteTransformerData.side).to.eq(order_utils_1.FillQuoteTransformerSide.Sell);
            expect(fillQuoteTransformerData.fillAmount).to.bignumber.eq(quote.takerAssetFillAmount);
            expect(fillQuoteTransformerData.orders).to.deep.eq(cleanOrders(quote.orders));
            expect(fillQuoteTransformerData.signatures).to.deep.eq(quote.orders.map(o => o.signature));
            expect(fillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
            expect(fillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
            const payTakerTransformerData = order_utils_1.decodePayTakerTransformerData(callArgs.transformations[1].data);
            expect(payTakerTransformerData.amounts).to.deep.eq([]);
            expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, MAKER_TOKEN, order_utils_1.ETH_TOKEN_ADDRESS]);
        }));
        it('can produce a buy quote', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomBuyQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote);
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
            expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
            expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAssetAmount);
            expect(callArgs.minOutputTokenAmount).to.bignumber.eq(utils_2.getSwapMinBuyAmount(quote));
            expect(callArgs.transformations).to.be.length(2);
            expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                consumer.transformerNonces.payTakerTransformer);
            const fillQuoteTransformerData = order_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
            expect(fillQuoteTransformerData.side).to.eq(order_utils_1.FillQuoteTransformerSide.Buy);
            expect(fillQuoteTransformerData.fillAmount).to.bignumber.eq(quote.makerAssetFillAmount);
            expect(fillQuoteTransformerData.orders).to.deep.eq(cleanOrders(quote.orders));
            expect(fillQuoteTransformerData.signatures).to.deep.eq(quote.orders.map(o => o.signature));
            expect(fillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
            expect(fillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
            const payTakerTransformerData = order_utils_1.decodePayTakerTransformerData(callArgs.transformations[1].data);
            expect(payTakerTransformerData.amounts).to.deep.eq([]);
            expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, MAKER_TOKEN, order_utils_1.ETH_TOKEN_ADDRESS]);
        }));
        it('ERC20 -> ERC20 does not have a WETH transformer', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote);
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            const nonces = callArgs.transformations.map(t => t.deploymentNonce);
            expect(nonces).to.not.include(consumer.transformerNonces.wethTransformer);
        }));
        it('ETH -> ERC20 has a WETH transformer before the fill', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { isFromETH: true },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.transformations[0].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.wethTransformer);
            const wethTransformerData = order_utils_1.decodeWethTransformerData(callArgs.transformations[0].data);
            expect(wethTransformerData.amount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAssetAmount);
            expect(wethTransformerData.token).to.eq(order_utils_1.ETH_TOKEN_ADDRESS);
        }));
        it('ERC20 -> ETH has a WETH transformer after the fill', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { isToETH: true },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.transformations[1].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.wethTransformer);
            const wethTransformerData = order_utils_1.decodeWethTransformerData(callArgs.transformations[1].data);
            expect(wethTransformerData.amount).to.bignumber.eq(MAX_UINT256);
            expect(wethTransformerData.token).to.eq(contractAddresses.etherToken);
        }));
        it('Appends an affiliate fee transformer after the fill if a buy token affiliate fee is provided', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const affiliateFee = {
                recipient: contracts_test_utils_1.randomAddress(),
                buyTokenFeeAmount: getRandomAmount(),
                sellTokenFeeAmount: ZERO_AMOUNT,
            };
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { affiliateFee },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.transformations[1].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.affiliateFeeTransformer);
            const affiliateFeeTransformerData = order_utils_1.decodeAffiliateFeeTransformerData(callArgs.transformations[1].data);
            expect(affiliateFeeTransformerData.fees).to.deep.equal([
                { token: MAKER_TOKEN, amount: affiliateFee.buyTokenFeeAmount, recipient: affiliateFee.recipient },
            ]);
        }));
        it('Throws if a sell token affiliate fee is provided', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomSellQuote();
            const affiliateFee = {
                recipient: contracts_test_utils_1.randomAddress(),
                buyTokenFeeAmount: ZERO_AMOUNT,
                sellTokenFeeAmount: getRandomAmount(),
            };
            expect(consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { affiliateFee },
            })).to.eventually.be.rejectedWith('Affiliate fees denominated in sell token are not yet supported');
        }));
        it('Uses two `FillQuoteTransformer`s if given two-hop sell quote', () => __awaiter(this, void 0, void 0, function* () {
            const quote = getRandomTwoHopQuote(types_1.MarketOperation.Sell);
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote, {
                extensionContractOpts: { isTwoHop: true },
            });
            const callArgs = transformERC20Encoder.decode(callInfo.calldataHexString);
            expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
            expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
            expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAssetAmount);
            expect(callArgs.minOutputTokenAmount).to.bignumber.eq(utils_2.getSwapMinBuyAmount(quote));
            expect(callArgs.transformations).to.be.length(3);
            expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                consumer.transformerNonces.fillQuoteTransformer);
            expect(callArgs.transformations[2].deploymentNonce.toNumber() ===
                consumer.transformerNonces.payTakerTransformer);
            const [firstHopOrder, secondHopOrder] = quote.orders;
            const firstHopFillQuoteTransformerData = order_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
            expect(firstHopFillQuoteTransformerData.side).to.eq(order_utils_1.FillQuoteTransformerSide.Sell);
            expect(firstHopFillQuoteTransformerData.fillAmount).to.bignumber.eq(firstHopOrder.takerAssetAmount);
            expect(firstHopFillQuoteTransformerData.orders).to.deep.eq(cleanOrders([firstHopOrder]));
            expect(firstHopFillQuoteTransformerData.signatures).to.deep.eq([firstHopOrder.signature]);
            expect(firstHopFillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
            expect(firstHopFillQuoteTransformerData.buyToken).to.eq(INTERMEDIATE_TOKEN);
            const secondHopFillQuoteTransformerData = order_utils_1.decodeFillQuoteTransformerData(callArgs.transformations[1].data);
            expect(secondHopFillQuoteTransformerData.side).to.eq(order_utils_1.FillQuoteTransformerSide.Sell);
            expect(secondHopFillQuoteTransformerData.fillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
            expect(secondHopFillQuoteTransformerData.orders).to.deep.eq(cleanOrders([secondHopOrder]));
            expect(secondHopFillQuoteTransformerData.signatures).to.deep.eq([secondHopOrder.signature]);
            expect(secondHopFillQuoteTransformerData.sellToken).to.eq(INTERMEDIATE_TOKEN);
            expect(secondHopFillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
            const payTakerTransformerData = order_utils_1.decodePayTakerTransformerData(callArgs.transformations[2].data);
            expect(payTakerTransformerData.amounts).to.deep.eq([]);
            expect(payTakerTransformerData.tokens).to.deep.eq([
                TAKER_TOKEN,
                MAKER_TOKEN,
                order_utils_1.ETH_TOKEN_ADDRESS,
                INTERMEDIATE_TOKEN,
            ]);
        }));
        it.skip('Uses the `LiquidityProviderFeature` if given a single LiquidityProvider order', () => __awaiter(this, void 0, void 0, function* () {
            const quote = Object.assign({}, getRandomSellQuote(), { orders: [
                    Object.assign({}, getRandomOrder(), { fills: [
                            {
                                source: types_2.ERC20BridgeSource.LiquidityProvider,
                                sourcePathId: '',
                                input: constants_1.constants.ZERO_AMOUNT,
                                output: constants_1.constants.ZERO_AMOUNT,
                                subFills: [],
                            },
                        ] }),
                ] });
            const callInfo = yield consumer.getCalldataOrThrowAsync(quote);
            const callArgs = liquidityProviderEncoder.decode(callInfo.calldataHexString);
            expect(callArgs).to.deep.equal({
                inputToken: TAKER_TOKEN,
                outputToken: MAKER_TOKEN,
                target: quote.orders[0].makerAddress,
                recipient: constants_1.constants.NULL_ADDRESS,
                sellAmount: quote.worstCaseQuoteInfo.totalTakerAssetAmount,
                minBuyAmount: utils_2.getSwapMinBuyAmount(quote),
                auxiliaryData: constants_1.constants.NULL_BYTES,
            });
        }));
    });
});
//# sourceMappingURL=exchange_proxy_swap_quote_consumer_test_BASE_66607.js.map