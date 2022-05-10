import { TakerRequestQueryParamsUnnested } from '@0x/quote-server';
import { AxiosInstance, CancelToken } from 'axios';
import { AltOffering, AltQuoteModel, AltRfqMakerAssetOfferings, LogFunction } from '../types';
/**
 * Returns the AltOffering if it exists for a given pair
 */
export declare function getAltMarketInfo(offerings: AltOffering[], buyTokenAddress: string, sellTokenAddress: string): AltOffering | undefined;
/**
 * Turn a standard quote request into an alt quote request
 * and return the appropriate standard quote response
 */
export declare function returnQuoteFromAltMMAsync<ResponseT>(url: string, apiKey: string, profile: string, integratorKey: string, quoteModel: AltQuoteModel, makerToken: string, takerToken: string, maxResponseTimeMs: number, altRfqAssetOfferings: AltRfqMakerAssetOfferings, takerRequestQueryParams: TakerRequestQueryParamsUnnested, axiosInstance: AxiosInstance, warningLogger: LogFunction, cancelToken: CancelToken): Promise<{
    data: ResponseT;
    status: number;
}>;
//# sourceMappingURL=alt_mm_implementation_utils.d.ts.map