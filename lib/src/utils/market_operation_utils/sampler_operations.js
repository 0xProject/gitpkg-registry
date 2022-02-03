"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamplerOperations = exports.BATCH_SOURCE_FILTERS = exports.TWO_HOP_SOURCE_FILTERS = void 0;
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const AaveV2Sampler_1 = require("../../noop_samplers/AaveV2Sampler");
const aave_reserves_cache_1 = require("./aave_reserves_cache");
const bridge_source_utils_1 = require("./bridge_source_utils");
const compound_ctoken_cache_1 = require("./compound_ctoken_cache");
const constants_1 = require("./constants");
const liquidity_provider_utils_1 = require("./liquidity_provider_utils");
const multihop_utils_1 = require("./multihop_utils");
const pools_cache_1 = require("./pools_cache");
const sampler_contract_operation_1 = require("./sampler_contract_operation");
const sampler_no_operation_1 = require("./sampler_no_operation");
const source_filters_1 = require("./source_filters");
const types_1 = require("./types");
/**
 * Source filters for `getTwoHopBuyQuotes()` and `getTwoHopSellQuotes()`.
 */
exports.TWO_HOP_SOURCE_FILTERS = source_filters_1.SourceFilters.all().exclude([
    types_1.ERC20BridgeSource.MultiHop,
    types_1.ERC20BridgeSource.Native,
]);
/**
 * Source filters for `getSellQuotes()` and `getBuyQuotes()`.
 */
exports.BATCH_SOURCE_FILTERS = source_filters_1.SourceFilters.all().exclude([types_1.ERC20BridgeSource.MultiHop, types_1.ERC20BridgeSource.Native]);
// tslint:disable:no-inferred-empty-object-type no-unbound-method
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
class SamplerOperations {
    constructor(chainId, _samplerContract, poolsCaches, tokenAdjacencyGraph = { default: [] }, liquidityProviderRegistry = {}, bancorServiceFn = () => __awaiter(this, void 0, void 0, function* () { return undefined; })) {
        this.chainId = chainId;
        this._samplerContract = _samplerContract;
        this.tokenAdjacencyGraph = tokenAdjacencyGraph;
        this.liquidityProviderRegistry = Object.assign(Object.assign({}, constants_1.LIQUIDITY_PROVIDER_REGISTRY_BY_CHAIN_ID[chainId]), liquidityProviderRegistry);
        this.poolsCaches = poolsCaches
            ? poolsCaches
            : {
                [types_1.ERC20BridgeSource.BalancerV2]: new pools_cache_1.BalancerV2PoolsCache(chainId),
                [types_1.ERC20BridgeSource.Beethovenx]: new pools_cache_1.BalancerV2PoolsCache(chainId, constants_1.BEETHOVEN_X_SUBGRAPH_URL_BY_CHAIN[chainId]),
                [types_1.ERC20BridgeSource.Balancer]: new pools_cache_1.BalancerPoolsCache(),
                [types_1.ERC20BridgeSource.Cream]: new pools_cache_1.CreamPoolsCache(),
            };
        const aaveSubgraphUrl = constants_1.AAVE_V2_SUBGRAPH_URL_BY_CHAIN_ID[chainId];
        if (aaveSubgraphUrl) {
            this.aaveReservesCache = new aave_reserves_cache_1.AaveV2ReservesCache(aaveSubgraphUrl);
        }
        const compoundApiUrl = constants_1.COMPOUND_API_URL_BY_CHAIN_ID[chainId];
        if (compoundApiUrl) {
            this.compoundCTokenCache = new compound_ctoken_cache_1.CompoundCTokenCache(compoundApiUrl, constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId]);
        }
        // Initialize the Bancor service, fetching paths in the background
        bancorServiceFn()
            .then(service => (this._bancorService = service))
            .catch( /* do nothing */);
    }
    static constant(result) {
        return {
            encodeCall: () => '0x',
            handleCallResults: _callResults => result,
            handleRevert: _callResults => result,
        };
    }
    getTokenDecimals(tokens) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getTokenDecimals,
            params: [tokens],
        });
    }
    isAddressContract(address) {
        return {
            encodeCall: () => this._samplerContract.isContract(address).getABIEncodedTransactionData(),
            handleCallResults: (callResults) => this._samplerContract.getABIDecodedReturnData('isContract', callResults),
            handleRevert: () => {
                /* should never happen */
                throw new Error('Invalid address for isAddressContract');
            },
        };
    }
    setSampleValues(sampleValues) {
        return {
            encodeCall: () => this._samplerContract.setSampleValues(sampleValues).getABIEncodedTransactionData(),
            handleCallResults: (_callResults) => true,
            handleRevert: () => {
                /* should never happen */
                throw new Error('Invalid result for setting sample values');
            },
        };
    }
    getGasLeft() {
        return {
            encodeCall: () => this._samplerContract.getGasLeft().getABIEncodedTransactionData(),
            handleCallResults: (callResults) => this._samplerContract.getABIDecodedReturnData('getGasLeft', callResults),
            handleRevert: () => {
                /* should never happen */
                throw new Error('Invalid result for getGasLeft');
            },
        };
    }
    getBlockNumber() {
        return {
            encodeCall: () => this._samplerContract.getBlockNumber().getABIEncodedTransactionData(),
            handleCallResults: (callResults) => this._samplerContract.getABIDecodedReturnData('getBlockNumber', callResults),
            handleRevert: () => {
                /* should never happen */
                throw new Error('Invalid result for getBlockNumber');
            },
        };
    }
    getLimitOrderFillableTakerAmounts(orders, exchangeAddress) {
        // Skip checking empty or invalid orders on-chain, returning a constant
        if (orders.length === 0) {
            return SamplerOperations.constant([]);
        }
        if (orders.length === 1 && orders[0].order.maker === constants_1.NULL_ADDRESS) {
            return SamplerOperations.constant([constants_1.ZERO_AMOUNT]);
        }
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getLimitOrderFillableTakerAssetAmounts,
            // tslint:disable-next-line:no-unnecessary-type-assertion
            params: [orders.map(o => o.order), orders.map(o => o.signature), exchangeAddress],
        });
    }
    getLimitOrderFillableMakerAmounts(orders, exchangeAddress) {
        // Skip checking empty or invalid orders on-chain, returning a constant
        if (orders.length === 0) {
            return SamplerOperations.constant([]);
        }
        if (orders.length === 1 && orders[0].order.maker === constants_1.NULL_ADDRESS) {
            return SamplerOperations.constant([constants_1.ZERO_AMOUNT]);
        }
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getLimitOrderFillableMakerAssetAmounts,
            // tslint:disable-next-line:no-unnecessary-type-assertion
            params: [orders.map(o => o.order), orders.map(o => o.signature), exchangeAddress],
        });
    }
    getKyberSellQuotes(kyberOpts, reserveOffset, makerToken, takerToken, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromKyberNetworkGlobal,
            params: [Object.assign(Object.assign({}, kyberOpts), { reserveOffset, hint: constants_1.NULL_BYTES }), takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [reserveId, hint, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromKyberNetworkGlobal', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                fillData.networkProxy = kyberOpts.networkProxy;
                return bridge_source_utils_1.isAllowedKyberReserveId(reserveId) ? samples : [];
            },
        });
    }
    getKyberBuyQuotes(kyberOpts, reserveOffset, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromKyberNetworkGlobal,
            params: [Object.assign(Object.assign({}, kyberOpts), { reserveOffset, hint: constants_1.NULL_BYTES }), takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [reserveId, hint, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromKyberNetworkGlobal', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                fillData.networkProxy = kyberOpts.networkProxy;
                return bridge_source_utils_1.isAllowedKyberReserveId(reserveId) ? samples : [];
            },
        });
    }
    getKyberDmmSellQuotes(router, tokenAddressPath, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.KyberDmm,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromKyberDmmGlobal,
            params: [router, tokenAddressPath],
            callback: (callResults, fillData) => {
                const [pools, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromKyberDmmGlobal', callResults);
                fillData.poolsPath = pools;
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                return samples;
            },
        });
    }
    getKyberDmmBuyQuotes(router, tokenAddressPath, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.KyberDmm,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromKyberDmmGlobal,
            params: [router, tokenAddressPath],
            callback: (callResults, fillData) => {
                const [pools, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromKyberDmmGlobal', callResults);
                fillData.poolsPath = pools;
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                return samples;
            },
        });
    }
    getUniswapSellQuotes(router, makerToken, takerToken, takerFillAmounts) {
        // Uniswap uses ETH instead of WETH, represented by address(0)
        const uniswapTakerToken = takerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : takerToken;
        const uniswapMakerToken = makerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : makerToken;
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Uniswap,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswapGlobal,
            params: [router, uniswapTakerToken, uniswapMakerToken],
        });
    }
    getUniswapBuyQuotes(router, makerToken, takerToken, _makerFillAmounts) {
        // Uniswap uses ETH instead of WETH, represented by address(0)
        const uniswapTakerToken = takerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : takerToken;
        const uniswapMakerToken = makerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : makerToken;
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Uniswap,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswapGlobal,
            params: [router, uniswapTakerToken, uniswapMakerToken],
        });
    }
    getUniswapV2SellQuotes(router, tokenAddressPath, _takerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV2) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { tokenAddressPath, router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswapV2Global,
            params: [router, tokenAddressPath],
        });
    }
    getUniswapV2BuyQuotes(router, tokenAddressPath, _makerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV2) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { tokenAddressPath, router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswapV2Global,
            params: [router, tokenAddressPath],
        });
    }
    getLiquidityProviderSellQuotes(providerAddress, makerToken, takerToken, _takerFillAmounts, gasCost, source = types_1.ERC20BridgeSource.LiquidityProvider) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: {
                poolAddress: providerAddress,
                gasCost,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromLiquidityProviderGlobal,
            params: [providerAddress, takerToken, makerToken],
        });
    }
    getLiquidityProviderBuyQuotes(providerAddress, makerToken, takerToken, _makerFillAmounts, gasCost, source = types_1.ERC20BridgeSource.LiquidityProvider) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: {
                poolAddress: providerAddress,
                gasCost,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromLiquidityProviderGlobal,
            params: [providerAddress, takerToken, makerToken],
        });
    }
    getCurveSellQuotes(pool, fromTokenIdx, toTokenIdx, _takerFillAmounts, source = types_1.ERC20BridgeSource.Curve) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCurveGlobal,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
            ],
        });
    }
    getCurveBuyQuotes(pool, fromTokenIdx, toTokenIdx, _makerFillAmounts, source = types_1.ERC20BridgeSource.Curve) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCurveGlobal,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
            ],
        });
    }
    getSmoothySellQuotes(pool, fromTokenIdx, toTokenIdx, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Smoothy,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromSmoothyGlobal,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
            ],
        });
    }
    getSmoothyBuyQuotes(pool, fromTokenIdx, toTokenIdx, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Smoothy,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromSmoothyGlobal,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
            ],
        });
    }
    getBalancerV2SellQuotes(poolInfo, makerToken, takerToken, _takerFillAmounts, source) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: poolInfo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBalancerV2Global,
            params: [poolInfo, takerToken, makerToken],
        });
    }
    getBalancerV2BuyQuotes(poolInfo, makerToken, takerToken, _makerFillAmounts, source) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: poolInfo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBalancerV2Global,
            params: [poolInfo, takerToken, makerToken],
        });
    }
    getBalancerSellQuotes(poolAddress, makerToken, takerToken, _takerFillAmounts, source) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBalancerGlobal,
            params: [poolAddress, takerToken, makerToken],
        });
    }
    getBalancerBuyQuotes(poolAddress, makerToken, takerToken, _makerFillAmounts, source) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBalancerGlobal,
            params: [poolAddress, takerToken, makerToken],
        });
    }
    getMStableSellQuotes(router, makerToken, takerToken, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MStable,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMStableGlobal,
            params: [router, takerToken, makerToken],
        });
    }
    getMStableBuyQuotes(router, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MStable,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMStableGlobal,
            params: [router, takerToken, makerToken],
        });
    }
    getBancorSellQuotes(registry, makerToken, takerToken, _takerFillAmounts) {
        const paths = this._bancorService ? this._bancorService.getPaths(takerToken, makerToken) : [];
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Bancor,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBancorGlobal,
            params: [{ registry, paths }, takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [networkAddress, path, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromBancorGlobal', callResults);
                fillData.networkAddress = networkAddress;
                fillData.path = path;
                return samples;
            },
        });
    }
    // Unimplemented
    getBancorBuyQuotes(registry, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Bancor,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBancorGlobal,
            params: [{ registry, paths: [] }, takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [networkAddress, path, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromBancorGlobal', callResults);
                fillData.networkAddress = networkAddress;
                fillData.path = path;
                return samples;
            },
        });
    }
    getMooniswapSellQuotes(registry, makerToken, takerToken, _takerFillAmounts) {
        // Mooniswap uses ETH instead of WETH, represented by address(0)
        const mooniswapTakerToken = takerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : takerToken;
        const mooniswapMakerToken = makerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : makerToken;
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMooniswapGlobal,
            params: [registry, mooniswapTakerToken, mooniswapMakerToken],
            callback: (callResults, fillData) => {
                const [poolAddress, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromMooniswapGlobal', callResults);
                fillData.poolAddress = poolAddress;
                return samples;
            },
        });
    }
    getMooniswapBuyQuotes(registry, makerToken, takerToken, _makerFillAmounts) {
        // Mooniswap uses ETH instead of WETH, represented by address(0)
        const mooniswapTakerToken = takerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : takerToken;
        const mooniswapMakerToken = makerToken === constants_1.NATIVE_FEE_TOKEN_BY_CHAIN_ID[this.chainId] ? constants_1.NULL_ADDRESS : makerToken;
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMooniswapGlobal,
            params: [registry, mooniswapTakerToken, mooniswapMakerToken],
            callback: (callResults, fillData) => {
                const [poolAddress, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromMooniswapGlobal', callResults);
                fillData.poolAddress = poolAddress;
                return samples;
            },
        });
    }
    getUniswapV3SellQuotes(router, quoter, tokenAddressPath, takerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV3) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswapV3Global,
            params: [quoter, tokenAddressPath],
            callback: (callResults, fillData) => {
                const [paths, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromUniswapV3Global', callResults);
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                fillData.pathAmounts = paths.map((uniswapPath, i) => ({
                    uniswapPath,
                    inputAmount: takerFillAmounts[i],
                }));
                return samples;
            },
        });
    }
    getUniswapV3BuyQuotes(router, quoter, tokenAddressPath, makerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV3) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswapV3Global,
            params: [quoter, tokenAddressPath],
            callback: (callResults, fillData) => {
                const [paths, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromUniswapV3Global', callResults);
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                fillData.pathAmounts = paths.map((uniswapPath, i) => ({
                    uniswapPath,
                    inputAmount: makerFillAmounts[i],
                }));
                return samples;
            },
        });
    }
    getTwoHopSellQuotes(sources, makerToken, takerToken, sellAmount) {
        const _sources = exports.TWO_HOP_SOURCE_FILTERS.getAllowed(sources);
        if (_sources.length === 0) {
            return SamplerOperations.constant([]);
        }
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, this.tokenAdjacencyGraph);
        const subOps = intermediateTokens.map(intermediateToken => {
            const firstHopOps = this._getSellQuoteOperations(_sources, intermediateToken, takerToken, [constants_1.ZERO_AMOUNT]);
            const secondHopOps = this._getSellQuoteOperations(_sources, makerToken, intermediateToken, [constants_1.ZERO_AMOUNT]);
            return new sampler_contract_operation_1.SamplerContractOperation({
                contract: this._samplerContract,
                source: types_1.ERC20BridgeSource.MultiHop,
                function: this._samplerContract.sampleTwoHopSell,
                params: [firstHopOps.map(op => op.encodeCall()), secondHopOps.map(op => op.encodeCall()), sellAmount],
                fillData: { intermediateToken },
                callback: (callResults, fillData) => {
                    const [firstHop, secondHop, buyAmount] = this._samplerContract.getABIDecodedReturnData('sampleTwoHopSell', callResults);
                    // Ensure the hop sources are set even when the buy amount is zero
                    fillData.firstHopSource = firstHopOps[firstHop.sourceIndex.toNumber()];
                    fillData.secondHopSource = secondHopOps[secondHop.sourceIndex.toNumber()];
                    if (buyAmount.isZero()) {
                        return [constants_1.ZERO_AMOUNT];
                    }
                    fillData.firstHopSource.handleCallResults(firstHop.returnData);
                    fillData.secondHopSource.handleCallResults(secondHop.returnData);
                    return [buyAmount];
                },
            });
        });
        return this._createBatch(subOps, (samples) => {
            return subOps.map((op, i) => {
                return {
                    source: op.source,
                    output: samples[i][0],
                    input: sellAmount,
                    fillData: op.fillData,
                };
            });
        }, () => {
            utils_1.logUtils.warn('SamplerContractOperation: Two hop sampler reverted');
            return [];
        });
    }
    getTwoHopBuyQuotes(sources, makerToken, takerToken, buyAmount) {
        const _sources = exports.TWO_HOP_SOURCE_FILTERS.getAllowed(sources);
        if (_sources.length === 0) {
            return SamplerOperations.constant([]);
        }
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, this.tokenAdjacencyGraph);
        const subOps = intermediateTokens.map(intermediateToken => {
            const firstHopOps = this._getBuyQuoteOperations(_sources, intermediateToken, takerToken, [
                new utils_1.BigNumber(0),
            ]);
            const secondHopOps = this._getBuyQuoteOperations(_sources, makerToken, intermediateToken, [
                new utils_1.BigNumber(0),
            ]);
            return new sampler_contract_operation_1.SamplerContractOperation({
                contract: this._samplerContract,
                source: types_1.ERC20BridgeSource.MultiHop,
                function: this._samplerContract.sampleTwoHopBuy,
                params: [firstHopOps.map(op => op.encodeCall()), secondHopOps.map(op => op.encodeCall()), buyAmount],
                fillData: { intermediateToken },
                callback: (callResults, fillData) => {
                    const [firstHop, secondHop, sellAmount] = this._samplerContract.getABIDecodedReturnData('sampleTwoHopBuy', callResults);
                    if (sellAmount.isEqualTo(constants_1.MAX_UINT256)) {
                        return [sellAmount];
                    }
                    fillData.firstHopSource = firstHopOps[firstHop.sourceIndex.toNumber()];
                    fillData.secondHopSource = secondHopOps[secondHop.sourceIndex.toNumber()];
                    fillData.firstHopSource.handleCallResults(firstHop.returnData);
                    fillData.secondHopSource.handleCallResults(secondHop.returnData);
                    return [sellAmount];
                },
            });
        });
        return this._createBatch(subOps, (samples) => {
            return subOps.map((op, i) => {
                return {
                    source: op.source,
                    output: samples[i][0],
                    input: buyAmount,
                    fillData: op.fillData,
                };
            });
        }, () => {
            utils_1.logUtils.warn('SamplerContractOperation: Two hop sampler reverted');
            return [];
        });
    }
    getShellSellQuotes(poolAddress, makerToken, takerToken, _takerFillAmounts, source = types_1.ERC20BridgeSource.Shell) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromShellGlobal,
            params: [poolAddress, takerToken, makerToken],
        });
    }
    getShellBuyQuotes(poolAddress, makerToken, takerToken, _makerFillAmounts, source = types_1.ERC20BridgeSource.Shell) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromShellGlobal,
            params: [poolAddress, takerToken, makerToken],
        });
    }
    getDODOSellQuotes(opts, makerToken, takerToken, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Dodo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromDODOGlobal,
            params: [opts, takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODOGlobal', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                fillData.helperAddress = opts.helper;
                return samples;
            },
        });
    }
    getDODOBuyQuotes(opts, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Dodo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromDODOGlobal,
            params: [opts, takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromDODOGlobal', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                fillData.helperAddress = opts.helper;
                return samples;
            },
        });
    }
    getDODOV2SellQuotes(registry, offset, makerToken, takerToken, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.DodoV2,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromDODOV2Global,
            params: [registry, offset, takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODOV2Global', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return samples;
            },
        });
    }
    getDODOV2BuyQuotes(registry, offset, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.DodoV2,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromDODOV2Global,
            params: [registry, offset, takerToken, makerToken],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODOV2Global', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return samples;
            },
        });
    }
    getMakerPsmSellQuotes(psmInfo, makerToken, takerToken, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MakerPsm,
            fillData: Object.assign({ isSellOperation: true, takerToken,
                makerToken }, psmInfo),
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMakerPsmGlobal,
            params: [psmInfo, takerToken, makerToken],
        });
    }
    getMakerPsmBuyQuotes(psmInfo, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MakerPsm,
            fillData: Object.assign({ isSellOperation: false, takerToken,
                makerToken }, psmInfo),
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMakerPsmGlobal,
            params: [psmInfo, takerToken, makerToken],
        });
    }
    getLidoSellQuotes(lidoInfo, makerToken, takerToken, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Lido,
            fillData: {
                takerToken,
                stEthTokenAddress: lidoInfo.stEthToken,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromLidoGlobal,
            params: [lidoInfo, takerToken, makerToken],
        });
    }
    getLidoBuyQuotes(lidoInfo, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Lido,
            fillData: {
                takerToken,
                stEthTokenAddress: lidoInfo.stEthToken,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromLidoGlobal,
            params: [lidoInfo, takerToken, makerToken],
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    getAaveV2SellQuotes(aaveInfo, makerToken, takerToken, takerFillAmounts) {
        return new sampler_no_operation_1.SamplerNoOperation({
            source: types_1.ERC20BridgeSource.AaveV2,
            fillData: Object.assign(Object.assign({}, aaveInfo), { takerToken }),
            callback: () => AaveV2Sampler_1.AaveV2Sampler.sampleSellsFromAaveV2(aaveInfo, takerToken, makerToken, takerFillAmounts),
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    getAaveV2BuyQuotes(aaveInfo, makerToken, takerToken, makerFillAmounts) {
        return new sampler_no_operation_1.SamplerNoOperation({
            source: types_1.ERC20BridgeSource.AaveV2,
            fillData: Object.assign(Object.assign({}, aaveInfo), { takerToken }),
            callback: () => AaveV2Sampler_1.AaveV2Sampler.sampleBuysFromAaveV2(aaveInfo, takerToken, makerToken, makerFillAmounts),
        });
    }
    getCompoundSellQuotes(cToken, makerToken, takerToken, _takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Compound,
            fillData: { cToken, takerToken, makerToken },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCompoundGlobal,
            params: [cToken, takerToken, makerToken],
        });
    }
    getCompoundBuyQuotes(cToken, makerToken, takerToken, _makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Compound,
            fillData: { cToken, takerToken, makerToken },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCompoundGlobal,
            params: [cToken, takerToken, makerToken],
        });
    }
    getMedianSellRate(sources, makerToken, takerToken, takerFillAmount) {
        if (makerToken.toLowerCase() === takerToken.toLowerCase()) {
            return SamplerOperations.constant(new utils_1.BigNumber(1));
        }
        const subOps = this._getSellQuoteOperations(sources, makerToken, takerToken, [takerFillAmount], {
            default: [],
        });
        return this._createBatch(subOps, (samples) => {
            if (samples.length === 0) {
                return constants_1.ZERO_AMOUNT;
            }
            const flatSortedSamples = samples
                .reduce((acc, v) => acc.concat(...v))
                .filter(v => !v.isZero())
                .sort((a, b) => a.comparedTo(b));
            if (flatSortedSamples.length === 0) {
                return constants_1.ZERO_AMOUNT;
            }
            const medianSample = flatSortedSamples[Math.floor(flatSortedSamples.length / 2)];
            return medianSample.div(takerFillAmount);
        }, () => constants_1.ZERO_AMOUNT);
    }
    getSellQuotes(sources, makerToken, takerToken, takerFillAmounts) {
        const subOps = this._getSellQuoteOperations(sources, makerToken, takerToken, takerFillAmounts);
        return this._createBatch(subOps, (samples) => {
            return subOps.map((op, i) => {
                return samples[i].map((output, j) => ({
                    source: op.source,
                    output,
                    input: takerFillAmounts[j],
                    fillData: op.fillData,
                }));
            });
        }, () => []);
    }
    getBuyQuotes(sources, makerToken, takerToken, makerFillAmounts) {
        const subOps = this._getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts);
        return this._createBatch(subOps, (samples) => {
            return subOps.map((op, i) => {
                return samples[i].map((output, j) => ({
                    source: op.source,
                    output,
                    input: makerFillAmounts[j],
                    fillData: op.fillData,
                }));
            });
        }, () => []);
    }
    _getSellQuoteOperations(sources, makerToken, takerToken, takerFillAmounts, tokenAdjacencyGraph = this.tokenAdjacencyGraph) {
        // Find the adjacent tokens in the provided tooken adjacency graph,
        // e.g if this is DAI->USDC we may check for DAI->WETH->USDC
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, tokenAdjacencyGraph);
        // Drop out MultiHop and Native as we do not query those here.
        const _sources = constants_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[this.chainId]
            .exclude([types_1.ERC20BridgeSource.MultiHop, types_1.ERC20BridgeSource.Native])
            .getAllowed(sources);
        const allOps = _.flatten(_sources.map((source) => {
            if (bridge_source_utils_1.isBadTokenForSource(makerToken, source) || bridge_source_utils_1.isBadTokenForSource(takerToken, source)) {
                return [];
            }
            switch (source) {
                case types_1.ERC20BridgeSource.Eth2Dai:
                    return [];
                case types_1.ERC20BridgeSource.Uniswap:
                    return bridge_source_utils_1.isValidAddress(constants_1.UNISWAPV1_ROUTER_BY_CHAIN_ID[this.chainId])
                        ? this.getUniswapSellQuotes(constants_1.UNISWAPV1_ROUTER_BY_CHAIN_ID[this.chainId], makerToken, takerToken, takerFillAmounts)
                        : [];
                case types_1.ERC20BridgeSource.UniswapV2:
                case types_1.ERC20BridgeSource.SushiSwap:
                case types_1.ERC20BridgeSource.CryptoCom:
                case types_1.ERC20BridgeSource.PancakeSwap:
                case types_1.ERC20BridgeSource.PancakeSwapV2:
                case types_1.ERC20BridgeSource.BakerySwap:
                case types_1.ERC20BridgeSource.ApeSwap:
                case types_1.ERC20BridgeSource.CafeSwap:
                case types_1.ERC20BridgeSource.CheeseSwap:
                case types_1.ERC20BridgeSource.JulSwap:
                case types_1.ERC20BridgeSource.QuickSwap:
                case types_1.ERC20BridgeSource.ComethSwap:
                case types_1.ERC20BridgeSource.Dfyn:
                case types_1.ERC20BridgeSource.WaultSwap:
                case types_1.ERC20BridgeSource.Polydex:
                case types_1.ERC20BridgeSource.ShibaSwap:
                case types_1.ERC20BridgeSource.JetSwap:
                case types_1.ERC20BridgeSource.Pangolin:
                case types_1.ERC20BridgeSource.TraderJoe:
                case types_1.ERC20BridgeSource.UbeSwap:
                case types_1.ERC20BridgeSource.SpiritSwap:
                case types_1.ERC20BridgeSource.SpookySwap:
                case types_1.ERC20BridgeSource.MorpheusSwap:
                    const uniLikeRouter = bridge_source_utils_1.uniswapV2LikeRouterAddress(this.chainId, source);
                    if (!bridge_source_utils_1.isValidAddress(uniLikeRouter)) {
                        return [];
                    }
                    return [
                        [takerToken, makerToken],
                        ...intermediateTokens.map(t => [takerToken, t, makerToken]),
                    ].map(path => this.getUniswapV2SellQuotes(uniLikeRouter, path, takerFillAmounts, source));
                case types_1.ERC20BridgeSource.KyberDmm:
                    const kyberDmmRouter = constants_1.KYBER_DMM_ROUTER_BY_CHAIN_ID[this.chainId];
                    if (!bridge_source_utils_1.isValidAddress(kyberDmmRouter)) {
                        return [];
                    }
                    return this.getKyberDmmSellQuotes(kyberDmmRouter, [takerToken, makerToken], takerFillAmounts);
                case types_1.ERC20BridgeSource.Kyber:
                    return bridge_source_utils_1.getKyberOffsets().map(offset => this.getKyberSellQuotes(constants_1.KYBER_CONFIG_BY_CHAIN_ID[this.chainId], offset, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                case types_1.ERC20BridgeSource.CurveV2:
                case types_1.ERC20BridgeSource.Swerve:
                case types_1.ERC20BridgeSource.SnowSwap:
                case types_1.ERC20BridgeSource.Nerve:
                case types_1.ERC20BridgeSource.Synapse:
                case types_1.ERC20BridgeSource.Belt:
                case types_1.ERC20BridgeSource.Ellipsis:
                case types_1.ERC20BridgeSource.Saddle:
                case types_1.ERC20BridgeSource.XSigma:
                case types_1.ERC20BridgeSource.FirebirdOneSwap:
                case types_1.ERC20BridgeSource.IronSwap:
                case types_1.ERC20BridgeSource.ACryptos:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getCurveSellQuotes(pool, pool.takerTokenIdx, pool.makerTokenIdx, takerFillAmounts, source));
                case types_1.ERC20BridgeSource.Smoothy:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getSmoothySellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.Shell:
                case types_1.ERC20BridgeSource.Component:
                    return bridge_source_utils_1.getShellLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getShellSellQuotes(pool, makerToken, takerToken, takerFillAmounts, source));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    return liquidity_provider_utils_1.getLiquidityProvidersForPair(this.liquidityProviderRegistry, takerToken, makerToken).map(({ providerAddress, gasCost }) => this.getLiquidityProviderSellQuotes(providerAddress, makerToken, takerToken, takerFillAmounts, gasCost));
                case types_1.ERC20BridgeSource.MStable:
                    return bridge_source_utils_1.getShellLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getMStableSellQuotes(pool, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.Mooniswap:
                    return [
                        ...constants_1.MOONISWAP_REGISTRIES_BY_CHAIN_ID[this.chainId]
                            .filter(r => bridge_source_utils_1.isValidAddress(r))
                            .map(registry => this.getMooniswapSellQuotes(registry, makerToken, takerToken, takerFillAmounts)),
                    ];
                case types_1.ERC20BridgeSource.Balancer:
                    return (this.poolsCaches[types_1.ERC20BridgeSource.Balancer].getCachedPoolAddressesForPair(takerToken, makerToken) || []).map(balancerPool => this.getBalancerSellQuotes(balancerPool, makerToken, takerToken, takerFillAmounts, types_1.ERC20BridgeSource.Balancer));
                case types_1.ERC20BridgeSource.BalancerV2:
                case types_1.ERC20BridgeSource.Beethovenx:
                    const poolIds = this.poolsCaches[source].getCachedPoolAddressesForPair(takerToken, makerToken) || [];
                    const vault = source === types_1.ERC20BridgeSource.BalancerV2
                        ? constants_1.BALANCER_V2_VAULT_ADDRESS_BY_CHAIN[this.chainId]
                        : constants_1.BEETHOVEN_X_VAULT_ADDRESS_BY_CHAIN[this.chainId];
                    if (vault === constants_1.NULL_ADDRESS) {
                        return [];
                    }
                    return poolIds.map(poolId => this.getBalancerV2SellQuotes({ poolId, vault }, makerToken, takerToken, takerFillAmounts, source));
                case types_1.ERC20BridgeSource.Cream:
                    return (this.poolsCaches[types_1.ERC20BridgeSource.Cream].getCachedPoolAddressesForPair(takerToken, makerToken) || []).map(creamPool => this.getBalancerSellQuotes(creamPool, makerToken, takerToken, takerFillAmounts, types_1.ERC20BridgeSource.Cream));
                case types_1.ERC20BridgeSource.Dodo:
                    if (!bridge_source_utils_1.isValidAddress(constants_1.DODOV1_CONFIG_BY_CHAIN_ID[this.chainId].registry)) {
                        return [];
                    }
                    return this.getDODOSellQuotes(constants_1.DODOV1_CONFIG_BY_CHAIN_ID[this.chainId], makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.DodoV2:
                    return _.flatten(constants_1.DODOV2_FACTORIES_BY_CHAIN_ID[this.chainId]
                        .filter(factory => bridge_source_utils_1.isValidAddress(factory))
                        .map(factory => bridge_source_utils_1.getDodoV2Offsets().map(offset => this.getDODOV2SellQuotes(factory, offset, makerToken, takerToken, takerFillAmounts))));
                case types_1.ERC20BridgeSource.Bancor:
                    if (!bridge_source_utils_1.isValidAddress(constants_1.BANCOR_REGISTRY_BY_CHAIN_ID[this.chainId])) {
                        return [];
                    }
                    return this.getBancorSellQuotes(constants_1.BANCOR_REGISTRY_BY_CHAIN_ID[this.chainId], makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Linkswap:
                    if (!bridge_source_utils_1.isValidAddress(constants_1.LINKSWAP_ROUTER_BY_CHAIN_ID[this.chainId])) {
                        return [];
                    }
                    return [
                        [takerToken, makerToken],
                        ...multihop_utils_1.getIntermediateTokens(makerToken, takerToken, {
                            default: [constants_1.MAINNET_TOKENS.LINK, constants_1.MAINNET_TOKENS.WETH],
                        }).map(t => [takerToken, t, makerToken]),
                    ].map(path => this.getUniswapV2SellQuotes(constants_1.LINKSWAP_ROUTER_BY_CHAIN_ID[this.chainId], path, takerFillAmounts, types_1.ERC20BridgeSource.Linkswap));
                case types_1.ERC20BridgeSource.MakerPsm:
                    const psmInfo = constants_1.MAKER_PSM_INFO_BY_CHAIN_ID[this.chainId];
                    if (!bridge_source_utils_1.isValidAddress(psmInfo.psmAddress)) {
                        return [];
                    }
                    return this.getMakerPsmSellQuotes(psmInfo, makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.UniswapV3: {
                    const { quoter, router } = constants_1.UNISWAPV3_CONFIG_BY_CHAIN_ID[this.chainId];
                    if (!bridge_source_utils_1.isValidAddress(router) || !bridge_source_utils_1.isValidAddress(quoter)) {
                        return [];
                    }
                    return [
                        [takerToken, makerToken],
                        ...intermediateTokens.map(t => [takerToken, t, makerToken]),
                    ].map(path => this.getUniswapV3SellQuotes(router, quoter, path, takerFillAmounts));
                }
                case types_1.ERC20BridgeSource.Lido: {
                    const lidoInfo = constants_1.LIDO_INFO_BY_CHAIN[this.chainId];
                    if (lidoInfo.stEthToken === constants_1.NULL_ADDRESS ||
                        lidoInfo.wethToken === constants_1.NULL_ADDRESS ||
                        takerToken.toLowerCase() !== lidoInfo.wethToken.toLowerCase() ||
                        makerToken.toLowerCase() !== lidoInfo.stEthToken.toLowerCase()) {
                        return [];
                    }
                    return this.getLidoSellQuotes(lidoInfo, makerToken, takerToken, takerFillAmounts);
                }
                case types_1.ERC20BridgeSource.AaveV2: {
                    if (!this.aaveReservesCache) {
                        return [];
                    }
                    const reserve = this.aaveReservesCache.get(takerToken, makerToken);
                    if (!reserve) {
                        return [];
                    }
                    const info = {
                        lendingPool: reserve.pool.lendingPool,
                        aToken: reserve.aToken.id,
                        underlyingToken: reserve.underlyingAsset,
                    };
                    return this.getAaveV2SellQuotes(info, makerToken, takerToken, takerFillAmounts);
                }
                case types_1.ERC20BridgeSource.Compound: {
                    if (!this.compoundCTokenCache) {
                        return [];
                    }
                    const cToken = this.compoundCTokenCache.get(takerToken, makerToken);
                    if (!cToken) {
                        return [];
                    }
                    return this.getCompoundSellQuotes(cToken.tokenAddress, makerToken, takerToken, takerFillAmounts);
                }
                default:
                    throw new Error(`Unsupported sell sample source: ${source}`);
            }
        }));
        return allOps;
    }
    _getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts) {
        // Find the adjacent tokens in the provided tooken adjacency graph,
        // e.g if this is DAI->USDC we may check for DAI->WETH->USDC
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, this.tokenAdjacencyGraph);
        const _sources = exports.BATCH_SOURCE_FILTERS.getAllowed(sources);
        return _.flatten(_sources.map((source) => {
            switch (source) {
                case types_1.ERC20BridgeSource.Eth2Dai:
                    return [];
                case types_1.ERC20BridgeSource.Uniswap:
                    return bridge_source_utils_1.isValidAddress(constants_1.UNISWAPV1_ROUTER_BY_CHAIN_ID[this.chainId])
                        ? this.getUniswapBuyQuotes(constants_1.UNISWAPV1_ROUTER_BY_CHAIN_ID[this.chainId], makerToken, takerToken, makerFillAmounts)
                        : [];
                case types_1.ERC20BridgeSource.UniswapV2:
                case types_1.ERC20BridgeSource.SushiSwap:
                case types_1.ERC20BridgeSource.CryptoCom:
                case types_1.ERC20BridgeSource.PancakeSwap:
                case types_1.ERC20BridgeSource.PancakeSwapV2:
                case types_1.ERC20BridgeSource.BakerySwap:
                case types_1.ERC20BridgeSource.ApeSwap:
                case types_1.ERC20BridgeSource.CafeSwap:
                case types_1.ERC20BridgeSource.CheeseSwap:
                case types_1.ERC20BridgeSource.JulSwap:
                case types_1.ERC20BridgeSource.QuickSwap:
                case types_1.ERC20BridgeSource.ComethSwap:
                case types_1.ERC20BridgeSource.Dfyn:
                case types_1.ERC20BridgeSource.WaultSwap:
                case types_1.ERC20BridgeSource.Polydex:
                case types_1.ERC20BridgeSource.ShibaSwap:
                case types_1.ERC20BridgeSource.JetSwap:
                case types_1.ERC20BridgeSource.Pangolin:
                case types_1.ERC20BridgeSource.TraderJoe:
                case types_1.ERC20BridgeSource.UbeSwap:
                case types_1.ERC20BridgeSource.SpiritSwap:
                case types_1.ERC20BridgeSource.SpookySwap:
                case types_1.ERC20BridgeSource.MorpheusSwap:
                    const uniLikeRouter = bridge_source_utils_1.uniswapV2LikeRouterAddress(this.chainId, source);
                    if (!bridge_source_utils_1.isValidAddress(uniLikeRouter)) {
                        return [];
                    }
                    return [
                        [takerToken, makerToken],
                        ...intermediateTokens.map(t => [takerToken, t, makerToken]),
                    ].map(path => this.getUniswapV2BuyQuotes(uniLikeRouter, path, makerFillAmounts, source));
                case types_1.ERC20BridgeSource.KyberDmm:
                    const kyberDmmRouter = constants_1.KYBER_DMM_ROUTER_BY_CHAIN_ID[this.chainId];
                    if (!bridge_source_utils_1.isValidAddress(kyberDmmRouter)) {
                        return [];
                    }
                    return this.getKyberDmmBuyQuotes(kyberDmmRouter, [takerToken, makerToken], makerFillAmounts);
                case types_1.ERC20BridgeSource.Kyber:
                    return bridge_source_utils_1.getKyberOffsets().map(offset => this.getKyberBuyQuotes(constants_1.KYBER_CONFIG_BY_CHAIN_ID[this.chainId], offset, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                case types_1.ERC20BridgeSource.CurveV2:
                case types_1.ERC20BridgeSource.Swerve:
                case types_1.ERC20BridgeSource.SnowSwap:
                case types_1.ERC20BridgeSource.Nerve:
                case types_1.ERC20BridgeSource.Synapse:
                case types_1.ERC20BridgeSource.Belt:
                case types_1.ERC20BridgeSource.Ellipsis:
                case types_1.ERC20BridgeSource.Saddle:
                case types_1.ERC20BridgeSource.XSigma:
                case types_1.ERC20BridgeSource.FirebirdOneSwap:
                case types_1.ERC20BridgeSource.IronSwap:
                case types_1.ERC20BridgeSource.ACryptos:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getCurveBuyQuotes(pool, pool.takerTokenIdx, pool.makerTokenIdx, makerFillAmounts, source));
                case types_1.ERC20BridgeSource.Smoothy:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getSmoothyBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.Shell:
                case types_1.ERC20BridgeSource.Component:
                    return bridge_source_utils_1.getShellLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getShellBuyQuotes(pool, makerToken, takerToken, makerFillAmounts, source));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    return liquidity_provider_utils_1.getLiquidityProvidersForPair(this.liquidityProviderRegistry, takerToken, makerToken).map(({ providerAddress, gasCost }) => this.getLiquidityProviderBuyQuotes(providerAddress, makerToken, takerToken, makerFillAmounts, gasCost));
                case types_1.ERC20BridgeSource.MStable:
                    return bridge_source_utils_1.getShellLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getMStableBuyQuotes(pool, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.Mooniswap:
                    return [
                        ...constants_1.MOONISWAP_REGISTRIES_BY_CHAIN_ID[this.chainId]
                            .filter(r => bridge_source_utils_1.isValidAddress(r))
                            .map(registry => this.getMooniswapBuyQuotes(registry, makerToken, takerToken, makerFillAmounts)),
                    ];
                case types_1.ERC20BridgeSource.Balancer:
                    return (this.poolsCaches[types_1.ERC20BridgeSource.Balancer].getCachedPoolAddressesForPair(takerToken, makerToken) || []).map(poolAddress => this.getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts, types_1.ERC20BridgeSource.Balancer));
                case types_1.ERC20BridgeSource.BalancerV2:
                case types_1.ERC20BridgeSource.Beethovenx:
                    const poolIds = this.poolsCaches[source].getCachedPoolAddressesForPair(takerToken, makerToken) || [];
                    const vault = source === types_1.ERC20BridgeSource.BalancerV2
                        ? constants_1.BALANCER_V2_VAULT_ADDRESS_BY_CHAIN[this.chainId]
                        : constants_1.BEETHOVEN_X_VAULT_ADDRESS_BY_CHAIN[this.chainId];
                    if (vault === constants_1.NULL_ADDRESS) {
                        return [];
                    }
                    return poolIds.map(poolId => this.getBalancerV2BuyQuotes({ poolId, vault }, makerToken, takerToken, makerFillAmounts, source));
                case types_1.ERC20BridgeSource.Cream:
                    return (this.poolsCaches[types_1.ERC20BridgeSource.Cream].getCachedPoolAddressesForPair(takerToken, makerToken) || []).map(poolAddress => this.getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts, types_1.ERC20BridgeSource.Cream));
                case types_1.ERC20BridgeSource.Dodo:
                    if (!bridge_source_utils_1.isValidAddress(constants_1.DODOV1_CONFIG_BY_CHAIN_ID[this.chainId].registry)) {
                        return [];
                    }
                    return this.getDODOBuyQuotes(constants_1.DODOV1_CONFIG_BY_CHAIN_ID[this.chainId], makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.DodoV2:
                    return _.flatten(constants_1.DODOV2_FACTORIES_BY_CHAIN_ID[this.chainId]
                        .filter(factory => bridge_source_utils_1.isValidAddress(factory))
                        .map(factory => bridge_source_utils_1.getDodoV2Offsets().map(offset => this.getDODOV2BuyQuotes(factory, offset, makerToken, takerToken, makerFillAmounts))));
                case types_1.ERC20BridgeSource.Bancor:
                    // Unimplemented
                    // return this.getBancorBuyQuotes(makerToken, takerToken, makerFillAmounts);
                    return [];
                case types_1.ERC20BridgeSource.Linkswap:
                    if (!bridge_source_utils_1.isValidAddress(constants_1.LINKSWAP_ROUTER_BY_CHAIN_ID[this.chainId])) {
                        return [];
                    }
                    return [
                        [takerToken, makerToken],
                        // LINK is the base asset in many of the pools on Linkswap
                        ...multihop_utils_1.getIntermediateTokens(makerToken, takerToken, {
                            default: [constants_1.MAINNET_TOKENS.LINK, constants_1.MAINNET_TOKENS.WETH],
                        }).map(t => [takerToken, t, makerToken]),
                    ].map(path => this.getUniswapV2BuyQuotes(constants_1.LINKSWAP_ROUTER_BY_CHAIN_ID[this.chainId], path, makerFillAmounts, types_1.ERC20BridgeSource.Linkswap));
                case types_1.ERC20BridgeSource.MakerPsm:
                    const psmInfo = constants_1.MAKER_PSM_INFO_BY_CHAIN_ID[this.chainId];
                    if (!bridge_source_utils_1.isValidAddress(psmInfo.psmAddress)) {
                        return [];
                    }
                    return this.getMakerPsmBuyQuotes(psmInfo, makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.UniswapV3: {
                    const { quoter, router } = constants_1.UNISWAPV3_CONFIG_BY_CHAIN_ID[this.chainId];
                    if (!bridge_source_utils_1.isValidAddress(router) || !bridge_source_utils_1.isValidAddress(quoter)) {
                        return [];
                    }
                    return [
                        [takerToken, makerToken],
                        ...intermediateTokens.map(t => [takerToken, t, makerToken]),
                    ].map(path => this.getUniswapV3BuyQuotes(router, quoter, path, makerFillAmounts));
                }
                case types_1.ERC20BridgeSource.Lido: {
                    const lidoInfo = constants_1.LIDO_INFO_BY_CHAIN[this.chainId];
                    if (lidoInfo.stEthToken === constants_1.NULL_ADDRESS ||
                        lidoInfo.wethToken === constants_1.NULL_ADDRESS ||
                        takerToken.toLowerCase() !== lidoInfo.wethToken.toLowerCase() ||
                        makerToken.toLowerCase() !== lidoInfo.stEthToken.toLowerCase()) {
                        return [];
                    }
                    return this.getLidoBuyQuotes(lidoInfo, makerToken, takerToken, makerFillAmounts);
                }
                case types_1.ERC20BridgeSource.AaveV2: {
                    if (!this.aaveReservesCache) {
                        return [];
                    }
                    const reserve = this.aaveReservesCache.get(takerToken, makerToken);
                    if (!reserve) {
                        return [];
                    }
                    const info = {
                        lendingPool: reserve.pool.lendingPool,
                        aToken: reserve.aToken.id,
                        underlyingToken: reserve.underlyingAsset,
                    };
                    return this.getAaveV2BuyQuotes(info, makerToken, takerToken, makerFillAmounts);
                }
                case types_1.ERC20BridgeSource.Compound: {
                    if (!this.compoundCTokenCache) {
                        return [];
                    }
                    const cToken = this.compoundCTokenCache.get(takerToken, makerToken);
                    if (!cToken) {
                        return [];
                    }
                    return this.getCompoundBuyQuotes(cToken.tokenAddress, makerToken, takerToken, makerFillAmounts);
                }
                default:
                    throw new Error(`Unsupported buy sample source: ${source}`);
            }
        }));
    }
    /**
     * Wraps `subOps` operations into a batch call to the sampler
     * @param subOps An array of Sampler operations
     * @param resultHandler The handler of the parsed batch results
     * @param revertHandler The handle for when the batch operation reverts. The result data is provided as an argument
     */
    _createBatch(subOps, resultHandler, revertHandler) {
        return {
            encodeCall: () => {
                const subCalls = subOps.map(op => op.encodeCall());
                return this._samplerContract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResults: callResults => {
                const rawSubCallResults = this._samplerContract.getABIDecodedReturnData('batchCall', callResults);
                const results = subOps.map((op, i) => rawSubCallResults[i].success
                    ? op.handleCallResults(rawSubCallResults[i].data)
                    : op.handleRevert(rawSubCallResults[i].data));
                return resultHandler(results);
            },
            handleRevert: revertHandler,
        };
    }
}
exports.SamplerOperations = SamplerOperations;
// tslint:disable max-file-line-count
//# sourceMappingURL=sampler_operations.js.map