import { AssetPairsItem, SignedOrder } from '@0x/types';
import { OrderStore } from '../order_store';
import { AcceptedRejectedOrders, MeshOrderProviderOpts } from '../types';
import { BaseOrderProvider } from './base_order_provider';
export declare class MeshOrderProvider extends BaseOrderProvider {
    private readonly _wsClient;
    private _wsSubscriptionId?;
    /**
     * Converts the OrderEvent or OrderInfo from Mesh  into an APIOrder.
     * If the OrderInfo is a RejectedOrderInfo the remainingFillableTakerAssetAmount is
     * assumed to be 0.
     * @param orderEvent The `OrderEvent` from a Mesh subscription update
     */
    private static _orderInfoToAPIOrder;
    /**
     * Instantiates a [Mesh](https://github.com/0xProject/0x-mesh) Order Provider. This provider writes
     * all orders stored in Mesh to the OrderStore and subscribes all Mesh updates.
     * @param opts `MeshOrderProviderOpts` containing the websocketEndpoint and additional Mesh options
     * @param orderStore The `OrderStore` where orders are added and removed from
     */
    constructor(opts: MeshOrderProviderOpts, orderStore: OrderStore);
    /**
     * Returns the available asset pairs. If no subscription to Mesh exists (and therefore no orders) it is
     * created and awaited on. Once the connection has been initialized the orders in the store are returned
     * as asset pairs.
     */
    getAvailableAssetDatasAsync(): Promise<AssetPairsItem[]>;
    /**
     * Creates a subscription for all asset pairs in Mesh.
     * @param makerAssetData the Maker Asset Data
     * @param takerAssetData the Taker Asset Data
     */
    createSubscriptionForAssetPairAsync(_makerAssetData: string, _takerAssetData: string): Promise<void>;
    /**
     * Submits the SignedOrder to the Mesh node
     * @param orders the set of signed orders to add
     */
    addOrdersAsync(orders: SignedOrder[]): Promise<AcceptedRejectedOrders>;
    /**
     * Destroys the order provider, removing any subscriptions
     */
    destroyAsync(): Promise<void>;
    /**
     * Creates the order subscription unless one already exists. If one does not exist
     * it also handles the reconnection logic.
     */
    private _initializeIfRequiredAsync;
    /**
     * Syncs the orders currently stored in the OrderStore. This is used when the connection to mesh
     * has reconnected. During this outage there are missed OrderEvents so all orders are re-validated
     * for every known asset pair.
     */
    private _syncOrdersInOrderStoreAsync;
    /**
     * Fetches all of the Orders available in Mesh. All orders are then stored in the
     * OrderStore.
     */
    private _fetchOrdersAndStoreAsync;
    /**
     * Handles the order events converting to APIOrders and either adding or removing based on its kind.
     * @param orderEvents The set of `OrderEvents` returned from a mesh subscription update
     */
    private _handleOrderUpdatesAsync;
}
//# sourceMappingURL=mesh_order_provider.d.ts.map