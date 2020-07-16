import { AbiEncoder, BigNumber } from '@0x/utils';
export declare enum DydxBridgeActionType {
    Deposit = 0,
    Withdraw = 1
}
export interface DydxBridgeAction {
    actionType: DydxBridgeActionType;
    accountIdx: BigNumber;
    marketId: BigNumber;
    conversionRateNumerator: BigNumber;
    conversionRateDenominator: BigNumber;
}
export interface DydxBridgeData {
    accountNumbers: BigNumber[];
    actions: DydxBridgeAction[];
}
export declare const dydxBridgeDataEncoder: AbiEncoder.DataType;
//# sourceMappingURL=dydx_bridge_encoder.d.ts.map