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
const order_set_1 = require("./order_set");
class OrderStore {
    constructor() {
        // Both bids and asks are stored together in one set
        this._orders = new Map();
    }
    static getKeyForAssetPair(makerAssetData, takerAssetData) {
        return [makerAssetData, takerAssetData].sort().join('-');
    }
    static assetPairKeyToAssets(assetPairKey) {
        return assetPairKey.split('-');
    }
    getOrderSetForAssetsAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetPairKey = OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            return this.getOrderSetForAssetPairAsync(assetPairKey);
        });
    }
    getOrderSetForAssetPairAsync(assetPairKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderSet = this._orders.get(assetPairKey);
            if (!orderSet) {
                const newOrderSet = new order_set_1.OrderSet();
                this._orders.set(assetPairKey, newOrderSet);
                return newOrderSet;
            }
            return orderSet;
        });
    }
    getBatchOrderSetsForAssetsAsync(makerAssetDatas, takerAssetDatas) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderSets = [];
            for (const makerAssetData of makerAssetDatas) {
                for (const takerAssetData of takerAssetDatas) {
                    const orderSet = yield this.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
                    orderSets.push(orderSet);
                }
            }
            return orderSets;
        });
    }
    updateAsync(addedRemoved) {
        return __awaiter(this, void 0, void 0, function* () {
            const { added, removed, assetPairKey } = addedRemoved;
            const orders = yield this.getOrderSetForAssetPairAsync(assetPairKey);
            yield orders.addManyAsync(added);
            yield orders.deleteManyAsync(removed);
        });
    }
    hasAsync(assetPairKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orders.has(assetPairKey);
        });
    }
    valuesAsync(assetPairKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from((yield this.getOrderSetForAssetPairAsync(assetPairKey)).values());
        });
    }
    keysAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orders.keys();
        });
    }
}
exports.OrderStore = OrderStore;
//# sourceMappingURL=order_store.js.map