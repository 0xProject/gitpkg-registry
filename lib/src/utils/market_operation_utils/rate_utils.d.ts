import { BigNumber } from '@0x/utils';
import { TwoHopFillData } from '../../network/two_hop_sampler';
import { DexSample } from '../../network/types';
import { MarketOperation } from '../../types';
import { ExchangeProxyOverhead, FeeSchedule } from './types';
/**
 * Returns the fee-adjusted rate of a two-hop quote. Returns zero if the
 * quote falls short of the target input.
 */
export declare function getTwoHopAdjustedRate(side: MarketOperation, twoHopQuote: DexSample<TwoHopFillData>, targetInput: BigNumber, outputAmountPerEth: BigNumber, fees?: FeeSchedule, exchangeProxyOverhead?: ExchangeProxyOverhead): BigNumber;
/**
 * Computes the "complete" rate given the input/output of a path.
 * This value penalizes the path if it falls short of the target input.
 */
export declare function getCompleteRate(side: MarketOperation, input: BigNumber, output: BigNumber, targetInput: BigNumber): BigNumber;
/**
 * Computes the rate given the input/output of a path.
 */
export declare function getRate(side: MarketOperation, input: BigNumber, output: BigNumber): BigNumber;
//# sourceMappingURL=rate_utils.d.ts.map