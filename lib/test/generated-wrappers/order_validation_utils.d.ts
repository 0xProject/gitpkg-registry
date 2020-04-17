import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class OrderValidationUtilsContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<OrderValidationUtilsContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<OrderValidationUtilsContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<OrderValidationUtilsContract>;
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
    chaiBridgeAddress(): ContractFunctionObj<string>;
    dydxBridgeAddress(): ContractFunctionObj<string>;
    erc1155ProxyAddress(): ContractFunctionObj<string>;
    erc20ProxyAddress(): ContractFunctionObj<string>;
    erc721ProxyAddress(): ContractFunctionObj<string>;
    exchangeAddress(): ContractFunctionObj<string>;
    /**
     * Returns the number of asset(s) (described by assetData) that the corresponding AssetProxy contract is authorized to spend.  When the asset data contains multiple assets (eg for Multi-Asset), the return value indicates how many complete "baskets" of those assets may be spent by all of the corresponding AssetProxy contracts.
      * @param ownerAddress Owner of the assets specified by assetData.
      * @param assetData Details of asset, encoded per the AssetProxy contract
     *     specification.
    * @returns Number of assets (or asset baskets) that the corresponding AssetProxy is authorized to spend.
     */
    getAssetProxyAllowance(ownerAddress: string, assetData: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Returns the owner's balance of the assets(s) specified in assetData.  When the asset data contains multiple assets (eg in ERC1155 or Multi-Asset), the return value indicates how many complete "baskets" of those assets are owned by owner.
      * @param ownerAddress Owner of the assets specified by assetData.
      * @param assetData Details of asset, encoded per the AssetProxy contract
     *     specification.
    * @returns Number of assets (or asset baskets) held by owner.
     */
    getBalance(ownerAddress: string, assetData: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Calls getBalance() and getAllowance() for assetData.
      * @param ownerAddress Owner of the assets specified by assetData.
      * @param assetData Details of asset, encoded per the AssetProxy contract
     *     specification.
    * @returns Number of assets (or asset baskets) held by owner, and number of assets (or asset baskets) that the corresponding AssetProxy is authorized to spend.
     */
    getBalanceAndAssetProxyAllowance(ownerAddress: string, assetData: string): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Calls getAssetProxyAllowance() for each element of assetData.
      * @param ownerAddress Owner of the assets specified by assetData.
      * @param assetData Array of asset details, each encoded per the AssetProxy
     *     contract specification.
    * @returns An array of asset allowances from getAllowance(), with each element corresponding to the same-indexed element in the assetData input.
     */
    getBatchAssetProxyAllowances(ownerAddress: string, assetData: string[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Calls getBalance() for each element of assetData.
      * @param ownerAddress Owner of the assets specified by assetData.
      * @param assetData Array of asset details, each encoded per the AssetProxy
     *     contract specification.
    * @returns Array of asset balances from getBalance(), with each element corresponding to the same-indexed element in the assetData input.
     */
    getBatchBalances(ownerAddress: string, assetData: string[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Calls getBatchBalances() and getBatchAllowances() for each element of assetData.
      * @param ownerAddress Owner of the assets specified by assetData.
      * @param assetData Array of asset details, each encoded per the AssetProxy
     *     contract specification.
    * @returns An array of asset balances from getBalance(), and an array of asset allowances from getAllowance(), with each element corresponding to the same-indexed element in the assetData input.
     */
    getBatchBalancesAndAssetProxyAllowances(ownerAddress: string, assetData: string[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Fetches all order-relevant information needed to validate if the supplied order is fillable.
      * @param order The order structure.
      * @param signature Signature provided by maker that proves the order's
     *     authenticity. `0x01` can always be provided if the signature does not
     *     need to be validated.
    * @returns The orderInfo (hash, status, and &#x60;takerAssetAmount&#x60; already filled for the given order), fillableTakerAssetAmount (amount of the order&#x27;s &#x60;takerAssetAmount&#x60; that is fillable given all on-chain state), and isValidSignature (validity of the provided signature). NOTE: If the &#x60;takerAssetData&#x60; encodes data for multiple assets, &#x60;fillableTakerAssetAmount&#x60; will represent a &quot;scaled&quot; amount, meaning it must be multiplied by all the individual asset amounts within the &#x60;takerAssetData&#x60; to get the final amount of each asset that can be filled.
     */
    getOrderRelevantState(order: {
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
    }, signature: string): ContractTxFunctionObj<[{
        orderStatus: number;
        orderHash: string;
        orderTakerAssetFilledAmount: BigNumber;
    }, BigNumber, boolean]>;
    /**
     * Fetches all order-relevant information needed to validate if the supplied orders are fillable.
      * @param orders Array of order structures.
      * @param signatures Array of signatures provided by makers that prove the
     *     authenticity of the orders. `0x01` can always be provided if a signature
     *     does not need to be validated.
    * @returns The ordersInfo (array of the hash, status, and &#x60;takerAssetAmount&#x60; already filled for each order), fillableTakerAssetAmounts (array of amounts for each order&#x27;s &#x60;takerAssetAmount&#x60; that is fillable given all on-chain state), and isValidSignature (array containing the validity of each provided signature). NOTE: If the &#x60;takerAssetData&#x60; encodes data for multiple assets, each element of &#x60;fillableTakerAssetAmounts&#x60; will represent a &quot;scaled&quot; amount, meaning it must be multiplied by all the individual asset amounts within the &#x60;takerAssetData&#x60; to get the final amount of each asset that can be filled.
     */
    getOrderRelevantStates(orders: Array<{
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
    }>, signatures: string[]): ContractTxFunctionObj<[Array<{
        orderStatus: number;
        orderHash: string;
        orderTakerAssetFilledAmount: BigNumber;
    }>, BigNumber[], boolean[]]>;
    /**
     * Gets the amount of an asset transferable by the maker of an order.
      * @param ownerAddress Address of the owner of the asset.
      * @param assetData Description of tokens, per the AssetProxy contract
     *     specification.
    * @returns The amount of the asset tranferable by the owner. NOTE: If the &#x60;assetData&#x60; encodes data for multiple assets, the &#x60;transferableAssetAmount&#x60; will represent the amount of times the entire &#x60;assetData&#x60; can be transferred. To calculate the total individual transferable amounts, this scaled &#x60;transferableAmount&#x60; must be multiplied by the individual asset amounts located within the &#x60;assetData&#x60;.
     */
    getTransferableAssetAmount(ownerAddress: string, assetData: string): ContractTxFunctionObj<BigNumber>;
    staticCallProxyAddress(): ContractFunctionObj<string>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=order_validation_utils.d.ts.map