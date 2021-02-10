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
const protocol_utils_1 = require("@0x/protocol-utils");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const chai = require("chai");
const _ = require("lodash");
require("mocha");
const constants_1 = require("../src/constants");
const types_2 = require("../src/types");
const constants_2 = require("../src/utils/market_operation_utils/constants");
const quote_requestor_1 = require("../src/utils/quote_requestor");
const chai_setup_1 = require("./utils/chai_setup");
const test_helpers_1 = require("./utils/test_helpers");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
function makeThreeMinuteExpiry() {
    const expiry = new Date(Date.now());
    expiry.setMinutes(expiry.getMinutes() + 3);
    return new utils_1.BigNumber(Math.round(expiry.valueOf() / constants_1.constants.ONE_SECOND_MS));
}
describe('QuoteRequestor', () => __awaiter(this, void 0, void 0, function* () {
    const [makerToken, takerToken, otherToken1] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
    const validSignature = { v: 28, r: '0x', s: '0x', signatureType: protocol_utils_1.SignatureType.EthSign };
    describe('requestRfqtFirmQuotesAsync for firm quotes', () => __awaiter(this, void 0, void 0, function* () {
        it('should return successful RFQT requests', () => __awaiter(this, void 0, void 0, function* () {
            const takerAddress = '0xd209925defc99488e3afff1174e48b4fa628302a';
            const txOrigin = takerAddress;
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
                txOrigin,
                protocolVersion: '4',
            };
            const mockedDefaults = {
                requestApiKey: apiKey,
                requestParams: expectedParams,
                responseCode: types_1.StatusCodes.Success,
            };
            const validSignedOrder = {
                makerToken,
                takerToken,
                makerAmount: new utils_1.BigNumber('1000'),
                takerAmount: new utils_1.BigNumber('1000'),
                maker: takerAddress,
                taker: takerAddress,
                pool: '0x',
                salt: '0',
                chainId: 1,
                verifyingContract: takerAddress,
                txOrigin,
                expiry: makeThreeMinuteExpiry(),
                signature: validSignature,
            };
            // Successful response
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://1337.0.0.1', responseData: {
                    signedOrder: validSignedOrder,
                } }));
            // Another Successful response
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://37.0.0.1', responseData: { signedOrder: validSignedOrder } }));
            // Test out a bad response code, ensure it doesnt cause throw
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://420.0.0.1', responseData: { error: 'bad request' }, responseCode: types_1.StatusCodes.InternalError }));
            // Test out a successful response code but a partial order
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://421.0.0.1', responseData: { signedOrder: { makerToken: '123' } } }));
            // A successful response code and invalid response data (encoding)
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://421.1.0.1', responseData: 'this is not JSON!' }));
            // A successful response code and valid order, but for wrong maker asset data
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://422.0.0.1', responseData: { signedOrder: Object.assign({}, validSignedOrder, { makerToken: '0x1234' }) } }));
            // A successful response code and valid order, but for wrong taker asset data
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://423.0.0.1', responseData: { signedOrder: Object.assign({}, validSignedOrder, { takerToken: '0x1234' }) } }));
            // A successful response code and good order but its unsigned
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://424.0.0.1', responseData: { signedOrder: _.omit(validSignedOrder, ['signature']) } }));
            // A successful response code and good order but for the wrong txOrigin
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://425.0.0.1', responseData: { signedOrder: Object.assign({}, validSignedOrder, { txOrigin: constants_2.NULL_ADDRESS }) } }));
            const normalizedSuccessfulOrder = {
                order: Object.assign({}, _.omit(validSignedOrder, ['signature']), { makerAmount: new utils_1.BigNumber(validSignedOrder.makerAmount), takerAmount: new utils_1.BigNumber(validSignedOrder.takerAmount), expiry: new utils_1.BigNumber(validSignedOrder.expiry), salt: new utils_1.BigNumber(validSignedOrder.salt) }),
                signature: validSignedOrder.signature,
                type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
            };
            return test_helpers_1.testHelpers.withMockedRfqtQuotes(mockedRequests, test_helpers_1.RfqtQuoteEndpoint.Firm, () => __awaiter(this, void 0, void 0, function* () {
                const qr = new quote_requestor_1.QuoteRequestor({
                    'https://1337.0.0.1': [[makerToken, takerToken]],
                    'https://420.0.0.1': [[makerToken, takerToken]],
                    'https://421.0.0.1': [[makerToken, takerToken]],
                    'https://421.1.0.1': [[makerToken, takerToken]],
                    'https://422.0.0.1': [[makerToken, takerToken]],
                    'https://423.0.0.1': [[makerToken, takerToken]],
                    'https://424.0.0.1': [[makerToken, takerToken]],
                    'https://425.0.0.1': [[makerToken, takerToken]],
                    'https://426.0.0.1': [] /* Shouldn't ping an RFQ-T provider when they don't support the requested asset pair. */,
                    'https://37.0.0.1': [[makerToken, takerToken]],
                });
                const resp = yield qr.requestRfqtFirmQuotesAsync(makerToken, takerToken, new utils_1.BigNumber(10000), types_2.MarketOperation.Sell, undefined, {
                    apiKey,
                    takerAddress,
                    txOrigin: takerAddress,
                    intentOnFilling: true,
                });
                expect(resp).to.deep.eq([normalizedSuccessfulOrder, normalizedSuccessfulOrder]);
            }), quote_requestor_1.quoteRequestorHttpClient);
        }));
    }));
    describe('requestRfqtIndicativeQuotesAsync for Indicative quotes', () => __awaiter(this, void 0, void 0, function* () {
        it('should optionally accept a "comparisonPrice" parameter', () => __awaiter(this, void 0, void 0, function* () {
            const response = quote_requestor_1.QuoteRequestor.makeQueryParameters(otherToken1, // tx origin
            otherToken1, // taker
            types_2.MarketOperation.Sell, makerToken, takerToken, new utils_1.BigNumber(1000), new utils_1.BigNumber(300.2));
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
                txOrigin: takerAddress,
                protocolVersion: '4',
            };
            const mockedDefaults = {
                requestApiKey: apiKey,
                requestParams: expectedParams,
                responseCode: types_1.StatusCodes.Success,
            };
            // Successful response
            const successfulQuote1 = {
                makerToken,
                takerToken,
                makerAmount: new utils_1.BigNumber(expectedParams.sellAmountBaseUnits),
                takerAmount: new utils_1.BigNumber(expectedParams.sellAmountBaseUnits),
                expiry: makeThreeMinuteExpiry(),
            };
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://1337.0.0.1', responseData: successfulQuote1 }));
            // Test out a bad response code, ensure it doesnt cause throw
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://420.0.0.1', responseData: { error: 'bad request' }, responseCode: types_1.StatusCodes.InternalError }));
            // Test out a successful response code but an invalid order
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://421.0.0.1', responseData: { makerToken: '123' } }));
            // A successful response code and valid response data, but for wrong maker asset data
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://422.0.0.1', responseData: Object.assign({}, successfulQuote1, { makerToken: otherToken1 }) }));
            // A successful response code and valid response data, but for wrong taker asset data
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://423.0.0.1', responseData: Object.assign({}, successfulQuote1, { takerToken: otherToken1 }) }));
            // Another Successful response
            mockedRequests.push(Object.assign({}, mockedDefaults, { endpoint: 'https://37.0.0.1', responseData: successfulQuote1 }));
            return test_helpers_1.testHelpers.withMockedRfqtQuotes(mockedRequests, test_helpers_1.RfqtQuoteEndpoint.Indicative, () => __awaiter(this, void 0, void 0, function* () {
                const qr = new quote_requestor_1.QuoteRequestor({
                    'https://1337.0.0.1': [[makerToken, takerToken]],
                    'https://420.0.0.1': [[makerToken, takerToken]],
                    'https://421.0.0.1': [[makerToken, takerToken]],
                    'https://422.0.0.1': [[makerToken, takerToken]],
                    'https://423.0.0.1': [[makerToken, takerToken]],
                    'https://424.0.0.1': [[makerToken, takerToken]],
                    'https://37.0.0.1': [[makerToken, takerToken]],
                });
                const resp = yield qr.requestRfqtIndicativeQuotesAsync(makerToken, takerToken, new utils_1.BigNumber(10000), types_2.MarketOperation.Sell, undefined, {
                    apiKey,
                    takerAddress,
                    txOrigin: takerAddress,
                    intentOnFilling: true,
                });
                expect(resp.sort()).to.eql([successfulQuote1, successfulQuote1].sort());
            }), quote_requestor_1.quoteRequestorHttpClient);
        }));
        it('should return successful RFQT indicative quote requests (Buy)', () => __awaiter(this, void 0, void 0, function* () {
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
                txOrigin: takerAddress,
                protocolVersion: '4',
            };
            // Successful response
            const successfulQuote1 = {
                makerToken,
                takerToken,
                makerAmount: new utils_1.BigNumber(expectedParams.buyAmountBaseUnits),
                takerAmount: new utils_1.BigNumber(expectedParams.buyAmountBaseUnits),
                expiry: makeThreeMinuteExpiry(),
            };
            mockedRequests.push({
                endpoint: 'https://1337.0.0.1',
                requestApiKey: apiKey,
                requestParams: expectedParams,
                responseData: successfulQuote1,
                responseCode: types_1.StatusCodes.Success,
            });
            return test_helpers_1.testHelpers.withMockedRfqtQuotes(mockedRequests, test_helpers_1.RfqtQuoteEndpoint.Indicative, () => __awaiter(this, void 0, void 0, function* () {
                const qr = new quote_requestor_1.QuoteRequestor({ 'https://1337.0.0.1': [[makerToken, takerToken]] });
                const resp = yield qr.requestRfqtIndicativeQuotesAsync(makerToken, takerToken, new utils_1.BigNumber(10000), types_2.MarketOperation.Buy, undefined, {
                    apiKey,
                    takerAddress,
                    txOrigin: takerAddress,
                    intentOnFilling: true,
                });
                expect(resp.sort()).to.eql([successfulQuote1].sort());
            }), quote_requestor_1.quoteRequestorHttpClient);
        }));
    }));
}));
//# sourceMappingURL=quote_requestor_test.js.map