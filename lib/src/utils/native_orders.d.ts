import { BigNumber } from '@0x/utils';
import { FillQuoteTransformerOrderType, Signature } from '@0x/protocol-utils';
import { SignedNativeOrder } from '../types';
export interface SignedOrder<T> {
    order: T;
    type: FillQuoteTransformerOrderType.Limit | FillQuoteTransformerOrderType.Rfq;
    signature: Signature;
}
export declare type NativeOrderWithFillableAmounts = SignedNativeOrder & NativeOrderFillableAmountFields & {
    gasCost: number;
};
/**
 * fillableMakerAmount: Amount of makerAsset that is fillable
 * fillableTakerAmount: Amount of takerAsset that is fillable
 * fillableTakerFeeAmount: Amount of takerFee paid to fill fillableTakerAmount
 */
export interface NativeOrderFillableAmountFields {
    fillableMakerAmount: BigNumber;
    fillableTakerAmount: BigNumber;
    fillableTakerFeeAmount: BigNumber;
}
//# sourceMappingURL=native_orders.d.ts.map