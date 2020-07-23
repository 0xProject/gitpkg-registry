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
    };
    private readonly _transformFeature;
    constructor(supportedProvider: SupportedProvider, contractAddresses: ContractAddresses, options?: Partial<SwapQuoteConsumerOpts>);
    getCalldataOrThrowAsync(quote: MarketBuySwapQuote | MarketSellSwapQuote, opts?: Partial<SwapQuoteGetOutputOpts>): Promise<CalldataInfo>;
    executeSwapQuoteOrThrowAsync(_quote: SwapQuote, _opts: Partial<SwapQuoteExecutionOpts>): Promise<string>;
}
/**
 * Find the nonce for a transformer given its deployer.
 * If `deployer` is the null address, zero will always be returned.
 */
export declare function findTransformerNonce(transformer: string, deployer?: string): number;
/**
 * Compute the deployed address for a transformer given a deployer and nonce.
 */
export declare function getTransformerAddress(deployer: string, nonce: number): string;
//# sourceMappingURL=exchange_proxy_swap_quote_consumer.d.ts.map