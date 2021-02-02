import { CommonOrderFields, LimitOrderFields, LimitOrderFields as Order, RfqOrderFields } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { NativeOrderFillableAmountFields } from '../types';
import { SignedOrder } from './market_operation_utils/types';
export declare function numberPercentageToEtherTokenAmountPercentage(percentage: number): BigNumber;
export declare function getAdjustedTakerAmountFromFees<T extends Order>(order: T): BigNumber;
/**
 * Given an amount of taker asset, calculate the the amount of maker asset
 * @param order The order
 * @param makerFillAmount the amount of taker asset
 */
export declare function getNativeAdjustedMakerFillAmount(order: CommonOrderFields, takerFillAmount: BigNumber): BigNumber;
/**
 * Given an amount of maker asset, calculate the equivalent amount in taker asset
 * @param order The order
 * @param makerFillAmount the amount of maker asset
 */
export declare function getNativeAdjustedTakerFillAmount(order: CommonOrderFields, makerFillAmount: BigNumber): BigNumber;
/**
 * Given an amount of taker asset, calculate the fee amount required for the taker
 * @param order The order
 * @param takerFillAmount the amount of taker asset
 */
export declare function getNativeAdjustedTakerFeeAmount(order: LimitOrderFields, takerFillAmount: BigNumber): BigNumber;
export declare function getNativeAdjustedFillableAmountsFromTakerAmount(order: SignedOrder<LimitOrderFields | RfqOrderFields>, takerFillAmount: BigNumber): NativeOrderFillableAmountFields;
export declare function getNativeAdjustedFillableAmountsFromMakerAmount(order: SignedOrder<LimitOrderFields | RfqOrderFields>, makerFillAmount: BigNumber): NativeOrderFillableAmountFields;
//# sourceMappingURL=utils.d.ts.map