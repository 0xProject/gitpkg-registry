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
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_erc1155_1 = require("@0x/contracts-erc1155");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
var ERC1155ProxyWrapper = /** @class */ (function () {
    function ERC1155ProxyWrapper(provider, tokenOwnerAddresses, contractOwnerAddress) {
        this._initialTokenIdsByOwner = { fungible: {}, nonFungible: {} };
        this._web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
        this._provider = provider;
        var allArtifacts = _.merge(artifacts_1.artifacts, contracts_erc1155_1.artifacts);
        this._logDecoder = new contracts_test_utils_1.LogDecoder(this._web3Wrapper, allArtifacts);
        this._dummyTokenWrappers = [];
        this._assetProxyInterface = new wrappers_1.IAssetProxyContract(contracts_test_utils_1.constants.NULL_ADDRESS, provider);
        this._assetDataInterface = new wrappers_1.IAssetDataContract(contracts_test_utils_1.constants.NULL_ADDRESS, provider);
        this._tokenOwnerAddresses = tokenOwnerAddresses;
        this._contractOwnerAddress = contractOwnerAddress;
        this._fungibleTokenIds = [];
        this._nonFungibleTokenIds = [];
        this._nfts = [];
    }
    /**
     * @dev Deploys dummy ERC1155 contracts
     * @return An array of ERC1155 wrappers; one for each deployed contract.
     */
    ERC1155ProxyWrapper.prototype.deployDummyContractsAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, _b, _c, i, erc1155Contract, erc1155Wrapper, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _b = __values(_.times(contracts_test_utils_1.constants.NUM_DUMMY_ERC1155_CONTRACTS_TO_DEPLOY)), _c = _b.next();
                        _d.label = 1;
                    case 1:
                        if (!!_c.done) return [3 /*break*/, 4];
                        i = _c.value;
                        return [4 /*yield*/, contracts_erc1155_1.ERC1155MintableContract.deployFrom0xArtifactAsync(contracts_erc1155_1.artifacts.ERC1155Mintable, this._provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                    case 2:
                        erc1155Contract = _d.sent();
                        erc1155Wrapper = new contracts_erc1155_1.Erc1155Wrapper(erc1155Contract, this._contractOwnerAddress);
                        this._dummyTokenWrappers.push(erc1155Wrapper);
                        _d.label = 3;
                    case 3:
                        _c = _b.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/, this._dummyTokenWrappers];
                }
            });
        });
    };
    /**
     * @dev Deploys the ERC1155 proxy
     * @return Deployed ERC1155 proxy contract instance
     */
    ERC1155ProxyWrapper.prototype.deployProxyAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, wrappers_1.ERC1155ProxyContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.ERC1155Proxy, this._provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
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
    /**
     * @dev Gets the ERC1155 proxy id
     */
    ERC1155ProxyWrapper.prototype.getProxyId = function () {
        this._validateProxyContractExistsOrThrow();
        return this._proxyIdIfExists;
    };
    /**
     * @dev generates abi-encoded tx data for transferring erc1155 fungible/non-fungible tokens.
     * @param from source address
     * @param to destination address
     * @param contractAddress address of erc155 contract
     * @param tokensToTransfer array of erc1155 tokens to transfer
     * @param valuesToTransfer array of corresponding values for each erc1155 token to transfer
     * @param valueMultiplier each value in `valuesToTransfer` is multiplied by this
     * @param receiverCallbackData callback data if `to` is a contract
     * @param authorizedSender sender of `transferFrom` transaction
     * @param extraData extra data to append to `transferFrom` transaction. Optional.
     * @return abi encoded tx data.
     */
    ERC1155ProxyWrapper.prototype.getTransferFromAbiEncodedTxDataAsync = function (from, to, contractAddress, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorizedSender, assetData_) {
        return __awaiter(this, void 0, void 0, function () {
            var assetData, data;
            return __generator(this, function (_a) {
                this._validateProxyContractExistsOrThrow();
                assetData = assetData_ === undefined
                    ? this._assetDataInterface
                        .ERC1155Assets(contractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                        .getABIEncodedTransactionData()
                    : assetData_;
                data = this._assetProxyInterface
                    .transferFrom(assetData, from, to, valueMultiplier)
                    .getABIEncodedTransactionData();
                return [2 /*return*/, data];
            });
        });
    };
    /**
     * @dev transfers erc1155 fungible/non-fungible tokens.
     * @param txData: abi-encoded tx data
     * @param authorizedSender sender of `transferFrom` transaction
     */
    ERC1155ProxyWrapper.prototype.transferFromRawAsync = function (txData, authorizedSender) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash, txReceipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3Wrapper.sendTransactionAsync({
                            to: this._proxyContract.address,
                            data: txData,
                            from: authorizedSender,
                            gas: 300000,
                        })];
                    case 1:
                        txHash = _a.sent();
                        return [4 /*yield*/, this._logDecoder.getTxWithDecodedLogsAsync(txHash)];
                    case 2:
                        txReceipt = _a.sent();
                        return [2 /*return*/, txReceipt];
                }
            });
        });
    };
    /**
     * @dev transfers erc1155 fungible/non-fungible tokens.
     * @param from source address
     * @param to destination address
     * @param contractAddress address of erc155 contract
     * @param tokensToTransfer array of erc1155 tokens to transfer
     * @param valuesToTransfer array of corresponding values for each erc1155 token to transfer
     * @param valueMultiplier each value in `valuesToTransfer` is multiplied by this
     * @param receiverCallbackData callback data if `to` is a contract
     * @param authorizedSender sender of `transferFrom` transaction
     * @param extraData extra data to append to `transferFrom` transaction. Optional.
     * @return tranasction hash.
     */
    ERC1155ProxyWrapper.prototype.transferFromAsync = function (from, to, contractAddress, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorizedSender, assetData_) {
        return __awaiter(this, void 0, void 0, function () {
            var assetData, data, txHash, txReceipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._validateProxyContractExistsOrThrow();
                        assetData = assetData_ === undefined
                            ? this._assetDataInterface
                                .ERC1155Assets(contractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                                .getABIEncodedTransactionData()
                            : assetData_;
                        data = this._assetProxyInterface
                            .transferFrom(assetData, from, to, valueMultiplier)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, this._web3Wrapper.sendTransactionAsync({
                                to: this._proxyContract.address,
                                data: data,
                                from: authorizedSender,
                                gas: 300000,
                            })];
                    case 1:
                        txHash = _a.sent();
                        return [4 /*yield*/, this._logDecoder.getTxWithDecodedLogsAsync(txHash)];
                    case 2:
                        txReceipt = _a.sent();
                        return [2 /*return*/, txReceipt];
                }
            });
        });
    };
    /**
     * @dev For each deployed ERC1155 contract, this function mints a set of fungible/non-fungible
     *      tokens for each token owner address (`_tokenOwnerAddresses`).
     * @return Balances of each token owner, across all ERC1155 contracts and tokens.
     */
    ERC1155ProxyWrapper.prototype.setBalancesAndAllowancesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, fungibleHoldingsByOwner, nonFungibleHoldingsByOwner, _loop_1, this_1, _b, _c, dummyWrapper, e_2_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this._validateDummyTokenContractsExistOrThrow();
                        this._validateProxyContractExistsOrThrow();
                        this._initialTokenIdsByOwner = {
                            fungible: {},
                            nonFungible: {},
                        };
                        fungibleHoldingsByOwner = {};
                        nonFungibleHoldingsByOwner = {};
                        _loop_1 = function (dummyWrapper) {
                            var e_3, _a, e_4, _b, e_5, _c, dummyAddress, _d, _e, i, tokenId, tokenIdAsString, _f, _g, tokenOwnerAddress, e_4_1, e_3_1, _loop_2, _h, _j, j, e_5_1;
                            return __generator(this, function (_k) {
                                switch (_k.label) {
                                    case 0:
                                        dummyAddress = dummyWrapper.getContract().address;
                                        _k.label = 1;
                                    case 1:
                                        _k.trys.push([1, 13, 14, 15]);
                                        _d = __values(_.times(contracts_test_utils_1.constants.NUM_ERC1155_FUNGIBLE_TOKENS_MINT)), _e = _d.next();
                                        _k.label = 2;
                                    case 2:
                                        if (!!_e.done) return [3 /*break*/, 12];
                                        i = _e.value;
                                        return [4 /*yield*/, dummyWrapper.mintFungibleTokensAsync(this_1._tokenOwnerAddresses, contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE)];
                                    case 3:
                                        tokenId = _k.sent();
                                        tokenIdAsString = tokenId.toString();
                                        this_1._fungibleTokenIds.push(tokenIdAsString);
                                        _k.label = 4;
                                    case 4:
                                        _k.trys.push([4, 9, 10, 11]);
                                        _f = __values(this_1._tokenOwnerAddresses), _g = _f.next();
                                        _k.label = 5;
                                    case 5:
                                        if (!!_g.done) return [3 /*break*/, 8];
                                        tokenOwnerAddress = _g.value;
                                        // tslint:disable-next-line:no-unused-variable
                                        if (fungibleHoldingsByOwner[tokenOwnerAddress] === undefined) {
                                            fungibleHoldingsByOwner[tokenOwnerAddress] = {};
                                        }
                                        if (fungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress] === undefined) {
                                            fungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress] = {};
                                        }
                                        fungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress][tokenIdAsString] =
                                            contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE;
                                        return [4 /*yield*/, dummyWrapper.setApprovalForAllAsync(tokenOwnerAddress, this_1._proxyContract.address, true)];
                                    case 6:
                                        _k.sent();
                                        _k.label = 7;
                                    case 7:
                                        _g = _f.next();
                                        return [3 /*break*/, 5];
                                    case 8: return [3 /*break*/, 11];
                                    case 9:
                                        e_4_1 = _k.sent();
                                        e_4 = { error: e_4_1 };
                                        return [3 /*break*/, 11];
                                    case 10:
                                        try {
                                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                                        }
                                        finally { if (e_4) throw e_4.error; }
                                        return [7 /*endfinally*/];
                                    case 11:
                                        _e = _d.next();
                                        return [3 /*break*/, 2];
                                    case 12: return [3 /*break*/, 15];
                                    case 13:
                                        e_3_1 = _k.sent();
                                        e_3 = { error: e_3_1 };
                                        return [3 /*break*/, 15];
                                    case 14:
                                        try {
                                            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                        return [7 /*endfinally*/];
                                    case 15:
                                        _loop_2 = function (j) {
                                            var _a, tokenId, nftIds, tokenIdAsString;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, dummyWrapper.mintNonFungibleTokensAsync(this_1._tokenOwnerAddresses)];
                                                    case 1:
                                                        _a = __read.apply(void 0, [_b.sent(), 2]), tokenId = _a[0], nftIds = _a[1];
                                                        tokenIdAsString = tokenId.toString();
                                                        this_1._nonFungibleTokenIds.push(tokenIdAsString);
                                                        _.each(this_1._tokenOwnerAddresses, function (tokenOwnerAddress, i) { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        if (nonFungibleHoldingsByOwner[tokenOwnerAddress] === undefined) {
                                                                            nonFungibleHoldingsByOwner[tokenOwnerAddress] = {};
                                                                        }
                                                                        if (nonFungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress] === undefined) {
                                                                            nonFungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress] = {};
                                                                        }
                                                                        if (nonFungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress][tokenIdAsString] === undefined) {
                                                                            nonFungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress][tokenIdAsString] = [];
                                                                        }
                                                                        this._nfts.push({ id: nftIds[i], tokenId: tokenId });
                                                                        nonFungibleHoldingsByOwner[tokenOwnerAddress][dummyAddress][tokenIdAsString].push(nftIds[i]);
                                                                        return [4 /*yield*/, dummyWrapper.setApprovalForAllAsync(tokenOwnerAddress, this._proxyContract.address, true)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _k.label = 16;
                                    case 16:
                                        _k.trys.push([16, 21, 22, 23]);
                                        _h = __values(_.times(contracts_test_utils_1.constants.NUM_ERC1155_NONFUNGIBLE_TOKENS_MINT)), _j = _h.next();
                                        _k.label = 17;
                                    case 17:
                                        if (!!_j.done) return [3 /*break*/, 20];
                                        j = _j.value;
                                        return [5 /*yield**/, _loop_2(j)];
                                    case 18:
                                        _k.sent();
                                        _k.label = 19;
                                    case 19:
                                        _j = _h.next();
                                        return [3 /*break*/, 17];
                                    case 20: return [3 /*break*/, 23];
                                    case 21:
                                        e_5_1 = _k.sent();
                                        e_5 = { error: e_5_1 };
                                        return [3 /*break*/, 23];
                                    case 22:
                                        try {
                                            if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                                        }
                                        finally { if (e_5) throw e_5.error; }
                                        return [7 /*endfinally*/];
                                    case 23: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _b = __values(this._dummyTokenWrappers), _c = _b.next();
                        _d.label = 2;
                    case 2:
                        if (!!_c.done) return [3 /*break*/, 5];
                        dummyWrapper = _c.value;
                        return [5 /*yield**/, _loop_1(dummyWrapper)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _c = _b.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this._initialTokenIdsByOwner = {
                            fungible: fungibleHoldingsByOwner,
                            nonFungible: nonFungibleHoldingsByOwner,
                        };
                        return [2 /*return*/, this._initialTokenIdsByOwner];
                }
            });
        });
    };
    /**
     * @dev For each deployed ERC1155 contract, this function quieries the set of fungible/non-fungible
     *      tokens for each token owner address (`_tokenOwnerAddresses`).
     * @return Balances of each token owner, across all ERC1155 contracts and tokens.
     */
    ERC1155ProxyWrapper.prototype.getBalancesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e, e_11, _f, e_12, _g, tokenHoldingsByOwner, nonFungibleHoldingsByOwner, _h, _j, dummyTokenWrapper, tokenContract, tokenAddress, tokenOwners, tokenIds, _k, _l, tokenOwnerAddress, _m, _o, tokenId, _p, _q, nft, balances, i, _r, _s, tokenOwnerAddress, _t, _u, tokenId, _v, _w, nft, isOwner, e_6_1, holdingsByOwner;
            return __generator(this, function (_x) {
                switch (_x.label) {
                    case 0:
                        this._validateDummyTokenContractsExistOrThrow();
                        this._validateBalancesAndAllowancesSetOrThrow();
                        tokenHoldingsByOwner = {};
                        nonFungibleHoldingsByOwner = {};
                        _x.label = 1;
                    case 1:
                        _x.trys.push([1, 6, 7, 8]);
                        _h = __values(this._dummyTokenWrappers), _j = _h.next();
                        _x.label = 2;
                    case 2:
                        if (!!_j.done) return [3 /*break*/, 5];
                        dummyTokenWrapper = _j.value;
                        tokenContract = dummyTokenWrapper.getContract();
                        tokenAddress = tokenContract.address;
                        tokenOwners = [];
                        tokenIds = [];
                        try {
                            for (_k = __values(this._tokenOwnerAddresses), _l = _k.next(); !_l.done; _l = _k.next()) {
                                tokenOwnerAddress = _l.value;
                                try {
                                    for (_m = __values(this._fungibleTokenIds), _o = _m.next(); !_o.done; _o = _m.next()) {
                                        tokenId = _o.value;
                                        tokenOwners.push(tokenOwnerAddress);
                                        tokenIds.push(new utils_1.BigNumber(tokenId));
                                    }
                                }
                                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                                finally {
                                    try {
                                        if (_o && !_o.done && (_c = _m.return)) _c.call(_m);
                                    }
                                    finally { if (e_8) throw e_8.error; }
                                }
                                try {
                                    for (_p = __values(this._nfts), _q = _p.next(); !_q.done; _q = _p.next()) {
                                        nft = _q.value;
                                        tokenOwners.push(tokenOwnerAddress);
                                        tokenIds.push(nft.id);
                                    }
                                }
                                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                                finally {
                                    try {
                                        if (_q && !_q.done && (_d = _p.return)) _d.call(_p);
                                    }
                                    finally { if (e_9) throw e_9.error; }
                                }
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (_l && !_l.done && (_b = _k.return)) _b.call(_k);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                        return [4 /*yield*/, dummyTokenWrapper.getBalancesAsync(tokenOwners, tokenIds)];
                    case 3:
                        balances = _x.sent();
                        i = 0;
                        try {
                            for (_r = __values(this._tokenOwnerAddresses), _s = _r.next(); !_s.done; _s = _r.next()) {
                                tokenOwnerAddress = _s.value;
                                try {
                                    // Fungible tokens
                                    for (_t = __values(this._fungibleTokenIds), _u = _t.next(); !_u.done; _u = _t.next()) {
                                        tokenId = _u.value;
                                        if (tokenHoldingsByOwner[tokenOwnerAddress] === undefined) {
                                            tokenHoldingsByOwner[tokenOwnerAddress] = {};
                                        }
                                        if (tokenHoldingsByOwner[tokenOwnerAddress][tokenAddress] === undefined) {
                                            tokenHoldingsByOwner[tokenOwnerAddress][tokenAddress] = {};
                                        }
                                        tokenHoldingsByOwner[tokenOwnerAddress][tokenAddress][tokenId] = balances[i++];
                                    }
                                }
                                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                                finally {
                                    try {
                                        if (_u && !_u.done && (_f = _t.return)) _f.call(_t);
                                    }
                                    finally { if (e_11) throw e_11.error; }
                                }
                                try {
                                    // Non-fungible tokens
                                    for (_v = __values(this._nfts), _w = _v.next(); !_w.done; _w = _v.next()) {
                                        nft = _w.value;
                                        if (nonFungibleHoldingsByOwner[tokenOwnerAddress] === undefined) {
                                            nonFungibleHoldingsByOwner[tokenOwnerAddress] = {};
                                        }
                                        if (nonFungibleHoldingsByOwner[tokenOwnerAddress][tokenAddress] === undefined) {
                                            nonFungibleHoldingsByOwner[tokenOwnerAddress][tokenAddress] = {};
                                        }
                                        if (nonFungibleHoldingsByOwner[tokenOwnerAddress][tokenAddress][nft.tokenId.toString()] ===
                                            undefined) {
                                            nonFungibleHoldingsByOwner[tokenOwnerAddress][tokenAddress][nft.tokenId.toString()] = [];
                                        }
                                        isOwner = balances[i++];
                                        if (isOwner.isEqualTo(1)) {
                                            nonFungibleHoldingsByOwner[tokenOwnerAddress][tokenAddress][nft.tokenId.toString()].push(nft.id);
                                        }
                                    }
                                }
                                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                                finally {
                                    try {
                                        if (_w && !_w.done && (_g = _v.return)) _g.call(_v);
                                    }
                                    finally { if (e_12) throw e_12.error; }
                                }
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (_s && !_s.done && (_e = _r.return)) _e.call(_r);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        _x.label = 4;
                    case 4:
                        _j = _h.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_6_1 = _x.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_j && !_j.done && (_a = _h.return)) _a.call(_h);
                        }
                        finally { if (e_6) throw e_6.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        holdingsByOwner = {
                            fungible: tokenHoldingsByOwner,
                            nonFungible: nonFungibleHoldingsByOwner,
                        };
                        return [2 /*return*/, holdingsByOwner];
                }
            });
        });
    };
    /**
     * @dev Set the approval for the proxy on behalf of `userAddress` .
     * @param userAddress owner of ERC1155 tokens.
     * @param contractAddress address of ERC1155 contract.
     * @param isApproved Whether to approve the proxy for all or not.
     */
    ERC1155ProxyWrapper.prototype.setProxyAllowanceForAllAsync = function (userAddress, contractAddress, isApproved) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenWrapper, operator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._validateProxyContractExistsOrThrow();
                        tokenWrapper = this.getContractWrapper(contractAddress);
                        operator = this._proxyContract.address;
                        return [4 /*yield*/, tokenWrapper.setApprovalForAllAsync(userAddress, operator, isApproved)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @dev Checks if proxy is approved to transfer tokens on behalf of `userAddress`.
     * @param userAddress owner of ERC1155 tokens.
     * @param contractAddress address of ERC1155 contract.
     * @return True iff the proxy is approved for all. False otherwise.
     */
    ERC1155ProxyWrapper.prototype.isProxyApprovedForAllAsync = function (userAddress, contractAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, operator, didApproveAll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._validateProxyContractExistsOrThrow();
                        tokenContract = this._getContractFromAddress(contractAddress);
                        operator = this._proxyContract.address;
                        return [4 /*yield*/, tokenContract.isApprovedForAll(userAddress, operator).callAsync()];
                    case 1:
                        didApproveAll = _a.sent();
                        return [2 /*return*/, didApproveAll];
                }
            });
        });
    };
    ERC1155ProxyWrapper.prototype.getFungibleTokenIds = function () {
        var fungibleTokenIds = _.map(this._fungibleTokenIds, function (tokenIdAsString) {
            return new utils_1.BigNumber(tokenIdAsString);
        });
        return fungibleTokenIds;
    };
    ERC1155ProxyWrapper.prototype.getNonFungibleTokenIds = function () {
        var nonFungibleTokenIds = _.map(this._nonFungibleTokenIds, function (tokenIdAsString) {
            return new utils_1.BigNumber(tokenIdAsString);
        });
        return nonFungibleTokenIds;
    };
    ERC1155ProxyWrapper.prototype.getTokenOwnerAddresses = function () {
        return this._tokenOwnerAddresses;
    };
    ERC1155ProxyWrapper.prototype.getContractWrapper = function (contractAddress) {
        var tokenWrapper = _.find(this._dummyTokenWrappers, function (wrapper) {
            return wrapper.getContract().address === contractAddress;
        });
        if (tokenWrapper === undefined) {
            throw new Error("Contract: " + contractAddress + " was not deployed through ERC1155ProxyWrapper");
        }
        return tokenWrapper;
    };
    ERC1155ProxyWrapper.prototype._getContractFromAddress = function (tokenAddress) {
        var tokenContractIfExists = _.find(this._dummyTokenWrappers, function (c) { return c.getContract().address === tokenAddress; });
        if (tokenContractIfExists === undefined) {
            throw new Error("Token: " + tokenAddress + " was not deployed through ERC1155ProxyWrapper");
        }
        return tokenContractIfExists.getContract();
    };
    ERC1155ProxyWrapper.prototype._validateDummyTokenContractsExistOrThrow = function () {
        if (this._dummyTokenWrappers === undefined) {
            throw new Error('Dummy ERC1155 tokens not yet deployed, please call "deployDummyTokensAsync"');
        }
    };
    ERC1155ProxyWrapper.prototype._validateProxyContractExistsOrThrow = function () {
        if (this._proxyContract === undefined) {
            throw new Error('ERC1155 proxy contract not yet deployed, please call "deployProxyAsync"');
        }
    };
    ERC1155ProxyWrapper.prototype._validateBalancesAndAllowancesSetOrThrow = function () {
        if (_.keys(this._initialTokenIdsByOwner.fungible).length === 0 ||
            _.keys(this._initialTokenIdsByOwner.nonFungible).length === 0) {
            throw new Error('Dummy ERC1155 balances and allowances not yet set, please call "setBalancesAndAllowancesAsync"');
        }
    };
    return ERC1155ProxyWrapper;
}());
exports.ERC1155ProxyWrapper = ERC1155ProxyWrapper;
//# sourceMappingURL=erc1155_proxy_wrapper.js.map