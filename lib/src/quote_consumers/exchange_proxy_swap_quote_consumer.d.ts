import { ContractAddresses } from '@0x/contract-addresses';
import { SupportedProvider, ZeroExProvider } from '@0x/web3-wrapper';
import { CalldataInfo, MarketBuySwapQuote, MarketSellSwapQuote, SwapQuote, SwapQuoteConsumerBase, SwapQuoteConsumerOpts, SwapQuoteExecutionOpts, SwapQuoteGetOutputOpts } from '../types';
export declare class ExchangeProxySwapQuoteConsumer implements SwapQuoteConsumerBase {
    readonly contractAddresses: ContractAddresses;
    readonly provider: ZeroExProvider;
    readonly chainId: number;
    readonly transformerNonces: {
        wethTransformer: number;
        payTakerTransformer: number;
        fillQuoteTransformer: number;
        affiliateFeeTransformer: number;
        positiveSlippageFeeTransformer: number;
    };
    private readonly _exchangeProxy;
    private readonly _multiplex;
    constructor(supportedProvider: SupportedProvider, contractAddresses: ContractAddresses, options?: Partial<SwapQuoteConsumerOpts>);
    getCalldataOrThrowAsync(quote: MarketBuySwapQuote | MarketSellSwapQuote, opts?: Partial<SwapQuoteGetOutputOpts>): Promise<CalldataInfo>;
    executeSwapQuoteOrThrowAsync(_quote: SwapQuote, _opts: Partial<SwapQuoteExecutionOpts>): Promise<string>;
    private _encodeMultiplexBatchFillCalldata;
    private _encodeMultiplexMultiHopFillCalldata;
}
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.d.ts.map