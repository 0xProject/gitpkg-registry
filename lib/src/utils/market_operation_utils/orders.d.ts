import { BridgeSource, LimitOrder, LimitOrderFields, RfqOrder, RfqOrderFields, Signature } from '@0x/protocol-utils';
import { AbiEncoder } from '@0x/utils';
import { AssetSwapperContractAddresses, MarketOperation } from '../../types';
import { CollapsedFill, DexSample, ERC20BridgeSource, MultiHopFillData, NativeCollapsedFill, OptimizedLimitOrder, OptimizedMarketBridgeOrder, OptimizedMarketOrder, OptimizedRfqOrder, OrderDomain } from './types';
export declare function getNativeOrderTokens(order: LimitOrder | RfqOrder): [string, string];
export declare function convertNativeOrderToFullyFillableOptimizedOrders(order: LimitOrderFields & {
    signature: Signature;
}, fill: NativeCollapsedFill): OptimizedLimitOrder;
export declare function convertNativeRFQOrderToFullyFillableOptimizedOrders(order: RfqOrderFields & {
    signature: Signature;
}): OptimizedRfqOrder;
export interface CreateOrderFromPathOpts {
    side: MarketOperation;
    inputToken: string;
    outputToken: string;
    orderDomain: OrderDomain;
    contractAddresses: AssetSwapperContractAddresses;
    bridgeSlippage: number;
}
export declare function createOrdersFromTwoHopSample(sample: DexSample<MultiHopFillData>, opts: CreateOrderFromPathOpts): OptimizedMarketOrder[];
export declare function getERC20BridgeSourceToBridgeSource(source: ERC20BridgeSource): BridgeSource;
export declare function createBridgeDataForBridgeOrder(order: OptimizedMarketBridgeOrder): string;
export declare function createBridgeOrder(fill: CollapsedFill, makerToken: string, takerToken: string, side: MarketOperation): OptimizedMarketBridgeOrder;
export declare function getMakerTakerTokens(opts: CreateOrderFromPathOpts): [string, string];
export declare const BRIDGE_ENCODERS: {
    [key in Exclude<ERC20BridgeSource, ERC20BridgeSource.Native | ERC20BridgeSource.MultiHop | ERC20BridgeSource.MultiBridge>]: AbiEncoder.DataType;
};
export declare function createNativeOrder(fill: NativeCollapsedFill): OptimizedMarketOrder;
//# sourceMappingURL=orders.d.ts.map