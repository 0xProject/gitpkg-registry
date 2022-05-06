import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { SamplerOverrides } from '../../types';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { BancorService } from './bancor_service';
import { PoolsCacheMap, SamplerOperations } from './sampler_operations';
import { BatchedOperation, LiquidityProviderRegistry, TokenAdjacencyGraph } from './types';
/**
 * Generate sample amounts up to `maxFillAmount`.
 */
export declare function getSampleAmounts(maxFillAmount: BigNumber, numSamples: number, expBase?: number): BigNumber[];
declare type BatchedOperationResult<T> = T extends BatchedOperation<infer TResult> ? TResult : never;
/**
 * Encapsulates interactions with the `ERC20BridgeSampler` contract.
 */
export declare class DexOrderSampler extends SamplerOperations {
    readonly chainId: ChainId;
    private readonly _samplerOverrides?;
    constructor(chainId: ChainId, _samplerContract: ERC20BridgeSamplerContract, _samplerOverrides?: SamplerOverrides | undefined, poolsCaches?: PoolsCacheMap, tokenAdjacencyGraph?: TokenAdjacencyGraph, liquidityProviderRegistry?: LiquidityProviderRegistry, bancorServiceFn?: () => Promise<BancorService | undefined>);
    executeAsync<T1>(...ops: [T1]): Promise<[
        BatchedOperationResult<T1>
    ]>;
    executeAsync<T1, T2>(...ops: [T1, T2]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>
    ]>;
    executeAsync<T1, T2, T3>(...ops: [T1, T2, T3]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>
    ]>;
    executeAsync<T1, T2, T3, T4>(...ops: [T1, T2, T3, T4]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>,
        BatchedOperationResult<T4>
    ]>;
    executeAsync<T1, T2, T3, T4, T5>(...ops: [T1, T2, T3, T4, T5]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>,
        BatchedOperationResult<T4>,
        BatchedOperationResult<T5>
    ]>;
    executeAsync<T1, T2, T3, T4, T5, T6>(...ops: [T1, T2, T3, T4, T5, T6]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>,
        BatchedOperationResult<T4>,
        BatchedOperationResult<T5>,
        BatchedOperationResult<T6>
    ]>;
    executeAsync<T1, T2, T3, T4, T5, T6, T7>(...ops: [T1, T2, T3, T4, T5, T6, T7]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>,
        BatchedOperationResult<T4>,
        BatchedOperationResult<T5>,
        BatchedOperationResult<T6>,
        BatchedOperationResult<T7>
    ]>;
    executeAsync<T1, T2, T3, T4, T5, T6, T7, T8>(...ops: [T1, T2, T3, T4, T5, T6, T7, T8]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>,
        BatchedOperationResult<T4>,
        BatchedOperationResult<T5>,
        BatchedOperationResult<T6>,
        BatchedOperationResult<T7>,
        BatchedOperationResult<T8>
    ]>;
    executeAsync<T1, T2, T3, T4, T5, T6, T7, T8, T9>(...ops: [T1, T2, T3, T4, T5, T6, T7, T8, T9]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>,
        BatchedOperationResult<T4>,
        BatchedOperationResult<T5>,
        BatchedOperationResult<T6>,
        BatchedOperationResult<T7>,
        BatchedOperationResult<T8>,
        BatchedOperationResult<T9>
    ]>;
    executeAsync<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(...ops: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]): Promise<[
        BatchedOperationResult<T1>,
        BatchedOperationResult<T2>,
        BatchedOperationResult<T3>,
        BatchedOperationResult<T4>,
        BatchedOperationResult<T5>,
        BatchedOperationResult<T6>,
        BatchedOperationResult<T7>,
        BatchedOperationResult<T8>,
        BatchedOperationResult<T9>,
        BatchedOperationResult<T10>
    ]>;
    /**
     * Run a series of operations from `DexOrderSampler.ops` in a single transaction.
     * Takes an arbitrary length array, but is not typesafe.
     */
    executeBatchAsync<T extends Array<BatchedOperation<any>>>(ops: T): Promise<any[]>;
}
export {};
//# sourceMappingURL=sampler.d.ts.map