import { ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class OrderTransferSimulationUtilsContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, _exchange: string): Promise<OrderTransferSimulationUtilsContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, _exchange: string): Promise<OrderTransferSimulationUtilsContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }, _exchange: string): Promise<OrderTransferSimulationUtilsContract>;
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
     * Simulates the maker transfers within an order and returns the index of the first failed transfer.
      * @param order The order to simulate transfers for.
      * @param takerAddress The address of the taker that will fill the order.
      * @param takerAssetFillAmount The amount of takerAsset that the taker wished
     *     to fill.
    * @returns The index of the first failed transfer (or 4 if all transfers are successful).
     */
    getSimulatedOrderMakerTransferResults(order: {
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
    }, takerAddress: string, takerAssetFillAmount: BigNumber): ContractTxFunctionObj<number>;
    /**
     * Simulates all of the transfers within an order and returns the index of the first failed transfer.
      * @param order The order to simulate transfers for.
      * @param takerAddress The address of the taker that will fill the order.
      * @param takerAssetFillAmount The amount of takerAsset that the taker wished
     *     to fill.
    * @returns The index of the first failed transfer (or 4 if all transfers are successful).
     */
    getSimulatedOrderTransferResults(order: {
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
    }, takerAddress: string, takerAssetFillAmount: BigNumber): ContractTxFunctionObj<number>;
    /**
     * Simulates all of the transfers for each given order and returns the indices of each first failed transfer.
      * @param orders Array of orders to individually simulate transfers for.
      * @param takerAddresses Array of addresses of takers that will fill each
     *     order.
      * @param takerAssetFillAmounts Array of amounts of takerAsset that will be
     *     filled for each order.
    * @returns The indices of the first failed transfer (or 4 if all transfers are successful) for each order.
     */
    getSimulatedOrdersTransferResults(orders: Array<{
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
    }>, takerAddresses: string[], takerAssetFillAmounts: BigNumber[]): ContractTxFunctionObj<number[]>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=order_transfer_simulation_utils.d.ts.map