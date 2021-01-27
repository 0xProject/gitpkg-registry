"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const types_1 = require("../types");
const types_2 = require("../utils/market_operation_utils/types");
/**
 * Compute the minimum buy token amount for market operations by inferring
 * the slippage from the orders in a quote. We cannot rely on
 * `worstCaseQuoteInfo.makerAmount` because that does not stop at
 * maximum slippage.
 */
function getSwapMinBuyAmount(quote) {
    // TODO jacob
    return quote.worstCaseQuoteInfo.makerAmount;
    // if (quote.type === MarketOperation.Buy || quote.isTwoHop) {
    //     return quote.worstCaseQuoteInfo.makerAmount;
    // }
    // let slipRatio = new BigNumber(1);
    // // Infer the allowed maker asset slippage from any non-native order.
    // for (const o of quote.orders) {
    //     if (o.fills.length === 0 || o.fills[0].source === ERC20BridgeSource.Native) {
    //         // No slippage on native orders.
    //         continue;
    //     }
    //     const totalFillmakerAmount = BigNumber.sum(...o.fills.map(f => f.output));
    //     slipRatio = o.makerAmount.div(totalFillmakerAmount);
    //     break;
    // }
    // if (slipRatio.gte(1)) {
    //     // No slippage allowed across all orders.
    //     return quote.bestCaseQuoteInfo.makerAmount;
    // }
    // return quote.bestCaseQuoteInfo.makerAmount.times(slipRatio).integerValue(BigNumber.ROUND_DOWN);
}
exports.getSwapMinBuyAmount = getSwapMinBuyAmount;
/**
 * Same as `getSwapMinBuyAmount` but operates
 * on a single quote info instead of using best and worst case
 * Orders must be derived from the same path as the quote info
 */
function getQuoteInfoMinBuyAmount(quoteInfo, orders, marketOperation) {
    if (marketOperation === types_1.MarketOperation.Buy) {
        return quoteInfo.makerAmount;
    }
    let slipRatio = new utils_1.BigNumber(1);
    // Infer the allowed maker asset slippage from any non-native order.
    for (const o of orders) {
        if (o.fills.length === 0 || o.fills[0].source === types_2.ERC20BridgeSource.Native) {
            // No slippage on native orders.
            continue;
        }
        const totalFillmakerAmount = utils_1.BigNumber.sum(...o.fills.map(f => f.output));
        slipRatio = o.makerAmount.div(totalFillmakerAmount);
        break;
    }
    if (slipRatio.gte(1)) {
        // No slippage allowed across all orders.
        return quoteInfo.makerAmount;
    }
    return quoteInfo.makerAmount.times(slipRatio).integerValue(utils_1.BigNumber.ROUND_DOWN);
}
exports.getQuoteInfoMinBuyAmount = getQuoteInfoMinBuyAmount;
//# sourceMappingURL=utils.js.map