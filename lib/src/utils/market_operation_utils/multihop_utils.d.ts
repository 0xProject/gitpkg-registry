import { BigNumber } from '@0x/utils';
import { TwoHopFillData } from '../../network/two_hop_sampler';
import { DexSample } from '../../network/types';
import { Omit } from '../../types';
import { ExchangeProxyOverhead, FeeSchedule, MarketSideLiquidity } from './types';
/**
 * Returns the best two-hop quote and the fee-adjusted rate of that quote.
 */
export declare function getBestTwoHopQuote(marketSideLiquidity: Omit<MarketSideLiquidity, 'makerTokenDecimals' | 'takerTokenDecimals'>, feeSchedule?: FeeSchedule, exchangeProxyOverhead?: ExchangeProxyOverhead): {
    quote: DexSample<TwoHopFillData> | undefined;
    adjustedRate: BigNumber;
};
//# sourceMappingURL=multihop_utils.d.ts.map