"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rfqtMocker = exports.RfqtQuoteEndpoint = void 0;
const axios_1 = require("axios");
const axios_mock_adapter_1 = require("axios-mock-adapter");
var RfqtQuoteEndpoint;
(function (RfqtQuoteEndpoint) {
    RfqtQuoteEndpoint["Indicative"] = "price";
    RfqtQuoteEndpoint["Firm"] = "quote";
})(RfqtQuoteEndpoint = exports.RfqtQuoteEndpoint || (exports.RfqtQuoteEndpoint = {}));
/**
 * A helper utility for testing which mocks out
 * requests to RFQ-t providers
 */
exports.rfqtMocker = {
    /**
     * A helper utility for testing which mocks out
     * requests to RFQ-t providers
     */
    withMockedRfqtQuotes: (mockedResponses, quoteType, afterResponseCallback, axiosClient = axios_1.default) => __awaiter(void 0, void 0, void 0, function* () {
        const mockedAxios = new axios_mock_adapter_1.default(axiosClient);
        try {
            // Mock out RFQT responses
            for (const mockedResponse of mockedResponses) {
                const { endpoint, requestApiKey, requestParams, responseData, responseCode } = mockedResponse;
                const requestHeaders = { Accept: 'application/json, text/plain, */*', '0x-api-key': requestApiKey };
                mockedAxios
                    .onGet(`${endpoint}/${quoteType}`, { params: requestParams }, requestHeaders)
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
//# sourceMappingURL=rfqt_mocker.js.map