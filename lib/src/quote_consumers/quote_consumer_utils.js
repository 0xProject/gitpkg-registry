"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresTransformERC20 = exports.getFQTTransformerDataFromOptimizedOrders = exports.isBuyQuote = exports.isDirectSwapCompatible = exports.isMultiplexMultiHopFillCompatible = exports.isMultiplexBatchFillCompatible = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const types_1 = require("../types");
const orders_1 = require("../utils/market_operation_utils/orders");
const types_2 = require("../utils/market_operation_utils/types");
const MULTIPLEX_BATCH_FILL_SOURCES = [
    types_2.ERC20BridgeSource.UniswapV2,
    types_2.ERC20BridgeSource.SushiSwap,
    types_2.ERC20BridgeSource.LiquidityProvider,
    types_2.ERC20BridgeSource.Native,
    types_2.ERC20BridgeSource.UniswapV3,
];
/**
 * Returns true iff a quote can be filled via `MultiplexFeature.batchFill`.
 */
function isMultiplexBatchFillCompatible(quote, opts) {
    if (requiresTransformERC20(opts)) {
        return false;
    }
    // Must not be multi-hop.
    if (quote.hops.length > 1) {
        return false;
    }
    // Must not contain limit orders.
    const allOrderTypes = quote.hops.map(h => h.orders.map(o => o.type)).flat(2);
    if (allOrderTypes.includes(protocol_utils_1.FillQuoteTransformerOrderType.Limit)) {
        return false;
    }
    // Use Multiplex if the non-fallback sources are a subset of
    // {UniswapV2, Sushiswap, RFQ, PLP, UniswapV3}
    const nonFallbackSources = quote.hops.map(h => h.orders.filter(o => !o.isFallback).map(o => o.source)).flat(2);
    return nonFallbackSources.every(s => MULTIPLEX_BATCH_FILL_SOURCES.includes(s));
}
exports.isMultiplexBatchFillCompatible = isMultiplexBatchFillCompatible;
const MULTIPLEX_MULTIHOP_FILL_SOURCES = [
    types_2.ERC20BridgeSource.UniswapV2,
    types_2.ERC20BridgeSource.SushiSwap,
    types_2.ERC20BridgeSource.LiquidityProvider,
    types_2.ERC20BridgeSource.UniswapV3,
];
/**
 * Returns true iff a quote can be filled via `MultiplexFeature.multiHopFill`.
 */
function isMultiplexMultiHopFillCompatible(quote, opts) {
    if (requiresTransformERC20(opts)) {
        return false;
    }
    // Must be multi-hop.
    if (quote.hops.length < 2) {
        return false;
    }
    const sources = quote.hops.map(h => h.orders.map(o => o.source)).flat(2);
    return sources.every(s => MULTIPLEX_MULTIHOP_FILL_SOURCES.includes(s));
}
exports.isMultiplexMultiHopFillCompatible = isMultiplexMultiHopFillCompatible;
/**
 * Returns true iff a quote can be filled via a VIP feature.
 */
function isDirectSwapCompatible(quote, opts, directSources) {
    if (requiresTransformERC20(opts)) {
        return false;
    }
    // Must be a single hop with a single order.
    if (quote.hops.length !== 1 || quote.hops[0].orders.length !== 1) {
        return false;
    }
    const order = quote.hops[0].orders[0];
    if (!directSources.includes(order.source)) {
        return false;
    }
    return true;
}
exports.isDirectSwapCompatible = isDirectSwapCompatible;
/**
 * Whether a quote is a market buy or not.
 */
function isBuyQuote(quote) {
    return quote.type === types_1.MarketOperation.Buy;
}
exports.isBuyQuote = isBuyQuote;
function isBridgeOrder(x) {
    return x.type === protocol_utils_1.FillQuoteTransformerOrderType.Bridge;
}
// function isOptimizedLimitOrder(x: OptimizedMarketOrder): x is OptimizedMarketOrderBase<NativeLimitOrderFillData> {
//     return x.type === FillQuoteTransformerOrderType.Limit;
// }
//
// function isOptimizedRfqOrder(x: OptimizedMarketOrder): x is OptimizedMarketOrderBase<NativeRfqOrderFillData> {
//     return x.type === FillQuoteTransformerOrderType.Rfq;
// }
/**
 * Converts the given `OptimizedMarketOrder`s into bridge, limit, and RFQ orders for
 * FillQuoteTransformer.
 */
function getFQTTransformerDataFromOptimizedOrders(orders) {
    const fqtData = {
        bridgeOrders: [],
        limitOrders: [],
        rfqOrders: [],
        fillSequence: [],
    };
    for (const order of orders) {
        if (isBridgeOrder(order)) {
            fqtData.bridgeOrders.push({
                bridgeData: order.fillData.encodedFillData,
                makerTokenAmount: order.minMakerAmount,
                takerTokenAmount: order.maxTakerAmount,
                source: orders_1.getErc20BridgeSourceToBridgeSource(order.source),
            });
            // } else if (isOptimizedLimitOrder(order)) {
            //     fqtData.limitOrders.push({
            //         order: order.fillData.order,
            //         signature: order.fillData.signature,
            //         maxTakerTokenFillAmount: order.takerAmount,
            //     });
            // } else if (isOptimizedRfqOrder(order)) {
            //     fqtData.rfqOrders.push({
            //         order: order.fillData.order,
            //         signature: order.fillData.signature,
            //         maxTakerTokenFillAmount: order.takerAmount,
            //     });
        }
        else {
            // Should never happen
            throw new Error('Unknown Order type');
        }
        fqtData.fillSequence.push(order.type);
    }
    return fqtData;
}
exports.getFQTTransformerDataFromOptimizedOrders = getFQTTransformerDataFromOptimizedOrders;
/**
 * Returns true if swap quote must go through `tranformERC20`.
 */
function requiresTransformERC20(opts) {
    // Is a mtx.
    if (opts.isMetaTransaction) {
        return true;
    }
    // Has an affiliate fee.
    if (!opts.affiliateFee.buyTokenFeeAmount.eq(0) || !opts.affiliateFee.sellTokenFeeAmount.eq(0)) {
        return true;
    }
    // VIP does not support selling the entire balance
    if (opts.shouldSellEntireBalance) {
        return true;
    }
    return false;
}
exports.requiresTransformERC20 = requiresTransformERC20;
//# sourceMappingURL=quote_consumer_utils.js.map