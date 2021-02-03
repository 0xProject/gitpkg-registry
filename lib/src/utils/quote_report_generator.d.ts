import { LimitOrderFields, RfqOrderFields } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../types';
import { CollapsedFill, DexSample, ERC20BridgeSource, FillData, MultiHopFillData, NativeFillData, NativeOrderWithFillableAmounts } from './market_operation_utils/types';
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
    nativeOrder: LimitOrderFields;
    fillData: NativeFillData;
    fillableTakerAmount: BigNumber;
    isRfqt: false;
}
export interface NativeRfqOrderQuoteReportEntry extends QuoteReportEntryBase {
    liquiditySource: ERC20BridgeSource.Native;
    nativeOrder: RfqOrderFields;
    fillData: NativeFillData;
    fillableTakerAmount: BigNumber;
    isRfqt: true;
    makerUri: string;
    comparisonPrice?: number;
}
export declare type QuoteReportEntry = BridgeQuoteReportEntry | MultiHopQuoteReportEntry | NativeLimitOrderQuoteReportEntry | NativeRfqOrderQuoteReportEntry;
export interface QuoteReport {
    sourcesConsidered: QuoteReportEntry[];
    sourcesDelivered: QuoteReportEntry[];
}
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
export declare function generateQuoteReport(marketOperation: MarketOperation, dexQuotes: DexSample[], multiHopQuotes: Array<DexSample<MultiHopFillData>>, nativeOrders: NativeOrderWithFillableAmounts[], liquidityDelivered: ReadonlyArray<CollapsedFill> | DexSample<MultiHopFillData>, comparisonPrice?: BigNumber | undefined, quoteRequestor?: QuoteRequestor): QuoteReport;
//# sourceMappingURL=quote_report_generator.d.ts.map