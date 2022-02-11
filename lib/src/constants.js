"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = exports.KEEP_ALIVE_TTL = exports.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS = exports.DEFAULT_GAS_SCHEDULE = exports.DEFAULT_FEE_SCHEDULE = exports.INVALID_SIGNATURE = exports.DEFAULT_WARNING_LOGGER = exports.DEFAULT_INFO_LOGGER = exports.ZERO_AMOUNT = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const protocol_utils_1 = require("@0x/protocol-utils");
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
const ALT_MM_IMPUTED_INDICATIVE_EXPIRY_SECONDS = 180;
const DEFAULT_ORDER_PRUNER_OPTS = {
    expiryBufferMs: 120000,
    permittedOrderFeeTypes: new Set([types_1.OrderPrunerPermittedFeeTypes.NoFees]), // Default asset-swapper for CFL oriented fee types
};
// 6 seconds polling interval
const PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS = 6000;
const PROTOCOL_FEE_MULTIPLIER = new utils_1.BigNumber(0);
// default 50% buffer for selecting native orders to be aggregated with other sources
const MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE = 0.5;
exports.ZERO_AMOUNT = new utils_1.BigNumber(0);
const DEFAULT_SWAP_QUOTER_OPTS = Object.assign(Object.assign({ chainId: contract_addresses_1.ChainId.Mainnet, orderRefreshIntervalMs: 10000 }, DEFAULT_ORDER_PRUNER_OPTS), { samplerGasLimit: 500e6, ethGasStationUrl: ETH_GAS_STATION_API_URL, rfqt: {
        integratorsWhitelist: [],
        makerAssetOfferings: {},
        txOriginBlacklist: new Set(),
    }, tokenAdjacencyGraph: constants_1.DEFAULT_TOKEN_ADJACENCY_GRAPH_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet] });
const DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS = {
    isFromETH: false,
    isToETH: false,
    affiliateFee: {
        feeType: types_1.AffiliateFeeType.None,
        recipient: NULL_ADDRESS,
        buyTokenFeeAmount: exports.ZERO_AMOUNT,
        sellTokenFeeAmount: exports.ZERO_AMOUNT,
    },
    refundReceiver: NULL_ADDRESS,
    isMetaTransaction: false,
    shouldSellEntireBalance: false,
};
const DEFAULT_EXCHANGE_PROXY_SWAP_QUOTE_GET_OPTS = {
    extensionContractOpts: DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS,
};
const DEFAULT_SWAP_QUOTE_REQUEST_OPTS = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS);
const DEFAULT_RFQT_REQUEST_OPTS = {
    makerEndpointMaxResponseTimeMs: 1000,
};
const DEFAULT_INFO_LOGGER = (obj, msg) => utils_1.logUtils.log(`${msg ? `${msg}: ` : ''}${JSON.stringify(obj)}`);
exports.DEFAULT_INFO_LOGGER = DEFAULT_INFO_LOGGER;
const DEFAULT_WARNING_LOGGER = (obj, msg) => utils_1.logUtils.warn(`${msg ? `${msg}: ` : ''}${JSON.stringify(obj)}`);
exports.DEFAULT_WARNING_LOGGER = DEFAULT_WARNING_LOGGER;
const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
exports.INVALID_SIGNATURE = { signatureType: protocol_utils_1.SignatureType.Invalid, v: 1, r: EMPTY_BYTES32, s: EMPTY_BYTES32 };
var constants_2 = require("./utils/market_operation_utils/constants");
Object.defineProperty(exports, "DEFAULT_FEE_SCHEDULE", { enumerable: true, get: function () { return constants_2.DEFAULT_FEE_SCHEDULE; } });
Object.defineProperty(exports, "DEFAULT_GAS_SCHEDULE", { enumerable: true, get: function () { return constants_2.DEFAULT_GAS_SCHEDULE; } });
exports.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS = new utils_1.BigNumber(30000);
// tslint:disable-next-line: custom-no-magic-numbers
exports.KEEP_ALIVE_TTL = 5 * 60 * ONE_SECOND_MS;
exports.constants = {
    ETH_GAS_STATION_API_URL,
    PROTOCOL_FEE_MULTIPLIER,
    POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS: exports.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS,
    NULL_BYTES,
    ZERO_AMOUNT: exports.ZERO_AMOUNT,
    NULL_ADDRESS,
    MAINNET_CHAIN_ID,
    DEFAULT_ORDER_PRUNER_OPTS,
    ETHER_TOKEN_DECIMALS: 18,
    ONE_AMOUNT: new utils_1.BigNumber(1),
    ONE_SECOND_MS,
    ONE_MINUTE_MS,
    DEFAULT_SWAP_QUOTER_OPTS,
    DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID: constants_1.DEFAULT_INTERMEDIATE_TOKENS_BY_CHAIN_ID,
    DEFAULT_SWAP_QUOTE_REQUEST_OPTS,
    DEFAULT_EXCHANGE_PROXY_SWAP_QUOTE_GET_OPTS,
    DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS,
    DEFAULT_PER_PAGE,
    DEFAULT_RFQT_REQUEST_OPTS,
    NULL_ERC20_ASSET_DATA,
    PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS,
    MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE,
    BRIDGE_ASSET_DATA_PREFIX: '0xdc1600f3',
    DEFAULT_INFO_LOGGER: exports.DEFAULT_INFO_LOGGER,
    DEFAULT_WARNING_LOGGER: exports.DEFAULT_WARNING_LOGGER,
    EMPTY_BYTES32,
    ALT_MM_IMPUTED_INDICATIVE_EXPIRY_SECONDS,
};
//# sourceMappingURL=constants.js.map