import { ContractFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class TestDydxContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, config: {
        marginRatio: BigNumber;
        operators: Array<{
            owner: string;
            operator: string;
        }>;
        accounts: Array<{
            owner: string;
            accountId: BigNumber;
            balances: BigNumber[];
        }>;
        markets: Array<{
            token: string;
            price: BigNumber;
        }>;
    }): Promise<TestDydxContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, config: {
        marginRatio: BigNumber;
        operators: Array<{
            owner: string;
            operator: string;
        }>;
        accounts: Array<{
            owner: string;
            accountId: BigNumber;
            balances: BigNumber[];
        }>;
        markets: Array<{
            token: string;
            price: BigNumber;
        }>;
    }): Promise<TestDydxContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }, config: {
        marginRatio: BigNumber;
        operators: Array<{
            owner: string;
            operator: string;
        }>;
        accounts: Array<{
            owner: string;
            accountId: BigNumber;
            balances: BigNumber[];
        }>;
        markets: Array<{
            token: string;
            price: BigNumber;
        }>;
    }): Promise<TestDydxContract>;
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
    getAdjustedAccountValues(account: {
        owner: string;
        number: BigNumber;
    }): ContractFunctionObj<[{
        value: BigNumber;
    }, {
        value: BigNumber;
    }]>;
    getIsLocalOperator(owner: string, operator: string): ContractFunctionObj<boolean>;
    getMarketMarginPremium(index_0: BigNumber): ContractFunctionObj<{
        value: BigNumber;
    }>;
    getMarketPrice(marketId: BigNumber): ContractFunctionObj<{
        value: BigNumber;
    }>;
    getMarketTokenAddress(marketId: BigNumber): ContractFunctionObj<string>;
    getRiskParams(): ContractFunctionObj<{
        marginRatio: {
            value: BigNumber;
        };
        liquidationSpread: {
            value: BigNumber;
        };
        earningsRate: {
            value: BigNumber;
        };
        minBorrowedValue: {
            value: BigNumber;
        };
    }>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_dydx.d.ts.map