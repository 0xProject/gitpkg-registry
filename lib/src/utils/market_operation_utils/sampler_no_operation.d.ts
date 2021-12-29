import { BigNumber } from '@0x/utils';
import { ERC20BridgeSource, FillData, SourceQuoteOperation } from './types';
interface SamplerNoOperationCall {
    callback: () => BigNumber[];
}
/**
 * SamplerNoOperation can be used for sources where we already have all the necessary information
 * required to perform the sample operations, without needing access to any on-chain data. Using a noop sample
 * you can skip the eth_call, and just calculate the results directly in typescript land.
 */
export declare class SamplerNoOperation<TFillData extends FillData = FillData> implements SourceQuoteOperation<TFillData> {
    readonly source: ERC20BridgeSource;
    fillData: TFillData;
    private readonly _callback;
    constructor(opts: {
        source: ERC20BridgeSource;
        fillData?: TFillData;
    } & SamplerNoOperationCall);
    encodeCall(): string;
    handleCallResults(_callResults: string): BigNumber[];
    handleRevert(_callResults: string): BigNumber[];
}
export {};
//# sourceMappingURL=sampler_no_operation.d.ts.map