import { CalldataInfo, SwapQuote, SwapQuoteConsumerBase, SwapQuoteConsumerOpts, SwapQuoteExecutionOpts, SwapQuoteGetOutputOpts } from '../types';
export declare class SwapQuoteConsumer implements SwapQuoteConsumerBase {
    readonly chainId: number;
    private readonly _contractAddresses;
    private readonly _exchangeProxyConsumer;
    static getSwapQuoteConsumer(options: SwapQuoteConsumerOpts): SwapQuoteConsumer;
    constructor(options: SwapQuoteConsumerOpts);
    /**
     * Given a SwapQuote, returns 'CalldataInfo' for a 0x extesion or exchange call. See type definition of CalldataInfo for more information.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting SmartContractParams. See type definition for more information.
     */
    getCalldataOrThrowAsync(quote: SwapQuote, opts?: Partial<SwapQuoteGetOutputOpts>): Promise<CalldataInfo>;
    /**
     * Given a SwapQuote and desired rate (in takerAsset), attempt to execute the swap with 0x extension or exchange contract.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting CalldataInfo. See type definition for more information.
     */
    executeSwapQuoteOrThrowAsync(quote: SwapQuote, opts?: Partial<SwapQuoteExecutionOpts>): Promise<string>;
    private _getConsumerForSwapQuoteAsync;
}
//# sourceMappingURL=swap_quote_consumer.d.ts.map