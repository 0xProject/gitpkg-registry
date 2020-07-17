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
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_erc721_1 = require("@0x/contracts-erc721");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var order_utils_1 = require("@0x/order-utils");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
var ERC721Wrapper = /** @class */ (function () {
    function ERC721Wrapper(provider, tokenOwnerAddresses, contractOwnerAddress) {
        this._initialTokenIdsByOwner = {};
        this._provider = provider;
        this._dummyTokenContracts = [];
        this._tokenOwnerAddresses = tokenOwnerAddresses;
        this._contractOwnerAddress = contractOwnerAddress;
    }
    ERC721Wrapper.prototype.deployDummyTokensAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, _b, _c, i, _d, _e, e_1_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 5, 6, 7]);
                        _b = __values(_.times(contracts_test_utils_1.constants.NUM_DUMMY_ERC721_TO_DEPLOY)), _c = _b.next();
                        _f.label = 1;
                    case 1:
                        if (!!_c.done) return [3 /*break*/, 4];
                        i = _c.value;
                        _e = (_d = this._dummyTokenContracts).push;
                        return [4 /*yield*/, contracts_erc721_1.DummyERC721TokenContract.deployFrom0xArtifactAsync(contracts_erc721_1.artifacts.DummyERC721Token, this._provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts, contracts_test_utils_1.constants.DUMMY_TOKEN_NAME, contracts_test_utils_1.constants.DUMMY_TOKEN_SYMBOL)];
                    case 2:
                        _e.apply(_d, [_f.sent()]);
                        _f.label = 3;
                    case 3:
                        _c = _b.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/, this._dummyTokenContracts];
                }
            });
        });
    };
    ERC721Wrapper.prototype.deployProxyAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, wrappers_1.ERC721ProxyContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.ERC721Proxy, this._provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                    case 1:
                        _a._proxyContract = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this._proxyContract.getProxyId().callAsync()];
                    case 2:
                        _b._proxyIdIfExists = _c.sent();
                        return [2 /*return*/, this._proxyContract];
                }
            });
        });
    };
    ERC721Wrapper.prototype.getProxyId = function () {
        this._validateProxyContractExistsOrThrow();
        return this._proxyIdIfExists;
    };
    ERC721Wrapper.prototype.setBalancesAndAllowancesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, e_3, _b, e_4, _c, _d, _e, _f, dummyTokenContract, _g, _h, tokenOwnerAddress, _j, _k, i, tokenId, e_4_1, e_3_1, e_2_1;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        this._validateDummyTokenContractsExistOrThrow();
                        this._validateProxyContractExistsOrThrow();
                        this._initialTokenIdsByOwner = {};
                        _l.label = 1;
                    case 1:
                        _l.trys.push([1, 19, 20, 21]);
                        _e = __values(this._dummyTokenContracts), _f = _e.next();
                        _l.label = 2;
                    case 2:
                        if (!!_f.done) return [3 /*break*/, 18];
                        dummyTokenContract = _f.value;
                        _l.label = 3;
                    case 3:
                        _l.trys.push([3, 15, 16, 17]);
                        _g = __values(this._tokenOwnerAddresses), _h = _g.next();
                        _l.label = 4;
                    case 4:
                        if (!!_h.done) return [3 /*break*/, 14];
                        tokenOwnerAddress = _h.value;
                        _l.label = 5;
                    case 5:
                        _l.trys.push([5, 11, 12, 13]);
                        _j = __values(_.times(contracts_test_utils_1.constants.NUM_ERC721_TOKENS_TO_MINT)), _k = _j.next();
                        _l.label = 6;
                    case 6:
                        if (!!_k.done) return [3 /*break*/, 10];
                        i = _k.value;
                        tokenId = order_utils_1.generatePseudoRandomSalt();
                        return [4 /*yield*/, this.mintAsync(dummyTokenContract.address, tokenId, tokenOwnerAddress)];
                    case 7:
                        _l.sent();
                        if (this._initialTokenIdsByOwner[tokenOwnerAddress] === undefined) {
                            this._initialTokenIdsByOwner[tokenOwnerAddress] = (_d = {},
                                _d[dummyTokenContract.address] = [],
                                _d);
                        }
                        if (this._initialTokenIdsByOwner[tokenOwnerAddress][dummyTokenContract.address] === undefined) {
                            this._initialTokenIdsByOwner[tokenOwnerAddress][dummyTokenContract.address] = [];
                        }
                        this._initialTokenIdsByOwner[tokenOwnerAddress][dummyTokenContract.address].push(tokenId);
                        return [4 /*yield*/, this.approveProxyForAllAsync(dummyTokenContract.address, tokenOwnerAddress, true)];
                    case 8:
                        _l.sent();
                        _l.label = 9;
                    case 9:
                        _k = _j.next();
                        return [3 /*break*/, 6];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        e_4_1 = _l.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 13];
                    case 12:
                        try {
                            if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 13:
                        _h = _g.next();
                        return [3 /*break*/, 4];
                    case 14: return [3 /*break*/, 17];
                    case 15:
                        e_3_1 = _l.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 17];
                    case 16:
                        try {
                            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 17:
                        _f = _e.next();
                        return [3 /*break*/, 2];
                    case 18: return [3 /*break*/, 21];
                    case 19:
                        e_2_1 = _l.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 21];
                    case 20:
                        try {
                            if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    ERC721Wrapper.prototype.doesTokenExistAsync = function (tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, owner, doesExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, tokenContract.ownerOf(tokenId).callAsync()];
                    case 1:
                        owner = _a.sent();
                        doesExist = owner !== contracts_test_utils_1.constants.NULL_ADDRESS;
                        return [2 /*return*/, doesExist];
                }
            });
        });
    };
    ERC721Wrapper.prototype.approveProxyAsync = function (tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var proxyAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxyAddress = this._proxyContract.address;
                        return [4 /*yield*/, this.approveAsync(proxyAddress, tokenAddress, tokenId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC721Wrapper.prototype.approveProxyForAllAsync = function (tokenAddress, ownerAddress, isApproved) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, proxyAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        proxyAddress = this._proxyContract.address;
                        return [4 /*yield*/, tokenContract.setApprovalForAll(proxyAddress, isApproved).awaitTransactionSuccessAsync({
                                from: ownerAddress,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC721Wrapper.prototype.approveAsync = function (to, tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, tokenOwner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, this.ownerOfAsync(tokenAddress, tokenId)];
                    case 1:
                        tokenOwner = _a.sent();
                        return [4 /*yield*/, tokenContract.approve(to, tokenId).awaitTransactionSuccessAsync({ from: tokenOwner })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC721Wrapper.prototype.transferFromAsync = function (tokenAddress, tokenId, currentOwner, userAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, tokenContract.transferFrom(currentOwner, userAddress, tokenId).awaitTransactionSuccessAsync({
                                from: currentOwner,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC721Wrapper.prototype.mintAsync = function (tokenAddress, tokenId, userAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, tokenContract.mint(userAddress, tokenId).awaitTransactionSuccessAsync({
                                from: this._contractOwnerAddress,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC721Wrapper.prototype.burnAsync = function (tokenAddress, tokenId, owner) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, tokenContract.burn(owner, tokenId).awaitTransactionSuccessAsync({ from: this._contractOwnerAddress })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC721Wrapper.prototype.ownerOfAsync = function (tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, owner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, tokenContract.ownerOf(tokenId).callAsync()];
                    case 1:
                        owner = _a.sent();
                        return [2 /*return*/, owner];
                }
            });
        });
    };
    ERC721Wrapper.prototype.isOwnerAsync = function (userAddress, tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, tokenOwner, isOwner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, tokenContract.ownerOf(tokenId).callAsync()];
                    case 1:
                        tokenOwner = _a.sent();
                        isOwner = tokenOwner === userAddress;
                        return [2 /*return*/, isOwner];
                }
            });
        });
    };
    ERC721Wrapper.prototype.isProxyApprovedForAllAsync = function (userAddress, tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, operator, didApproveAll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._validateProxyContractExistsOrThrow();
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        operator = this._proxyContract.address;
                        return [4 /*yield*/, tokenContract.isApprovedForAll(userAddress, operator).callAsync()];
                    case 1:
                        didApproveAll = _a.sent();
                        return [2 /*return*/, didApproveAll];
                }
            });
        });
    };
    ERC721Wrapper.prototype.isProxyApprovedAsync = function (tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, approvedAddress, proxyAddress, isProxyAnApprovedOperator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._validateProxyContractExistsOrThrow();
                        tokenContract = this._getTokenContractFromAssetData(tokenAddress);
                        return [4 /*yield*/, tokenContract.getApproved(tokenId).callAsync()];
                    case 1:
                        approvedAddress = _a.sent();
                        proxyAddress = this._proxyContract.address;
                        isProxyAnApprovedOperator = approvedAddress === proxyAddress;
                        return [2 /*return*/, isProxyAnApprovedOperator];
                }
            });
        });
    };
    ERC721Wrapper.prototype.getBalancesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_5, _a, e_6, _b, e_7, _c, tokenIdsByOwner, tokenOwnerAddresses, tokenInfo, _d, _e, dummyTokenContract, _f, _g, tokenOwnerAddress, initialTokenOwnerIds, initialTokenOwnerIds_1, initialTokenOwnerIds_1_1, tokenId, _h, _j, e_7_1, e_6_1, e_5_1;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        this._validateDummyTokenContractsExistOrThrow();
                        this._validateBalancesAndAllowancesSetOrThrow();
                        tokenIdsByOwner = {};
                        tokenOwnerAddresses = [];
                        tokenInfo = [];
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 18, 19, 20]);
                        _d = __values(this._dummyTokenContracts), _e = _d.next();
                        _k.label = 2;
                    case 2:
                        if (!!_e.done) return [3 /*break*/, 17];
                        dummyTokenContract = _e.value;
                        _k.label = 3;
                    case 3:
                        _k.trys.push([3, 14, 15, 16]);
                        _f = __values(this._tokenOwnerAddresses), _g = _f.next();
                        _k.label = 4;
                    case 4:
                        if (!!_g.done) return [3 /*break*/, 13];
                        tokenOwnerAddress = _g.value;
                        initialTokenOwnerIds = this._initialTokenIdsByOwner[tokenOwnerAddress][dummyTokenContract.address];
                        _k.label = 5;
                    case 5:
                        _k.trys.push([5, 10, 11, 12]);
                        initialTokenOwnerIds_1 = __values(initialTokenOwnerIds), initialTokenOwnerIds_1_1 = initialTokenOwnerIds_1.next();
                        _k.label = 6;
                    case 6:
                        if (!!initialTokenOwnerIds_1_1.done) return [3 /*break*/, 9];
                        tokenId = initialTokenOwnerIds_1_1.value;
                        _j = (_h = tokenOwnerAddresses).push;
                        return [4 /*yield*/, dummyTokenContract.ownerOf(tokenId).callAsync()];
                    case 7:
                        _j.apply(_h, [_k.sent()]);
                        tokenInfo.push({
                            tokenId: tokenId,
                            tokenAddress: dummyTokenContract.address,
                        });
                        _k.label = 8;
                    case 8:
                        initialTokenOwnerIds_1_1 = initialTokenOwnerIds_1.next();
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_7_1 = _k.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (initialTokenOwnerIds_1_1 && !initialTokenOwnerIds_1_1.done && (_c = initialTokenOwnerIds_1.return)) _c.call(initialTokenOwnerIds_1);
                        }
                        finally { if (e_7) throw e_7.error; }
                        return [7 /*endfinally*/];
                    case 12:
                        _g = _f.next();
                        return [3 /*break*/, 4];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        e_6_1 = _k.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 16];
                    case 15:
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_6) throw e_6.error; }
                        return [7 /*endfinally*/];
                    case 16:
                        _e = _d.next();
                        return [3 /*break*/, 2];
                    case 17: return [3 /*break*/, 20];
                    case 18:
                        e_5_1 = _k.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 20];
                    case 19:
                        try {
                            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 20:
                        _.forEach(tokenOwnerAddresses, function (tokenOwnerAddress, ownerIndex) {
                            var _a;
                            var tokenAddress = tokenInfo[ownerIndex].tokenAddress;
                            var tokenId = tokenInfo[ownerIndex].tokenId;
                            if (tokenIdsByOwner[tokenOwnerAddress] === undefined) {
                                tokenIdsByOwner[tokenOwnerAddress] = (_a = {},
                                    _a[tokenAddress] = [],
                                    _a);
                            }
                            if (tokenIdsByOwner[tokenOwnerAddress][tokenAddress] === undefined) {
                                tokenIdsByOwner[tokenOwnerAddress][tokenAddress] = [];
                            }
                            tokenIdsByOwner[tokenOwnerAddress][tokenAddress].push(tokenId);
                        });
                        return [2 /*return*/, tokenIdsByOwner];
                }
            });
        });
    };
    ERC721Wrapper.prototype.getTokenOwnerAddresses = function () {
        return this._tokenOwnerAddresses;
    };
    ERC721Wrapper.prototype.getTokenAddresses = function () {
        var tokenAddresses = _.map(this._dummyTokenContracts, function (dummyTokenContract) { return dummyTokenContract.address; });
        return tokenAddresses;
    };
    ERC721Wrapper.prototype._getTokenContractFromAssetData = function (tokenAddress) {
        var tokenContractIfExists = _.find(this._dummyTokenContracts, function (c) { return c.address === tokenAddress; });
        if (tokenContractIfExists === undefined) {
            throw new Error("Token: " + tokenAddress + " was not deployed through ERC20Wrapper");
        }
        return tokenContractIfExists;
    };
    ERC721Wrapper.prototype._validateDummyTokenContractsExistOrThrow = function () {
        if (this._dummyTokenContracts === undefined) {
            throw new Error('Dummy ERC721 tokens not yet deployed, please call "deployDummyTokensAsync"');
        }
    };
    ERC721Wrapper.prototype._validateProxyContractExistsOrThrow = function () {
        if (this._proxyContract === undefined) {
            throw new Error('ERC721 proxy contract not yet deployed, please call "deployProxyAsync"');
        }
    };
    ERC721Wrapper.prototype._validateBalancesAndAllowancesSetOrThrow = function () {
        if (_.keys(this._initialTokenIdsByOwner).length === 0) {
            throw new Error('Dummy ERC721 balances and allowances not yet set, please call "setBalancesAndAllowancesAsync"');
        }
    };
    return ERC721Wrapper;
}());
exports.ERC721Wrapper = ERC721Wrapper;
//# sourceMappingURL=erc721_wrapper.js.map