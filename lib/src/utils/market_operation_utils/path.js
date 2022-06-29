"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = exports.DEFAULT_PATH_PENALTY_OPTS = void 0;
const utils_1 = require("@0x/utils");
const _ = require("lodash");
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
    /**
     * Finalizes this path, creating fillable orders with the information required
     * for settlement
     */
    finalize(opts) {
        const [makerToken, takerToken] = (0, orders_1.getMakerTakerTokens)(opts);
        this.orders = [];
        for (const fill of this.fills) {
            // internal BigInt flag field is not supported JSON and is tricky
            // to remove upstream. Since it's not needed in a FinalizedPath we just drop it.
            const normalizedFill = _.omit(fill, 'flags');
            if (fill.source === types_2.ERC20BridgeSource.Native) {
                this.orders.push((0, orders_1.createNativeOptimizedOrder)(normalizedFill, opts.side));
            }
            else {
                this.orders.push((0, orders_1.createBridgeOrder)(normalizedFill, makerToken, takerToken, opts.side));
            }
        }
        return this;
    }
    adjustedSize() {
        // Adjusted input/output has been adjusted by the cost of the DEX, but not by any
        // overhead added by the exchange proxy.
        const { input, output } = this._adjustedSize;
        const { exchangeProxyOverhead, outputAmountPerEth, inputAmountPerEth } = this.pathPenaltyOpts;
        // Calculate the additional penalty from the ways this path can be filled
        // by the exchange proxy, e.g VIPs (small) or FillQuoteTransformer (large)
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
    /**
     * Calculates the rate of this path, where the output has been
     * adjusted for penalties (e.g cost)
     */
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
    /**
     * Compares two paths returning if this adjusted path
     * is better than the other adjusted path
     */
    isAdjustedBetterThan(other) {
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