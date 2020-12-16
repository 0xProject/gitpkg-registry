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
/**
 * A helper utility for testing which mocks out
 * requests to RFQ-t providers
 */
exports.rfqtMocker = {
    /**
     * Stubs out responses from RFQ-T providers by mocking out
     * HTTP calls via axios. Always restores the mock adapter
     * after executing the `performFn`.
     */
    withMockedRfqtFirmQuotes: (mockedResponses, performFn, axiosClient = axios_1.default) => __awaiter(this, void 0, void 0, function* () {
        const mockedAxios = new axios_mock_adapter_1.default(axiosClient);
        try {
            // Mock out RFQT responses
            for (const mockedResponse of mockedResponses) {
                const { endpoint, requestApiKey, requestParams, responseData, responseCode } = mockedResponse;
                const requestHeaders = { Accept: 'application/json, text/plain, */*', '0x-api-key': requestApiKey };
                mockedAxios
                    .onGet(`${endpoint}/quote`, { params: requestParams }, requestHeaders)
                    .replyOnce(responseCode, responseData);
            }
            yield performFn();
        }
        finally {
            // Ensure we always restore axios afterwards
            mockedAxios.restore();
        }
    }),
    withMockedRfqtIndicativeQuotes: (mockedResponses, performFn, axiosClient = axios_1.default) => __awaiter(this, void 0, void 0, function* () {
        const mockedAxios = new axios_mock_adapter_1.default(axiosClient);
        try {
            // Mock out RFQT responses
            for (const mockedResponse of mockedResponses) {
                const { endpoint, requestApiKey, requestParams, responseData, responseCode } = mockedResponse;
                const requestHeaders = { Accept: 'application/json, text/plain, */*', '0x-api-key': requestApiKey };
                mockedAxios
                    .onGet(`${endpoint}/price`, { params: requestParams }, requestHeaders)
                    .replyOnce(responseCode, responseData);
            }
            yield performFn();
        }
        finally {
            // Ensure we always restore axios afterwards
            mockedAxios.restore();
        }
    }),
};
//# sourceMappingURL=rfqt_mocker.js.map