"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var contracts_utils_1 = require("@0x/contracts-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.blockchainTests.resets('ERC20BridgeProxy unit tests', function (env) {
    var PROXY_ID = types_1.AssetProxyId.ERC20Bridge;
    var BRIDGE_SUCCESS_RETURN_DATA = utils_1.hexUtils.rightPad(PROXY_ID);
    var owner;
    var badCaller;
    var assetProxy;
    var bridgeContract;
    var testTokenAddress;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, env.getAccountAddressesAsync()];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), owner = _a[0], badCaller = _a[1];
                    return [4 /*yield*/, wrappers_1.ERC20BridgeProxyContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.ERC20BridgeProxy, env.provider, env.txDefaults, artifacts_1.artifacts)];
                case 2:
                    assetProxy = _b.sent();
                    return [4 /*yield*/, wrappers_1.TestERC20BridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestERC20Bridge, env.provider, env.txDefaults, artifacts_1.artifacts)];
                case 3:
                    bridgeContract = _b.sent();
                    return [4 /*yield*/, bridgeContract.testToken().callAsync()];
                case 4:
                    testTokenAddress = _b.sent();
                    return [4 /*yield*/, assetProxy.addAuthorizedAddress(owner).awaitTransactionSuccessAsync()];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    function createAssetData(opts) {
        return _.merge({
            tokenAddress: testTokenAddress,
            bridgeAddress: bridgeContract.address,
            bridgeData: createBridgeData(),
        }, opts);
    }
    function createBridgeData(opts) {
        return _.merge({
            transferAmount: contracts_test_utils_1.constants.ZERO_AMOUNT,
            returnData: BRIDGE_SUCCESS_RETURN_DATA,
        }, opts);
    }
    function encodeAssetData(opts) {
        var encoder = utils_1.AbiEncoder.createMethod('ERC20BridgeProxy', [
            { name: 'tokenAddress', type: 'address' },
            { name: 'bridgeAddress', type: 'address' },
            { name: 'bridgeData', type: 'bytes' },
        ]);
        return encoder.encode([opts.tokenAddress, opts.bridgeAddress, encodeBridgeData(opts.bridgeData)]);
    }
    function encodeBridgeData(opts) {
        var encoder = utils_1.AbiEncoder.create([
            { name: 'transferAmount', type: 'int256' },
            { name: 'revertData', type: 'bytes' },
            { name: 'returnData', type: 'bytes' },
        ]);
        var revertErrorBytes = opts.revertError !== undefined ? new utils_1.StringRevertError(opts.revertError).encode() : '0x';
        return encoder.encode([new utils_1.BigNumber(opts.transferAmount), revertErrorBytes, opts.returnData]);
    }
    function setTestTokenBalanceAsync(_owner, balance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bridgeContract.setTestTokenBalance(_owner, new utils_1.BigNumber(balance)).awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    describe('transferFrom()', function () {
        function createTransferFromOpts(opts) {
            var transferAmount = _.get(opts, ['amount'], contracts_test_utils_1.getRandomInteger(1, 100e18));
            return _.merge({
                assetData: createAssetData({
                    bridgeData: createBridgeData({
                        transferAmount: transferAmount,
                    }),
                }),
                from: contracts_test_utils_1.randomAddress(),
                to: contracts_test_utils_1.randomAddress(),
                amount: transferAmount,
            }, opts);
        }
        function transferFromAsync(opts, caller) {
            return __awaiter(this, void 0, void 0, function () {
                var _opts, logs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _opts = createTransferFromOpts(opts);
                            return [4 /*yield*/, assetProxy
                                    .transferFrom(encodeAssetData(_opts.assetData), _opts.from, _opts.to, new utils_1.BigNumber(_opts.amount))
                                    .awaitTransactionSuccessAsync({ from: caller })];
                        case 1:
                            logs = (_a.sent()).logs;
                            return [2 /*return*/, logs];
                    }
                });
            });
        }
        it('succeeds if the bridge succeeds and balance increases by `amount`', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = transferFromAsync();
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.be.fulfilled('')];
            });
        }); });
        it('succeeds if balance increases more than `amount`', function () { return __awaiter(_this, void 0, void 0, function () {
            var amount, tx;
            return __generator(this, function (_a) {
                amount = contracts_test_utils_1.getRandomInteger(1, 100e18);
                tx = transferFromAsync({
                    amount: amount,
                    assetData: createAssetData({
                        bridgeData: createBridgeData({
                            transferAmount: amount.plus(1),
                        }),
                    }),
                });
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.be.fulfilled('')];
            });
        }); });
        it('passes the correct arguments to the bridge contract', function () { return __awaiter(_this, void 0, void 0, function () {
            var opts, logs, args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = createTransferFromOpts();
                        return [4 /*yield*/, transferFromAsync(opts)];
                    case 1:
                        logs = _a.sent();
                        contracts_test_utils_1.expect(logs.length).to.eq(1);
                        args = logs[0].args;
                        contracts_test_utils_1.expect(args.tokenAddress).to.eq(opts.assetData.tokenAddress);
                        contracts_test_utils_1.expect(args.from).to.eq(opts.from);
                        contracts_test_utils_1.expect(args.to).to.eq(opts.to);
                        contracts_test_utils_1.expect(args.amount).to.bignumber.eq(opts.amount);
                        contracts_test_utils_1.expect(args.bridgeData).to.eq(encodeBridgeData(opts.assetData.bridgeData));
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if not called by an authorized address', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = transferFromAsync({}, badCaller);
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(new contracts_utils_1.AuthorizableRevertErrors.SenderNotAuthorizedError(badCaller))];
            });
        }); });
        it('fails if asset data is truncated', function () { return __awaiter(_this, void 0, void 0, function () {
            var opts, truncatedAssetData, tx;
            return __generator(this, function (_a) {
                opts = createTransferFromOpts();
                truncatedAssetData = utils_1.hexUtils.slice(encodeAssetData(opts.assetData), 0, -1);
                tx = assetProxy
                    .transferFrom(truncatedAssetData, opts.from, opts.to, new utils_1.BigNumber(opts.amount))
                    .awaitTransactionSuccessAsync();
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.be.rejected()];
            });
        }); });
        it('fails if bridge returns nothing', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = transferFromAsync({
                    assetData: createAssetData({
                        bridgeData: createBridgeData({
                            returnData: '0x',
                        }),
                    }),
                });
                // This will actually revert when the AP tries to decode the return
                // value.
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.be.rejected()];
            });
        }); });
        it('fails if bridge returns true', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = transferFromAsync({
                    assetData: createAssetData({
                        bridgeData: createBridgeData({
                            returnData: utils_1.hexUtils.leftPad('0x1'),
                        }),
                    }),
                });
                // This will actually revert when the AP tries to decode the return
                // value.
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.be.rejected()];
            });
        }); });
        it('fails if bridge returns 0x1', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = transferFromAsync({
                    assetData: createAssetData({
                        bridgeData: createBridgeData({
                            returnData: utils_1.hexUtils.rightPad('0x1'),
                        }),
                    }),
                });
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('BRIDGE_FAILED')];
            });
        }); });
        it('fails if bridge is an EOA', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = transferFromAsync({
                    assetData: createAssetData({
                        bridgeAddress: contracts_test_utils_1.randomAddress(),
                    }),
                });
                // This will actually revert when the AP tries to decode the return
                // value.
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.be.rejected()];
            });
        }); });
        it('fails if bridge reverts', function () { return __awaiter(_this, void 0, void 0, function () {
            var revertError, tx;
            return __generator(this, function (_a) {
                revertError = 'FOOBAR';
                tx = transferFromAsync({
                    assetData: createAssetData({
                        bridgeData: createBridgeData({
                            revertError: revertError,
                        }),
                    }),
                });
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(revertError)];
            });
        }); });
        it('fails if balance of `to` increases by less than `amount`', function () { return __awaiter(_this, void 0, void 0, function () {
            var amount, tx;
            return __generator(this, function (_a) {
                amount = contracts_test_utils_1.getRandomInteger(1, 100e18);
                tx = transferFromAsync({
                    amount: amount,
                    assetData: createAssetData({
                        bridgeData: createBridgeData({
                            transferAmount: amount.minus(1),
                        }),
                    }),
                });
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('BRIDGE_UNDERPAY')];
            });
        }); });
        it('fails if balance of `to` decreases', function () { return __awaiter(_this, void 0, void 0, function () {
            var toAddress, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toAddress = contracts_test_utils_1.randomAddress();
                        return [4 /*yield*/, setTestTokenBalanceAsync(toAddress, 1e18)];
                    case 1:
                        _a.sent();
                        tx = transferFromAsync({
                            to: toAddress,
                            assetData: createAssetData({
                                bridgeData: createBridgeData({
                                    transferAmount: -1,
                                }),
                            }),
                        });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('BRIDGE_UNDERPAY')];
                }
            });
        }); });
    });
    describe('balanceOf()', function () {
        it('retrieves the balance of the encoded token', function () { return __awaiter(_this, void 0, void 0, function () {
            var _owner, balance, assetData, actualBalance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _owner = contracts_test_utils_1.randomAddress();
                        balance = contracts_test_utils_1.getRandomInteger(1, 100e18);
                        return [4 /*yield*/, bridgeContract.setTestTokenBalance(_owner, balance).awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        assetData = createAssetData({
                            tokenAddress: testTokenAddress,
                        });
                        return [4 /*yield*/, assetProxy.balanceOf(encodeAssetData(assetData), _owner).callAsync()];
                    case 2:
                        actualBalance = _a.sent();
                        contracts_test_utils_1.expect(actualBalance).to.bignumber.eq(balance);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getProxyId()', function () {
        it('returns the correct proxy ID', function () { return __awaiter(_this, void 0, void 0, function () {
            var proxyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, assetProxy.getProxyId().callAsync()];
                    case 1:
                        proxyId = _a.sent();
                        contracts_test_utils_1.expect(proxyId).to.eq(PROXY_ID);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=erc20bridge_proxy.js.map