import { BigNumber } from '@0x/utils';
export interface BalancerPool {
    id: string;
    balanceIn: BigNumber;
    balanceOut: BigNumber;
    weightIn: BigNumber;
    weightOut: BigNumber;
    swapFee: BigNumber;
    spotPrice?: BigNumber;
    slippage?: BigNumber;
    limitAmount?: BigNumber;
}
interface CacheValue {
    timestamp: number;
    pools: BalancerPool[];
}
export declare class BalancerPoolsCache {
    private readonly _cache;
    cacheExpiryMs: number;
    private readonly maxPoolsFetched;
    constructor(_cache?: {
        [key: string]: CacheValue;
    }, cacheExpiryMs?: number, maxPoolsFetched?: number);
    getPoolsForPairAsync(takerToken: string, makerToken: string, timeoutMs?: number): Promise<BalancerPool[]>;
    protected _getPoolsForPairAsync(takerToken: string, makerToken: string): Promise<BalancerPool[]>;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<BalancerPool[]>;
}
export declare function computeBalancerSellQuote(pool: BalancerPool, takerFillAmount: BigNumber): BigNumber;
export declare function computeBalancerBuyQuote(pool: BalancerPool, makerFillAmount: BigNumber): BigNumber;
export {};
//# sourceMappingURL=balancer_utils.d.ts.map