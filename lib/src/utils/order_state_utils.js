"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_utils_1 = require("@0x/order-utils");
const types_1 = require("@0x/types");
const constants_1 = require("../constants");
/**
 * Utility class to retrieve order state if needed outside of using the ERC20BridgeSampler
 */
class OrderStateUtils {
    constructor(devUtils) {
        this._devUtils = devUtils;
    }
    getSignedOrdersWithFillableAmountsAsync(signedOrders) {
        return __awaiter(this, void 0, void 0, function* () {
            const signatures = signedOrders.map(o => o.signature);
            const [ordersInfo, fillableTakerAssetAmounts, isValidSignatures] = yield this._devUtils
                .getOrderRelevantStates(signedOrders, signatures)
                .callAsync();
            const ordersOnChainMetadata = ordersInfo.map((orderInfo, index) => {
                return Object.assign({}, orderInfo, { fillableTakerAssetAmount: fillableTakerAssetAmounts[index], isValidSignature: isValidSignatures[index] });
            });
            // take orders + on chain information and find the valid orders and fillable makerAsset or takerAsset amounts
            return signedOrders.map((order, index) => {
                const orderMetadata = ordersOnChainMetadata[index];
                const fillableTakerAssetAmount = orderMetadata.isValidSignature && orderMetadata.orderStatus === types_1.OrderStatus.Fillable
                    ? orderMetadata.fillableTakerAssetAmount
                    : constants_1.constants.ZERO_AMOUNT;
                return Object.assign({}, order, { fillableTakerAssetAmount, fillableMakerAssetAmount: order_utils_1.orderCalculationUtils.getMakerFillAmount(order, fillableTakerAssetAmount), fillableTakerFeeAmount: order_utils_1.orderCalculationUtils.getTakerFeeAmount(order, fillableTakerAssetAmount) });
            });
        });
    }
}
exports.OrderStateUtils = OrderStateUtils;
//# sourceMappingURL=order_state_utils.js.map