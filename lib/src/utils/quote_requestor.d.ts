import { Signature } from '@0x/protocol-utils';
import { TakerRequestQueryParamsUnnested, V4RFQIndicativeQuote } from '@0x/quote-server';
import { Fee } from '@0x/quote-server/lib/src/types';
import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { Integrator, LogFunction, MarketOperation, RfqMakerAssetOfferings, RfqmRequestOptions, RfqRequestOpts, SignedNativeOrder, TypedMakerUrl } from '../types';
export interface V4RFQIndicativeQuoteMM extends V4RFQIndicativeQuote {
    makerUri: string;
}
export interface MetricsProxy {
    /**
     * Increments a counter that is tracking valid Firm Quotes that are dropped due to low expiration.
     * @param isLastLook mark if call is coming from RFQM
     * @param maker the maker address
     */
    incrementExpirationToSoonCounter(isLastLook: boolean, maker: string): void;
    /**
     * Keeps track of summary statistics for expiration on Firm Quotes.
     * @param isLastLook mark if call is coming from RFQM
     * @param maker the maker address
     * @param expirationTimeSeconds the expiration time in seconds
     */
    measureExpirationForValidOrder(isLastLook: boolean, maker: string, expirationTimeSeconds: BigNumber): void;
    /**
     * Increments a counter that tracks when an order is not fully fillable.
     * @param isLastLook mark if call is coming from RFQM
     * @param maker the maker address
     * @param expirationTimeSeconds the expiration time in seconds
     */
    incrementFillRatioWarningCounter(isLastLook: boolean, maker: string): void;
    /**
     * Logs the outcome of a network (HTTP) interaction with a market maker.
     *
     * @param interaction.isLastLook true if the request is RFQM
     * @param interaction.integrator the integrator that is requesting the RFQ quote
     * @param interaction.url the URL of the market maker
     * @param interaction.quoteType indicative or firm quote
     * @param interaction.statusCode the statusCode returned by a market maker
     * @param interaction.latencyMs the latency of the HTTP request (in ms)
     * @param interaction.included if a firm quote that was returned got included in the next step of processing.
     *                             NOTE: this does not mean that the request returned a valid fillable order. It just
     *                             means that the network response was successful.
     */
    logRfqMakerNetworkInteraction(interaction: {
        isLastLook: boolean;
        integrator: Integrator;
        url: string;
        quoteType: 'firm' | 'indicative';
        statusCode: number | undefined;
        latencyMs: number;
        included: boolean;
        sellTokenAddress: string;
        buyTokenAddress: string;
    }): void;
}
export declare class QuoteRequestor {
    private readonly _rfqtAssetOfferings;
    private readonly _rfqmAssetOfferings;
    private readonly _quoteRequestorHttpClient;
    private readonly _altRfqCreds?;
    private readonly _warningLogger;
    private readonly _infoLogger;
    private readonly _expiryBufferMs;
    private readonly _metrics?;
    private readonly _schemaValidator;
    private readonly _orderSignatureToMakerUri;
    static makeQueryParameters(txOrigin: string, takerAddress: string, marketOperation: MarketOperation, buyTokenAddress: string, // maker token
    sellTokenAddress: string, // taker token
    assetFillAmount: BigNumber, comparisonPrice?: BigNumber, isLastLook?: boolean | undefined, fee?: Fee | undefined): TakerRequestQueryParamsUnnested;
    /**
     * Gets both standard RFQ makers and "alternative" RFQ makers and combines them together
     * in a single configuration map. If an integration key whitelist is present, it will be used
     * to filter a specific makers.
     *
     * @param options the RfqmRequestOptions passed in
     * @param assetOfferings the RFQM or RFQT maker offerings
     * @returns a list of TypedMakerUrl instances
     */
    static getTypedMakerUrlsAndWhitelist(options: Pick<RfqmRequestOptions, 'integrator' | 'altRfqAssetOfferings'>, assetOfferings: RfqMakerAssetOfferings): TypedMakerUrl[];
    static getDurationUntilExpirationMs(expirationTimeSeconds: BigNumber): BigNumber;
    private static _makerSupportsPair;
    constructor(_rfqtAssetOfferings: RfqMakerAssetOfferings, _rfqmAssetOfferings: RfqMakerAssetOfferings, _quoteRequestorHttpClient: AxiosInstance, _altRfqCreds?: {
        altRfqApiKey: string;
        altRfqProfile: string;
    } | undefined, _warningLogger?: LogFunction, _infoLogger?: LogFunction, _expiryBufferMs?: number, _metrics?: MetricsProxy | undefined);
    requestRfqmFirmQuotesAsync(makerToken: string, // maker token
    takerToken: string, // taker token
    assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqmRequestOptions): Promise<SignedNativeOrder[]>;
    requestRfqtFirmQuotesAsync(makerToken: string, // maker token
    takerToken: string, // taker token
    assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqRequestOpts): Promise<SignedNativeOrder[]>;
    requestRfqmIndicativeQuotesAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqmRequestOptions): Promise<V4RFQIndicativeQuoteMM[]>;
    requestRfqtIndicativeQuotesAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqRequestOpts): Promise<V4RFQIndicativeQuoteMM[]>;
    /**
     * Given an order signature, returns the makerUri that the order originated from
     */
    getMakerUriForSignature(signature: Signature): string | undefined;
    private _isValidRfqtIndicativeQuoteResponse;
    private _getQuotesAsync;
    private _fetchAndValidateFirmQuotesAsync;
    private _fetchAndValidateIndicativeQuotesAsync;
}
//# sourceMappingURL=quote_requestor.d.ts.map