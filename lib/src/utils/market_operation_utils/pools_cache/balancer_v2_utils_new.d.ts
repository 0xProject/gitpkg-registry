import { ChainId } from '@0x/contract-addresses';
import { LogFunction } from '../../../types';
import { BalancerSwaps } from '../types';
import { CacheValue, SwapInfoCache } from './pair_swaps_cache';
export interface BalancerPoolResponse {
    poolType: string;
    id: string;
    tokens: Array<{
        address: string;
    }>;
    tokensList: string[];
}
export declare class BalancerV2SwapInfoCache extends SwapInfoCache {
    private readonly _warningLogger;
    private static readonly _MAX_POOLS_PER_PATH;
    private static readonly _MAX_CANDIDATE_PATHS_PER_PAIR;
    private readonly _routeProposer;
    private readonly _poolDataService;
    constructor(chainId: ChainId, subgraphUrl?: string | null, _warningLogger?: LogFunction, cache?: {
        [key: string]: CacheValue;
    });
    protected _loadTopPoolsAsync(): Promise<void>;
    /**
     * Will retrieve fresh pair and path data from Subgraph and return and array of swap info for pair..
     * @param takerToken Address of takerToken.
     * @param makerToken Address of makerToken.
     * @returns Swap data for pair consisting of assets and swap steps for ExactIn and ExactOut swap types.
     */
    protected _fetchSwapInfoForPairAsync(takerToken: string, makerToken: string): Promise<BalancerSwaps>;
    /**
     * Uses pool data from provided dictionary to find top swap paths for token pair.
     * @param pools Dictionary of pool data.
     * @param takerToken Address of taker token.
     * @param makerToken Address of maker token.
     * @returns Swap data for pair consisting of assets and swap steps for ExactIn and ExactOut swap types.
     */
    private _getPoolPairSwapInfo;
}
//# sourceMappingURL=balancer_v2_utils_new.d.ts.map