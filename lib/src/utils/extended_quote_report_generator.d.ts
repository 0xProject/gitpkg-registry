import { FillQuoteTransformerOrderType, RfqOrderFields } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../types';
import { CollapsedFill, DexSample, ERC20BridgeSource, FillData, MultiHopFillData, NativeFillData, NativeLimitOrderFillData, NativeRfqOrderFillData, RawQuotes } from './market_operation_utils/types';
import { QuoteRequestor } from './quote_requestor';
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
    isRfqt: false;
}
export interface NativeRfqOrderQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource.Native;
    fillData: NativeFillData;
    fillableTakerAmount: BigNumber;
    isRfqt: true;
    nativeOrder: RfqOrderFields;
    makerUri: string;
    comparisonPrice?: number;
}
export declare type QuoteReportEntry = BridgeQuoteReportEntry | MultiHopQuoteReportEntry | NativeLimitOrderQuoteReportEntry | NativeRfqOrderQuoteReportEntry;
export interface QuoteReport {
    sourcesConsidered: QuoteReportEntry[];
    sourcesDelivered: QuoteReportEntry[];
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
export declare function generateExtendedQuoteReport(marketOperation: MarketOperation, quotes: RawQuotes, liquidityDelivered: ReadonlyArray<CollapsedFill> | DexSample<MultiHopFillData>, comparisonPrice?: BigNumber | undefined, quoteRequestor?: QuoteRequestor): QuoteReport;
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
//# sourceMappingURL=extended_quote_report_generator.d.ts.map