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
const curve_utils_1 = require("./curve_utils");
const kyber_utils_1 = require("./kyber_utils");
const multibridge_utils_1 = require("./multibridge_utils");
const multihop_utils_1 = require("./multihop_utils");
const sampler_contract_operation_1 = require("./sampler_contract_operation");
const types_1 = require("./types");
// tslint:disable:no-inferred-empty-object-type no-unbound-method
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
class SamplerOperations {
    constructor(_samplerContract, provider, balancerPoolsCache = new balancer_utils_1.BalancerPoolsCache(), getBancorServiceFn) {
        this._samplerContract = _samplerContract;
        this.provider = provider;
        this.balancerPoolsCache = balancerPoolsCache;
        this.getBancorServiceFn = getBancorServiceFn;
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
    getLiquidityProviderSellQuotes(registryAddress, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: {},
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromLiquidityProviderRegistry,
            params: [registryAddress, takerToken, makerToken, takerFillAmounts],
            callback: (callResults, fillData) => {
                const [samples, poolAddress] = this._samplerContract.getABIDecodedReturnData('sampleSellsFromLiquidityProviderRegistry', callResults);
                fillData.poolAddress = poolAddress;
                return samples;
            },
        });
    }
    getLiquidityProviderBuyQuotes(registryAddress, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.LiquidityProvider,
            fillData: {},
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromLiquidityProviderRegistry,
            params: [registryAddress, takerToken, makerToken, makerFillAmounts],
            callback: (callResults, fillData) => {
                const [samples, poolAddress] = this._samplerContract.getABIDecodedReturnData('sampleBuysFromLiquidityProviderRegistry', callResults);
                fillData.poolAddress = poolAddress;
                return samples;
            },
        });
    }
    getMultiBridgeSellQuotes(multiBridgeAddress, makerToken, intermediateToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.MultiBridge,
            fillData: { poolAddress: multiBridgeAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromMultiBridge,
            params: [multiBridgeAddress, takerToken, intermediateToken, makerToken, takerFillAmounts],
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
    getCurveSellQuotes(curve, fromTokenIdx, toTokenIdx, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Curve,
            fillData: {
                curve,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromCurve,
            params: [
                {
                    poolAddress: curve.poolAddress,
                    sellQuoteFunctionSelector: curve.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: curve.buyQuoteFunctionSelector,
                },
                new utils_1.BigNumber(fromTokenIdx),
                new utils_1.BigNumber(toTokenIdx),
                takerFillAmounts,
            ],
        });
    }
    getCurveBuyQuotes(curve, fromTokenIdx, toTokenIdx, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Curve,
            fillData: {
                curve,
                fromTokenIdx,
                toTokenIdx,
            },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromCurve,
            params: [
                {
                    poolAddress: curve.poolAddress,
                    sellQuoteFunctionSelector: curve.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: curve.buyQuoteFunctionSelector,
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
    getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Balancer,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleSellsFromBalancer,
            params: [poolAddress, takerToken, makerToken, takerFillAmounts],
        });
    }
    getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts) {
        return new sampler_contract_operation_1.SamplerContractOperation({
            source: types_1.ERC20BridgeSource.Balancer,
            fillData: { poolAddress },
            contract: this._samplerContract,
            function: this._samplerContract.sampleBuysFromBalancer,
            params: [poolAddress, takerToken, makerToken, makerFillAmounts],
        });
    }
    getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const pools = yield this.balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
            return pools.map(pool => takerFillAmounts.map(amount => ({
                source: types_1.ERC20BridgeSource.Balancer,
                output: balancer_utils_1.computeBalancerSellQuote(pool, amount),
                input: amount,
                fillData: { poolAddress: pool.id },
            })));
        });
    }
    getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const pools = yield this.balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
            return pools.map(pool => makerFillAmounts.map(amount => ({
                source: types_1.ERC20BridgeSource.Balancer,
                output: balancer_utils_1.computeBalancerBuyQuote(pool, amount),
                input: amount,
                fillData: { poolAddress: pool.id },
            })));
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
    getTwoHopSellQuotes(sources, makerToken, takerToken, sellAmount, tokenAdjacencyGraph, wethAddress, liquidityProviderRegistryAddress) {
        if (sources.length === 0) {
            return SamplerOperations.constant([]);
        }
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, tokenAdjacencyGraph, wethAddress);
        const subOps = intermediateTokens.map(intermediateToken => {
            const firstHopOps = this._getSellQuoteOperations(sources, intermediateToken, takerToken, [constants_1.ZERO_AMOUNT], wethAddress, liquidityProviderRegistryAddress);
            const secondHopOps = this._getSellQuoteOperations(sources, makerToken, intermediateToken, [constants_1.ZERO_AMOUNT], wethAddress, liquidityProviderRegistryAddress);
            return new sampler_contract_operation_1.SamplerContractOperation({
                contract: this._samplerContract,
                source: types_1.ERC20BridgeSource.MultiHop,
                function: this._samplerContract.sampleTwoHopSell,
                params: [firstHopOps.map(op => op.encodeCall()), secondHopOps.map(op => op.encodeCall()), sellAmount],
                fillData: { intermediateToken },
                callback: (callResults, fillData) => {
                    const [firstHop, secondHop, buyAmount] = this._samplerContract.getABIDecodedReturnData('sampleTwoHopSell', callResults);
                    if (buyAmount.isZero()) {
                        return [constants_1.ZERO_AMOUNT];
                    }
                    fillData.firstHopSource = firstHopOps[firstHop.sourceIndex.toNumber()];
                    fillData.secondHopSource = secondHopOps[secondHop.sourceIndex.toNumber()];
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
    getTwoHopBuyQuotes(sources, makerToken, takerToken, buyAmount, tokenAdjacencyGraph, wethAddress, liquidityProviderRegistryAddress) {
        if (sources.length === 0) {
            return SamplerOperations.constant([]);
        }
        const intermediateTokens = multihop_utils_1.getIntermediateTokens(makerToken, takerToken, tokenAdjacencyGraph, wethAddress);
        const subOps = intermediateTokens.map(intermediateToken => {
            const firstHopOps = this._getBuyQuoteOperations(sources, intermediateToken, takerToken, [new utils_1.BigNumber(0)], wethAddress, liquidityProviderRegistryAddress);
            const secondHopOps = this._getBuyQuoteOperations(sources, makerToken, intermediateToken, [new utils_1.BigNumber(0)], wethAddress, liquidityProviderRegistryAddress);
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
    getMedianSellRate(sources, makerToken, takerToken, takerFillAmount, wethAddress, liquidityProviderRegistryAddress, multiBridgeAddress) {
        if (makerToken.toLowerCase() === takerToken.toLowerCase()) {
            return SamplerOperations.constant(new utils_1.BigNumber(1));
        }
        const getSellQuotes = this.getSellQuotes(sources, makerToken, takerToken, [takerFillAmount], wethAddress, liquidityProviderRegistryAddress, multiBridgeAddress);
        return {
            encodeCall: () => {
                const encodedCall = getSellQuotes.encodeCall();
                // All soures were excluded
                if (encodedCall === constants_1.NULL_BYTES) {
                    return constants_1.NULL_BYTES;
                }
                return this._samplerContract.batchCall([encodedCall]).getABIEncodedTransactionData();
            },
            handleCallResults: callResults => {
                if (callResults === constants_1.NULL_BYTES) {
                    return constants_1.ZERO_AMOUNT;
                }
                const rawSubCallResults = this._samplerContract.getABIDecodedReturnData('batchCall', callResults);
                const samples = getSellQuotes.handleCallResults(rawSubCallResults[0]);
                if (samples.length === 0) {
                    return constants_1.ZERO_AMOUNT;
                }
                const flatSortedSamples = samples
                    .reduce((acc, v) => acc.concat(...v))
                    .filter(v => !v.output.isZero())
                    .sort((a, b) => a.output.comparedTo(b.output));
                if (flatSortedSamples.length === 0) {
                    return constants_1.ZERO_AMOUNT;
                }
                const medianSample = flatSortedSamples[Math.floor(flatSortedSamples.length / 2)];
                return medianSample.output.div(medianSample.input);
            },
        };
    }
    getSellQuotes(sources, makerToken, takerToken, takerFillAmounts, wethAddress, liquidityProviderRegistryAddress, multiBridgeAddress) {
        const subOps = this._getSellQuoteOperations(sources, makerToken, takerToken, takerFillAmounts, wethAddress, liquidityProviderRegistryAddress, multiBridgeAddress);
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
    getBuyQuotes(sources, makerToken, takerToken, makerFillAmounts, wethAddress, liquidityProviderRegistryAddress) {
        const subOps = this._getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts, wethAddress, liquidityProviderRegistryAddress);
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
    _getSellQuoteOperations(sources, makerToken, takerToken, takerFillAmounts, wethAddress, liquidityProviderRegistryAddress, multiBridgeAddress) {
        return _.flatten(sources.map((source) => {
            switch (source) {
                case types_1.ERC20BridgeSource.Eth2Dai:
                    return this.getEth2DaiSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Uniswap:
                    return this.getUniswapSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.UniswapV2:
                    const ops = [this.getUniswapV2SellQuotes([takerToken, makerToken], takerFillAmounts)];
                    if (takerToken !== wethAddress && makerToken !== wethAddress) {
                        ops.push(this.getUniswapV2SellQuotes([takerToken, wethAddress, makerToken], takerFillAmounts));
                    }
                    return ops;
                case types_1.ERC20BridgeSource.SushiSwap:
                    const sushiOps = [this.getSushiSwapSellQuotes([takerToken, makerToken], takerFillAmounts)];
                    if (takerToken !== wethAddress && makerToken !== wethAddress) {
                        sushiOps.push(this.getSushiSwapSellQuotes([takerToken, wethAddress, makerToken], takerFillAmounts));
                    }
                    return sushiOps;
                case types_1.ERC20BridgeSource.Kyber:
                    return kyber_utils_1.getKyberReserveIdsForPair(takerToken, makerToken).map(reserveId => this.getKyberSellQuotes(reserveId, makerToken, takerToken, takerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                    return curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(curve => this.getCurveSellQuotes(curve, curve.tokens.indexOf(takerToken), curve.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.Swerve:
                    return curve_utils_1.getSwerveInfosForPair(takerToken, makerToken).map(pool => this.getSwerveSellQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), takerFillAmounts));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    if (liquidityProviderRegistryAddress === undefined) {
                        throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                    }
                    return this.getLiquidityProviderSellQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.MultiBridge:
                    if (multiBridgeAddress === undefined) {
                        throw new Error('Cannot sample liquidity from MultiBridge if an address is not provided.');
                    }
                    const intermediateToken = multibridge_utils_1.getMultiBridgeIntermediateToken(takerToken, makerToken);
                    return this.getMultiBridgeSellQuotes(multiBridgeAddress, makerToken, intermediateToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.MStable:
                    return this.getMStableSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Mooniswap:
                    return this.getMooniswapSellQuotes(makerToken, takerToken, takerFillAmounts);
                case types_1.ERC20BridgeSource.Balancer:
                    return this.balancerPoolsCache
                        .getCachedPoolAddressesForPair(takerToken, makerToken)
                        .map(poolAddress => this.getBalancerSellQuotes(poolAddress, makerToken, takerToken, takerFillAmounts));
                default:
                    throw new Error(`Unsupported sell sample source: ${source}`);
            }
        }));
    }
    _getBuyQuoteOperations(sources, makerToken, takerToken, makerFillAmounts, wethAddress, liquidityProviderRegistryAddress) {
        return _.flatten(sources.map((source) => {
            switch (source) {
                case types_1.ERC20BridgeSource.Eth2Dai:
                    return this.getEth2DaiBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.Uniswap:
                    return this.getUniswapBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.UniswapV2:
                    const ops = [this.getUniswapV2BuyQuotes([takerToken, makerToken], makerFillAmounts)];
                    if (takerToken !== wethAddress && makerToken !== wethAddress) {
                        ops.push(this.getUniswapV2BuyQuotes([takerToken, wethAddress, makerToken], makerFillAmounts));
                    }
                    return ops;
                case types_1.ERC20BridgeSource.SushiSwap:
                    const sushiOps = [this.getSushiSwapBuyQuotes([takerToken, makerToken], makerFillAmounts)];
                    if (takerToken !== wethAddress && makerToken !== wethAddress) {
                        sushiOps.push(this.getSushiSwapBuyQuotes([takerToken, wethAddress, makerToken], makerFillAmounts));
                    }
                    return sushiOps;
                case types_1.ERC20BridgeSource.Kyber:
                    return kyber_utils_1.getKyberReserveIdsForPair(takerToken, makerToken).map(reserveId => this.getKyberBuyQuotes(reserveId, makerToken, takerToken, makerFillAmounts));
                case types_1.ERC20BridgeSource.Curve:
                    return curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(curve => this.getCurveBuyQuotes(curve, curve.tokens.indexOf(takerToken), curve.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.Swerve:
                    return curve_utils_1.getSwerveInfosForPair(takerToken, makerToken).map(pool => this.getSwerveBuyQuotes(pool, pool.tokens.indexOf(takerToken), pool.tokens.indexOf(makerToken), makerFillAmounts));
                case types_1.ERC20BridgeSource.LiquidityProvider:
                    if (liquidityProviderRegistryAddress === undefined) {
                        throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                    }
                    return this.getLiquidityProviderBuyQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.MStable:
                    return this.getMStableBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.Mooniswap:
                    return this.getMooniswapBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case types_1.ERC20BridgeSource.Balancer:
                    return this.balancerPoolsCache
                        .getCachedPoolAddressesForPair(takerToken, makerToken)
                        .map(poolAddress => this.getBalancerBuyQuotes(poolAddress, makerToken, takerToken, makerFillAmounts));
                default:
                    throw new Error(`Unsupported buy sample source: ${source}`);
            }
        }));
    }
}
exports.SamplerOperations = SamplerOperations;
// tslint:disable max-file-line-count
//# sourceMappingURL=sampler_operations.js.map