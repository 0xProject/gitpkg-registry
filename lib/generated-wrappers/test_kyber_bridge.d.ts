import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type TestKyberBridgeEventArgs = TestKyberBridgeERC20BridgeTransferEventArgs | TestKyberBridgeKyberBridgeTokenApproveEventArgs | TestKyberBridgeKyberBridgeTokenTransferEventArgs | TestKyberBridgeKyberBridgeTradeEventArgs | TestKyberBridgeKyberBridgeWethDepositEventArgs | TestKyberBridgeKyberBridgeWethWithdrawEventArgs;
export declare enum TestKyberBridgeEvents {
    ERC20BridgeTransfer = "ERC20BridgeTransfer",
    KyberBridgeTokenApprove = "KyberBridgeTokenApprove",
    KyberBridgeTokenTransfer = "KyberBridgeTokenTransfer",
    KyberBridgeTrade = "KyberBridgeTrade",
    KyberBridgeWethDeposit = "KyberBridgeWethDeposit",
    KyberBridgeWethWithdraw = "KyberBridgeWethWithdraw"
}
export interface TestKyberBridgeERC20BridgeTransferEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    from: string;
    to: string;
}
export interface TestKyberBridgeKyberBridgeTokenApproveEventArgs extends DecodedLogArgs {
    tokenAddress: string;
    ownerAddress: string;
    spenderAddress: string;
    allowance: BigNumber;
}
export interface TestKyberBridgeKyberBridgeTokenTransferEventArgs extends DecodedLogArgs {
    tokenAddress: string;
    ownerAddress: string;
    recipientAddress: string;
    amount: BigNumber;
}
export interface TestKyberBridgeKyberBridgeTradeEventArgs extends DecodedLogArgs {
    msgValue: BigNumber;
    sellTokenAddress: string;
    sellAmount: BigNumber;
    buyTokenAddress: string;
    recipientAddress: string;
    maxBuyTokenAmount: BigNumber;
    minConversionRate: BigNumber;
    walletId: string;
}
export interface TestKyberBridgeKyberBridgeWethDepositEventArgs extends DecodedLogArgs {
    msgValue: BigNumber;
    ownerAddress: string;
    amount: BigNumber;
}
export interface TestKyberBridgeKyberBridgeWethWithdrawEventArgs extends DecodedLogArgs {
    ownerAddress: string;
    amount: BigNumber;
}
export declare class TestKyberBridgeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestKyberBridgeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestKyberBridgeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<TestKyberBridgeContract>;
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
    KYBER_ETH_ADDRESS(): ContractFunctionObj<string>;
    /**
     * Callback for `IKyberBridge`. Tries to buy `amount` of
 * `toTokenAddress` tokens by selling the entirety of the opposing asset
 * to the `KyberNetworkProxy` contract, then transfers the bought
 * tokens to `to`.
      * @param toTokenAddress The token to give to `to`.
      * @param from The maker (this contract).
      * @param to The recipient of the bought tokens.
      * @param amount Minimum amount of `toTokenAddress` tokens to buy.
      * @param bridgeData The abi-encoeded "from" token address.
    * @returns success The magic bytes if successful.
     */
    bridgeTransferFrom(toTokenAddress: string, from: string, to: string, amount: BigNumber, bridgeData: string): ContractTxFunctionObj<string>;
    createToken(decimals: number | BigNumber): ContractTxFunctionObj<string>;
    grantTokensTo(tokenAddress: string, ownerAddress: string, amount: BigNumber): ContractTxFunctionObj<void>;
    /**
     * `SignatureType.Wallet` callback, so that this bridge can be the maker
 * and sign for itself in orders. Always succeeds.
    * @returns magicValue Magic success bytes, always.
     */
    isValidSignature(index_0: string, index_1: string): ContractFunctionObj<string>;
    setNextFillAmount(amount: BigNumber): ContractTxFunctionObj<void>;
    tokenApprove(ownerAddress: string, spenderAddress: string, allowance: BigNumber): ContractTxFunctionObj<boolean>;
    tokenBalanceOf(ownerAddress: string): ContractFunctionObj<BigNumber>;
    tokenTransfer(ownerAddress: string, recipientAddress: string, amount: BigNumber): ContractTxFunctionObj<boolean>;
    /**
     * Implementation of `IKyberNetworkProxy.trade()`
     */
    trade(sellTokenAddress: string, sellAmount: BigNumber, buyTokenAddress: string, recipientAddress: string, maxBuyTokenAmount: BigNumber, minConversionRate: BigNumber, walletId: string): ContractTxFunctionObj<BigNumber>;
    weth(): ContractFunctionObj<string>;
    wethDeposit(ownerAddress: string): ContractTxFunctionObj<void>;
    wethWithdraw(ownerAddress: string, amount: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Subscribe to an event type emitted by the TestKyberBridge contract.
     * @param eventName The TestKyberBridge contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends TestKyberBridgeEventArgs>(eventName: TestKyberBridgeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The TestKyberBridge contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends TestKyberBridgeEventArgs>(eventName: TestKyberBridgeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_kyber_bridge.d.ts.map