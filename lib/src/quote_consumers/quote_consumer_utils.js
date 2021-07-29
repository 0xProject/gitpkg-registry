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
    if (quote.isTwoHop) {
        return false;
    }
    // batchFill does not support WETH wrapping/unwrapping at the moment
    if (opts.isFromETH || opts.isToETH) {
        return false;
    }
    if (quote.orders.map(o => o.type).includes(protocol_utils_1.FillQuoteTransformerOrderType.Limit)) {
        return false;
    }
    // Use Multiplex if the non-fallback sources are a subset of
    // {UniswapV2, Sushiswap, RFQ, PLP, UniswapV3}
    const nonFallbackSources = Object.keys(quote.sourceBreakdown);
    return nonFallbackSources.every(source => MULTIPLEX_BATCH_FILL_SOURCES.includes(source));
}
exports.isMultiplexBatchFillCompatible = isMultiplexBatchFillCompatible;
const MULTIPLEX_MULTIHOP_FILL_SOURCES = [
    types_2.ERC20BridgeSource.UniswapV2,
    types_2.ERC20BridgeSource.SushiSwap,
    types_2.ERC20BridgeSource.LiquidityProvider,
];
/**
 * Returns true iff a quote can be filled via `MultiplexFeature.multiHopFill`.
 */
function isMultiplexMultiHopFillCompatible(quote, opts) {
    if (requiresTransformERC20(opts)) {
        return false;
    }
    if (!quote.isTwoHop) {
        return false;
    }
    const [firstHopOrder, secondHopOrder] = quote.orders;
    return (MULTIPLEX_MULTIHOP_FILL_SOURCES.includes(firstHopOrder.source) &&
        MULTIPLEX_MULTIHOP_FILL_SOURCES.includes(secondHopOrder.source));
}
exports.isMultiplexMultiHopFillCompatible = isMultiplexMultiHopFillCompatible;
/**
 * Returns true iff a quote can be filled via a VIP feature.
 */
function isDirectSwapCompatible(quote, opts, directSources) {
    if (requiresTransformERC20(opts)) {
        return false;
    }
    // Must be a single order.
    if (quote.orders.length !== 1) {
        return false;
    }
    const order = quote.orders[0];
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
function isOptimizedBridgeOrder(x) {
    return x.type === protocol_utils_1.FillQuoteTransformerOrderType.Bridge;
}
function isOptimizedLimitOrder(x) {
    return x.type === protocol_utils_1.FillQuoteTransformerOrderType.Limit;
}
function isOptimizedRfqOrder(x) {
    return x.type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq;
}
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
        if (isOptimizedBridgeOrder(order)) {
            fqtData.bridgeOrders.push({
                bridgeData: orders_1.createBridgeDataForBridgeOrder(order),
                makerTokenAmount: order.makerAmount,
                takerTokenAmount: order.takerAmount,
                source: orders_1.getErc20BridgeSourceToBridgeSource(order.source),
            });
        }
        else if (isOptimizedLimitOrder(order)) {
            console.log(`[DEBUG]`, order);
            fqtData.limitOrders.push({
                order: order.fillData.order,
                signature: order.fillData.signature,
                maxTakerTokenFillAmount: order.takerAmount,
            });
        }
        else if (isOptimizedRfqOrder(order)) {
            fqtData.rfqOrders.push({
                order: order.fillData.order,
                signature: order.fillData.signature,
                maxTakerTokenFillAmount: order.takerAmount,
            });
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