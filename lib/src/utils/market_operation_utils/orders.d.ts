import { ContractAddresses } from '@0x/contract-addresses';
import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { MarketOperation, SignedOrderWithFillableAmounts } from '../../types';
import { Fill, OptimizedMarketOrder, OrderDomain } from './types';
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
    contractAddresses: ContractAddresses;
    bridgeSlippage: number;
    liquidityProviderAddress?: string;
}
export declare function createOrdersFromPath(path: Fill[], opts: CreateOrderFromPathOpts): OptimizedMarketOrder[];
//# sourceMappingURL=orders.d.ts.map