"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNativeOptimizedOrder = exports.getMakerTakerTokens = exports.createBridgeOrder = exports.getErc20BridgeSourceToBridgeSource = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const types_1 = require("../../types");
const types_2 = require("./types");
// tslint:disable completed-docs
function getErc20BridgeSourceToBridgeSource(source) {
    switch (source) {
        case types_2.ERC20BridgeSource.Balancer:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Balancer, 'Balancer');
        case types_2.ERC20BridgeSource.BalancerV2:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.BalancerV2, 'BalancerV2');
        case types_2.ERC20BridgeSource.Bancor:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Bancor, 'Bancor');
        // case ERC20BridgeSource.CoFiX:
        //    return encodeBridgeSourceId(BridgeProtocol.CoFiX, 'CoFiX');
        case types_2.ERC20BridgeSource.Curve:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'Curve');
        case types_2.ERC20BridgeSource.Cream:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Balancer, 'Cream');
        case types_2.ERC20BridgeSource.CryptoCom:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.CryptoCom, 'CryptoCom');
        case types_2.ERC20BridgeSource.Dodo:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Dodo, 'Dodo');
        case types_2.ERC20BridgeSource.Kyber:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Kyber, 'Kyber');
        case types_2.ERC20BridgeSource.LiquidityProvider:
            // "LiquidityProvider" is too long to encode (17 characters).
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Unknown, 'LP');
        case types_2.ERC20BridgeSource.MakerPsm:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.MakerPsm, 'MakerPsm');
        case types_2.ERC20BridgeSource.Mooniswap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Mooniswap, 'Mooniswap');
        case types_2.ERC20BridgeSource.MStable:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.MStable, 'MStable');
        case types_2.ERC20BridgeSource.Eth2Dai:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Oasis, 'Eth2Dai');
        case types_2.ERC20BridgeSource.Shell:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Shell, 'Shell');
        case types_2.ERC20BridgeSource.SnowSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'SnowSwap');
        case types_2.ERC20BridgeSource.SushiSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'SushiSwap');
        case types_2.ERC20BridgeSource.Swerve:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'Swerve');
        case types_2.ERC20BridgeSource.Uniswap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Uniswap, 'Uniswap');
        case types_2.ERC20BridgeSource.UniswapV2:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'UniswapV2');
        case types_2.ERC20BridgeSource.DodoV2:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.DodoV2, 'DodoV2');
        case types_2.ERC20BridgeSource.Linkswap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'Linkswap');
        case types_2.ERC20BridgeSource.PancakeSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'PancakeSwap');
        case types_2.ERC20BridgeSource.PancakeSwapV2:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'PancakeSwapV2');
        case types_2.ERC20BridgeSource.BakerySwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'BakerySwap');
        case types_2.ERC20BridgeSource.Nerve:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Nerve, 'Nerve');
        case types_2.ERC20BridgeSource.Synapse:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Nerve, 'Synapse');
        case types_2.ERC20BridgeSource.Belt:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'Belt');
        case types_2.ERC20BridgeSource.Ellipsis:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'Ellipsis');
        case types_2.ERC20BridgeSource.Component:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Shell, 'Component');
        case types_2.ERC20BridgeSource.Smoothy:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'Smoothy');
        case types_2.ERC20BridgeSource.Saddle:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Nerve, 'Saddle');
        case types_2.ERC20BridgeSource.XSigma:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'xSigma');
        case types_2.ERC20BridgeSource.ApeSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'ApeSwap');
        case types_2.ERC20BridgeSource.CafeSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'CafeSwap');
        case types_2.ERC20BridgeSource.CheeseSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'CheeseSwap');
        case types_2.ERC20BridgeSource.JulSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'JulSwap');
        case types_2.ERC20BridgeSource.UniswapV3:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV3, 'UniswapV3');
        case types_2.ERC20BridgeSource.KyberDmm:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.KyberDmm, 'KyberDmm');
        case types_2.ERC20BridgeSource.QuickSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'QuickSwap');
        case types_2.ERC20BridgeSource.ComethSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'ComethSwap');
        case types_2.ERC20BridgeSource.Dfyn:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'Dfyn');
        case types_2.ERC20BridgeSource.CurveV2:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.CurveV2, 'CurveV2');
        case types_2.ERC20BridgeSource.WaultSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'WaultSwap');
        case types_2.ERC20BridgeSource.Polydex:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'Polydex');
        case types_2.ERC20BridgeSource.FirebirdOneSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Nerve, 'FirebirdOneSwap');
        case types_2.ERC20BridgeSource.Lido:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Lido, 'Lido');
        case types_2.ERC20BridgeSource.ShibaSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'ShibaSwap');
        case types_2.ERC20BridgeSource.JetSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'JetSwap');
        case types_2.ERC20BridgeSource.IronSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Nerve, 'IronSwap');
        case types_2.ERC20BridgeSource.ACryptos:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Curve, 'ACryptoS');
        case types_2.ERC20BridgeSource.Pangolin:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'Pangolin');
        case types_2.ERC20BridgeSource.TraderJoe:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'TraderJoe');
        case types_2.ERC20BridgeSource.UbeSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'UbeSwap');
        case types_2.ERC20BridgeSource.Beethovenx:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.BalancerV2, 'Beethovenx');
        case types_2.ERC20BridgeSource.SpiritSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'SpiritSwap');
        case types_2.ERC20BridgeSource.SpookySwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'SpookySwap');
        case types_2.ERC20BridgeSource.MorpheusSwap:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.UniswapV2, 'MorpheusSwap');
        case types_2.ERC20BridgeSource.AaveV2:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.AaveV2, 'AaveV2');
        case types_2.ERC20BridgeSource.Compound:
            return protocol_utils_1.encodeBridgeSourceId(protocol_utils_1.BridgeProtocol.Compound, 'Compound');
        default:
            throw new Error(types_2.AggregationError.NoBridgeForSource);
    }
}
exports.getErc20BridgeSourceToBridgeSource = getErc20BridgeSourceToBridgeSource;
function createBridgeOrder(fill, inputToken, outputToken) {
    return Object.assign({ inputToken,
        outputToken, inputAmount: fill.input, outputAmount: fill.output, fillData: fill.data, source: fill.source, sourcePathId: fill.sourcePathId, type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge, fills: [fill], gasCost: fill.gasCost, isFallback: fill.isFallback }, (fill.metadata !== undefined ? { metadata: fill.metadata } : {}));
}
exports.createBridgeOrder = createBridgeOrder;
function getMakerTakerTokens(side, inputToken, outputToken) {
    const makerToken = side === types_1.MarketOperation.Sell ? outputToken : inputToken;
    const takerToken = side === types_1.MarketOperation.Sell ? inputToken : outputToken;
    return [makerToken, takerToken];
}
exports.getMakerTakerTokens = getMakerTakerTokens;
function createNativeOptimizedOrder(fill, side) {
    throw new Error(`No implementado`);
    // const fillData = fill.fillData;
    // const [makerAmount, takerAmount] = getFillTokenAmounts(fill, side);
    // const base = {
    //     type: fill.type,
    //     source: ERC20BridgeSource.Native,
    //     makerToken: fillData.order.makerToken,
    //     takerToken: fillData.order.takerToken,
    //     makerAmount,
    //     takerAmount,
    //     fills: [fill],
    //     fillData,
    // };
    // return fill.type === FillQuoteTransformerOrderType.Rfq
    //     ? { ...base, type: FillQuoteTransformerOrderType.Rfq, fillData: fillData as NativeRfqOrderFillData }
    //     : { ...base, type: FillQuoteTransformerOrderType.Limit, fillData: fillData as NativeLimitOrderFillData };
}
exports.createNativeOptimizedOrder = createNativeOptimizedOrder;
//# sourceMappingURL=orders.js.map