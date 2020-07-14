import { BigNumber, ERC20BridgeSource, SignedOrder } from '../..';
import { BalancerPool, BalancerPoolsCache } from './balancer_utils';
import { BalancerFillData, BatchedOperation, CurveFillData, DexSample, FakeBuyOpts, SourceQuoteOperation, UniswapV2FillData } from './types';
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare const samplerOperations: {
    getOrderFillableTakerAmounts(orders: SignedOrder[]): BatchedOperation<BigNumber[]>;
    getOrderFillableMakerAmounts(orders: SignedOrder[]): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getKyberBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: FakeBuyOpts): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getLiquidityProviderSellQuotes(registryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getLiquidityProviderBuyQuotes(registryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: FakeBuyOpts): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getMultiBridgeSellQuotes(multiBridgeAddress: string, makerToken: string, intermediateToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>;
    getCurveSellQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getCurveBuyQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getBalancerSellQuotes(pool: BalancerPool, takerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData>;
    getBalancerBuyQuotes(pool: BalancerPool, makerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData>;
    getMedianSellRateAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined) => Promise<BatchedOperation<BigNumber>>;
    constant<T>(result: T): BatchedOperation<T>;
    getLiquidityProviderFromRegistry(registryAddress: string, makerToken: string, takerToken: string): BatchedOperation<string>;
    getSellQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined) => Promise<BatchedOperation<DexSample<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>[][]>>;
    getBuyQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, fakeBuyOpts?: FakeBuyOpts) => Promise<BatchedOperation<DexSample<import("@0x/asset-swapper/src/utils/market_operation_utils/types").FillData>[][]>>;
};
//# sourceMappingURL=sampler_operations.d.ts.map