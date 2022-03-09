import { BigNumber } from '@0x/utils';
import { Address, MarketOperation, SamplerMetrics, SignedNativeOrder } from '../../types';
import { Sampler } from './sampler';
import { ExchangeProxyOverhead, GenerateOptimizedOrdersOpts, GetMarketOrdersOpts, MarketSideLiquidity, OptimizerResult, OptimizerResultWithReport, OptimizedHop, RawHopQuotes, TokenAmountPerEth } from './types';
export declare class MarketOperationUtils {
    private readonly _sampler;
    private readonly _sellSources;
    private readonly _buySources;
    private readonly _feeSources;
    private readonly _nativeFeeToken;
    private static _computeQuoteReport;
    private static _computeExtendedQuoteReportSources;
    private static _computePriceComparisonsReport;
    constructor(_sampler: Sampler);
    /**
     * Gets the liquidity available for a market sell operation
     * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketSellLiquidityAsync(nativeOrders: SignedNativeOrder[], takerAmount: BigNumber, opts: GetMarketOrdersOpts): Promise<MarketSideLiquidity>;
    private _getMultiHopSampleLegsAndAmountsAsync;
    private _getDirectSampleLegs;
    /**
     * Gets the liquidity available for a market buy operation
     * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketBuyLiquidityAsync(nativeOrders: SignedNativeOrder[], makerAmount: BigNumber, opts: GetMarketOrdersOpts): Promise<MarketSideLiquidity>;
    /**
     * gets the orders required for a batch of market buy operations by (potentially) merging native orders with
     * generated bridge orders.
     *
     * NOTE: Currently `getBatchMarketBuyOrdersAsync()` does not support external liquidity providers.
     *
     * @param batchNativeOrders Batch of Native orders. Assumes LimitOrders not RfqOrders
     * @param makerAmounts Array amount of maker asset to buy for each batch.
     * @param opts Options object.
     * @return orders.
     */
    getBatchMarketBuyOrdersAsync(batchNativeOrders: SignedNativeOrder[][], makerAmounts: BigNumber[], opts: GetMarketOrdersOpts): Promise<Array<OptimizerResult | undefined>>;
    _generateOptimizedOrdersAsync(marketSideLiquidity: MarketSideLiquidity, opts: GenerateOptimizedOrdersOpts): Promise<OptimizerResult>;
    /**
     * @param nativeOrders: Assumes LimitOrders not RfqOrders
     */
    getOptimizerResultAsync(nativeOrders: SignedNativeOrder[], amount: BigNumber, side: MarketOperation, opts: Partial<GetMarketOrdersOpts> & {
        gasPrice: BigNumber;
    }): Promise<OptimizerResultWithReport>;
    private _createOptimizedHopAsync;
    private _findOptimalPathFromSamples;
    private _addFallbackToPath;
    _findBestOptimizedHopRouteAsync(side: MarketOperation, inputToken: Address, outputToken: Address, inputAmount: BigNumber, hopQuotes: RawHopQuotes[], opts: {
        tokenAmountPerEth?: TokenAmountPerEth;
        exchangeProxyOverhead?: ExchangeProxyOverhead;
        slippage?: number;
        gasPrice?: BigNumber;
        runLimit?: number;
        maxFallbackSlippage?: number;
        neonRouterNumSamples: number;
        samplerMetrics?: SamplerMetrics;
    }): Promise<OptimizedHop[] | undefined>;
}
//# sourceMappingURL=index.d.ts.map