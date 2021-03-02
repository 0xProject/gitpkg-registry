import { BigNumber } from '@0x/utils';
import { SwapQuote } from '../types';
/**
 * Compute the minimum buy token amount for market operations by inferring
 * the slippage from the orders in a quote. We cannot rely on
 * `worstCaseQuoteInfo.makerAssetAmount` because that does not stop at
 * maximum slippage.
 */
export declare function getSwapMinBuyAmount(quote: SwapQuote): BigNumber;
//# sourceMappingURL=utils.d.ts.map