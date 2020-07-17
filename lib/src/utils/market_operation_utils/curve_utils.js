"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurveAddressesForPair = void 0;
var constants_1 = require("./constants");
// tslint:disable completed-docs
function getCurveAddressesForPair(takerToken, makerToken) {
    return Object.keys(constants_1.MAINNET_CURVE_CONTRACTS).filter(function (a) {
        return [makerToken, takerToken].every(function (t) { return constants_1.MAINNET_CURVE_CONTRACTS[a].includes(t); });
    });
}
exports.getCurveAddressesForPair = getCurveAddressesForPair;
//# sourceMappingURL=curve_utils.js.map