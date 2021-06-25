import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { SignedNativeOrder } from '../../types';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { BancorService } from './bancor_service';
import { CurveDetailedInfo } from './bridge_source_utils';
import { PoolsCache } from './pools_cache';
import { SourceFilters } from './source_filters';
import { BalancerFillData, BalancerV2FillData, BalancerV2PoolInfo, BancorFillData, BatchedOperation, CurveFillData, DexSample, DODOFillData, ERC20BridgeSource, GenericRouterFillData, KyberDmmFillData, KyberFillData, KyberSamplerOpts, LiquidityProviderFillData, LiquidityProviderRegistry, MakerPsmFillData, MeasuredSourceQuoteOperation, MooniswapFillData, MultiHopFillData, PsmInfo, ShellFillData, SourcesWithPoolsCache, TokenAdjacencyGraph, UniswapV2FillData, UniswapV3FillData } from './types';
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
    readonly chainId: ChainId;
    protected readonly _samplerContract: ERC20BridgeSamplerContract;
    readonly tokenAdjacencyGraph: TokenAdjacencyGraph;
    readonly liquidityProviderRegistry: LiquidityProviderRegistry;
    readonly poolsCaches: {
        [key in SourcesWithPoolsCache]: PoolsCache;
    };
    protected _bancorService?: BancorService;
    static constant<T>(result: T): BatchedOperation<T>;
    constructor(chainId: ChainId, _samplerContract: ERC20BridgeSamplerContract, poolsCaches?: {
        [key in SourcesWithPoolsCache]: PoolsCache;
    }, tokenAdjacencyGraph?: TokenAdjacencyGraph, liquidityProviderRegistry?: LiquidityProviderRegistry, bancorServiceFn?: () => Promise<BancorService | undefined>);
    getTokenDecimals(tokens: string[]): BatchedOperation<BigNumber[]>;
    getCode(address: string): BatchedOperation<string>;
    isAddressContract(address: string): BatchedOperation<boolean>;
    getBalanceOf(tokens: string[], address: string): BatchedOperation<BigNumber[]>;
    getLimitOrderFillableTakerAmounts(orders: SignedNativeOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getLimitOrderFillableMakerAmounts(orders: SignedNativeOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(kyberOpts: KyberSamplerOpts, reserveOffset: BigNumber, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<KyberFillData>;
    getKyberBuyQuotes(kyberOpts: KyberSamplerOpts, reserveOffset: BigNumber, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<KyberFillData>;
    getKyberDmmSellQuotes(router: string, tokenAddressPath: string[], takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<KyberDmmFillData>;
    getKyberDmmBuyQuotes(router: string, tokenAddressPath: string[], makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<KyberDmmFillData>;
    getUniswapSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<GenericRouterFillData>;
    getUniswapBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<GenericRouterFillData>;
    getUniswapV2SellQuotes(router: string, tokenAddressPath: string[], takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<UniswapV2FillData>;
    getUniswapV2BuyQuotes(router: string, tokenAddressPath: string[], makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<UniswapV2FillData>;
    getLiquidityProviderSellQuotes(providerAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], gasCost: number): MeasuredSourceQuoteOperation<LiquidityProviderFillData>;
    getLiquidityProviderBuyQuotes(providerAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], gasCost: number): MeasuredSourceQuoteOperation<LiquidityProviderFillData>;
    getEth2DaiSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<GenericRouterFillData>;
    getEth2DaiBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<GenericRouterFillData>;
    getCurveSellQuotes(pool: CurveDetailedInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<CurveFillData>;
    getCurveV2SellQuotes(pool: CurveDetailedInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<CurveFillData>;
    getCurveBuyQuotes(pool: CurveDetailedInfo, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<CurveFillData>;
    getBalancerV2SellQuotes(poolInfo: BalancerV2PoolInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source: ERC20BridgeSource): MeasuredSourceQuoteOperation<BalancerV2FillData>;
    getBalancerV2BuyQuotes(poolInfo: BalancerV2PoolInfo, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source: ERC20BridgeSource): MeasuredSourceQuoteOperation<BalancerV2FillData>;
    getBalancerSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source: ERC20BridgeSource): MeasuredSourceQuoteOperation<BalancerFillData>;
    getBalancerBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source: ERC20BridgeSource): MeasuredSourceQuoteOperation<BalancerFillData>;
    getMStableSellQuotes(router: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<GenericRouterFillData>;
    getMStableBuyQuotes(router: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<GenericRouterFillData>;
    getBancorSellQuotes(registry: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<BancorFillData>;
    getBancorBuyQuotes(registry: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<BancorFillData>;
    getMooniswapSellQuotes(registry: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<MooniswapFillData>;
    getMooniswapBuyQuotes(registry: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<MooniswapFillData>;
    getUniswapV3SellQuotes(router: string, quoter: string, tokenAddressPath: string[], takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<UniswapV3FillData>;
    getUniswapV3BuyQuotes(router: string, quoter: string, tokenAddressPath: string[], makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<UniswapV3FillData>;
    getTwoHopSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, sellAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getTwoHopBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, buyAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getShellSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<ShellFillData>;
    getShellBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], source?: ERC20BridgeSource): MeasuredSourceQuoteOperation<ShellFillData>;
    getDODOSellQuotes(opts: {
        registry: string;
        helper: string;
    }, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<DODOFillData>;
    getDODOBuyQuotes(opts: {
        registry: string;
        helper: string;
    }, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<DODOFillData>;
    getDODOV2SellQuotes(registry: string, offset: BigNumber, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<DODOFillData>;
    getDODOV2BuyQuotes(registry: string, offset: BigNumber, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<DODOFillData>;
    getMakerPsmSellQuotes(psmInfo: PsmInfo, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<MakerPsmFillData>;
    getMakerPsmBuyQuotes(psmInfo: PsmInfo, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): MeasuredSourceQuoteOperation<MakerPsmFillData>;
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
//# sourceMappingURL=sampler_operations_REMOTE_36426.d.ts.map