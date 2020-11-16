"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.fillableAmountsUtils = {
    getTakerAssetAmountSwappedAfterOrderFees(order) {
        if (utils_1.isOrderTakerFeePayableWithTakerAsset(order)) {
            return order.fillableTakerAssetAmount.plus(order.fillableTakerFeeAmount);
        }
        else {
            return order.fillableTakerAssetAmount;
        }
    },
    getMakerAssetAmountSwappedAfterOrderFees(order) {
        if (utils_1.isOrderTakerFeePayableWithMakerAsset(order)) {
            return order.fillableMakerAssetAmount.minus(order.fillableTakerFeeAmount);
        }
        else {
            return order.fillableMakerAssetAmount;
        }
    },
};
//# sourceMappingURL=fillable_amounts_utils.js.map