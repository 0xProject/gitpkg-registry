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
const utils_1 = require("@0x/utils");
const order_set_1 = require("../order_set");
const order_store_1 = require("../order_store");
const base_sra_order_provider_1 = require("./base_sra_order_provider");
class SRAPollingOrderProvider extends base_sra_order_provider_1.BaseSRAOrderProvider {
    /**
     * Instantiates a HTTP [Standard Relayer API](https://github.com/0xProject/standard-relayer-api)
     * Polling Order Provider
     * @param opts `SRAPollingOrderProviderOpts` containing the httpEndpoint to an SRA backend and polling options
     * @param orderStore The `OrderStore` where orders are added and removed from
     */
    constructor(opts, orderStore) {
        super(orderStore, opts.httpEndpoint, opts.perPage);
        this._assetPairKeyToPollingIntervalId = new Map();
        assert_1.assert.isNumber('pollingIntervalMs', opts.pollingIntervalMs);
        this._pollingIntervalMs = opts.pollingIntervalMs;
    }
    /**
     * Creates a http polling subscription and fetches the current orders from SRA.
     * @param makerAssetData the maker asset Data
     * @param takerAssetData the taker asset Data
     */
    createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            // Do nothing if we already have a polling interval or websocket created for this asset pair
            if (this._assetPairKeyToPollingIntervalId.has(assetPairKey)) {
                return;
            }
            yield this._fetchAndCreatePollingAsync(makerAssetData, takerAssetData);
        });
    }
    /**
     * Destroys the order provider, removing any subscriptions
     */
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [assetPairKey, id] of this._assetPairKeyToPollingIntervalId) {
                clearInterval(id);
                this._assetPairKeyToPollingIntervalId.delete(assetPairKey);
            }
        });
    }
    /**
     * Fetches all of the orders for both sides of the orderbook and stores them. A polling subscription
     * is created performing this action every pollingIntervalMs
     */
    _fetchAndCreatePollingAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            // first time we have had this request, preload the local storage
            const orders = yield this._fetchLatestOrdersAsync(makerAssetData, takerAssetData);
            // Set the OrderSet for the polling to diff against
            yield this._updateStoreAsync({ added: orders, removed: [], assetPairKey });
            // Create a HTTP polling subscription
            const pollingIntervalId = this._createPollingSubscription(makerAssetData, takerAssetData);
            this._assetPairKeyToPollingIntervalId.set(assetPairKey, pollingIntervalId);
        });
    }
    /**
     * Creates the polling interval fetching the orders, calculating the diff and updating the store
     */
    _createPollingSubscription(makerAssetData, takerAssetData) {
        const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
        const pollingIntervalId = utils_1.intervalUtils.setAsyncExcludingInterval(() => __awaiter(this, void 0, void 0, function* () {
            const previousOrderSet = yield this._orderStore.getOrderSetForAssetPairAsync(assetPairKey);
            const orders = yield this._fetchLatestOrdersAsync(makerAssetData, takerAssetData);
            const orderSet = new order_set_1.OrderSet();
            yield orderSet.addManyAsync(orders);
            const diff = yield previousOrderSet.diffAsync(orderSet);
            yield this._updateStoreAsync(Object.assign({}, diff, { assetPairKey }));
        }), this._pollingIntervalMs, (_) => {
            // TODO(dave4506) Add richer errors
            throw new Error(`Fetching latest orders for asset pair ${makerAssetData}/${takerAssetData}`);
        });
        return pollingIntervalId;
    }
}
exports.SRAPollingOrderProvider = SRAPollingOrderProvider;
//# sourceMappingURL=sra_polling_order_provider.js.map