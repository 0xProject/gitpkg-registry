import { FillQuoteTransformerData } from '@0x/protocol-utils';
import { ERC20BridgeSource } from '../network/types';
import { ExchangeProxyContractOpts, MarketBuySwapQuote, SwapQuote } from '../types';
import { OptimizedMarketOrder } from '../utils/market_operation_utils/types';
/**
 * Returns true iff a quote can be filled via `MultiplexFeature.batchFill`.
 */
export declare function isMultiplexBatchFillCompatible(quote: SwapQuote, opts: ExchangeProxyContractOpts): boolean;
/**
 * Returns true iff a quote can be filled via `MultiplexFeature.multiHopFill`.
 */
export declare function isMultiplexMultiHopFillCompatible(quote: SwapQuote, opts: ExchangeProxyContractOpts): boolean;
/**
 * Returns true iff a quote can be filled via a VIP feature.
 */
export declare function isDirectSwapCompatible(quote: SwapQuote, opts: ExchangeProxyContractOpts, directSources: ERC20BridgeSource[]): boolean;
/**
 * Whether a quote is a market buy or not.
 */
export declare function isBuyQuote(quote: SwapQuote): quote is MarketBuySwapQuote;
/**
 * Converts the given `OptimizedMarketOrder`s into bridge, limit, and RFQ orders for
 * FillQuoteTransformer.
 */
export declare function getFQTTransformerDataFromOptimizedOrders(orders: OptimizedMarketOrder[]): Pick<FillQuoteTransformerData, 'bridgeOrders' | 'limitOrders' | 'rfqOrders' | 'fillSequence'>;
/**
 * Returns true if swap quote must go through `tranformERC20`.
 */
export declare function requiresTransformERC20(opts: ExchangeProxyContractOpts): boolean;
//# sourceMappingURL=quote_consumer_utils.d.ts.map