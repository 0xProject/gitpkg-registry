"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var constants_1 = require("../constants");
var types_1 = require("../types");
var utils_2 = require("./utils");
var PROTOCOL_FEE_MULTIPLIER = constants_1.constants.PROTOCOL_FEE_MULTIPLIER, ZERO_AMOUNT = constants_1.constants.ZERO_AMOUNT;
var ROUND_DOWN = utils_1.BigNumber.ROUND_DOWN, ROUND_UP = utils_1.BigNumber.ROUND_UP;
var EMPTY_QUOTE_INTERMEDIATE_FILL_RESULT = {
    input: ZERO_AMOUNT,
    output: ZERO_AMOUNT,
    outputFee: ZERO_AMOUNT,
    inputFee: ZERO_AMOUNT,
    protocolFee: ZERO_AMOUNT,
    gas: 0,
};
var DEFAULT_SIMULATED_FILL_QUOTE_INFO_OPTS = {
    gasSchedule: {},
    protocolFeeMultiplier: PROTOCOL_FEE_MULTIPLIER,
};
// Simulates filling a quote in the best case.
function simulateBestCaseFill(quoteInfo) {
    var opts = __assign({}, DEFAULT_SIMULATED_FILL_QUOTE_INFO_OPTS, quoteInfo.opts);
    var result = fillQuoteOrders(createBestCaseFillOrderCalls(quoteInfo), quoteInfo.fillAmount, quoteInfo.gasPrice.times(opts.protocolFeeMultiplier), opts.gasSchedule);
    return fromIntermediateQuoteFillResult(result, quoteInfo);
}
exports.simulateBestCaseFill = simulateBestCaseFill;
// Simulates filling a quote in the worst case.
function simulateWorstCaseFill(quoteInfo) {
    var opts = __assign({}, DEFAULT_SIMULATED_FILL_QUOTE_INFO_OPTS, quoteInfo.opts);
    var protocolFeePerFillOrder = quoteInfo.gasPrice.times(opts.protocolFeeMultiplier);
    var result = __assign({}, fillQuoteOrders(createWorstCaseFillOrderCalls(quoteInfo), quoteInfo.fillAmount, protocolFeePerFillOrder, opts.gasSchedule), { 
        // Worst case gas and protocol fee is hitting all orders.
        gas: getTotalGasUsedBySources(getFlattenedFillsFromOrders(quoteInfo.orders).map(function (s) { return s.source; }), opts.gasSchedule), protocolFee: protocolFeePerFillOrder.times(quoteInfo.orders.length) });
    return fromIntermediateQuoteFillResult(result, quoteInfo);
}
exports.simulateWorstCaseFill = simulateWorstCaseFill;
function fillQuoteOrders(fillOrders, inputAmount, protocolFeePerFillOrder, gasSchedule) {
    var e_1, _a, e_2, _b, e_3, _c;
    var result = __assign({}, EMPTY_QUOTE_INTERMEDIATE_FILL_RESULT, { inputBySource: {} });
    var remainingInput = inputAmount;
    try {
        for (var fillOrders_1 = __values(fillOrders), fillOrders_1_1 = fillOrders_1.next(); !fillOrders_1_1.done; fillOrders_1_1 = fillOrders_1.next()) {
            var fo = fillOrders_1_1.value;
            if (remainingInput.lte(0)) {
                break;
            }
            try {
                for (var _d = __values(fo.order.fills), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var fill = _e.value;
                    if (remainingInput.lte(0)) {
                        break;
                    }
                    var source = fill.source;
                    result.gas += gasSchedule[source] || 0;
                    result.inputBySource[source] = result.inputBySource[source] || ZERO_AMOUNT;
                    try {
                        // Actual rates are rarely linear, so fill subfills individually to
                        // get a better approximation of fill size.
                        for (var _f = __values(fill.subFills), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var subFill = _g.value;
                            if (remainingInput.lte(0)) {
                                break;
                            }
                            var filledInput = solveForInputFillAmount(remainingInput, subFill.input, fo.totalOrderInput, fo.totalOrderInputFee);
                            var filledOutput = subFill.output.times(filledInput.div(subFill.input));
                            var filledInputFee = filledInput.div(fo.totalOrderInput).times(fo.totalOrderInputFee);
                            var filledOutputFee = filledOutput.div(fo.totalOrderOutput).times(fo.totalOrderOutputFee);
                            result.inputBySource[source] = result.inputBySource[source].plus(filledInput);
                            result.input = result.input.plus(filledInput);
                            result.output = result.output.plus(filledOutput);
                            result.inputFee = result.inputFee.plus(filledInputFee);
                            result.outputFee = result.outputFee.plus(filledOutputFee);
                            remainingInput = remainingInput.minus(filledInput.plus(filledInputFee));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
            result.protocolFee = result.protocolFee.plus(protocolFeePerFillOrder);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (fillOrders_1_1 && !fillOrders_1_1.done && (_a = fillOrders_1.return)) _a.call(fillOrders_1);
        }
        finally { if (e_1) throw e_1.error; }
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
    var denom = totalOrderInput.plus(totalOrderInputFee);
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
    var orders = quoteInfo.orders, side = quoteInfo.side;
    return orders.map(function (o) { return (__assign({ order: o }, (side === types_1.MarketOperation.Sell
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
            }))); });
}
function createWorstCaseFillOrderCalls(quoteInfo) {
    // Reuse best case fill orders.
    return createBestCaseFillOrderCalls(quoteInfo)
        .map(function (fo) { return (__assign({}, fo, { order: __assign({}, fo.order, { 
            // Apply slippage to order fills and reverse them.
            fills: getSlippedOrderFills(fo.order, quoteInfo.side).reverse() }) })); })
        .reverse();
}
// Apply order slippage to its fill paths.
function getSlippedOrderFills(order, side) {
    var totalInput = utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(order.fills.map(function (f) { return f.input; })));
    var totalOutput = utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(order.fills.map(function (f) { return f.output; })));
    var inputScaling = side === types_1.MarketOperation.Sell
        ? order.fillableTakerAssetAmount.div(totalInput)
        : order.fillableMakerAssetAmount.div(totalInput);
    var outputScaling = side === types_1.MarketOperation.Sell
        ? order.fillableMakerAssetAmount.div(totalOutput)
        : order.fillableTakerAssetAmount.div(totalOutput);
    return order.fills.map(function (f) { return (__assign({}, f, { input: f.input.times(inputScaling), output: f.output.times(outputScaling), subFills: f.subFills.map(function (sf) { return (__assign({}, sf, { input: sf.input.times(inputScaling), output: sf.output.times(outputScaling) })); }) })); });
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
        inputBySource: Object.assign.apply(Object, __spread([{}], Object.entries(ir.inputBySource).map(function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            var _c;
            return (_c = {}, _c[k] = roundInputAmount(v, side), _c);
        }))),
    };
}
function fromIntermediateQuoteFillResult(ir, quoteInfo) {
    var side = quoteInfo.side;
    var _ir = roundIntermediateFillResult(ir, side);
    return __assign({}, (side === types_1.MarketOperation.Sell
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
    var e_4, _a;
    var fills = [];
    try {
        for (var orders_1 = __values(orders), orders_1_1 = orders_1.next(); !orders_1_1.done; orders_1_1 = orders_1.next()) {
            var o = orders_1_1.value;
            fills.push.apply(fills, __spread(o.fills));
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (orders_1_1 && !orders_1_1.done && (_a = orders_1.return)) _a.call(orders_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return fills;
}
exports.getFlattenedFillsFromOrders = getFlattenedFillsFromOrders;
function getTotalGasUsedBySources(sources, gasSchedule) {
    var e_5, _a;
    var gasUsed = 0;
    try {
        for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
            var s = sources_1_1.value;
            gasUsed += gasSchedule[s] || 0;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (sources_1_1 && !sources_1_1.done && (_a = sources_1.return)) _a.call(sources_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return gasUsed;
}
//# sourceMappingURL=quote_simulation.js.map