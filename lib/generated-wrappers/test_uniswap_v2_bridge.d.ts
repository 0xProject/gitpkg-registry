import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type TestUniswapV2BridgeEventArgs = TestUniswapV2BridgeERC20BridgeTransferEventArgs | TestUniswapV2BridgeSwapExactTokensForTokensInputEventArgs | TestUniswapV2BridgeTokenApproveEventArgs | TestUniswapV2BridgeTokenTransferEventArgs;
export declare enum TestUniswapV2BridgeEvents {
    ERC20BridgeTransfer = "ERC20BridgeTransfer",
    SwapExactTokensForTokensInput = "SwapExactTokensForTokensInput",
    TokenApprove = "TokenApprove",
    TokenTransfer = "TokenTransfer"
}
export interface TestUniswapV2BridgeERC20BridgeTransferEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    from: string;
    to: string;
}
export interface TestUniswapV2BridgeSwapExactTokensForTokensInputEventArgs extends DecodedLogArgs {
    amountIn: BigNumber;
    amountOutMin: BigNumber;
    toTokenAddress: string;
    to: string;
    deadline: BigNumber;
}
export interface TestUniswapV2BridgeTokenApproveEventArgs extends DecodedLogArgs {
    spender: string;
    allowance: BigNumber;
}
export interface TestUniswapV2BridgeTokenTransferEventArgs extends DecodedLogArgs {
    token: string;
    from: string;
    to: string;
    amount: BigNumber;
}
export declare class TestUniswapV2BridgeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestUniswapV2BridgeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestUniswapV2BridgeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<TestUniswapV2BridgeContract>;
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
      * @param bridgeData The abi-encoded path of token addresses. Last element must
     *     be toTokenAddress
    * @returns success The magic bytes if successful.
     */
    bridgeTransferFrom(toTokenAddress: string, from: string, to: string, amount: BigNumber, bridgeData: string): ContractTxFunctionObj<string>;
    /**
     * Create a new token
      * @param tokenAddress The token address. If zero, one will be created.
     */
    createToken(tokenAddress: string): ContractTxFunctionObj<string>;
    getRouterAddress(): ContractFunctionObj<string>;
    /**
     * `SignatureType.Wallet` callback, so that this bridge can be the maker
 * and sign for itself in orders. Always succeeds.
    * @returns magicValue Success bytes, always.
     */
    isValidSignature(index_0: string, index_1: string): ContractFunctionObj<string>;
    raiseSwapExactTokensForTokensInput(amountIn: BigNumber, amountOutMin: BigNumber, toTokenAddress: string, to: string, deadline: BigNumber): ContractTxFunctionObj<void>;
    raiseTokenApprove(spender: string, allowance: BigNumber): ContractTxFunctionObj<void>;
    raiseTokenTransfer(from: string, to: string, amount: BigNumber): ContractTxFunctionObj<void>;
    setRouterRevertReason(revertReason: string): ContractTxFunctionObj<void>;
    /**
     * Sets the balance of this contract for an existing token.
 * The wei attached will be the balance.
     */
    setTokenBalance(tokenAddress: string, balance: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Subscribe to an event type emitted by the TestUniswapV2Bridge contract.
     * @param eventName The TestUniswapV2Bridge contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends TestUniswapV2BridgeEventArgs>(eventName: TestUniswapV2BridgeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The TestUniswapV2Bridge contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends TestUniswapV2BridgeEventArgs>(eventName: TestUniswapV2BridgeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_uniswap_v2_bridge.d.ts.map