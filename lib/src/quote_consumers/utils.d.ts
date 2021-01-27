import { BigNumber } from '@0x/utils';
import { MarketOperation, SwapQuote, SwapQuoteInfo } from '../types';
import { OptimizedMarketOrder } from '../utils/market_operation_utils/types';
/**
 * Compute the minimum buy token amount for market operations by inferring
 * the slippage from the orders in a quote. We cannot rely on
 * `worstCaseQuoteInfo.makerAmount` because that does not stop at
 * maximum slippage.
 */
export declare function getSwapMinBuyAmount(quote: SwapQuote): BigNumber;
/**
 * Same as `getSwapMinBuyAmount` but operates
 * on a single quote info instead of using best and worst case
 * Orders must be derived from the same path as the quote info
 */
export declare function getQuoteInfoMinBuyAmount(quoteInfo: SwapQuoteInfo, orders: OptimizedMarketOrder[], marketOperation: MarketOperation): BigNumber;
//# sourceMappingURL=utils.d.ts.map