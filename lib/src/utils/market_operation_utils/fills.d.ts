import { BigNumber } from '@0x/utils';
import { MarketOperation, NativeOrderWithFillableAmounts } from '../../types';
import { DexSample, ERC20BridgeSource, FeeSchedule, Fill } from './types';
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
    excludedSources?: ERC20BridgeSource[];
    feeSchedule?: FeeSchedule;
}): Fill[][];
export declare function ethToOutputAmount({ input, output, ethAmount, inputAmountPerEth, outputAmountPerEth, }: {
    input: BigNumber;
    output: BigNumber;
    inputAmountPerEth: BigNumber;
    outputAmountPerEth: BigNumber;
    ethAmount: BigNumber | number;
}): BigNumber;
export declare function nativeOrdersToFills(side: MarketOperation, orders: NativeOrderWithFillableAmounts[], targetInput: BigNumber | undefined, outputAmountPerEth: BigNumber, inputAmountPerEth: BigNumber, fees: FeeSchedule): Fill[];
export declare function dexSamplesToFills(side: MarketOperation, samples: DexSample[], outputAmountPerEth: BigNumber, inputAmountPerEth: BigNumber, fees: FeeSchedule): Fill[];
//# sourceMappingURL=fills.d.ts.map