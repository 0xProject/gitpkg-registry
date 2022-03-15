"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComparisonPrices = void 0;
const dev_utils_1 = require("@0x/dev-utils");
const utils_1 = require("@0x/utils");
const types_1 = require("../../types");
const constants_1 = require("./constants");
/**
 * Takes in an optimizer response and returns a price for RFQT MMs to beat
 * returns the price of the taker asset in terms of the maker asset
 * So the RFQT MM should aim for a higher price
 * @param adjustedRate the adjusted rate (accounting for fees) from the optimizer, maker/taker
 * @param amount the amount specified by the client
 * @param marketSideLiquidity the results from querying liquidity sources
 * @param feeSchedule the fee schedule passed to the Optimizer
 * @return ComparisonPrice object with the prices for RFQ MMs to beat
 */
function getComparisonPrices(adjustedRate, amount, marketSideLiquidity, gasPrice) {
    let wholeOrder;
    let feeInEth = gasPrice.times(100e3);
    const [inputAmountPerEth, outputAmountPerEth] = [
        marketSideLiquidity.tokenAmountPerEth[marketSideLiquidity.inputToken],
        marketSideLiquidity.tokenAmountPerEth[marketSideLiquidity.outputToken],
    ];
    // Calc native order fee penalty in output unit (maker units for sells, taker unit for buys)
    const feePenalty = !outputAmountPerEth.isZero()
        ? outputAmountPerEth.times(feeInEth)
        : // if it's a sell, the input token is the taker token
            inputAmountPerEth
                .times(feeInEth)
                .times(marketSideLiquidity.side === types_1.MarketOperation.Sell ? adjustedRate : adjustedRate.pow(-1));
    // the adjusted rate is defined as maker/taker
    // input is the taker token for sells, input is the maker token for buys
    const orderMakerAmount = marketSideLiquidity.side === types_1.MarketOperation.Sell ? adjustedRate.times(amount).plus(feePenalty) : amount;
    const orderTakerAmount = marketSideLiquidity.side === types_1.MarketOperation.Sell ? amount : amount.dividedBy(adjustedRate).minus(feePenalty);
    if (orderTakerAmount.gt(0) && orderMakerAmount.gt(0)) {
        const optimalMakerUnitAmount = dev_utils_1.Web3Wrapper.toUnitAmount(
        // round up maker amount -- err to giving more competitive price
        orderMakerAmount.integerValue(utils_1.BigNumber.ROUND_UP), marketSideLiquidity.makerTokenDecimals);
        const optimalTakerUnitAmount = dev_utils_1.Web3Wrapper.toUnitAmount(
        // round down taker amount -- err to giving more competitive price
        orderTakerAmount.integerValue(utils_1.BigNumber.ROUND_DOWN), marketSideLiquidity.takerTokenDecimals);
        wholeOrder = optimalMakerUnitAmount.div(optimalTakerUnitAmount).decimalPlaces(constants_1.COMPARISON_PRICE_DECIMALS);
    }
    return { wholeOrder };
}
exports.getComparisonPrices = getComparisonPrices;
//# sourceMappingURL=comparison_price.js.map