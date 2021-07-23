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
exports.OnChainSourceSampler = exports.SourceSamplerBase = void 0;
const utils_1 = require("./utils");
class SourceSamplerBase {
    constructor() { }
    canConvertTokens(_tokenAddressPath) {
        return true;
    }
}
exports.SourceSamplerBase = SourceSamplerBase;
const DEFAULT_MAX_CACHE_AGE_MS = 10e3;
// Base class for a standard sampler with on-chain quote functions.
class OnChainSourceSampler extends SourceSamplerBase {
    constructor(opts) {
        super();
        this._liquidityScores = {};
        this._chain = opts.chain;
        [this._sellContract, this._sellContractHelper] = utils_1.createContractWrapperAndHelper(opts.chain, opts.sellSamplerContractType, opts.sellSamplerContractType.contractName || opts.sellSamplerContractArtifactName);
        [this._buyContract, this._buyContractHelper] = utils_1.createContractWrapperAndHelper(opts.chain, opts.buySamplerContractType, opts.buySamplerContractType.contractName || opts.buySamplerContractArtifactName);
        // HACK: Is there a way to restrict `TSellSamplerContract[TSellSamplerFunctionName] = TSellSamplerFunction`?
        this._sellContractFunction = this._sellContract[opts.sellContractSellFunctionName];
        this._buyContractFunction = this._buyContract[opts.buyContractBuyFunctionName];
        this._maxCacheAgeMs = opts.maxCacheAgeMs === undefined ? DEFAULT_MAX_CACHE_AGE_MS : opts.maxCacheAgeMs;
        // Heal liquidity scores by 1% every 10 seconds.
        setInterval(() => this._healLiquidityScores(0.01), 10e3);
    }
    canConvertTokens(_tokenAddressPath) {
        return true;
    }
    getSellSamplesAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = getTokenPathId(tokenAddressPath);
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLucky(tokenPathId)) {
                return [];
            }
            const calls = yield this._getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts);
            let samples = [];
            try {
                samples = yield Promise.all(calls.map((c) => __awaiter(this, void 0, void 0, function* () {
                    return c
                        .getDexSamplesFromResult(yield this._sellContractHelper.ethCallAsync(this._sellContractFunction, c.args, {
                        gas: c.gas,
                        maxCacheAgeMs: this._maxCacheAgeMs,
                    }))
                        .filter(s => s.output);
                })));
            }
            catch (err) {
                // Only allow reverts to be scored.
                if (!err.message.includes('reverted')) {
                    return [];
                }
            }
            this._scoreLiquidity(tokenPathId, samples);
            return samples;
        });
    }
    getBuySamplesAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = getTokenPathId(tokenAddressPath);
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLucky(tokenPathId)) {
                return [];
            }
            const calls = yield this._getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts);
            let samples = [];
            try {
                samples = yield Promise.all(calls.map((c) => __awaiter(this, void 0, void 0, function* () {
                    return c
                        .getDexSamplesFromResult(yield this._buyContractHelper.ethCallAsync(this._buyContractFunction, c.args, {
                        gas: c.gas,
                        maxCacheAgeMs: this._maxCacheAgeMs,
                    }))
                        .filter(s => s.output);
                })));
            }
            catch (err) {
                // Only allow reverts to be scored.
                if (!err.message.includes('reverted')) {
                    return [];
                }
            }
            this._scoreLiquidity(tokenPathId, samples);
            return samples;
        });
    }
    getMultiHopSellCallInfosAsync(tokenAddressPath, takerFillAmount, callOpts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = getTokenPathId(tokenAddressPath);
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLucky(tokenPathId)) {
                return [];
            }
            const calls = yield this._getSellQuoteCallsAsync(tokenAddressPath, [takerFillAmount]);
            return calls
                .flat(1)
                .map(c => createMultiHopCallInfo(this._sellContractHelper, this._sellContractFunction, c.args, (...args) => c.getDexSamplesFromResult(...args)[0], Object.assign(Object.assign({}, callOpts), { gas: c.gas })));
        });
    }
    getMultiHopBuyCallInfosAsync(tokenAddressPath, makerFillAmount, callOpts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = getTokenPathId(tokenAddressPath);
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLucky(tokenPathId)) {
                return [];
            }
            const calls = yield this._getBuyQuoteCallsAsync(tokenAddressPath, [makerFillAmount]);
            return calls
                .flat(1)
                .map(c => createMultiHopCallInfo(this._buyContractHelper, this._buyContractFunction, c.args, (...args) => c.getDexSamplesFromResult(...args)[0], Object.assign(Object.assign({}, callOpts), { gas: c.gas })));
        });
    }
    _healLiquidityScores(healAmount) {
        for (const pathId in this._liquidityScores) {
            this._liquidityScores[pathId] = Math.min(this._liquidityScores[pathId] || 1 + healAmount, 1);
        }
    }
    _getLiquidityScoreByPathId(pathId) {
        const score = this._liquidityScores[pathId];
        if (score === undefined) {
            return 1.0;
        }
        return score;
    }
    _isLucky(tokenPathId) {
        const score = this._getLiquidityScoreByPathId(tokenPathId);
        // score = 1.0 = 100% chance, etc.
        return Math.random() < score;
    }
    _scoreLiquidity(tokenPathId, samples) {
        if (areSamplesEmpty(samples)) {
            this.dump(tokenPathId);
        }
        else {
            this.pump(tokenPathId);
        }
    }
    pump(tokenPathOrId) {
        const tokenPathId = typeof tokenPathOrId === 'string' ? tokenPathOrId : getTokenPathId(tokenPathOrId);
        // Restore to 100%.
        this._liquidityScores[tokenPathId] = 1.0;
    }
    dump(tokenPathOrId) {
        const tokenPathId = typeof tokenPathOrId === 'string' ? tokenPathOrId : getTokenPathId(tokenPathOrId);
        let score = this._getLiquidityScoreByPathId(tokenPathId);
        // Half the current score.
        // Lowest it can go is 1%.
        this._liquidityScores[tokenPathId] = Math.max(score / 2, 0.01);
    }
}
exports.OnChainSourceSampler = OnChainSourceSampler;
function getTokenPathId(tokenPath) {
    return tokenPath.join(':');
}
function areSamplesEmpty(samples) {
    return samples.every(s => s.every(ss => ss.output.eq(0)));
}
function createMultiHopCallInfo(helper, fn, args, resultHandler, callOpts = {}) {
    const c = helper.encodeCall(fn, args, callOpts);
    return {
        quoterData: c.data,
        quoterTarget: c.to,
        gas: c.gas,
        overrides: c.overrides || {},
        resultHandler: resultData => resultHandler(helper.decodeCallResult(fn, resultData)),
    };
}
//# sourceMappingURL=source_sampler.js.map