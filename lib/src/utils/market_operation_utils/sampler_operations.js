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
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const balancer_utils_1 = require("./balancer_utils");
const bancor_service_1 = require("./bancor_service");
const constants_1 = require("./constants");
const cream_utils_1 = require("./cream_utils");
const curve_utils_1 = require("./curve_utils");
const kyber_utils_1 = require("./kyber_utils");
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
    constructor(_samplerContract, provider, balancerPoolsCache = new balancer_utils_1.BalancerPoolsCache(), creamPoolsCache = new cream_utils_1.CreamPoolsCache(), getBancorServiceFn, // for dependency injection in tests
    tokenAdjacencyGraph = { default: [] }, liquidityProviderRegistry = constants_1.LIQUIDITY_PROVIDER_REGISTRY) {
        this._samplerContract = _samplerContract;
        this.provider = provider;
        this.balancerPoolsCache = balancerPoolsCache;
        this.creamPoolsCache = creamPoolsCache;
        this.getBancorServiceFn = getBancorServiceFn;
        this.tokenAdjacencyGraph = tokenAdjacencyGraph;
        this.liquidityProviderRegistry = liquidityProviderRegistry;
    }
    static constant(result) {
        return {
            encodeCall: () => {
                return '0x';
            },
            handleCallResults: _callResults => {
                return result;
            },
        };
    }
    getBancorServiceAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.getBancorServiceFn !== undefined) {
                return this.getBancorServiceFn();
            }
            if (this.provider === undefined) {
                throw new Error('Cannot sample liquidity from Bancor; no provider supplied.');
            }
            if (this._bancorService === undefined) {
                this._bancorService = yield bancor_service_1.BancorService.createAsync(this.provider);
            }
            return this._bancorService;
        });
    }
    getTokenDecimals(makerTokenAddress, takerTokenAddress) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getTokenDecimals,
            params: [makerTokenAddress, takerTokenAddress],
        });
    }
    getOrderFillableTakerAmounts(orders, exchangeAddress) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getOrderFillableTakerAssetAmounts,
            params: [orders, orders.map(o => o.signature), exchangeAddress],
        });
    }
    getOrderFillableMakerAmounts(orders, exchangeAddress) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Native,
            contract: this._samplerContract,
            function: this._samplerContract.getOrderFillableMakerAssetAmounts,
            params: [orders, orders.map(o => o.signature), exchangeAddress],
        });
    }
    getKyberSellQuotes(reserveId, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromKyberNetwork,
            params: [reserveId, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [hint, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromKyberNetwork', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                return samples;
            },
        });
    }
    getKyberBuyQuotes(reserveId, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Kyber,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromKyberNetwork,
            params: [reserveId, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [hint, samples] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromKyberNetwork', callResults);
                fillData.hint = hint;
                fillData.reserveId = reserveId;
                return samples;
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
    getUniswapV2SellQuotes(tokenAddressPath, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.UniswapV2,
            fillData: { tokenAddressPath },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromUniswapV2,
            params: [tokenAddressPath, takerFillAmounts],
        });
    }
    getUniswapV2BuyQuotes(tokenAddressPath, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.UniswapV2,
            fillData: { tokenAddressPath },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromUniswapV2,
            params: [tokenAddressPath, makerFillAmounts],
        });
    }
    getLiquidityProviderSellQuotes(providerAddress, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: { poolAddress: providerAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromLiquidityProvider,
            params: [providerAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getLiquidityProviderBuyQuotes(providerAddress, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: { poolAddress: providerAddress },
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
    getBancorSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const bancorService = yield this.getBancorServiceAsync();
            try {
                const quotes = yield bancorService.getQuotesAsync(takerToken, makerToken, takerFillAmounts);
                return quotes.map((quote, i) => ({
                    source: types_1.ERC20BridgeSource.Bancor,
                    output: quote.amount,
                    input: takerFillAmounts[i],
                    fillData: quote.fillData,
                }));
            }
            catch (e) {
                return takerFillAmounts.map(input => ({
                    source: types_1.ERC20BridgeSource.Bancor,
                    output: constants_1.ZERO_AMOUNT,
                    input,
                    fillData: { path: [], networkAddress: '' },
                }));
            }
        });
    }
    getMooniswapSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMooniswap,
            params: [takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [poolAddress, samples] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromMooniswap', callResults);
                fillData.poolAddress = poolAddress;
                return samples;
            },
        });
    }
    getMooniswapBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Mooniswap,
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromMooniswap,
            params: [takerToken, makerToken, makerFillAmounts],
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
        return {
            encodeCall: () => {
                const subCalls = subOps.map(op => op.encodeCall());
                return this._samplerContract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResults: callResults => {
                const rawSubCallResults = this._samplerContract.getABIDecodedReturnData('batchCall', callResults);
                return subOps.map((op, i) => {
                    const [output] = op.handleCallResults(rawSubCallResults[i]);
                    return {
                        source: op.source,
                        output,
                        input: sellAmount,
                        fillData: op.fillData,
                    };
                });
            },
        };
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
        return {
            encodeCall: () => {
                const subCalls = subOps.map(op => op.encodeCall());
                return this._samplerContract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResults: callResults => {
                const rawSubCallResults = this._samplerContract.getABIDecodedReturnData('batchCall', callResults);
                return subOps.map((op, i) => {
                    const [output] = op.handleCallResults(rawSubCallResults[i]);
                    return {
                        source: op.source,
                        output,
                        input: buyAmount,
                        fillData: op.fillData,
                    };
                });
            },
        };
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
    getCryptoComSellQuotes(tokenAddressPath, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.CryptoCom,
            fillData: { tokenAddressPath, router: constants_1.MAINNET_CRYPTO_COM_ROUTER },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromSushiSwap,
            params: [constants_1.MAINNET_CRYPTO_COM_ROUTER, tokenAddressPath, takerFillAmounts],
        });
    }
    getCryptoComBuyQuotes(tokenAddressPath, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.CryptoCom,
            fillData: { tokenAddressPath, router: constants_1.MAINNET_CRYPTO_COM_ROUTER },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromSushiSwap,
            params: [constants_1.MAINNET_CRYPTO_COM_ROUTER, tokenAddressPath, makerFillAmounts],
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
    getMedianSellRate(sources, makerToken, takerToken, takerFillAmount) {
        if (makerToken.toLowerCase() === takerToken.toLowerCase()) {
            return SamplerOperations.constant(new utils_1.BigNumber(1));
        }
        const subOps = this._getSellQuoteOperations(sources, makerToken, takerToken, [takerFillAmount], {
            default: [],
        });
        return {
            encodeCall: () => {
                const subCalls = subOps.map(op => op.encodeCall());
                return this._samplerContract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResults: callResults => {
                const rawSubCallResults = this._samplerContract.getABIDecodedReturnData('batchCall', callResults);
                const samples = subOps.map((op, i) => op.handleCallResults(rawSubCallResults[i]));
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
            },
        };
    }
    getSellQuotes(sources, makerToken, takerToken, takerFillAmounts) {
        const subOps = this._getSellQuoteOperations(sources, makerToken, takerToken, takerFillAmounts);
        return {
            encodeCall: () => {
                const subCalls = subOps.map(op => op.encodeCall());
                return this._samplerContract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResults: callResults => {
                const rawSubCallResults = this._samplerContract.getABIDecodedReturnData('batchCall', callResults);
                const samples = subOps.map((op, i) => op.handleCallResults(rawSubCallResults[i]));
                return subOps.map((op, i) => {
                    return samples[i].map((output, j) => ({
                        source: op.source,
                        output,
                        input: takerFillAmounts[j],
                        fillData: op.fillData,
                    }));
                });
            },
        };
    }
    getBuyQuotes(sources, makerToken, takerToken, makerFillAmounts) {
        const subOps = this._getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts);
        return {
            encodeCall: () => {
                const subCalls = subOps.map(op => op.encodeCall());
                return this._samplerContract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResults: callResults => {
                const rawSubCallResults = this._samplerContract.getABIDecodedReturnData('batchCall', callResults);
                const samples = subOps.map((op, i) => op.handleCallResults(rawSubCallResults[i]));
                return subOps.map((op, i) => {
                    return samples[i].map((output, j) => ({
                        source: op.source,
                        output,
                        input: makerFillAmounts[j],
                        fillData: op.fillData,
                    }));
                });
            },
        };
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
                    const ops = [this.getUniswapV2SellQuotes([takerToken, makerToken], takerFillAmounts)];
                    intermediateTokens.forEach(t => {
                        ops.push(this.getUniswapV2SellQuotes([takerToken, t, makerToken], takerFillAmounts));
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
                        this.getCryptoComSellQuotes([takerToken, makerToken], takerFillAmounts),
                    ];
                    intermediateTokens.forEach(t => {
                        cryptoComOps.push(this.getCryptoComSellQuotes([takerToken, t, makerToken], takerFillAmounts));
                    });
                    return cryptoComOps;
                case types_1.ERC20BridgeSource.Kyber:
                    return kyber_utils_1.getKyberReserveIdsForPair(takerToken, makerToken).map(reserveId => this.getKyberSellQuotes(reserveId, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                    return curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(pool => this.getCurveSellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.Swerve:
                    return curve_utils_1.getSwerveInfosForPair(takerToken, makerToken).map(pool => this.getSwerveSellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.SnowSwap:
                    return curve_utils_1.getSnowSwapInfosForPair(takerToken, makerToken).map(pool => this.getSnowSwapSellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    return liquidity_provider_utils_1.getLiquidityProvidersForPair(this.liquidityProviderRegistry, takerToken, makerToken).map(pool => this.getLiquidityProviderSellQuotes(pool, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.MStable:
                    return this.getMStableSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Mooniswap:
                    return this.getMooniswapSellQuotes(makerToken, takerToken, takerFillAmounts);
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
                    const ops = [this.getUniswapV2BuyQuotes([takerToken, makerToken], makerFillAmounts)];
                    intermediateTokens.forEach(t => {
                        ops.push(this.getUniswapV2BuyQuotes([takerToken, t, makerToken], makerFillAmounts));
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
                        this.getCryptoComBuyQuotes([takerToken, makerToken], makerFillAmounts),
                    ];
                    intermediateTokens.forEach(t => {
                        cryptoComOps.push(this.getCryptoComBuyQuotes([takerToken, t, makerToken], makerFillAmounts));
                    });
                    return cryptoComOps;
                case types_1.ERC20BridgeSource.Kyber:
                    return kyber_utils_1.getKyberReserveIdsForPair(takerToken, makerToken).map(reserveId => this.getKyberBuyQuotes(reserveId, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                    return curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(pool => this.getCurveBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.Swerve:
                    return curve_utils_1.getSwerveInfosForPair(takerToken, makerToken).map(pool => this.getSwerveBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.SnowSwap:
                    return curve_utils_1.getSnowSwapInfosForPair(takerToken, makerToken).map(pool => this.getSnowSwapBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    return liquidity_provider_utils_1.getLiquidityProvidersForPair(this.liquidityProviderRegistry, takerToken, makerToken).map(pool => this.getLiquidityProviderBuyQuotes(pool, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.MStable:
                    return this.getMStableBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.Mooniswap:
                    return this.getMooniswapBuyQuotes(makerToken, takerToken, makerFillAmounts);
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
                default:
                    throw new Error(`Unsupported buy sample source: ${source}`);
            }
        }));
    }
}
exports.SamplerOperations = SamplerOperations;
// tslint:disable max-file-line-count
//# sourceMappingURL=sampler_operations.js.map