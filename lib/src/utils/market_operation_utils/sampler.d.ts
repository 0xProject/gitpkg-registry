import { ERC20BridgeSamplerContract } from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { SamplerOverrides } from '../../types';
import { BalancerPoolsCache } from './balancer_utils';
import { BatchedOperation } from './types';
/**
 * Generate sample amounts up to `maxFillAmount`.
 */
export declare function getSampleAmounts(maxFillAmount: BigNumber, numSamples: number, expBase?: number): BigNumber[];
declare type BatchedOperationResult<T> = T extends BatchedOperation<infer TResult> ? TResult : never;
/**
 * Encapsulates interactions with the `ERC20BridgeSampler` contract.
 */
export declare class DexOrderSampler {
    private readonly _samplerContract;
    private readonly _samplerOverrides?;
    balancerPoolsCache: BalancerPoolsCache;
    /**
     * Composable operations that can be batched in a single transaction,
     * for use with `DexOrderSampler.executeAsync()`.
     */
    static ops: {
        getOrderFillableTakerAmounts(orders: import("@0x/types").SignedOrder[], devUtilsAddress: string): BatchedOperation<BigNumber[]>;
        getOrderFillableMakerAmounts(orders: import("@0x/types").SignedOrder[], devUtilsAddress: string): BatchedOperation<BigNumber[]>;
        getKyberSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getKyberBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: import("./types").FakeBuyOpts): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").UniswapV2FillData>;
        getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").UniswapV2FillData>;
        getLiquidityProviderSellQuotes(registryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getLiquidityProviderBuyQuotes(registryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: import("./types").FakeBuyOpts): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getMultiBridgeSellQuotes(multiBridgeAddress: string, makerToken: string, intermediateToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").FillData>;
        getCurveSellQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").CurveFillData>;
        getCurveBuyQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").CurveFillData>;
        getBalancerSellQuotes(pool: import("./balancer_utils").BalancerPool, takerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").BalancerFillData>;
        getBalancerBuyQuotes(pool: import("./balancer_utils").BalancerPool, makerFillAmounts: BigNumber[]): import("./types").SourceQuoteOperation<import("./types").BalancerFillData>;
        getMedianSellRateAsync: (sources: import("./types").ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined) => Promise<BatchedOperation<BigNumber>>;
        constant<T>(result: T): BatchedOperation<T>;
        getLiquidityProviderFromRegistry(registryAddress: string, makerToken: string, takerToken: string): BatchedOperation<string>;
        getSellQuotesAsync: (sources: import("./types").ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined) => Promise<BatchedOperation<import("./types").DexSample<import("./types").FillData>[][]>>;
        getBuyQuotesAsync: (sources: import("./types").ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, fakeBuyOpts?: import("./types").FakeBuyOpts) => Promise<BatchedOperation<import("./types").DexSample<import("./types").FillData>[][]>>;
    };
    constructor(_samplerContract: ERC20BridgeSamplerContract, _samplerOverrides?: SamplerOverrides | undefined, balancerPoolsCache?: BalancerPoolsCache);
    executeAsync<T1>(...ops: [T1]): Promise<[BatchedOperationResult<T1>]>;
    executeAsync<T1, T2>(...ops: [T1, T2]): Promise<[BatchedOperationResult<T1>, BatchedOperationResult<T2>]>;
    executeAsync<T1, T2, T3>(...ops: [T1, T2, T3]): Promise<[BatchedOperationResult<T1>, BatchedOperationResult<T2>, BatchedOperationResult<T3>]>;
    executeAsync<T1, T2, T3, T4>(...ops: [T1, T2, T3, T4]): Promise<[BatchedOperationResult<T1>, BatchedOperationResult<T2>, BatchedOperationResult<T3>, BatchedOperationResult<T4>]>;
    executeAsync<T1, T2, T3, T4, T5>(...ops: [T1, T2, T3, T4, T5]): Promise<[BatchedOperationResult<T1>, BatchedOperationResult<T2>, BatchedOperationResult<T3>, BatchedOperationResult<T4>, BatchedOperationResult<T5>]>;
    executeAsync<T1, T2, T3, T4, T5, T6>(...ops: [T1, T2, T3, T4, T5, T6]): Promise<[BatchedOperationResult<T1>, BatchedOperationResult<T2>, BatchedOperationResult<T3>, BatchedOperationResult<T4>, BatchedOperationResult<T5>, BatchedOperationResult<T6>]>;
    executeAsync<T1, T2, T3, T4, T5, T6, T7>(...ops: [T1, T2, T3, T4, T5, T6, T7]): Promise<[BatchedOperationResult<T1>, BatchedOperationResult<T2>, BatchedOperationResult<T3>, BatchedOperationResult<T4>, BatchedOperationResult<T5>, BatchedOperationResult<T6>, BatchedOperationResult<T7>]>;
    executeAsync<T1, T2, T3, T4, T5, T6, T7, T8>(...ops: [T1, T2, T3, T4, T5, T6, T7, T8]): Promise<[BatchedOperationResult<T1>, BatchedOperationResult<T2>, BatchedOperationResult<T3>, BatchedOperationResult<T4>, BatchedOperationResult<T5>, BatchedOperationResult<T6>, BatchedOperationResult<T7>, BatchedOperationResult<T8>]>;
    /**
     * Run a series of operations from `DexOrderSampler.ops` in a single transaction.
     * Takes an arbitrary length array, but is not typesafe.
     */
    executeBatchAsync<T extends Array<BatchedOperation<any>>>(ops: T): Promise<any[]>;
}
export {};
//# sourceMappingURL=sampler.d.ts.map