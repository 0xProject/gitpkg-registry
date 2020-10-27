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
const dev_utils_1 = require("@0x/dev-utils");
const order_utils_1 = require("@0x/order-utils");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const chai = require("chai");
require("mocha");
const constants_1 = require("../src/constants");
const types_2 = require("../src/types");
const quote_requestor_1 = require("../src/utils/quote_requestor");
const rfqt_mocker_1 = require("../src/utils/rfqt_mocker");
const chai_setup_1 = require("./utils/chai_setup");
const test_order_factory_1 = require("./utils/test_order_factory");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
function makeThreeMinuteExpiry() {
    const expiry = new Date(Date.now());
    expiry.setMinutes(expiry.getMinutes() + 3);
    return new utils_1.BigNumber(Math.round(expiry.valueOf() / constants_1.constants.ONE_SECOND_MS));
}
describe('QuoteRequestor', () => __awaiter(this, void 0, void 0, function* () {
    const [makerToken, takerToken, otherToken1] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
    const makerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(makerToken);
    const takerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(takerToken);
    describe('requestRfqtFirmQuotesAsync for firm quotes', () => __awaiter(this, void 0, void 0, function* () {
        it('should return successful RFQT requests', () => __awaiter(this, void 0, void 0, function* () {
            const takerAddress = '0xd209925defc99488e3afff1174e48b4fa628302a';
            const apiKey = 'my-ko0l-api-key';
            // Set up RFQT responses
            // tslint:disable-next-line:array-type
            const mockedRequests = [];
            const expectedParams = {
                sellTokenAddress: takerToken,
                buyTokenAddress: makerToken,
                sellAmountBaseUnits: '10000',
                comparisonPrice: undefined,
                takerAddress,
            };
            // Successful response
            const successfulOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetData,
                takerAssetData,
                takerAddress,
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
            // A successful response code and valid order, but for wrong maker asset data
            const wrongMakerAssetDataOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(otherToken1),
                expirationTimeSeconds: makeThreeMinuteExpiry(),
                takerAssetData,
            });
            mockedRequests.push({
                endpoint: 'https://422.0.0.1',
                requestApiKey: apiKey,
                requestParams: expectedParams,
                responseData: { signedOrder: wrongMakerAssetDataOrder },
                responseCode: types_1.StatusCodes.Success,
            });
            // A successful response code and valid order, but for wrong taker asset data
            const wrongTakerAssetDataOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetData,
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
            // A successful response code and good order but its unsigned
            const unsignedOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetData,
                takerAssetData,
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
            // A successful response code and good order but for the wrong takerAddress
            const orderWithNullTaker = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetData,
                takerAssetData,
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
            // Another Successful response
            const successfulOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetData,
                takerAssetData,
                takerAddress,
                expirationTimeSeconds: makeThreeMinuteExpiry(),
            });
            mockedRequests.push({
                endpoint: 'https://37.0.0.1',
                requestApiKey: apiKey,
                requestParams: expectedParams,
                responseData: { signedOrder: successfulOrder2 },
                responseCode: types_1.StatusCodes.Success,
            });
            return rfqt_mocker_1.rfqtMocker.withMockedRfqtFirmQuotes(mockedRequests, () => __awaiter(this, void 0, void 0, function* () {
                const qr = new quote_requestor_1.QuoteRequestor({
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
                const resp = yield qr.requestRfqtFirmQuotesAsync(makerAssetData, takerAssetData, new utils_1.BigNumber(10000), types_2.MarketOperation.Sell, undefined, {
                    apiKey,
                    takerAddress,
                    intentOnFilling: true,
                });
                expect(resp.sort()).to.eql([{ signedOrder: successfulOrder1 }, { signedOrder: successfulOrder2 }].sort());
            }), quote_requestor_1.quoteRequestorHttpClient);
        }));
    }));
    describe('requestRfqtIndicativeQuotesAsync for Indicative quotes', () => __awaiter(this, void 0, void 0, function* () {
        it('should optionally accept a "comparisonPrice" parameter', () => __awaiter(this, void 0, void 0, function* () {
            const response = quote_requestor_1.QuoteRequestor.makeQueryParameters(otherToken1, types_2.MarketOperation.Sell, makerAssetData, takerAssetData, new utils_1.BigNumber(1000), new utils_1.BigNumber(300.2));
            expect(response.comparisonPrice).to.eql('300.2');
        }));
        it('should return successful RFQT requests', () => __awaiter(this, void 0, void 0, function* () {
            const takerAddress = '0xd209925defc99488e3afff1174e48b4fa628302a';
            const apiKey = 'my-ko0l-api-key';
            // Set up RFQT responses
            // tslint:disable-next-line:array-type
            const mockedRequests = [];
            const expectedParams = {
                sellTokenAddress: takerToken,
                buyTokenAddress: makerToken,
                sellAmountBaseUnits: '10000',
                comparisonPrice: undefined,
                takerAddress,
            };
            // Successful response
            const successfulQuote1 = {
                makerAssetData,
                takerAssetData,
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
                responseData: Object.assign({}, successfulQuote1, { makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(otherToken1) }),
                responseCode: types_1.StatusCodes.Success,
            });
            // A successful response code and valid response data, but for wrong taker asset data
            mockedRequests.push({
                endpoint: 'https://423.0.0.1',
                requestApiKey: apiKey,
                requestParams: expectedParams,
                responseData: Object.assign({}, successfulQuote1, { takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(otherToken1) }),
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
            return rfqt_mocker_1.rfqtMocker.withMockedRfqtIndicativeQuotes(mockedRequests, () => __awaiter(this, void 0, void 0, function* () {
                const qr = new quote_requestor_1.QuoteRequestor({
                    'https://1337.0.0.1': [[makerToken, takerToken]],
                    'https://420.0.0.1': [[makerToken, takerToken]],
                    'https://421.0.0.1': [[makerToken, takerToken]],
                    'https://422.0.0.1': [[makerToken, takerToken]],
                    'https://423.0.0.1': [[makerToken, takerToken]],
                    'https://424.0.0.1': [[makerToken, takerToken]],
                    'https://37.0.0.1': [[makerToken, takerToken]],
                });
                const resp = yield qr.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, new utils_1.BigNumber(10000), types_2.MarketOperation.Sell, undefined, {
                    apiKey,
                    takerAddress,
                    intentOnFilling: true,
                });
                expect(resp.sort()).to.eql([successfulQuote1, successfulQuote1].sort());
            }), quote_requestor_1.quoteRequestorHttpClient);
        }));
        it('should return successful RFQT indicative quote requests', () => __awaiter(this, void 0, void 0, function* () {
            const takerAddress = '0xd209925defc99488e3afff1174e48b4fa628302a';
            const apiKey = 'my-ko0l-api-key';
            // Set up RFQT responses
            // tslint:disable-next-line:array-type
            const mockedRequests = [];
            const expectedParams = {
                sellTokenAddress: takerToken,
                buyTokenAddress: makerToken,
                buyAmountBaseUnits: '10000',
                comparisonPrice: undefined,
                takerAddress,
            };
            // Successful response
            const successfulQuote1 = {
                makerAssetData,
                takerAssetData,
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
            return rfqt_mocker_1.rfqtMocker.withMockedRfqtIndicativeQuotes(mockedRequests, () => __awaiter(this, void 0, void 0, function* () {
                const qr = new quote_requestor_1.QuoteRequestor({ 'https://1337.0.0.1': [[makerToken, takerToken]] });
                const resp = yield qr.requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, new utils_1.BigNumber(10000), types_2.MarketOperation.Buy, undefined, {
                    apiKey,
                    takerAddress,
                    intentOnFilling: true,
                });
                expect(resp.sort()).to.eql([successfulQuote1].sort());
            }), quote_requestor_1.quoteRequestorHttpClient);
        }));
    }));
}));
//# sourceMappingURL=quote_requestor_test.js.map