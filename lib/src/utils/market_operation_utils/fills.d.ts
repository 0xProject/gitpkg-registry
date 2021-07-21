import { BigNumber } from '@0x/utils';
import { DexSample, ERC20BridgeSource } from '../../network/types';
import { MarketOperation, NativeOrderWithFillableAmounts } from '../../types';
import { FeeSchedule, Fill } from './types';
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
//# sourceMappingURL=fills.d.ts.map