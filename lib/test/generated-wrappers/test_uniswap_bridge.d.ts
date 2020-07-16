import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type TestUniswapBridgeEventArgs = TestUniswapBridgeERC20BridgeTransferEventArgs | TestUniswapBridgeEthToTokenTransferInputEventArgs | TestUniswapBridgeTokenApproveEventArgs | TestUniswapBridgeTokenToEthSwapInputEventArgs | TestUniswapBridgeTokenToTokenTransferInputEventArgs | TestUniswapBridgeTokenTransferEventArgs | TestUniswapBridgeWethDepositEventArgs | TestUniswapBridgeWethWithdrawEventArgs;
export declare enum TestUniswapBridgeEvents {
    ERC20BridgeTransfer = "ERC20BridgeTransfer",
    EthToTokenTransferInput = "EthToTokenTransferInput",
    TokenApprove = "TokenApprove",
    TokenToEthSwapInput = "TokenToEthSwapInput",
    TokenToTokenTransferInput = "TokenToTokenTransferInput",
    TokenTransfer = "TokenTransfer",
    WethDeposit = "WethDeposit",
    WethWithdraw = "WethWithdraw"
}
export interface TestUniswapBridgeERC20BridgeTransferEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    from: string;
    to: string;
}
export interface TestUniswapBridgeEthToTokenTransferInputEventArgs extends DecodedLogArgs {
    exchange: string;
    minTokensBought: BigNumber;
    deadline: BigNumber;
    recipient: string;
}
export interface TestUniswapBridgeTokenApproveEventArgs extends DecodedLogArgs {
    spender: string;
    allowance: BigNumber;
}
export interface TestUniswapBridgeTokenToEthSwapInputEventArgs extends DecodedLogArgs {
    exchange: string;
    tokensSold: BigNumber;
    minEthBought: BigNumber;
    deadline: BigNumber;
}
export interface TestUniswapBridgeTokenToTokenTransferInputEventArgs extends DecodedLogArgs {
    exchange: string;
    tokensSold: BigNumber;
    minTokensBought: BigNumber;
    minEthBought: BigNumber;
    deadline: BigNumber;
    recipient: string;
    toTokenAddress: string;
}
export interface TestUniswapBridgeTokenTransferEventArgs extends DecodedLogArgs {
    token: string;
    from: string;
    to: string;
    amount: BigNumber;
}
export interface TestUniswapBridgeWethDepositEventArgs extends DecodedLogArgs {
    amount: BigNumber;
}
export interface TestUniswapBridgeWethWithdrawEventArgs extends DecodedLogArgs {
    amount: BigNumber;
}
export declare class TestUniswapBridgeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestUniswapBridgeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestUniswapBridgeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<TestUniswapBridgeContract>;
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
     * Callback for `IERC20Bridge`. Tries to buy `amount` of
 * `toTokenAddress` tokens by selling the entirety of the `fromTokenAddress`
 * token encoded in the bridge data.
      * @param toTokenAddress The token to buy and transfer to `to`.
      * @param from The maker (this contract).
      * @param to The recipient of the bought tokens.
      * @param amount Minimum amount of `toTokenAddress` tokens to buy.
      * @param bridgeData The abi-encoded "from" token address.
    * @returns success The magic bytes if successful.
     */
    bridgeTransferFrom(toTokenAddress: string, from: string, to: string, amount: BigNumber, bridgeData: string): ContractTxFunctionObj<string>;
    /**
     * Create a token and exchange (if they don't exist) for a new token
 * and sets the exchange revert and fill behavior. The wei attached
 * will be the fill amount for the exchange.
      * @param tokenAddress The token address. If zero, one will be created.
      * @param revertReason The revert reason for exchange operations.
     */
    createTokenAndExchange(tokenAddress: string, revertReason: string): ContractTxFunctionObj<[string, string]>;
    /**
     * `IUniswapExchangeFactory.getExchange`
     */
    getExchange(tokenAddress: string): ContractFunctionObj<string>;
    /**
     * `SignatureType.Wallet` callback, so that this bridge can be the maker
 * and sign for itself in orders. Always succeeds.
    * @returns magicValue Success bytes, always.
     */
    isValidSignature(index_0: string, index_1: string): ContractFunctionObj<string>;
    raiseEthToTokenTransferInput(minTokensBought: BigNumber, deadline: BigNumber, recipient: string): ContractTxFunctionObj<void>;
    raiseTokenApprove(spender: string, allowance: BigNumber): ContractTxFunctionObj<void>;
    raiseTokenToEthSwapInput(tokensSold: BigNumber, minEthBought: BigNumber, deadline: BigNumber): ContractTxFunctionObj<void>;
    raiseTokenToTokenTransferInput(tokensSold: BigNumber, minTokensBought: BigNumber, minEthBought: BigNumber, deadline: BigNumber, recipient: string, toTokenAddress: string): ContractTxFunctionObj<void>;
    raiseTokenTransfer(from: string, to: string, amount: BigNumber): ContractTxFunctionObj<void>;
    raiseWethDeposit(amount: BigNumber): ContractTxFunctionObj<void>;
    raiseWethWithdraw(amount: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Sets the balance of this contract for an existing token.
 * The wei attached will be the balance.
     */
    setTokenBalance(tokenAddress: string): ContractTxFunctionObj<void>;
    /**
     * Sets the revert reason for an existing token.
     */
    setTokenRevertReason(tokenAddress: string, revertReason: string): ContractTxFunctionObj<void>;
    wethToken(): ContractFunctionObj<string>;
    /**
     * Subscribe to an event type emitted by the TestUniswapBridge contract.
     * @param eventName The TestUniswapBridge contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends TestUniswapBridgeEventArgs>(eventName: TestUniswapBridgeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The TestUniswapBridge contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends TestUniswapBridgeEventArgs>(eventName: TestUniswapBridgeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_uniswap_bridge.d.ts.map