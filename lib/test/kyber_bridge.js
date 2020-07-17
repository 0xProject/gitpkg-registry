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
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.blockchainTests.resets('KyberBridge unit tests', function (env) {
    var KYBER_ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    var FROM_TOKEN_DECIMALS = 6;
    var TO_TOKEN_DECIMALS = 18;
    var FROM_TOKEN_BASE = new utils_1.BigNumber(10).pow(FROM_TOKEN_DECIMALS);
    var TO_TOKEN_BASE = new utils_1.BigNumber(10).pow(TO_TOKEN_DECIMALS);
    var WETH_BASE = new utils_1.BigNumber(10).pow(18);
    var KYBER_RATE_BASE = WETH_BASE;
    var testContract;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrappers_1.TestKyberBridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestKyberBridge, env.provider, env.txDefaults, artifacts_1.artifacts)];
                case 1:
                    testContract = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('isValidSignature()', function () {
        it('returns success bytes', function () { return __awaiter(_this, void 0, void 0, function () {
            var LEGACY_WALLET_MAGIC_VALUE, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        LEGACY_WALLET_MAGIC_VALUE = '0xb0671381';
                        return [4 /*yield*/, testContract
                                .isValidSignature(utils_1.hexUtils.random(), utils_1.hexUtils.random(_.random(0, 32)))
                                .callAsync()];
                    case 1:
                        result = _a.sent();
                        contracts_test_utils_1.expect(result).to.eq(LEGACY_WALLET_MAGIC_VALUE);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('bridgeTransferFrom()', function () {
        var fromTokenAddress;
        var toTokenAddress;
        var wethAddress;
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testContract.weth().callAsync()];
                    case 1:
                        wethAddress = _a.sent();
                        return [4 /*yield*/, testContract.createToken(FROM_TOKEN_DECIMALS).callAsync()];
                    case 2:
                        fromTokenAddress = _a.sent();
                        return [4 /*yield*/, testContract.createToken(FROM_TOKEN_DECIMALS).awaitTransactionSuccessAsync()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testContract.createToken(TO_TOKEN_DECIMALS).callAsync()];
                    case 4:
                        toTokenAddress = _a.sent();
                        return [4 /*yield*/, testContract.createToken(TO_TOKEN_DECIMALS).awaitTransactionSuccessAsync()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        var STATIC_KYBER_TRADE_ARGS = {
            maxBuyTokenAmount: contracts_test_utils_1.constants.MAX_UINT256,
            walletId: contracts_test_utils_1.constants.NULL_ADDRESS,
        };
        function createTransferFromOpts(opts) {
            var amount = contracts_test_utils_1.getRandomInteger(1, TO_TOKEN_BASE.times(100));
            return __assign({ fromTokenAddress: fromTokenAddress,
                toTokenAddress: toTokenAddress,
                amount: amount, toAddress: contracts_test_utils_1.randomAddress(), fillAmount: contracts_test_utils_1.getRandomPortion(amount), fromTokenBalance: contracts_test_utils_1.getRandomInteger(1, FROM_TOKEN_BASE.times(100)) }, opts);
        }
        function withdrawToAsync(opts) {
            return __awaiter(this, void 0, void 0, function () {
                var _opts, bridgeTransferFromFn, result, logs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _opts = createTransferFromOpts(opts);
                            // Fund the contract with input tokens.
                            return [4 /*yield*/, testContract
                                    .grantTokensTo(_opts.fromTokenAddress, testContract.address, _opts.fromTokenBalance)
                                    .awaitTransactionSuccessAsync({ value: _opts.fromTokenBalance })];
                        case 1:
                            // Fund the contract with input tokens.
                            _a.sent();
                            // Fund the contract with output tokens.
                            return [4 /*yield*/, testContract.setNextFillAmount(_opts.fillAmount).awaitTransactionSuccessAsync({
                                    value: _opts.toTokenAddress === wethAddress ? _opts.fillAmount : contracts_test_utils_1.constants.ZERO_AMOUNT,
                                })];
                        case 2:
                            // Fund the contract with output tokens.
                            _a.sent();
                            bridgeTransferFromFn = testContract.bridgeTransferFrom(
                            // Output token
                            _opts.toTokenAddress, 
                            // Random maker address.
                            contracts_test_utils_1.randomAddress(), 
                            // Recipient address.
                            _opts.toAddress, 
                            // Transfer amount.
                            _opts.amount, 
                            // ABI-encode the input token address as the bridge data.
                            utils_1.hexUtils.leftPad(_opts.fromTokenAddress));
                            return [4 /*yield*/, bridgeTransferFromFn.callAsync()];
                        case 3:
                            result = _a.sent();
                            return [4 /*yield*/, bridgeTransferFromFn.awaitTransactionSuccessAsync()];
                        case 4:
                            logs = (_a.sent()).logs;
                            return [2 /*return*/, {
                                    opts: _opts,
                                    result: result,
                                    logs: logs,
                                }];
                    }
                });
            });
        }
        function getMinimumConversionRate(opts) {
            var fromBase = opts.fromTokenAddress === wethAddress ? WETH_BASE : FROM_TOKEN_BASE;
            var toBase = opts.toTokenAddress === wethAddress ? WETH_BASE : TO_TOKEN_BASE;
            return opts.amount
                .div(toBase)
                .div(opts.fromTokenBalance.div(fromBase))
                .times(KYBER_RATE_BASE)
                .integerValue(utils_1.BigNumber.ROUND_DOWN);
        }
        it('returns magic bytes on success', function () { return __awaiter(_this, void 0, void 0, function () {
            var BRIDGE_SUCCESS_RETURN_DATA, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        BRIDGE_SUCCESS_RETURN_DATA = types_1.AssetProxyId.ERC20Bridge;
                        return [4 /*yield*/, withdrawToAsync()];
                    case 1:
                        result = (_a.sent()).result;
                        contracts_test_utils_1.expect(result).to.eq(BRIDGE_SUCCESS_RETURN_DATA);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can trade token -> token', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync()];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        contracts_test_utils_1.verifyEventsFromLogs(logs, [
                            __assign({ sellTokenAddress: opts.fromTokenAddress, buyTokenAddress: opts.toTokenAddress, sellAmount: opts.fromTokenBalance, recipientAddress: opts.toAddress, minConversionRate: getMinimumConversionRate(opts), msgValue: contracts_test_utils_1.constants.ZERO_AMOUNT }, STATIC_KYBER_TRADE_ARGS),
                        ], wrappers_1.TestKyberBridgeEvents.KyberBridgeTrade);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can trade token -> ETH', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({
                            toTokenAddress: wethAddress,
                        })];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        contracts_test_utils_1.verifyEventsFromLogs(logs, [
                            __assign({ sellTokenAddress: opts.fromTokenAddress, buyTokenAddress: KYBER_ETH_ADDRESS, sellAmount: opts.fromTokenBalance, recipientAddress: testContract.address, minConversionRate: getMinimumConversionRate(opts), msgValue: contracts_test_utils_1.constants.ZERO_AMOUNT }, STATIC_KYBER_TRADE_ARGS),
                        ], wrappers_1.TestKyberBridgeEvents.KyberBridgeTrade);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can trade ETH -> token', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({
                            fromTokenAddress: wethAddress,
                        })];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        contracts_test_utils_1.verifyEventsFromLogs(logs, [
                            __assign({ sellTokenAddress: KYBER_ETH_ADDRESS, buyTokenAddress: opts.toTokenAddress, sellAmount: opts.fromTokenBalance, recipientAddress: opts.toAddress, minConversionRate: getMinimumConversionRate(opts), msgValue: opts.fromTokenBalance }, STATIC_KYBER_TRADE_ARGS),
                        ], wrappers_1.TestKyberBridgeEvents.KyberBridgeTrade);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does nothing if bridge has no token balance', function () { return __awaiter(_this, void 0, void 0, function () {
            var logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({
                            fromTokenBalance: contracts_test_utils_1.constants.ZERO_AMOUNT,
                        })];
                    case 1:
                        logs = (_a.sent()).logs;
                        contracts_test_utils_1.expect(logs).to.be.length(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('only transfers the token if trading the same token', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({
                            toTokenAddress: fromTokenAddress,
                        })];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        contracts_test_utils_1.verifyEventsFromLogs(logs, [
                            {
                                tokenAddress: fromTokenAddress,
                                ownerAddress: testContract.address,
                                recipientAddress: opts.toAddress,
                                amount: opts.fromTokenBalance,
                            },
                        ], wrappers_1.TestKyberBridgeEvents.KyberBridgeTokenTransfer);
                        return [2 /*return*/];
                }
            });
        }); });
        it('grants Kyber an allowance when selling non-WETH', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync()];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        contracts_test_utils_1.verifyEventsFromLogs(logs, [
                            {
                                tokenAddress: opts.fromTokenAddress,
                                ownerAddress: testContract.address,
                                spenderAddress: testContract.address,
                                allowance: contracts_test_utils_1.constants.MAX_UINT256,
                            },
                        ], wrappers_1.TestKyberBridgeEvents.KyberBridgeTokenApprove);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not grant Kyber an allowance when selling WETH', function () { return __awaiter(_this, void 0, void 0, function () {
            var logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({
                            fromTokenAddress: wethAddress,
                        })];
                    case 1:
                        logs = (_a.sent()).logs;
                        contracts_test_utils_1.verifyEventsFromLogs(logs, [], wrappers_1.TestKyberBridgeEvents.KyberBridgeTokenApprove);
                        return [2 /*return*/];
                }
            });
        }); });
        it('withdraws WETH and passes it to Kyber when selling WETH', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({
                            fromTokenAddress: wethAddress,
                        })];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        contracts_test_utils_1.expect(logs[0].event).to.eq(wrappers_1.TestKyberBridgeEvents.KyberBridgeWethWithdraw);
                        contracts_test_utils_1.expect(logs[0].args).to.deep.eq({
                            ownerAddress: testContract.address,
                            amount: opts.fromTokenBalance,
                        });
                        contracts_test_utils_1.expect(logs[1].event).to.eq(wrappers_1.TestKyberBridgeEvents.KyberBridgeTrade);
                        contracts_test_utils_1.expect(logs[1].args.msgValue).to.bignumber.eq(opts.fromTokenBalance);
                        return [2 /*return*/];
                }
            });
        }); });
        it('wraps WETH and transfers it to the recipient when buyng WETH', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({
                            toTokenAddress: wethAddress,
                        })];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        contracts_test_utils_1.expect(logs[0].event).to.eq(wrappers_1.TestKyberBridgeEvents.KyberBridgeTokenApprove);
                        contracts_test_utils_1.expect(logs[0].args.tokenAddress).to.eq(opts.fromTokenAddress);
                        contracts_test_utils_1.expect(logs[1].event).to.eq(wrappers_1.TestKyberBridgeEvents.KyberBridgeTrade);
                        contracts_test_utils_1.expect(logs[1].args.recipientAddress).to.eq(testContract.address);
                        contracts_test_utils_1.expect(logs[2].event).to.eq(wrappers_1.TestKyberBridgeEvents.KyberBridgeWethDeposit);
                        contracts_test_utils_1.expect(logs[2].args).to.deep.eq({
                            msgValue: opts.fillAmount,
                            ownerAddress: testContract.address,
                            amount: opts.fillAmount,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=kyber_bridge.js.map