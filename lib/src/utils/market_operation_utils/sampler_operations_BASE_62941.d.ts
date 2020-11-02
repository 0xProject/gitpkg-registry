import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { BalancerPoolsCache } from './balancer_utils';
import { BancorService } from './bancor_service';
import { BalancerFillData, BancorFillData, BatchedOperation, CurveFillData, CurveInfo, DexSample, ERC20BridgeSource, LiquidityProviderFillData, MultiBridgeFillData, MultiHopFillData, SourceQuoteOperation, TokenAdjacencyGraph, UniswapV2FillData } from './types';
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare class SamplerOperations {
    protected readonly _samplerContract: ERC20BridgeSamplerContract;
    readonly bancorService?: BancorService | undefined;
    readonly balancerPoolsCache: BalancerPoolsCache;
    static constant<T>(result: T): BatchedOperation<T>;
    constructor(_samplerContract: ERC20BridgeSamplerContract, bancorService?: BancorService | undefined, balancerPoolsCache?: BalancerPoolsCache);
    getOrderFillableTakerAmounts(orders: SignedOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getOrderFillableMakerAmounts(orders: SignedOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(reserveId: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getKyberBuyQuotes(reserveId: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getLiquidityProviderSellQuotes(registryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<LiquidityProviderFillData>;
    getLiquidityProviderBuyQuotes(registryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<LiquidityProviderFillData>;
    getMultiBridgeSellQuotes(multiBridgeAddress: string, makerToken: string, intermediateToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<MultiBridgeFillData>;
    getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getCurveSellQuotes(curve: CurveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getCurveBuyQuotes(curve: CurveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getBalancerSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData>;
    getBalancerBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<BalancerFillData>;
    getBalancerSellQuotesOffChainAsync(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): Promise<Array<Array<DexSample<BalancerFillData>>>>;
    getBalancerBuyQuotesOffChainAsync(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): Promise<Array<Array<DexSample<BalancerFillData>>>>;
    getMStableSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getMStableBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getBancorSellQuotesOffChainAsync(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): Promise<Array<DexSample<BancorFillData>>>;
    getMooniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getMooniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getTwoHopSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, sellAmount: BigNumber, tokenAdjacencyGraph: TokenAdjacencyGraph, wethAddress: string, liquidityProviderRegistryAddress?: string): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getTwoHopBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, buyAmount: BigNumber, tokenAdjacencyGraph: TokenAdjacencyGraph, wethAddress: string, liquidityProviderRegistryAddress?: string): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getMedianSellRate(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, liquidityProviderRegistryAddress?: string, multiBridgeAddress?: string): BatchedOperation<BigNumber>;
    getSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, liquidityProviderRegistryAddress?: string, multiBridgeAddress?: string): BatchedOperation<DexSample[][]>;
    getBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, liquidityProviderRegistryAddress?: string): BatchedOperation<DexSample[][]>;
    private _getSellQuoteOperations;
    private _getBuyQuoteOperations;
}
//# sourceMappingURL=sampler_operations_BASE_62941.d.ts.map