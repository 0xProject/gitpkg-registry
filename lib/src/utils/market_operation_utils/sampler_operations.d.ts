import { BigNumber, ERC20BridgeSource, SignedOrder } from '../..';
import { BalancerPool, BalancerPoolsCache } from './balancer_utils';
import { BalancerFillData, BatchedOperation, CurveFillData, DexSample, FakeBuyOpts, SourceQuoteOperation, UniswapV2FillData } from './types';
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare const samplerOperations: {
    getOrderFillableTakerAmounts(orders: SignedOrder[], devUtilsAddress: string): BatchedOperation<BigNumber[]>;
    getOrderFillableMakerAmounts(orders: SignedOrder[], devUtilsAddress: string): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getKyberBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: FakeBuyOpts): SourceQuoteOperation;
    getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getLiquidityProviderSellQuotes(registryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getLiquidityProviderBuyQuotes(registryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: FakeBuyOpts): SourceQuoteOperation;
    getMultiBridgeSellQuotes(multiBridgeAddress: string, makerToken: string, intermediateToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getCurveSellQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getCurveBuyQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getBalancerSellQuotes(pool: BalancerPool, takerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData>;
    getBalancerBuyQuotes(pool: BalancerPool, makerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData>;
    getMedianSellRateAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined) => Promise<BatchedOperation<BigNumber>>;
    constant<T>(result: T): BatchedOperation<T>;
    getLiquidityProviderFromRegistry(registryAddress: string, makerToken: string, takerToken: string): BatchedOperation<string>;
    getSellQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined) => Promise<BatchedOperation<DexSample[][]>>;
    getBuyQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, fakeBuyOpts?: FakeBuyOpts) => Promise<BatchedOperation<DexSample[][]>>;
};
//# sourceMappingURL=sampler_operations.d.ts.map