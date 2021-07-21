"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRate = exports.getCompleteRate = exports.getTwoHopAdjustedRate = void 0;
const types_1 = require("../../network/types");
const types_2 = require("../../types");
const constants_1 = require("./constants");
// tslint:disable:no-bitwise
/**
 * Returns the fee-adjusted rate of a two-hop quote. Returns zero if the
 * quote falls short of the target input.
 */
function getTwoHopAdjustedRate(side, twoHopQuote, targetInput, outputAmountPerEth, fees = {}, exchangeProxyOverhead = () => constants_1.ZERO_AMOUNT) {
    const { output, input, fillData } = twoHopQuote;
    if (input.isLessThan(targetInput) || output.isZero()) {
        return constants_1.ZERO_AMOUNT;
    }
    const penalty = outputAmountPerEth.times(exchangeProxyOverhead(constants_1.SOURCE_FLAGS.MultiHop | constants_1.SOURCE_FLAGS[fillData.firstHop.source] | constants_1.SOURCE_FLAGS[fillData.secondHop.source], 2).plus(fees[types_1.ERC20BridgeSource.MultiHop](fillData)));
    const adjustedOutput = side === types_2.MarketOperation.Sell ? output.minus(penalty) : output.plus(penalty);
    return side === types_2.MarketOperation.Sell ? adjustedOutput.div(input) : input.div(adjustedOutput);
}
exports.getTwoHopAdjustedRate = getTwoHopAdjustedRate;
/**
 * Computes the "complete" rate given the input/output of a path.
 * This value penalizes the path if it falls short of the target input.
 */
function getCompleteRate(side, input, output, targetInput) {
    if (input.eq(0) || output.eq(0) || targetInput.eq(0)) {
        return constants_1.ZERO_AMOUNT;
    }
    // Penalize paths that fall short of the entire input amount by a factor of
    // input / targetInput => (i / t)
    if (side === types_2.MarketOperation.Sell) {
        // (o / i) * (i / t) => (o / t)
        return output.div(targetInput);
    }
    // (i / o) * (i / t)
    return input.div(output).times(input.div(targetInput));
}
exports.getCompleteRate = getCompleteRate;
/**
 * Computes the rate given the input/output of a path.
 */
function getRate(side, input, output) {
    if (input.eq(0) || output.eq(0)) {
        return constants_1.ZERO_AMOUNT;
    }
    return side === types_2.MarketOperation.Sell ? output.div(input) : input.div(output);
}
exports.getRate = getRate;
//# sourceMappingURL=rate_utils.js.map