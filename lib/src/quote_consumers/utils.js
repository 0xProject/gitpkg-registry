"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const types_1 = require("../types");
const types_2 = require("../utils/market_operation_utils/types");
const constants_1 = require("../constants");
const { ZERO_AMOUNT } = constants_1.constants;
/**
 * Compute the mminimum buy token amount for market operations by inferring
 * the slippage from the orders in a quote. We cannot rely on
 * `worstCaseQuoteInfo.makerAssetAmount` because that does not stop at
 * maximum slippage.
 */
function getSwapMinBuyAmount(quote) {
    if (quote.type === types_1.MarketOperation.Buy || quote.isTwoHop) {
        return quote.worstCaseQuoteInfo.makerAssetAmount;
    }
    // Infer the allowed maker asset slippage from the orders.
    const totalOrderMakerAssetAmount = utils_1.BigNumber.sum(...quote.orders.map(o => o.fillableMakerAssetAmount));
    let totalFillMakerAssetAmount = ZERO_AMOUNT;
    for (const o of quote.orders) {
        if (o.fills.length === 0 || o.fills[0].source === types_2.ERC20BridgeSource.Native) {
            // No slippage on natuve orders.
            totalFillMakerAssetAmount = totalFillMakerAssetAmount.plus(o.fillableMakerAssetAmount);
        }
        else {
            totalFillMakerAssetAmount = totalFillMakerAssetAmount.plus(utils_1.BigNumber.sum(...o.fills.map(f => f.output)));
        }
    }
    if (totalOrderMakerAssetAmount.eq(totalFillMakerAssetAmount)) {
        // No slippage allowed across all orders.
        return quote.bestCaseQuoteInfo.makerAssetAmount;
    }
    const slipRatio = totalOrderMakerAssetAmount.div(totalFillMakerAssetAmount);
    return quote.bestCaseQuoteInfo.makerAssetAmount.times(slipRatio).integerValue(utils_1.BigNumber.ROUND_DOWN);
}
exports.getSwapMinBuyAmount = getSwapMinBuyAmount;
//# sourceMappingURL=utils.js.map