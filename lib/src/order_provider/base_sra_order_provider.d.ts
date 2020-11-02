import { APIOrder, HttpClient } from '@0x/connect';
import { AssetPairsItem, SignedOrder } from '@0x/types';
import { OrderStore } from '../order_store';
import { AcceptedRejectedOrders } from '../types';
import { BaseOrderProvider } from './base_order_provider';
export declare const PER_PAGE_DEFAULT = 100;
export declare abstract class BaseSRAOrderProvider extends BaseOrderProvider {
    protected readonly _httpClient: HttpClient;
    protected readonly _perPage: number;
    /**
     * This is an internal class for Websocket and Polling Order Providers
     */
    constructor(orderStore: OrderStore, httpEndpoint: string, perPage?: number);
    /**
     * Returns the availale Asset pairs from the SRA endpoint. This response is direct from the endpoint
     * so this call blocks until the response arrives.
     */
    getAvailableAssetDatasAsync(): Promise<AssetPairsItem[]>;
    /**
     * Submits the SignedOrder to the SRA endpoint
     * @param orders the set of signed orders to add
     */
    addOrdersAsync(orders: SignedOrder[]): Promise<AcceptedRejectedOrders>;
    protected _fetchLatestOrdersAsync(makerAssetData: string, takerAssetData: string): Promise<APIOrder[]>;
    protected _getAllPaginatedOrdersAsync(makerAssetData: string, takerAssetData: string): Promise<APIOrder[]>;
}
//# sourceMappingURL=base_sra_order_provider.d.ts.map