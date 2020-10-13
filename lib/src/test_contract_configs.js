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
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_asset_proxy_1 = require("@0x/contracts-asset-proxy");
const contracts_exchange_1 = require("@0x/contracts-exchange");
const contracts_multisig_1 = require("@0x/contracts-multisig");
const contracts_staking_1 = require("@0x/contracts-staking");
const subproviders_1 = require("@0x/subproviders");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const configs_by_chain_1 = require("./utils/configs_by_chain");
const timelocks_1 = require("./utils/timelocks");
// NOTE: add your own Infura Project ID to RPC urls before running
const INFURA_PROJECT_ID = '';
const networkIdToRpcUrl = {
    1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
    4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
    42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
};
// tslint:disable:custom-no-magic-numbers
function testContractConfigsAsync(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
        const chainId = yield web3Wrapper.getChainIdAsync();
        const addresses = contract_addresses_1.getContractAddressesForChainOrThrow(chainId);
        const configs = configs_by_chain_1.getConfigsByChainId(chainId);
        function warnIfMismatch(actual, expected, message) {
            if (actual !== expected) {
                utils_1.logUtils.warn(`${message}: actual: ${actual}, expected: ${expected}, chainId: ${chainId}`);
            }
        }
        const exchange = new contracts_exchange_1.ExchangeContract(addresses.exchange, provider);
        const exchangeV2 = new contracts_exchange_1.ExchangeContract(addresses.exchangeV2, provider);
        const erc20Proxy = new contracts_asset_proxy_1.ERC20ProxyContract(addresses.erc20Proxy, provider);
        const erc721Proxy = new contracts_asset_proxy_1.ERC721ProxyContract(addresses.erc721Proxy, provider);
        const erc1155Proxy = new contracts_asset_proxy_1.ERC1155ProxyContract(addresses.erc1155Proxy, provider);
        const multiAssetProxy = new contracts_asset_proxy_1.MultiAssetProxyContract(addresses.multiAssetProxy, provider);
        const erc20BridgeProxy = new contracts_asset_proxy_1.ERC20ProxyContract(addresses.erc20BridgeProxy, provider);
        const governor = new contracts_multisig_1.ZeroExGovernorContract(addresses.zeroExGovernor, provider);
        const stakingProxy = new contracts_staking_1.StakingProxyContract(addresses.stakingProxy, provider);
        const stakingContract = new contracts_staking_1.StakingContract(addresses.stakingProxy, provider);
        const zrxVault = new contracts_staking_1.ZrxVaultContract(addresses.zrxVault, provider);
        function verifyExchangeV2ConfigsAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const exchangeOwner = yield exchangeV2.owner().callAsync();
                warnIfMismatch(exchangeOwner, governor.address, 'Unexpected ExchangeV2 owner');
                const registeredERC20Proxy = yield exchangeV2.getAssetProxy(types_1.AssetProxyId.ERC20).callAsync();
                warnIfMismatch(registeredERC20Proxy, erc20Proxy.address, 'Unexpected ERC20Proxy registered in ExchangeV2');
                const registeredERC721Proxy = yield exchangeV2.getAssetProxy(types_1.AssetProxyId.ERC721).callAsync();
                warnIfMismatch(registeredERC721Proxy, erc721Proxy.address, 'Unexpected ERC721Proxy registered in ExchangeV2');
                const registeredERC1155Proxy = yield exchangeV2.getAssetProxy(types_1.AssetProxyId.ERC1155).callAsync();
                warnIfMismatch(registeredERC1155Proxy, erc1155Proxy.address, 'Unexpected ERC1155Proxy registered in ExchangeV2');
                const registeredMultiAssetProxy = yield exchangeV2.getAssetProxy(types_1.AssetProxyId.MultiAsset).callAsync();
                warnIfMismatch(registeredMultiAssetProxy, multiAssetProxy.address, 'Unexpected MultiAssetProxy registered in ExchangeV2');
                const registeredStaticCallProxy = yield exchangeV2.getAssetProxy(types_1.AssetProxyId.StaticCall).callAsync();
                warnIfMismatch(registeredStaticCallProxy, addresses.staticCallProxy, 'Unexpected StaticCallProxy registered in ExchangeV2');
            });
        }
        function verifyExchangeV3ConfigsAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const exchangeOwner = yield exchange.owner().callAsync();
                warnIfMismatch(exchangeOwner, governor.address, 'Unexpected Exchange owner');
                const registeredERC20Proxy = yield exchange.getAssetProxy(types_1.AssetProxyId.ERC20).callAsync();
                warnIfMismatch(registeredERC20Proxy, erc20Proxy.address, 'Unexpected ERC20Proxy registered in Exchange');
                const registeredERC721Proxy = yield exchange.getAssetProxy(types_1.AssetProxyId.ERC721).callAsync();
                warnIfMismatch(registeredERC721Proxy, erc721Proxy.address, 'Unexpected ERC721Proxy registered in Exchange');
                const registeredERC1155Proxy = yield exchange.getAssetProxy(types_1.AssetProxyId.ERC1155).callAsync();
                warnIfMismatch(registeredERC1155Proxy, erc1155Proxy.address, 'Unexpected ERC1155Proxy registered in Exchange');
                const registeredMultiAssetProxy = yield exchange.getAssetProxy(types_1.AssetProxyId.MultiAsset).callAsync();
                warnIfMismatch(registeredMultiAssetProxy, multiAssetProxy.address, 'Unexpected MultiAssetProxy registered in Exchange');
                const registeredStaticCallProxy = yield exchange.getAssetProxy(types_1.AssetProxyId.StaticCall).callAsync();
                warnIfMismatch(registeredStaticCallProxy, addresses.staticCallProxy, 'Unexpected StaticCallProxy registered in Exchange');
                const registeredERC20BridgeProxy = yield exchange.getAssetProxy(types_1.AssetProxyId.ERC20Bridge).callAsync();
                warnIfMismatch(registeredERC20BridgeProxy, addresses.erc20BridgeProxy, 'Unexpected ERC20BridgeProxy registered in Exchange');
                const protocolFeeCollector = yield exchange.protocolFeeCollector().callAsync();
                warnIfMismatch(protocolFeeCollector, addresses.stakingProxy, 'Unexpected StakingProxy attached to Exchange');
                const protocolFeeMultiplier = yield exchange.protocolFeeMultiplier().callAsync();
                warnIfMismatch(protocolFeeMultiplier.toString(), '150000', 'Unexpected protocolFeeMultiplier in Exchange');
            });
        }
        function verifyAssetProxyConfigsAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                // Verify ERC20Proxy configs
                const erc20ProxyOwner = yield erc20Proxy.owner().callAsync();
                warnIfMismatch(erc20ProxyOwner, governor.address, 'Unexpected ERC20Proxy owner');
                const erc20AuthorizedAddresses = yield erc20Proxy.getAuthorizedAddresses().callAsync();
                warnIfMismatch(erc20AuthorizedAddresses.length, 4, 'Unexpected number of authorized addresses in ERC20Proxy');
                const isExchangeV2AuthorizedInERC20Proxy = yield erc20Proxy.authorized(exchangeV2.address).callAsync();
                warnIfMismatch(isExchangeV2AuthorizedInERC20Proxy, true, 'ExchangeV2 not authorized in ERC20Proxy');
                const isExchangeAuthorizedInERC20Proxy = yield erc20Proxy.authorized(exchange.address).callAsync();
                warnIfMismatch(isExchangeAuthorizedInERC20Proxy, true, 'Exchange not authorized in ERC20Proxy');
                const isMAPAuthorizedInER20Proxy = yield erc20Proxy.authorized(multiAssetProxy.address).callAsync();
                warnIfMismatch(isMAPAuthorizedInER20Proxy, true, 'MultiAssetProxy not authorized in ERC20Proxy');
                const isZrxVaultAuthorizedInER20Proxy = yield erc20Proxy.authorized(zrxVault.address).callAsync();
                warnIfMismatch(isZrxVaultAuthorizedInER20Proxy, true, 'ZrxVault not authorized in ERC20Proxy');
                // Verify ERC721Proxy configs
                const erc721ProxyOwner = yield erc721Proxy.owner().callAsync();
                warnIfMismatch(erc721ProxyOwner, governor.address, 'Unexpected ERC721Proxy owner');
                const erc721AuthorizedAddresses = yield erc721Proxy.getAuthorizedAddresses().callAsync();
                warnIfMismatch(erc721AuthorizedAddresses.length, 3, 'Unexpected number of authorized addresses in ERC721Proxy');
                const isExchangeV2AuthorizedInERC721Proxy = yield erc721Proxy.authorized(exchangeV2.address).callAsync();
                warnIfMismatch(isExchangeV2AuthorizedInERC721Proxy, true, 'ExchangeV2 not authorized in ERC721Proxy');
                const isExchangeAuthorizedInERC721Proxy = yield erc721Proxy.authorized(exchange.address).callAsync();
                warnIfMismatch(isExchangeAuthorizedInERC721Proxy, true, 'Exchange not authorized in ERC721Proxy');
                const isMAPAuthorizedInER721Proxy = yield erc721Proxy.authorized(multiAssetProxy.address).callAsync();
                warnIfMismatch(isMAPAuthorizedInER721Proxy, true, 'MultiAssetProxy not authorized in ERC721Proxy');
                // Verify ERC1155Proxy configs
                const erc1155ProxyOwner = yield erc1155Proxy.owner().callAsync();
                warnIfMismatch(erc1155ProxyOwner, governor.address, 'Unexpected ERC1155Proxy owner');
                const erc1155AuthorizedAddresses = yield erc1155Proxy.getAuthorizedAddresses().callAsync();
                warnIfMismatch(erc1155AuthorizedAddresses.length, 3, 'Unexpected number of authorized addresses in ERC1155Proxy');
                const isExchangeV2AuthorizedInERC1155Proxy = yield erc1155Proxy.authorized(exchangeV2.address).callAsync();
                warnIfMismatch(isExchangeV2AuthorizedInERC1155Proxy, true, 'ExchangeV2 not authorized in ERC1155Proxy');
                const isExchangeAuthorizedInERC1155Proxy = yield erc1155Proxy.authorized(exchange.address).callAsync();
                warnIfMismatch(isExchangeAuthorizedInERC1155Proxy, true, 'Exchange not authorized in ERC1155Proxy');
                const isMAPAuthorizedInERC1155Proxy = yield erc1155Proxy.authorized(multiAssetProxy.address).callAsync();
                warnIfMismatch(isMAPAuthorizedInERC1155Proxy, true, 'MultiAssetProxy not authorized in ERC1155Proxy');
                // Verify ERC20BridgeProxy configs
                const erc20BridgeProxyOwner = yield erc20BridgeProxy.owner().callAsync();
                warnIfMismatch(erc20BridgeProxyOwner, governor.address, 'Unexpected ERC20BridgeProxy owner');
                const erc20BridgeAuthorizedAddresses = yield erc20BridgeProxy.getAuthorizedAddresses().callAsync();
                warnIfMismatch(erc20BridgeAuthorizedAddresses.length, 2, 'Unexpected number of authorized addresses in ERC20BridgeProxy');
                const isExchangeAuthorizedInERC20BridgeProxy = yield erc20BridgeProxy.authorized(exchange.address).callAsync();
                warnIfMismatch(isExchangeAuthorizedInERC20BridgeProxy, true, 'Exchange not authorized in ERC20BridgeProxy');
                const isMAPAuthorizedInERC20BridgeProxy = yield erc20BridgeProxy
                    .authorized(multiAssetProxy.address)
                    .callAsync();
                warnIfMismatch(isMAPAuthorizedInERC20BridgeProxy, true, 'MultiAssetProxy not authorized in ERC20BridgeProxy');
                // Verify MultiAssetProxy configs
                const multiAssetProxyOwner = yield multiAssetProxy.owner().callAsync();
                warnIfMismatch(multiAssetProxyOwner, governor.address, 'Unexpected MultiAssetProxy owner');
                const multiAssetProxyAuthorizedAddresses = yield multiAssetProxy.getAuthorizedAddresses().callAsync();
                warnIfMismatch(multiAssetProxyAuthorizedAddresses.length, 2, 'Unexpected number of authorized addresses in MultiAssetProxy');
                const isExchangeV2AuthorizedInMultiAssetProxy = yield multiAssetProxy
                    .authorized(exchangeV2.address)
                    .callAsync();
                warnIfMismatch(isExchangeV2AuthorizedInMultiAssetProxy, true, 'ExchangeV2 not authorized in MultiAssetProxy');
                const isExchangeAuthorizedInMultiAssetProxy = yield multiAssetProxy.authorized(exchange.address).callAsync();
                warnIfMismatch(isExchangeAuthorizedInMultiAssetProxy, true, 'Exchange not authorized in MultiAssetProxy');
                const registeredERC20ProxyInMAP = yield multiAssetProxy.getAssetProxy(types_1.AssetProxyId.ERC20).callAsync();
                warnIfMismatch(registeredERC20ProxyInMAP, erc20Proxy.address, 'Unexpected ERC20Proxy registered in MultiAssetProxy');
                const registeredERC721ProxyInMAP = yield multiAssetProxy.getAssetProxy(types_1.AssetProxyId.ERC721).callAsync();
                warnIfMismatch(registeredERC721ProxyInMAP, erc721Proxy.address, 'Unexpected ERC721Proxy registered in MultiAssetProxy');
                const registeredERC1155ProxyInMAP = yield multiAssetProxy.getAssetProxy(types_1.AssetProxyId.ERC1155).callAsync();
                warnIfMismatch(registeredERC1155ProxyInMAP, erc1155Proxy.address, 'Unexpected ERC1155Proxy registered in MultiAssetProxy');
                const registeredStaticCallProxyInMAP = yield multiAssetProxy.getAssetProxy(types_1.AssetProxyId.StaticCall).callAsync();
                warnIfMismatch(registeredStaticCallProxyInMAP, addresses.staticCallProxy, 'Unexpected StaticCallProxy registered in MultiAssetProxy');
                const registeredERC20BridgeProxyInMAP = yield multiAssetProxy
                    .getAssetProxy(types_1.AssetProxyId.ERC20Bridge)
                    .callAsync();
                warnIfMismatch(registeredERC20BridgeProxyInMAP, addresses.erc20BridgeProxy, 'Unexpected ERC20BridgeProxy registered in MultiAssetProxy');
            });
        }
        function verifyStakingConfigsAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const stakingLogicAddress = yield stakingProxy.stakingContract().callAsync();
                warnIfMismatch(stakingLogicAddress, addresses.staking, 'Unexpected Staking contract attached to StakingProxy');
                const isExchangeRegistered = yield stakingContract.validExchanges(addresses.exchange).callAsync();
                warnIfMismatch(isExchangeRegistered, true, 'Exchange not registered in StakingProxy');
                const zrxVaultAddress = yield stakingContract.getZrxVault().callAsync();
                warnIfMismatch(zrxVaultAddress, addresses.zrxVault, 'Unexpected ZrxVault set in StakingProxy');
                const wethAddress = yield stakingContract.getWethContract().callAsync();
                warnIfMismatch(wethAddress, addresses.etherToken, 'Unexpected WETH contract set in StakingProxy');
                const stakingProxyOwner = yield stakingProxy.owner().callAsync();
                warnIfMismatch(stakingProxyOwner, addresses.zeroExGovernor, 'Unexpected StakingProxy owner');
                const stakingProxyAuthorizedAddresses = yield stakingProxy.getAuthorizedAddresses().callAsync();
                warnIfMismatch(stakingProxyAuthorizedAddresses.length, 1, 'Unexpected number of authorized addresses in StakingProxy');
                const isGovernorAuthorizedInStakingProxy = yield stakingProxy.authorized(addresses.zeroExGovernor).callAsync();
                warnIfMismatch(isGovernorAuthorizedInStakingProxy, true, 'ZeroExGovernor not authorized in StakingProxy');
                const zrxVaultOwner = yield zrxVault.owner().callAsync();
                warnIfMismatch(zrxVaultOwner, addresses.zeroExGovernor, 'Unexpected ZrxVault owner');
                const zrxVaultAuthorizedAddresses = yield zrxVault.getAuthorizedAddresses().callAsync();
                warnIfMismatch(zrxVaultAuthorizedAddresses.length, 1, 'Unexpected number of authorized addresses in ZrxVault');
                const isGovernorAuthorizedInZrxVault = yield zrxVault.authorized(addresses.zeroExGovernor).callAsync();
                warnIfMismatch(isGovernorAuthorizedInZrxVault, true, 'ZeroExGovernor not authorized in ZrxVault');
                const zrxAssetProxy = yield zrxVault.zrxAssetProxy().callAsync();
                warnIfMismatch(zrxAssetProxy, addresses.erc20Proxy, 'Unexpected ERC20Proxy set in ZrxVault');
                const zrxVaultStakingProxy = yield zrxVault.stakingProxyAddress().callAsync();
                warnIfMismatch(zrxVaultStakingProxy, addresses.stakingProxy, 'Unexpected StakingProxy set in ZrxVault');
                const params = yield stakingContract.getParams().callAsync();
                warnIfMismatch(params[0].toNumber(), configs.staking.epochDurationInSeconds.toNumber(), 'Unexpected epoch duration in StakingProxy');
                warnIfMismatch(params[1].toString(), configs.staking.rewardDelegatedStakeWeight.toString(), 'Unexpected delegated stake weight in StakingProxy');
                warnIfMismatch(params[2].toNumber(), configs.staking.minimumPoolStake.toNumber(), 'Unexpected minimum pool stake in StakingProxy');
                warnIfMismatch(params[3].toString(), configs.staking.cobbDouglasAlphaNumerator.toString(), 'Unexpected alpha numerator in StakingProxy');
                warnIfMismatch(params[4].toString(), configs.staking.cobbDouglasAlphaDenominator.toString(), 'Unexpected alpha denominator in StakingProxy');
            });
        }
        function verifyZeroExGovernorConfigsAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const timelockRegistrations = timelocks_1.getTimelockRegistrationsByChainId(chainId);
                for (const timelockRegistration of timelockRegistrations) {
                    const actualRegistration = yield governor
                        .functionCallTimeLocks(timelockRegistration.functionSelector, timelockRegistration.destination)
                        .callAsync();
                    warnIfMismatch(actualRegistration[0], true, `Function ${timelockRegistration.functionSelector} at address ${timelockRegistration.destination} not registered in ZeroExGovernor`);
                    warnIfMismatch(actualRegistration[1].toNumber(), timelockRegistration.secondsTimeLocked.toNumber(), `Timelock for function ${timelockRegistration.functionSelector} at address ${timelockRegistration.destination} in ZeroExGovernor`);
                }
                const owners = yield governor.getOwners().callAsync();
                warnIfMismatch(owners.length, configs.zeroExGovernor.owners.length, 'Unexpected number of owners in ZeroExGovernor');
                owners.forEach((owner, i) => {
                    warnIfMismatch(owners[i], configs.zeroExGovernor.owners[i], `Unexpected owner in ZeroExGovernor at index ${i}`);
                });
                const secondsTimeLocked = yield governor.secondsTimeLocked().callAsync();
                warnIfMismatch(secondsTimeLocked.toNumber(), configs.zeroExGovernor.secondsTimeLocked.toNumber(), 'Unexpected secondsTimeLocked in ZeroExGovernor');
                const confirmationsRequired = yield governor.required().callAsync();
                warnIfMismatch(confirmationsRequired.toNumber(), configs.zeroExGovernor.required.toNumber(), 'Unexpected number of confirmations required in ZeroExGovernor');
            });
        }
        yield verifyExchangeV2ConfigsAsync();
        yield verifyExchangeV3ConfigsAsync();
        yield verifyStakingConfigsAsync();
        yield verifyAssetProxyConfigsAsync();
        yield verifyZeroExGovernorConfigsAsync();
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    for (const rpcUrl of Object.values(networkIdToRpcUrl)) {
        const provider = new subproviders_1.Web3ProviderEngine();
        provider.addProvider(new subproviders_1.EmptyWalletSubprovider());
        provider.addProvider(new subproviders_1.RPCSubprovider(rpcUrl));
        utils_1.providerUtils.startProviderEngine(provider);
        yield testContractConfigsAsync(provider);
    }
}))().catch(err => {
    utils_1.logUtils.log(err);
    process.exit(1);
});
//# sourceMappingURL=test_contract_configs.js.map