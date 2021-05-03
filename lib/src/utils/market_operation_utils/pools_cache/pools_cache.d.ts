import { Pool } from '@balancer-labs/sor/dist/types';
export { Pool };
export interface CacheValue {
    timestamp: number;
    pools: Pool[];
}
export declare abstract class PoolsCache {
    protected readonly _cache: {
        [key: string]: CacheValue;
    };
    constructor(_cache: {
        [key: string]: CacheValue;
    });
    getFreshPoolsForPairAsync(takerToken: string, makerToken: string, timeoutMs?: number): Promise<Pool[]>;
    getCachedPoolAddressesForPair(takerToken: string, makerToken: string, cacheExpiryMs?: number): string[] | undefined;
    isFresh(takerToken: string, makerToken: string): boolean;
    protected _getAndSaveFreshPoolsForPairAsync(takerToken: string, makerToken: string, cacheExpiryMs?: number): Promise<Pool[]>;
    protected _cachePoolsForPair(takerToken: string, makerToken: string, pools: Pool[]): void;
    protected abstract _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
//# sourceMappingURL=pools_cache.d.ts.map