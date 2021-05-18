"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFills = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const types_1 = require("../../types");
const constants_1 = require("./constants");
const types_2 = require("./types");
// tslint:disable: prefer-for-of no-bitwise completed-docs
/**
 * Create `Fill` objects from orders and dex quotes.
 */
function createFills(opts) {
    const { side } = opts;
    const excludedSources = opts.excludedSources || [];
    const feeSchedule = opts.feeSchedule || {};
    const orders = opts.orders || [];
    const dexQuotes = opts.dexQuotes || [];
    const outputAmountPerEth = opts.outputAmountPerEth || constants_1.ZERO_AMOUNT;
    const inputAmountPerEth = opts.inputAmountPerEth || constants_1.ZERO_AMOUNT;
    // Create native fills.
    const nativeFills = nativeOrdersToFills(side, orders.filter(o => o.fillableTakerAmount.isGreaterThan(0)), opts.targetInput, outputAmountPerEth, inputAmountPerEth, feeSchedule);
    // Create DEX fills.
    const dexFills = dexQuotes.map(singleSourceSamples => dexSamplesToFills(side, singleSourceSamples, outputAmountPerEth, inputAmountPerEth, feeSchedule));
    return [...dexFills, nativeFills]
        .map(p => clipFillsToInput(p, opts.targetInput))
        .filter(fills => hasLiquidity(fills) && !excludedSources.includes(fills[0].source));
}
exports.createFills = createFills;
function clipFillsToInput(fills, targetInput = constants_1.POSITIVE_INF) {
    const clipped = [];
    let input = constants_1.ZERO_AMOUNT;
    for (const fill of fills) {
        if (input.gte(targetInput)) {
            break;
        }
        input = input.plus(fill.input);
        clipped.push(fill);
    }
    return clipped;
}
function hasLiquidity(fills) {
    if (fills.length === 0) {
        return false;
    }
    const totalInput = utils_1.BigNumber.sum(...fills.map(fill => fill.input));
    const totalOutput = utils_1.BigNumber.sum(...fills.map(fill => fill.output));
    if (totalInput.isZero() || totalOutput.isZero()) {
        return false;
    }
    return true;
}
function nativeOrdersToFills(side, orders, targetInput = constants_1.POSITIVE_INF, outputAmountPerEth, inputAmountPerEth, fees) {
    const sourcePathId = utils_1.hexUtils.random();
    // Create a single path from all orders.
    let fills = [];
    for (const o of orders) {
        const { fillableTakerAmount, fillableTakerFeeAmount, fillableMakerAmount, type } = o;
        const makerAmount = fillableMakerAmount;
        const takerAmount = fillableTakerAmount.plus(fillableTakerFeeAmount);
        const input = side === types_1.MarketOperation.Sell ? takerAmount : makerAmount;
        const output = side === types_1.MarketOperation.Sell ? makerAmount : takerAmount;
        const fee = fees[types_2.ERC20BridgeSource.Native] === undefined ? 0 : fees[types_2.ERC20BridgeSource.Native](o);
        const outputPenalty = !outputAmountPerEth.isZero()
            ? outputAmountPerEth.times(fee)
            : inputAmountPerEth.times(fee).times(output.dividedToIntegerBy(input));
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
        // Skip orders with rates that are <= 0.
        if (adjustedRate.lte(0)) {
            continue;
        }
        fills.push({
            sourcePathId,
            adjustedRate,
            adjustedOutput,
            input: clippedInput,
            output: clippedOutput,
            flags: constants_1.SOURCE_FLAGS[type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq ? 'RfqOrder' : 'LimitOrder'],
            index: 0,
            parent: undefined,
            source: types_2.ERC20BridgeSource.Native,
            type,
            fillData: Object.assign({}, o),
        });
    }
    // Sort by descending adjusted rate.
    fills = fills.sort((a, b) => b.adjustedRate.comparedTo(a.adjustedRate));
    // Re-index fills.
    for (let i = 0; i < fills.length; ++i) {
        fills[i].parent = i === 0 ? undefined : fills[i - 1];
        fills[i].index = i;
    }
    return fills;
}
function dexSamplesToFills(side, samples, outputAmountPerEth, inputAmountPerEth, fees) {
    const sourcePathId = utils_1.hexUtils.random();
    const fills = [];
    // Drop any non-zero entries. This can occur if the any fills on Kyber were UniswapReserves
    // We need not worry about Kyber fills going to UniswapReserve as the input amount
    // we fill is the same as we sampled. I.e we received [0,20,30] output from [1,2,3] input
    // and we only fill [2,3] on Kyber (as 1 returns 0 output)
    const nonzeroSamples = samples.filter(q => !q.output.isZero());
    for (let i = 0; i < nonzeroSamples.length; i++) {
        const sample = nonzeroSamples[i];
        const prevSample = i === 0 ? undefined : nonzeroSamples[i - 1];
        const { source, fillData } = sample;
        const input = sample.input.minus(prevSample ? prevSample.input : 0);
        const output = sample.output.minus(prevSample ? prevSample.output : 0);
        const fee = fees[source] === undefined ? 0 : fees[source](sample.fillData) || 0;
        let penalty = constants_1.ZERO_AMOUNT;
        if (i === 0) {
            // Only the first fill in a DEX path incurs a penalty.
            penalty = !outputAmountPerEth.isZero()
                ? outputAmountPerEth.times(fee)
                : inputAmountPerEth.times(fee).times(output.dividedToIntegerBy(input));
        }
        const adjustedOutput = side === types_1.MarketOperation.Sell ? output.minus(penalty) : output.plus(penalty);
        fills.push({
            sourcePathId,
            input,
            output,
            adjustedOutput,
            source,
            fillData,
            type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge,
            index: i,
            parent: i !== 0 ? fills[fills.length - 1] : undefined,
            flags: constants_1.SOURCE_FLAGS[source],
        });
    }
    return fills;
}
//# sourceMappingURL=fills.js.map