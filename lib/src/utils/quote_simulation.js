"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const constants_1 = require("../constants");
const types_1 = require("../types");
const utils_2 = require("./utils");
const { PROTOCOL_FEE_MULTIPLIER, ZERO_AMOUNT } = constants_1.constants;
const { ROUND_DOWN, ROUND_UP } = utils_1.BigNumber;
const EMPTY_QUOTE_INTERMEDIATE_FILL_RESULT = {
    input: ZERO_AMOUNT,
    output: ZERO_AMOUNT,
    outputFee: ZERO_AMOUNT,
    inputFee: ZERO_AMOUNT,
    protocolFee: ZERO_AMOUNT,
    gas: 0,
};
const DEFAULT_SIMULATED_FILL_QUOTE_INFO_OPTS = {
    gasSchedule: {},
    protocolFeeMultiplier: PROTOCOL_FEE_MULTIPLIER,
};
// Simulates filling a quote in the best case.
function simulateBestCaseFill(quoteInfo) {
    const opts = Object.assign({}, DEFAULT_SIMULATED_FILL_QUOTE_INFO_OPTS, quoteInfo.opts);
    const protocolFeePerFillOrder = quoteInfo.gasPrice.times(opts.protocolFeeMultiplier);
    const result = fillQuoteOrders(createBestCaseFillOrderCalls(quoteInfo), quoteInfo.fillAmount, protocolFeePerFillOrder, opts.gasSchedule);
    return fromIntermediateQuoteFillResult(result, quoteInfo);
}
exports.simulateBestCaseFill = simulateBestCaseFill;
// Simulates filling a quote in the worst case.
function simulateWorstCaseFill(quoteInfo) {
    const opts = Object.assign({}, DEFAULT_SIMULATED_FILL_QUOTE_INFO_OPTS, quoteInfo.opts);
    const protocolFeePerFillOrder = quoteInfo.gasPrice.times(opts.protocolFeeMultiplier);
    const result = Object.assign({}, fillQuoteOrders(createWorstCaseFillOrderCalls(quoteInfo), quoteInfo.fillAmount, protocolFeePerFillOrder, opts.gasSchedule), { 
        // Worst case gas and protocol fee is hitting all orders.
        gas: getTotalGasUsedByFills(getFlattenedFillsFromOrders(quoteInfo.orders), opts.gasSchedule), protocolFee: protocolFeePerFillOrder.times(quoteInfo.orders.length) });
    return fromIntermediateQuoteFillResult(result, quoteInfo);
}
exports.simulateWorstCaseFill = simulateWorstCaseFill;
function fillQuoteOrders(fillOrders, inputAmount, protocolFeePerFillOrder, gasSchedule) {
    const result = Object.assign({}, EMPTY_QUOTE_INTERMEDIATE_FILL_RESULT, { inputBySource: {} });
    let remainingInput = inputAmount;
    for (const fo of fillOrders) {
        if (remainingInput.lte(0)) {
            break;
        }
        for (const fill of fo.order.fills) {
            if (remainingInput.lte(0)) {
                break;
            }
            const { source, fillData } = fill;
            const fee = gasSchedule[source] === undefined ? 0 : gasSchedule[source](fillData);
            result.gas += new utils_1.BigNumber(fee).toNumber();
            result.inputBySource[source] = result.inputBySource[source] || ZERO_AMOUNT;
            // Actual rates are rarely linear, so fill subfills individually to
            // get a better approximation of fill size.
            for (const subFill of fill.subFills) {
                if (remainingInput.lte(0)) {
                    break;
                }
                const filledInput = solveForInputFillAmount(remainingInput, subFill.input, fo.totalOrderInput, fo.totalOrderInputFee);
                const filledOutput = subFill.output.times(filledInput.div(subFill.input));
                const filledInputFee = filledInput.div(fo.totalOrderInput).times(fo.totalOrderInputFee);
                const filledOutputFee = filledOutput.div(fo.totalOrderOutput).times(fo.totalOrderOutputFee);
                result.inputBySource[source] = result.inputBySource[source].plus(filledInput);
                result.input = result.input.plus(filledInput);
                result.output = result.output.plus(filledOutput);
                result.inputFee = result.inputFee.plus(filledInputFee);
                result.outputFee = result.outputFee.plus(filledOutputFee);
                remainingInput = remainingInput.minus(filledInput.plus(filledInputFee));
            }
        }
        result.protocolFee = result.protocolFee.plus(protocolFeePerFillOrder);
    }
    return result;
}
exports.fillQuoteOrders = fillQuoteOrders;
function solveForInputFillAmount(remainingInput, fillableInput, totalOrderInput, totalOrderInputFee) {
    // When accounting for input token taker fees, the effective input amount is
    // given by:
    //   i' = i + f * i / o
    // where:
    //   i' - The effective input amount, including fees
    //   i  - An input amount
    //   f  - totalOrderInputFee
    //   o  - totalOrderInput
    // Solving for i we get:
    //   i = (i' * o) / (f + o)
    const denom = totalOrderInput.plus(totalOrderInputFee);
    if (denom.eq(0)) {
        // A zero denominator would imply an order whose fees are >= the input
        // token amount.
        // For sells, takerFeeAmount >= takerAssetAmount (technically OK but really undesirable).
        // For buys, takerFeeAmount >= makerAssetAmount (losing all your returns to fees).
        return fillableInput;
    }
    return utils_1.BigNumber.min(fillableInput, 
    // let i' = remainingInput
    remainingInput.times(totalOrderInput).div(denom));
}
function createBestCaseFillOrderCalls(quoteInfo) {
    const { orders, side } = quoteInfo;
    return orders.map(o => (Object.assign({ order: o }, (side === types_1.MarketOperation.Sell
        ? {
            totalOrderInput: o.takerAssetAmount,
            totalOrderOutput: o.makerAssetAmount,
            totalOrderInputFee: utils_2.isOrderTakerFeePayableWithTakerAsset(o) ? o.takerFee : ZERO_AMOUNT,
            totalOrderOutputFee: utils_2.isOrderTakerFeePayableWithMakerAsset(o) ? o.takerFee.negated() : ZERO_AMOUNT,
        }
        : // Buy
            {
                totalOrderInput: o.makerAssetAmount,
                totalOrderOutput: o.takerAssetAmount,
                totalOrderInputFee: utils_2.isOrderTakerFeePayableWithMakerAsset(o) ? o.takerFee.negated() : ZERO_AMOUNT,
                totalOrderOutputFee: utils_2.isOrderTakerFeePayableWithTakerAsset(o) ? o.takerFee : ZERO_AMOUNT,
            }))));
}
function createWorstCaseFillOrderCalls(quoteInfo) {
    // Reuse best case fill orders, but apply slippage.
    return (createBestCaseFillOrderCalls(quoteInfo)
        .map(fo => (Object.assign({}, fo, { order: Object.assign({}, fo.order, { 
            // Apply slippage to order fills and reverse them.
            fills: getSlippedOrderFills(fo.order, quoteInfo.side)
                .map(f => (Object.assign({}, f, { subFills: f.subFills.slice().reverse() })))
                .reverse() }) })))
        // Sort by ascending price.
        .sort((a, b) => a.order.makerAssetAmount
        .div(a.order.takerAssetAmount)
        .comparedTo(b.order.makerAssetAmount.div(b.order.takerAssetAmount))));
}
// Apply order slippage to its fill paths.
function getSlippedOrderFills(order, side) {
    const totalInput = utils_1.BigNumber.sum(...order.fills.map(f => f.input));
    const totalOutput = utils_1.BigNumber.sum(...order.fills.map(f => f.output));
    const inputScaling = side === types_1.MarketOperation.Sell
        ? order.fillableTakerAssetAmount.div(totalInput)
        : order.fillableMakerAssetAmount.div(totalInput);
    const outputScaling = side === types_1.MarketOperation.Sell
        ? order.fillableMakerAssetAmount.div(totalOutput)
        : order.fillableTakerAssetAmount.div(totalOutput);
    return order.fills.map(f => (Object.assign({}, f, { input: f.input.times(inputScaling), output: f.output.times(outputScaling), subFills: f.subFills.map(sf => (Object.assign({}, sf, { input: sf.input.times(inputScaling), output: sf.output.times(outputScaling) }))) })));
}
function roundInputAmount(amount, side) {
    return amount.integerValue(side === types_1.MarketOperation.Sell ? ROUND_UP : ROUND_DOWN);
}
function roundOutputAmount(amount, side) {
    return amount.integerValue(side === types_1.MarketOperation.Sell ? ROUND_DOWN : ROUND_UP);
}
function roundIntermediateFillResult(ir, side) {
    return {
        input: roundInputAmount(ir.input, side),
        output: roundOutputAmount(ir.output, side),
        inputFee: roundInputAmount(ir.inputFee, side),
        outputFee: roundOutputAmount(ir.outputFee, side),
        protocolFee: ir.protocolFee.integerValue(ROUND_UP),
        gas: Math.ceil(ir.gas),
        inputBySource: Object.assign({}, ...Object.entries(ir.inputBySource).map(([k, v]) => ({ [k]: roundInputAmount(v, side) }))),
    };
}
function fromIntermediateQuoteFillResult(ir, quoteInfo) {
    const { side } = quoteInfo;
    const _ir = roundIntermediateFillResult(ir, side);
    return Object.assign({}, (side === types_1.MarketOperation.Sell
        ? // Sell
            {
                makerAssetAmount: _ir.output,
                takerAssetAmount: _ir.input,
                takerFeeMakerAssetAmount: _ir.outputFee,
                takerFeeTakerAssetAmount: _ir.inputFee,
                totalMakerAssetAmount: _ir.output.plus(_ir.outputFee),
                totalTakerAssetAmount: _ir.input.plus(_ir.inputFee),
            }
        : // Buy
            {
                makerAssetAmount: _ir.input,
                takerAssetAmount: _ir.output,
                takerFeeMakerAssetAmount: _ir.inputFee,
                takerFeeTakerAssetAmount: _ir.outputFee,
                totalMakerAssetAmount: _ir.input.plus(_ir.inputFee),
                totalTakerAssetAmount: _ir.output.plus(_ir.outputFee),
            }), { protocolFeeAmount: _ir.protocolFee, gas: _ir.gas, fillAmountBySource: _ir.inputBySource });
}
function getFlattenedFillsFromOrders(orders) {
    const fills = [];
    for (const o of orders) {
        fills.push(...o.fills);
    }
    return fills;
}
exports.getFlattenedFillsFromOrders = getFlattenedFillsFromOrders;
function getTotalGasUsedByFills(fills, gasSchedule) {
    let gasUsed = 0;
    for (const f of fills) {
        const fee = gasSchedule[f.source] === undefined ? 0 : gasSchedule[f.source](f.fillData);
        gasUsed += new utils_1.BigNumber(fee).toNumber();
    }
    return gasUsed;
}
//# sourceMappingURL=quote_simulation.js.map