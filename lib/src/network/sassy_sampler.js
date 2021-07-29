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
    constructor(chain, _samplers, _tokenAdjacencyGraph, _twoHopSampler) {
        this.chain = chain;
        this._samplers = _samplers;
        this._tokenAdjacencyGraph = _tokenAdjacencyGraph;
        this._twoHopSampler = _twoHopSampler;
        this.availableSources = Object.keys(_samplers);
    }
    static createAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const sources = opts.sources || DEFAULT_SOURCES;
            const samplers = Object.assign({}, ...(yield Promise.all(sources.map((s) => __awaiter(this, void 0, void 0, function* () { return createSourceSamplerAsync(s, opts); })))).map((sampler, i) => ({
                [sources[i]]: sampler,
            })));
            const twoHopSampler = yield two_hop_sampler_1.TwoHopSampler.createAsync(opts.chain, samplers);
            return new SassySampler(opts.chain, samplers, opts.tokenAdjacencyGraph || tokens_1.DEFAULT_TOKEN_ADJACENCY_GRAPH_BY_CHAIN_ID[opts.chain.chainId], twoHopSampler);
        });
    }
    getMedianSellRateAsync(sources, takerToken, makerToken, takerAmount, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (takerToken.toLowerCase() === makerToken.toLowerCase()) {
                return new utils_1.BigNumber(1);
            }
            if (takerAmount.eq(0)) {
                return ZERO_AMOUNT;
            }
            let samples;
            try {
                samples = (yield Promise.all(sources.map((s) => __awaiter(this, void 0, void 0, function* () { return this._sampleSellsFromSourceAsync(s, [takerToken, makerToken], [takerAmount], batchId); })))).flat(1);
            }
            catch (_a) {
                return ZERO_AMOUNT;
            }
            const flatSortedSamples = samples
                .flat(1)
                .map(v => v.output)
                .sort((a, b) => a.comparedTo(b));
            return flatSortedSamples[Math.floor(flatSortedSamples.length / 2)];
        });
    }
    getSellSamplesAsync(sources, takerToken, makerToken, takerAmounts, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (takerAmounts.every(a => a.eq(0))) {
                return [];
            }
            const tokenPaths = this._getExpandedTokenPaths(takerToken, makerToken);
            return (yield Promise.all(sources.map((s) => __awaiter(this, void 0, void 0, function* () { return Promise.all(tokenPaths.map((p) => __awaiter(this, void 0, void 0, function* () { return this._sampleSellsFromSourceAsync(s, p, takerAmounts, batchId); }))); })))).flat(2);
        });
    }
    getBuySamplesAsync(sources, takerToken, makerToken, makerAmounts, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (makerAmounts.every(a => a.eq(0))) {
                return [];
            }
            const tokenPaths = this._getExpandedTokenPaths(takerToken, makerToken);
            return (yield Promise.all(sources.map((s) => __awaiter(this, void 0, void 0, function* () { return Promise.all(tokenPaths.map((p) => __awaiter(this, void 0, void 0, function* () { return this._sampleBuysFromSourceAsync(s, p, makerAmounts, batchId); }))); })))).flat(2);
        });
    }
    getTwoHopSellSamplesAsync(sources, takerToken, makerToken, takerAmount, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (takerAmount.eq(0)) {
                return [];
            }
            const tokenPaths = this._getTwoHopTokenPaths(takerToken, makerToken);
            const hopResults = yield Promise.all(tokenPaths.map((tokenPath) => __awaiter(this, void 0, void 0, function* () { return this._twoHopSampler.getTwoHopSellSampleAsync(sources, tokenPath, takerAmount, batchId); })));
            return hopResults.filter(h => !!h);
        });
    }
    getTwoHopBuySamplesAsync(sources, takerToken, makerToken, makerAmount, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (makerAmount.eq(0)) {
                return [];
            }
            const tokenPaths = this._getTwoHopTokenPaths(takerToken, makerToken);
            const hopResults = yield Promise.all(tokenPaths.map((tokenPath) => __awaiter(this, void 0, void 0, function* () { return this._twoHopSampler.getTwoHopBuySampleAsync(sources, tokenPath, makerAmount, batchId); })));
            return hopResults.filter(h => !!h);
        });
    }
    _sampleSellsFromSourceAsync(source, tokenPath, takerAmounts, batchId) {
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
                samples = (yield sampler.getSellSamplesAsync(tokenPath, takerAmounts, batchId)).filter(s => !!s.length);
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch sell samples for ${source} (${tokenPath.join('->')}): ${err.message}`);
            }
            return samples;
        });
    }
    _sampleBuysFromSourceAsync(source, tokenPath, takerAmounts, batchId) {
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
                samples = (yield sampler.getBuySamplesAsync(tokenPath, takerAmounts, batchId)).filter(s => !!s.length);
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch sell samples for ${source} (${tokenPath.join('->')}: ${err.message}`);
            }
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
}
exports.SassySampler = SassySampler;
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