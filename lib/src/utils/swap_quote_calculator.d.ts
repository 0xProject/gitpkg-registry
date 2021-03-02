import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { CalculateSwapQuoteOpts, MarketBuySwapQuote, MarketSellSwapQuote } from '../types';
import { MarketOperationUtils } from './market_operation_utils';
export declare class SwapQuoteCalculator {
    private readonly _marketOperationUtils;
    constructor(marketOperationUtils: MarketOperationUtils);
    calculateMarketSellSwapQuoteAsync(prunedOrders: SignedOrder[], takerAssetFillAmount: BigNumber, opts: CalculateSwapQuoteOpts): Promise<MarketSellSwapQuote>;
    calculateMarketBuySwapQuoteAsync(prunedOrders: SignedOrder[], takerAssetFillAmount: BigNumber, opts: CalculateSwapQuoteOpts): Promise<MarketBuySwapQuote>;
    calculateBatchMarketBuySwapQuoteAsync(batchPrunedOrders: SignedOrder[][], takerAssetFillAmounts: BigNumber[], opts: CalculateSwapQuoteOpts): Promise<Array<MarketBuySwapQuote | undefined>>;
    private _calculateBatchBuySwapQuoteAsync;
    private _calculateSwapQuoteAsync;
}
//# sourceMappingURL=swap_quote_calculator.d.ts.map