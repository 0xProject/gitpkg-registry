import { ContractFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class LibAssetDataContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<LibAssetDataContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<LibAssetDataContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<LibAssetDataContract>;
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
     * Decode AssetProxy identifier
      * @param assetData AssetProxy-compliant asset data describing an ERC-20, ERC-
     *     721, ERC1155, or MultiAsset asset.
    * @returns The AssetProxy identifier
     */
    decodeAssetProxyId(assetData: string): ContractFunctionObj<string>;
    /**
     * Decode ERC-1155 asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC-1155 set
     *     of assets.
    * @returns The ERC-1155 AssetProxy identifier, the address of the ERC-1155 contract hosting the assets, an array of the identifiers of the assets to be traded, an array of asset amounts to be traded, and callback data.  Each element of the arrays corresponds to the same-indexed element of the other array.  Return values specified as &#x60;memory&#x60; are returned as pointers to locations within the memory of the input parameter &#x60;assetData&#x60;.
     */
    decodeERC1155AssetData(assetData: string): ContractFunctionObj<[string, string, BigNumber[], BigNumber[], string]>;
    /**
     * Decode ERC-20 asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC-20 asset.
    * @returns The AssetProxy identifier, and the address of the ERC-20 contract hosting this asset.
     */
    decodeERC20AssetData(assetData: string): ContractFunctionObj<[string, string]>;
    /**
     * Decode ERC20Bridge asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC20Bridge
     *     asset
    * @returns The ERC20BridgeProxy identifier, the address of the ERC20 token to transfer, the address of the bridge contract, and extra data to be passed to the bridge contract.
     */
    decodeERC20BridgeAssetData(assetData: string): ContractFunctionObj<[string, string, string, string]>;
    /**
     * Decode ERC-721 asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC-721
     *     asset.
    * @returns The ERC-721 AssetProxy identifier, the address of the ERC-721 contract hosting this asset, and the identifier of the specific asset to be traded.
     */
    decodeERC721AssetData(assetData: string): ContractFunctionObj<[string, string, BigNumber]>;
    /**
     * Decode multi-asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant data describing a multi-asset basket.
    * @returns The Multi-Asset AssetProxy identifier, an array of the amounts of the assets to be traded, and an array of the AssetProxy-compliant data describing each asset to be traded.  Each element of the arrays corresponds to the same-indexed element of the other array.
     */
    decodeMultiAssetData(assetData: string): ContractFunctionObj<[string, BigNumber[], string[]]>;
    /**
     * Decode StaticCall asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing a StaticCall
     *     asset
    * @returns The StaticCall AssetProxy identifier, the target address of the StaticCAll, the data to be passed to the target address, and the expected Keccak-256 hash of the static call return data.
     */
    decodeStaticCallAssetData(assetData: string): ContractFunctionObj<[string, string, string, string]>;
    /**
     * Encode ERC-1155 asset data into the format described in the AssetProxy contract specification.
      * @param tokenAddress The address of the ERC-1155 contract hosting the
     *     asset(s) to be traded.
      * @param tokenIds The identifiers of the specific assets to be traded.
      * @param tokenValues The amounts of each asset to be traded.
      * @param callbackData Data to be passed to receiving contracts when a transfer
     *     is performed.
    * @returns AssetProxy-compliant asset data describing the set of assets.
     */
    encodeERC1155AssetData(tokenAddress: string, tokenIds: BigNumber[], tokenValues: BigNumber[], callbackData: string): ContractFunctionObj<string>;
    /**
     * Encode ERC-20 asset data into the format described in the AssetProxy contract specification.
      * @param tokenAddress The address of the ERC-20 contract hosting the asset to
     *     be traded.
    * @returns AssetProxy-compliant data describing the asset.
     */
    encodeERC20AssetData(tokenAddress: string): ContractFunctionObj<string>;
    /**
     * Encode ERC-721 asset data into the format described in the AssetProxy specification.
      * @param tokenAddress The address of the ERC-721 contract hosting the asset to
     *     be traded.
      * @param tokenId The identifier of the specific asset to be traded.
    * @returns AssetProxy-compliant asset data describing the asset.
     */
    encodeERC721AssetData(tokenAddress: string, tokenId: BigNumber): ContractFunctionObj<string>;
    /**
     * Encode data for multiple assets, per the AssetProxy contract specification.
      * @param amounts The amounts of each asset to be traded.
      * @param nestedAssetData AssetProxy-compliant data describing each asset to be
     *     traded.
    * @returns AssetProxy-compliant data describing the set of assets.
     */
    encodeMultiAssetData(amounts: BigNumber[], nestedAssetData: string[]): ContractFunctionObj<string>;
    /**
     * Encode StaticCall asset data into the format described in the AssetProxy contract specification.
      * @param staticCallTargetAddress Target address of StaticCall.
      * @param staticCallData Data that will be passed to staticCallTargetAddress in
     *     the StaticCall.
      * @param expectedReturnDataHash Expected Keccak-256 hash of the StaticCall
     *     return data.
    * @returns AssetProxy-compliant asset data describing the set of assets.
     */
    encodeStaticCallAssetData(staticCallTargetAddress: string, staticCallData: string, expectedReturnDataHash: string): ContractFunctionObj<string>;
    /**
     * Reverts if assetData is not of a valid format for its given proxy id.
      * @param assetData AssetProxy compliant asset data.
     */
    revertIfInvalidAssetData(assetData: string): ContractFunctionObj<void>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=lib_asset_data.d.ts.map