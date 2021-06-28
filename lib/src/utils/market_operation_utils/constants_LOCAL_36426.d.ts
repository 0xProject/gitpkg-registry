import { BigNumber } from '@0x/utils';
import { SourceFilters } from './source_filters';
import { CurveInfo, ERC20BridgeSource, FeeSchedule, GetMarketOrdersOpts, KyberSamplerOpts, LidoInfo, LiquidityProviderRegistry, PsmInfo, TokenAdjacencyGraph } from './types';
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
export declare const SAMPLER_ADDRESS = "0x5555555555555555555555555555555555555555";
export declare const COMPARISON_PRICE_DECIMALS = 10;
/**
 * Valid sources for market sell.
 */
export declare const SELL_SOURCE_FILTER_BY_CHAIN_ID: {
    1: SourceFilters;
    3: SourceFilters;
    4: SourceFilters;
    42: SourceFilters;
    1337: SourceFilters;
    56: SourceFilters;
    137: SourceFilters;
    80001: SourceFilters;
};
/**
 * Valid sources for market buy.
 */
export declare const BUY_SOURCE_FILTER_BY_CHAIN_ID: {
    1: SourceFilters;
    3: SourceFilters;
    4: SourceFilters;
    42: SourceFilters;
    1337: SourceFilters;
    56: SourceFilters;
    137: SourceFilters;
    80001: SourceFilters;
};
/**
 *  0x Protocol Fee Multiplier
 */
export declare const PROTOCOL_FEE_MULTIPLIER: BigNumber;
/**
 * Sources to poll for ETH fee price estimates.
 */
export declare const FEE_QUOTE_SOURCES_BY_CHAIN_ID: {
    1: ERC20BridgeSource[];
    3: ERC20BridgeSource[];
    4: ERC20BridgeSource[];
    42: ERC20BridgeSource[];
    1337: ERC20BridgeSource[];
    56: ERC20BridgeSource[];
    137: ERC20BridgeSource[];
    80001: ERC20BridgeSource[];
};
export declare const SOURCE_FLAGS: {
    [key in ERC20BridgeSource]: number;
} & {
    RfqOrder: number;
    LimitOrder: number;
};
export declare const MAINNET_TOKENS: {
    STABLEx: string;
    alUSD: string;
    FRAX: string;
    LUSD: string;
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
    USDP: string;
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
    aSUSD: string;
    MKR: string;
    EURS: string;
    sEUR: string;
    sETH: string;
    stETH: string;
    LINK: string;
    MANA: string;
    KNC: string;
    AAVE: string;
    sLINK: string;
    yUSD: string;
    ybCRV: string;
    yCRV: string;
    bCRV: string;
    yDAI: string;
    yUSDC: string;
    yUSDT: string;
    yTUSD: string;
    crETH: string;
    ankrETH: string;
    vETH: string;
    HT: string;
    UST: string;
    MIR: string;
};
export declare const BSC_TOKENS: {
    WBNB: string;
    BUSD: string;
    USDT: string;
    USDC: string;
    DAI: string;
    PAX: string;
    UST: string;
    WEX: string;
    WETH: string;
};
export declare const POLYGON_TOKENS: {
    DAI: string;
    USDC: string;
    USDT: string;
    amDAI: string;
    amUSDC: string;
    amUSDT: string;
    WBTC: string;
    WMATIC: string;
    WETH: string;
    renBTC: string;
    QUICK: string;
    DFYN: string;
    BANANA: string;
    WEXPOLY: string;
};
export declare const CURVE_POOLS: {
    compound: string;
    PAX: string;
    sUSD: string;
    renBTC: string;
    sBTC: string;
    HBTC: string;
    TRI: string;
    GUSD: string;
    HUSD: string;
    USDN: string;
    mUSD: string;
    dUSD: string;
    tBTC: string;
    pBTC: string;
    bBTC: string;
    oBTC: string;
    UST: string;
    eurs: string;
    seth: string;
    aave: string;
    steth: string;
    saave: string;
    ankreth: string;
    USDP: string;
    ib: string;
    link: string;
    TUSD: string;
    STABLEx: string;
    alUSD: string;
    FRAX: string;
    LUSD: string;
    BUSD: string;
};
export declare const CURVE_V2_POOLS: {
    tricrypto: string;
};
export declare const CURVE_POLYGON_POOLS: {
    aave: string;
    ren: string;
};
export declare const CURVE_V2_POLYGON_POOLS: {
    atricrypto: string;
};
export declare const SWERVE_POOLS: {
    y: string;
};
export declare const SNOWSWAP_POOLS: {
    yUSD: string;
    yVault: string;
};
export declare const SMOOTHY_POOLS: {
    syUSD: string;
};
export declare const SADDLE_POOLS: {
    stables: string;
    bitcoins: string;
};
export declare const NERVE_POOLS: {
    threePool: string;
};
export declare const BELT_POOLS: {
    vPool: string;
};
export declare const ELLIPSIS_POOLS: {
    threePool: string;
};
export declare const XSIGMA_POOLS: {
    stable: string;
};
export declare const FIREBIRDONESWAP_BSC_POOLS: {
    oneswap: string;
};
export declare const FIREBIRDONESWAP_POLYGON_POOLS: {
    oneswap: string;
};
export declare const DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID: {
    1: string[];
    3: string[];
    4: string[];
    42: string[];
    1337: string[];
    56: string[];
    137: string[];
    80001: string[];
};
export declare const DEFAULT_TOKEN_ADJACENCY_GRAPH_BY_CHAIN_ID: {
    1: TokenAdjacencyGraph;
    3: TokenAdjacencyGraph;
    4: TokenAdjacencyGraph;
    42: TokenAdjacencyGraph;
    1337: TokenAdjacencyGraph;
    56: TokenAdjacencyGraph;
    137: TokenAdjacencyGraph;
    80001: TokenAdjacencyGraph;
};
export declare const NATIVE_FEE_TOKEN_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const NATIVE_FEE_TOKEN_AMOUNT_BY_CHAIN_ID: {
    1: BigNumber;
    3: BigNumber;
    4: BigNumber;
    42: BigNumber;
    1337: BigNumber;
    56: BigNumber;
    137: BigNumber;
    80001: BigNumber;
};
/**
 * Mainnet Curve configuration
 * The tokens are in order of their index, which each curve defines
 * I.e DaiUsdc curve has DAI as index 0 and USDC as index 1
 */
export declare const CURVE_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const CURVE_V2_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const CURVE_POLYGON_INFOS: {
    [name: string]: CurveInfo;
};
export declare const CURVE_V2_POLYGON_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SWERVE_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SNOWSWAP_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const BELT_BSC_INFOS: {
    [name: string]: CurveInfo;
};
export declare const ELLIPSIS_BSC_INFOS: {
    [name: string]: CurveInfo;
};
export declare const XSIGMA_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SADDLE_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SMOOTHY_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SMOOTHY_BSC_INFOS: {
    [name: string]: CurveInfo;
};
export declare const NERVE_BSC_INFOS: {
    [name: string]: CurveInfo;
};
export declare const FIREBIRDONESWAP_BSC_INFOS: {
    [name: string]: CurveInfo;
};
export declare const FIREBIRDONESWAP_POLYGON_INFOS: {
    [name: string]: CurveInfo;
};
/**
 * Kyber reserve prefixes
 * 0xff Fed price reserve
 * 0xaa Automated price reserve
 * 0xbb Bridged price reserve (i.e Uniswap/Curve)
 */
export declare const KYBER_BRIDGED_LIQUIDITY_PREFIX = "0xbb";
export declare const KYBER_BANNED_RESERVES: string[];
export declare const MAX_KYBER_RESERVES_QUERIED = 5;
export declare const KYBER_CONFIG_BY_CHAIN_ID: {
    1: KyberSamplerOpts;
    3: KyberSamplerOpts;
    4: KyberSamplerOpts;
    42: KyberSamplerOpts;
    1337: KyberSamplerOpts;
    56: KyberSamplerOpts;
    137: KyberSamplerOpts;
    80001: KyberSamplerOpts;
};
export declare const LIQUIDITY_PROVIDER_REGISTRY_BY_CHAIN_ID: {
    1: LiquidityProviderRegistry;
    3: LiquidityProviderRegistry;
    4: LiquidityProviderRegistry;
    42: LiquidityProviderRegistry;
    1337: LiquidityProviderRegistry;
    56: LiquidityProviderRegistry;
    137: LiquidityProviderRegistry;
    80001: LiquidityProviderRegistry;
};
export declare const UNISWAPV1_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const UNISWAPV2_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const SUSHISWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const CRYPTO_COM_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const LINKSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const MSTABLE_POOLS_BY_CHAIN_ID: {
    1: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    3: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    4: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    42: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    1337: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    56: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    137: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    80001: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
};
export declare const OASIS_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const KYBER_DMM_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const MOONISWAP_REGISTRIES_BY_CHAIN_ID: {
    1: string[];
    3: string[];
    4: string[];
    42: string[];
    1337: string[];
    56: string[];
    137: string[];
    80001: string[];
};
export declare const DODOV1_CONFIG_BY_CHAIN_ID: {
    1: {
        helper: string;
        registry: string;
    };
    3: {
        helper: string;
        registry: string;
    };
    4: {
        helper: string;
        registry: string;
    };
    42: {
        helper: string;
        registry: string;
    };
    1337: {
        helper: string;
        registry: string;
    };
    56: {
        helper: string;
        registry: string;
    };
    137: {
        helper: string;
        registry: string;
    };
    80001: {
        helper: string;
        registry: string;
    };
};
export declare const DODOV2_FACTORIES_BY_CHAIN_ID: {
    1: string[];
    3: string[];
    4: string[];
    42: string[];
    1337: string[];
    56: string[];
    137: string[];
    80001: string[];
};
export declare const MAX_DODOV2_POOLS_QUERIED = 3;
export declare const CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const MAKER_PSM_INFO_BY_CHAIN_ID: {
    1: PsmInfo;
    3: PsmInfo;
    4: PsmInfo;
    42: PsmInfo;
    1337: PsmInfo;
    56: PsmInfo;
    137: PsmInfo;
    80001: PsmInfo;
};
export declare const MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const BANCOR_REGISTRY_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const SHELL_POOLS_BY_CHAIN_ID: {
    1: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    3: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    4: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    42: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    1337: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    56: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    137: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    80001: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
};
export declare const COMPONENT_POOLS_BY_CHAIN_ID: {
    1: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    3: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    4: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    42: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    1337: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    56: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    137: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    80001: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
};
export declare const BALANCER_V2_VAULT_ADDRESS_BY_CHAIN: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const LIDO_INFO_BY_CHAIN: {
    1: LidoInfo;
    3: LidoInfo;
    4: LidoInfo;
    42: LidoInfo;
    1337: LidoInfo;
    56: LidoInfo;
    137: LidoInfo;
    80001: LidoInfo;
};
export declare const BALANCER_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer";
export declare const BALANCER_TOP_POOLS_FETCHED = 250;
export declare const BALANCER_MAX_POOLS_FETCHED = 3;
export declare const BALANCER_V2_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2";
export declare const UNISWAPV3_CONFIG_BY_CHAIN_ID: {
    1: {
        quoter: string;
        router: string;
    };
    3: {
        quoter: string;
        router: string;
    };
    4: {
        quoter: string;
        router: string;
    };
    42: {
        quoter: string;
        router: string;
    };
    1337: {
        quoter: string;
        router: string;
    };
    56: {
        quoter: string;
        router: string;
    };
    137: {
        quoter: string;
        router: string;
    };
    80001: {
        quoter: string;
        router: string;
    };
};
export declare const PANCAKESWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const PANCAKESWAPV2_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const BAKERYSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const APESWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const CAFESWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const CHEESESWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const JULSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const QUICKSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const COMETHSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const DFYN_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const WAULTSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const POLYDEX_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
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
//# sourceMappingURL=constants_LOCAL_36426.d.ts.map