import { BigNumber } from '@0x/utils';
import { OptimizedMarketOrder } from '../../src';
import { MarketOperation, SwapQuote } from '../../src/types';
/**
 * Creates a swap quote given orders.
 */
export declare function getFullyFillableSwapQuoteWithNoFeesAsync(makerToken: string, takerToken: string, orders: OptimizedMarketOrder[], operation: MarketOperation, gasPrice: BigNumber): Promise<SwapQuote>;
//# sourceMappingURL=swap_quote.d.ts.map