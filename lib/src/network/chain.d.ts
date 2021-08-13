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
    maxCacheAgeMs?: number;
    gas?: number;
    gasPrice?: BigNumber;
    timeoutMs?: number;
    batchId?: number;
}
export interface CreateChainOpts {
    provider: SupportedProvider;
    flushFrequencyMs?: number;
    maxCacheAgeMs?: number;
    maxBatchGas?: number;
    maxBatchBytes?: number;
    maxOutstandingCalls?: number;
    callTimeoutMs?: number;
}
export interface DispatchedCallResult {
    success: boolean;
    resultData: Bytes;
    dispatchTime: number;
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
    private readonly _maxCacheAgeMs;
    private readonly _callTimeoutMs;
    private readonly _maxBatchGas;
    private readonly _maxBatchBytes;
    private readonly _maxOutstandingCalls;
    private _openBatches;
    private readonly _queuedEthCallByHash;
    private readonly _memcache;
    private _outstandingCalls;
    static createAsync(opts: CreateChainOpts): Promise<Chain>;
    protected constructor(opts: {
        chainId: number;
        w3: Web3Wrapper;
        maxCacheAgeMs: number;
        callTimeoutMs: number;
        maxBatchGas: number;
        maxBatchBytes: number;
        maxOutstandingCalls: number;
    });
    ethCallAsync(opts: ChainEthCallOpts): Promise<Bytes>;
    private _batchCall;
    private _findCachedCallResultAsync;
    private _cacheCallResultAsync;
    private _autoFlushAsync;
    private _flushAsync;
    private _dispatchBatchAsync;
}
//# sourceMappingURL=chain.d.ts.map