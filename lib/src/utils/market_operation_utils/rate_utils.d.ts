import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
/**
 * Computes the "complete" rate given the input/output of a path.
 * This value penalizes the path if it falls short of the target input.
 */
export declare function getCompleteTakerToMakerRate(side: MarketOperation, input: BigNumber, output: BigNumber, targetInput: BigNumber): BigNumber;
/**
 * Computes the rate given the input/output of a path.
 */
export declare function getRate(side: MarketOperation, input: BigNumber, output: BigNumber): BigNumber;
//# sourceMappingURL=rate_utils.d.ts.map