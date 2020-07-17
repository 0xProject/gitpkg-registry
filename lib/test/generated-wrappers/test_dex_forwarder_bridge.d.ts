import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type TestDexForwarderBridgeEventArgs = TestDexForwarderBridgeBridgeTransferFromCalledEventArgs | TestDexForwarderBridgeERC20BridgeTransferEventArgs | TestDexForwarderBridgeTokenTransferCalledEventArgs;
export declare enum TestDexForwarderBridgeEvents {
    BridgeTransferFromCalled = "BridgeTransferFromCalled",
    ERC20BridgeTransfer = "ERC20BridgeTransfer",
    TokenTransferCalled = "TokenTransferCalled"
}
export interface TestDexForwarderBridgeBridgeTransferFromCalledEventArgs extends DecodedLogArgs {
    caller: string;
    inputTokenBalance: BigNumber;
    inputToken: string;
    outputToken: string;
    from: string;
    to: string;
    amount: BigNumber;
}
export interface TestDexForwarderBridgeERC20BridgeTransferEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    from: string;
    to: string;
}
export interface TestDexForwarderBridgeTokenTransferCalledEventArgs extends DecodedLogArgs {
    from: string;
    to: string;
    amount: BigNumber;
}
export declare class TestDexForwarderBridgeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestDexForwarderBridgeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestDexForwarderBridgeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<TestDexForwarderBridgeContract>;
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
    balanceOf(token: string, owner: string): ContractFunctionObj<BigNumber>;
    /**
     * Spends this contract's entire balance of input tokens by forwarding them to other bridges. Reverts if the entire balance is not spent.
      * @param outputToken The token being bought.
      * @param to The recipient of the bought tokens.
      * @param bridgeData The abi-encoded input token address.
    * @returns success The magic bytes if successful.
     */
    bridgeTransferFrom(outputToken: string, index_1: string, to: string, index_3: BigNumber, bridgeData: string): ContractTxFunctionObj<string>;
    createBridge(returnCode: string, revertError: string): ContractTxFunctionObj<string>;
    createToken(): ContractTxFunctionObj<string>;
    emitBridgeTransferFromCalled(caller: string, inputTokenBalance: BigNumber, inputToken: string, outputToken: string, from: string, to: string, amount: BigNumber): ContractTxFunctionObj<void>;
    emitTokenTransferCalled(from: string, to: string, amount: BigNumber): ContractTxFunctionObj<void>;
    executeBridgeCall(bridge: string, to: string, inputToken: string, outputToken: string, inputTokenAmount: BigNumber, outputTokenAmount: BigNumber, bridgeData: string): ContractTxFunctionObj<void>;
    /**
     * `SignatureType.Wallet` callback, so that this bridge can be the maker
 * and sign for itself in orders. Always succeeds.
    * @returns magicValue Magic success bytes, always.
     */
    isValidSignature(index_0: string, index_1: string): ContractFunctionObj<string>;
    setAuthorized(authorized: string): ContractTxFunctionObj<void>;
    setBridgeTransferAmount(bridge: string, amount: BigNumber): ContractTxFunctionObj<void>;
    setTokenBalance(token: string, owner: string, amount: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Subscribe to an event type emitted by the TestDexForwarderBridge contract.
     * @param eventName The TestDexForwarderBridge contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends TestDexForwarderBridgeEventArgs>(eventName: TestDexForwarderBridgeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The TestDexForwarderBridge contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends TestDexForwarderBridgeEventArgs>(eventName: TestDexForwarderBridgeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_dex_forwarder_bridge.d.ts.map