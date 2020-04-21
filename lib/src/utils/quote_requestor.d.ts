import { SignedOrder } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { MarketOperation, RfqtRequestOpts } from '../types';
/**
 * Request quotes from RFQ-T providers
 */
export interface RfqtIndicativeQuoteResponse {
    makerAssetData: string;
    makerAssetAmount: BigNumber;
    takerAssetData: string;
    takerAssetAmount: BigNumber;
    expirationTimeSeconds: number;
}
export declare class QuoteRequestor {
    private readonly _rfqtMakerEndpoints;
    private readonly _schemaValidator;
    constructor(rfqtMakerEndpoints: string[]);
    requestRfqtFirmQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options?: Partial<RfqtRequestOpts>): Promise<SignedOrder[]>;
    requestRfqtIndicativeQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, options: RfqtRequestOpts): Promise<RfqtIndicativeQuoteResponse[]>;
    private _isValidRfqtIndicativeQuoteResponse;
}
//# sourceMappingURL=quote_requestor.d.ts.map