"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
// tslint:disable completed-docs
function getCurveInfosForPair(takerToken, makerToken) {
    return Object.values(constants_1.MAINNET_CURVE_INFOS).filter(function (c) { return [makerToken, takerToken].every(function (t) { return c.tokens.includes(t); }); });
}
exports.getCurveInfosForPair = getCurveInfosForPair;
//# sourceMappingURL=curve_utils.js.map