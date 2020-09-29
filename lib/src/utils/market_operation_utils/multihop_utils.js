"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const constants_1 = require("./constants");
const fills_1 = require("./fills");
/**
 * Given a token pair, returns the intermediate tokens to consider for two-hop routes.
 */
function getIntermediateTokens(makerToken, takerToken, tokenAdjacencyGraph, wethAddress) {
    let intermediateTokens = [];
    if (makerToken === wethAddress) {
        intermediateTokens = _.get(tokenAdjacencyGraph, takerToken, []);
    }
    else if (takerToken === wethAddress) {
        intermediateTokens = _.get(tokenAdjacencyGraph, makerToken, []);
    }
    else {
        intermediateTokens = _.union(_.intersection(_.get(tokenAdjacencyGraph, takerToken, []), _.get(tokenAdjacencyGraph, makerToken, [])), [wethAddress]);
    }
    return intermediateTokens.filter(token => token.toLowerCase() !== makerToken.toLowerCase() && token.toLowerCase() !== takerToken.toLowerCase());
}
exports.getIntermediateTokens = getIntermediateTokens;
/**
 * Returns the best two-hop quote and the fee-adjusted rate of that quote.
 */
function getBestTwoHopQuote(marketSideLiquidity, feeSchedule) {
    const { side, inputAmount, ethToOutputRate, twoHopQuotes } = marketSideLiquidity;
    if (twoHopQuotes.length === 0) {
        return { adjustedRate: constants_1.ZERO_AMOUNT, quote: undefined };
    }
    const best = twoHopQuotes
        .map(quote => fills_1.getTwoHopAdjustedRate(side, quote, inputAmount, ethToOutputRate, feeSchedule))
        .reduce((prev, curr, i) => curr.isGreaterThan(prev.adjustedRate) ? { adjustedRate: curr, quote: twoHopQuotes[i] } : prev, {
        adjustedRate: fills_1.getTwoHopAdjustedRate(side, twoHopQuotes[0], inputAmount, ethToOutputRate, feeSchedule),
        quote: twoHopQuotes[0],
    });
    return best;
}
exports.getBestTwoHopQuote = getBestTwoHopQuote;
//# sourceMappingURL=multihop_utils.js.map