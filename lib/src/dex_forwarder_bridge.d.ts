import { AbiEncoder, BigNumber } from '@0x/utils';
export interface DexForwarderBridgeCall {
    target: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    bridgeData: string;
}
export interface DexForwaderBridgeData {
    inputToken: string;
    calls: DexForwarderBridgeCall[];
}
export declare const dexForwarderBridgeDataEncoder: AbiEncoder.DataType;
//# sourceMappingURL=dex_forwarder_bridge.d.ts.map