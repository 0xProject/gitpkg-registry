import { RFQTFirmQuote, RFQTIndicativeQuote, TakerRequestQueryParams } from '@0x/quote-server';
import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { LogFunction, MarketOperation, RfqtFirmQuoteValidator, RfqtQuoteObserver, RfqtMakerAssetOfferings, RfqtRequestOpts } from '../types';
export declare const quoteRequestorHttpClient: AxiosInstance;
export declare class QuoteRequestor {
    private readonly _rfqtAssetOfferings;
    private readonly _warningLogger;
    private readonly _infoLogger;
    private readonly _expiryBufferMs;
    private readonly _firmQuoteValidator?;
    private readonly _quoteObserver?;
    private readonly _schemaValidator;
    private readonly _orderSignatureToMakerUri;
    static makeQueryParameters(takerAddress: string, marketOperation: MarketOperation, makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, comparisonPrice?: BigNumber): TakerRequestQueryParams;
    constructor(_rfqtAssetOfferings: RfqtMakerAssetOfferings, _warningLogger?: LogFunction, _infoLogger?: LogFunction, _expiryBufferMs?: number, _firmQuoteValidator?: RfqtFirmQuoteValidator | undefined, _quoteObserver?: RfqtQuoteObserver | undefined);
    requestRfqtFirmQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqtRequestOpts): Promise<RFQTFirmQuote[]>;
    requestRfqtIndicativeQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, comparisonPrice: BigNumber | undefined, options: RfqtRequestOpts): Promise<RFQTIndicativeQuote[]>;
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