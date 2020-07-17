import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type IChaiEventArgs = IChaiApprovalEventArgs | IChaiTransferEventArgs;
export declare enum IChaiEvents {
    Approval = "Approval",
    Transfer = "Transfer"
}
export interface IChaiApprovalEventArgs extends DecodedLogArgs {
    _owner: string;
    _spender: string;
    _value: BigNumber;
}
export interface IChaiTransferEventArgs extends DecodedLogArgs {
    _from: string;
    _to: string;
    _value: BigNumber;
}
export declare class IChaiContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IChaiContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IChaiContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<IChaiContract>;
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
    allowance(_owner: string, _spender: string): ContractFunctionObj<BigNumber>;
    /**
     * `msg.sender` approves `_spender` to spend `_value` tokens
      * @param _spender The address of the account able to transfer the tokens
      * @param _value The amount of wei to be approved for transfer
    * @returns Always true if the call has enough gas to complete execution
     */
    approve(_spender: string, _value: BigNumber): ContractTxFunctionObj<boolean>;
    balanceOf(_owner: string): ContractFunctionObj<BigNumber>;
    /**
     * Queries Dai balance of Chai holder.
      * @param usr Address of Chai holder.
    * @returns Dai balance.
     */
    dai(usr: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Withdraws Dai owned by `src`
      * @param src Address that owns Dai.
      * @param wad Amount of Dai to withdraw.
     */
    draw(src: string, wad: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Deposits Dai in exchange for Chai
      * @param dst Address to receive Chai.
      * @param wad Amount of Dai to deposit.
     */
    join(dst: string, wad: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Queries the Pot contract used by the Chai contract.
     */
    pot(): ContractTxFunctionObj<string>;
    /**
     * Query total supply of token
    * @returns Total supply of token
     */
    totalSupply(): ContractFunctionObj<BigNumber>;
    /**
     * send `value` token to `to` from `msg.sender`
      * @param _to The address of the recipient
      * @param _value The amount of token to be transferred
    * @returns True if transfer was successful
     */
    transfer(_to: string, _value: BigNumber): ContractTxFunctionObj<boolean>;
    /**
     * send `value` token to `to` from `from` on the condition it is approved by `from`
      * @param _from The address of the sender
      * @param _to The address of the recipient
      * @param _value The amount of token to be transferred
    * @returns True if transfer was successful
     */
    transferFrom(_from: string, _to: string, _value: BigNumber): ContractTxFunctionObj<boolean>;
    /**
     * Subscribe to an event type emitted by the IChai contract.
     * @param eventName The IChai contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends IChaiEventArgs>(eventName: IChaiEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The IChai contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends IChaiEventArgs>(eventName: IChaiEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=i_chai.d.ts.map