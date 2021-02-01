import { BigNumber } from '@0x/utils';
import { ComparisonPrice, FeeSchedule, MarketSideLiquidity } from './types';
/**
 * Takes in an optimizer response and returns a price for RFQT MMs to beat
 * returns the price of the taker asset in terms of the maker asset
 * So the RFQT MM should aim for a higher price
 * @param adjustedRate the adjusted rate (accounting for fees) from the optimizer, maker/taker
 * @param amount the amount specified by the client
 * @param marketSideLiquidity the results from querying liquidity sources
 * @param feeSchedule the fee schedule passed to the Optimizer
 * @return ComparisonPrice object with the prices for RFQ MMs to beat
 */
export declare function getComparisonPrices(adjustedRate: BigNumber, amount: BigNumber, marketSideLiquidity: MarketSideLiquidity, feeSchedule: FeeSchedule): ComparisonPrice;
//# sourceMappingURL=comparison_price.d.ts.map