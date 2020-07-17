import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type TestDydxBridgeEventArgs = TestDydxBridgeERC20BridgeTransferEventArgs | TestDydxBridgeOperateAccountEventArgs | TestDydxBridgeOperateActionEventArgs;
export declare enum TestDydxBridgeEvents {
    ERC20BridgeTransfer = "ERC20BridgeTransfer",
    OperateAccount = "OperateAccount",
    OperateAction = "OperateAction"
}
export interface TestDydxBridgeERC20BridgeTransferEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    from: string;
    to: string;
}
export interface TestDydxBridgeOperateAccountEventArgs extends DecodedLogArgs {
    owner: string;
    number: BigNumber;
}
export interface TestDydxBridgeOperateActionEventArgs extends DecodedLogArgs {
    actionType: number;
    accountIdx: BigNumber;
    amountSign: boolean;
    amountDenomination: number;
    amountRef: number;
    amountValue: BigNumber;
    primaryMarketId: BigNumber;
    secondaryMarketId: BigNumber;
    otherAddress: string;
    otherAccountId: BigNumber;
    data: string;
}
export declare class TestDydxBridgeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, holders: string[]): Promise<TestDydxBridgeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, holders: string[]): Promise<TestDydxBridgeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }, holders: string[]): Promise<TestDydxBridgeContract>;
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
     * Callback for `IERC20Bridge`. Deposits or withdraws tokens from a dydx account.
 * Notes:
 * 1. This bridge must be set as an operator of the input dydx account.
 * 2. This function may only be called in the context of the 0x Exchange.
 * 3. The maker or taker of the 0x order must be the dydx account owner.
 * 4. Deposits into dydx are made from the `from` address.
 * 5. Withdrawals from dydx are made to the `to` address.
 * 6. Calling this function must always withdraw at least `amount`,
 * otherwise the `ERC20Bridge` will revert.
      * @param from The sender of the tokens and owner of the dydx account.
      * @param to The recipient of the tokens.
      * @param amount Minimum amount of `toTokenAddress` tokens to deposit or
     *     withdraw.
      * @param encodedBridgeData An abi-encoded `BridgeData` struct.
    * @returns success The magic bytes if successful.
     */
    bridgeTransferFrom(index_0: string, from: string, to: string, amount: BigNumber, encodedBridgeData: string): ContractTxFunctionObj<string>;
    /**
     * Unused.
     */
    getAdjustedAccountValues(account: {
        owner: string;
        number: BigNumber;
    }): ContractFunctionObj<[{
        value: BigNumber;
    }, {
        value: BigNumber;
    }]>;
    /**
     * Unused.
     */
    getIsLocalOperator(owner: string, operator: string): ContractFunctionObj<boolean>;
    /**
     * Unsused
     */
    getMarketMarginPremium(marketId: BigNumber): ContractFunctionObj<{
        value: BigNumber;
    }>;
    /**
     * Unsused.
     */
    getMarketPrice(marketId: BigNumber): ContractFunctionObj<{
        value: BigNumber;
    }>;
    /**
     * Unused.
     */
    getMarketTokenAddress(marketId: BigNumber): ContractFunctionObj<string>;
    /**
     * Unused.
     */
    getRiskParams(): ContractFunctionObj<{
        marginRatio: {
            value: BigNumber;
        };
        liquidationSpread: {
            value: BigNumber;
        };
        earningsRate: {
            value: BigNumber;
        };
        minBorrowedValue: {
            value: BigNumber;
        };
    }>;
    /**
     * Returns test token.
     */
    getTestToken(): ContractTxFunctionObj<string>;
    /**
     * Simulates `operate` in dydx contract.
 * Emits events so that arguments can be validated client-side.
     */
    operate(accounts: Array<{
        owner: string;
        number: BigNumber;
    }>, actions: Array<{
        actionType: number | BigNumber;
        accountIdx: BigNumber;
        amount: {
            sign: boolean;
            denomination: number | BigNumber;
            ref: number | BigNumber;
            value: BigNumber;
        };
        primaryMarketId: BigNumber;
        secondaryMarketId: BigNumber;
        otherAddress: string;
        otherAccountIdx: BigNumber;
        data: string;
    }>): ContractTxFunctionObj<void>;
    /**
     * Unused.
     */
    setOperators(args: Array<{
        operator: string;
        trusted: boolean;
    }>): ContractTxFunctionObj<void>;
    /**
     * If `true` then subsequent calls to `operate` will revert.
     */
    setRevertOnOperate(shouldRevert: boolean): ContractTxFunctionObj<void>;
    /**
     * Subscribe to an event type emitted by the TestDydxBridge contract.
     * @param eventName The TestDydxBridge contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends TestDydxBridgeEventArgs>(eventName: TestDydxBridgeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The TestDydxBridge contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends TestDydxBridgeEventArgs>(eventName: TestDydxBridgeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_dydx_bridge.d.ts.map