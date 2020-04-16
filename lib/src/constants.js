"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var types_1 = require("./types");
var constants_1 = require("./utils/market_operation_utils/constants");
var ETH_GAS_STATION_API_BASE_URL = 'https://ethgasstation.info';
var NULL_BYTES = '0x';
var NULL_ERC20_ASSET_DATA = '0xf47261b00000000000000000000000000000000000000000000000000000000000000000';
var NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
var MAINNET_CHAIN_ID = 1;
var ONE_SECOND_MS = 1000;
var DEFAULT_PER_PAGE = 1000;
var DEFAULT_ORDER_PRUNER_OPTS = {
    expiryBufferMs: 120000,
    permittedOrderFeeTypes: new Set([
        types_1.OrderPrunerPermittedFeeTypes.NoFees,
        types_1.OrderPrunerPermittedFeeTypes.MakerDenominatedTakerFee,
    ]),
};
// 6 seconds polling interval
var PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS = 6000;
var PROTOCOL_FEE_MULTIPLIER = new utils_1.BigNumber(150000);
// default 50% buffer for selecting native orders to be aggregated with other sources
var MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE = 0.5;
var DEFAULT_SWAP_QUOTER_OPTS = __assign({
    chainId: MAINNET_CHAIN_ID,
    orderRefreshIntervalMs: 10000,
}, DEFAULT_ORDER_PRUNER_OPTS, { samplerGasLimit: 250e6, rfqt: {
        takerApiKeyWhitelist: [],
        makerEndpoints: [],
    } });
var DEFAULT_FORWARDER_EXTENSION_CONTRACT_OPTS = {
    feePercentage: 0,
    feeRecipient: NULL_ADDRESS,
};
var DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS = {
    useExtensionContract: types_1.ExtensionContractType.Forwarder,
    extensionContractOpts: DEFAULT_FORWARDER_EXTENSION_CONTRACT_OPTS,
};
var DEFAULT_FORWARDER_SWAP_QUOTE_EXECUTE_OPTS = DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS;
var DEFAULT_SWAP_QUOTE_REQUEST_OPTS = __assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS);
var DEFAULT_RFQT_FIRM_QUOTE_REQUEST_OPTS = {
    makerEndpointMaxResponseTimeMs: 1000,
};
exports.constants = {
    ETH_GAS_STATION_API_BASE_URL: ETH_GAS_STATION_API_BASE_URL,
    PROTOCOL_FEE_MULTIPLIER: PROTOCOL_FEE_MULTIPLIER,
    NULL_BYTES: NULL_BYTES,
    ZERO_AMOUNT: new utils_1.BigNumber(0),
    NULL_ADDRESS: NULL_ADDRESS,
    MAINNET_CHAIN_ID: MAINNET_CHAIN_ID,
    DEFAULT_ORDER_PRUNER_OPTS: DEFAULT_ORDER_PRUNER_OPTS,
    ETHER_TOKEN_DECIMALS: 18,
    ONE_AMOUNT: new utils_1.BigNumber(1),
    ONE_SECOND_MS: ONE_SECOND_MS,
    DEFAULT_SWAP_QUOTER_OPTS: DEFAULT_SWAP_QUOTER_OPTS,
    DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS: DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS,
    DEFAULT_FORWARDER_SWAP_QUOTE_EXECUTE_OPTS: DEFAULT_FORWARDER_SWAP_QUOTE_EXECUTE_OPTS,
    DEFAULT_SWAP_QUOTE_REQUEST_OPTS: DEFAULT_SWAP_QUOTE_REQUEST_OPTS,
    DEFAULT_PER_PAGE: DEFAULT_PER_PAGE,
    DEFAULT_RFQT_FIRM_QUOTE_REQUEST_OPTS: DEFAULT_RFQT_FIRM_QUOTE_REQUEST_OPTS,
    NULL_ERC20_ASSET_DATA: NULL_ERC20_ASSET_DATA,
    PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS: PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS,
    MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE: MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE,
    BRIDGE_ASSET_DATA_PREFIX: '0xdc1600f3',
};
//# sourceMappingURL=constants.js.map