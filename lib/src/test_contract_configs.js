#!/usr/bin/env node
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
var contracts_asset_proxy_1 = require("@0x/contracts-asset-proxy");
var contracts_exchange_1 = require("@0x/contracts-exchange");
var contracts_multisig_1 = require("@0x/contracts-multisig");
var contracts_staking_1 = require("@0x/contracts-staking");
var subproviders_1 = require("@0x/subproviders");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var configs_by_chain_1 = require("./utils/configs_by_chain");
var timelocks_1 = require("./utils/timelocks");
// NOTE: add your own Infura Project ID to RPC urls before running
var INFURA_PROJECT_ID = '';
var networkIdToRpcUrl = {
    1: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
    3: "https://ropsten.infura.io/v3/" + INFURA_PROJECT_ID,
    4: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
    42: "https://kovan.infura.io/v3/" + INFURA_PROJECT_ID,
};
// tslint:disable:custom-no-magic-numbers
function testContractConfigsAsync(provider) {
    return __awaiter(this, void 0, void 0, function () {
        function warnIfMismatch(actual, expected, message) {
            if (actual !== expected) {
                utils_1.logUtils.warn(message + ": actual: " + actual + ", expected: " + expected + ", chainId: " + chainId);
            }
        }
        function verifyExchangeV2ConfigsAsync() {
            return __awaiter(this, void 0, void 0, function () {
                var exchangeOwner, registeredERC20Proxy, registeredERC721Proxy, registeredERC1155Proxy, registeredMultiAssetProxy, registeredStaticCallProxy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, exchangeV2.owner().callAsync()];
                        case 1:
                            exchangeOwner = _a.sent();
                            warnIfMismatch(exchangeOwner, governor.address, 'Unexpected ExchangeV2 owner');
                            return [4 /*yield*/, exchangeV2.getAssetProxy(types_1.AssetProxyId.ERC20).callAsync()];
                        case 2:
                            registeredERC20Proxy = _a.sent();
                            warnIfMismatch(registeredERC20Proxy, erc20Proxy.address, 'Unexpected ERC20Proxy registered in ExchangeV2');
                            return [4 /*yield*/, exchangeV2.getAssetProxy(types_1.AssetProxyId.ERC721).callAsync()];
                        case 3:
                            registeredERC721Proxy = _a.sent();
                            warnIfMismatch(registeredERC721Proxy, erc721Proxy.address, 'Unexpected ERC721Proxy registered in ExchangeV2');
                            return [4 /*yield*/, exchangeV2.getAssetProxy(types_1.AssetProxyId.ERC1155).callAsync()];
                        case 4:
                            registeredERC1155Proxy = _a.sent();
                            warnIfMismatch(registeredERC1155Proxy, erc1155Proxy.address, 'Unexpected ERC1155Proxy registered in ExchangeV2');
                            return [4 /*yield*/, exchangeV2.getAssetProxy(types_1.AssetProxyId.MultiAsset).callAsync()];
                        case 5:
                            registeredMultiAssetProxy = _a.sent();
                            warnIfMismatch(registeredMultiAssetProxy, multiAssetProxy.address, 'Unexpected MultiAssetProxy registered in ExchangeV2');
                            return [4 /*yield*/, exchangeV2.getAssetProxy(types_1.AssetProxyId.StaticCall).callAsync()];
                        case 6:
                            registeredStaticCallProxy = _a.sent();
                            warnIfMismatch(registeredStaticCallProxy, addresses.staticCallProxy, 'Unexpected StaticCallProxy registered in ExchangeV2');
                            return [2 /*return*/];
                    }
                });
            });
        }
        function verifyExchangeV3ConfigsAsync() {
            return __awaiter(this, void 0, void 0, function () {
                var exchangeOwner, registeredERC20Proxy, registeredERC721Proxy, registeredERC1155Proxy, registeredMultiAssetProxy, registeredStaticCallProxy, registeredERC20BridgeProxy, protocolFeeCollector, protocolFeeMultiplier;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, exchange.owner().callAsync()];
                        case 1:
                            exchangeOwner = _a.sent();
                            warnIfMismatch(exchangeOwner, governor.address, 'Unexpected Exchange owner');
                            return [4 /*yield*/, exchange.getAssetProxy(types_1.AssetProxyId.ERC20).callAsync()];
                        case 2:
                            registeredERC20Proxy = _a.sent();
                            warnIfMismatch(registeredERC20Proxy, erc20Proxy.address, 'Unexpected ERC20Proxy registered in Exchange');
                            return [4 /*yield*/, exchange.getAssetProxy(types_1.AssetProxyId.ERC721).callAsync()];
                        case 3:
                            registeredERC721Proxy = _a.sent();
                            warnIfMismatch(registeredERC721Proxy, erc721Proxy.address, 'Unexpected ERC721Proxy registered in Exchange');
                            return [4 /*yield*/, exchange.getAssetProxy(types_1.AssetProxyId.ERC1155).callAsync()];
                        case 4:
                            registeredERC1155Proxy = _a.sent();
                            warnIfMismatch(registeredERC1155Proxy, erc1155Proxy.address, 'Unexpected ERC1155Proxy registered in Exchange');
                            return [4 /*yield*/, exchange.getAssetProxy(types_1.AssetProxyId.MultiAsset).callAsync()];
                        case 5:
                            registeredMultiAssetProxy = _a.sent();
                            warnIfMismatch(registeredMultiAssetProxy, multiAssetProxy.address, 'Unexpected MultiAssetProxy registered in Exchange');
                            return [4 /*yield*/, exchange.getAssetProxy(types_1.AssetProxyId.StaticCall).callAsync()];
                        case 6:
                            registeredStaticCallProxy = _a.sent();
                            warnIfMismatch(registeredStaticCallProxy, addresses.staticCallProxy, 'Unexpected StaticCallProxy registered in Exchange');
                            return [4 /*yield*/, exchange.getAssetProxy(types_1.AssetProxyId.ERC20Bridge).callAsync()];
                        case 7:
                            registeredERC20BridgeProxy = _a.sent();
                            warnIfMismatch(registeredERC20BridgeProxy, addresses.erc20BridgeProxy, 'Unexpected ERC20BridgeProxy registered in Exchange');
                            return [4 /*yield*/, exchange.protocolFeeCollector().callAsync()];
                        case 8:
                            protocolFeeCollector = _a.sent();
                            warnIfMismatch(protocolFeeCollector, addresses.stakingProxy, 'Unexpected StakingProxy attached to Exchange');
                            return [4 /*yield*/, exchange.protocolFeeMultiplier().callAsync()];
                        case 9:
                            protocolFeeMultiplier = _a.sent();
                            warnIfMismatch(protocolFeeMultiplier.toString(), '150000', 'Unexpected protocolFeeMultiplier in Exchange');
                            return [2 /*return*/];
                    }
                });
            });
        }
        function verifyAssetProxyConfigsAsync() {
            return __awaiter(this, void 0, void 0, function () {
                var erc20ProxyOwner, erc20AuthorizedAddresses, isExchangeV2AuthorizedInERC20Proxy, isExchangeAuthorizedInERC20Proxy, isMAPAuthorizedInER20Proxy, isZrxVaultAuthorizedInER20Proxy, erc721ProxyOwner, erc721AuthorizedAddresses, isExchangeV2AuthorizedInERC721Proxy, isExchangeAuthorizedInERC721Proxy, isMAPAuthorizedInER721Proxy, erc1155ProxyOwner, erc1155AuthorizedAddresses, isExchangeV2AuthorizedInERC1155Proxy, isExchangeAuthorizedInERC1155Proxy, isMAPAuthorizedInERC1155Proxy, erc20BridgeProxyOwner, erc20BridgeAuthorizedAddresses, isExchangeAuthorizedInERC20BridgeProxy, isMAPAuthorizedInERC20BridgeProxy, multiAssetProxyOwner, multiAssetProxyAuthorizedAddresses, isExchangeV2AuthorizedInMultiAssetProxy, isExchangeAuthorizedInMultiAssetProxy, registeredERC20ProxyInMAP, registeredERC721ProxyInMAP, registeredERC1155ProxyInMAP, registeredStaticCallProxyInMAP, registeredERC20BridgeProxyInMAP;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, erc20Proxy.owner().callAsync()];
                        case 1:
                            erc20ProxyOwner = _a.sent();
                            warnIfMismatch(erc20ProxyOwner, governor.address, 'Unexpected ERC20Proxy owner');
                            return [4 /*yield*/, erc20Proxy.getAuthorizedAddresses().callAsync()];
                        case 2:
                            erc20AuthorizedAddresses = _a.sent();
                            warnIfMismatch(erc20AuthorizedAddresses.length, 4, 'Unexpected number of authorized addresses in ERC20Proxy');
                            return [4 /*yield*/, erc20Proxy.authorized(exchangeV2.address).callAsync()];
                        case 3:
                            isExchangeV2AuthorizedInERC20Proxy = _a.sent();
                            warnIfMismatch(isExchangeV2AuthorizedInERC20Proxy, true, 'ExchangeV2 not authorized in ERC20Proxy');
                            return [4 /*yield*/, erc20Proxy.authorized(exchange.address).callAsync()];
                        case 4:
                            isExchangeAuthorizedInERC20Proxy = _a.sent();
                            warnIfMismatch(isExchangeAuthorizedInERC20Proxy, true, 'Exchange not authorized in ERC20Proxy');
                            return [4 /*yield*/, erc20Proxy.authorized(multiAssetProxy.address).callAsync()];
                        case 5:
                            isMAPAuthorizedInER20Proxy = _a.sent();
                            warnIfMismatch(isMAPAuthorizedInER20Proxy, true, 'MultiAssetProxy not authorized in ERC20Proxy');
                            return [4 /*yield*/, erc20Proxy.authorized(zrxVault.address).callAsync()];
                        case 6:
                            isZrxVaultAuthorizedInER20Proxy = _a.sent();
                            warnIfMismatch(isZrxVaultAuthorizedInER20Proxy, true, 'ZrxVault not authorized in ERC20Proxy');
                            return [4 /*yield*/, erc721Proxy.owner().callAsync()];
                        case 7:
                            erc721ProxyOwner = _a.sent();
                            warnIfMismatch(erc721ProxyOwner, governor.address, 'Unexpected ERC721Proxy owner');
                            return [4 /*yield*/, erc721Proxy.getAuthorizedAddresses().callAsync()];
                        case 8:
                            erc721AuthorizedAddresses = _a.sent();
                            warnIfMismatch(erc721AuthorizedAddresses.length, 3, 'Unexpected number of authorized addresses in ERC721Proxy');
                            return [4 /*yield*/, erc721Proxy.authorized(exchangeV2.address).callAsync()];
                        case 9:
                            isExchangeV2AuthorizedInERC721Proxy = _a.sent();
                            warnIfMismatch(isExchangeV2AuthorizedInERC721Proxy, true, 'ExchangeV2 not authorized in ERC721Proxy');
                            return [4 /*yield*/, erc721Proxy.authorized(exchange.address).callAsync()];
                        case 10:
                            isExchangeAuthorizedInERC721Proxy = _a.sent();
                            warnIfMismatch(isExchangeAuthorizedInERC721Proxy, true, 'Exchange not authorized in ERC721Proxy');
                            return [4 /*yield*/, erc721Proxy.authorized(multiAssetProxy.address).callAsync()];
                        case 11:
                            isMAPAuthorizedInER721Proxy = _a.sent();
                            warnIfMismatch(isMAPAuthorizedInER721Proxy, true, 'MultiAssetProxy not authorized in ERC721Proxy');
                            return [4 /*yield*/, erc1155Proxy.owner().callAsync()];
                        case 12:
                            erc1155ProxyOwner = _a.sent();
                            warnIfMismatch(erc1155ProxyOwner, governor.address, 'Unexpected ERC1155Proxy owner');
                            return [4 /*yield*/, erc1155Proxy.getAuthorizedAddresses().callAsync()];
                        case 13:
                            erc1155AuthorizedAddresses = _a.sent();
                            warnIfMismatch(erc1155AuthorizedAddresses.length, 3, 'Unexpected number of authorized addresses in ERC1155Proxy');
                            return [4 /*yield*/, erc1155Proxy.authorized(exchangeV2.address).callAsync()];
                        case 14:
                            isExchangeV2AuthorizedInERC1155Proxy = _a.sent();
                            warnIfMismatch(isExchangeV2AuthorizedInERC1155Proxy, true, 'ExchangeV2 not authorized in ERC1155Proxy');
                            return [4 /*yield*/, erc1155Proxy.authorized(exchange.address).callAsync()];
                        case 15:
                            isExchangeAuthorizedInERC1155Proxy = _a.sent();
                            warnIfMismatch(isExchangeAuthorizedInERC1155Proxy, true, 'Exchange not authorized in ERC1155Proxy');
                            return [4 /*yield*/, erc1155Proxy.authorized(multiAssetProxy.address).callAsync()];
                        case 16:
                            isMAPAuthorizedInERC1155Proxy = _a.sent();
                            warnIfMismatch(isMAPAuthorizedInERC1155Proxy, true, 'MultiAssetProxy not authorized in ERC1155Proxy');
                            return [4 /*yield*/, erc20BridgeProxy.owner().callAsync()];
                        case 17:
                            erc20BridgeProxyOwner = _a.sent();
                            warnIfMismatch(erc20BridgeProxyOwner, governor.address, 'Unexpected ERC20BridgeProxy owner');
                            return [4 /*yield*/, erc20BridgeProxy.getAuthorizedAddresses().callAsync()];
                        case 18:
                            erc20BridgeAuthorizedAddresses = _a.sent();
                            warnIfMismatch(erc20BridgeAuthorizedAddresses.length, 2, 'Unexpected number of authorized addresses in ERC20BridgeProxy');
                            return [4 /*yield*/, erc20BridgeProxy.authorized(exchange.address).callAsync()];
                        case 19:
                            isExchangeAuthorizedInERC20BridgeProxy = _a.sent();
                            warnIfMismatch(isExchangeAuthorizedInERC20BridgeProxy, true, 'Exchange not authorized in ERC20BridgeProxy');
                            return [4 /*yield*/, erc20BridgeProxy
                                    .authorized(multiAssetProxy.address)
                                    .callAsync()];
                        case 20:
                            isMAPAuthorizedInERC20BridgeProxy = _a.sent();
                            warnIfMismatch(isMAPAuthorizedInERC20BridgeProxy, true, 'MultiAssetProxy not authorized in ERC20BridgeProxy');
                            return [4 /*yield*/, multiAssetProxy.owner().callAsync()];
                        case 21:
                            multiAssetProxyOwner = _a.sent();
                            warnIfMismatch(multiAssetProxyOwner, governor.address, 'Unexpected MultiAssetProxy owner');
                            return [4 /*yield*/, multiAssetProxy.getAuthorizedAddresses().callAsync()];
                        case 22:
                            multiAssetProxyAuthorizedAddresses = _a.sent();
                            warnIfMismatch(multiAssetProxyAuthorizedAddresses.length, 2, 'Unexpected number of authorized addresses in MultiAssetProxy');
                            return [4 /*yield*/, multiAssetProxy
                                    .authorized(exchangeV2.address)
                                    .callAsync()];
                        case 23:
                            isExchangeV2AuthorizedInMultiAssetProxy = _a.sent();
                            warnIfMismatch(isExchangeV2AuthorizedInMultiAssetProxy, true, 'ExchangeV2 not authorized in MultiAssetProxy');
                            return [4 /*yield*/, multiAssetProxy.authorized(exchange.address).callAsync()];
                        case 24:
                            isExchangeAuthorizedInMultiAssetProxy = _a.sent();
                            warnIfMismatch(isExchangeAuthorizedInMultiAssetProxy, true, 'Exchange not authorized in MultiAssetProxy');
                            return [4 /*yield*/, multiAssetProxy.getAssetProxy(types_1.AssetProxyId.ERC20).callAsync()];
                        case 25:
                            registeredERC20ProxyInMAP = _a.sent();
                            warnIfMismatch(registeredERC20ProxyInMAP, erc20Proxy.address, 'Unexpected ERC20Proxy registered in MultiAssetProxy');
                            return [4 /*yield*/, multiAssetProxy.getAssetProxy(types_1.AssetProxyId.ERC721).callAsync()];
                        case 26:
                            registeredERC721ProxyInMAP = _a.sent();
                            warnIfMismatch(registeredERC721ProxyInMAP, erc721Proxy.address, 'Unexpected ERC721Proxy registered in MultiAssetProxy');
                            return [4 /*yield*/, multiAssetProxy.getAssetProxy(types_1.AssetProxyId.ERC1155).callAsync()];
                        case 27:
                            registeredERC1155ProxyInMAP = _a.sent();
                            warnIfMismatch(registeredERC1155ProxyInMAP, erc1155Proxy.address, 'Unexpected ERC1155Proxy registered in MultiAssetProxy');
                            return [4 /*yield*/, multiAssetProxy.getAssetProxy(types_1.AssetProxyId.StaticCall).callAsync()];
                        case 28:
                            registeredStaticCallProxyInMAP = _a.sent();
                            warnIfMismatch(registeredStaticCallProxyInMAP, addresses.staticCallProxy, 'Unexpected StaticCallProxy registered in MultiAssetProxy');
                            return [4 /*yield*/, multiAssetProxy
                                    .getAssetProxy(types_1.AssetProxyId.ERC20Bridge)
                                    .callAsync()];
                        case 29:
                            registeredERC20BridgeProxyInMAP = _a.sent();
                            warnIfMismatch(registeredERC20BridgeProxyInMAP, addresses.erc20BridgeProxy, 'Unexpected ERC20BridgeProxy registered in MultiAssetProxy');
                            return [2 /*return*/];
                    }
                });
            });
        }
        function verifyStakingConfigsAsync() {
            return __awaiter(this, void 0, void 0, function () {
                var stakingLogicAddress, isExchangeRegistered, zrxVaultAddress, wethAddress, stakingProxyOwner, stakingProxyAuthorizedAddresses, isGovernorAuthorizedInStakingProxy, zrxVaultOwner, zrxVaultAuthorizedAddresses, isGovernorAuthorizedInZrxVault, zrxAssetProxy, zrxVaultStakingProxy, params;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, stakingProxy.stakingContract().callAsync()];
                        case 1:
                            stakingLogicAddress = _a.sent();
                            warnIfMismatch(stakingLogicAddress, addresses.staking, 'Unexpected Staking contract attached to StakingProxy');
                            return [4 /*yield*/, stakingContract.validExchanges(addresses.exchange).callAsync()];
                        case 2:
                            isExchangeRegistered = _a.sent();
                            warnIfMismatch(isExchangeRegistered, true, 'Exchange not registered in StakingProxy');
                            return [4 /*yield*/, stakingContract.getZrxVault().callAsync()];
                        case 3:
                            zrxVaultAddress = _a.sent();
                            warnIfMismatch(zrxVaultAddress, addresses.zrxVault, 'Unexpected ZrxVault set in StakingProxy');
                            return [4 /*yield*/, stakingContract.getWethContract().callAsync()];
                        case 4:
                            wethAddress = _a.sent();
                            warnIfMismatch(wethAddress, addresses.etherToken, 'Unexpected WETH contract set in StakingProxy');
                            return [4 /*yield*/, stakingProxy.owner().callAsync()];
                        case 5:
                            stakingProxyOwner = _a.sent();
                            warnIfMismatch(stakingProxyOwner, addresses.zeroExGovernor, 'Unexpected StakingProxy owner');
                            return [4 /*yield*/, stakingProxy.getAuthorizedAddresses().callAsync()];
                        case 6:
                            stakingProxyAuthorizedAddresses = _a.sent();
                            warnIfMismatch(stakingProxyAuthorizedAddresses.length, 1, 'Unexpected number of authorized addresses in StakingProxy');
                            return [4 /*yield*/, stakingProxy.authorized(addresses.zeroExGovernor).callAsync()];
                        case 7:
                            isGovernorAuthorizedInStakingProxy = _a.sent();
                            warnIfMismatch(isGovernorAuthorizedInStakingProxy, true, 'ZeroExGovernor not authorized in StakingProxy');
                            return [4 /*yield*/, zrxVault.owner().callAsync()];
                        case 8:
                            zrxVaultOwner = _a.sent();
                            warnIfMismatch(zrxVaultOwner, addresses.zeroExGovernor, 'Unexpected ZrxVault owner');
                            return [4 /*yield*/, zrxVault.getAuthorizedAddresses().callAsync()];
                        case 9:
                            zrxVaultAuthorizedAddresses = _a.sent();
                            warnIfMismatch(zrxVaultAuthorizedAddresses.length, 1, 'Unexpected number of authorized addresses in ZrxVault');
                            return [4 /*yield*/, zrxVault.authorized(addresses.zeroExGovernor).callAsync()];
                        case 10:
                            isGovernorAuthorizedInZrxVault = _a.sent();
                            warnIfMismatch(isGovernorAuthorizedInZrxVault, true, 'ZeroExGovernor not authorized in ZrxVault');
                            return [4 /*yield*/, zrxVault.zrxAssetProxy().callAsync()];
                        case 11:
                            zrxAssetProxy = _a.sent();
                            warnIfMismatch(zrxAssetProxy, addresses.erc20Proxy, 'Unexpected ERC20Proxy set in ZrxVault');
                            return [4 /*yield*/, zrxVault.stakingProxyAddress().callAsync()];
                        case 12:
                            zrxVaultStakingProxy = _a.sent();
                            warnIfMismatch(zrxVaultStakingProxy, addresses.stakingProxy, 'Unexpected StakingProxy set in ZrxVault');
                            return [4 /*yield*/, stakingContract.getParams().callAsync()];
                        case 13:
                            params = _a.sent();
                            warnIfMismatch(params[0].toNumber(), configs.staking.epochDurationInSeconds.toNumber(), 'Unexpected epoch duration in StakingProxy');
                            warnIfMismatch(params[1].toString(), configs.staking.rewardDelegatedStakeWeight.toString(), 'Unexpected delegated stake weight in StakingProxy');
                            warnIfMismatch(params[2].toNumber(), configs.staking.minimumPoolStake.toNumber(), 'Unexpected minimum pool stake in StakingProxy');
                            warnIfMismatch(params[3].toString(), configs.staking.cobbDouglasAlphaNumerator.toString(), 'Unexpected alpha numerator in StakingProxy');
                            warnIfMismatch(params[4].toString(), configs.staking.cobbDouglasAlphaDenominator.toString(), 'Unexpected alpha denominator in StakingProxy');
                            return [2 /*return*/];
                    }
                });
            });
        }
        function verifyZeroExGovernorConfigsAsync() {
            return __awaiter(this, void 0, void 0, function () {
                var e_1, _a, timelockRegistrations, timelockRegistrations_1, timelockRegistrations_1_1, timelockRegistration, actualRegistration, e_1_1, owners, secondsTimeLocked, confirmationsRequired;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            timelockRegistrations = timelocks_1.getTimelockRegistrationsByChainId(chainId);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, 7, 8]);
                            timelockRegistrations_1 = __values(timelockRegistrations), timelockRegistrations_1_1 = timelockRegistrations_1.next();
                            _b.label = 2;
                        case 2:
                            if (!!timelockRegistrations_1_1.done) return [3 /*break*/, 5];
                            timelockRegistration = timelockRegistrations_1_1.value;
                            return [4 /*yield*/, governor
                                    .functionCallTimeLocks(timelockRegistration.functionSelector, timelockRegistration.destination)
                                    .callAsync()];
                        case 3:
                            actualRegistration = _b.sent();
                            warnIfMismatch(actualRegistration[0], true, "Function " + timelockRegistration.functionSelector + " at address " + timelockRegistration.destination + " not registered in ZeroExGovernor");
                            warnIfMismatch(actualRegistration[1].toNumber(), timelockRegistration.secondsTimeLocked.toNumber(), "Timelock for function " + timelockRegistration.functionSelector + " at address " + timelockRegistration.destination + " in ZeroExGovernor");
                            _b.label = 4;
                        case 4:
                            timelockRegistrations_1_1 = timelockRegistrations_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _b.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (timelockRegistrations_1_1 && !timelockRegistrations_1_1.done && (_a = timelockRegistrations_1.return)) _a.call(timelockRegistrations_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8: return [4 /*yield*/, governor.getOwners().callAsync()];
                        case 9:
                            owners = _b.sent();
                            warnIfMismatch(owners.length, configs.zeroExGovernor.owners.length, 'Unexpected number of owners in ZeroExGovernor');
                            owners.forEach(function (owner, i) {
                                warnIfMismatch(owners[i], configs.zeroExGovernor.owners[i], "Unexpected owner in ZeroExGovernor at index " + i);
                            });
                            return [4 /*yield*/, governor.secondsTimeLocked().callAsync()];
                        case 10:
                            secondsTimeLocked = _b.sent();
                            warnIfMismatch(secondsTimeLocked.toNumber(), configs.zeroExGovernor.secondsTimeLocked.toNumber(), 'Unexpected secondsTimeLocked in ZeroExGovernor');
                            return [4 /*yield*/, governor.required().callAsync()];
                        case 11:
                            confirmationsRequired = _b.sent();
                            warnIfMismatch(confirmationsRequired.toNumber(), configs.zeroExGovernor.required.toNumber(), 'Unexpected number of confirmations required in ZeroExGovernor');
                            return [2 /*return*/];
                    }
                });
            });
        }
        var web3Wrapper, chainId, addresses, configs, exchange, exchangeV2, erc20Proxy, erc721Proxy, erc1155Proxy, multiAssetProxy, erc20BridgeProxy, governor, stakingProxy, stakingContract, zrxVault;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
                    return [4 /*yield*/, web3Wrapper.getChainIdAsync()];
                case 1:
                    chainId = _a.sent();
                    addresses = contract_addresses_1.getContractAddressesForChainOrThrow(chainId);
                    configs = configs_by_chain_1.getConfigsByChainId(chainId);
                    exchange = new contracts_exchange_1.ExchangeContract(addresses.exchange, provider);
                    exchangeV2 = new contracts_exchange_1.ExchangeContract(addresses.exchangeV2, provider);
                    erc20Proxy = new contracts_asset_proxy_1.ERC20ProxyContract(addresses.erc20Proxy, provider);
                    erc721Proxy = new contracts_asset_proxy_1.ERC721ProxyContract(addresses.erc721Proxy, provider);
                    erc1155Proxy = new contracts_asset_proxy_1.ERC1155ProxyContract(addresses.erc1155Proxy, provider);
                    multiAssetProxy = new contracts_asset_proxy_1.MultiAssetProxyContract(addresses.multiAssetProxy, provider);
                    erc20BridgeProxy = new contracts_asset_proxy_1.ERC20ProxyContract(addresses.erc20BridgeProxy, provider);
                    governor = new contracts_multisig_1.ZeroExGovernorContract(addresses.zeroExGovernor, provider);
                    stakingProxy = new contracts_staking_1.StakingProxyContract(addresses.stakingProxy, provider);
                    stakingContract = new contracts_staking_1.StakingContract(addresses.stakingProxy, provider);
                    zrxVault = new contracts_staking_1.ZrxVaultContract(addresses.zrxVault, provider);
                    return [4 /*yield*/, verifyExchangeV2ConfigsAsync()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, verifyExchangeV3ConfigsAsync()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, verifyStakingConfigsAsync()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, verifyAssetProxyConfigsAsync()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, verifyZeroExGovernorConfigsAsync()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var e_2, _a, _b, _c, rpcUrl, provider, e_2_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, 6, 7]);
                _b = __values(Object.values(networkIdToRpcUrl)), _c = _b.next();
                _d.label = 1;
            case 1:
                if (!!_c.done) return [3 /*break*/, 4];
                rpcUrl = _c.value;
                provider = new subproviders_1.Web3ProviderEngine();
                provider.addProvider(new subproviders_1.EmptyWalletSubprovider());
                provider.addProvider(new subproviders_1.RPCSubprovider(rpcUrl));
                utils_1.providerUtils.startProviderEngine(provider);
                return [4 /*yield*/, testContractConfigsAsync(provider)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _c = _b.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_2_1 = _d.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); })().catch(function (err) {
    utils_1.logUtils.log(err);
    process.exit(1);
});
//# sourceMappingURL=test_contract_configs.js.map