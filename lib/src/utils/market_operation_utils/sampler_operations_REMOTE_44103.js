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
const balancer_utils_1 = require("./balancer_utils");
const bridge_source_utils_1 = require("./bridge_source_utils");
const constants_1 = require("./constants");
const cream_utils_1 = require("./cream_utils");
const liquidity_provider_utils_1 = require("./liquidity_provider_utils");
const multihop_utils_1 = require("./multihop_utils");
const sampler_contract_operation_1 = require("./sampler_contract_operation");
const shell_utils_1 = require("./shell_utils");
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
    constructor(_samplerContract, balancerPoolsCache = new balancer_utils_1.BalancerPoolsCache(), creamPoolsCache = new cream_utils_1.CreamPoolsCache(), tokenAdjacencyGraph = { default: [] }, liquidityProviderRegistry = constants_1.LIQUIDITY_PROVIDER_REGISTRY, bancorServiceFn = () => __awaiter(this, void 0, void 0, function* () { return undefined; })) {
        this._samplerContract = _samplerContract;
        this.balancerPoolsCache = balancerPoolsCache;
        this.creamPoolsCache = creamPoolsCache;
        this.tokenAdjacencyGraph = tokenAdjacencyGraph;
        this.liquidityProviderRegistry = liquidityProviderRegistry;
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
    getLimitOrderFillableTakerAmounts(orders, exchangeAddress) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getLimitOrderFillableTakerAssetAmounts,
            // tslint:disable-next-line:no-unnecessary-type-assertion
            params: [orders.map(o => o.order), orders.map(o => o.signature), exchangeAddress],
        });
    }
    getLimitOrderFillableMakerAmounts(orders, exchangeAddress) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getLimitOrderFillableMakerAssetAmounts,
            // tslint:disable-next-line:no-unnecessary-type-assertion
            params: [orders.map(o => o.order), orders.map(o => o.signature), exchangeAddress],
        });
    }
    getKyberSellQuotes(reserveOffset, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromKyberNetwork,
            params: [reserveOffset, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [reserveId, hint, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromKyberNetwork', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                return bridge_source_utils_1.isAllowedKyberReserveId(reserveId) ? samples : [];
            },
        });
    }
    getKyberBuyQuotes(reserveOffset, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromKyberNetwork,
            params: [reserveOffset, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [reserveId, hint, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromKyberNetwork', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                return bridge_source_utils_1.isAllowedKyberReserveId(reserveId) ? samples : [];
            },
        });
    }
    getUniswapSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Uniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswap,
            params: [takerToken, makerToken, takerFillAmounts],
        });
    }
    getUniswapBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Uniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswap,
            params: [takerToken, makerToken, makerFillAmounts],
        });
    }
    getUniswapV2SellQuotes(router, tokenAddressPath, takerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV2) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { tokenAddressPath, router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswapV2,
            params: [router, tokenAddressPath, takerFillAmounts],
        });
    }
    getUniswapV2BuyQuotes(router, tokenAddressPath, makerFillAmounts, source = types_1.ERC20BridgeSource.UniswapV2) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { tokenAddressPath, router },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswapV2,
            params: [router, tokenAddressPath, makerFillAmounts],
        });
    }
    getLiquidityProviderSellQuotes(providerAddress, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: {
                poolAddress: providerAddress,
                gasCost: this.liquidityProviderRegistry[providerAddress].gasCost,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromLiquidityProvider,
            params: [providerAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getLiquidityProviderBuyQuotes(providerAddress, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: {
                poolAddress: providerAddress,
                gasCost: this.liquidityProviderRegistry[providerAddress].gasCost,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromLiquidityProvider,
            params: [providerAddress, takerToken, makerToken, makerFillAmounts],
        });
    }
    getEth2DaiSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Eth2Dai,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromEth2Dai,
            params: [takerToken, makerToken, takerFillAmounts],
        });
    }
    getEth2DaiBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Eth2Dai,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromEth2Dai,
            params: [takerToken, makerToken, makerFillAmounts],
        });
    }
    getCurveSellQuotes(pool, fromTokenIdx, toTokenIdx, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Curve,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCurve,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
                takerFillAmounts,
            ],
        });
    }
    getCurveBuyQuotes(pool, fromTokenIdx, toTokenIdx, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Curve,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCurve,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
                makerFillAmounts,
            ],
        });
    }
    getSwerveSellQuotes(pool, fromTokenIdx, toTokenIdx, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Swerve,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCurve,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
                takerFillAmounts,
            ],
        });
    }
    getSwerveBuyQuotes(pool, fromTokenIdx, toTokenIdx, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Swerve,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCurve,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
                makerFillAmounts,
            ],
        });
    }
    getSnowSwapSellQuotes(pool, fromTokenIdx, toTokenIdx, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.SnowSwap,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCurve,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
                takerFillAmounts,
            ],
        });
    }
    getSnowSwapBuyQuotes(pool, fromTokenIdx, toTokenIdx, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.SnowSwap,
            fillData: {
                pool,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCurve,
            params: [
                {
                    poolAddress: pool.poolAddress,
                    sellQuoteFunctionSelector: pool.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: pool.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
                makerFillAmounts,
            ],
        });
    }
    getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts, source) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBalancer,
            params: [poolAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts, source) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBalancer,
            params: [poolAddress, takerToken, makerToken, makerFillAmounts],
        });
    }
    getBalancerSellQuotesOffChainAsync(makerToken, takerToken, _takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prime the cache but do not sample off chain
            yield this.balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
            return [];
            // return pools.map(pool =>
            //    takerFillAmounts.map(amount => ({
            //        source: ERC20BridgeSource.Balancer,
            //        output: computeBalancerSellQuote(pool, amount),
            //        input: amount,
            //        fillData: { poolAddress: pool.id },
            //    })),
            // );
        });
    }
    getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, _makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prime the pools but do not sample off chain
            // Prime the cache but do not sample off chain
            yield this.balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
            return [];
            // return pools.map(pool =>
            //    makerFillAmounts.map(amount => ({
            //        source: ERC20BridgeSource.Balancer,
            //        output: computeBalancerBuyQuote(pool, amount),
            //        input: amount,
            //        fillData: { poolAddress: pool.id },
            //    })),
            // );
        });
    }
    getCreamSellQuotesOffChainAsync(makerToken, takerToken, _takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prime the cache but do not sample off chain
            yield this.creamPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
            return [];
            // return pools.map(pool =>
            //     takerFillAmounts.map(amount => ({
            //         source: ERC20BridgeSource.Cream,
            //         output: computeBalancerSellQuote(pool, amount),
            //         input: amount,
            //         fillData: { poolAddress: pool.id },
            //     })),
            // );
        });
    }
    getCreamBuyQuotesOffChainAsync(makerToken, takerToken, _makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prime the cache but do not sample off chain
            yield this.creamPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
            return [];
            // return pools.map(pool =>
            //    makerFillAmounts.map(amount => ({
            //        source: ERC20BridgeSource.Cream,
            //        output: computeBalancerBuyQuote(pool, amount),
            //        input: amount,
            //        fillData: { poolAddress: pool.id },
            //    })),
            // );
        });
    }
    getMStableSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MStable,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMStable,
            params: [takerToken, makerToken, takerFillAmounts],
        });
    }
    getMStableBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MStable,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMStable,
            params: [takerToken, makerToken, makerFillAmounts],
        });
    }
    getBancorSellQuotes(makerToken, takerToken, takerFillAmounts) {
        const paths = this._bancorService ? this._bancorService.getPaths(takerToken, makerToken) : [];
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Bancor,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBancor,
            params: [paths, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [networkAddress, path, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromBancor', callResults);
                fillData.networkAddress = networkAddress;
                fillData.path = path;
                return samples;
            },
        });
    }
    // Unimplemented
    getBancorBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Bancor,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBancor,
            params: [[], takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [networkAddress, path, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromBancor', callResults);
                fillData.networkAddress = networkAddress;
                fillData.path = path;
                return samples;
            },
        });
    }
    getMooniswapSellQuotes(registry, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMooniswap,
            params: [registry, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [poolAddress, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromMooniswap', callResults);
                fillData.poolAddress = poolAddress;
                return samples;
            },
        });
    }
    getMooniswapBuyQuotes(registry, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMooniswap,
            params: [registry, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [poolAddress, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromMooniswap', callResults);
                fillData.poolAddress = poolAddress;
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
        }, () => []);
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
        }, () => []);
    }
    getSushiSwapSellQuotes(tokenAddressPath, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.SushiSwap,
            fillData: { tokenAddressPath, router: constants_1.MAINNET_SUSHI_SWAP_ROUTER },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromSushiSwap,
            params: [constants_1.MAINNET_SUSHI_SWAP_ROUTER, tokenAddressPath, takerFillAmounts],
        });
    }
    getSushiSwapBuyQuotes(tokenAddressPath, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.SushiSwap,
            fillData: { tokenAddressPath, router: constants_1.MAINNET_SUSHI_SWAP_ROUTER },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromSushiSwap,
            params: [constants_1.MAINNET_SUSHI_SWAP_ROUTER, tokenAddressPath, makerFillAmounts],
        });
    }
    getShellSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Shell,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromShell,
            params: [poolAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getShellBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Shell,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromShell,
            params: [poolAddress, takerToken, makerToken, makerFillAmounts],
        });
    }
    getDODOSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Dodo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromDODO,
            params: [takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODO', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return samples;
            },
        });
    }
    getDODOBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Dodo,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromDODO,
            params: [takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromDODO', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return samples;
            },
        });
    }
    getDODOV2SellQuotes(registry, offset, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.DodoV2,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromDODOV2,
            params: [registry, offset, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODOV2', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return samples;
            },
        });
    }
    getDODOV2BuyQuotes(registry, offset, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.DodoV2,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromDODOV2,
            params: [registry, offset, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [isSellBase, pool, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromDODOV2', callResults);
                fillData.isSellBase = isSellBase;
                fillData.poolAddress = pool;
                return samples;
            },
        });
    }
    getMakerPsmSellQuotes(psmInfo, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MakerPsm,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMakerPsm,
            params: [psmInfo, takerToken, makerToken, takerFillAmounts],
        });
    }
    getMakerPsmBuyQuotes(psmInfo, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MakerPsm,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMakerPsm,
            params: [psmInfo, takerToken, makerToken, makerFillAmounts],
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
        const _sources = exports.BATCH_SOURCE_FILTERS.getAllowed(sources);
        return _.flatten(_sources.map((source) => {
            switch (source) {
                case types_1.ERC20BridgeSource.Eth2Dai:
                    return this.getEth2DaiSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Uniswap:
                    return this.getUniswapSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.UniswapV2:
                    const ops = [
                        this.getUniswapV2SellQuotes(constants_1.MAINNET_UNISWAP_V2_ROUTER, [takerToken, makerToken], takerFillAmounts),
                    ];
                    intermediateTokens.forEach(t => {
                        ops.push(this.getUniswapV2SellQuotes(constants_1.MAINNET_UNISWAP_V2_ROUTER, [takerToken, t, makerToken], takerFillAmounts));
                    });
                    return ops;
                case types_1.ERC20BridgeSource.SushiSwap:
                    const sushiOps = [this.getSushiSwapSellQuotes([takerToken, makerToken], takerFillAmounts)];
                    intermediateTokens.forEach(t => {
                        sushiOps.push(this.getSushiSwapSellQuotes([takerToken, t, makerToken], takerFillAmounts));
                    });
                    return sushiOps;
                case types_1.ERC20BridgeSource.CryptoCom:
                    const cryptoComOps = [
                        this.getUniswapV2SellQuotes(constants_1.MAINNET_CRYPTO_COM_ROUTER, [takerToken, makerToken], takerFillAmounts, types_1.ERC20BridgeSource.CryptoCom),
                    ];
                    intermediateTokens.forEach(t => {
                        cryptoComOps.push(this.getUniswapV2SellQuotes(constants_1.MAINNET_CRYPTO_COM_ROUTER, [takerToken, t, makerToken], takerFillAmounts, types_1.ERC20BridgeSource.CryptoCom));
                    });
                    return cryptoComOps;
                case types_1.ERC20BridgeSource.Kyber:
                    return bridge_source_utils_1.getKyberOffsets().map(offset => this.getKyberSellQuotes(offset, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                    return bridge_source_utils_1.getCurveInfosForPair(takerToken, makerToken).map(pool => this.getCurveSellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.Swerve:
                    return bridge_source_utils_1.getSwerveInfosForPair(takerToken, makerToken).map(pool => this.getSwerveSellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.SnowSwap:
                    return bridge_source_utils_1.getSnowSwapInfosForPair(takerToken, makerToken).map(pool => this.getSnowSwapSellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    return liquidity_provider_utils_1.getLiquidityProvidersForPair(this.liquidityProviderRegistry, takerToken, makerToken).map(pool => this.getLiquidityProviderSellQuotes(pool, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.MStable:
                    return this.getMStableSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Mooniswap:
                    return [
                        ...[
                            constants_1.MAINNET_MOONISWAP_REGISTRY,
                            constants_1.MAINNET_MOONISWAP_V2_REGISTRY,
                            constants_1.MAINNET_MOONISWAP_V2_1_REGISTRY,
                        ].map(registry => this.getMooniswapSellQuotes(registry, makerToken, takerToken, takerFillAmounts)),
                    ];
                case types_1.ERC20BridgeSource.Balancer:
                    return this.balancerPoolsCache
                        .getCachedPoolAddressesForPair(takerToken, makerToken)
                        .map(poolAddress => this.getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts, types_1.ERC20BridgeSource.Balancer));
                case types_1.ERC20BridgeSource.Cream:
                    return this.creamPoolsCache
                        .getCachedPoolAddressesForPair(takerToken, makerToken)
                        .map(poolAddress => this.getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts, types_1.ERC20BridgeSource.Cream));
                case types_1.ERC20BridgeSource.Shell:
                    return shell_utils_1.getShellsForPair(takerToken, makerToken).map(pool => this.getShellSellQuotes(pool, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.Dodo:
                    return this.getDODOSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.DodoV2:
                    return [
                        ...bridge_source_utils_1.getDodoV2Offsets().map(offset => this.getDODOV2SellQuotes(constants_1.MAINNET_DODOV2_PRIVATE_POOL_FACTORY, offset, makerToken, takerToken, takerFillAmounts)),
                        ...bridge_source_utils_1.getDodoV2Offsets().map(offset => this.getDODOV2SellQuotes(constants_1.MAINNET_DODOV2_VENDING_MACHINE_FACTORY, offset, makerToken, takerToken, takerFillAmounts)),
                    ];
                case types_1.ERC20BridgeSource.Bancor:
                    return this.getBancorSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Linkswap:
                    const linkOps = [
                        this.getUniswapV2SellQuotes(constants_1.MAINNET_LINKSWAP_ROUTER, [takerToken, makerToken], takerFillAmounts, types_1.ERC20BridgeSource.Linkswap),
                    ];
                    // LINK is the base asset in many of the pools on Linkswap
                    multihop_utils_1.getIntermediateTokens(makerToken, takerToken, {
                        default: [constants_1.TOKENS.LINK, constants_1.TOKENS.WETH],
                    }).forEach(t => {
                        linkOps.push(this.getUniswapV2SellQuotes(constants_1.MAINNET_LINKSWAP_ROUTER, [takerToken, t, makerToken], takerFillAmounts, types_1.ERC20BridgeSource.Linkswap));
                    });
                    return linkOps;
                case types_1.ERC20BridgeSource.MakerPsm:
                    return this.getMakerPsmSellQuotes({
                        psmAddress: constants_1.MAINNET_MAKER_PSM_CONTRACT,
                        ilkIdentifier: constants_1.MAINNET_MAKER_PSM_ILK_IDENTIFIER,
                        gemTokenAddress: constants_1.MAINNET_MAKER_PSM_GEM_TOKEN,
                    }, makerToken, takerToken, takerFillAmounts);
                default:
                    throw new Error(`Unsupported sell sample source: ${source}`);
            }
        }));
    }
    _getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts) {
        // Find the adjacent tokens in the provided tooken adjacency graph,
        // e.g if this is DAI->USDC we may check for DAI->WETH->USDC
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, this.tokenAdjacencyGraph);
        const _sources = exports.BATCH_SOURCE_FILTERS.getAllowed(sources);
        return _.flatten(_sources.map((source) => {
            switch (source) {
                case types_1.ERC20BridgeSource.Eth2Dai:
                    return this.getEth2DaiBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.Uniswap:
                    return this.getUniswapBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.UniswapV2:
                    const ops = [
                        this.getUniswapV2BuyQuotes(constants_1.MAINNET_UNISWAP_V2_ROUTER, [takerToken, makerToken], makerFillAmounts),
                    ];
                    intermediateTokens.forEach(t => {
                        ops.push(this.getUniswapV2BuyQuotes(constants_1.MAINNET_UNISWAP_V2_ROUTER, [takerToken, t, makerToken], makerFillAmounts));
                    });
                    return ops;
                case types_1.ERC20BridgeSource.SushiSwap:
                    const sushiOps = [this.getSushiSwapBuyQuotes([takerToken, makerToken], makerFillAmounts)];
                    intermediateTokens.forEach(t => {
                        sushiOps.push(this.getSushiSwapBuyQuotes([takerToken, t, makerToken], makerFillAmounts));
                    });
                    return sushiOps;
                case types_1.ERC20BridgeSource.CryptoCom:
                    const cryptoComOps = [
                        this.getUniswapV2BuyQuotes(constants_1.MAINNET_CRYPTO_COM_ROUTER, [takerToken, makerToken], makerFillAmounts, types_1.ERC20BridgeSource.CryptoCom),
                    ];
                    intermediateTokens.forEach(t => {
                        cryptoComOps.push(this.getUniswapV2BuyQuotes(constants_1.MAINNET_CRYPTO_COM_ROUTER, [takerToken, t, makerToken], makerFillAmounts, types_1.ERC20BridgeSource.CryptoCom));
                    });
                    return cryptoComOps;
                case types_1.ERC20BridgeSource.Kyber:
                    return bridge_source_utils_1.getKyberOffsets().map(offset => this.getKyberBuyQuotes(offset, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                    return bridge_source_utils_1.getCurveInfosForPair(takerToken, makerToken).map(pool => this.getCurveBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.Swerve:
                    return bridge_source_utils_1.getSwerveInfosForPair(takerToken, makerToken).map(pool => this.getSwerveBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.SnowSwap:
                    return bridge_source_utils_1.getSnowSwapInfosForPair(takerToken, makerToken).map(pool => this.getSnowSwapBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    return liquidity_provider_utils_1.getLiquidityProvidersForPair(this.liquidityProviderRegistry, takerToken, makerToken).map(pool => this.getLiquidityProviderBuyQuotes(pool, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.MStable:
                    return this.getMStableBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.Mooniswap:
                    return [
                        ...[
                            constants_1.MAINNET_MOONISWAP_REGISTRY,
                            constants_1.MAINNET_MOONISWAP_V2_REGISTRY,
                            constants_1.MAINNET_MOONISWAP_V2_1_REGISTRY,
                        ].map(registry => this.getMooniswapBuyQuotes(registry, makerToken, takerToken, makerFillAmounts)),
                    ];
                case types_1.ERC20BridgeSource.Balancer:
                    return this.balancerPoolsCache
                        .getCachedPoolAddressesForPair(takerToken, makerToken)
                        .map(poolAddress => this.getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts, types_1.ERC20BridgeSource.Balancer));
                case types_1.ERC20BridgeSource.Cream:
                    return this.creamPoolsCache
                        .getCachedPoolAddressesForPair(takerToken, makerToken)
                        .map(poolAddress => this.getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts, types_1.ERC20BridgeSource.Cream));
                case types_1.ERC20BridgeSource.Shell:
                    return shell_utils_1.getShellsForPair(takerToken, makerToken).map(pool => this.getShellBuyQuotes(pool, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.Dodo:
                    return this.getDODOBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.DodoV2:
                    return [
                        ...bridge_source_utils_1.getDodoV2Offsets().map(offset => this.getDODOV2BuyQuotes(constants_1.MAINNET_DODOV2_PRIVATE_POOL_FACTORY, offset, makerToken, takerToken, makerFillAmounts)),
                        ...bridge_source_utils_1.getDodoV2Offsets().map(offset => this.getDODOV2BuyQuotes(constants_1.MAINNET_DODOV2_VENDING_MACHINE_FACTORY, offset, makerToken, takerToken, makerFillAmounts)),
                    ];
                case types_1.ERC20BridgeSource.Bancor:
                    return this.getBancorBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.Linkswap:
                    const linkOps = [
                        this.getUniswapV2BuyQuotes(constants_1.MAINNET_LINKSWAP_ROUTER, [takerToken, makerToken], makerFillAmounts, types_1.ERC20BridgeSource.Linkswap),
                    ];
                    // LINK is the base asset in many of the pools on Linkswap
                    multihop_utils_1.getIntermediateTokens(makerToken, takerToken, {
                        default: [constants_1.TOKENS.LINK, constants_1.TOKENS.WETH],
                    }).forEach(t => {
                        linkOps.push(this.getUniswapV2BuyQuotes(constants_1.MAINNET_LINKSWAP_ROUTER, [takerToken, t, makerToken], makerFillAmounts, types_1.ERC20BridgeSource.Linkswap));
                    });
                    return linkOps;
                case types_1.ERC20BridgeSource.MakerPsm:
                    return this.getMakerPsmBuyQuotes({
                        psmAddress: constants_1.MAINNET_MAKER_PSM_CONTRACT,
                        ilkIdentifier: constants_1.MAINNET_MAKER_PSM_ILK_IDENTIFIER,
                        gemTokenAddress: constants_1.MAINNET_MAKER_PSM_GEM_TOKEN,
                    }, makerToken, takerToken, makerFillAmounts);
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
//# sourceMappingURL=sampler_operations_REMOTE_44103.js.map