"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeistInfoForPair = void 0;
const constants_1 = require("./constants");
const gTokenToUnderlyingToken = new Map([
    [constants_1.FANTOM_TOKENS.gFTM, constants_1.FANTOM_TOKENS.WFTM],
    [constants_1.FANTOM_TOKENS.gfUSDT, constants_1.FANTOM_TOKENS.fUSDT],
    [constants_1.FANTOM_TOKENS.gDAI, constants_1.FANTOM_TOKENS.DAI],
    [constants_1.FANTOM_TOKENS.gUSDC, constants_1.FANTOM_TOKENS.USDC],
    [constants_1.FANTOM_TOKENS.gETH, constants_1.FANTOM_TOKENS.WETH],
    [constants_1.FANTOM_TOKENS.gWBTC, constants_1.FANTOM_TOKENS.WBTC],
    [constants_1.FANTOM_TOKENS.gCRV, constants_1.FANTOM_TOKENS.WCRV],
    [constants_1.FANTOM_TOKENS.gMIM, constants_1.FANTOM_TOKENS.MIM],
]);
/**
 * Returns GeistInfo for a certain pair if that pair exists on Geist
 */
function getGeistInfoForPair(takerToken, makerToken) {
    let gToken;
    let underlyingToken;
    if (gTokenToUnderlyingToken.get(takerToken) === makerToken) {
        gToken = takerToken;
        underlyingToken = makerToken;
    }
    else if (gTokenToUnderlyingToken.get(makerToken) === takerToken) {
        gToken = makerToken;
        underlyingToken = takerToken;
    }
    else {
        return undefined;
    }
    return {
        lendingPool: constants_1.GEIST_FANTOM_POOLS.lendingPool,
        gToken,
        underlyingToken,
    };
}
exports.getGeistInfoForPair = getGeistInfoForPair;
//# sourceMappingURL=geist_utils.js.map