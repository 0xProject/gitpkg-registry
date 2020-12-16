import { ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class ERC20BridgeSamplerContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }): Promise<ERC20BridgeSamplerContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }): Promise<ERC20BridgeSamplerContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<ERC20BridgeSamplerContract>;
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
     * Call multiple public functions on this contract in a single transaction.
     * @param callDatas ABI-encoded call data for each function call.
     */
    batchCall(callDatas: string[]): ContractTxFunctionObj<string[]>;
    encodeKyberHint(reserveId: string, takerToken: string, makerToken: string): ContractTxFunctionObj<string>;
    /**
     * Queries the fillable taker asset amounts of native orders.
     * Effectively ignores orders that have empty signatures or
     * @param orders Native orders to query.
     * @param orderSignatures Signatures for each respective order in `orders`.
     * @param exchange The V3 exchange.
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
    }>, orderSignatures: string[], exchange: string): ContractTxFunctionObj<BigNumber[]>;
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
    }, signature: string, exchange: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Queries the fillable taker asset amounts of native orders.
     * Effectively ignores orders that have empty signatures or
     * maker/taker asset amounts (returning 0).
     * @param orders Native orders to query.
     * @param orderSignatures Signatures for each respective order in `orders`.
     * @param exchange The V3 exchange.
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
    }>, orderSignatures: string[], exchange: string): ContractTxFunctionObj<BigNumber[]>;
    getTokenDecimals(makerTokenAddress: string, takerTokenAddress: string): ContractTxFunctionObj<[BigNumber, BigNumber]>;
    /**
     * Sample buy quotes from Balancer.
     * @param poolAddress Address of the Balancer pool to query.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromBalancer(poolAddress: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Curve.
     * @param curveInfo Curve information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromCurve(curveInfo: {
        poolAddress: string;
        sellQuoteFunctionSelector: string;
        buyQuoteFunctionSelector: string;
    }, fromTokenIdx: BigNumber, toTokenIdx: BigNumber, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from DODO.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromDODO(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[boolean, string, BigNumber[]]>;
    /**
     * Sample buy quotes from Eth2Dai/Oasis.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     */
    sampleBuysFromEth2Dai(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Kyber.
     * @param reserveId The selected kyber reserve
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromKyberNetwork(reserveId: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample buy quotes from an arbitrary on-chain liquidity provider.
     * @param providerAddress Address of the liquidity provider.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromLiquidityProvider(providerAddress: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from MStable mUSD contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromMStable(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Mooniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromMooniswap(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample buy quotes from Shell pool contract
     * @param pool Address of the Shell pool contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromShell(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from SushiSwap
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken.
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromSushiSwap(router: string, path: string[], makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Uniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromUniswap(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from UniswapV2.
     * @param path Token route. Should be takerToken -> makerToken.
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromUniswapV2(path: string[], makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSellFromKyberNetwork(hint: string, takerToken: string, makerToken: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    /**
     * Sample sell quotes from Balancer.
     * @param poolAddress Address of the Balancer pool to query.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromBalancer(poolAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Curve.
     * @param curveInfo Curve information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromCurve(curveInfo: {
        poolAddress: string;
        sellQuoteFunctionSelector: string;
        buyQuoteFunctionSelector: string;
    }, fromTokenIdx: BigNumber, toTokenIdx: BigNumber, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from DODO.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromDODO(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[boolean, string, BigNumber[]]>;
    /**
     * Sample sell quotes from Eth2Dai/Oasis.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromEth2Dai(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Kyber.
     * @param reserveId The selected kyber reserve
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromKyberNetwork(reserveId: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample sell quotes from an arbitrary on-chain liquidity provider.
     * @param providerAddress Address of the liquidity provider.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromLiquidityProvider(providerAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from the mStable mUSD contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMStable(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Mooniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMooniswap(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample sell quotes from MultiBridge.
     * @param multibridge Address of the MultiBridge contract.
     * @param takerToken Address of the taker token (what to sell).
     * @param intermediateToken The address of the intermediate token to        use
     *     in an indirect route.
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMultiBridge(multibridge: string, takerToken: string, intermediateToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from the Shell pool contract
     * @param pool Address of the Shell pool contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromShell(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from SushiSwap.
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromSushiSwap(router: string, path: string[], takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Uniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswap(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from UniswapV2.
     * @param path Token route. Should be takerToken -> makerToken
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswapV2(path: string[], takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSingleSellFromMooniswapPool(mooniswapTakerToken: string, mooniswapMakerToken: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleTwoHopBuy(firstHopCalls: string[], secondHopCalls: string[], buyAmount: BigNumber): ContractTxFunctionObj<[{
        sourceIndex: BigNumber;
        returnData: string;
    }, {
        sourceIndex: BigNumber;
        returnData: string;
    }, BigNumber]>;
    sampleTwoHopSell(firstHopCalls: string[], secondHopCalls: string[], sellAmount: BigNumber): ContractTxFunctionObj<[{
        sourceIndex: BigNumber;
        returnData: string;
    }, {
        sourceIndex: BigNumber;
        returnData: string;
    }, BigNumber]>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=erc20_bridge_sampler.d.ts.map