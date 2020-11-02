import { APIOrder } from '@0x/connect';
import { OrderSet } from './order_set';
import { AddedRemovedOrders } from './types';
export declare class OrderStore {
    private readonly _orders;
    static getKeyForAssetPair(makerAssetData: string, takerAssetData: string): string;
    static assetPairKeyToAssets(assetPairKey: string): string[];
    getOrderSetForAssetsAsync(makerAssetData: string, takerAssetData: string): Promise<OrderSet>;
    getOrderSetForAssetPairAsync(assetPairKey: string): Promise<OrderSet>;
    getBatchOrderSetsForAssetsAsync(makerAssetDatas: string[], takerAssetDatas: string[]): Promise<OrderSet[]>;
    updateAsync(addedRemoved: AddedRemovedOrders): Promise<void>;
    hasAsync(assetPairKey: string): Promise<boolean>;
    valuesAsync(assetPairKey: string): Promise<APIOrder[]>;
    keysAsync(): Promise<IterableIterator<string>>;
}
//# sourceMappingURL=order_store.d.ts.map