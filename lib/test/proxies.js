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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_erc20_1 = require("@0x/contracts-erc20");
var contracts_erc721_1 = require("@0x/contracts-erc721");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var dev_utils_1 = require("@0x/dev-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var chai = require("chai");
var _ = require("lodash");
var asset_data_1 = require("../src/asset_data");
var erc1155_proxy_wrapper_1 = require("../src/erc1155_proxy_wrapper");
var erc20_wrapper_1 = require("../src/erc20_wrapper");
var erc721_wrapper_1 = require("../src/erc721_wrapper");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.chaiSetup.configure();
var expect = chai.expect;
var blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(contracts_test_utils_1.web3Wrapper);
var assetProxyInterface = new wrappers_1.IAssetProxyContract(contracts_test_utils_1.constants.NULL_ADDRESS, contracts_test_utils_1.provider);
// tslint:disable:no-unnecessary-type-assertion
describe('Asset Transfer Proxies', function () {
    var owner;
    var notAuthorized;
    var authorized;
    var fromAddress;
    var toAddress;
    var erc20TokenA;
    var erc20TokenB;
    var erc721TokenA;
    var erc721TokenB;
    var erc721Receiver;
    var erc20Proxy;
    var erc721Proxy;
    var noReturnErc20Token;
    var multipleReturnErc20Token;
    var multiAssetProxy;
    var erc20Wrapper;
    var erc721Wrapper;
    var erc721AFromTokenId;
    var erc721BFromTokenId;
    var erc1155Proxy;
    var erc1155ProxyWrapper;
    var erc1155Contract;
    var erc1155Contract2;
    var erc1155Wrapper;
    var erc1155Wrapper2;
    var erc1155FungibleTokens;
    var erc1155NonFungibleTokensOwnedBySpender;
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
        var _a, _b, _c, _d, _e, accounts, usedAddresses, numDummyErc20ToDeploy, erc721Balances, nonFungibleTokens, tokenBalances;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.getAvailableAddressesAsync()];
                case 1:
                    accounts = _f.sent();
                    usedAddresses = (_a = _.slice(accounts, 0, 5), _b = __read(_a, 5), owner = _b[0], notAuthorized = _b[1], authorized = _b[2], fromAddress = _b[3], toAddress = _b[4], _a);
                    erc20Wrapper = new erc20_wrapper_1.ERC20Wrapper(contracts_test_utils_1.provider, usedAddresses, owner);
                    erc721Wrapper = new erc721_wrapper_1.ERC721Wrapper(contracts_test_utils_1.provider, usedAddresses, owner);
                    return [4 /*yield*/, erc20Wrapper.deployProxyAsync()];
                case 2:
                    // Deploy AssetProxies
                    erc20Proxy = _f.sent();
                    return [4 /*yield*/, erc721Wrapper.deployProxyAsync()];
                case 3:
                    erc721Proxy = _f.sent();
                    return [4 /*yield*/, wrappers_1.MultiAssetProxyContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.MultiAssetProxy, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                case 4:
                    multiAssetProxy = _f.sent();
                    // Configure ERC20Proxy
                    return [4 /*yield*/, erc20Proxy.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner })];
                case 5:
                    // Configure ERC20Proxy
                    _f.sent();
                    return [4 /*yield*/, erc20Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync({ from: owner })];
                case 6:
                    _f.sent();
                    // Configure ERC721Proxy
                    return [4 /*yield*/, erc721Proxy.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner })];
                case 7:
                    // Configure ERC721Proxy
                    _f.sent();
                    return [4 /*yield*/, erc721Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync({ from: owner })];
                case 8:
                    _f.sent();
                    // Configure ERC115Proxy
                    erc1155ProxyWrapper = new erc1155_proxy_wrapper_1.ERC1155ProxyWrapper(contracts_test_utils_1.provider, usedAddresses, owner);
                    return [4 /*yield*/, erc1155ProxyWrapper.deployProxyAsync()];
                case 9:
                    erc1155Proxy = _f.sent();
                    return [4 /*yield*/, erc1155Proxy.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner })];
                case 10:
                    _f.sent();
                    return [4 /*yield*/, erc1155Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync({ from: owner })];
                case 11:
                    _f.sent();
                    // Configure MultiAssetProxy
                    return [4 /*yield*/, multiAssetProxy.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner })];
                case 12:
                    // Configure MultiAssetProxy
                    _f.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(erc20Proxy.address).awaitTransactionSuccessAsync({ from: owner })];
                case 13:
                    _f.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(erc721Proxy.address).awaitTransactionSuccessAsync({ from: owner })];
                case 14:
                    _f.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(erc1155Proxy.address).awaitTransactionSuccessAsync({ from: owner })];
                case 15:
                    _f.sent();
                    numDummyErc20ToDeploy = 2;
                    return [4 /*yield*/, erc20Wrapper.deployDummyTokensAsync(numDummyErc20ToDeploy, contracts_test_utils_1.constants.DUMMY_TOKEN_DECIMALS)];
                case 16:
                    _c = __read.apply(void 0, [_f.sent(), 2]), erc20TokenA = _c[0], erc20TokenB = _c[1];
                    return [4 /*yield*/, contracts_erc20_1.DummyNoReturnERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyNoReturnERC20Token, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts, contracts_test_utils_1.constants.DUMMY_TOKEN_NAME, contracts_test_utils_1.constants.DUMMY_TOKEN_SYMBOL, contracts_test_utils_1.constants.DUMMY_TOKEN_DECIMALS, contracts_test_utils_1.constants.DUMMY_TOKEN_TOTAL_SUPPLY)];
                case 17:
                    noReturnErc20Token = _f.sent();
                    return [4 /*yield*/, contracts_erc20_1.DummyMultipleReturnERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyMultipleReturnERC20Token, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts, contracts_test_utils_1.constants.DUMMY_TOKEN_NAME, contracts_test_utils_1.constants.DUMMY_TOKEN_SYMBOL, contracts_test_utils_1.constants.DUMMY_TOKEN_DECIMALS, contracts_test_utils_1.constants.DUMMY_TOKEN_TOTAL_SUPPLY)];
                case 18:
                    multipleReturnErc20Token = _f.sent();
                    return [4 /*yield*/, erc20Wrapper.setBalancesAndAllowancesAsync()];
                case 19:
                    _f.sent();
                    return [4 /*yield*/, noReturnErc20Token.setBalance(fromAddress, contracts_test_utils_1.constants.INITIAL_ERC20_BALANCE).awaitTransactionSuccessAsync({
                            from: owner,
                        })];
                case 20:
                    _f.sent();
                    return [4 /*yield*/, noReturnErc20Token
                            .approve(erc20Proxy.address, contracts_test_utils_1.constants.INITIAL_ERC20_ALLOWANCE)
                            .awaitTransactionSuccessAsync({ from: fromAddress })];
                case 21:
                    _f.sent();
                    return [4 /*yield*/, multipleReturnErc20Token
                            .setBalance(fromAddress, contracts_test_utils_1.constants.INITIAL_ERC20_BALANCE)
                            .awaitTransactionSuccessAsync({
                            from: owner,
                        })];
                case 22:
                    _f.sent();
                    return [4 /*yield*/, multipleReturnErc20Token
                            .approve(erc20Proxy.address, contracts_test_utils_1.constants.INITIAL_ERC20_ALLOWANCE)
                            .awaitTransactionSuccessAsync({ from: fromAddress })];
                case 23:
                    _f.sent();
                    return [4 /*yield*/, erc721Wrapper.deployDummyTokensAsync()];
                case 24:
                    // Deploy and configure ERC721 tokens and receiver
                    _d = __read.apply(void 0, [_f.sent(), 2]), erc721TokenA = _d[0], erc721TokenB = _d[1];
                    return [4 /*yield*/, contracts_erc721_1.DummyERC721ReceiverContract.deployFrom0xArtifactAsync(contracts_erc721_1.artifacts.DummyERC721Receiver, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                case 25:
                    erc721Receiver = _f.sent();
                    return [4 /*yield*/, erc721Wrapper.setBalancesAndAllowancesAsync()];
                case 26:
                    _f.sent();
                    return [4 /*yield*/, erc721Wrapper.getBalancesAsync()];
                case 27:
                    erc721Balances = _f.sent();
                    erc721AFromTokenId = erc721Balances[fromAddress][erc721TokenA.address][0];
                    erc721BFromTokenId = erc721Balances[fromAddress][erc721TokenB.address][0];
                    return [4 /*yield*/, erc1155ProxyWrapper.deployDummyContractsAsync()];
                case 28:
                    // Deploy & configure ERC1155 tokens and receiver
                    _e = __read.apply(void 0, [_f.sent(), 2]), erc1155Wrapper = _e[0], erc1155Wrapper2 = _e[1];
                    erc1155Contract = erc1155Wrapper.getContract();
                    erc1155Contract2 = erc1155Wrapper2.getContract();
                    return [4 /*yield*/, erc1155ProxyWrapper.setBalancesAndAllowancesAsync()];
                case 29:
                    _f.sent();
                    erc1155FungibleTokens = erc1155ProxyWrapper.getFungibleTokenIds();
                    nonFungibleTokens = erc1155ProxyWrapper.getNonFungibleTokenIds();
                    return [4 /*yield*/, erc1155ProxyWrapper.getBalancesAsync()];
                case 30:
                    tokenBalances = _f.sent();
                    erc1155NonFungibleTokensOwnedBySpender = [];
                    _.each(nonFungibleTokens, function (nonFungibleToken) {
                        var nonFungibleTokenAsString = nonFungibleToken.toString();
                        var nonFungibleTokenHeldBySpender = tokenBalances.nonFungible[fromAddress][erc1155Contract.address][nonFungibleTokenAsString][0];
                        erc1155NonFungibleTokensOwnedBySpender.push(nonFungibleTokenHeldBySpender);
                    });
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
    describe('ERC20Proxy', function () {
        it('should revert if undefined function is called', function () { return __awaiter(_this, void 0, void 0, function () {
            var undefinedSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        undefinedSelector = '0x01020304';
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                from: owner,
                                to: erc20Proxy.address,
                                value: contracts_test_utils_1.constants.ZERO_AMOUNT,
                                data: undefinedSelector,
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have an id of 0xf47261b0', function () { return __awaiter(_this, void 0, void 0, function () {
            var proxyId, expectedProxyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, erc20Proxy.getProxyId().callAsync()];
                    case 1:
                        proxyId = _a.sent();
                        expectedProxyId = '0xf47261b0';
                        expect(proxyId).to.equal(expectedProxyId);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('transferFrom', function () {
            it('should successfully transfer tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, erc20Balances, amount, data, _a, _b, newBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            amount = new utils_1.BigNumber(10);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(amount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(amount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer tokens that do not return a value', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, initialFromBalance, initialToBalance, amount, data, _a, _b, newFromBalance, newToBalance;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC20AssetData(noReturnErc20Token.address);
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(fromAddress).callAsync()];
                        case 1:
                            initialFromBalance = _c.sent();
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(toAddress).callAsync()];
                        case 2:
                            initialToBalance = _c.sent();
                            amount = new utils_1.BigNumber(10);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 3: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(fromAddress).callAsync()];
                        case 5:
                            newFromBalance = _c.sent();
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(toAddress).callAsync()];
                        case 6:
                            newToBalance = _c.sent();
                            expect(newFromBalance).to.be.bignumber.equal(initialFromBalance.minus(amount));
                            expect(newToBalance).to.be.bignumber.equal(initialToBalance.plus(amount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer tokens and ignore extra assetData', function () { return __awaiter(_this, void 0, void 0, function () {
                var extraData, encodedAssetData, erc20Balances, amount, data, _a, _b, newBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            extraData = '0102030405060708';
                            encodedAssetData = "" + asset_data_1.encodeERC20AssetData(erc20TokenA.address) + extraData;
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            amount = new utils_1.BigNumber(10);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(amount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(amount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if transferring 0 amount of a token', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, erc20Balances, amount, data, _a, _b, newBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            amount = new utils_1.BigNumber(0);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address]);
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if allowances are too low', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, allowance, amount, data, erc20Balances, newBalances;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            allowance = new utils_1.BigNumber(0);
                            amount = new utils_1.BigNumber(10);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20TokenA.approve(erc20Proxy.address, allowance).awaitTransactionSuccessAsync({
                                    from: fromAddress,
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 2:
                            erc20Balances = _a.sent();
                            // Perform a transfer; expect this to fail.
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.TransferFailed)];
                        case 3:
                            // Perform a transfer; expect this to fail.
                            _a.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _a.sent();
                            expect(newBalances).to.deep.equal(erc20Balances);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if allowances are too low and token does not return a value', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, allowance, amount, data, initialFromBalance, initialToBalance, newFromBalance, newToBalance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC20AssetData(noReturnErc20Token.address);
                            allowance = new utils_1.BigNumber(0);
                            amount = new utils_1.BigNumber(10);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, noReturnErc20Token.approve(erc20Proxy.address, allowance).awaitTransactionSuccessAsync({
                                    from: fromAddress,
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(fromAddress).callAsync()];
                        case 2:
                            initialFromBalance = _a.sent();
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(toAddress).callAsync()];
                        case 3:
                            initialToBalance = _a.sent();
                            // Perform a transfer; expect this to fail.
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.TransferFailed)];
                        case 4:
                            // Perform a transfer; expect this to fail.
                            _a.sent();
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(fromAddress).callAsync()];
                        case 5:
                            newFromBalance = _a.sent();
                            return [4 /*yield*/, noReturnErc20Token.balanceOf(toAddress).callAsync()];
                        case 6:
                            newToBalance = _a.sent();
                            expect(newFromBalance).to.be.bignumber.equal(initialFromBalance);
                            expect(newToBalance).to.be.bignumber.equal(initialToBalance);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if caller is not authorized', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, amount, data, erc20Balances, newBalances;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            amount = new utils_1.BigNumber(10);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _a.sent();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: notAuthorized,
                                }), types_1.RevertReason.SenderNotAuthorized)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 3:
                            newBalances = _a.sent();
                            expect(newBalances).to.deep.equal(erc20Balances);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if token returns more than 32 bytes', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, amount, data, initialFromBalance, initialToBalance, newFromBalance, newToBalance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC20AssetData(multipleReturnErc20Token.address);
                            amount = new utils_1.BigNumber(10);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, multipleReturnErc20Token.balanceOf(fromAddress).callAsync()];
                        case 1:
                            initialFromBalance = _a.sent();
                            return [4 /*yield*/, multipleReturnErc20Token.balanceOf(toAddress).callAsync()];
                        case 2:
                            initialToBalance = _a.sent();
                            // Perform a transfer; expect this to fail.
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc20Proxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.TransferFailed)];
                        case 3:
                            // Perform a transfer; expect this to fail.
                            _a.sent();
                            return [4 /*yield*/, multipleReturnErc20Token.balanceOf(fromAddress).callAsync()];
                        case 4:
                            newFromBalance = _a.sent();
                            return [4 /*yield*/, multipleReturnErc20Token.balanceOf(toAddress).callAsync()];
                        case 5:
                            newToBalance = _a.sent();
                            expect(newFromBalance).to.be.bignumber.equal(initialFromBalance);
                            expect(newToBalance).to.be.bignumber.equal(initialToBalance);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('ERC721Proxy', function () {
        it('should revert if undefined function is called', function () { return __awaiter(_this, void 0, void 0, function () {
            var undefinedSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        undefinedSelector = '0x01020304';
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                from: owner,
                                to: erc721Proxy.address,
                                value: contracts_test_utils_1.constants.ZERO_AMOUNT,
                                data: undefinedSelector,
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have an id of 0x02571792', function () { return __awaiter(_this, void 0, void 0, function () {
            var proxyId, expectedProxyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, erc721Proxy.getProxyId().callAsync()];
                    case 1:
                        proxyId = _a.sent();
                        expectedProxyId = '0x02571792';
                        expect(proxyId).to.equal(expectedProxyId);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('transferFrom', function () {
            it('should successfully transfer tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, ownerFromAsset, amount, data, _a, _b, newOwnerFromAsset;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _c.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            amount = new utils_1.BigNumber(1);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc721Proxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 4:
                            newOwnerFromAsset = _c.sent();
                            expect(newOwnerFromAsset).to.be.bignumber.equal(toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer tokens and ignore extra assetData', function () { return __awaiter(_this, void 0, void 0, function () {
                var extraData, encodedAssetData, ownerFromAsset, amount, data, _a, _b, newOwnerFromAsset;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            extraData = '0102030405060708';
                            encodedAssetData = "" + asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId) + extraData;
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _c.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            amount = new utils_1.BigNumber(1);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc721Proxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 4:
                            newOwnerFromAsset = _c.sent();
                            expect(newOwnerFromAsset).to.be.bignumber.equal(toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not call onERC721Received when transferring to a smart contract', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, ownerFromAsset, amount, data, logDecoder, tx, _a, _b, newOwnerFromAsset;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _c.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            amount = new utils_1.BigNumber(1);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, erc721Receiver.address, amount)
                                .getABIEncodedTransactionData();
                            logDecoder = new contracts_test_utils_1.LogDecoder(contracts_test_utils_1.web3Wrapper, __assign({}, artifacts_1.artifacts, contracts_erc721_1.artifacts));
                            _b = (_a = logDecoder).getTxWithDecodedLogsAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc721Proxy.address,
                                    data: data,
                                    from: authorized,
                                    gas: contracts_test_utils_1.constants.MAX_TRANSFER_FROM_GAS,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                        case 3:
                            tx = _c.sent();
                            // Verify that no log was emitted by erc721 receiver
                            expect(tx.logs.length).to.be.equal(1);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 4:
                            newOwnerFromAsset = _c.sent();
                            expect(newOwnerFromAsset).to.be.bignumber.equal(erc721Receiver.address);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if transferring 0 amount of a token', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, ownerFromAsset, amount, data, newOwner;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _a.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            amount = new utils_1.BigNumber(0);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc721Proxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.InvalidAmount)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 3:
                            newOwner = _a.sent();
                            expect(newOwner).to.be.equal(ownerFromAsset);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if transferring > 1 amount of a token', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, ownerFromAsset, amount, data, newOwner;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _a.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            amount = new utils_1.BigNumber(500);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc721Proxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.InvalidAmount)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 3:
                            newOwner = _a.sent();
                            expect(newOwner).to.be.equal(ownerFromAsset);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if allowances are too low', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, ownerFromAsset, amount, data, newOwner;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _a.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            // Remove blanket transfer approval for fromAddress.
                            return [4 /*yield*/, erc721TokenA.setApprovalForAll(erc721Proxy.address, false).awaitTransactionSuccessAsync({
                                    from: fromAddress,
                                })];
                        case 2:
                            // Remove blanket transfer approval for fromAddress.
                            _a.sent();
                            // Remove token transfer approval for fromAddress.
                            return [4 /*yield*/, erc721TokenA.approve(contracts_test_utils_1.constants.NULL_ADDRESS, erc721AFromTokenId).awaitTransactionSuccessAsync({
                                    from: fromAddress,
                                })];
                        case 3:
                            // Remove token transfer approval for fromAddress.
                            _a.sent();
                            amount = new utils_1.BigNumber(1);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc721Proxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.TransferFailed)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 5:
                            newOwner = _a.sent();
                            expect(newOwner).to.be.equal(ownerFromAsset);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if caller is not authorized', function () { return __awaiter(_this, void 0, void 0, function () {
                var encodedAssetData, ownerFromAsset, amount, data, newOwner;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedAssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _a.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            amount = new utils_1.BigNumber(1);
                            data = assetProxyInterface
                                .transferFrom(encodedAssetData, fromAddress, toAddress, amount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: erc721Proxy.address,
                                    data: data,
                                    from: notAuthorized,
                                }), types_1.RevertReason.SenderNotAuthorized)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 3:
                            newOwner = _a.sent();
                            expect(newOwner).to.be.equal(ownerFromAsset);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('MultiAssetProxy', function () {
        it('should revert if undefined function is called', function () { return __awaiter(_this, void 0, void 0, function () {
            var undefinedSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        undefinedSelector = '0x01020304';
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                from: owner,
                                to: multiAssetProxy.address,
                                value: contracts_test_utils_1.constants.ZERO_AMOUNT,
                                data: undefinedSelector,
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have an id of 0x94cfcdd7', function () { return __awaiter(_this, void 0, void 0, function () {
            var proxyId, expectedProxyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, multiAssetProxy.getProxyId().callAsync()];
                    case 1:
                        proxyId = _a.sent();
                        expectedProxyId = '0x94cfcdd7';
                        expect(proxyId).to.equal(expectedProxyId);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('transferFrom', function () {
            it('should transfer a single ERC20 token', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, amounts, nestedAssetData, assetData, data, erc20Balances, _a, _b, newBalances, totalAmount;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            amounts = [erc20Amount];
                            nestedAssetData = [erc20AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            totalAmount = inputAmount.times(erc20Amount);
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalAmount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should dispatch an ERC20 transfer when input amount is 0', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, amounts, nestedAssetData, assetData, data, erc20Balances, logDecoder, tx, _a, _b, log, transferEventName, newBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = contracts_test_utils_1.constants.ZERO_AMOUNT;
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            amounts = [erc20Amount];
                            nestedAssetData = [erc20AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            logDecoder = new contracts_test_utils_1.LogDecoder(contracts_test_utils_1.web3Wrapper, __assign({}, artifacts_1.artifacts, contracts_erc20_1.artifacts));
                            _b = (_a = logDecoder).getTxWithDecodedLogsAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                        case 3:
                            tx = _c.sent();
                            expect(tx.logs.length).to.be.equal(1);
                            log = tx.logs[0];
                            transferEventName = 'Transfer';
                            expect(log.event).to.equal(transferEventName);
                            expect(log.args._value).to.be.bignumber.equal(contracts_test_utils_1.constants.ZERO_AMOUNT);
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            expect(newBalances).to.deep.equal(erc20Balances);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer multiple of the same ERC20 token', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount1, erc20Amount2, erc20AssetData1, erc20AssetData2, amounts, nestedAssetData, assetData, data, erc20Balances, _a, _b, newBalances, totalAmount;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount1 = new utils_1.BigNumber(10);
                            erc20Amount2 = new utils_1.BigNumber(20);
                            erc20AssetData1 = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc20AssetData2 = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            amounts = [erc20Amount1, erc20Amount2];
                            nestedAssetData = [erc20AssetData1, erc20AssetData2];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            totalAmount = inputAmount.times(erc20Amount1).plus(inputAmount.times(erc20Amount2));
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalAmount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer multiple different ERC20 tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount1, erc20Amount2, erc20AssetData1, erc20AssetData2, amounts, nestedAssetData, assetData, data, erc20Balances, _a, _b, newBalances, totalErc20AAmount, totalErc20BAmount;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount1 = new utils_1.BigNumber(10);
                            erc20Amount2 = new utils_1.BigNumber(20);
                            erc20AssetData1 = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc20AssetData2 = asset_data_1.encodeERC20AssetData(erc20TokenB.address);
                            amounts = [erc20Amount1, erc20Amount2];
                            nestedAssetData = [erc20AssetData1, erc20AssetData2];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            totalErc20AAmount = inputAmount.times(erc20Amount1);
                            totalErc20BAmount = inputAmount.times(erc20Amount2);
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalErc20AAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalErc20AAmount));
                            expect(newBalances[fromAddress][erc20TokenB.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenB.address].minus(totalErc20BAmount));
                            expect(newBalances[toAddress][erc20TokenB.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenB.address].plus(totalErc20BAmount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should transfer a single ERC721 token', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, data, ownerFromAsset, _a, _b, newOwnerFromAsset;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc721Amount];
                            nestedAssetData = [erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset = _c.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 4:
                            newOwnerFromAsset = _c.sent();
                            expect(newOwnerFromAsset).to.be.equal(toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer multiple of the same ERC721 token', function () { return __awaiter(_this, void 0, void 0, function () {
                var erc721Balances, erc721AFromTokenId2, erc721AssetData1, erc721AssetData2, inputAmount, erc721Amount, amounts, nestedAssetData, assetData, data, ownerFromAsset1, ownerFromAsset2, _a, _b, newOwnerFromAsset1, newOwnerFromAsset2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, erc721Wrapper.getBalancesAsync()];
                        case 1:
                            erc721Balances = _c.sent();
                            erc721AFromTokenId2 = erc721Balances[fromAddress][erc721TokenA.address][1];
                            erc721AssetData1 = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            erc721AssetData2 = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId2);
                            inputAmount = new utils_1.BigNumber(1);
                            erc721Amount = new utils_1.BigNumber(1);
                            amounts = [erc721Amount, erc721Amount];
                            nestedAssetData = [erc721AssetData1, erc721AssetData2];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 2:
                            ownerFromAsset1 = _c.sent();
                            expect(ownerFromAsset1).to.be.equal(fromAddress);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId2).callAsync()];
                        case 3:
                            ownerFromAsset2 = _c.sent();
                            expect(ownerFromAsset2).to.be.equal(fromAddress);
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                    gas: contracts_test_utils_1.constants.MAX_TRANSFER_FROM_GAS,
                                })];
                        case 4: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 6:
                            newOwnerFromAsset1 = _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId2).callAsync()];
                        case 7:
                            newOwnerFromAsset2 = _c.sent();
                            expect(newOwnerFromAsset1).to.be.equal(toAddress);
                            expect(newOwnerFromAsset2).to.be.equal(toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer multiple different ERC721 tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var erc721AssetData1, erc721AssetData2, inputAmount, erc721Amount, amounts, nestedAssetData, assetData, data, ownerFromAsset1, ownerFromAsset2, _a, _b, newOwnerFromAsset1, newOwnerFromAsset2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            erc721AssetData1 = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            erc721AssetData2 = asset_data_1.encodeERC721AssetData(erc721TokenB.address, erc721BFromTokenId);
                            inputAmount = new utils_1.BigNumber(1);
                            erc721Amount = new utils_1.BigNumber(1);
                            amounts = [erc721Amount, erc721Amount];
                            nestedAssetData = [erc721AssetData1, erc721AssetData2];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 1:
                            ownerFromAsset1 = _c.sent();
                            expect(ownerFromAsset1).to.be.equal(fromAddress);
                            return [4 /*yield*/, erc721TokenB.ownerOf(erc721BFromTokenId).callAsync()];
                        case 2:
                            ownerFromAsset2 = _c.sent();
                            expect(ownerFromAsset2).to.be.equal(fromAddress);
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                    gas: contracts_test_utils_1.constants.MAX_TRANSFER_FROM_GAS,
                                })];
                        case 3: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 5:
                            newOwnerFromAsset1 = _c.sent();
                            return [4 /*yield*/, erc721TokenB.ownerOf(erc721BFromTokenId).callAsync()];
                        case 6:
                            newOwnerFromAsset2 = _c.sent();
                            expect(newOwnerFromAsset1).to.be.equal(toAddress);
                            expect(newOwnerFromAsset2).to.be.equal(toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should transfer a fungible ERC1155 token', function () { return __awaiter(_this, void 0, void 0, function () {
                var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, expectedInitialBalances, erc1155AssetData, multiAssetAmount, amounts, nestedAssetData, assetData, data, _a, _b, totalValueTransferred, expectedFinalBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tokenHolders = [fromAddress, toAddress];
                            tokensToTransfer = erc1155FungibleTokens.slice(0, 1);
                            valuesToTransfer = [new utils_1.BigNumber(25)];
                            valueMultiplier = new utils_1.BigNumber(23);
                            receiverCallbackData = '0x0102030405';
                            expectedInitialBalances = [
                                // from
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                // to
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                        case 1:
                            _c.sent();
                            erc1155AssetData = asset_data_1.encodeERC1155AssetData(erc1155Contract.address, tokensToTransfer, valuesToTransfer, receiverCallbackData);
                            multiAssetAmount = new utils_1.BigNumber(5);
                            amounts = [valueMultiplier];
                            nestedAssetData = [erc1155AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, multiAssetAmount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: 
                        // execute transfer
                        return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            // execute transfer
                            _c.sent();
                            totalValueTransferred = valuesToTransfer[0].times(valueMultiplier).times(multiAssetAmount);
                            expectedFinalBalances = [
                                // from
                                expectedInitialBalances[0].minus(totalValueTransferred),
                                // to
                                expectedInitialBalances[1].plus(totalValueTransferred),
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                        case 4:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer multiple fungible tokens of the same ERC1155 contract', function () { return __awaiter(_this, void 0, void 0, function () {
                var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, expectedInitialBalances, erc1155AssetData, multiAssetAmount, amounts, nestedAssetData, assetData, data, _a, _b, totalValuesTransferred, expectedFinalBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tokenHolders = [fromAddress, toAddress];
                            tokensToTransfer = erc1155FungibleTokens.slice(0, 3);
                            valuesToTransfer = [new utils_1.BigNumber(25), new utils_1.BigNumber(35), new utils_1.BigNumber(45)];
                            valueMultiplier = new utils_1.BigNumber(23);
                            receiverCallbackData = '0x0102030405';
                            expectedInitialBalances = [
                                // from
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                // to
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                        case 1:
                            _c.sent();
                            erc1155AssetData = asset_data_1.encodeERC1155AssetData(erc1155Contract.address, tokensToTransfer, valuesToTransfer, receiverCallbackData);
                            multiAssetAmount = new utils_1.BigNumber(5);
                            amounts = [valueMultiplier];
                            nestedAssetData = [erc1155AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, multiAssetAmount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: 
                        // execute transfer
                        return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            // execute transfer
                            _c.sent();
                            totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                                return value.times(valueMultiplier).times(multiAssetAmount);
                            });
                            expectedFinalBalances = [
                                // from
                                expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                                expectedInitialBalances[1].minus(totalValuesTransferred[1]),
                                expectedInitialBalances[2].minus(totalValuesTransferred[2]),
                                // to
                                expectedInitialBalances[3].plus(totalValuesTransferred[0]),
                                expectedInitialBalances[4].plus(totalValuesTransferred[1]),
                                expectedInitialBalances[5].plus(totalValuesTransferred[2]),
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                        case 4:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer multiple fungible/non-fungible tokens of the same ERC1155 contract', function () { return __awaiter(_this, void 0, void 0, function () {
                var tokenHolders, fungibleTokensToTransfer, nonFungibleTokensToTransfer, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, nftOwnerBalance, nftNotOwnerBalance, expectedInitialBalances, erc1155AssetData, multiAssetAmount, amounts, nestedAssetData, assetData, data, _a, _b, totalValuesTransferred, expectedFinalBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tokenHolders = [fromAddress, toAddress];
                            fungibleTokensToTransfer = erc1155FungibleTokens.slice(0, 1);
                            nonFungibleTokensToTransfer = erc1155NonFungibleTokensOwnedBySpender.slice(0, 1);
                            tokensToTransfer = fungibleTokensToTransfer.concat(nonFungibleTokensToTransfer);
                            valuesToTransfer = [new utils_1.BigNumber(25), new utils_1.BigNumber(1)];
                            valueMultiplier = new utils_1.BigNumber(1);
                            receiverCallbackData = '0x0102030405';
                            nftOwnerBalance = new utils_1.BigNumber(1);
                            nftNotOwnerBalance = new utils_1.BigNumber(0);
                            expectedInitialBalances = [
                                // from
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                nftOwnerBalance,
                                // to
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                nftNotOwnerBalance,
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                        case 1:
                            _c.sent();
                            erc1155AssetData = asset_data_1.encodeERC1155AssetData(erc1155Contract.address, tokensToTransfer, valuesToTransfer, receiverCallbackData);
                            multiAssetAmount = new utils_1.BigNumber(1);
                            amounts = [valueMultiplier];
                            nestedAssetData = [erc1155AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, multiAssetAmount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: 
                        // execute transfer
                        return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            // execute transfer
                            _c.sent();
                            totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                                return value.times(valueMultiplier).times(multiAssetAmount);
                            });
                            expectedFinalBalances = [
                                // from
                                expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                                expectedInitialBalances[1].minus(totalValuesTransferred[1]),
                                // to
                                expectedInitialBalances[2].plus(totalValuesTransferred[0]),
                                expectedInitialBalances[3].plus(totalValuesTransferred[1]),
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                        case 4:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // TODO(dorothy-zbornak): Figure out why this test fails.
            it.skip('should successfully transfer multiple different ERC1155 tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, expectedInitialBalances, erc1155AssetData1, erc1155AssetData2, multiAssetAmount, amounts, nestedAssetData, assetData, data, _a, _b, totalValueTransferred, expectedFinalBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tokenHolders = [fromAddress, toAddress];
                            tokensToTransfer = erc1155FungibleTokens.slice(0, 1);
                            valuesToTransfer = [new utils_1.BigNumber(25)];
                            valueMultiplier = new utils_1.BigNumber(23);
                            receiverCallbackData = '0x0102030405';
                            expectedInitialBalances = [
                                // from
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                // to
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, erc1155Wrapper2.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                        case 2:
                            _c.sent();
                            erc1155AssetData1 = asset_data_1.encodeERC1155AssetData(erc1155Contract.address, tokensToTransfer, valuesToTransfer, receiverCallbackData);
                            erc1155AssetData2 = asset_data_1.encodeERC1155AssetData(erc1155Contract2.address, tokensToTransfer, valuesToTransfer, receiverCallbackData);
                            multiAssetAmount = new utils_1.BigNumber(5);
                            amounts = [valueMultiplier, valueMultiplier];
                            nestedAssetData = [erc1155AssetData1, erc1155AssetData2];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, multiAssetAmount)
                                .getABIEncodedTransactionData();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 3: 
                        // execute transfer
                        return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 4:
                            // execute transfer
                            _c.sent();
                            totalValueTransferred = valuesToTransfer[0].times(valueMultiplier).times(multiAssetAmount);
                            expectedFinalBalances = [
                                // from
                                expectedInitialBalances[0].minus(totalValueTransferred),
                                // to
                                expectedInitialBalances[1].plus(totalValueTransferred),
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, erc1155Wrapper2.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                        case 6:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer a combination of ERC20, ERC721, and ERC1155 tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, erc1155TokenHolders, erc1155TokensToTransfer, erc1155ValuesToTransfer, erc1155Amount, erc1155ReceiverCallbackData, erc1155AssetData, amounts, nestedAssetData, assetData, data, erc20Balances, ownerFromAsset, erc1155ExpectedInitialBalances, _a, _b, newBalances, totalAmount, newOwnerFromAsset, erc1155TotalValueTransferred, expectedFinalBalances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            erc1155TokenHolders = [fromAddress, toAddress];
                            erc1155TokensToTransfer = erc1155FungibleTokens.slice(0, 1);
                            erc1155ValuesToTransfer = [new utils_1.BigNumber(25)];
                            erc1155Amount = new utils_1.BigNumber(23);
                            erc1155ReceiverCallbackData = '0x0102030405';
                            erc1155AssetData = asset_data_1.encodeERC1155AssetData(erc1155Contract.address, erc1155TokensToTransfer, erc1155ValuesToTransfer, erc1155ReceiverCallbackData);
                            amounts = [erc20Amount, erc721Amount, erc1155Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData, erc1155AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 2:
                            ownerFromAsset = _c.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            erc1155ExpectedInitialBalances = [
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                                contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE,
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(erc1155TokenHolders, erc1155TokensToTransfer, erc1155ExpectedInitialBalances)];
                        case 3:
                            _c.sent();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                    gas: 1000000,
                                })];
                        case 4: 
                        // execute transfer
                        return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 5:
                            // execute transfer
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 6:
                            newBalances = _c.sent();
                            totalAmount = inputAmount.times(erc20Amount);
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalAmount));
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 7:
                            newOwnerFromAsset = _c.sent();
                            expect(newOwnerFromAsset).to.be.equal(toAddress);
                            erc1155TotalValueTransferred = erc1155ValuesToTransfer[0].times(erc1155Amount).times(inputAmount);
                            expectedFinalBalances = [
                                erc1155ExpectedInitialBalances[0].minus(erc1155TotalValueTransferred),
                                erc1155ExpectedInitialBalances[1].plus(erc1155TotalValueTransferred),
                            ];
                            return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(erc1155TokenHolders, erc1155TokensToTransfer, expectedFinalBalances)];
                        case 8:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer a combination of ERC20 and ERC721 tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, data, erc20Balances, ownerFromAsset, _a, _b, newBalances, totalAmount, newOwnerFromAsset;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 2:
                            ownerFromAsset = _c.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 3: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 5:
                            newBalances = _c.sent();
                            totalAmount = inputAmount.times(erc20Amount);
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalAmount));
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 6:
                            newOwnerFromAsset = _c.sent();
                            expect(newOwnerFromAsset).to.be.equal(toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            // TODO(dorothy-zbornak): Figure out why this test fails.
            it.skip('should successfully transfer tokens and ignore extra assetData', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, extraData, assetData, data, erc20Balances, ownerFromAsset, _a, _b, newBalances, totalAmount, newOwnerFromAsset;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            extraData = '0102030405060708090001020304050607080900010203040506070809000102';
                            assetData = "" + asset_data_1.encodeMultiAssetData(amounts, nestedAssetData) + extraData;
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 2:
                            ownerFromAsset = _c.sent();
                            expect(ownerFromAsset).to.be.equal(fromAddress);
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 3: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 5:
                            newBalances = _c.sent();
                            totalAmount = inputAmount.times(erc20Amount);
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalAmount));
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 6:
                            newOwnerFromAsset = _c.sent();
                            expect(newOwnerFromAsset).to.be.equal(toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer correct amounts when the `amount` > 1', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount1, erc20Amount2, erc20AssetData1, erc20AssetData2, amounts, nestedAssetData, assetData, data, erc20Balances, _a, _b, newBalances, totalErc20AAmount, totalErc20BAmount;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(100);
                            erc20Amount1 = new utils_1.BigNumber(10);
                            erc20Amount2 = new utils_1.BigNumber(20);
                            erc20AssetData1 = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc20AssetData2 = asset_data_1.encodeERC20AssetData(erc20TokenB.address);
                            amounts = [erc20Amount1, erc20Amount2];
                            nestedAssetData = [erc20AssetData1, erc20AssetData2];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 1:
                            erc20Balances = _c.sent();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                })];
                        case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 4:
                            newBalances = _c.sent();
                            totalErc20AAmount = inputAmount.times(erc20Amount1);
                            totalErc20BAmount = inputAmount.times(erc20Amount2);
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalErc20AAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalErc20AAmount));
                            expect(newBalances[fromAddress][erc20TokenB.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenB.address].minus(totalErc20BAmount));
                            expect(newBalances[toAddress][erc20TokenB.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenB.address].plus(totalErc20BAmount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully transfer a large amount of tokens', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount1, erc20Amount2, erc20AssetData1, erc20AssetData2, erc721Amount, erc721Balances, erc721AFromTokenId2, erc721BFromTokenId2, erc721AssetData1, erc721AssetData2, erc721AssetData3, erc721AssetData4, amounts, nestedAssetData, assetData, data, ownerFromAsset1, ownerFromAsset2, ownerFromAsset3, ownerFromAsset4, erc20Balances, _a, _b, newOwnerFromAsset1, newOwnerFromAsset2, newOwnerFromAsset3, newOwnerFromAsset4, newBalances, totalErc20AAmount, totalErc20BAmount;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount1 = new utils_1.BigNumber(10);
                            erc20Amount2 = new utils_1.BigNumber(20);
                            erc20AssetData1 = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc20AssetData2 = asset_data_1.encodeERC20AssetData(erc20TokenB.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            return [4 /*yield*/, erc721Wrapper.getBalancesAsync()];
                        case 1:
                            erc721Balances = _c.sent();
                            erc721AFromTokenId2 = erc721Balances[fromAddress][erc721TokenA.address][1];
                            erc721BFromTokenId2 = erc721Balances[fromAddress][erc721TokenB.address][1];
                            erc721AssetData1 = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            erc721AssetData2 = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId2);
                            erc721AssetData3 = asset_data_1.encodeERC721AssetData(erc721TokenB.address, erc721BFromTokenId);
                            erc721AssetData4 = asset_data_1.encodeERC721AssetData(erc721TokenB.address, erc721BFromTokenId2);
                            amounts = [erc721Amount, erc20Amount1, erc721Amount, erc20Amount2, erc721Amount, erc721Amount];
                            nestedAssetData = [
                                erc721AssetData1,
                                erc20AssetData1,
                                erc721AssetData2,
                                erc20AssetData2,
                                erc721AssetData3,
                                erc721AssetData4,
                            ];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 2:
                            ownerFromAsset1 = _c.sent();
                            expect(ownerFromAsset1).to.be.equal(fromAddress);
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId2).callAsync()];
                        case 3:
                            ownerFromAsset2 = _c.sent();
                            expect(ownerFromAsset2).to.be.equal(fromAddress);
                            return [4 /*yield*/, erc721TokenB.ownerOf(erc721BFromTokenId).callAsync()];
                        case 4:
                            ownerFromAsset3 = _c.sent();
                            expect(ownerFromAsset3).to.be.equal(fromAddress);
                            return [4 /*yield*/, erc721TokenB.ownerOf(erc721BFromTokenId2).callAsync()];
                        case 5:
                            ownerFromAsset4 = _c.sent();
                            expect(ownerFromAsset4).to.be.equal(fromAddress);
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 6:
                            erc20Balances = _c.sent();
                            _b = (_a = contracts_test_utils_1.web3Wrapper).awaitTransactionSuccessAsync;
                            return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                    gas: contracts_test_utils_1.constants.MAX_EXECUTE_TRANSACTION_GAS,
                                })];
                        case 7: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                contracts_test_utils_1.constants.AWAIT_TRANSACTION_MINED_MS])];
                        case 8:
                            _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId).callAsync()];
                        case 9:
                            newOwnerFromAsset1 = _c.sent();
                            return [4 /*yield*/, erc721TokenA.ownerOf(erc721AFromTokenId2).callAsync()];
                        case 10:
                            newOwnerFromAsset2 = _c.sent();
                            return [4 /*yield*/, erc721TokenB.ownerOf(erc721BFromTokenId).callAsync()];
                        case 11:
                            newOwnerFromAsset3 = _c.sent();
                            return [4 /*yield*/, erc721TokenB.ownerOf(erc721BFromTokenId2).callAsync()];
                        case 12:
                            newOwnerFromAsset4 = _c.sent();
                            expect(newOwnerFromAsset1).to.be.equal(toAddress);
                            expect(newOwnerFromAsset2).to.be.equal(toAddress);
                            expect(newOwnerFromAsset3).to.be.equal(toAddress);
                            expect(newOwnerFromAsset4).to.be.equal(toAddress);
                            return [4 /*yield*/, erc20Wrapper.getBalancesAsync()];
                        case 13:
                            newBalances = _c.sent();
                            totalErc20AAmount = inputAmount.times(erc20Amount1);
                            totalErc20BAmount = inputAmount.times(erc20Amount2);
                            expect(newBalances[fromAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenA.address].minus(totalErc20AAmount));
                            expect(newBalances[toAddress][erc20TokenA.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenA.address].plus(totalErc20AAmount));
                            expect(newBalances[fromAddress][erc20TokenB.address]).to.be.bignumber.equal(erc20Balances[fromAddress][erc20TokenB.address].minus(totalErc20BAmount));
                            expect(newBalances[toAddress][erc20TokenB.address]).to.be.bignumber.equal(erc20Balances[toAddress][erc20TokenB.address].plus(totalErc20BAmount));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if a single transfer fails', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(2);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.InvalidAmount)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if an AssetProxy is not registered', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, invalidProxyId, invalidErc721AssetData, amounts, nestedAssetData, assetData, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            invalidProxyId = '0x12345678';
                            invalidErc721AssetData = "" + invalidProxyId + erc721AssetData.slice(10);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, invalidErc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.AssetProxyDoesNotExist)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if the length of `amounts` does not match the length of `nestedAssetData`', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721AssetData, amounts, nestedAssetData, assetData, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.LengthMismatch)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if amounts multiplication results in an overflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, amounts, nestedAssetData, assetData, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(2).pow(128);
                            erc20Amount = new utils_1.BigNumber(2).pow(128);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            amounts = [erc20Amount];
                            nestedAssetData = [erc20AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.Uint256Overflow)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if an element of `nestedAssetData` is < 4 bytes long', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = '0x123456';
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: authorized,
                                }), types_1.RevertReason.LengthGreaterThan3Required)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if caller is not authorized', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: data,
                                    from: notAuthorized,
                                }), types_1.RevertReason.SenderNotAuthorized)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if asset data overflows beyond the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, data, offsetToAssetData, invalidOffsetToAssetData, newAssetData, badData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            offsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000080';
                            invalidOffsetToAssetData = '00000000000000000000000000000000000000000000000000000000000002a0';
                            newAssetData = '0000000000000000000000000000000000000000000000000000000000000304';
                            badData = "" + data.replace(offsetToAssetData, invalidOffsetToAssetData) + newAssetData;
                            // execute transfer
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: badData,
                                    from: authorized,
                                }), types_1.RevertReason.InvalidAssetDataEnd)];
                        case 1:
                            // execute transfer
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if asset data resolves to a location beyond the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, data, offsetToAssetData, invalidOffsetToAssetData, badData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            data = assetProxyInterface
                                .transferFrom(assetData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            offsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000080';
                            invalidOffsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000400';
                            badData = data.replace(offsetToAssetData, invalidOffsetToAssetData);
                            // execute transfer
                            // note that this triggers `InvalidAssetDataLength` because the length is zero, otherwise it would
                            // trigger `InvalidAssetDataEnd`.
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: badData,
                                    from: authorized,
                                }), types_1.RevertReason.InvalidAssetDataLength)];
                        case 1:
                            // execute transfer
                            // note that this triggers `InvalidAssetDataLength` because the length is zero, otherwise it would
                            // trigger `InvalidAssetDataEnd`.
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if length of assetData, excluding the selector, is not a multiple of 32', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, erc20Amount, erc20AssetData, erc721Amount, erc721AssetData, amounts, nestedAssetData, assetData, extraData, assetDataWithExtraData, badData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            erc20Amount = new utils_1.BigNumber(10);
                            erc20AssetData = asset_data_1.encodeERC20AssetData(erc20TokenA.address);
                            erc721Amount = new utils_1.BigNumber(1);
                            erc721AssetData = asset_data_1.encodeERC721AssetData(erc721TokenA.address, erc721AFromTokenId);
                            amounts = [erc20Amount, erc721Amount];
                            nestedAssetData = [erc20AssetData, erc721AssetData];
                            assetData = asset_data_1.encodeMultiAssetData(amounts, nestedAssetData);
                            extraData = '01';
                            assetDataWithExtraData = "" + assetData + extraData;
                            badData = assetProxyInterface
                                .transferFrom(assetDataWithExtraData, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            // execute transfer
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: badData,
                                    from: authorized,
                                }), types_1.RevertReason.InvalidAssetDataLength)];
                        case 1:
                            // execute transfer
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should revert if length of assetData is less than 68 bytes', function () { return __awaiter(_this, void 0, void 0, function () {
                var inputAmount, zeros32Bytes, assetData36Bytes, badData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputAmount = new utils_1.BigNumber(1);
                            zeros32Bytes = '0'.repeat(64);
                            assetData36Bytes = "" + types_1.AssetProxyId.MultiAsset + zeros32Bytes;
                            badData = assetProxyInterface
                                .transferFrom(assetData36Bytes, fromAddress, toAddress, inputAmount)
                                .getABIEncodedTransactionData();
                            // execute transfer
                            return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(contracts_test_utils_1.web3Wrapper.sendTransactionAsync({
                                    to: multiAssetProxy.address,
                                    data: badData,
                                    from: authorized,
                                }), types_1.RevertReason.InvalidAssetDataLength)];
                        case 1:
                            // execute transfer
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
// tslint:enable:no-unnecessary-type-assertion
// tslint:disable:max-file-line-count
//# sourceMappingURL=proxies.js.map