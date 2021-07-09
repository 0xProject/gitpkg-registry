import { BigNumber } from '@0x/utils';
import { Chain } from '../../network/chain';
import { LiquidityProviderRegistry } from '../../network/samplers/liquidity_provider';
import { SassySampler } from '../../network/sassy_sampler';
import { TokenAdjacencyGraph } from '../../network/types';
import { AssetSwapperContractAddresses, MarketOperation, SignedNativeOrder } from '../../types';
import { GenerateOptimizedOrdersOpts, GetMarketOrdersOpts, MarketSideLiquidity, OptimizerResult, OptimizerResultWithReport } from './types';
export declare class MarketOperationUtils {
    readonly chain: Chain;
    private readonly contractAddresses;
    private readonly _sampler;
    private readonly _sellSources;
    private readonly _buySources;
    private readonly _feeSources;
    private readonly _nativeFeeToken;
    private readonly _nativeFeeTokenAmount;
    private readonly _networkUtils;
    private readonly _nativeOrderUtils;
    static createAsync(opts: {
        chain: Chain;
        contractAddresses: AssetSwapperContractAddresses;
        liquidityProviderRegistry?: LiquidityProviderRegistry;
        tokenAdjacencyGraph?: TokenAdjacencyGraph;
    }): Promise<MarketOperationUtils>;
    private static _computeQuoteReport;
    private static _computePriceComparisonsReport;
    protected constructor(chain: Chain, contractAddresses: AssetSwapperContractAddresses, _sampler: SassySampler);
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
    getBatchMarketBuyOrdersAsync(batchNativeOrders: SignedNativeOrder[][], makerAmounts: BigNumber[], opts?: Partial<GetMarketOrdersOpts>): Promise<Array<OptimizerResult | undefined>>;
    _generateOptimizedOrdersAsync(marketSideLiquidity: MarketSideLiquidity, opts: GenerateOptimizedOrdersOpts): Promise<OptimizerResult>;
    /**
     * @param nativeOrders: Assumes LimitOrders not RfqOrders
     */
    getOptimizerResultAsync(nativeOrders: SignedNativeOrder[], amount: BigNumber, side: MarketOperation, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizerResultWithReport>;
}
//# sourceMappingURL=index.d.ts.map