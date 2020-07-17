import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type TestRitualBridgeEventArgs = TestRitualBridgeERC20BridgeTransferEventArgs | TestRitualBridgeMarketSellCalledEventArgs;
export declare enum TestRitualBridgeEvents {
    ERC20BridgeTransfer = "ERC20BridgeTransfer",
    MarketSellCalled = "MarketSellCalled"
}
export interface TestRitualBridgeERC20BridgeTransferEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    from: string;
    to: string;
}
export interface TestRitualBridgeMarketSellCalledEventArgs extends DecodedLogArgs {
    takerAssetFillAmount: BigNumber;
    msgValue: BigNumber;
}
export declare class TestRitualBridgeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, weth: string): Promise<TestRitualBridgeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, weth: string): Promise<TestRitualBridgeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }, weth: string): Promise<TestRitualBridgeContract>;
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
    BUY_WINDOW_LENGTH(): ContractFunctionObj<BigNumber>;
    ERC20_PROXY_ID(): ContractFunctionObj<string>;
    MIN_INTERVAL_LENGTH(): ContractFunctionObj<BigNumber>;
    /**
     * Callback for `IERC20Bridge`. Tries to buy `makerAssetAmount` of
 * `makerToken` by selling the entirety of the `takerToken`
 * encoded in the bridge data.
      * @param makerToken The token to buy and transfer to `to`.
      * @param taker The recipient of the bought tokens.
      * @param makerAssetAmount Minimum amount of `makerToken` to buy.
      * @param bridgeData ABI-encoded addresses of the taker token and
     *     recurring buyer for whom the bridge order was created.
    * @returns success The magic bytes if successful.
     */
    bridgeTransferFrom(makerToken: string, index_1: string, taker: string, makerAssetAmount: BigNumber, bridgeData: string): ContractTxFunctionObj<string>;
    cancelRecurringBuy(sellToken: string, buyToken: string): ContractTxFunctionObj<void>;
    fillRecurringBuy(recurringBuyer: string, sellToken: string, buyToken: string, orders: Array<{
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumber;
        takerAssetAmount: BigNumber;
        makerFee: BigNumber;
        takerFee: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        makerAssetData: string;
        takerAssetData: string;
        makerFeeAssetData: string;
        takerFeeAssetData: string;
    }>, signatures: string[]): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    getOracleAddress(): ContractFunctionObj<string>;
    /**
     * `SignatureType.Wallet` callback, so that this bridge can be the maker
 * and sign for itself in orders. Always succeeds.
    * @returns magicValue Success bytes, always.
     */
    isValidSignature(index_0: string, index_1: string): ContractFunctionObj<string>;
    recurringBuys(index_0: string): ContractFunctionObj<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, boolean]>;
    setRecurringBuy(sellToken: string, buyToken: string, sellAmount: BigNumber, interval: BigNumber, minBuyAmount: BigNumber, maxSlippageBps: BigNumber, unwrapWeth: boolean, orders: Array<{
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumber;
        takerAssetAmount: BigNumber;
        makerFee: BigNumber;
        takerFee: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        makerAssetData: string;
        takerAssetData: string;
        makerFeeAssetData: string;
        takerFeeAssetData: string;
    }>, signatures: string[]): ContractTxFunctionObj<[string, BigNumber]>;
    /**
     * Subscribe to an event type emitted by the TestRitualBridge contract.
     * @param eventName The TestRitualBridge contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends TestRitualBridgeEventArgs>(eventName: TestRitualBridgeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The TestRitualBridge contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends TestRitualBridgeEventArgs>(eventName: TestRitualBridgeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_ritual_bridge.d.ts.map