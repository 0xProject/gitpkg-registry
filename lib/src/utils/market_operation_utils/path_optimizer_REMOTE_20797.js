"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var types_1 = require("../../types");
var constants_1 = require("./constants");
var fills_1 = require("./fills");
// tslint:disable: prefer-for-of custom-no-magic-numbers completed-docs
var RUN_LIMIT_DECAY_FACTOR = 1;
var setTimeoutPromise = function (delay) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, delay); }); };
/**
 * Find the optimal mixture of paths that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
function findOptimalPathAsync(side, paths, targetInput, runLimit) {
    if (runLimit === void 0) { runLimit = Math.pow(2, 15); }
    return __awaiter(this, void 0, void 0, function () {
        var e_1, _a, sortedPaths, optimalPath, _b, _c, _d, i, path, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    sortedPaths = paths
                        .slice(0)
                        .sort(function (a, b) { return fills_1.getPathAdjustedSize(b, targetInput)[1].comparedTo(fills_1.getPathAdjustedSize(a, targetInput)[1]); });
                    optimalPath = sortedPaths[0] || [];
                    console.time("\t\tmixPaths");
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 8]);
                    _b = __values(sortedPaths.slice(1).entries()), _c = _b.next();
                    _e.label = 2;
                case 2:
                    if (!!_c.done) return [3 /*break*/, 5];
                    _d = __read(_c.value, 2), i = _d[0], path = _d[1];
                    console.time("\t\tmixPaths-" + i);
                    optimalPath = mixPaths(side, optimalPath, path, targetInput, runLimit * Math.pow(RUN_LIMIT_DECAY_FACTOR, i));
                    return [4 /*yield*/, setTimeoutPromise(0)];
                case 3:
                    _e.sent();
                    console.timeEnd("\t\tmixPaths-" + i);
                    _e.label = 4;
                case 4:
                    _c = _b.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8:
                    console.timeEnd("\t\tmixPaths");
                    return [2 /*return*/, isPathComplete(optimalPath, targetInput) ? optimalPath : undefined];
            }
        });
    });
}
exports.findOptimalPathAsync = findOptimalPathAsync;
function mixPaths(side, pathA, pathB, targetInput, maxSteps) {
    var bestPath = [];
    var pathAdjustedSize = fills_1.getPathAdjustedSize(bestPath, targetInput);
    var bestPathInput = pathAdjustedSize[0];
    var bestPathRate = getRate.apply(void 0, __spread([side], pathAdjustedSize));
    var steps = 0;
    var _isBetterPath = function (input, rate) {
        if (bestPathInput.lt(targetInput)) {
            return input.gt(bestPathInput);
        }
        else if (input.gte(targetInput)) {
            return rate.gt(bestPathRate);
        }
        return false;
    };
    var _walk = function (path, input, output, allFills) {
        steps += 1;
        var rate = getRate(side, input, output);
        if (_isBetterPath(input, rate)) {
            bestPath = path;
            bestPathInput = input;
            bestPathRate = rate;
        }
        var remainingInput = targetInput.minus(input);
        if (remainingInput.gt(0)) {
            for (var i = 0; i < allFills.length; ++i) {
                var fill = allFills[i];
                if (steps + 1 >= maxSteps) {
                    break;
                }
                var childPath = __spread(path, [fill]);
                if (!fills_1.isValidPath(childPath, true)) {
                    continue;
                }
                // Remove this fill from the next list of candidate fills.
                var nextAllFills = allFills.slice();
                nextAllFills.splice(i, 1);
                // Recurse.
                _walk(childPath, input.plus(utils_1.BigNumber.min(remainingInput, fill.input)), output.plus(
                // Clip the output of the next fill to the remaining
                // input.
                clipFillAdjustedOutput(fill, remainingInput)), nextAllFills);
            }
        }
    };
    _walk(bestPath, constants_1.ZERO_AMOUNT, constants_1.ZERO_AMOUNT, __spread(pathA, pathB).sort(function (a, b) { return b.rate.comparedTo(a.rate); }));
    console.log({ steps: steps });
    return bestPath;
}
function isPathComplete(path, targetInput) {
    var _a = __read(fills_1.getPathSize(path), 1), input = _a[0];
    return input.gte(targetInput);
}
function clipFillAdjustedOutput(fill, remainingInput) {
    if (fill.input.lte(remainingInput)) {
        return fill.adjustedOutput;
    }
    var penalty = fill.adjustedOutput.minus(fill.output);
    return remainingInput.times(fill.rate).plus(penalty);
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
//# sourceMappingURL=path_optimizer_REMOTE_20797.js.map