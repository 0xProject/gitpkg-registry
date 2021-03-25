import { Pool } from '@balancer-labs/sor/dist/types';
import { BalancerPoolsCache } from '../../src/utils/market_operation_utils/balancer_utils';
export interface Handlers {
    getPoolsForPairAsync: (takerToken: string, makerToken: string) => Promise<Pool[]>;
    _fetchPoolsForPairAsync: (takerToken: string, makerToken: string) => Promise<Pool[]>;
    _loadTopPoolsAsync: () => Promise<void>;
}
export declare class MockBalancerPoolsCache extends BalancerPoolsCache {
    handlers: Partial<Handlers>;
    constructor(handlers: Partial<Handlers>);
    getPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
    protected _loadTopPoolsAsync(): Promise<void>;
}
//# sourceMappingURL=mock_balancer_pools_cache.d.ts.map