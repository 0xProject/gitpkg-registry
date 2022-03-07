import { Pool } from '@balancer-labs/sor/dist/types';
import { CacheValue, PoolsCache } from './pools_cache';
export declare class CreamPoolsCache extends PoolsCache {
    private readonly maxPoolsFetched;
    constructor(_cache?: {
        [key: string]: CacheValue;
    }, maxPoolsFetched?: number);
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
//# sourceMappingURL=cream_utils.d.ts.map