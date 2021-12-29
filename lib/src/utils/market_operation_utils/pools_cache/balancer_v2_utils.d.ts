import { ChainId } from '@0x/contract-addresses';
import { Pool } from '@balancer-labs/sor/dist/types';
import { LogFunction } from '../../../types';
import { CacheValue, PoolsCache } from './pools_cache';
interface BalancerPoolResponse {
    id: string;
    swapFee: string;
    tokens: Array<{
        address: string;
        decimals: number;
        balance: string;
        weight: string;
        symbol: string;
    }>;
    tokensList: string[];
    totalWeight: string;
    totalShares: string;
    amp: string | null;
}
export declare class BalancerV2PoolsCache extends PoolsCache {
    private readonly subgraphUrl;
    private readonly maxPoolsFetched;
    private readonly _topPoolsFetched;
    private readonly _warningLogger;
    private static _parseSubgraphPoolData;
    constructor(chainId: ChainId, subgraphUrl?: string, maxPoolsFetched?: number, _topPoolsFetched?: number, _warningLogger?: LogFunction, cache?: {
        [key: string]: CacheValue;
    });
    protected _fetchTopPoolsAsync(): Promise<BalancerPoolResponse[]>;
    protected _loadTopPoolsAsync(): Promise<void>;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
export {};
//# sourceMappingURL=balancer_v2_utils.d.ts.map