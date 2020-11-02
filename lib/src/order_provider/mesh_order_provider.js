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
const mesh_rpc_client_1 = require("@0x/mesh-rpc-client");
const utils_1 = require("@0x/utils");
const order_store_1 = require("../order_store");
const utils_2 = require("../utils");
const base_order_provider_1 = require("./base_order_provider");
class MeshOrderProvider extends base_order_provider_1.BaseOrderProvider {
    /**
     * Converts the OrderEvent or OrderInfo from Mesh  into an APIOrder.
     * If the OrderInfo is a RejectedOrderInfo the remainingFillableTakerAssetAmount is
     * assumed to be 0.
     * @param orderEvent The `OrderEvent` from a Mesh subscription update
     */
    static _orderInfoToAPIOrder(orderEvent) {
        const remainingFillableTakerAssetAmount = orderEvent.fillableTakerAssetAmount
            ? orderEvent.fillableTakerAssetAmount
            : new utils_1.BigNumber(0);
        // TODO(dekz): Remove the any hack when mesh is published v3
        return {
            // tslint:disable:no-unnecessary-type-assertion
            order: orderEvent.signedOrder,
            metaData: {
                orderHash: orderEvent.orderHash,
                remainingFillableTakerAssetAmount,
            },
        };
    }
    /**
     * Instantiates a [Mesh](https://github.com/0xProject/0x-mesh) Order Provider. This provider writes
     * all orders stored in Mesh to the OrderStore and subscribes all Mesh updates.
     * @param opts `MeshOrderProviderOpts` containing the websocketEndpoint and additional Mesh options
     * @param orderStore The `OrderStore` where orders are added and removed from
     */
    constructor(opts, orderStore) {
        super(orderStore);
        this._wsClient = new mesh_rpc_client_1.WSClient(opts.websocketEndpoint, opts.wsOpts);
    }
    /**
     * Returns the available asset pairs. If no subscription to Mesh exists (and therefore no orders) it is
     * created and awaited on. Once the connection has been initialized the orders in the store are returned
     * as asset pairs.
     */
    getAvailableAssetDatasAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._initializeIfRequiredAsync();
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
    /**
     * Creates a subscription for all asset pairs in Mesh.
     * @param makerAssetData the Maker Asset Data
     * @param takerAssetData the Taker Asset Data
     */
    createSubscriptionForAssetPairAsync(_makerAssetData, _takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the subscription first to get any updates while waiting for the request
            yield this._initializeIfRequiredAsync();
        });
    }
    /**
     * Submits the SignedOrder to the Mesh node
     * @param orders the set of signed orders to add
     */
    addOrdersAsync(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accepted, rejected } = yield utils_2.utils.attemptAsync(() => this._wsClient.addOrdersAsync(orders));
            // TODO(dekz): Remove the any hack when mesh is published v3
            return {
                accepted: accepted.map(o => o.signedOrder),
                rejected: rejected.map(o => ({ order: o.signedOrder, message: o.status.message })),
            };
        });
    }
    /**
     * Destroys the order provider, removing any subscriptions
     */
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this._wsClient.destroy();
        });
    }
    /**
     * Creates the order subscription unless one already exists. If one does not exist
     * it also handles the reconnection logic.
     */
    _initializeIfRequiredAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._wsSubscriptionId) {
                return;
            }
            this._wsSubscriptionId = yield this._wsClient.subscribeToOrdersAsync(this._handleOrderUpdatesAsync.bind(this));
            yield this._fetchOrdersAndStoreAsync();
            // On Reconnnect sync all of the orders currently stored
            this._wsClient.onReconnected(() => {
                void this._syncOrdersInOrderStoreAsync();
            });
        });
    }
    /**
     * Syncs the orders currently stored in the OrderStore. This is used when the connection to mesh
     * has reconnected. During this outage there are missed OrderEvents so all orders are re-validated
     * for every known asset pair.
     */
    _syncOrdersInOrderStoreAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const assetPairKey of yield this._orderStore.keysAsync()) {
                const currentOrders = yield this._orderStore.getOrderSetForAssetPairAsync(assetPairKey);
                const { rejected } = yield utils_2.utils.attemptAsync(() => this._wsClient.addOrdersAsync(Array.from(currentOrders.values()).map(o => o.order)));
                // Remove any rejected orders
                yield this._updateStoreAsync({
                    assetPairKey,
                    added: [],
                    removed: rejected.map(o => MeshOrderProvider._orderInfoToAPIOrder(o)),
                });
            }
            yield this._fetchOrdersAndStoreAsync();
        });
    }
    /**
     * Fetches all of the Orders available in Mesh. All orders are then stored in the
     * OrderStore.
     */
    _fetchOrdersAndStoreAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersByAssetPairKey = {};
            // Fetch all orders in Mesh
            const orders = yield utils_2.utils.attemptAsync(() => this._wsClient.getOrdersAsync());
            for (const order of orders) {
                const { makerAssetData, takerAssetData } = order.signedOrder;
                const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
                if (!ordersByAssetPairKey[assetPairKey]) {
                    ordersByAssetPairKey[assetPairKey] = [];
                }
                ordersByAssetPairKey[assetPairKey].push(MeshOrderProvider._orderInfoToAPIOrder(order));
            }
            for (const assetPairKey of Object.keys(ordersByAssetPairKey)) {
                yield this._updateStoreAsync({
                    added: ordersByAssetPairKey[assetPairKey],
                    removed: [],
                    assetPairKey,
                });
            }
        });
    }
    /**
     * Handles the order events converting to APIOrders and either adding or removing based on its kind.
     * @param orderEvents The set of `OrderEvents` returned from a mesh subscription update
     */
    _handleOrderUpdatesAsync(orderEvents) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedRemovedByAssetPairKey = {};
            for (const event of orderEvents) {
                const { makerAssetData, takerAssetData } = event.signedOrder;
                const assetPairKey = order_store_1.OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
                if (!addedRemovedByAssetPairKey[assetPairKey]) {
                    addedRemovedByAssetPairKey[assetPairKey] = { added: [], removed: [], assetPairKey };
                }
                const apiOrder = MeshOrderProvider._orderInfoToAPIOrder(event);
                switch (event.endState) {
                    case mesh_rpc_client_1.OrderEventEndState.Added:
                    case mesh_rpc_client_1.OrderEventEndState.Unexpired: {
                        addedRemovedByAssetPairKey[assetPairKey].added.push(apiOrder);
                        break;
                    }
                    case mesh_rpc_client_1.OrderEventEndState.Cancelled:
                    case mesh_rpc_client_1.OrderEventEndState.Expired:
                    case mesh_rpc_client_1.OrderEventEndState.FullyFilled:
                    case mesh_rpc_client_1.OrderEventEndState.Unfunded:
                    case mesh_rpc_client_1.OrderEventEndState.StoppedWatching: {
                        addedRemovedByAssetPairKey[assetPairKey].removed.push(apiOrder);
                        break;
                    }
                    case mesh_rpc_client_1.OrderEventEndState.FillabilityIncreased:
                    case mesh_rpc_client_1.OrderEventEndState.Filled: {
                        addedRemovedByAssetPairKey[assetPairKey].added.push(apiOrder);
                        break;
                    }
                    default:
                        break;
                }
            }
            for (const assetPairKey of Object.keys(addedRemovedByAssetPairKey)) {
                yield this._updateStoreAsync(addedRemovedByAssetPairKey[assetPairKey]);
            }
        });
    }
}
exports.MeshOrderProvider = MeshOrderProvider;
//# sourceMappingURL=mesh_order_provider.js.map