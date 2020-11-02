import { AssetPairsItem, SignedOrder } from '@0x/types';
import { OrderStore } from '../order_store';
import { AcceptedRejectedOrders } from '../types';
import { BaseOrderProvider } from './base_order_provider';
export declare class CustomOrderProvider extends BaseOrderProvider {
    constructor(orders: SignedOrder[], orderStore: OrderStore);
    createSubscriptionForAssetPairAsync(_makerAssetData: string, _takerAssetData: string): Promise<void>;
    getAvailableAssetDatasAsync(): Promise<AssetPairsItem[]>;
    destroyAsync(): Promise<void>;
    addOrdersAsync(orders: SignedOrder[]): Promise<AcceptedRejectedOrders>;
}
//# sourceMappingURL=custom_order_provider.d.ts.map