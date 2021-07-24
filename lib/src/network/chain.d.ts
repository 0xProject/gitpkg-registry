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
    timeoutMs?: number;
}
export interface CreateChainOpts {
    provider: SupportedProvider;
    pruneFrequencyMs?: number;
    flushFrequencyMs?: number;
    maxCacheAgeMs?: number;
    maxBatchGas?: number;
    maxBatchBytes?: number;
    maxPendingCallAgeMs?: number;
    minDispatchFullness?: number;
    flushThreshold?: number;
}
export interface DispatchedCallResult {
    success: boolean;
    resultData: Bytes;
}
export interface Chain {
    chainId: ChainId;
    provider: SupportedProvider;
    blockNumber: number;
    ethCallAsync(opts: ChainEthCallOpts): Promise<Bytes>;
}
export declare class LiveChain implements Chain {
    get provider(): SupportedProvider;
    get chainId(): ChainId;
    get blockNumber(): number;
    private readonly _w3;
    private readonly _chainId;
    private readonly _cachedCallResults;
    private readonly _maxCacheAgeMs;
    private readonly _maxBatchGas;
    private readonly _maxBatchBytes;
    private readonly _maxPendingCallAgeMs;
    private readonly _minDispatchFullness;
    private readonly _flushThreshold;
    private _queueFullness;
    private _queue;
    private _blockNumber;
    static createAsync(opts: CreateChainOpts): Promise<Chain>;
    protected constructor(opts: {
        chainId: number;
        w3: Web3Wrapper;
        maxCacheAgeMs: number;
        maxBatchGas: number;
        maxBatchBytes: number;
        flushThreshold: number;
        maxPendingCallAgeMs: number;
        minDispatchFullness: number;
    });
    ethCallAsync(opts: ChainEthCallOpts): Promise<Bytes>;
    private _queueCall;
    private _findCachedCallResult;
    private _cacheCallResult;
    private _flush;
    private _prune;
    private _flushQueue;
    private _pruneCache;
    private _dispatchBatchAsync;
    private _generateCallBatches;
}
//# sourceMappingURL=chain.d.ts.map