"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
// tslint:disable completed-docs
function getMultiBridgeIntermediateToken(takerToken, makerToken) {
    let intermediateToken = constants_1.NULL_ADDRESS;
    if (takerToken !== constants_1.TOKENS.WETH && makerToken !== constants_1.TOKENS.WETH) {
        intermediateToken = constants_1.TOKENS.WETH;
    }
    else if (takerToken === constants_1.TOKENS.USDC || makerToken === constants_1.TOKENS.USDC) {
        intermediateToken = constants_1.TOKENS.DAI;
    }
    return intermediateToken;
}
exports.getMultiBridgeIntermediateToken = getMultiBridgeIntermediateToken;
//# sourceMappingURL=multibridge_utils.js.map