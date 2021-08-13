import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { Path, PathPenaltyOpts } from './path';
import { Fill } from './types';
export interface FindOptimalPathOpts {
    runLimit: number;
    pathPenaltyOpts: PathPenaltyOpts;
}
/**
 * Find the optimal mixture of fills that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
export declare function findOptimalPathAsync(side: MarketOperation, fills: Fill[][], targetInput: BigNumber, opts?: Partial<FindOptimalPathOpts>): Promise<Path | undefined>;
export declare function fillsToSortedPaths(fills: Fill[][], side: MarketOperation, targetInput: BigNumber, pathPenaltyOpts: PathPenaltyOpts): Path[];
export declare function reducePaths(sortedPaths: Path[]): Path[];
//# sourceMappingURL=path_optimizer.d.ts.map