"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const constants_1 = require("./constants");
/**
 * Filter Kyber reserves which should not be used (0xbb bridged reserves)
 * @param reserveId Kyber reserveId
 */
function isAllowedKyberReserveId(reserveId) {
    return reserveId !== utils_1.NULL_BYTES && !reserveId.startsWith(constants_1.KYBER_BRIDGED_LIQUIDITY_PREFIX);
}
exports.isAllowedKyberReserveId = isAllowedKyberReserveId;
/**
 * Returns the offsets to be used to discover Kyber reserves
 */
function getKyberOffsets() {
    return Array(constants_1.MAX_KYBER_RESERVES_QUERIED)
        .fill(0)
        .map((_v, i) => new utils_1.BigNumber(i));
}
exports.getKyberOffsets = getKyberOffsets;
//# sourceMappingURL=kyber_utils.js.map