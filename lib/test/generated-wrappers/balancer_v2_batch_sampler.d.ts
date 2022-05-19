import { EncoderOverrides, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class BalancerV2BatchSamplerContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<BalancerV2BatchSamplerContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<BalancerV2BatchSamplerContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<BalancerV2BatchSamplerContract>;
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
     * Sample buy quotes from Balancer V2 supporting multihops.
      * @param swapSteps Array of swap steps (can be >= 1).
      * @param swapAssets Array of token address for swaps.
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleMultihopBuysFromBalancerV2(vault: string, swapSteps: Array<{
        poolId: string;
        assetInIndex: BigNumber;
        assetOutIndex: BigNumber;
        amount: BigNumber;
        userData: string;
    }>, swapAssets: string[], makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Balancer V2 supporting multihops.
      * @param swapSteps Array of swap steps (can be >= 1).
      * @param swapAssets Array of token address for swaps.
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleMultihopSellsFromBalancerV2(vault: string, swapSteps: Array<{
        poolId: string;
        assetInIndex: BigNumber;
        assetOutIndex: BigNumber;
        amount: BigNumber;
        userData: string;
    }>, swapAssets: string[], takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined, encoderOverrides?: Partial<EncoderOverrides>);
}
//# sourceMappingURL=balancer_v2_batch_sampler.d.ts.map