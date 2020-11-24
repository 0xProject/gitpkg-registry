import { BigNumber } from '@0x/utils';
import { MarketOperation, SignedOrderWithFillableAmounts, SwapQuote } from '../../src/types';
/**
 * Creates a swap quote given orders.
 */
export declare function getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData: string, takerAssetData: string, orders: SignedOrderWithFillableAmounts[], operation: MarketOperation, gasPrice: BigNumber): Promise<SwapQuote>;
//# sourceMappingURL=swap_quote.d.ts.map