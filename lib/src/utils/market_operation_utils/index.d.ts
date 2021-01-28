import { LimitOrderFields } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { AssetSwapperContractAddresses, MarketOperation } from '../../types';
import { DexOrderSampler } from './sampler';
import { GenerateOptimizedOrdersOpts, GetMarketOrdersOpts, MarketSideLiquidity, OptimizerResult, OptimizerResultWithReport, OrderDomain, SignedOrder } from './types';
export declare class MarketOperationUtils {
    private readonly _sampler;
    private readonly contractAddresses;
    private readonly _orderDomain;
    private readonly _wethAddress;
    private readonly _sellSources;
    private readonly _buySources;
    private readonly _feeSources;
    private static _computeQuoteReport;
    constructor(_sampler: DexOrderSampler, contractAddresses: AssetSwapperContractAddresses, _orderDomain: OrderDomain);
    /**
     * Gets the liquidity available for a market sell operation
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketSellLiquidityAsync(nativeOrders: Array<SignedOrder<LimitOrderFields>>, takerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<MarketSideLiquidity>;
    /**
     * Gets the liquidity available for a market buy operation
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketBuyLiquidityAsync(nativeOrders: Array<SignedOrder<LimitOrderFields>>, makerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<MarketSideLiquidity>;
    /**
     * gets the orders required for a batch of market buy operations by (potentially) merging native orders with
     * generated bridge orders.
     *
     * NOTE: Currently `getBatchMarketBuyOrdersAsync()` does not support external liquidity providers.
     *
     * @param batchNativeOrders Batch of Native orders.
     * @param makerAmounts Array amount of maker asset to buy for each batch.
     * @param opts Options object.
     * @return orders.
     */
    getBatchMarketBuyOrdersAsync(batchNativeOrders: Array<Array<SignedOrder<LimitOrderFields>>>, makerAmounts: BigNumber[], opts?: Partial<GetMarketOrdersOpts>): Promise<Array<OptimizerResult | undefined>>;
    _generateOptimizedOrdersAsync(marketSideLiquidity: MarketSideLiquidity, opts: GenerateOptimizedOrdersOpts): Promise<OptimizerResult>;
    getOptimizerResultAsync(nativeOrders: Array<SignedOrder<LimitOrderFields>>, amount: BigNumber, side: MarketOperation, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizerResultWithReport>;
}
//# sourceMappingURL=index.d.ts.map