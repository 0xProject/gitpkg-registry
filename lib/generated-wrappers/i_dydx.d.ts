import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class IDydxContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IDydxContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }): Promise<IDydxContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<IDydxContract>;
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
     * Get the total supplied and total borrowed values of an account adjusted by the marginPremium
 * of each market. Supplied values are divided by (1 + marginPremium) for each market and
 * borrowed values are multiplied by (1 + marginPremium) for each market. Comparing these
 * adjusted values gives the margin-ratio of the account which will be compared to the global
 * margin-ratio when determining if the account can be liquidated.
      * @param account The account to query
    * @returns supplyValue The supplied value of the account (adjusted for marginPremium)borrowValue The borrowed value of the account (adjusted for marginPremium)
     */
    getAdjustedAccountValues(account: {
        owner: string;
        number: BigNumber;
    }): ContractFunctionObj<[{
        value: BigNumber;
    }, {
        value: BigNumber;
    }]>;
    /**
     * Return true if a particular address is approved as an operator for an owner's accounts.
 * Approved operators can act on the accounts of the owner as if it were the operator's own.
      * @param owner The owner of the accounts
      * @param operator The possible operator
    * @returns isLocalOperator True if operator is approved for owner&#x27;s accounts
     */
    getIsLocalOperator(owner: string, operator: string): ContractFunctionObj<boolean>;
    /**
     * Get the margin premium for a market. A margin premium makes it so that any positions that
 * include the market require a higher collateralization to avoid being liquidated.
      * @param marketId The market to query
    * @returns premium The market&#x27;s margin premium
     */
    getMarketMarginPremium(marketId: BigNumber): ContractFunctionObj<{
        value: BigNumber;
    }>;
    /**
     * Get the price of the token for a market.
      * @param marketId The market to query
    * @returns price The price of each atomic unit of the token
     */
    getMarketPrice(marketId: BigNumber): ContractFunctionObj<{
        value: BigNumber;
    }>;
    /**
     * Get the ERC20 token address for a market.
      * @param marketId The market to query
    * @returns tokenAddress The token address
     */
    getMarketTokenAddress(marketId: BigNumber): ContractFunctionObj<string>;
    /**
     * Get all risk parameters in a single struct.
    * @returns riskParams All global risk parameters
     */
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
    /**
     * The main entry-point to Solo that allows users and contracts to manage accounts.
 * Take one or more actions on one or more accounts. The msg.sender must be the owner or
 * operator of all accounts except for those being liquidated, vaporized, or traded with.
 * One call to operate() is considered a singular "operation". Account collateralization is
 * ensured only after the completion of the entire operation.
      * @param accounts A list of all accounts that will be used in this operation.
     *     Cannot contain                   duplicates. In each action, the
     *     relevant account will be referred-to by its                   index in
     *     the list.
      * @param actions An ordered list of all actions that will be taken in this
     *     operation. The                   actions will be processed in order.
     */
    operate(accounts: Array<{
        owner: string;
        number: BigNumber;
    }>, actions: Array<{
        actionType: number | BigNumber;
        accountIdx: BigNumber;
        amount: {
            sign: boolean;
            denomination: number | BigNumber;
            ref: number | BigNumber;
            value: BigNumber;
        };
        primaryMarketId: BigNumber;
        secondaryMarketId: BigNumber;
        otherAddress: string;
        otherAccountIdx: BigNumber;
        data: string;
    }>): ContractTxFunctionObj<void>;
    setOperators(args: Array<{
        operator: string;
        trusted: boolean;
    }>): ContractTxFunctionObj<void>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=i_dydx.d.ts.map