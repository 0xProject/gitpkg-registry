import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { SignedNativeOrder } from '../../types';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { BalancerPoolsCache } from './balancer_utils';
import { BancorService } from './bancor_service';
import { CreamPoolsCache } from './cream_utils';
import { SourceFilters } from './source_filters';
import { BalancerFillData, BancorFillData, BatchedOperation, CurveFillData, CurveInfo, DexSample, DODOFillData, ERC20BridgeSource, GenericRouterFillData, LiquidityProviderFillData, LiquidityProviderRegistry, MooniswapFillData, MultiHopFillData, ShellFillData, SnowSwapFillData, SnowSwapInfo, SourceQuoteOperation, SwerveFillData, SwerveInfo, TokenAdjacencyGraph, UniswapV2FillData } from './types';
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
    protected readonly chainId: ChainId;
    protected readonly _samplerContract: ERC20BridgeSamplerContract;
    readonly balancerPoolsCache: BalancerPoolsCache;
    readonly creamPoolsCache: CreamPoolsCache;
    protected readonly tokenAdjacencyGraph: TokenAdjacencyGraph;
    readonly liquidityProviderRegistry: LiquidityProviderRegistry;
    protected _bancorService?: BancorService;
    static constant<T>(result: T): BatchedOperation<T>;
    constructor(chainId: ChainId, _samplerContract: ERC20BridgeSamplerContract, balancerPoolsCache?: BalancerPoolsCache, creamPoolsCache?: CreamPoolsCache, tokenAdjacencyGraph?: TokenAdjacencyGraph, liquidityProviderRegistry?: LiquidityProviderRegistry, bancorServiceFn?: () => Promise<BancorService | undefined>);
    getTokenDecimals(tokens: string[]): BatchedOperation<BigNumber[]>;
    isAddressContract(address: string): BatchedOperation<boolean>;
    getLimitOrderFillableTakerAmounts(orders: SignedNativeOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getLimitOrderFillableMakerAmounts(orders: SignedNativeOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(reserveOffset: BigNumber, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getKyberBuyQuotes(reserveOffset: BigNumber, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getUniswapBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getUniswapV2SellQuotes(router: string, tokenAddressPath: string[], takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<UniswapV2FillData>;
    getUniswapV2BuyQuotes(router: string, tokenAddressPath: string[], makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<UniswapV2FillData>;
    getLiquidityProviderSellQuotes(providerAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<LiquidityProviderFillData>;
    getLiquidityProviderBuyQuotes(providerAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<LiquidityProviderFillData>;
    getEth2DaiSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getEth2DaiBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getCurveSellQuotes(pool: CurveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getCurveBuyQuotes(pool: CurveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getSwerveSellQuotes(pool: SwerveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<SwerveFillData>;
    getSwerveBuyQuotes(pool: SwerveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<SwerveFillData>;
    getSnowSwapSellQuotes(pool: SnowSwapInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<SnowSwapFillData>;
    getSnowSwapBuyQuotes(pool: SnowSwapInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<SnowSwapFillData>;
    getBalancerSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerFillData>;
    getBalancerBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerFillData>;
    getBalancerSellQuotesOffChainAsync(makerToken: string, takerToken: string, _takerFillAmounts: BigNumber[]): Promise<Array<Array<DexSample<BalancerFillData>>>>;
    getBalancerBuyQuotesOffChainAsync(makerToken: string, takerToken: string, _makerFillAmounts: BigNumber[]): Promise<Array<Array<DexSample<BalancerFillData>>>>;
    getCreamSellQuotesOffChainAsync(makerToken: string, takerToken: string, _takerFillAmounts: BigNumber[]): Promise<Array<Array<DexSample<BalancerFillData>>>>;
    getCreamBuyQuotesOffChainAsync(makerToken: string, takerToken: string, _makerFillAmounts: BigNumber[]): Promise<Array<Array<DexSample<BalancerFillData>>>>;
    getMStableSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getMStableBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getBancorSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<BancorFillData>;
    getBancorBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<BancorFillData>;
    getMooniswapSellQuotes(registry: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<MooniswapFillData>;
    getMooniswapBuyQuotes(registry: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<MooniswapFillData>;
    getTwoHopSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, sellAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getTwoHopBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, buyAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getShellSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<ShellFillData>;
    getShellBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getDODOSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getDODOBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getDODOV2SellQuotes(registry: string, offset: BigNumber, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getDODOV2BuyQuotes(registry: string, offset: BigNumber, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getMedianSellRate(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber): BatchedOperation<BigNumber>;
    getSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<DexSample[][]>;
    getBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): BatchedOperation<DexSample[][]>;
    private _getSellQuoteOperations;
    private _getBuyQuoteOperations;
    /**
     * Wraps `subOps` operations into a batch call to the sampler
     * @param subOps An array of Sampler operations
     * @param resultHandler The handler of the parsed batch results
     * @param revertHandler The handle for when the batch operation reverts. The result data is provided as an argument
     */
    private _createBatch;
}
//# sourceMappingURL=sampler_operations_REMOTE_37624.d.ts.map