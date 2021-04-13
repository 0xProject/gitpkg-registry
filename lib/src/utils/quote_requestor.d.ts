import { Signature } from '@0x/protocol-utils';
import { TakerRequestQueryParams, V4RFQIndicativeQuote } from '@0x/quote-server';
import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { LogFunction, MarketOperation, RfqMakerAssetOfferings, RfqRequestOpts, SignedNativeOrder } from '../types';
export declare class QuoteRequestor {
    private readonly _rfqtAssetOfferings;
    private readonly _rfqmAssetOfferings;
    private readonly _quoteRequestorHttpClient;
    private readonly _altRfqCreds?;
    private readonly _warningLogger;
    private readonly _infoLogger;
    private readonly _expiryBufferMs;
    private readonly _schemaValidator;
    private readonly _orderSignatureToMakerUri;
    static makeQueryParameters(txOrigin: string, takerAddress: string, marketOperation: MarketOperation, buyTokenAddress: string, // maker token
    sellTokenAddress: string, // taker token
    assetFillAmount: BigNumber, comparisonPrice?: BigNumber, isLastLook?: boolean): TakerRequestQueryParams;
    private static _makerSupportsPair;
    constructor(_rfqtAssetOfferings: RfqMakerAssetOfferings, _rfqmAssetOfferings: RfqMakerAssetOfferings, _quoteRequestorHttpClient: AxiosInstance, _altRfqCreds?: {
        altRfqApiKey: string;
        altRfqProfile: string;
    } | undefined, _warningLogger?: LogFunction, _infoLogger?: LogFunction, _expiryBufferMs?: number);
    requestRfqmFirmQuotesAsync(makerToken: string, // maker token
    takerToken: string, // taker token
    assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqRequestOpts): Promise<SignedNativeOrder[]>;
    requestRfqtFirmQuotesAsync(makerToken: string, // maker token
    takerToken: string, // taker token
    assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqRequestOpts): Promise<SignedNativeOrder[]>;
    requestRfqmIndicativeQuotesAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqRequestOpts): Promise<V4RFQIndicativeQuote[]>;
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