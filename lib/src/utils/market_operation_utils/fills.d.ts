import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { DexSample, ERC20BridgeSource, FeeSchedule, Fill, NativeOrderWithFillableAmounts } from './types';
/**
 * Create `Fill` objects from orders and dex quotes.
 */
export declare function createFills(opts: {
    side: MarketOperation;
    orders?: NativeOrderWithFillableAmounts[];
    dexQuotes?: DexSample[][];
    targetInput?: BigNumber;
    ethToOutputRate?: BigNumber;
    ethToInputRate?: BigNumber;
    excludedSources?: ERC20BridgeSource[];
    feeSchedule?: FeeSchedule;
}): Fill[][];
//# sourceMappingURL=fills.d.ts.map