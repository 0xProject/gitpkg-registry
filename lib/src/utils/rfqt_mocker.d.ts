import { MockedRfqtFirmQuoteResponse } from '../types';
/**
 * A helper utility for testing which mocks out
 * requests to RFQ-t providers
 */
export declare const rfqtMocker: {
    /**
     * Stubs out responses from RFQ-T providers by mocking out
     * HTTP calls via axios. Always restores the mock adapter
     * after executing the `performFn`.
     */
    withMockedRfqtFirmQuotes: (mockedResponses: MockedRfqtFirmQuoteResponse[], performFn: () => Promise<void>) => Promise<void>;
};
//# sourceMappingURL=rfqt_mocker.d.ts.map