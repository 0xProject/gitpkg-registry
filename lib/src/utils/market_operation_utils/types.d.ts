import { FillQuoteTransformerLimitOrderInfo, FillQuoteTransformerOrderType, FillQuoteTransformerRfqOrderInfo } from '@0x/protocol-utils';
import { V4RFQIndicativeQuote } from '@0x/quote-server';
import { MarketOperation } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { SourceFilters } from '../../network/source_filters';
import { TwoHopFillData } from '../../network/two_hop_sampler';
import { DexSample, ERC20BridgeSource, FillData, TokenAdjacencyGraph } from '../../network/types';
import { NativeOrderWithFillableAmounts, RfqFirmQuoteValidator, RfqRequestOpts } from '../../types';
import { QuoteRequestor } from '../../utils/quote_requestor';
import { PriceComparisonsReport, QuoteReport } from '../quote_report_generator';
import { CollapsedPath } from './path';
/**
 * Order domain keys: chainId and exchange
 */
export interface OrderDomain {
    chainId: number;
    exchangeAddress: string;
}
/**
 * Common exception messages thrown by aggregation logic.
 */
export declare enum AggregationError {
    NoOptimalPath = "NO_OPTIMAL_PATH",
    EmptyOrders = "EMPTY_ORDERS",
    NotERC20AssetData = "NOT_ERC20ASSET_DATA",
    NoBridgeForSource = "NO_BRIDGE_FOR_SOURCE"
}
export declare type SourcesWithPoolsCache = ERC20BridgeSource.Balancer | ERC20BridgeSource.BalancerV2 | ERC20BridgeSource.Cream;
export declare type NativeRfqOrderFillData = FillQuoteTransformerRfqOrderInfo;
export declare type NativeLimitOrderFillData = FillQuoteTransformerLimitOrderInfo;
export declare type NativeFillData = NativeRfqOrderFillData | NativeLimitOrderFillData;
export interface GenericRouterFillData extends FillData {
    router: string;
}
/**
 * Represents a node on a fill path.
 */
export interface Fill<TFillData extends FillData = FillData> {
    source: ERC20BridgeSource;
    type: FillQuoteTransformerOrderType;
    fillData: TFillData;
    sourcePathId: string;
    flags: bigint;
    input: BigNumber;
    output: BigNumber;
    adjustedOutput: BigNumber;
    parent?: Fill;
    index: number;
}
/**
 * Represents continguous fills on a path that have been merged together.
 */
export interface CollapsedFill<TFillData extends FillData = FillData> {
    source: ERC20BridgeSource;
    type: FillQuoteTransformerOrderType;
    fillData: TFillData;
    sourcePathId: string;
    /**
     * Total input amount (sum of `subFill`s)
     */
    input: BigNumber;
    /**
     * Total output amount (sum of `subFill`s)
     */
    output: BigNumber;
    /**
     * Quantities of all the fills that were collapsed.
     */
    subFills: Array<{
        input: BigNumber;
        output: BigNumber;
    }>;
}
/**
 * A `CollapsedFill` wrapping a native order.
 */
export interface NativeCollapsedFill extends CollapsedFill<NativeFillData> {
}
export interface OptimizedMarketOrderBase<TFillData extends FillData = FillData> {
    source: ERC20BridgeSource;
    fillData: TFillData;
    type: FillQuoteTransformerOrderType;
    makerToken: string;
    takerToken: string;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
    fills: CollapsedFill[];
}
export interface OptimizedMarketBridgeOrder<TFillData extends FillData = FillData> extends OptimizedMarketOrderBase<TFillData> {
    type: FillQuoteTransformerOrderType.Bridge;
    fillData: TFillData;
    sourcePathId: string;
}
export interface OptimizedLimitOrder extends OptimizedMarketOrderBase<NativeLimitOrderFillData> {
    type: FillQuoteTransformerOrderType.Limit;
    fillData: NativeLimitOrderFillData;
}
export interface OptimizedRfqOrder extends OptimizedMarketOrderBase<NativeRfqOrderFillData> {
    type: FillQuoteTransformerOrderType.Rfq;
    fillData: NativeRfqOrderFillData;
}
/**
 * Optimized orders to fill.
 */
export declare type OptimizedMarketOrder = OptimizedMarketBridgeOrder<FillData> | OptimizedMarketOrderBase<NativeLimitOrderFillData> | OptimizedMarketOrderBase<NativeRfqOrderFillData>;
export interface GetMarketOrdersRfqOpts extends RfqRequestOpts {
    quoteRequestor?: QuoteRequestor;
    firmQuoteValidator?: RfqFirmQuoteValidator;
}
export declare type FeeEstimate = (fillData: FillData) => number | BigNumber;
export declare type FeeSchedule = Partial<{
    [key in ERC20BridgeSource]: FeeEstimate;
}>;
export declare type ExchangeProxyOverhead = (sourceFlags: bigint, numDistinctFills: number) => BigNumber;
/**
 * Options for `getMarketSellOrdersAsync()` and `getMarketBuyOrdersAsync()`.
 */
export interface GetMarketOrdersOpts {
    /**
     * Liquidity sources to exclude. Default is none.
     */
    excludedSources: ERC20BridgeSource[];
    /**
     * Liquidity sources to exclude when used to calculate the cost of the route.
     * Default is none.
     */
    excludedFeeSources: ERC20BridgeSource[];
    /**
     * Liquidity sources to include. Default is none, which allows all supported
     * sources that aren't excluded by `excludedSources`.
     */
    includedSources: ERC20BridgeSource[];
    /**
     * Complexity limit on the search algorithm, i.e., maximum number of
     * nodes to visit. Default is 1024.
     */
    runLimit: number;
    /**
     * When generating bridge orders, we use
     * sampled rate * (1 - bridgeSlippage)
     * as the rate for calculating maker/taker asset amounts.
     * This should be a small positive number (e.g., 0.0005) to make up for
     * small discrepancies between samples and truth.
     * Default is 0.0005 (5 basis points).
     */
    bridgeSlippage: number;
    /**
     * The maximum price slippage allowed in the fallback quote. If the slippage
     * between the optimal quote and the fallback quote is greater than this
     * percentage, no fallback quote will be provided.
     */
    maxFallbackSlippage: number;
    /**
     * Number of samples to take for each DEX quote.
     */
    numSamples: number;
    /**
     * The exponential sampling distribution base.
     * A value of 1 will result in evenly spaced samples.
     * > 1 will result in more samples at lower sizes.
     * < 1 will result in more samples at higher sizes.
     * Default: 1.25.
     */
    sampleDistributionBase: number;
    /**
     * Fees for each liquidity source, expressed in gas.
     */
    feeSchedule: FeeSchedule;
    /**
     * Estimated gas consumed by each liquidity source.
     */
    gasSchedule: FeeSchedule;
    exchangeProxyOverhead: ExchangeProxyOverhead;
    /**
     * Whether to pad the quote with a redundant fallback quote using different
     * sources. Defaults to `true`.
     */
    allowFallback: boolean;
    /**
     * Options for RFQT such as takerAddress, intent on filling
     */
    rfqt?: GetMarketOrdersRfqOpts;
    /**
     * Whether to generate a quote report
     */
    shouldGenerateQuoteReport: boolean;
    /**
     * Whether to include price comparison data in the quote
     */
    shouldIncludePriceComparisonsReport: boolean;
    /**
     * Token addresses with a list of adjacent intermediary tokens to consider
     * hopping to. E.g DAI->USDC via an adjacent token WETH
     */
    tokenAdjacencyGraph: TokenAdjacencyGraph;
}
export interface OptimizerResult {
    optimizedOrders: OptimizedMarketOrder[];
    sourceFlags: bigint;
    numDistinctFills: number;
    liquidityDelivered: CollapsedFill[] | DexSample<TwoHopFillData>;
    marketSideLiquidity: MarketSideLiquidity;
    adjustedRate: BigNumber;
    unoptimizedPath?: CollapsedPath;
    takerAmountPerEth: BigNumber;
    makerAmountPerEth: BigNumber;
}
export interface OptimizerResultWithReport extends OptimizerResult {
    quoteReport?: QuoteReport;
    priceComparisonsReport?: PriceComparisonsReport;
}
export declare type MarketDepthSide = Array<Array<DexSample<FillData>>>;
export interface MarketDepth {
    bids: MarketDepthSide;
    asks: MarketDepthSide;
    makerTokenDecimals: number;
    takerTokenDecimals: number;
}
export interface MarketSideLiquidity {
    side: MarketOperation;
    inputAmount: BigNumber;
    inputToken: string;
    outputToken: string;
    outputAmountPerEth: BigNumber;
    inputAmountPerEth: BigNumber;
    quoteSourceFilters: SourceFilters;
    makerTokenDecimals: number;
    takerTokenDecimals: number;
    quotes: RawQuotes;
    isRfqSupported: boolean;
}
export interface RawQuotes {
    nativeOrders: NativeOrderWithFillableAmounts[];
    rfqtIndicativeQuotes: V4RFQIndicativeQuote[];
    twoHopQuotes: Array<DexSample<TwoHopFillData>>;
    dexQuotes: Array<Array<DexSample<FillData>>>;
}
export interface GenerateOptimizedOrdersOpts {
    runLimit?: number;
    bridgeSlippage?: number;
    maxFallbackSlippage?: number;
    excludedSources?: ERC20BridgeSource[];
    feeSchedule?: FeeSchedule;
    exchangeProxyOverhead?: ExchangeProxyOverhead;
    allowFallback?: boolean;
    shouldBatchBridgeOrders?: boolean;
}
export interface ComparisonPrice {
    wholeOrder: BigNumber | undefined;
}
//# sourceMappingURL=types.d.ts.map