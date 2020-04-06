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
var contract_addresses_1 = require("@0x/contract-addresses");
var contracts_asset_proxy_1 = require("@0x/contracts-asset-proxy");
var contracts_coordinator_1 = require("@0x/contracts-coordinator");
var contracts_dev_utils_1 = require("@0x/contracts-dev-utils");
var contracts_erc1155_1 = require("@0x/contracts-erc1155");
var contracts_erc20_1 = require("@0x/contracts-erc20");
var contracts_erc20_bridge_sampler_1 = require("@0x/contracts-erc20-bridge-sampler");
var contracts_erc721_1 = require("@0x/contracts-erc721");
var contracts_exchange_1 = require("@0x/contracts-exchange");
var contracts_exchange_forwarder_1 = require("@0x/contracts-exchange-forwarder");
var contracts_staking_1 = require("@0x/contracts-staking");
var utils_1 = require("@0x/utils");
var constants_1 = require("./utils/constants");
var token_info_1 = require("./utils/token_info");
var allArtifacts = __assign({}, contracts_asset_proxy_1.artifacts, contracts_coordinator_1.artifacts, contracts_dev_utils_1.artifacts, contracts_erc1155_1.artifacts, contracts_erc20_1.artifacts, contracts_erc721_1.artifacts, contracts_exchange_1.artifacts, contracts_exchange_forwarder_1.artifacts, contracts_staking_1.artifacts, contracts_erc20_bridge_sampler_1.artifacts);
/**
 * Creates and deploys all the contracts that are required for the latest
 * version of the 0x protocol.
 * @param supportedProvider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 * @returns The addresses of the contracts that were deployed.
 */
function runMigrationsAsync(supportedProvider, txDefaults) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1, _a, provider, chainId, _b, erc20Proxy, erc721Proxy, zrxToken, etherToken, exchange, erc20TokenInfo_1, erc20TokenInfo_1_1, token, totalSupply, dummyErc20Token, e_1_1, cryptoKittieToken, erc1155Proxy, staticCallProxy, multiAssetProxy, coordinatorRegistry, coordinator, devUtils, erc1155DummyToken, erc20BridgeProxy, zrxProxy, zrxVault, stakingLogic, stakingProxy, stakingDel, exchangeV2Address, forwarder, erc20BridgeSampler, contractAddresses;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
                    _b = utils_1.BigNumber.bind;
                    return [4 /*yield*/, utils_1.providerUtils.getChainIdAsync(provider)];
                case 1:
                    chainId = new (_b.apply(utils_1.BigNumber, [void 0, _c.sent()]))();
                    return [4 /*yield*/, contracts_asset_proxy_1.ERC20ProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC20Proxy, provider, txDefaults, allArtifacts)];
                case 2:
                    erc20Proxy = _c.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.ERC721ProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC721Proxy, provider, txDefaults, allArtifacts)];
                case 3:
                    erc721Proxy = _c.sent();
                    return [4 /*yield*/, contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, provider, txDefaults, allArtifacts, '0x Protocol Token', 'ZRX', new utils_1.BigNumber(18), new utils_1.BigNumber(1000000000000000000000000000))];
                case 4:
                    zrxToken = _c.sent();
                    return [4 /*yield*/, contracts_erc20_1.WETH9Contract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.WETH9, provider, txDefaults, allArtifacts)];
                case 5:
                    etherToken = _c.sent();
                    return [4 /*yield*/, contracts_exchange_1.ExchangeContract.deployFrom0xArtifactAsync(contracts_exchange_1.artifacts.Exchange, provider, txDefaults, allArtifacts, chainId)];
                case 6:
                    exchange = _c.sent();
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 12, 13, 14]);
                    erc20TokenInfo_1 = __values(token_info_1.erc20TokenInfo), erc20TokenInfo_1_1 = erc20TokenInfo_1.next();
                    _c.label = 8;
                case 8:
                    if (!!erc20TokenInfo_1_1.done) return [3 /*break*/, 11];
                    token = erc20TokenInfo_1_1.value;
                    totalSupply = new utils_1.BigNumber(1000000000000000000000000000);
                    return [4 /*yield*/, contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, provider, txDefaults, allArtifacts, token.name, token.symbol, token.decimals, totalSupply)];
                case 9:
                    dummyErc20Token = _c.sent();
                    _c.label = 10;
                case 10:
                    erc20TokenInfo_1_1 = erc20TokenInfo_1.next();
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 14];
                case 12:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 13:
                    try {
                        if (erc20TokenInfo_1_1 && !erc20TokenInfo_1_1.done && (_a = erc20TokenInfo_1.return)) _a.call(erc20TokenInfo_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 14: return [4 /*yield*/, contracts_erc721_1.DummyERC721TokenContract.deployFrom0xArtifactAsync(contracts_erc721_1.artifacts.DummyERC721Token, provider, txDefaults, allArtifacts, token_info_1.erc721TokenInfo[0].name, token_info_1.erc721TokenInfo[0].symbol)];
                case 15:
                    cryptoKittieToken = _c.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.ERC1155ProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC1155Proxy, provider, txDefaults, allArtifacts)];
                case 16:
                    erc1155Proxy = _c.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.StaticCallProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.StaticCallProxy, provider, txDefaults, allArtifacts)];
                case 17:
                    staticCallProxy = _c.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.MultiAssetProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.MultiAssetProxy, provider, txDefaults, allArtifacts)];
                case 18:
                    multiAssetProxy = _c.sent();
                    return [4 /*yield*/, erc20Proxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults)];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, erc721Proxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults)];
                case 20:
                    _c.sent();
                    return [4 /*yield*/, erc1155Proxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults)];
                case 21:
                    _c.sent();
                    return [4 /*yield*/, multiAssetProxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults)];
                case 22:
                    _c.sent();
                    // MultiAssetProxy
                    return [4 /*yield*/, erc20Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 23:
                    // MultiAssetProxy
                    _c.sent();
                    return [4 /*yield*/, erc721Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 24:
                    _c.sent();
                    return [4 /*yield*/, erc1155Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 25:
                    _c.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(erc20Proxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 26:
                    _c.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(erc721Proxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 27:
                    _c.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(erc1155Proxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 28:
                    _c.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(staticCallProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 29:
                    _c.sent();
                    // Register the Asset Proxies to the Exchange
                    return [4 /*yield*/, exchange.registerAssetProxy(erc20Proxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 30:
                    // Register the Asset Proxies to the Exchange
                    _c.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(erc721Proxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 31:
                    _c.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(erc1155Proxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 32:
                    _c.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 33:
                    _c.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(staticCallProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 34:
                    _c.sent();
                    return [4 /*yield*/, contracts_coordinator_1.CoordinatorRegistryContract.deployFrom0xArtifactAsync(contracts_coordinator_1.artifacts.CoordinatorRegistry, provider, txDefaults, allArtifacts)];
                case 35:
                    coordinatorRegistry = _c.sent();
                    return [4 /*yield*/, contracts_coordinator_1.CoordinatorContract.deployFrom0xArtifactAsync(contracts_coordinator_1.artifacts.Coordinator, provider, txDefaults, allArtifacts, exchange.address, chainId)];
                case 36:
                    coordinator = _c.sent();
                    return [4 /*yield*/, contracts_dev_utils_1.DevUtilsContract.deployWithLibrariesFrom0xArtifactAsync(contracts_dev_utils_1.artifacts.DevUtils, contracts_dev_utils_1.artifacts, provider, txDefaults, allArtifacts, exchange.address, constants_1.constants.NULL_ADDRESS, constants_1.constants.NULL_ADDRESS)];
                case 37:
                    devUtils = _c.sent();
                    return [4 /*yield*/, contracts_erc1155_1.ERC1155MintableContract.deployFrom0xArtifactAsync(contracts_erc1155_1.artifacts.ERC1155Mintable, provider, txDefaults, allArtifacts)];
                case 38:
                    erc1155DummyToken = _c.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.ERC20BridgeProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC20BridgeProxy, provider, txDefaults, allArtifacts)];
                case 39:
                    erc20BridgeProxy = _c.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(erc20BridgeProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 40:
                    _c.sent();
                    return [4 /*yield*/, erc20BridgeProxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults)];
                case 41:
                    _c.sent();
                    return [4 /*yield*/, erc20BridgeProxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 42:
                    _c.sent();
                    return [4 /*yield*/, multiAssetProxy.registerAssetProxy(erc20BridgeProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 43:
                    _c.sent();
                    zrxProxy = erc20Proxy.address;
                    return [4 /*yield*/, contracts_staking_1.ZrxVaultContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.ZrxVault, provider, txDefaults, allArtifacts, zrxProxy, zrxToken.address)];
                case 44:
                    zrxVault = _c.sent();
                    return [4 /*yield*/, contracts_staking_1.TestStakingContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.TestStaking, provider, txDefaults, allArtifacts, etherToken.address, zrxVault.address)];
                case 45:
                    stakingLogic = _c.sent();
                    return [4 /*yield*/, contracts_staking_1.StakingProxyContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.StakingProxy, provider, txDefaults, allArtifacts, stakingLogic.address)];
                case 46:
                    stakingProxy = _c.sent();
                    return [4 /*yield*/, erc20Proxy.addAuthorizedAddress(zrxVault.address).awaitTransactionSuccessAsync(txDefaults)];
                case 47:
                    _c.sent();
                    return [4 /*yield*/, new contracts_staking_1.TestStakingContract(stakingProxy.address, provider, txDefaults)];
                case 48:
                    stakingDel = _c.sent();
                    return [4 /*yield*/, stakingProxy.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync(txDefaults)];
                case 49:
                    _c.sent();
                    return [4 /*yield*/, stakingDel.addExchangeAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults)];
                case 50:
                    _c.sent();
                    return [4 /*yield*/, exchange.setProtocolFeeCollectorAddress(stakingProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 51:
                    _c.sent();
                    return [4 /*yield*/, exchange.setProtocolFeeMultiplier(new utils_1.BigNumber(150000)).awaitTransactionSuccessAsync(txDefaults)];
                case 52:
                    _c.sent();
                    return [4 /*yield*/, zrxVault.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync(txDefaults)];
                case 53:
                    _c.sent();
                    return [4 /*yield*/, zrxVault.setStakingProxy(stakingProxy.address).awaitTransactionSuccessAsync(txDefaults)];
                case 54:
                    _c.sent();
                    return [4 /*yield*/, stakingLogic.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync(txDefaults)];
                case 55:
                    _c.sent();
                    return [4 /*yield*/, stakingLogic.addExchangeAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults)];
                case 56:
                    _c.sent();
                    exchangeV2Address = contract_addresses_1.getContractAddressesForChainOrThrow(chainId.toNumber()).exchangeV2;
                    return [4 /*yield*/, contracts_exchange_forwarder_1.ForwarderContract.deployFrom0xArtifactAsync(contracts_exchange_forwarder_1.artifacts.Forwarder, provider, txDefaults, allArtifacts, exchange.address, exchangeV2Address || constants_1.constants.NULL_ADDRESS, etherToken.address)];
                case 57:
                    forwarder = _c.sent();
                    return [4 /*yield*/, contracts_erc20_bridge_sampler_1.ERC20BridgeSamplerContract.deployFrom0xArtifactAsync(contracts_erc20_bridge_sampler_1.artifacts.ERC20BridgeSampler, provider, txDefaults, allArtifacts, devUtils.address)];
                case 58:
                    erc20BridgeSampler = _c.sent();
                    contractAddresses = {
                        erc20Proxy: erc20Proxy.address,
                        erc721Proxy: erc721Proxy.address,
                        erc1155Proxy: erc1155Proxy.address,
                        zrxToken: zrxToken.address,
                        etherToken: etherToken.address,
                        exchange: exchange.address,
                        assetProxyOwner: constants_1.constants.NULL_ADDRESS,
                        erc20BridgeProxy: erc20BridgeProxy.address,
                        zeroExGovernor: constants_1.constants.NULL_ADDRESS,
                        forwarder: forwarder.address,
                        coordinatorRegistry: coordinatorRegistry.address,
                        coordinator: coordinator.address,
                        multiAssetProxy: multiAssetProxy.address,
                        staticCallProxy: staticCallProxy.address,
                        devUtils: devUtils.address,
                        exchangeV2: exchangeV2Address || constants_1.constants.NULL_ADDRESS,
                        zrxVault: zrxVault.address,
                        staking: stakingLogic.address,
                        stakingProxy: stakingProxy.address,
                        uniswapBridge: constants_1.constants.NULL_ADDRESS,
                        eth2DaiBridge: constants_1.constants.NULL_ADDRESS,
                        kyberBridge: constants_1.constants.NULL_ADDRESS,
                        erc20BridgeSampler: erc20BridgeSampler.address,
                        chaiBridge: constants_1.constants.NULL_ADDRESS,
                        dydxBridge: constants_1.constants.NULL_ADDRESS,
                        curveBridge: constants_1.constants.NULL_ADDRESS,
                        godsUnchainedValidator: constants_1.constants.NULL_ADDRESS,
                        broker: constants_1.constants.NULL_ADDRESS,
                        chainlinkStopLimit: constants_1.constants.NULL_ADDRESS,
                        maximumGasPrice: constants_1.constants.NULL_ADDRESS,
                        dexForwarderBridge: constants_1.constants.NULL_ADDRESS,
                    };
                    return [2 /*return*/, contractAddresses];
            }
        });
    });
}
exports.runMigrationsAsync = runMigrationsAsync;
var _cachedContractAddresses;
/**
 * Exactly like runMigrationsAsync but will only run the migrations the first
 * time it is called. Any subsequent calls will return the cached contract
 * addresses.
 * @param provider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 * @returns The addresses of the contracts that were deployed.
 */
function runMigrationsOnceAsync(provider, txDefaults) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (_cachedContractAddresses !== undefined) {
                        return [2 /*return*/, _cachedContractAddresses];
                    }
                    return [4 /*yield*/, runMigrationsAsync(provider, txDefaults)];
                case 1:
                    _cachedContractAddresses = _a.sent();
                    return [2 /*return*/, _cachedContractAddresses];
            }
        });
    });
}
exports.runMigrationsOnceAsync = runMigrationsOnceAsync;
//# sourceMappingURL=migration.js.map