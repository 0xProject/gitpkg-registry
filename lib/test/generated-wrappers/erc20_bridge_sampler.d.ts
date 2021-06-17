import { EncoderOverrides, ContractTxFunctionObj, BaseContract } from '@0x/base-contract';
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
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, weth: string): Promise<ERC20BridgeSamplerContract>;
    static deployWithLibrariesFrom0xArtifactAsync(artifact: ContractArtifact, libraryArtifacts: {
        [libraryName: string]: ContractArtifact;
    }, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: (ContractArtifact | SimpleContractArtifact);
    }, weth: string): Promise<ERC20BridgeSamplerContract>;
    static deployAsync(bytecode: string, abi: ContractAbi, supportedProvider: SupportedProvider, txDefaults: Partial<TxData>, logDecodeDependencies: {
        [contractName: string]: ContractAbi;
    }, weth: string): Promise<ERC20BridgeSamplerContract>;
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
    BANCOR_ETH_ADDRESS(): ContractTxFunctionObj<string>;
    _callRevert(selector: string, sellToken: string, buyToken: string, bridgeData: string, amountIn: BigNumber): ContractTxFunctionObj<void>;
    /**
     * Mints the sell token, then performs the swap, then reverts with the amount out. The SwapRevertSamplerQuoteOpts has been unrolled here as our ABI encoder cannot support encoding the function
     */
    _mintCallRevert(selector: string, sellToken: string, buyToken: string, bridgeData: string, amountsIn: BigNumber[]): ContractTxFunctionObj<void>;
    /**
     * Call multiple public functions on this contract in a single transaction.
      * @param callDatas ABI-encoded call data for each function call.
     */
    batchCall(callDatas: string[]): ContractTxFunctionObj<Array<{
        data: string;
        success: boolean;
    }>>;
    encodeKyberHint(opts: {
        reserveOffset: BigNumber;
        hintHandler: string;
        networkProxy: string;
        weth: string;
        hint: string;
    }, reserveId: string, takerToken: string, makerToken: string): ContractTxFunctionObj<string>;
    getAllowanceOf(tokens: string[], account: string, spender: string): ContractTxFunctionObj<BigNumber[]>;
    getBalanceOf(tokens: string[], account: string): ContractTxFunctionObj<BigNumber[]>;
    getCode(addr: string): ContractTxFunctionObj<string>;
    /**
     * Queries the fillable taker asset amounts of native orders.
 * Effectively ignores orders that have empty signatures or
      * @param orders Native orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V4 exchange.
     */
    getLimitOrderFillableMakerAssetAmounts(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>, orderSignatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, exchange: string): ContractTxFunctionObj<BigNumber[]>;
    /**
     * Get the fillable taker amount of an order, taking into account
 * order state, maker fees, and maker balances.
     */
    getLimitOrderFillableTakerAmount(order: {
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }, signature: {
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }, exchange: string): ContractTxFunctionObj<BigNumber>;
    /**
     * Queries the fillable taker asset amounts of native orders.
 * Effectively ignores orders that have empty signatures or
 * maker/taker asset amounts (returning 0).
      * @param orders Native limit orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V4 exchange.
     */
    getLimitOrderFillableTakerAssetAmounts(orders: Array<{
        makerToken: string;
        takerToken: string;
        makerAmount: BigNumber;
        takerAmount: BigNumber;
        takerTokenFeeAmount: BigNumber;
        maker: string;
        taker: string;
        sender: string;
        feeRecipient: string;
        pool: string;
        expiry: BigNumber;
        salt: BigNumber;
    }>, orderSignatures: Array<{
        signatureType: number | BigNumber;
        v: number | BigNumber;
        r: string;
        s: string;
    }>, exchange: string): ContractTxFunctionObj<BigNumber[]>;
    getTokenDecimals(tokens: string[]): ContractTxFunctionObj<BigNumber[]>;
    isContract(account: string): ContractTxFunctionObj<boolean>;
    /**
     * Sample buy quotes from Balancer.
      * @param poolAddress Address of the Balancer pool to query.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromBalancer(poolAddress: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Balancer V2.
      * @param poolInfo Struct with pool related data
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromBalancerV2(poolInfo: {
        vault: string;
        poolId: string;
    }, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Bancor. Unimplemented
      * @param opts BancorSamplerOpts The Bancor registry contract address and paths
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromBancor(opts: {
        registry: string;
        paths: string[][];
    }, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, string[], BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Curve.
      * @param curveInfo Curve information specific to this token pair.
      * @param takerToken The taker token to sell.
      * @param makerToken The maker token to buy.
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromCurve(curveInfo: {
        curveAddress: string;
        exchangeFunctionSelector: string;
        fromCoinIdx: BigNumber;
        toCoinIdx: BigNumber;
    }, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Curve.
      * @param curveInfo Curve information specific to this token pair.
      * @param takerToken The taker token to sell.
      * @param makerToken The maker token to buy.
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromCurveV2(curveInfo: {
        curveAddress: string;
        exchangeFunctionSelector: string;
        fromCoinIdx: BigNumber;
        toCoinIdx: BigNumber;
    }, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from DODO.
      * @param opts DODOSamplerOpts DODO Registry and helper addresses
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromDODO(opts: {
        registry: string;
        helper: string;
    }, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[boolean, string, BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from DODO.
      * @param registry Address of the registry to look up.
      * @param offset offset index for the pool in the registry.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromDODOV2(registry: string, offset: BigNumber, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[boolean, string, BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Eth2Dai/Oasis.
      * @param router Address of the Eth2Dai/Oasis contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
     */
    sampleBuysFromEth2Dai(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from KyberDmm.
      * @param router Router to look up tokens and amounts
      * @param path Token route. Should be takerToken -> makerToken.
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromKyberDmm(router: string, path: string[], makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string[], BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Kyber.
      * @param opts KyberSamplerOpts The nth reserve
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromKyberNetwork(opts: {
        reserveOffset: BigNumber;
        hintHandler: string;
        networkProxy: string;
        weth: string;
        hint: string;
    }, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, string, BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from an arbitrary on-chain liquidity provider.
      * @param providerAddress Address of the liquidity provider.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromLiquidityProvider(providerAddress: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from MStable contract
      * @param router Address of the mStable contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromMStable(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    sampleBuysFromMakerPsm(psmInfo: {
        psmAddress: string;
        ilkIdentifier: string;
        gemTokenAddress: string;
    }, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Mooniswap.
      * @param registry Address of the Mooniswap Registry.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromMooniswap(registry: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Shell pool contract
      * @param pool Address of the Shell pool contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromShell(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from Uniswap.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromUniswap(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from UniswapV2.
      * @param router Router to look up tokens and amounts
      * @param path Token route. Should be takerToken -> makerToken.
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromUniswapV2(router: string, path: string[], makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample buy quotes from UniswapV3.
      * @param quoter UniswapV3 Quoter contract.
      * @param router UniswapV3 Router contract.
      * @param path Token route. Should be takerToken -> makerToken.
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromUniswapV3(quoter: string, router: string, path: string[], makerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string[], BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Balancer.
      * @param poolAddress Address of the Balancer pool to query.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromBalancer(poolAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Balancer V2.
      * @param poolInfo Struct with pool related data
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromBalancerV2(poolInfo: {
        vault: string;
        poolId: string;
    }, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Bancor.
      * @param opts BancorSamplerOpts The Bancor registry contract address and paths
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromBancor(opts: {
        registry: string;
        paths: string[][];
    }, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, string[], BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Curve.
      * @param curveInfo Curve information specific to this token pair.
      * @param takerToken The taker token to sell.
      * @param makerToken The maker token to buy.
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromCurve(curveInfo: {
        curveAddress: string;
        exchangeFunctionSelector: string;
        fromCoinIdx: BigNumber;
        toCoinIdx: BigNumber;
    }, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Curve.
      * @param curveInfo Curve information specific to this token pair.
      * @param takerToken The taker token to sell.
      * @param makerToken The maker token to buy.
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromCurveV2(curveInfo: {
        curveAddress: string;
        exchangeFunctionSelector: string;
        fromCoinIdx: BigNumber;
        toCoinIdx: BigNumber;
    }, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from DODO.
      * @param opts DODOSamplerOpts DODO Registry and helper addresses
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromDODO(opts: {
        registry: string;
        helper: string;
    }, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[boolean, string, BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from DODO V2.
      * @param registry Address of the registry to look up.
      * @param offset offset index for the pool in the registry.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromDODOV2(registry: string, offset: BigNumber, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[boolean, string, BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Eth2Dai/Oasis.
      * @param router Address of the Eth2Dai/Oasis contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromEth2Dai(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from KyberDmm.
      * @param router Router to look up tokens and amounts
      * @param path Token route. Should be takerToken -> makerToken
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromKyberDmm(router: string, path: string[], takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string[], BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Kyber.
      * @param opts KyberSamplerOpts The nth reserve
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromKyberNetwork(opts: {
        reserveOffset: BigNumber;
        hintHandler: string;
        networkProxy: string;
        weth: string;
        hint: string;
    }, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, string, BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from an arbitrary on-chain liquidity provider.
      * @param providerAddress Address of the liquidity provider.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromLiquidityProvider(providerAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from the mStable contract
      * @param router Address of the mStable contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMStable(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Maker PSM
     */
    sampleSellsFromMakerPsm(psmInfo: {
        psmAddress: string;
        ilkIdentifier: string;
        gemTokenAddress: string;
    }, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Mooniswap.
      * @param registry Address of the Mooniswap Registry.
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMooniswap(registry: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string, BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from the Shell pool contract
      * @param pool Address of the Shell pool contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromShell(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from Uniswap.
      * @param router Address of the Uniswap Router
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswap(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from UniswapV2.
      * @param router Router to look up tokens and amounts
      * @param path Token route. Should be takerToken -> makerToken
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswapV2(router: string, path: string[], takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], BigNumber[]]>;
    /**
     * Sample sell quotes from UniswapV3.
      * @param quoter UniswapV3 Quoter contract.
      * @param router UniswapV3 Router contract.
      * @param path Token route. Should be takerToken -> makerToken
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswapV3(quoter: string, router: string, path: string[], takerTokenAmounts: BigNumber[]): ContractTxFunctionObj<[string[], BigNumber[], BigNumber[]]>;
    sampleSwapFromBalancer(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromBalancerV2(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromBancor(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromCurve(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromCurveV2(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromDodo(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromDodoV2(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromKyber(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromKyberDmm(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromLiquidityProvider(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromMStable(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromMakerPsm(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromMooniswap(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromOasis(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromShell(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromUniswap(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromUniswapV2(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
    sampleSwapFromUniswapV3(sellToken: string, buyToken: string, bridgeData: string, takerTokenAmount: BigNumber): ContractTxFunctionObj<BigNumber>;
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
    }, BigNumber, BigNumber]>;
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>, logDecodeDependencies?: {
        [contractName: string]: ContractAbi;
    }, deployedBytecode?: string | undefined, encoderOverrides?: Partial<EncoderOverrides>);
}
//# sourceMappingURL=erc20_bridge_sampler.d.ts.map