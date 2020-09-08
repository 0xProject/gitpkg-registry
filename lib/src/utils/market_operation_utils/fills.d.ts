import { BigNumber } from '@0x/utils';
import { MarketOperation, SignedOrderWithFillableAmounts } from '../../types';
import { CollapsedFill, DexSample, ERC20BridgeSource, FeeSchedule, Fill, MultiHopFillData } from './types';
/**
 * Create fill paths from orders and dex quotes.
 */
export declare function createFillPaths(opts: {
    side: MarketOperation;
    orders?: SignedOrderWithFillableAmounts[];
    dexQuotes?: DexSample[][];
    targetInput?: BigNumber;
    ethToOutputRate?: BigNumber;
    ethToInputRate?: BigNumber;
    excludedSources?: ERC20BridgeSource[];
    feeSchedule?: FeeSchedule;
}): Fill[][];
export declare function getTwoHopAdjustedRate(side: MarketOperation, twoHopQuote: DexSample<MultiHopFillData>, targetInput: BigNumber, ethToOutputRate: BigNumber, fees?: FeeSchedule): BigNumber;
export declare function getPathSize(path: Fill[], targetInput?: BigNumber): [BigNumber, BigNumber];
export declare function getPathAdjustedSize(path: Fill[], targetInput?: BigNumber): [BigNumber, BigNumber];
export declare function isValidPath(path: Fill[], skipDuplicateCheck?: boolean): boolean;
export declare function arePathFlagsAllowed(flags: number): boolean;
export declare function clipPathToInput(path: Fill[], targetInput?: BigNumber): Fill[];
export declare function collapsePath(path: Fill[]): CollapsedFill[];
export declare function getPathAdjustedCompleteRate(side: MarketOperation, path: Fill[], targetInput: BigNumber): BigNumber;
export declare function getPathAdjustedRate(side: MarketOperation, path: Fill[], targetInput: BigNumber): BigNumber;
export declare function getPathAdjustedSlippage(side: MarketOperation, path: Fill[], inputAmount: BigNumber, maxRate: BigNumber): number;
export declare function getCompleteRate(side: MarketOperation, input: BigNumber, output: BigNumber, targetInput: BigNumber): BigNumber;
export declare function getRate(side: MarketOperation, input: BigNumber, output: BigNumber): BigNumber;
//# sourceMappingURL=fills.d.ts.map