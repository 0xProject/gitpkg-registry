import { Signature } from '@0x/protocol-utils';
import { TakerRequestQueryParams, V4RFQIndicativeQuote } from '@0x/quote-server';
import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { LogFunction, MarketOperation, RfqtMakerAssetOfferings, RfqtRequestOpts, SignedNativeOrder } from '../types';
export declare const quoteRequestorHttpClient: AxiosInstance;
export declare class QuoteRequestor {
    private readonly _rfqtAssetOfferings;
    private readonly _warningLogger;
    private readonly _infoLogger;
    private readonly _expiryBufferMs;
    private readonly _schemaValidator;
    private readonly _orderSignatureToMakerUri;
    static makeQueryParameters(txOrigin: string, takerAddress: string, marketOperation: MarketOperation, buyTokenAddress: string, // maker token
    sellTokenAddress: string, // taker token
    assetFillAmount: BigNumber, comparisonPrice?: BigNumber): TakerRequestQueryParams;
    constructor(_rfqtAssetOfferings: RfqtMakerAssetOfferings, _warningLogger?: LogFunction, _infoLogger?: LogFunction, _expiryBufferMs?: number);
    requestRfqtFirmQuotesAsync(makerToken: string, // maker token
    takerToken: string, // taker token
    assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqtRequestOpts): Promise<SignedNativeOrder[]>;
    requestRfqtIndicativeQuotesAsync(makerToken: string, takerToken: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqtRequestOpts): Promise<V4RFQIndicativeQuote[]>;
    /**
     * Given an order signature, returns the makerUri that the order originated from
     */
    getMakerUriForSignature(signature: Signature): string | undefined;
    private _isValidRfqtIndicativeQuoteResponse;
    private _makerSupportsPair;
    private _isExpirationTooSoon;
    private _getQuotesAsync;
}
//# sourceMappingURL=quote_requestor.d.ts.map