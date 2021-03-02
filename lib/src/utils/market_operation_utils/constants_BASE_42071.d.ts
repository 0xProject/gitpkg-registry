import { BigNumber } from '@0x/utils';
import { SourceFilters } from './source_filters';
import { CurveInfo, ERC20BridgeSource, FeeSchedule, GetMarketOrdersOpts, LiquidityProviderRegistry, TokenAdjacencyGraph } from './types';
export declare const ERC20_PROXY_ID = "0xf47261b0";
export declare const WALLET_SIGNATURE = "0x04";
export declare const ONE_ETHER: BigNumber;
export declare const NEGATIVE_INF: BigNumber;
export declare const POSITIVE_INF: BigNumber;
export declare const ZERO_AMOUNT: BigNumber;
export declare const MAX_UINT256: BigNumber;
export declare const ONE_HOUR_IN_SECONDS: number;
export declare const ONE_SECOND_MS = 1000;
export declare const NULL_BYTES = "0x";
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const COMPARISON_PRICE_DECIMALS = 10;
/**
 * Valid sources for market sell.
 */
export declare const SELL_SOURCE_FILTER: SourceFilters;
/**
 * Valid sources for market buy.
 */
export declare const BUY_SOURCE_FILTER: SourceFilters;
/**
 *  0x Protocol Fee Multiplier
 */
export declare const PROTOCOL_FEE_MULTIPLIER: BigNumber;
/**
 * Sources to poll for ETH fee price estimates.
 */
export declare const FEE_QUOTE_SOURCES: ERC20BridgeSource[];
export declare const SOURCE_FLAGS: {
    [source in ERC20BridgeSource]: number;
};
export declare const TOKENS: {
    mAAPL: string;
    mSLV: string;
    mIAU: string;
    mAMZN: string;
    mGOOGL: string;
    mTSLA: string;
    mQQQ: string;
    mTWTR: string;
    mMSFT: string;
    mNFLX: string;
    mBABA: string;
    mUSO: string;
    mVIXY: string;
    mLUNA: string;
    WETH: string;
    DAI: string;
    USDC: string;
    USDT: string;
    sUSD: string;
    BUSD: string;
    TUSD: string;
    PAX: string;
    GUSD: string;
    HUSD: string;
    mUSD: string;
    USDN: string;
    dUSD: string;
    WBTC: string;
    RenBTC: string;
    sBTC: string;
    tBTC: string;
    hBTC: string;
    pBTC: string;
    bBTC: string;
    oBTC: string;
    aDAI: string;
    aUSDC: string;
    aUSDT: string;
    MKR: string;
    EURS: string;
    sEUR: string;
    sETH: string;
    LINK: string;
    UST: string;
    MIR: string;
};
export declare const POOLS: {
    curve_compound: string;
    curve_PAX: string;
    curve_y: string;
    curve_BUSD: string;
    curve_sUSD: string;
    curve_renBTC: string;
    curve_sBTC: string;
    curve_HBTC: string;
    curve_TRI: string;
    curve_GUSD: string;
    curve_HUSD: string;
    curve_USDN: string;
    curve_mUSD: string;
    curve_tBTC: string;
    curve_dUSD: string;
    curve_pBTC: string;
    curve_bBTC: string;
    curve_oBTC: string;
    curve_UST: string;
    curve_eurs: string;
    curve_aave: string;
};
export declare const DEFAULT_INTERMEDIATE_TOKENS: string[];
export declare const DEFAULT_TOKEN_ADJACENCY_GRAPH: TokenAdjacencyGraph;
/**
 * Mainnet Curve configuration
 * The tokens are in order of their index, which each curve defines
 * I.e DaiUsdc curve has DAI as index 0 and USDC as index 1
 */
export declare const MAINNET_CURVE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const MAINNET_SWERVE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const MAINNET_SNOWSWAP_INFOS: {
    [name: string]: CurveInfo;
};
/**
 * Kyber reserve prefixes
 * 0xff Fed price reserve
 * 0xaa Automated price reserve
 * 0xbb Bridged price reserve (i.e Uniswap/Curve)
 */
export declare const KYBER_BRIDGED_LIQUIDITY_PREFIX = "0xbb";
export declare const MAX_KYBER_RESERVES_QUERIED = 5;
export declare const MAINNET_KYBER_NETWORK_PROXY = "0x9aab3f75489902f3a48495025729a0af77d4b11e";
export declare const LIQUIDITY_PROVIDER_REGISTRY: LiquidityProviderRegistry;
export declare const MAINNET_UNISWAP_V1_ROUTER = "0xc0a47dfe034b400b47bdad5fecda2621de6c4d95";
export declare const MAINNET_UNISWAP_V2_ROUTER = "0xf164fc0ec4e93095b804a4795bbe1e041497b92a";
export declare const MAINNET_SUSHI_SWAP_ROUTER = "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f";
export declare const MAINNET_CRYPTO_COM_ROUTER = "0xceb90e4c17d626be0facd78b79c9c87d7ca181b3";
export declare const MAINNET_LINKSWAP_ROUTER = "0xa7ece0911fe8c60bff9e99f8fafcdbe56e07aff1";
export declare const MAINNET_MSTABLE_ROUTER = "0xe2f2a5c287993345a840db3b0845fbc70f5935a5";
export declare const MAINNET_OASIS_ROUTER = "0x794e6e91555438afc3ccf1c5076a74f42133d08d";
export declare const MAINNET_MOONISWAP_REGISTRY = "0x71CD6666064C3A1354a3B4dca5fA1E2D3ee7D303";
export declare const MAINNET_MOONISWAP_V2_REGISTRY = "0xc4a8b7e29e3c8ec560cd4945c1cf3461a85a148d";
export declare const MAINNET_MOONISWAP_V2_1_REGISTRY = "0xbaf9a5d4b0052359326a6cdab54babaa3a3a9643";
export declare const MAINNET_DODO_HELPER = "0x533da777aedce766ceae696bf90f8541a4ba80eb";
export declare const MAINNET_DODOV2_PRIVATE_POOL_FACTORY = "0x6b4fa0bc61eddc928e0df9c7f01e407bfcd3e5ef";
export declare const MAINNET_DODOV2_VENDING_MACHINE_FACTORY = "0x72d220ce168c4f361dd4dee5d826a01ad8598f6c";
export declare const MAX_DODOV2_POOLS_QUERIED = 3;
export declare const CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID: {
    [id: string]: string;
};
export declare const MAINNET_SHELL_POOLS: {
    StableCoins: {
        poolAddress: string;
        tokens: string[];
    };
    Bitcoin: {
        poolAddress: string;
        tokens: string[];
    };
};
export declare const BALANCER_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer";
export declare const BALANCER_TOP_POOLS_FETCHED = 250;
export declare const BALANCER_MAX_POOLS_FETCHED = 3;
/**
 * Calculated gross gas cost of the underlying exchange.
 * The cost of switching from one source to another, assuming
 * we are in the middle of a transaction.
 * I.e remove the overhead cost of ExchangeProxy (130k) and
 * the ethereum transaction cost (21k)
 */
export declare const DEFAULT_GAS_SCHEDULE: Required<FeeSchedule>;
export declare const DEFAULT_FEE_SCHEDULE: Required<FeeSchedule>;
export declare const POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS: BigNumber;
export declare const DEFAULT_GET_MARKET_ORDERS_OPTS: GetMarketOrdersOpts;
//# sourceMappingURL=constants_BASE_42071.d.ts.map