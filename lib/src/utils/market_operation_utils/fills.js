"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustOutput = exports.dexSampleToFill = exports.nativeOrderToFill = exports.ethToOutputAmount = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const types_1 = require("../../types");
const constants_1 = require("./constants");
const types_2 = require("./types");
// tslint:disable: prefer-for-of no-bitwise completed-docs
/**
 * Converts the ETH value to an amount in output tokens.
 *
 * By default this prefers the outputAmountPerEth, but if this value
 * is zero it will utilize the inputAmountPerEth and input.
 */
function ethToOutputAmount({ input, output, ethAmount, inputAmountPerEth, outputAmountPerEth, }) {
    return !outputAmountPerEth.isZero()
        ? outputAmountPerEth.times(ethAmount).integerValue()
        : inputAmountPerEth.times(ethAmount).times(output.dividedToIntegerBy(input));
}
exports.ethToOutputAmount = ethToOutputAmount;
function nativeOrderToFill(side, order, targetInput = constants_1.POSITIVE_INF, outputAmountPerEth, inputAmountPerEth, fees, filterNegativeAdjustedRateOrders = true) {
    const sourcePathId = utils_1.hexUtils.random();
    // Create a single path from all orders.
    const { fillableTakerAmount, fillableTakerFeeAmount, fillableMakerAmount, type } = order;
    const makerAmount = fillableMakerAmount;
    const takerAmount = fillableTakerAmount.plus(fillableTakerFeeAmount);
    const input = side === types_1.MarketOperation.Sell ? takerAmount : makerAmount;
    const output = side === types_1.MarketOperation.Sell ? makerAmount : takerAmount;
    const { fee, gas } = fees[types_2.ERC20BridgeSource.Native] === undefined ? constants_1.DEFAULT_FEE_ESTIMATE : fees[types_2.ERC20BridgeSource.Native](order);
    const outputPenalty = ethToOutputAmount({
        input,
        output,
        inputAmountPerEth,
        outputAmountPerEth,
        ethAmount: fee,
    });
    // targetInput can be less than the order size
    // whilst the penalty is constant, it affects the adjusted output
    // only up until the target has been exhausted.
    // A large order and an order at the exact target should be penalized
    // the same.
    const clippedInput = utils_1.BigNumber.min(targetInput, input);
    // scale the clipped output inline with the input
    const clippedOutput = clippedInput.dividedBy(input).times(output);
    const adjustedOutput = side === types_1.MarketOperation.Sell ? clippedOutput.minus(outputPenalty) : clippedOutput.plus(outputPenalty);
    const adjustedRate = side === types_1.MarketOperation.Sell ? adjustedOutput.div(clippedInput) : clippedInput.div(adjustedOutput);
    // Optionally skip orders with rates that are <= 0.
    if (filterNegativeAdjustedRateOrders && adjustedRate.lte(0)) {
        return undefined;
    }
    return {
        sourcePathId,
        adjustedOutput,
        input: clippedInput,
        output: clippedOutput,
        flags: constants_1.SOURCE_FLAGS[type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq ? 'RfqOrder' : 'LimitOrder'],
        source: types_2.ERC20BridgeSource.Native,
        type,
        fillData: Object.assign({}, order),
        gas,
    };
}
exports.nativeOrderToFill = nativeOrderToFill;
function dexSampleToFill(side, sample, outputAmountPerEth, inputAmountPerEth, fees) {
    const sourcePathId = utils_1.hexUtils.random();
    const { source, fillData } = sample;
    const input = sample.input;
    const output = sample.output;
    const { fee, gas } = fees[source] === undefined ? constants_1.DEFAULT_FEE_ESTIMATE : fees[source](sample.fillData) || constants_1.DEFAULT_FEE_ESTIMATE;
    const penalty = ethToOutputAmount({
        input,
        output,
        inputAmountPerEth,
        outputAmountPerEth,
        ethAmount: fee,
    });
    return {
        sourcePathId,
        input,
        output,
        adjustedOutput: adjustOutput(side, output, penalty),
        source,
        fillData,
        type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge,
        flags: constants_1.SOURCE_FLAGS[source],
        gas,
    };
}
exports.dexSampleToFill = dexSampleToFill;
/**
 *  Adjusts the output depending on whether this is a buy or a sell.
 *
 * If it is a sell, than output is lowered by the adjustment.
 * If it is a buy, than output is increased by adjustment.
 */
function adjustOutput(side, output, penalty) {
    return side === types_1.MarketOperation.Sell ? output.minus(penalty) : output.plus(penalty);
}
exports.adjustOutput = adjustOutput;
//# sourceMappingURL=fills.js.map