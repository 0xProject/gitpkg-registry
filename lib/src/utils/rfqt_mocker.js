"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axios_mock_adapter_1 = require("axios-mock-adapter");
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
    withMockedRfqtFirmQuotes: function (mockedResponses, performFn) { return __awaiter(_this, void 0, void 0, function () {
        var e_1, _a, mockedAxios, mockedResponses_1, mockedResponses_1_1, mockedResponse, endpoint, requestApiKey, requestParams, responseData, responseCode, requestHeaders;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockedAxios = new axios_mock_adapter_1.default(axios_1.default);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    try {
                        // Mock out RFQT responses
                        for (mockedResponses_1 = __values(mockedResponses), mockedResponses_1_1 = mockedResponses_1.next(); !mockedResponses_1_1.done; mockedResponses_1_1 = mockedResponses_1.next()) {
                            mockedResponse = mockedResponses_1_1.value;
                            endpoint = mockedResponse.endpoint, requestApiKey = mockedResponse.requestApiKey, requestParams = mockedResponse.requestParams, responseData = mockedResponse.responseData, responseCode = mockedResponse.responseCode;
                            requestHeaders = { Accept: 'application/json, text/plain, */*', '0x-api-key': requestApiKey };
                            console.log("mocker: " + JSON.stringify({ params: requestParams, headers: requestHeaders }, undefined, '\t'));
                            console.log("buyAmountBaseUnits type: " + typeof requestParams.buyAmountBaseUnits);
                            console.log("sellAmountBaseUnits type: " + typeof requestParams.sellAmountBaseUnits);
                            mockedAxios
                                .onGet(endpoint + "/quote", { params: requestParams }, requestHeaders)
                                .replyOnce(responseCode, responseData);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (mockedResponses_1_1 && !mockedResponses_1_1.done && (_a = mockedResponses_1.return)) _a.call(mockedResponses_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return [4 /*yield*/, performFn()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    // Ensure we always restore axios afterwards
                    mockedAxios.restore();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    withMockedRfqtIndicativeQuotes: function (mockedResponses, performFn) { return __awaiter(_this, void 0, void 0, function () {
        var e_2, _a, mockedAxios, mockedResponses_2, mockedResponses_2_1, mockedResponse, endpoint, requestApiKey, requestParams, responseData, responseCode, requestHeaders;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockedAxios = new axios_mock_adapter_1.default(axios_1.default);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    try {
                        // Mock out RFQT responses
                        for (mockedResponses_2 = __values(mockedResponses), mockedResponses_2_1 = mockedResponses_2.next(); !mockedResponses_2_1.done; mockedResponses_2_1 = mockedResponses_2.next()) {
                            mockedResponse = mockedResponses_2_1.value;
                            endpoint = mockedResponse.endpoint, requestApiKey = mockedResponse.requestApiKey, requestParams = mockedResponse.requestParams, responseData = mockedResponse.responseData, responseCode = mockedResponse.responseCode;
                            requestHeaders = { Accept: 'application/json, text/plain, */*', '0x-api-key': requestApiKey };
                            console.log("mocker: " + JSON.stringify({ params: requestParams, headers: requestHeaders }, undefined, '\t'));
                            mockedAxios
                                .onGet(endpoint + "/price", { params: requestParams }, requestHeaders)
                                .replyOnce(responseCode, responseData);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (mockedResponses_2_1 && !mockedResponses_2_1.done && (_a = mockedResponses_2.return)) _a.call(mockedResponses_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    return [4 /*yield*/, performFn()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    // Ensure we always restore axios afterwards
                    mockedAxios.restore();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); },
};
//# sourceMappingURL=rfqt_mocker.js.map