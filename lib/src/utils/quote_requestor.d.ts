import { SignedOrder } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../types';
/**
 * Request quotes from RFQ-T providers
 */
export declare class QuoteRequestor {
    private readonly _rfqtMakerEndpoints;
    constructor(rfqtMakerEndpoints: string[]);
    requestRfqtFirmQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, intentOnFilling: boolean, takerApiKey: string, takerAddress: string): Promise<SignedOrder[]>;
}
//# sourceMappingURL=quote_requestor.d.ts.map