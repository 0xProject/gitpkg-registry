import { BigNumber } from '@0x/utils';
import { MarketOperation, SwapQuoteOrder } from '../types';
export interface QuoteFillResult {
    makerAssetAmount: BigNumber;
    takerAssetAmount: BigNumber;
    takerFeeMakerAssetAmount: BigNumber;
    takerFeeTakerAssetAmount: BigNumber;
    totalMakerAssetAmount: BigNumber;
    totalTakerAssetAmount: BigNumber;
    protocolFeeAmount: BigNumber;
    gas: number;
    fillAmountBySource: {
        [source: string]: BigNumber;
    };
}
interface IntermediateQuoteFillResult {
    input: BigNumber;
    output: BigNumber;
    inputFee: BigNumber;
    outputFee: BigNumber;
    protocolFee: BigNumber;
    gas: number;
    inputBySource: {
        [source: string]: BigNumber;
    };
}
export interface QuoteFillInfo {
    orders: SwapQuoteOrder[];
    fillAmount: BigNumber;
    gasPrice: BigNumber;
    side: MarketOperation;
    opts: Partial<QuoteFillInfoOpts>;
}
export interface QuoteFillInfoOpts {
    protocolFeeMultiplier: BigNumber;
    slippage: number;
}
export interface QuoteFillOrderCall {
    order: SwapQuoteOrder;
    totalOrderInput: BigNumber;
    totalOrderOutput: BigNumber;
    totalOrderInputFee: BigNumber;
    totalOrderOutputFee: BigNumber;
}
export declare function simulateBestCaseFill(quoteInfo: QuoteFillInfo): QuoteFillResult;
export declare function simulateWorstCaseFill(quoteInfo: QuoteFillInfo): QuoteFillResult;
export declare function fillQuoteOrders(fillOrders: QuoteFillOrderCall[], inputAmount: BigNumber, protocolFeePerFillOrder: BigNumber): IntermediateQuoteFillResult;
export {};
//# sourceMappingURL=quote_simulation.d.ts.map