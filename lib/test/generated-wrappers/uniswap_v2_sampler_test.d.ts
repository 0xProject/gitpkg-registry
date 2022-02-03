import { EncoderOverrides, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type UniswapV2SamplerTestEventArgs = UniswapV2SamplerTestlogEventArgs | UniswapV2SamplerTestlog_addressEventArgs | UniswapV2SamplerTestlog_bytesEventArgs | UniswapV2SamplerTestlog_bytes32EventArgs | UniswapV2SamplerTestlog_intEventArgs | UniswapV2SamplerTestlog_named_addressEventArgs | UniswapV2SamplerTestlog_named_bytesEventArgs | UniswapV2SamplerTestlog_named_bytes32EventArgs | UniswapV2SamplerTestlog_named_decimal_intEventArgs | UniswapV2SamplerTestlog_named_decimal_uintEventArgs | UniswapV2SamplerTestlog_named_intEventArgs | UniswapV2SamplerTestlog_named_stringEventArgs | UniswapV2SamplerTestlog_named_uintEventArgs | UniswapV2SamplerTestlog_stringEventArgs | UniswapV2SamplerTestlog_uintEventArgs | UniswapV2SamplerTestlogsEventArgs;
export declare enum UniswapV2SamplerTestEvents {
    log = "log",
    log_address = "log_address",
    log_bytes = "log_bytes",
    log_bytes32 = "log_bytes32",
    log_int = "log_int",
    log_named_address = "log_named_address",
    log_named_bytes = "log_named_bytes",
    log_named_bytes32 = "log_named_bytes32",
    log_named_decimal_int = "log_named_decimal_int",
    log_named_decimal_uint = "log_named_decimal_uint",
    log_named_int = "log_named_int",
    log_named_string = "log_named_string",
    log_named_uint = "log_named_uint",
    log_string = "log_string",
    log_uint = "log_uint",
    logs = "logs"
}
export interface UniswapV2SamplerTestlogEventArgs extends DecodedLogArgs {
    str: string;
}
export interface UniswapV2SamplerTestlog_addressEventArgs extends DecodedLogArgs {
    addr: string;
}
export interface UniswapV2SamplerTestlog_bytesEventArgs extends DecodedLogArgs {
    data: string;
}
export interface UniswapV2SamplerTestlog_bytes32EventArgs extends DecodedLogArgs {
    data: string;
}
export interface UniswapV2SamplerTestlog_intEventArgs extends DecodedLogArgs {
    data: BigNumber;
}
export interface UniswapV2SamplerTestlog_named_addressEventArgs extends DecodedLogArgs {
    key: string;
    val: string;
}
export interface UniswapV2SamplerTestlog_named_bytesEventArgs extends DecodedLogArgs {
    key: string;
    val: string;
}
export interface UniswapV2SamplerTestlog_named_bytes32EventArgs extends DecodedLogArgs {
    key: string;
    val: string;
}
export interface UniswapV2SamplerTestlog_named_decimal_intEventArgs extends DecodedLogArgs {
    key: string;
    val: BigNumber;
    decimals: BigNumber;
}
export interface UniswapV2SamplerTestlog_named_decimal_uintEventArgs extends DecodedLogArgs {
    key: string;
    val: BigNumber;
    decimals: BigNumber;
}
export interface UniswapV2SamplerTestlog_named_intEventArgs extends DecodedLogArgs {
    key: string;
    val: BigNumber;
}
export interface UniswapV2SamplerTestlog_named_stringEventArgs extends DecodedLogArgs {
    key: string;
    val: string;
}
export interface UniswapV2SamplerTestlog_named_uintEventArgs extends DecodedLogArgs {
    key: string;
    val: BigNumber;
}
export interface UniswapV2SamplerTestlog_stringEventArgs extends DecodedLogArgs {
    str: string;
}
export interface UniswapV2SamplerTestlog_uintEventArgs extends DecodedLogArgs {
    data: BigNumber;
}
export interface UniswapV2SamplerTestlogsEventArgs extends DecodedLogArgs {
    data: string;
}
export declare class UniswapV2SamplerTestContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<UniswapV2SamplerTestContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<UniswapV2SamplerTestContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<UniswapV2SamplerTestContract>;
    /**
     * @returns      The contract ABI
     */
    static ABI(): ContractAbi;
    protected static _deployLibrariesAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, web3Wrapper: Web3Wrapper, txDefaults: Partial<TxData>, libraryAddresses?: {
        [libraryName: string]: string;
    }): Promise<{
        [libraryName: string]: string;
    }>;
    getFunctionSignature(methodName: string): string;
    getABIDecodedTransactionData<T>(methodName: string, callData: string): T;
    getABIDecodedReturnData<T>(methodName: string, callData: string): T;
    getSelector(methodName: string): string;
    IS_TEST(): ContractTxFunctionObj<boolean>;
    failed(): ContractTxFunctionObj<boolean>;
    setUp(): ContractTxFunctionObj<void>;
    testUniswapV2Sell(): ContractTxFunctionObj<void>;
    /**
     * Subscribe to an event type emitted by the UniswapV2SamplerTest contract.
     * @param eventName The UniswapV2SamplerTest contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends UniswapV2SamplerTestEventArgs>(eventName: UniswapV2SamplerTestEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
    /**
     * Cancel a subscription
     * @param subscriptionToken Subscription token returned by `subscribe()`
     */
    unsubscribe(subscriptionToken: string): void;
    /**
     * Cancels all existing subscriptions
     */
    unsubscribeAll(): void;
    /**
     * Gets historical logs without creating a subscription
     * @param eventName The UniswapV2SamplerTest contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends UniswapV2SamplerTestEventArgs>(eventName: UniswapV2SamplerTestEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined, encoderOverrides?: Partial<EncoderOverrides>);
}
//# sourceMappingURL=uniswap_v2_sampler_test.d.ts.map