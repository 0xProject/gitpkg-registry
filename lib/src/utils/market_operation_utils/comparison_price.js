"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_utils_1 = require("@0x/dev-utils");
const utils_1 = require("@0x/utils");
const types_1 = require("../../types");
const constants_1 = require("./constants");
/**
 * Takes in an optimizer response and returns a price for RFQT MMs to beat
 * returns the price of the taker asset in terms of the maker asset
 * So the RFQT MM should aim for a higher price
 * @param optimizerResult the output of the optimizer, contains the best orders
 * @param amount the amount specified by the client
 * @param marketSideLiquidity the results from querying liquidity sources
 * @return ComparisonPrice object with the prices for RFQ MMs to beat
 */
function getComparisonPrices(optimizerResult, amount, marketSideLiquidity) {
    // the adjusted rate is defined as maker/taker
    // input is the taker token for sells, input is the maker token for buys
    const makerTakerOptimalRate = optimizerResult.adjustedRate;
    const takerMakerOptimalRate = optimizerResult.adjustedRate.pow(-1);
    // fees for a native order
    const fees = optimizerResult.exchangeProxyOverhead(constants_1.SOURCE_FLAGS.Native);
    // Calc native order fee penalty in output unit (maker units for sells, taker unit for buys)
    const feePenalty = !marketSideLiquidity.ethToOutputRate.isZero()
        ? marketSideLiquidity.ethToOutputRate.times(fees)
        : // if it's a sell, the input token is the taker token
            marketSideLiquidity.ethToInputRate
                .times(fees)
                .times(marketSideLiquidity.side === types_1.MarketOperation.Sell ? makerTakerOptimalRate : takerMakerOptimalRate);
    let wholeOrder;
    let orderMakerAmount;
    let orderTakerAmount;
    if (marketSideLiquidity.side === types_1.MarketOperation.Sell) {
        orderTakerAmount = amount;
        orderMakerAmount = makerTakerOptimalRate.times(orderTakerAmount).plus(feePenalty);
    }
    else if (marketSideLiquidity.side === types_1.MarketOperation.Buy) {
        orderMakerAmount = amount;
        orderTakerAmount = takerMakerOptimalRate.times(orderMakerAmount).minus(feePenalty);
    }
    else {
        throw new Error(`Unexpected marketOperation ${marketSideLiquidity.side}`);
    }
    if (orderTakerAmount.gt(0)) {
        const optimalMakerUnitAmount = dev_utils_1.Web3Wrapper.toUnitAmount(
        // round up maker amount -- err to giving more competitive price
        orderMakerAmount.integerValue(utils_1.BigNumber.ROUND_UP), marketSideLiquidity.makerTokenDecimals);
        const optimalTakerUnitAmount = dev_utils_1.Web3Wrapper.toUnitAmount(
        // round down taker amount -- err to giving more competitive price
        orderTakerAmount.integerValue(utils_1.BigNumber.ROUND_DOWN), marketSideLiquidity.takerTokenDecimals);
        wholeOrder = optimalMakerUnitAmount.div(optimalTakerUnitAmount).decimalPlaces(constants_1.COMPARISON_PRICE_DECIMALS);
    }
    return {
        wholeOrder,
    };
}
exports.getComparisonPrices = getComparisonPrices;
//# sourceMappingURL=comparison_price.js.map