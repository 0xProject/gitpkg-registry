import { ContractFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class NativeOrderSamplerContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<NativeOrderSamplerContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<NativeOrderSamplerContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<NativeOrderSamplerContract>;
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
     * Queries the fillable taker asset amounts of native orders.
 * Effectively ignores orders that have empty signatures or
      * @param orders Native orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V3 exchange.
    * @returns orderFillableMakerAssetAmounts How much maker asset can be filled         by each order in &#x60;orders&#x60;.
     */
    getOrderFillableMakerAssetAmounts(orders: Array<{
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
    }>, orderSignatures: string[], exchange: string): ContractFunctionObj<BigNumber[]>;
    /**
     * Get the fillable taker amount of an order, taking into account
 * order state, maker fees, and maker balances.
     */
    getOrderFillableTakerAmount(order: {
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
    }, signature: string, exchange: string): ContractFunctionObj<BigNumber>;
    /**
     * Queries the fillable taker asset amounts of native orders.
 * Effectively ignores orders that have empty signatures or
 * maker/taker asset amounts (returning 0).
      * @param orders Native orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V3 exchange.
    * @returns orderFillableTakerAssetAmounts How much taker asset can be filled         by each order in &#x60;orders&#x60;.
     */
    getOrderFillableTakerAssetAmounts(orders: Array<{
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
    }>, orderSignatures: string[], exchange: string): ContractFunctionObj<BigNumber[]>;
    getTokenDecimals(makerTokenAddress: string, takerTokenAddress: string): ContractFunctionObj<[BigNumber, BigNumber]>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=native_order_sampler.d.ts.map