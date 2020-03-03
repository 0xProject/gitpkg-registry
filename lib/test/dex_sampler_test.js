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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contract_wrappers_1 = require("@0x/contract-wrappers");
var artifacts_1 = require("@0x/contracts-erc20-bridge-sampler/lib/src/artifacts");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var sampler_1 = require("../src/utils/market_operation_utils/sampler");
var types_1 = require("../src/utils/market_operation_utils/types");
var mock_sampler_contract_1 = require("./utils/mock_sampler_contract");
var CHAIN_ID = 1;
// tslint:disable: custom-no-magic-numbers
describe('DexSampler tests', function () {
    var MAKER_TOKEN = contracts_test_utils_1.randomAddress();
    var TAKER_TOKEN = contracts_test_utils_1.randomAddress();
    var MAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(MAKER_TOKEN);
    var TAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(TAKER_TOKEN);
    describe('getSampleAmounts()', function () {
        var FILL_AMOUNT = contracts_test_utils_1.getRandomInteger(1, 1e18);
        var NUM_SAMPLES = 16;
        it('generates the correct number of amounts', function () {
            var amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            contracts_test_utils_1.expect(amounts).to.be.length(NUM_SAMPLES);
        });
        it('first amount is nonzero', function () {
            var amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            contracts_test_utils_1.expect(amounts[0]).to.not.bignumber.eq(0);
        });
        it('last amount is the fill amount', function () {
            var amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            contracts_test_utils_1.expect(amounts[NUM_SAMPLES - 1]).to.bignumber.eq(FILL_AMOUNT);
        });
        it('can generate a single amount', function () {
            var amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, 1);
            contracts_test_utils_1.expect(amounts).to.be.length(1);
            contracts_test_utils_1.expect(amounts[0]).to.bignumber.eq(FILL_AMOUNT);
        });
        it('generates ascending amounts', function () {
            var e_1, _a;
            var amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            try {
                for (var _b = __values(_.times(NUM_SAMPLES).slice(1)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var i = _c.value;
                    var prev = amounts[i - 1];
                    var amount = amounts[i];
                    contracts_test_utils_1.expect(prev).to.bignumber.lt(amount);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    });
    function createOrder(overrides) {
        return __assign({ chainId: CHAIN_ID, exchangeAddress: contracts_test_utils_1.randomAddress(), makerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, takerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, senderAddress: contracts_test_utils_1.constants.NULL_ADDRESS, feeRecipientAddress: contracts_test_utils_1.randomAddress(), salt: order_utils_1.generatePseudoRandomSalt(), expirationTimeSeconds: contracts_test_utils_1.getRandomInteger(0, Math.pow(2, 64)), makerAssetData: MAKER_ASSET_DATA, takerAssetData: TAKER_ASSET_DATA, makerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, takerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, makerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), takerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), makerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, takerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, signature: utils_1.hexUtils.random() }, overrides);
    }
    var ORDERS = _.times(4, function () { return createOrder(); });
    var SIMPLE_ORDERS = ORDERS.map(function (o) { return _.omit(o, ['signature', 'chainId', 'exchangeAddress']); });
    describe('operations', function () {
        it('getOrderFillableMakerAmounts()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedFillableAmounts, sampler, dexOrderSampler, _a, fillableAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedFillableAmounts = ORDERS.map(function () { return contracts_test_utils_1.getRandomInteger(0, 100e18); });
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            getOrderFillableMakerAssetAmounts: function (orders, signatures) {
                                contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                                contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(function (o) { return o.signature; }));
                                return expectedFillableAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getOrderFillableMakerAmounts(ORDERS))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), fillableAmounts = _a[0];
                        contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedFillableAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getOrderFillableTakerAmounts()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedFillableAmounts, sampler, dexOrderSampler, _a, fillableAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedFillableAmounts = ORDERS.map(function () { return contracts_test_utils_1.getRandomInteger(0, 100e18); });
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            getOrderFillableTakerAssetAmounts: function (orders, signatures) {
                                contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                                contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(function (o) { return o.signature; }));
                                return expectedFillableAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getOrderFillableTakerAmounts(ORDERS))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), fillableAmounts = _a[0];
                        contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedFillableAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getKyberSellQuotes()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedTakerToken, expectedMakerToken, expectedTakerFillAmounts, expectedMakerFillAmounts, sampler, dexOrderSampler, _a, fillableAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedTakerToken = contracts_test_utils_1.randomAddress();
                        expectedMakerToken = contracts_test_utils_1.randomAddress();
                        expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            sampleSellsFromKyberNetwork: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                                return expectedMakerFillAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getKyberSellQuotes(expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), fillableAmounts = _a[0];
                        contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getEth2DaiSellQuotes()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedTakerToken, expectedMakerToken, expectedTakerFillAmounts, expectedMakerFillAmounts, sampler, dexOrderSampler, _a, fillableAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedTakerToken = contracts_test_utils_1.randomAddress();
                        expectedMakerToken = contracts_test_utils_1.randomAddress();
                        expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            sampleSellsFromEth2Dai: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                                return expectedMakerFillAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getEth2DaiSellQuotes(expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), fillableAmounts = _a[0];
                        contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getUniswapSellQuotes()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedTakerToken, expectedMakerToken, expectedTakerFillAmounts, expectedMakerFillAmounts, sampler, dexOrderSampler, _a, fillableAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedTakerToken = contracts_test_utils_1.randomAddress();
                        expectedMakerToken = contracts_test_utils_1.randomAddress();
                        expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            sampleSellsFromUniswap: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                                return expectedMakerFillAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getUniswapSellQuotes(expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), fillableAmounts = _a[0];
                        contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getEth2DaiBuyQuotes()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedTakerToken, expectedMakerToken, expectedTakerFillAmounts, expectedMakerFillAmounts, sampler, dexOrderSampler, _a, fillableAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedTakerToken = contracts_test_utils_1.randomAddress();
                        expectedMakerToken = contracts_test_utils_1.randomAddress();
                        expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            sampleBuysFromEth2Dai: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                                return expectedTakerFillAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getEth2DaiBuyQuotes(expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), fillableAmounts = _a[0];
                        contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedTakerFillAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getUniswapBuyQuotes()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedTakerToken, expectedMakerToken, expectedTakerFillAmounts, expectedMakerFillAmounts, sampler, dexOrderSampler, _a, fillableAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedTakerToken = contracts_test_utils_1.randomAddress();
                        expectedMakerToken = contracts_test_utils_1.randomAddress();
                        expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            sampleBuysFromUniswap: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                                return expectedTakerFillAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getUniswapBuyQuotes(expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), fillableAmounts = _a[0];
                        contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedTakerFillAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getSellQuotes()', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, expectedTakerToken, expectedMakerToken, sources, ratesBySource, expectedTakerFillAmounts, sampler, dexOrderSampler, _b, quotes, expectedQuotes;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expectedTakerToken = contracts_test_utils_1.randomAddress();
                        expectedMakerToken = contracts_test_utils_1.randomAddress();
                        sources = [types_1.ERC20BridgeSource.Kyber, types_1.ERC20BridgeSource.Eth2Dai, types_1.ERC20BridgeSource.Uniswap];
                        ratesBySource = (_a = {},
                            _a[types_1.ERC20BridgeSource.Kyber] = contracts_test_utils_1.getRandomFloat(0, 100),
                            _a[types_1.ERC20BridgeSource.Eth2Dai] = contracts_test_utils_1.getRandomFloat(0, 100),
                            _a[types_1.ERC20BridgeSource.Uniswap] = contracts_test_utils_1.getRandomFloat(0, 100),
                            _a);
                        expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            sampleSellsFromKyberNetwork: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                                return fillAmounts.map(function (a) { return a.times(ratesBySource[types_1.ERC20BridgeSource.Kyber]).integerValue(); });
                            },
                            sampleSellsFromUniswap: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                                return fillAmounts.map(function (a) { return a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue(); });
                            },
                            sampleSellsFromEth2Dai: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                                return fillAmounts.map(function (a) { return a.times(ratesBySource[types_1.ERC20BridgeSource.Eth2Dai]).integerValue(); });
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getSellQuotes(sources, expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts))];
                    case 1:
                        _b = __read.apply(void 0, [_c.sent(), 1]), quotes = _b[0];
                        contracts_test_utils_1.expect(quotes).to.be.length(sources.length);
                        expectedQuotes = sources.map(function (s) {
                            return expectedTakerFillAmounts.map(function (a) { return ({
                                source: s,
                                input: a,
                                output: a.times(ratesBySource[s]).integerValue(),
                            }); });
                        });
                        contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
                        return [2 /*return*/];
                }
            });
        }); });
        it('getBuyQuotes()', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, expectedTakerToken, expectedMakerToken, sources, ratesBySource, expectedMakerFillAmounts, sampler, dexOrderSampler, _b, quotes, expectedQuotes;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expectedTakerToken = contracts_test_utils_1.randomAddress();
                        expectedMakerToken = contracts_test_utils_1.randomAddress();
                        sources = [types_1.ERC20BridgeSource.Eth2Dai, types_1.ERC20BridgeSource.Uniswap];
                        ratesBySource = (_a = {},
                            _a[types_1.ERC20BridgeSource.Eth2Dai] = contracts_test_utils_1.getRandomFloat(0, 100),
                            _a[types_1.ERC20BridgeSource.Uniswap] = contracts_test_utils_1.getRandomFloat(0, 100),
                            _a);
                        expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            sampleBuysFromUniswap: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                                return fillAmounts.map(function (a) { return a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue(); });
                            },
                            sampleBuysFromEth2Dai: function (takerToken, makerToken, fillAmounts) {
                                contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                                contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                                contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                                return fillAmounts.map(function (a) { return a.times(ratesBySource[types_1.ERC20BridgeSource.Eth2Dai]).integerValue(); });
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getBuyQuotes(sources, expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts))];
                    case 1:
                        _b = __read.apply(void 0, [_c.sent(), 1]), quotes = _b[0];
                        contracts_test_utils_1.expect(quotes).to.be.length(sources.length);
                        expectedQuotes = sources.map(function (s) {
                            return expectedMakerFillAmounts.map(function (a) { return ({
                                source: s,
                                input: a,
                                output: a.times(ratesBySource[s]).integerValue(),
                            }); });
                        });
                        contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('LiquidityProvider Operations', function () {
            var xAsset = contracts_test_utils_1.randomAddress();
            var yAsset = contracts_test_utils_1.randomAddress();
            var zAsset = contracts_test_utils_1.randomAddress();
            var liquidityPool1 = contracts_test_utils_1.randomAddress();
            var liquidityPool2 = contracts_test_utils_1.randomAddress();
            var registryContract;
            var samplerContract;
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contract_wrappers_1.DummyLiquidityProviderRegistryContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.DummyLiquidityProviderRegistry, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, {})];
                        case 1:
                            registryContract = _a.sent();
                            return [4 /*yield*/, contract_wrappers_1.ERC20BridgeSamplerContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.ERC20BridgeSampler, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, {})];
                        case 2:
                            samplerContract = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('getLiquidityProviderFromRegistry()', function () { return __awaiter(_this, void 0, void 0, function () {
                var dexOrderSampler, _a, xyPool, xzPool, yzPool, nullPool;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: 
                        // Deploy Registry
                        // Write 2 new liquidity pools
                        return [4 /*yield*/, registryContract
                                .setLiquidityProviderForMarket(xAsset, yAsset, liquidityPool1)
                                .awaitTransactionSuccessAsync().txHashPromise];
                        case 1:
                            // Deploy Registry
                            // Write 2 new liquidity pools
                            _b.sent();
                            return [4 /*yield*/, registryContract
                                    .setLiquidityProviderForMarket(xAsset, zAsset, liquidityPool2)
                                    .awaitTransactionSuccessAsync().txHashPromise];
                        case 2:
                            _b.sent();
                            dexOrderSampler = new sampler_1.DexOrderSampler(new contract_wrappers_1.IERC20BridgeSamplerContract(samplerContract.address, contracts_test_utils_1.provider));
                            return [4 /*yield*/, dexOrderSampler.executeBatchAsync([
                                    sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(registryContract.address, xAsset, yAsset),
                                    sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(registryContract.address, xAsset, zAsset),
                                    sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(registryContract.address, yAsset, zAsset),
                                    sampler_1.DexOrderSampler.ops.getLiquidityProviderFromRegistry(utils_1.NULL_ADDRESS, yAsset, zAsset),
                                ])];
                        case 3:
                            _a = __read.apply(void 0, [_b.sent(), 4]), xyPool = _a[0], xzPool = _a[1], yzPool = _a[2], nullPool = _a[3];
                            contracts_test_utils_1.expect(xyPool).to.eql(liquidityPool1);
                            contracts_test_utils_1.expect(xzPool).to.eql(liquidityPool2);
                            contracts_test_utils_1.expect(yzPool).to.eql(utils_1.NULL_ADDRESS);
                            contracts_test_utils_1.expect(nullPool).to.eql(utils_1.NULL_ADDRESS);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('is able to sample DEX liquidity from LiquidityProvider', function () { return __awaiter(_this, void 0, void 0, function () {
                var e_2, _a, e_3, _b, fakeLiquidityPool, dexOrderSampler, _c, buyQuotes, sellQuotes, liquidityPoolBuyQuotes, liquidityPoolBuyQuotes_1, liquidityPoolBuyQuotes_1_1, quote, iquidityPoolSellQuotes, iquidityPoolSellQuotes_1, iquidityPoolSellQuotes_1_1, quote;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, contract_wrappers_1.DummyLiquidityProviderContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.DummyLiquidityProvider, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, {})];
                        case 1:
                            fakeLiquidityPool = _d.sent();
                            return [4 /*yield*/, registryContract
                                    .setLiquidityProviderForMarket(xAsset, yAsset, fakeLiquidityPool.address)
                                    .awaitTransactionSuccessAsync().txHashPromise];
                        case 2:
                            _d.sent();
                            dexOrderSampler = new sampler_1.DexOrderSampler(new contract_wrappers_1.IERC20BridgeSamplerContract(samplerContract.address, contracts_test_utils_1.provider));
                            return [4 /*yield*/, dexOrderSampler.executeBatchAsync([
                                    sampler_1.DexOrderSampler.ops.getBuyQuotes([types_1.ERC20BridgeSource.LiquidityProvider], xAsset, yAsset, [new utils_1.BigNumber(10), new utils_1.BigNumber(100)], registryContract.address),
                                    sampler_1.DexOrderSampler.ops.getSellQuotes([types_1.ERC20BridgeSource.LiquidityProvider], xAsset, yAsset, [new utils_1.BigNumber(10), new utils_1.BigNumber(100), new utils_1.BigNumber(500)], registryContract.address),
                                ])];
                        case 3:
                            _c = __read.apply(void 0, [_d.sent(), 2]), buyQuotes = _c[0], sellQuotes = _c[1];
                            contracts_test_utils_1.expect(buyQuotes.length).to.eql(1);
                            liquidityPoolBuyQuotes = buyQuotes[0];
                            contracts_test_utils_1.expect(liquidityPoolBuyQuotes.length).to.eql(2);
                            try {
                                for (liquidityPoolBuyQuotes_1 = __values(liquidityPoolBuyQuotes), liquidityPoolBuyQuotes_1_1 = liquidityPoolBuyQuotes_1.next(); !liquidityPoolBuyQuotes_1_1.done; liquidityPoolBuyQuotes_1_1 = liquidityPoolBuyQuotes_1.next()) {
                                    quote = liquidityPoolBuyQuotes_1_1.value;
                                    contracts_test_utils_1.expect(quote.source).to.bignumber.eql(types_1.ERC20BridgeSource.LiquidityProvider);
                                    contracts_test_utils_1.expect(quote.input.plus(1)).to.bignumber.eql(quote.output);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (liquidityPoolBuyQuotes_1_1 && !liquidityPoolBuyQuotes_1_1.done && (_a = liquidityPoolBuyQuotes_1.return)) _a.call(liquidityPoolBuyQuotes_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            contracts_test_utils_1.expect(sellQuotes.length).to.eql(1);
                            iquidityPoolSellQuotes = sellQuotes[0];
                            contracts_test_utils_1.expect(iquidityPoolSellQuotes.length).to.eql(3);
                            try {
                                for (iquidityPoolSellQuotes_1 = __values(iquidityPoolSellQuotes), iquidityPoolSellQuotes_1_1 = iquidityPoolSellQuotes_1.next(); !iquidityPoolSellQuotes_1_1.done; iquidityPoolSellQuotes_1_1 = iquidityPoolSellQuotes_1.next()) {
                                    quote = iquidityPoolSellQuotes_1_1.value;
                                    contracts_test_utils_1.expect(quote.source).to.bignumber.eql(types_1.ERC20BridgeSource.LiquidityProvider);
                                    contracts_test_utils_1.expect(quote.input.minus(1)).to.bignumber.eql(quote.output);
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (iquidityPoolSellQuotes_1_1 && !iquidityPoolSellQuotes_1_1.done && (_b = iquidityPoolSellQuotes_1.return)) _b.call(iquidityPoolSellQuotes_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('batched operations', function () {
        it('getOrderFillableMakerAmounts(), getOrderFillableTakerAmounts()', function () { return __awaiter(_this, void 0, void 0, function () {
            var expectedFillableTakerAmounts, expectedFillableMakerAmounts, sampler, dexOrderSampler, _a, fillableMakerAmounts, fillableTakerAmounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedFillableTakerAmounts = ORDERS.map(function () { return contracts_test_utils_1.getRandomInteger(0, 100e18); });
                        expectedFillableMakerAmounts = ORDERS.map(function () { return contracts_test_utils_1.getRandomInteger(0, 100e18); });
                        sampler = new mock_sampler_contract_1.MockSamplerContract({
                            getOrderFillableMakerAssetAmounts: function (orders, signatures) {
                                contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                                contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(function (o) { return o.signature; }));
                                return expectedFillableMakerAmounts;
                            },
                            getOrderFillableTakerAssetAmounts: function (orders, signatures) {
                                contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                                contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(function (o) { return o.signature; }));
                                return expectedFillableTakerAmounts;
                            },
                        });
                        dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
                        return [4 /*yield*/, dexOrderSampler.executeAsync(sampler_1.DexOrderSampler.ops.getOrderFillableMakerAmounts(ORDERS), sampler_1.DexOrderSampler.ops.getOrderFillableTakerAmounts(ORDERS))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), fillableMakerAmounts = _a[0], fillableTakerAmounts = _a[1];
                        contracts_test_utils_1.expect(fillableMakerAmounts).to.deep.eq(expectedFillableMakerAmounts);
                        contracts_test_utils_1.expect(fillableTakerAmounts).to.deep.eq(expectedFillableTakerAmounts);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=dex_sampler_test.js.map