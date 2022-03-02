export interface CToken {
    tokenAddress: string;
    underlyingAddress: string;
}
/**
 * Fetches a list of CTokens from Compound's official API.
 * The token information is updated every 30 minutes and cached
 * so that it can be accessed with the underlying token's address.
 */
export declare class CompoundCTokenCache {
    private readonly _apiUrl;
    private readonly _wethAddress;
    private _cache;
    constructor(_apiUrl: string, _wethAddress: string);
    fetchAndUpdateCTokensAsync(): Promise<void>;
    get(takerToken: string, makerToken: string): CToken | undefined;
}
//# sourceMappingURL=compound_ctoken_cache.d.ts.map