"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBadTokenForSource = exports.uniswapV2LikeRouterAddress = exports.getCurveLikeInfosForPair = exports.getShellLikeInfosForPair = exports.getSaddleInfosForPair = exports.getSmoothyInfosForPair = exports.getEllipsisInfosForPair = exports.getBeltInfosForPair = exports.getNerveInfosForPair = exports.getSnowSwapInfosForPair = exports.getSwerveInfosForPair = exports.getCurveInfosForPair = exports.getComponentForPair = exports.getShellsForPair = exports.getDodoV2Offsets = exports.getKyberOffsets = exports.isValidAddress = exports.isAllowedKyberReserveId = void 0;
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
// tslint:disable-next-line: completed-docs ban-types
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
function getComponentForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.COMPONENT_POOLS_BY_CHAIN_ID[chainId])
        .filter(c => [makerToken, takerToken].every(t => c.tokens.includes(t)))
        .map(i => i.poolAddress);
}
exports.getComponentForPair = getComponentForPair;
// tslint:disable completed-docs
function getCurveInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.CURVE_MAINNET_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getCurveInfosForPair = getCurveInfosForPair;
function getSwerveInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.SWERVE_MAINNET_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getSwerveInfosForPair = getSwerveInfosForPair;
function getSnowSwapInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.SNOWSWAP_MAINNET_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getSnowSwapInfosForPair = getSnowSwapInfosForPair;
function getNerveInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.BSC) {
        return [];
    }
    return Object.values(constants_1.NERVE_BSC_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getNerveInfosForPair = getNerveInfosForPair;
function getBeltInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.BSC) {
        return [];
    }
    return Object.values(constants_1.BELT_BSC_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getBeltInfosForPair = getBeltInfosForPair;
function getEllipsisInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.BSC) {
        return [];
    }
    return Object.values(constants_1.ELLIPSIS_BSC_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getEllipsisInfosForPair = getEllipsisInfosForPair;
function getSmoothyInfosForPair(chainId, takerToken, makerToken) {
    if (chainId === contract_addresses_1.ChainId.BSC) {
        return Object.values(constants_1.SMOOTHY_BSC_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
            (c.tokens.includes(t) &&
                c.metaToken !== undefined &&
                [makerToken, takerToken].includes(c.metaToken))));
    }
    else if (chainId === contract_addresses_1.ChainId.Mainnet) {
        return Object.values(constants_1.SMOOTHY_MAINNET_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
            (c.tokens.includes(t) &&
                c.metaToken !== undefined &&
                [makerToken, takerToken].includes(c.metaToken))));
    }
    else {
        return [];
    }
}
exports.getSmoothyInfosForPair = getSmoothyInfosForPair;
function getSaddleInfosForPair(chainId, takerToken, makerToken) {
    if (chainId !== contract_addresses_1.ChainId.Mainnet) {
        return [];
    }
    return Object.values(constants_1.SADDLE_MAINNET_INFOS).filter(c => [makerToken, takerToken].every(t => (c.tokens.includes(t) && c.metaToken === undefined) ||
        (c.tokens.includes(t) && c.metaToken !== undefined && [makerToken, takerToken].includes(c.metaToken))));
}
exports.getSaddleInfosForPair = getSaddleInfosForPair;
function getShellLikeInfosForPair(chainId, takerToken, makerToken, source) {
    switch (source) {
        case types_1.ERC20BridgeSource.Shell:
            return getShellsForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.Component:
            return getComponentForPair(chainId, takerToken, makerToken);
        default:
            throw new Error(`Unknown Shell like source ${source}`);
    }
}
exports.getShellLikeInfosForPair = getShellLikeInfosForPair;
function getCurveLikeInfosForPair(chainId, takerToken, makerToken, source) {
    switch (source) {
        case types_1.ERC20BridgeSource.Curve:
            return getCurveInfosForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.Swerve:
            return getSwerveInfosForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.SnowSwap:
            return getSnowSwapInfosForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.Nerve:
            return getNerveInfosForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.Belt:
            return getBeltInfosForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.Ellipsis:
            return getEllipsisInfosForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.Smoothy:
            return getSmoothyInfosForPair(chainId, takerToken, makerToken);
        case types_1.ERC20BridgeSource.Saddle:
            return getSaddleInfosForPair(chainId, takerToken, makerToken);
        default:
            throw new Error(`Unknown Curve like source ${source}`);
    }
}
exports.getCurveLikeInfosForPair = getCurveLikeInfosForPair;
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
        case types_1.ERC20BridgeSource.KyberDmm:
            return constants_1.KYBER_DMM_ROUTER_BY_CHAIN_ID[chainId];
        default:
            throw new Error(`Unknown UniswapV2 like source ${source}`);
    }
}
exports.uniswapV2LikeRouterAddress = uniswapV2LikeRouterAddress;
const BAD_TOKENS_BY_SOURCE = {
    [types_1.ERC20BridgeSource.Uniswap]: [
        '0xb8c77482e45f1f44de1745f52c74426c631bdd52', // BNB
    ],
};
function isBadTokenForSource(token, source) {
    return (BAD_TOKENS_BY_SOURCE[source] || []).includes(token.toLowerCase());
}
exports.isBadTokenForSource = isBadTokenForSource;
//# sourceMappingURL=bridge_source_utils.js.map