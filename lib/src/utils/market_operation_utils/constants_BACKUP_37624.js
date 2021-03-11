"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const token_adjacency_graph_builder_1 = require("../token_adjacency_graph_builder");
const source_filters_1 = require("./source_filters");
const types_1 = require("./types");
// tslint:disable: custom-no-magic-numbers no-bitwise
exports.ERC20_PROXY_ID = '0xf47261b0';
exports.WALLET_SIGNATURE = '0x04';
exports.ONE_ETHER = new utils_1.BigNumber(1e18);
exports.NEGATIVE_INF = new utils_1.BigNumber('-Infinity');
exports.POSITIVE_INF = new utils_1.BigNumber('Infinity');
exports.ZERO_AMOUNT = new utils_1.BigNumber(0);
exports.MAX_UINT256 = new utils_1.BigNumber(2).pow(256).minus(1);
exports.ONE_HOUR_IN_SECONDS = 60 * 60;
exports.ONE_SECOND_MS = 1000;
exports.NULL_BYTES = '0x';
exports.NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.COMPARISON_PRICE_DECIMALS = 10;
function valueByChainId(rest, defaultValue) {
    // TODO I don't like this but iterating through enums is weird
    return Object.assign({ [contract_addresses_1.ChainId.Mainnet]: defaultValue, [contract_addresses_1.ChainId.Ropsten]: defaultValue, [contract_addresses_1.ChainId.Rinkeby]: defaultValue, [contract_addresses_1.ChainId.Kovan]: defaultValue, [contract_addresses_1.ChainId.Ganache]: defaultValue, [contract_addresses_1.ChainId.BSC]: defaultValue }, (rest || {}));
}
/**
 * Valid sources for market sell.
 */
exports.SELL_SOURCE_FILTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.Eth2Dai,
        types_1.ERC20BridgeSource.Kyber,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Balancer,
        types_1.ERC20BridgeSource.Bancor,
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.Swerve,
        types_1.ERC20BridgeSource.SnowSwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Shell,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Cream,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.CryptoCom,
        types_1.ERC20BridgeSource.Linkswap,
    ]),
    [contract_addresses_1.ChainId.Ropsten]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Rinkeby]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Kovan]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Ganache]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.BSC]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.PancakeSwap,
        types_1.ERC20BridgeSource.BakerySwap,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.SushiSwap,
    ]),
}, new source_filters_1.SourceFilters([]));
/**
 * Valid sources for market buy.
 */
exports.BUY_SOURCE_FILTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.Eth2Dai,
        types_1.ERC20BridgeSource.Kyber,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Balancer,
        // ERC20BridgeSource.Bancor, // FIXME: Bancor Buys not implemented in Sampler
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.Shell,
        types_1.ERC20BridgeSource.Swerve,
        types_1.ERC20BridgeSource.SnowSwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Cream,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.CryptoCom,
        types_1.ERC20BridgeSource.Linkswap,
    ]),
    [contract_addresses_1.ChainId.Ropsten]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Rinkeby]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Kovan]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Ganache]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.BSC]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.PancakeSwap,
        types_1.ERC20BridgeSource.BakerySwap,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.SushiSwap,
    ]),
}, new source_filters_1.SourceFilters([]));
/**
 *  0x Protocol Fee Multiplier
 */
exports.PROTOCOL_FEE_MULTIPLIER = new utils_1.BigNumber(70000);
/**
 * Sources to poll for ETH fee price estimates.
 */
exports.FEE_QUOTE_SOURCES_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2],
    [contract_addresses_1.ChainId.BSC]: [types_1.ERC20BridgeSource.PancakeSwap, types_1.ERC20BridgeSource.Mooniswap, types_1.ERC20BridgeSource.SushiSwap],
}, []);
exports.SOURCE_FLAGS = Object.assign({}, ...Object.values(types_1.ERC20BridgeSource).map((source, index) => ({ [source]: 1 << index })));
const MIRROR_WRAPPED_TOKENS = {
    mAAPL: '0xd36932143f6ebdedd872d5fb0651f4b72fd15a84',
    mSLV: '0x9d1555d8cb3c846bb4f7d5b1b1080872c3166676',
    mIAU: '0x1d350417d9787e000cc1b95d70e9536dcd91f373',
    mAMZN: '0x0cae9e4d663793c2a2a0b211c1cf4bbca2b9caa7',
    mGOOGL: '0x4b70ccd1cf9905be1faed025eadbd3ab124efe9a',
    mTSLA: '0x21ca39943e91d704678f5d00b6616650f066fd63',
    mQQQ: '0x13b02c8de71680e71f0820c996e4be43c2f57d15',
    mTWTR: '0xedb0414627e6f1e3f082de65cd4f9c693d78cca9',
    mMSFT: '0x41bbedd7286daab5910a1f15d12cbda839852bd7',
    mNFLX: '0xc8d674114bac90148d11d3c1d33c61835a0f9dcd',
    mBABA: '0x676ce85f66adb8d7b8323aeefe17087a3b8cb363',
    mUSO: '0x31c63146a635eb7465e5853020b39713ac356991',
    mVIXY: '0xf72fcd9dcf0190923fadd44811e240ef4533fc86',
    mLUNA: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
};
// Mainnet tokens
// Not an exhaustive list, just enough so we don't repeat ourselves
exports.TOKENS = Object.assign({ WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 
    // Stable Coins
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f', USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7', sUSD: '0x57ab1ec28d129707052df4df418d58a2d46d5f51', BUSD: '0x4fabb145d64652a948d72533023f6e7a623c7c53', TUSD: '0x0000000000085d4780b73119b644ae5ecd22b376', PAX: '0x8e870d67f660d95d5be530380d0ec0bd388289e1', GUSD: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd', HUSD: '0xdf574c24545e5ffecb9a659c229253d4111d87e1', mUSD: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5', USDN: '0x674c6ad92fd080e4004b2312b45f796a192d27a0', dUSD: '0x5bc25f649fc4e26069ddf4cf4010f9f706c23831', 
    // Bitcoins
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', RenBTC: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d', sBTC: '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6', tBTC: '0x8daebade922df735c38c80c7ebd708af50815faa', hBTC: '0x0316eb71485b0ab14103307bf65a021042c6d380', pBTC: '0xde5331ac4b3630f94853ff322b66407e0d6331e8', bBTC: '0x9be89d2a4cd102d8fecc6bf9da793be995c22541', oBTC: '0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68', 
    // aTokens (Aave)
    aDAI: '0x028171bca77440897b824ca71d1c56cac55b68a3', aUSDC: '0xbcca60bb61934080951369a648fb03df4f96263c', aUSDT: '0x3ed3b47dd13ec9a98b44e6204a523e766b225811', 
    // Other
    MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', EURS: '0xdb25f211ab05b1c97d595516f45794528a807ad8', sEUR: '0xd71ecff9342a5ced620049e616c5035f1db98620', sETH: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb', LINK: '0x514910771af9ca656af840dff83e8264ecf986ca', 
    // Mirror Protocol
    UST: '0xa47c8bf37f92abed4a126bda807a7b7498661acd', MIR: '0x09a3ecafa817268f77be1283176b946c4ff2e608' }, MIRROR_WRAPPED_TOKENS);
exports.CURVE_POOLS = {
    curve_compound: '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56',
    // 1.USDT is dead
    curve_PAX: '0x06364f10b501e868329afbc005b3492902d6c763',
    // 3. 0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51 y-pool is dead
    // 4. 0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27 BUSD is dead
    curve_sUSD: '0xa5407eae9ba41422680e2e00537571bcc53efbfd',
    curve_renBTC: '0x93054188d876f558f4a66b2ef1d97d16edf0895b',
    curve_sBTC: '0x7fc77b5c7614e1533320ea6ddc2eb61fa00a9714',
    curve_HBTC: '0x4ca9b3063ec5866a4b82e437059d2c43d1be596f',
    curve_TRI: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
    curve_GUSD: '0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956',
    curve_HUSD: '0x3ef6a01a0f81d6046290f3e2a8c5b843e738e604',
    // 12.usdk is dead
    curve_USDN: '0x0f9cb53ebe405d49a0bbdbd291a65ff571bc83e1',
    // 14.linkusd is dead
    curve_mUSD: '0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6',
    // 16.rsv is dead
    curve_tBTC: '0xc25099792e9349c7dd09759744ea681c7de2cb66',
    curve_dUSD: '0x8038c01a0390a8c547446a0b2c18fc9aefecc10c',
    curve_pBTC: '0x5228a22e72ccc52d415ecfd199f99d0665e7733b',
    curve_bBTC: '0x071c661b4deefb59e2a3ddb20db036821eee8f4b',
    curve_oBTC: '0xd81da8d904b52208541bade1bd6595d8a251f8dd',
    curve_UST: '0x890f4e345b1daed0367a877a1612f86a1f86985f',
    curve_eurs: '0x0ce6a5ff5217e38315f87032cf90686c96627caa',
    // curve_seth: '0xc5424b857f758e906013f3555dad202e4bdb4567', // 24.seth
    curve_aave: '0xdebf20617708857ebe4f679508e7b7863a8a8eee',
};
exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [exports.TOKENS.WETH, exports.TOKENS.USDT, exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.WBTC],
    [contract_addresses_1.ChainId.BSC]: [
        '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        '0x55d398326f99059ff775485246999027b3197955',
    ],
}, []);
exports.DEFAULT_TOKEN_ADJACENCY_GRAPH_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet],
    })
        // Mirror Protocol
        .tap(builder => {
        builder
            .add(exports.TOKENS.MIR, exports.TOKENS.UST)
            .add(exports.TOKENS.UST, [exports.TOKENS.MIR, ...Object.values(MIRROR_WRAPPED_TOKENS)])
            .add(exports.TOKENS.USDT, exports.TOKENS.UST);
        Object.values(MIRROR_WRAPPED_TOKENS).forEach(t => builder.add(t, exports.TOKENS.UST));
    })
        // Build
        .build(),
    [contract_addresses_1.ChainId.BSC]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.BSC],
    }).build(),
}, new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({ default: [] }).build());
exports.NATIVE_FEE_TOKEN_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: exports.TOKENS.WETH,
    [contract_addresses_1.ChainId.BSC]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
}, exports.NULL_ADDRESS);
exports.NATIVE_FEE_TOKEN_AMOUNT_BY_CHAIN_ID = valueByChainId({}, exports.ONE_ETHER);
/**
 * Mainnet Curve configuration
 * The tokens are in order of their index, which each curve defines
 * I.e DaiUsdc curve has DAI as index 0 and USDC as index 1
 */
exports.MAINNET_CURVE_INFOS = {
    [exports.CURVE_POOLS.curve_compound]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: exports.CURVE_POOLS.curve_compound,
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_PAX]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_PAX,
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.PAX],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_sUSD]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_sUSD,
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.sUSD],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_renBTC]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_renBTC,
        tokens: [exports.TOKENS.RenBTC, exports.TOKENS.WBTC],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_sBTC]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_sBTC,
        tokens: [exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_HBTC]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_HBTC,
        tokens: [exports.TOKENS.hBTC, exports.TOKENS.WBTC],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_TRI]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_TRI,
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_GUSD]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_GUSD,
        tokens: [exports.TOKENS.GUSD, exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: exports.TOKENS.GUSD,
    },
    [exports.CURVE_POOLS.curve_HUSD]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_HUSD,
        tokens: [exports.TOKENS.HUSD, exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: exports.TOKENS.HUSD,
    },
    [exports.CURVE_POOLS.curve_USDN]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_USDN,
        tokens: [exports.TOKENS.USDN, exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: exports.TOKENS.USDN,
    },
    [exports.CURVE_POOLS.curve_mUSD]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_mUSD,
        tokens: [exports.TOKENS.mUSD, exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: exports.TOKENS.mUSD,
    },
    [exports.CURVE_POOLS.curve_tBTC]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_tBTC,
        tokens: [exports.TOKENS.tBTC, exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
        metaToken: exports.TOKENS.tBTC,
    },
    [exports.CURVE_POOLS.curve_dUSD]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_dUSD,
        tokens: [exports.TOKENS.dUSD, exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: exports.TOKENS.dUSD,
    },
    [exports.CURVE_POOLS.curve_pBTC]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_pBTC,
        tokens: [exports.TOKENS.pBTC, exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
        metaToken: exports.TOKENS.pBTC,
    },
    [exports.CURVE_POOLS.curve_bBTC]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_bBTC,
        tokens: [exports.TOKENS.bBTC, exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
        metaToken: exports.TOKENS.bBTC,
    },
    [exports.CURVE_POOLS.curve_oBTC]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_oBTC,
        tokens: [exports.TOKENS.oBTC, exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
        metaToken: exports.TOKENS.oBTC,
    },
    [exports.CURVE_POOLS.curve_UST]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_UST,
        tokens: [exports.TOKENS.UST, exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: exports.TOKENS.UST,
    },
    [exports.CURVE_POOLS.curve_eurs]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_eurs,
        tokens: [exports.TOKENS.EURS, exports.TOKENS.sEUR],
        metaToken: undefined,
    },
    // [POOLS.curve_seth]: {
    //     exchangeFunctionSelector: CurveFunctionSelectors.exchange,
    //     sellQuoteFunctionSelector: CurveFunctionSelectors.get_dy,
    //     buyQuoteFunctionSelector: CurveFunctionSelectors.None,
    //     poolAddress: POOLS.curve_seth,
    //     tokens: [TOKENS.ETH, TOKENS.sETH],
    //     metaToken: undefined,
    // },
    [exports.CURVE_POOLS.curve_aave]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_aave,
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
        metaToken: undefined,
    },
    [exports.CURVE_POOLS.curve_aave]: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: exports.CURVE_POOLS.curve_aave,
        tokens: [exports.TOKENS.aDAI, exports.TOKENS.aUSDC, exports.TOKENS.aUSDT],
        metaToken: undefined,
    },
};
exports.MAINNET_SWERVE_INFOS = {
    swUSD: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0x329239599afb305da0a2ec69c58f8a6697f9f88d',
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.TUSD],
        metaToken: undefined,
    },
};
exports.MAINNET_SNOWSWAP_INFOS = {
    yVaultCurve: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx,
        poolAddress: '0xbf7ccd6c446acfcc5df023043f2167b62e81899b',
        tokens: [
            '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c',
            '0x2994529c0652d127b7842094103715ec5299bbed',
        ],
        metaToken: undefined,
    },
    yVaultCurveUnderlying: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0xbf7ccd6c446acfcc5df023043f2167b62e81899b',
        tokens: [
            '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
            '0x3b3ac5386837dc563660fb6a0937dfaa5924333b',
        ],
        metaToken: undefined,
    },
    yVaultUSD: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx,
        poolAddress: '0x4571753311e37ddb44faa8fb78a6df9a6e3c6c0b',
        tokens: [
            '0xacd43e627e64355f1861cec6d3a6688b31a6f952',
            '0x597ad1e0c13bfe8025993d9e79c69e1c0233522e',
            '0x2f08119c6f07c006695e079aafc638b8789faf18',
            '0x37d19d1c4e1fa9dc47bd1ea12f742a0887eda74a',
        ],
        metaToken: undefined,
    },
};
/**
 * Kyber reserve prefixes
 * 0xff Fed price reserve
 * 0xaa Automated price reserve
 * 0xbb Bridged price reserve (i.e Uniswap/Curve)
 */
exports.KYBER_BRIDGED_LIQUIDITY_PREFIX = '0xbb';
exports.MAX_KYBER_RESERVES_QUERIED = 5;
exports.KYBER_CONFIG_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        networkProxy: '0x9aab3f75489902f3a48495025729a0af77d4b11e',
        hintHandler: '0xa1C0Fa73c39CFBcC11ec9Eb1Afc665aba9996E2C',
        weth: exports.TOKENS.WETH,
    },
}, {
    networkProxy: exports.NULL_ADDRESS,
    hintHandler: exports.NULL_ADDRESS,
    weth: exports.NULL_ADDRESS,
});
exports.LIQUIDITY_PROVIDER_REGISTRY = {};
exports.UNISWAPV1_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95',
}, exports.NULL_ADDRESS);
exports.UNISWAPV2_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xf164fc0ec4e93095b804a4795bbe1e041497b92a',
}, exports.NULL_ADDRESS);
exports.SUSHISWAP_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
    [contract_addresses_1.ChainId.BSC]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
}, exports.NULL_ADDRESS);
exports.CRYPTO_COM_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xceb90e4c17d626be0facd78b79c9c87d7ca181b3',
}, exports.NULL_ADDRESS);
exports.LINKSWAP_ROUTER_BY_CHAIN_ID = valueByChainId({ [contract_addresses_1.ChainId.Mainnet]: '0xa7ece0911fe8c60bff9e99f8fafcdbe56e07aff1' }, exports.NULL_ADDRESS);
exports.MSTABLE_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
}, exports.NULL_ADDRESS);
exports.OASIS_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x5e3e0548935a83ad29fb2a9153d331dc6d49020f',
}, exports.NULL_ADDRESS);
exports.MOONISWAP_REGISTRIES_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [
        '0x71CD6666064C3A1354a3B4dca5fA1E2D3ee7D303',
        '0xc4a8b7e29e3c8ec560cd4945c1cf3461a85a148d',
        '0xbaf9a5d4b0052359326a6cdab54babaa3a3a9643',
    ],
    [contract_addresses_1.ChainId.BSC]: ['0xd41b24bba51fac0e4827b6f94c0d6ddeb183cd64'],
}, []);
exports.DODO_CONFIG_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        helper: '0x533da777aedce766ceae696bf90f8541a4ba80eb',
        registry: '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950',
    },
}, { helper: exports.NULL_ADDRESS, registry: exports.NULL_ADDRESS });
exports.DODOV2_FACTORIES_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [
        '0x6b4fa0bc61eddc928e0df9c7f01e407bfcd3e5ef',
        '0x72d220ce168c4f361dd4dee5d826a01ad8598f6c',
    ],
    [contract_addresses_1.ChainId.BSC]: [
        '0xafe0a75dffb395eaabd0a7e1bbbd0b11f8609eef',
        '0x790b4a80fb1094589a3c0efc8740aa9b0c1733fb',
    ],
}, []);
exports.MAX_DODOV2_POOLS_QUERIED = 3;
exports.CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x7a6F6a048fE2Dc1397ABa0bf7879d3eacF371C53',
    [contract_addresses_1.ChainId.Ropsten]: '0xAa213dcDFbF104e08cbAeC3d1628eD197553AfCc',
}, exports.NULL_ADDRESS);
exports.MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xa2033d6ba88756ce6a87584d69dc87bda9a4f889',
    [contract_addresses_1.ChainId.Ropsten]: '0x87e0393aee0fb8c10b8653c6507c182264fe5a34',
}, exports.NULL_ADDRESS);
exports.BANCOR_REGISTRY_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4',
}, exports.NULL_ADDRESS);
exports.SHELL_POOLS_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        StableCoins: {
            poolAddress: '0x8f26d7bab7a73309141a291525c965ecdea7bf42',
            tokens: [exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.sUSD, exports.TOKENS.DAI],
        },
        Bitcoin: {
            poolAddress: '0xc2d019b901f8d4fdb2b9a65b5d226ad88c66ee8d',
            tokens: [exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
        },
    },
}, {
    StableCoins: {
        poolAddress: exports.NULL_ADDRESS,
        tokens: [],
    },
    Bitcoin: {
        poolAddress: exports.NULL_ADDRESS,
        tokens: [],
    },
});
exports.BALANCER_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer';
exports.BALANCER_TOP_POOLS_FETCHED = 250;
exports.BALANCER_MAX_POOLS_FETCHED = 3;
//
// BSC
//
exports.PANCAKESWAP_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.BSC]: '0x05ff2b0db69458a0750badebc4f9e13add608c7f',
}, exports.NULL_ADDRESS);
exports.BAKERYSWAP_ROUTER_BY_CHAIN_ID = valueByChainId({
    [contract_addresses_1.ChainId.BSC]: '0xcde540d7eafe93ac5fe6233bee57e1270d3e330f',
}, exports.NULL_ADDRESS);
/**
 * Calculated gross gas cost of the underlying exchange.
 * The cost of switching from one source to another, assuming
 * we are in the middle of a transaction.
 * I.e remove the overhead cost of ExchangeProxy (130k) and
 * the ethereum transaction cost (21k)
 */
// tslint:disable:custom-no-magic-numbers
exports.DEFAULT_GAS_SCHEDULE = {
    [types_1.ERC20BridgeSource.Native]: fillData => {
        // TODO jacob re-order imports so there is no circular rependency with SignedNativeOrder
        const nativeFillData = fillData;
        return nativeFillData && nativeFillData.type === protocol_utils_1.FillQuoteTransformerOrderType.Limit
            ? exports.PROTOCOL_FEE_MULTIPLIER.plus(100e3).toNumber()
            : // TODO jacob revisit wth v4 LimitOrders
                100e3;
    },
    [types_1.ERC20BridgeSource.Uniswap]: () => 90e3,
    [types_1.ERC20BridgeSource.LiquidityProvider]: fillData => {
        return fillData.gasCost;
    },
    [types_1.ERC20BridgeSource.Eth2Dai]: () => 400e3,
    [types_1.ERC20BridgeSource.Kyber]: () => 450e3,
    [types_1.ERC20BridgeSource.Curve]: fillData => {
        const poolAddress = fillData.pool.poolAddress.toLowerCase();
        switch (poolAddress) {
            case exports.CURVE_POOLS.curve_renBTC:
            case exports.CURVE_POOLS.curve_sBTC:
            case exports.CURVE_POOLS.curve_sUSD:
            case exports.CURVE_POOLS.curve_HBTC:
            case exports.CURVE_POOLS.curve_TRI:
                return 150e3;
            case exports.CURVE_POOLS.curve_USDN:
            case exports.CURVE_POOLS.curve_mUSD:
                return 300e3;
            case exports.CURVE_POOLS.curve_GUSD:
            case exports.CURVE_POOLS.curve_HUSD:
                return 310e3;
            case exports.CURVE_POOLS.curve_tBTC:
                return 370e3;
            case exports.CURVE_POOLS.curve_UST:
                return 500e3;
            case exports.CURVE_POOLS.curve_dUSD:
            case exports.CURVE_POOLS.curve_bBTC:
            case exports.CURVE_POOLS.curve_oBTC:
            case exports.CURVE_POOLS.curve_eurs:
                return 600e3;
            case exports.CURVE_POOLS.curve_compound:
                return 750e3;
            case exports.CURVE_POOLS.curve_aave:
                return 800e3;
            case exports.CURVE_POOLS.curve_PAX:
                return 850e3;
            // case POOLS.curve_seth:
            default:
                throw new Error(`Unrecognized Curve address: ${poolAddress}`);
        }
    },
    [types_1.ERC20BridgeSource.MultiBridge]: () => 350e3,
    [types_1.ERC20BridgeSource.UniswapV2]: (fillData) => {
        // TODO: Different base cost if to/from ETH.
        let gas = 90e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.SushiSwap]: (fillData) => {
        // TODO: Different base cost if to/from ETH.
        let gas = 90e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.CryptoCom]: (fillData) => {
        // TODO: Different base cost if to/from ETH.
        let gas = 90e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.Linkswap]: (fillData) => {
        // TODO: Different base cost if to/from ETH.
        let gas = 90e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.Balancer]: () => 120e3,
    [types_1.ERC20BridgeSource.Cream]: () => 120e3,
    [types_1.ERC20BridgeSource.MStable]: () => 700e3,
    [types_1.ERC20BridgeSource.Mooniswap]: () => 130e3,
    [types_1.ERC20BridgeSource.Swerve]: () => 150e3,
    [types_1.ERC20BridgeSource.Shell]: () => 170e3,
    [types_1.ERC20BridgeSource.MultiHop]: (fillData) => {
        const firstHop = fillData.firstHopSource;
        const secondHop = fillData.secondHopSource;
        const firstHopGas = exports.DEFAULT_GAS_SCHEDULE[firstHop.source](firstHop.fillData);
        const secondHopGas = exports.DEFAULT_GAS_SCHEDULE[secondHop.source](secondHop.fillData);
        return new utils_1.BigNumber(firstHopGas)
            .plus(secondHopGas)
            .plus(30e3)
            .toNumber();
    },
    [types_1.ERC20BridgeSource.Dodo]: (fillData) => {
        const isSellBase = fillData.isSellBase;
        // Sell base is cheaper as it is natively supported
        // sell quote requires additional calculation and overhead
        return isSellBase ? 180e3 : 300e3;
    },
    [types_1.ERC20BridgeSource.DodoV2]: (_fillData) => 100e3,
    [types_1.ERC20BridgeSource.SnowSwap]: fillData => {
        switch (fillData.pool.poolAddress.toLowerCase()) {
            case '0xbf7ccd6c446acfcc5df023043f2167b62e81899b':
                return 1000e3;
            case '0x4571753311e37ddb44faa8fb78a6df9a6e3c6c0b':
                return 1500e3;
            default:
                throw new Error('Unrecognized SnowSwap address');
        }
    },
    [types_1.ERC20BridgeSource.Bancor]: (fillData) => {
        let gas = 200e3;
        const path = fillData.path;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    //
    // BSC
    //
    [types_1.ERC20BridgeSource.PancakeSwap]: (fillData) => {
        // TODO: Different base cost if to/from ETH.
        let gas = 90e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.BakerySwap]: (fillData) => {
        // TODO: Different base cost if to/from ETH.
        let gas = 90e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
};
exports.DEFAULT_FEE_SCHEDULE = Object.assign({}, exports.DEFAULT_GAS_SCHEDULE);
exports.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS = new utils_1.BigNumber(20000);
// tslint:enable:custom-no-magic-numbers
exports.DEFAULT_GET_MARKET_ORDERS_OPTS = {
    // tslint:disable-next-line: custom-no-magic-numbers
    runLimit: Math.pow(2, 15),
    excludedSources: [],
    excludedFeeSources: [],
    includedSources: [],
    bridgeSlippage: 0.005,
    maxFallbackSlippage: 0.05,
    numSamples: 13,
    sampleDistributionBase: 1.05,
    feeSchedule: exports.DEFAULT_FEE_SCHEDULE,
    gasSchedule: exports.DEFAULT_GAS_SCHEDULE,
    exchangeProxyOverhead: () => exports.ZERO_AMOUNT,
    allowFallback: true,
    shouldGenerateQuoteReport: false,
    tokenAdjacencyGraph: { default: [] },
};
//# sourceMappingURL=constants_BACKUP_37624.js.map