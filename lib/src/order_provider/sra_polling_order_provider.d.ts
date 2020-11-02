import { OrderStore } from '../order_store';
import { SRAPollingOrderProviderOpts } from '../types';
import { BaseSRAOrderProvider } from './base_sra_order_provider';
export declare class SRAPollingOrderProvider extends BaseSRAOrderProvider {
    private readonly _assetPairKeyToPollingIntervalId;
    private readonly _pollingIntervalMs;
    /**
     * Instantiates a HTTP [Standard Relayer API](https://github.com/0xProject/standard-relayer-api)
     * Polling Order Provider
     * @param opts `SRAPollingOrderProviderOpts` containing the httpEndpoint to an SRA backend and polling options
     * @param orderStore The `OrderStore` where orders are added and removed from
     */
    constructor(opts: SRAPollingOrderProviderOpts, orderStore: OrderStore);
    /**
     * Creates a http polling subscription and fetches the current orders from SRA.
     * @param makerAssetData the maker asset Data
     * @param takerAssetData the taker asset Data
     */
    createSubscriptionForAssetPairAsync(makerAssetData: string, takerAssetData: string): Promise<void>;
    /**
     * Destroys the order provider, removing any subscriptions
     */
    destroyAsync(): Promise<void>;
    /**
     * Fetches all of the orders for both sides of the orderbook and stores them. A polling subscription
     * is created performing this action every pollingIntervalMs
     */
    private _fetchAndCreatePollingAsync;
    /**
     * Creates the polling interval fetching the orders, calculating the diff and updating the store
     */
    private _createPollingSubscription;
}
//# sourceMappingURL=sra_polling_order_provider.d.ts.map