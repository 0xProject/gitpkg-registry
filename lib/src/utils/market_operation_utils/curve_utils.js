"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
// tslint:disable completed-docs
function getCurveInfosForPair(takerToken, makerToken) {
    return Object.values(constants_1.MAINNET_CURVE_INFOS).filter(c => [makerToken, takerToken].every(t => c.tokens.includes(t)));
}
exports.getCurveInfosForPair = getCurveInfosForPair;
function getSwerveInfosForPair(takerToken, makerToken) {
    return Object.values(constants_1.MAINNET_SWERVE_INFOS).filter(c => [makerToken, takerToken].every(t => c.tokens.includes(t)));
}
exports.getSwerveInfosForPair = getSwerveInfosForPair;
//# sourceMappingURL=curve_utils.js.map