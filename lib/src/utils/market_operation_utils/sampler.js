"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const sampler_operations_1 = require("./sampler_operations");
/**
 * Generate sample amounts up to `maxFillAmount`.
 */
function getSampleAmounts(maxFillAmount, numSamples, expBase = 1) {
    const distribution = [...Array(numSamples)].map((_v, i) => new utils_1.BigNumber(expBase).pow(i));
    const stepSizes = distribution.map(d => d.div(utils_1.BigNumber.sum(...distribution)));
    const amounts = stepSizes.map((_s, i) => {
        if (i === numSamples - 1) {
            return maxFillAmount;
        }
        return maxFillAmount
            .times(utils_1.BigNumber.sum(...[0, ...stepSizes.slice(0, i + 1)]))
            .integerValue(utils_1.BigNumber.ROUND_UP);
    });
    return amounts;
}
exports.getSampleAmounts = getSampleAmounts;
/**
 * Encapsulates interactions with the `ERC20BridgeSampler` contract.
 */
class DexOrderSampler extends sampler_operations_1.SamplerOperations {
    constructor(_samplerContract, _samplerOverrides, provider, balancerPoolsCache, creamPoolsCache, getBancorServiceFn, tokenAdjacencyGraph, liquidityProviderRegistry) {
        super(_samplerContract, provider, balancerPoolsCache, creamPoolsCache, getBancorServiceFn, tokenAdjacencyGraph, liquidityProviderRegistry);
        this._samplerOverrides = _samplerOverrides;
    }
    /**
     * Run a series of operations from `DexOrderSampler.ops` in a single transaction.
     */
    executeAsync(...ops) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeBatchAsync(ops);
        });
    }
    /**
     * Run a series of operations from `DexOrderSampler.ops` in a single transaction.
     * Takes an arbitrary length array, but is not typesafe.
     */
    executeBatchAsync(ops) {
        return __awaiter(this, void 0, void 0, function* () {
            const callDatas = ops.map(o => o.encodeCall());
            const { overrides, block } = this._samplerOverrides
                ? this._samplerOverrides
                : { overrides: undefined, block: undefined };
            // All operations are NOOPs
            if (callDatas.every(cd => cd === utils_1.NULL_BYTES)) {
                return callDatas.map((_callData, i) => ops[i].handleCallResults(utils_1.NULL_BYTES));
            }
            // Execute all non-empty calldatas.
            const rawCallResults = yield this._samplerContract
                .batchCall(callDatas.filter(cd => cd !== utils_1.NULL_BYTES))
                .callAsync({ overrides }, block);
            // Return the parsed results.
            let rawCallResultsIdx = 0;
            return callDatas.map((callData, i) => {
                const result = callData !== utils_1.NULL_BYTES ? rawCallResults[rawCallResultsIdx++] : utils_1.NULL_BYTES;
                return ops[i].handleCallResults(result);
            });
        });
    }
}
exports.DexOrderSampler = DexOrderSampler;
//# sourceMappingURL=sampler.js.map