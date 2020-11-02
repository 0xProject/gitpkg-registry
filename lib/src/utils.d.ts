import { APIOrder, SignedOrder } from '@0x/connect';
export declare const utils: {
    getOrderHash(order: APIOrder | SignedOrder): string;
    delayAsync(ms: number): Promise<void>;
    attemptAsync<T>(fn: () => Promise<T>, opts?: {
        interval: number;
        maxRetries: number;
    }): Promise<T>;
};
//# sourceMappingURL=utils.d.ts.map