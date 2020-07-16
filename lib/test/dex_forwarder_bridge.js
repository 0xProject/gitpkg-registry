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
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var dex_forwarder_bridge_1 = require("../src/dex_forwarder_bridge");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
var ZERO_AMOUNT = contracts_test_utils_1.constants.ZERO_AMOUNT;
contracts_test_utils_1.blockchainTests.resets('DexForwarderBridge unit tests', function (env) {
    var testContract;
    var inputToken;
    var outputToken;
    var BRIDGE_SUCCESS = '0xdc1600f3';
    var BRIDGE_FAILURE = '0xffffffff';
    var BRIDGE_REVERT_ERROR = 'oopsie';
    var NOT_AUTHORIZED_REVERT = 'DexForwarderBridge/SENDER_NOT_AUTHORIZED';
    var DEFAULTS = {
        toAddress: contracts_test_utils_1.randomAddress(),
    };
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, wrappers_1.TestDexForwarderBridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestDexForwarderBridge, env.provider, env.txDefaults, artifacts_1.artifacts)];
                case 1:
                    testContract = _c.sent();
                    return [4 /*yield*/, callAndTransactAsync(testContract.createToken())];
                case 2:
                    _b = [
                        _c.sent()
                    ];
                    return [4 /*yield*/, callAndTransactAsync(testContract.createToken())];
                case 3:
                    // Create test tokens.
                    _a = __read.apply(void 0, [_b.concat([
                            _c.sent()
                        ]), 2]), inputToken = _a[0], outputToken = _a[1];
                    return [4 /*yield*/, callAndTransactAsync(testContract.setAuthorized(env.txDefaults.from))];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    function callAndTransactAsync(fnCall) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fnCall.callAsync()];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, fnCall.awaitTransactionSuccessAsync({}, { shouldValidate: false })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }
    function getRandomBridgeCall(bridgeAddress, fields) {
        if (fields === void 0) { fields = {}; }
        return __assign({ target: bridgeAddress, inputTokenAmount: contracts_test_utils_1.getRandomInteger(1, '100e18'), outputTokenAmount: contracts_test_utils_1.getRandomInteger(1, '100e18'), bridgeData: utils_1.hexUtils.leftPad(inputToken) }, fields);
    }
    describe('bridgeTransferFrom()', function () {
        var goodBridgeCalls;
        var revertingBridgeCall;
        var failingBridgeCall;
        var allBridgeCalls;
        var totalFillableOutputAmount;
        var totalFillableInputAmount;
        var recipientOutputBalance;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        goodBridgeCalls = [];
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < 4)) return [3 /*break*/, 4];
                        _b = (_a = goodBridgeCalls).push;
                        return [4 /*yield*/, createBridgeCallAsync({ returnCode: BRIDGE_SUCCESS })];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, createBridgeCallAsync({ revertError: BRIDGE_REVERT_ERROR })];
                    case 5:
                        revertingBridgeCall = _c.sent();
                        return [4 /*yield*/, createBridgeCallAsync({ returnCode: BRIDGE_FAILURE })];
                    case 6:
                        failingBridgeCall = _c.sent();
                        allBridgeCalls = _.shuffle(__spread([failingBridgeCall, revertingBridgeCall], goodBridgeCalls));
                        totalFillableInputAmount = utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(goodBridgeCalls.map(function (c) { return c.inputTokenAmount; })));
                        totalFillableOutputAmount = utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(goodBridgeCalls.map(function (c) { return c.outputTokenAmount; })));
                        // Grant the taker some output tokens.
                        return [4 /*yield*/, testContract.setTokenBalance(outputToken, DEFAULTS.toAddress, (recipientOutputBalance = contracts_test_utils_1.getRandomInteger(1, '100e18')))];
                    case 7:
                        // Grant the taker some output tokens.
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        function setForwarderInputBalanceAsync(amount) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testContract
                                .setTokenBalance(inputToken, testContract.address, amount)
                                .awaitTransactionSuccessAsync({}, { shouldValidate: false })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function createBridgeCallAsync(opts) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, returnCode, revertError, callFields, outputFillAmount, bridge, call;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = __assign({ returnCode: BRIDGE_SUCCESS, revertError: '' }, opts), returnCode = _a.returnCode, revertError = _a.revertError, callFields = _a.callFields, outputFillAmount = _a.outputFillAmount;
                            return [4 /*yield*/, callAndTransactAsync(testContract.createBridge(returnCode, revertError))];
                        case 1:
                            bridge = _b.sent();
                            call = getRandomBridgeCall(bridge, callFields);
                            return [4 /*yield*/, testContract
                                    .setBridgeTransferAmount(call.target, outputFillAmount || call.outputTokenAmount)
                                    .awaitTransactionSuccessAsync({}, { shouldValidate: false })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, call];
                    }
                });
            });
        }
        function callBridgeTransferFromAsync(opts) {
            return __awaiter(this, void 0, void 0, function () {
                var call, returnCode, receipt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Fund the forwarder with input tokens to sell.
                        return [4 /*yield*/, setForwarderInputBalanceAsync(opts.sellAmount || totalFillableInputAmount)];
                        case 1:
                            // Fund the forwarder with input tokens to sell.
                            _a.sent();
                            call = testContract.bridgeTransferFrom(outputToken, testContract.address, DEFAULTS.toAddress, opts.buyAmount || totalFillableOutputAmount, opts.bridgeData);
                            return [4 /*yield*/, call.callAsync()];
                        case 2:
                            returnCode = _a.sent();
                            if (returnCode !== BRIDGE_SUCCESS) {
                                throw new Error('Expected BRIDGE_SUCCESS');
                            }
                            return [4 /*yield*/, call.awaitTransactionSuccessAsync({}, { shouldValidate: false })];
                        case 3:
                            receipt = _a.sent();
                            // tslint:disable-next-line: no-unnecessary-type-assertion
                            return [2 /*return*/, receipt.logs];
                    }
                });
            });
        }
        it('succeeds with no bridge calls and no input balance', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: [],
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData, sellAmount: ZERO_AMOUNT })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds with bridge calls and no input balance', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: allBridgeCalls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData, sellAmount: ZERO_AMOUNT })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds with no bridge calls and an input balance', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: [],
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({
                                bridgeData: bridgeData,
                                sellAmount: new utils_1.BigNumber(1),
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds if entire input token balance is not consumed', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: allBridgeCalls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({
                                bridgeData: bridgeData,
                                sellAmount: totalFillableInputAmount.plus(1),
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if not authorized', function () { return __awaiter(_this, void 0, void 0, function () {
            var calls, bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        calls = goodBridgeCalls.slice(0, 1);
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callAndTransactAsync(testContract.setAuthorized(utils_1.NULL_ADDRESS))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, contracts_test_utils_1.expect(callBridgeTransferFromAsync({ bridgeData: bridgeData, sellAmount: new utils_1.BigNumber(1) })).to.revertWith(NOT_AUTHORIZED_REVERT)];
                }
            });
        }); });
        it('succeeds with one bridge call', function () { return __awaiter(_this, void 0, void 0, function () {
            var calls, bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        calls = goodBridgeCalls.slice(0, 1);
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData, sellAmount: calls[0].inputTokenAmount })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds with many bridge calls', function () { return __awaiter(_this, void 0, void 0, function () {
            var calls, bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        calls = goodBridgeCalls;
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('swallows a failing bridge call', function () { return __awaiter(_this, void 0, void 0, function () {
            var calls, bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        calls = _.shuffle(__spread(goodBridgeCalls, [failingBridgeCall]));
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('consumes input tokens for output tokens', function () { return __awaiter(_this, void 0, void 0, function () {
            var calls, bridgeData, currentBridgeInputBalance, currentRecipientOutputBalance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        calls = allBridgeCalls;
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .balanceOf(inputToken, testContract.address)
                                .callAsync()];
                    case 2:
                        currentBridgeInputBalance = _a.sent();
                        contracts_test_utils_1.expect(currentBridgeInputBalance).to.bignumber.eq(0);
                        return [4 /*yield*/, testContract
                                .balanceOf(outputToken, DEFAULTS.toAddress)
                                .callAsync()];
                    case 3:
                        currentRecipientOutputBalance = _a.sent();
                        contracts_test_utils_1.expect(currentRecipientOutputBalance).to.bignumber.eq(totalFillableOutputAmount);
                        return [2 /*return*/];
                }
            });
        }); });
        it("transfers only up to each call's input amount to each bridge", function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1, _a, calls, bridgeData, logs, btfs, _b, _c, _d, call, btf;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        calls = goodBridgeCalls;
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 1:
                        logs = _e.sent();
                        btfs = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestDexForwarderBridgeEvents.BridgeTransferFromCalled);
                        try {
                            for (_b = __values(contracts_test_utils_1.shortZip(goodBridgeCalls, btfs)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                _d = __read(_c.value, 2), call = _d[0], btf = _d[1];
                                contracts_test_utils_1.expect(btf.inputTokenBalance).to.bignumber.eq(call.inputTokenAmount);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('transfers only up to outstanding sell amount to each bridge', function () { return __awaiter(_this, void 0, void 0, function () {
            var calls, bridgeData, logs, btfs, lastCall, lastBtf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createBridgeCallAsync({
                            callFields: {
                                inputTokenAmount: new utils_1.BigNumber(1),
                                outputTokenAmount: new utils_1.BigNumber(1),
                            },
                        })];
                    case 1:
                        calls = __spread.apply(void 0, [[
                                _a.sent()
                            ], goodBridgeCalls]);
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 2:
                        logs = _a.sent();
                        btfs = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestDexForwarderBridgeEvents.BridgeTransferFromCalled);
                        contracts_test_utils_1.expect(btfs).to.be.length(goodBridgeCalls.length + 1);
                        lastCall = calls.slice(-1)[0];
                        lastBtf = btfs.slice(-1)[0];
                        contracts_test_utils_1.expect(lastBtf.inputTokenBalance).to.bignumber.eq(lastCall.inputTokenAmount.minus(1));
                        return [2 /*return*/];
                }
            });
        }); });
        it('recoups funds from a bridge that fails', function () { return __awaiter(_this, void 0, void 0, function () {
            var badCall, calls, bridgeData, logs, btfs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createBridgeCallAsync({
                            callFields: { inputTokenAmount: totalFillableInputAmount },
                            returnCode: BRIDGE_FAILURE,
                        })];
                    case 1:
                        badCall = _a.sent();
                        calls = __spread([badCall], goodBridgeCalls);
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 2:
                        logs = _a.sent();
                        btfs = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestDexForwarderBridgeEvents.BridgeTransferFromCalled);
                        contracts_test_utils_1.expect(btfs).to.be.length(goodBridgeCalls.length);
                        return [2 /*return*/];
                }
            });
        }); });
        it('recoups funds from a bridge that reverts', function () { return __awaiter(_this, void 0, void 0, function () {
            var badCall, calls, bridgeData, logs, btfs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createBridgeCallAsync({
                            callFields: { inputTokenAmount: totalFillableInputAmount },
                            revertError: BRIDGE_REVERT_ERROR,
                        })];
                    case 1:
                        badCall = _a.sent();
                        calls = __spread([badCall], goodBridgeCalls);
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 2:
                        logs = _a.sent();
                        btfs = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestDexForwarderBridgeEvents.BridgeTransferFromCalled);
                        contracts_test_utils_1.expect(btfs).to.be.length(goodBridgeCalls.length);
                        return [2 /*return*/];
                }
            });
        }); });
        it('recoups funds from a bridge that under-pays', function () { return __awaiter(_this, void 0, void 0, function () {
            var badCall, calls, bridgeData, logs, btfs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createBridgeCallAsync({
                            callFields: {
                                inputTokenAmount: totalFillableInputAmount,
                                outputTokenAmount: new utils_1.BigNumber(2),
                            },
                            outputFillAmount: new utils_1.BigNumber(1),
                        })];
                    case 1:
                        badCall = _a.sent();
                        calls = __spread([badCall], goodBridgeCalls);
                        bridgeData = dex_forwarder_bridge_1.dexForwarderBridgeDataEncoder.encode({
                            inputToken: inputToken,
                            calls: calls,
                        });
                        return [4 /*yield*/, callBridgeTransferFromAsync({ bridgeData: bridgeData })];
                    case 2:
                        logs = _a.sent();
                        btfs = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestDexForwarderBridgeEvents.BridgeTransferFromCalled);
                        contracts_test_utils_1.expect(btfs).to.be.length(goodBridgeCalls.length);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('executeBridgeCall()', function () {
        it('cannot be called externally', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, contracts_test_utils_1.expect(testContract
                        .executeBridgeCall(contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), new utils_1.BigNumber(1), new utils_1.BigNumber(1), contracts_test_utils_1.constants.NULL_BYTES)
                        .callAsync()).to.revertWith('DexForwarderBridge/ONLY_SELF')];
            });
        }); });
    });
});
//# sourceMappingURL=dex_forwarder_bridge.js.map