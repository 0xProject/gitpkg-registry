import { RfqOrderFields } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { Address, MarketOperation } from '../types';
import { DexSample, ERC20BridgeSource, RawHopQuotes, OptimizedHop, OptimizedNativeOrder } from './market_operation_utils/types';
import { NativeOrderWithFillableAmounts } from './native_orders';
import { QuoteRequestor, V4RFQIndicativeQuoteMM } from './quote_requestor';
export interface QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
    fillData: any;
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
    fillData: any;
    fillableTakerAmount: BigNumber;
    isRFQ: false;
}
export interface NativeRfqOrderQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource.Native;
    fillData: any;
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
export declare function generateQuoteReport(opts: {
    side: MarketOperation;
    inputToken: Address;
    outputToken: Address;
    rawHopQuotes: RawHopQuotes[];
    hops: OptimizedHop[];
    comparisonPrice?: BigNumber | undefined;
    quoteRequestor?: QuoteRequestor;
}): QuoteReport;
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, the sources ultimately included in the computed quote. This
 * extende version incudes all considered quotes, not only native liquidity.
 */
export declare function generateExtendedQuoteReportSources(opts: {
    side: MarketOperation;
    inputToken: Address;
    outputToken: Address;
    rawHopQuotes: RawHopQuotes[];
    hops: OptimizedHop[];
    amount: BigNumber;
    comparisonPrice?: BigNumber | undefined;
    quoteRequestor?: QuoteRequestor;
}): ExtendedQuoteReportSources;
export declare function dexSampleToReportSource(side: MarketOperation, sample: DexSample): BridgeQuoteReportEntry;
/**
 * Generates a report entry for a native order
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
export declare function nativeOrderToReportEntry(side: MarketOperation, order: OptimizedNativeOrder | NativeOrderWithFillableAmounts, comparisonPrice?: BigNumber | undefined, quoteRequestor?: QuoteRequestor): NativeRfqOrderQuoteReportEntry | NativeLimitOrderQuoteReportEntry;
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