"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const constants_1 = require("./constants");
const rate_utils_1 = require("./rate_utils");
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
    return _.uniqBy(intermediateTokens, a => a.toLowerCase()).filter(token => token.toLowerCase() !== makerToken.toLowerCase() && token.toLowerCase() !== takerToken.toLowerCase());
}
exports.getIntermediateTokens = getIntermediateTokens;
/**
 * Returns the best two-hop quote and the fee-adjusted rate of that quote.
 */
function getBestTwoHopQuote(marketSideLiquidity, feeSchedule, exchangeProxyOverhead) {
    const { side, inputAmount, ethToOutputRate, twoHopQuotes } = marketSideLiquidity;
    // Ensure the expected data we require exists. In the case where all hops reverted
    // or there were no sources included that allowed for multi hop,
    // we can end up with empty, but not undefined, fill data
    const filteredQuotes = twoHopQuotes.filter(quote => quote &&
        quote.fillData &&
        quote.fillData.firstHopSource &&
        quote.fillData.secondHopSource &&
        quote.output.isGreaterThan(constants_1.ZERO_AMOUNT));
    if (filteredQuotes.length === 0) {
        return { quote: undefined, adjustedRate: constants_1.ZERO_AMOUNT };
    }
    const best = filteredQuotes
        .map(quote => rate_utils_1.getTwoHopAdjustedRate(side, quote, inputAmount, ethToOutputRate, feeSchedule, exchangeProxyOverhead))
        .reduce((prev, curr, i) => curr.isGreaterThan(prev.adjustedRate) ? { adjustedRate: curr, quote: filteredQuotes[i] } : prev, {
        adjustedRate: rate_utils_1.getTwoHopAdjustedRate(side, filteredQuotes[0], inputAmount, ethToOutputRate, feeSchedule, exchangeProxyOverhead),
        quote: filteredQuotes[0],
    });
    return best;
}
exports.getBestTwoHopQuote = getBestTwoHopQuote;
//# sourceMappingURL=multihop_utils.js.map