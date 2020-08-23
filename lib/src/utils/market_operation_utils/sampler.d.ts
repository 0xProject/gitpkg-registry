import { BigNumber } from '@0x/utils';
import { SamplerOverrides } from '../../types';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { BalancerPoolsCache } from './balancer_utils';
import { BancorService } from './bancor_service';
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
    bancorService?: BancorService | undefined;
    balancerPoolsCache: BalancerPoolsCache;
    /**
     * Composable operations that can be batched in a single transaction,
     * for use with `DexOrderSampler.executeAsync()`.
     */
    static ops: {
        getOrderFillableTakerAmounts(orders: import("@0x/types").SignedOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
        getOrderFillableMakerAmounts(orders: import("@0x/types").SignedOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
        getKyberSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getKyberBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").UniswapV2FillData>;
        getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").UniswapV2FillData>;
        getLiquidityProviderSellQuotes(registryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getLiquidityProviderBuyQuotes(registryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getMultiBridgeSellQuotes(multiBridgeAddress: string, makerToken: string, intermediateToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getCurveSellQuotes(curve: import("@0x/asset-swapper/src/utils/market_operation_utils/types").CurveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").CurveFillData>;
        getCurveBuyQuotes(curve: import("@0x/asset-swapper/src/utils/market_operation_utils/types").CurveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").CurveFillData>;
        getBancorSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], bancorService: BancorService): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").BancorFillData>;
        getBalancerSellQuotes(pool: import("@0x/asset-swapper/src/utils/market_operation_utils/balancer_utils").BalancerPool, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").BalancerFillData>;
        getBalancerBuyQuotes(pool: import("@0x/asset-swapper/src/utils/market_operation_utils/balancer_utils").BalancerPool, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").BalancerFillData>;
        getMStableSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getMStableBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getMooniswapellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getMooniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): import("@0x/asset-swapper/src/utils/market_operation_utils/types").SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
        getMedianSellRateAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined, bancorService?: BancorService | undefined) => Promise<BatchedOperation<BigNumber>>;
        constant<T>(result: T): BatchedOperation<T>;
        getLiquidityProviderFromRegistry(registryAddress: string, makerToken: string, takerToken: string): BatchedOperation<string>;
        getSellQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined, bancorService?: BancorService | undefined) => Promise<BatchedOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").DexSample<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>[][]>>;
        getBuyQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, bancorService?: BancorService | undefined) => Promise<BatchedOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").DexSample<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>[][]>>;
    };
    constructor(_samplerContract: ERC20BridgeSamplerContract, _samplerOverrides?: SamplerOverrides | undefined, bancorService?: BancorService | undefined, balancerPoolsCache?: BalancerPoolsCache);
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