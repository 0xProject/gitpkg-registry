"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var constants_1 = require("../../constants");
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
exports.samplerOperations = {
    getOrderFillableTakerAmounts: function (orders) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .getOrderFillableTakerAssetAmounts(orders, orders.map(function (o) { return o.signature; }))
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('getOrderFillableTakerAssetAmounts', callResults)];
                });
            }); },
        };
    },
    getOrderFillableMakerAmounts: function (orders) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .getOrderFillableMakerAssetAmounts(orders, orders.map(function (o) { return o.signature; }))
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
    getUniswapSellQuotes: function (makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
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
    getLiquidityProviderSellQuotes: function (liquidityProviderRegistryAddress, makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromLiquidityProviderRegistry(liquidityProviderRegistryAddress, takerToken, makerToken, takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromLiquidityProviderRegistry', callResults)];
                });
            }); },
        };
    },
    getLiquidityProviderBuyQuotes: function (liquidityProviderRegistryAddress, makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .sampleBuysFromLiquidityProviderRegistry(liquidityProviderRegistryAddress, takerToken, makerToken, makerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleBuysFromLiquidityProviderRegistry', callResults)];
                });
            }); },
        };
    },
    getEth2DaiSellQuotes: function (makerToken, takerToken, takerFillAmounts) {
        var _this = this;
        return {
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
    getCurveSellQuotes: function (curveAddress, fromTokenIdx, toTokenIdx, takerFillAmounts) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return contract
                    .sampleSellsFromCurve(curveAddress, new __1.BigNumber(fromTokenIdx), new __1.BigNumber(toTokenIdx), takerFillAmounts)
                    .getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, contract.getABIDecodedReturnData('sampleSellsFromCurve', callResults)];
                });
            }); },
        };
    },
    getUniswapBuyQuotes: function (makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
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
    getEth2DaiBuyQuotes: function (makerToken, takerToken, makerFillAmounts) {
        var _this = this;
        return {
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
    getMedianSellRate: function (sources, makerToken, takerToken, takerFillAmount, liquidityProviderRegistryAddress) {
        var _this = this;
        var getSellQuotes = exports.samplerOperations.getSellQuotes(sources, makerToken, takerToken, [takerFillAmount], liquidityProviderRegistryAddress);
        return {
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
                                .sort(function (a, b) { return a.output.comparedTo(b.output); });
                            if (flatSortedSamples.length === 0) {
                                return [2 /*return*/, new __1.BigNumber(0)];
                            }
                            medianSample = flatSortedSamples[Math.floor(flatSortedSamples.length / 2)];
                            return [2 /*return*/, medianSample.output.div(medianSample.input)];
                    }
                });
            }); },
        };
    },
    constant: function (result) {
        var _this = this;
        return {
            encodeCall: function (contract) {
                return '0x';
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, result];
                });
            }); },
        };
    },
    getLiquidityProviderFromRegistry: function (registryAddress, takerToken, makerToken) {
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
    getSellQuotes: function (sources, makerToken, takerToken, takerFillAmounts, liquidityProviderRegistryAddress) {
        var _this = this;
        var subOps = sources
            .map(function (source) {
            var batchedOperation;
            if (source === __1.ERC20BridgeSource.Eth2Dai) {
                batchedOperation = exports.samplerOperations.getEth2DaiSellQuotes(makerToken, takerToken, takerFillAmounts);
            }
            else if (source === __1.ERC20BridgeSource.Uniswap) {
                batchedOperation = exports.samplerOperations.getUniswapSellQuotes(makerToken, takerToken, takerFillAmounts);
            }
            else if (source === __1.ERC20BridgeSource.Kyber) {
                batchedOperation = exports.samplerOperations.getKyberSellQuotes(makerToken, takerToken, takerFillAmounts);
            }
            else if (Object.keys(constants_1.constants.DEFAULT_CURVE_OPTS).includes(source)) {
                var _a = constants_1.constants.DEFAULT_CURVE_OPTS[source], curveAddress = _a.curveAddress, tokens = _a.tokens;
                var fromTokenIdx = tokens.indexOf(takerToken);
                var toTokenIdx = tokens.indexOf(makerToken);
                if (fromTokenIdx !== -1 && toTokenIdx !== -1) {
                    batchedOperation = exports.samplerOperations.getCurveSellQuotes(curveAddress, fromTokenIdx, toTokenIdx, takerFillAmounts);
                }
            }
            else if (source === __1.ERC20BridgeSource.LiquidityProvider) {
                if (liquidityProviderRegistryAddress === undefined) {
                    throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                }
                batchedOperation = exports.samplerOperations.getLiquidityProviderSellQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, takerFillAmounts);
            }
            else {
                throw new Error("Unsupported sell sample source: " + source);
            }
            return { batchedOperation: batchedOperation, source: source };
        })
            .filter(function (op) { return op.batchedOperation; });
        return {
            encodeCall: function (contract) {
                var subCalls = subOps.map(function (op) { return op.batchedOperation.encodeCall(contract); });
                return contract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                var rawSubCallResults, samples;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                            return [4 /*yield*/, Promise.all(subOps.map(function (op, i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, op.batchedOperation.handleCallResultsAsync(contract, rawSubCallResults[i])];
                                }); }); }))];
                        case 1:
                            samples = _a.sent();
                            return [2 /*return*/, subOps.map(function (op, i) {
                                    return samples[i].map(function (output, j) { return ({
                                        source: op.source,
                                        output: output,
                                        input: takerFillAmounts[j],
                                    }); });
                                })];
                    }
                });
            }); },
        };
    },
    getBuyQuotes: function (sources, makerToken, takerToken, makerFillAmounts, liquidityProviderRegistryAddress) {
        var _this = this;
        var subOps = sources.map(function (source) {
            if (source === __1.ERC20BridgeSource.Eth2Dai) {
                return exports.samplerOperations.getEth2DaiBuyQuotes(makerToken, takerToken, makerFillAmounts);
            }
            else if (source === __1.ERC20BridgeSource.Uniswap) {
                return exports.samplerOperations.getUniswapBuyQuotes(makerToken, takerToken, makerFillAmounts);
            }
            else if (source === __1.ERC20BridgeSource.LiquidityProvider) {
                if (liquidityProviderRegistryAddress === undefined) {
                    throw new Error('Cannot sample liquidity from a LiquidityProvider liquidity pool, if a registry is not provided.');
                }
                return exports.samplerOperations.getLiquidityProviderBuyQuotes(liquidityProviderRegistryAddress, makerToken, takerToken, makerFillAmounts);
            }
            else {
                throw new Error("Unsupported buy sample source: " + source);
            }
        });
        return {
            encodeCall: function (contract) {
                var subCalls = subOps.map(function (op) { return op.encodeCall(contract); });
                return contract.batchCall(subCalls).getABIEncodedTransactionData();
            },
            handleCallResultsAsync: function (contract, callResults) { return __awaiter(_this, void 0, void 0, function () {
                var rawSubCallResults, samples;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rawSubCallResults = contract.getABIDecodedReturnData('batchCall', callResults);
                            return [4 /*yield*/, Promise.all(subOps.map(function (op, i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, op.handleCallResultsAsync(contract, rawSubCallResults[i])];
                                }); }); }))];
                        case 1:
                            samples = _a.sent();
                            return [2 /*return*/, sources.map(function (source, i) {
                                    return samples[i].map(function (output, j) { return ({
                                        source: source,
                                        output: output,
                                        input: makerFillAmounts[j],
                                    }); });
                                })];
                    }
                });
            }); },
        };
    },
};
//# sourceMappingURL=sampler_operations.js.map