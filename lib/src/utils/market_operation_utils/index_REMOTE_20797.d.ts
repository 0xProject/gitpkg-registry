import { ContractAddresses } from '@0x/contract-addresses';
import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { LiquidityForTakerMakerAssetDataPair, MarketOperation } from '../../types';
import { DexOrderSampler } from './sampler';
import { DexSample, ERC20BridgeSource, FillData, GetMarketOrdersOpts, OptimizedMarketOrder, OrderDomain } from './types';
declare type Depth = {
    [key in ERC20BridgeSource]: Array<{
        input: BigNumber;
        output: BigNumber;
        price: BigNumber;
        bucket: number;
    }>;
};
export declare function getSampleAmountsA(maxFillAmount: BigNumber, numSamples: number, expBase?: number): BigNumber[];
export declare class MarketOperationUtils {
    private readonly _sampler;
    private readonly contractAddresses;
    private readonly _orderDomain;
    private readonly _liquidityProviderRegistry;
    private readonly _wethAddress;
    private readonly _multiBridge;
    constructor(_sampler: DexOrderSampler, contractAddresses: ContractAddresses, _orderDomain: OrderDomain, _liquidityProviderRegistry?: string);
    calculateMarketDepth(nativeOrders: SignedOrder[], fillableAmounts: BigNumber[], dexQuotes: Array<Array<DexSample<FillData>>>, sampleAmounts: BigNumber[], side: MarketOperation): {
        depth: Depth;
        dataByBucketPrice: any[];
    };
    getMarketDepthAsync(sellOrders: SignedOrder[], buyOrders: SignedOrder[], amount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<LiquidityForTakerMakerAssetDataPair>;
    /**
     * gets the orders required for a market sell operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param takerAmount Amount of taker asset to sell.
     * @param opts Options object.
     * @return orders.
     */
    getMarketSellOrdersAsync(nativeOrders: SignedOrder[], takerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizedMarketOrder[]>;
    /**
     * gets the orders required for a market buy operation by (potentially) merging native orders with
     * generated bridge orders.
     * @param nativeOrders Native orders.
     * @param makerAmount Amount of maker asset to buy.
     * @param opts Options object.
     * @return orders.
     */
    getMarketBuyOrdersAsync(nativeOrders: SignedOrder[], makerAmount: BigNumber, opts?: Partial<GetMarketOrdersOpts>): Promise<OptimizedMarketOrder[]>;
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
    private _generateOptimizedOrdersAsync;
    private _optionalSources;
}
export {};
//# sourceMappingURL=index_REMOTE_20797.d.ts.map