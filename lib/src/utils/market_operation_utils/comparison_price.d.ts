import { BigNumber } from '@0x/utils';
import { ComparisonPrice, MarketSideLiquidity, OptimizerResult } from './types';
/**
 * Takes in an optimizer response and returns a price for RFQT MMs to beat
 * returns the price of the taker asset in terms of the maker asset
 * So the RFQT MM should aim for a higher price
 * @param optimizerResult the output of the optimizer, contains the best orders
 * @param amount the amount specified by the client
 * @param marketSideLiquidity the results from querying liquidity sources
 * @return ComparisonPrice object with the prices for RFQ MMs to beat
 */
export declare function getComparisonPrices(optimizerResult: OptimizerResult, amount: BigNumber, marketSideLiquidity: MarketSideLiquidity): ComparisonPrice;
//# sourceMappingURL=comparison_price.d.ts.map