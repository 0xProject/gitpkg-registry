import { Pool } from '@balancer-labs/sor/dist/types';
export { Pool };
export interface CacheValue {
    expiresAt: number;
    pools: Pool[];
}
export declare abstract class PoolsCache {
    protected readonly _cache: {
        [key: string]: CacheValue;
    };
    protected readonly _cacheTimeMs: number;
    protected static _isExpired(value: CacheValue): boolean;
    constructor(_cache: {
        [key: string]: CacheValue;
    }, _cacheTimeMs?: number);
    getFreshPoolsForPairAsync(takerToken: string, makerToken: string, timeoutMs?: number): Promise<Pool[]>;
    getCachedPoolAddressesForPair(takerToken: string, makerToken: string, ignoreExpired?: boolean): string[] | undefined;
    isFresh(takerToken: string, makerToken: string): boolean;
    protected _getAndSaveFreshPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
    protected _cachePoolsForPair(takerToken: string, makerToken: string, pools: Pool[], expiresAt: number): void;
    protected abstract _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
//# sourceMappingURL=pools_cache.d.ts.map