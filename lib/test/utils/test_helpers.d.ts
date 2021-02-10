/// <reference types="chai" />
import { BigNumber } from '@0x/utils';
import { AxiosInstance } from 'axios';
import { MockedRfqtQuoteResponse } from '../../src/types';
export declare enum RfqtQuoteEndpoint {
    Indicative = "price",
    Firm = "quote"
}
export declare const testHelpers: {
    expectInsufficientLiquidityErrorAsync: (expect: Chai.ExpectStatic, functionWhichTriggersErrorAsync: () => Promise<void>, expectedAmountAvailableToFill: BigNumber) => Promise<void>;
    /**
     * A helper utility for testing which mocks out
     * requests to RFQ-t providers
     */
    withMockedRfqtQuotes: (mockedResponses: MockedRfqtQuoteResponse[], quoteType: RfqtQuoteEndpoint, afterResponseCallback: () => Promise<void>, axiosClient?: AxiosInstance) => Promise<void>;
};
//# sourceMappingURL=test_helpers.d.ts.map