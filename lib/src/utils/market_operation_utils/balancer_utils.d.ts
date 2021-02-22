import { Pool } from '@balancer-labs/sor/dist/types';
interface CacheValue {
    timestamp: number;
    pools: Pool[];
}
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
export declare class BalancerPoolsCache {
    private readonly _cache;
    private readonly maxPoolsFetched;
    private readonly subgraphUrl;
    private readonly topPoolsFetched;
    constructor(_cache?: {
        [key: string]: CacheValue;
    }, maxPoolsFetched?: number, subgraphUrl?: string, topPoolsFetched?: number);
    getPoolsForPairAsync(takerToken: string, makerToken: string, timeoutMs?: number): Promise<Pool[]>;
    getCachedPoolAddressesForPair(takerToken: string, makerToken: string, cacheExpiryMs?: number): string[] | undefined;
    howToSampleBalancer(takerToken: string, makerToken: string, isAllowedSource: boolean): {
        onChain: boolean;
        offChain: boolean;
    };
    protected _getPoolsForPairAsync(takerToken: string, makerToken: string, cacheExpiryMs?: number): Promise<Pool[]>;
    protected _cachePoolsForPair(takerToken: string, makerToken: string, pools: Pool[]): void;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
    protected _loadTopPoolsAsync(): Promise<void>;
    protected _fetchTopPoolsAsync(): Promise<BalancerPoolResponse[]>;
}
export {};
//# sourceMappingURL=balancer_utils.d.ts.map