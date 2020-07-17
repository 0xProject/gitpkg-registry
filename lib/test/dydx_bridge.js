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
var contracts_exchange_libs_1 = require("@0x/contracts-exchange-libs");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var dydx_bridge_encoder_1 = require("../src/dydx_bridge_encoder");
var wrappers_1 = require("../src/wrappers");
var artifacts_1 = require("./artifacts");
var wrappers_2 = require("./wrappers");
contracts_test_utils_1.blockchainTests.resets('DydxBridge unit tests', function (env) {
    var defaultAccountNumber = new utils_1.BigNumber(1);
    var marketId = new utils_1.BigNumber(2);
    var defaultAmount = new utils_1.BigNumber(4);
    var notAuthorized = '0x0000000000000000000000000000000000000001';
    var defaultDepositAction = {
        actionType: dydx_bridge_encoder_1.DydxBridgeActionType.Deposit,
        accountIdx: contracts_test_utils_1.constants.ZERO_AMOUNT,
        marketId: marketId,
        conversionRateNumerator: contracts_test_utils_1.constants.ZERO_AMOUNT,
        conversionRateDenominator: contracts_test_utils_1.constants.ZERO_AMOUNT,
    };
    var defaultWithdrawAction = {
        actionType: dydx_bridge_encoder_1.DydxBridgeActionType.Withdraw,
        accountIdx: contracts_test_utils_1.constants.ZERO_AMOUNT,
        marketId: marketId,
        conversionRateNumerator: contracts_test_utils_1.constants.ZERO_AMOUNT,
        conversionRateDenominator: contracts_test_utils_1.constants.ZERO_AMOUNT,
    };
    var testContract;
    var testProxyContract;
    var assetDataEncoder;
    var owner;
    var authorized;
    var accountOwner;
    var receiver;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, accounts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, env.web3Wrapper.getAvailableAddressesAsync()];
                case 1:
                    accounts = _b.sent();
                    _a = __read(accounts, 4), owner = _a[0], authorized = _a[1], accountOwner = _a[2], receiver = _a[3];
                    return [4 /*yield*/, wrappers_2.TestDydxBridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestDydxBridge, env.provider, env.txDefaults, artifacts_1.artifacts, [accountOwner, receiver])];
                case 2:
                    // Deploy dydx bridge
                    testContract = _b.sent();
                    return [4 /*yield*/, wrappers_1.ERC20BridgeProxyContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.ERC20BridgeProxy, env.provider, env.txDefaults, artifacts_1.artifacts)];
                case 3:
                    // Deploy test erc20 bridge proxy
                    testProxyContract = _b.sent();
                    return [4 /*yield*/, testProxyContract.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner })];
                case 4:
                    _b.sent();
                    // Setup asset data encoder
                    assetDataEncoder = new wrappers_1.IAssetDataContract(contracts_test_utils_1.constants.NULL_ADDRESS, env.provider);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('bridgeTransferFrom()', function () {
        var callBridgeTransferFrom = function (from, to, amount, bridgeData, sender) { return __awaiter(_this, void 0, void 0, function () {
            var returnValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testContract
                            .bridgeTransferFrom(contracts_test_utils_1.constants.NULL_ADDRESS, from, to, amount, dydx_bridge_encoder_1.dydxBridgeDataEncoder.encode({ bridgeData: bridgeData }))
                            .callAsync({ from: sender })];
                    case 1:
                        returnValue = _a.sent();
                        return [2 /*return*/, returnValue];
                }
            });
        }); };
        var executeBridgeTransferFromAndVerifyEvents = function (from, to, amount, bridgeData, sender) { return __awaiter(_this, void 0, void 0, function () {
            var e_1, _a, e_2, _b, txReceipt, expectedOperateAccountEvents, _c, _d, accountNumber, weiDenomination, deltaAmountRef, expectedOperateActionEvents, _e, _f, action;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, testContract
                            .bridgeTransferFrom(contracts_test_utils_1.constants.NULL_ADDRESS, from, to, amount, dydx_bridge_encoder_1.dydxBridgeDataEncoder.encode({ bridgeData: bridgeData }))
                            .awaitTransactionSuccessAsync({ from: sender })];
                    case 1:
                        txReceipt = _g.sent();
                        expectedOperateAccountEvents = [];
                        try {
                            for (_c = __values(bridgeData.accountNumbers), _d = _c.next(); !_d.done; _d = _c.next()) {
                                accountNumber = _d.value;
                                expectedOperateAccountEvents.push({
                                    owner: accountOwner,
                                    number: accountNumber,
                                });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        contracts_test_utils_1.verifyEventsFromLogs(txReceipt.logs, expectedOperateAccountEvents, wrappers_2.TestDydxBridgeEvents.OperateAccount);
                        weiDenomination = 0;
                        deltaAmountRef = 0;
                        expectedOperateActionEvents = [];
                        try {
                            for (_e = __values(bridgeData.actions), _f = _e.next(); !_f.done; _f = _e.next()) {
                                action = _f.value;
                                expectedOperateActionEvents.push({
                                    actionType: action.actionType,
                                    accountIdx: action.accountIdx,
                                    amountSign: action.actionType === dydx_bridge_encoder_1.DydxBridgeActionType.Deposit ? true : false,
                                    amountDenomination: weiDenomination,
                                    amountRef: deltaAmountRef,
                                    amountValue: action.conversionRateDenominator.gt(0)
                                        ? amount
                                            .times(action.conversionRateNumerator)
                                            .dividedToIntegerBy(action.conversionRateDenominator)
                                        : amount,
                                    primaryMarketId: marketId,
                                    secondaryMarketId: contracts_test_utils_1.constants.ZERO_AMOUNT,
                                    otherAddress: action.actionType === dydx_bridge_encoder_1.DydxBridgeActionType.Deposit ? from : to,
                                    otherAccountId: contracts_test_utils_1.constants.ZERO_AMOUNT,
                                    data: '0x',
                                });
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        contracts_test_utils_1.verifyEventsFromLogs(txReceipt.logs, expectedOperateActionEvents, wrappers_2.TestDydxBridgeEvents.OperateAction);
                        return [2 /*return*/];
                }
            });
        }); };
        it('succeeds when calling with zero amount', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [defaultDepositAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, contracts_test_utils_1.constants.ZERO_AMOUNT, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling with no accounts', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [],
                            actions: [defaultDepositAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling with no actions', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling `operate` with the `deposit` action and a single account', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [defaultDepositAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling `operate` with the `deposit` action and multiple accounts', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber, defaultAccountNumber.plus(1)],
                            actions: [defaultDepositAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling `operate` with the `withdraw` action and a single account', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [defaultWithdrawAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling `operate` with the `withdraw` action and multiple accounts', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber, defaultAccountNumber.plus(1)],
                            actions: [defaultWithdrawAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling `operate` with the `deposit` action and multiple accounts', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber, defaultAccountNumber.plus(1)],
                            actions: [defaultWithdrawAction, defaultDepositAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when calling `operate` with multiple actions under a single account', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [defaultWithdrawAction, defaultDepositAction],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when scaling the `amount` to deposit', function () { return __awaiter(_this, void 0, void 0, function () {
            var conversionRateNumerator, conversionRateDenominator, bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversionRateNumerator = new utils_1.BigNumber(1);
                        conversionRateDenominator = new utils_1.BigNumber(2);
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [
                                defaultWithdrawAction,
                                __assign({}, defaultDepositAction, { conversionRateNumerator: conversionRateNumerator,
                                    conversionRateDenominator: conversionRateDenominator }),
                            ],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds when scaling the `amount` to withdraw', function () { return __awaiter(_this, void 0, void 0, function () {
            var conversionRateNumerator, conversionRateDenominator, bridgeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversionRateNumerator = new utils_1.BigNumber(1);
                        conversionRateDenominator = new utils_1.BigNumber(2);
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [
                                defaultDepositAction,
                                __assign({}, defaultWithdrawAction, { conversionRateNumerator: conversionRateNumerator,
                                    conversionRateDenominator: conversionRateDenominator }),
                            ],
                        };
                        return [4 /*yield*/, executeBridgeTransferFromAndVerifyEvents(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if not called by the ERC20 Bridge Proxy', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData, callBridgeTransferFromPromise, expectedError;
            return __generator(this, function (_a) {
                bridgeData = {
                    accountNumbers: [defaultAccountNumber],
                    actions: [defaultDepositAction],
                };
                callBridgeTransferFromPromise = callBridgeTransferFrom(accountOwner, receiver, defaultAmount, bridgeData, notAuthorized);
                expectedError = types_1.RevertReason.DydxBridgeOnlyCallableByErc20BridgeProxy;
                return [2 /*return*/, contracts_test_utils_1.expect(callBridgeTransferFromPromise).to.revertWith(expectedError)];
            });
        }); });
        it('should return magic bytes if call succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData, returnValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [defaultDepositAction],
                        };
                        return [4 /*yield*/, callBridgeTransferFrom(accountOwner, receiver, defaultAmount, bridgeData, authorized)];
                    case 1:
                        returnValue = _a.sent();
                        contracts_test_utils_1.expect(returnValue).to.equal(types_1.AssetProxyId.ERC20Bridge);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert when `Operate` reverts', function () { return __awaiter(_this, void 0, void 0, function () {
            var bridgeData, tx, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Set revert flag.
                    return [4 /*yield*/, testContract.setRevertOnOperate(true).awaitTransactionSuccessAsync()];
                    case 1:
                        // Set revert flag.
                        _a.sent();
                        bridgeData = {
                            accountNumbers: [defaultAccountNumber],
                            actions: [defaultDepositAction],
                        };
                        tx = callBridgeTransferFrom(accountOwner, receiver, defaultAmount, bridgeData, authorized);
                        expectedError = 'TestDydxBridge/SHOULD_REVERT_ON_OPERATE';
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(expectedError)];
                }
            });
        }); });
        it('should revert when there is a rounding error', function () { return __awaiter(_this, void 0, void 0, function () {
            var conversionRateNumerator, conversionRateDenominator, amount, bridgeData, tx, expectedError;
            return __generator(this, function (_a) {
                conversionRateNumerator = new utils_1.BigNumber(5318);
                conversionRateDenominator = new utils_1.BigNumber(47958);
                amount = new utils_1.BigNumber(9000);
                bridgeData = {
                    accountNumbers: [defaultAccountNumber],
                    actions: [
                        defaultDepositAction,
                        __assign({}, defaultWithdrawAction, { conversionRateNumerator: conversionRateNumerator,
                            conversionRateDenominator: conversionRateDenominator }),
                    ],
                };
                tx = callBridgeTransferFrom(accountOwner, receiver, amount, bridgeData, authorized);
                expectedError = new contracts_exchange_libs_1.LibMathRevertErrors.RoundingError(conversionRateNumerator, conversionRateDenominator, amount);
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(expectedError)];
            });
        }); });
    });
    describe('ERC20BridgeProxy.transferFrom()', function () {
        var bridgeData = {
            accountNumbers: [defaultAccountNumber],
            actions: [defaultWithdrawAction],
        };
        var assetData;
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            var testTokenAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testContract.getTestToken().callAsync()];
                    case 1:
                        testTokenAddress = _a.sent();
                        assetData = assetDataEncoder
                            .ERC20Bridge(testTokenAddress, testContract.address, dydx_bridge_encoder_1.dydxBridgeDataEncoder.encode({ bridgeData: bridgeData }))
                            .getABIEncodedTransactionData();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should succeed if `bridgeTransferFrom` succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testProxyContract
                            .transferFrom(assetData, accountOwner, receiver, defaultAmount)
                            .awaitTransactionSuccessAsync({ from: authorized })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if `bridgeTransferFrom` reverts', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Set revert flag.
                    return [4 /*yield*/, testContract.setRevertOnOperate(true).awaitTransactionSuccessAsync()];
                    case 1:
                        // Set revert flag.
                        _a.sent();
                        tx = testProxyContract
                            .transferFrom(assetData, accountOwner, receiver, defaultAmount)
                            .awaitTransactionSuccessAsync({ from: authorized });
                        expectedError = 'TestDydxBridge/SHOULD_REVERT_ON_OPERATE';
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(expectedError)];
                }
            });
        }); });
    });
});
//# sourceMappingURL=dydx_bridge.js.map