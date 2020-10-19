import { BigNumber } from '@0x/utils';
import { SourceFilters } from './source_filters';
import { CurveInfo, ERC20BridgeSource, GetMarketOrdersOpts } from './types';
/**
 * Valid sources for market sell.
 */
export declare const SELL_SOURCE_FILTER: SourceFilters;
/**
 * Valid sources for market buy.
 */
export declare const BUY_SOURCE_FILTER: SourceFilters;
export declare const DEFAULT_GET_MARKET_ORDERS_OPTS: GetMarketOrdersOpts;
/**
 * Sources to poll for ETH fee price estimates.
 */
export declare const FEE_QUOTE_SOURCES: ERC20BridgeSource[];
export declare const SOURCE_FLAGS: {
    [source in ERC20BridgeSource]: number;
};
/**
 * Mainnet Curve configuration
 */
export declare const MAINNET_CURVE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const MAINNET_SWERVE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const MAINNET_KYBER_RESERVE_IDS: {
    [name: string]: string;
};
export declare const MAINNET_KYBER_TOKEN_RESERVE_IDS: {
    [token: string]: string;
};
export declare const MAINNET_SUSHI_SWAP_ROUTER = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
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
export declare const COMPARISON_PRICE_DECIMALS = 5;
//# sourceMappingURL=constants.d.ts.map