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
var contracts_erc20_1 = require("@0x/contracts-erc20");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
var ERC20Wrapper = /** @class */ (function () {
    /**
     * Instanitates an ERC20Wrapper
     * @param provider Web3 provider to use for all JSON RPC requests
     * @param tokenOwnerAddresses Addresses that we want to endow as owners for dummy ERC20 tokens
     * @param contractOwnerAddress Desired owner of the contract
     * Instance of ERC20Wrapper
     */
    function ERC20Wrapper(provider, tokenOwnerAddresses, contractOwnerAddress) {
        this._dummyTokenContracts = [];
        this._provider = provider;
        this._tokenOwnerAddresses = tokenOwnerAddresses;
        this._contractOwnerAddress = contractOwnerAddress;
        this._assetDataInterface = new wrappers_1.IAssetDataContract(contracts_test_utils_1.constants.NULL_ADDRESS, provider);
    }
    ERC20Wrapper.prototype.deployDummyTokensAsync = function (numberToDeploy, decimals) {
        return __awaiter(this, void 0, void 0, function () {
            var i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < numberToDeploy)) return [3 /*break*/, 4];
                        _b = (_a = this._dummyTokenContracts).push;
                        return [4 /*yield*/, contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, this._provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts, contracts_test_utils_1.constants.DUMMY_TOKEN_NAME, contracts_test_utils_1.constants.DUMMY_TOKEN_SYMBOL, decimals, contracts_test_utils_1.constants.DUMMY_TOKEN_TOTAL_SUPPLY)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, this._dummyTokenContracts];
                }
            });
        });
    };
    ERC20Wrapper.prototype.deployProxyAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, wrappers_1.ERC20ProxyContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.ERC20Proxy, this._provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
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
    ERC20Wrapper.prototype.getProxyId = function () {
        this._validateProxyContractExistsOrThrow();
        return this._proxyIdIfExists;
    };
    ERC20Wrapper.prototype.setBalancesAndAllowancesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, e_2, _b, _c, _d, dummyTokenContract, _e, _f, tokenOwnerAddress, e_2_1, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        this._validateDummyTokenContractsExistOrThrow();
                        this._validateProxyContractExistsOrThrow();
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 13, 14, 15]);
                        _c = __values(this._dummyTokenContracts), _d = _c.next();
                        _g.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 12];
                        dummyTokenContract = _d.value;
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 9, 10, 11]);
                        _e = __values(this._tokenOwnerAddresses), _f = _e.next();
                        _g.label = 4;
                    case 4:
                        if (!!_f.done) return [3 /*break*/, 8];
                        tokenOwnerAddress = _f.value;
                        return [4 /*yield*/, dummyTokenContract
                                .setBalance(tokenOwnerAddress, contracts_test_utils_1.constants.INITIAL_ERC20_BALANCE)
                                .awaitTransactionSuccessAsync({ from: this._contractOwnerAddress })];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, dummyTokenContract
                                .approve(this._proxyContract.address, contracts_test_utils_1.constants.INITIAL_ERC20_ALLOWANCE)
                                .awaitTransactionSuccessAsync({ from: tokenOwnerAddress })];
                    case 6:
                        _g.sent();
                        _g.label = 7;
                    case 7:
                        _f = _e.next();
                        return [3 /*break*/, 4];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_2_1 = _g.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 14:
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    ERC20Wrapper.prototype.getBalanceAsync = function (userAddress, assetData) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, balance, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._getTokenContractFromAssetDataAsync(assetData)];
                    case 1:
                        tokenContract = _b.sent();
                        _a = utils_1.BigNumber.bind;
                        return [4 /*yield*/, tokenContract.balanceOf(userAddress).callAsync()];
                    case 2:
                        balance = new (_a.apply(utils_1.BigNumber, [void 0, _b.sent()]))();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    ERC20Wrapper.prototype.setBalanceAsync = function (userAddress, assetData, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getTokenContractFromAssetDataAsync(assetData)];
                    case 1:
                        tokenContract = _a.sent();
                        return [4 /*yield*/, tokenContract
                                .setBalance(userAddress, amount)
                                .awaitTransactionSuccessAsync({ from: this._contractOwnerAddress }, { pollingIntervalMs: contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC20Wrapper.prototype.getProxyAllowanceAsync = function (userAddress, assetData) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, proxyAddress, allowance, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._getTokenContractFromAssetDataAsync(assetData)];
                    case 1:
                        tokenContract = _b.sent();
                        proxyAddress = this._proxyContract.address;
                        _a = utils_1.BigNumber.bind;
                        return [4 /*yield*/, tokenContract.allowance(userAddress, proxyAddress).callAsync()];
                    case 2:
                        allowance = new (_a.apply(utils_1.BigNumber, [void 0, _b.sent()]))();
                        return [2 /*return*/, allowance];
                }
            });
        });
    };
    ERC20Wrapper.prototype.setAllowanceAsync = function (userAddress, assetData, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, proxyAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getTokenContractFromAssetDataAsync(assetData)];
                    case 1:
                        tokenContract = _a.sent();
                        proxyAddress = this._proxyContract.address;
                        return [4 /*yield*/, tokenContract.approve(proxyAddress, amount).awaitTransactionSuccessAsync({ from: userAddress })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ERC20Wrapper.prototype.getBalancesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_3, _a, e_4, _b, balancesByOwner, balances, balanceInfo, _c, _d, dummyTokenContract, _e, _f, tokenOwnerAddress, _g, _h, e_4_1, e_3_1;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        this._validateDummyTokenContractsExistOrThrow();
                        balancesByOwner = {};
                        balances = [];
                        balanceInfo = [];
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 12, 13, 14]);
                        _c = __values(this._dummyTokenContracts), _d = _c.next();
                        _j.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 11];
                        dummyTokenContract = _d.value;
                        _j.label = 3;
                    case 3:
                        _j.trys.push([3, 8, 9, 10]);
                        _e = __values(this._tokenOwnerAddresses), _f = _e.next();
                        _j.label = 4;
                    case 4:
                        if (!!_f.done) return [3 /*break*/, 7];
                        tokenOwnerAddress = _f.value;
                        _h = (_g = balances).push;
                        return [4 /*yield*/, dummyTokenContract.balanceOf(tokenOwnerAddress).callAsync()];
                    case 5:
                        _h.apply(_g, [_j.sent()]);
                        balanceInfo.push({
                            tokenOwnerAddress: tokenOwnerAddress,
                            tokenAddress: dummyTokenContract.address,
                        });
                        _j.label = 6;
                    case 6:
                        _f = _e.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_4_1 = _j.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_3_1 = _j.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 14:
                        _.forEach(balances, function (balance, balanceIndex) {
                            var tokenAddress = balanceInfo[balanceIndex].tokenAddress;
                            var tokenOwnerAddress = balanceInfo[balanceIndex].tokenOwnerAddress;
                            if (balancesByOwner[tokenOwnerAddress] === undefined) {
                                balancesByOwner[tokenOwnerAddress] = {};
                            }
                            var wrappedBalance = new utils_1.BigNumber(balance);
                            balancesByOwner[tokenOwnerAddress][tokenAddress] = wrappedBalance;
                        });
                        return [2 /*return*/, balancesByOwner];
                }
            });
        });
    };
    ERC20Wrapper.prototype.addDummyTokenContract = function (dummy) {
        if (this._dummyTokenContracts !== undefined) {
            this._dummyTokenContracts.push(dummy);
        }
    };
    ERC20Wrapper.prototype.addTokenOwnerAddress = function (address) {
        this._tokenOwnerAddresses.push(address);
    };
    ERC20Wrapper.prototype.getTokenOwnerAddresses = function () {
        return this._tokenOwnerAddresses;
    };
    ERC20Wrapper.prototype.getTokenAddresses = function () {
        var tokenAddresses = _.map(this._dummyTokenContracts, function (dummyTokenContract) { return dummyTokenContract.address; });
        return tokenAddresses;
    };
    ERC20Wrapper.prototype._getTokenContractFromAssetDataAsync = function (assetData) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAddress, tokenContractIfExists;
            return __generator(this, function (_a) {
                tokenAddress = this._assetDataInterface.getABIDecodedTransactionData('ERC20Token', assetData);
                tokenContractIfExists = _.find(this._dummyTokenContracts, function (c) { return c.address === tokenAddress; });
                if (tokenContractIfExists === undefined) {
                    throw new Error("Token: " + tokenAddress + " was not deployed through ERC20Wrapper");
                }
                return [2 /*return*/, tokenContractIfExists];
            });
        });
    };
    ERC20Wrapper.prototype._validateDummyTokenContractsExistOrThrow = function () {
        if (this._dummyTokenContracts === undefined) {
            throw new Error('Dummy ERC20 tokens not yet deployed, please call "deployDummyTokensAsync"');
        }
    };
    ERC20Wrapper.prototype._validateProxyContractExistsOrThrow = function () {
        if (this._proxyContract === undefined) {
            throw new Error('ERC20 proxy contract not yet deployed, please call "deployProxyAsync"');
        }
    };
    return ERC20Wrapper;
}());
exports.ERC20Wrapper = ERC20Wrapper;
//# sourceMappingURL=erc20_wrapper.js.map