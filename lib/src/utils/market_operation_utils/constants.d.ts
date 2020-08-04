import { BigNumber } from '@0x/utils';
import { CurveInfo, ERC20BridgeSource, GetMarketOrdersOpts } from './types';
/**
 * Valid sources for market sell.
 */
export declare const SELL_SOURCES: ERC20BridgeSource[];
/**
 * Valid sources for market buy.
 */
export declare const BUY_SOURCES: ERC20BridgeSource[];
export declare const DEFAULT_GET_MARKET_ORDERS_OPTS: GetMarketOrdersOpts;
/**
 * Sources to poll for ETH fee price estimates.
 */
export declare const FEE_QUOTE_SOURCES: ERC20BridgeSource[];
/**
 * Mainnet Curve configuration
 */
export declare const MAINNET_CURVE_INFOS: {
    [name: string]: CurveInfo;
};
export declare const ERC20_PROXY_ID = "0xf47261b0";
export declare const WALLET_SIGNATURE = "0x04";
export declare const ONE_ETHER: BigNumber;
export declare const NEGATIVE_INF: BigNumber;
export declare const POSITIVE_INF: BigNumber;
export declare const ZERO_AMOUNT: BigNumber;
export declare const ONE_HOUR_IN_SECONDS: number;
export declare const ONE_SECOND_MS = 1000;
export declare const NULL_BYTES = "0x";
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
//# sourceMappingURL=constants.d.ts.map