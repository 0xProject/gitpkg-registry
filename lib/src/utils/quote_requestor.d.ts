import { RFQTFirmQuote, RFQTIndicativeQuote } from '@0x/quote-server';
import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { MarketOperation, RfqtMakerAssetOfferings, RfqtRequestOpts } from '../types';
export declare const quoteRequestorHttpClient: AxiosInstance;
export declare type LogFunction = (obj: object, msg?: string, ...args: any[]) => void;
export declare class QuoteRequestor {
    private readonly _rfqtAssetOfferings;
    private readonly _warningLogger;
    private readonly _infoLogger;
    private readonly _expiryBufferMs;
    private readonly _schemaValidator;
    private readonly _orderSignatureToMakerUri;
    constructor(_rfqtAssetOfferings: RfqtMakerAssetOfferings, _warningLogger?: LogFunction, _infoLogger?: LogFunction, _expiryBufferMs?: number);
    requestRfqtFirmQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: RfqtRequestOpts): Promise<RFQTFirmQuote[]>;
    requestRfqtIndicativeQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: RfqtRequestOpts): Promise<RFQTIndicativeQuote[]>;
    /**
     * Given an order signature, returns the makerUri that the order originated from
     */
    getMakerUriForOrderSignature(orderSignature: string): string | undefined;
    private _isValidRfqtIndicativeQuoteResponse;
    private _makerSupportsPair;
    private _isExpirationTooSoon;
    private _getQuotesAsync;
}
//# sourceMappingURL=quote_requestor.d.ts.map