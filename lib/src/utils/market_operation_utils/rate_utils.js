"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRate = exports.getCompleteRate = exports.getTwoHopAdjustedRate = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const types_1 = require("../../types");
const constants_1 = require("./constants");
const fills_1 = require("./fills");
const identity_fill_adjustor_1 = require("./identity_fill_adjustor");
const types_2 = require("./types");
// tslint:disable:no-bitwise
/**
 * Returns the fee-adjusted rate of a two-hop quote. Returns zero if the
 * quote falls short of the target input.
 */
function getTwoHopAdjustedRate(side, twoHopQuote, targetInput, outputAmountPerEth, fees = {}, exchangeProxyOverhead = () => constants_1.ZERO_AMOUNT, fillAdjustor = new identity_fill_adjustor_1.IdentityFillAdjustor()) {
    const { output, input, fillData } = twoHopQuote;
    if (input.isLessThan(targetInput) || output.isZero()) {
        return constants_1.ZERO_AMOUNT;
    }
    // Flags to indicate which sources are used
    const flags = constants_1.SOURCE_FLAGS.MultiHop |
        constants_1.SOURCE_FLAGS[fillData.firstHopSource.source] |
        constants_1.SOURCE_FLAGS[fillData.secondHopSource.source];
    // Penalty of going to those sources in terms of output
    const sourcePenalty = outputAmountPerEth.times(fees[types_2.ERC20BridgeSource.MultiHop](fillData).fee).integerValue();
    // Create a Fill so it can be adjusted by the `FillAdjustor`
    const fill = Object.assign(Object.assign({}, twoHopQuote), { flags, type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge, adjustedOutput: (0, fills_1.adjustOutput)(side, twoHopQuote.output, sourcePenalty), sourcePathId: `${types_2.ERC20BridgeSource.MultiHop}-${fillData.firstHopSource.source}-${fillData.secondHopSource.source}`, 
        // We don't have this information at this stage
        gas: 0 });
    // Adjust the individual Fill
    // HACK: Chose the worst of slippage between the two sources in multihop
    const adjustedOutputLeft = fillAdjustor.adjustFills(side, [Object.assign(Object.assign({}, fill), { source: fillData.firstHopSource.source })], targetInput)[0].adjustedOutput;
    const adjustedOutputRight = fillAdjustor.adjustFills(side, [Object.assign(Object.assign({}, fill), { source: fillData.secondHopSource.source })], targetInput)[0].adjustedOutput;
    // In Sells, output smaller is worse (you're getting less out)
    // In Buys, output larger is worse (it's costing you more)
    const fillAdjustedOutput = side === types_1.MarketOperation.Sell
        ? utils_1.BigNumber.min(adjustedOutputLeft, adjustedOutputRight)
        : utils_1.BigNumber.max(adjustedOutputLeft, adjustedOutputRight);
    const pathPenalty = outputAmountPerEth.times(exchangeProxyOverhead(flags)).integerValue();
    const pathAdjustedOutput = (0, fills_1.adjustOutput)(side, fillAdjustedOutput, pathPenalty);
    return getRate(side, input, pathAdjustedOutput);
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
    if (side === types_1.MarketOperation.Sell) {
        // (o / i) * (i / t) => (o / t)
        return output.div(targetInput);
    }
    // (i / o) * (i / t)
    return input.div(output).times(input.div(targetInput));
}
exports.getCompleteRate = getCompleteRate;
/**
 * Computes the rate given the input/output of a path.
 *
 * If it is a sell, output/input. If it is a buy, input/output.
 */
function getRate(side, input, output) {
    if (input.eq(0) || output.eq(0)) {
        return constants_1.ZERO_AMOUNT;
    }
    return side === types_1.MarketOperation.Sell ? output.div(input) : input.div(output);
}
exports.getRate = getRate;
//# sourceMappingURL=rate_utils.js.map