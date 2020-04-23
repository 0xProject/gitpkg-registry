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
Object.defineProperty(exports, "__esModule", { value: true });
var json_schemas_1 = require("@0x/json-schemas");
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var axios_1 = require("axios");
var _ = require("lodash");
var constants_1 = require("../constants");
var types_1 = require("../types");
function getTokenAddressOrThrow(assetData) {
    var decodedAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(assetData);
    if (decodedAssetData.hasOwnProperty('tokenAddress')) {
        // type cast necessary here as decodeAssetDataOrThrow returns
        // an AssetData object, which doesn't necessarily contain a
        // token address.  (it could possibly be a StaticCallAssetData,
        // which lacks an address.)  so we'll just assume it's a token
        // here.  should be safe, with the enclosing guard condition
        // and subsequent error.
        // tslint:disable-next-line:no-unnecessary-type-assertion
        return decodedAssetData.tokenAddress;
    }
    throw new Error("Decoded asset data (" + JSON.stringify(decodedAssetData) + ") does not contain a token address");
}
function assertTakerAddressOrThrow(takerAddress) {
    if (takerAddress === undefined ||
        takerAddress === '' ||
        takerAddress === '0x' ||
        !takerAddress ||
        takerAddress === constants_1.constants.NULL_ADDRESS) {
        throw new Error('RFQ-T requires the presence of a taker address');
    }
}
function inferQueryParams(marketOperation, makerAssetData, takerAssetData, assetFillAmount) {
    if (marketOperation === types_1.MarketOperation.Buy) {
        return {
            buyToken: getTokenAddressOrThrow(makerAssetData),
            sellToken: getTokenAddressOrThrow(takerAssetData),
            buyAmount: assetFillAmount.toString(),
            sellAmount: undefined,
        };
    }
    else {
        return {
            buyToken: getTokenAddressOrThrow(makerAssetData),
            sellToken: getTokenAddressOrThrow(takerAssetData),
            sellAmount: assetFillAmount.toString(),
            buyAmount: undefined,
        };
    }
}
function hasExpectedAssetData(expectedMakerAssetData, expectedTakerAssetData, makerAssetDataInQuestion, takerAssetDataInQuestion) {
    var hasExpectedMakerAssetData = makerAssetDataInQuestion.toLowerCase() === expectedMakerAssetData.toLowerCase();
    var hasExpectedTakerAssetData = takerAssetDataInQuestion.toLowerCase() === expectedTakerAssetData.toLowerCase();
    return hasExpectedMakerAssetData && hasExpectedTakerAssetData;
}
var QuoteRequestor = /** @class */ (function () {
    function QuoteRequestor(rfqtMakerEndpoints, logger) {
        if (logger === void 0) { logger = utils_1.logUtils.warn; }
        this._schemaValidator = new json_schemas_1.SchemaValidator();
        this._rfqtMakerEndpoints = rfqtMakerEndpoints;
        this._warningLogger = logger;
        this._warningLogger('inside QuoteRequestor constructor');
    }
    QuoteRequestor.prototype.requestRfqtFirmQuotesAsync = function (makerAssetData, takerAssetData, assetFillAmount, marketOperation, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, responsesIfDefined, responses, ordersWithStringInts, validatedOrdersWithStringInts, orders;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._warningLogger('inside firm quotes');
                        _opts = _.merge({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS, options);
                        assertTakerAddressOrThrow(_opts.takerAddress);
                        return [4 /*yield*/, Promise.all(this._rfqtMakerEndpoints.map(function (rfqtMakerEndpoint) { return __awaiter(_this, void 0, void 0, function () {
                                var err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, axios_1.default.get(rfqtMakerEndpoint + "/quote", {
                                                    headers: { '0x-api-key': _opts.apiKey },
                                                    params: __assign({ takerAddress: _opts.takerAddress }, inferQueryParams(marketOperation, makerAssetData, takerAssetData, assetFillAmount)),
                                                    timeout: _opts.makerEndpointMaxResponseTimeMs,
                                                })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                        case 2:
                                            err_1 = _a.sent();
                                            utils_1.logUtils.log("failing");
                                            this._warningLogger("Failed to get RFQ-T firm quote from market maker endpoint " + rfqtMakerEndpoint + " for API key " + _opts.apiKey + " for taker address " + _opts.takerAddress);
                                            this._warningLogger(err_1);
                                            return [2 /*return*/, undefined];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        responsesIfDefined = _a.sent();
                        responses = responsesIfDefined.filter(function (respIfDefd) { return respIfDefd !== undefined; });
                        ordersWithStringInts = responses.map(function (response) { return response.data; });
                        validatedOrdersWithStringInts = ordersWithStringInts.filter(function (order) {
                            var hasValidSchema = _this._schemaValidator.isValid(order, json_schemas_1.schemas.signedOrderSchema);
                            if (!hasValidSchema) {
                                _this._warningLogger("Invalid RFQ-t order received, filtering out: " + JSON.stringify(order));
                                return false;
                            }
                            if (!hasExpectedAssetData(makerAssetData, takerAssetData, order.makerAssetData.toLowerCase(), order.takerAssetData.toLowerCase())) {
                                _this._warningLogger("Unexpected asset data in RFQ-T order, filtering out: " + JSON.stringify(order));
                                return false;
                            }
                            return true;
                        });
                        orders = validatedOrdersWithStringInts.map(function (orderWithStringInts) {
                            return __assign({}, orderWithStringInts, { makerAssetAmount: new utils_1.BigNumber(orderWithStringInts.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(orderWithStringInts.takerAssetAmount), makerFee: new utils_1.BigNumber(orderWithStringInts.makerFee), takerFee: new utils_1.BigNumber(orderWithStringInts.takerFee), expirationTimeSeconds: new utils_1.BigNumber(orderWithStringInts.expirationTimeSeconds), salt: new utils_1.BigNumber(orderWithStringInts.salt) });
                        });
                        return [2 /*return*/, orders];
                }
            });
        });
    };
    QuoteRequestor.prototype.requestRfqtIndicativeQuotesAsync = function (makerAssetData, takerAssetData, assetFillAmount, marketOperation, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, axiosResponsesIfDefined, axiosResponses, responsesWithStringInts, validResponsesWithStringInts, responses;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _opts = _.merge({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS, options);
                        assertTakerAddressOrThrow(_opts.takerAddress);
                        return [4 /*yield*/, Promise.all(this._rfqtMakerEndpoints.map(function (rfqtMakerEndpoint) { return __awaiter(_this, void 0, void 0, function () {
                                var err_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, axios_1.default.get(rfqtMakerEndpoint + "/price", {
                                                    headers: { '0x-api-key': options.apiKey },
                                                    params: __assign({ takerAddress: options.takerAddress }, inferQueryParams(marketOperation, makerAssetData, takerAssetData, assetFillAmount)),
                                                    timeout: options.makerEndpointMaxResponseTimeMs,
                                                })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                        case 2:
                                            err_2 = _a.sent();
                                            this._warningLogger("Failed to get RFQ-T indicative quote from market maker endpoint " + rfqtMakerEndpoint + " for API key " + options.apiKey + " for taker address " + options.takerAddress);
                                            this._warningLogger(err_2);
                                            return [2 /*return*/, undefined];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        axiosResponsesIfDefined = _a.sent();
                        axiosResponses = axiosResponsesIfDefined.filter(function (respIfDefd) { return respIfDefd !== undefined; });
                        responsesWithStringInts = axiosResponses.map(function (response) { return response.data; });
                        validResponsesWithStringInts = responsesWithStringInts.filter(function (response) {
                            if (!_this._isValidRfqtIndicativeQuoteResponse(response)) {
                                _this._warningLogger("Invalid RFQ-T indicative quote received, filtering out: " + JSON.stringify(response));
                                return false;
                            }
                            if (!hasExpectedAssetData(makerAssetData, takerAssetData, response.makerAssetData, response.takerAssetData)) {
                                _this._warningLogger("Unexpected asset data in RFQ-T indicative quote, filtering out: " + JSON.stringify(response));
                                return false;
                            }
                            return true;
                        });
                        responses = validResponsesWithStringInts.map(function (response) {
                            return __assign({}, response, { makerAssetAmount: new utils_1.BigNumber(response.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(response.takerAssetAmount) });
                        });
                        return [2 /*return*/, responses];
                }
            });
        });
    };
    QuoteRequestor.prototype._isValidRfqtIndicativeQuoteResponse = function (response) {
        var hasValidMakerAssetAmount = response.makerAssetAmount !== undefined &&
            this._schemaValidator.isValid(response.makerAssetAmount, json_schemas_1.schemas.wholeNumberSchema);
        var hasValidTakerAssetAmount = response.takerAssetAmount !== undefined &&
            this._schemaValidator.isValid(response.takerAssetAmount, json_schemas_1.schemas.wholeNumberSchema);
        var hasValidMakerAssetData = response.makerAssetData !== undefined &&
            this._schemaValidator.isValid(response.makerAssetData, json_schemas_1.schemas.hexSchema);
        var hasValidTakerAssetData = response.takerAssetData !== undefined &&
            this._schemaValidator.isValid(response.takerAssetData, json_schemas_1.schemas.hexSchema);
        if (hasValidMakerAssetAmount && hasValidTakerAssetAmount && hasValidMakerAssetData && hasValidTakerAssetData) {
            return true;
        }
        return false;
    };
    return QuoteRequestor;
}());
exports.QuoteRequestor = QuoteRequestor;
//# sourceMappingURL=quote_requestor.js.map