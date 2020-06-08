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
Object.defineProperty(exports, "__esModule", { value: true });
var json_schemas_1 = require("@0x/json-schemas");
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var axios_1 = require("axios");
var constants_1 = require("../constants");
var types_1 = require("../types");
/**
 * Request quotes from RFQ-T providers
 */
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
            buyTokenAddress: getTokenAddressOrThrow(makerAssetData),
            sellTokenAddress: getTokenAddressOrThrow(takerAssetData),
            buyAmountBaseUnits: assetFillAmount,
            sellAmountBaseUnits: undefined,
        };
    }
    else {
        return {
            buyTokenAddress: getTokenAddressOrThrow(makerAssetData),
            sellTokenAddress: getTokenAddressOrThrow(takerAssetData),
            sellAmountBaseUnits: assetFillAmount,
            buyAmountBaseUnits: undefined,
        };
    }
}
function hasExpectedAssetData(expectedMakerAssetData, expectedTakerAssetData, makerAssetDataInQuestion, takerAssetDataInQuestion) {
    var hasExpectedMakerAssetData = makerAssetDataInQuestion.toLowerCase() === expectedMakerAssetData.toLowerCase();
    var hasExpectedTakerAssetData = takerAssetDataInQuestion.toLowerCase() === expectedTakerAssetData.toLowerCase();
    return hasExpectedMakerAssetData && hasExpectedTakerAssetData;
}
function convertIfAxiosError(error) {
    if (error.hasOwnProperty('isAxiosError') && error.isAxiosError && error.hasOwnProperty('toJSON')) {
        return error.toJSON();
    }
    else {
        return error;
    }
}
var QuoteRequestor = /** @class */ (function () {
    function QuoteRequestor(_rfqtAssetOfferings, _warningLogger, _infoLogger, _expiryBufferMs) {
        if (_warningLogger === void 0) { _warningLogger = function (obj, msg) {
            return utils_1.logUtils.warn("" + (msg ? msg + ": " : '') + JSON.stringify(obj));
        }; }
        if (_infoLogger === void 0) { _infoLogger = function (obj, msg) {
            return utils_1.logUtils.log("" + (msg ? msg + ": " : '') + JSON.stringify(obj));
        }; }
        if (_expiryBufferMs === void 0) { _expiryBufferMs = constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS.expiryBufferMs; }
        this._rfqtAssetOfferings = _rfqtAssetOfferings;
        this._warningLogger = _warningLogger;
        this._infoLogger = _infoLogger;
        this._expiryBufferMs = _expiryBufferMs;
        this._schemaValidator = new json_schemas_1.SchemaValidator();
    }
    QuoteRequestor.prototype.requestRfqtFirmQuotesAsync = function (makerAssetData, takerAssetData, assetFillAmount, marketOperation, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, firmQuotes, ordersWithStringInts, validatedOrdersWithStringInts, validatedOrders, orders;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _opts = __assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS, options);
                        assertTakerAddressOrThrow(_opts.takerAddress);
                        return [4 /*yield*/, this._getQuotesAsync(// not yet BigNumber
                            makerAssetData, takerAssetData, assetFillAmount, marketOperation, _opts, 'firm')];
                    case 1:
                        firmQuotes = _a.sent();
                        ordersWithStringInts = firmQuotes.map(function (quote) { return quote.signedOrder; });
                        validatedOrdersWithStringInts = ordersWithStringInts.filter(function (order) {
                            try {
                                var hasValidSchema = _this._schemaValidator.isValid(order, json_schemas_1.schemas.signedOrderSchema);
                                if (!hasValidSchema) {
                                    throw new Error('order not valid');
                                }
                            }
                            catch (err) {
                                _this._warningLogger(order, "Invalid RFQ-t order received, filtering out. " + err.message);
                                return false;
                            }
                            if (!hasExpectedAssetData(makerAssetData, takerAssetData, order.makerAssetData.toLowerCase(), order.takerAssetData.toLowerCase())) {
                                _this._warningLogger(order, 'Unexpected asset data in RFQ-T order, filtering out');
                                return false;
                            }
                            if (order.takerAddress.toLowerCase() !== _opts.takerAddress.toLowerCase()) {
                                _this._warningLogger(order, 'Unexpected takerAddress in RFQ-T order, filtering out');
                                return false;
                            }
                            return true;
                        });
                        validatedOrders = validatedOrdersWithStringInts.map(function (orderWithStringInts) {
                            return __assign({}, orderWithStringInts, { makerAssetAmount: new utils_1.BigNumber(orderWithStringInts.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(orderWithStringInts.takerAssetAmount), makerFee: new utils_1.BigNumber(orderWithStringInts.makerFee), takerFee: new utils_1.BigNumber(orderWithStringInts.takerFee), expirationTimeSeconds: new utils_1.BigNumber(orderWithStringInts.expirationTimeSeconds), salt: new utils_1.BigNumber(orderWithStringInts.salt) });
                        });
                        orders = validatedOrders.filter(function (order) {
                            if (order_utils_1.orderCalculationUtils.willOrderExpire(order, _this._expiryBufferMs / constants_1.constants.ONE_SECOND_MS)) {
                                _this._warningLogger(order, 'Expiry too soon in RFQ-T order, filtering out');
                                return false;
                            }
                            return true;
                        });
                        return [2 /*return*/, orders];
                }
            });
        });
    };
    QuoteRequestor.prototype.requestRfqtIndicativeQuotesAsync = function (makerAssetData, takerAssetData, assetFillAmount, marketOperation, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _opts, responsesWithStringInts, validResponsesWithStringInts, validResponses, responses;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _opts = __assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS, options);
                        assertTakerAddressOrThrow(_opts.takerAddress);
                        return [4 /*yield*/, this._getQuotesAsync(// not yet BigNumber
                            makerAssetData, takerAssetData, assetFillAmount, marketOperation, _opts, 'indicative')];
                    case 1:
                        responsesWithStringInts = _a.sent();
                        validResponsesWithStringInts = responsesWithStringInts.filter(function (response) {
                            if (!_this._isValidRfqtIndicativeQuoteResponse(response)) {
                                _this._warningLogger(response, 'Invalid RFQ-T indicative quote received, filtering out');
                                return false;
                            }
                            if (!hasExpectedAssetData(makerAssetData, takerAssetData, response.makerAssetData, response.takerAssetData)) {
                                _this._warningLogger(response, 'Unexpected asset data in RFQ-T indicative quote, filtering out');
                                return false;
                            }
                            return true;
                        });
                        validResponses = validResponsesWithStringInts.map(function (response) {
                            return __assign({}, response, { makerAssetAmount: new utils_1.BigNumber(response.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(response.takerAssetAmount), expirationTimeSeconds: new utils_1.BigNumber(response.expirationTimeSeconds) });
                        });
                        responses = validResponses.filter(function (response) {
                            if (_this._isExpirationTooSoon(response.expirationTimeSeconds)) {
                                _this._warningLogger(response, 'Expiry too soon in RFQ-T indicative quote, filtering out');
                                return false;
                            }
                            return true;
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
        var hasValidExpirationTimeSeconds = response.expirationTimeSeconds !== undefined &&
            this._schemaValidator.isValid(response.expirationTimeSeconds, json_schemas_1.schemas.wholeNumberSchema);
        if (hasValidMakerAssetAmount &&
            hasValidTakerAssetAmount &&
            hasValidMakerAssetData &&
            hasValidTakerAssetData &&
            hasValidExpirationTimeSeconds) {
            return true;
        }
        return false;
    };
    QuoteRequestor.prototype._makerSupportsPair = function (makerUrl, makerAssetData, takerAssetData) {
        var e_1, _a;
        var makerTokenAddress = getTokenAddressOrThrow(makerAssetData);
        var takerTokenAddress = getTokenAddressOrThrow(takerAssetData);
        try {
            for (var _b = __values(this._rfqtAssetOfferings[makerUrl]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var assetPair = _c.value;
                if ((assetPair[0] === makerTokenAddress && assetPair[1] === takerTokenAddress) ||
                    (assetPair[0] === takerTokenAddress && assetPair[1] === makerTokenAddress)) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    QuoteRequestor.prototype._isExpirationTooSoon = function (expirationTimeSeconds) {
        var expirationTimeMs = expirationTimeSeconds.times(constants_1.constants.ONE_SECOND_MS);
        var currentTimeMs = new utils_1.BigNumber(Date.now());
        return expirationTimeMs.isLessThan(currentTimeMs.plus(this._expiryBufferMs));
    };
    QuoteRequestor.prototype._getQuotesAsync = function (makerAssetData, takerAssetData, assetFillAmount, marketOperation, options, quoteType) {
        return __awaiter(this, void 0, void 0, function () {
            var responsesIfDefined, responses;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Object.keys(this._rfqtAssetOfferings).map(function (url) { return __awaiter(_this, void 0, void 0, function () {
                            var requestParams, partialLogEntry, timeBeforeAwait, quotePath, response, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this._makerSupportsPair(url, makerAssetData, takerAssetData)) return [3 /*break*/, 4];
                                        requestParams = __assign({ apiKey: options.apiKey, takerAddress: options.takerAddress }, inferQueryParams(marketOperation, makerAssetData, takerAssetData, assetFillAmount));
                                        partialLogEntry = { url: url, quoteType: quoteType, requestParams: requestParams };
                                        timeBeforeAwait = Date.now();
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        quotePath = (function () {
                                            switch (quoteType) {
                                                case 'firm':
                                                    return 'quote';
                                                    break;
                                                case 'indicative':
                                                    return 'price';
                                                    break;
                                                default:
                                                    throw new Error("Unexpected quote type " + quoteType);
                                            }
                                        })();
                                        return [4 /*yield*/, axios_1.default.get(url + "/" + quotePath, {
                                                headers: { '0x-api-key': options.apiKey },
                                                params: requestParams,
                                                timeout: options.makerEndpointMaxResponseTimeMs,
                                            })];
                                    case 2:
                                        response = _a.sent();
                                        this._infoLogger({
                                            rfqtMakerInteraction: __assign({}, partialLogEntry, { response: {
                                                    statusCode: response.status,
                                                    latencyMs: Date.now() - timeBeforeAwait,
                                                } }),
                                        });
                                        return [2 /*return*/, response];
                                    case 3:
                                        err_1 = _a.sent();
                                        this._infoLogger({
                                            rfqtMakerInteraction: __assign({}, partialLogEntry, { response: {
                                                    statusCode: err_1.code,
                                                    latencyMs: Date.now() - timeBeforeAwait,
                                                } }),
                                        });
                                        this._warningLogger(convertIfAxiosError(err_1), "Failed to get RFQ-T " + quoteType + " quote from market maker endpoint " + url + " for API key " + options.apiKey + " for taker address " + options.takerAddress);
                                        return [2 /*return*/, undefined];
                                    case 4: return [2 /*return*/, undefined];
                                }
                            });
                        }); }))];
                    case 1:
                        responsesIfDefined = _a.sent();
                        responses = responsesIfDefined.filter(function (respIfDefd) { return respIfDefd !== undefined; });
                        return [2 /*return*/, responses.map(function (response) { return response.data; })];
                }
            });
        });
    };
    return QuoteRequestor;
}());
exports.QuoteRequestor = QuoteRequestor;
//# sourceMappingURL=quote_requestor.js.map