import { AbiEncoder } from '@0x/utils';
import { AssetSwapperContractAddresses, MarketOperation } from '../../types';
import { DexSample, ERC20BridgeSource, Fill, MultiHopFillData, NativeFillData, NativeLimitOrderFillData, NativeRfqOrderFillData, OptimizedMarketBridgeOrder, OptimizedMarketOrder, OptimizedMarketOrderBase, OrderDomain } from './types';
export interface CreateOrderFromPathOpts {
    side: MarketOperation;
    inputToken: string;
    outputToken: string;
    orderDomain: OrderDomain;
    contractAddresses: AssetSwapperContractAddresses;
    bridgeSlippage: number;
}
export declare function createOrdersFromTwoHopSample(sample: DexSample<MultiHopFillData>, opts: CreateOrderFromPathOpts): OptimizedMarketOrder[];
export declare function getErc20BridgeSourceToBridgeSource(source: ERC20BridgeSource): string;
export declare function createBridgeDataForBridgeOrder(order: OptimizedMarketBridgeOrder): string;
export declare const poolEncoder: AbiEncoder.DataType;
export declare const BRIDGE_ENCODERS: {
    [key in Exclude<ERC20BridgeSource, ERC20BridgeSource.Native | ERC20BridgeSource.MultiHop | ERC20BridgeSource.MultiBridge>]: AbiEncoder.DataType;
};
export declare function createNativeOptimizedOrder(fill: Fill<NativeFillData>, side: MarketOperation): OptimizedMarketOrderBase<NativeLimitOrderFillData> | OptimizedMarketOrderBase<NativeRfqOrderFillData>;
export declare function createBridgeOrder(fill: Fill, makerToken: string, takerToken: string, side: MarketOperation): OptimizedMarketBridgeOrder;
export declare function getMakerTakerTokens(opts: CreateOrderFromPathOpts): [string, string];
//# sourceMappingURL=orders.d.ts.map