import { DummyERC721TokenContract } from '@0x/contracts-erc721';
import { ERC721TokenIdsByOwner } from '@0x/contracts-test-utils';
import { BigNumber } from '@0x/utils';
import { ZeroExProvider } from 'ethereum-types';
import { ERC721ProxyContract } from './wrappers';
export declare class ERC721Wrapper {
    private readonly _tokenOwnerAddresses;
    private readonly _contractOwnerAddress;
    private readonly _provider;
    private readonly _dummyTokenContracts;
    private _proxyContract?;
    private _proxyIdIfExists?;
    private _initialTokenIdsByOwner;
    constructor(provider: ZeroExProvider, tokenOwnerAddresses: string[], contractOwnerAddress: string);
    deployDummyTokensAsync(): Promise<DummyERC721TokenContract[]>;
    deployProxyAsync(): Promise<ERC721ProxyContract>;
    getProxyId(): string;
    setBalancesAndAllowancesAsync(): Promise<void>;
    doesTokenExistAsync(tokenAddress: string, tokenId: BigNumber): Promise<boolean>;
    approveProxyAsync(tokenAddress: string, tokenId: BigNumber): Promise<void>;
    approveProxyForAllAsync(tokenAddress: string, ownerAddress: string, isApproved: boolean): Promise<void>;
    approveAsync(to: string, tokenAddress: string, tokenId: BigNumber): Promise<void>;
    transferFromAsync(tokenAddress: string, tokenId: BigNumber, currentOwner: string, userAddress: string): Promise<void>;
    mintAsync(tokenAddress: string, tokenId: BigNumber, userAddress: string): Promise<void>;
    burnAsync(tokenAddress: string, tokenId: BigNumber, owner: string): Promise<void>;
    ownerOfAsync(tokenAddress: string, tokenId: BigNumber): Promise<string>;
    isOwnerAsync(userAddress: string, tokenAddress: string, tokenId: BigNumber): Promise<boolean>;
    isProxyApprovedForAllAsync(userAddress: string, tokenAddress: string): Promise<boolean>;
    isProxyApprovedAsync(tokenAddress: string, tokenId: BigNumber): Promise<boolean>;
    getBalancesAsync(): Promise<ERC721TokenIdsByOwner>;
    getTokenOwnerAddresses(): string[];
    getTokenAddresses(): string[];
    private _getTokenContractFromAssetData;
    private _validateDummyTokenContractsExistOrThrow;
    private _validateProxyContractExistsOrThrow;
    private _validateBalancesAndAllowancesSetOrThrow;
}
//# sourceMappingURL=erc721_wrapper.d.ts.map