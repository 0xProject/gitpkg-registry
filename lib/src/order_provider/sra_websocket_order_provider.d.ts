import { OrderStore } from '../order_store';
import { SRAWebsocketOrderProviderOpts } from '../types';
import { BaseSRAOrderProvider } from './base_sra_order_provider';
export declare class SRAWebsocketOrderProvider extends BaseSRAOrderProvider {
    private readonly _websocketEndpoint;
    private readonly _wsSubscriptions;
    private _ordersChannel?;
    private _isDestroyed;
    private _isConnecting;
    /**
     * Instantiates a HTTP and WS [Standard Relayer API](https://github.com/0xProject/standard-relayer-api) Order Provider
     * @param opts `SRAWebsocketOrderProviderOpts` containing the websocketEndpoint and the httpEndpoint to an SRA backend.
     * @param orderStore The `OrderStore` where orders are added and removed from
     */
    constructor(opts: SRAWebsocketOrderProviderOpts, orderStore: OrderStore);
    /**
     * Creates a websocket subscription and fetches the current orders from SRA. If a websocket
     * connection already exists this function is a noop.
     * @param makerAssetData the Maker Asset Data
     * @param takerAssetData the Taker Asset Data
     */
    createSubscriptionForAssetPairAsync(makerAssetData: string, takerAssetData: string): Promise<void>;
    /**
     * Destroys the order provider, removing any subscriptions
     */
    destroyAsync(): Promise<void>;
    /**
     * Creates a websocket subscription. If the inital websocket connnection
     * does not exist, it is created.
     * @param makerAssetData the Maker Asset Data
     * @param takerAssetData the Taker Asset Data
     */
    private _createWebsocketSubscriptionAsync;
    private _fetchAndCreateSubscriptionAsync;
    private _syncOrdersInOrderStoreAsync;
    /**
     * Creates a new websocket orders channel.
     */
    private _createOrdersChannelAsync;
    /**
     * Handles updates from the websocket, adding new orders and removing orders
     * which have remainingFillableTakerAssetAmount as 0.
     * @param orders the set of API Orders returned from the websocket channel
     */
    private _handleOrderUpdatesAsync;
}
//# sourceMappingURL=sra_websocket_order_provider.d.ts.map