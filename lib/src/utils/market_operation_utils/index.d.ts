import { RFQTIndicativeQuote } from '@0x/quote-server';
import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { AssetSwapperContractAddresses, MarketOperation } from '../../types';
import { DexOrderSampler } from './sampler';
import { ERC20BridgeSource, FillData, GenerateOptimizedOrdersOpts, GetMarketOrdersOpts, MarketSideLiquidity, OptimizerResult, OptimizerResultWithReport, OrderDomain } from './types';
/**
 * Returns a indicative quotes or an empty array if RFQT is not enabled or requested
 * @param makerAssetData the maker asset data
 * @param takerAssetData the taker asset data
 * @param marketOperation Buy or Sell
 * @param assetFillAmount the amount to fill, in base units
 * @param opts market request options
 */
export declare function getRfqtIndicativeQuotesAsync(makerAssetData: string, takerAssetData: string, marketOperation: MarketOperation, assetFillAmount: BigNumber, comparisonPrice: BigNumber | undefined, opts: Partial<GetMarketOrdersOpts>): Promise<RFQTIndicativeQuote[]>;
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
    getMarketSellLiquidityAsync(nativeOrders: SignedOrder[], takerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<MarketSideLiquidity>;
    getPricesAsync(nativeOrders: SignedOrder[], makerAmounts: BigNumber[], opts?: Partial<GetMarketOrdersOpts>): Promise<Array<{
        input: BigNumber;
        outputs: {
            output: BigNumber;
            fillData: FillData;
            source: ERC20BridgeSource;
        }[];
        ethToTakerRate: BigNumber;
        sellToken: string;
        buyToken: string;
    } | undefined>>;
    /**
     * Gets the liquidity available for a market buy operation
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return MarketSideLiquidity.
     */
    getMarketBuyLiquidityAsync(nativeOrders: SignedOrder[], makerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<MarketSideLiquidity>;
    /**
     * gets the orders required for a market sell operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return object with optimized orders and a QuoteReport
     */
    getMarketSellOrdersAsync(nativeOrders: SignedOrder[], takerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizerResultWithReport>;
    /**
     * gets the orders required for a market buy operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return object with optimized orders and a QuoteReport
     */
    getMarketBuyOrdersAsync(nativeOrders: SignedOrder[], makerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizerResultWithReport>;
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
    getBatchMarketBuyOrdersAsync(batchNativeOrders: SignedOrder[][], makerAmounts: BigNumber[], opts?: Partial<GetMarketOrdersOpts>): Promise<Array<OptimizerResult | undefined>>;
    _generateOptimizedOrdersAsync(marketSideLiquidity: MarketSideLiquidity, opts: GenerateOptimizedOrdersOpts): Promise<OptimizerResult>;
    private _getMarketSideOrdersAsync;
}
//# sourceMappingURL=index.d.ts.map