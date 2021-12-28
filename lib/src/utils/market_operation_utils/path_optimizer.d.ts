import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { MarketOperation, NativeOrderWithFillableAmounts } from '../../types';
import { Path, PathPenaltyOpts } from './path';
import { DexSample, FeeSchedule, Fill } from './types';
export declare function findOptimalRustPathFromSamples(side: MarketOperation, samples: DexSample[][], nativeOrders: NativeOrderWithFillableAmounts[], input: BigNumber, opts: PathPenaltyOpts, fees: FeeSchedule, chainId: ChainId, neonRouterNumSamples: number): Path | undefined;
/**
 * Find the optimal mixture of fills that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
export declare function findOptimalPathJSAsync(side: MarketOperation, fills: Fill[][], targetInput: BigNumber, runLimit?: number, opts?: PathPenaltyOpts): Promise<Path | undefined>;
export declare function fillsToSortedPaths(fills: Fill[][], side: MarketOperation, targetInput: BigNumber, opts: PathPenaltyOpts): Path[];
export declare function reducePaths(sortedPaths: Path[], side: MarketOperation): Path[];
//# sourceMappingURL=path_optimizer.d.ts.map