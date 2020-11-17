import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../types';
import { CollapsedFill, DexSample, ERC20BridgeSource, FillData, MultiHopFillData } from './market_operation_utils/types';
import { QuoteRequestor } from './quote_requestor';
export interface BridgeReportSource {
    liquiditySource: Exclude<ERC20BridgeSource, ERC20BridgeSource.Native>;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
    fillData?: FillData;
}
export interface MultiHopReportSource {
    liquiditySource: ERC20BridgeSource.MultiHop;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
    hopSources: ERC20BridgeSource[];
    fillData: FillData;
}
interface NativeReportSourceBase {
    liquiditySource: ERC20BridgeSource.Native;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
    nativeOrder: SignedOrder;
    fillableTakerAmount: BigNumber;
}
export interface NativeOrderbookReportSource extends NativeReportSourceBase {
    isRfqt: false;
}
export interface NativeRFQTReportSource extends NativeReportSourceBase {
    isRfqt: true;
    makerUri: string;
    comparisonPrice?: number;
}
export declare type QuoteReportSource = BridgeReportSource | NativeOrderbookReportSource | NativeRFQTReportSource | MultiHopReportSource;
export interface QuoteReport {
    sourcesConsidered: QuoteReportSource[];
    sourcesDelivered: QuoteReportSource[];
}
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
export declare function generateQuoteReport(marketOperation: MarketOperation, dexQuotes: DexSample[], multiHopQuotes: Array<DexSample<MultiHopFillData>>, nativeOrders: SignedOrder[], orderFillableAmounts: BigNumber[], liquidityDelivered: ReadonlyArray<CollapsedFill> | DexSample<MultiHopFillData>, comparisonPrice?: BigNumber | undefined, quoteRequestor?: QuoteRequestor): QuoteReport;
export {};
//# sourceMappingURL=quote_report_generator.d.ts.map