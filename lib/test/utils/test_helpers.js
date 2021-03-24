"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const axios_mock_adapter_1 = require("axios-mock-adapter");
const _ = require("lodash");
const errors_1 = require("../../src/errors");
var RfqtQuoteEndpoint;
(function (RfqtQuoteEndpoint) {
    RfqtQuoteEndpoint["Indicative"] = "price";
    RfqtQuoteEndpoint["Firm"] = "quote";
})(RfqtQuoteEndpoint = exports.RfqtQuoteEndpoint || (exports.RfqtQuoteEndpoint = {}));
exports.testHelpers = {
    expectInsufficientLiquidityErrorAsync: (expect, functionWhichTriggersErrorAsync, expectedAmountAvailableToFill) => __awaiter(this, void 0, void 0, function* () {
        let wasErrorThrown = false;
        try {
            yield functionWhichTriggersErrorAsync();
        }
        catch (e) {
            wasErrorThrown = true;
            expect(e).to.be.instanceOf(errors_1.InsufficientAssetLiquidityError);
            if (expectedAmountAvailableToFill) {
                expect(e.amountAvailableToFill).to.be.bignumber.equal(expectedAmountAvailableToFill);
            }
            else {
                expect(e.amountAvailableToFill).to.be.undefined();
            }
        }
        expect(wasErrorThrown).to.be.true();
    }),
    /**
     * A helper utility for testing which mocks out
     * requests to RFQ-t providers
     */
    withMockedRfqtQuotes: (standardMockedResponses, altMockedResponses, quoteType, afterResponseCallback, axiosClient = axios_1.default) => __awaiter(this, void 0, void 0, function* () {
        const mockedAxios = new axios_mock_adapter_1.default(axiosClient, { onNoMatch: 'throwException' });
        try {
            // Mock out Standard RFQT responses
            for (const mockedResponse of standardMockedResponses) {
                const { endpoint, requestApiKey, requestParams, responseData, responseCode } = mockedResponse;
                const requestHeaders = { Accept: 'application/json, text/plain, */*', '0x-api-key': requestApiKey };
                if (mockedResponse.callback !== undefined) {
                    mockedAxios
                        .onGet(`${endpoint}/${quoteType}`, { params: requestParams }, requestHeaders)
                        .reply(mockedResponse.callback);
                }
                else {
                    mockedAxios
                        .onGet(`${endpoint}/${quoteType}`, { params: requestParams }, requestHeaders)
                        .replyOnce(responseCode, responseData);
                }
            }
            // Mock out Alt RFQT responses
            for (const mockedResponse of altMockedResponses) {
                const { endpoint, mmApiKey, requestData, responseData, responseCode } = mockedResponse;
                const requestHeaders = {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: `Bearer ${mmApiKey}`,
                };
                mockedAxios
                    .onPost(`${endpoint}/quotes`, 
                // hack to get AxiosMockAdapter to recognize the match
                // b/t the mock data and the request data
                {
                    asymmetricMatch: (x) => {
                        return _.isEqual(requestData, x);
                    },
                }, requestHeaders)
                    .replyOnce(responseCode, responseData);
            }
            // Perform the callback function, e.g. a test validation
            yield afterResponseCallback();
        }
        finally {
            // Ensure we always restore axios afterwards
            mockedAxios.restore();
        }
    }),
};
//# sourceMappingURL=test_helpers.js.map