import { ChainId } from '@0x/contract-addresses';
import { SupportedProvider } from '@0x/subproviders';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Address, Bytes } from './types';
export interface ChainEthCallOverrides {
    [address: string]: {
        code?: Bytes;
    };
}
export interface ChainEthCallOpts {
    data: Bytes;
    to: Address;
    value?: BigNumber;
    overrides?: ChainEthCallOverrides;
    immediate?: boolean;
    maxCacheAgeMs?: number;
    gas?: number;
    gasPrice?: BigNumber;
}
export interface CreateChainOpts {
    provider: SupportedProvider;
    tickFrequency?: number;
    maxCacheAgeMs?: number;
}
export interface DispatchedCallResult {
    success: boolean;
    resultData: Bytes;
}
export interface Chain {
    chainId: ChainId;
    provider: SupportedProvider;
    ethCallAsync(opts: ChainEthCallOpts): Promise<Bytes>;
}
export declare class LiveChain implements Chain {
    get provider(): SupportedProvider;
    get chainId(): ChainId;
    private readonly _w3;
    private readonly _chainId;
    private readonly _cachedCallResults;
    private readonly _maxCacheAgeMs;
    private _tickTimer;
    private _queue;
    static createAsync(opts: CreateChainOpts): Promise<Chain>;
    private static _mergeBatchCalls;
    protected constructor(chainId: number, w3: Web3Wrapper, maxCacheAgeMs: number);
    protected _startAsync(tickFrequency: number): Promise<void>;
    ethCallAsync(opts: ChainEthCallOpts): Promise<Bytes>;
    private _findCachedCallResult;
    private _cacheCallResult;
    private _tickAsync;
    private _pruneCache;
    private _executeAsync;
    private _dispatchBatchAsync;
}
//# sourceMappingURL=chain.d.ts.map