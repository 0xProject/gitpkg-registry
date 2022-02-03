import { EncoderOverrides, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type IERC20TokenV06EventArgs = IERC20TokenV06ApprovalEventArgs | IERC20TokenV06TransferEventArgs;
export declare enum IERC20TokenV06Events {
    Approval = "Approval",
    Transfer = "Transfer"
}
export interface IERC20TokenV06ApprovalEventArgs extends DecodedLogArgs {
    owner: string;
    spender: string;
    value: BigNumber;
}
export interface IERC20TokenV06TransferEventArgs extends DecodedLogArgs {
    from: string;
    to: string;
    value: BigNumber;
}
export declare class IERC20TokenV06Contract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IERC20TokenV06Contract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IERC20TokenV06Contract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<IERC20TokenV06Contract>;
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
    /**
     * Get the allowance for `spender` to spend from `owner`.
      * @param owner The address of the account owning tokens
      * @param spender The address of the account able to transfer the tokens
     */
    allowance(owner: string, spender: string): ContractTxFunctionObj<BigNumber>;
    /**
     * `msg.sender` approves `spender` to spend `value` tokens
      * @param spender The address of the account able to transfer the tokens
      * @param value The amount of wei to be approved for transfer
     */
    approve(spender: string, value: BigNumber): ContractTxFunctionObj<boolean>;
    /**
     * Get the balance of `owner`.
      * @param owner The address from which the balance will be retrieved
     */
    balanceOf(owner: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Get the number of decimals this token has.
     */
    decimals(): ContractTxFunctionObj<number>;
    /**
     * Query total supply of token
     */
    totalSupply(): ContractTxFunctionObj<BigNumber>;
    /**
     * send `value` token to `to` from `msg.sender`
      * @param to The address of the recipient
      * @param value The amount of token to be transferred
     */
    transfer(to: string, value: BigNumber): ContractTxFunctionObj<boolean>;
    /**
     * send `value` token to `to` from `from` on the condition it is approved by `from`
      * @param from The address of the sender
      * @param to The address of the recipient
      * @param value The amount of token to be transferred
     */
    transferFrom(from: string, to: string, value: BigNumber): ContractTxFunctionObj<boolean>;
    /**
     * Subscribe to an event type emitted by the IERC20TokenV06 contract.
     * @param eventName The IERC20TokenV06 contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends IERC20TokenV06EventArgs>(eventName: IERC20TokenV06Events, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The IERC20TokenV06 contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends IERC20TokenV06EventArgs>(eventName: IERC20TokenV06Events, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined, encoderOverrides?: Partial<EncoderOverrides>);
}
//# sourceMappingURL=i_erc20_token_v06.d.ts.map