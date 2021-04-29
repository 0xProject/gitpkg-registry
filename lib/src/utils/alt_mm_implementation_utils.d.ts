import { TakerRequestQueryParams } from '@0x/quote-server';
import { AxiosInstance, CancelToken } from 'axios';
import { AltQuoteModel, AltRfqMakerAssetOfferings, LogFunction } from '../types';
/**
 * Turn a standard quote request into an alt quote request
 * and return the appropriate standard quote response
 */
export declare function returnQuoteFromAltMMAsync<ResponseT>(url: string, apiKey: string, profile: string, integratorKey: string, quoteModel: AltQuoteModel, makerToken: string, takerToken: string, maxResponseTimeMs: number, altRfqAssetOfferings: AltRfqMakerAssetOfferings, takerRequestQueryParams: TakerRequestQueryParams, axiosInstance: AxiosInstance, warningLogger: LogFunction, cancelToken: CancelToken): Promise<{
    data: ResponseT;
    status: number;
}>;
//# sourceMappingURL=alt_mm_implementation_utils.d.ts.map