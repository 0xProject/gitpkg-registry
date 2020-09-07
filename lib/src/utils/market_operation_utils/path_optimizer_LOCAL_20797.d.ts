import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { Fill } from './types';
/**
 * Find the optimal mixture of paths that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
export declare function findOptimalPathAsync(side: MarketOperation, paths: Fill[][], targetInput: BigNumber, runLimit?: number): Promise<Fill[] | undefined>;
//# sourceMappingURL=path_optimizer_LOCAL_20797.d.ts.map