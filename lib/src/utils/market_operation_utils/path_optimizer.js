"use strict";
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
var types_1 = require("../../types");
var constants_1 = require("./constants");
var fills_1 = require("./fills");
// tslint:disable: prefer-for-of custom-no-magic-numbers completed-docs
/**
 * Find the optimal mixture of paths that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
function findOptimalPath(side, paths, targetInput, runLimit) {
    var e_1, _a;
    var optimalPath = paths[0] || [];
    try {
        // TODO(dorothy-zbornak): Convex paths (like kyber) should technically always be
        // inserted at the front of the path because a partial fill can invalidate them.
        for (var _b = __values(paths.slice(1)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var path = _c.value;
            optimalPath = mixPaths(side, optimalPath, path, targetInput, runLimit);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return isPathComplete(optimalPath, targetInput) ? optimalPath : undefined;
}
exports.findOptimalPath = findOptimalPath;
function mixPaths(side, pathA, pathB, targetInput, maxSteps) {
    if (maxSteps === void 0) { maxSteps = Math.pow(2, 15); }
    var allFills = __spread(pathA, pathB).sort(function (a, b) { return b.rate.comparedTo(a.rate); });
    var bestPath = [];
    var bestPathInput = constants_1.ZERO_AMOUNT;
    var bestPathRate = constants_1.ZERO_AMOUNT;
    var steps = 0;
    var _isBetterPath = function (input, rate) {
        if (bestPathInput.lt(targetInput)) {
            return input.gt(bestPathInput);
        }
        else if (input.gte(bestPathInput)) {
            return rate.gt(bestPathRate);
        }
        return false;
    };
    var _walk = function (path, input, output) {
        var e_2, _a;
        steps += 1;
        var rate = getRate(side, input, output);
        if (_isBetterPath(input, rate)) {
            bestPath = path;
            bestPathInput = input;
            bestPathRate = rate;
        }
        if (input.lt(targetInput)) {
            try {
                for (var allFills_1 = __values(allFills), allFills_1_1 = allFills_1.next(); !allFills_1_1.done; allFills_1_1 = allFills_1.next()) {
                    var fill = allFills_1_1.value;
                    if (steps >= maxSteps) {
                        break;
                    }
                    var childPath = __spread(path, [fill]);
                    if (!fills_1.isValidPath(childPath)) {
                        continue;
                    }
                    _walk(childPath, input.plus(fill.input), output.plus(fill.adjustedOutput));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (allFills_1_1 && !allFills_1_1.done && (_a = allFills_1.return)) _a.call(allFills_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    _walk(bestPath, constants_1.ZERO_AMOUNT, constants_1.ZERO_AMOUNT);
    return bestPath;
}
function isPathComplete(path, targetInput) {
    var _a = __read(fills_1.getPathSize(path), 1), input = _a[0];
    return input.gte(targetInput);
}
function getRate(side, input, output) {
    if (input.eq(0) || output.eq(0)) {
        return constants_1.ZERO_AMOUNT;
    }
    if (side === types_1.MarketOperation.Sell) {
        return output.div(input);
    }
    return input.div(output);
}
//# sourceMappingURL=path_optimizer.js.map