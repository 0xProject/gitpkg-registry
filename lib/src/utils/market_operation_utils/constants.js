"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const source_filters_1 = require("./source_filters");
const types_1 = require("./types");
// tslint:disable: custom-no-magic-numbers
/**
 * Valid sources for market sell.
 */
exports.SELL_SOURCE_FILTER = new source_filters_1.SourceFilters([
    types_1.ERC20BridgeSource.Native,
    types_1.ERC20BridgeSource.Uniswap,
    types_1.ERC20BridgeSource.UniswapV2,
    types_1.ERC20BridgeSource.Eth2Dai,
    types_1.ERC20BridgeSource.Kyber,
    types_1.ERC20BridgeSource.Curve,
    types_1.ERC20BridgeSource.Balancer,
    // Bancor is sampled off-chain, but this list should only include on-chain sources (used in ERC20BridgeSampler)
    // ERC20BridgeSource.Bancor,
    types_1.ERC20BridgeSource.MStable,
    types_1.ERC20BridgeSource.Mooniswap,
    types_1.ERC20BridgeSource.Swerve,
    types_1.ERC20BridgeSource.SushiSwap,
    types_1.ERC20BridgeSource.MultiHop,
]);
/**
 * Valid sources for market buy.
 */
exports.BUY_SOURCE_FILTER = new source_filters_1.SourceFilters([
    types_1.ERC20BridgeSource.Native,
    types_1.ERC20BridgeSource.Uniswap,
    types_1.ERC20BridgeSource.UniswapV2,
    types_1.ERC20BridgeSource.Eth2Dai,
    types_1.ERC20BridgeSource.Kyber,
    types_1.ERC20BridgeSource.Curve,
    types_1.ERC20BridgeSource.Balancer,
    // ERC20BridgeSource.Bancor, // FIXME: Disabled until Bancor SDK supports buy quotes
    types_1.ERC20BridgeSource.MStable,
    types_1.ERC20BridgeSource.Mooniswap,
    types_1.ERC20BridgeSource.Swerve,
    types_1.ERC20BridgeSource.SushiSwap,
    types_1.ERC20BridgeSource.MultiHop,
], [types_1.ERC20BridgeSource.MultiBridge]);
exports.DEFAULT_GET_MARKET_ORDERS_OPTS = {
    // tslint:disable-next-line: custom-no-magic-numbers
    runLimit: Math.pow(2, 15),
    excludedSources: [],
    includedSources: [],
    bridgeSlippage: 0.005,
    maxFallbackSlippage: 0.05,
    numSamples: 13,
    sampleDistributionBase: 1.05,
    feeSchedule: {},
    gasSchedule: {},
    allowFallback: true,
    shouldBatchBridgeOrders: true,
    shouldGenerateQuoteReport: false,
};
/**
 * Sources to poll for ETH fee price estimates.
 */
exports.FEE_QUOTE_SOURCES = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2];
/**
 * Mainnet Curve configuration
 */
exports.MAINNET_CURVE_INFOS = {
    DaiUsdc: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56',
        tokens: ['0x6b175474e89094c44da98b954eedeac495271d0f', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'],
    },
    // DaiUsdcUsdt: {
    //     exchangeFunctionSelector: CurveFunctionSelectors.exchange_underlying,
    //     sellQuoteFunctionSelector: CurveFunctionSelectors.get_dy_underlying,
    //     buyQuoteFunctionSelector: CurveFunctionSelectors.get_dx_underlying,
    //     poolAddress: '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c',
    //     tokens: [
    //         '0x6b175474e89094c44da98b954eedeac495271d0f',
    //         '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    //         '0xdac17f958d2ee523a2206206994597c13d831ec7',
    //     ],
    // },
    DaiUsdcUsdtTusd: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51',
        tokens: [
            '0x6b175474e89094c44da98b954eedeac495271d0f',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            '0xdac17f958d2ee523a2206206994597c13d831ec7',
            '0x0000000000085d4780b73119b644ae5ecd22b376',
        ],
    },
    // Looks like it's dying.
    DaiUsdcUsdtBusd: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27',
        tokens: [
            '0x6b175474e89094c44da98b954eedeac495271d0f',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            '0xdac17f958d2ee523a2206206994597c13d831ec7',
            '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        ],
    },
    DaiUsdcUsdtSusd: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0xa5407eae9ba41422680e2e00537571bcc53efbfd',
        tokens: [
            '0x6b175474e89094c44da98b954eedeac495271d0f',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            '0xdac17f958d2ee523a2206206994597c13d831ec7',
            '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
        ],
    },
    RenbtcWbtc: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0x93054188d876f558f4a66b2ef1d97d16edf0895b',
        tokens: ['0xeb4c2781e4eba804ce9a9803c67d0893436bb27d', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'],
    },
    RenbtcWbtcSbtc: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0x7fc77b5c7614e1533320ea6ddc2eb61fa00a9714',
        tokens: [
            '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
            '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
            '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
        ],
    },
    TriPool: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
        tokens: [
            '0x6b175474e89094c44da98b954eedeac495271d0f',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            '0xdac17f958d2ee523a2206206994597c13d831ec7',
        ],
    },
};
exports.MAINNET_SWERVE_INFOS = {
    swUSD: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0x329239599afB305DA0A2eC69c58F8a6697F9F88d',
        tokens: [
            '0x6b175474e89094c44da98b954eedeac495271d0f',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            '0xdac17f958d2ee523a2206206994597c13d831ec7',
            '0x0000000000085d4780b73119b644ae5ecd22b376',
        ],
    },
};
exports.MAINNET_KYBER_RESERVE_IDS = {
    Reserve1: '0xff4b796265722046707200000000000000000000000000000000000000000000',
    Reserve2: '0xffabcd0000000000000000000000000000000000000000000000000000000000',
    Reserve3: '0xff4f6e65426974205175616e7400000000000000000000000000000000000000',
};
exports.MAINNET_KYBER_TOKEN_RESERVE_IDS = {
    // USDC
    ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48']: '0xaa55534443303041505200000000000000000000000000000000000000000000',
    // AMPL
    ['0xd46ba6d942050d489dbd938a2c909a5d5039a161']: '0xaad46ba6d942050d489dbd938a2c909a5d5039a1610000000000000000000000',
    // UBT
    ['0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e']: '0xaa55425400000000000000000000000000000000000000000000000000000000',
    // ANT
    ['0x960b236a07cf122663c4303350609a66a7b288c0']: '0xaa414e5400000000000000000000000000000000000000000000000000000000',
    // KNC
    ['0xdd974d5c2e2928dea5f71b9825b8b646686bd200']: '0xaa4b4e435f4d4547414c41444f4e000000000000000000000000000000000000',
    // sUSD
    ['0x57ab1ec28d129707052df4df418d58a2d46d5f51']: '0xaa73555344000000000000000000000000000000000000000000000000000000',
    // SNX
    ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f']: '0xaa534e5800000000000000000000000000000000000000000000000000000000',
    // REN
    ['0x408e41876cccdc0f92210600ef50372656052a38']: '0xaa72656e00000000000000000000000000000000000000000000000000000000',
    // BAND
    ['0xba11d00c5f74255f56a5e366f4f77f5a186d7f55']: '0xaa42414e44000000000000000000000000000000000000000000000000000000',
};
exports.MAINNET_SUSHI_SWAP_ROUTER = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F';
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
//# sourceMappingURL=constants.js.map