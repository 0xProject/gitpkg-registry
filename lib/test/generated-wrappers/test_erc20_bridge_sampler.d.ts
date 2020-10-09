import { ContractFunctionObj, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
import { ContractAbi, ContractArtifact, TxData, SupportedProvider } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
export declare class TestERC20BridgeSamplerContract extends BaseContract {
    /**
     * @ignore
     */
    static deployedBytecode: string | undefined;
    static contractName: string;
    private readonly _methodABIIndex;
    static deployFrom0xArtifactAsync(artifact: ContractArtifact | SimpleContractArtifact, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }): Promise<TestERC20BridgeSamplerContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }): Promise<TestERC20BridgeSamplerContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }): Promise<TestERC20BridgeSamplerContract>;
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
    FAILURE_ADDRESS(): ContractFunctionObj<string>;
    /**
     * Call multiple public functions on this contract in a single transaction.
     * @param callDatas ABI-encoded call data for each function call.
     * @returns callResults ABI-encoded results data for each call.
     */
    batchCall(callDatas: string[]): ContractFunctionObj<string[]>;
    createTokenExchanges(tokenAddresses: string[]): ContractTxFunctionObj<void>;
    enableFailTrigger(): ContractTxFunctionObj<void>;
    encodeKyberHint(reserveId: string, takerToken: string, makerToken: string): ContractFunctionObj<string>;
    eth2Dai(): ContractFunctionObj<string>;
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
    }, index_1: string, index_2: string): ContractFunctionObj<BigNumber>;
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
    kyber(): ContractFunctionObj<string>;
    /**
     * Sample buy quotes from Balancer.
     * @param poolAddress Address of the Balancer pool to query.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromBalancer(poolAddress: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Curve.
     * @param curveInfo Curve information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromCurve(curveInfo: {
        poolAddress: string;
        sellQuoteFunctionSelector: string;
        buyQuoteFunctionSelector: string;
    }, fromTokenIdx: BigNumber, toTokenIdx: BigNumber, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Eth2Dai/Oasis.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromEth2Dai(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Kyber.
     * @param reserveId The selected kyber reserve
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns hint The hint for the selected reservetakerTokenAmounts Taker amounts sold at each maker token amount.
     */
    sampleBuysFromKyberNetwork(reserveId: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample buy quotes from an arbitrary on-chain liquidity provider.
     * @param registryAddress Address of the liquidity provider registry contract.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromLiquidityProviderRegistry(registryAddress: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<[BigNumber[], string]>;
    /**
     * Sample buy quotes from MStable mUSD contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromMStable(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Mooniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromMooniswap(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample buy quotes from Shell contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromShell(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from SushiSwap
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken.
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromSushiSwap(router: string, path: string[], makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from Uniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromUniswap(takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample buy quotes from UniswapV2.
     * @param path Token route. Should be takerToken -> makerToken.
     * @param makerTokenAmounts Maker token buy amount for each sample.
     * @returns takerTokenAmounts Taker amounts sold at each maker token         amount.
     */
    sampleBuysFromUniswapV2(path: string[], makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    sampleSellFromKyberNetwork(hint: string, takerToken: string, makerToken: string, takerTokenAmount: BigNumber): ContractFunctionObj<BigNumber>;
    /**
     * Sample sell quotes from Balancer.
     * @param poolAddress Address of the Balancer pool to query.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromBalancer(poolAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Curve.
     * @param curveInfo Curve information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromCurve(curveInfo: {
        poolAddress: string;
        sellQuoteFunctionSelector: string;
        buyQuoteFunctionSelector: string;
    }, fromTokenIdx: BigNumber, toTokenIdx: BigNumber, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Eth2Dai/Oasis.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromEth2Dai(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Kyber.
     * @param reserveId The selected kyber reserve
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns hint The hint for the selected reservemakerTokenAmounts Maker amounts bought at each taker token amount.
     */
    sampleSellsFromKyberNetwork(reserveId: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample sell quotes from an arbitrary on-chain liquidity provider.
     * @param registryAddress Address of the liquidity provider registry contract.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromLiquidityProviderRegistry(registryAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<[BigNumber[], string]>;
    /**
     * Sample sell quotes from the mStable mUSD contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromMStable(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Mooniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromMooniswap(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<[string, BigNumber[]]>;
    /**
     * Sample sell quotes from MultiBridge.
     * @param multibridge Address of the MultiBridge contract.
     * @param takerToken Address of the taker token (what to sell).
     * @param intermediateToken The address of the intermediate token to        use
     *     in an indirect route.
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromMultiBridge(multibridge: string, takerToken: string, intermediateToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from the Shell contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromShell(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from SushiSwap.
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromSushiSwap(router: string, path: string[], takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from Uniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromUniswap(takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    /**
     * Sample sell quotes from UniswapV2.
     * @param path Token route. Should be takerToken -> makerToken
     * @param takerTokenAmounts Taker token sell amount for each sample.
     * @returns makerTokenAmounts Maker amounts bought at each taker token         amount.
     */
    sampleSellsFromUniswapV2(path: string[], takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
    sampleSingleSellFromMooniswapPool(mooniswapTakerToken: string, mooniswapMakerToken: string, takerTokenAmount: BigNumber): ContractFunctionObj<BigNumber>;
    sampleTwoHopBuy(firstHopCalls: string[], secondHopCalls: string[], buyAmount: BigNumber): ContractFunctionObj<[{
        sourceIndex: BigNumber;
        returnData: string;
    }, {
        sourceIndex: BigNumber;
        returnData: string;
    }, BigNumber]>;
    sampleTwoHopSell(firstHopCalls: string[], secondHopCalls: string[], sellAmount: BigNumber): ContractFunctionObj<[{
        sourceIndex: BigNumber;
        returnData: string;
    }, {
        sourceIndex: BigNumber;
        returnData: string;
    }, BigNumber]>;
    uniswap(): ContractFunctionObj<string>;
    uniswapV2Router(): ContractFunctionObj<string>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined);
}
//# sourceMappingURL=test_erc20_bridge_sampler.d.ts.map