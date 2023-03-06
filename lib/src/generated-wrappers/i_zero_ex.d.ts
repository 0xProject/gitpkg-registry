import { EncoderOverrides, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { BlockRange, ContractAbi, ContractArtifact, DecodedLogArgs, LogWithDecodedArgs, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare type IZeroExEventArgs = IZeroExERC1155OrderCancelledEventArgs | IZeroExERC1155OrderFilledEventArgs | IZeroExERC1155OrderPreSignedEventArgs | IZeroExERC721OrderCancelledEventArgs | IZeroExERC721OrderFilledEventArgs | IZeroExERC721OrderPreSignedEventArgs | IZeroExLimitOrderFilledEventArgs | IZeroExLiquidityProviderSwapEventArgs | IZeroExMetaTransactionExecutedEventArgs | IZeroExMigratedEventArgs | IZeroExOrderCancelledEventArgs | IZeroExOrderSignerRegisteredEventArgs | IZeroExOtcOrderFilledEventArgs | IZeroExOwnershipTransferredEventArgs | IZeroExPairCancelledLimitOrdersEventArgs | IZeroExPairCancelledRfqOrdersEventArgs | IZeroExProxyFunctionUpdatedEventArgs | IZeroExQuoteSignerUpdatedEventArgs | IZeroExRfqOrderFilledEventArgs | IZeroExRfqOrderOriginsAllowedEventArgs | IZeroExTransformedERC20EventArgs | IZeroExTransformerDeployerUpdatedEventArgs;
export declare enum IZeroExEvents {
    ERC1155OrderCancelled = "ERC1155OrderCancelled",
    ERC1155OrderFilled = "ERC1155OrderFilled",
    ERC1155OrderPreSigned = "ERC1155OrderPreSigned",
    ERC721OrderCancelled = "ERC721OrderCancelled",
    ERC721OrderFilled = "ERC721OrderFilled",
    ERC721OrderPreSigned = "ERC721OrderPreSigned",
    LimitOrderFilled = "LimitOrderFilled",
    LiquidityProviderSwap = "LiquidityProviderSwap",
    MetaTransactionExecuted = "MetaTransactionExecuted",
    Migrated = "Migrated",
    OrderCancelled = "OrderCancelled",
    OrderSignerRegistered = "OrderSignerRegistered",
    OtcOrderFilled = "OtcOrderFilled",
    OwnershipTransferred = "OwnershipTransferred",
    PairCancelledLimitOrders = "PairCancelledLimitOrders",
    PairCancelledRfqOrders = "PairCancelledRfqOrders",
    ProxyFunctionUpdated = "ProxyFunctionUpdated",
    QuoteSignerUpdated = "QuoteSignerUpdated",
    RfqOrderFilled = "RfqOrderFilled",
    RfqOrderOriginsAllowed = "RfqOrderOriginsAllowed",
    TransformedERC20 = "TransformedERC20",
    TransformerDeployerUpdated = "TransformerDeployerUpdated"
}
export interface IZeroExERC1155OrderCancelledEventArgs extends DecodedLogArgs {
    maker: string;
    nonce: BigNumber;
}
export interface IZeroExERC1155OrderFilledEventArgs extends DecodedLogArgs {
    direction: number;
    maker: string;
    taker: string;
    nonce: BigNumber;
    erc20Token: string;
    erc20FillAmount: BigNumber;
    erc1155Token: string;
    erc1155TokenId: BigNumber;
    erc1155FillAmount: BigNumber;
    matcher: string;
}
export interface IZeroExERC1155OrderPreSignedEventArgs extends DecodedLogArgs {
    direction: number;
    maker: string;
    taker: string;
    expiry: BigNumber;
    nonce: BigNumber;
    erc20Token: string;
    erc20TokenAmount: BigNumber;
    fees: Array<{
        recipient: string;
        amount: BigNumber;
        feeData: string;
    }>;
    erc1155Token: string;
    erc1155TokenId: BigNumber;
    erc1155TokenProperties: Array<{
        propertyValidator: string;
        propertyData: string;
    }>;
    erc1155TokenAmount: BigNumber;
}
export interface IZeroExERC721OrderCancelledEventArgs extends DecodedLogArgs {
    maker: string;
    nonce: BigNumber;
}
export interface IZeroExERC721OrderFilledEventArgs extends DecodedLogArgs {
    direction: number;
    maker: string;
    taker: string;
    nonce: BigNumber;
    erc20Token: string;
    erc20TokenAmount: BigNumber;
    erc721Token: string;
    erc721TokenId: BigNumber;
    matcher: string;
}
export interface IZeroExERC721OrderPreSignedEventArgs extends DecodedLogArgs {
    direction: number;
    maker: string;
    taker: string;
    expiry: BigNumber;
    nonce: BigNumber;
    erc20Token: string;
    erc20TokenAmount: BigNumber;
    fees: Array<{
        recipient: string;
        amount: BigNumber;
        feeData: string;
    }>;
    erc721Token: string;
    erc721TokenId: BigNumber;
    erc721TokenProperties: Array<{
        propertyValidator: string;
        propertyData: string;
    }>;
}
export interface IZeroExLimitOrderFilledEventArgs extends DecodedLogArgs {
    orderHash: string;
    maker: string;
    taker: string;
    feeRecipient: string;
    makerToken: string;
    takerToken: string;
    takerTokenFilledAmount: BigNumber;
    makerTokenFilledAmount: BigNumber;
    takerTokenFeeFilledAmount: BigNumber;
    protocolFeePaid: BigNumber;
    pool: string;
}
export interface IZeroExLiquidityProviderSwapEventArgs extends DecodedLogArgs {
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
    provider: string;
    recipient: string;
}
export interface IZeroExMetaTransactionExecutedEventArgs extends DecodedLogArgs {
    hash: string;
    selector: string;
    signer: string;
    sender: string;
}
export interface IZeroExMigratedEventArgs extends DecodedLogArgs {
    caller: string;
    migrator: string;
    newOwner: string;
}
export interface IZeroExOrderCancelledEventArgs extends DecodedLogArgs {
    orderHash: string;
    maker: string;
}
export interface IZeroExOrderSignerRegisteredEventArgs extends DecodedLogArgs {
    maker: string;
    signer: string;
    allowed: boolean;
}
export interface IZeroExOtcOrderFilledEventArgs extends DecodedLogArgs {
    orderHash: string;
    maker: string;
    taker: string;
    makerToken: string;
    takerToken: string;
    makerTokenFilledAmount: BigNumber;
    takerTokenFilledAmount: BigNumber;
}
export interface IZeroExOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}
export interface IZeroExPairCancelledLimitOrdersEventArgs extends DecodedLogArgs {
    maker: string;
    makerToken: string;
    takerToken: string;
    minValidSalt: BigNumber;
}
export interface IZeroExPairCancelledRfqOrdersEventArgs extends DecodedLogArgs {
    maker: string;
    makerToken: string;
    takerToken: string;
    minValidSalt: BigNumber;
}
export interface IZeroExProxyFunctionUpdatedEventArgs extends DecodedLogArgs {
    selector: string;
    oldImpl: string;
    newImpl: string;
}
export interface IZeroExQuoteSignerUpdatedEventArgs extends DecodedLogArgs {
    quoteSigner: string;
}
export interface IZeroExRfqOrderFilledEventArgs extends DecodedLogArgs {
    orderHash: string;
    maker: string;
    taker: string;
    makerToken: string;
    takerToken: string;
    takerTokenFilledAmount: BigNumber;
    makerTokenFilledAmount: BigNumber;
    pool: string;
}
export interface IZeroExRfqOrderOriginsAllowedEventArgs extends DecodedLogArgs {
    origin: string;
    addrs: string[];
    allowed: boolean;
}
export interface IZeroExTransformedERC20EventArgs extends DecodedLogArgs {
    taker: string;
    inputToken: string;
    outputToken: string;
    inputTokenAmount: BigNumber;
    outputTokenAmount: BigNumber;
}
export interface IZeroExTransformerDeployerUpdatedEventArgs extends DecodedLogArgs {
    transformerDeployer: string;
}
export declare class IZeroExContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    private readonly _subscriptionManager;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }): Promise<IZeroExContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }): Promise<IZeroExContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<IZeroExContract>;
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
     * Fill a limit order. Internal variant. ETH protocol fees can be
     * attached to this call. Any unspent ETH will be refunded to
     * `msg.sender` (not `sender`).
     * @param order The limit order.
     * @param signature The order signature.
     * @param takerTokenFillAmount Maximum taker token to fill this order with.
     * @param taker The order taker.
     * @param sender The order sender.
     */
    _fillLimitOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber, taker: string, sender: string): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Fill an OTC order for up to `takerTokenFillAmount` taker tokens.
     * Internal variant.
     * @param order The OTC order.
     * @param makerSignature The order signature from the maker.
     * @param takerTokenFillAmount Maximum taker token amount to fill this
     *     order with.
     * @param taker The address to fill the order in the context of.
     * @param useSelfBalance Whether to use the Exchange Proxy's balance        of
     *     input tokens.
     * @param recipient The recipient of the bought maker tokens.
     */
    _fillOtcOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }, makerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber, taker: string, useSelfBalance: boolean, recipient: string): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Fill an RFQ order. Internal variant.
     * @param order The RFQ order.
     * @param signature The order signature.
     * @param takerTokenFillAmount Maximum taker token to fill this order with.
     * @param taker The order taker.
     * @param useSelfBalance Whether to use the ExchangeProxy's transient
     *     balance of taker tokens to fill the order.
     * @param recipient The recipient of the maker tokens.
     */
    _fillRfqOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber, taker: string, useSelfBalance: boolean, recipient: string): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Executes a multiplex BatchSell using the given
     * parameters. Internal only.
     * @param params The parameters for the BatchSell.
     * @param minBuyAmount The minimum amount of `params.outputToken`        that
     *     must be bought for this function to not revert.
     */
    _multiplexBatchSell(params: {
        inputToken: string;
        outputToken: string;
        sellAmount: BigNumber;
        calls: Array<{
            id: number | BigNumber;
            sellAmount: BigNumber;
            data: string;
        }>;
        useSelfBalance: boolean;
        recipient: string;
        payer: string;
    }, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Executes a multiplex MultiHopSell using the given
     * parameters. Internal only.
     * @param params The parameters for the MultiHopSell.
     * @param minBuyAmount The minimum amount of the output token        that must
     *     be bought for this function to not revert.
     */
    _multiplexMultiHopSell(params: {
        tokens: string[];
        sellAmount: BigNumber;
        calls: Array<{
            id: number | BigNumber;
            data: string;
        }>;
        useSelfBalance: boolean;
        recipient: string;
        payer: string;
    }, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Sell a token for another token directly against uniswap v3.
     * Private variant, uses tokens held by `address(this)`.
     * @param encodedPath Uniswap-encoded path.
     * @param sellAmount amount of the first token in the path to sell.
     * @param minBuyAmount Minimum amount of the last token in the path to buy.
     * @param recipient The recipient of the bought tokens. Can be zero for sender.
     */
    _sellHeldTokenForTokenToUniswapV3(encodedPath: string, sellAmount: BigNumber, minBuyAmount: BigNumber, recipient: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Sell a token for another token directly against uniswap v3. Internal variant.
     * @param encodedPath Uniswap-encoded path.
     * @param sellAmount amount of the first token in the path to sell.
     * @param minBuyAmount Minimum amount of the last token in the path to buy.
     * @param recipient The recipient of the bought tokens. Can be zero for payer.
     * @param payer The address to pull the sold tokens from.
     */
    _sellTokenForTokenToUniswapV3(encodedPath: string, sellAmount: BigNumber, minBuyAmount: BigNumber, recipient: string, payer: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Internal version of `transformERC20()`. Only callable from within.
     * @param args A `TransformERC20Args` struct.
     */
    _transformERC20(args: {
        taker: string;
        inputToken: string;
        outputToken: string;
        inputTokenAmount: BigNumber;
        minOutputTokenAmount: BigNumber;
        transformations: Array<{
            deploymentNonce: number | BigNumber;
            data: string;
        }>;
        useSelfBalance: boolean;
        recipient: string;
    }): ContractTxFunctionObj<BigNumber>;
    /**
     * Buys multiple ERC1155 assets by filling the
     * given orders.
     * @param sellOrders The ERC1155 sell orders.
     * @param signatures The order signatures.
     * @param erc1155TokenAmounts The amounts of the ERC1155 assets        to buy
     *     for each order.
     * @param callbackData The data (if any) to pass to the taker        callback
     *     for each order. Refer to the `callbackData`        parameter to for
     *     `buyERC1155`.
     * @param revertIfIncomplete If true, reverts if this        function fails to
     *     fill any individual order.
     */
    batchBuyERC1155s(sellOrders: Array<{
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, erc1155TokenAmounts: BigNumber[], callbackData: string[], revertIfIncomplete: boolean): ContractTxFunctionObj<boolean[]>;
    /**
     * Buys multiple ERC721 assets by filling the
     * given orders.
     * @param sellOrders The ERC721 sell orders.
     * @param signatures The order signatures.
     * @param callbackData The data (if any) to pass to the taker        callback
     *     for each order. Refer to the `callbackData`        parameter to for
     *     `buyERC721`.
     * @param revertIfIncomplete If true, reverts if this        function fails to
     *     fill any individual order.
     */
    batchBuyERC721s(sellOrders: Array<{
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, callbackData: string[], revertIfIncomplete: boolean): ContractTxFunctionObj<boolean[]>;
    /**
     * Cancel multiple ERC1155 orders by their nonces. The caller
     * should be the maker of the orders. Silently succeeds if
     * an order with the same nonce has already been filled or
     * cancelled.
     * @param orderNonces The order nonces.
     */
    batchCancelERC1155Orders(orderNonces: BigNumber[]): ContractTxFunctionObj<void>;
    /**
     * Cancel multiple ERC721 orders by their nonces. The caller
     * should be the maker of the orders. Silently succeeds if
     * an order with the same nonce has already been filled or
     * cancelled.
     * @param orderNonces The order nonces.
     */
    batchCancelERC721Orders(orderNonces: BigNumber[]): ContractTxFunctionObj<void>;
    /**
     * Cancel multiple limit orders. The caller must be the maker or a valid order signer.
     * Silently succeeds if the order has already been cancelled.
     * @param orders The limit orders.
     */
    batchCancelLimitOrders(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>): ContractTxFunctionObj<void>;
    /**
     * Cancel all limit orders for a given maker and pairs with salts less
     * than the values provided. The caller must be the maker. Subsequent
     * calls to this function with the same caller and pair require the
     * new salt to be >= the old salt.
     * @param makerTokens The maker tokens.
     * @param takerTokens The taker tokens.
     * @param minValidSalts The new minimum valid salts.
     */
    batchCancelPairLimitOrders(makerTokens: string[], takerTokens: string[], minValidSalts: BigNumber[]): ContractTxFunctionObj<void>;
    /**
     * Cancel all limit orders for a given maker and pairs with salts less
     * than the values provided. The caller must be a signer registered to the maker.
     * Subsequent calls to this function with the same maker and pair require the
     * new salt to be >= the old salt.
     * @param maker The maker for which to cancel.
     * @param makerTokens The maker tokens.
     * @param takerTokens The taker tokens.
     * @param minValidSalts The new minimum valid salts.
     */
    batchCancelPairLimitOrdersWithSigner(maker: string, makerTokens: string[], takerTokens: string[], minValidSalts: BigNumber[]): ContractTxFunctionObj<void>;
    /**
     * Cancel all RFQ orders for a given maker and pairs with salts less
     * than the values provided. The caller must be the maker. Subsequent
     * calls to this function with the same caller and pair require the
     * new salt to be >= the old salt.
     * @param makerTokens The maker tokens.
     * @param takerTokens The taker tokens.
     * @param minValidSalts The new minimum valid salts.
     */
    batchCancelPairRfqOrders(makerTokens: string[], takerTokens: string[], minValidSalts: BigNumber[]): ContractTxFunctionObj<void>;
    /**
     * Cancel all RFQ orders for a given maker and pairs with salts less
     * than the values provided. The caller must be a signer registered to the maker.
     * Subsequent calls to this function with the same maker and pair require the
     * new salt to be >= the old salt.
     * @param maker The maker for which to cancel.
     * @param makerTokens The maker tokens.
     * @param takerTokens The taker tokens.
     * @param minValidSalts The new minimum valid salts.
     */
    batchCancelPairRfqOrdersWithSigner(maker: string, makerTokens: string[], takerTokens: string[], minValidSalts: BigNumber[]): ContractTxFunctionObj<void>;
    /**
     * Cancel multiple RFQ orders. The caller must be the maker or a valid order signer.
     * Silently succeeds if the order has already been cancelled.
     * @param orders The RFQ orders.
     */
    batchCancelRfqOrders(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>): ContractTxFunctionObj<void>;
    /**
     * Execute multiple meta-transactions.
     * @param mtxs The meta-transactions.
     * @param signatures The signature by each respective `mtx.signer`.
     */
    batchExecuteMetaTransactions(mtxs: Array<{
        signer: string;
        sender: string;
        minGasPrice: BigNumber;
        maxGasPrice: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        value: BigNumber;
        feeToken: string;
        feeAmount: BigNumber;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>): ContractTxFunctionObj<string[]>;
    /**
     * Execute multiple meta-transactions.
     * @param mtxs The meta-transactions.
     * @param signatures The signature by each respective `mtx.signer`.
     */
    batchExecuteMetaTransactionsV2(mtxs: Array<{
        signer: string;
        sender: string;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        feeToken: string;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
        }>;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>): ContractTxFunctionObj<string[]>;
    /**
     * Fills multiple limit orders.
     * @param orders Array of limit orders.
     * @param signatures Array of signatures corresponding to each order.
     * @param takerTokenFillAmounts Array of desired amounts to fill each order.
     * @param revertIfIncomplete If true, reverts if this function fails to
     *     fill the full fill amount for any individual order.
     */
    batchFillLimitOrders(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, takerTokenFillAmounts: BigNumber[], revertIfIncomplete: boolean): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Fills multiple RFQ orders.
     * @param orders Array of RFQ orders.
     * @param signatures Array of signatures corresponding to each order.
     * @param takerTokenFillAmounts Array of desired amounts to fill each order.
     * @param revertIfIncomplete If true, reverts if this function fails to
     *     fill the full fill amount for any individual order.
     */
    batchFillRfqOrders(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, takerTokenFillAmounts: BigNumber[], revertIfIncomplete: boolean): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Fills multiple taker-signed OTC orders.
     * @param orders Array of OTC orders.
     * @param makerSignatures Array of maker signatures for each order.
     * @param takerSignatures Array of taker signatures for each order.
     * @param unwrapWeth Array of booleans representing whether or not        to
     *     unwrap bought WETH into ETH for each order. Should be set        to
     *     false if the maker token is not WETH.
     */
    batchFillTakerSignedOtcOrders(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }>, makerSignatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, takerSignatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, unwrapWeth: boolean[]): ContractTxFunctionObj<boolean[]>;
    /**
     * Batch version of `getLimitOrderRelevantState()`, without reverting.
     * Orders that would normally cause `getLimitOrderRelevantState()`
     * to revert will have empty results.
     * @param orders The limit orders.
     * @param signatures The order signatures.
     */
    batchGetLimitOrderRelevantStates(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>): ContractTxFunctionObj<[
        Array<{
            orderHash: string;
            status: number;
            takerTokenFilledAmount: BigNumber;
        }>,
        BigNumber[],
        boolean[]
    ]>;
    /**
     * Batch version of `getRfqOrderRelevantState()`, without reverting.
     * Orders that would normally cause `getRfqOrderRelevantState()`
     * to revert will have empty results.
     * @param orders The RFQ orders.
     * @param signatures The order signatures.
     */
    batchGetRfqOrderRelevantStates(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>, signatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>): ContractTxFunctionObj<[
        Array<{
            orderHash: string;
            status: number;
            takerTokenFilledAmount: BigNumber;
        }>,
        BigNumber[],
        boolean[]
    ]>;
    /**
     * Matches pairs of complementary orders that have
     * non-negative spreads. Each order is filled at
     * their respective price, and the matcher receives
     * a profit denominated in the ERC20 token.
     * @param sellOrders Orders selling ERC721 assets.
     * @param buyOrders Orders buying ERC721 assets.
     * @param sellOrderSignatures Signatures for the sell orders.
     * @param buyOrderSignatures Signatures for the buy orders.
     */
    batchMatchERC721Orders(sellOrders: Array<{
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }>, buyOrders: Array<{
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }>, sellOrderSignatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, buyOrderSignatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>): ContractTxFunctionObj<[BigNumber[], boolean[]]>;
    /**
     * Buys an ERC1155 asset by filling the given order.
     * @param sellOrder The ERC1155 sell order.
     * @param signature The order signature.
     * @param erc1155BuyAmount The amount of the ERC1155 asset        to buy.
     * @param callbackData If this parameter is non-zero, invokes
     *     `zeroExERC1155OrderCallback` on `msg.sender` after        the ERC1155
     *     asset has been transferred to `msg.sender`        but before
     *     transferring the ERC20 tokens to the seller.        Native tokens
     *     acquired during the callback can be used        to fill the order.
     */
    buyERC1155(sellOrder: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, erc1155BuyAmount: BigNumber, callbackData: string): ContractTxFunctionObj<void>;
    /**
     * Buys an ERC721 asset by filling the given order.
     * @param sellOrder The ERC721 sell order.
     * @param signature The order signature.
     * @param callbackData If this parameter is non-zero, invokes
     *     `zeroExERC721OrderCallback` on `msg.sender` after        the ERC721
     *     asset has been transferred to `msg.sender`        but before
     *     transferring the ERC20 tokens to the seller.        Native tokens
     *     acquired during the callback can be used        to fill the order.
     */
    buyERC721(sellOrder: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, callbackData: string): ContractTxFunctionObj<void>;
    /**
     * Cancel a single ERC1155 order by its nonce. The caller
     * should be the maker of the order. Silently succeeds if
     * an order with the same nonce has already been filled or
     * cancelled.
     * @param orderNonce The order nonce.
     */
    cancelERC1155Order(orderNonce: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Cancel a single ERC721 order by its nonce. The caller
     * should be the maker of the order. Silently succeeds if
     * an order with the same nonce has already been filled or
     * cancelled.
     * @param orderNonce The order nonce.
     */
    cancelERC721Order(orderNonce: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Cancel a single limit order. The caller must be the maker or a valid order signer.
     * Silently succeeds if the order has already been cancelled.
     * @param order The limit order.
     */
    cancelLimitOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }): ContractTxFunctionObj<void>;
    /**
     * Cancel all limit orders for a given maker and pair with a salt less
     * than the value provided. The caller must be the maker. Subsequent
     * calls to this function with the same caller and pair require the
     * new salt to be >= the old salt.
     * @param makerToken The maker token.
     * @param takerToken The taker token.
     * @param minValidSalt The new minimum valid salt.
     */
    cancelPairLimitOrders(makerToken: string, takerToken: string, minValidSalt: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Cancel all limit orders for a given maker and pair with a salt less
     * than the value provided. The caller must be a signer registered to the maker.
     * Subsequent calls to this function with the same maker and pair require the
     * new salt to be >= the old salt.
     * @param maker The maker for which to cancel.
     * @param makerToken The maker token.
     * @param takerToken The taker token.
     * @param minValidSalt The new minimum valid salt.
     */
    cancelPairLimitOrdersWithSigner(maker: string, makerToken: string, takerToken: string, minValidSalt: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Cancel all RFQ orders for a given maker and pair with a salt less
     * than the value provided. The caller must be the maker. Subsequent
     * calls to this function with the same caller and pair require the
     * new salt to be >= the old salt.
     * @param makerToken The maker token.
     * @param takerToken The taker token.
     * @param minValidSalt The new minimum valid salt.
     */
    cancelPairRfqOrders(makerToken: string, takerToken: string, minValidSalt: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Cancel all RFQ orders for a given maker and pair with a salt less
     * than the value provided. The caller must be a signer registered to the maker.
     * Subsequent calls to this function with the same maker and pair require the
     * new salt to be >= the old salt.
     * @param maker The maker for which to cancel.
     * @param makerToken The maker token.
     * @param takerToken The taker token.
     * @param minValidSalt The new minimum valid salt.
     */
    cancelPairRfqOrdersWithSigner(maker: string, makerToken: string, takerToken: string, minValidSalt: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Cancel a single RFQ order. The caller must be the maker or a valid order signer.
     * Silently succeeds if the order has already been cancelled.
     * @param order The RFQ order.
     */
    cancelRfqOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }): ContractTxFunctionObj<void>;
    /**
     * Deploy a new flash wallet instance and replace the current one with it.
     * Useful if we somehow break the current wallet instance.
     * Only callable by the owner.
     */
    createTransformWallet(): ContractTxFunctionObj<string>;
    /**
     * Execute a single meta-transaction.
     * @param mtx The meta-transaction.
     * @param signature The signature by `mtx.signer`.
     */
    executeMetaTransaction(mtx: {
        signer: string;
        sender: string;
        minGasPrice: BigNumber;
        maxGasPrice: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        value: BigNumber;
        feeToken: string;
        feeAmount: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<string>;
    /**
     * Execute a single meta-transaction.
     * @param mtx The meta-transaction.
     * @param signature The signature by `mtx.signer`.
     */
    executeMetaTransactionV2(mtx: {
        signer: string;
        sender: string;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        feeToken: string;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
        }>;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<string>;
    /**
     * Register or replace a function.
     * @param selector The function selector.
     * @param impl The implementation contract for the function.
     */
    extend(selector: string, impl: string): ContractTxFunctionObj<void>;
    /**
     * Fill a limit order. The taker and sender will be the caller.
     * @param order The limit order. ETH protocol fees can be      attached to this
     *     call. Any unspent ETH will be refunded to      the caller.
     * @param signature The order signature.
     * @param takerTokenFillAmount Maximum taker token amount to fill this order
     *     with.
     */
    fillLimitOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Fill an RFQ order for exactly `takerTokenFillAmount` taker tokens.
     * The taker will be the caller. ETH protocol fees can be
     * attached to this call. Any unspent ETH will be refunded to
     * the caller.
     * @param order The limit order.
     * @param signature The order signature.
     * @param takerTokenFillAmount How much taker token to fill this order with.
     */
    fillOrKillLimitOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Fill an RFQ order for exactly `takerTokenFillAmount` taker tokens.
     * The taker will be the caller.
     * @param order The RFQ order.
     * @param signature The order signature.
     * @param takerTokenFillAmount How much taker token to fill this order with.
     */
    fillOrKillRfqOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Fill an OTC order for up to `takerTokenFillAmount` taker tokens.
     * @param order The OTC order.
     * @param makerSignature The order signature from the maker.
     * @param takerTokenFillAmount Maximum taker token amount to fill this
     *     order with.
     */
    fillOtcOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }, makerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Fill an OTC order for up to `takerTokenFillAmount` taker tokens.
     * Unwraps bought WETH into ETH before sending it to
     * the taker.
     * @param order The OTC order.
     * @param makerSignature The order signature from the maker.
     * @param takerTokenFillAmount Maximum taker token amount to fill this
     *     order with.
     */
    fillOtcOrderForEth(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }, makerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Fill an OTC order whose taker token is WETH for up
     * to `msg.value`.
     * @param order The OTC order.
     * @param makerSignature The order signature from the maker.
     */
    fillOtcOrderWithEth(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }, makerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Fill an RFQ order for up to `takerTokenFillAmount` taker tokens.
     * The taker will be the caller.
     * @param order The RFQ order.
     * @param signature The order signature.
     * @param takerTokenFillAmount Maximum taker token amount to fill this order
     *     with.
     */
    fillRfqOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerTokenFillAmount: BigNumber): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Fully fill an OTC order. "Meta-transaction" variant,
     * requires order to be signed by both maker and taker.
     * @param order The OTC order.
     * @param makerSignature The order signature from the maker.
     * @param takerSignature The order signature from the taker.
     */
    fillTakerSignedOtcOrder(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }, makerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<void>;
    /**
     * Fully fill an OTC order. "Meta-transaction" variant,
     * requires order to be signed by both maker and taker.
     * Unwraps bought WETH into ETH before sending it to
     * the taker.
     * @param order The OTC order.
     * @param makerSignature The order signature from the maker.
     * @param takerSignature The order signature from the taker.
     */
    fillTakerSignedOtcOrderForEth(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }, makerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, takerSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<void>;
    /**
     * Get the EIP-712 hash of an ERC1155 order.
     * @param order The ERC1155 order.
     */
    getERC1155OrderHash(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }): ContractTxFunctionObj<string>;
    /**
     * Get the order info for an ERC1155 order.
     * @param order The ERC1155 order.
     */
    getERC1155OrderInfo(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }): ContractTxFunctionObj<{
        orderHash: string;
        status: number;
        orderAmount: BigNumber;
        remainingAmount: BigNumber;
    }>;
    /**
     * Get the EIP-712 hash of an ERC721 order.
     * @param order The ERC721 order.
     */
    getERC721OrderHash(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }): ContractTxFunctionObj<string>;
    /**
     * Get the current status of an ERC721 order.
     * @param order The ERC721 order.
     */
    getERC721OrderStatus(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }): ContractTxFunctionObj<number>;
    /**
     * Get the order status bit vector for the given
     * maker address and nonce range.
     * @param maker The maker of the order.
     * @param nonceRange Order status bit vectors are indexed        by maker
     *     address and the upper 248 bits of the        order nonce. We define
     *     `nonceRange` to be these        248 bits.
     */
    getERC721OrderStatusBitVector(maker: string, nonceRange: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Get the canonical hash of a limit order.
     * @param order The limit order.
     */
    getLimitOrderHash(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }): ContractTxFunctionObj<string>;
    /**
     * Get the order info for a limit order.
     * @param order The limit order.
     */
    getLimitOrderInfo(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }): ContractTxFunctionObj<{
        orderHash: string;
        status: number;
        takerTokenFilledAmount: BigNumber;
    }>;
    /**
     * Get order info, fillable amount, and signature validity for a limit order.
     * Fillable amount is determined using balances and allowances of the maker.
     * @param order The limit order.
     * @param signature The order signature.
     */
    getLimitOrderRelevantState(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<[
        {
            orderHash: string;
            status: number;
            takerTokenFilledAmount: BigNumber;
        },
        BigNumber,
        boolean
    ]>;
    /**
     * Get the block at which a meta-transaction has been executed.
     * @param mtx The meta-transaction.
     */
    getMetaTransactionExecutedBlock(mtx: {
        signer: string;
        sender: string;
        minGasPrice: BigNumber;
        maxGasPrice: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        value: BigNumber;
        feeToken: string;
        feeAmount: BigNumber;
    }): ContractTxFunctionObj<BigNumber>;
    /**
     * Get the EIP712 hash of a meta-transaction.
     * @param mtx The meta-transaction.
     */
    getMetaTransactionHash(mtx: {
        signer: string;
        sender: string;
        minGasPrice: BigNumber;
        maxGasPrice: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        value: BigNumber;
        feeToken: string;
        feeAmount: BigNumber;
    }): ContractTxFunctionObj<string>;
    /**
     * Get the block at which a meta-transaction hash has been executed.
     * @param mtxHash The meta-transaction hash.
     */
    getMetaTransactionHashExecutedBlock(mtxHash: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Get the block at which a meta-transaction has been executed.
     * @param mtx The meta-transaction.
     */
    getMetaTransactionV2ExecutedBlock(mtx: {
        signer: string;
        sender: string;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        feeToken: string;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
        }>;
    }): ContractTxFunctionObj<BigNumber>;
    /**
     * Get the EIP712 hash of a meta-transaction.
     * @param mtx The meta-transaction.
     */
    getMetaTransactionV2Hash(mtx: {
        signer: string;
        sender: string;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        callData: string;
        feeToken: string;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
        }>;
    }): ContractTxFunctionObj<string>;
    /**
     * Get the block at which a meta-transaction hash has been executed.
     * @param mtxHash The meta-transaction hash.
     */
    getMetaTransactionV2HashExecutedBlock(mtxHash: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Get the canonical hash of an OTC order.
     * @param order The OTC order.
     */
    getOtcOrderHash(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }): ContractTxFunctionObj<string>;
    /**
     * Get the order info for an OTC order.
     * @param order The OTC order.
     */
    getOtcOrderInfo(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        expiryAndNonce: BigNumber;
    }): ContractTxFunctionObj<{
        orderHash: string;
        status: number;
    }>;
    /**
     * Get the protocol fee multiplier. This should be multiplied by the
     * gas price to arrive at the required protocol fee to fill a native order.
     */
    getProtocolFeeMultiplier(): ContractTxFunctionObj<number>;
    /**
     * Return the optional signer for `transformERC20()` calldata.
     */
    getQuoteSigner(): ContractTxFunctionObj<string>;
    /**
     * Get the canonical hash of an RFQ order.
     * @param order The RFQ order.
     */
    getRfqOrderHash(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }): ContractTxFunctionObj<string>;
    /**
     * Get the order info for an RFQ order.
     * @param order The RFQ order.
     */
    getRfqOrderInfo(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }): ContractTxFunctionObj<{
        orderHash: string;
        status: number;
        takerTokenFilledAmount: BigNumber;
    }>;
    /**
     * Get order info, fillable amount, and signature validity for an RFQ order.
     * Fillable amount is determined using balances and allowances of the maker.
     * @param order The RFQ order.
     * @param signature The order signature.
     */
    getRfqOrderRelevantState(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        maker: string;
        taker: string;
        txOrigin: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<[
        {
            orderHash: string;
            status: number;
            takerTokenFilledAmount: BigNumber;
        },
        BigNumber,
        boolean
    ]>;
    /**
     * Retrieve an entry in the rollback history for a function.
     * @param selector The function selector.
     * @param idx The index in the rollback history.
     */
    getRollbackEntryAtIndex(selector: string, idx: BigNumber): ContractTxFunctionObj<string>;
    /**
     * Retrieve the length of the rollback history for a function.
     * @param selector The function selector.
     */
    getRollbackLength(selector: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Return the current wallet instance that will serve as the execution
     * context for transformations.
     */
    getTransformWallet(): ContractTxFunctionObj<string>;
    /**
     * Return the allowed deployer for transformers.
     */
    getTransformerDeployer(): ContractTxFunctionObj<string>;
    /**
     * checks if a given address is registered to sign on behalf of a maker address
     * @param maker The maker address encoded in an order (can be a contract)
     * @param signer The address that is providing a signature
     */
    isValidOrderSigner(maker: string, signer: string): ContractTxFunctionObj<boolean>;
    /**
     * Get the last nonce used for a particular
     * tx.origin address and nonce bucket.
     * @param txOrigin The address.
     * @param nonceBucket The nonce bucket index.
     */
    lastOtcTxOriginNonce(txOrigin: string, nonceBucket: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Matches a pair of complementary orders that have
     * a non-negative spread. Each order is filled at
     * their respective price, and the matcher receives
     * a profit denominated in the ERC20 token.
     * @param sellOrder Order selling an ERC721 asset.
     * @param buyOrder Order buying an ERC721 asset.
     * @param sellOrderSignature Signature for the sell order.
     * @param buyOrderSignature Signature for the buy order.
     */
    matchERC721Orders(sellOrder: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }, buyOrder: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }, sellOrderSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, buyOrderSignature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<BigNumber>;
    /**
     * Execute a migration function in the context of the ZeroEx contract.
     * The result of the function being called should be the magic bytes
     * 0x2c64c5ef (`keccack('MIGRATE_SUCCESS')`). Only callable by the owner.
     * The owner will be temporarily set to `address(this)` inside the call.
     * Before returning, the owner will be set to `newOwner`.
     * @param target The migrator contract address.
     * @param data The call data.
     * @param newOwner The address of the new owner.
     */
    migrate(target: string, data: string, newOwner: string): ContractTxFunctionObj<void>;
    /**
     * Sells attached ETH for `outputToken` using the provided
     * calls.
     * @param outputToken The token to buy.
     * @param calls The calls to use to sell the attached ETH.
     * @param minBuyAmount The minimum amount of `outputToken` that        must be
     *     bought for this function to not revert.
     */
    multiplexBatchSellEthForToken(outputToken: string, calls: Array<{
        id: number | BigNumber;
        sellAmount: BigNumber;
        data: string;
    }>, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Sells `sellAmount` of the given `inputToken` for ETH
     * using the provided calls.
     * @param inputToken The token to sell.
     * @param calls The calls to use to sell the input tokens.
     * @param sellAmount The amount of `inputToken` to sell.
     * @param minBuyAmount The minimum amount of ETH that        must be bought for
     *     this function to not revert.
     */
    multiplexBatchSellTokenForEth(inputToken: string, calls: Array<{
        id: number | BigNumber;
        sellAmount: BigNumber;
        data: string;
    }>, sellAmount: BigNumber, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Sells `sellAmount` of the given `inputToken` for
     * `outputToken` using the provided calls.
     * @param inputToken The token to sell.
     * @param outputToken The token to buy.
     * @param calls The calls to use to sell the input tokens.
     * @param sellAmount The amount of `inputToken` to sell.
     * @param minBuyAmount The minimum amount of `outputToken`        that must be
     *     bought for this function to not revert.
     */
    multiplexBatchSellTokenForToken(inputToken: string, outputToken: string, calls: Array<{
        id: number | BigNumber;
        sellAmount: BigNumber;
        data: string;
    }>, sellAmount: BigNumber, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Sells attached ETH via the given sequence of tokens
     * and calls. `tokens[0]` must be WETH.
     * The last token in `tokens` is the output token that
     * will ultimately be sent to `msg.sender`
     * @param tokens The sequence of tokens to use for the sell,        i.e.
     *     `tokens[i]` will be sold for `tokens[i+1]` via        `calls[i]`.
     * @param calls The sequence of calls to use for the sell.
     * @param minBuyAmount The minimum amount of output tokens that        must be
     *     bought for this function to not revert.
     */
    multiplexMultiHopSellEthForToken(tokens: string[], calls: Array<{
        id: number | BigNumber;
        data: string;
    }>, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Sells `sellAmount` of the input token (`tokens[0]`)
     * for ETH via the given sequence of tokens and calls.
     * The last token in `tokens` must be WETH.
     * @param tokens The sequence of tokens to use for the sell,        i.e.
     *     `tokens[i]` will be sold for `tokens[i+1]` via        `calls[i]`.
     * @param calls The sequence of calls to use for the sell.
     * @param minBuyAmount The minimum amount of ETH that        must be bought for
     *     this function to not revert.
     */
    multiplexMultiHopSellTokenForEth(tokens: string[], calls: Array<{
        id: number | BigNumber;
        data: string;
    }>, sellAmount: BigNumber, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Sells `sellAmount` of the input token (`tokens[0]`)
     * via the given sequence of tokens and calls.
     * The last token in `tokens` is the output token that
     * will ultimately be sent to `msg.sender`
     * @param tokens The sequence of tokens to use for the sell,        i.e.
     *     `tokens[i]` will be sold for `tokens[i+1]` via        `calls[i]`.
     * @param calls The sequence of calls to use for the sell.
     * @param minBuyAmount The minimum amount of output tokens that        must be
     *     bought for this function to not revert.
     */
    multiplexMultiHopSellTokenForToken(tokens: string[], calls: Array<{
        id: number | BigNumber;
        data: string;
    }>, sellAmount: BigNumber, minBuyAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Callback for the ERC1155 `safeTransferFrom` function.
     * This callback can be used to sell an ERC1155 asset if
     * a valid ERC1155 order, signature and `unwrapNativeToken`
     * are encoded in `data`. This allows takers to sell their
     * ERC1155 asset without first calling `setApprovalForAll`.
     * @param operator The address which called `safeTransferFrom`.
     * @param from The address which previously owned the token.
     * @param tokenId The ID of the asset being transferred.
     * @param value The amount being transferred.
     * @param data Additional data with no specified format. If a        valid
     *     ERC1155 order, signature and `unwrapNativeToken`        are encoded in
     *     `data`, this function will try to fill        the order using the
     *     received asset.
     */
    onERC1155Received(operator: string, from: string, tokenId: BigNumber, value: BigNumber, data: string): ContractTxFunctionObj<string>;
    /**
     * Callback for the ERC721 `safeTransferFrom` function.
     * This callback can be used to sell an ERC721 asset if
     * a valid ERC721 order, signature and `unwrapNativeToken`
     * are encoded in `data`. This allows takers to sell their
     * ERC721 asset without first calling `setApprovalForAll`.
     * @param operator The address which called `safeTransferFrom`.
     * @param from The address which previously owned the token.
     * @param tokenId The ID of the asset being transferred.
     * @param data Additional data with no specified format. If a        valid
     *     ERC721 order, signature and `unwrapNativeToken`        are encoded in
     *     `data`, this function will try to fill        the order using the
     *     received asset.
     */
    onERC721Received(operator: string, from: string, tokenId: BigNumber, data: string): ContractTxFunctionObj<string>;
    /**
     * The owner of this contract.
     */
    owner(): ContractTxFunctionObj<string>;
    /**
     * Approves an ERC1155 order on-chain. After pre-signing
     * the order, the `PRESIGNED` signature type will become
     * valid for that order and signer.
     * @param order An ERC1155 order.
     */
    preSignERC1155Order(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }): ContractTxFunctionObj<void>;
    /**
     * Approves an ERC721 order on-chain. After pre-signing
     * the order, the `PRESIGNED` signature type will become
     * valid for that order and signer.
     * @param order An ERC721 order.
     */
    preSignERC721Order(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }): ContractTxFunctionObj<void>;
    /**
     * Register a signer who can sign on behalf of msg.sender
     * This allows one to sign on behalf of a contract that calls this function
     * @param signer The address from which you plan to generate signatures
     * @param allowed True to register, false to unregister.
     */
    registerAllowedOrderSigner(signer: string, allowed: boolean): ContractTxFunctionObj<void>;
    /**
     * Mark what tx.origin addresses are allowed to fill an order that
     * specifies the message sender as its txOrigin.
     * @param origins An array of origin addresses to update.
     * @param allowed True to register, false to unregister.
     */
    registerAllowedRfqOrigins(origins: string[], allowed: boolean): ContractTxFunctionObj<void>;
    /**
     * Roll back to a prior implementation of a function.
     * @param selector The function selector.
     * @param targetImpl The address of an older implementation of the function.
     */
    rollback(selector: string, targetImpl: string): ContractTxFunctionObj<void>;
    /**
     * Sells an ERC1155 asset to fill the given order.
     * @param buyOrder The ERC1155 buy order.
     * @param signature The order signature from the maker.
     * @param erc1155TokenId The ID of the ERC1155 asset being        sold. If the
     *     given order specifies properties,        the asset must satisfy those
     *     properties. Otherwise,        it must equal the tokenId in the order.
     * @param erc1155SellAmount The amount of the ERC1155 asset        to sell.
     * @param unwrapNativeToken If this parameter is true and the        ERC20
     *     token of the order is e.g. WETH, unwraps the        token before
     *     transferring it to the taker.
     * @param callbackData If this parameter is non-zero, invokes
     *     `zeroExERC1155OrderCallback` on `msg.sender` after        the ERC20
     *     tokens have been transferred to `msg.sender`        but before
     *     transferring the ERC1155 asset to the buyer.
     */
    sellERC1155(buyOrder: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, erc1155TokenId: BigNumber, erc1155SellAmount: BigNumber, unwrapNativeToken: boolean, callbackData: string): ContractTxFunctionObj<void>;
    /**
     * Sells an ERC721 asset to fill the given order.
     * @param buyOrder The ERC721 buy order.
     * @param signature The order signature from the maker.
     * @param erc721TokenId The ID of the ERC721 asset being        sold. If the
     *     given order specifies properties,        the asset must satisfy those
     *     properties. Otherwise,        it must equal the tokenId in the order.
     * @param unwrapNativeToken If this parameter is true and the        ERC20
     *     token of the order is e.g. WETH, unwraps the        token before
     *     transferring it to the taker.
     * @param callbackData If this parameter is non-zero, invokes
     *     `zeroExERC721OrderCallback` on `msg.sender` after        the ERC20
     *     tokens have been transferred to `msg.sender`        but before
     *     transferring the ERC721 asset to the buyer.
     */
    sellERC721(buyOrder: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, erc721TokenId: BigNumber, unwrapNativeToken: boolean, callbackData: string): ContractTxFunctionObj<void>;
    /**
     * Sell attached ETH directly against uniswap v3.
     * @param encodedPath Uniswap-encoded path, where the first token is WETH.
     * @param minBuyAmount Minimum amount of the last token in the path to buy.
     * @param recipient The recipient of the bought tokens. Can be zero for sender.
     */
    sellEthForTokenToUniswapV3(encodedPath: string, minBuyAmount: BigNumber, recipient: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Sells `sellAmount` of `inputToken` to the liquidity provider
     * at the given `provider` address.
     * @param inputToken The token being sold.
     * @param outputToken The token being bought.
     * @param provider The address of the on-chain liquidity provider        to
     *     trade with.
     * @param recipient The recipient of the bought tokens. If equal to
     *     address(0), `msg.sender` is assumed to be the recipient.
     * @param sellAmount The amount of `inputToken` to sell.
     * @param minBuyAmount The minimum acceptable amount of `outputToken` to
     *     buy. Reverts if this amount is not satisfied.
     * @param auxiliaryData Auxiliary data supplied to the `provider` contract.
     */
    sellToLiquidityProvider(inputToken: string, outputToken: string, provider: string, recipient: string, sellAmount: BigNumber, minBuyAmount: BigNumber, auxiliaryData: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Efficiently sell directly to PancakeSwap (and forks).
     * @param tokens Sell path.
     * @param sellAmount of `tokens[0]` Amount to sell.
     * @param minBuyAmount Minimum amount of `tokens[-1]` to buy.
     * @param fork The protocol fork to use.
     */
    sellToPancakeSwap(tokens: string[], sellAmount: BigNumber, minBuyAmount: BigNumber, fork: number | BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Efficiently sell directly to uniswap/sushiswap.
     * @param tokens Sell path.
     * @param sellAmount of `tokens[0]` Amount to sell.
     * @param minBuyAmount Minimum amount of `tokens[-1]` to buy.
     * @param isSushi Use sushiswap if true.
     */
    sellToUniswap(tokens: string[], sellAmount: BigNumber, minBuyAmount: BigNumber, isSushi: boolean): ContractTxFunctionObj<BigNumber>;
    /**
     * Sell a token for ETH directly against uniswap v3.
     * @param encodedPath Uniswap-encoded path, where the last token is WETH.
     * @param sellAmount amount of the first token in the path to sell.
     * @param minBuyAmount Minimum amount of ETH to buy.
     * @param recipient The recipient of the bought tokens. Can be zero for sender.
     */
    sellTokenForEthToUniswapV3(encodedPath: string, sellAmount: BigNumber, minBuyAmount: BigNumber, recipient: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Sell a token for another token directly against uniswap v3.
     * @param encodedPath Uniswap-encoded path.
     * @param sellAmount amount of the first token in the path to sell.
     * @param minBuyAmount Minimum amount of the last token in the path to buy.
     * @param recipient The recipient of the bought tokens. Can be zero for sender.
     */
    sellTokenForTokenToUniswapV3(encodedPath: string, sellAmount: BigNumber, minBuyAmount: BigNumber, recipient: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Replace the optional signer for `transformERC20()` calldata.
     * Only callable by the owner.
     * @param quoteSigner The address of the new calldata signer.
     */
    setQuoteSigner(quoteSigner: string): ContractTxFunctionObj<void>;
    /**
     * Replace the allowed deployer for transformers.
     * Only callable by the owner.
     * @param transformerDeployer The address of the new trusted deployer
     *     for transformers.
     */
    setTransformerDeployer(transformerDeployer: string): ContractTxFunctionObj<void>;
    /**
     * Indicates whether the 0x Exchange Proxy implements a particular
     * ERC165 interface. This function should use at most 30,000 gas.
     * @param interfaceId The interface identifier, as specified in ERC165.
     */
    supportInterface(interfaceId: string): ContractTxFunctionObj<boolean>;
    /**
     * Transfers ownership of the contract to a new address.
     * @param newOwner The address that will become the owner.
     */
    transferOwnership(newOwner: string): ContractTxFunctionObj<void>;
    /**
     * Transfers protocol fees from the `FeeCollector` pools into
     * the staking contract.
     * @param poolIds Staking pool IDs
     */
    transferProtocolFeesForPools(poolIds: string[]): ContractTxFunctionObj<void>;
    /**
     * calledFrom FundRecoveryFeature.transferTrappedTokensTo() This will be delegatecalled in the context of the Exchange Proxy instance being used.
     * @param erc20 ERC20 Token Address.
     * @param amountOut Amount of tokens to withdraw.
     * @param recipientWallet Recipient wallet address.
     */
    transferTrappedTokensTo(erc20: string, amountOut: BigNumber, recipientWallet: string): ContractTxFunctionObj<void>;
    /**
     * Executes a series of transformations to convert an ERC20 `inputToken`
     * to an ERC20 `outputToken`.
     * @param inputToken The token being provided by the sender.        If
     *     `0xeee...`, ETH is implied and should be provided with the call.`
     * @param outputToken The token to be acquired by the sender.        `0xeee...`
     *     implies ETH.
     * @param inputTokenAmount The amount of `inputToken` to take from the sender.
     * @param minOutputTokenAmount The minimum amount of `outputToken` the sender
     *          must receive for the entire transformation to succeed.
     * @param transformations The transformations to execute on the token
     *     balance(s)        in sequence.
     */
    transformERC20(inputToken: string, outputToken: string, inputTokenAmount: BigNumber, minOutputTokenAmount: BigNumber, transformations: Array<{
        deploymentNonce: number | BigNumber;
        data: string;
    }>): ContractTxFunctionObj<BigNumber>;
    /**
     * The UniswapV3 pool swap callback which pays the funds requested
     * by the caller/pool to the pool. Can only be called by a valid
     * UniswapV3 pool.
     * @param amount0Delta Token0 amount owed.
     * @param amount1Delta Token1 amount owed.
     * @param data Arbitrary data forwarded from swap() caller. An ABI-encoded
     *       struct of: inputToken, outputToken, fee, payer
     */
    uniswapV3SwapCallback(amount0Delta: BigNumber, amount1Delta: BigNumber, data: string): ContractTxFunctionObj<void>;
    /**
     * If the given order is buying an ERC1155 asset, checks
     * whether or not the given token ID satisfies the required
     * properties specified in the order. If the order does not
     * specify any properties, this function instead checks
     * whether the given token ID matches the ID in the order.
     * Reverts if any checks fail, or if the order is selling
     * an ERC1155 asset.
     * @param order The ERC1155 order.
     * @param erc1155TokenId The ID of the ERC1155 asset.
     */
    validateERC1155OrderProperties(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }, erc1155TokenId: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Checks whether the given signature is valid for the
     * the given ERC1155 order. Reverts if not.
     * @param order The ERC1155 order.
     * @param signature The signature to validate.
     */
    validateERC1155OrderSignature(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc1155Token: string;
        erc1155TokenId: BigNumber;
        erc1155TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
        erc1155TokenAmount: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<void>;
    /**
     * If the given order is buying an ERC721 asset, checks
     * whether or not the given token ID satisfies the required
     * properties specified in the order. If the order does not
     * specify any properties, this function instead checks
     * whether the given token ID matches the ID in the order.
     * Reverts if any checks fail, or if the order is selling
     * an ERC721 asset.
     * @param order The ERC721 order.
     * @param erc721TokenId The ID of the ERC721 asset.
     */
    validateERC721OrderProperties(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }, erc721TokenId: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Checks whether the given signature is valid for the
     * the given ERC721 order. Reverts if not.
     * @param order The ERC721 order.
     * @param signature The signature to validate.
     */
    validateERC721OrderSignature(order: {
        direction: number | BigNumber;
        maker: string;
        taker: string;
        expiry: BigNumber;
        nonce: BigNumber;
        erc20Token: string;
        erc20TokenAmount: BigNumber;
        fees: Array<{
            recipient: string;
            amount: BigNumber;
            feeData: string;
        }>;
        erc721Token: string;
        erc721TokenId: BigNumber;
        erc721TokenProperties: Array<{
            propertyValidator: string;
            propertyData: string;
        }>;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }): ContractTxFunctionObj<void>;
    /**
     * Subscribe to an event type emitted by the IZeroEx contract.
     * @param eventName The IZeroEx contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends IZeroExEventArgs>(eventName: IZeroExEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>, isVerbose?: boolean, blockPollingIntervalMs?: number): string;
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
     * @param eventName The IZeroEx contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends IZeroExEventArgs>(eventName: IZeroExEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined, encoderOverrides?: Partial<EncoderOverrides>);
}
//# sourceMappingURL=i_zero_ex.d.ts.map