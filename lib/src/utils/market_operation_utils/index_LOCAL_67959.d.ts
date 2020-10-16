import { ContractAddresses } from '@0x/contract-addresses';
import { RFQTIndicativeQuote } from '@0x/quote-server';
import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { DexOrderSampler } from './sampler';
import { GetMarketOrdersOpts, MarketDepth, OptimizedMarketOrder, OptimizedOrdersAndQuoteReport, OrderDomain } from './types';
/**
 * Returns a indicative quotes or an empty array if RFQT is not enabled or requested
 * @param makerAssetData the maker asset data
 * @param takerAssetData the taker asset data
 * @param marketOperation Buy or Sell
 * @param assetFillAmount the amount to fill, in base units
 * @param opts market request options
 */
export declare function getRfqtIndicativeQuotesAsync(makerAssetData: string, takerAssetData: string, marketOperation: MarketOperation, assetFillAmount: BigNumber, opts: Partial<GetMarketOrdersOpts>): Promise<RFQTIndicativeQuote[]>;
export declare class MarketOperationUtils {
    private readonly _sampler;
    private readonly contractAddresses;
    private readonly _orderDomain;
    private readonly _liquidityProviderRegistry;
    private readonly _wethAddress;
    private readonly _multiBridge;
    constructor(_sampler: DexOrderSampler, contractAddresses: ContractAddresses, _orderDomain: OrderDomain, _liquidityProviderRegistry?: string);
    /**
     * gets the orders required for a market sell operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return orders.
     */
    getMarketSellOrdersAsync(nativeOrders: SignedOrder[], takerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizedOrdersAndQuoteReport>;
    /**
     * gets the orders required for a market buy operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return object with optimized orders and a QuoteReport
     */
    getMarketBuyOrdersAsync(nativeOrders: SignedOrder[], makerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizedOrdersAndQuoteReport>;
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
    getBatchMarketBuyOrdersAsync(batchNativeOrders: SignedOrder[][], makerAmounts: BigNumber[], opts?: Partial<GetMarketOrdersOpts>): Promise<Array<OptimizedMarketOrder[] | undefined>>;
    getMarketDepthAsync(sellOrders: SignedOrder[], buyOrders: SignedOrder[], sellAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<MarketDepth>;
    private _generateOptimizedOrdersAsync;
    private _optionalSources;
}
//# sourceMappingURL=index_LOCAL_67959.d.ts.map