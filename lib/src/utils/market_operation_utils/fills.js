"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var types_1 = require("../../types");
var fillable_amounts_utils_1 = require("../../utils/fillable_amounts_utils");
var constants_1 = require("./constants");
var types_2 = require("./types");
// tslint:disable: prefer-for-of no-bitwise completed-docs
/**
 * Create fill paths from orders and dex quotes.
 */
function createFillPaths(opts) {
    var side = opts.side;
    var excludedSources = opts.excludedSources || [];
    var feeSchedule = opts.feeSchedule || {};
    var orders = opts.orders || [];
    var dexQuotes = opts.dexQuotes || [];
    var ethToOutputRate = opts.ethToOutputRate || constants_1.ZERO_AMOUNT;
    var ethToInputRate = opts.ethToInputRate || constants_1.ZERO_AMOUNT;
    // Create native fill paths.
    var nativePath = nativeOrdersToPath(side, orders, opts.targetInput, ethToOutputRate, ethToInputRate, feeSchedule);
    // Create DEX fill paths.
    var dexPaths = dexQuotesToPaths(side, dexQuotes, ethToOutputRate, feeSchedule);
    return filterPaths(__spread(dexPaths, [nativePath]).map(function (p) { return clipPathToInput(p, opts.targetInput); }), excludedSources);
}
exports.createFillPaths = createFillPaths;
function filterPaths(paths, excludedSources) {
    return paths.filter(function (path) {
        if (path.length === 0) {
            return false;
        }
        var _a = __read(getPathSize(path), 2), input = _a[0], output = _a[1];
        if (input.eq(0) || output.eq(0)) {
            return false;
        }
        if (excludedSources.includes(path[0].source)) {
            return false;
        }
        return true;
    });
}
function nativeOrdersToPath(side, orders, targetInput, ethToOutputRate, ethToInputRate, fees) {
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
    var e_1, _a;
    var sourcePathId = utils_1.hexUtils.random();
    // Create a single path from all orders.
    var path = [];
    try {
        for (var orders_1 = __values(orders), orders_1_1 = orders_1.next(); !orders_1_1.done; orders_1_1 = orders_1.next()) {
            var order = orders_1_1.value;
            var makerAmount = fillable_amounts_utils_1.fillableAmountsUtils.getMakerAssetAmountSwappedAfterOrderFees(order);
            var takerAmount = fillable_amounts_utils_1.fillableAmountsUtils.getTakerAssetAmountSwappedAfterOrderFees(order);
            var input = side === types_1.MarketOperation.Sell ? takerAmount : makerAmount;
            var output = side === types_1.MarketOperation.Sell ? makerAmount : takerAmount;
            var fee = fees[types_2.ERC20BridgeSource.Native] === undefined ? 0 : fees[types_2.ERC20BridgeSource.Native]();
            var outputPenalty = !ethToOutputRate.isZero()
                ? ethToOutputRate.times(fee)
                : ethToInputRate.times(fee).times(output.dividedToIntegerBy(input));
            // targetInput can be less than the order size
            // whilst the penalty is constant, it affects the adjusted output
            // only up until the target has been exhausted.
            // A large order and an order at the exact target should be penalized
            // the same.
            var clippedInput = utils_1.BigNumber.min(targetInput, input);
            // scale the clipped output inline with the input
            var clippedOutput = clippedInput.dividedBy(input).times(output);
            var adjustedOutput = side === types_1.MarketOperation.Sell ? clippedOutput.minus(outputPenalty) : clippedOutput.plus(outputPenalty);
            var adjustedRate = side === types_1.MarketOperation.Sell ? adjustedOutput.div(clippedInput) : clippedInput.div(adjustedOutput);
            // Skip orders with rates that are <= 0.
            if (adjustedRate.lte(0)) {
                continue;
            }
            path.push({
                sourcePathId: sourcePathId,
                adjustedRate: adjustedRate,
                adjustedOutput: adjustedOutput,
                input: clippedInput,
                output: clippedOutput,
                flags: 0,
                index: 0,
                parent: undefined,
                source: types_2.ERC20BridgeSource.Native,
                fillData: { order: order },
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (orders_1_1 && !orders_1_1.done && (_a = orders_1.return)) _a.call(orders_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Sort by descending adjusted rate.
    path = path.sort(function (a, b) { return b.adjustedRate.comparedTo(a.adjustedRate); });
    // Re-index fills.
    for (var i = 0; i < path.length; ++i) {
        path[i].parent = i === 0 ? undefined : path[i - 1];
        path[i].index = i;
    }
    return path;
}
function dexQuotesToPaths(side, dexQuotes, ethToOutputRate, fees) {
    var e_2, _a;
    var paths = [];
    try {
        for (var dexQuotes_1 = __values(dexQuotes), dexQuotes_1_1 = dexQuotes_1.next(); !dexQuotes_1_1.done; dexQuotes_1_1 = dexQuotes_1.next()) {
            var quote = dexQuotes_1_1.value;
            var sourcePathId = utils_1.hexUtils.random();
            var path = [];
            // Drop any non-zero entries. This can occur if the any fills on Kyber were UniswapReserves
            // We need not worry about Kyber fills going to UniswapReserve as the input amount
            // we fill is the same as we sampled. I.e we received [0,20,30] output from [1,2,3] input
            // and we only fill [2,3] on Kyber (as 1 returns 0 output)
            quote = quote.filter(function (q) { return !q.output.isZero(); });
            for (var i = 0; i < quote.length; i++) {
                var sample = quote[i];
                var prevSample = i === 0 ? undefined : quote[i - 1];
                var source = sample.source, fillData = sample.fillData;
                var input = sample.input.minus(prevSample ? prevSample.input : 0);
                var output = sample.output.minus(prevSample ? prevSample.output : 0);
                var fee = fees[source] === undefined ? 0 : fees[source](sample.fillData);
                var penalty = i === 0 // Only the first fill in a DEX path incurs a penalty.
                    ? ethToOutputRate.times(fee)
                    : constants_1.ZERO_AMOUNT;
                var adjustedOutput = side === types_1.MarketOperation.Sell ? output.minus(penalty) : output.plus(penalty);
                path.push({
                    sourcePathId: sourcePathId,
                    input: input,
                    output: output,
                    adjustedOutput: adjustedOutput,
                    source: source,
                    fillData: fillData,
                    index: i,
                    parent: i !== 0 ? path[path.length - 1] : undefined,
                    flags: sourceToFillFlags(source),
                });
            }
            paths.push(path);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (dexQuotes_1_1 && !dexQuotes_1_1.done && (_a = dexQuotes_1.return)) _a.call(dexQuotes_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return paths;
}
function sourceToFillFlags(source) {
    switch (source) {
        case types_2.ERC20BridgeSource.Uniswap:
            return types_2.FillFlags.ConflictsWithMultiBridge;
        case types_2.ERC20BridgeSource.LiquidityProvider:
            return types_2.FillFlags.ConflictsWithMultiBridge;
        case types_2.ERC20BridgeSource.MultiBridge:
            return types_2.FillFlags.MultiBridge;
        default:
            return 0;
    }
}
function getPathSize(path, targetInput) {
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
    var e_3, _a;
    var input = constants_1.ZERO_AMOUNT;
    var output = constants_1.ZERO_AMOUNT;
    try {
        for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
            var fill = path_1_1.value;
            if (input.plus(fill.input).gte(targetInput)) {
                var di = targetInput.minus(input);
                input = input.plus(di);
                output = output.plus(fill.output.times(di.div(fill.input)));
                break;
            }
            else {
                input = input.plus(fill.input);
                output = output.plus(fill.output);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return [input.integerValue(), output.integerValue()];
}
exports.getPathSize = getPathSize;
function getPathAdjustedSize(path, targetInput) {
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
    var e_4, _a;
    var input = constants_1.ZERO_AMOUNT;
    var output = constants_1.ZERO_AMOUNT;
    try {
        for (var path_2 = __values(path), path_2_1 = path_2.next(); !path_2_1.done; path_2_1 = path_2.next()) {
            var fill = path_2_1.value;
            if (input.plus(fill.input).gte(targetInput)) {
                var di = targetInput.minus(input);
                if (di.gt(0)) {
                    input = input.plus(di);
                    // Penalty does not get interpolated.
                    var penalty = fill.adjustedOutput.minus(fill.output);
                    output = output.plus(fill.output.times(di.div(fill.input)).plus(penalty));
                }
                break;
            }
            else {
                input = input.plus(fill.input);
                output = output.plus(fill.adjustedOutput);
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (path_2_1 && !path_2_1.done && (_a = path_2.return)) _a.call(path_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return [input.integerValue(), output.integerValue()];
}
exports.getPathAdjustedSize = getPathAdjustedSize;
function isValidPath(path, skipDuplicateCheck) {
    if (skipDuplicateCheck === void 0) { skipDuplicateCheck = false; }
    var flags = 0;
    for (var i = 0; i < path.length; ++i) {
        // Fill must immediately follow its parent.
        if (path[i].parent) {
            if (i === 0 || path[i - 1] !== path[i].parent) {
                return false;
            }
        }
        if (!skipDuplicateCheck) {
            // Fill must not be duplicated.
            for (var j = 0; j < i; ++j) {
                if (path[i] === path[j]) {
                    return false;
                }
            }
        }
        flags |= path[i].flags;
    }
    return arePathFlagsAllowed(flags);
}
exports.isValidPath = isValidPath;
function arePathFlagsAllowed(flags) {
    var multiBridgeConflict = types_2.FillFlags.MultiBridge | types_2.FillFlags.ConflictsWithMultiBridge;
    return (flags & multiBridgeConflict) !== multiBridgeConflict;
}
exports.arePathFlagsAllowed = arePathFlagsAllowed;
function clipPathToInput(path, targetInput) {
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
    var e_5, _a;
    var clipped = [];
    var input = constants_1.ZERO_AMOUNT;
    try {
        for (var path_3 = __values(path), path_3_1 = path_3.next(); !path_3_1.done; path_3_1 = path_3.next()) {
            var fill = path_3_1.value;
            if (input.gte(targetInput)) {
                break;
            }
            input = input.plus(fill.input);
            clipped.push(fill);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (path_3_1 && !path_3_1.done && (_a = path_3.return)) _a.call(path_3);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return clipped;
}
exports.clipPathToInput = clipPathToInput;
function collapsePath(path) {
    var e_6, _a;
    var collapsed = [];
    try {
        for (var path_4 = __values(path), path_4_1 = path_4.next(); !path_4_1.done; path_4_1 = path_4.next()) {
            var fill = path_4_1.value;
            var source = fill.source;
            if (collapsed.length !== 0 && source !== types_2.ERC20BridgeSource.Native) {
                var prevFill = collapsed[collapsed.length - 1];
                // If the last fill is from the same source, merge them.
                if (prevFill.sourcePathId === fill.sourcePathId) {
                    prevFill.input = prevFill.input.plus(fill.input);
                    prevFill.output = prevFill.output.plus(fill.output);
                    prevFill.fillData = fill.fillData;
                    prevFill.subFills.push(fill);
                    continue;
                }
            }
            collapsed.push({
                sourcePathId: fill.sourcePathId,
                source: fill.source,
                fillData: fill.fillData,
                input: fill.input,
                output: fill.output,
                subFills: [fill],
            });
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (path_4_1 && !path_4_1.done && (_a = path_4.return)) _a.call(path_4);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return collapsed;
}
exports.collapsePath = collapsePath;
function getPathAdjustedCompleteRate(side, path, targetInput) {
    var _a = __read(getPathAdjustedSize(path, targetInput), 2), input = _a[0], output = _a[1];
    return getCompleteRate(side, input, output, targetInput);
}
exports.getPathAdjustedCompleteRate = getPathAdjustedCompleteRate;
function getPathAdjustedRate(side, path, targetInput) {
    var _a = __read(getPathAdjustedSize(path, targetInput), 2), input = _a[0], output = _a[1];
    return getRate(side, input, output);
}
exports.getPathAdjustedRate = getPathAdjustedRate;
function getPathAdjustedSlippage(side, path, inputAmount, maxRate) {
    if (maxRate.eq(0)) {
        return 0;
    }
    var totalRate = getPathAdjustedRate(side, path, inputAmount);
    var rateChange = maxRate.minus(totalRate);
    return rateChange.div(maxRate).toNumber();
}
exports.getPathAdjustedSlippage = getPathAdjustedSlippage;
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
function getRate(side, input, output) {
    if (input.eq(0) || output.eq(0)) {
        return constants_1.ZERO_AMOUNT;
    }
    return side === types_1.MarketOperation.Sell ? output.div(input) : input.div(output);
}
exports.getRate = getRate;
//# sourceMappingURL=fills.js.map