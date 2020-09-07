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
const _ = require("lodash");
const __1 = require("../..");
const balancer_utils_1 = require("./balancer_utils");
const constants_1 = require("./constants");
const curve_utils_1 = require("./curve_utils");
const multibridge_utils_1 = require("./multibridge_utils");
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
exports.samplerOperations = {
    getOrderFillableTakerAmounts(orders, exchangeAddress) {
        return {
            encodeCall: contract => {
                return contract
                    .getOrderFillableTakerAssetAmounts(orders, orders.map(o => o.signature), exchangeAddress)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract.getABIDecodedReturnData('getOrderFillableTakerAssetAmounts', callResults);
            }),
        };
    },
    getOrderFillableMakerAmounts(orders, exchangeAddress) {
        return {
            encodeCall: contract => {
                return contract
                    .getOrderFillableMakerAssetAmounts(orders, orders.map(o => o.signature), exchangeAddress)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract.getABIDecodedReturnData('getOrderFillableMakerAssetAmounts', callResults);
            }),
        };
    },
    getKyberSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Kyber,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromKyberNetwork(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromKyberNetwork', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getKyberBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Kyber,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromKyberNetwork(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromKyberNetwork', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getUniswapSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Uniswap,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromUniswap(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromUniswap', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getUniswapBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Uniswap,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromUniswap(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromUniswap', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getUniswapV2SellQuotes(tokenAddressPath, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.UniswapV2,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromUniswapV2(tokenAddressPath, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromUniswapV2', callResults)
                    .map(amount => ({
                    amount,
                    fillData: { tokenAddressPath },
                }));
            }),
        };
    },
    getUniswapV2BuyQuotes(tokenAddressPath, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.UniswapV2,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromUniswapV2(tokenAddressPath, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromUniswapV2', callResults)
                    .map(amount => ({
                    amount,
                    fillData: { tokenAddressPath },
                }));
            }),
        };
    },
    getLiquidityProviderSellQuotes(registryAddress, makerToken, takerToken, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.LiquidityProvider,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromLiquidityProviderRegistry(registryAddress, takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromLiquidityProviderRegistry', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getLiquidityProviderBuyQuotes(registryAddress, makerToken, takerToken, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.LiquidityProvider,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromLiquidityProviderRegistry(registryAddress, takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromLiquidityProviderRegistry', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getMultiBridgeSellQuotes(multiBridgeAddress, makerToken, intermediateToken, takerToken, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.MultiBridge,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromMultiBridge(multiBridgeAddress, takerToken, intermediateToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromMultiBridge', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getEth2DaiSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Eth2Dai,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromEth2Dai(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromEth2Dai', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getEth2DaiBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Eth2Dai,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromEth2Dai(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromEth2Dai', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getCurveSellQuotes(curve, fromTokenIdx, toTokenIdx, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Curve,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromCurve({
                    poolAddress: curve.poolAddress,
                    sellQuoteFunctionSelector: curve.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: curve.buyQuoteFunctionSelector,
                }, new __1.BigNumber(fromTokenIdx), new __1.BigNumber(toTokenIdx), takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromCurve', callResults)
                    .map(amount => ({
                    amount,
                    fillData: {
                        curve,
                        fromTokenIdx,
                        toTokenIdx,
                    },
                }));
            }),
        };
    },
    getCurveBuyQuotes(curve, fromTokenIdx, toTokenIdx, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Curve,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromCurve({
                    poolAddress: curve.poolAddress,
                    sellQuoteFunctionSelector: curve.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: curve.buyQuoteFunctionSelector,
                }, new __1.BigNumber(fromTokenIdx), new __1.BigNumber(toTokenIdx), makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromCurve', callResults)
                    .map(amount => ({
                    amount,
                    fillData: {
                        curve,
                        fromTokenIdx,
                        toTokenIdx,
                    },
                }));
            }),
        };
    },
    getBancorSellQuotes(makerToken, takerToken, takerFillAmounts, bancorService) {
        return {
            source: __1.ERC20BridgeSource.Bancor,
            encodeCall: _contract => {
                return '0x';
            },
            handleCallResultsAsync: (_contract, _callResults) => __awaiter(this, void 0, void 0, function* () {
                return Promise.all(takerFillAmounts.map((amt) => __awaiter(this, void 0, void 0, function* () { return bancorService.getQuoteAsync(takerToken, makerToken, amt); })));
            }),
        };
    },
    getBalancerSellQuotes(pool, takerFillAmounts) {
        return Object.assign({ source: __1.ERC20BridgeSource.Balancer }, exports.samplerOperations.constant(takerFillAmounts.map(amount => ({
            amount: balancer_utils_1.computeBalancerSellQuote(pool, amount),
            fillData: { poolAddress: pool.id },
        }))));
    },
    getBalancerBuyQuotes(pool, makerFillAmounts) {
        return Object.assign({ source: __1.ERC20BridgeSource.Balancer }, exports.samplerOperations.constant(makerFillAmounts.map(amount => ({
            amount: balancer_utils_1.computeBalancerBuyQuote(pool, amount),
            fillData: { poolAddress: pool.id },
        }))));
    },
    getMStableSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.MStable,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromMStable(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromMStable', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getMStableBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.MStable,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromMStable(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromMStable', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getMooniswapSellQuotes(makerToken, takerToken, takerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Mooniswap,
            encodeCall: contract => {
                return contract
                    .sampleSellsFromMooniswap(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleSellsFromMooniswap', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getMooniswapBuyQuotes(makerToken, takerToken, makerFillAmounts) {
        return {
            source: __1.ERC20BridgeSource.Mooniswap,
            encodeCall: contract => {
                return contract
                    .sampleBuysFromMooniswap(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract
                    .getABIDecodedReturnData('sampleBuysFromMooniswap', callResults)
                    .map(amount => ({ amount }));
            }),
        };
    },
    getMedianSellRateAsync: (sources, makerToken, takerToken, takerFillAmount, wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress, multiBridgeAddress, bancorService) => __awaiter(this, void 0, void 0, function* () {
        if (makerToken.toLowerCase() === takerToken.toLowerCase()) {
            return exports.samplerOperations.constant(new __1.BigNumber(1));
        }
        const getSellQuotes = yield exports.samplerOperations.getSellQuotesAsync(sources, makerToken, takerToken, [takerFillAmount], wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress, multiBridgeAddress, bancorService);
        return {
            encodeCall: contract => {
                const encodedCall = getSellQuotes.encodeCall(contract);
                // All soures were excluded
                if (encodedCall === constants_1.NULL_BYTES) {
                    return constants_1.NULL_BYTES;
                }
                const subCalls = [getSellQuotes.encodeCall(contract)];
                return contract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                if (callResults === constants_1.NULL_BYTES) {
                    return constants_1.ZERO_AMOUNT;
                }
                const rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                const samples = yield getSellQuotes.handleCallResultsAsync(contract, rawSubCallResults[0]);
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
            }),
        };
    }),
    constant(result) {
        return {
            encodeCall: _contract => {
                return constants_1.NULL_BYTES;
            },
            handleCallResultsAsync: (_contract, _callResults) => __awaiter(this, void 0, void 0, function* () {
                return result;
            }),
        };
    },
    getLiquidityProviderFromRegistry(registryAddress, makerToken, takerToken) {
        return {
            encodeCall: contract => {
                return contract
                    .getLiquidityProviderFromRegistry(registryAddress, takerToken, makerToken)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                return contract.getABIDecodedReturnData('getLiquidityProviderFromRegistry', callResults);
            }),
        };
    },
    getSellQuotesAsync: (sources, makerToken, takerToken, takerFillAmounts, wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress, multiBridgeAddress, bancorService) => __awaiter(this, void 0, void 0, function* () {
        const subOps = _.flatten(yield Promise.all(sources.map((source) => __awaiter(this, void 0, void 0, function* () {
            switch (source) {
                case __1.ERC20BridgeSource.Eth2Dai:
                    return exports.samplerOperations.getEth2DaiSellQuotes(makerToken, takerToken, takerFillAmounts);
                case __1.ERC20BridgeSource.Uniswap:
                    return exports.samplerOperations.getUniswapSellQuotes(makerToken, takerToken, takerFillAmounts);
                case __1.ERC20BridgeSource.UniswapV2:
                    const ops = [
                        exports.samplerOperations.getUniswapV2SellQuotes([takerToken, makerToken], takerFillAmounts),
                    ];
                    if (takerToken !== wethAddress && makerToken !== wethAddress) {
                        ops.push(exports.samplerOperations.getUniswapV2SellQuotes([takerToken, wethAddress, makerToken], takerFillAmounts));
                    }
                    return ops;
                case __1.ERC20BridgeSource.Kyber:
                    return exports.samplerOperations.getKyberSellQuotes(makerToken, takerToken, takerFillAmounts);
                case __1.ERC20BridgeSource.Curve:
                    return curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(curve => exports.samplerOperations.getCurveSellQuotes(curve, curve.tokens.indexOf(takerToken), curve.tokens.indexOf(makerToken), takerFillAmounts));
                case __1.ERC20BridgeSource.LiquidityProvider:
                    if (liquidityProviderRegistryAddress === undefined) {
                        throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                    }
                    return exports.samplerOperations.getLiquidityProviderSellQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, takerFillAmounts);
                case __1.ERC20BridgeSource.MultiBridge:
                    if (multiBridgeAddress === undefined) {
                        throw new Error('Cannot sample liquidity from MultiBridge if an address is not provided.');
                    }
                    const intermediateToken = multibridge_utils_1.getMultiBridgeIntermediateToken(takerToken, makerToken);
                    return exports.samplerOperations.getMultiBridgeSellQuotes(multiBridgeAddress, makerToken, intermediateToken, takerToken, takerFillAmounts);
                // todo: refactor sampler ops to share state with DexOrderSampler so cache doesn't have to be passed as a param
                case __1.ERC20BridgeSource.Balancer:
                    if (balancerPoolsCache === undefined) {
                        throw new Error('Cannot sample liquidity from Balancer if a cache is not provided.');
                    }
                    const pools = yield balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
                    return pools.map(pool => exports.samplerOperations.getBalancerSellQuotes(pool, takerFillAmounts));
                case __1.ERC20BridgeSource.Bancor:
                    if (bancorService === undefined) {
                        throw new Error('Cannot sample liquidity from Bancor; no Bancor service instantiated.');
                    }
                    return exports.samplerOperations.getBancorSellQuotes(makerToken, takerToken, takerFillAmounts, bancorService);
                case __1.ERC20BridgeSource.MStable:
                    return exports.samplerOperations.getMStableSellQuotes(makerToken, takerToken, takerFillAmounts);
                case __1.ERC20BridgeSource.Mooniswap:
                    return exports.samplerOperations.getMooniswapSellQuotes(makerToken, takerToken, takerFillAmounts);
                default:
                    throw new Error(`Unsupported sell sample source: ${source}`);
            }
        }))));
        const nonSamplerSources = [__1.ERC20BridgeSource.Balancer, __1.ERC20BridgeSource.Bancor];
        const samplerOps = [];
        const nonSamplerOps = [];
        subOps.forEach(op => {
            if (nonSamplerSources.includes(op.source)) {
                nonSamplerOps.push(op);
            }
            else {
                samplerOps.push(op);
            }
        });
        return {
            encodeCall: contract => {
                // All operations are NOOPs
                if (samplerOps.length === 0) {
                    return constants_1.NULL_BYTES;
                }
                const subCalls = samplerOps.map(op => op.encodeCall(contract));
                return contract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                let samples;
                // If all operations were NOOPs then just call the handle result callback
                if (callResults === constants_1.NULL_BYTES && samplerOps.length === 0) {
                    samples = yield Promise.all(nonSamplerOps.map((op) => __awaiter(this, void 0, void 0, function* () { return op.handleCallResultsAsync(contract, ''); })));
                }
                else {
                    const rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                    samples = yield Promise.all(samplerOps.map((op, i) => __awaiter(this, void 0, void 0, function* () { return op.handleCallResultsAsync(contract, rawSubCallResults[i]); })));
                    samples = samples.concat(yield Promise.all(nonSamplerOps.map((op) => __awaiter(this, void 0, void 0, function* () { return op.handleCallResultsAsync(contract, ''); }))));
                }
                return [...samplerOps, ...nonSamplerOps].map((op, i) => {
                    return samples[i].map((output, j) => ({
                        source: op.source,
                        output: output.amount,
                        input: takerFillAmounts[j],
                        fillData: output.fillData,
                    }));
                });
            }),
        };
    }),
    getBuyQuotesAsync: (sources, makerToken, takerToken, makerFillAmounts, wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress, bancorService) => __awaiter(this, void 0, void 0, function* () {
        const subOps = _.flatten(yield Promise.all(sources.map((source) => __awaiter(this, void 0, void 0, function* () {
            switch (source) {
                case __1.ERC20BridgeSource.Eth2Dai:
                    return exports.samplerOperations.getEth2DaiBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case __1.ERC20BridgeSource.Uniswap:
                    return exports.samplerOperations.getUniswapBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case __1.ERC20BridgeSource.UniswapV2:
                    const ops = [
                        exports.samplerOperations.getUniswapV2BuyQuotes([takerToken, makerToken], makerFillAmounts),
                    ];
                    if (takerToken !== wethAddress && makerToken !== wethAddress) {
                        ops.push(exports.samplerOperations.getUniswapV2BuyQuotes([takerToken, wethAddress, makerToken], makerFillAmounts));
                    }
                    return ops;
                case __1.ERC20BridgeSource.Kyber:
                    return exports.samplerOperations.getKyberBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case __1.ERC20BridgeSource.Curve:
                    return curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(curve => exports.samplerOperations.getCurveBuyQuotes(curve, curve.tokens.indexOf(takerToken), curve.tokens.indexOf(makerToken), makerFillAmounts));
                case __1.ERC20BridgeSource.LiquidityProvider:
                    if (liquidityProviderRegistryAddress === undefined) {
                        throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                    }
                    return exports.samplerOperations.getLiquidityProviderBuyQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, makerFillAmounts);
                case __1.ERC20BridgeSource.Balancer:
                    if (balancerPoolsCache === undefined) {
                        throw new Error('Cannot sample liquidity from Balancer if a cache is not provided.');
                    }
                    const pools = yield balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken);
                    return pools.map(pool => exports.samplerOperations.getBalancerBuyQuotes(pool, makerFillAmounts));
                case __1.ERC20BridgeSource.Bancor:
                    return []; //  FIXME: Waiting for Bancor SDK to support buy quotes, but don't throw an error here
                case __1.ERC20BridgeSource.MStable:
                    return exports.samplerOperations.getMStableBuyQuotes(makerToken, takerToken, makerFillAmounts);
                case __1.ERC20BridgeSource.Mooniswap:
                    return exports.samplerOperations.getMooniswapBuyQuotes(makerToken, takerToken, makerFillAmounts);
                default:
                    throw new Error(`Unsupported buy sample source: ${source}`);
            }
        }))));
        const nonSamplerSources = [__1.ERC20BridgeSource.Balancer, __1.ERC20BridgeSource.Bancor];
        const samplerOps = [];
        const nonSamplerOps = [];
        subOps.forEach(op => {
            if (nonSamplerSources.find(s => s === op.source) !== undefined) {
                nonSamplerOps.push(op);
            }
            else {
                samplerOps.push(op);
            }
        });
        return {
            encodeCall: contract => {
                // All operations are NOOPs
                if (samplerOps.length === 0) {
                    return constants_1.NULL_BYTES;
                }
                const subCalls = samplerOps.map(op => op.encodeCall(contract));
                return contract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResultsAsync: (contract, callResults) => __awaiter(this, void 0, void 0, function* () {
                let samples;
                if (callResults === constants_1.NULL_BYTES && samplerOps.length === 0) {
                    samples = yield Promise.all(nonSamplerOps.map((op) => __awaiter(this, void 0, void 0, function* () { return op.handleCallResultsAsync(contract, ''); })));
                }
                else {
                    const rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                    samples = yield Promise.all(samplerOps.map((op, i) => __awaiter(this, void 0, void 0, function* () { return op.handleCallResultsAsync(contract, rawSubCallResults[i]); })));
                    samples = samples.concat(yield Promise.all(nonSamplerOps.map((op) => __awaiter(this, void 0, void 0, function* () { return op.handleCallResultsAsync(contract, ''); }))));
                }
                return [...samplerOps, ...nonSamplerOps].map((op, i) => {
                    return samples[i].map((output, j) => ({
                        source: op.source,
                        output: output.amount,
                        input: makerFillAmounts[j],
                        fillData: output.fillData,
                    }));
                });
            }),
        };
    }),
};
// tslint:disable max-file-line-count
//# sourceMappingURL=sampler_operations_BASE_16707.js.map