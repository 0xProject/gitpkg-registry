"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var contracts_zero_ex_1 = require("@0x/contracts-zero-ex");
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var chai = require("chai");
var _ = require("lodash");
require("mocha");
var constants_1 = require("../src/constants");
var exchange_proxy_swap_quote_consumer_1 = require("../src/quote_consumers/exchange_proxy_swap_quote_consumer");
var types_1 = require("../src/types");
var chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
var expect = chai.expect;
var NULL_ADDRESS = constants_1.constants.NULL_ADDRESS;
var MAX_UINT256 = contracts_test_utils_1.constants.MAX_UINT256;
// tslint:disable: custom-no-magic-numbers
describe('ExchangeProxySwapQuoteConsumer', function () {
    var CHAIN_ID = 1;
    var TAKER_TOKEN = contracts_test_utils_1.randomAddress();
    var MAKER_TOKEN = contracts_test_utils_1.randomAddress();
    var TRANSFORMER_DEPLOYER = contracts_test_utils_1.randomAddress();
    var contractAddresses = __assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID), { exchangeProxy: contracts_test_utils_1.randomAddress(), exchangeProxyAllowanceTarget: contracts_test_utils_1.randomAddress(), exchangeProxyTransformerDeployer: TRANSFORMER_DEPLOYER, transformers: {
            wethTransformer: exchange_proxy_swap_quote_consumer_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 1),
            payTakerTransformer: exchange_proxy_swap_quote_consumer_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 2),
            fillQuoteTransformer: exchange_proxy_swap_quote_consumer_1.getTransformerAddress(TRANSFORMER_DEPLOYER, 3),
        } });
    var consumer;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var fakeProvider;
        return __generator(this, function (_a) {
            fakeProvider = {
                sendAsync: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    });
                },
            };
            consumer = new exchange_proxy_swap_quote_consumer_1.ExchangeProxySwapQuoteConsumer(fakeProvider, contractAddresses, { chainId: CHAIN_ID });
            return [2 /*return*/];
        });
    }); });
    function getRandomAmount(maxAmount) {
        if (maxAmount === void 0) { maxAmount = '1e18'; }
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
        return __assign({ gasPrice: contracts_test_utils_1.getRandomInteger(1, 1e9), type: side, makerAssetData: createAssetData(MAKER_TOKEN), takerAssetData: createAssetData(TAKER_TOKEN), orders: [getRandomOrder()], bestCaseQuoteInfo: {
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
    function getRandomSellQuote() {
        return getRandomQuote(types_1.MarketOperation.Sell);
    }
    function getRandomBuyQuote() {
        return getRandomQuote(types_1.MarketOperation.Buy);
    }
    function cleanOrders(orders) {
        return orders.map(function (o) {
            return _.omit(o, [
                'chainId',
                'exchangeAddress',
                'fillableMakerAssetAmount',
                'fillableTakerAssetAmount',
                'fillableTakerFeeAmount',
                'fills',
                'signature',
            ]);
        });
    }
    var callDataEncoder = utils_1.AbiEncoder.createMethod('transformERC20', [
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
    describe('getCalldataOrThrow()', function () {
        it('can produce a sell quote', function () { return __awaiter(_this, void 0, void 0, function () {
            var quote, callInfo, callArgs, fillQuoteTransformerData, payTakerTransformerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        quote = getRandomSellQuote();
                        return [4 /*yield*/, consumer.getCalldataOrThrowAsync(quote)];
                    case 1:
                        callInfo = _a.sent();
                        callArgs = callDataEncoder.decode(callInfo.calldataHexString);
                        expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
                        expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
                        expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAssetAmount);
                        expect(callArgs.minOutputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.makerAssetAmount);
                        expect(callArgs.transformations).to.be.length(2);
                        expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                            consumer.transformerNonces.fillQuoteTransformer);
                        expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                            consumer.transformerNonces.payTakerTransformer);
                        fillQuoteTransformerData = contracts_zero_ex_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
                        expect(fillQuoteTransformerData.side).to.eq(contracts_zero_ex_1.FillQuoteTransformerSide.Sell);
                        expect(fillQuoteTransformerData.fillAmount).to.bignumber.eq(quote.takerAssetFillAmount);
                        expect(fillQuoteTransformerData.orders).to.deep.eq(cleanOrders(quote.orders));
                        expect(fillQuoteTransformerData.signatures).to.deep.eq(quote.orders.map(function (o) { return o.signature; }));
                        expect(fillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
                        expect(fillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
                        payTakerTransformerData = contracts_zero_ex_1.decodePayTakerTransformerData(callArgs.transformations[1].data);
                        expect(payTakerTransformerData.amounts).to.deep.eq([]);
                        expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, MAKER_TOKEN, contracts_zero_ex_1.ETH_TOKEN_ADDRESS]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can produce a buy quote', function () { return __awaiter(_this, void 0, void 0, function () {
            var quote, callInfo, callArgs, fillQuoteTransformerData, payTakerTransformerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        quote = getRandomBuyQuote();
                        return [4 /*yield*/, consumer.getCalldataOrThrowAsync(quote)];
                    case 1:
                        callInfo = _a.sent();
                        callArgs = callDataEncoder.decode(callInfo.calldataHexString);
                        expect(callArgs.inputToken).to.eq(TAKER_TOKEN);
                        expect(callArgs.outputToken).to.eq(MAKER_TOKEN);
                        expect(callArgs.inputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAssetAmount);
                        expect(callArgs.minOutputTokenAmount).to.bignumber.eq(quote.worstCaseQuoteInfo.makerAssetAmount);
                        expect(callArgs.transformations).to.be.length(2);
                        expect(callArgs.transformations[0].deploymentNonce.toNumber() ===
                            consumer.transformerNonces.fillQuoteTransformer);
                        expect(callArgs.transformations[1].deploymentNonce.toNumber() ===
                            consumer.transformerNonces.payTakerTransformer);
                        fillQuoteTransformerData = contracts_zero_ex_1.decodeFillQuoteTransformerData(callArgs.transformations[0].data);
                        expect(fillQuoteTransformerData.side).to.eq(contracts_zero_ex_1.FillQuoteTransformerSide.Buy);
                        expect(fillQuoteTransformerData.fillAmount).to.bignumber.eq(quote.makerAssetFillAmount);
                        expect(fillQuoteTransformerData.orders).to.deep.eq(cleanOrders(quote.orders));
                        expect(fillQuoteTransformerData.signatures).to.deep.eq(quote.orders.map(function (o) { return o.signature; }));
                        expect(fillQuoteTransformerData.sellToken).to.eq(TAKER_TOKEN);
                        expect(fillQuoteTransformerData.buyToken).to.eq(MAKER_TOKEN);
                        payTakerTransformerData = contracts_zero_ex_1.decodePayTakerTransformerData(callArgs.transformations[1].data);
                        expect(payTakerTransformerData.amounts).to.deep.eq([]);
                        expect(payTakerTransformerData.tokens).to.deep.eq([TAKER_TOKEN, MAKER_TOKEN, contracts_zero_ex_1.ETH_TOKEN_ADDRESS]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('ERC20 -> ERC20 does not have a WETH transformer', function () { return __awaiter(_this, void 0, void 0, function () {
            var quote, callInfo, callArgs, nonces;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        quote = getRandomSellQuote();
                        return [4 /*yield*/, consumer.getCalldataOrThrowAsync(quote)];
                    case 1:
                        callInfo = _a.sent();
                        callArgs = callDataEncoder.decode(callInfo.calldataHexString);
                        nonces = callArgs.transformations.map(function (t) { return t.deploymentNonce; });
                        expect(nonces).to.not.include(consumer.transformerNonces.wethTransformer);
                        return [2 /*return*/];
                }
            });
        }); });
        it('ETH -> ERC20 has a WETH transformer before the fill', function () { return __awaiter(_this, void 0, void 0, function () {
            var quote, callInfo, callArgs, wethTransformerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        quote = getRandomSellQuote();
                        return [4 /*yield*/, consumer.getCalldataOrThrowAsync(quote, {
                                extensionContractOpts: { isFromETH: true },
                            })];
                    case 1:
                        callInfo = _a.sent();
                        callArgs = callDataEncoder.decode(callInfo.calldataHexString);
                        expect(callArgs.transformations[0].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.wethTransformer);
                        wethTransformerData = contracts_zero_ex_1.decodeWethTransformerData(callArgs.transformations[0].data);
                        expect(wethTransformerData.amount).to.bignumber.eq(quote.worstCaseQuoteInfo.totalTakerAssetAmount);
                        expect(wethTransformerData.token).to.eq(contracts_zero_ex_1.ETH_TOKEN_ADDRESS);
                        return [2 /*return*/];
                }
            });
        }); });
        it('ERC20 -> ETH has a WETH transformer after the fill', function () { return __awaiter(_this, void 0, void 0, function () {
            var quote, callInfo, callArgs, wethTransformerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        quote = getRandomSellQuote();
                        return [4 /*yield*/, consumer.getCalldataOrThrowAsync(quote, {
                                extensionContractOpts: { isToETH: true },
                            })];
                    case 1:
                        callInfo = _a.sent();
                        callArgs = callDataEncoder.decode(callInfo.calldataHexString);
                        expect(callArgs.transformations[1].deploymentNonce.toNumber()).to.eq(consumer.transformerNonces.wethTransformer);
                        wethTransformerData = contracts_zero_ex_1.decodeWethTransformerData(callArgs.transformations[1].data);
                        expect(wethTransformerData.amount).to.bignumber.eq(MAX_UINT256);
                        expect(wethTransformerData.token).to.eq(contractAddresses.etherToken);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=exchange_proxy_swap_quote_consumer_test.js.map