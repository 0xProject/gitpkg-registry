import { BigNumber } from '@0x/utils';
import { SupportedProvider } from 'ethereum-types';
import { Chain } from './network/chain';
import { MarketBuySwapQuote, MarketOperation, OrderPrunerPermittedFeeTypes, SignedNativeOrder, SwapQuote, SwapQuoteRequestOpts, SwapQuoterOpts } from './types';
import { MarketOperationUtils } from './utils/market_operation_utils';
import { MarketDepth } from './utils/market_operation_utils/types';
export declare abstract class Orderbook {
    abstract getOrdersAsync(makerToken: string, takerToken: string, pruneFn?: (o: SignedNativeOrder) => boolean): Promise<SignedNativeOrder[]>;
    abstract getBatchOrdersAsync(makerTokens: string[], takerToken: string, pruneFn?: (o: SignedNativeOrder) => boolean): Promise<SignedNativeOrder[][]>;
    destroyAsync(): Promise<void>;
}
export declare class SwapQuoter {
    readonly orderbook: Orderbook;
    readonly expiryBufferMs: number;
    readonly permittedOrderFeeTypes: Set<OrderPrunerPermittedFeeTypes>;
    private readonly _protocolFeeUtils;
    private readonly _marketOperationUtils;
    private readonly _rfqtOptions?;
    private readonly _quoteRequestorHttpClient;
    /**
     * Instantiates a new SwapQuoter instance
     * @param   supportedProvider   The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   orderbook           An object that conforms to Orderbook, see type for definition.
     * @param   opts                Initialization opts for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    static createAsync(supportedProvider: SupportedProvider, orderbook: Orderbook, opts?: Partial<SwapQuoterOpts>): Promise<SwapQuoter>;
    protected constructor(opts: {
        chain: Chain;
        orderbook: Orderbook;
        marketUtils: MarketOperationUtils;
    } & Partial<SwapQuoterOpts>);
    getBatchMarketBuySwapQuoteAsync(makerTokens: string[], targetTakerToken: string, makerTokenBuyAmounts: BigNumber[], opts?: Partial<SwapQuoteRequestOpts>): Promise<MarketBuySwapQuote[]>;
    /**
     * Returns the bids and asks liquidity for the entire market.
     * For certain sources (like AMM's) it is recommended to provide a practical maximum takerAssetAmount.
     * @param   makerTokenAddress The address of the maker asset
     * @param   takerTokenAddress The address of the taker asset
     * @param   takerAssetAmount  The amount to sell and buy for the bids and asks.
     *
     * @return  An object that conforms to MarketDepth that contains all of the samples and liquidity
     *          information for the source.
     */
    getBidAskLiquidityForMakerTakerAssetPairAsync(makerToken: string, takerToken: string, takerAssetAmount: BigNumber, opts?: Partial<SwapQuoteRequestOpts>): Promise<MarketDepth>;
    /**
     * Returns the recommended gas price for a fast transaction
     */
    getGasPriceEstimationOrThrowAsync(): Promise<BigNumber>;
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync(): Promise<void>;
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerToken       The address of the maker asset
     * @param   takerToken       The address of the taker asset
     * @param   assetFillAmount  If a buy, the amount of maker asset to buy. If a sell, the amount of taker asset to sell.
     * @param   marketOperation  Either a Buy or a Sell quote
     * @param   opts          Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getSwapQuoteAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, opts: Partial<SwapQuoteRequestOpts>): Promise<SwapQuote>;
    private readonly _limitOrderPruningFn;
    private _isApiKeyWhitelisted;
    private _isTxOriginBlacklisted;
    private _validateRfqtOpts;
}
//# sourceMappingURL=swap_quoter.d.ts.map