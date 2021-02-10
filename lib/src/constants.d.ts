import { SignatureType } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { ExchangeProxyContractOpts, LogFunction, OrderPrunerOpts, RfqtRequestOpts, SwapQuoteGetOutputOpts, SwapQuoteRequestOpts, SwapQuoterOpts } from './types';
export declare const DEFAULT_INFO_LOGGER: LogFunction;
export declare const DEFAULT_WARNING_LOGGER: LogFunction;
export declare const INVALID_SIGNATURE: {
    signatureType: SignatureType;
    v: number;
    r: string;
    s: string;
};
export { BRIDGE_ADDRESSES_BY_CHAIN, DEFAULT_FEE_SCHEDULE, DEFAULT_GAS_SCHEDULE, } from './utils/market_operation_utils/constants';
export declare const constants: {
    ETH_GAS_STATION_API_URL: string;
    PROTOCOL_FEE_MULTIPLIER: BigNumber;
    NULL_BYTES: string;
    ZERO_AMOUNT: BigNumber;
    NULL_ADDRESS: string;
    MAINNET_CHAIN_ID: number;
    DEFAULT_ORDER_PRUNER_OPTS: OrderPrunerOpts;
    ETHER_TOKEN_DECIMALS: number;
    ONE_AMOUNT: BigNumber;
    ONE_SECOND_MS: number;
    ONE_MINUTE_MS: number;
    DEFAULT_SWAP_QUOTER_OPTS: SwapQuoterOpts;
    DEFAULT_INTERMEDIATE_TOKENS: string[];
    DEFAULT_SWAP_QUOTE_REQUEST_OPTS: SwapQuoteRequestOpts;
    DEFAULT_EXCHANGE_PROXY_SWAP_QUOTE_GET_OPTS: SwapQuoteGetOutputOpts;
    DEFAULT_EXCHANGE_PROXY_EXTENSION_CONTRACT_OPTS: ExchangeProxyContractOpts;
    DEFAULT_PER_PAGE: number;
    DEFAULT_RFQT_REQUEST_OPTS: Partial<RfqtRequestOpts>;
    NULL_ERC20_ASSET_DATA: string;
    PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS: number;
    MARKET_UTILS_AMOUNT_BUFFER_PERCENTAGE: number;
    BRIDGE_ASSET_DATA_PREFIX: string;
    DEFAULT_INFO_LOGGER: LogFunction;
    DEFAULT_WARNING_LOGGER: LogFunction;
    EMPTY_BYTES32: string;
};
//# sourceMappingURL=constants.d.ts.map