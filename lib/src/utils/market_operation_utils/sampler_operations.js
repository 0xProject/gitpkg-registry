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
const bridge_source_utils_1 = require("./bridge_source_utils");
const constants_1 = require("./constants");
const liquidity_provider_utils_1 = require("./liquidity_provider_utils");
const measured_sampler_contract_operation_1 = require("./measured_sampler_contract_operation");
const multihop_utils_1 = require("./multihop_utils");
const pools_cache_1 = require("./pools_cache");
const sampler_contract_operation_1 = require("./sampler_contract_operation");
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
                [types_1.ERC20BridgeSource.BalancerV2]: new pools_cache_1.BalancerV2PoolsCache(),
                [types_1.ERC20BridgeSource.Balancer]: new pools_cache_1.BalancerPoolsCache(),
                [types_1.ERC20BridgeSource.Cream]: new pools_cache_1.CreamPoolsCache(),
            };
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
    getCode(address) {
        return {
            encodeCall: () => this._samplerContract.getCode(address).getABIEncodedTransactionData(),
            handleCallResults: (callResults) => this._samplerContract.getABIDecodedReturnData('getCode', callResults),
            handleRevert: (data) => {
                throw new Error(`getCode for ${address} reverted: ${data}`);
            },
        };
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
    getBalanceOf(tokens, address) {
        return {
            encodeCall: () => this._samplerContract.getBalanceOf(tokens, address).getABIEncodedTransactionData(),
            handleCallResults: (callResults) => this._samplerContract.getABIDecodedReturnData('getBalanceOf', callResults),
            handleRevert: () => {
                /* should never happen */
                throw new Error('balanceOf reverted');
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
    getKyberSellQuotes(kyberOpts, reserveOffset, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromKyberNetwork,
            params: [Object.assign(Object.assign({}, kyberOpts), { reserveOffset, hint: constants_1.NULL_BYTES }), takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [reserveId, hint, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromKyberNetwork', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                fillData.networkProxy = kyberOpts.networkProxy;
                return bridge_source_utils_1.isAllowedKyberReserveId(reserveId) ? { gasUsed, samples } : { gasUsed: [], samples: [] };
            },
        });
    }
    getKyberBuyQuotes(kyberOpts, reserveOffset, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromKyberNetwork,
            params: [Object.assign(Object.assign({}, kyberOpts), { reserveOffset, hint: constants_1.NULL_BYTES }), takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [reserveId, hint, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromKyberNetwork', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                fillData.networkProxy = kyberOpts.networkProxy;
                return bridge_source_utils_1.isAllowedKyberReserveId(reserveId) ? { gasUsed, samples } : { gasUsed: [], samples: [] };
            },
        });
    }
    getKyberDmmSellQuotes(router, tokenAddressPath, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.KyberDmm,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromKyberDmm,
            params: [router, tokenAddressPath, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [pools, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromKyberDmm', callResults);
                fillData.poolsPath = pools;
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                return { gasUsed, samples };
            },
        });
    }
    getKyberDmmBuyQuotes(router, tokenAddressPath, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.KyberDmm,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromKyberDmm,
            params: [router, tokenAddressPath, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [pools, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromKyberDmm', callResults);
                fillData.poolsPath = pools;
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                return { gasUsed, samples };
            },
        });
    }
    getUniswapSellQuotes(router, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.Uniswap,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswap,
            params: [router, takerToken, makerToken, takerFillAmounts],
        });
    }
    getUniswapBuyQuotes(router, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Uniswap,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswap,
            params: [router, takerToken, makerToken, makerFillAmounts],
        });
    }
    getUniswapV2SellQuotes(router, tokenAddressPath, takerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV2) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source,
            fillData: { tokenAddressPath, router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswapV2,
            params: [router, tokenAddressPath, takerFillAmounts],
        });
    }
    getUniswapV2BuyQuotes(router, tokenAddressPath, makerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV2) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source,
            fillData: { tokenAddressPath, router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswapV2,
            params: [router, tokenAddressPath, makerFillAmounts],
        });
    }
    getLiquidityProviderSellQuotes(providerAddress, makerToken, takerToken, takerFillAmounts, gasCost) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: {
                poolAddress: providerAddress,
                // TODO jacob remove this gasCost with SwapRevertSampling
                gasCost,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromLiquidityProvider,
            params: [providerAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getLiquidityProviderBuyQuotes(providerAddress, makerToken, takerToken, makerFillAmounts, gasCost) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: {
                poolAddress: providerAddress,
                // TODO jacob remove this gasCost with SwapRevertSampling
                gasCost,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromLiquidityProvider,
            params: [providerAddress, takerToken, makerToken, makerFillAmounts],
        });
    }
    getEth2DaiSellQuotes(router, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.Eth2Dai,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromEth2Dai,
            params: [router, takerToken, makerToken, takerFillAmounts],
        });
    }
    getEth2DaiBuyQuotes(router, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Eth2Dai,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromEth2Dai,
            params: [router, takerToken, makerToken, makerFillAmounts],
        });
    }
    getCurveSellQuotes(pool, makerToken, takerToken, takerFillAmounts, source = types_1.ERC20BridgeSource.Curve) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source,
            fillData: {
                pool,
                fromTokenIdx: pool.takerTokenIdx,
                toTokenIdx: pool.makerTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCurve,
            params: [
                {
                    curveAddress: pool.poolAddress,
                    exchangeFunctionSelector: pool.exchangeFunctionSelector,
                    fromCoinIdx: new utils_1.BigNumber(pool.takerTokenIdx),
                    toCoinIdx: new utils_1.BigNumber(pool.makerTokenIdx),
                },
                takerToken,
                makerToken,
                takerFillAmounts,
            ],
        });
    }
    getCurveV2SellQuotes(pool, makerToken, takerToken, takerFillAmounts, source = types_1.ERC20BridgeSource.Curve) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source,
            fillData: {
                pool,
                fromTokenIdx: pool.takerTokenIdx,
                toTokenIdx: pool.makerTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCurveV2,
            params: [
                {
                    curveAddress: pool.poolAddress,
                    exchangeFunctionSelector: pool.exchangeFunctionSelector,
                    fromCoinIdx: new utils_1.BigNumber(pool.takerTokenIdx),
                    toCoinIdx: new utils_1.BigNumber(pool.makerTokenIdx),
                },
                takerToken,
                makerToken,
                takerFillAmounts,
            ],
        });
    }
    getCurveV2BuyQuotes(pool, makerToken, takerToken, takerFillAmounts, source = types_1.ERC20BridgeSource.Curve) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source,
            fillData: {
                pool,
                fromTokenIdx: pool.takerTokenIdx,
                toTokenIdx: pool.makerTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCurveV2,
            params: [
                {
                    curveAddress: pool.poolAddress,
                    exchangeFunctionSelector: pool.exchangeFunctionSelector,
                    fromCoinIdx: new utils_1.BigNumber(pool.takerTokenIdx),
                    toCoinIdx: new utils_1.BigNumber(pool.makerTokenIdx),
                },
                takerToken,
                makerToken,
                takerFillAmounts,
            ],
        });
    }
    getCurveBuyQuotes(pool, makerToken, takerToken, makerFillAmounts, source = types_1.ERC20BridgeSource.Curve) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source,
            fillData: {
                pool,
                fromTokenIdx: pool.takerTokenIdx,
                toTokenIdx: pool.makerTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCurve,
            params: [
                {
                    curveAddress: pool.poolAddress,
                    exchangeFunctionSelector: pool.exchangeFunctionSelector,
                    fromCoinIdx: new utils_1.BigNumber(pool.takerTokenIdx),
                    toCoinIdx: new utils_1.BigNumber(pool.makerTokenIdx),
                },
                takerToken,
                makerToken,
                makerFillAmounts,
            ],
        });
    }
    getBalancerV2SellQuotes(poolInfo, makerToken, takerToken, takerFillAmounts, source) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: false,
            source,
            fillData: Object.assign({}, poolInfo),
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBalancerV2,
            params: [poolInfo, takerToken, makerToken, takerFillAmounts],
        });
    }
    getBalancerV2BuyQuotes(poolInfo, makerToken, takerToken, makerFillAmounts, source) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source,
            fillData: Object.assign({}, poolInfo),
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBalancerV2,
            params: [poolInfo, takerToken, makerToken, makerFillAmounts],
        });
    }
    getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts, source) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: false,
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBalancer,
            params: [poolAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts, source) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBalancer,
            params: [poolAddress, takerToken, makerToken, makerFillAmounts],
        });
    }
    getMStableSellQuotes(router, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.MStable,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMStable,
            params: [router, takerToken, makerToken, takerFillAmounts],
        });
    }
    getMStableBuyQuotes(router, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.MStable,
            fillData: { router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMStable,
            params: [router, takerToken, makerToken, makerFillAmounts],
        });
    }
    getBancorSellQuotes(registry, makerToken, takerToken, takerFillAmounts) {
        const paths = this._bancorService ? this._bancorService.getPaths(takerToken, makerToken) : [];
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.Bancor,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBancor,
            params: [{ registry, paths }, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [networkAddress, path, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromBancor', callResults);
                fillData.networkAddress = networkAddress;
                fillData.path = path;
                return { gasUsed, samples };
            },
        });
    }
    // Unimplemented
    getBancorBuyQuotes(registry, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Bancor,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBancor,
            params: [{ registry, paths: [] }, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [networkAddress, path, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromBancor', callResults);
                fillData.networkAddress = networkAddress;
                fillData.path = path;
                return { gasUsed, samples };
            },
        });
    }
    getMooniswapSellQuotes(registry, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMooniswap,
            params: [registry, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [poolAddress, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromMooniswap', callResults);
                fillData.poolAddress = poolAddress;
                return { gasUsed, samples };
            },
        });
    }
    getMooniswapBuyQuotes(registry, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMooniswap,
            params: [registry, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [poolAddress, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromMooniswap', callResults);
                fillData.poolAddress = poolAddress;
                return { gasUsed, samples };
            },
        });
    }
    getUniswapV3SellQuotes(router, quoter, tokenAddressPath, takerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV3) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswapV3,
            params: [quoter, router, tokenAddressPath, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [paths, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromUniswapV3', callResults);
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                fillData.pathAmounts = paths.map((uniswapPath, i) => ({
                    uniswapPath,
                    inputAmount: takerFillAmounts[i],
                }));
                return { gasUsed, samples };
            },
        });
    }
    getUniswapV3BuyQuotes(router, quoter, tokenAddressPath, makerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV3) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswapV3,
            params: [quoter, router, tokenAddressPath, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [paths, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromUniswapV3', callResults);
                fillData.router = router;
                fillData.tokenAddressPath = tokenAddressPath;
                fillData.pathAmounts = paths.map((uniswapPath, i) => ({
                    uniswapPath,
                    inputAmount: makerFillAmounts[i],
                }));
                return { gasUsed, samples };
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
            return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
                deregisterable: false,
                contract: this._samplerContract,
                source: types_1.ERC20BridgeSource.MultiHop,
                function: this._samplerContract.sampleTwoHopSell,
                params: [firstHopOps.map(op => op.encodeCall()), secondHopOps.map(op => op.encodeCall()), sellAmount],
                fillData: { intermediateToken },
                callback: (callResults, fillData) => {
                    const [firstHop, secondHop, _intermediateAmount, buyAmount,] = this._samplerContract.getABIDecodedReturnData('sampleTwoHopSell', callResults);
                    // Ensure the hop sources are set even when the buy amount is zero
                    fillData.firstHopSource = firstHopOps[firstHop.sourceIndex.toNumber()];
                    fillData.secondHopSource = secondHopOps[secondHop.sourceIndex.toNumber()];
                    if (buyAmount.isZero()) {
                        return { gasUsed: [constants_1.ZERO_AMOUNT], samples: [constants_1.ZERO_AMOUNT] };
                    }
                    const firstHopResult = fillData.firstHopSource.handleCallResults(firstHop.returnData);
                    const secondHopResult = fillData.secondHopSource.handleCallResults(secondHop.returnData);
                    const gasUsed = (firstHopResult.gasUsed[0] || constants_1.ZERO_AMOUNT).plus(secondHopResult.gasUsed[0] || constants_1.ZERO_AMOUNT);
                    return { gasUsed: [gasUsed], samples: [buyAmount] };
                },
            });
        });
        return this._createBatch(subOps, (result) => {
            return subOps.map((op, i) => {
                return {
                    source: op.source,
                    output: result[i].samples[0],
                    input: sellAmount,
                    fillData: op.fillData,
                    gasUsed: result[i].gasUsed[0],
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
            return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
                deregisterable: false,
                contract: this._samplerContract,
                source: types_1.ERC20BridgeSource.MultiHop,
                function: this._samplerContract.sampleTwoHopBuy,
                params: [firstHopOps.map(op => op.encodeCall()), secondHopOps.map(op => op.encodeCall()), buyAmount],
                fillData: { intermediateToken },
                callback: (callResults, fillData) => {
                    const [firstHop, secondHop, sellAmount] = this._samplerContract.getABIDecodedReturnData('sampleTwoHopBuy', callResults);
                    if (sellAmount.isEqualTo(constants_1.MAX_UINT256)) {
                        return { gasUsed: [constants_1.ZERO_AMOUNT], samples: [constants_1.ZERO_AMOUNT] };
                    }
                    fillData.firstHopSource = firstHopOps[firstHop.sourceIndex.toNumber()];
                    fillData.secondHopSource = secondHopOps[secondHop.sourceIndex.toNumber()];
                    const firstHopResult = fillData.firstHopSource.handleCallResults(firstHop.returnData);
                    const secondHopResult = fillData.secondHopSource.handleCallResults(secondHop.returnData);
                    const gasUsed = (firstHopResult.gasUsed[0] || constants_1.ZERO_AMOUNT).plus(secondHopResult.gasUsed[0] || constants_1.ZERO_AMOUNT);
                    return { gasUsed: [gasUsed], samples: [buyAmount] };
                },
            });
        });
        return this._createBatch(subOps, (result) => {
            return subOps.map((op, i) => {
                return {
                    source: op.source,
                    output: result[i].samples[0],
                    input: buyAmount,
                    fillData: op.fillData,
                    gasUsed: result[i].gasUsed[0],
                };
            });
        }, () => {
            utils_1.logUtils.warn('SamplerContractOperation: Two hop sampler reverted');
            return [];
        });
    }
    getShellSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts, source = types_1.ERC20BridgeSource.Shell) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source,
            fillData: { poolAddress, gasUsed: [] },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromShell,
            params: [poolAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getShellBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts, source = types_1.ERC20BridgeSource.Shell) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source,
            fillData: { poolAddress, gasUsed: [] },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromShell,
            params: [poolAddress, takerToken, makerToken, makerFillAmounts],
        });
    }
    getDODOSellQuotes(opts, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.Dodo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromDODO,
            params: [opts, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODO', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                fillData.helperAddress = opts.helper;
                return { gasUsed, samples };
            },
        });
    }
    getDODOBuyQuotes(opts, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Dodo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromDODO,
            params: [opts, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromDODO', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                fillData.helperAddress = opts.helper;
                return { gasUsed, samples };
            },
        });
    }
    getDODOV2SellQuotes(registry, offset, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.DodoV2,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromDODOV2,
            params: [registry, offset, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODOV2', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return { gasUsed, samples };
            },
        });
    }
    getDODOV2BuyQuotes(registry, offset, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.DodoV2,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromDODOV2,
            params: [registry, offset, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, gasUsed, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODOV2', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return { gasUsed, samples };
            },
        });
    }
    getMakerPsmSellQuotes(psmInfo, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            deregisterable: true,
            source: types_1.ERC20BridgeSource.MakerPsm,
            fillData: Object.assign({ isSellOperation: true, takerToken,
                makerToken }, psmInfo),
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMakerPsm,
            params: [psmInfo, takerToken, makerToken, takerFillAmounts],
        });
    }
    getMakerPsmBuyQuotes(psmInfo, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.MakerPsm,
            fillData: Object.assign({ isSellOperation: false, takerToken,
                makerToken }, psmInfo),
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMakerPsm,
            params: [psmInfo, takerToken, makerToken, makerFillAmounts],
        });
    }
    getLidoSellQuotes(lidoInfo, makerToken, takerToken, takerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Lido,
            fillData: {
                takerToken,
                stEthTokenAddress: lidoInfo.stEthToken,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromLido,
            params: [lidoInfo.stEthToken, takerToken, makerToken, takerFillAmounts],
        });
    }
    getLidoBuyQuotes(lidoInfo, makerToken, takerToken, makerFillAmounts) {
        return new measured_sampler_contract_operation_1.MeasuredSamplerContractOperation({
            source: types_1.ERC20BridgeSource.Lido,
            fillData: {
                takerToken,
                stEthTokenAddress: lidoInfo.stEthToken,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromLido,
            params: [lidoInfo.stEthToken, takerToken, makerToken, makerFillAmounts],
        });
    }
    getMedianSellRate(sources, makerToken, takerToken, takerFillAmount) {
        if (makerToken.toLowerCase() === takerToken.toLowerCase()) {
            return SamplerOperations.constant(new utils_1.BigNumber(1));
        }
        const subOps = this._getSellQuoteOperations(sources, makerToken, takerToken, [takerFillAmount], {
            default: [],
        });
        return this._createBatch(subOps, (results) => {
            if (results.length === 0) {
                return constants_1.ZERO_AMOUNT;
            }
            const flatSortedSamples = results
                .map(r => r.samples)
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
        return this._createBatch(subOps, (results) => {
            return subOps.map((op, i) => {
                const dexSamples = results[i].samples.map((output, j) => ({
                    source: op.source,
                    output,
                    input: takerFillAmounts[j],
                    fillData: op.fillData,
                    gasUsed: results[i].gasUsed[j],
                }));
                return dexSamples;
            });
        }, () => []);
    }
    getBuyQuotes(sources, makerToken, takerToken, makerFillAmounts) {
        const subOps = this._getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts);
        return this._createBatch(subOps, (results) => {
            return subOps.map((op, i) => {
                return results[i].samples.map((output, j) => ({
                    source: op.source,
                    output,
                    input: makerFillAmounts[j],
                    fillData: op.fillData,
                    gasUsed: results[i].gasUsed[j],
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
                    return bridge_source_utils_1.isValidAddress(constants_1.OASIS_ROUTER_BY_CHAIN_ID[this.chainId])
                        ? this.getEth2DaiSellQuotes(constants_1.OASIS_ROUTER_BY_CHAIN_ID[this.chainId], makerToken, takerToken, takerFillAmounts)
                        : [];
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
                case types_1.ERC20BridgeSource.Swerve:
                case types_1.ERC20BridgeSource.SnowSwap:
                case types_1.ERC20BridgeSource.Nerve:
                case types_1.ERC20BridgeSource.Belt:
                case types_1.ERC20BridgeSource.Ellipsis:
                case types_1.ERC20BridgeSource.Saddle:
                case types_1.ERC20BridgeSource.XSigma:
                case types_1.ERC20BridgeSource.FirebirdOneSwap:
                case types_1.ERC20BridgeSource.Smoothy:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getCurveSellQuotes(pool, makerToken, takerToken, takerFillAmounts, source));
                case types_1.ERC20BridgeSource.CurveV2:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getCurveV2SellQuotes(pool, makerToken, takerToken, takerFillAmounts, source));
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
                    return (this.poolsCaches[types_1.ERC20BridgeSource.Balancer].getCachedPoolAddressesForPair(takerToken, makerToken) || []).map(poolAddress => this.getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts, types_1.ERC20BridgeSource.Balancer));
                case types_1.ERC20BridgeSource.BalancerV2:
                    const poolIds = this.poolsCaches[types_1.ERC20BridgeSource.BalancerV2].getCachedPoolAddressesForPair(takerToken, makerToken) || [];
                    const vault = constants_1.BALANCER_V2_VAULT_ADDRESS_BY_CHAIN[this.chainId];
                    if (vault === constants_1.NULL_ADDRESS) {
                        return [];
                    }
                    return poolIds.map(poolId => this.getBalancerV2SellQuotes({ poolId, vault }, makerToken, takerToken, takerFillAmounts, types_1.ERC20BridgeSource.BalancerV2));
                case types_1.ERC20BridgeSource.Cream:
                    return (this.poolsCaches[types_1.ERC20BridgeSource.Cream].getCachedPoolAddressesForPair(takerToken, makerToken) || []).map(poolAddress => this.getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts, types_1.ERC20BridgeSource.Cream));
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
                default:
                    throw new Error(`Unsupported sell sample source: ${source}`);
            }
        }));
        const registeredOpts = allOps.filter(op => op.isDeregistered && !op.isDeregistered());
        return registeredOpts;
    }
    _getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts) {
        // Find the adjacent tokens in the provided tooken adjacency graph,
        // e.g if this is DAI->USDC we may check for DAI->WETH->USDC
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, this.tokenAdjacencyGraph);
        const _sources = exports.BATCH_SOURCE_FILTERS.getAllowed(sources);
        return _.flatten(_sources.map((source) => {
            switch (source) {
                case types_1.ERC20BridgeSource.Eth2Dai:
                    return bridge_source_utils_1.isValidAddress(constants_1.OASIS_ROUTER_BY_CHAIN_ID[this.chainId])
                        ? this.getEth2DaiBuyQuotes(constants_1.OASIS_ROUTER_BY_CHAIN_ID[this.chainId], makerToken, takerToken, makerFillAmounts)
                        : [];
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
                case types_1.ERC20BridgeSource.Swerve:
                case types_1.ERC20BridgeSource.SnowSwap:
                case types_1.ERC20BridgeSource.Nerve:
                case types_1.ERC20BridgeSource.Belt:
                case types_1.ERC20BridgeSource.Ellipsis:
                case types_1.ERC20BridgeSource.Saddle:
                case types_1.ERC20BridgeSource.XSigma:
                case types_1.ERC20BridgeSource.FirebirdOneSwap:
                case types_1.ERC20BridgeSource.Smoothy:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getCurveBuyQuotes(pool, takerToken, makerToken, makerFillAmounts, source));
                case types_1.ERC20BridgeSource.CurveV2:
                    return bridge_source_utils_1.getCurveLikeInfosForPair(this.chainId, takerToken, makerToken, source).map(pool => this.getCurveV2BuyQuotes(pool, takerToken, makerToken, makerFillAmounts, source));
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
                    const poolIds = this.poolsCaches[types_1.ERC20BridgeSource.BalancerV2].getCachedPoolAddressesForPair(takerToken, makerToken) || [];
                    const vault = constants_1.BALANCER_V2_VAULT_ADDRESS_BY_CHAIN[this.chainId];
                    if (vault === constants_1.NULL_ADDRESS) {
                        return [];
                    }
                    return poolIds.map(poolId => this.getBalancerV2BuyQuotes({ poolId, vault }, makerToken, takerToken, makerFillAmounts, types_1.ERC20BridgeSource.BalancerV2));
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