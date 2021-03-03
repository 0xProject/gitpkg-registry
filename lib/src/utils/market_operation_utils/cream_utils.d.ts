import { Pool } from '@balancer-labs/sor/dist/types';
interface CacheValue {
    timestamp: number;
    pools: Pool[];
}
export declare class CreamPoolsCache {
    private readonly _cache;
    private readonly maxPoolsFetched;
    constructor(_cache?: {
        [key: string]: CacheValue;
    }, maxPoolsFetched?: number);
    getPoolsForPairAsync(takerToken: string, makerToken: string, timeoutMs?: number): Promise<Pool[]>;
    getCachedPoolAddressesForPair(takerToken: string, makerToken: string, cacheExpiryMs?: number): string[] | undefined;
    howToSampleCream(takerToken: string, makerToken: string, isAllowedSource: boolean): {
        onChain: boolean;
        offChain: boolean;
    };
    protected _getPoolsForPairAsync(takerToken: string, makerToken: string, cacheExpiryMs?: number): Promise<Pool[]>;
    protected _loadTopPoolsAsync(): Promise<void>;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
export {};
//# sourceMappingURL=cream_utils.d.ts.map