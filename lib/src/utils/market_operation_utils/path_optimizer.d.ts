import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { NativeOrderWithFillableAmounts } from '../native_orders';
import { MarketOperation } from '../../types';
import { Path, PathPenaltyOpts } from './path';
import { DexSample, Fill, SamplerMetrics } from './types';
export declare function findOptimalRustPathFromSamples(side: MarketOperation, samples: DexSample[][], nativeOrders: NativeOrderWithFillableAmounts[], input: BigNumber, opts: PathPenaltyOpts, gasPrice: BigNumber, chainId: ChainId, neonRouterNumSamples: number, samplerMetrics?: SamplerMetrics): Path | undefined;
/**
 * Find the optimal mixture of fills that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
export declare function findOptimalPathJSAsync(side: MarketOperation, fills: Fill[][], targetInput: BigNumber, runLimit?: number, samplerMetrics?: SamplerMetrics, opts?: PathPenaltyOpts): Promise<Path | undefined>;
export declare function fillsToSortedPaths(fills: Fill[][], side: MarketOperation, targetInput: BigNumber, opts: PathPenaltyOpts): Path[];
export declare function reducePaths(sortedPaths: Path[]): Path[];
//# sourceMappingURL=path_optimizer.d.ts.map