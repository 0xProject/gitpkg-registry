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
exports.TwoHopSampler = void 0;
const utils_1 = require("@0x/utils");
const wrappers_1 = require("../wrappers");
const constants_1 = require("./constants");
const types_1 = require("./types");
const utils_2 = require("./utils");
const DEFAULT_SAMPLE_GAS = 500e3;
const GAS_PER_SAMPLE = 25e3;
const BASE_GAS = 100e3;
const DEFAULT_MAX_CACHE_AGE_MS = 16e3;
class TwoHopSampler {
    constructor(chain, _samplers, _maxCacheAgeMs = DEFAULT_MAX_CACHE_AGE_MS) {
        this.chain = chain;
        this._samplers = _samplers;
        this._maxCacheAgeMs = _maxCacheAgeMs;
        [this._sellContract, this._sellContractHelper] = utils_2.createContractWrapperAndHelper(this.chain, wrappers_1.ERC20BridgeSamplerContract, 'ERC20BridgeSampler');
        [this._buyContract, this._buyContractHelper] = utils_2.createContractWrapperAndHelper(this.chain, wrappers_1.ERC20BridgeSamplerContract, 'ERC20BridgeSampler');
    }
    static createAsync(chain, subSamplers, maxCacheAgeMs) {
        return __awaiter(this, void 0, void 0, function* () {
            return new TwoHopSampler(chain, subSamplers, maxCacheAgeMs);
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 3;
    }
    getTwoHopSellSampleAsync(sources, tokenAddressPath, takerFillAmount, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canConvertTokens(tokenAddressPath) || takerFillAmount.eq(0)) {
                return null;
            }
            const [firstHopPath, secondHopPath] = [tokenAddressPath.slice(0, 2), tokenAddressPath.slice(1)];
            const firstHopCalls = yield this._getMultiHopSellCallInfosAsync(sources, firstHopPath);
            const secondHopCalls = yield this._getMultiHopSellCallInfosAsync(sources, secondHopPath);
            if (firstHopCalls.length === 0 || secondHopCalls.length === 0) {
                return null;
            }
            const totalGas = [...firstHopCalls, ...secondHopCalls]
                .map(c => c.gas || DEFAULT_SAMPLE_GAS)
                .reduce((a, v) => a + v, 0);
            let firstHopResults;
            let secondHopResults;
            try {
                [firstHopResults, secondHopResults] = yield this._sellContractHelper.ethCallAsync(this._sellContract.sampleTwoHopSell, [
                    firstHopCalls.map(c => ({
                        data: c.quoterData,
                        to: c.quoterTarget,
                        gas: new utils_1.BigNumber(c.gas || DEFAULT_SAMPLE_GAS),
                    })),
                    secondHopCalls.map(c => ({
                        data: c.quoterData,
                        to: c.quoterTarget,
                        gas: new utils_1.BigNumber(c.gas || DEFAULT_SAMPLE_GAS),
                    })),
                    takerFillAmount,
                ], {
                    gas: totalGas + BASE_GAS + GAS_PER_SAMPLE * (firstHopCalls.length + secondHopCalls.length),
                    overrides: Object.assign({}, Object.assign({}, ...[...firstHopCalls, ...secondHopCalls].map(c => c.overrides))),
                    maxCacheAgeMs: this._maxCacheAgeMs,
                    batchId,
                });
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch two-hop sell samples for ${tokenAddressPath.join('->')}, with ${sources.join(', ')}: ${err.message}`);
                return null;
            }
            // Work out the hops from the results and score liquidity sources along
            // the way.
            let bestFirstHopIndex = 0;
            for (let i = 0; i < firstHopCalls.length; ++i) {
                const { sampler } = firstHopCalls[i];
                const r = firstHopResults[i];
                if (r.outputAmount.gt(0)) {
                    void sampler.pumpAsync(firstHopPath);
                    if (firstHopResults[bestFirstHopIndex].outputAmount.lt(r.outputAmount)) {
                        bestFirstHopIndex = i;
                    }
                }
                else {
                    void sampler.dumpAsync(firstHopPath);
                }
            }
            if (firstHopResults[bestFirstHopIndex].outputAmount.eq(0)) {
                return null;
            }
            let bestSecondHopIndex = 0;
            for (let i = 0; i < secondHopCalls.length; ++i) {
                const { sampler } = secondHopCalls[i];
                const r = secondHopResults[i];
                if (r.outputAmount.gt(0)) {
                    void sampler.pumpAsync(secondHopPath);
                    if (secondHopResults[bestSecondHopIndex].outputAmount.lt(r.outputAmount)) {
                        bestSecondHopIndex = i;
                    }
                }
                else {
                    void sampler.dumpAsync(secondHopPath);
                }
            }
            if (secondHopResults[bestSecondHopIndex].outputAmount.eq(0)) {
                return null;
            }
            const firstHop = firstHopCalls[bestFirstHopIndex].resultHandler(firstHopResults[bestFirstHopIndex].resultData);
            const secondHop = secondHopCalls[bestSecondHopIndex].resultHandler(secondHopResults[bestSecondHopIndex].resultData);
            if (!firstHop || !secondHop) {
                return null;
            }
            return {
                fillData: {
                    firstHop,
                    secondHop,
                    intermediateToken: tokenAddressPath[1],
                },
                input: takerFillAmount,
                output: secondHopResults[bestSecondHopIndex].outputAmount,
                source: types_1.ERC20BridgeSource.MultiHop,
            };
        });
    }
    getTwoHopBuySampleAsync(sources, tokenAddressPath, makerFillAmount, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canConvertTokens(tokenAddressPath)) {
                return null;
            }
            const [firstHopPath, secondHopPath] = [tokenAddressPath.slice(0, 2), tokenAddressPath.slice(1)];
            const firstHopCalls = yield this._getMultiHopBuyCallInfosAsync(sources, firstHopPath);
            const secondHopCalls = yield this._getMultiHopBuyCallInfosAsync(sources, secondHopPath);
            if (firstHopCalls.length === 0 || secondHopCalls.length === 0) {
                return null;
            }
            const totalGas = [...firstHopCalls, ...secondHopCalls]
                .map(c => c.gas || DEFAULT_SAMPLE_GAS)
                .reduce((a, v) => a + v, 0);
            let firstHopResults, secondHopResults;
            try {
                [firstHopResults, secondHopResults] = yield this._buyContractHelper.ethCallAsync(this._buyContract.sampleTwoHopBuy, [
                    firstHopCalls.map(c => ({
                        data: c.quoterData,
                        to: c.quoterTarget,
                        gas: new utils_1.BigNumber(c.gas || DEFAULT_SAMPLE_GAS),
                    })),
                    secondHopCalls.map(c => ({
                        data: c.quoterData,
                        to: c.quoterTarget,
                        gas: new utils_1.BigNumber(c.gas || DEFAULT_SAMPLE_GAS),
                    })),
                    makerFillAmount,
                ], {
                    gas: totalGas + BASE_GAS + GAS_PER_SAMPLE * (firstHopCalls.length + secondHopCalls.length),
                    overrides: Object.assign({}, Object.assign({}, ...[...firstHopCalls, ...secondHopCalls].map(c => c.overrides))),
                    maxCacheAgeMs: this._maxCacheAgeMs,
                    batchId,
                });
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch two-hop buy samples for ${tokenAddressPath.join('->')}, with ${sources.join(', ')}: ${err.message}`);
                return null;
            }
            // Work out the hops from the results and score liquidity sources along
            // the way.
            let bestSecondHopIndex = 0;
            for (let i = 0; i < secondHopCalls.length; ++i) {
                const { sampler } = secondHopCalls[i];
                const r = secondHopResults[i];
                if (r.outputAmount.gt(0)) {
                    void sampler.pumpAsync(secondHopPath);
                    if (secondHopResults[bestSecondHopIndex].outputAmount.gt(r.outputAmount)) {
                        bestSecondHopIndex = i;
                    }
                }
                else {
                    void sampler.dumpAsync(secondHopPath);
                }
            }
            if (secondHopResults[bestSecondHopIndex].outputAmount.eq(0)) {
                return null;
            }
            let bestFirstHopIndex = 0;
            for (let i = 0; i < firstHopCalls.length; ++i) {
                const { sampler } = firstHopCalls[i];
                const r = firstHopResults[i];
                if (r.outputAmount.gt(0)) {
                    void sampler.pumpAsync(firstHopPath);
                    if (firstHopResults[bestFirstHopIndex].outputAmount.gt(r.outputAmount)) {
                        bestFirstHopIndex = i;
                    }
                }
                else {
                    void sampler.dumpAsync(firstHopPath);
                }
            }
            if (firstHopResults[bestFirstHopIndex].outputAmount.eq(0)) {
                return null;
            }
            const firstHop = firstHopCalls[bestFirstHopIndex].resultHandler(firstHopResults[bestFirstHopIndex].resultData);
            const secondHop = secondHopCalls[bestSecondHopIndex].resultHandler(secondHopResults[bestSecondHopIndex].resultData);
            if (!firstHop || !secondHop) {
                return null;
            }
            return {
                fillData: {
                    firstHop,
                    secondHop,
                    intermediateToken: tokenAddressPath[1],
                },
                input: makerFillAmount,
                output: firstHopResults[bestFirstHopIndex].outputAmount,
                source: types_1.ERC20BridgeSource.MultiHop,
            };
        });
    }
    _getMultiHopSellCallInfosAsync(availableSources, tokenAddressPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const samplers = this._getEligibleSamplers(availableSources);
            return (yield Promise.all(samplers.map((s) => __awaiter(this, void 0, void 0, function* () {
                return (yield s.getMultiHopSellCallInfosAsync(tokenAddressPath, constants_1.ZERO_AMOUNT)).map(c => (Object.assign({ sampler: s }, c)));
            })))).flat(2);
        });
    }
    _getMultiHopBuyCallInfosAsync(availableSources, tokenAddressPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const samplers = this._getEligibleSamplers(availableSources);
            return (yield Promise.all(samplers.map((s) => __awaiter(this, void 0, void 0, function* () {
                return (yield s.getMultiHopBuyCallInfosAsync(tokenAddressPath, constants_1.ZERO_AMOUNT)).map(c => (Object.assign({ sampler: s }, c)));
            })))).flat(2);
        });
    }
    _getEligibleSamplers(sources) {
        return Object.keys(this._samplers)
            .filter(k => sources.includes(k))
            .map(k => this._samplers[k]);
    }
}
exports.TwoHopSampler = TwoHopSampler;
//# sourceMappingURL=two_hop_sampler.js.map