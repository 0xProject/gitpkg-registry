import { BalancerPool, BalancerPoolsCache } from '../../src/utils/market_operation_utils/balancer_utils';
export interface Handlers {
    getPoolsForPairAsync: (takerToken: string, makerToken: string) => Promise<BalancerPool[]>;
    _fetchPoolsForPairAsync: (takerToken: string, makerToken: string) => Promise<BalancerPool[]>;
}
export declare class MockBalancerPoolsCache extends BalancerPoolsCache {
    handlers: Partial<Handlers>;
    constructor(handlers: Partial<Handlers>);
    getPoolsForPairAsync(takerToken: string, makerToken: string): Promise<BalancerPool[]>;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<BalancerPool[]>;
}
//# sourceMappingURL=mock_balancer_pools_cache.d.ts.map