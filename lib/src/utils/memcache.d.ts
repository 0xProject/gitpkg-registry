export declare class Memcache {
    private static _instanceForDb;
    static getInstance(db?: string): Memcache;
    private readonly _client;
    private readonly _get;
    private readonly _set;
    private readonly _keys;
    constructor(db?: string);
    tryGetAsync(key: string): Promise<string | null>;
    tryGetObjectAsync<T>(key: string): Promise<T | null>;
    setAsync(key: string, value: string, expiryMs?: number): Promise<void>;
    setObjectAsync<T>(key: string, value: T, expiryMs?: number): Promise<void>;
    getAllKeysAsync(pattern?: string): Promise<string[]>;
}
//# sourceMappingURL=memcache.d.ts.map