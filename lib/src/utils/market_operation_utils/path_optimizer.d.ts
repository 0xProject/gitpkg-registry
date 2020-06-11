import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { Fill } from './types';
/**
 * Find the optimal mixture of paths that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
export declare function findOptimalPath(side: MarketOperation, paths: Fill[][], targetInput: BigNumber, runLimit?: number): Fill[] | undefined;
//# sourceMappingURL=path_optimizer.d.ts.map