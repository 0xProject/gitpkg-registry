import { SignedOrder } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { MarketOperation, RfqtFirmQuoteRequestOpts } from '../types';
export declare class QuoteRequestor {
    private readonly _rfqtMakerEndpoints;
    private readonly _schemaValidator;
    constructor(rfqtMakerEndpoints: string[]);
    requestRfqtFirmQuotesAsync(makerAssetData: string, takerAssetData: string, assetFillAmount: BigNumber, marketOperation: MarketOperation, takerApiKey: string, takerAddress: string, options?: Partial<RfqtFirmQuoteRequestOpts>): Promise<SignedOrder[]>;
}
//# sourceMappingURL=quote_requestor.d.ts.map