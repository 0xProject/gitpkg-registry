import { Pool } from '@balancer-labs/sor/dist/types';
import { CacheValue, PoolsCache } from './pools_cache';
interface BalancerPoolResponse {
    id: string;
    swapFee: string;
    tokens: Array<{
        address: string;
        decimals: number;
        balance: string;
    }>;
    tokensList: string[];
    totalWeight: string;
}
export declare class BalancerPoolsCache extends PoolsCache {
    private readonly _subgraphUrl;
    private readonly maxPoolsFetched;
    private readonly _topPoolsFetched;
    constructor(_subgraphUrl?: string, cache?: {
        [key: string]: CacheValue;
    }, maxPoolsFetched?: number, _topPoolsFetched?: number);
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
    protected _loadTopPoolsAsync(): Promise<void>;
    protected _fetchTopPoolsAsync(): Promise<BalancerPoolResponse[]>;
}
export {};
//# sourceMappingURL=balancer_utils.d.ts.map