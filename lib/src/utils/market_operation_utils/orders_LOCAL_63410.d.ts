import { RFQTIndicativeQuote } from '@0x/quote-server';
import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { AssetSwapperContractAddresses, MarketOperation, SignedOrderWithFillableAmounts } from '../../types';
import { CollapsedFill, DexSample, MultiHopFillData, NativeCollapsedFill, OptimizedMarketOrder, OrderDomain } from './types';
export declare function createDummyOrderForSampler(makerAssetData: string, takerAssetData: string, makerAddress: string): SignedOrder;
export declare function getNativeOrderTokens(order: SignedOrder): [string, string];
export declare function convertNativeOrderToFullyFillableOptimizedOrders(order: SignedOrder): OptimizedMarketOrder;
/**
 * Augments native orders with fillable amounts and filters out unfillable orders.
 */
export declare function createSignedOrdersWithFillableAmounts(side: MarketOperation, orders: SignedOrder[], fillableAmounts: BigNumber[]): SignedOrderWithFillableAmounts[];
export interface CreateOrderFromPathOpts {
    side: MarketOperation;
    inputToken: string;
    outputToken: string;
    orderDomain: OrderDomain;
    contractAddresses: AssetSwapperContractAddresses;
    bridgeSlippage: number;
}
export declare function createOrdersFromTwoHopSample(sample: DexSample<MultiHopFillData>, opts: CreateOrderFromPathOpts): OptimizedMarketOrder[];
export declare function createBridgeOrder(fill: CollapsedFill, makerToken: string, takerToken: string, opts: CreateOrderFromPathOpts): OptimizedMarketOrder;
export declare function getMakerTakerTokens(opts: CreateOrderFromPathOpts): [string, string];
export declare function createNativeOrder(fill: NativeCollapsedFill): OptimizedMarketOrder;
export declare function createSignedOrdersFromRfqtIndicativeQuotes(quotes: RFQTIndicativeQuote[]): SignedOrderWithFillableAmounts[];
//# sourceMappingURL=orders_LOCAL_63410.d.ts.map