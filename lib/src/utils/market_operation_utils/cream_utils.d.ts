import { BalancerPool } from './balancer_utils';
interface CacheValue {
    timestamp: number;
    pools: BalancerPool[];
}
export declare class CreamPoolsCache {
    private readonly _cache;
    private readonly maxPoolsFetched;
    constructor(_cache?: {
        [key: string]: CacheValue;
    }, maxPoolsFetched?: number);
    getPoolsForPairAsync(takerToken: string, makerToken: string, timeoutMs?: number): Promise<BalancerPool[]>;
    getCachedPoolAddressesForPair(takerToken: string, makerToken: string, cacheExpiryMs?: number): string[] | undefined;
    howToSampleCream(takerToken: string, makerToken: string, isAllowedSource: boolean): {
        onChain: boolean;
        offChain: boolean;
    };
    protected _getPoolsForPairAsync(takerToken: string, makerToken: string, cacheExpiryMs?: number): Promise<BalancerPool[]>;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<BalancerPool[]>;
}
export {};
//# sourceMappingURL=cream_utils.d.ts.map