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
class TwoHopSampler {
    constructor(chain, _samplers) {
        this.chain = chain;
        this._samplers = _samplers;
        [this._sellContract, this._sellContractHelper] = utils_2.createContractWrapperAndHelper(this.chain, wrappers_1.ERC20BridgeSamplerContract, 'ERC20BridgeSampler');
        [this._buyContract, this._buyContractHelper] = utils_2.createContractWrapperAndHelper(this.chain, wrappers_1.ERC20BridgeSamplerContract, 'ERC20BridgeSampler');
    }
    static createAsync(chain, subSamplers) {
        return __awaiter(this, void 0, void 0, function* () {
            return new TwoHopSampler(chain, subSamplers);
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 3;
    }
    getTwoHopSellSampleAsync(sources, tokenAddressPath, takerFillAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canConvertTokens(tokenAddressPath)) {
                return null;
            }
            const [firstHopPath, secondHopPath] = [tokenAddressPath.slice(0, 2), tokenAddressPath.slice(1)];
            const firstHopCalls = yield this._getMultiHopSellCallInfosAsync(sources, firstHopPath);
            const secondHopCalls = yield this._getMultiHopSellCallInfosAsync(sources, secondHopPath);
            if (firstHopCalls.length === 0 || secondHopCalls.length === 0) {
                return null;
            }
            const totalGas = firstHopCalls.map(c => c.gas).reduce((a, v) => (a || DEFAULT_SAMPLE_GAS) + (v || DEFAULT_SAMPLE_GAS), 0) ||
                0 + 100e3;
            let result;
            try {
                result = yield this._sellContractHelper.ethCallAsync(this._sellContract.sampleTwoHopSell, [
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
                    gas: totalGas,
                    overrides: Object.assign({}, Object.assign({}, ...[...firstHopCalls, ...secondHopCalls].map(c => c.overrides))),
                });
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch two-hop sell samples for ${tokenAddressPath.join('->')}, with ${sources.join(', ')}: ${err.message}`);
                return null;
            }
            if (result.outputAmount.eq(0)) {
                return null;
            }
            const firstHop = firstHopCalls[result.firstHopIndex.toNumber()].resultHandler(result.firstHopResult);
            const secondHop = secondHopCalls[result.secondHopIndex.toNumber()].resultHandler(result.secondHopResult);
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
                output: result.outputAmount,
                source: types_1.ERC20BridgeSource.MultiHop,
            };
        });
    }
    getTwoHopBuySampleAsync(sources, tokenAddressPath, makerFillAmount) {
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
            const totalGas = firstHopCalls.map(c => c.gas).reduce((a, v) => (a || DEFAULT_SAMPLE_GAS) + (v || DEFAULT_SAMPLE_GAS), 0) ||
                0 + 200e3;
            let result;
            try {
                result = yield this._buyContractHelper.ethCallAsync(this._buyContract.sampleTwoHopBuy, [
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
                    gas: totalGas,
                    overrides: Object.assign({}, Object.assign({}, ...[...firstHopCalls, ...secondHopCalls].map(c => c.overrides))),
                });
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to fetch two-hop buy samples for ${tokenAddressPath.join('->')}, with ${sources.join(', ')}: ${err.message}`);
                return null;
            }
            if (result.outputAmount.eq(constants_1.MAX_UINT256)) {
                return null;
            }
            const firstHop = firstHopCalls[result.firstHopIndex.toNumber()].resultHandler(result.firstHopResult);
            const secondHop = secondHopCalls[result.secondHopIndex.toNumber()].resultHandler(result.secondHopResult);
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
                output: result.outputAmount,
                source: types_1.ERC20BridgeSource.MultiHop,
            };
        });
    }
    _getMultiHopSellCallInfosAsync(sources, tokenAddressPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const samplers = this._getEligibleSamplers(sources);
            return (yield Promise.all(samplers.map((s) => __awaiter(this, void 0, void 0, function* () { return s.getMultiHopSellCallInfosAsync(tokenAddressPath, constants_1.ZERO_AMOUNT); })))).flat(2);
        });
    }
    _getMultiHopBuyCallInfosAsync(sources, tokenAddressPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const samplers = this._getEligibleSamplers(sources);
            return (yield Promise.all(samplers.map((s) => __awaiter(this, void 0, void 0, function* () { return s.getMultiHopBuyCallInfosAsync(tokenAddressPath, constants_1.ZERO_AMOUNT); })))).flat(2);
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