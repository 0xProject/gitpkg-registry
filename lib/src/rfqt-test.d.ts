import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { SwapQuoteRequestOpts } from '.';
interface GetSwapQuoteResponseLiquiditySource {
    name: string;
    proportion: BigNumber;
}
export interface GetSwapQuoteResponse {
    price: number;
    guaranteedPrice: number;
    to: string;
    data: string;
    gasPrice: number;
    protocolFee: number;
    orders: SignedOrder[];
    buyAmount: number;
    sellAmount: number;
    buyTokenAddress: string;
    sellTokenAddress: string;
    value: number;
    sources: GetSwapQuoteResponseLiquiditySource[];
    gas: number;
    from: string;
}
export declare const DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE = 0.03;
export declare const DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE = 0.015;
export declare const ASSET_SWAPPER_MARKET_ORDERS_OPTS: Partial<SwapQuoteRequestOpts>;
export {};
//# sourceMappingURL=rfqt-test.d.ts.map