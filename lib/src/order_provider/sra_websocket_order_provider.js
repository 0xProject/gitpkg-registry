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
const connect_1 = require("@0x/connect");
const utils_1 = require("@0x/utils");
const order_set_1 = require("../order_set");
const order_store_1 = require("../order_store");
const utils_2 = require("../utils");
const base_sra_order_provider_1 = require("./base_sra_order_provider");
class SRAWebsocketOrderProvider extends base_sra_order_provider_1.BaseSRAOrderProvider {
    /**
     * Instantiates a HTTP and WS [Standard Relayer API](https://github.com/0xProject/standard-relayer-api) Order Provider
     * @param opts `SRAWebsocketOrderProviderOpts` containing the websocketEndpoint and the httpEndpoint to an SRA backend.
     * @param orderStore The `OrderStore` where orders are added and removed from
     */
    constructor(opts, orderStore) {
        super(orderStore, opts.httpEndpoint, base_sra_order_provider_1.PER_PAGE_DEFAULT);
        this._wsSubscriptions = new Map();
        this._isDestroyed = false;
        this._isConnecting = false;
        assert_1.assert.isUri('websocketEndpoint', opts.websocketEndpoint);
        this._websocketEndpoint = opts.websocketEndpoint;
    }
    /**
     * Creates a websocket subscription and fetches the current orders from SRA. If a websocket
     * connection already exists this function is a noop.
     * @param makerAssetData the Maker Asset Data
     * @param takerAssetData the Taker Asset Data
     */
    createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we've previously been destroyed then reset
            this._isDestroyed = false;
            const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            if (this._wsSubscriptions.has(assetPairKey)) {
                return;
            }
            return this._fetchAndCreateSubscriptionAsync(makerAssetData, takerAssetData);
        });
    }
    /**
     * Destroys the order provider, removing any subscriptions
     */
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isDestroyed = true;
            this._wsSubscriptions.clear();
            if (this._ordersChannel) {
                this._ordersChannel.close();
                this._ordersChannel = undefined;
            }
        });
    }
    /**
     * Creates a websocket subscription. If the inital websocket connnection
     * does not exist, it is created.
     * @param makerAssetData the Maker Asset Data
     * @param takerAssetData the Taker Asset Data
     */
    _createWebsocketSubscriptionAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prevent creating multiple channels
            while (this._isConnecting && !this._ordersChannel) {
                yield utils_2.utils.delayAsync(100);
            }
            if (!this._ordersChannel) {
                this._isConnecting = true;
                try {
                    this._ordersChannel = yield this._createOrdersChannelAsync();
                }
                finally {
                    this._isConnecting = false;
                }
            }
            const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            const subscriptionOpts = {
                makerAssetData,
                takerAssetData,
            };
            this._wsSubscriptions.set(assetPairKey, subscriptionOpts);
            // Subscribe to both sides of the book
            this._ordersChannel.subscribe(subscriptionOpts);
            this._ordersChannel.subscribe(Object.assign({}, subscriptionOpts, { makerAssetData: takerAssetData, takerAssetData: makerAssetData }));
        });
    }
    _fetchAndCreateSubscriptionAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the subscription first to get any updates while waiting for the request
            yield this._createWebsocketSubscriptionAsync(makerAssetData, takerAssetData);
            // first time we have had this request, preload the local storage
            const orders = yield this._fetchLatestOrdersAsync(makerAssetData, takerAssetData);
            const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            const currentOrders = yield this._orderStore.getOrderSetForAssetPairAsync(assetPairKey);
            const newOrders = new order_set_1.OrderSet();
            yield newOrders.addManyAsync(orders);
            const diff = yield currentOrders.diffAsync(newOrders);
            yield this._updateStoreAsync({
                added: diff.added,
                removed: diff.removed,
                assetPairKey,
            });
        });
    }
    _syncOrdersInOrderStoreAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const assetPairKey of yield this._orderStore.keysAsync()) {
                const [assetDataA, assetDataB] = order_store_1.OrderStore.assetPairKeyToAssets(assetPairKey);
                yield this._fetchAndCreateSubscriptionAsync(assetDataA, assetDataB);
            }
        });
    }
    /**
     * Creates a new websocket orders channel.
     */
    _createOrdersChannelAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersChannelHandler = {
                onUpdate: (_channel, _opts, apiOrders) => __awaiter(this, void 0, void 0, function* () { return this._handleOrderUpdatesAsync(apiOrders); }),
                // tslint:disable-next-line:no-empty
                onError: (_channel, _err) => { },
                onClose: () => __awaiter(this, void 0, void 0, function* () {
                    // Do not reconnect if destroyed
                    if (this._isDestroyed) {
                        return;
                    }
                    // Re-sync and create subscriptions
                    yield utils_2.utils.attemptAsync(() => __awaiter(this, void 0, void 0, function* () {
                        this._ordersChannel = undefined;
                        yield this._syncOrdersInOrderStoreAsync();
                        return true;
                    }));
                }),
            };
            try {
                return yield connect_1.ordersChannelFactory.createWebSocketOrdersChannelAsync(this._websocketEndpoint, ordersChannelHandler);
            }
            catch (e) {
                throw new Error(`Creating websocket connection to ${this._websocketEndpoint}`);
            }
        });
    }
    /**
     * Handles updates from the websocket, adding new orders and removing orders
     * which have remainingFillableTakerAssetAmount as 0.
     * @param orders the set of API Orders returned from the websocket channel
     */
    _handleOrderUpdatesAsync(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedRemovedByKey = {};
            for (const order of orders) {
                const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(order.order.makerAssetData, order.order.takerAssetData);
                if (!addedRemovedByKey[assetPairKey]) {
                    addedRemovedByKey[assetPairKey] = { added: [], removed: [], assetPairKey };
                }
                const addedRemoved = addedRemovedByKey[assetPairKey];
                // If we have the metadata informing us that the order cannot be filled for any amount we don't add it
                const remainingFillableTakerAssetAmount = order.metaData.remainingFillableTakerAssetAmount;
                if (remainingFillableTakerAssetAmount && new utils_1.BigNumber(remainingFillableTakerAssetAmount).eq(0)) {
                    addedRemoved.removed.push(order);
                }
                else {
                    addedRemoved.added.push(order);
                }
            }
            for (const assetPairKey of Object.keys(addedRemovedByKey)) {
                yield this._updateStoreAsync(addedRemovedByKey[assetPairKey]);
            }
        });
    }
}
exports.SRAWebsocketOrderProvider = SRAWebsocketOrderProvider;
//# sourceMappingURL=sra_websocket_order_provider.js.map