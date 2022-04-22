import { BalancerSwaps } from '../types';
export interface CacheValue {
    expiresAt: number;
    balancerSwaps: BalancerSwaps;
}
export declare const EMPTY_BALANCER_SWAPS: {
    swapInfoExactIn: never[];
    swapInfoExactOut: never[];
};
/**
 * Caches SwapInfo for a pair of tokens.
 * SwapInfo includes swap steps and asset information for those swap steps.
 */
export declare abstract class SwapInfoCache {
    protected readonly _cache: {
        [key: string]: CacheValue;
    };
    protected readonly _cacheTimeMs: number;
    protected static _isExpired(value: CacheValue): boolean;
    constructor(_cache: {
        [key: string]: CacheValue;
    }, _cacheTimeMs?: number);
    getFreshPoolsForPairAsync(takerToken: string, makerToken: string, timeoutMs?: number): Promise<BalancerSwaps>;
    getCachedSwapInfoForPair(takerToken: string, makerToken: string, ignoreExpired?: boolean): BalancerSwaps | undefined;
    isFresh(takerToken: string, makerToken: string): boolean;
    protected _getAndSaveFreshSwapInfoForPairAsync(takerToken: string, makerToken: string): Promise<BalancerSwaps>;
    protected _cacheSwapInfoForPair(takerToken: string, makerToken: string, swapInfo: BalancerSwaps, expiresAt: number): void;
    protected abstract _fetchSwapInfoForPairAsync(takerToken: string, makerToken: string): Promise<BalancerSwaps>;
}
//# sourceMappingURL=pair_swaps_cache.d.ts.map