import { ContractFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class DODOSamplerContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<DODOSamplerContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<DODOSamplerContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<DODOSamplerContract>;
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
     * Calculate the amount bought when the Base token is requested to be sold. This is directly supported in DODO and this is a convenience function.
      * @param dodo The address of the DODO pool
      * @param sellAmount the amount of the Base to sell
    * @returns The amount bought of Quote token when selling Base token.
     */
    querySellBaseToken(dodo: string, sellAmount: BigNumber): ContractFunctionObj<BigNumber>;
    /**
     * Calculate the amount bought when the Quote token is requested to be sold. This is not directly supported in DODO so we perform the calculation and use the result to buyBase. Note: This has a small amount of imprecision so there is a likelyhood of change (in quote token).
      * @param dodo The address of the DODO pool
      * @param sellAmount the amount of the Quote to sell
    * @returns The amount bought of Base token when selling Quote token.
     */
    querySellQuoteToken(dodo: string, sellAmount: BigNumber): ContractFunctionObj<BigNumber>;
    /**
     * Sample buy quotes from DODO.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token sell amount for each sample.
    * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromDODO(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from DODO.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
    * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromDODO(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<[boolean, string, BigNumber[]]>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=d_o_d_o_sampler.d.ts.map