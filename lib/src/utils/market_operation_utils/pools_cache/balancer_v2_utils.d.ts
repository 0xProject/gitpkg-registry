import { Pool } from '@balancer-labs/sor/dist/types';
import { CacheValue, PoolsCache } from './pools_cache';
export declare class BalancerV2PoolsCache extends PoolsCache {
    private readonly subgraphUrl;
    private readonly maxPoolsFetched;
    constructor(subgraphUrl?: string, maxPoolsFetched?: number, cache?: {
        [key: string]: CacheValue;
    });
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
//# sourceMappingURL=balancer_v2_utils.d.ts.map