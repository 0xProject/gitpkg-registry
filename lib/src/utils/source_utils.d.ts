import { ERC20BridgeSource } from './market_operation_utils/types';
export declare const isCurveSource: (source: ERC20BridgeSource) => boolean;
export declare const getCurveInfo: (source: ERC20BridgeSource, takerToken: string, makerToken: string) => {
    curveAddress: string;
    fromTokenIdx: number;
    toTokenIdx: number;
    version: number;
};
//# sourceMappingURL=source_utils.d.ts.map