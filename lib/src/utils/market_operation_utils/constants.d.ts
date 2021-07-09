import { BigNumber } from '@0x/utils';
import { SourceFilters } from '../../network/source_filters';
import { ERC20BridgeSource } from '../../network/types';
import { FeeSchedule, GetMarketOrdersOpts } from './types';
export declare const ERC20_PROXY_ID = "0xf47261b0";
export declare const WALLET_SIGNATURE = "0x04";
export declare const ONE_ETHER: BigNumber;
export declare const NEGATIVE_INF: BigNumber;
export declare const POSITIVE_INF: BigNumber;
export declare const ZERO_AMOUNT: BigNumber;
export declare const MAX_UINT256: BigNumber;
export declare const ONE_HOUR_IN_SECONDS: number;
export declare const ONE_SECOND_MS = 1000;
export declare const NULL_BYTES = "0x";
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const COMPARISON_PRICE_DECIMALS = 10;
/**
 * Valid sources for market sell.
 */
export declare const SELL_SOURCE_FILTER_BY_CHAIN_ID: {
    1: SourceFilters;
    3: SourceFilters;
    4: SourceFilters;
    42: SourceFilters;
    1337: SourceFilters;
    56: SourceFilters;
    137: SourceFilters;
    80001: SourceFilters;
};
/**
 * Valid sources for market buy.
 */
export declare const BUY_SOURCE_FILTER_BY_CHAIN_ID: {
    1: SourceFilters;
    3: SourceFilters;
    4: SourceFilters;
    42: SourceFilters;
    1337: SourceFilters;
    56: SourceFilters;
    137: SourceFilters;
    80001: SourceFilters;
};
/**
 *  0x Protocol Fee Multiplier
 */
export declare const PROTOCOL_FEE_MULTIPLIER: BigNumber;
/**
 * Sources to poll for ETH fee price estimates.
 */
export declare const FEE_QUOTE_SOURCES_BY_CHAIN_ID: {
    1: ERC20BridgeSource[];
    3: ERC20BridgeSource[];
    4: ERC20BridgeSource[];
    42: ERC20BridgeSource[];
    1337: ERC20BridgeSource[];
    56: ERC20BridgeSource[];
    137: ERC20BridgeSource[];
    80001: ERC20BridgeSource[];
};
export declare const SOURCE_FLAGS: {
    [key in ERC20BridgeSource]: bigint;
} & {
    RfqOrder: bigint;
    LimitOrder: bigint;
};
export declare const NATIVE_FEE_TOKEN_AMOUNT_BY_CHAIN_ID: {
    1: BigNumber;
    3: BigNumber;
    4: BigNumber;
    42: BigNumber;
    1337: BigNumber;
    56: BigNumber;
    137: BigNumber;
    80001: BigNumber;
};
/**
 * Mainnet Curve configuration
 * The tokens are in order of their index, which each curve defines
 * I.e DaiUsdc curve has DAI as index 0 and USDC as index 1
 */
/**
 * Kyber reserve prefixes
 * 0xff Fed price reserve
 * 0xaa Automated price reserve
 * 0xbb Bridged price reserve (i.e Uniswap/Curve)
 */
export declare const CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
export declare const MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID: {
    1: string;
    3: string;
    4: string;
    42: string;
    1337: string;
    56: string;
    137: string;
    80001: string;
};
/**
 * Calculated gross gas cost of the underlying exchange.
 * The cost of switching from one source to another, assuming
 * we are in the middle of a transaction.
 * I.e remove the overhead cost of ExchangeProxy (130k) and
 * the ethereum transaction cost (21k)
 */
export declare const DEFAULT_GAS_SCHEDULE: Required<FeeSchedule>;
export declare const DEFAULT_FEE_SCHEDULE: Required<FeeSchedule>;
export declare const POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS: BigNumber;
export declare const DEFAULT_GET_MARKET_ORDERS_OPTS: GetMarketOrdersOpts;
//# sourceMappingURL=constants.d.ts.map