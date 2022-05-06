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
    43114: SourceFilters;
    250: SourceFilters;
    42220: SourceFilters;
    10: SourceFilters;
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
    43114: SourceFilters;
    250: SourceFilters;
    42220: SourceFilters;
    10: SourceFilters;
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
    43114: ERC20BridgeSource[];
    250: ERC20BridgeSource[];
    42220: ERC20BridgeSource[];
    10: ERC20BridgeSource[];
};
export declare const SOURCE_FLAGS: {
    [key in ERC20BridgeSource]: bigint;
} & {
    RfqOrder: bigint;
    LimitOrder: bigint;
};
export declare const MAINNET_TOKENS: {
    STABLEx: string;
    alUSD: string;
    FRAX: string;
    cvxFXS: string;
    FXS: string;
    OHM: string;
    OHMV2: string;
    BTRFLY: string;
    STG: string;
    LUSD: string;
    FEI: string;
    TRIBE: string;
    DSU: string;
    ESS: string;
    cvxCRV: string;
    CRV: string;
    MIM: string;
    EURT: string;
    nUSD: string;
    CVX: string;
    UST_WORMHOLE: string;
    RAI: string;
    DOLA: string;
    OUSD: string;
    agEUR: string;
    ibEUR: string;
    YFI: string;
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
    alETH: string;
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
    VAI: string;
    WEX: string;
    WETH: string;
    BTCB: string;
    renBTC: string;
    pBTC: string;
    nUSD: string;
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
    nUSD: string;
    ANY: string;
};
export declare const AVALANCHE_TOKENS: {
    WAVAX: string;
    WETH: string;
    WBTC: string;
    DAI: string;
    USDC: string;
    nUSDC: string;
    USDT: string;
    aDAI: string;
    aUSDC: string;
    aUSDT: string;
    nETH: string;
    nUSD: string;
    aWETH: string;
    MIM: string;
    MAG: string;
};
export declare const CELO_TOKENS: {
    WCELO: string;
    WETHv1: string;
    oWETH: string;
    WBTC: string;
    cUSD: string;
    cBTC: string;
    cETH: string;
    UBE: string;
    mCELO: string;
    mCUSD: string;
    mCEUR: string;
    amCUSD: string;
    MOO: string;
    wBTC: string;
    wETH: string;
    wBTCO: string;
    pUSDC: string;
    cUSDC: string;
    cUSDC_V2: string;
    pUSDC_V2: string;
    pUSD: string;
    pCELO: string;
    aaUSDC: string;
    asUSDC: string;
    mcUSDT: string;
    mcUSDC: string;
    DAI: string;
};
export declare const FANTOM_TOKENS: {
    WFTM: string;
    WETH: string;
    USDC: string;
    DAI: string;
    fUSDT: string;
    WBTC: string;
    WCRV: string;
    renBTC: string;
    MIM: string;
    nUSD: string;
    nETH: string;
    gfUSDT: string;
    gUSDC: string;
    gDAI: string;
    FRAX: string;
    gFTM: string;
    gETH: string;
    gWBTC: string;
    gCRV: string;
    gMIM: string;
};
export declare const GEIST_FANTOM_POOLS: {
    lendingPool: string;
};
export declare const OPTIMISM_TOKENS: {
    WETH: string;
    USDC: string;
    USDT: string;
    DAI: string;
    WBTC: string;
    nETH: string;
    sWETH: string;
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
    btrflyweth: string;
    stgusdc: string;
    TUSD: string;
    STABLEx: string;
    alUSD: string;
    FRAX: string;
    LUSD: string;
    BUSD: string;
    DSU3CRV: string;
    cvxcrv: string;
    cvxfxs: string;
    mim: string;
    eurt: string;
    ethcrv: string;
    ethcvx: string;
    mimust: string;
    usttri_wormhole: string;
    fei_tri: string;
    rai_tri: string;
    DOLA_tri: string;
    OUSD_tri: string;
    d3pool: string;
    triEURpool: string;
    ibEURsEUR: string;
    wethyfi: string;
};
export declare const CURVE_V2_POOLS: {
    tricrypto: string;
    tricrypto2: string;
};
export declare const CURVE_POLYGON_POOLS: {
    aave: string;
    ren: string;
};
export declare const CURVE_V2_POLYGON_POOLS: {
    atricrypto3: string;
};
export declare const CURVE_AVALANCHE_POOLS: {
    aave: string;
    mim: string;
    USDC: string;
};
export declare const CURVE_V2_AVALANCHE_POOLS: {
    atricrypto: string;
};
export declare const CURVE_FANTOM_POOLS: {
    fUSDT: string;
    twoPool: string;
    ren: string;
    tri_v2: string;
    geist: string;
    FRAX_twoPool: string;
};
export declare const CURVE_V2_FANTOM_POOLS: {
    tricrypto: string;
};
export declare const CURVE_OPTIMISM_POOLS: {
    tri: string;
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
    alETH: string;
    d4: string;
};
export declare const IRONSWAP_POOLS: {
    is3usd: string;
};
export declare const NERVE_POOLS: {
    threePool: string;
};
export declare const SYNAPSE_MAINNET_POOLS: {
    nUSDLP: string;
};
export declare const SYNAPSE_OPTIMISM_POOLS: {
    nETHLP: string;
};
export declare const SYNAPSE_BSC_POOLS: {
    nUSDLP: string;
};
export declare const SYNAPSE_POLYGON_POOLS: {
    nUSDLP: string;
};
export declare const SYNAPSE_FANTOM_POOLS: {
    nUSDLP: string;
    nETHLP: string;
};
export declare const SYNAPSE_AVALANCHE_POOLS: {
    nUSDLP: string;
    nETHLP: string;
};
export declare const SYNAPSE_ARBITRUM_POOLS: {
    nUSDLP: string;
    nETHLP: string;
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
export declare const MOBIUSMONEY_CELO_POOLS: {
    usdc_optics_v2: string;
    dai_optics_v2: string;
    weth_optics_v2: string;
    pusdc_optics_v2: string;
    usdc_allbridge_solana: string;
    usdc_poly_optics: string;
};
export declare const ACRYPTOS_POOLS: {
    acs4usd: string;
    acs4vai: string;
    acs4ust: string;
    acs3btc: string;
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
    43114: string[];
    250: string[];
    42220: string[];
    10: string[];
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
    43114: TokenAdjacencyGraph;
    250: TokenAdjacencyGraph;
    42220: TokenAdjacencyGraph;
    10: TokenAdjacencyGraph;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: BigNumber;
    250: BigNumber;
    42220: BigNumber;
    10: BigNumber;
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
export declare const CURVE_AVALANCHE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const CURVE_V2_AVALANCHE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const CURVE_FANTOM_INFOS: {
    [name: string]: CurveInfo;
};
export declare const CURVE_V2_FANTOM_INFOS: {
    [name: string]: CurveInfo;
};
export declare const CURVE_OPTIMISM_INFOS: {
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
export declare const IRONSWAP_POLYGON_INFOS: {
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
export declare const SYNAPSE_BSC_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SYNAPSE_FANTOM_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SYNAPSE_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SYNAPSE_OPTIMISM_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SYNAPSE_POLYGON_INFOS: {
    [name: string]: CurveInfo;
};
export declare const SYNAPSE_AVALANCHE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const FIREBIRDONESWAP_BSC_INFOS: {
    [name: string]: CurveInfo;
};
export declare const FIREBIRDONESWAP_POLYGON_INFOS: {
    [name: string]: CurveInfo;
};
export declare const MOBIUSMONEY_CELO_INFOS: {
    [name: string]: CurveInfo;
};
export declare const ACRYPTOS_BSC_INFOS: {
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
    43114: KyberSamplerOpts;
    250: KyberSamplerOpts;
    42220: KyberSamplerOpts;
    10: KyberSamplerOpts;
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
    43114: LiquidityProviderRegistry;
    250: LiquidityProviderRegistry;
    42220: LiquidityProviderRegistry;
    10: LiquidityProviderRegistry;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const SHIBASWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    250: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    42220: {
        mUSD: {
            poolAddress: string;
            tokens: string[];
        };
        mBTC: {
            poolAddress: string;
            tokens: string[];
        };
    };
    10: {
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string[];
    250: string[];
    42220: string[];
    10: string[];
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
    43114: {
        helper: string;
        registry: string;
    };
    250: {
        helper: string;
        registry: string;
    };
    42220: {
        helper: string;
        registry: string;
    };
    10: {
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
    43114: string[];
    250: string[];
    42220: string[];
    10: string[];
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: PsmInfo;
    250: PsmInfo;
    42220: PsmInfo;
    10: PsmInfo;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    250: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    42220: {
        StableCoins: {
            poolAddress: string;
            tokens: string[];
        };
        Bitcoin: {
            poolAddress: string;
            tokens: string[];
        };
    };
    10: {
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
    43114: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    250: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    42220: {
        USDP_USDC_USDT: {
            poolAddress: string;
            tokens: string[];
        };
        USDP_DAI_SUSD: {
            poolAddress: string;
            tokens: string[];
        };
    };
    10: {
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
export declare const GEIST_INFO_ADDRESS_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const BEETHOVEN_X_VAULT_ADDRESS_BY_CHAIN: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: LidoInfo;
    250: LidoInfo;
    42220: LidoInfo;
    10: LidoInfo;
};
export declare const BALANCER_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer";
export declare const BALANCER_TOP_POOLS_FETCHED = 250;
export declare const BALANCER_MAX_POOLS_FETCHED = 3;
export declare const BALANCER_V2_SUBGRAPH_URL_BY_CHAIN: {
    1: string | null;
    3: string | null;
    4: string | null;
    42: string | null;
    1337: string | null;
    56: string | null;
    137: string | null;
    80001: string | null;
    43114: string | null;
    250: string | null;
    42220: string | null;
    10: string | null;
};
export declare const BEETHOVEN_X_SUBGRAPH_URL_BY_CHAIN: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
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
    43114: {
        quoter: string;
        router: string;
    };
    250: {
        quoter: string;
        router: string;
    };
    42220: {
        quoter: string;
        router: string;
    };
    10: {
        quoter: string;
        router: string;
    };
};
export declare const AAVE_V2_SUBGRAPH_URL_BY_CHAIN_ID: {
    1: string | null;
    3: string | null;
    4: string | null;
    42: string | null;
    1337: string | null;
    56: string | null;
    137: string | null;
    80001: string | null;
    43114: string | null;
    250: string | null;
    42220: string | null;
    10: string | null;
};
export declare const COMPOUND_API_URL_BY_CHAIN_ID: {
    1: null;
    3: null;
    4: null;
    42: null;
    1337: null;
    56: null;
    137: null;
    80001: null;
    43114: null;
    250: null;
    42220: null;
    10: null;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
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
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const JETSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const PANGOLIN_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const TRADER_JOE_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const UBESWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const MORPHEUSSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const SPIRITSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const SPOOKYSWAP_ROUTER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
    43114: string;
    250: string;
    42220: string;
    10: string;
};
export declare const VIP_ERC20_BRIDGE_SOURCES_BY_CHAIN_ID: {
    1: ERC20BridgeSource[];
    3: ERC20BridgeSource[];
    4: ERC20BridgeSource[];
    42: ERC20BridgeSource[];
    1337: ERC20BridgeSource[];
    56: ERC20BridgeSource[];
    137: ERC20BridgeSource[];
    80001: ERC20BridgeSource[];
    43114: ERC20BridgeSource[];
    250: ERC20BridgeSource[];
    42220: ERC20BridgeSource[];
    10: ERC20BridgeSource[];
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
export declare const DEFAULT_GET_MARKET_ORDERS_OPTS: Omit<GetMarketOrdersOpts, 'gasPrice'>;
//# sourceMappingURL=constants.d.ts.map