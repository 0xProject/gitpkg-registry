import { APIOrder } from '@0x/connect';
import { AssetPairsItem, SignedOrder } from '@0x/types';
import { BaseOrderProvider } from './order_provider/base_order_provider';
import { OrderStore } from './order_store';
import { AcceptedRejectedOrders, MeshOrderProviderOpts, SRAPollingOrderProviderOpts, SRAWebsocketOrderProviderOpts } from './types';
export declare class Orderbook {
    private readonly _orderProvider;
    private readonly _orderStore;
    /**
     * Creates an Orderbook with the provided orders. This provider simply stores the
     * orders and allows querying. No validation or subscriptions occur.
     * @param orders the set of SignedOrders
     */
    static getOrderbookForProvidedOrders(orders: SignedOrder[]): Orderbook;
    /**
     * Creates an Orderbook with the SRA Websocket Provider. This Provider fetches orders via
     * the SRA http endpoint and then subscribes to the asset pair for future updates.
     * @param opts the `SRAWebsocketOrderProviderOpts`
     */
    static getOrderbookForWebsocketProvider(opts: SRAWebsocketOrderProviderOpts): Orderbook;
    /**
     * Creates an Orderbook with SRA Polling Provider. This Provider simply polls every interval.
     * @param opts the `SRAPollingOrderProviderOpts`
     */
    static getOrderbookForPollingProvider(opts: SRAPollingOrderProviderOpts): Orderbook;
    /**
     * Creates an Orderbook with a Mesh Order Provider. This Provider fetches ALL orders
     * and subscribes to updates on ALL orders.
     * @param opts the `MeshOrderProviderOpts`
     */
    static getOrderbookForMeshProvider(opts: MeshOrderProviderOpts): Orderbook;
    /**
     * Creates an Orderbook with the order provider. All order updates are stored
     * in the `OrderStore`.
     * @param orderProvider the order provider, e.g SRAWebbsocketOrderProvider
     * @param orderStore the order store where orders are added and deleted
     */
    constructor(orderProvider: BaseOrderProvider, orderStore: OrderStore);
    /**
     * Returns all orders where the order.makerAssetData == makerAssetData and
     * order.takerAssetData == takerAssetData. This pair is then subscribed to
     * and all future updates will be stored. The first request
     * to `getOrdersAsync` might fetch the orders from the Order Provider and create a subscription.
     * Subsequent requests will be quick and up to date and synced with the Order Provider state.
     * @param makerAssetData the maker asset data
     * @param takerAssetData the taker asset data
     */
    getOrdersAsync(makerAssetData: string, takerAssetData: string): Promise<APIOrder[]>;
    getBatchOrdersAsync(makerAssetDatas: string[], takerAssetDatas: string[]): Promise<APIOrder[][]>;
    /**
     * Returns all of the Available Asset Pairs for the provided Order Provider.
     */
    getAvailableAssetDatasAsync(): Promise<AssetPairsItem[]>;
    /**
     * Adds the orders to the Order Provider. All accepted orders will be returned
     * and rejected orders will be returned with an message indicating a reason for its rejection
     * @param orders The set of Orders to add to the Order Provider
     */
    addOrdersAsync(orders: SignedOrder[]): Promise<AcceptedRejectedOrders>;
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync(): Promise<void>;
}
//# sourceMappingURL=orderbook.d.ts.map