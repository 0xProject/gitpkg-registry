import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { MarketOperation, NativeOrderWithFillableAmounts } from '../../types';
import { Path, PathPenaltyOpts } from './path';
import { DexSample, FeeSchedule, FillAdjustor, SamplerMetrics } from './types';
export declare function findOptimalPathFromSamples(side: MarketOperation, samples: DexSample[][], nativeOrders: NativeOrderWithFillableAmounts[], input: BigNumber, opts: PathPenaltyOpts, fees: FeeSchedule, chainId: ChainId, neonRouterNumSamples: number, fillAdjustor: FillAdjustor, samplerMetrics?: SamplerMetrics): Path | undefined;
//# sourceMappingURL=path_optimizer.d.ts.map