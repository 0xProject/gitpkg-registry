import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class AssetBalanceContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<AssetBalanceContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<AssetBalanceContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<AssetBalanceContract>;
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
    staticCallProxyAddress(): ContractFunctionObj<string>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=asset_balance.d.ts.map