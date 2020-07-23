"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var dev_utils_1 = require("@0x/dev-utils");
var order_utils_1 = require("@0x/order-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var chai = require("chai");
require("mocha");
var constants_1 = require("../src/constants");
var types_2 = require("../src/types");
var quote_requestor_1 = require("../src/utils/quote_requestor");
var rfqt_mocker_1 = require("../src/utils/rfqt_mocker");
var chai_setup_1 = require("./utils/chai_setup");
var test_order_factory_1 = require("./utils/test_order_factory");
chai_setup_1.chaiSetup.configure();
var expect = chai.expect;
function makeThreeMinuteExpiry() {
    var expiry = new Date(Date.now());
    expiry.setMinutes(expiry.getMinutes() + 3);
    return new utils_1.BigNumber(Math.round(expiry.valueOf() / constants_1.constants.ONE_SECOND_MS));
}
describe('QuoteRequestor', function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, makerToken, takerToken, otherToken1, makerAssetData, takerAssetData;
    var _this = this;
    return __generator(this, function (_b) {
        _a = __read(dev_utils_1.tokenUtils.getDummyERC20TokenAddresses(), 3), makerToken = _a[0], takerToken = _a[1], otherToken1 = _a[2];
        makerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(makerToken);
        takerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(takerToken);
        describe('requestRfqtFirmQuotesAsync for firm quotes', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                it('should return successful RFQT requests', function () { return __awaiter(_this, void 0, void 0, function () {
                    var takerAddress, apiKey, mockedRequests, expectedParams, successfulOrder1, wrongMakerAssetDataOrder, wrongTakerAssetDataOrder, unsignedOrder, orderWithNullTaker, successfulOrder2;
                    var _this = this;
                    return __generator(this, function (_a) {
                        takerAddress = '0xd209925defc99488e3afff1174e48b4fa628302a';
                        apiKey = 'my-ko0l-api-key';
                        mockedRequests = [];
                        expectedParams = {
                            sellTokenAddress: takerToken,
                            buyTokenAddress: makerToken,
                            sellAmountBaseUnits: '10000',
                            buyAmountBaseUnits: undefined,
                            takerAddress: takerAddress,
                        };
                        successfulOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                            makerAssetData: makerAssetData,
                            takerAssetData: takerAssetData,
                            takerAddress: takerAddress,
                            feeRecipientAddress: '0x0000000000000000000000000000000000000001',
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                        });
                        mockedRequests.push({
                            endpoint: 'https://1337.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { signedOrder: successfulOrder1 },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        // Test out a bad response code, ensure it doesnt cause throw
                        mockedRequests.push({
                            endpoint: 'https://420.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { error: 'bad request' },
                            responseCode: types_1.StatusCodes.InternalError,
                        });
                        // Test out a successful response code but an invalid order
                        mockedRequests.push({
                            endpoint: 'https://421.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { makerAssetData: '123' },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        // ensure that a non-JSON response doesn't throw an error when trying to parse
                        mockedRequests.push({
                            endpoint: 'https://421.1.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: 'this is not JSON!',
                            responseCode: types_1.StatusCodes.Success,
                        });
                        wrongMakerAssetDataOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                            makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(otherToken1),
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                            takerAssetData: takerAssetData,
                        });
                        mockedRequests.push({
                            endpoint: 'https://422.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { signedOrder: wrongMakerAssetDataOrder },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        wrongTakerAssetDataOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                            makerAssetData: makerAssetData,
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                            takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(otherToken1),
                        });
                        mockedRequests.push({
                            endpoint: 'https://423.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { signedOrder: wrongTakerAssetDataOrder },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        unsignedOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                            makerAssetData: makerAssetData,
                            takerAssetData: takerAssetData,
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                            feeRecipientAddress: '0x0000000000000000000000000000000000000002',
                        });
                        delete unsignedOrder.signature;
                        mockedRequests.push({
                            endpoint: 'https://424.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { signedOrder: unsignedOrder },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        orderWithNullTaker = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                            makerAssetData: makerAssetData,
                            takerAssetData: takerAssetData,
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                            takerAddress: constants_1.constants.NULL_ADDRESS,
                            feeRecipientAddress: '0x0000000000000000000000000000000000000002',
                        });
                        mockedRequests.push({
                            endpoint: 'https://425.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { signedOrder: orderWithNullTaker },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        successfulOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                            makerAssetData: makerAssetData,
                            takerAssetData: takerAssetData,
                            takerAddress: takerAddress,
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                        });
                        mockedRequests.push({
                            endpoint: 'https://37.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { signedOrder: successfulOrder2 },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        return [2 /*return*/, rfqt_mocker_1.rfqtMocker.withMockedRfqtFirmQuotes(mockedRequests, function () { return __awaiter(_this, void 0, void 0, function () {
                                var qr, resp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            qr = new quote_requestor_1.QuoteRequestor({
                                                'https://1337.0.0.1': [[makerToken, takerToken]],
                                                'https://420.0.0.1': [[makerToken, takerToken]],
                                                'https://421.0.0.1': [[makerToken, takerToken]],
                                                'https://421.1.0.1': [[makerToken, takerToken]],
                                                'https://422.0.0.1': [[makerToken, takerToken]],
                                                'https://423.0.0.1': [[makerToken, takerToken]],
                                                'https://424.0.0.1': [[makerToken, takerToken]],
                                                'https://425.0.0.1': [[makerToken, takerToken]],
                                                'https://426.0.0.1': [] /* Shouldn't ping an RFQ-T
                                                provider when they don't support the requested asset pair. */,
                                                'https://37.0.0.1': [[makerToken, takerToken]],
                                            });
                                            return [4 /*yield*/, qr.requestRfqtFirmQuotesAsync(makerAssetData, takerAssetData, new utils_1.BigNumber(10000), types_2.MarketOperation.Sell, {
                                                    apiKey: apiKey,
                                                    takerAddress: takerAddress,
                                                    intentOnFilling: true,
                                                })];
                                        case 1:
                                            resp = _a.sent();
                                            expect(resp.sort()).to.eql([{ signedOrder: successfulOrder1 }, { signedOrder: successfulOrder2 }].sort());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe('requestRfqtIndicativeQuotesAsync for Indicative quotes', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                it('should return successful RFQT requests', function () { return __awaiter(_this, void 0, void 0, function () {
                    var takerAddress, apiKey, mockedRequests, expectedParams, successfulQuote1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        takerAddress = '0xd209925defc99488e3afff1174e48b4fa628302a';
                        apiKey = 'my-ko0l-api-key';
                        mockedRequests = [];
                        expectedParams = {
                            sellTokenAddress: takerToken,
                            buyTokenAddress: makerToken,
                            sellAmountBaseUnits: '10000',
                            buyAmountBaseUnits: undefined,
                            takerAddress: takerAddress,
                        };
                        successfulQuote1 = {
                            makerAssetData: makerAssetData,
                            takerAssetData: takerAssetData,
                            makerAssetAmount: new utils_1.BigNumber(expectedParams.sellAmountBaseUnits),
                            takerAssetAmount: new utils_1.BigNumber(expectedParams.sellAmountBaseUnits),
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                        };
                        mockedRequests.push({
                            endpoint: 'https://1337.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: successfulQuote1,
                            responseCode: types_1.StatusCodes.Success,
                        });
                        // Test out a bad response code, ensure it doesnt cause throw
                        mockedRequests.push({
                            endpoint: 'https://420.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { error: 'bad request' },
                            responseCode: types_1.StatusCodes.InternalError,
                        });
                        // Test out a successful response code but an invalid order
                        mockedRequests.push({
                            endpoint: 'https://421.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: { makerAssetData: '123' },
                            responseCode: types_1.StatusCodes.Success,
                        });
                        // A successful response code and valid response data, but for wrong maker asset data
                        mockedRequests.push({
                            endpoint: 'https://422.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: __assign({}, successfulQuote1, { makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(otherToken1) }),
                            responseCode: types_1.StatusCodes.Success,
                        });
                        // A successful response code and valid response data, but for wrong taker asset data
                        mockedRequests.push({
                            endpoint: 'https://423.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: __assign({}, successfulQuote1, { takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(otherToken1) }),
                            responseCode: types_1.StatusCodes.Success,
                        });
                        // Another Successful response
                        mockedRequests.push({
                            endpoint: 'https://37.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: successfulQuote1,
                            responseCode: types_1.StatusCodes.Success,
                        });
                        return [2 /*return*/, rfqt_mocker_1.rfqtMocker.withMockedRfqtIndicativeQuotes(mockedRequests, function () { return __awaiter(_this, void 0, void 0, function () {
                                var qr, resp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            qr = new quote_requestor_1.QuoteRequestor({
                                                'https://1337.0.0.1': [[makerToken, takerToken]],
                                                'https://420.0.0.1': [[makerToken, takerToken]],
                                                'https://421.0.0.1': [[makerToken, takerToken]],
                                                'https://422.0.0.1': [[makerToken, takerToken]],
                                                'https://423.0.0.1': [[makerToken, takerToken]],
                                                'https://424.0.0.1': [[makerToken, takerToken]],
                                                'https://37.0.0.1': [[makerToken, takerToken]],
                                            });
                                            return [4 /*yield*/, qr.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, new utils_1.BigNumber(10000), types_2.MarketOperation.Sell, {
                                                    apiKey: apiKey,
                                                    takerAddress: takerAddress,
                                                    intentOnFilling: true,
                                                })];
                                        case 1:
                                            resp = _a.sent();
                                            expect(resp.sort()).to.eql([successfulQuote1, successfulQuote1].sort());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    });
                }); });
                it('should return successful RFQT indicative quote requests', function () { return __awaiter(_this, void 0, void 0, function () {
                    var takerAddress, apiKey, mockedRequests, expectedParams, successfulQuote1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        takerAddress = '0xd209925defc99488e3afff1174e48b4fa628302a';
                        apiKey = 'my-ko0l-api-key';
                        mockedRequests = [];
                        expectedParams = {
                            sellTokenAddress: takerToken,
                            buyTokenAddress: makerToken,
                            buyAmountBaseUnits: '10000',
                            sellAmountBaseUnits: undefined,
                            takerAddress: takerAddress,
                        };
                        successfulQuote1 = {
                            makerAssetData: makerAssetData,
                            takerAssetData: takerAssetData,
                            makerAssetAmount: new utils_1.BigNumber(expectedParams.buyAmountBaseUnits),
                            takerAssetAmount: new utils_1.BigNumber(expectedParams.buyAmountBaseUnits),
                            expirationTimeSeconds: makeThreeMinuteExpiry(),
                        };
                        mockedRequests.push({
                            endpoint: 'https://1337.0.0.1',
                            requestApiKey: apiKey,
                            requestParams: expectedParams,
                            responseData: successfulQuote1,
                            responseCode: types_1.StatusCodes.Success,
                        });
                        return [2 /*return*/, rfqt_mocker_1.rfqtMocker.withMockedRfqtIndicativeQuotes(mockedRequests, function () { return __awaiter(_this, void 0, void 0, function () {
                                var qr, resp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            qr = new quote_requestor_1.QuoteRequestor({ 'https://1337.0.0.1': [[makerToken, takerToken]] });
                                            return [4 /*yield*/, qr.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, new utils_1.BigNumber(10000), types_2.MarketOperation.Buy, {
                                                    apiKey: apiKey,
                                                    takerAddress: takerAddress,
                                                    intentOnFilling: true,
                                                })];
                                        case 1:
                                            resp = _a.sent();
                                            expect(resp.sort()).to.eql([successfulQuote1].sort());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=quote_requestor_test.js.map