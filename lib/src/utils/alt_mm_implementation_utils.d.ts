import { TakerRequestQueryParams } from '@0x/quote-server';
import { AxiosInstance } from 'axios';
import { AltQuoteModel, AltRfqtMakerAssetOfferings } from '../types';
/**
 * Turn a standard quote request into an alt quote request
 * and return the appropriate standard quote response
 */
export declare function returnQuoteFromAltMMAsync<ResponseT>(url: string, apiKey: string, profile: string, integratorKey: string, quoteModel: AltQuoteModel, makerToken: string, takerToken: string, maxResponseTimeMs: number, altRfqtAssetOfferings: AltRfqtMakerAssetOfferings, takerRequestQueryParams: TakerRequestQueryParams, axiosInstance: AxiosInstance): Promise<{
    data: ResponseT;
    status: number;
}>;
//# sourceMappingURL=alt_mm_implementation_utils.d.ts.map