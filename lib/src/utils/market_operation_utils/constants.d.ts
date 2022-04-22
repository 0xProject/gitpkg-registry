import { BigNumber } from '@0x/utils';
import { SourceFilters } from './source_filters';
import { ERC20BridgeSource, GetMarketOrdersOpts, TokenAdjacencyGraph } from './types';
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
export declare const MAINNET_TOKENS: {
    WETH: string;
    DAI: string;
    USDC: string;
    USDT: string;
    WBTC: string;
    UST: string;
    MIR: string;
    STABLEx: string;
    alUSD: string;
    FRAX: string;
    FXS: string;
    OHM: string;
    OHMV2: string;
    BTRFLY: string;
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
};
export declare const BSC_TOKENS: {
    WBNB: string;
    BUSD: string;
    USDT: string;
    USDC: string;
    DAI: string;
    UST: string;
    WEX: string;
    WETH: string;
};
export declare const POLYGON_TOKENS: {
    DAI: string;
    USDC: string;
    USDT: string;
    WBTC: string;
    WMATIC: string;
    WETH: string;
    nUSD: string;
};
export declare const AVALANCHE_TOKENS: {
    WAVAX: string;
    WETH: string;
    WBTC: string;
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
    DAI: string;
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
export declare const POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS: BigNumber;
export declare const DEFAULT_GET_MARKET_ORDERS_OPTS: Omit<GetMarketOrdersOpts, 'gasPrice'>;
//# sourceMappingURL=constants.d.ts.map