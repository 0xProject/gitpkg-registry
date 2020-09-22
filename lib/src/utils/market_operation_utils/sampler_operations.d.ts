import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { BalancerPoolsCache } from './balancer_utils';
import { BancorService } from './bancor_service';
import { SourceFilters } from './source_filters';
import { BalancerFillData, BancorFillData, BatchedOperation, CurveFillData, CurveInfo, DexSample, ERC20BridgeSource, LiquidityProviderFillData, MultiBridgeFillData, MultiHopFillData, SourceQuoteOperation, SushiSwapFillData, SwerveFillData, SwerveInfo, TokenAdjacencyGraph, UniswapV2FillData } from './types';
/**
 * Source filters for `getTwoHopBuyQuotes()` and `getTwoHopSellQuotes()`.
 */
export declare const TWO_HOP_SOURCE_FILTERS: SourceFilters;
/**
 * Source filters for `getSellQuotes()` and `getBuyQuotes()`.
 */
export declare const BATCH_SOURCE_FILTERS: SourceFilters;
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare class SamplerOperations {
    protected readonly _samplerContract: ERC20BridgeSamplerContract;
    readonly provider?: import("ethereum-types").Web3JsV1Provider | import("ethereum-types").Web3JsV2Provider | import("ethereum-types").Web3JsV3Provider | import("ethereum-types").GanacheProvider | import("ethereum-types").EIP1193Provider | import("ethereum-types").ZeroExProvider | undefined;
    readonly balancerPoolsCache: BalancerPoolsCache;
    protected readonly getBancorServiceFn?: (() => BancorService) | undefined;
    protected _bancorService?: BancorService;
    static constant<T>(result: T): BatchedOperation<T>;
    constructor(_samplerContract: ERC20BridgeSamplerContract, provider?: import("ethereum-types").Web3JsV1Provider | import("ethereum-types").Web3JsV2Provider | import("ethereum-types").Web3JsV3Provider | import("ethereum-types").GanacheProvider | import("ethereum-types").EIP1193Provider | import("ethereum-types").ZeroExProvider | undefined, balancerPoolsCache?: BalancerPoolsCache, getBancorServiceFn?: (() => BancorService) | undefined);
    getBancorServiceAsync(): Promise<BancorService>;
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
    getSwerveSellQuotes(pool: SwerveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<SwerveFillData>;
    getSwerveBuyQuotes(pool: SwerveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<SwerveFillData>;
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
    getSushiSwapSellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<SushiSwapFillData>;
    getSushiSwapBuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<SushiSwapFillData>;
    getMedianSellRate(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, liquidityProviderRegistryAddress?: string, multiBridgeAddress?: string): BatchedOperation<BigNumber>;
    getSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, liquidityProviderRegistryAddress?: string, multiBridgeAddress?: string): BatchedOperation<DexSample[][]>;
    getBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, liquidityProviderRegistryAddress?: string): BatchedOperation<DexSample[][]>;
    private _getSellQuoteOperations;
    private _getBuyQuoteOperations;
}
//# sourceMappingURL=sampler_operations.d.ts.map