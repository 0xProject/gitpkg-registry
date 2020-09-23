"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const types_1 = require("../types");
/**
 * Compute the mminimum buy token amount for market operations by inferring
 * the slippage from the orders in a quote. We cannot rely on
 * `worstCaseQuoteInfo.makerAssetAmount` because that does not stop at
 * maximum slippage.
 */
function getSwapMinBuyAmount(quote) {
    // Infer the allowed maker asset slippage from the orders.
    const totalOrderMakerAssetAmount = utils_1.BigNumber.sum(...quote.orders.map(o => o.makerAssetAmount));
    const totalFillMakerAssetAmount = quote.type === types_1.MarketOperation.Sell
        ? utils_1.BigNumber.sum(...quote.orders.map(o => utils_1.BigNumber.sum(0, ...o.fills.map(f => f.output))))
        : utils_1.BigNumber.sum(...quote.orders.map(o => utils_1.BigNumber.sum(0, ...o.fills.map(f => f.input))));
    if (quote.isTwoHop || totalFillMakerAssetAmount.eq(0)) {
        return quote.worstCaseQuoteInfo.makerAssetAmount;
    }
    if (totalOrderMakerAssetAmount.eq(totalFillMakerAssetAmount)) {
        // No slippage allowed on bought tokens.
        return quote.bestCaseQuoteInfo.makerAssetAmount;
    }
    const slipRatio = totalOrderMakerAssetAmount.div(totalFillMakerAssetAmount);
    return quote.bestCaseQuoteInfo.makerAssetAmount.times(slipRatio).integerValue(utils_1.BigNumber.ROUND_DOWN);
}
exports.getSwapMinBuyAmount = getSwapMinBuyAmount;
//# sourceMappingURL=utils.js.map