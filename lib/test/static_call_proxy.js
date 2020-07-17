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
var dev_utils_1 = require("@0x/dev-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var chai = require("chai");
var ethUtil = require("ethereumjs-util");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.chaiSetup.configure();
var expect = chai.expect;
var blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(contracts_test_utils_1.web3Wrapper);
describe('StaticCallProxy', function () {
    var amount = contracts_test_utils_1.constants.ZERO_AMOUNT;
    var fromAddress;
    var toAddress;
    var assetDataInterface;
    var staticCallProxy;
    var staticCallTarget;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blockchainLifecycle.startAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blockchainLifecycle.revertAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, accounts, staticCallProxyWithoutTransferFrom;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.getAvailableAddressesAsync()];
                case 1:
                    accounts = _b.sent();
                    _a = __read(accounts.slice(0, 2), 2), fromAddress = _a[0], toAddress = _a[1];
                    return [4 /*yield*/, wrappers_1.StaticCallProxyContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.StaticCallProxy, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                case 2:
                    staticCallProxyWithoutTransferFrom = _b.sent();
                    assetDataInterface = new wrappers_1.IAssetDataContract(contracts_test_utils_1.constants.NULL_ADDRESS, contracts_test_utils_1.provider);
                    staticCallProxy = new wrappers_1.IAssetProxyContract(staticCallProxyWithoutTransferFrom.address, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, {}, wrappers_1.StaticCallProxyContract.deployedBytecode);
                    return [4 /*yield*/, wrappers_1.TestStaticCallTargetContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestStaticCallTarget, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                case 3:
                    staticCallTarget = _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blockchainLifecycle.startAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blockchainLifecycle.revertAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('general', function () {
        it('should revert if undefined function is called', function () { return __awaiter(_this, void 0, void 0, function () {
            var undefinedSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        undefinedSelector = '0x01020304';
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                from: fromAddress,
                                to: staticCallProxy.address,
                                value: contracts_test_utils_1.constants.ZERO_AMOUNT,
                                data: undefinedSelector,
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have an id of 0xc339d10a', function () { return __awaiter(_this, void 0, void 0, function () {
            var proxyId, expectedProxyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, staticCallProxy.getProxyId().callAsync()];
                    case 1:
                        proxyId = _a.sent();
                        expectedProxyId = types_1.AssetProxyId.StaticCall;
                        expect(proxyId).to.equal(expectedProxyId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('transferFrom', function () {
        it('should revert if assetData lies outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, expectedResultHash, assetData, txData, offsetToAssetData, txDataEndBuffer, paddedTxDataEndBuffer, invalidOffsetToAssetData, newAssetData, badTxData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        staticCallData = staticCallTarget.noInputFunction().getABIEncodedTransactionData();
                        expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        txData = staticCallProxy
                            .transferFrom(assetData, fromAddress, toAddress, amount)
                            .getABIEncodedTransactionData();
                        offsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000080';
                        txDataEndBuffer = ethUtil.toBuffer((txData.length - 2) / 2 - 4);
                        paddedTxDataEndBuffer = ethUtil.setLengthLeft(txDataEndBuffer, 32);
                        invalidOffsetToAssetData = ethUtil.bufferToHex(paddedTxDataEndBuffer).slice(2);
                        newAssetData = '0000000000000000000000000000000000000000000000000000000000000304';
                        badTxData = "" + txData.replace(offsetToAssetData, invalidOffsetToAssetData) + newAssetData;
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                to: staticCallProxy.address,
                                from: fromAddress,
                                data: badTxData,
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if the length of assetData is less than 100 bytes', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, expectedResultHash, assetData, assetDataByteLen;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        staticCallData = contracts_test_utils_1.constants.NULL_BYTES;
                        expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData()
                            .slice(0, -128);
                        assetDataByteLen = (assetData.length - 2) / 2;
                        expect((assetDataByteLen - 4) % 32).to.equal(0);
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(staticCallProxy.transferFrom(assetData, fromAddress, toAddress, amount).sendTransactionAsync())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if the offset to `staticCallData` points to outside of assetData', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, expectedResultHash, assetData, offsetToStaticCallData, assetDataEndBuffer, paddedAssetDataEndBuffer, invalidOffsetToStaticCallData, newStaticCallData, badAssetData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        staticCallData = staticCallTarget.noInputFunction().getABIEncodedTransactionData();
                        expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        offsetToStaticCallData = '0000000000000000000000000000000000000000000000000000000000000060';
                        assetDataEndBuffer = ethUtil.toBuffer((assetData.length - 2) / 2 - 4);
                        paddedAssetDataEndBuffer = ethUtil.setLengthLeft(assetDataEndBuffer, 32);
                        invalidOffsetToStaticCallData = ethUtil.bufferToHex(paddedAssetDataEndBuffer).slice(2);
                        newStaticCallData = '0000000000000000000000000000000000000000000000000000000000000304';
                        badAssetData = "" + assetData.replace(offsetToStaticCallData, invalidOffsetToStaticCallData) + newStaticCallData;
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(staticCallProxy.transferFrom(badAssetData, fromAddress, toAddress, amount).sendTransactionAsync())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if the callTarget attempts to write to state', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        staticCallData = staticCallTarget.updateState().getABIEncodedTransactionData();
                        expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(staticCallProxy.transferFrom(assetData, fromAddress, toAddress, amount).sendTransactionAsync())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert with data provided by the callTarget if the staticcall reverts', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                staticCallData = staticCallTarget.assertEvenNumber(new utils_1.BigNumber(1)).getABIEncodedTransactionData();
                expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                assetData = assetDataInterface
                    .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                    .getABIEncodedTransactionData();
                return [2 /*return*/, expect(staticCallProxy.transferFrom(assetData, fromAddress, toAddress, amount).awaitTransactionSuccessAsync()).to.revertWith(types_1.RevertReason.TargetNotEven)];
            });
        }); });
        it('should revert if the hash of the output is different than expected expected', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, trueAsBuffer, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                staticCallData = staticCallTarget.isOddNumber(new utils_1.BigNumber(0)).getABIEncodedTransactionData();
                trueAsBuffer = ethUtil.toBuffer('0x0000000000000000000000000000000000000000000000000000000000000001');
                expectedResultHash = ethUtil.bufferToHex(ethUtil.sha3(trueAsBuffer));
                assetData = assetDataInterface
                    .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                    .getABIEncodedTransactionData();
                return [2 /*return*/, expect(staticCallProxy.transferFrom(assetData, fromAddress, toAddress, amount).awaitTransactionSuccessAsync()).to.revertWith(types_1.RevertReason.UnexpectedStaticCallResult)];
            });
        }); });
        it('should be successful if a function call with no inputs and no outputs is successful', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        staticCallData = staticCallTarget.noInputFunction().getABIEncodedTransactionData();
                        expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, staticCallProxy
                                .transferFrom(assetData, fromAddress, toAddress, amount)
                                .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be successful if the staticCallTarget is not a contract and no return value is expected', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        staticCallData = '0x0102030405060708';
                        expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                        assetData = assetDataInterface
                            .StaticCall(toAddress, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, staticCallProxy
                                .transferFrom(assetData, fromAddress, toAddress, amount)
                                .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be successful if a function call with one static input returns the correct value', function () { return __awaiter(_this, void 0, void 0, function () {
            var staticCallData, trueAsBuffer, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        staticCallData = staticCallTarget.isOddNumber(new utils_1.BigNumber(1)).getABIEncodedTransactionData();
                        trueAsBuffer = ethUtil.toBuffer('0x0000000000000000000000000000000000000000000000000000000000000001');
                        expectedResultHash = ethUtil.bufferToHex(ethUtil.sha3(trueAsBuffer));
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, staticCallProxy
                                .transferFrom(assetData, fromAddress, toAddress, amount)
                                .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be successful if a function with one dynamic input is successful', function () { return __awaiter(_this, void 0, void 0, function () {
            var dynamicInput, staticCallData, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dynamicInput = '0x0102030405060708';
                        staticCallData = staticCallTarget.dynamicInputFunction(dynamicInput).getABIEncodedTransactionData();
                        expectedResultHash = contracts_test_utils_1.constants.KECCAK256_NULL;
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, staticCallProxy
                                .transferFrom(assetData, fromAddress, toAddress, amount)
                                .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be successful if a function call returns a complex type', function () { return __awaiter(_this, void 0, void 0, function () {
            var a, b, staticCallData, abiEncoder, aHex, bHex, expectedResults, offset, encodedExpectedResultWithOffset, expectedResultHash, assetData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        a = new utils_1.BigNumber(1);
                        b = new utils_1.BigNumber(2);
                        staticCallData = staticCallTarget.returnComplexType(a, b).getABIEncodedTransactionData();
                        abiEncoder = new utils_1.AbiEncoder.DynamicBytes({
                            name: '',
                            type: 'bytes',
                        });
                        aHex = '0000000000000000000000000000000000000000000000000000000000000001';
                        bHex = '0000000000000000000000000000000000000000000000000000000000000002';
                        expectedResults = "" + staticCallTarget.address + aHex + bHex;
                        offset = '0000000000000000000000000000000000000000000000000000000000000020';
                        encodedExpectedResultWithOffset = "0x" + offset + abiEncoder.encode(expectedResults).slice(2);
                        expectedResultHash = ethUtil.bufferToHex(ethUtil.sha3(ethUtil.toBuffer(encodedExpectedResultWithOffset)));
                        assetData = assetDataInterface
                            .StaticCall(staticCallTarget.address, staticCallData, expectedResultHash)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, staticCallProxy
                                .transferFrom(assetData, fromAddress, toAddress, amount)
                                .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=static_call_proxy.js.map