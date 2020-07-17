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
contracts_test_utils_1.blockchainTests.resets('Eth2DaiBridge unit tests', function (env) {
    var testContract;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrappers_1.TestEth2DaiBridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestEth2DaiBridge, env.provider, env.txDefaults, artifacts_1.artifacts)];
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
        function createWithdrawToOpts(opts) {
            return __assign({ toAddress: contracts_test_utils_1.randomAddress(), amount: contracts_test_utils_1.getRandomInteger(1, 100e18), revertReason: '', fillAmount: contracts_test_utils_1.getRandomInteger(1, 100e18), fromTokenBalance: contracts_test_utils_1.getRandomInteger(1, 100e18), toTokentransferRevertReason: '', toTokenTransferReturnData: utils_1.hexUtils.leftPad(1) }, opts);
        }
        function withdrawToAsync(opts) {
            return __awaiter(this, void 0, void 0, function () {
                var _opts, createTokenFn, _a, createTokenFn, _b, bridgeTransferFromFn, result, logs;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _opts = createWithdrawToOpts(opts);
                            // Set the fill behavior.
                            return [4 /*yield*/, testContract
                                    .setFillBehavior(_opts.revertReason, new utils_1.BigNumber(_opts.fillAmount))
                                    .awaitTransactionSuccessAsync()];
                        case 1:
                            // Set the fill behavior.
                            _c.sent();
                            if (!(_opts.fromTokenAddress === undefined)) return [3 /*break*/, 4];
                            createTokenFn = testContract.createToken(new utils_1.BigNumber(_opts.fromTokenBalance));
                            _a = _opts;
                            return [4 /*yield*/, createTokenFn.callAsync()];
                        case 2:
                            _a.fromTokenAddress = _c.sent();
                            return [4 /*yield*/, createTokenFn.awaitTransactionSuccessAsync()];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            if (!(_opts.toTokenAddress === undefined)) return [3 /*break*/, 7];
                            createTokenFn = testContract.createToken(contracts_test_utils_1.constants.ZERO_AMOUNT);
                            _b = _opts;
                            return [4 /*yield*/, createTokenFn.callAsync()];
                        case 5:
                            _b.toTokenAddress = _c.sent();
                            return [4 /*yield*/, createTokenFn.awaitTransactionSuccessAsync()];
                        case 6:
                            _c.sent();
                            _c.label = 7;
                        case 7: 
                        // Set the transfer behavior of `toTokenAddress`.
                        return [4 /*yield*/, testContract
                                .setTransferBehavior(_opts.toTokenAddress, _opts.toTokentransferRevertReason, _opts.toTokenTransferReturnData)
                                .awaitTransactionSuccessAsync()];
                        case 8:
                            // Set the transfer behavior of `toTokenAddress`.
                            _c.sent();
                            bridgeTransferFromFn = testContract.bridgeTransferFrom(
                            // "to" token address
                            _opts.toTokenAddress, 
                            // Random from address.
                            contracts_test_utils_1.randomAddress(), 
                            // To address.
                            _opts.toAddress, new utils_1.BigNumber(_opts.amount), 
                            // ABI-encode the "from" token address as the bridge data.
                            utils_1.hexUtils.leftPad(_opts.fromTokenAddress));
                            return [4 /*yield*/, bridgeTransferFromFn.callAsync()];
                        case 9:
                            result = _c.sent();
                            return [4 /*yield*/, bridgeTransferFromFn.awaitTransactionSuccessAsync()];
                        case 10:
                            logs = (_c.sent()).logs;
                            return [2 /*return*/, {
                                    opts: _opts,
                                    result: result,
                                    logs: logs,
                                }];
                    }
                });
            });
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
        it('calls `Eth2Dai.sellAllAmount()`', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs, transfers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync()];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        transfers = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestEth2DaiBridgeEvents.SellAllAmount);
                        contracts_test_utils_1.expect(transfers.length).to.eq(1);
                        contracts_test_utils_1.expect(transfers[0].sellToken).to.eq(opts.fromTokenAddress);
                        contracts_test_utils_1.expect(transfers[0].buyToken).to.eq(opts.toTokenAddress);
                        contracts_test_utils_1.expect(transfers[0].sellTokenAmount).to.bignumber.eq(opts.fromTokenBalance);
                        contracts_test_utils_1.expect(transfers[0].minimumFillAmount).to.bignumber.eq(opts.amount);
                        return [2 /*return*/];
                }
            });
        }); });
        it('sets an unlimited allowance on the `fromTokenAddress` token', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs, approvals;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync()];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        approvals = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestEth2DaiBridgeEvents.TokenApprove);
                        contracts_test_utils_1.expect(approvals.length).to.eq(1);
                        contracts_test_utils_1.expect(approvals[0].token).to.eq(opts.fromTokenAddress);
                        contracts_test_utils_1.expect(approvals[0].spender).to.eq(testContract.address);
                        contracts_test_utils_1.expect(approvals[0].allowance).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('transfers filled amount to `to`', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, opts, logs, transfers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync()];
                    case 1:
                        _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                        transfers = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestEth2DaiBridgeEvents.TokenTransfer);
                        contracts_test_utils_1.expect(transfers.length).to.eq(1);
                        contracts_test_utils_1.expect(transfers[0].token).to.eq(opts.toTokenAddress);
                        contracts_test_utils_1.expect(transfers[0].from).to.eq(testContract.address);
                        contracts_test_utils_1.expect(transfers[0].to).to.eq(opts.toAddress);
                        contracts_test_utils_1.expect(transfers[0].amount).to.bignumber.eq(opts.fillAmount);
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if `Eth2Dai.sellAllAmount()` reverts', function () { return __awaiter(_this, void 0, void 0, function () {
            var opts, tx;
            return __generator(this, function (_a) {
                opts = createWithdrawToOpts({ revertReason: 'FOOBAR' });
                tx = withdrawToAsync(opts);
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(opts.revertReason)];
            });
        }); });
        it('fails if `toTokenAddress.transfer()` reverts', function () { return __awaiter(_this, void 0, void 0, function () {
            var opts, tx;
            return __generator(this, function (_a) {
                opts = createWithdrawToOpts({ toTokentransferRevertReason: 'FOOBAR' });
                tx = withdrawToAsync(opts);
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(opts.toTokentransferRevertReason)];
            });
        }); });
        it('fails if `toTokenAddress.transfer()` returns false', function () { return __awaiter(_this, void 0, void 0, function () {
            var opts, tx;
            return __generator(this, function (_a) {
                opts = createWithdrawToOpts({ toTokenTransferReturnData: utils_1.hexUtils.leftPad(0) });
                tx = withdrawToAsync(opts);
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(new utils_1.RawRevertError(utils_1.hexUtils.leftPad(0)))];
            });
        }); });
        it('succeeds if `toTokenAddress.transfer()` returns true', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync({ toTokenTransferReturnData: utils_1.hexUtils.leftPad(1) })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=eth2dai_bridge.js.map