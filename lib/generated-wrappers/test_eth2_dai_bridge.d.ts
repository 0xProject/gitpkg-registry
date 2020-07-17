import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type TestEth2DaiBridgeEventArgs = TestEth2DaiBridgeERC20BridgeTransferEventArgs | TestEth2DaiBridgeSellAllAmountEventArgs | TestEth2DaiBridgeTokenApproveEventArgs | TestEth2DaiBridgeTokenTransferEventArgs;
export declare enum TestEth2DaiBridgeEvents {
    ERC20BridgeTransfer = "ERC20BridgeTransfer",
    SellAllAmount = "SellAllAmount",
    TokenApprove = "TokenApprove",
    TokenTransfer = "TokenTransfer"
}
export interface TestEth2DaiBridgeERC20BridgeTransferEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    from: string;
    to: string;
}
export interface TestEth2DaiBridgeSellAllAmountEventArgs extends DecodedLogArgs {
    sellToken: string;
    sellTokenAmount: BigNumber;
    buyToken: string;
    minimumFillAmount: BigNumber;
}
export interface TestEth2DaiBridgeTokenApproveEventArgs extends DecodedLogArgs {
    token: string;
    spender: string;
    allowance: BigNumber;
}
export interface TestEth2DaiBridgeTokenTransferEventArgs extends DecodedLogArgs {
    token: string;
    from: string;
    to: string;
    amount: BigNumber;
}
export declare class TestEth2DaiBridgeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestEth2DaiBridgeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestEth2DaiBridgeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<TestEth2DaiBridgeContract>;
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
 * `toTokenAddress` tokens by selling the entirety of the opposing asset
 * (DAI or WETH) to the Eth2Dai contract, then transfers the bought
 * tokens to `to`.
      * @param toTokenAddress The token to give to `to` (either DAI or WETH).
      * @param from The maker (this contract).
      * @param to The recipient of the bought tokens.
      * @param amount Minimum amount of `toTokenAddress` tokens to buy.
      * @param bridgeData The abi-encoeded "from" token address.
    * @returns success The magic bytes if successful.
     */
    bridgeTransferFrom(toTokenAddress: string, from: string, to: string, amount: BigNumber, bridgeData: string): ContractTxFunctionObj<string>;
    /**
     * Create a token and set this contract's balance.
     */
    createToken(balance: BigNumber): ContractTxFunctionObj<string>;
    /**
     * `SignatureType.Wallet` callback, so that this bridge can be the maker
 * and sign for itself in orders. Always succeeds.
    * @returns magicValue Magic success bytes, always.
     */
    isValidSignature(index_0: string, index_1: string): ContractFunctionObj<string>;
    raiseTokenApprove(spender: string, allowance: BigNumber): ContractTxFunctionObj<void>;
    raiseTokenTransfer(from: string, to: string, amount: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Implementation of `IEth2Dai.sellAllAmount()`
     */
    sellAllAmount(sellTokenAddress: string, sellTokenAmount: BigNumber, buyTokenAddress: string, minimumFillAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Set the behavior for `IEth2Dai.sellAllAmount()`.
     */
    setFillBehavior(revertReason: string, fillAmount: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Set the behavior of a token's `transfer()`.
     */
    setTransferBehavior(tokenAddress: string, revertReason: string, returnData: string): ContractTxFunctionObj<void>;
    testTokens(index_0: string): ContractFunctionObj<string>;
    /**
     * Subscribe to an event type emitted by the TestEth2DaiBridge contract.
     * @param eventName The TestEth2DaiBridge contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends TestEth2DaiBridgeEventArgs>(eventName: TestEth2DaiBridgeEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The TestEth2DaiBridge contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends TestEth2DaiBridgeEventArgs>(eventName: TestEth2DaiBridgeEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_eth2_dai_bridge.d.ts.map