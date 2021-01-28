"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_wrapper_1 = require("@0x/web3-wrapper");
const constants_1 = require("../constants");
// tslint:disable: no-unnecessary-type-assertion completed-docs
/**
 * Returns 2 flags (one for firm quotes and another for indicative quotes) that serve as rollout flags for the price-aware RFQ feature.
 * By default, indicative quotes should *always* go through the new price-aware flow. This means that all indicative RFQ requests made to
 * market makers will contain the new price-aware `suggestedPrice` field.
 * The `isPriceAwareRFQEnabled` feature object that is passed in by the 0x API will then control whether firm quotes go through price-aware RFQ.
 *
 * @param isPriceAwareRFQEnabled the feature flag that is passed in by the 0x API.
 */
function getPriceAwareRFQRolloutFlags(priceAwareRFQFlags) {
    return priceAwareRFQFlags !== undefined
        ? priceAwareRFQFlags
        : {
            isFirmPriceAwareEnabled: false,
            isIndicativePriceAwareEnabled: false,
        };
}
exports.getPriceAwareRFQRolloutFlags = getPriceAwareRFQRolloutFlags;
function numberPercentageToEtherTokenAmountPercentage(percentage) {
    return web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(constants_1.constants.ONE_AMOUNT, constants_1.constants.ETHER_TOKEN_DECIMALS).multipliedBy(percentage);
}
exports.numberPercentageToEtherTokenAmountPercentage = numberPercentageToEtherTokenAmountPercentage;
function getAdjustedTakerAmountFromFees(order) {
    return order.takerAmount.plus(order.takerTokenFeeAmount);
}
exports.getAdjustedTakerAmountFromFees = getAdjustedTakerAmountFromFees;
//# sourceMappingURL=utils.js.map