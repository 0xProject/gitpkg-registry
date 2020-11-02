import { AssetPairsItem, SignedOrder } from '@0x/types';
import { OrderStore } from '../order_store';
import { AcceptedRejectedOrders, AddedRemovedOrders } from '../types';
export declare const DEFAULT_TOKEN_PRECISION = 18;
export declare abstract class BaseOrderProvider {
    readonly _orderStore: OrderStore;
    constructor(orderStore: OrderStore);
    abstract createSubscriptionForAssetPairAsync(makerAssetData: string, takerAssetData: string): Promise<void>;
    abstract getAvailableAssetDatasAsync(): Promise<AssetPairsItem[]>;
    abstract destroyAsync(): Promise<void>;
    abstract addOrdersAsync(orders: SignedOrder[]): Promise<AcceptedRejectedOrders>;
    protected _updateStoreAsync(addedRemoved: AddedRemovedOrders): Promise<void>;
}
//# sourceMappingURL=base_order_provider.d.ts.map