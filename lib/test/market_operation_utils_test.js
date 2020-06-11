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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var dev_utils_1 = require("@0x/dev-utils");
var order_utils_1 = require("@0x/order-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var src_1 = require("../src");
var market_operation_utils_1 = require("../src/utils/market_operation_utils/");
var constants_1 = require("../src/utils/market_operation_utils/constants");
var fills_1 = require("../src/utils/market_operation_utils/fills");
var sampler_1 = require("../src/utils/market_operation_utils/sampler");
var types_2 = require("../src/utils/market_operation_utils/types");
// tslint:disable: custom-no-magic-numbers
describe('MarketOperationUtils tests', function () {
    var _a;
    var CHAIN_ID = 1;
    var contractAddresses = contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID);
    var ETH2DAI_BRIDGE_ADDRESS = contractAddresses.eth2DaiBridge;
    var KYBER_BRIDGE_ADDRESS = contractAddresses.kyberBridge;
    var UNISWAP_BRIDGE_ADDRESS = contractAddresses.uniswapBridge;
    var UNISWAP_V2_BRIDGE_ADDRESS = contractAddresses.uniswapV2Bridge;
    var CURVE_BRIDGE_ADDRESS = contractAddresses.curveBridge;
    var MAKER_TOKEN = contracts_test_utils_1.randomAddress();
    var TAKER_TOKEN = contracts_test_utils_1.randomAddress();
    var MAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(MAKER_TOKEN);
    var TAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(TAKER_TOKEN);
    var originalSamplerOperations;
    before(function () {
        originalSamplerOperations = sampler_1.DexOrderSampler.ops;
    });
    after(function () {
        sampler_1.DexOrderSampler.ops = originalSamplerOperations;
    });
    function createOrder(overrides) {
        return __assign({ chainId: CHAIN_ID, exchangeAddress: contractAddresses.exchange, makerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, takerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, senderAddress: contracts_test_utils_1.constants.NULL_ADDRESS, feeRecipientAddress: contracts_test_utils_1.randomAddress(), salt: order_utils_1.generatePseudoRandomSalt(), expirationTimeSeconds: contracts_test_utils_1.getRandomInteger(0, Math.pow(2, 64)), makerAssetData: MAKER_ASSET_DATA, takerAssetData: TAKER_ASSET_DATA, makerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, takerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, makerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), takerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), makerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, takerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, signature: utils_1.hexUtils.random() }, overrides);
    }
    function getSourceFromAssetData(assetData) {
        if (assetData.length === 74) {
            return types_2.ERC20BridgeSource.Native;
        }
        var bridgeData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(assetData);
        if (!order_utils_1.assetDataUtils.isERC20BridgeAssetData(bridgeData)) {
            throw new Error('AssetData is not ERC20BridgeAssetData');
        }
        var bridgeAddress = bridgeData.bridgeAddress;
        switch (bridgeAddress) {
            case KYBER_BRIDGE_ADDRESS.toLowerCase():
                return types_2.ERC20BridgeSource.Kyber;
            case ETH2DAI_BRIDGE_ADDRESS.toLowerCase():
                return types_2.ERC20BridgeSource.Eth2Dai;
            case UNISWAP_BRIDGE_ADDRESS.toLowerCase():
                return types_2.ERC20BridgeSource.Uniswap;
            case UNISWAP_V2_BRIDGE_ADDRESS.toLowerCase():
                return types_2.ERC20BridgeSource.UniswapV2;
            case CURVE_BRIDGE_ADDRESS.toLowerCase():
                var curveSource = Object.keys(constants_1.DEFAULT_CURVE_OPTS).filter(function (k) { return assetData.indexOf(constants_1.DEFAULT_CURVE_OPTS[k].curveAddress.slice(2)) !== -1; });
                return curveSource[0];
            default:
                break;
        }
        throw new Error("Unknown bridge address: " + bridgeAddress);
    }
    function assertSamePrefix(actual, expected) {
        contracts_test_utils_1.expect(actual.substr(0, expected.length)).to.eq(expected);
    }
    function createOrdersFromSellRates(takerAssetAmount, rates) {
        var singleTakerAssetAmount = takerAssetAmount.div(rates.length).integerValue(utils_1.BigNumber.ROUND_UP);
        return rates.map(function (r) {
            return createOrder({
                makerAssetAmount: singleTakerAssetAmount.times(r).integerValue(),
                takerAssetAmount: singleTakerAssetAmount,
            });
        });
    }
    function createOrdersFromBuyRates(makerAssetAmount, rates) {
        var singleMakerAssetAmount = makerAssetAmount.div(rates.length).integerValue(utils_1.BigNumber.ROUND_UP);
        return rates.map(function (r) {
            return createOrder({
                makerAssetAmount: singleMakerAssetAmount,
                takerAssetAmount: singleMakerAssetAmount.div(r).integerValue(),
            });
        });
    }
    var ORDER_DOMAIN = {
        exchangeAddress: contractAddresses.exchange,
        chainId: CHAIN_ID,
    };
    function createSamplesFromRates(source, inputs, rates) {
        var samples = [];
        inputs.forEach(function (input, i) {
            var rate = rates[i];
            samples.push({
                source: source,
                input: new utils_1.BigNumber(input),
                output: new utils_1.BigNumber(input)
                    .minus(i === 0 ? 0 : samples[i - 1].input)
                    .times(rate)
                    .plus(i === 0 ? 0 : samples[i - 1].output)
                    .integerValue(),
            });
        });
        return samples;
    }
    function createGetMultipleSellQuotesOperationFromRates(rates) {
        return function (sources, makerToken, takerToken, fillAmounts, wethAddress) {
            return sources.map(function (s) { return createSamplesFromRates(s, fillAmounts, rates[s]); });
        };
    }
    function callTradeOperationAndRetainLiquidityProviderParams(tradeOperation, rates) {
        var liquidityPoolParams = {
            sources: [],
            liquidityProviderAddress: undefined,
        };
        var fn = function (sources, makerToken, takerToken, fillAmounts, wethAddress, liquidityProviderAddress) {
            liquidityPoolParams.liquidityProviderAddress = liquidityProviderAddress;
            liquidityPoolParams.sources = sources;
            return tradeOperation(rates)(sources, makerToken, takerToken, fillAmounts, wethAddress, liquidityProviderAddress);
        };
        return [liquidityPoolParams, fn];
    }
    function createGetMultipleBuyQuotesOperationFromRates(rates) {
        return function (sources, makerToken, takerToken, fillAmounts, wethAddress) {
            return sources.map(function (s) { return createSamplesFromRates(s, fillAmounts, rates[s].map(function (r) { return new utils_1.BigNumber(1).div(r); })); });
        };
    }
    function createGetMedianSellRate(rate) {
        return function (sources, makerToken, takerToken, fillAmounts, wethAddress) {
            return new utils_1.BigNumber(rate);
        };
    }
    function getLiquidityProviderFromRegistry() {
        return function (registryAddress, takerToken, makerToken) {
            return utils_1.NULL_ADDRESS;
        };
    }
    function getLiquidityProviderFromRegistryAndReturnCallParameters(liquidityProviderAddress) {
        if (liquidityProviderAddress === void 0) { liquidityProviderAddress = utils_1.NULL_ADDRESS; }
        var callArgs = {
            registryAddress: undefined,
            takerToken: undefined,
            makerToken: undefined,
        };
        var fn = function (registryAddress, takerToken, makerToken) {
            callArgs.makerToken = makerToken;
            callArgs.takerToken = takerToken;
            callArgs.registryAddress = registryAddress;
            return liquidityProviderAddress;
        };
        return [callArgs, fn];
    }
    function createDecreasingRates(count) {
        var rates = [];
        var initialRate = contracts_test_utils_1.getRandomFloat(1e-3, 1e2);
        _.times(count, function () { return contracts_test_utils_1.getRandomFloat(0.95, 1); }).forEach(function (r, i) {
            var prevRate = i === 0 ? initialRate : rates[i - 1];
            rates.push(prevRate.times(r));
        });
        return rates;
    }
    var NUM_SAMPLES = 3;
    var DEFAULT_RATES = (_a = {},
        _a[types_2.ERC20BridgeSource.Native] = createDecreasingRates(NUM_SAMPLES),
        _a[types_2.ERC20BridgeSource.Eth2Dai] = createDecreasingRates(NUM_SAMPLES),
        _a[types_2.ERC20BridgeSource.Kyber] = createDecreasingRates(NUM_SAMPLES),
        _a[types_2.ERC20BridgeSource.Uniswap] = createDecreasingRates(NUM_SAMPLES),
        _a[types_2.ERC20BridgeSource.UniswapV2] = createDecreasingRates(NUM_SAMPLES),
        _a[types_2.ERC20BridgeSource.UniswapV2Eth] = createDecreasingRates(NUM_SAMPLES),
        _a[types_2.ERC20BridgeSource.CurveUsdcDai] = _.times(NUM_SAMPLES, function () { return 0; }),
        _a[types_2.ERC20BridgeSource.CurveUsdcDaiUsdt] = _.times(NUM_SAMPLES, function () { return 0; }),
        _a[types_2.ERC20BridgeSource.CurveUsdcDaiUsdtTusd] = _.times(NUM_SAMPLES, function () { return 0; }),
        _a[types_2.ERC20BridgeSource.CurveUsdcDaiUsdtBusd] = _.times(NUM_SAMPLES, function () { return 0; }),
        _a[types_2.ERC20BridgeSource.CurveUsdcDaiUsdtSusd] = _.times(NUM_SAMPLES, function () { return 0; }),
        _a[types_2.ERC20BridgeSource.LiquidityProvider] = _.times(NUM_SAMPLES, function () { return 0; }),
        _a);
    var DEFAULT_OPS = {
        getOrderFillableTakerAmounts: function (orders) {
            return orders.map(function (o) { return o.takerAssetAmount; });
        },
        getOrderFillableMakerAmounts: function (orders) {
            return orders.map(function (o) { return o.makerAssetAmount; });
        },
        getSellQuotes: createGetMultipleSellQuotesOperationFromRates(DEFAULT_RATES),
        getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(DEFAULT_RATES),
        getMedianSellRate: createGetMedianSellRate(1),
        getLiquidityProviderFromRegistry: getLiquidityProviderFromRegistry(),
    };
    function replaceSamplerOps(ops) {
        if (ops === void 0) { ops = {}; }
        sampler_1.DexOrderSampler.ops = __assign({}, DEFAULT_OPS, ops);
    }
    var MOCK_SAMPLER = {
        executeAsync: function () {
            var ops = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                ops[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, ops];
                });
            });
        },
        executeBatchAsync: function (ops) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, ops];
                });
            });
        },
    };
    describe('MarketOperationUtils', function () {
        var marketOperationUtils;
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                marketOperationUtils = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                return [2 /*return*/];
            });
        }); });
        describe('getMarketSellOrdersAsync()', function () {
            var FILL_AMOUNT = new utils_1.BigNumber('100e18');
            var ORDERS = createOrdersFromSellRates(FILL_AMOUNT, _.times(NUM_SAMPLES, function (i) { return DEFAULT_RATES[types_2.ERC20BridgeSource.Native][i]; }));
            var DEFAULT_OPTS = {
                numSamples: NUM_SAMPLES,
                sampleDistributionBase: 1,
                bridgeSlippage: 0,
                maxFallbackSlippage: 100,
                excludedSources: __spread([
                    types_2.ERC20BridgeSource.Uniswap,
                    types_2.ERC20BridgeSource.UniswapV2Eth
                ], Object.keys(constants_1.DEFAULT_CURVE_OPTS)),
                allowFallback: false,
                shouldBatchBridgeOrders: false,
            };
            beforeEach(function () {
                replaceSamplerOps();
            });
            it('queries `numSamples` samples', function () { return __awaiter(_this, void 0, void 0, function () {
                var numSamples, actualNumSamples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numSamples = _.random(1, NUM_SAMPLES);
                            actualNumSamples = 0;
                            replaceSamplerOps({
                                getSellQuotes: function (sources, makerToken, takerToken, amounts, wethAddress) {
                                    actualNumSamples = amounts.length;
                                    return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                                },
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: numSamples }))];
                        case 1:
                            _a.sent();
                            contracts_test_utils_1.expect(actualNumSamples).eq(numSamples);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('polls all DEXes if `excludedSources` is empty', function () { return __awaiter(_this, void 0, void 0, function () {
                var sourcesPolled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sourcesPolled = [];
                            replaceSamplerOps({
                                getSellQuotes: function (sources, makerToken, takerToken, amounts, wethAddress) {
                                    sourcesPolled = sources.slice();
                                    return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                                },
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { excludedSources: [] }))];
                        case 1:
                            _a.sent();
                            contracts_test_utils_1.expect(sourcesPolled.sort()).to.deep.eq(constants_1.SELL_SOURCES.slice().sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('polls the liquidity provider when the registry is provided in the arguments', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, args, fn, registryAddress, newMarketOperationUtils;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = __read(callTradeOperationAndRetainLiquidityProviderParams(createGetMultipleSellQuotesOperationFromRates, DEFAULT_RATES), 2), args = _a[0], fn = _a[1];
                            replaceSamplerOps({
                                getSellQuotes: fn,
                            });
                            registryAddress = contracts_test_utils_1.randomAddress();
                            newMarketOperationUtils = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN, registryAddress);
                            return [4 /*yield*/, newMarketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { excludedSources: [] }))];
                        case 1:
                            _b.sent();
                            contracts_test_utils_1.expect(args.sources.sort()).to.deep.eq(constants_1.SELL_SOURCES.concat([types_2.ERC20BridgeSource.LiquidityProvider]).sort());
                            contracts_test_utils_1.expect(args.liquidityProviderAddress).to.eql(registryAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not poll DEXes in `excludedSources`', function () { return __awaiter(_this, void 0, void 0, function () {
                var excludedSources, sourcesPolled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            excludedSources = _.sampleSize(constants_1.SELL_SOURCES, _.random(1, constants_1.SELL_SOURCES.length));
                            sourcesPolled = [];
                            replaceSamplerOps({
                                getSellQuotes: function (sources, makerToken, takerToken, amounts, wethAddress) {
                                    sourcesPolled = sources.slice();
                                    return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                                },
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { excludedSources: excludedSources }))];
                        case 1:
                            _a.sent();
                            contracts_test_utils_1.expect(sourcesPolled.sort()).to.deep.eq(_.without.apply(_, __spread([constants_1.SELL_SOURCES], excludedSources)).sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('generates bridge orders with correct asset data', function () { return __awaiter(_this, void 0, void 0, function () {
                var e_1, _a, improvedOrders, improvedOrders_1, improvedOrders_1_1, order, makerAssetDataPrefix;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(
                            // Pass in empty orders to prevent native orders from being used.
                            ORDERS.map(function (o) { return (__assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT })); }), FILL_AMOUNT, DEFAULT_OPTS)];
                        case 1:
                            improvedOrders = _b.sent();
                            contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                            try {
                                for (improvedOrders_1 = __values(improvedOrders), improvedOrders_1_1 = improvedOrders_1.next(); !improvedOrders_1_1.done; improvedOrders_1_1 = improvedOrders_1.next()) {
                                    order = improvedOrders_1_1.value;
                                    contracts_test_utils_1.expect(getSourceFromAssetData(order.makerAssetData)).to.exist('');
                                    makerAssetDataPrefix = utils_1.hexUtils.slice(order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(MAKER_TOKEN, contracts_test_utils_1.constants.NULL_ADDRESS, contracts_test_utils_1.constants.NULL_BYTES), 0, 36);
                                    assertSamePrefix(order.makerAssetData, makerAssetDataPrefix);
                                    contracts_test_utils_1.expect(order.takerAssetData).to.eq(TAKER_ASSET_DATA);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (improvedOrders_1_1 && !improvedOrders_1_1.done && (_a = improvedOrders_1.return)) _a.call(improvedOrders_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            it('generates bridge orders with correct taker amount', function () { return __awaiter(_this, void 0, void 0, function () {
                var improvedOrders, totalTakerAssetAmount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(
                            // Pass in empty orders to prevent native orders from being used.
                            ORDERS.map(function (o) { return (__assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT })); }), FILL_AMOUNT, DEFAULT_OPTS)];
                        case 1:
                            improvedOrders = _a.sent();
                            totalTakerAssetAmount = utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(improvedOrders.map(function (o) { return o.takerAssetAmount; })));
                            contracts_test_utils_1.expect(totalTakerAssetAmount).to.bignumber.gte(FILL_AMOUNT);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('generates bridge orders with max slippage of `bridgeSlippage`', function () { return __awaiter(_this, void 0, void 0, function () {
                var e_2, _a, bridgeSlippage, improvedOrders, improvedOrders_2, improvedOrders_2_1, order, expectedMakerAmount, slippage;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            bridgeSlippage = _.random(0.1, true);
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(
                                // Pass in empty orders to prevent native orders from being used.
                                ORDERS.map(function (o) { return (__assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT })); }), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { bridgeSlippage: bridgeSlippage }))];
                        case 1:
                            improvedOrders = _b.sent();
                            contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                            try {
                                for (improvedOrders_2 = __values(improvedOrders), improvedOrders_2_1 = improvedOrders_2.next(); !improvedOrders_2_1.done; improvedOrders_2_1 = improvedOrders_2.next()) {
                                    order = improvedOrders_2_1.value;
                                    expectedMakerAmount = order.fills[0].output;
                                    slippage = 1 - order.makerAssetAmount.div(expectedMakerAmount.plus(1)).toNumber();
                                    contracts_test_utils_1.assertRoughlyEquals(slippage, bridgeSlippage, 1);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (improvedOrders_2_1 && !improvedOrders_2_1.done && (_a = improvedOrders_2.return)) _a.call(improvedOrders_2);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            it('can mix convex sources', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderSources, expectedSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.Native] = [0.4, 0.3, 0.2, 0.1];
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [0.5, 0.05, 0.05, 0.05];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.6, 0.05, 0.05, 0.05];
                            rates[types_2.ERC20BridgeSource.Kyber] = [0, 0, 0, 0]; // unused
                            replaceSamplerOps({
                                getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4 }))];
                        case 1:
                            improvedOrders = _a.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            expectedSources = [
                                types_2.ERC20BridgeSource.Eth2Dai,
                                types_2.ERC20BridgeSource.UniswapV2,
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Native,
                            ];
                            contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            var ETH_TO_MAKER_RATE = 1.5;
            it('factors in fees for native orders', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, nativeFeeRate, rates, feeSchedule, improvedOrders, orderSources, expectedSources;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            nativeFeeRate = 0.06;
                            rates = (_a = {},
                                _a[types_2.ERC20BridgeSource.Native] = [1, 0.99, 0.98, 0.97],
                                _a[types_2.ERC20BridgeSource.UniswapV2] = [0.96, 0.1, 0.1, 0.1],
                                _a[types_2.ERC20BridgeSource.Eth2Dai] = [0.95, 0.1, 0.1, 0.1],
                                _a[types_2.ERC20BridgeSource.Kyber] = [0.1, 0.1, 0.1, 0.1],
                                _a);
                            feeSchedule = (_b = {},
                                _b[types_2.ERC20BridgeSource.Native] = FILL_AMOUNT.div(4)
                                    .times(nativeFeeRate)
                                    .dividedToIntegerBy(ETH_TO_MAKER_RATE),
                                _b);
                            replaceSamplerOps({
                                getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                                getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule: feeSchedule }))];
                        case 1:
                            improvedOrders = _c.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            expectedSources = [
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.UniswapV2,
                                types_2.ERC20BridgeSource.Eth2Dai,
                                types_2.ERC20BridgeSource.Native,
                            ];
                            contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('factors in fees for dexes', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, uniswapFeeRate, rates, feeSchedule, improvedOrders, orderSources, expectedSources;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            uniswapFeeRate = 0.2;
                            rates = (_a = {},
                                _a[types_2.ERC20BridgeSource.Native] = [0.95, 0.1, 0.1, 0.1],
                                _a[types_2.ERC20BridgeSource.Kyber] = [0.1, 0.1, 0.1, 0.1],
                                _a[types_2.ERC20BridgeSource.Eth2Dai] = [0.92, 0.1, 0.1, 0.1],
                                // Effectively [0.8, ~0.5, ~0, ~0]
                                _a[types_2.ERC20BridgeSource.UniswapV2] = [1, 0.7, 0.2, 0.2],
                                _a);
                            feeSchedule = (_b = {},
                                _b[types_2.ERC20BridgeSource.Uniswap] = FILL_AMOUNT.div(4)
                                    .times(uniswapFeeRate)
                                    .dividedToIntegerBy(ETH_TO_MAKER_RATE),
                                _b);
                            replaceSamplerOps({
                                getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                                getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule: feeSchedule }))];
                        case 1:
                            improvedOrders = _c.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            expectedSources = [
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Eth2Dai,
                                types_2.ERC20BridgeSource.UniswapV2,
                            ];
                            contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('can mix one concave source', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, rates, improvedOrders, orderSources, expectedSources;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            rates = (_a = {},
                                _a[types_2.ERC20BridgeSource.Kyber] = [0, 0, 0, 0],
                                _a[types_2.ERC20BridgeSource.Eth2Dai] = [0.5, 0.85, 0.75, 0.75],
                                _a[types_2.ERC20BridgeSource.UniswapV2] = [0.96, 0.2, 0.1, 0.1],
                                _a[types_2.ERC20BridgeSource.Native] = [0.95, 0.2, 0.2, 0.1],
                                _a);
                            replaceSamplerOps({
                                getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                                getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4 }))];
                        case 1:
                            improvedOrders = _b.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            expectedSources = [
                                types_2.ERC20BridgeSource.Eth2Dai,
                                types_2.ERC20BridgeSource.UniswapV2,
                                types_2.ERC20BridgeSource.Native,
                            ];
                            contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fallback orders use different sources', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderSources, firstSources, secondSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.Native] = [0.9, 0.8, 0.5, 0.5];
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [0.6, 0.05, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.4, 0.3, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Kyber] = [0.35, 0.2, 0.01, 0.01];
                            replaceSamplerOps({
                                getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true }))];
                        case 1:
                            improvedOrders = _a.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            firstSources = [
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.UniswapV2,
                            ];
                            secondSources = [types_2.ERC20BridgeSource.Eth2Dai, types_2.ERC20BridgeSource.Kyber];
                            contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                            contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not create a fallback if below maxFallbackSlippage', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderSources, firstSources, secondSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.Native] = [1, 1, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [1, 1, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.49, 0.49, 0.49];
                            rates[types_2.ERC20BridgeSource.Kyber] = [0.35, 0.2, 0.01, 0.01];
                            replaceSamplerOps({
                                getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true, maxFallbackSlippage: 0.25 }))];
                        case 1:
                            improvedOrders = _a.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            firstSources = [types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.UniswapV2];
                            secondSources = [];
                            contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                            contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('is able to create a order from LiquidityProvider', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, registryAddress, liquidityProviderAddress, xAsset, yAsset, toSell, _b, getSellQuotesParams, getSellQuotesFn, _c, getLiquidityProviderParams, getLiquidityProviderFn, sampler, result, decodedAssetData;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            registryAddress = contracts_test_utils_1.randomAddress();
                            liquidityProviderAddress = contracts_test_utils_1.randomAddress();
                            xAsset = contracts_test_utils_1.randomAddress();
                            yAsset = contracts_test_utils_1.randomAddress();
                            toSell = utils_1.fromTokenUnitAmount(10);
                            _b = __read(callTradeOperationAndRetainLiquidityProviderParams(createGetMultipleSellQuotesOperationFromRates, (_a = {},
                                _a[types_2.ERC20BridgeSource.LiquidityProvider] = createDecreasingRates(5),
                                _a)), 2), getSellQuotesParams = _b[0], getSellQuotesFn = _b[1];
                            _c = __read(getLiquidityProviderFromRegistryAndReturnCallParameters(liquidityProviderAddress), 2), getLiquidityProviderParams = _c[0], getLiquidityProviderFn = _c[1];
                            replaceSamplerOps({
                                getOrderFillableTakerAmounts: function () { return [contracts_test_utils_1.constants.ZERO_AMOUNT]; },
                                getSellQuotes: getSellQuotesFn,
                                getLiquidityProviderFromRegistry: getLiquidityProviderFn,
                            });
                            sampler = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN, registryAddress);
                            return [4 /*yield*/, sampler.getMarketSellOrdersAsync([
                                    createOrder({
                                        makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(xAsset),
                                        takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(yAsset),
                                    }),
                                ], dev_utils_1.Web3Wrapper.toBaseUnitAmount(10, 18), { excludedSources: constants_1.SELL_SOURCES, numSamples: 4, bridgeSlippage: 0, shouldBatchBridgeOrders: false })];
                        case 1:
                            result = _d.sent();
                            contracts_test_utils_1.expect(result.length).to.eql(1);
                            contracts_test_utils_1.expect(result[0].makerAddress).to.eql(liquidityProviderAddress);
                            decodedAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(result[0].makerAssetData);
                            contracts_test_utils_1.expect(decodedAssetData.assetProxyId).to.eql(types_1.AssetProxyId.ERC20Bridge);
                            contracts_test_utils_1.expect(decodedAssetData.bridgeAddress).to.eql(liquidityProviderAddress);
                            contracts_test_utils_1.expect(result[0].takerAssetAmount).to.bignumber.eql(toSell);
                            contracts_test_utils_1.expect(getSellQuotesParams.sources).contains(types_2.ERC20BridgeSource.LiquidityProvider);
                            contracts_test_utils_1.expect(getSellQuotesParams.liquidityProviderAddress).is.eql(registryAddress);
                            contracts_test_utils_1.expect(getLiquidityProviderParams.registryAddress).is.eql(registryAddress);
                            contracts_test_utils_1.expect(getLiquidityProviderParams.makerToken).is.eql(yAsset);
                            contracts_test_utils_1.expect(getLiquidityProviderParams.takerToken).is.eql(xAsset);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('batches contiguous bridge sources', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderFillSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [1, 0.01, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Native] = [0.5, 0.01, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.01, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.CurveUsdcDai] = [0.48, 0.01, 0.01, 0.01];
                            replaceSamplerOps({
                                getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, excludedSources: __spread([
                                        types_2.ERC20BridgeSource.Kyber
                                    ], _.without(DEFAULT_OPTS.excludedSources, types_2.ERC20BridgeSource.CurveUsdcDai)), shouldBatchBridgeOrders: true }))];
                        case 1:
                            improvedOrders = _a.sent();
                            contracts_test_utils_1.expect(improvedOrders).to.be.length(3);
                            orderFillSources = improvedOrders.map(function (o) { return o.fills.map(function (f) { return f.source; }); });
                            contracts_test_utils_1.expect(orderFillSources).to.deep.eq([
                                [types_2.ERC20BridgeSource.UniswapV2],
                                [types_2.ERC20BridgeSource.Native],
                                [types_2.ERC20BridgeSource.Eth2Dai, types_2.ERC20BridgeSource.CurveUsdcDai],
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getMarketBuyOrdersAsync()', function () {
            var FILL_AMOUNT = new utils_1.BigNumber('100e18');
            var ORDERS = createOrdersFromBuyRates(FILL_AMOUNT, _.times(NUM_SAMPLES, function () { return DEFAULT_RATES[types_2.ERC20BridgeSource.Native][0]; }));
            var DEFAULT_OPTS = {
                numSamples: NUM_SAMPLES,
                sampleDistributionBase: 1,
                bridgeSlippage: 0,
                maxFallbackSlippage: 100,
                excludedSources: __spread(Object.keys(constants_1.DEFAULT_CURVE_OPTS), [
                    types_2.ERC20BridgeSource.Kyber,
                    types_2.ERC20BridgeSource.Uniswap,
                    types_2.ERC20BridgeSource.UniswapV2Eth,
                ]),
                allowFallback: false,
                shouldBatchBridgeOrders: false,
            };
            beforeEach(function () {
                replaceSamplerOps();
            });
            it('queries `numSamples` samples', function () { return __awaiter(_this, void 0, void 0, function () {
                var numSamples, actualNumSamples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numSamples = _.random(1, 16);
                            actualNumSamples = 0;
                            replaceSamplerOps({
                                getBuyQuotes: function (sources, makerToken, takerToken, amounts, wethAddress) {
                                    actualNumSamples = amounts.length;
                                    return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                                },
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: numSamples }))];
                        case 1:
                            _a.sent();
                            contracts_test_utils_1.expect(actualNumSamples).eq(numSamples);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('polls all DEXes if `excludedSources` is empty', function () { return __awaiter(_this, void 0, void 0, function () {
                var sourcesPolled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sourcesPolled = [];
                            replaceSamplerOps({
                                getBuyQuotes: function (sources, makerToken, takerToken, amounts, wethAddress) {
                                    sourcesPolled = sources.slice();
                                    return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                                },
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { excludedSources: [] }))];
                        case 1:
                            _a.sent();
                            contracts_test_utils_1.expect(sourcesPolled).to.deep.eq(constants_1.BUY_SOURCES);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('polls the liquidity provider when the registry is provided in the arguments', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, args, fn, registryAddress, newMarketOperationUtils;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = __read(callTradeOperationAndRetainLiquidityProviderParams(createGetMultipleBuyQuotesOperationFromRates, DEFAULT_RATES), 2), args = _a[0], fn = _a[1];
                            replaceSamplerOps({
                                getBuyQuotes: fn,
                            });
                            registryAddress = contracts_test_utils_1.randomAddress();
                            newMarketOperationUtils = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN, registryAddress);
                            return [4 /*yield*/, newMarketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { excludedSources: [] }))];
                        case 1:
                            _b.sent();
                            contracts_test_utils_1.expect(args.sources.sort()).to.deep.eq(constants_1.BUY_SOURCES.concat([types_2.ERC20BridgeSource.LiquidityProvider]).sort());
                            contracts_test_utils_1.expect(args.liquidityProviderAddress).to.eql(registryAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not poll DEXes in `excludedSources`', function () { return __awaiter(_this, void 0, void 0, function () {
                var excludedSources, sourcesPolled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            excludedSources = _.sampleSize(constants_1.SELL_SOURCES, _.random(1, constants_1.SELL_SOURCES.length));
                            sourcesPolled = [];
                            replaceSamplerOps({
                                getBuyQuotes: function (sources, makerToken, takerToken, amounts, wethAddress) {
                                    sourcesPolled = sources.slice();
                                    return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                                },
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { excludedSources: excludedSources }))];
                        case 1:
                            _a.sent();
                            contracts_test_utils_1.expect(sourcesPolled).to.deep.eq(_.without.apply(_, __spread([constants_1.BUY_SOURCES], excludedSources)));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('generates bridge orders with correct asset data', function () { return __awaiter(_this, void 0, void 0, function () {
                var e_3, _a, improvedOrders, improvedOrders_3, improvedOrders_3_1, order, makerAssetDataPrefix;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(
                            // Pass in empty orders to prevent native orders from being used.
                            ORDERS.map(function (o) { return (__assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT })); }), FILL_AMOUNT, DEFAULT_OPTS)];
                        case 1:
                            improvedOrders = _b.sent();
                            contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                            try {
                                for (improvedOrders_3 = __values(improvedOrders), improvedOrders_3_1 = improvedOrders_3.next(); !improvedOrders_3_1.done; improvedOrders_3_1 = improvedOrders_3.next()) {
                                    order = improvedOrders_3_1.value;
                                    contracts_test_utils_1.expect(getSourceFromAssetData(order.makerAssetData)).to.exist('');
                                    makerAssetDataPrefix = utils_1.hexUtils.slice(order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(MAKER_TOKEN, contracts_test_utils_1.constants.NULL_ADDRESS, contracts_test_utils_1.constants.NULL_BYTES), 0, 36);
                                    assertSamePrefix(order.makerAssetData, makerAssetDataPrefix);
                                    contracts_test_utils_1.expect(order.takerAssetData).to.eq(TAKER_ASSET_DATA);
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (improvedOrders_3_1 && !improvedOrders_3_1.done && (_a = improvedOrders_3.return)) _a.call(improvedOrders_3);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            it('generates bridge orders with correct maker amount', function () { return __awaiter(_this, void 0, void 0, function () {
                var improvedOrders, totalMakerAssetAmount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(
                            // Pass in empty orders to prevent native orders from being used.
                            ORDERS.map(function (o) { return (__assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT })); }), FILL_AMOUNT, DEFAULT_OPTS)];
                        case 1:
                            improvedOrders = _a.sent();
                            totalMakerAssetAmount = utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(improvedOrders.map(function (o) { return o.makerAssetAmount; })));
                            contracts_test_utils_1.expect(totalMakerAssetAmount).to.bignumber.gte(FILL_AMOUNT);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('generates bridge orders with max slippage of `bridgeSlippage`', function () { return __awaiter(_this, void 0, void 0, function () {
                var e_4, _a, bridgeSlippage, improvedOrders, improvedOrders_4, improvedOrders_4_1, order, expectedTakerAmount, slippage;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            bridgeSlippage = _.random(0.1, true);
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(
                                // Pass in empty orders to prevent native orders from being used.
                                ORDERS.map(function (o) { return (__assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT })); }), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { bridgeSlippage: bridgeSlippage }))];
                        case 1:
                            improvedOrders = _b.sent();
                            contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                            try {
                                for (improvedOrders_4 = __values(improvedOrders), improvedOrders_4_1 = improvedOrders_4.next(); !improvedOrders_4_1.done; improvedOrders_4_1 = improvedOrders_4.next()) {
                                    order = improvedOrders_4_1.value;
                                    expectedTakerAmount = order.fills[0].output;
                                    slippage = order.takerAssetAmount.div(expectedTakerAmount.plus(1)).toNumber() - 1;
                                    contracts_test_utils_1.assertRoughlyEquals(slippage, bridgeSlippage, 1);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (improvedOrders_4_1 && !improvedOrders_4_1.done && (_a = improvedOrders_4.return)) _a.call(improvedOrders_4);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            it('can mix convex sources', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderSources, expectedSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.Native] = [0.4, 0.3, 0.2, 0.1];
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [0.5, 0.05, 0.05, 0.05];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.6, 0.05, 0.05, 0.05];
                            replaceSamplerOps({
                                getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4 }))];
                        case 1:
                            improvedOrders = _a.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            expectedSources = [
                                types_2.ERC20BridgeSource.Eth2Dai,
                                types_2.ERC20BridgeSource.UniswapV2,
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Native,
                            ];
                            contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            var ETH_TO_TAKER_RATE = 1.5;
            it('factors in fees for native orders', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, nativeFeeRate, rates, feeSchedule, improvedOrders, orderSources, expectedSources;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            nativeFeeRate = 0.06;
                            rates = (_a = {},
                                _a[types_2.ERC20BridgeSource.Native] = [1, 0.99, 0.98, 0.97],
                                _a[types_2.ERC20BridgeSource.UniswapV2] = [0.96, 0.1, 0.1, 0.1],
                                _a[types_2.ERC20BridgeSource.Eth2Dai] = [0.95, 0.1, 0.1, 0.1],
                                _a[types_2.ERC20BridgeSource.Kyber] = [0.1, 0.1, 0.1, 0.1],
                                _a);
                            feeSchedule = (_b = {},
                                _b[types_2.ERC20BridgeSource.Native] = FILL_AMOUNT.div(4)
                                    .times(nativeFeeRate)
                                    .dividedToIntegerBy(ETH_TO_TAKER_RATE),
                                _b);
                            replaceSamplerOps({
                                getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                                getMedianSellRate: createGetMedianSellRate(ETH_TO_TAKER_RATE),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule: feeSchedule }))];
                        case 1:
                            improvedOrders = _c.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            expectedSources = [
                                types_2.ERC20BridgeSource.UniswapV2,
                                types_2.ERC20BridgeSource.Eth2Dai,
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Native,
                            ];
                            contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('factors in fees for dexes', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, uniswapFeeRate, rates, feeSchedule, improvedOrders, orderSources, expectedSources;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            uniswapFeeRate = 0.2;
                            rates = (_a = {},
                                _a[types_2.ERC20BridgeSource.Native] = [0.95, 0.1, 0.1, 0.1],
                                // Effectively [0.8, ~0.5, ~0, ~0]
                                _a[types_2.ERC20BridgeSource.UniswapV2] = [1, 0.7, 0.2, 0.2],
                                _a[types_2.ERC20BridgeSource.Eth2Dai] = [0.92, 0.1, 0.1, 0.1],
                                _a);
                            feeSchedule = (_b = {},
                                _b[types_2.ERC20BridgeSource.UniswapV2] = FILL_AMOUNT.div(4)
                                    .times(uniswapFeeRate)
                                    .dividedToIntegerBy(ETH_TO_TAKER_RATE),
                                _b);
                            replaceSamplerOps({
                                getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                                getMedianSellRate: createGetMedianSellRate(ETH_TO_TAKER_RATE),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule: feeSchedule }))];
                        case 1:
                            improvedOrders = _c.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            expectedSources = [
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Eth2Dai,
                                types_2.ERC20BridgeSource.UniswapV2,
                            ];
                            contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fallback orders use different sources', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderSources, firstSources, secondSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.Native] = [0.9, 0.8, 0.5, 0.5];
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [0.6, 0.05, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.4, 0.3, 0.01, 0.01];
                            replaceSamplerOps({
                                getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true }))];
                        case 1:
                            improvedOrders = _a.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            firstSources = [
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.Native,
                                types_2.ERC20BridgeSource.UniswapV2,
                            ];
                            secondSources = [types_2.ERC20BridgeSource.Eth2Dai];
                            contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                            contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not create a fallback if below maxFallbackSlippage', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderSources, firstSources, secondSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.Native] = [1, 1, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [1, 1, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.49, 0.49, 0.49];
                            replaceSamplerOps({
                                getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true, maxFallbackSlippage: 0.25 }))];
                        case 1:
                            improvedOrders = _a.sent();
                            orderSources = improvedOrders.map(function (o) { return o.fills[0].source; });
                            firstSources = [types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.UniswapV2];
                            secondSources = [];
                            contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                            contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
                            return [2 /*return*/];
                    }
                });
            }); });
            it('batches contiguous bridge sources', function () { return __awaiter(_this, void 0, void 0, function () {
                var rates, improvedOrders, orderFillSources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rates = {};
                            rates[types_2.ERC20BridgeSource.Native] = [0.5, 0.01, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.01, 0.01, 0.01];
                            rates[types_2.ERC20BridgeSource.UniswapV2] = [0.48, 0.47, 0.01, 0.01];
                            replaceSamplerOps({
                                getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                            });
                            return [4 /*yield*/, marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, __assign({}, DEFAULT_OPTS, { numSamples: 4, shouldBatchBridgeOrders: true }))];
                        case 1:
                            improvedOrders = _a.sent();
                            contracts_test_utils_1.expect(improvedOrders).to.be.length(2);
                            orderFillSources = improvedOrders.map(function (o) { return o.fills.map(function (f) { return f.source; }); });
                            contracts_test_utils_1.expect(orderFillSources).to.deep.eq([
                                [types_2.ERC20BridgeSource.Native],
                                [types_2.ERC20BridgeSource.Eth2Dai, types_2.ERC20BridgeSource.UniswapV2],
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('createFillPaths', function () {
        var _a;
        var takerAssetAmount = new utils_1.BigNumber(5000000);
        var ethToOutputRate = new utils_1.BigNumber(0.5);
        // tslint:disable-next-line:no-object-literal-type-assertion
        var smallOrder = {
            chainId: 1,
            makerAddress: 'SMALL_ORDER',
            takerAddress: utils_1.NULL_ADDRESS,
            takerAssetAmount: takerAssetAmount,
            makerAssetAmount: takerAssetAmount.times(2),
            makerFee: constants_1.ZERO_AMOUNT,
            takerFee: constants_1.ZERO_AMOUNT,
            makerAssetData: '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            takerAssetData: '0xf47261b0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            makerFeeAssetData: '0x',
            takerFeeAssetData: '0x',
            fillableTakerAssetAmount: takerAssetAmount,
            fillableMakerAssetAmount: takerAssetAmount.times(2),
            fillableTakerFeeAmount: constants_1.ZERO_AMOUNT,
        };
        var largeOrder = __assign({}, smallOrder, { makerAddress: 'LARGE_ORDER', fillableMakerAssetAmount: smallOrder.fillableMakerAssetAmount.times(2), fillableTakerAssetAmount: smallOrder.fillableTakerAssetAmount.times(2), makerAssetAmount: smallOrder.makerAssetAmount.times(2), takerAssetAmount: smallOrder.takerAssetAmount.times(2) });
        var orders = [smallOrder, largeOrder];
        var feeSchedule = (_a = {},
            _a[types_2.ERC20BridgeSource.Native] = new utils_1.BigNumber(2e5),
            _a);
        it('penalizes native fill based on target amount when target is smaller', function () {
            var path = fills_1.createFillPaths({
                side: src_1.MarketOperation.Sell,
                orders: orders,
                dexQuotes: [],
                targetInput: takerAssetAmount.minus(1),
                ethToOutputRate: ethToOutputRate,
                feeSchedule: feeSchedule,
            });
            contracts_test_utils_1.expect(path[0][0].fillData.order.makerAddress).to.eq(smallOrder.makerAddress);
            contracts_test_utils_1.expect(path[0][0].input).to.be.bignumber.eq(takerAssetAmount.minus(1));
        });
        it('penalizes native fill based on available amount when target is larger', function () {
            var path = fills_1.createFillPaths({
                side: src_1.MarketOperation.Sell,
                orders: orders,
                dexQuotes: [],
                targetInput: constants_1.POSITIVE_INF,
                ethToOutputRate: ethToOutputRate,
                feeSchedule: feeSchedule,
            });
            contracts_test_utils_1.expect(path[0][0].fillData.order.makerAddress).to.eq(largeOrder.makerAddress);
            contracts_test_utils_1.expect(path[0][1].fillData.order.makerAddress).to.eq(smallOrder.makerAddress);
        });
    });
});
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=market_operation_utils_test.js.map