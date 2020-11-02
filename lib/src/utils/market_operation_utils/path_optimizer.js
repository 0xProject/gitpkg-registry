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
const _ = require("lodash");
const path_1 = require("./path");
// tslint:disable: prefer-for-of custom-no-magic-numbers completed-docs no-bitwise
const RUN_LIMIT_DECAY_FACTOR = 0.5;
/**
 * Find the optimal mixture of fills that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
function findOptimalPathAsync(side, fills, targetInput, runLimit = Math.pow(2, 8), opts = path_1.DEFAULT_PATH_PENALTY_OPTS) {
    return __awaiter(this, void 0, void 0, function* () {
        const rates = rateBySourcePathId(side, fills, targetInput);
        const paths = fills.map(singleSourceFills => path_1.Path.create(side, singleSourceFills, targetInput, opts));
        // Sort fill arrays by descending adjusted completed rate.
        const sortedPaths = paths.sort((a, b) => b.adjustedCompleteRate().comparedTo(a.adjustedCompleteRate()));
        if (sortedPaths.length === 0) {
            return undefined;
        }
        let optimalPath = sortedPaths[0];
        for (const [i, path] of sortedPaths.slice(1).entries()) {
            optimalPath = mixPaths(side, optimalPath, path, targetInput, runLimit * Math.pow(RUN_LIMIT_DECAY_FACTOR, i), rates);
            // Yield to event loop.
            yield Promise.resolve();
        }
        return optimalPath.isComplete() ? optimalPath : undefined;
    });
}
exports.findOptimalPathAsync = findOptimalPathAsync;
function mixPaths(side, pathA, pathB, targetInput, maxSteps, rates) {
    const _maxSteps = Math.max(maxSteps, 32);
    let steps = 0;
    // We assume pathA is the better of the two initially.
    let bestPath = pathA;
    const _walk = (path, remainingFills) => {
        steps += 1;
        if (path.isBetterThan(bestPath)) {
            bestPath = path;
        }
        const remainingInput = targetInput.minus(path.size().input);
        if (remainingInput.isGreaterThan(0)) {
            for (let i = 0; i < remainingFills.length && steps < _maxSteps; ++i) {
                const fill = remainingFills[i];
                // Only walk valid paths.
                if (!path.isValidNextFill(fill)) {
                    continue;
                }
                // Remove this fill from the next list of candidate fills.
                const nextRemainingFills = remainingFills.slice();
                nextRemainingFills.splice(i, 1);
                // Recurse.
                _walk(path_1.Path.clone(path).append(fill), nextRemainingFills);
            }
        }
    };
    const allFills = [...pathA.fills, ...pathB.fills];
    // Sort subpaths by rate and keep fills contiguous to improve our
    // chances of walking ideal, valid paths first.
    const sortedFills = allFills.sort((a, b) => {
        if (a.sourcePathId !== b.sourcePathId) {
            return rates[b.sourcePathId].comparedTo(rates[a.sourcePathId]);
        }
        return a.index - b.index;
    });
    _walk(path_1.Path.create(side, [], targetInput, pathA.pathPenaltyOpts), sortedFills);
    if (!bestPath.isValid()) {
        throw new Error('nooope');
    }
    return bestPath;
}
function rateBySourcePathId(side, fills, targetInput) {
    const flattenedFills = _.flatten(fills);
    const sourcePathIds = flattenedFills.filter(f => f.index === 0).map(f => f.sourcePathId);
    return Object.assign({}, ...sourcePathIds.map(s => ({
        [s]: path_1.Path.create(side, flattenedFills.filter(f => f.sourcePathId === s), targetInput).adjustedRate(),
    })));
}
//# sourceMappingURL=path_optimizer.js.map