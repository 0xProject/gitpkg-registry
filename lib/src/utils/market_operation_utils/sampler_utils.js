"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSampleAmounts = void 0;
const utils_1 = require("@0x/utils");
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
//# sourceMappingURL=sampler_utils.js.map