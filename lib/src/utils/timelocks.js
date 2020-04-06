"use strict";
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
var contracts_exchange_1 = require("@0x/contracts-exchange");
var contracts_staking_1 = require("@0x/contracts-staking");
var contracts_utils_1 = require("@0x/contracts-utils");
var subproviders_1 = require("@0x/subproviders");
var constants_1 = require("./constants");
/**
 * Gets the custom timelock configs that correspond the the network of the given provider.
 * @param provider Web3 provider instance.
 */
function getTimelockRegistrationsByChainId(chainId) {
    var deployedAddresses = contract_addresses_1.getContractAddressesForChainOrThrow(chainId);
    var provider = new subproviders_1.Web3ProviderEngine();
    var authorizableInterface = new contracts_utils_1.IAuthorizableContract(constants_1.constants.NULL_ADDRESS, provider);
    var ownableInterface = new contracts_utils_1.IOwnableContract(constants_1.constants.NULL_ADDRESS, provider);
    var zrxVault = new contracts_staking_1.ZrxVaultContract(constants_1.constants.NULL_ADDRESS, provider);
    var stakingProxy = new contracts_staking_1.StakingProxyContract(constants_1.constants.NULL_ADDRESS, provider);
    var exchange = new contracts_exchange_1.ExchangeContract(constants_1.constants.NULL_ADDRESS, provider);
    var stakingLogic = new contracts_staking_1.StakingContract(constants_1.constants.NULL_ADDRESS, provider);
    var noTimelockRegistrations = [
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
    var customTimelockRegistrations = [
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
    return __spread(noTimelockRegistrations, customTimelockRegistrations);
}
exports.getTimelockRegistrationsByChainId = getTimelockRegistrationsByChainId;
//# sourceMappingURL=timelocks.js.map