export interface AaveReserve {
    id: string;
    underlyingAsset: string;
    aToken: {
        id: string;
    };
    pool: {
        id: string;
        lendingPool: string;
    };
}
/**
 * Fetches Aave V2 reserve information from the official subgraph(s).
 * The reserve information is updated every 30 minutes and cached
 * so that it can be accessed with the underlying token's address
 */
export declare class AaveV2ReservesCache {
    private readonly _subgraphUrl;
    private _cache;
    constructor(_subgraphUrl: string);
    /**
     * Fetches Aave V2 reserves from the subgraph and updates the cache
     */
    fetchAndUpdateReservesAsync(): Promise<void>;
    get(takerToken: string, makerToken: string): AaveReserve | undefined;
}
//# sourceMappingURL=aave_reserves_cache.d.ts.map