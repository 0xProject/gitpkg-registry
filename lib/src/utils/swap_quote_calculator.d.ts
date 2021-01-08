import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { CalculateSwapQuoteOpts, MarketBuySwapQuote, MarketSellSwapQuote } from '../types';
import { MarketOperationUtils } from './market_operation_utils';
import { ERC20BridgeSource, GetMarketOrdersOpts } from './market_operation_utils/types';
export declare class SwapQuoteCalculator {
    private readonly _marketOperationUtils;
    constructor(marketOperationUtils: MarketOperationUtils);
    calculateMarketSellSwapQuoteAsync(prunedOrders: SignedOrder[], takerAssetFillAmount: BigNumber, gasPrice: BigNumber, opts: CalculateSwapQuoteOpts): Promise<MarketSellSwapQuote>;
    calculateMarketBuySwapQuoteAsync(prunedOrders: SignedOrder[], takerAssetFillAmount: BigNumber, gasPrice: BigNumber, opts: CalculateSwapQuoteOpts): Promise<MarketBuySwapQuote>;
    calculateBatchMarketBuySwapQuoteAsync(batchPrunedOrders: SignedOrder[][], takerAssetFillAmounts: BigNumber[], gasPrice: BigNumber, opts: CalculateSwapQuoteOpts): Promise<Array<MarketBuySwapQuote | undefined>>;
    getPricesAsync(nativeOrders: SignedOrder[], makerAmounts: BigNumber[], gasPrice: BigNumber, opts: GetMarketOrdersOpts): Promise<Array<{
        input: BigNumber;
        output: BigNumber;
        source: ERC20BridgeSource;
        sellToken: string;
        buyToken: string;
    } | undefined>>;
    private _calculateBatchBuySwapQuoteAsync;
    private _calculateSwapQuoteAsync;
}
//# sourceMappingURL=swap_quote_calculator.d.ts.map