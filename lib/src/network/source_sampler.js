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
const memcache_1 = require("../utils/memcache");
class SourceSamplerBase {
    constructor() { }
    canConvertTokens(_tokenAddressPath) {
        return true;
    }
}
exports.SourceSamplerBase = SourceSamplerBase;
const DEFAULT_MAX_CACHE_AGE_MS = 12e3;
const DEFAULT_LIQUIDITY_SCORE_REFRESH_RATE_MS = 10e3;
// Base class for a standard sampler with on-chain quote functions.
class OnChainSourceSampler extends SourceSamplerBase {
    constructor(opts) {
        super();
        this._chain = opts.chain;
        this.name = opts.name;
        [this._sellContract, this._sellContractHelper] = utils_1.createContractWrapperAndHelper(opts.chain, opts.sellSamplerContractType, opts.sellSamplerContractType.contractName || opts.sellSamplerContractArtifactName);
        [this._buyContract, this._buyContractHelper] = utils_1.createContractWrapperAndHelper(opts.chain, opts.buySamplerContractType, opts.buySamplerContractType.contractName || opts.buySamplerContractArtifactName);
        // HACK: Is there a way to restrict `TSellSamplerContract[TSellSamplerFunctionName] = TSellSamplerFunction`?
        this._sellContractFunction = this._sellContract[opts.sellContractSellFunctionName];
        this._buyContractFunction = this._buyContract[opts.buyContractBuyFunctionName];
        this._maxCacheAgeMs = opts.maxCacheAgeMs === undefined ? DEFAULT_MAX_CACHE_AGE_MS : opts.maxCacheAgeMs;
        this._liquidityScoreRefreshRateMs = opts.liquidityScoreRefreshRateMs || DEFAULT_LIQUIDITY_SCORE_REFRESH_RATE_MS;
        this._memcache = memcache_1.Memcache.getInstance(`@${this.name}/source-sampler@1.0.0-${opts.chain.chainId}`);
        // Heal liquidity scores by 1% every 10 seconds.
        setInterval(() => this._healLiquidityScoresAsync(0.01), 10e3);
    }
    canConvertTokens(_tokenAddressPath) {
        return true;
    }
    getSellSamplesAsync(tokenAddressPath, takerFillAmounts, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = getTokenPathId(tokenAddressPath);
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLuckyForPath(tokenPathId)) {
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
                        batchId,
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
    getBuySamplesAsync(tokenAddressPath, makerFillAmounts, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = getTokenPathId(tokenAddressPath);
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLuckyForPath(tokenPathId)) {
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
                        batchId,
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
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLuckyForPath(tokenPathId)) {
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
            if (!this.canConvertTokens(tokenAddressPath) || !this._isLuckyForPath(tokenPathId)) {
                return [];
            }
            const calls = yield this._getBuyQuoteCallsAsync(tokenAddressPath, [makerFillAmount]);
            return calls
                .flat(1)
                .map(c => createMultiHopCallInfo(this._buyContractHelper, this._buyContractFunction, c.args, (...args) => c.getDexSamplesFromResult(...args)[0], Object.assign(Object.assign({}, callOpts), { gas: c.gas })));
        });
    }
    pumpAsync(tokenPathOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = typeof tokenPathOrId === 'string' ? tokenPathOrId : getTokenPathId(tokenPathOrId);
            const ls = yield this._getLiquidityScoreByPathIdAsync(tokenPathId);
            if (Date.now() - ls.lastTouchedTime < this._liquidityScoreRefreshRateMs) {
                return;
            }
            // Restore to 100%.
            ls.lastTouchedTime = Date.now();
            ls.chance = 1;
            yield this._setLiquidityScoreByPathIdAsync(tokenPathId, ls);
        });
    }
    dumpAsync(tokenPathOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = typeof tokenPathOrId === 'string' ? tokenPathOrId : getTokenPathId(tokenPathOrId);
            const ls = yield this._getLiquidityScoreByPathIdAsync(tokenPathId);
            if (Date.now() - ls.lastTouchedTime < this._liquidityScoreRefreshRateMs) {
                return;
            }
            // Half the current score.
            // Lowest it can go is 5%.
            ls.lastTouchedTime = Date.now();
            ls.chance = Math.max(ls.chance / 2, 0.05);
            yield this._setLiquidityScoreByPathIdAsync(tokenPathId, ls);
        });
    }
    _isLuckyForPath(tokenPathOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPathId = typeof tokenPathOrId === 'string' ? tokenPathOrId : getTokenPathId(tokenPathOrId);
            const ls = yield this._getLiquidityScoreByPathIdAsync(tokenPathId);
            return Math.random() < ls.chance;
        });
    }
    _healLiquidityScoresAsync(healAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathIds = yield this._memcache.getAllKeysAsync();
            const promises = [];
            for (const pathId of pathIds) {
                const ls = yield this._memcache.tryGetObjectAsync(pathId);
                if (ls) {
                    ls.chance = Math.min((ls === null || ls === void 0 ? void 0 : ls.chance) || 1 + healAmount, 1);
                    promises.push(this._setLiquidityScoreByPathIdAsync(pathId, ls));
                }
            }
            yield Promise.all(promises);
        });
    }
    _setLiquidityScoreByPathIdAsync(tokenPathId, ls) {
        return __awaiter(this, void 0, void 0, function* () {
            this._memcache.setObjectAsync(tokenPathId, ls, 600);
        });
    }
    _getLiquidityScoreByPathIdAsync(pathId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ls = yield this._memcache.tryGetObjectAsync(pathId);
            if (ls) {
                return ls;
            }
            return {
                lastTouchedTime: Date.now(),
                chance: 1.0,
            };
        });
    }
    _scoreLiquidity(tokenPathId, samples) {
        return __awaiter(this, void 0, void 0, function* () {
            if (areSamplesEmpty(samples)) {
                yield this.dumpAsync(tokenPathId);
            }
            else {
                yield this.pumpAsync(tokenPathId);
            }
        });
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