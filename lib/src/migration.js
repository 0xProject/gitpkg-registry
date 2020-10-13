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
const contracts_erc1155_1 = require("@0x/contracts-erc1155");
const contracts_erc20_1 = require("@0x/contracts-erc20");
const contracts_erc721_1 = require("@0x/contracts-erc721");
const contracts_exchange_1 = require("@0x/contracts-exchange");
const contracts_exchange_forwarder_1 = require("@0x/contracts-exchange-forwarder");
const contracts_staking_1 = require("@0x/contracts-staking");
const contracts_zero_ex_1 = require("@0x/contracts-zero-ex");
const utils_1 = require("@0x/utils");
const constants_1 = require("./utils/constants");
const token_info_1 = require("./utils/token_info");
const allArtifacts = Object.assign({}, contracts_asset_proxy_1.artifacts, contracts_coordinator_1.artifacts, contracts_dev_utils_1.artifacts, contracts_erc1155_1.artifacts, contracts_erc20_1.artifacts, contracts_erc721_1.artifacts, contracts_exchange_1.artifacts, contracts_exchange_forwarder_1.artifacts, contracts_staking_1.artifacts, contracts_zero_ex_1.artifacts, contracts_asset_proxy_1.artifacts);
const { NULL_ADDRESS } = constants_1.constants;
/**
 * Creates and deploys all the contracts that are required for the latest
 * version of the 0x protocol.
 * @param supportedProvider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 * @returns The addresses of the contracts that were deployed.
 */
function runMigrationsAsync(supportedProvider, txDefaults) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        const chainId = new utils_1.BigNumber(yield utils_1.providerUtils.getChainIdAsync(provider));
        // Proxies
        const erc20Proxy = yield contracts_asset_proxy_1.ERC20ProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC20Proxy, provider, txDefaults, allArtifacts);
        const erc721Proxy = yield contracts_asset_proxy_1.ERC721ProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC721Proxy, provider, txDefaults, allArtifacts);
        // ZRX
        const zrxToken = yield contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, provider, txDefaults, allArtifacts, '0x Protocol Token', 'ZRX', new utils_1.BigNumber(18), new utils_1.BigNumber(1000000000000000000000000000));
        // Ether token
        const etherToken = yield contracts_erc20_1.WETH9Contract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.WETH9, provider, txDefaults, allArtifacts);
        // Exchange
        const exchange = yield contracts_exchange_1.ExchangeContract.deployFrom0xArtifactAsync(contracts_exchange_1.artifacts.Exchange, provider, txDefaults, allArtifacts, chainId);
        // Dummy ERC20 tokens
        for (const token of token_info_1.erc20TokenInfo) {
            const totalSupply = new utils_1.BigNumber(1000000000000000000000000000);
            // tslint:disable-next-line:no-unused-variable
            const dummyErc20Token = yield contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, provider, txDefaults, allArtifacts, token.name, token.symbol, token.decimals, totalSupply);
        }
        // ERC721
        // tslint:disable-next-line:no-unused-variable
        const cryptoKittieToken = yield contracts_erc721_1.DummyERC721TokenContract.deployFrom0xArtifactAsync(contracts_erc721_1.artifacts.DummyERC721Token, provider, txDefaults, allArtifacts, token_info_1.erc721TokenInfo[0].name, token_info_1.erc721TokenInfo[0].symbol);
        // 1155 Asset Proxy
        const erc1155Proxy = yield contracts_asset_proxy_1.ERC1155ProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC1155Proxy, provider, txDefaults, allArtifacts);
        const staticCallProxy = yield contracts_asset_proxy_1.StaticCallProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.StaticCallProxy, provider, txDefaults, allArtifacts);
        const multiAssetProxy = yield contracts_asset_proxy_1.MultiAssetProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.MultiAssetProxy, provider, txDefaults, allArtifacts);
        yield erc20Proxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults);
        yield erc721Proxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults);
        yield erc1155Proxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults);
        yield multiAssetProxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults);
        // MultiAssetProxy
        yield erc20Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield erc721Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield erc1155Proxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield multiAssetProxy.registerAssetProxy(erc20Proxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield multiAssetProxy.registerAssetProxy(erc721Proxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield multiAssetProxy.registerAssetProxy(erc1155Proxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield multiAssetProxy.registerAssetProxy(staticCallProxy.address).awaitTransactionSuccessAsync(txDefaults);
        // Register the Asset Proxies to the Exchange
        yield exchange.registerAssetProxy(erc20Proxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield exchange.registerAssetProxy(erc721Proxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield exchange.registerAssetProxy(erc1155Proxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield exchange.registerAssetProxy(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield exchange.registerAssetProxy(staticCallProxy.address).awaitTransactionSuccessAsync(txDefaults);
        // CoordinatorRegistry
        const coordinatorRegistry = yield contracts_coordinator_1.CoordinatorRegistryContract.deployFrom0xArtifactAsync(contracts_coordinator_1.artifacts.CoordinatorRegistry, provider, txDefaults, allArtifacts);
        // Coordinator
        const coordinator = yield contracts_coordinator_1.CoordinatorContract.deployFrom0xArtifactAsync(contracts_coordinator_1.artifacts.Coordinator, provider, txDefaults, allArtifacts, exchange.address, chainId);
        // Dev Utils
        const devUtils = yield contracts_dev_utils_1.DevUtilsContract.deployWithLibrariesFrom0xArtifactAsync(contracts_dev_utils_1.artifacts.DevUtils, contracts_dev_utils_1.artifacts, provider, txDefaults, allArtifacts, exchange.address, NULL_ADDRESS, NULL_ADDRESS);
        // tslint:disable-next-line:no-unused-variable
        const erc1155DummyToken = yield contracts_erc1155_1.ERC1155MintableContract.deployFrom0xArtifactAsync(contracts_erc1155_1.artifacts.ERC1155Mintable, provider, txDefaults, allArtifacts);
        const erc20BridgeProxy = yield contracts_asset_proxy_1.ERC20BridgeProxyContract.deployFrom0xArtifactAsync(contracts_asset_proxy_1.artifacts.ERC20BridgeProxy, provider, txDefaults, allArtifacts);
        yield exchange.registerAssetProxy(erc20BridgeProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield erc20BridgeProxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults);
        yield erc20BridgeProxy.addAuthorizedAddress(multiAssetProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield multiAssetProxy.registerAssetProxy(erc20BridgeProxy.address).awaitTransactionSuccessAsync(txDefaults);
        const zrxProxy = erc20Proxy.address;
        const zrxVault = yield contracts_staking_1.ZrxVaultContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.ZrxVault, provider, txDefaults, allArtifacts, zrxProxy, zrxToken.address);
        // Note we use TestStakingContract as the deployed bytecode of a StakingContract
        // has the tokens hardcoded
        const stakingLogic = yield contracts_staking_1.TestStakingContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.TestStaking, provider, txDefaults, allArtifacts, etherToken.address, zrxVault.address);
        const stakingProxy = yield contracts_staking_1.StakingProxyContract.deployFrom0xArtifactAsync(contracts_staking_1.artifacts.StakingProxy, provider, txDefaults, allArtifacts, stakingLogic.address);
        yield erc20Proxy.addAuthorizedAddress(zrxVault.address).awaitTransactionSuccessAsync(txDefaults);
        // Reference the Proxy as the StakingContract for setup
        const stakingDel = yield new contracts_staking_1.TestStakingContract(stakingProxy.address, provider, txDefaults);
        yield stakingProxy.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync(txDefaults);
        yield stakingDel.addExchangeAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults);
        yield exchange.setProtocolFeeCollectorAddress(stakingProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield exchange.setProtocolFeeMultiplier(new utils_1.BigNumber(70000)).awaitTransactionSuccessAsync(txDefaults);
        yield zrxVault.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync(txDefaults);
        yield zrxVault.setStakingProxy(stakingProxy.address).awaitTransactionSuccessAsync(txDefaults);
        yield stakingLogic.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync(txDefaults);
        yield stakingLogic.addExchangeAddress(exchange.address).awaitTransactionSuccessAsync(txDefaults);
        // Forwarder
        // Deployed after Exchange and Staking is configured as it queries
        // in the constructor
        const { exchangeV2: exchangeV2Address } = contract_addresses_1.getContractAddressesForChainOrThrow(chainId.toNumber());
        const forwarder = yield contracts_exchange_forwarder_1.ForwarderContract.deployFrom0xArtifactAsync(contracts_exchange_forwarder_1.artifacts.Forwarder, provider, txDefaults, allArtifacts, exchange.address, exchangeV2Address || NULL_ADDRESS, etherToken.address);
        // JAM
        // tslint:disable-next-line:no-unused-variable
        const jamToken = yield contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, provider, txDefaults, allArtifacts, 'JAM Token', 'JAM', new utils_1.BigNumber(18), new utils_1.BigNumber(1000000000000000000000000000));
        // Exchange Proxy //////////////////////////////////////////////////////////
        const bridgeAdapter = yield contracts_zero_ex_1.BridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.BridgeAdapter, provider, txDefaults, allArtifacts, {
            balancerBridge: NULL_ADDRESS,
            curveBridge: NULL_ADDRESS,
            kyberBridge: NULL_ADDRESS,
            mooniswapBridge: NULL_ADDRESS,
            mStableBridge: NULL_ADDRESS,
            oasisBridge: NULL_ADDRESS,
            uniswapBridge: NULL_ADDRESS,
            uniswapV2Bridge: NULL_ADDRESS,
            kyberNetworkProxy: NULL_ADDRESS,
            oasis: NULL_ADDRESS,
            uniswapV2Router: NULL_ADDRESS,
            uniswapExchangeFactory: NULL_ADDRESS,
            mStable: NULL_ADDRESS,
            shellBridge: NULL_ADDRESS,
            shell: NULL_ADDRESS,
            weth: etherToken.address,
        });
        const exchangeProxy = yield contracts_zero_ex_1.fullMigrateAsync(txDefaults.from, provider, txDefaults);
        const exchangeProxyAllowanceTargetAddress = yield exchangeProxy.getAllowanceTarget().callAsync();
        const exchangeProxyFlashWalletAddress = yield exchangeProxy.getTransformWallet().callAsync();
        // Deploy transformers.
        const wethTransformer = yield contracts_zero_ex_1.WethTransformerContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.WethTransformer, provider, txDefaults, allArtifacts, etherToken.address);
        const payTakerTransformer = yield contracts_zero_ex_1.PayTakerTransformerContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.PayTakerTransformer, provider, txDefaults, allArtifacts);
        const affiliateFeeTransformer = yield contracts_zero_ex_1.AffiliateFeeTransformerContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.AffiliateFeeTransformer, provider, txDefaults, allArtifacts);
        const fillQuoteTransformer = yield contracts_zero_ex_1.FillQuoteTransformerContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.FillQuoteTransformer, provider, txDefaults, allArtifacts, exchange.address, bridgeAdapter.address);
        const contractAddresses = {
            erc20Proxy: erc20Proxy.address,
            erc721Proxy: erc721Proxy.address,
            erc1155Proxy: erc1155Proxy.address,
            zrxToken: zrxToken.address,
            etherToken: etherToken.address,
            exchange: exchange.address,
            assetProxyOwner: NULL_ADDRESS,
            erc20BridgeProxy: erc20BridgeProxy.address,
            zeroExGovernor: NULL_ADDRESS,
            forwarder: forwarder.address,
            coordinatorRegistry: coordinatorRegistry.address,
            coordinator: coordinator.address,
            multiAssetProxy: multiAssetProxy.address,
            staticCallProxy: staticCallProxy.address,
            devUtils: devUtils.address,
            exchangeV2: exchangeV2Address || NULL_ADDRESS,
            zrxVault: zrxVault.address,
            staking: stakingLogic.address,
            stakingProxy: stakingProxy.address,
            uniswapBridge: NULL_ADDRESS,
            eth2DaiBridge: NULL_ADDRESS,
            kyberBridge: NULL_ADDRESS,
            erc20BridgeSampler: NULL_ADDRESS,
            chaiBridge: NULL_ADDRESS,
            dydxBridge: NULL_ADDRESS,
            curveBridge: NULL_ADDRESS,
            uniswapV2Bridge: NULL_ADDRESS,
            godsUnchainedValidator: NULL_ADDRESS,
            broker: NULL_ADDRESS,
            chainlinkStopLimit: NULL_ADDRESS,
            maximumGasPrice: NULL_ADDRESS,
            dexForwarderBridge: NULL_ADDRESS,
            multiBridge: NULL_ADDRESS,
            balancerBridge: NULL_ADDRESS,
            bancorBridge: NULL_ADDRESS,
            exchangeProxyGovernor: NULL_ADDRESS,
            mStableBridge: NULL_ADDRESS,
            mooniswapBridge: NULL_ADDRESS,
            sushiswapBridge: NULL_ADDRESS,
            shellBridge: NULL_ADDRESS,
            dodoBridge: NULL_ADDRESS,
            exchangeProxy: exchangeProxy.address,
            exchangeProxyAllowanceTarget: exchangeProxyAllowanceTargetAddress,
            exchangeProxyTransformerDeployer: txDefaults.from,
            exchangeProxyFlashWallet: exchangeProxyFlashWalletAddress,
            transformers: {
                wethTransformer: wethTransformer.address,
                payTakerTransformer: payTakerTransformer.address,
                fillQuoteTransformer: fillQuoteTransformer.address,
                affiliateFeeTransformer: affiliateFeeTransformer.address,
            },
        };
        return contractAddresses;
    });
}
exports.runMigrationsAsync = runMigrationsAsync;
let _cachedContractAddresses;
/**
 * Exactly like runMigrationsAsync but will only run the migrations the first
 * time it is called. Any subsequent calls will return the cached contract
 * addresses.
 * @param provider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 * @returns The addresses of the contracts that were deployed.
 */
function runMigrationsOnceAsync(provider, txDefaults) {
    return __awaiter(this, void 0, void 0, function* () {
        if (_cachedContractAddresses !== undefined) {
            return _cachedContractAddresses;
        }
        _cachedContractAddresses = yield runMigrationsAsync(provider, txDefaults);
        return _cachedContractAddresses;
    });
}
exports.runMigrationsOnceAsync = runMigrationsOnceAsync;
//# sourceMappingURL=migration.js.map