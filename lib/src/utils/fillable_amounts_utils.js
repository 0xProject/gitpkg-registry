"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillableAmountsUtils = void 0;
var utils_1 = require("./utils");
exports.fillableAmountsUtils = {
    getTakerAssetAmountSwappedAfterOrderFees: function (order) {
        if (utils_1.isOrderTakerFeePayableWithTakerAsset(order)) {
            return order.fillableTakerAssetAmount.plus(order.fillableTakerFeeAmount);
        }
        else {
            return order.fillableTakerAssetAmount;
        }
    },
    getMakerAssetAmountSwappedAfterOrderFees: function (order) {
        if (utils_1.isOrderTakerFeePayableWithMakerAsset(order)) {
            return order.fillableMakerAssetAmount.minus(order.fillableTakerFeeAmount);
        }
        else {
            return order.fillableMakerAssetAmount;
        }
    },
};
//# sourceMappingURL=fillable_amounts_utils.js.map