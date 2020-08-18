"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var __1 = require("../..");
var balancer_utils_1 = require("./balancer_utils");
var curve_utils_1 = require("./curve_utils");
var multibridge_utils_1 = require("./multibridge_utils");
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
exports.samplerOperations = {
    getOrderFillableTakerAmounts: function (orders, exchangeAddress) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .getOrderFillableTakerAssetAmounts(orders, orders.map(function (o) { return o.signature; }), exchangeAddress)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('getOrderFillableTakerAssetAmounts', callResults)];
                });
            }); },
        };
    },
    getOrderFillableMakerAmounts: function (orders, exchangeAddress) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .getOrderFillableMakerAssetAmounts(orders, orders.map(function (o) { return o.signature; }), exchangeAddress)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('getOrderFillableMakerAssetAmounts', callResults)];
                });
            }); },
        };
    },
    getKyberSellQuotes: function (makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Kyber,
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromKyberNetwork(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromKyberNetwork', callResults)];
                });
            }); },
        };
    },
    getKyberBuyQuotes: function (makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Kyber,
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromKyberNetwork(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromKyberNetwork', callResults)];
                });
            }); },
        };
    },
    getUniswapSellQuotes: function (makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Uniswap,
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromUniswap(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromUniswap', callResults)];
                });
            }); },
        };
    },
    getUniswapBuyQuotes: function (makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Uniswap,
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromUniswap(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromUniswap', callResults)];
                });
            }); },
        };
    },
    getUniswapV2SellQuotes: function (tokenAddressPath, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.UniswapV2,
            fillData: { tokenAddressPath: tokenAddressPath },
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromUniswapV2(tokenAddressPath, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromUniswapV2', callResults)];
                });
            }); },
        };
    },
    getUniswapV2BuyQuotes: function (tokenAddressPath, makerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.UniswapV2,
            fillData: { tokenAddressPath: tokenAddressPath },
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromUniswapV2(tokenAddressPath, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromUniswapV2', callResults)];
                });
            }); },
        };
    },
    getLiquidityProviderSellQuotes: function (registryAddress, makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.LiquidityProvider,
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromLiquidityProviderRegistry(registryAddress, takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromLiquidityProviderRegistry', callResults)];
                });
            }); },
        };
    },
    getLiquidityProviderBuyQuotes: function (registryAddress, makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.LiquidityProvider,
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromLiquidityProviderRegistry(registryAddress, takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromLiquidityProviderRegistry', callResults)];
                });
            }); },
        };
    },
    getMultiBridgeSellQuotes: function (multiBridgeAddress, makerToken, intermediateToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.MultiBridge,
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromMultiBridge(multiBridgeAddress, takerToken, intermediateToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromMultiBridge', callResults)];
                });
            }); },
        };
    },
    getEth2DaiSellQuotes: function (makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Eth2Dai,
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromEth2Dai(takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromEth2Dai', callResults)];
                });
            }); },
        };
    },
    getEth2DaiBuyQuotes: function (makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Eth2Dai,
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromEth2Dai(takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromEth2Dai', callResults)];
                });
            }); },
        };
    },
    getCurveSellQuotes: function (curve, fromTokenIdx, toTokenIdx, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Curve,
            fillData: {
                curve: curve,
                fromTokenIdx: fromTokenIdx,
                toTokenIdx: toTokenIdx,
            },
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromCurve({
                    poolAddress: curve.poolAddress,
                    sellQuoteFunctionSelector: curve.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: curve.buyQuoteFunctionSelector,
                }, new __1.BigNumber(fromTokenIdx), new __1.BigNumber(toTokenIdx), takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromCurve', callResults)];
                });
            }); },
        };
    },
    getCurveBuyQuotes: function (curve, fromTokenIdx, toTokenIdx, makerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.Curve,
            fillData: {
                curve: curve,
                fromTokenIdx: fromTokenIdx,
                toTokenIdx: toTokenIdx,
            },
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromCurve({
                    poolAddress: curve.poolAddress,
                    sellQuoteFunctionSelector: curve.sellQuoteFunctionSelector,
                    buyQuoteFunctionSelector: curve.buyQuoteFunctionSelector,
                }, new __1.BigNumber(fromTokenIdx), new __1.BigNumber(toTokenIdx), makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromCurve', callResults)];
                });
            }); },
        };
    },
    getBalancerSellQuotes: function (pool, takerFillAmounts) {
        return __assign({ source: __1.ERC20BridgeSource.Balancer, fillData: { poolAddress: pool.id } }, exports.samplerOperations.constant(takerFillAmounts.map(function (amount) { return balancer_utils_1.computeBalancerSellQuote(pool, amount); })));
    },
    getBalancerBuyQuotes: function (pool, makerFillAmounts) {
        return __assign({ source: __1.ERC20BridgeSource.Balancer, fillData: { poolAddress: pool.id } }, exports.samplerOperations.constant(makerFillAmounts.map(function (amount) { return balancer_utils_1.computeBalancerBuyQuote(pool, amount); })));
    },
    getMStableSellQuotes: function (makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.MStable,
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromMStable(makerToken, takerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromMStable', callResults)];
                });
            }); },
        };
    },
    getMStableBuyQuotes: function (makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
            source: __1.ERC20BridgeSource.MStable,
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromMStable(makerToken, takerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromMStable', callResults)];
                });
            }); },
        };
    },
    getMedianSellRateAsync: function (sources, makerToken, takerToken, takerFillAmount, wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress, multiBridgeAddress) { return __awaiter(_this, void 0, void 0, function () {
        var getSellQuotes;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (makerToken.toLowerCase() === takerToken.toLowerCase()) {
                        return [2 /*return*/, exports.samplerOperations.constant(new __1.BigNumber(1))];
                    }
                    return [4 /*yield*/, exports.samplerOperations.getSellQuotesAsync(sources, makerToken, takerToken, [takerFillAmount], wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress, multiBridgeAddress)];
                case 1:
                    getSellQuotes = _a.sent();
                    return [2 /*return*/, {
                            encodeCall: function (contract) {
                                var subCalls = [getSellQuotes.encodeCall(contract)];
                                return contract.batchCall(subCalls).getABIEncodedTransactionData();
                            },
                            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                                var rawSubCallResults, samples, flatSortedSamples, medianSample;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                                            return [4 /*yield*/, getSellQuotes.handleCallResultsAsync(contract, rawSubCallResults[0])];
                                        case 1:
                                            samples = _a.sent();
                                            if (samples.length === 0) {
                                                return [2 /*return*/, new __1.BigNumber(0)];
                                            }
                                            flatSortedSamples = samples
                                                .reduce(function (acc, v) { return acc.concat.apply(acc, __spread(v)); })
                                                .filter(function (v) { return !v.output.isZero(); })
                                                .sort(function (a, b) { return a.output.comparedTo(b.output); });
                                            if (flatSortedSamples.length === 0) {
                                                return [2 /*return*/, new __1.BigNumber(0)];
                                            }
                                            medianSample = flatSortedSamples[Math.floor(flatSortedSamples.length / 2)];
                                            return [2 /*return*/, medianSample.output.div(medianSample.input)];
                                    }
                                });
                            }); },
                        }];
            }
        });
    }); },
    constant: function (result) {
        var _this = this;
        return {
            encodeCall: function (_contract) {
                return '0x';
            },
            handleCallResultsAsync: function (_contract, _callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, result];
                });
            }); },
        };
    },
    getLiquidityProviderFromRegistry: function (registryAddress, makerToken, takerToken) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .getLiquidityProviderFromRegistry(registryAddress, takerToken, makerToken)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('getLiquidityProviderFromRegistry', callResults)];
                });
            }); },
        };
    },
    getSellQuotesAsync: function (sources, makerToken, takerToken, takerFillAmounts, wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress, multiBridgeAddress) { return __awaiter(_this, void 0, void 0, function () {
        var subOps, _a, _b, samplerOps, nonSamplerOps;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = _).flatten;
                    return [4 /*yield*/, Promise.all(sources.map(function (source) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, ops, intermediateToken, pools;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = source;
                                        switch (_a) {
                                            case __1.ERC20BridgeSource.Eth2Dai: return [3 /*break*/, 1];
                                            case __1.ERC20BridgeSource.Uniswap: return [3 /*break*/, 2];
                                            case __1.ERC20BridgeSource.UniswapV2: return [3 /*break*/, 3];
                                            case __1.ERC20BridgeSource.Kyber: return [3 /*break*/, 4];
                                            case __1.ERC20BridgeSource.Curve: return [3 /*break*/, 5];
                                            case __1.ERC20BridgeSource.LiquidityProvider: return [3 /*break*/, 6];
                                            case __1.ERC20BridgeSource.MultiBridge: return [3 /*break*/, 7];
                                            case __1.ERC20BridgeSource.Balancer: return [3 /*break*/, 8];
                                            case __1.ERC20BridgeSource.MStable: return [3 /*break*/, 10];
                                        }
                                        return [3 /*break*/, 11];
                                    case 1: return [2 /*return*/, exports.samplerOperations.getEth2DaiSellQuotes(makerToken, takerToken, takerFillAmounts)];
                                    case 2: return [2 /*return*/, exports.samplerOperations.getUniswapSellQuotes(makerToken, takerToken, takerFillAmounts)];
                                    case 3:
                                        ops = [
                                            exports.samplerOperations.getUniswapV2SellQuotes([takerToken, makerToken], takerFillAmounts),
                                        ];
                                        if (takerToken !== wethAddress && makerToken !== wethAddress) {
                                            ops.push(exports.samplerOperations.getUniswapV2SellQuotes([takerToken, wethAddress, makerToken], takerFillAmounts));
                                        }
                                        return [2 /*return*/, ops];
                                    case 4: return [2 /*return*/, exports.samplerOperations.getKyberSellQuotes(makerToken, takerToken, takerFillAmounts)];
                                    case 5: return [2 /*return*/, curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(function (curve) {
                                            return exports.samplerOperations.getCurveSellQuotes(curve, curve.tokens.indexOf(takerToken), curve.tokens.indexOf(makerToken), takerFillAmounts);
                                        })];
                                    case 6:
                                        if (liquidityProviderRegistryAddress === undefined) {
                                            throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                                        }
                                        return [2 /*return*/, exports.samplerOperations.getLiquidityProviderSellQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, takerFillAmounts)];
                                    case 7:
                                        if (multiBridgeAddress === undefined) {
                                            throw new Error('Cannot sample liquidity from MultiBridge if an address is not provided.');
                                        }
                                        intermediateToken = multibridge_utils_1.getMultiBridgeIntermediateToken(takerToken, makerToken);
                                        return [2 /*return*/, exports.samplerOperations.getMultiBridgeSellQuotes(multiBridgeAddress, makerToken, intermediateToken, takerToken, takerFillAmounts)];
                                    case 8:
                                        if (balancerPoolsCache === undefined) {
                                            throw new Error('Cannot sample liquidity from Balancer if a cache is not provided.');
                                        }
                                        return [4 /*yield*/, balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken)];
                                    case 9:
                                        pools = _b.sent();
                                        return [2 /*return*/, pools.map(function (pool) {
                                                return exports.samplerOperations.getBalancerSellQuotes(pool, takerFillAmounts);
                                            })];
                                    case 10: return [2 /*return*/, exports.samplerOperations.getMStableSellQuotes(makerToken, takerToken, takerFillAmounts)];
                                    case 11: throw new Error("Unsupported sell sample source: " + source);
                                }
                            });
                        }); }))];
                case 1:
                    subOps = _b.apply(_a, [_c.sent()]);
                    samplerOps = subOps.filter(function (op) { return op.source !== __1.ERC20BridgeSource.Balancer; });
                    nonSamplerOps = subOps.filter(function (op) { return op.source === __1.ERC20BridgeSource.Balancer; });
                    return [2 /*return*/, {
                            encodeCall: function (contract) {
                                var subCalls = samplerOps.map(function (op) { return op.encodeCall(contract); });
                                return contract.batchCall(subCalls).getABIEncodedTransactionData();
                            },
                            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                                var rawSubCallResults, samples, _a, _b;
                                var _this = this;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                                            return [4 /*yield*/, Promise.all(samplerOps.map(function (op, i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    return [2 /*return*/, op.handleCallResultsAsync(contract, rawSubCallResults[i])];
                                                }); }); }))];
                                        case 1:
                                            samples = _c.sent();
                                            _b = (_a = samples).concat;
                                            return [4 /*yield*/, Promise.all(nonSamplerOps.map(function (op) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    return [2 /*return*/, op.handleCallResultsAsync(contract, '')];
                                                }); }); }))];
                                        case 2:
                                            samples = _b.apply(_a, [_c.sent()]);
                                            return [2 /*return*/, __spread(samplerOps, nonSamplerOps).map(function (op, i) {
                                                    return samples[i].map(function (output, j) { return ({
                                                        source: op.source,
                                                        output: output,
                                                        input: takerFillAmounts[j],
                                                        fillData: op.fillData,
                                                    }); });
                                                })];
                                    }
                                });
                            }); },
                        }];
            }
        });
    }); },
    getBuyQuotesAsync: function (sources, makerToken, takerToken, makerFillAmounts, wethAddress, balancerPoolsCache, liquidityProviderRegistryAddress) { return __awaiter(_this, void 0, void 0, function () {
        var subOps, _a, _b, samplerOps, nonSamplerOps;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = _).flatten;
                    return [4 /*yield*/, Promise.all(sources.map(function (source) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, ops, pools;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = source;
                                        switch (_a) {
                                            case __1.ERC20BridgeSource.Eth2Dai: return [3 /*break*/, 1];
                                            case __1.ERC20BridgeSource.Uniswap: return [3 /*break*/, 2];
                                            case __1.ERC20BridgeSource.UniswapV2: return [3 /*break*/, 3];
                                            case __1.ERC20BridgeSource.Kyber: return [3 /*break*/, 4];
                                            case __1.ERC20BridgeSource.Curve: return [3 /*break*/, 5];
                                            case __1.ERC20BridgeSource.LiquidityProvider: return [3 /*break*/, 6];
                                            case __1.ERC20BridgeSource.Balancer: return [3 /*break*/, 7];
                                            case __1.ERC20BridgeSource.MStable: return [3 /*break*/, 9];
                                        }
                                        return [3 /*break*/, 10];
                                    case 1: return [2 /*return*/, exports.samplerOperations.getEth2DaiBuyQuotes(makerToken, takerToken, makerFillAmounts)];
                                    case 2: return [2 /*return*/, exports.samplerOperations.getUniswapBuyQuotes(makerToken, takerToken, makerFillAmounts)];
                                    case 3:
                                        ops = [
                                            exports.samplerOperations.getUniswapV2BuyQuotes([takerToken, makerToken], makerFillAmounts),
                                        ];
                                        if (takerToken !== wethAddress && makerToken !== wethAddress) {
                                            ops.push(exports.samplerOperations.getUniswapV2BuyQuotes([takerToken, wethAddress, makerToken], makerFillAmounts));
                                        }
                                        return [2 /*return*/, ops];
                                    case 4: return [2 /*return*/, exports.samplerOperations.getKyberBuyQuotes(makerToken, takerToken, makerFillAmounts)];
                                    case 5: return [2 /*return*/, curve_utils_1.getCurveInfosForPair(takerToken, makerToken).map(function (curve) {
                                            return exports.samplerOperations.getCurveBuyQuotes(curve, curve.tokens.indexOf(takerToken), curve.tokens.indexOf(makerToken), makerFillAmounts);
                                        })];
                                    case 6:
                                        if (liquidityProviderRegistryAddress === undefined) {
                                            throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                                        }
                                        return [2 /*return*/, exports.samplerOperations.getLiquidityProviderBuyQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, makerFillAmounts)];
                                    case 7:
                                        if (balancerPoolsCache === undefined) {
                                            throw new Error('Cannot sample liquidity from Balancer if a cache is not provided.');
                                        }
                                        return [4 /*yield*/, balancerPoolsCache.getPoolsForPairAsync(takerToken, makerToken)];
                                    case 8:
                                        pools = _b.sent();
                                        return [2 /*return*/, pools.map(function (pool) {
                                                return exports.samplerOperations.getBalancerBuyQuotes(pool, makerFillAmounts);
                                            })];
                                    case 9: return [2 /*return*/, exports.samplerOperations.getMStableBuyQuotes(makerToken, takerToken, makerFillAmounts)];
                                    case 10: throw new Error("Unsupported buy sample source: " + source);
                                }
                            });
                        }); }))];
                case 1:
                    subOps = _b.apply(_a, [_c.sent()]);
                    samplerOps = subOps.filter(function (op) { return op.source !== __1.ERC20BridgeSource.Balancer; });
                    nonSamplerOps = subOps.filter(function (op) { return op.source === __1.ERC20BridgeSource.Balancer; });
                    return [2 /*return*/, {
                            encodeCall: function (contract) {
                                var subCalls = samplerOps.map(function (op) { return op.encodeCall(contract); });
                                return contract.batchCall(subCalls).getABIEncodedTransactionData();
                            },
                            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                                var rawSubCallResults, samples, _a, _b;
                                var _this = this;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                                            return [4 /*yield*/, Promise.all(samplerOps.map(function (op, i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    return [2 /*return*/, op.handleCallResultsAsync(contract, rawSubCallResults[i])];
                                                }); }); }))];
                                        case 1:
                                            samples = _c.sent();
                                            _b = (_a = samples).concat;
                                            return [4 /*yield*/, Promise.all(nonSamplerOps.map(function (op) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    return [2 /*return*/, op.handleCallResultsAsync(contract, '')];
                                                }); }); }))];
                                        case 2:
                                            samples = _b.apply(_a, [_c.sent()]);
                                            return [2 /*return*/, __spread(samplerOps, nonSamplerOps).map(function (op, i) {
                                                    return samples[i].map(function (output, j) { return ({
                                                        source: op.source,
                                                        output: output,
                                                        input: makerFillAmounts[j],
                                                        fillData: op.fillData,
                                                    }); });
                                                })];
                                    }
                                });
                            }); },
                        }];
            }
        });
    }); },
};
// tslint:disable max-file-line-count
//# sourceMappingURL=sampler_operations.js.map