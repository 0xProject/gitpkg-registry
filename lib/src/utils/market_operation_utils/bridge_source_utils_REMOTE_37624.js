"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const constants_1 = require("./constants");
const types_1 = require("./types");
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
function getShellsForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.SHELL_POOLS_BY_CHAIN_ID[chainId])
        .filter(c => [makerToken, takerToken].every(t => c.tokens.includes(t)))
        .map(i => i.poolAddress);
}
exports.getShellsForPair = getShellsForPair;
// tslint:disable completed-docs
function getCurveInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.MAINNET_CURVE_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getCurveInfosForPair = getCurveInfosForPair;
function getSwerveInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.MAINNET_SWERVE_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getSwerveInfosForPair = getSwerveInfosForPair;
function getSnowSwapInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.MAINNET_SNOWSWAP_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getSnowSwapInfosForPair = getSnowSwapInfosForPair;
function uniswapV2LikeRouterAddress(chainId, source) {
    switch (source) {
        case types_1.ERC20BridgeSource.UniswapV2:
            return constants_1.UNISWAPV2_ROUTER_BY_CHAIN_ID[chainId];
        case types_1.ERC20BridgeSource.SushiSwap:
            return constants_1.SUSHISWAP_ROUTER_BY_CHAIN_ID[chainId];
        case types_1.ERC20BridgeSource.CryptoCom:
            return constants_1.CRYPTO_COM_ROUTER_BY_CHAIN_ID[chainId];
        case types_1.ERC20BridgeSource.PancakeSwap:
            return constants_1.PANCAKESWAP_ROUTER_BY_CHAIN_ID[chainId];
        case types_1.ERC20BridgeSource.BakerySwap:
            return constants_1.BAKERYSWAP_ROUTER_BY_CHAIN_ID[chainId];
        default:
            throw new Error(`Unknown UniswapV2 like source ${source}`);
    }
}
exports.uniswapV2LikeRouterAddress = uniswapV2LikeRouterAddress;
//# sourceMappingURL=bridge_source_utils_REMOTE_37624.js.map