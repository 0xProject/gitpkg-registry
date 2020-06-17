"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
// tslint:disable completed-docs
exports.TOKENS = {
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
};
function getMultiBridgeIntermediateToken(takerToken, makerToken) {
    var intermediateToken = constants_1.NULL_ADDRESS;
    if (takerToken !== exports.TOKENS.WETH && makerToken !== exports.TOKENS.WETH) {
        intermediateToken = exports.TOKENS.WETH;
    }
    else if (takerToken === exports.TOKENS.USDC || makerToken === exports.TOKENS.USDC) {
        intermediateToken = exports.TOKENS.DAI;
    }
    return intermediateToken;
}
exports.getMultiBridgeIntermediateToken = getMultiBridgeIntermediateToken;
//# sourceMappingURL=multibridge_utils.js.map