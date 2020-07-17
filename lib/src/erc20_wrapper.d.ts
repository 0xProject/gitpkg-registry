import { DummyERC20TokenContract } from '@0x/contracts-erc20';
import { ERC20BalancesByOwner } from '@0x/contracts-test-utils';
import { BigNumber } from '@0x/utils';
import { ZeroExProvider } from 'ethereum-types';
import { ERC20ProxyContract } from './wrappers';
export declare class ERC20Wrapper {
    private readonly _tokenOwnerAddresses;
    private readonly _contractOwnerAddress;
    private readonly _provider;
    private readonly _dummyTokenContracts;
    private readonly _assetDataInterface;
    private _proxyContract?;
    private _proxyIdIfExists?;
    /**
     * Instanitates an ERC20Wrapper
     * @param provider Web3 provider to use for all JSON RPC requests
     * @param tokenOwnerAddresses Addresses that we want to endow as owners for dummy ERC20 tokens
     * @param contractOwnerAddress Desired owner of the contract
     * Instance of ERC20Wrapper
     */
    constructor(provider: ZeroExProvider, tokenOwnerAddresses: string[], contractOwnerAddress: string);
    deployDummyTokensAsync(numberToDeploy: number, decimals: BigNumber): Promise<DummyERC20TokenContract[]>;
    deployProxyAsync(): Promise<ERC20ProxyContract>;
    getProxyId(): string;
    setBalancesAndAllowancesAsync(): Promise<void>;
    getBalanceAsync(userAddress: string, assetData: string): Promise<BigNumber>;
    setBalanceAsync(userAddress: string, assetData: string, amount: BigNumber): Promise<void>;
    getProxyAllowanceAsync(userAddress: string, assetData: string): Promise<BigNumber>;
    setAllowanceAsync(userAddress: string, assetData: string, amount: BigNumber): Promise<void>;
    getBalancesAsync(): Promise<ERC20BalancesByOwner>;
    addDummyTokenContract(dummy: DummyERC20TokenContract): void;
    addTokenOwnerAddress(address: string): void;
    getTokenOwnerAddresses(): string[];
    getTokenAddresses(): string[];
    private _getTokenContractFromAssetDataAsync;
    private _validateDummyTokenContractsExistOrThrow;
    private _validateProxyContractExistsOrThrow;
}
//# sourceMappingURL=erc20_wrapper.d.ts.map