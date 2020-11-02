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
const utils_1 = require("@0x/utils");
const order_store_1 = require("../order_store");
const utils_2 = require("../utils");
const base_order_provider_1 = require("./base_order_provider");
class CustomOrderProvider extends base_order_provider_1.BaseOrderProvider {
    constructor(orders, orderStore) {
        super(orderStore);
        void this.addOrdersAsync(orders);
    }
    // tslint:disable-next-line:prefer-function-over-method
    createSubscriptionForAssetPairAsync(_makerAssetData, _takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Do nothing
        });
    }
    getAvailableAssetDatasAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const assetPairsItems = [];
            const minAmount = new utils_1.BigNumber(0);
            const maxAmount = new utils_1.BigNumber(2).pow(256).minus(1);
            const precision = base_order_provider_1.DEFAULT_TOKEN_PRECISION;
            for (const assetPairKey of yield this._orderStore.keysAsync()) {
                const [assetA, assetB] = order_store_1.OrderStore.assetPairKeyToAssets(assetPairKey);
                const assetDataA = { assetData: assetA, minAmount, maxAmount, precision };
                const assetDataB = { assetData: assetB, minAmount, maxAmount, precision };
                assetPairsItems.push({ assetDataA, assetDataB });
                assetPairsItems.push({ assetDataA: assetDataB, assetDataB: assetDataA });
            }
            return assetPairsItems;
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            // Do nothing
        });
    }
    addOrdersAsync(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const order of orders) {
                const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(order.makerAssetData, order.takerAssetData);
                yield this._orderStore.updateAsync({
                    added: [
                        {
                            order,
                            metaData: {
                                remainingFillableTakerAssetAmount: order.takerAssetAmount,
                                orderHash: utils_2.utils.getOrderHash(order),
                            },
                        },
                    ],
                    removed: [],
                    assetPairKey,
                });
            }
            return { accepted: orders, rejected: [] };
        });
    }
}
exports.CustomOrderProvider = CustomOrderProvider;
//# sourceMappingURL=custom_order_provider.js.map