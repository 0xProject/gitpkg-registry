import { AbiEncoder } from '@0x/utils';
import { UniswapV3FillData } from '../../network/samplers/uniswap_v3';
import { TwoHopFillData } from '../../network/two_hop_sampler';
import { DexSample, ERC20BridgeSource } from '../../network/types';
import { AssetSwapperContractAddresses, MarketOperation } from '../../types';
import { CollapsedFill, NativeCollapsedFill, NativeLimitOrderFillData, NativeRfqOrderFillData, OptimizedMarketBridgeOrder, OptimizedMarketOrder, OptimizedMarketOrderBase } from './types';
export interface CreateOrderFromPathOpts {
    side: MarketOperation;
    inputToken: string;
    outputToken: string;
    contractAddresses: AssetSwapperContractAddresses;
    bridgeSlippage: number;
}
export interface FinalUniswapV3FillData extends Omit<UniswapV3FillData, 'uniswapPaths'> {
    uniswapPath: string;
}
export declare function createOrdersFromTwoHopSample(sample: DexSample<TwoHopFillData>, opts: CreateOrderFromPathOpts): OptimizedMarketOrder[];
export declare function getErc20BridgeSourceToBridgeSource(source: ERC20BridgeSource): string;
export declare function createBridgeDataForBridgeOrder(order: OptimizedMarketBridgeOrder): string;
export declare function createBridgeOrder(fill: CollapsedFill, makerToken: string, takerToken: string, side: MarketOperation): OptimizedMarketBridgeOrder;
export declare function getMakerTakerTokens(opts: CreateOrderFromPathOpts): [string, string];
export declare const poolEncoder: AbiEncoder.DataType;
export declare const BRIDGE_ENCODERS: {
    [key in Exclude<ERC20BridgeSource, ERC20BridgeSource.Native | ERC20BridgeSource.MultiHop | ERC20BridgeSource.MultiBridge>]: AbiEncoder.DataType;
};
export declare function createNativeOptimizedOrder(fill: NativeCollapsedFill, side: MarketOperation): OptimizedMarketOrderBase<NativeLimitOrderFillData> | OptimizedMarketOrderBase<NativeRfqOrderFillData>;
//# sourceMappingURL=orders.d.ts.map