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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
var contracts_asset_proxy_1 = require("@0x/contracts-asset-proxy");
var contracts_coordinator_1 = require("@0x/contracts-coordinator");
var contracts_dev_utils_1 = require("@0x/contracts-dev-utils");
var contracts_exchange_1 = require("@0x/contracts-exchange");
var contracts_exchange_forwarder_1 = require("@0x/contracts-exchange-forwarder");
var contracts_multisig_1 = require("@0x/contracts-multisig");
var contracts_staking_1 = require("@0x/contracts-staking");
var contracts_utils_1 = require("@0x/contracts-utils");
var utils_1 = require("@0x/utils");
var configs_by_chain_1 = require("./utils/configs_by_chain");
var constants_1 = require("./utils/constants");
var provider_factory_1 = require("./utils/provider_factory");
var timelocks_1 = require("./utils/timelocks");
function submitAndExecuteTransactionAsync(governor, destination, data) {
    return __awaiter(this, void 0, void 0, function () {
        var logs, txId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, governor
                        .submitTransaction(destination, constants_1.constants.ZERO_AMOUNT, data)
                        .awaitTransactionSuccessAsync()];
                case 1:
                    logs = (_a.sent()).logs;
                    txId = logs[0].args.transactionId;
                    utils_1.logUtils.log(txId + " submitted");
                    return [4 /*yield*/, governor.executeTransaction(txId).awaitTransactionSuccessAsync()];
                case 2:
                    _a.sent();
                    utils_1.logUtils.log(txId + " executed");
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Deploys all 3.0 contracts and reconfigures existing 2.0 contracts.
 * @param supportedProvider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 */
function runMigrationsAsync(supportedProvider, txDefaults) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, chainId, _a, deployedAddresses, configs, zrxVault, stakingLogic, exchange, stakingProxy, erc20BridgeProxy, chaiBridge, dydxBridge, authorizableInterface, ownableInterface, customTimeLocks, governor, staking, oldAssetProxyOwner, functionCalls, batchTransactionEncoder, batchTransactionData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
                    _a = utils_1.BigNumber.bind;
                    return [4 /*yield*/, utils_1.providerUtils.getChainIdAsync(provider)];
                case 1:
                    chainId = new (_a.apply(utils_1.BigNumber, [void 0, _b.sent()]))();
                    deployedAddresses = contract_addresses_1.getContractAddressesForChainOrThrow(chainId.toNumber());
                    configs = configs_by_chain_1.getConfigsByChainId(chainId.toNumber());
                    zrxVault = new contracts_staking_1.ZrxVaultContract(deployedAddresses.zrxVault, provider, txDefaults);
                    return [4 /*yield*/, contracts_staking_1.StakingContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.Staking, provider, txDefaults, contracts_staking_1.artifacts)];
                case 2:
                    stakingLogic = _b.sent();
                    return [4 /*yield*/, contracts_exchange_1.ExchangeContract.deployFrom0xArtifactAsync(contracts_exchange_1.artifacts.Exchange, provider, txDefaults, contracts_exchange_1.artifacts, chainId)];
                case 3:
                    exchange = _b.sent();
                    return [4 /*yield*/, contracts_staking_1.StakingProxyContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.StakingProxy, provider, txDefaults, contracts_staking_1.artifacts, stakingLogic.address)];
                case 4:
                    stakingProxy = _b.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.ERC20BridgeProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC20BridgeProxy, provider, txDefaults, contracts_asset_proxy_1.artifacts)];
                case 5:
                    erc20BridgeProxy = _b.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.UniswapBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.UniswapBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.Eth2DaiBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.Eth2DaiBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.KyberBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.KyberBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.ChaiBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ChaiBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts)];
                case 9:
                    chaiBridge = _b.sent();
                    return [4 /*yield*/, contracts_asset_proxy_1.DydxBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.DydxBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts)];
                case 10:
                    dydxBridge = _b.sent();
                    authorizableInterface = new contracts_utils_1.IAuthorizableContract(constants_1.constants.NULL_ADDRESS, provider, txDefaults);
                    ownableInterface = new contracts_utils_1.IOwnableContract(constants_1.constants.NULL_ADDRESS, provider, txDefaults);
                    customTimeLocks = timelocks_1.getTimelockRegistrationsByChainId(chainId.toNumber());
                    return [4 /*yield*/, contracts_multisig_1.ZeroExGovernorContract.deployFrom0xArtifactAsync(contracts_multisig_1.artifacts.ZeroExGovernor, provider, txDefaults, contracts_multisig_1.artifacts, customTimeLocks.map(function (timeLockInfo) { return timeLockInfo.functionSelector; }), customTimeLocks.map(function (timeLockInfo) { return timeLockInfo.destination; }), customTimeLocks.map(function (timeLockInfo) { return timeLockInfo.secondsTimeLocked; }), configs.zeroExGovernor.owners, configs.zeroExGovernor.required, configs.zeroExGovernor.secondsTimeLocked)];
                case 11:
                    governor = _b.sent();
                    utils_1.logUtils.log('Configuring Exchange...');
                    return [4 /*yield*/, exchange.setProtocolFeeCollectorAddress(stakingProxy.address).awaitTransactionSuccessAsync()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, exchange.setProtocolFeeMultiplier(new utils_1.BigNumber(150000)).awaitTransactionSuccessAsync()];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(deployedAddresses.erc20Proxy).awaitTransactionSuccessAsync()];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(deployedAddresses.erc721Proxy).awaitTransactionSuccessAsync()];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(deployedAddresses.erc1155Proxy).awaitTransactionSuccessAsync()];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(deployedAddresses.multiAssetProxy).awaitTransactionSuccessAsync()];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(deployedAddresses.staticCallProxy).awaitTransactionSuccessAsync()];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, exchange.registerAssetProxy(erc20BridgeProxy.address).awaitTransactionSuccessAsync()];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, exchange.transferOwnership(governor.address).awaitTransactionSuccessAsync()];
                case 20:
                    _b.sent();
                    utils_1.logUtils.log('Exchange configured!');
                    utils_1.logUtils.log('Configuring ERC20BridgeProxy...');
                    return [4 /*yield*/, erc20BridgeProxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync()];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, erc20BridgeProxy.addAuthorizedAddress(deployedAddresses.multiAssetProxy).awaitTransactionSuccessAsync()];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, erc20BridgeProxy.transferOwnership(governor.address).awaitTransactionSuccessAsync()];
                case 23:
                    _b.sent();
                    utils_1.logUtils.log('ERC20BridgeProxy configured!');
                    utils_1.logUtils.log('Configuring ZrxVault...');
                    return [4 /*yield*/, zrxVault.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync()];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, zrxVault.setStakingProxy(stakingProxy.address).awaitTransactionSuccessAsync()];
                case 25:
                    _b.sent();
                    return [4 /*yield*/, zrxVault.removeAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync()];
                case 26:
                    _b.sent();
                    return [4 /*yield*/, zrxVault.addAuthorizedAddress(governor.address).awaitTransactionSuccessAsync()];
                case 27:
                    _b.sent();
                    return [4 /*yield*/, zrxVault.transferOwnership(governor.address).awaitTransactionSuccessAsync()];
                case 28:
                    _b.sent();
                    utils_1.logUtils.log('ZrxVault configured!');
                    utils_1.logUtils.log('Configuring StakingProxy...');
                    return [4 /*yield*/, stakingProxy.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync()];
                case 29:
                    _b.sent();
                    staking = new contracts_staking_1.StakingContract(stakingProxy.address, provider, txDefaults);
                    return [4 /*yield*/, staking.addExchangeAddress(exchange.address).awaitTransactionSuccessAsync()];
                case 30:
                    _b.sent();
                    return [4 /*yield*/, stakingProxy.removeAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync()];
                case 31:
                    _b.sent();
                    return [4 /*yield*/, stakingProxy.addAuthorizedAddress(governor.address).awaitTransactionSuccessAsync()];
                case 32:
                    _b.sent();
                    return [4 /*yield*/, stakingProxy.transferOwnership(governor.address).awaitTransactionSuccessAsync()];
                case 33:
                    _b.sent();
                    utils_1.logUtils.log('StakingProxy configured!');
                    utils_1.logUtils.log('Transfering ownership of 2.0 contracts...');
                    oldAssetProxyOwner = new contracts_multisig_1.ZeroExGovernorContract(deployedAddresses.assetProxyOwner, provider, txDefaults);
                    return [4 /*yield*/, submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.exchangeV2, // Exchange 2.1 address
                        ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData())];
                case 34:
                    _b.sent();
                    return [4 /*yield*/, submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.erc20Proxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData())];
                case 35:
                    _b.sent();
                    return [4 /*yield*/, submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.erc721Proxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData())];
                case 36:
                    _b.sent();
                    return [4 /*yield*/, submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.erc1155Proxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData())];
                case 37:
                    _b.sent();
                    return [4 /*yield*/, submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.multiAssetProxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData())];
                case 38:
                    _b.sent();
                    utils_1.logUtils.log('Ownership transferred!');
                    functionCalls = [
                        // AssetProxy configs
                        {
                            destination: deployedAddresses.erc20Proxy,
                            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
                        },
                        {
                            destination: deployedAddresses.erc20Proxy,
                            data: authorizableInterface.addAuthorizedAddress(zrxVault.address).getABIEncodedTransactionData(),
                        },
                        {
                            destination: deployedAddresses.erc721Proxy,
                            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
                        },
                        {
                            destination: deployedAddresses.erc1155Proxy,
                            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
                        },
                        {
                            destination: deployedAddresses.multiAssetProxy,
                            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
                        },
                        {
                            destination: deployedAddresses.multiAssetProxy,
                            data: exchange.registerAssetProxy(erc20BridgeProxy.address).getABIEncodedTransactionData(),
                        },
                    ];
                    batchTransactionEncoder = utils_1.AbiEncoder.create('(bytes[],address[],uint256[])');
                    batchTransactionData = batchTransactionEncoder.encode([
                        functionCalls.map(function (item) { return item.data; }),
                        functionCalls.map(function (item) { return item.destination; }),
                        functionCalls.map(function () { return constants_1.constants.ZERO_AMOUNT; }),
                    ]);
                    return [4 /*yield*/, submitAndExecuteTransactionAsync(governor, governor.address, batchTransactionData)];
                case 39:
                    _b.sent();
                    return [4 /*yield*/, contracts_dev_utils_1.DevUtilsContract.deployWithLibrariesFrom0xArtifactAsync(contracts_dev_utils_1.artifacts.DevUtils, contracts_dev_utils_1.artifacts, provider, txDefaults, contracts_dev_utils_1.artifacts, exchange.address, chaiBridge.address, dydxBridge.address)];
                case 40:
                    _b.sent();
                    return [4 /*yield*/, contracts_coordinator_1.CoordinatorContract.deployFrom0xArtifactAsync(contracts_coordinator_1.artifacts.Coordinator, provider, txDefaults, contracts_coordinator_1.artifacts, exchange.address, chainId)];
                case 41:
                    _b.sent();
                    return [4 /*yield*/, contracts_exchange_forwarder_1.ForwarderContract.deployFrom0xArtifactAsync(contracts_exchange_forwarder_1.artifacts.Forwarder, provider, txDefaults, contracts_exchange_forwarder_1.artifacts, exchange.address, deployedAddresses.exchangeV2, deployedAddresses.etherToken)];
                case 42:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runMigrationsAsync = runMigrationsAsync;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var networkId, rpcUrl, provider;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                networkId = 1;
                rpcUrl = 'https://mainnet.infura.io/v3/';
                return [4 /*yield*/, provider_factory_1.providerFactory.getLedgerProviderAsync(networkId, rpcUrl)];
            case 1:
                provider = _a.sent();
                return [4 /*yield*/, runMigrationsAsync(provider, { from: '0x3b39078f2a3e1512eecc8d6792fdc7f33e1cd2cf', gasPrice: 10000000001 })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })().catch(function (err) {
    utils_1.logUtils.log(err);
    process.exit(1);
});
//# sourceMappingURL=testnet_migrations.js.map