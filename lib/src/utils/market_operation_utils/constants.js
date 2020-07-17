"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULL_ADDRESS = exports.NULL_BYTES = exports.ONE_SECOND_MS = exports.ONE_HOUR_IN_SECONDS = exports.ZERO_AMOUNT = exports.POSITIVE_INF = exports.NEGATIVE_INF = exports.ONE_ETHER = exports.WALLET_SIGNATURE = exports.ERC20_PROXY_ID = exports.MAINNET_CURVE_CONTRACTS = exports.FEE_QUOTE_SOURCES = exports.DEFAULT_FAKE_BUY_OPTS = exports.DEFAULT_GET_MARKET_ORDERS_OPTS = exports.BUY_SOURCES = exports.SELL_SOURCES = void 0;
var utils_1 = require("@0x/utils");
var types_1 = require("./types");
// tslint:disable: custom-no-magic-numbers
/**
 * Valid sources for market sell.
 */
exports.SELL_SOURCES = [
    types_1.ERC20BridgeSource.Uniswap,
    types_1.ERC20BridgeSource.UniswapV2,
    types_1.ERC20BridgeSource.Eth2Dai,
    types_1.ERC20BridgeSource.Kyber,
    types_1.ERC20BridgeSource.Curve,
    types_1.ERC20BridgeSource.Balancer,
];
/**
 * Valid sources for market buy.
 */
exports.BUY_SOURCES = [
    types_1.ERC20BridgeSource.Uniswap,
    types_1.ERC20BridgeSource.UniswapV2,
    types_1.ERC20BridgeSource.Eth2Dai,
    types_1.ERC20BridgeSource.Kyber,
    types_1.ERC20BridgeSource.Curve,
    types_1.ERC20BridgeSource.Balancer,
];
exports.DEFAULT_GET_MARKET_ORDERS_OPTS = {
    // tslint:disable-next-line: custom-no-magic-numbers
    runLimit: Math.pow(2, 15),
    excludedSources: [],
    bridgeSlippage: 0.005,
    maxFallbackSlippage: 0.05,
    numSamples: 13,
    sampleDistributionBase: 1.05,
    feeSchedule: {},
    gasSchedule: {},
    allowFallback: true,
    shouldBatchBridgeOrders: true,
};
exports.DEFAULT_FAKE_BUY_OPTS = {
    targetSlippageBps: new utils_1.BigNumber(5),
    maxIterations: new utils_1.BigNumber(5),
};
/**
 * Sources to poll for ETH fee price estimates.
 */
exports.FEE_QUOTE_SOURCES = [
    types_1.ERC20BridgeSource.Uniswap,
    types_1.ERC20BridgeSource.UniswapV2,
    types_1.ERC20BridgeSource.Eth2Dai,
    types_1.ERC20BridgeSource.Kyber,
];
/**
 * Mainnet Curve configuration
 */
exports.MAINNET_CURVE_CONTRACTS = {
    '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': [
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    ],
    '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c': [
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ],
    '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51': [
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0x0000000000085d4780b73119b644ae5ecd22b376',
    ],
    '0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27': [
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    ],
    '0xa5407eae9ba41422680e2e00537571bcc53efbfd': [
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    ],
};
exports.ERC20_PROXY_ID = '0xf47261b0';
exports.WALLET_SIGNATURE = '0x04';
exports.ONE_ETHER = new utils_1.BigNumber(1e18);
exports.NEGATIVE_INF = new utils_1.BigNumber('-Infinity');
exports.POSITIVE_INF = new utils_1.BigNumber('Infinity');
exports.ZERO_AMOUNT = new utils_1.BigNumber(0);
exports.ONE_HOUR_IN_SECONDS = 60 * 60;
exports.ONE_SECOND_MS = 1000;
exports.NULL_BYTES = '0x';
exports.NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
//# sourceMappingURL=constants.js.map