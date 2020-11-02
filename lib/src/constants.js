"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
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
const DEFAULT_INTERMEDIATE_TOKENS = [constants_1.TOKENS.WETH, constants_1.TOKENS.USDT, constants_1.TOKENS.DAI, constants_1.TOKENS.USDC];
const DEFAULT_SWAP_QUOTER_OPTS = Object.assign({ chainId: contract_addresses_1.ChainId.Mainnet, orderRefreshIntervalMs: 10000 }, DEFAULT_ORDER_PRUNER_OPTS, { samplerGasLimit: 250e6, ethGasStationUrl: ETH_GAS_STATION_API_URL, rfqt: {
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
    isMetaTransaction: false,
};
const DEFAULT_FORWARDER_SWAP_QUOTE_EXECUTE_OPTS = DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS;
const DEFAULT_EXCHANGE_PROXY_SWAP_QUOTE_GET_OPTS = {
    useExtensionContract: types_1.ExtensionContractType.ExchangeProxy,
    extensionContractOpts: DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS,
};
const DEFAULT_SWAP_QUOTE_REQUEST_OPTS = Object.assign({}, constants_1.DEFAULT_GET_MARKET_ORDERS_OPTS);
const DEFAULT_RFQT_REQUEST_OPTS = {
    makerEndpointMaxResponseTimeMs: 1000,
    isPriceAwareRFQEnabled: false,
};
exports.DEFAULT_INFO_LOGGER = (obj, msg) => utils_1.logUtils.log(`${msg ? `${msg}: ` : ''}${JSON.stringify(obj)}`);
exports.DEFAULT_WARNING_LOGGER = (obj, msg) => utils_1.logUtils.warn(`${msg ? `${msg}: ` : ''}${JSON.stringify(obj)}`);
// This feature flag allows us to merge the price-aware RFQ pricing
// project while still controlling when to activate the feature. We plan to do some
// data analysis work and address some of the issues with maker fillable amounts
// in later milestones. Once the feature is fully rolled out and is providing value
// and we have assessed that there is no user impact, we will proceed in cleaning up
// the feature flag.  When that time comes, follow this PR to "undo" the feature flag:
// https://github.com/0xProject/0x-monorepo/pull/2735
exports.IS_PRICE_AWARE_RFQ_ENABLED = false;
var constants_2 = require("./utils/market_operation_utils/constants");
exports.BRIDGE_ADDRESSES_BY_CHAIN = constants_2.BRIDGE_ADDRESSES_BY_CHAIN;
exports.DEFAULT_FEE_SCHEDULE = constants_2.DEFAULT_FEE_SCHEDULE;
exports.DEFAULT_GAS_SCHEDULE = constants_2.DEFAULT_GAS_SCHEDULE;
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
    DEFAULT_INTERMEDIATE_TOKENS,
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
    DEFAULT_INFO_LOGGER: exports.DEFAULT_INFO_LOGGER,
    DEFAULT_WARNING_LOGGER: exports.DEFAULT_WARNING_LOGGER,
};
//# sourceMappingURL=constants.js.map