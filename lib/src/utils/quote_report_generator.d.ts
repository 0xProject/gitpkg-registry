import { FillQuoteTransformerOrderType, RfqOrderFields } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { MarketOperation, NativeOrderWithFillableAmounts } from '../types';
import { CollapsedFill, DexSample, ERC20BridgeSource, FillData, MultiHopFillData, NativeFillData, NativeLimitOrderFillData, NativeRfqOrderFillData, RawQuotes } from './market_operation_utils/types';
import { QuoteRequestor, V4RFQIndicativeQuoteMM } from './quote_requestor';
export interface QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
    fillData: FillData;
}
export interface BridgeQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: Exclude<ERC20BridgeSource, ERC20BridgeSource.Native>;
}
export interface MultiHopQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource.MultiHop;
    hopSources: ERC20BridgeSource[];
}
export interface NativeLimitOrderQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource.Native;
    fillData: NativeFillData;
    fillableTakerAmount: BigNumber;
    isRFQ: false;
}
export interface NativeRfqOrderQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource.Native;
    fillData: NativeFillData;
    fillableTakerAmount: BigNumber;
    isRFQ: true;
    nativeOrder: RfqOrderFields;
    makerUri: string;
    comparisonPrice?: number;
}
export interface IndicativeRfqOrderQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource.Native;
    fillableTakerAmount: BigNumber;
    isRFQ: true;
    makerUri?: string;
    comparisonPrice?: number;
}
export declare type QuoteReportEntry = BridgeQuoteReportEntry | MultiHopQuoteReportEntry | NativeLimitOrderQuoteReportEntry | NativeRfqOrderQuoteReportEntry;
export declare type ExtendedQuoteReportEntry = BridgeQuoteReportEntry | MultiHopQuoteReportEntry | NativeLimitOrderQuoteReportEntry | NativeRfqOrderQuoteReportEntry | IndicativeRfqOrderQuoteReportEntry;
export declare type ExtendedQuoteReportIndexedEntry = ExtendedQuoteReportEntry & {
    quoteEntryIndex: number;
    isDelivered: boolean;
};
export declare type ExtendedQuoteReportIndexedEntryOutbound = Omit<ExtendedQuoteReportIndexedEntry, 'fillData'> & {
    fillData?: string;
};
export interface QuoteReport {
    sourcesConsidered: QuoteReportEntry[];
    sourcesDelivered: QuoteReportEntry[];
}
export interface ExtendedQuoteReportSources {
    sourcesConsidered: ExtendedQuoteReportIndexedEntry[];
    sourcesDelivered: ExtendedQuoteReportIndexedEntry[] | undefined;
}
export interface ExtendedQuoteReport {
    quoteId?: string;
    taker?: string;
    timestamp: number;
    firmQuoteReport: boolean;
    submissionBy: 'taker' | 'metaTxn' | 'rfqm';
    buyAmount?: string;
    sellAmount?: string;
    buyTokenAddress: string;
    sellTokenAddress: string;
    integratorId?: string;
    slippageBips?: number;
    zeroExTransactionHash?: string;
    decodedUniqueId?: string;
    sourcesConsidered: ExtendedQuoteReportIndexedEntryOutbound[];
    sourcesDelivered: ExtendedQuoteReportIndexedEntryOutbound[] | undefined;
    blockNumber: number | undefined;
}
export interface PriceComparisonsReport {
    dexSources: BridgeQuoteReportEntry[];
    multiHopSources: MultiHopQuoteReportEntry[];
    nativeSources: Array<NativeLimitOrderQuoteReportEntry | NativeRfqOrderQuoteReportEntry>;
}
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
export declare function generateQuoteReport(marketOperation: MarketOperation, nativeOrders: NativeOrderWithFillableAmounts[], liquidityDelivered: ReadonlyArray<CollapsedFill> | DexSample<MultiHopFillData>, comparisonPrice?: BigNumber | undefined, quoteRequestor?: QuoteRequestor): QuoteReport;
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, the sources ultimately included in the computed quote. This
 * extende version incudes all considered quotes, not only native liquidity.
 */
export declare function generateExtendedQuoteReportSources(marketOperation: MarketOperation, quotes: RawQuotes, liquidityDelivered: ReadonlyArray<CollapsedFill> | DexSample<MultiHopFillData>, amount: BigNumber, comparisonPrice?: BigNumber | undefined, quoteRequestor?: QuoteRequestor): ExtendedQuoteReportSources;
/**
 * Generates a report sample for a DEX source
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
export declare function dexSampleToReportSource(ds: DexSample, marketOperation: MarketOperation): BridgeQuoteReportEntry;
/**
 * Generates a report sample for a MultiHop source
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
export declare function multiHopSampleToReportSource(ds: DexSample<MultiHopFillData>, marketOperation: MarketOperation): MultiHopQuoteReportEntry;
/**
 * Generates a report entry for a native order
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
export declare function nativeOrderToReportEntry(type: FillQuoteTransformerOrderType, fillData: NativeLimitOrderFillData | NativeRfqOrderFillData, fillableAmount: BigNumber, comparisonPrice?: BigNumber | undefined, quoteRequestor?: QuoteRequestor): NativeRfqOrderQuoteReportEntry | NativeLimitOrderQuoteReportEntry;
/**
 * Generates a report entry for an indicative RFQ Quote
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
export declare function indicativeQuoteToReportEntry(order: V4RFQIndicativeQuoteMM, comparisonPrice?: BigNumber | undefined): IndicativeRfqOrderQuoteReportEntry;
/**
 * For the extended quote report, we output the filldata as JSON
 */
export declare function jsonifyFillData(source: ExtendedQuoteReportIndexedEntry): ExtendedQuoteReportIndexedEntryOutbound;
//# sourceMappingURL=quote_report_generator.d.ts.map