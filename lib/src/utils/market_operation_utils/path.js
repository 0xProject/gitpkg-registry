"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = exports.DEFAULT_PATH_PENALTY_OPTS = void 0;
const utils_1 = require("@0x/utils");
const types_1 = require("../../types");
const constants_1 = require("./constants");
const fills_1 = require("./fills");
const orders_1 = require("./orders");
const rate_utils_1 = require("./rate_utils");
const types_2 = require("./types");
exports.DEFAULT_PATH_PENALTY_OPTS = {
    outputAmountPerEth: constants_1.ZERO_AMOUNT,
    inputAmountPerEth: constants_1.ZERO_AMOUNT,
    exchangeProxyOverhead: () => constants_1.ZERO_AMOUNT,
    gasPrice: constants_1.ZERO_AMOUNT,
};
class Path {
    constructor(side, fills, targetInput, pathPenaltyOpts) {
        this.side = side;
        this.fills = fills;
        this.targetInput = targetInput;
        this.pathPenaltyOpts = pathPenaltyOpts;
        this.sourceFlags = BigInt(0);
        this._size = { input: constants_1.ZERO_AMOUNT, output: constants_1.ZERO_AMOUNT };
        this._adjustedSize = { input: constants_1.ZERO_AMOUNT, output: constants_1.ZERO_AMOUNT };
    }
    static create(side, fills, targetInput = constants_1.POSITIVE_INF, pathPenaltyOpts = exports.DEFAULT_PATH_PENALTY_OPTS) {
        const path = new Path(side, fills, targetInput, pathPenaltyOpts);
        fills.forEach(fill => {
            path.sourceFlags |= fill.flags;
            path._addFillSize(fill);
        });
        return path;
    }
    static clone(base) {
        const clonedPath = new Path(base.side, base.fills.slice(), base.targetInput, base.pathPenaltyOpts);
        clonedPath.sourceFlags = base.sourceFlags;
        clonedPath._size = Object.assign({}, base._size);
        clonedPath._adjustedSize = Object.assign({}, base._adjustedSize);
        clonedPath.collapsedFills = base.collapsedFills === undefined ? undefined : base.collapsedFills.slice();
        clonedPath.orders = base.orders === undefined ? undefined : base.orders.slice();
        return clonedPath;
    }
    append(fill) {
        this.fills.push(fill);
        this.sourceFlags |= fill.flags;
        this._addFillSize(fill);
        return this;
    }
    /**
     * Add a fallback path to the current path
     * Fallback must contain exclusive fills that are
     * not present in this path
     */
    addFallback(fallback) {
        // We pre-pend the sources which have a higher probability of failure
        // This allows us to continue on to the remaining fills
        // If the "flakey" sources like Native were at the end, we may have a failure
        // as the last fill and then either revert, or go back to a source we previously
        // filled against
        const nativeFills = this.fills.filter(f => f.source === types_2.ERC20BridgeSource.Native);
        const otherFills = this.fills.filter(f => f.source !== types_2.ERC20BridgeSource.Native);
        // Map to the unique source id and the index to represent a unique fill
        const fillToFillId = (fill) => `${fill.sourcePathId}${fill.index}`;
        const otherFillIds = otherFills.map(f => fillToFillId(f));
        this.fills = [
            // Append all of the native fills first
            ...nativeFills,
            // Add the other fills that are not native in the optimal path
            ...otherFills,
            // Add the fills to the end that aren't already included
            ...fallback.fills.filter(f => !otherFillIds.includes(fillToFillId(f))),
        ];
        // Recompute the source flags
        this.sourceFlags = this.fills.reduce((flags, fill) => flags | fill.flags, BigInt(0));
        return this;
    }
    collapse(opts) {
        const [makerToken, takerToken] = (0, orders_1.getMakerTakerTokens)(opts);
        const collapsedFills = this.collapsedFills === undefined ? this._collapseFills() : this.collapsedFills;
        this.orders = [];
        for (let i = 0; i < collapsedFills.length;) {
            if (collapsedFills[i].source === types_2.ERC20BridgeSource.Native) {
                this.orders.push((0, orders_1.createNativeOptimizedOrder)(collapsedFills[i], opts.side));
                ++i;
                continue;
            }
            this.orders.push((0, orders_1.createBridgeOrder)(collapsedFills[i], makerToken, takerToken, opts.side));
            i += 1;
        }
        return this;
    }
    size() {
        return this._size;
    }
    adjustedSize() {
        const { input, output } = this._adjustedSize;
        const { exchangeProxyOverhead, outputAmountPerEth, inputAmountPerEth } = this.pathPenaltyOpts;
        const gasOverhead = exchangeProxyOverhead(this.sourceFlags);
        const pathPenalty = (0, fills_1.ethToOutputAmount)({
            input,
            output,
            inputAmountPerEth,
            outputAmountPerEth,
            ethAmount: gasOverhead,
        });
        return {
            input,
            output: this.side === types_1.MarketOperation.Sell ? output.minus(pathPenalty) : output.plus(pathPenalty),
        };
    }
    adjustedCompleteRate() {
        const { input, output } = this.adjustedSize();
        return (0, rate_utils_1.getCompleteRate)(this.side, input, output, this.targetInput);
    }
    adjustedRate() {
        const { input, output } = this.adjustedSize();
        return (0, rate_utils_1.getRate)(this.side, input, output);
    }
    /**
     * Returns the best possible rate this path can offer, given the fills.
     */
    bestRate() {
        const best = this.fills.reduce((prevRate, curr) => {
            const currRate = (0, rate_utils_1.getRate)(this.side, curr.input, curr.output);
            return prevRate.isLessThan(currRate) ? currRate : prevRate;
        }, new utils_1.BigNumber(0));
        return best;
    }
    adjustedSlippage(maxRate) {
        if (maxRate.eq(0)) {
            return 0;
        }
        const totalRate = this.adjustedRate();
        const rateChange = maxRate.minus(totalRate);
        return rateChange.div(maxRate).toNumber();
    }
    isBetterThan(other) {
        if (!this.targetInput.isEqualTo(other.targetInput)) {
            throw new Error(`Target input mismatch: ${this.targetInput} !== ${other.targetInput}`);
        }
        const { targetInput } = this;
        const { input } = this._size;
        const { input: otherInput } = other._size;
        if (input.isLessThan(targetInput) || otherInput.isLessThan(targetInput)) {
            return input.isGreaterThan(otherInput);
        }
        else {
            return this.adjustedCompleteRate().isGreaterThan(other.adjustedCompleteRate());
        }
        // if (otherInput.isLessThan(targetInput)) {
        //     return input.isGreaterThan(otherInput);
        // } else if (input.isGreaterThanOrEqualTo(targetInput)) {
        //     return this.adjustedCompleteRate().isGreaterThan(other.adjustedCompleteRate());
        // }
        // return false;
    }
    isComplete() {
        const { input } = this._size;
        return input.gte(this.targetInput);
    }
    isValid(skipDuplicateCheck = false) {
        for (let i = 0; i < this.fills.length; ++i) {
            // Fill must immediately follow its parent.
            if (this.fills[i].parent) {
                if (i === 0 || this.fills[i - 1] !== this.fills[i].parent) {
                    return false;
                }
            }
            if (!skipDuplicateCheck) {
                // Fill must not be duplicated.
                for (let j = 0; j < i; ++j) {
                    if (this.fills[i] === this.fills[j]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    isValidNextFill(fill) {
        if (this.fills.length === 0) {
            return !fill.parent;
        }
        if (this.fills[this.fills.length - 1] === fill.parent) {
            return true;
        }
        if (fill.parent) {
            return false;
        }
        return true;
    }
    _collapseFills() {
        this.collapsedFills = [];
        for (const fill of this.fills) {
            const source = fill.source;
            if (this.collapsedFills.length !== 0 && source !== types_2.ERC20BridgeSource.Native) {
                const prevFill = this.collapsedFills[this.collapsedFills.length - 1];
                // If the last fill is from the same source, merge them.
                if (prevFill.sourcePathId === fill.sourcePathId) {
                    prevFill.input = prevFill.input.plus(fill.input);
                    prevFill.output = prevFill.output.plus(fill.output);
                    prevFill.fillData = fill.fillData;
                    prevFill.subFills.push(fill);
                    continue;
                }
            }
            this.collapsedFills.push({
                sourcePathId: fill.sourcePathId,
                source: fill.source,
                type: fill.type,
                fillData: fill.fillData,
                input: fill.input,
                output: fill.output,
                subFills: [fill],
            });
        }
        return this.collapsedFills;
    }
    _addFillSize(fill) {
        if (this._size.input.plus(fill.input).isGreaterThan(this.targetInput)) {
            const remainingInput = this.targetInput.minus(this._size.input);
            const scaledFillOutput = fill.output.times(remainingInput.div(fill.input));
            this._size.input = this.targetInput;
            this._size.output = this._size.output.plus(scaledFillOutput);
            // Penalty does not get interpolated.
            const penalty = fill.adjustedOutput.minus(fill.output);
            this._adjustedSize.input = this.targetInput;
            this._adjustedSize.output = this._adjustedSize.output.plus(scaledFillOutput).plus(penalty);
        }
        else {
            this._size.input = this._size.input.plus(fill.input);
            this._size.output = this._size.output.plus(fill.output);
            this._adjustedSize.input = this._adjustedSize.input.plus(fill.input);
            this._adjustedSize.output = this._adjustedSize.output.plus(fill.adjustedOutput);
        }
    }
}
exports.Path = Path;
//# sourceMappingURL=path.js.map