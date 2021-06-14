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
    gasPrice?: BigNumber;
}): Fill[][];
//# sourceMappingURL=fills.d.ts.map