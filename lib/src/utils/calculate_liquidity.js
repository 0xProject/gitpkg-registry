"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const utils_2 = require("./utils");
exports.calculateLiquidity = (prunedOrders) => {
    const liquidityInBigNumbers = prunedOrders.reduce((acc, order) => {
        const fillableMakerAssetAmount = utils_2.isOrderTakerFeePayableWithMakerAsset(order)
            ? order.fillableMakerAssetAmount.minus(order.fillableTakerFeeAmount)
            : order.fillableMakerAssetAmount;
        const fillableTakerAssetAmount = utils_2.isOrderTakerFeePayableWithTakerAsset(order)
            ? order.fillableTakerAssetAmount.plus(order.fillableTakerFeeAmount)
            : order.fillableTakerAssetAmount;
        return {
            makerAssetAvailableInBaseUnits: acc.makerAssetAvailableInBaseUnits.plus(fillableMakerAssetAmount),
            takerAssetAvailableInBaseUnits: acc.takerAssetAvailableInBaseUnits.plus(fillableTakerAssetAmount),
        };
    }, {
        makerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
        takerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
    });
    return liquidityInBigNumbers;
};
//# sourceMappingURL=calculate_liquidity.js.map