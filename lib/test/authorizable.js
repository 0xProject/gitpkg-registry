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
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.blockchainTests.resets('Authorizable', function () {
    var owner;
    var notOwner;
    var address;
    var authorizable;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, accounts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.getAvailableAddressesAsync()];
                case 1:
                    accounts = _b.sent();
                    _a = __read(accounts.slice(0, 3), 3), owner = _a[0], address = _a[1], notOwner = _a[2];
                    return [4 /*yield*/, wrappers_1.MixinAuthorizableContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.MixinAuthorizable, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                case 2:
                    authorizable = _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('addAuthorizedAddress', function () {
        it('should revert if not called by owner', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = authorizable.addAuthorizedAddress(notOwner).sendTransactionAsync({ from: notOwner });
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.OnlyContractOwner)];
            });
        }); });
        it('should allow owner to add an authorized address', function () { return __awaiter(_this, void 0, void 0, function () {
            var isAuthorized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, authorizable.authorized(address).callAsync()];
                    case 2:
                        isAuthorized = _a.sent();
                        contracts_test_utils_1.expect(isAuthorized).to.be.true();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if owner attempts to authorize a duplicate address', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        tx = authorizable.addAuthorizedAddress(address).sendTransactionAsync({ from: owner });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.TargetAlreadyAuthorized)];
                }
            });
        }); });
    });
    describe('removeAuthorizedAddress', function () {
        it('should revert if not called by owner', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        tx = authorizable.removeAuthorizedAddress(address).sendTransactionAsync({ from: notOwner });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.OnlyContractOwner)];
                }
            });
        }); });
        it('should allow owner to remove an authorized address', function () { return __awaiter(_this, void 0, void 0, function () {
            var isAuthorized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, authorizable.removeAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, authorizable.authorized(address).callAsync()];
                    case 3:
                        isAuthorized = _a.sent();
                        contracts_test_utils_1.expect(isAuthorized).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if owner attempts to remove an address that is not authorized', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = authorizable.removeAuthorizedAddress(address).sendTransactionAsync({ from: owner });
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.TargetNotAuthorized)];
            });
        }); });
    });
    describe('removeAuthorizedAddressAtIndex', function () {
        it('should revert if not called by owner', function () { return __awaiter(_this, void 0, void 0, function () {
            var index, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        index = new utils_1.BigNumber(0);
                        tx = authorizable
                            .removeAuthorizedAddressAtIndex(address, index)
                            .sendTransactionAsync({ from: notOwner });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.OnlyContractOwner)];
                }
            });
        }); });
        it('should revert if index is >= authorities.length', function () { return __awaiter(_this, void 0, void 0, function () {
            var index, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        index = new utils_1.BigNumber(1);
                        tx = authorizable
                            .removeAuthorizedAddressAtIndex(address, index)
                            .sendTransactionAsync({ from: owner });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.IndexOutOfBounds)];
                }
            });
        }); });
        it('should revert if owner attempts to remove an address that is not authorized', function () { return __awaiter(_this, void 0, void 0, function () {
            var index, tx;
            return __generator(this, function (_a) {
                index = new utils_1.BigNumber(0);
                tx = authorizable
                    .removeAuthorizedAddressAtIndex(address, index)
                    .sendTransactionAsync({ from: owner });
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.TargetNotAuthorized)];
            });
        }); });
        it('should revert if address at index does not match target', function () { return __awaiter(_this, void 0, void 0, function () {
            var address1, address2, address1Index, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address1 = address;
                        address2 = notOwner;
                        return [4 /*yield*/, authorizable.addAuthorizedAddress(address1).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, authorizable.addAuthorizedAddress(address2).awaitTransactionSuccessAsync({ from: owner })];
                    case 2:
                        _a.sent();
                        address1Index = new utils_1.BigNumber(0);
                        tx = authorizable
                            .removeAuthorizedAddressAtIndex(address2, address1Index)
                            .sendTransactionAsync({ from: owner });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith(types_1.RevertReason.AuthorizedAddressMismatch)];
                }
            });
        }); });
        it('should allow owner to remove an authorized address', function () { return __awaiter(_this, void 0, void 0, function () {
            var index, isAuthorized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 1:
                        _a.sent();
                        index = new utils_1.BigNumber(0);
                        return [4 /*yield*/, authorizable.removeAuthorizedAddressAtIndex(address, index).awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, authorizable.authorized(address).callAsync()];
                    case 3:
                        isAuthorized = _a.sent();
                        contracts_test_utils_1.expect(isAuthorized).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAuthorizedAddresses', function () {
        it('should return all authorized addresses', function () { return __awaiter(_this, void 0, void 0, function () {
            var initial, afterAdd, afterRemove;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizable.getAuthorizedAddresses().callAsync()];
                    case 1:
                        initial = _a.sent();
                        contracts_test_utils_1.expect(initial).to.have.length(0);
                        return [4 /*yield*/, authorizable.addAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, authorizable.getAuthorizedAddresses().callAsync()];
                    case 3:
                        afterAdd = _a.sent();
                        contracts_test_utils_1.expect(afterAdd).to.have.length(1);
                        contracts_test_utils_1.expect(afterAdd).to.include(address);
                        return [4 /*yield*/, authorizable.removeAuthorizedAddress(address).awaitTransactionSuccessAsync({ from: owner })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, authorizable.getAuthorizedAddresses().callAsync()];
                    case 5:
                        afterRemove = _a.sent();
                        contracts_test_utils_1.expect(afterRemove).to.have.length(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=authorizable.js.map