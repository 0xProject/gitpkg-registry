import { BigNumber } from '@0x/utils';
import { NativeOrderWithFillableAmounts } from '../native_orders';
import { MarketOperation } from '../../types';
import { DexSample, Fill, GenericBridgeFill, NativeOrderFill } from './types';
/**
 * Create `Fill` objects from orders and dex quotes.
 */
export declare function createFills(opts: {
    side: MarketOperation;
    orders?: NativeOrderWithFillableAmounts[];
    dexQuotes?: DexSample[][];
    targetInput?: BigNumber;
    outputAmountPerEth?: BigNumber;
    inputAmountPerEth?: BigNumber;
    gasPrice: BigNumber;
}): Fill[][];
export declare function ethToOutputAmount({ input, output, ethAmount, inputAmountPerEth, outputAmountPerEth, }: {
    input: BigNumber;
    output: BigNumber;
    inputAmountPerEth: BigNumber;
    outputAmountPerEth: BigNumber;
    ethAmount: BigNumber | number;
}): BigNumber;
export declare function nativeOrdersToFills(side: MarketOperation, orders: NativeOrderWithFillableAmounts[], targetInput: BigNumber | undefined, outputAmountPerEth: BigNumber, inputAmountPerEth: BigNumber, gasPrice: BigNumber, filterNegativeAdjustedRateOrders?: boolean): NativeOrderFill[];
export declare function dexSamplesToFills(side: MarketOperation, samples: DexSample[], outputAmountPerEth: BigNumber, inputAmountPerEth: BigNumber, gasPrice: BigNumber): GenericBridgeFill[];
//# sourceMappingURL=fills.d.ts.map