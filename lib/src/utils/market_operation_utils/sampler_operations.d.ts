import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { BalancerPoolsCache } from './balancer_utils';
import { BancorService } from './bancor_service';
import { CreamPoolsCache } from './cream_utils';
import { SourceFilters } from './source_filters';
import { BalancerFillData, BancorFillData, BatchedOperation, CurveFillData, CurveInfo, DexSample, DODOFillData, ERC20BridgeSource, LiquidityProviderFillData, LiquidityProviderRegistry, MooniswapFillData, MultiHopFillData, ShellFillData, SnowSwapFillData, SnowSwapInfo, SourceQuoteOperation, SushiSwapFillData, SwerveFillData, SwerveInfo, TokenAdjacencyGraph, UniswapV2FillData } from './types';
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
    readonly provider?: import("@0x/asset-swapper/node_modules/ethereum-types").Web3JsV1Provider | import("@0x/asset-swapper/node_modules/ethereum-types").Web3JsV2Provider | import("@0x/asset-swapper/node_modules/ethereum-types").Web3JsV3Provider | import("@0x/asset-swapper/node_modules/ethereum-types").GanacheProvider | import("@0x/asset-swapper/node_modules/ethereum-types").EIP1193Provider | import("@0x/asset-swapper/node_modules/ethereum-types").ZeroExProvider | undefined;
    readonly balancerPoolsCache: BalancerPoolsCache;
    readonly creamPoolsCache: CreamPoolsCache;
    protected readonly getBancorServiceFn?: (() => BancorService) | undefined;
    protected readonly tokenAdjacencyGraph: TokenAdjacencyGraph;
    readonly liquidityProviderRegistry: LiquidityProviderRegistry;
    protected _bancorService?: BancorService;
    static constant<T>(result: T): BatchedOperation<T>;
    constructor(_samplerContract: ERC20BridgeSamplerContract, provider?: import("@0x/asset-swapper/node_modules/ethereum-types").Web3JsV1Provider | import("@0x/asset-swapper/node_modules/ethereum-types").Web3JsV2Provider | import("@0x/asset-swapper/node_modules/ethereum-types").Web3JsV3Provider | import("@0x/asset-swapper/node_modules/ethereum-types").GanacheProvider | import("@0x/asset-swapper/node_modules/ethereum-types").EIP1193Provider | import("@0x/asset-swapper/node_modules/ethereum-types").ZeroExProvider | undefined, balancerPoolsCache?: BalancerPoolsCache, creamPoolsCache?: CreamPoolsCache, getBancorServiceFn?: (() => BancorService) | undefined, // for dependency injection in tests
    tokenAdjacencyGraph?: TokenAdjacencyGraph, liquidityProviderRegistry?: LiquidityProviderRegistry);
    getBancorServiceAsync(): Promise<BancorService>;
    getTokenDecimals(makerTokenAddress: string, takerTokenAddress: string): BatchedOperation<BigNumber[]>;
    getOrderFillableTakerAmounts(orders: SignedOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getOrderFillableMakerAmounts(orders: SignedOrder[], exchangeAddress: string): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(reserveId: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getKyberBuyQuotes(reserveId: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<UniswapV2FillData>;
    getLiquidityProviderSellQuotes(providerAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<LiquidityProviderFillData>;
    getLiquidityProviderBuyQuotes(providerAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<LiquidityProviderFillData>;
    getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
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
    getMStableSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getMStableBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getBancorSellQuotesOffChainAsync(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): Promise<Array<DexSample<BancorFillData>>>;
    getMooniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<MooniswapFillData>;
    getMooniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<MooniswapFillData>;
    getTwoHopSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, sellAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getTwoHopBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, buyAmount: BigNumber): BatchedOperation<Array<DexSample<MultiHopFillData>>>;
    getSushiSwapSellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<SushiSwapFillData>;
    getSushiSwapBuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<SushiSwapFillData>;
    getCryptoComSellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): SourceQuoteOperation<SushiSwapFillData>;
    getCryptoComBuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): SourceQuoteOperation<SushiSwapFillData>;
    getShellSellQuotes(poolAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<ShellFillData>;
    getShellBuyQuotes(poolAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation;
    getDODOSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getDODOBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): SourceQuoteOperation<DODOFillData>;
    getMedianSellRate(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber): BatchedOperation<BigNumber>;
    getSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<DexSample[][]>;
    getBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): BatchedOperation<DexSample[][]>;
    private _getSellQuoteOperations;
    private _getBuyQuoteOperations;
}
//# sourceMappingURL=sampler_operations.d.ts.map