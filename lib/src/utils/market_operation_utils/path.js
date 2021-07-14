"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = exports.DEFAULT_PATH_PENALTY_OPTS = void 0;
const utils_1 = require("@0x/utils");
const types_1 = require("../../network/types");
const types_2 = require("../../types");
const constants_1 = require("./constants");
const orders_1 = require("./orders");
const rate_utils_1 = require("./rate_utils");
exports.DEFAULT_PATH_PENALTY_OPTS = {
    outputAmountPerEth: constants_1.ZERO_AMOUNT,
    inputAmountPerEth: constants_1.ZERO_AMOUNT,
    exchangeProxyOverhead: () => constants_1.ZERO_AMOUNT,
};
// TODO(dorothy-zbornak): This class is honestly so confusing. Consider burning it down.
class Path {
    constructor(side, fills, targetInput, pathPenaltyOpts) {
        this.side = side;
        this.targetInput = targetInput;
        this.pathPenaltyOpts = pathPenaltyOpts;
        this.sourceFlags = BigInt(0);
        this.fills = [];
        this._size = { input: constants_1.ZERO_AMOUNT, output: constants_1.ZERO_AMOUNT };
        this._adjustedSize = { input: constants_1.ZERO_AMOUNT, output: constants_1.ZERO_AMOUNT };
        this._numDistinctFills = 0;
        this._sourcePathIdsSeen = {};
        for (const f of fills) {
            this._addFill(f);
        }
    }
    static create(side, fills, targetInput = constants_1.POSITIVE_INF, pathPenaltyOpts = exports.DEFAULT_PATH_PENALTY_OPTS) {
        const path = new Path(side, fills, targetInput, pathPenaltyOpts);
        return path;
    }
    static clone(base) {
        const clonedPath = new Path(base.side, base.fills.slice(), base.targetInput, base.pathPenaltyOpts);
        clonedPath.sourceFlags = base.sourceFlags;
        clonedPath._size = Object.assign({}, base._size);
        clonedPath._adjustedSize = Object.assign({}, base._adjustedSize);
        clonedPath.collapsedFills = base.collapsedFills === undefined ? undefined : base.collapsedFills.slice();
        clonedPath.orders = base.orders === undefined ? undefined : base.orders.slice();
        clonedPath._numDistinctFills = base._numDistinctFills;
        clonedPath._sourcePathIdsSeen = Object.assign({}, base._sourcePathIdsSeen);
        return clonedPath;
    }
    append(fill) {
        this._addFill(fill);
        return this;
    }
    /**
     * Add a fallback path to the current path
     * Fallback must contain exclusive fills that are
     * not present in this path
     */
    addFallback(fallback) {
        // If the last fill is Native and penultimate is not, then the intention was to partial fill
        // In this case we drop it entirely as we can't handle a failure at the end and we don't
        // want to fully fill when it gets prepended to the front below
        const [last, penultimateIfExists] = this.fills.slice().reverse();
        const lastNativeFillIfExists = last.source === types_1.ERC20BridgeSource.Native &&
            penultimateIfExists &&
            penultimateIfExists.source !== types_1.ERC20BridgeSource.Native
            ? last
            : undefined;
        // By prepending native paths to the front they cannot split on-chain sources and incur
        // an additional protocol fee. I.e [Uniswap,Native,Kyber] becomes [Native,Uniswap,Kyber]
        // In the previous step we dropped any hanging Native partial fills, as to not fully fill
        const nativeFills = this.fills.filter(f => f.source === types_1.ERC20BridgeSource.Native && f !== lastNativeFillIfExists);
        const otherFills = this.fills.filter(f => f.source !== types_1.ERC20BridgeSource.Native);
        const otherSourcePathIds = otherFills.map(f => f.sourcePathId);
        this.fills = [];
        this.sourceFlags = BigInt(0);
        this._sourcePathIdsSeen = {};
        this._numDistinctFills = 0;
        const fillsToAdd = [
            // Append all of the native fills first
            ...nativeFills,
            // Add the other fills that are not native in the optimal path
            ...otherFills,
            // Add the fallbacks to the end that aren't already included
            ...fallback.fills.filter(f => !otherSourcePathIds.includes(f.sourcePathId)),
        ];
        for (const f of fillsToAdd) {
            this._addFill(f);
        }
        return this;
    }
    collapse(opts) {
        const [makerToken, takerToken] = orders_1.getMakerTakerTokens(opts);
        const collapsedFills = this.collapsedFills === undefined ? this._collapseFills() : this.collapsedFills;
        this.orders = [];
        for (let i = 0; i < collapsedFills.length;) {
            if (collapsedFills[i].source === types_1.ERC20BridgeSource.Native) {
                this.orders.push(orders_1.createNativeOptimizedOrder(collapsedFills[i], opts.side));
                ++i;
                continue;
            }
            // If there are contiguous bridge orders, we can batch them together.
            // TODO jacob pretty sure this is from DFB and we can remove
            const contiguousBridgeFills = [collapsedFills[i]];
            for (let j = i + 1; j < collapsedFills.length; ++j) {
                if (collapsedFills[j].source === types_1.ERC20BridgeSource.Native) {
                    break;
                }
                contiguousBridgeFills.push(collapsedFills[j]);
            }
            this.orders.push(orders_1.createBridgeOrder(contiguousBridgeFills[0], makerToken, takerToken, opts.side));
            i += 1;
        }
        return this;
    }
    size() {
        return this._size;
    }
    get numDistinctFills() {
        return this._numDistinctFills;
    }
    adjustedSize() {
        const { input, output } = this._adjustedSize;
        const { exchangeProxyOverhead, outputAmountPerEth, inputAmountPerEth } = this.pathPenaltyOpts;
        const gasOverhead = exchangeProxyOverhead(this.sourceFlags, this.numDistinctFills);
        const pathPenalty = !outputAmountPerEth.isZero()
            ? outputAmountPerEth.times(gasOverhead)
            : inputAmountPerEth.times(gasOverhead).times(output.dividedToIntegerBy(input));
        return {
            input,
            output: this.side === types_2.MarketOperation.Sell ? output.minus(pathPenalty) : output.plus(pathPenalty),
        };
    }
    adjustedCompleteRate() {
        const { input, output } = this.adjustedSize();
        return rate_utils_1.getCompleteRate(this.side, input, output, this.targetInput);
    }
    adjustedRate() {
        const { input, output } = this.adjustedSize();
        return rate_utils_1.getRate(this.side, input, output);
    }
    /**
     * Returns the best possible rate this path can offer, given the fills.
     */
    bestRate() {
        const best = this.fills.reduce((prevRate, curr) => {
            const currRate = rate_utils_1.getRate(this.side, curr.input, curr.output);
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
            if (this.collapsedFills.length !== 0 && source !== types_1.ERC20BridgeSource.Native) {
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
    _addFill(fill) {
        this.sourceFlags |= fill.flags;
        this.fills.push(fill);
        if (!(fill.sourcePathId in this._sourcePathIdsSeen)) {
            this._numDistinctFills++;
        }
        this._sourcePathIdsSeen[fill.sourcePathId] = true;
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