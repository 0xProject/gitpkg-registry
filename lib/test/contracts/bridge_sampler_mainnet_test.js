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
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var subproviders_1 = require("@0x/subproviders");
var utils_1 = require("@0x/utils");
var artifacts_1 = require("../artifacts");
var wrappers_1 = require("../wrappers");
exports.VB = '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b';
// tslint:disable: custom-no-magic-numbers
contracts_test_utils_1.blockchainTests.skip('Mainnet Sampler Tests', function (env) {
    var _a;
    var testContract;
    var fakeSamplerAddress = '0x1111111111111111111111111111111111111111';
    var overrides = (_a = {},
        _a[fakeSamplerAddress] = {
            code: artifacts_1.artifacts.ERC20BridgeSampler.compilerOutput.evm.deployedBytecode.object,
        },
        _a);
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            provider = new contracts_test_utils_1.Web3ProviderEngine();
            // tslint:disable-next-line:no-non-null-assertion
            provider.addProvider(new subproviders_1.RPCSubprovider(process.env.RPC_URL));
            utils_1.providerUtils.startProviderEngine(provider);
            testContract = new wrappers_1.ERC20BridgeSamplerContract(fakeSamplerAddress, provider, __assign({}, env.txDefaults, { from: exports.VB }));
            return [2 /*return*/];
        });
    }); });
    contracts_test_utils_1.describe('Curve', function () {
        var CURVE_ADDRESS = '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51';
        var DAI_TOKEN_INDEX = new utils_1.BigNumber(0);
        var USDC_TOKEN_INDEX = new utils_1.BigNumber(1);
        var CURVE_INFO = {
            poolAddress: CURVE_ADDRESS,
            sellQuoteFunctionSelector: '0x07211ef7',
            buyQuoteFunctionSelector: '0x0e71d1b9',
        };
        contracts_test_utils_1.describe('sampleSellsFromCurve()', function () {
            it('samples sells from Curve DAI->USDC', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleSellsFromCurve(CURVE_INFO, DAI_TOKEN_INDEX, USDC_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('samples sells from Curve USDC->DAI', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleSellsFromCurve(CURVE_INFO, USDC_TOKEN_INDEX, DAI_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1, 6)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        contracts_test_utils_1.describe('sampleBuysFromCurve()', function () {
            it('samples buys from Curve DAI->USDC', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleBuysFromCurve(CURVE_INFO, DAI_TOKEN_INDEX, USDC_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1, 6)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('samples buys from Curve USDC->DAI', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleBuysFromCurve(CURVE_INFO, USDC_TOKEN_INDEX, DAI_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    contracts_test_utils_1.describe('Kyber', function () {
        var WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
        var DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
        var USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
        contracts_test_utils_1.describe('sampleSellsFromKyberNetwork()', function () {
            it('samples sells from Kyber DAI->WETH', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleSellsFromKyberNetwork(DAI, WETH, [contracts_test_utils_1.toBaseUnitAmount(1)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('samples sells from Kyber WETH->DAI', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleSellsFromKyberNetwork(WETH, DAI, [contracts_test_utils_1.toBaseUnitAmount(1)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('samples sells from Kyber DAI->USDC', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleSellsFromKyberNetwork(DAI, USDC, [contracts_test_utils_1.toBaseUnitAmount(1)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        contracts_test_utils_1.describe('sampleBuysFromKyber()', function () {
            it('samples buys from Kyber WETH->DAI', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleBuysFromKyberNetwork(WETH, DAI, [contracts_test_utils_1.toBaseUnitAmount(1)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('samples buys from Kyber DAI->WETH', function () { return __awaiter(_this, void 0, void 0, function () {
                var samples;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .sampleBuysFromKyberNetwork(DAI, WETH, [contracts_test_utils_1.toBaseUnitAmount(1)])
                                .callAsync({ overrides: overrides })];
                        case 1:
                            samples = _a.sent();
                            contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                            contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=bridge_sampler_mainnet_test.js.map