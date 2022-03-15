import { Address, MarketOperation } from '../../types';
import { CollapsedGenericBridgeFill, ERC20BridgeSource, CollapsedNativeOrderFill, OptimizedGenericBridgeOrder, OptimizedLimitOrder, OptimizedRfqOrder } from './types';
export declare function getErc20BridgeSourceToBridgeSource(source: ERC20BridgeSource): string;
export declare function createBridgeOrder(fill: CollapsedGenericBridgeFill, inputToken: Address, outputToken: Address): OptimizedGenericBridgeOrder;
export declare function getMakerTakerTokens(side: MarketOperation, inputToken: Address, outputToken: Address): [Address, Address];
export declare function createNativeOptimizedOrder(fill: CollapsedNativeOrderFill, side: MarketOperation): OptimizedLimitOrder | OptimizedRfqOrder;
//# sourceMappingURL=orders.d.ts.map