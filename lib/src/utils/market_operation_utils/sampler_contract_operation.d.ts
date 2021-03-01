import { ContractFunctionObj } from '@0x/base-contract';
import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { ERC20BridgeSource, FillData, SourceQuoteOperation } from './types';
export declare type Parameters<T> = T extends (...args: infer TArgs) => any ? TArgs : never;
export interface SamplerContractCall<TFunc extends (...args: any[]) => ContractFunctionObj<any>, TFillData extends FillData = FillData> {
    contract: ERC20BridgeSamplerContract;
    function: TFunc;
    params: Parameters<TFunc>;
    callback?: (callResults: string, fillData: TFillData) => BigNumber[];
}
export declare class SamplerContractOperation<TFunc extends (...args: any[]) => ContractFunctionObj<any>, TFillData extends FillData = FillData> implements SourceQuoteOperation<TFillData> {
    readonly source: ERC20BridgeSource;
    fillData: TFillData;
    private readonly _samplerContract;
    private readonly _samplerFunction;
    private readonly _params;
    private readonly _callback?;
    constructor(opts: {
        source: ERC20BridgeSource;
        fillData?: TFillData;
    } & SamplerContractCall<TFunc, TFillData>);
    encodeCall(): string;
    handleCallResults(callResults: string): BigNumber[];
    handleRevert(callResults: string): BigNumber[];
}
//# sourceMappingURL=sampler_contract_operation.d.ts.map