"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GET_MARKET_ORDERS_OPTS = exports.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS = exports.NATIVE_FEE_TOKEN_BY_CHAIN_ID = exports.DEFAULT_TOKEN_ADJACENCY_GRAPH_BY_CHAIN_ID = exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID = exports.OPTIMISM_TOKENS = exports.GEIST_FANTOM_POOLS = exports.FANTOM_TOKENS = exports.CELO_TOKENS = exports.AVALANCHE_TOKENS = exports.POLYGON_TOKENS = exports.BSC_TOKENS = exports.MAINNET_TOKENS = exports.VIP_ERC20_BRIDGE_SOURCES_BY_CHAIN_ID = exports.SOURCE_FLAGS = exports.FEE_QUOTE_SOURCES_BY_CHAIN_ID = exports.PROTOCOL_FEE_MULTIPLIER = exports.BUY_SOURCE_FILTER_BY_CHAIN_ID = exports.SELL_SOURCE_FILTER_BY_CHAIN_ID = exports.COMPARISON_PRICE_DECIMALS = exports.NULL_ADDRESS = exports.NULL_BYTES = exports.ONE_SECOND_MS = exports.ONE_HOUR_IN_SECONDS = exports.MAX_UINT256 = exports.ZERO_AMOUNT = exports.POSITIVE_INF = exports.NEGATIVE_INF = exports.ONE_ETHER = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const token_adjacency_graph_builder_1 = require("../token_adjacency_graph_builder");
const utils_2 = require("../utils");
const source_filters_1 = require("./source_filters");
const types_1 = require("./types");
// tslint:disable: custom-no-magic-numbers no-bitwise
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
/**
 * Valid sources for market sell.
 */
exports.SELL_SOURCE_FILTER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Balancer,
        types_1.ERC20BridgeSource.BalancerV2,
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
        types_1.ERC20BridgeSource.Lido,
        types_1.ERC20BridgeSource.MakerPsm,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.Component,
        types_1.ERC20BridgeSource.Saddle,
        types_1.ERC20BridgeSource.XSigma,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.ShibaSwap,
        types_1.ERC20BridgeSource.Synapse,
        // TODO: enable after FQT has been redeployed on Ethereum mainnet
        // ERC20BridgeSource.AaveV2,
        // ERC20BridgeSource.Compound,
    ]),
    [contract_addresses_1.ChainId.Ropsten]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Mooniswap,
    ]),
    [contract_addresses_1.ChainId.Rinkeby]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Kovan]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Ganache]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.BSC]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.BakerySwap,
        types_1.ERC20BridgeSource.Belt,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Ellipsis,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Nerve,
        types_1.ERC20BridgeSource.Synapse,
        types_1.ERC20BridgeSource.PancakeSwap,
        types_1.ERC20BridgeSource.PancakeSwapV2,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.CafeSwap,
        types_1.ERC20BridgeSource.CheeseSwap,
        types_1.ERC20BridgeSource.JulSwap,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.ACryptos,
        types_1.ERC20BridgeSource.KyberDmm,
    ]),
    [contract_addresses_1.ChainId.Polygon]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.QuickSwap,
        types_1.ERC20BridgeSource.ComethSwap,
        types_1.ERC20BridgeSource.Dfyn,
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.Polydex,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.BalancerV2,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.IronSwap,
        types_1.ERC20BridgeSource.AaveV2,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Synapse,
    ]),
    [contract_addresses_1.ChainId.Avalanche]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Pangolin,
        types_1.ERC20BridgeSource.TraderJoe,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.AaveV2,
        types_1.ERC20BridgeSource.Synapse,
    ]),
    [contract_addresses_1.ChainId.Fantom]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Beethovenx,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.Geist,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.MorpheusSwap,
        types_1.ERC20BridgeSource.SpiritSwap,
        types_1.ERC20BridgeSource.SpookySwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Synapse,
    ]),
    [contract_addresses_1.ChainId.Celo]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.UbeSwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.MobiusMoney,
    ]),
    [contract_addresses_1.ChainId.Optimism]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Synapse,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.MultiHop,
    ]),
}, new source_filters_1.SourceFilters([]));
/**
 * Valid sources for market buy.
 */
exports.BUY_SOURCE_FILTER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Balancer,
        types_1.ERC20BridgeSource.BalancerV2,
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
        types_1.ERC20BridgeSource.Lido,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.CryptoCom,
        types_1.ERC20BridgeSource.Linkswap,
        types_1.ERC20BridgeSource.MakerPsm,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.Component,
        types_1.ERC20BridgeSource.Saddle,
        types_1.ERC20BridgeSource.XSigma,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.ShibaSwap,
        types_1.ERC20BridgeSource.Synapse,
        // TODO: enable after FQT has been redeployed on Ethereum mainnet
        // ERC20BridgeSource.AaveV2,
        // ERC20BridgeSource.Compound,
    ]),
    [contract_addresses_1.ChainId.Ropsten]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Mooniswap,
    ]),
    [contract_addresses_1.ChainId.Rinkeby]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Kovan]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Ganache]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.BSC]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.BakerySwap,
        types_1.ERC20BridgeSource.Belt,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Ellipsis,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Nerve,
        types_1.ERC20BridgeSource.Synapse,
        types_1.ERC20BridgeSource.PancakeSwap,
        types_1.ERC20BridgeSource.PancakeSwapV2,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.CafeSwap,
        types_1.ERC20BridgeSource.CheeseSwap,
        types_1.ERC20BridgeSource.JulSwap,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.ACryptos,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.Synapse,
    ]),
    [contract_addresses_1.ChainId.Polygon]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.QuickSwap,
        types_1.ERC20BridgeSource.ComethSwap,
        types_1.ERC20BridgeSource.Dfyn,
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.Polydex,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.BalancerV2,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.IronSwap,
        types_1.ERC20BridgeSource.AaveV2,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Synapse,
    ]),
    [contract_addresses_1.ChainId.Avalanche]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Pangolin,
        types_1.ERC20BridgeSource.TraderJoe,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.AaveV2,
        types_1.ERC20BridgeSource.Synapse,
    ]),
    [contract_addresses_1.ChainId.Fantom]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Beethovenx,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.Geist,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.MorpheusSwap,
        types_1.ERC20BridgeSource.SpiritSwap,
        types_1.ERC20BridgeSource.SpookySwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Synapse,
    ]),
    [contract_addresses_1.ChainId.Celo]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.UbeSwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.MobiusMoney,
    ]),
    [contract_addresses_1.ChainId.Optimism]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Synapse,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.MultiHop,
    ]),
}, new source_filters_1.SourceFilters([]));
/**
 *  0x Protocol Fee Multiplier
 */
exports.PROTOCOL_FEE_MULTIPLIER = new utils_1.BigNumber(0);
/**
 * Sources to poll for ETH fee price estimates.
 */
exports.FEE_QUOTE_SOURCES_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [types_1.ERC20BridgeSource.UniswapV2, types_1.ERC20BridgeSource.SushiSwap, types_1.ERC20BridgeSource.UniswapV3],
    [contract_addresses_1.ChainId.BSC]: [types_1.ERC20BridgeSource.PancakeSwap, types_1.ERC20BridgeSource.Mooniswap, types_1.ERC20BridgeSource.SushiSwap],
    [contract_addresses_1.ChainId.Ropsten]: [types_1.ERC20BridgeSource.UniswapV2, types_1.ERC20BridgeSource.SushiSwap],
    [contract_addresses_1.ChainId.Polygon]: [types_1.ERC20BridgeSource.QuickSwap, types_1.ERC20BridgeSource.SushiSwap, types_1.ERC20BridgeSource.UniswapV3],
    [contract_addresses_1.ChainId.Avalanche]: [types_1.ERC20BridgeSource.Pangolin, types_1.ERC20BridgeSource.TraderJoe, types_1.ERC20BridgeSource.SushiSwap],
    [contract_addresses_1.ChainId.Fantom]: [types_1.ERC20BridgeSource.SpiritSwap, types_1.ERC20BridgeSource.SpookySwap, types_1.ERC20BridgeSource.SushiSwap],
    [contract_addresses_1.ChainId.Celo]: [types_1.ERC20BridgeSource.UbeSwap, types_1.ERC20BridgeSource.SushiSwap],
    [contract_addresses_1.ChainId.Optimism]: [types_1.ERC20BridgeSource.UniswapV3],
}, []);
// HACK(mzhu25): Limit and RFQ orders need to be treated as different sources
//               when computing the exchange proxy gas overhead.
exports.SOURCE_FLAGS = Object.assign({}, ...['RfqOrder', 'LimitOrder', ...Object.values(types_1.ERC20BridgeSource)].map((source, index) => ({
    [source]: source === types_1.ERC20BridgeSource.Native ? BigInt(0) : BigInt(1) << BigInt(index),
})));
exports.VIP_ERC20_BRIDGE_SOURCES_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [types_1.ERC20BridgeSource.UniswapV2, types_1.ERC20BridgeSource.SushiSwap, types_1.ERC20BridgeSource.UniswapV3],
    [contract_addresses_1.ChainId.BSC]: [
        types_1.ERC20BridgeSource.PancakeSwap,
        types_1.ERC20BridgeSource.PancakeSwapV2,
        types_1.ERC20BridgeSource.BakerySwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.CafeSwap,
        types_1.ERC20BridgeSource.CheeseSwap,
        types_1.ERC20BridgeSource.JulSwap,
    ],
}, []);
// Mainnet tokens
// Not an exhaustive list, just enough so we don't repeat ourselves
exports.MAINNET_TOKENS = {
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    UST: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
    MIR: '0x09a3ecafa817268f77be1283176b946c4ff2e608',
    // StableSwap "open pools" (crv.finance)
    STABLEx: '0xcd91538b91b4ba7797d39a2f66e63810b50a33d0',
    alUSD: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
    // Frax ecosystem
    FRAX: '0x853d955acef822db058eb8505911ed77f175b99e',
    FXS: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
    OHM: '0x383518188c0c6d7730d91b2c03a03c837814a899',
    OHMV2: '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5',
    BTRFLY: '0xc0d4ceb216b3ba9c3701b291766fdcba977cec3a',
    //
    LUSD: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
    // Fei Ecosystem
    FEI: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
    TRIBE: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
    //
    DSU: '0x605d26fbd5be761089281d5cec2ce86eea667109',
    ESS: '0x24ae124c4cc33d6791f8e8b63520ed7107ac8b3e',
    cvxCRV: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7',
    CRV: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    MIM: '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
    EURT: '0xc581b735a1688071a1746c968e0798d642ede491',
    // Synapse ecosystem
    nUSD: '0x1b84765de8b7566e4ceaf4d0fd3c5af52d3dde4f',
    CVX: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
    UST_WORMHOLE: '0xa693b19d2931d498c5b318df961919bb4aee87a5',
    RAI: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
    DOLA: '0x865377367054516e17014ccded1e7d814edc9ce4',
    OUSD: '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86',
    agEUR: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8',
    ibEUR: '0x96e61422b6a9ba0e068b6c5add4ffabc6a4aae27',
    YFI: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
};
exports.BSC_TOKENS = {
    WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    USDT: '0x55d398326f99059ff775485246999027b3197955',
    USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    DAI: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    UST: '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
    WEX: '0xa9c41a46a6b3531d28d5c32f6633dd2ff05dfb90',
    WETH: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
};
exports.POLYGON_TOKENS = {
    DAI: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    WBTC: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    WMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    nUSD: '0xb6c473756050de474286bed418b77aeac39b02af',
};
exports.AVALANCHE_TOKENS = {
    WAVAX: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    WETH: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
    WBTC: '0x50b7545627a5162f82a992c33b87adc75187b218',
    // bridged USDC
    USDC: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    // native USDC on Avalanche
    nUSDC: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    USDT: '0xc7198437980c041c805a1edcba50c1ce5db95118',
    aDAI: '0x47afa96cdc9fab46904a55a6ad4bf6660b53c38a',
    aUSDC: '0x46a51127c3ce23fb7ab1de06226147f446e4a857',
    aUSDT: '0x532e6537fea298397212f09a61e03311686f548e',
    nETH: '0x19e1ae0ee35c0404f835521146206595d37981ae',
    nUSD: '0xcfc37a6ab183dd4aed08c204d1c2773c0b1bdf46',
    aWETH: '0x53f7c5869a859f0aec3d334ee8b4cf01e3492f21',
    MIM: '0x130966628846bfd36ff31a822705796e8cb8c18d',
    DAI: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
};
exports.CELO_TOKENS = {
    WCELO: '0x471ece3750da237f93b8e339c536989b8978a438',
    // Some of these tokens are Optics bridge? tokens which
    // had an issue and migrated from v1 to v2
    WETHv1: '0xe919f65739c26a42616b7b8eedc6b5524d1e3ac4',
    oWETH: '0x122013fd7df1c6f636a5bb8f03108e876548b455',
    WBTC: '0xbaab46e28388d2779e6e31fd00cf0e5ad95e327b',
    cUSD: '0x765de816845861e75a25fca122bb6898b8b1282a',
    // ??
    cBTC: '0xd629eb00deced2a080b7ec630ef6ac117e614f1b',
    cETH: '0x2def4285787d58a2f811af24755a8150622f4361',
    UBE: '0x00be915b9dcf56a3cbe739d9b9c202ca692409ec',
    // Moolah
    mCELO: '0x7d00cd74ff385c955ea3d79e47bf06bd7386387d',
    mCUSD: '0x918146359264c492bd6934071c6bd31c854edbc3',
    mCEUR: '0xe273ad7ee11dcfaa87383ad5977ee1504ac07568',
    amCUSD: '0x64defa3544c695db8c535d289d843a189aa26b98',
    MOO: '0x17700282592d6917f6a73d0bf8accf4d578c131e',
    //
    wBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    wETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wBTCO: '0xbe50a3013a1c94768a1abb78c3cb79ab28fc1ace',
    pUSDC: '0xcc82628f6a8defa1e2b0ad7ed448bef3647f7941',
    cUSDC: '0x2a3684e9dc20b857375ea04235f2f7edbe818fa7',
    cUSDC_V2: '0xef4229c8c3250c675f21bcefa42f58efbff6002a',
    pUSDC_V2: '0x1bfc26ce035c368503fae319cc2596716428ca44',
    pUSD: '0xeadf4a7168a82d30ba0619e64d5bcf5b30b45226',
    pCELO: '0x301a61d01a63c8d670c2b8a43f37d12ef181f997',
    aaUSDC: '0xb70e0a782b058bfdb0d109a3599bec1f19328e36',
    asUSDC: '0xcd7d7ff64746c1909e44db8e95331f9316478817',
    mcUSDT: '0xcfffe0c89a779c09df3df5624f54cdf7ef5fdd5d',
    mcUSDC: '0x93db49be12b864019da9cb147ba75cdc0506190e',
    DAI: '0x90ca507a5d4458a4c6c6249d186b6dcb02a5bccd',
};
exports.FANTOM_TOKENS = {
    WFTM: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    WETH: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
    USDC: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    DAI: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    fUSDT: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    WBTC: '0x321162cd933e2be498cd2267a90534a804051b11',
    WCRV: '0x1e4f97b9f9f913c46f1632781732927b9019c68b',
    renBTC: '0xdbf31df14b66535af65aac99c32e9ea844e14501',
    MIM: '0x82f0b8b456c1a451378467398982d4834b6829c1',
    nUSD: '0xed2a7edd7413021d440b09d654f3b87712abab66',
    nETH: '0x67c10c397dd0ba417329543c1a40eb48aaa7cd00',
    gfUSDT: '0x940f41f0ec9ba1a34cf001cc03347ac092f5f6b5',
    gUSDC: '0xe578c856933d8e1082740bf7661e379aa2a30b26',
    gDAI: '0x07e6332dd090d287d3489245038daf987955dcfb',
    FRAX: '0xdc301622e621166bd8e82f2ca0a26c13ad0be355',
    gFTM: '0x39b3bd37208cbade74d0fcbdbb12d606295b430a',
    gETH: '0x25c130b2624cf12a4ea30143ef50c5d68cefa22f',
    gWBTC: '0x38aca5484b8603373acc6961ecd57a6a594510a3',
    gCRV: '0x690754a168b022331caa2467207c61919b3f8a98',
    gMIM: '0xc664fc7b8487a3e10824cda768c1d239f2403bbe',
};
exports.GEIST_FANTOM_POOLS = {
    lendingPool: '0x9fad24f572045c7869117160a571b2e50b10d068',
};
exports.OPTIMISM_TOKENS = {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    USDT: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    WBTC: '0x68f180fcce6836688e9084f035309e29bf0a2095',
    nETH: '0x809dc529f07651bd43a172e8db6f4a7a0d771036',
    sWETH: '0x121ab82b49b2bc4c7901ca46b8277962b4350204',
};
exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [
        exports.MAINNET_TOKENS.WETH,
        exports.MAINNET_TOKENS.USDT,
        exports.MAINNET_TOKENS.DAI,
        exports.MAINNET_TOKENS.USDC,
        exports.MAINNET_TOKENS.WBTC,
    ],
    [contract_addresses_1.ChainId.BSC]: [
        exports.BSC_TOKENS.WBNB,
        exports.BSC_TOKENS.BUSD,
        exports.BSC_TOKENS.DAI,
        exports.BSC_TOKENS.USDC,
        exports.BSC_TOKENS.WETH,
        exports.BSC_TOKENS.USDT,
        exports.BSC_TOKENS.WEX,
    ],
    [contract_addresses_1.ChainId.Ropsten]: [
        contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Ropsten).etherToken,
        '0xad6d458402f60fd3bd25163575031acdce07538d',
        '0x07865c6e87b9f70255377e024ace6630c1eaa37f', // USDC
    ],
    [contract_addresses_1.ChainId.Polygon]: [
        exports.POLYGON_TOKENS.WMATIC,
        exports.POLYGON_TOKENS.WETH,
        exports.POLYGON_TOKENS.USDC,
        exports.POLYGON_TOKENS.DAI,
        exports.POLYGON_TOKENS.USDT,
        exports.POLYGON_TOKENS.WBTC,
        exports.POLYGON_TOKENS.nUSD,
    ],
    [contract_addresses_1.ChainId.Avalanche]: [
        exports.AVALANCHE_TOKENS.WAVAX,
        exports.AVALANCHE_TOKENS.WETH,
        exports.AVALANCHE_TOKENS.DAI,
        exports.AVALANCHE_TOKENS.USDT,
        exports.AVALANCHE_TOKENS.USDC,
        exports.AVALANCHE_TOKENS.nUSD,
        exports.AVALANCHE_TOKENS.nETH,
        exports.AVALANCHE_TOKENS.aWETH,
    ],
    [contract_addresses_1.ChainId.Fantom]: [
        exports.FANTOM_TOKENS.WFTM,
        exports.FANTOM_TOKENS.WETH,
        exports.FANTOM_TOKENS.DAI,
        exports.FANTOM_TOKENS.USDC,
        exports.FANTOM_TOKENS.nUSD,
        exports.FANTOM_TOKENS.nETH,
        exports.FANTOM_TOKENS.MIM,
    ],
    [contract_addresses_1.ChainId.Celo]: [
        exports.CELO_TOKENS.WCELO,
        exports.CELO_TOKENS.mCUSD,
        exports.CELO_TOKENS.WETHv1,
        exports.CELO_TOKENS.amCUSD,
        exports.CELO_TOKENS.WBTC,
    ],
    [contract_addresses_1.ChainId.Optimism]: [
        exports.OPTIMISM_TOKENS.WETH,
        exports.OPTIMISM_TOKENS.DAI,
        exports.OPTIMISM_TOKENS.USDC,
        exports.OPTIMISM_TOKENS.USDT,
        exports.OPTIMISM_TOKENS.nETH,
        exports.OPTIMISM_TOKENS.sWETH,
    ],
}, []);
// Note be careful here as a UNION is performed when finding intermediary tokens
// attaching to a default intermediary token (stables or ETH etc) can have a large impact
exports.DEFAULT_TOKEN_ADJACENCY_GRAPH_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet],
    })
        .tap(builder => {
        // Mirror Protocol
        builder.add(exports.MAINNET_TOKENS.MIR, exports.MAINNET_TOKENS.UST);
        // Convex and Curve
        builder.add(exports.MAINNET_TOKENS.cvxCRV, exports.MAINNET_TOKENS.CRV).add(exports.MAINNET_TOKENS.CRV, exports.MAINNET_TOKENS.cvxCRV);
        // FEI TRIBE liquid in UniV2
        builder.add(exports.MAINNET_TOKENS.FEI, exports.MAINNET_TOKENS.TRIBE).add(exports.MAINNET_TOKENS.TRIBE, exports.MAINNET_TOKENS.FEI);
        // FRAX ecosystem
        builder.add(exports.MAINNET_TOKENS.FRAX, exports.MAINNET_TOKENS.FXS).add(exports.MAINNET_TOKENS.FXS, exports.MAINNET_TOKENS.FRAX);
        builder.add(exports.MAINNET_TOKENS.FRAX, exports.MAINNET_TOKENS.OHM).add(exports.MAINNET_TOKENS.OHM, exports.MAINNET_TOKENS.FRAX);
        // REDACTED CARTEL
        builder
            .add(exports.MAINNET_TOKENS.OHMV2, exports.MAINNET_TOKENS.BTRFLY)
            .add(exports.MAINNET_TOKENS.BTRFLY, exports.MAINNET_TOKENS.OHMV2);
    })
        // Build
        .build(),
    [contract_addresses_1.ChainId.BSC]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.BSC],
    }).build(),
    [contract_addresses_1.ChainId.Polygon]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.Polygon],
    }).build(),
    [contract_addresses_1.ChainId.Avalanche]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.Avalanche],
    })
        .tap(builder => {
        // Synape nETH/aWETH pool
        builder
            .add(exports.AVALANCHE_TOKENS.aWETH, exports.AVALANCHE_TOKENS.nETH)
            .add(exports.AVALANCHE_TOKENS.nETH, exports.AVALANCHE_TOKENS.aWETH);
    })
        .build(),
    [contract_addresses_1.ChainId.Fantom]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.Fantom],
    }).build(),
    [contract_addresses_1.ChainId.Celo]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.Celo],
    }).build(),
    [contract_addresses_1.ChainId.Optimism]: new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({
        default: exports.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID[contract_addresses_1.ChainId.Optimism],
    }).build(),
}, new token_adjacency_graph_builder_1.TokenAdjacencyGraphBuilder({ default: [] }).build());
exports.NATIVE_FEE_TOKEN_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Mainnet).etherToken,
    [contract_addresses_1.ChainId.BSC]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.BSC).etherToken,
    [contract_addresses_1.ChainId.Ganache]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Ganache).etherToken,
    [contract_addresses_1.ChainId.Ropsten]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Ropsten).etherToken,
    [contract_addresses_1.ChainId.Rinkeby]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Rinkeby).etherToken,
    [contract_addresses_1.ChainId.Kovan]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Kovan).etherToken,
    [contract_addresses_1.ChainId.Polygon]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Polygon).etherToken,
    [contract_addresses_1.ChainId.Avalanche]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Avalanche).etherToken,
    [contract_addresses_1.ChainId.Fantom]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Fantom).etherToken,
    [contract_addresses_1.ChainId.Celo]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Celo).etherToken,
    [contract_addresses_1.ChainId.Optimism]: contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Optimism).etherToken,
}, exports.NULL_ADDRESS);
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
    exchangeProxyOverhead: () => exports.ZERO_AMOUNT,
    allowFallback: true,
    shouldGenerateQuoteReport: true,
    shouldIncludePriceComparisonsReport: false,
    tokenAdjacencyGraph: { default: [] },
    neonRouterNumSamples: 14,
};
//# sourceMappingURL=constants.js.map