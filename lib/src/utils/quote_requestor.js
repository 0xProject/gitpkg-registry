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
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var axios_1 = require("axios");
var types_1 = require("../types");
/**
 * Request quotes from RFQ-T providers
 */
var QuoteRequestor = /** @class */ (function () {
    function QuoteRequestor(rfqtMakerEndpoints) {
        this._rfqtMakerEndpoints = rfqtMakerEndpoints;
    }
    QuoteRequestor.prototype.requestRfqtFirmQuotesAsync = function (makerAssetData, takerAssetData, assetFillAmount, marketOperation, intentOnFilling, takerApiKey, takerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, makerEndpointMaxResponseTimeMs, getTokenAddressOrThrow, buyToken, sellToken, responsePromises, _loop_1, _b, _c, rfqtMakerEndpoint, responsesIfDefined, responses, ordersWithStringInts, orders;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        makerEndpointMaxResponseTimeMs = 1000;
                        getTokenAddressOrThrow = function (assetData) {
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
                            else {
                                throw new Error("Decoded asset data (" + JSON.stringify(decodedAssetData) + ") does not contain a token address");
                            }
                        };
                        buyToken = getTokenAddressOrThrow(makerAssetData);
                        sellToken = getTokenAddressOrThrow(takerAssetData);
                        responsePromises = [];
                        _loop_1 = function (rfqtMakerEndpoint) {
                            responsePromises.push(axios_1.default
                                .get(rfqtMakerEndpoint + "/quote", {
                                headers: { '0x-api-key': takerApiKey },
                                params: {
                                    sellToken: sellToken,
                                    buyToken: buyToken,
                                    buyAmount: marketOperation === types_1.MarketOperation.Buy ? assetFillAmount.toString() : undefined,
                                    sellAmount: marketOperation === types_1.MarketOperation.Sell ? assetFillAmount.toString() : undefined,
                                    takerAddress: takerAddress,
                                },
                                timeout: makerEndpointMaxResponseTimeMs,
                            })
                                .catch(function (err) {
                                utils_1.logUtils.warn("Failed to get RFQ-T quote from market maker endpoint " + rfqtMakerEndpoint + " for API key " + takerApiKey + " for taker address " + takerAddress + ": " + JSON.stringify(err));
                                return undefined;
                            }));
                        };
                        try {
                            for (_b = __values(this._rfqtMakerEndpoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                                rfqtMakerEndpoint = _c.value;
                                _loop_1(rfqtMakerEndpoint);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [4 /*yield*/, Promise.all(responsePromises)];
                    case 1:
                        responsesIfDefined = _d.sent();
                        responses = responsesIfDefined.filter(function (respIfDefd) { return respIfDefd !== undefined; });
                        ordersWithStringInts = responses.map(function (response) { return response.data; });
                        orders = ordersWithStringInts.map(function (orderWithStringInts) {
                            return __assign({}, orderWithStringInts, { makerAssetAmount: new utils_1.BigNumber(orderWithStringInts.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(orderWithStringInts.takerAssetAmount), makerFee: new utils_1.BigNumber(orderWithStringInts.makerFee), takerFee: new utils_1.BigNumber(orderWithStringInts.takerFee), expirationTimeSeconds: new utils_1.BigNumber(orderWithStringInts.expirationTimeSeconds), salt: new utils_1.BigNumber(orderWithStringInts.salt) });
                        });
                        return [2 /*return*/, orders];
                }
            });
        });
    };
    return QuoteRequestor;
}());
exports.QuoteRequestor = QuoteRequestor;
//# sourceMappingURL=quote_requestor.js.map