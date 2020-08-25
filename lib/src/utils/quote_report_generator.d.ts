import { BigNumber } from '@0x/utils';
import { ERC20BridgeSource, SignedOrder } from '..';
import { MarketOperation } from '../types';
import { CollapsedFill, DexSample } from './market_operation_utils/types';
import { QuoteRequestor } from './quote_requestor';
export interface BridgeReportSource {
    liquiditySource: Exclude<ERC20BridgeSource, ERC20BridgeSource.Native>;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
}
interface NativeReportSourceBase {
    liquiditySource: ERC20BridgeSource.Native;
    makerAmount: BigNumber;
    takerAmount: BigNumber;
    orderHash: string;
    nativeOrder: SignedOrder;
    fillableTakerAmount: BigNumber;
}
export interface NativeOrderbookReportSource extends NativeReportSourceBase {
    isRfqt: false;
}
export interface NativeRFQTReportSource extends NativeReportSourceBase {
    isRfqt: true;
    makerUri: string;
}
export declare type QuoteReportSource = BridgeReportSource | NativeOrderbookReportSource | NativeRFQTReportSource;
export interface QuoteReport {
    sourcesConsidered: QuoteReportSource[];
    sourcesDelivered: QuoteReportSource[];
}
export declare class QuoteReportGenerator {
    private readonly _dexQuotes;
    private readonly _nativeOrders;
    private readonly _orderHashesToFillableAmounts;
    private readonly _marketOperation;
    private readonly _collapsedFills;
    private readonly _quoteRequestor?;
    constructor(marketOperation: MarketOperation, dexQuotes: DexSample[], nativeOrders: SignedOrder[], orderFillableAmounts: BigNumber[], collapsedFills: CollapsedFill[], quoteRequestor?: QuoteRequestor);
    generateReport(): QuoteReport;
    private _dexSampleToReportSource;
    private _nativeOrderToReportSource;
}
export {};
//# sourceMappingURL=quote_report_generator.d.ts.map