"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntermediateTokens = void 0;
const _ = require("lodash");
/**
 * Given a token pair, returns the intermediate tokens to consider for two-hop routes.
 */
function getIntermediateTokens(makerToken, takerToken, tokenAdjacencyGraph) {
    const intermediateTokens = _.union(_.get(tokenAdjacencyGraph, takerToken, tokenAdjacencyGraph.default), _.get(tokenAdjacencyGraph, makerToken, tokenAdjacencyGraph.default));
    return _.uniqBy(intermediateTokens, a => a.toLowerCase()).filter(token => token.toLowerCase() !== makerToken.toLowerCase() && token.toLowerCase() !== takerToken.toLowerCase());
}
exports.getIntermediateTokens = getIntermediateTokens;
//# sourceMappingURL=multihop_utils.js.map