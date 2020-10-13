"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_exchange_1 = require("@0x/contracts-exchange");
const contracts_staking_1 = require("@0x/contracts-staking");
const contracts_utils_1 = require("@0x/contracts-utils");
const subproviders_1 = require("@0x/subproviders");
const constants_1 = require("./constants");
/**
 * Gets the custom timelock configs that correspond the the network of the given provider.
 * @param provider Web3 provider instance.
 */
function getTimelockRegistrationsByChainId(chainId) {
    const deployedAddresses = contract_addresses_1.getContractAddressesForChainOrThrow(chainId);
    const provider = new subproviders_1.Web3ProviderEngine();
    const authorizableInterface = new contracts_utils_1.IAuthorizableContract(constants_1.constants.NULL_ADDRESS, provider);
    const ownableInterface = new contracts_utils_1.IOwnableContract(constants_1.constants.NULL_ADDRESS, provider);
    const zrxVault = new contracts_staking_1.ZrxVaultContract(constants_1.constants.NULL_ADDRESS, provider);
    const stakingProxy = new contracts_staking_1.StakingProxyContract(constants_1.constants.NULL_ADDRESS, provider);
    const exchange = new contracts_exchange_1.ExchangeContract(constants_1.constants.NULL_ADDRESS, provider);
    const stakingLogic = new contracts_staking_1.StakingContract(constants_1.constants.NULL_ADDRESS, provider);
    const noTimelockRegistrations = [
        // AssetProxy timelocks
        {
            destination: deployedAddresses.erc20Proxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddress'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.erc20Proxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddressAtIndex'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.erc721Proxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddress'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.erc721Proxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddressAtIndex'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.erc1155Proxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddress'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.erc1155Proxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddressAtIndex'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.multiAssetProxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddress'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.multiAssetProxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddressAtIndex'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.erc20BridgeProxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddress'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.erc20BridgeProxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddressAtIndex'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        // ZrxVault timelocks
        {
            destination: deployedAddresses.zrxVault,
            functionSelector: zrxVault.getSelector('enterCatastrophicFailure'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
        // Exchange timelocks
        {
            destination: deployedAddresses.exchange,
            functionSelector: exchange.getSelector('detachProtocolFeeCollector'),
            secondsTimeLocked: constants_1.constants.ZERO_AMOUNT,
        },
    ];
    const customTimelockRegistrations = [
        // ZrxVault timelocks
        {
            destination: deployedAddresses.zrxVault,
            functionSelector: zrxVault.getSelector('setStakingProxy'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.zrxVault,
            functionSelector: zrxVault.getSelector('setZrxProxy'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.zrxVault,
            functionSelector: ownableInterface.getSelector('transferOwnership'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.zrxVault,
            functionSelector: authorizableInterface.getSelector('addAuthorizedAddress'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.zrxVault,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddress'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.zrxVault,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddressAtIndex'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        // StakingProxy timelocks
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: stakingProxy.getSelector('attachStakingContract'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: stakingProxy.getSelector('detachStakingContract'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: stakingLogic.getSelector('setParams'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TEN_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: stakingLogic.getSelector('addExchangeAddress'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: stakingLogic.getSelector('removeExchangeAddress'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: ownableInterface.getSelector('transferOwnership'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: authorizableInterface.getSelector('addAuthorizedAddress'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddress'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.stakingProxy,
            functionSelector: authorizableInterface.getSelector('removeAuthorizedAddressAtIndex'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        // Exchange timelocks
        {
            destination: deployedAddresses.exchange,
            functionSelector: exchange.getSelector('setProtocolFeeMultiplier'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TEN_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
        {
            destination: deployedAddresses.exchange,
            functionSelector: exchange.getSelector('setProtocolFeeCollectorAddress'),
            secondsTimeLocked: chainId === constants_1.constants.MAINNET_CHAIN_ID ? constants_1.constants.TWENTY_DAYS_IN_SEC : constants_1.constants.ZERO_AMOUNT,
        },
    ];
    return [...noTimelockRegistrations, ...customTimelockRegistrations];
}
exports.getTimelockRegistrationsByChainId = getTimelockRegistrationsByChainId;
//# sourceMappingURL=timelocks.js.map