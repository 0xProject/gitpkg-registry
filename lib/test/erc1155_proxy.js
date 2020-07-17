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
var contracts_erc1155_1 = require("@0x/contracts-erc1155");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var contracts_utils_1 = require("@0x/contracts-utils");
var dev_utils_1 = require("@0x/dev-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var chai = require("chai");
var ethUtil = require("ethereumjs-util");
var _ = require("lodash");
var erc1155_proxy_wrapper_1 = require("../src/erc1155_proxy_wrapper");
var wrappers_1 = require("../src/wrappers");
var artifacts_1 = require("./artifacts");
contracts_test_utils_1.chaiSetup.configure();
var expect = chai.expect;
var blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(contracts_test_utils_1.web3Wrapper);
// tslint:disable:no-unnecessary-type-assertion
describe('ERC1155Proxy', function () {
    // constant values used in transfer tests
    var nftOwnerBalance = new utils_1.BigNumber(1);
    var nftNotOwnerBalance = new utils_1.BigNumber(0);
    var spenderInitialFungibleBalance = contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE;
    var receiverInitialFungibleBalance = contracts_test_utils_1.constants.INITIAL_ERC1155_FUNGIBLE_BALANCE;
    var receiverContractInitialFungibleBalance = new utils_1.BigNumber(0);
    var fungibleValueToTransferSmall = spenderInitialFungibleBalance.div(100);
    var fungibleValueToTransferLarge = spenderInitialFungibleBalance.div(4);
    var valueMultiplierSmall = new utils_1.BigNumber(2);
    var valueMultiplierNft = new utils_1.BigNumber(1);
    var nonFungibleValueToTransfer = nftOwnerBalance;
    var receiverCallbackData = '0x01020304';
    // addresses
    var owner;
    var notAuthorized;
    var authorized;
    var spender;
    var receiver;
    var receiverContract;
    // contracts & wrappers
    var erc1155Proxy;
    var erc1155Receiver;
    var erc1155ProxyWrapper;
    var erc1155Contract;
    var erc1155Wrapper;
    // tokens
    var fungibleTokens;
    var nonFungibleTokensOwnedBySpender;
    // IAssetData for encoding and decoding assetData
    var assetDataContract;
    // tests
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
        var _a, _b, _c, accounts, usedAddresses, nonFungibleTokens, tokenBalances;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, contracts_test_utils_1.web3Wrapper.getAvailableAddressesAsync()];
                case 1:
                    accounts = _d.sent();
                    usedAddresses = (_a = _.slice(accounts, 0, 5), _b = __read(_a, 5), owner = _b[0], notAuthorized = _b[1], authorized = _b[2], spender = _b[3], receiver = _b[4], _a);
                    erc1155ProxyWrapper = new erc1155_proxy_wrapper_1.ERC1155ProxyWrapper(contracts_test_utils_1.provider, usedAddresses, owner);
                    return [4 /*yield*/, erc1155ProxyWrapper.deployProxyAsync()];
                case 2:
                    erc1155Proxy = _d.sent();
                    return [4 /*yield*/, erc1155Proxy.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, erc1155Proxy.addAuthorizedAddress(erc1155Proxy.address).awaitTransactionSuccessAsync({ from: owner })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, erc1155ProxyWrapper.deployDummyContractsAsync()];
                case 5:
                    // deploy & configure ERC1155 tokens and receiver
                    _c = __read.apply(void 0, [_d.sent(), 1]), erc1155Wrapper = _c[0];
                    erc1155Contract = erc1155Wrapper.getContract();
                    return [4 /*yield*/, contracts_erc1155_1.DummyERC1155ReceiverContract.deployFrom0xArtifactAsync(contracts_erc1155_1.artifacts.DummyERC1155Receiver, contracts_test_utils_1.provider, contracts_test_utils_1.txDefaults, artifacts_1.artifacts)];
                case 6:
                    erc1155Receiver = _d.sent();
                    receiverContract = erc1155Receiver.address;
                    return [4 /*yield*/, erc1155ProxyWrapper.setBalancesAndAllowancesAsync()];
                case 7:
                    _d.sent();
                    fungibleTokens = erc1155ProxyWrapper.getFungibleTokenIds();
                    nonFungibleTokens = erc1155ProxyWrapper.getNonFungibleTokenIds();
                    return [4 /*yield*/, erc1155ProxyWrapper.getBalancesAsync()];
                case 8:
                    tokenBalances = _d.sent();
                    nonFungibleTokensOwnedBySpender = [];
                    _.each(nonFungibleTokens, function (nonFungibleToken) {
                        var nonFungibleTokenAsString = nonFungibleToken.toString();
                        var nonFungibleTokenHeldBySpender = tokenBalances.nonFungible[spender][erc1155Contract.address][nonFungibleTokenAsString][0];
                        nonFungibleTokensOwnedBySpender.push(nonFungibleTokenHeldBySpender);
                    });
                    // set up assetDataContract
                    assetDataContract = new wrappers_1.IAssetDataContract(contracts_test_utils_1.constants.NULL_ADDRESS, contracts_test_utils_1.provider, { from: owner });
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
                                from: owner,
                                to: erc1155Proxy.address,
                                value: contracts_test_utils_1.constants.ZERO_AMOUNT,
                                data: undefinedSelector,
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have an id of 0xa7cb5fb7', function () { return __awaiter(_this, void 0, void 0, function () {
            var proxyId, expectedProxyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, erc1155Proxy.getProxyId().callAsync()];
                    case 1:
                        proxyId = _a.sent();
                        expectedProxyId = types_1.AssetProxyId.ERC1155;
                        expect(proxyId).to.equal(expectedProxyId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('transferFrom', function () {
        it('should successfully transfer value for a single, fungible token', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, totalValueTransferred, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        totalValueTransferred = valuesToTransfer[0].times(valueMultiplier);
                        expectedFinalBalances = [
                            spenderInitialFungibleBalance.minus(totalValueTransferred),
                            receiverInitialFungibleBalance.plus(totalValueTransferred),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value for the same fungible token several times', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokenToTransfer, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, totalValueTransferred, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokenToTransfer = fungibleTokens[0];
                        tokensToTransfer = [tokenToTransfer, tokenToTransfer, tokenToTransfer];
                        valuesToTransfer = [
                            fungibleValueToTransferSmall.plus(10),
                            fungibleValueToTransferSmall.plus(20),
                            fungibleValueToTransferSmall.plus(30),
                        ];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [
                            // spender
                            spenderInitialFungibleBalance,
                            // receiver
                            receiverInitialFungibleBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, [tokenToTransfer], expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        totalValueTransferred = _.reduce(valuesToTransfer, function (sum, value) {
                            return sum.plus(value);
                        });
                        totalValueTransferred = totalValueTransferred.times(valueMultiplier);
                        expectedFinalBalances = [
                            // spender
                            spenderInitialFungibleBalance.minus(totalValueTransferred),
                            // receiver
                            receiverInitialFungibleBalance.plus(totalValueTransferred),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, [tokenToTransfer], expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value for several fungible tokens', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, totalValuesTransferred, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = fungibleTokens.slice(0, 3);
                        valuesToTransfer = [
                            fungibleValueToTransferSmall.plus(10),
                            fungibleValueToTransferSmall.plus(20),
                            fungibleValueToTransferSmall.plus(30),
                        ];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [
                            // spender
                            spenderInitialFungibleBalance,
                            spenderInitialFungibleBalance,
                            spenderInitialFungibleBalance,
                            // receiver
                            receiverInitialFungibleBalance,
                            receiverInitialFungibleBalance,
                            receiverInitialFungibleBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedFinalBalances = [
                            // spender
                            spenderInitialFungibleBalance.minus(totalValuesTransferred[0]),
                            spenderInitialFungibleBalance.minus(totalValuesTransferred[1]),
                            spenderInitialFungibleBalance.minus(totalValuesTransferred[2]),
                            // receiver
                            receiverInitialFungibleBalance.plus(totalValuesTransferred[0]),
                            receiverInitialFungibleBalance.plus(totalValuesTransferred[1]),
                            receiverInitialFungibleBalance.plus(totalValuesTransferred[2]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer a non-fungible token', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = nonFungibleTokensOwnedBySpender.slice(0, 1);
                        valuesToTransfer = [nonFungibleValueToTransfer];
                        valueMultiplier = valueMultiplierNft;
                        expectedInitialBalances = [
                            // spender
                            nftOwnerBalance,
                            // receiver
                            nftNotOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        expectedFinalBalances = [
                            // spender
                            nftNotOwnerBalance,
                            // receiver
                            nftOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer multiple non-fungible tokens', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = nonFungibleTokensOwnedBySpender.slice(0, 3);
                        valuesToTransfer = [
                            nonFungibleValueToTransfer,
                            nonFungibleValueToTransfer,
                            nonFungibleValueToTransfer,
                        ];
                        valueMultiplier = valueMultiplierNft;
                        expectedInitialBalances = [
                            // spender
                            nftOwnerBalance,
                            nftOwnerBalance,
                            nftOwnerBalance,
                            // receiver
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        expectedFinalBalances = [
                            // spender
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                            // receiver
                            nftOwnerBalance,
                            nftOwnerBalance,
                            nftOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value for a combination of several fungible/non-fungible tokens', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, fungibleTokensToTransfer, nonFungibleTokensToTransfer, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, totalValuesTransferred, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        fungibleTokensToTransfer = fungibleTokens.slice(0, 3);
                        nonFungibleTokensToTransfer = nonFungibleTokensOwnedBySpender.slice(0, 2);
                        tokensToTransfer = fungibleTokensToTransfer.concat(nonFungibleTokensToTransfer);
                        valuesToTransfer = [
                            fungibleValueToTransferLarge,
                            fungibleValueToTransferSmall,
                            fungibleValueToTransferSmall,
                            nonFungibleValueToTransfer,
                            nonFungibleValueToTransfer,
                        ];
                        valueMultiplier = valueMultiplierNft;
                        expectedInitialBalances = [
                            // spender
                            spenderInitialFungibleBalance,
                            spenderInitialFungibleBalance,
                            spenderInitialFungibleBalance,
                            nftOwnerBalance,
                            nftOwnerBalance,
                            // receiver
                            receiverInitialFungibleBalance,
                            receiverInitialFungibleBalance,
                            receiverInitialFungibleBalance,
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedFinalBalances = [
                            // spender
                            expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                            expectedInitialBalances[1].minus(totalValuesTransferred[1]),
                            expectedInitialBalances[2].minus(totalValuesTransferred[2]),
                            expectedInitialBalances[3].minus(totalValuesTransferred[3]),
                            expectedInitialBalances[4].minus(totalValuesTransferred[4]),
                            // receiver
                            expectedInitialBalances[5].plus(totalValuesTransferred[0]),
                            expectedInitialBalances[6].plus(totalValuesTransferred[1]),
                            expectedInitialBalances[7].plus(totalValuesTransferred[2]),
                            expectedInitialBalances[8].plus(totalValuesTransferred[3]),
                            expectedInitialBalances[9].plus(totalValuesTransferred[4]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value to a smart contract and trigger its callback', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, totalValuesTransferred, expectedInitialBalances, txReceipt, receiverLog, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiverContract];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverContractInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        txReceipt = _a.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(totalValuesTransferred[0]);
                        // note - if the `extraData` is ignored then the receiver log should ignore it as well.
                        expect(receiverLog.args.data).to.be.deep.equal(receiverCallbackData);
                        expectedFinalBalances = [
                            expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                            expectedInitialBalances[1].plus(totalValuesTransferred[0]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value to a smart contract and trigger its callback, when callback `data` is NULL', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, totalValuesTransferred, expectedInitialBalances, nullReceiverCallbackData, txReceipt, receiverLog, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiverContract];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverContractInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        nullReceiverCallbackData = '0x';
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, nullReceiverCallbackData, authorized)];
                    case 2:
                        txReceipt = _a.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(totalValuesTransferred[0]);
                        // note - if the `extraData` is ignored then the receiver log should ignore it as well.
                        expect(receiverLog.args.data).to.be.deep.equal(nullReceiverCallbackData);
                        expectedFinalBalances = [
                            expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                            expectedInitialBalances[1].plus(totalValuesTransferred[0]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value to a smart contract and trigger its callback, when callback `data` is one word', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, totalValuesTransferred, expectedInitialBalances, customReceiverCallbackData, customReceiverCallbackDataAsBuffer, oneWordInBytes, txReceipt, receiverLog, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiverContract];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverContractInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        customReceiverCallbackData = '0x0102030405060708091001020304050607080910010203040506070809100102';
                        customReceiverCallbackDataAsBuffer = ethUtil.toBuffer(customReceiverCallbackData);
                        oneWordInBytes = 32;
                        expect(customReceiverCallbackDataAsBuffer.byteLength).to.be.equal(oneWordInBytes);
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, customReceiverCallbackData, authorized)];
                    case 2:
                        txReceipt = _a.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(totalValuesTransferred[0]);
                        // note - if the `extraData` is ignored then the receiver log should ignore it as well.
                        expect(receiverLog.args.data).to.be.deep.equal(customReceiverCallbackData);
                        expectedFinalBalances = [
                            expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                            expectedInitialBalances[1].plus(totalValuesTransferred[0]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value to a smart contract and trigger its callback, when callback `data` is multiple words', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, totalValuesTransferred, expectedInitialBalances, scalar, customReceiverCallbackData, customReceiverCallbackDataAsBuffer, oneWordInBytes, txReceipt, receiverLog, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiverContract];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverContractInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        scalar = 5;
                        customReceiverCallbackData = "0x" + '0102030405060708091001020304050607080910010203040506070809100102'.repeat(scalar);
                        customReceiverCallbackDataAsBuffer = ethUtil.toBuffer(customReceiverCallbackData);
                        oneWordInBytes = 32;
                        expect(customReceiverCallbackDataAsBuffer.byteLength).to.be.equal(oneWordInBytes * scalar);
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, customReceiverCallbackData, authorized)];
                    case 2:
                        txReceipt = _a.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(totalValuesTransferred[0]);
                        // note - if the `extraData` is ignored then the receiver log should ignore it as well.
                        expect(receiverLog.args.data).to.be.deep.equal(customReceiverCallbackData);
                        expectedFinalBalances = [
                            expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                            expectedInitialBalances[1].plus(totalValuesTransferred[0]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value to a smart contract and trigger its callback, when callback `data` is multiple words but not word-aligned', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, totalValuesTransferred, expectedInitialBalances, scalar, customReceiverCallbackData, customReceiverCallbackDataAsBuffer, oneWordInBytes, txReceipt, receiverLog, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiverContract];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverContractInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        scalar = 5;
                        customReceiverCallbackData = "0x" + '0102030405060708091001020304050607080910010203040506070809100102'.repeat(scalar) + "090807";
                        customReceiverCallbackDataAsBuffer = ethUtil.toBuffer(customReceiverCallbackData);
                        oneWordInBytes = 32;
                        expect(customReceiverCallbackDataAsBuffer.byteLength).to.be.greaterThan(oneWordInBytes * scalar);
                        expect(customReceiverCallbackDataAsBuffer.byteLength).to.be.lessThan(oneWordInBytes * (scalar + 1));
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, customReceiverCallbackData, authorized)];
                    case 2:
                        txReceipt = _a.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(totalValuesTransferred[0]);
                        // note - if the `extraData` is ignored then the receiver log should ignore it as well.
                        expect(receiverLog.args.data).to.be.deep.equal(customReceiverCallbackData);
                        expectedFinalBalances = [
                            expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                            expectedInitialBalances[1].plus(totalValuesTransferred[0]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer value and ignore extra assetData', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, totalValuesTransferred, erc1155ContractAddress, assetData, extraData, assetDataWithExtraData, expectedInitialBalances, txReceipt, receiverLog, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiverContract];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        totalValuesTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        extraData = '0102030405060708091001020304050607080910010203040506070809100102';
                        assetDataWithExtraData = "" + assetData + extraData;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverContractInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithExtraData)];
                    case 2:
                        txReceipt = _a.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(1);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(totalValuesTransferred[0]);
                        // note - if the `extraData` is ignored then the receiver log should ignore it as well.
                        expect(receiverLog.args.data).to.be.deep.equal(receiverCallbackData);
                        expectedFinalBalances = [
                            expectedInitialBalances[0].minus(totalValuesTransferred[0]),
                            expectedInitialBalances[1].plus(totalValuesTransferred[0]),
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer if token ids and values are abi encoded to same entry in calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1, _a, tokensToCreate, spenderInitialBalance, receiverInitialBalance, tokenUri, tokensToCreate_1, tokensToCreate_1_1, tokenToCreate, e_1_1, balanceHolders, balanceTokens, initialBalances, expectedInitialBalances, erc1155ContractAddress, tokensToTransfer, valuesToTransfer, valueMultiplier, selector, assetDataWithoutContractAddress, assetData, finalBalances, expectedAmountsTransferred, expectedFinalBalances;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokensToCreate = [new utils_1.BigNumber(1), new utils_1.BigNumber(2), new utils_1.BigNumber(3), new utils_1.BigNumber(4)];
                        spenderInitialBalance = new utils_1.BigNumber(4);
                        receiverInitialBalance = new utils_1.BigNumber(0);
                        tokenUri = '';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 9]);
                        tokensToCreate_1 = __values(tokensToCreate), tokensToCreate_1_1 = tokensToCreate_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!tokensToCreate_1_1.done) return [3 /*break*/, 6];
                        tokenToCreate = tokensToCreate_1_1.value;
                        // create token
                        return [4 /*yield*/, erc1155Wrapper
                                .getContract()
                                .createWithType(tokenToCreate, tokenUri)
                                .awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 3:
                        // create token
                        _b.sent();
                        // mint balance for spender
                        return [4 /*yield*/, erc1155Wrapper
                                .getContract()
                                .mintFungible(tokenToCreate, [spender], [spenderInitialBalance])
                                .awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 4:
                        // mint balance for spender
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        tokensToCreate_1_1 = tokensToCreate_1.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (tokensToCreate_1_1 && !tokensToCreate_1_1.done && (_a = tokensToCreate_1.return)) _a.call(tokensToCreate_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        balanceHolders = [spender, spender, spender, spender, receiver, receiver, receiver, receiver];
                        balanceTokens = tokensToCreate.concat(tokensToCreate);
                        return [4 /*yield*/, erc1155Wrapper.getBalancesAsync(balanceHolders, balanceTokens)];
                    case 10:
                        initialBalances = _b.sent();
                        expectedInitialBalances = [
                            spenderInitialBalance,
                            spenderInitialBalance,
                            spenderInitialBalance,
                            spenderInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                        ];
                        expect(initialBalances).to.be.deep.equal(expectedInitialBalances);
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        tokensToTransfer = [new utils_1.BigNumber(1), new utils_1.BigNumber(2)];
                        valuesToTransfer = tokensToTransfer;
                        valueMultiplier = new utils_1.BigNumber(2);
                        selector = assetDataContract.getSelector('ERC1155Assets');
                        assetDataWithoutContractAddress = '0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040102030400000000000000000000000000000000000000000000000000000000';
                        assetData = selector + "000000000000000000000000" + erc1155ContractAddress.substr(2) + assetDataWithoutContractAddress;
                        ///// Step 4/5 /////
                        // Transfer token IDs [1, 2] and amounts [1, 2] with a multiplier of 2;
                        // the expected trade will be token IDs [1, 2] and amounts [2, 4]
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetData)];
                    case 11:
                        ///// Step 4/5 /////
                        // Transfer token IDs [1, 2] and amounts [1, 2] with a multiplier of 2;
                        // the expected trade will be token IDs [1, 2] and amounts [2, 4]
                        _b.sent();
                        return [4 /*yield*/, erc1155Wrapper.getBalancesAsync(balanceHolders, balanceTokens)];
                    case 12:
                        finalBalances = _b.sent();
                        expectedAmountsTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedFinalBalances = [
                            spenderInitialBalance.minus(expectedAmountsTransferred[0]),
                            spenderInitialBalance.minus(expectedAmountsTransferred[1]),
                            spenderInitialBalance,
                            spenderInitialBalance,
                            receiverInitialBalance.plus(expectedAmountsTransferred[0]),
                            receiverInitialBalance.plus(expectedAmountsTransferred[1]),
                            receiverInitialBalance,
                            receiverInitialBalance,
                        ];
                        expect(finalBalances).to.be.deep.equal(expectedFinalBalances);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer if token values and data are abi encoded to same entry in calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var e_2, _a, tokensToCreate, spenderInitialBalance, receiverInitialBalance, tokenUri, tokensToCreate_2, tokensToCreate_2_1, tokenToCreate, e_2_1, balanceHolders, balanceTokens, initialBalances, expectedInitialBalances, erc1155ContractAddress, tokensToTransfer, valuesToTransfer, valueMultiplier, generatedAssetData, offsetToTokenIds, assetDataSelectorAndContractAddress, assetDataParameters, assetData, txReceipt, receiverLog, finalBalances, expectedAmountsTransferred, expectedFinalBalances;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokensToCreate = [new utils_1.BigNumber(1), new utils_1.BigNumber(2), new utils_1.BigNumber(3), new utils_1.BigNumber(4)];
                        spenderInitialBalance = new utils_1.BigNumber(4);
                        receiverInitialBalance = new utils_1.BigNumber(0);
                        tokenUri = '';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 9]);
                        tokensToCreate_2 = __values(tokensToCreate), tokensToCreate_2_1 = tokensToCreate_2.next();
                        _b.label = 2;
                    case 2:
                        if (!!tokensToCreate_2_1.done) return [3 /*break*/, 6];
                        tokenToCreate = tokensToCreate_2_1.value;
                        // create token
                        return [4 /*yield*/, erc1155Wrapper
                                .getContract()
                                .createWithType(tokenToCreate, tokenUri)
                                .awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 3:
                        // create token
                        _b.sent();
                        // mint balance for spender
                        return [4 /*yield*/, erc1155Wrapper
                                .getContract()
                                .mintFungible(tokenToCreate, [spender], [spenderInitialBalance])
                                .awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 4:
                        // mint balance for spender
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        tokensToCreate_2_1 = tokensToCreate_2.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (tokensToCreate_2_1 && !tokensToCreate_2_1.done && (_a = tokensToCreate_2.return)) _a.call(tokensToCreate_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        balanceHolders = [
                            spender,
                            spender,
                            spender,
                            spender,
                            receiverContract,
                            receiverContract,
                            receiverContract,
                            receiverContract,
                        ];
                        balanceTokens = tokensToCreate.concat(tokensToCreate);
                        return [4 /*yield*/, erc1155Wrapper.getBalancesAsync(balanceHolders, balanceTokens)];
                    case 10:
                        initialBalances = _b.sent();
                        expectedInitialBalances = [
                            spenderInitialBalance,
                            spenderInitialBalance,
                            spenderInitialBalance,
                            spenderInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                        ];
                        expect(initialBalances).to.be.deep.equal(expectedInitialBalances);
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        tokensToTransfer = [new utils_1.BigNumber(1), new utils_1.BigNumber(2)];
                        valuesToTransfer = [new utils_1.BigNumber(2), new utils_1.BigNumber(2)];
                        valueMultiplier = new utils_1.BigNumber(2);
                        generatedAssetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        offsetToTokenIds = 74;
                        assetDataSelectorAndContractAddress = generatedAssetData.substr(0, offsetToTokenIds);
                        assetDataParameters = '000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002';
                        assetData = "" + assetDataSelectorAndContractAddress + assetDataParameters;
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetData)];
                    case 11:
                        txReceipt = _b.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(2);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenIds[1]).to.be.bignumber.equal(tokensToTransfer[1]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(2);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(valuesToTransfer[0].times(valueMultiplier));
                        expect(receiverLog.args.tokenValues[1]).to.be.bignumber.equal(valuesToTransfer[1].times(valueMultiplier));
                        expect(receiverLog.args.data).to.be.deep.equal('0x0000');
                        return [4 /*yield*/, erc1155Wrapper.getBalancesAsync(balanceHolders, balanceTokens)];
                    case 12:
                        finalBalances = _b.sent();
                        expectedAmountsTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedFinalBalances = [
                            spenderInitialBalance.minus(expectedAmountsTransferred[0]),
                            spenderInitialBalance.minus(expectedAmountsTransferred[1]),
                            spenderInitialBalance,
                            spenderInitialBalance,
                            receiverInitialBalance.plus(expectedAmountsTransferred[0]),
                            receiverInitialBalance.plus(expectedAmountsTransferred[1]),
                            receiverInitialBalance,
                            receiverInitialBalance,
                        ];
                        expect(finalBalances).to.be.deep.equal(expectedFinalBalances);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should successfully transfer if token ids, values and data are abi encoded to same entry in calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var e_3, _a, tokensToCreate, spenderInitialBalance, receiverInitialBalance, tokenUri, tokensToCreate_3, tokensToCreate_3_1, tokenToCreate, e_3_1, balanceHolders, balanceTokens, initialBalances, expectedInitialBalances, erc1155ContractAddress, tokensToTransfer, valuesToTransfer, valueMultiplier, generatedAssetData, offsetToTokenIds, assetDataSelectorAndContractAddress, assetDataParameters, assetData, txReceipt, receiverLog, finalBalances, expectedAmountsTransferred, expectedFinalBalances;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokensToCreate = [new utils_1.BigNumber(1), new utils_1.BigNumber(2), new utils_1.BigNumber(3), new utils_1.BigNumber(4)];
                        spenderInitialBalance = new utils_1.BigNumber(4);
                        receiverInitialBalance = new utils_1.BigNumber(0);
                        tokenUri = '';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 9]);
                        tokensToCreate_3 = __values(tokensToCreate), tokensToCreate_3_1 = tokensToCreate_3.next();
                        _b.label = 2;
                    case 2:
                        if (!!tokensToCreate_3_1.done) return [3 /*break*/, 6];
                        tokenToCreate = tokensToCreate_3_1.value;
                        // create token
                        return [4 /*yield*/, erc1155Wrapper
                                .getContract()
                                .createWithType(tokenToCreate, tokenUri)
                                .awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 3:
                        // create token
                        _b.sent();
                        // mint balance for spender
                        return [4 /*yield*/, erc1155Wrapper
                                .getContract()
                                .mintFungible(tokenToCreate, [spender], [spenderInitialBalance])
                                .awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 4:
                        // mint balance for spender
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        tokensToCreate_3_1 = tokensToCreate_3.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (tokensToCreate_3_1 && !tokensToCreate_3_1.done && (_a = tokensToCreate_3.return)) _a.call(tokensToCreate_3);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        balanceHolders = [
                            spender,
                            spender,
                            spender,
                            spender,
                            receiverContract,
                            receiverContract,
                            receiverContract,
                            receiverContract,
                        ];
                        balanceTokens = tokensToCreate.concat(tokensToCreate);
                        return [4 /*yield*/, erc1155Wrapper.getBalancesAsync(balanceHolders, balanceTokens)];
                    case 10:
                        initialBalances = _b.sent();
                        expectedInitialBalances = [
                            spenderInitialBalance,
                            spenderInitialBalance,
                            spenderInitialBalance,
                            spenderInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                            receiverInitialBalance,
                        ];
                        expect(initialBalances).to.be.deep.equal(expectedInitialBalances);
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        tokensToTransfer = [new utils_1.BigNumber(1), new utils_1.BigNumber(2)];
                        valuesToTransfer = [new utils_1.BigNumber(1), new utils_1.BigNumber(2)];
                        valueMultiplier = new utils_1.BigNumber(2);
                        generatedAssetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        offsetToTokenIds = 74;
                        assetDataSelectorAndContractAddress = generatedAssetData.substr(0, offsetToTokenIds);
                        assetDataParameters = '000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002';
                        assetData = "" + assetDataSelectorAndContractAddress + assetDataParameters;
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetData)];
                    case 11:
                        txReceipt = _b.sent();
                        // check receiver log ignored extra asset data
                        expect(txReceipt.logs.length).to.be.equal(2);
                        receiverLog = txReceipt.logs[1];
                        expect(receiverLog.args.operator).to.be.equal(erc1155Proxy.address);
                        expect(receiverLog.args.from).to.be.equal(spender);
                        expect(receiverLog.args.tokenIds.length).to.be.deep.equal(2);
                        expect(receiverLog.args.tokenIds[0]).to.be.bignumber.equal(tokensToTransfer[0]);
                        expect(receiverLog.args.tokenIds[1]).to.be.bignumber.equal(tokensToTransfer[1]);
                        expect(receiverLog.args.tokenValues.length).to.be.deep.equal(2);
                        expect(receiverLog.args.tokenValues[0]).to.be.bignumber.equal(valuesToTransfer[0].times(valueMultiplier));
                        expect(receiverLog.args.tokenValues[1]).to.be.bignumber.equal(valuesToTransfer[1].times(valueMultiplier));
                        expect(receiverLog.args.data).to.be.deep.equal('0x0000');
                        return [4 /*yield*/, erc1155Wrapper.getBalancesAsync(balanceHolders, balanceTokens)];
                    case 12:
                        finalBalances = _b.sent();
                        expectedAmountsTransferred = _.map(valuesToTransfer, function (value) {
                            return value.times(valueMultiplier);
                        });
                        expectedFinalBalances = [
                            spenderInitialBalance.minus(expectedAmountsTransferred[0]),
                            spenderInitialBalance.minus(expectedAmountsTransferred[1]),
                            spenderInitialBalance,
                            spenderInitialBalance,
                            receiverInitialBalance.plus(expectedAmountsTransferred[0]),
                            receiverInitialBalance.plus(expectedAmountsTransferred[1]),
                            receiverInitialBalance,
                            receiverInitialBalance,
                        ];
                        expect(finalBalances).to.be.deep.equal(expectedFinalBalances);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if token ids resolves to outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenIds, badEncodedOffsetToTokenIds, assetDataWithBadTokenIdsOffset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000080';
                        badEncodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000180';
                        assetDataWithBadTokenIdsOffset = assetData.replace(encodedOffsetToTokenIds, badEncodedOffsetToTokenIds);
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithBadTokenIdsOffset))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if an element of token ids lies to outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenIds, newEcodedOffsetToTokenIds, assetDataWithNewTokenIdsOffset, encodedTokenIdsLength, encodedTokenIdValues, assetDataWithBadTokenIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000080';
                        newEcodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000140';
                        assetDataWithNewTokenIdsOffset = assetData.replace(encodedOffsetToTokenIds, newEcodedOffsetToTokenIds);
                        encodedTokenIdsLength = '0000000000000000000000000000000000000000000000000000000000000002';
                        encodedTokenIdValues = '0000000000000000000000000000000000000000000000000000000000000001';
                        assetDataWithBadTokenIds = "" + assetDataWithNewTokenIdsOffset + encodedTokenIdsLength + encodedTokenIdValues;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithBadTokenIds))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert token ids length overflows', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenIds, badEncodedOffsetToTokenIds, assetDataWithBadTokenIdsOffset, encodedIdsLengthOverflow, buffer, assetDataWithOverflow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000080';
                        badEncodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000140';
                        assetDataWithBadTokenIdsOffset = assetData.replace(encodedOffsetToTokenIds, badEncodedOffsetToTokenIds);
                        encodedIdsLengthOverflow = '0800000000000000000000000000000000000000000000000000000000000001';
                        buffer = '0'.repeat(64 * 10);
                        assetDataWithOverflow = "" + assetDataWithBadTokenIdsOffset + encodedIdsLengthOverflow + buffer;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithOverflow))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert token values length overflows', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenIds, badEncodedOffsetToTokenIds, assetDataWithBadTokenIdsOffset, encodedIdsLengthOverflow, buffer, assetDataWithOverflow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenIds = '00000000000000000000000000000000000000000000000000000000000000c0';
                        badEncodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000140';
                        assetDataWithBadTokenIdsOffset = assetData.replace(encodedOffsetToTokenIds, badEncodedOffsetToTokenIds);
                        encodedIdsLengthOverflow = '0800000000000000000000000000000000000000000000000000000000000001';
                        buffer = '0'.repeat(64 * 10);
                        assetDataWithOverflow = "" + assetDataWithBadTokenIdsOffset + encodedIdsLengthOverflow + buffer;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithOverflow))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert token data length overflows', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenIds, badEncodedOffsetToTokenIds, assetDataWithBadTokenIdsOffset, encodedIdsLengthOverflow, buffer, assetDataWithOverflow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000100';
                        badEncodedOffsetToTokenIds = '0000000000000000000000000000000000000000000000000000000000000140';
                        assetDataWithBadTokenIdsOffset = assetData.replace(encodedOffsetToTokenIds, badEncodedOffsetToTokenIds);
                        encodedIdsLengthOverflow = '0800000000000000000000000000000000000000000000000000000000000001';
                        buffer = '0'.repeat(64 * 10);
                        assetDataWithOverflow = "" + assetDataWithBadTokenIdsOffset + encodedIdsLengthOverflow + buffer;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithOverflow))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if token values resolves to outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenValues, badEncodedOffsetToTokenValues, assetDataWithBadTokenIdsOffset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenValues = '00000000000000000000000000000000000000000000000000000000000000c0';
                        badEncodedOffsetToTokenValues = '00000000000000000000000000000000000000000000000000000000000001c0';
                        assetDataWithBadTokenIdsOffset = assetData.replace(encodedOffsetToTokenValues, badEncodedOffsetToTokenValues);
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithBadTokenIdsOffset))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if an element of token values lies to outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenValues, newEcodedOffsetToTokenValues, assetDataWithNewTokenValuesOffset, encodedTokenValuesLength, encodedTokenValuesElements, assetDataWithBadTokenIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenValues = '00000000000000000000000000000000000000000000000000000000000000c0';
                        newEcodedOffsetToTokenValues = '0000000000000000000000000000000000000000000000000000000000000140';
                        assetDataWithNewTokenValuesOffset = assetData.replace(encodedOffsetToTokenValues, newEcodedOffsetToTokenValues);
                        encodedTokenValuesLength = '0000000000000000000000000000000000000000000000000000000000000002';
                        encodedTokenValuesElements = '0000000000000000000000000000000000000000000000000000000000000001';
                        assetDataWithBadTokenIds = "" + assetDataWithNewTokenValuesOffset + encodedTokenValuesLength + encodedTokenValuesElements;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithBadTokenIds))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if token data resolves to outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenData, badEncodedOffsetToTokenData, assetDataWithBadTokenDataOffset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenData = '0000000000000000000000000000000000000000000000000000000000000100';
                        badEncodedOffsetToTokenData = '00000000000000000000000000000000000000000000000000000000000001c0';
                        assetDataWithBadTokenDataOffset = assetData.replace(encodedOffsetToTokenData, badEncodedOffsetToTokenData);
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithBadTokenDataOffset))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if an element of token data lies to outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, encodedOffsetToTokenData, newEcodedOffsetToTokenData, assetDataWithNewTokenDataOffset, encodedTokenDataLength, encodedTokenDataElements, assetDataWithBadTokenData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        encodedOffsetToTokenData = '0000000000000000000000000000000000000000000000000000000000000100';
                        newEcodedOffsetToTokenData = '0000000000000000000000000000000000000000000000000000000000000140';
                        assetDataWithNewTokenDataOffset = assetData.replace(encodedOffsetToTokenData, newEcodedOffsetToTokenData);
                        encodedTokenDataLength = '0000000000000000000000000000000000000000000000000000000000000021';
                        encodedTokenDataElements = '0000000000000000000000000000000000000000000000000000000000000001';
                        assetDataWithBadTokenData = "" + assetDataWithNewTokenDataOffset + encodedTokenDataLength + encodedTokenDataElements;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetDataWithBadTokenData))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if asset data lies outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, txData, offsetToAssetData, invalidOffsetToAssetData, badTxData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, erc1155ProxyWrapper.getTransferFromAbiEncodedTxDataAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetData)];
                    case 1:
                        txData = _a.sent();
                        offsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000080';
                        invalidOffsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000180';
                        badTxData = txData.replace(offsetToAssetData, invalidOffsetToAssetData);
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromRawAsync(badTxData, authorized))];
                    case 2:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if asset data lies outside the bounds of calldata', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, erc1155ContractAddress, assetData, txData, offsetToAssetData, invalidOffsetToAssetData, newAssetData, badTxData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        erc1155ContractAddress = erc1155Wrapper.getContract().address;
                        assetData = assetDataContract
                            .ERC1155Assets(erc1155ContractAddress, tokensToTransfer, valuesToTransfer, receiverCallbackData)
                            .getABIEncodedTransactionData();
                        return [4 /*yield*/, erc1155ProxyWrapper.getTransferFromAbiEncodedTxDataAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetData)];
                    case 1:
                        txData = _a.sent();
                        offsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000080';
                        invalidOffsetToAssetData = '0000000000000000000000000000000000000000000000000000000000000200';
                        newAssetData = '0000000000000000000000000000000000000000000000000000000000000304';
                        badTxData = "" + txData.replace(offsetToAssetData, invalidOffsetToAssetData) + newAssetData;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromRawAsync(badTxData, authorized))];
                    case 2:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if length of assetData is less than 132 bytes', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokensToTransfer, valuesToTransfer, valueMultiplier, zeros96Bytes, assetData131Bytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        zeros96Bytes = '0'.repeat(188);
                        assetData131Bytes = "" + types_1.AssetProxyId.ERC1155 + zeros96Bytes;
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedWithoutReasonAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized, assetData131Bytes))];
                    case 1:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should transfer nothing if value is zero', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [new utils_1.BigNumber(0)];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        expectedFinalBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should transfer nothing if value multiplier is zero', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = new utils_1.BigNumber(0);
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        expectedFinalBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should transfer nothing if there are no tokens in asset data', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances, expectedFinalBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = [];
                        valuesToTransfer = [];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        expectedFinalBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedFinalBalances)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should propagate revert reason from erc1155 contract failure', function () { return __awaiter(_this, void 0, void 0, function () {
            var shouldRejectTransfer, tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shouldRejectTransfer = true;
                        return [4 /*yield*/, erc1155Receiver.setRejectTransferFlag(shouldRejectTransfer).awaitTransactionSuccessAsync({
                                from: owner,
                            })];
                    case 1:
                        _a.sent();
                        tokenHolders = [spender, receiverContract];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverContractInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 2:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiverContract, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized), types_1.RevertReason.TransferRejected)];
                    case 3:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if transferring the same non-fungible token more than once', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, nftToTransfer, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        nftToTransfer = nonFungibleTokensOwnedBySpender[0];
                        tokensToTransfer = [nftToTransfer, nftToTransfer];
                        valuesToTransfer = [nonFungibleValueToTransfer, nonFungibleValueToTransfer];
                        valueMultiplier = valueMultiplierNft;
                        expectedInitialBalances = [
                            // spender
                            nftOwnerBalance,
                            nftOwnerBalance,
                            // receiver
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized), types_1.RevertReason.NFTNotOwnedByFromAddress)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if there is a multiplication overflow', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, maxUintValue, valuesToTransfer, valueMultiplier, expectedInitialBalances, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = nonFungibleTokensOwnedBySpender.slice(0, 3);
                        maxUintValue = new utils_1.BigNumber(2).pow(256).minus(1);
                        valuesToTransfer = [nonFungibleValueToTransfer, maxUintValue, nonFungibleValueToTransfer];
                        valueMultiplier = new utils_1.BigNumber(2);
                        expectedInitialBalances = [
                            // spender
                            nftOwnerBalance,
                            nftOwnerBalance,
                            nftOwnerBalance,
                            // receiver
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                            nftNotOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        expectedError = new contracts_utils_1.SafeMathRevertErrors.Uint256BinOpError(contracts_utils_1.SafeMathRevertErrors.BinOpErrorCodes.MultiplicationOverflow, maxUintValue, valueMultiplier);
                        // execute transfer
                        // note - this will overflow because we are trying to transfer `maxUintValue * 2` of the 2nd token
                        return [4 /*yield*/, expect(erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized)).to.revertWith(expectedError)];
                    case 2:
                        // execute transfer
                        // note - this will overflow because we are trying to transfer `maxUintValue * 2` of the 2nd token
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if transferring > 1 instances of a non-fungible token (valueMultiplier field >1)', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = nonFungibleTokensOwnedBySpender.slice(0, 1);
                        valuesToTransfer = [nonFungibleValueToTransfer];
                        valueMultiplier = new utils_1.BigNumber(2);
                        expectedInitialBalances = [
                            // spender
                            nftOwnerBalance,
                            // receiver
                            nftNotOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized), types_1.RevertReason.AmountEqualToOneRequired)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if transferring > 1 instances of a non-fungible token (`valuesToTransfer` field >1)', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = nonFungibleTokensOwnedBySpender.slice(0, 1);
                        valuesToTransfer = [new utils_1.BigNumber(2)];
                        valueMultiplier = valueMultiplierNft;
                        expectedInitialBalances = [
                            // spender
                            nftOwnerBalance,
                            // receiver
                            nftNotOwnerBalance,
                        ];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized), types_1.RevertReason.AmountEqualToOneRequired)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if sender balance is insufficient', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valueGreaterThanSpenderBalance, valuesToTransfer, valueMultiplier, expectedInitialBalances, expectedError, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valueGreaterThanSpenderBalance = spenderInitialFungibleBalance.plus(1);
                        valuesToTransfer = [valueGreaterThanSpenderBalance];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        expectedError = new contracts_utils_1.SafeMathRevertErrors.Uint256BinOpError(contracts_utils_1.SafeMathRevertErrors.BinOpErrorCodes.SubtractionUnderflow, spenderInitialFungibleBalance, valuesToTransfer[0].times(valueMultiplier));
                        tx = erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized);
                        return [2 /*return*/, expect(tx).to.revertWith(expectedError)];
                }
            });
        }); });
        it('should revert if sender allowance is insufficient', function () { return __awaiter(_this, void 0, void 0, function () {
            var wrapper, isApproved, isApprovedActualValue, tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper = erc1155ProxyWrapper.getContractWrapper(erc1155Contract.address);
                        isApproved = false;
                        return [4 /*yield*/, wrapper.setApprovalForAllAsync(spender, erc1155Proxy.address, isApproved)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, wrapper.isApprovedForAllAsync(spender, erc1155Proxy.address)];
                    case 2:
                        isApprovedActualValue = _a.sent();
                        expect(isApprovedActualValue).to.be.equal(isApproved);
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 3:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, authorized), types_1.RevertReason.InsufficientAllowance)];
                    case 4:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should revert if caller is not authorized', function () { return __awaiter(_this, void 0, void 0, function () {
            var tokenHolders, tokensToTransfer, valuesToTransfer, valueMultiplier, expectedInitialBalances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenHolders = [spender, receiver];
                        tokensToTransfer = fungibleTokens.slice(0, 1);
                        valuesToTransfer = [fungibleValueToTransferLarge];
                        valueMultiplier = valueMultiplierSmall;
                        expectedInitialBalances = [spenderInitialFungibleBalance, receiverInitialFungibleBalance];
                        return [4 /*yield*/, erc1155Wrapper.assertBalancesAsync(tokenHolders, tokensToTransfer, expectedInitialBalances)];
                    case 1:
                        _a.sent();
                        // execute transfer
                        return [4 /*yield*/, contracts_test_utils_1.expectTransactionFailedAsync(erc1155ProxyWrapper.transferFromAsync(spender, receiver, erc1155Contract.address, tokensToTransfer, valuesToTransfer, valueMultiplier, receiverCallbackData, notAuthorized), types_1.RevertReason.SenderNotAuthorized)];
                    case 2:
                        // execute transfer
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// tslint:enable:no-unnecessary-type-assertion
// tslint:disable:max-file-line-count
//# sourceMappingURL=erc1155_proxy.js.map