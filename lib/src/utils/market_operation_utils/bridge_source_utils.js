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
// tslint:disable-next-line: completed-docs
function isValidAddress(address) {
    return (typeof address === 'string' || address instanceof String) && address.toString() !== constants_1.NULL_ADDRESS;
}
exports.isValidAddress = isValidAddress;
/**
 * Returns the offsets to be used to discover Kyber reserves
 */
function getKyberOffsets() {
    return Array(constants_1.MAX_KYBER_RESERVES_QUERIED)
        .fill(0)
        .map((_v, i) => new utils_1.BigNumber(i));
}
exports.getKyberOffsets = getKyberOffsets;
// tslint:disable completed-docs
function getDodoV2Offsets() {
    return Array(constants_1.MAX_DODOV2_POOLS_QUERIED)
        .fill(0)
        .map((_v, i) => new utils_1.BigNumber(i));
}
exports.getDodoV2Offsets = getDodoV2Offsets;
// tslint:disable completed-docs
function getShellsForPair(takerToken, makerToken) {
    return Object.values(constants_1.SHELL_POOLS)
        .filter(c => [makerToken, takerToken].every(t => c.tokens.includes(t)))
        .map(i => i.poolAddress);
}
exports.getShellsForPair = getShellsForPair;
// tslint:disable completed-docs
function getCurveInfosForPair(takerToken, makerToken) {
    return Object.values(constants_1.MAINNET_CURVE_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getCurveInfosForPair = getCurveInfosForPair;
function getSwerveInfosForPair(takerToken, makerToken) {
    return Object.values(constants_1.MAINNET_SWERVE_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getSwerveInfosForPair = getSwerveInfosForPair;
function getSnowSwapInfosForPair(takerToken, makerToken) {
    return Object.values(constants_1.MAINNET_SNOWSWAP_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getSnowSwapInfosForPair = getSnowSwapInfosForPair;
//# sourceMappingURL=bridge_source_utils.js.map