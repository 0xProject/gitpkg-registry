import { Erc1155Wrapper } from '@0x/contracts-erc1155';
import { ERC1155HoldingsByOwner } from '@0x/contracts-test-utils';
import { BigNumber } from '@0x/utils';
import { Provider, TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import { ERC1155ProxyContract } from './wrappers';
export declare class ERC1155ProxyWrapper {
    private readonly _tokenOwnerAddresses;
    private readonly _fungibleTokenIds;
    private readonly _nonFungibleTokenIds;
    private readonly _nfts;
    private readonly _contractOwnerAddress;
    private readonly _web3Wrapper;
    private readonly _provider;
    private readonly _logDecoder;
    private readonly _dummyTokenWrappers;
    private readonly _assetProxyInterface;
    private readonly _assetDataInterface;
    private _proxyContract?;
    private _proxyIdIfExists?;
    private _initialTokenIdsByOwner;
    constructor(provider: Provider, tokenOwnerAddresses: string[], contractOwnerAddress: string);
    /**
     * @dev Deploys dummy ERC1155 contracts
     * @return An array of ERC1155 wrappers; one for each deployed contract.
     */
    deployDummyContractsAsync(): Promise<Erc1155Wrapper[]>;
    /**
     * @dev Deploys the ERC1155 proxy
     * @return Deployed ERC1155 proxy contract instance
     */
    deployProxyAsync(): Promise<ERC1155ProxyContract>;
    /**
     * @dev Gets the ERC1155 proxy id
     */
    getProxyId(): string;
    /**
     * @dev generates abi-encoded tx data for transferring erc1155 fungible/non-fungible tokens.
     * @param from source address
     * @param to destination address
     * @param contractAddress address of erc155 contract
     * @param tokensToTransfer array of erc1155 tokens to transfer
     * @param valuesToTransfer array of corresponding values for each erc1155 token to transfer
     * @param valueMultiplier each value in `valuesToTransfer` is multiplied by this
     * @param receiverCallbackData callback data if `to` is a contract
     * @param authorizedSender sender of `transferFrom` transaction
     * @param extraData extra data to append to `transferFrom` transaction. Optional.
     * @return abi encoded tx data.
     */
    getTransferFromAbiEncodedTxDataAsync(from: string, to: string, contractAddress: string, tokensToTransfer: BigNumber[], valuesToTransfer: BigNumber[], valueMultiplier: BigNumber, receiverCallbackData: string, authorizedSender: string, assetData_?: string): Promise<string>;
    /**
     * @dev transfers erc1155 fungible/non-fungible tokens.
     * @param txData: abi-encoded tx data
     * @param authorizedSender sender of `transferFrom` transaction
     */
    transferFromRawAsync(txData: string, authorizedSender: string): Promise<TransactionReceiptWithDecodedLogs>;
    /**
     * @dev transfers erc1155 fungible/non-fungible tokens.
     * @param from source address
     * @param to destination address
     * @param contractAddress address of erc155 contract
     * @param tokensToTransfer array of erc1155 tokens to transfer
     * @param valuesToTransfer array of corresponding values for each erc1155 token to transfer
     * @param valueMultiplier each value in `valuesToTransfer` is multiplied by this
     * @param receiverCallbackData callback data if `to` is a contract
     * @param authorizedSender sender of `transferFrom` transaction
     * @param extraData extra data to append to `transferFrom` transaction. Optional.
     * @return tranasction hash.
     */
    transferFromAsync(from: string, to: string, contractAddress: string, tokensToTransfer: BigNumber[], valuesToTransfer: BigNumber[], valueMultiplier: BigNumber, receiverCallbackData: string, authorizedSender: string, assetData_?: string): Promise<TransactionReceiptWithDecodedLogs>;
    /**
     * @dev For each deployed ERC1155 contract, this function mints a set of fungible/non-fungible
     *      tokens for each token owner address (`_tokenOwnerAddresses`).
     * @return Balances of each token owner, across all ERC1155 contracts and tokens.
     */
    setBalancesAndAllowancesAsync(): Promise<ERC1155HoldingsByOwner>;
    /**
     * @dev For each deployed ERC1155 contract, this function quieries the set of fungible/non-fungible
     *      tokens for each token owner address (`_tokenOwnerAddresses`).
     * @return Balances of each token owner, across all ERC1155 contracts and tokens.
     */
    getBalancesAsync(): Promise<ERC1155HoldingsByOwner>;
    /**
     * @dev Set the approval for the proxy on behalf of `userAddress` .
     * @param userAddress owner of ERC1155 tokens.
     * @param contractAddress address of ERC1155 contract.
     * @param isApproved Whether to approve the proxy for all or not.
     */
    setProxyAllowanceForAllAsync(userAddress: string, contractAddress: string, isApproved: boolean): Promise<void>;
    /**
     * @dev Checks if proxy is approved to transfer tokens on behalf of `userAddress`.
     * @param userAddress owner of ERC1155 tokens.
     * @param contractAddress address of ERC1155 contract.
     * @return True iff the proxy is approved for all. False otherwise.
     */
    isProxyApprovedForAllAsync(userAddress: string, contractAddress: string): Promise<boolean>;
    getFungibleTokenIds(): BigNumber[];
    getNonFungibleTokenIds(): BigNumber[];
    getTokenOwnerAddresses(): string[];
    getContractWrapper(contractAddress: string): Erc1155Wrapper;
    private _getContractFromAddress;
    private _validateDummyTokenContractsExistOrThrow;
    private _validateProxyContractExistsOrThrow;
    private _validateBalancesAndAllowancesSetOrThrow;
}
//# sourceMappingURL=erc1155_proxy_wrapper.d.ts.map