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
const assert_1 = require("@0x/assert");
const custom_order_provider_1 = require("./order_provider/custom_order_provider");
const mesh_order_provider_1 = require("./order_provider/mesh_order_provider");
const sra_polling_order_provider_1 = require("./order_provider/sra_polling_order_provider");
const sra_websocket_order_provider_1 = require("./order_provider/sra_websocket_order_provider");
const order_store_1 = require("./order_store");
class Orderbook {
    /**
     * Creates an Orderbook with the provided orders. This provider simply stores the
     * orders and allows querying. No validation or subscriptions occur.
     * @param orders the set of SignedOrders
     */
    static getOrderbookForProvidedOrders(orders) {
        const orderStore = new order_store_1.OrderStore();
        return new Orderbook(new custom_order_provider_1.CustomOrderProvider(orders, orderStore), orderStore);
    }
    /**
     * Creates an Orderbook with the SRA Websocket Provider. This Provider fetches orders via
     * the SRA http endpoint and then subscribes to the asset pair for future updates.
     * @param opts the `SRAWebsocketOrderProviderOpts`
     */
    static getOrderbookForWebsocketProvider(opts) {
        const orderStore = new order_store_1.OrderStore();
        return new Orderbook(new sra_websocket_order_provider_1.SRAWebsocketOrderProvider(opts, orderStore), orderStore);
    }
    /**
     * Creates an Orderbook with SRA Polling Provider. This Provider simply polls every interval.
     * @param opts the `SRAPollingOrderProviderOpts`
     */
    static getOrderbookForPollingProvider(opts) {
        const orderStore = new order_store_1.OrderStore();
        return new Orderbook(new sra_polling_order_provider_1.SRAPollingOrderProvider(opts, orderStore), orderStore);
    }
    /**
     * Creates an Orderbook with a Mesh Order Provider. This Provider fetches ALL orders
     * and subscribes to updates on ALL orders.
     * @param opts the `MeshOrderProviderOpts`
     */
    static getOrderbookForMeshProvider(opts) {
        const orderStore = new order_store_1.OrderStore();
        return new Orderbook(new mesh_order_provider_1.MeshOrderProvider(opts, orderStore), orderStore);
    }
    /**
     * Creates an Orderbook with the order provider. All order updates are stored
     * in the `OrderStore`.
     * @param orderProvider the order provider, e.g SRAWebbsocketOrderProvider
     * @param orderStore the order store where orders are added and deleted
     */
    constructor(orderProvider, orderStore) {
        this._orderProvider = orderProvider;
        this._orderStore = orderStore;
    }
    /**
     * Returns all orders where the order.makerAssetData == makerAssetData and
     * order.takerAssetData == takerAssetData. This pair is then subscribed to
     * and all future updates will be stored. The first request
     * to `getOrdersAsync` might fetch the orders from the Order Provider and create a subscription.
     * Subsequent requests will be quick and up to date and synced with the Order Provider state.
     * @param makerAssetData the maker asset data
     * @param takerAssetData the taker asset data
     */
    getOrdersAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('makerAssetData', makerAssetData);
            assert_1.assert.isString('takerAssetData', takerAssetData);
            const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            if (!(yield this._orderStore.hasAsync(assetPairKey))) {
                yield this._orderProvider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            }
            const orders = yield this._orderStore.valuesAsync(assetPairKey);
            return orders.filter(o => o.order.makerAssetData === makerAssetData && o.order.takerAssetData === takerAssetData);
        });
    }
    getBatchOrdersAsync(makerAssetDatas, takerAssetDatas) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [mi, makerAssetData] of makerAssetDatas.entries()) {
                for (const [ti, takerAssetData] of makerAssetDatas.entries()) {
                    assert_1.assert.isString(`makerAssetDatas[${mi}]`, makerAssetData);
                    assert_1.assert.isString(`takerAssetDatas[${ti}]`, takerAssetData);
                    const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
                    if (!(yield this._orderStore.hasAsync(assetPairKey))) {
                        yield this._orderProvider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
                    }
                }
            }
            const orderSets = yield this._orderStore.getBatchOrderSetsForAssetsAsync(makerAssetDatas, takerAssetDatas);
            return orderSets.map(orderSet => Array.from(orderSet.values()).filter(o => makerAssetDatas.includes(o.order.makerAssetData) &&
                takerAssetDatas.includes(o.order.takerAssetData)));
        });
    }
    /**
     * Returns all of the Available Asset Pairs for the provided Order Provider.
     */
    getAvailableAssetDatasAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orderProvider.getAvailableAssetDatasAsync();
        });
    }
    /**
     * Adds the orders to the Order Provider. All accepted orders will be returned
     * and rejected orders will be returned with an message indicating a reason for its rejection
     * @param orders The set of Orders to add to the Order Provider
     */
    addOrdersAsync(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orderProvider.addOrdersAsync(orders);
        });
    }
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._orderProvider.destroyAsync();
        });
    }
}
exports.Orderbook = Orderbook;
//# sourceMappingURL=orderbook.js.map