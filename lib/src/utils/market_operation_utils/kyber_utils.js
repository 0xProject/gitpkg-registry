"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
// tslint:disable completed-docs
function getKyberReserveIdsForPair(takerToken, makerToken) {
    return [
        ...Object.values(constants_1.MAINNET_KYBER_RESERVE_IDS),
        constants_1.MAINNET_KYBER_TOKEN_RESERVE_IDS[makerToken.toLowerCase()],
        constants_1.MAINNET_KYBER_TOKEN_RESERVE_IDS[takerToken.toLowerCase()],
    ].filter(t => t);
}
exports.getKyberReserveIdsForPair = getKyberReserveIdsForPair;
//# sourceMappingURL=kyber_utils.js.map