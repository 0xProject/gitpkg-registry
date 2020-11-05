"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const source_filters_1 = require("./source_filters");
const types_1 = require("./types");
// tslint:disable: custom-no-magic-numbers no-bitwise
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
    types_1.ERC20BridgeSource.SnowSwap,
    types_1.ERC20BridgeSource.SushiSwap,
    types_1.ERC20BridgeSource.Shell,
    types_1.ERC20BridgeSource.MultiHop,
    types_1.ERC20BridgeSource.Dodo,
    types_1.ERC20BridgeSource.Cream,
], [types_1.ERC20BridgeSource.MultiBridge]);
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
    types_1.ERC20BridgeSource.Shell,
    types_1.ERC20BridgeSource.Swerve,
    types_1.ERC20BridgeSource.SnowSwap,
    types_1.ERC20BridgeSource.SushiSwap,
    types_1.ERC20BridgeSource.MultiHop,
    types_1.ERC20BridgeSource.Dodo,
    types_1.ERC20BridgeSource.Cream,
], [types_1.ERC20BridgeSource.MultiBridge]);
/**
 *  0x Protocol Fee Multiplier
 */
exports.PROTOCOL_FEE_MULTIPLIER = new utils_1.BigNumber(70000);
/**
 * Sources to poll for ETH fee price estimates.
 */
exports.FEE_QUOTE_SOURCES = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2];
exports.SOURCE_FLAGS = Object.assign({}, ...Object.values(types_1.ERC20BridgeSource).map((source, index) => ({ [source]: 1 << index })));
// Mainnet tokens
// Not an exhaustive list, just enough so we don't repeat ourselves
exports.TOKENS = {
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    // Stable Coins
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    sUSD: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    TUSD: '0x0000000000085d4780b73119b644ae5ecd22b376',
    // Bitcoins
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    RenBTC: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
    sBTC: '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
    // Other
    MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
};
/**
 * Mainnet Curve configuration
 * The tokens are in order of their index, which each curve defines
 * I.e DaiUsdc curve has DAI as index 0 and USDC as index 1
 */
exports.MAINNET_CURVE_INFOS = {
    DaiUsdc: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56',
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC],
    },
    // DaiUsdcUsdt: {
    //     exchangeFunctionSelector: CurveFunctionSelectors.exchange_underlying,
    //     sellQuoteFunctionSelector: CurveFunctionSelectors.get_dy_underlying,
    //     buyQuoteFunctionSelector: CurveFunctionSelectors.get_dx_underlying,
    //     poolAddress: '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c',
    //     tokens: [
    //         TOKENS.DAI,
    //         TOKENS.USDC,
    //         TOKENS.USDT,
    //     ],
    // },
    DaiUsdcUsdtTusd: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51',
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.TUSD],
    },
    // Looks like it's dying.
    DaiUsdcUsdtBusd: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dx_underlying,
        poolAddress: '0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27',
        tokens: [
            exports.TOKENS.DAI,
            exports.TOKENS.USDC,
            exports.TOKENS.USDT,
            '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        ],
    },
    DaiUsdcUsdtSusd: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange_underlying,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy_underlying,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0xa5407eae9ba41422680e2e00537571bcc53efbfd',
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.sUSD],
    },
    RenbtcWbtc: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0x93054188d876f558f4a66b2ef1d97d16edf0895b',
        tokens: [exports.TOKENS.RenBTC, exports.TOKENS.WBTC],
    },
    RenbtcWbtcSbtc: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0x7fc77b5c7614e1533320ea6ddc2eb61fa00a9714',
        tokens: [exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
    },
    TriPool: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT],
    },
};
exports.MAINNET_SWERVE_INFOS = {
    swUSD: {
        exchangeFunctionSelector: types_1.CurveFunctionSelectors.exchange,
        sellQuoteFunctionSelector: types_1.CurveFunctionSelectors.get_dy,
        buyQuoteFunctionSelector: types_1.CurveFunctionSelectors.None,
        poolAddress: '0x329239599afb305da0a2ec69c58f8a6697f9f88d',
        tokens: [exports.TOKENS.DAI, exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.TUSD],
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
    },
};
exports.MAINNET_KYBER_RESERVE_IDS = {
    Reserve1: '0xff4b796265722046707200000000000000000000000000000000000000000000',
    Reserve2: '0xffabcd0000000000000000000000000000000000000000000000000000000000',
    Reserve3: '0xff4f6e65426974205175616e7400000000000000000000000000000000000000',
};
exports.MAINNET_KYBER_TOKEN_RESERVE_IDS = {
    // USDC
    [exports.TOKENS.USDC]: '0xaa55534443303041505200000000000000000000000000000000000000000000',
    // AMPL
    ['0xd46ba6d942050d489dbd938a2c909a5d5039a161']: '0xaad46ba6d942050d489dbd938a2c909a5d5039a1610000000000000000000000',
    // UBT
    ['0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e']: '0xaa55425400000000000000000000000000000000000000000000000000000000',
    // ANT
    ['0x960b236a07cf122663c4303350609a66a7b288c0']: '0xaa414e5400000000000000000000000000000000000000000000000000000000',
    // KNC
    ['0xdd974d5c2e2928dea5f71b9825b8b646686bd200']: '0xaa4b4e435f4d4547414c41444f4e000000000000000000000000000000000000',
    // sUSD
    [exports.TOKENS.sUSD]: '0xaa73555344000000000000000000000000000000000000000000000000000000',
    // SNX
    ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f']: '0xaa534e5800000000000000000000000000000000000000000000000000000000',
    // REN
    ['0x408e41876cccdc0f92210600ef50372656052a38']: '0xaa72656e00000000000000000000000000000000000000000000000000000000',
    // BAND
    ['0xba11d00c5f74255f56a5e366f4f77f5a186d7f55']: '0xaa42414e44000000000000000000000000000000000000000000000000000000',
};
exports.MAINNET_SUSHI_SWAP_ROUTER = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F';
exports.MAINNET_SHELL_POOLS = {
    StableCoins: {
        poolAddress: '0x2E703D658f8dd21709a7B458967aB4081F8D3d05',
        tokens: [exports.TOKENS.USDC, exports.TOKENS.USDT, exports.TOKENS.sUSD, exports.TOKENS.DAI],
    },
    Bitcoin: {
        poolAddress: '0x02Af7C867d6Ddd2c87dEcec2E4AFF809ee118FBb',
        tokens: [exports.TOKENS.RenBTC, exports.TOKENS.WBTC, exports.TOKENS.sBTC],
    },
};
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
exports.COMPARISON_PRICE_DECIMALS = 5;
const EMPTY_BRIDGE_ADDRESSES = {
    uniswapBridge: exports.NULL_ADDRESS,
    uniswapV2Bridge: exports.NULL_ADDRESS,
    eth2DaiBridge: exports.NULL_ADDRESS,
    kyberBridge: exports.NULL_ADDRESS,
    curveBridge: exports.NULL_ADDRESS,
    multiBridge: exports.NULL_ADDRESS,
    balancerBridge: exports.NULL_ADDRESS,
    bancorBridge: exports.NULL_ADDRESS,
    mStableBridge: exports.NULL_ADDRESS,
    mooniswapBridge: exports.NULL_ADDRESS,
    sushiswapBridge: exports.NULL_ADDRESS,
    shellBridge: exports.NULL_ADDRESS,
    dodoBridge: exports.NULL_ADDRESS,
    creamBridge: exports.NULL_ADDRESS,
    snowswapBridge: exports.NULL_ADDRESS,
    swerveBridge: exports.NULL_ADDRESS,
};
exports.BRIDGE_ADDRESSES_BY_CHAIN = {
    [contract_addresses_1.ChainId.Mainnet]: {
        uniswapBridge: '0x36691c4f426eb8f42f150ebde43069a31cb080ad',
        uniswapV2Bridge: '0xdcd6011f4c6b80e470d9487f5871a0cba7c93f48',
        kyberBridge: '0xadd97271402590564ddd8ad23cb5317b1fb0fffb',
        eth2DaiBridge: '0x991c745401d5b5e469b8c3e2cb02c748f08754f1',
        curveBridge: '0x1796cd592d19e3bcd744fbb025bb61a6d8cb2c09',
        multiBridge: '0xc03117a8c9bde203f70aa911cb64a7a0df5ba1e1',
        balancerBridge: '0xfe01821ca163844203220cd08e4f2b2fb43ae4e4',
        bancorBridge: '0x259897d9699553edbdf8538599242354e957fb94',
        mStableBridge: '0x2bf04fcea05f0989a14d9afa37aa376baca6b2b3',
        mooniswapBridge: '0x02b7eca484ad960fca3f7709e0b2ac81eec3069c',
        sushiswapBridge: '0x47ed0262a0b688dcb836d254c6a2e96b6c48a9f5',
        shellBridge: '0xf1c0811e3788caae7dbfae43da9d9131b1a8a148',
        dodoBridge: '0xe9da66965a9344aab2167e6813c03f043cc7a6ca',
        creamBridge: '0xb9d4bf2c8dab828f4ffb656acdb6c2b497d44f25',
        swerveBridge: '0xf9786d5eb1de47fa56a8f7bb387653c6d410bfee',
        snowswapBridge: '0xb1dbe83d15236ec10fdb214c6b89774b454754fd',
    },
    [contract_addresses_1.ChainId.Kovan]: Object.assign({}, EMPTY_BRIDGE_ADDRESSES, { uniswapBridge: '0x0e85f89f29998df65402391478e5924700c0079d', uniswapV2Bridge: '0x7b3530a635d099de0534dc27e46cd7c57578c3c8', eth2DaiBridge: '0x2d47147429b474d2e4f83e658015858a1312ed5b', kyberBridge: '0xaecfa25920f892b6eb496e1f6e84037f59da7f44', curveBridge: '0x81c0ab53a7352d2e97f682a37cba44e54647eefb', balancerBridge: '0x407b4128e9ecad8769b2332312a9f655cb9f5f3a' }),
    [contract_addresses_1.ChainId.Rinkeby]: EMPTY_BRIDGE_ADDRESSES,
    [contract_addresses_1.ChainId.Ropsten]: EMPTY_BRIDGE_ADDRESSES,
    [contract_addresses_1.ChainId.Ganache]: EMPTY_BRIDGE_ADDRESSES,
};
// tslint:disable:custom-no-magic-numbers
exports.DEFAULT_GAS_SCHEDULE = {
    [types_1.ERC20BridgeSource.Native]: () => 150e3,
    [types_1.ERC20BridgeSource.Uniswap]: () => 90e3,
    [types_1.ERC20BridgeSource.LiquidityProvider]: () => 140e3,
    [types_1.ERC20BridgeSource.Eth2Dai]: () => 400e3,
    [types_1.ERC20BridgeSource.Kyber]: () => 500e3,
    [types_1.ERC20BridgeSource.Curve]: fillData => {
        const poolAddress = fillData.pool.poolAddress.toLowerCase();
        switch (poolAddress) {
            case '0xa5407eae9ba41422680e2e00537571bcc53efbfd':
            case '0x93054188d876f558f4a66b2ef1d97d16edf0895b':
            case '0x7fc77b5c7614e1533320ea6ddc2eb61fa00a9714':
            case '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7':
                return 150e3;
            case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56':
                return 750e3;
            case '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51':
                return 850e3;
            case '0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27':
                return 1e6;
            case '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c':
                return 600e3;
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
        let gas = 95e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.Balancer]: () => 120e3,
    [types_1.ERC20BridgeSource.Cream]: () => 300e3,
    [types_1.ERC20BridgeSource.MStable]: () => 700e3,
    [types_1.ERC20BridgeSource.Mooniswap]: () => 220e3,
    [types_1.ERC20BridgeSource.Swerve]: () => 150e3,
    [types_1.ERC20BridgeSource.Shell]: () => 300e3,
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
        return isSellBase ? 440e3 : 540e3;
    },
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
    [types_1.ERC20BridgeSource.Bancor]: () => 300e3,
};
exports.DEFAULT_FEE_SCHEDULE = Object.assign({}, ...Object.keys(exports.DEFAULT_GAS_SCHEDULE).map(k => ({
    [k]: k === types_1.ERC20BridgeSource.Native
        ? (fillData) => exports.PROTOCOL_FEE_MULTIPLIER.plus(exports.DEFAULT_GAS_SCHEDULE[k](fillData))
        : (fillData) => exports.DEFAULT_GAS_SCHEDULE[k](fillData),
})));
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
    tokenAdjacencyGraph: {},
};
//# sourceMappingURL=constants.js.map