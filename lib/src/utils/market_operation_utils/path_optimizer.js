"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const constants_1 = require("./constants");
const fills_1 = require("./fills");
// tslint:disable: prefer-for-of custom-no-magic-numbers completed-docs no-bitwise
const RUN_LIMIT_DECAY_FACTOR = 0.5;
/**
 * Find the optimal mixture of paths that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
function findOptimalPathAsync(side, paths, targetInput, runLimit = Math.pow(2, 8)) {
    return __awaiter(this, void 0, void 0, function* () {
        // Sort paths by descending adjusted completed rate.
        const sortedPaths = paths
            .slice(0)
            .sort((a, b) => fills_1.getPathAdjustedCompleteRate(side, b, targetInput).comparedTo(fills_1.getPathAdjustedCompleteRate(side, a, targetInput)));
        let optimalPath = sortedPaths[0] || [];
        for (const [i, path] of sortedPaths.slice(1).entries()) {
            optimalPath = mixPaths(side, optimalPath, path, targetInput, runLimit * Math.pow(RUN_LIMIT_DECAY_FACTOR, i));
            // Yield to event loop.
            yield Promise.resolve();
        }
        return isPathComplete(optimalPath, targetInput) ? optimalPath : undefined;
    });
}
exports.findOptimalPathAsync = findOptimalPathAsync;
function mixPaths(side, pathA, pathB, targetInput, maxSteps) {
    const _maxSteps = Math.max(maxSteps, 32);
    let steps = 0;
    // We assume pathA is the better of the two initially.
    let bestPath = pathA;
    let [bestPathInput, bestPathOutput] = fills_1.getPathAdjustedSize(pathA, targetInput);
    let bestPathRate = fills_1.getCompleteRate(side, bestPathInput, bestPathOutput, targetInput);
    const _isBetterPath = (input, rate) => {
        if (bestPathInput.lt(targetInput)) {
            return input.gt(bestPathInput);
        }
        else if (input.gte(targetInput)) {
            return rate.gt(bestPathRate);
        }
        return false;
    };
    const _walk = (path, input, output, flags, remainingFills) => {
        steps += 1;
        const rate = fills_1.getCompleteRate(side, input, output, targetInput);
        if (_isBetterPath(input, rate)) {
            bestPath = path;
            bestPathInput = input;
            bestPathOutput = output;
            bestPathRate = rate;
        }
        const remainingInput = targetInput.minus(input);
        if (remainingInput.gt(0)) {
            for (let i = 0; i < remainingFills.length && steps < _maxSteps; ++i) {
                const fill = remainingFills[i];
                // Only walk valid paths.
                if (!isValidNextPathFill(path, flags, fill)) {
                    continue;
                }
                // Remove this fill from the next list of candidate fills.
                const nextRemainingFills = remainingFills.slice();
                nextRemainingFills.splice(i, 1);
                // Recurse.
                _walk([...path, fill], input.plus(utils_1.BigNumber.min(remainingInput, fill.input)), output.plus(
                // Clip the output of the next fill to the remaining
                // input.
                clipFillAdjustedOutput(fill, remainingInput)), flags | fill.flags, nextRemainingFills);
            }
        }
    };
    const allFills = [...pathA, ...pathB];
    const sources = allFills.filter(f => f.index === 0).map(f => f.sourcePathId);
    const rateBySource = Object.assign({}, ...sources.map(s => ({
        [s]: fills_1.getPathAdjustedRate(side, allFills.filter(f => f.sourcePathId === s), targetInput),
    })));
    // Sort subpaths by rate and keep fills contiguous to improve our
    // chances of walking ideal, valid paths first.
    const sortedFills = allFills.sort((a, b) => {
        if (a.sourcePathId !== b.sourcePathId) {
            return rateBySource[b.sourcePathId].comparedTo(rateBySource[a.sourcePathId]);
        }
        return a.index - b.index;
    });
    _walk([], constants_1.ZERO_AMOUNT, constants_1.ZERO_AMOUNT, 0, sortedFills);
    if (!fills_1.isValidPath(bestPath)) {
        throw new Error('nooope');
    }
    return bestPath;
}
function isValidNextPathFill(path, pathFlags, fill) {
    if (path.length === 0) {
        return !fill.parent;
    }
    if (path[path.length - 1] === fill.parent) {
        return true;
    }
    if (fill.parent) {
        return false;
    }
    return fills_1.arePathFlagsAllowed(pathFlags | fill.flags);
}
function isPathComplete(path, targetInput) {
    const [input] = fills_1.getPathSize(path);
    return input.gte(targetInput);
}
function clipFillAdjustedOutput(fill, remainingInput) {
    if (fill.input.lte(remainingInput)) {
        return fill.adjustedOutput;
    }
    // Penalty does not get interpolated.
    const penalty = fill.adjustedOutput.minus(fill.output);
    return remainingInput.times(fill.output.div(fill.input)).plus(penalty);
}
//# sourceMappingURL=path_optimizer.js.map