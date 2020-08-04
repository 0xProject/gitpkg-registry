import { BigNumber, ERC20BridgeSource, SignedOrder } from '../..';
import { BalancerPool, BalancerPoolsCache } from './balancer_utils';
import { BancorService } from './bancor_service';
import { BalancerFillData, BancorQuoteData, BatchedOperation, CurveFillData, CurveInfo, DexSample, FillData, SourceQuoteOperation, UniswapV2FillData } from './types';
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare const samplerOperations: {
    getOrderFillableTakerAmounts(orders: SignedOrder[], devUtilsAddress: string): BatchedOperation<BigNumber[]>;
    getOrderFillableMakerAmounts(orders: SignedOrder[], devUtilsAddress: string): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getKyberBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData, BigNumber>;
    getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData, BigNumber>;
    getLiquidityProviderSellQuotes(registryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getLiquidityProviderBuyQuotes(registryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getMultiBridgeSellQuotes(multiBridgeAddress: string, makerToken: string, intermediateToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<FillData, BigNumber>;
    getCurveSellQuotes(curve: CurveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData, BigNumber>;
    getCurveBuyQuotes(curve: CurveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData, BigNumber>;
    getBancorSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], bancorService: BancorService): SourceQuoteOperation<FillData, BancorQuoteData>;
    getBancorBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], bancorService: BancorService): SourceQuoteOperation<FillData, BancorQuoteData>;
    getBalancerSellQuotes(pool: BalancerPool, takerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData, BigNumber>;
    getBalancerBuyQuotes(pool: BalancerPool, makerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData, BigNumber>;
    getMedianSellRateAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined, bancorService?: BancorService | undefined) => Promise<BatchedOperation<BigNumber>>;
    constant<T>(result: T): BatchedOperation<T>;
    getLiquidityProviderFromRegistry(registryAddress: string, makerToken: string, takerToken: string): BatchedOperation<string>;
    getSellQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined, bancorService?: BancorService | undefined) => Promise<BatchedOperation<DexSample<FillData>[][]>>;
    getBuyQuotesAsync: (sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, balancerPoolsCache?: BalancerPoolsCache | undefined, liquidityProviderRegistryAddress?: string | undefined, bancorService?: BancorService | undefined) => Promise<BatchedOperation<DexSample<FillData>[][]>>;
};
//# sourceMappingURL=sampler_operations.d.ts.map