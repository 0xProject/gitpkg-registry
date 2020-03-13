import { BigNumber } from '@0x/utils';
import { MarketOperation, SignedOrderWithFillableAmounts } from '../../types';
import { CollapsedFill, DexSample, ERC20BridgeSource, Fill } from './types';
/**
 * Create fill paths from orders and dex quotes.
 */
export declare function createFillPaths(opts: {
    side: MarketOperation;
    orders?: SignedOrderWithFillableAmounts[];
    dexQuotes?: DexSample[][];
    targetInput?: BigNumber;
    ethToOutputRate?: BigNumber;
    excludedSources?: ERC20BridgeSource[];
    feeSchedule?: {
        [source: string]: BigNumber;
    };
}): Fill[][];
export declare function getPathSize(path: Fill[], targetInput?: BigNumber): [BigNumber, BigNumber];
export declare function getPathAdjustedSize(path: Fill[], targetInput?: BigNumber): [BigNumber, BigNumber];
export declare function isValidPath(path: Fill[]): boolean;
export declare function clipPathToInput(path: Fill[], targetInput?: BigNumber): Fill[];
export declare function collapsePath(side: MarketOperation, path: Fill[]): CollapsedFill[];
export declare function getFallbackSourcePaths(optimalPath: Fill[], allPaths: Fill[][]): Fill[][];
export declare function getPathAdjustedRate(side: MarketOperation, path: Fill[], targetInput: BigNumber): BigNumber;
export declare function getPathAdjustedSlippage(side: MarketOperation, path: Fill[], inputAmount: BigNumber, maxRate: BigNumber): number;
//# sourceMappingURL=fills.d.ts.map