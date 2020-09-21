"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const types_1 = require("./types");
const constants_1 = require("./utils/market_operation_utils/constants");
const ETH_GAS_STATION_API_URL = 'https://ethgasstation.info/api/ethgasAPI.json';
const NULL_BYTES = '0x';
const NULL_ERC20_ASSET_DATA = '0xf47261b00000000000000000000000000000000000000000000000000000000000000000';
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAINNET_CHAIN_ID = 1;
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_SECS = 60;
const ONE_MINUTE_MS = ONE_SECOND_MS * ONE_MINUTE_SECS;
const DEFAULT_PER_PAGE = 1000;
const ZERO_AMOUNT = new utils_1.BigNumber(0);
const DEFAULT_ORDER_PRUNER_OPTS = {
    expiryBufferMs: 120000,
    permittedOrderFeeTypes: new Set([
        types_1.OrderPrunerPermittedFeeTypes.NoFees,
        types_1.OrderPrunerPermittedFeeTypes.MakerDenominatedTakerFee,
    ]),
};
// 6 seconds polling interval
const PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS = 6000;
const PROTOCOL_FEE_MULTIPLIER = new utils_1.BigNumber(70000);
// default 50% buffer for selecting native orders to be aggregated with other sources
const MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE = 0.5;
const DEFAULT_SWAP_QUOTER_OPTS = Object.assign({ chainId: MAINNET_CHAIN_ID, orderRefreshIntervalMs: 10000 }, DEFAULT_ORDER_PRUNER_OPTS, { samplerGasLimit: 250e6, ethGasStationUrl: ETH_GAS_STATION_API_URL, rfqt: {
        takerApiKeyWhitelist: [],
        makerAssetOfferings: {},
    } });
const DEFAULT_FORWARDER_EXTENSION_CONTRACT_OPTS = {
    feePercentage: 0,
    feeRecipient: NULL_ADDRESS,
};
const DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS = {
    useExtensionContract: types_1.ExtensionContractType.Forwarder,
    extensionContractOpts: DEFAULT_FORWARDER_EXTENSION_CONTRACT_OPTS,
};
const DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS = {
    isFromETH: false,
    isToETH: false,
    affiliateFee: {
        recipient: NULL_ADDRESS,
        buyTokenFeeAmount: ZERO_AMOUNT,
        sellTokenFeeAmount: ZERO_AMOUNT,
    },
    refundReceiver: NULL_ADDRESS,
};
const DEFAULT_FORWARDER_SWAP_QUOTE_EXECUTE_OPTS = DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS;
const DEFAULT_EXCHANGE_PROXY_SWAP_QUOTE_GET_OPTS = {
    useExtensionContract: types_1.ExtensionContractType.ExchangeProxy,
    extensionContractOpts: DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS,
};
const DEFAULT_SWAP_QUOTE_REQUEST_OPTS = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS);
const DEFAULT_RFQT_REQUEST_OPTS = {
    makerEndpointMaxResponseTimeMs: 1000,
};
exports.constants = {
    ETH_GAS_STATION_API_URL,
    PROTOCOL_FEE_MULTIPLIER,
    NULL_BYTES,
    ZERO_AMOUNT,
    NULL_ADDRESS,
    MAINNET_CHAIN_ID,
    DEFAULT_ORDER_PRUNER_OPTS,
    ETHER_TOKEN_DECIMALS: 18,
    ONE_AMOUNT: new utils_1.BigNumber(1),
    ONE_SECOND_MS,
    ONE_MINUTE_MS,
    DEFAULT_SWAP_QUOTER_OPTS,
    DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS,
    DEFAULT_FORWARDER_SWAP_QUOTE_EXECUTE_OPTS,
    DEFAULT_SWAP_QUOTE_REQUEST_OPTS,
    DEFAULT_EXCHANGE_PROXY_SWAP_QUOTE_GET_OPTS,
    DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS,
    DEFAULT_PER_PAGE,
    DEFAULT_RFQT_REQUEST_OPTS,
    NULL_ERC20_ASSET_DATA,
    PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS,
    MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE,
    BRIDGE_ASSET_DATA_PREFIX: '0xdc1600f3',
};
//# sourceMappingURL=constants.js.map