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
// Base class for a standard sampler with on-chain quote functions.
class OnChainSourceSampler extends SourceSamplerBase {
    constructor(opts) {
        super();
        this._chain = opts.chain;
        [this._sellContract, this._sellContractHelper] = utils_1.createContractWrapperAndHelper(opts.chain, opts.sellSamplerContractType, opts.sellSamplerContractType.contractName || opts.sellSamplerContractArtifactName);
        [this._buyContract, this._buyContractHelper] = utils_1.createContractWrapperAndHelper(opts.chain, opts.buySamplerContractType, opts.buySamplerContractType.contractName || opts.buySamplerContractArtifactName);
        // HACK: Is there a way to restrict `TSellSamplerContract[TSellSamplerFunctionName] = TSellSamplerFunction`?
        this._sellContractFunction = this._sellContract[opts.sellContractSellFunctionName];
        this._buyContractFunction = this._buyContract[opts.buyContractBuyFunctionName];
    }
    canConvertTokens(_tokenAddressPath) {
        return true;
    }
    getSellSamplesAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canConvertTokens(tokenAddressPath)) {
                return [];
            }
            const calls = yield this._getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts);
            return Promise.all(calls.map((c) => __awaiter(this, void 0, void 0, function* () {
                return c
                    .getDexSamplesFromResult(yield this._sellContractHelper.ethCallAsync(this._sellContractFunction, c.args))
                    .filter(s => s.output);
            })));
        });
    }
    getBuySamplesAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canConvertTokens(tokenAddressPath)) {
                return [];
            }
            const calls = yield this._getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts);
            return Promise.all(calls.map((c) => __awaiter(this, void 0, void 0, function* () {
                return c
                    .getDexSamplesFromResult(yield this._buyContractHelper.ethCallAsync(this._buyContractFunction, c.args))
                    .filter(s => s.output);
            })));
        });
    }
    getMultiHopSellCallInfosAsync(tokenAddressPath, takerFillAmount, callOpts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canConvertTokens(tokenAddressPath)) {
                return [];
            }
            const calls = yield this._getSellQuoteCallsAsync(tokenAddressPath, [takerFillAmount]);
            return calls
                .flat(1)
                .map(c => createMultiHopCallInfo(this._sellContractHelper, this._sellContractFunction, c.args, (...args) => c.getDexSamplesFromResult(...args)[0], callOpts));
        });
    }
    getMultiHopBuyCallInfosAsync(tokenAddressPath, makerFillAmount, callOpts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canConvertTokens(tokenAddressPath)) {
                return [];
            }
            const calls = yield this._getBuyQuoteCallsAsync(tokenAddressPath, [makerFillAmount]);
            return calls
                .flat(1)
                .map(c => createMultiHopCallInfo(this._buyContractHelper, this._buyContractFunction, c.args, (...args) => c.getDexSamplesFromResult(...args)[0], callOpts));
        });
    }
}
exports.OnChainSourceSampler = OnChainSourceSampler;
function createMultiHopCallInfo(helper, fn, args, resultHandler, callOpts = {}) {
    const c = helper.encodeCall(fn, args, callOpts);
    return {
        quoterData: c.data,
        quoterTarget: c.to,
        overrides: c.overrides || {},
        resultHandler: resultData => resultHandler(helper.decodeCallResult(fn, resultData)),
    };
}
//# sourceMappingURL=source_sampler.js.map