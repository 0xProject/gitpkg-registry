import { Signature } from '@0x/protocol-utils';
import { TakerRequestQueryParamsUnnested, V4RFQIndicativeQuote } from '@0x/quote-server';
import { Fee } from '@0x/quote-server/lib/src/types';
import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { LogFunction, MarketOperation, RfqMakerAssetOfferings, RfqmRequestOptions, RfqRequestOpts, SignedNativeOrder } from '../types';
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
    requestRfqmIndicativeQuotesAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqmRequestOptions): Promise<V4RFQIndicativeQuote[]>;
    requestRfqtIndicativeQuotesAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqRequestOpts): Promise<V4RFQIndicativeQuote[]>;
    /**
     * Given an order signature, returns the makerUri that the order originated from
     */
    getMakerUriForSignature(signature: Signature): string | undefined;
    private _isValidRfqtIndicativeQuoteResponse;
    private _isExpirationTooSoon;
    private _getQuotesAsync;
    private _fetchAndValidateFirmQuotesAsync;
    private _fetchAndValidateIndicativeQuotesAsync;
}
//# sourceMappingURL=quote_requestor.d.ts.map