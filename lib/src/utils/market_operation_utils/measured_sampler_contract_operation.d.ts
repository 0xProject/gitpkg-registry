import { ContractFunctionObj } from '@0x/base-contract';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { ERC20BridgeSource, FillData, MeasuredSamplerResult, MeasuredSourceQuoteOperation } from './types';
export declare type Parameters<T> = T extends (...args: infer TArgs) => any ? TArgs : never;
export interface MeasuredSamplerContractCall<TFunc extends (...args: any[]) => ContractFunctionObj<any>, TFillData extends FillData = FillData> {
    contract: ERC20BridgeSamplerContract;
    function: TFunc;
    params: Parameters<TFunc>;
    callback?: (callResults: string, fillData: TFillData) => MeasuredSamplerResult;
}
export declare class MeasuredSamplerContractOperation<TFunc extends (...args: any[]) => ContractFunctionObj<any>, TFillData extends FillData = FillData> implements MeasuredSourceQuoteOperation<TFillData> {
    readonly source: ERC20BridgeSource;
    fillData: TFillData;
    private readonly _samplerContract;
    private readonly _samplerFunction;
    private readonly _params;
    private readonly _callback?;
    private readonly _deregisterKey;
    private readonly _deregisterable;
    constructor(opts: {
        source: ERC20BridgeSource;
        fillData?: TFillData;
        deregisterable?: boolean;
    } & MeasuredSamplerContractCall<TFunc, TFillData>);
    encodeCall(): string;
    handleCallResults(callResults: string): MeasuredSamplerResult;
    handleRevert(callResults: string): MeasuredSamplerResult;
    isDeregistered(): boolean;
}
//# sourceMappingURL=measured_sampler_contract_operation.d.ts.map