import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class TestLibDydxBalanceContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestLibDydxBalanceContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<TestLibDydxBalanceContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<TestLibDydxBalanceContract>;
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
    areActionsWellFormed(info: {
        dydx: string;
        bridgeAddress: string;
        makerAddress: string;
        makerTokenAddress: string;
        takerTokenAddress: string;
        orderMakerToTakerRate: BigNumber;
        accounts: BigNumber[];
        actions: Array<{
            actionType: number | BigNumber;
            accountIdx: BigNumber;
            marketId: BigNumber;
            conversionRateNumerator: BigNumber;
            conversionRateDenominator: BigNumber;
        }>;
    }): ContractFunctionObj<boolean>;
    createToken(decimals: number | BigNumber): ContractTxFunctionObj<string>;
    getDepositableMakerAmount(info: {
        dydx: string;
        bridgeAddress: string;
        makerAddress: string;
        makerTokenAddress: string;
        takerTokenAddress: string;
        orderMakerToTakerRate: BigNumber;
        accounts: BigNumber[];
        actions: Array<{
            actionType: number | BigNumber;
            accountIdx: BigNumber;
            marketId: BigNumber;
            conversionRateNumerator: BigNumber;
            conversionRateDenominator: BigNumber;
        }>;
    }): ContractFunctionObj<BigNumber>;
    getDydxMakerBalance(order: {
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
    }, dydx: string): ContractFunctionObj<BigNumber>;
    getSolventMakerAmount(info: {
        dydx: string;
        bridgeAddress: string;
        makerAddress: string;
        makerTokenAddress: string;
        takerTokenAddress: string;
        orderMakerToTakerRate: BigNumber;
        accounts: BigNumber[];
        actions: Array<{
            actionType: number | BigNumber;
            accountIdx: BigNumber;
            marketId: BigNumber;
            conversionRateNumerator: BigNumber;
            conversionRateDenominator: BigNumber;
        }>;
    }): ContractFunctionObj<BigNumber>;
    setTokenApproval(tokenAddress: string, owner: string, spender: string, allowance: BigNumber): ContractTxFunctionObj<void>;
    setTokenBalance(tokenAddress: string, owner: string, balance: BigNumber): ContractTxFunctionObj<void>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_lib_dydx_balance.d.ts.map