import { SignedOrder } from '@0x/order-utils';
import { IndicativeQuote } from '@0x/quote-server';
import { BigNumber } from '@0x/utils';
import { MarketOperation, RfqtMakerAssetOfferings, RfqtRequestOpts } from '../types';
export declare type LogFunction = (obj: object, msg?: string, ...args: any[]) => void;
export declare class QuoteRequestor {
    private readonly _rfqtAssetOfferings;
    private readonly _warningLogger;
    private readonly _infoLogger;
    private readonly _expiryBufferMs;
    private readonly _schemaValidator;
    constructor(_rfqtAssetOfferings: RfqtMakerAssetOfferings, _warningLogger?: LogFunction, _infoLogger?: LogFunction, _expiryBufferMs?: number);
    requestRfqtFirmQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: RfqtRequestOpts): Promise<SignedOrder[]>;
    requestRfqtIndicativeQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: RfqtRequestOpts): Promise<IndicativeQuote[]>;
    private _isValidRfqtIndicativeQuoteResponse;
    private _makerSupportsPair;
    private _isExpirationTooSoon;
    private _getQuotesAsync;
}
//# sourceMappingURL=quote_requestor.d.ts.map