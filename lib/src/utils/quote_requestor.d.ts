import { SignedOrder } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { MarketOperation, RfqtMakerAssetOfferings, RfqtRequestOpts } from '../types';
/**
 * Request quotes from RFQ-T providers
 */
export interface RfqtIndicativeQuoteResponse {
    makerAssetData: string;
    makerAssetAmount: BigNumber;
    takerAssetData: string;
    takerAssetAmount: BigNumber;
    expirationTimeSeconds: BigNumber;
}
export declare class QuoteRequestor {
    private readonly _rfqtAssetOfferings;
    private readonly _warningLogger;
    private readonly _infoLogger;
    private readonly _expiryBufferMs;
    private readonly _schemaValidator;
    constructor(_rfqtAssetOfferings: RfqtMakerAssetOfferings, _warningLogger?: (a: any) => void, _infoLogger?: (a: any) => void, _expiryBufferMs?: number);
    requestRfqtFirmQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: RfqtRequestOpts): Promise<SignedOrder[]>;
    requestRfqtIndicativeQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: RfqtRequestOpts): Promise<RfqtIndicativeQuoteResponse[]>;
    private _isValidRfqtIndicativeQuoteResponse;
    private _makerSupportsPair;
    private _isExpirationTooSoon;
}
//# sourceMappingURL=quote_requestor.d.ts.map