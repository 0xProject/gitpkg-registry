import { ChainId, ContractAddresses } from '@0x/contract-addresses';
import { CalldataInfo, MarketBuySwapQuote, MarketSellSwapQuote, SwapQuote, SwapQuoteConsumerBase, SwapQuoteConsumerOpts, SwapQuoteExecutionOpts, SwapQuoteGetOutputOpts } from '../types';
export declare class ExchangeProxySwapQuoteConsumer implements SwapQuoteConsumerBase {
    readonly contractAddresses: ContractAddresses;
    readonly chainId: ChainId;
    readonly transformerNonces: {
        wethTransformer: number;
        payTakerTransformer: number;
        fillQuoteTransformer: number;
        affiliateFeeTransformer: number;
        positiveSlippageFeeTransformer: number;
    };
    private readonly _exchangeProxy;
    private readonly _transformERC20Feature;
    constructor(contractAddresses: ContractAddresses, options?: Partial<SwapQuoteConsumerOpts>);
    getCalldataOrThrowAsync(quote: MarketBuySwapQuote | MarketSellSwapQuote, opts?: Partial<SwapQuoteGetOutputOpts>): Promise<CalldataInfo>;
    executeSwapQuoteOrThrowAsync(_quote: SwapQuote, _opts: Partial<SwapQuoteExecutionOpts>): Promise<string>;
    private _encodeMultiplexBatchFillCalldata;
    private _encodeMultiplexMultiHopFillCalldata;
}
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.d.ts.map