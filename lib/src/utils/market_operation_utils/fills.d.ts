import { BigNumber } from '@0x/utils';
import { MarketOperation, NativeOrderWithFillableAmounts } from '../../types';
import { DexSample, FeeSchedule, Fill } from './types';
/**
 * Converts the ETH value to an amount in output tokens.
 *
 * By default this prefers the outputAmountPerEth, but if this value
 * is zero it will utilize the inputAmountPerEth and input.
 */
export declare function ethToOutputAmount({ input, output, ethAmount, inputAmountPerEth, outputAmountPerEth, }: {
    input: BigNumber;
    output: BigNumber;
    inputAmountPerEth: BigNumber;
    outputAmountPerEth: BigNumber;
    ethAmount: BigNumber | number;
}): BigNumber;
export declare function nativeOrderToFill(side: MarketOperation, order: NativeOrderWithFillableAmounts, targetInput: BigNumber | undefined, outputAmountPerEth: BigNumber, inputAmountPerEth: BigNumber, fees: FeeSchedule, filterNegativeAdjustedRateOrders?: boolean): Fill | undefined;
export declare function dexSampleToFill(side: MarketOperation, sample: DexSample, outputAmountPerEth: BigNumber, inputAmountPerEth: BigNumber, fees: FeeSchedule): Fill;
/**
 *  Adjusts the output depending on whether this is a buy or a sell.
 *
 * If it is a sell, than output is lowered by the adjustment.
 * If it is a buy, than output is increased by adjustment.
 */
export declare function adjustOutput(side: MarketOperation, output: BigNumber, penalty: BigNumber): BigNumber;
//# sourceMappingURL=fills.d.ts.map