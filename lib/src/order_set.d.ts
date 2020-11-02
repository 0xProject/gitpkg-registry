import { APIOrder } from '@0x/connect';
export declare class OrderSet {
    private readonly _map;
    constructor();
    size(): number;
    addAsync(item: APIOrder): Promise<void>;
    addManyAsync(items: APIOrder[]): Promise<void>;
    hasAsync(order: APIOrder): Promise<boolean>;
    diffAsync(other: OrderSet): Promise<{
        added: APIOrder[];
        removed: APIOrder[];
    }>;
    values(): IterableIterator<APIOrder>;
    deleteAsync(item: APIOrder): Promise<boolean>;
    deleteManyAsync(items: APIOrder[]): Promise<void>;
}
//# sourceMappingURL=order_set.d.ts.map