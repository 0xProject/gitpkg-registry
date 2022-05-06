import { BigNumber } from '@0x/utils';
import { SupportedProvider, ZeroExProvider } from 'ethereum-types';
import { MarketBuySwapQuote, MarketOperation, OrderPrunerPermittedFeeTypes, SignedNativeOrder, SwapQuote, SwapQuoteRequestOpts, SwapQuoterOpts } from './types';
import { IRfqClient } from './utils/irfq_client';
import { MarketDepth } from './utils/market_operation_utils/types';
export declare abstract class Orderbook {
    abstract getOrdersAsync(makerToken: string, takerToken: string, pruneFn?: (o: SignedNativeOrder) => boolean): Promise<SignedNativeOrder[]>;
    abstract getBatchOrdersAsync(makerTokens: string[], takerToken: string, pruneFn?: (o: SignedNativeOrder) => boolean): Promise<SignedNativeOrder[][]>;
    destroyAsync(): Promise<void>;
}
export declare class SwapQuoter {
    readonly provider: ZeroExProvider;
    readonly orderbook: Orderbook;
    readonly expiryBufferMs: number;
    readonly chainId: number;
    readonly permittedOrderFeeTypes: Set<OrderPrunerPermittedFeeTypes>;
    private readonly _contractAddresses;
    private readonly _protocolFeeUtils;
    private readonly _marketOperationUtils;
    private readonly _rfqtOptions?;
    private readonly _quoteRequestorHttpClient;
    private readonly _integratorIdsSet;
    /**
     * Instantiates a new SwapQuoter instance
     * @param   supportedProvider   The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   orderbook           An object that conforms to Orderbook, see type for definition.
     * @param   options             Initialization options for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    constructor(supportedProvider: SupportedProvider, orderbook: Orderbook, options?: Partial<SwapQuoterOpts>);
    getBatchMarketBuySwapQuoteAsync(makerTokens: string[], targetTakerToken: string, makerTokenBuyAmounts: BigNumber[], options?: Partial<SwapQuoteRequestOpts>): Promise<MarketBuySwapQuote[]>;
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
    getBidAskLiquidityForMakerTakerAssetPairAsync(makerToken: string, takerToken: string, takerAssetAmount: BigNumber, options?: Partial<SwapQuoteRequestOpts>): Promise<MarketDepth>;
    /**
     * Returns the recommended gas price for a fast transaction
     */
    getGasPriceEstimationOrThrowAsync(): Promise<BigNumber>;
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync(): Promise<void>;
    /**
     * Utility function to get Ether token address
     */
    getEtherToken(): string;
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerToken       The address of the maker asset
     * @param   takerToken       The address of the taker asset
     * @param   assetFillAmount  If a buy, the amount of maker asset to buy. If a sell, the amount of taker asset to sell.
     * @param   marketOperation  Either a Buy or a Sell quote
     * @param   options          Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getSwapQuoteAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: Partial<SwapQuoteRequestOpts>, rfqClient: IRfqClient | undefined): Promise<SwapQuote>;
    private readonly _limitOrderPruningFn;
    private _isIntegratorIdWhitelisted;
    private _isTxOriginBlacklisted;
    private _validateRfqtOpts;
}
//# sourceMappingURL=swap_quoter.d.ts.map