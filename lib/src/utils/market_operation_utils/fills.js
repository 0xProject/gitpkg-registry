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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathAdjustedSlippage = exports.getPathAdjustedRate = exports.getFallbackSourcePaths = exports.collapsePath = exports.clipPathToInput = exports.isValidPath = exports.getPathAdjustedSize = exports.getPathSize = exports.createFillPaths = void 0;
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
    // Create native fill paths.
    var nativePath = nativeOrdersToPath(side, orders, opts.targetInput, ethToOutputRate, feeSchedule);
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
function nativeOrdersToPath(side, orders, targetInput, ethToOutputRate, fees) {
    var e_1, _a;
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
    // Create a single path from all orders.
    var path = [];
    try {
        for (var orders_1 = __values(orders), orders_1_1 = orders_1.next(); !orders_1_1.done; orders_1_1 = orders_1.next()) {
            var order = orders_1_1.value;
            var makerAmount = fillable_amounts_utils_1.fillableAmountsUtils.getMakerAssetAmountSwappedAfterOrderFees(order);
            var takerAmount = fillable_amounts_utils_1.fillableAmountsUtils.getTakerAssetAmountSwappedAfterOrderFees(order);
            var input = side === types_1.MarketOperation.Sell ? takerAmount : makerAmount;
            var output = side === types_1.MarketOperation.Sell ? makerAmount : takerAmount;
            var penalty = ethToOutputRate.times(fees[types_2.ERC20BridgeSource.Native] === undefined ? 0 : fees[types_2.ERC20BridgeSource.Native]());
            var rate = makerAmount.div(takerAmount);
            // targetInput can be less than the order size
            // whilst the penalty is constant, it affects the adjusted output
            // only up until the target has been exhausted.
            // A large order and an order at the exact target should be penalized
            // the same.
            var clippedInput = utils_1.BigNumber.min(targetInput, input);
            // scale the clipped output inline with the input
            var clippedOutput = clippedInput.dividedBy(input).times(output);
            var adjustedOutput = side === types_1.MarketOperation.Sell ? clippedOutput.minus(penalty) : clippedOutput.plus(penalty);
            var adjustedRate = side === types_1.MarketOperation.Sell ? adjustedOutput.div(clippedInput) : clippedInput.div(adjustedOutput);
            // Skip orders with rates that are <= 0.
            if (adjustedRate.lte(0)) {
                continue;
            }
            path.push({
                input: clippedInput,
                output: clippedOutput,
                rate: rate,
                adjustedRate: adjustedRate,
                adjustedOutput: adjustedOutput,
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
                var rate = side === types_1.MarketOperation.Sell ? output.div(input) : input.div(output);
                var adjustedRate = side === types_1.MarketOperation.Sell ? adjustedOutput.div(input) : input.div(adjustedOutput);
                path.push({
                    input: input,
                    output: output,
                    rate: rate,
                    adjustedRate: adjustedRate,
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
    var e_3, _a;
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
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
    var e_4, _a;
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
    var input = constants_1.ZERO_AMOUNT;
    var output = constants_1.ZERO_AMOUNT;
    try {
        for (var path_2 = __values(path), path_2_1 = path_2.next(); !path_2_1.done; path_2_1 = path_2.next()) {
            var fill = path_2_1.value;
            if (input.plus(fill.input).gte(targetInput)) {
                var di = targetInput.minus(input);
                input = input.plus(di);
                output = output.plus(fill.adjustedOutput.times(di.div(fill.input)));
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
    var multiBridgeConflict = types_2.FillFlags.MultiBridge | types_2.FillFlags.ConflictsWithMultiBridge;
    return (flags & multiBridgeConflict) !== multiBridgeConflict;
}
exports.isValidPath = isValidPath;
function clipPathToInput(path, targetInput) {
    var e_5, _a;
    if (targetInput === void 0) { targetInput = constants_1.POSITIVE_INF; }
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
                if (prevFill.source === source) {
                    prevFill.input = prevFill.input.plus(fill.input);
                    prevFill.output = prevFill.output.plus(fill.output);
                    prevFill.subFills.push(fill);
                    continue;
                }
            }
            collapsed.push({
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
function getFallbackSourcePaths(optimalPath, allPaths) {
    var e_7, _a, e_8, _b;
    var optimalSources = [];
    try {
        for (var optimalPath_1 = __values(optimalPath), optimalPath_1_1 = optimalPath_1.next(); !optimalPath_1_1.done; optimalPath_1_1 = optimalPath_1.next()) {
            var fill = optimalPath_1_1.value;
            if (!optimalSources.includes(fill.source)) {
                optimalSources.push(fill.source);
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (optimalPath_1_1 && !optimalPath_1_1.done && (_a = optimalPath_1.return)) _a.call(optimalPath_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    var fallbackPaths = [];
    try {
        for (var allPaths_1 = __values(allPaths), allPaths_1_1 = allPaths_1.next(); !allPaths_1_1.done; allPaths_1_1 = allPaths_1.next()) {
            var path = allPaths_1_1.value;
            if (optimalSources.includes(path[0].source)) {
                continue;
            }
            // HACK(dorothy-zbornak): We *should* be filtering out paths that
            // conflict with the optimal path (i.e., Kyber conflicts), but in
            // practice we often end up not being able to find a fallback path
            // because we've lost 2 major liquiduty sources. The end result is
            // we end up with many more reverts than what would be actually caused
            // by conflicts.
            fallbackPaths.push(path);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (allPaths_1_1 && !allPaths_1_1.done && (_b = allPaths_1.return)) _b.call(allPaths_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return fallbackPaths;
}
exports.getFallbackSourcePaths = getFallbackSourcePaths;
function getPathAdjustedRate(side, path, targetInput) {
    var _a = __read(getPathAdjustedSize(path, targetInput), 2), input = _a[0], output = _a[1];
    if (input.eq(0) || output.eq(0)) {
        return constants_1.ZERO_AMOUNT;
    }
    return side === types_1.MarketOperation.Sell ? output.div(input) : input.div(output);
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
//# sourceMappingURL=fills.js.map