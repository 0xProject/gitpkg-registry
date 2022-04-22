import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { SignedNativeOrder } from '../../types';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { AaveV2ReservesCache } from './aave_reserves_cache';
import { BancorService } from './bancor_service';
import { CompoundCTokenCache } from './compound_ctoken_cache';
import { PoolsCache } from './pools_cache';
import { BalancerV2SwapInfoCache } from './pools_cache/balancer_v2_utils_new';
import { SourceFilters } from './source_filters';
import { AaveV2FillData, AaveV2Info, BalancerFillData, BalancerSwapInfo, BalancerV2BatchSwapFillData, BalancerV2FillData, BalancerV2PoolInfo, BancorFillData, BatchedOperation, CompoundFillData, CurveFillData, CurveInfo, DexSample, DODOFillData, ERC20BridgeSource, GeistFillData, GeistInfo, GenericRouterFillData, KyberDmmFillData, KyberSamplerOpts, LidoFillData, LidoInfo, LiquidityProviderFillData, LiquidityProviderRegistry, MakerPsmFillData, MooniswapFillData, MultiHopFillData, PsmInfo, ShellFillData, SourceQuoteOperation, SourcesWithPoolsCache, TokenAdjacencyGraph, UniswapV2FillData, UniswapV3FillData } from './types';
/**
 * Source filters for `getTwoHopBuyQuotes()` and `getTwoHopSellQuotes()`.
 */
export declare const TWO_HOP_SOURCE_FILTERS: SourceFilters;
/**
 * Source filters for `getSellQuotes()` and `getBuyQuotes()`.
 */
export declare const BATCH_SOURCE_FILTERS: SourceFilters;
export declare type PoolsCacheMap = {
    [key in Exclude<SourcesWithPoolsCache, ERC20BridgeSource.BalancerV2>]: PoolsCache;
} & {
    [ERC20BridgeSource.BalancerV2]: BalancerV2SwapInfoCache;
};
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare class SamplerOperations {
    readonly chainId: ChainId;
    protected readonly _samplerContract: ERC20BridgeSamplerContract;
    protected readonly tokenAdjacencyGraph: TokenAdjacencyGraph;
    readonly liquidityProviderRegistry: LiquidityProviderRegistry;
    readonly poolsCaches: PoolsCacheMap;
    readonly aaveReservesCache: AaveV2ReservesCache | undefined;
    readonly compoundCTokenCache: CompoundCTokenCache | undefined;
    protected _bancorService?: BancorService;
    static constant<T>(result: T): BatchedOperation<T>;
    constructor(chainId: ChainId, _samplerContract: ERC20BridgeSamplerContract, poolsCaches?: PoolsCacheMap, tokenAdjacencyGraph?: TokenAdjacencyGraph, liquidityProviderRegistry?: LiquidityProviderRegistry, bancorServiceFn?: () => Promise<BancorService | undefined>);
    getTokenDecimals(tokens: string[]): BatchedOperation<BigNumber[]>;
    isAddressContract(address: string): BatchedOperation<boolean>;
    getGasLeft(): BatchedOperation<BigNumber>;
    getBlockNumber(): BatchedOperation<BigNumber>;
    getLimitOrderFillableTakerAmounts(orders: SignedNativeOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getLimitOrderFillableMakerAmounts(orders: SignedNativeOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(kyberOpts: KyberSamplerOpts, reserveOffset: BigNumber, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getKyberBuyQuotes(kyberOpts: KyberSamplerOpts, reserveOffset: BigNumber, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getKyberDmmSellQuotes(router: string, tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<KyberDmmFillData>;
    getKyberDmmBuyQuotes(router: string, tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<KyberDmmFillData>;
    getUniswapSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getUniswapBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getUniswapV2SellQuotes(router: string, tokenAddressPath: string[], takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<UniswapV2FillData>;
    getUniswapV2BuyQuotes(router: string, tokenAddressPath: string[], makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<UniswapV2FillData>;
    getLiquidityProviderSellQuotes(providerAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], gasCost: number, source?: ERC20BridgeSource): SourceQuoteOperation<LiquidityProviderFillData>;
    getLiquidityProviderBuyQuotes(providerAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], gasCost: number, source?: ERC20BridgeSource): SourceQuoteOperation<LiquidityProviderFillData>;
    getCurveSellQuotes(pool: CurveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<CurveFillData>;
    getCurveBuyQuotes(pool: CurveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<CurveFillData>;
    getSmoothySellQuotes(pool: CurveInfo, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getSmoothyBuyQuotes(pool: CurveInfo, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): SourceQuoteOperation<CurveFillData>;
    getBalancerV2MulthopSellQuotes(vault: string, quoteSwaps: BalancerSwapInfo, // Should always be sell swap steps.
    fillSwaps: BalancerSwapInfo, // Should always be sell swap steps.
    takerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerV2BatchSwapFillData>;
    getBalancerV2MulthopBuyQuotes(vault: string, quoteSwaps: BalancerSwapInfo, // Should always be buy swap steps.
    fillSwaps: BalancerSwapInfo, // Should always be a sell quote.
    makerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerV2BatchSwapFillData>;
    getBalancerV2SellQuotes(poolInfo: BalancerV2PoolInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerV2FillData>;
    getBalancerV2BuyQuotes(poolInfo: BalancerV2PoolInfo, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerV2FillData>;
    getBalancerSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerFillData>;
    getBalancerBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source: ERC20BridgeSource): SourceQuoteOperation<BalancerFillData>;
    getMStableSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getMStableBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<GenericRouterFillData>;
    getBancorSellQuotes(registry: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<BancorFillData>;
    getBancorBuyQuotes(registry: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<BancorFillData>;
    getMooniswapSellQuotes(registry: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<MooniswapFillData>;
    getMooniswapBuyQuotes(registry: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<MooniswapFillData>;
    getUniswapV3SellQuotes(router: string, quoter: string, tokenAddressPath: string[], takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<UniswapV3FillData>;
    getUniswapV3BuyQuotes(router: string, quoter: string, tokenAddressPath: string[], makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<UniswapV3FillData>;
    getTwoHopSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, sellAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getTwoHopBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, buyAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getShellSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation<ShellFillData>;
    getShellBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): SourceQuoteOperation;
    getDODOSellQuotes(opts: {
        registry: string;
        helper: string;
    }, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getDODOBuyQuotes(opts: {
        registry: string;
        helper: string;
    }, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getDODOV2SellQuotes(registry: string, offset: BigNumber, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getDODOV2BuyQuotes(registry: string, offset: BigNumber, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getMakerPsmSellQuotes(psmInfo: PsmInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<MakerPsmFillData>;
    getMakerPsmBuyQuotes(psmInfo: PsmInfo, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<MakerPsmFillData>;
    getLidoSellQuotes(lidoInfo: LidoInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<LidoFillData>;
    getLidoBuyQuotes(lidoInfo: LidoInfo, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<LidoFillData>;
    getAaveV2SellQuotes(aaveInfo: AaveV2Info, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<AaveV2FillData>;
    getAaveV2BuyQuotes(aaveInfo: AaveV2Info, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<AaveV2FillData>;
    getGeistSellQuotes(geistInfo: GeistInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<GeistFillData>;
    getGeistBuyQuotes(geistInfo: GeistInfo, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<GeistFillData>;
    getCompoundSellQuotes(cToken: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<CompoundFillData>;
    getCompoundBuyQuotes(cToken: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<CompoundFillData>;
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
//# sourceMappingURL=sampler_operations.d.ts.map