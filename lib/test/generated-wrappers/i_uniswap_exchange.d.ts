import { ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class IUniswapExchangeContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IUniswapExchangeContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IUniswapExchangeContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<IUniswapExchangeContract>;
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
     * Buys at least `minTokensBought` tokens with ETH and transfer them
 * to `recipient`.
      * @param minTokensBought The minimum number of tokens to buy.
      * @param deadline Time when this order expires.
      * @param recipient Who to transfer the tokens to.
    * @returns tokensBought Amount of tokens bought.
     */
    ethToTokenTransferInput(minTokensBought: BigNumber, deadline: BigNumber, recipient: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Buys at least `minEthBought` ETH with tokens.
      * @param tokensSold Amount of tokens to sell.
      * @param minEthBought The minimum amount of ETH to buy.
      * @param deadline Time when this order expires.
    * @returns ethBought Amount of tokens bought.
     */
    tokenToEthSwapInput(tokensSold: BigNumber, minEthBought: BigNumber, deadline: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Buys at least `minTokensBought` tokens with the exchange token
 * and transfer them to `recipient`.
      * @param minTokensBought The minimum number of tokens to buy.
      * @param minEthBought The minimum amount of intermediate ETH to buy.
      * @param deadline Time when this order expires.
      * @param recipient Who to transfer the tokens to.
      * @param toTokenAddress The token being bought.
    * @returns tokensBought Amount of tokens bought.
     */
    tokenToTokenTransferInput(tokensSold: BigNumber, minTokensBought: BigNumber, minEthBought: BigNumber, deadline: BigNumber, recipient: string, toTokenAddress: string): ContractTxFunctionObj<BigNumber>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=i_uniswap_exchange.d.ts.map