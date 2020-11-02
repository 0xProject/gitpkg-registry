"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_schemas_1 = require("@0x/json-schemas");
const _ = require("lodash");
const assert_1 = require("./assert");
const utils_1 = require("./utils");
exports.sortingUtils = {
    sortOrders(orders) {
        assert_1.assert.doesConformToSchema('orders', orders, json_schemas_1.schemas.ordersSchema);
        assert_1.assert.isValidOrdersForSwapQuoter('orders', orders);
        const copiedOrders = _.cloneDeep(orders);
        copiedOrders.sort((firstOrder, secondOrder) => {
            const firstOrderRate = getTakerFeeAdjustedRateOfOrder(firstOrder);
            const secondOrderRate = getTakerFeeAdjustedRateOfOrder(secondOrder);
            return firstOrderRate.comparedTo(secondOrderRate);
        });
        return copiedOrders;
    },
};
function getTakerFeeAdjustedRateOfOrder(order) {
    const [adjustedMakerAssetAmount, adjustedTakerAssetAmount] = utils_1.getAdjustedMakerAndTakerAmountsFromTakerFees(order);
    const rate = adjustedTakerAssetAmount.div(adjustedMakerAssetAmount);
    return rate;
}
//# sourceMappingURL=sorting_utils.js.map