"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const constants_1 = require("../constants");
const constants_2 = require("./market_operation_utils/constants");
// tslint:disable: no-unnecessary-type-assertion completed-docs
function numberPercentageToEtherTokenAmountPercentage(percentage) {
    return web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(constants_1.constants.ONE_AMOUNT, constants_1.constants.ETHER_TOKEN_DECIMALS).multipliedBy(percentage);
}
exports.numberPercentageToEtherTokenAmountPercentage = numberPercentageToEtherTokenAmountPercentage;
function getAdjustedTakerAmountFromFees(order) {
    return order.takerAmount.plus(order.takerTokenFeeAmount);
}
exports.getAdjustedTakerAmountFromFees = getAdjustedTakerAmountFromFees;
/**
 * Given an amount of taker asset, calculate the the amount of maker asset
 * @param order The order
 * @param makerFillAmount the amount of taker asset
 */
function getNativeAdjustedMakerFillAmount(order, takerFillAmount) {
    // Round down because exchange rate favors Maker
    const makerFillAmount = takerFillAmount
        .multipliedBy(order.makerAmount)
        .div(order.takerAmount)
        .integerValue(utils_1.BigNumber.ROUND_FLOOR);
    return makerFillAmount;
}
exports.getNativeAdjustedMakerFillAmount = getNativeAdjustedMakerFillAmount;
/**
 * Given an amount of maker asset, calculate the equivalent amount in taker asset
 * @param order The order
 * @param makerFillAmount the amount of maker asset
 */
function getNativeAdjustedTakerFillAmount(order, makerFillAmount) {
    // Round up because exchange rate favors Maker
    const takerFillAmount = makerFillAmount
        .multipliedBy(order.takerAmount)
        .div(order.makerAmount)
        .integerValue(utils_1.BigNumber.ROUND_CEIL);
    return takerFillAmount;
}
exports.getNativeAdjustedTakerFillAmount = getNativeAdjustedTakerFillAmount;
/**
 * Given an amount of taker asset, calculate the fee amount required for the taker
 * @param order The order
 * @param takerFillAmount the amount of taker asset
 */
function getNativeAdjustedTakerFeeAmount(order, takerFillAmount) {
    // Round down because Taker fee rate favors Taker
    const takerFeeAmount = takerFillAmount
        .multipliedBy(order.takerTokenFeeAmount)
        .div(order.takerAmount)
        .integerValue(utils_1.BigNumber.ROUND_FLOOR);
    return takerFeeAmount;
}
exports.getNativeAdjustedTakerFeeAmount = getNativeAdjustedTakerFeeAmount;
const EMPTY_FILLABLE_AMOUNTS = {
    fillableMakerAmount: constants_2.ZERO_AMOUNT,
    fillableTakerAmount: constants_2.ZERO_AMOUNT,
    fillableTakerFeeAmount: constants_2.ZERO_AMOUNT,
};
function getNativeAdjustedFillableAmountsFromTakerAmount(order, takerFillableAmount) {
    if (takerFillableAmount.isZero()) {
        return EMPTY_FILLABLE_AMOUNTS;
    }
    return {
        fillableTakerAmount: takerFillableAmount,
        fillableMakerAmount: getNativeAdjustedMakerFillAmount(order.order, takerFillableAmount),
        fillableTakerFeeAmount: order.type === protocol_utils_1.FillQuoteTransformerOrderType.Limit
            ? getNativeAdjustedTakerFeeAmount(order.order, takerFillableAmount)
            : constants_2.ZERO_AMOUNT,
    };
}
exports.getNativeAdjustedFillableAmountsFromTakerAmount = getNativeAdjustedFillableAmountsFromTakerAmount;
function getNativeAdjustedFillableAmountsFromMakerAmount(order, makerFillableAmount) {
    if (makerFillableAmount.isZero()) {
        return EMPTY_FILLABLE_AMOUNTS;
    }
    const takerFillableAmount = getNativeAdjustedTakerFillAmount(order.order, makerFillableAmount);
    return {
        fillableMakerAmount: makerFillableAmount,
        fillableTakerAmount: takerFillableAmount,
        fillableTakerFeeAmount: order.type === protocol_utils_1.FillQuoteTransformerOrderType.Limit
            ? getNativeAdjustedTakerFeeAmount(order.order, takerFillableAmount)
            : constants_2.ZERO_AMOUNT,
    };
}
exports.getNativeAdjustedFillableAmountsFromMakerAmount = getNativeAdjustedFillableAmountsFromMakerAmount;
//# sourceMappingURL=utils.js.map