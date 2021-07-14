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
const wrappers_1 = require("../wrappers");
const constants_1 = require("./constants");
const types_1 = require("./types");
const utils_1 = require("./utils");
class TwoHopSampler {
    constructor(chain, _samplers) {
        this.chain = chain;
        this._samplers = _samplers;
        [this._sellContract, this._sellContractHelper] = utils_1.createContractWrapperAndHelper(this.chain, wrappers_1.ERC20BridgeSamplerContract, 'ERC20BridgeSampler');
        [this._buyContract, this._buyContractHelper] = utils_1.createContractWrapperAndHelper(this.chain, wrappers_1.ERC20BridgeSamplerContract, 'ERC20BridgeSampler');
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
            const result = yield this._sellContractHelper.ethCallAsync(this._sellContract.sampleTwoHopSell, [
                firstHopCalls.map(c => ({
                    data: c.quoterData,
                    to: c.quoterTarget,
                })),
                secondHopCalls.map(c => ({
                    data: c.quoterData,
                    to: c.quoterTarget,
                })),
                takerFillAmount,
            ], {
                overrides: Object.assign({}, Object.assign({}, ...[...firstHopCalls, ...secondHopCalls].map(c => c.overrides))),
            });
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
            const result = yield this._buyContractHelper.ethCallAsync(this._buyContract.sampleTwoHopBuy, [
                firstHopCalls.map(c => ({
                    data: c.quoterData,
                    to: c.quoterTarget,
                })),
                secondHopCalls.map(c => ({
                    data: c.quoterData,
                    to: c.quoterTarget,
                })),
                makerFillAmount,
            ], {
                overrides: Object.assign({}, Object.assign({}, ...[...firstHopCalls, ...secondHopCalls].map(c => c.overrides))),
            });
            if (result.outputAmount.eq(constants_1.MAX_UINT256)) {
                return null;
            }
            return {
                fillData: {
                    firstHop: firstHopCalls[result.firstHopIndex.toNumber()].resultHandler(result.firstHopResult),
                    secondHop: secondHopCalls[result.secondHopIndex.toNumber()].resultHandler(result.secondHopResult),
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