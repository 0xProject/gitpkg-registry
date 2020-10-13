"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_asset_proxy_1 = require("@0x/contracts-asset-proxy");
const contracts_coordinator_1 = require("@0x/contracts-coordinator");
const contracts_dev_utils_1 = require("@0x/contracts-dev-utils");
const contracts_exchange_1 = require("@0x/contracts-exchange");
const contracts_exchange_forwarder_1 = require("@0x/contracts-exchange-forwarder");
const contracts_multisig_1 = require("@0x/contracts-multisig");
const contracts_staking_1 = require("@0x/contracts-staking");
const contracts_utils_1 = require("@0x/contracts-utils");
const utils_1 = require("@0x/utils");
const configs_by_chain_1 = require("./utils/configs_by_chain");
const constants_1 = require("./utils/constants");
const provider_factory_1 = require("./utils/provider_factory");
const timelocks_1 = require("./utils/timelocks");
function submitAndExecuteTransactionAsync(governor, destination, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { logs } = yield governor
            .submitTransaction(destination, constants_1.constants.ZERO_AMOUNT, data)
            .awaitTransactionSuccessAsync();
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const txId = logs[0].args.transactionId;
        utils_1.logUtils.log(`${txId} submitted`);
        yield governor.executeTransaction(txId).awaitTransactionSuccessAsync();
        utils_1.logUtils.log(`${txId} executed`);
    });
}
/**
 * Deploys all 3.0 contracts and reconfigures existing 2.0 contracts.
 * @param supportedProvider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 */
function runMigrationsAsync(supportedProvider, txDefaults) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        const chainId = new utils_1.BigNumber(yield utils_1.providerUtils.getChainIdAsync(provider));
        const deployedAddresses = contract_addresses_1.getContractAddressesForChainOrThrow(chainId.toNumber());
        const configs = configs_by_chain_1.getConfigsByChainId(chainId.toNumber());
        // NOTE: This must be deployed before running these migrations, since its address is hard coded in the
        // staking logic contract.
        const zrxVault = new contracts_staking_1.ZrxVaultContract(deployedAddresses.zrxVault, provider, txDefaults);
        const stakingLogic = yield contracts_staking_1.StakingContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.Staking, provider, txDefaults, contracts_staking_1.artifacts);
        const exchange = yield contracts_exchange_1.ExchangeContract.deployFrom0xArtifactAsync(contracts_exchange_1.artifacts.Exchange, provider, txDefaults, contracts_exchange_1.artifacts, chainId);
        const stakingProxy = yield contracts_staking_1.StakingProxyContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.StakingProxy, provider, txDefaults, contracts_staking_1.artifacts, stakingLogic.address);
        const erc20BridgeProxy = yield contracts_asset_proxy_1.ERC20BridgeProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC20BridgeProxy, provider, txDefaults, contracts_asset_proxy_1.artifacts);
        yield contracts_asset_proxy_1.UniswapBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.UniswapBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts);
        yield contracts_asset_proxy_1.Eth2DaiBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.Eth2DaiBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts);
        yield contracts_asset_proxy_1.KyberBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.KyberBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts);
        const chaiBridge = yield contracts_asset_proxy_1.ChaiBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ChaiBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts);
        const dydxBridge = yield contracts_asset_proxy_1.DydxBridgeContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.DydxBridge, provider, txDefaults, contracts_asset_proxy_1.artifacts);
        const authorizableInterface = new contracts_utils_1.IAuthorizableContract(constants_1.constants.NULL_ADDRESS, provider, txDefaults);
        const ownableInterface = new contracts_utils_1.IOwnableContract(constants_1.constants.NULL_ADDRESS, provider, txDefaults);
        const customTimeLocks = timelocks_1.getTimelockRegistrationsByChainId(chainId.toNumber());
        const governor = yield contracts_multisig_1.ZeroExGovernorContract.deployFrom0xArtifactAsync(contracts_multisig_1.artifacts.ZeroExGovernor, provider, txDefaults, contracts_multisig_1.artifacts, customTimeLocks.map(timeLockInfo => timeLockInfo.functionSelector), customTimeLocks.map(timeLockInfo => timeLockInfo.destination), customTimeLocks.map(timeLockInfo => timeLockInfo.secondsTimeLocked), configs.zeroExGovernor.owners, configs.zeroExGovernor.required, configs.zeroExGovernor.secondsTimeLocked);
        utils_1.logUtils.log('Configuring Exchange...');
        yield exchange.setProtocolFeeCollectorAddress(stakingProxy.address).awaitTransactionSuccessAsync();
        yield exchange.setProtocolFeeMultiplier(new utils_1.BigNumber(150000)).awaitTransactionSuccessAsync();
        yield exchange.registerAssetProxy(deployedAddresses.erc20Proxy).awaitTransactionSuccessAsync();
        yield exchange.registerAssetProxy(deployedAddresses.erc721Proxy).awaitTransactionSuccessAsync();
        yield exchange.registerAssetProxy(deployedAddresses.erc1155Proxy).awaitTransactionSuccessAsync();
        yield exchange.registerAssetProxy(deployedAddresses.multiAssetProxy).awaitTransactionSuccessAsync();
        yield exchange.registerAssetProxy(deployedAddresses.staticCallProxy).awaitTransactionSuccessAsync();
        yield exchange.registerAssetProxy(erc20BridgeProxy.address).awaitTransactionSuccessAsync();
        yield exchange.transferOwnership(governor.address).awaitTransactionSuccessAsync();
        utils_1.logUtils.log('Exchange configured!');
        utils_1.logUtils.log('Configuring ERC20BridgeProxy...');
        yield erc20BridgeProxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync();
        yield erc20BridgeProxy.addAuthorizedAddress(deployedAddresses.multiAssetProxy).awaitTransactionSuccessAsync();
        yield erc20BridgeProxy.transferOwnership(governor.address).awaitTransactionSuccessAsync();
        utils_1.logUtils.log('ERC20BridgeProxy configured!');
        utils_1.logUtils.log('Configuring ZrxVault...');
        yield zrxVault.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
        yield zrxVault.setStakingProxy(stakingProxy.address).awaitTransactionSuccessAsync();
        yield zrxVault.removeAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
        yield zrxVault.addAuthorizedAddress(governor.address).awaitTransactionSuccessAsync();
        yield zrxVault.transferOwnership(governor.address).awaitTransactionSuccessAsync();
        utils_1.logUtils.log('ZrxVault configured!');
        utils_1.logUtils.log('Configuring StakingProxy...');
        yield stakingProxy.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
        const staking = new contracts_staking_1.StakingContract(stakingProxy.address, provider, txDefaults);
        yield staking.addExchangeAddress(exchange.address).awaitTransactionSuccessAsync();
        yield stakingProxy.removeAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
        yield stakingProxy.addAuthorizedAddress(governor.address).awaitTransactionSuccessAsync();
        yield stakingProxy.transferOwnership(governor.address).awaitTransactionSuccessAsync();
        utils_1.logUtils.log('StakingProxy configured!');
        utils_1.logUtils.log('Transfering ownership of 2.0 contracts...');
        const oldAssetProxyOwner = new contracts_multisig_1.ZeroExGovernorContract(deployedAddresses.assetProxyOwner, provider, txDefaults);
        yield submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.exchangeV2, // Exchange 2.1 address
        ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData());
        yield submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.erc20Proxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData());
        yield submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.erc721Proxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData());
        yield submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.erc1155Proxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData());
        yield submitAndExecuteTransactionAsync(oldAssetProxyOwner, deployedAddresses.multiAssetProxy, ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData());
        utils_1.logUtils.log('Ownership transferred!');
        const functionCalls = [
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
        const batchTransactionEncoder = utils_1.AbiEncoder.create('(bytes[],address[],uint256[])');
        const batchTransactionData = batchTransactionEncoder.encode([
            functionCalls.map(item => item.data),
            functionCalls.map(item => item.destination),
            functionCalls.map(() => constants_1.constants.ZERO_AMOUNT),
        ]);
        yield submitAndExecuteTransactionAsync(governor, governor.address, batchTransactionData);
        yield contracts_dev_utils_1.DevUtilsContract.deployWithLibrariesFrom0xArtifactAsync(contracts_dev_utils_1.artifacts.DevUtils, contracts_dev_utils_1.artifacts, provider, txDefaults, contracts_dev_utils_1.artifacts, exchange.address, chaiBridge.address, dydxBridge.address);
        yield contracts_coordinator_1.CoordinatorContract.deployFrom0xArtifactAsync(contracts_coordinator_1.artifacts.Coordinator, provider, txDefaults, contracts_coordinator_1.artifacts, exchange.address, chainId);
        yield contracts_exchange_forwarder_1.ForwarderContract.deployFrom0xArtifactAsync(contracts_exchange_forwarder_1.artifacts.Forwarder, provider, txDefaults, contracts_exchange_forwarder_1.artifacts, exchange.address, deployedAddresses.exchangeV2, deployedAddresses.etherToken);
    });
}
exports.runMigrationsAsync = runMigrationsAsync;
(() => __awaiter(this, void 0, void 0, function* () {
    const networkId = 1;
    const rpcUrl = 'https://mainnet.infura.io/v3/';
    const provider = yield provider_factory_1.providerFactory.getLedgerProviderAsync(networkId, rpcUrl);
    yield runMigrationsAsync(provider, { from: '0x3b39078f2a3e1512eecc8d6792fdc7f33e1cd2cf', gasPrice: 10000000001 });
}))().catch(err => {
    utils_1.logUtils.log(err);
    process.exit(1);
});
//# sourceMappingURL=testnet_migrations.js.map