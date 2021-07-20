import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { AltMockedRfqQuoteResponse, MockedRfqQuoteResponse } from '../../src/types';
export declare enum RfqQuoteEndpoint {
    Indicative = "price",
    Firm = "quote"
}
export declare const testHelpers: {
    expectInsufficientLiquidityErrorAsync: (expect: Chai.ExpectStatic, functionWhichTriggersErrorAsync: () => Promise<void>, expectedAmountAvailableToFill: BigNumber) => Promise<void>;
    /**
     * A helper utility for testing which mocks out
     * requests to RFQ-T/M providers
     */
    withMockedRfqQuotes: (standardMockedResponses: MockedRfqQuoteResponse[], altMockedResponses: AltMockedRfqQuoteResponse[], quoteType: RfqQuoteEndpoint, afterResponseCallback: () => Promise<void>, axiosClient?: AxiosInstance) => Promise<void>;
};
//# sourceMappingURL=test_helpers.d.ts.map