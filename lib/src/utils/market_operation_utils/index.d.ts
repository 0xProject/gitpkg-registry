import { BigNumber } from '@0x/utils';
import { AssetSwapperContractAddresses, MarketOperation, SignedNativeOrder } from '../../types';
import { DexOrderSampler } from './sampler';
import { GenerateOptimizedOrdersOpts, GetMarketOrdersOpts, MarketSideLiquidity, OptimizerResult, OptimizerResultWithReport, OrderDomain } from './types';
export declare class MarketOperationUtils {
    private readonly _sampler;
    private readonly contractAddresses;
    private readonly _orderDomain;
    private readonly _sellSources;
    private readonly _buySources;
    private readonly _feeSources;
    private readonly _nativeFeeToken;
    private readonly _nativeFeeTokenAmount;
    private static _computeQuoteReport;
    private static _computeExtendedQuoteReportSources;
    private static _computePriceComparisonsReport;
    constructor(_sampler: DexOrderSampler, contractAddresses: AssetSwapperContractAddresses, _orderDomain: OrderDomain);
    /**
     * Gets the liquidity available for a market sell operation
     * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketSellLiquidityAsync(nativeOrders: SignedNativeOrder[], takerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<MarketSideLiquidity>;
    /**
     * Gets the liquidity available for a market buy operation
     * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketBuyLiquidityAsync(nativeOrders: SignedNativeOrder[], makerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<MarketSideLiquidity>;
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
    getBatchMarketBuyOrdersAsync(batchNativeOrders: SignedNativeOrder[][], makerAmounts: BigNumber[], opts: Partial<GetMarketOrdersOpts> & {
        gasPrice: BigNumber;
    }): Promise<Array<OptimizerResult | undefined>>;
    _generateOptimizedOrdersAsync(marketSideLiquidity: MarketSideLiquidity, opts: GenerateOptimizedOrdersOpts): Promise<OptimizerResult>;
    /**
     * @param nativeOrders: Assumes LimitOrders not RfqOrders
     */
    getOptimizerResultAsync(nativeOrders: SignedNativeOrder[], amount: BigNumber, side: MarketOperation, opts: Partial<GetMarketOrdersOpts> & {
        gasPrice: BigNumber;
    }): Promise<OptimizerResultWithReport>;
    private _refreshPoolCacheIfRequiredAsync;
    private _addOptionalFallbackAsync;
}
//# sourceMappingURL=index.d.ts.map