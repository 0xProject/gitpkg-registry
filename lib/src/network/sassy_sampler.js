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
exports.SassySampler = void 0;
const utils_1 = require("@0x/utils");
const constants_1 = require("../constants");
const samplers_1 = require("./samplers");
const source_filters_1 = require("./source_filters");
const tokens_1 = require("./tokens");
const two_hop_sampler_1 = require("./two_hop_sampler");
const types_1 = require("./types");
const { ZERO_AMOUNT } = constants_1.constants;
const DEFAULT_SOURCES = source_filters_1.SourceFilters.all().exclude([types_1.ERC20BridgeSource.Native, types_1.ERC20BridgeSource.MultiHop]).sources;
class SassySampler {
    constructor(chain, _samplers, _tokenAdjacencyGraph, _twoHopSampler, _maxPriceCacheAgeMs) {
        this.chain = chain;
        this._samplers = _samplers;
        this._tokenAdjacencyGraph = _tokenAdjacencyGraph;
        this._twoHopSampler = _twoHopSampler;
        this._maxPriceCacheAgeMs = _maxPriceCacheAgeMs;
        this._priceCache = {};
        this.availableSources = Object.keys(_samplers);
        this._liquidityScores = Object.assign({}, ...Object.values(types_1.ERC20BridgeSource).map(s => ({ [s]: {} })));
        // Heal liquidity scores by 1% every 10 seconds.
        setInterval(() => this._healLiquidityScores(0.01), 10e3);
    }
    static createAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const sources = opts.sources || DEFAULT_SOURCES;
            const samplers = Object.assign({}, ...(yield Promise.all(sources.map((s) => __awaiter(this, void 0, void 0, function* () { return createSourceSamplerAsync(s, opts); })))).map((sampler, i) => ({
                [sources[i]]: sampler,
            })));
            const twoHopSampler = yield two_hop_sampler_1.TwoHopSampler.createAsync(opts.chain, samplers);
            return new SassySampler(opts.chain, samplers, opts.tokenAdjacencyGraph || tokens_1.DEFAULT_TOKEN_ADJACENCY_GRAPH_BY_CHAIN_ID[opts.chain.chainId], twoHopSampler, opts.maxPriceCacheAgeMs || 10e3);
        });
    }
    getMedianSellRateAsync(sources, takerToken, makerToken, takerAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (takerToken.toLowerCase() === makerToken.toLowerCase()) {
                return new utils_1.BigNumber(1);
            }
            const cacheId = `${takerToken}/${makerToken}/${takerAmount.toString(10)}/${sources.join(',')}`;
            const cachedPrice = (this._priceCache[cacheId] = this._priceCache[cacheId] || {
                cacheTime: 0,
                value: ZERO_AMOUNT,
            });
            if (Date.now() - cachedPrice.cacheTime < this._maxPriceCacheAgeMs) {
                return cachedPrice.value;
            }
            const filteredSources = this._filterSourcesByLiquidityChance(sources, [takerToken, makerToken]);
            let samples;
            try {
                samples = (yield Promise.all(filteredSources.map((s) => __awaiter(this, void 0, void 0, function* () { return this._sampleSellsFromSourceAsync(s, [takerToken, makerToken], [takerAmount]); })))).flat(1);
            }
            catch (_a) { }
            cachedPrice.cacheTime = Date.now();
            if (!samples || samples.length === 0) {
                return (cachedPrice.value = ZERO_AMOUNT);
            }
            const flatSortedSamples = samples
                .flat(1)
                .map(v => v.output)
                .sort((a, b) => a.comparedTo(b));
            if (flatSortedSamples.length === 0) {
                return (cachedPrice.value = ZERO_AMOUNT);
            }
            const medianSample = flatSortedSamples[Math.floor(flatSortedSamples.length / 2)];
            return (cachedPrice.value = medianSample.div(takerAmount));
        });
    }
    getSellSamplesAsync(sources, takerToken, makerToken, takerAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredSources = this._filterSourcesByLiquidityChance(sources, [takerToken, makerToken]);
            const tokenPaths = this._getExpandedTokenPaths(takerToken, makerToken);
            return (yield Promise.all(filteredSources.map((s) => __awaiter(this, void 0, void 0, function* () { return Promise.all(tokenPaths.map((p) => __awaiter(this, void 0, void 0, function* () { return this._sampleSellsFromSourceAsync(s, p, takerAmounts); }))); })))).flat(2);
        });
    }
    getBuySamplesAsync(sources, takerToken, makerToken, makerAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredSources = this._filterSourcesByLiquidityChance(sources, [takerToken, makerToken]);
            const tokenPaths = this._getExpandedTokenPaths(takerToken, makerToken);
            return (yield Promise.all(filteredSources.map((s) => __awaiter(this, void 0, void 0, function* () { return Promise.all(tokenPaths.map((p) => __awaiter(this, void 0, void 0, function* () { return this._sampleBuysFromSourceAsync(s, p, makerAmounts); }))); })))).flat(2);
        });
    }
    getTwoHopSellSamplesAsync(sources, takerToken, makerToken, takerAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPaths = this._getTwoHopTokenPaths(takerToken, makerToken);
            const hopResults = yield Promise.all(tokenPaths.map((tokenPath) => __awaiter(this, void 0, void 0, function* () {
                return this._twoHopSampler.getTwoHopSellSampleAsync(this._filterSourcesByLiquidityChance(sources, tokenPath), tokenPath, takerAmount);
            })));
            return hopResults.filter(h => !!h);
        });
    }
    getTwoHopBuySamplesAsync(sources, takerToken, makerToken, makerAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPaths = this._getTwoHopTokenPaths(takerToken, makerToken);
            const hopResults = yield Promise.all(tokenPaths.map((tokenPath) => __awaiter(this, void 0, void 0, function* () {
                return this._twoHopSampler.getTwoHopBuySampleAsync(this._filterSourcesByLiquidityChance(sources, tokenPath), tokenPath, makerAmount);
            })));
            return hopResults.filter(h => !!h);
        });
    }
    _sampleSellsFromSourceAsync(source, tokenPath, takerAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (takerAmounts.every(t => t.lte(0))) {
                return [];
            }
            const sampler = this._findSampler(source);
            if (!sampler) {
                return [];
            }
            let samples = [];
            try {
                samples = (yield sampler.getSellSamplesAsync(tokenPath, takerAmounts)).filter(s => !!s.length);
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch sell samples for ${source} (${tokenPath.join('->')}): ${err.message}`);
            }
            this._scoreLiquidity(source, tokenPath, samples);
            return samples;
        });
    }
    _sampleBuysFromSourceAsync(source, tokenPath, takerAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (takerAmounts.every(t => t.lte(0))) {
                return [];
            }
            const sampler = this._findSampler(source);
            if (!sampler) {
                return [];
            }
            let samples = [];
            try {
                samples = (yield sampler.getBuySamplesAsync(tokenPath, takerAmounts)).filter(s => !!s.length);
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch sell samples for ${source} (${tokenPath.join('->')}: ${err.message}`);
            }
            this._scoreLiquidity(source, tokenPath, samples);
            return samples;
        });
    }
    _getExpandedTokenPaths(takerToken, makerToken) {
        return [
            // A -> B
            [takerToken, makerToken],
            // A -> C -> B
            ...this._getTwoHopTokenPaths(takerToken, makerToken),
        ].map(p => p.map(a => a.toLowerCase()));
    }
    _getTwoHopTokenPaths(takerToken, makerToken) {
        return this._getIntermediateTokens(takerToken, makerToken).map(t => [takerToken, t, makerToken]);
    }
    _getIntermediateTokens(takerToken, makerToken) {
        return getIntermediateTokens(takerToken, makerToken, this._tokenAdjacencyGraph);
    }
    _findSampler(source) {
        return this._samplers[source];
    }
    _filterSourcesByLiquidityChance(sources, tokenPath) {
        const pathId = tokenPath.join(':');
        return sources.filter(source => {
            let score = this._liquidityScores[source][pathId];
            if (score === undefined) {
                score = 1.0;
            }
            // score = 1.0 = 100% chance, etc.
            return Math.random() < score;
        });
    }
    _scoreLiquidity(source, tokenPath, samples) {
        const pathId = tokenPath.join(':');
        let score = this._liquidityScores[source][pathId];
        if (score === undefined) {
            score = 1.0;
        }
        if (areSamplesEmpty(samples)) {
            // If no liquidity, half the score.
            // Lowst it can go is 1%.
            score = Math.max(score / 2, 0.01);
        }
        else {
            // If any liquidity appears, restore to 100%.
            score = 1.0;
        }
        this._liquidityScores[source][pathId] = score;
    }
    _healLiquidityScores(healAmount) {
        for (const source in this._liquidityScores) {
            const scores = this._liquidityScores[source];
            for (const pathId in scores) {
                scores[pathId] = Math.min(scores[pathId] + healAmount, 1);
            }
        }
    }
}
exports.SassySampler = SassySampler;
function areSamplesEmpty(samples) {
    return samples.every(s => s.every(ss => ss.output.eq(0)));
}
function createSourceSamplerAsync(source, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { chain } = opts;
        switch (source) {
            default:
                break;
            case types_1.ERC20BridgeSource.Balancer:
            case types_1.ERC20BridgeSource.Cream:
                return samplers_1.BalancerSampler.createAsync(chain, source);
            case types_1.ERC20BridgeSource.BalancerV2:
                return samplers_1.BalancerV2Sampler.createAsync(chain);
            case types_1.ERC20BridgeSource.Bancor:
                return samplers_1.BancorSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.Curve:
            case types_1.ERC20BridgeSource.Swerve:
            case types_1.ERC20BridgeSource.SnowSwap:
            case types_1.ERC20BridgeSource.Nerve:
            case types_1.ERC20BridgeSource.Belt:
            case types_1.ERC20BridgeSource.Ellipsis:
            case types_1.ERC20BridgeSource.Saddle:
            case types_1.ERC20BridgeSource.XSigma:
            case types_1.ERC20BridgeSource.CurveV2:
            case types_1.ERC20BridgeSource.FirebirdOneSwap:
            case types_1.ERC20BridgeSource.IronSwap:
            case types_1.ERC20BridgeSource.ACryptos:
                return samplers_1.CurveSampler.createAsync(chain, source);
            case types_1.ERC20BridgeSource.Dodo:
                return samplers_1.DodoV1Sampler.createAsync(chain);
            case types_1.ERC20BridgeSource.DodoV2:
                return samplers_1.DodoV2Sampler.createAsync(chain);
            case types_1.ERC20BridgeSource.KyberDmm:
                return samplers_1.KyberDmmSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.Kyber:
                return samplers_1.KyberSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.Lido:
                return samplers_1.LidoSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.LiquidityProvider:
                return samplers_1.LiquidityProviderSampler.createAsync(chain, opts.liquidityProviderRegistry);
            case types_1.ERC20BridgeSource.MakerPsm:
                return samplers_1.MakerPsmSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.Mooniswap:
                return samplers_1.MooniswapSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.MStable:
                return samplers_1.MStableSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.Eth2Dai:
                return samplers_1.OasisSampler.createAsync(chain);
            case types_1.ERC20BridgeSource.Shell:
            case types_1.ERC20BridgeSource.Component:
                return samplers_1.ShellSampler.createAsync(chain, source);
            case types_1.ERC20BridgeSource.Smoothy:
                return samplers_1.SmoothySampler.createAsync(chain, source);
            case types_1.ERC20BridgeSource.Uniswap:
                return samplers_1.UniswapV1Sampler.createAsync(chain);
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
            case types_1.ERC20BridgeSource.Linkswap:
            case types_1.ERC20BridgeSource.WaultSwap:
            case types_1.ERC20BridgeSource.Polydex:
            case types_1.ERC20BridgeSource.ShibaSwap:
            case types_1.ERC20BridgeSource.JetSwap:
                return samplers_1.UniswapV2Sampler.createAsync(chain, source);
            case types_1.ERC20BridgeSource.UniswapV3:
                return samplers_1.UniswapV3Sampler.createAsync(chain);
        }
        throw new Error(`I don't know how to create sampler for source: ${source}`);
    });
}
function getIntermediateTokens(takerToken, makerToken, tokenAdjacencyGraph) {
    const tokens = [takerToken, makerToken].map(t => t.toLowerCase());
    const takerIntermediateTokens = tokenAdjacencyGraph[tokens[0]] || tokenAdjacencyGraph.default;
    const makerIntermediateTokens = tokenAdjacencyGraph[tokens[1]] || tokenAdjacencyGraph.default;
    // Filter intermediate tokens common to both.
    const intermediateTokens = takerIntermediateTokens.filter(t => makerIntermediateTokens.includes(t));
    // Select unique ones that aren't the maker or taker token.
    return [...new Set(intermediateTokens)].filter(t => !tokens.includes(t));
}
//# sourceMappingURL=sassy_sampler.js.map