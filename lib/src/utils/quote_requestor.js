"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_schemas_1 = require("@0x/json-schemas");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const axios_1 = require("axios");
const http_1 = require("http");
const https_1 = require("https");
const constants_1 = require("../constants");
const types_1 = require("../types");
const constants_2 = require("./market_operation_utils/constants");
const rfq_maker_blacklist_1 = require("./rfq_maker_blacklist");
// tslint:disable-next-line: custom-no-magic-numbers
const KEEP_ALIVE_TTL = 5 * 60 * constants_2.ONE_SECOND_MS;
exports.quoteRequestorHttpClient = axios_1.default.create({
    httpAgent: new http_1.Agent({ keepAlive: true, timeout: KEEP_ALIVE_TTL }),
    httpsAgent: new https_1.Agent({ keepAlive: true, timeout: KEEP_ALIVE_TTL }),
});
const MAKER_TIMEOUT_STREAK_LENGTH = 10;
const MAKER_TIMEOUT_BLACKLIST_DURATION_MINUTES = 10;
const rfqMakerBlacklist = new rfq_maker_blacklist_1.RfqMakerBlacklist(MAKER_TIMEOUT_STREAK_LENGTH, MAKER_TIMEOUT_BLACKLIST_DURATION_MINUTES);
/**
 * Request quotes from RFQ-T providers
 */
function hasExpectedAddresses(comparisons) {
    return comparisons.every(c => c[0].toLowerCase() === c[1].toLowerCase());
}
function convertIfAxiosError(error) {
    if (error.hasOwnProperty('isAxiosError') && error.isAxiosError) {
        const { message, name, config } = error;
        const { headers, timeout, httpsAgent } = config;
        const { keepAlive, keepAliveMsecs, sockets } = httpsAgent;
        const socketCounts = {};
        for (const socket of Object.keys(sockets)) {
            socketCounts[socket] = sockets[socket].length;
        }
        return {
            message,
            name,
            config: {
                headers,
                timeout,
                httpsAgent: {
                    keepAlive,
                    keepAliveMsecs,
                    socketCounts,
                },
            },
        };
    }
    else {
        return error;
    }
}
function nativeDataToId(data) {
    const { v, r, s } = data.signature;
    return `${v}${r}${s}`;
}
class QuoteRequestor {
    constructor(_rfqtAssetOfferings, _warningLogger = constants_1.constants.DEFAULT_WARNING_LOGGER, _infoLogger = constants_1.constants.DEFAULT_INFO_LOGGER, _expiryBufferMs = constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS.expiryBufferMs) {
        this._rfqtAssetOfferings = _rfqtAssetOfferings;
        this._warningLogger = _warningLogger;
        this._infoLogger = _infoLogger;
        this._expiryBufferMs = _expiryBufferMs;
        this._schemaValidator = new json_schemas_1.SchemaValidator();
        this._orderSignatureToMakerUri = {};
        rfqMakerBlacklist.infoLogger = this._infoLogger;
    }
    static makeQueryParameters(txOrigin, takerAddress, marketOperation, buyTokenAddress, // maker token
    sellTokenAddress, // taker token
    assetFillAmount, comparisonPrice) {
        const { buyAmountBaseUnits, sellAmountBaseUnits } = marketOperation === types_1.MarketOperation.Buy
            ? {
                buyAmountBaseUnits: assetFillAmount,
                sellAmountBaseUnits: undefined,
            }
            : {
                sellAmountBaseUnits: assetFillAmount,
                buyAmountBaseUnits: undefined,
            };
        const requestParamsWithBigNumbers = {
            txOrigin,
            takerAddress,
            comparisonPrice: comparisonPrice === undefined ? undefined : comparisonPrice.toString(),
            buyTokenAddress,
            sellTokenAddress,
            protocolVersion: '4',
        };
        // convert BigNumbers to strings
        // so they are digestible by axios
        if (sellAmountBaseUnits) {
            return Object.assign({}, requestParamsWithBigNumbers, { sellAmountBaseUnits: sellAmountBaseUnits.toString() });
        }
        else if (buyAmountBaseUnits) {
            return Object.assign({}, requestParamsWithBigNumbers, { buyAmountBaseUnits: buyAmountBaseUnits.toString() });
        }
        else {
            throw new Error('Neither "buyAmountBaseUnits" or "sellAmountBaseUnits" were defined');
        }
    }
    requestRfqtFirmQuotesAsync(makerToken, // maker token
    takerToken, // taker token
    assetFillAmount, marketOperation, comparisonPrice, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS, options);
            if (!_opts.txOrigin || [undefined, '', '0x', utils_1.NULL_ADDRESS].includes(_opts.txOrigin)) {
                throw new Error('RFQ-T firm quotes require the presence of a tx origin');
            }
            const quotesRaw = yield this._getQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, _opts, 'firm');
            const quotes = quotesRaw.map(result => (Object.assign({}, result, { response: result.response.signedOrder })));
            // validate
            const validationFunction = (o) => {
                try {
                    // Handle the validate throwing, i.e if it isn't an object or json response
                    return this._schemaValidator.isValid(o, json_schemas_1.schemas.v4RfqSignedOrderSchema);
                }
                catch (e) {
                    return false;
                }
            };
            const validQuotes = quotes.filter(result => {
                const order = result.response;
                if (!validationFunction(order)) {
                    this._warningLogger(result, 'Invalid RFQ-T firm quote received, filtering out');
                    return false;
                }
                if (!hasExpectedAddresses([
                    [makerToken, order.makerToken],
                    [takerToken, order.takerToken],
                    [_opts.takerAddress, order.taker],
                    [_opts.txOrigin, order.txOrigin],
                ])) {
                    this._warningLogger(order, 'Unexpected token, tx origin or taker address in RFQ-T order, filtering out');
                    return false;
                }
                if (this._isExpirationTooSoon(new utils_1.BigNumber(order.expiry))) {
                    this._warningLogger(order, 'Expiry too soon in RFQ-T firm quote, filtering out');
                    return false;
                }
                else {
                    return true;
                }
            });
            // Save the maker URI for later and return just the order
            const rfqQuotes = validQuotes.map(result => {
                const _a = result.response, { signature } = _a, rest = __rest(_a, ["signature"]);
                const order = {
                    order: Object.assign({}, rest, { makerAmount: new utils_1.BigNumber(result.response.makerAmount), takerAmount: new utils_1.BigNumber(result.response.takerAmount), expiry: new utils_1.BigNumber(result.response.expiry), salt: new utils_1.BigNumber(result.response.salt) }),
                    type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
                    signature,
                };
                this._orderSignatureToMakerUri[nativeDataToId(result.response)] = result.makerUri;
                return order;
            });
            return rfqQuotes;
        });
    }
    requestRfqtIndicativeQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS, options);
            // Originally a takerAddress was required for indicative quotes, but
            // now we've eliminated that requirement.  @0x/quote-server, however,
            // is still coded to expect a takerAddress.  So if the client didn't
            // send one, just use the null address to satisfy the quote server's
            // expectations.
            if (!_opts.takerAddress) {
                _opts.takerAddress = constants_1.constants.NULL_ADDRESS;
            }
            if (!_opts.txOrigin) {
                _opts.txOrigin = constants_1.constants.NULL_ADDRESS;
            }
            const rawQuotes = yield this._getQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, _opts, 'indicative');
            // validate
            const validationFunction = (o) => this._isValidRfqtIndicativeQuoteResponse(o);
            const validQuotes = rawQuotes.filter(result => {
                const order = result.response;
                if (!validationFunction(order)) {
                    this._warningLogger(result, 'Invalid RFQ-T indicative quote received, filtering out');
                    return false;
                }
                if (!hasExpectedAddresses([[makerToken, order.makerToken], [takerToken, order.takerToken]])) {
                    this._warningLogger(order, 'Unexpected token or taker address in RFQ-T order, filtering out');
                    return false;
                }
                if (this._isExpirationTooSoon(new utils_1.BigNumber(order.expiry))) {
                    this._warningLogger(order, 'Expiry too soon in RFQ-T indicative quote, filtering out');
                    return false;
                }
                else {
                    return true;
                }
            });
            const quotes = validQuotes.map(r => r.response);
            quotes.forEach(q => {
                q.makerAmount = new utils_1.BigNumber(q.makerAmount);
                q.takerAmount = new utils_1.BigNumber(q.takerAmount);
                q.expiry = new utils_1.BigNumber(q.expiry);
            });
            return quotes;
        });
    }
    /**
     * Given an order signature, returns the makerUri that the order originated from
     */
    getMakerUriForSignature(signature) {
        return this._orderSignatureToMakerUri[signature.toString()]; // todo (xianny): hack
    }
    _isValidRfqtIndicativeQuoteResponse(response) {
        // TODO (jacob): I have a feeling checking 5 schemas is slower then checking one
        const hasValidMakerAssetAmount = response.makerAmount !== undefined &&
            this._schemaValidator.isValid(response.makerAmount, json_schemas_1.schemas.wholeNumberSchema);
        const hasValidTakerAssetAmount = response.takerAmount !== undefined &&
            this._schemaValidator.isValid(response.takerAmount, json_schemas_1.schemas.wholeNumberSchema);
        const hasValidMakerToken = response.makerToken !== undefined && this._schemaValidator.isValid(response.makerToken, json_schemas_1.schemas.hexSchema);
        const hasValidTakerToken = response.takerToken !== undefined && this._schemaValidator.isValid(response.takerToken, json_schemas_1.schemas.hexSchema);
        const hasValidExpirationTimeSeconds = response.expiry !== undefined && this._schemaValidator.isValid(response.expiry, json_schemas_1.schemas.wholeNumberSchema);
        if (hasValidMakerAssetAmount &&
            hasValidTakerAssetAmount &&
            hasValidMakerToken &&
            hasValidTakerToken &&
            hasValidExpirationTimeSeconds) {
            return true;
        }
        return false;
    }
    _makerSupportsPair(makerUrl, makerToken, takerToken) {
        for (const assetPair of this._rfqtAssetOfferings[makerUrl]) {
            if ((assetPair[0] === makerToken && assetPair[1] === takerToken) ||
                (assetPair[0] === takerToken && assetPair[1] === makerToken)) {
                return true;
            }
        }
        return false;
    }
    _isExpirationTooSoon(expirationTimeSeconds) {
        const expirationTimeMs = expirationTimeSeconds.times(constants_1.constants.ONE_SECOND_MS);
        const currentTimeMs = new utils_1.BigNumber(Date.now());
        return expirationTimeMs.isLessThan(currentTimeMs.plus(this._expiryBufferMs));
    }
    _getQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options, quoteType) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestParams = QuoteRequestor.makeQueryParameters(options.txOrigin, options.takerAddress, marketOperation, makerToken, takerToken, assetFillAmount, comparisonPrice);
            const quotePath = (() => {
                switch (quoteType) {
                    case 'firm':
                        return 'quote';
                    case 'indicative':
                        return 'price';
                    default:
                        throw new Error(`Unexpected quote type ${quoteType}`);
                }
            })();
            const makerUrls = Object.keys(this._rfqtAssetOfferings);
            const quotePromises = makerUrls.map((url) => __awaiter(this, void 0, void 0, function* () {
                // filter out requests to skip
                const isBlacklisted = rfqMakerBlacklist.isMakerBlacklisted(url);
                const partialLogEntry = { url, quoteType, requestParams, isBlacklisted };
                if (isBlacklisted) {
                    this._infoLogger({ rfqtMakerInteraction: Object.assign({}, partialLogEntry) });
                    return;
                }
                else if (!this._makerSupportsPair(url, makerToken, takerToken)) {
                    return;
                }
                else {
                    // make request to MMs
                    const timeBeforeAwait = Date.now();
                    const maxResponseTimeMs = options.makerEndpointMaxResponseTimeMs === undefined
                        ? constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS.makerEndpointMaxResponseTimeMs
                        : options.makerEndpointMaxResponseTimeMs;
                    try {
                        const response = yield exports.quoteRequestorHttpClient.get(`${url}/${quotePath}`, {
                            headers: { '0x-api-key': options.apiKey },
                            params: requestParams,
                            timeout: maxResponseTimeMs,
                        });
                        const latencyMs = Date.now() - timeBeforeAwait;
                        this._infoLogger({
                            rfqtMakerInteraction: Object.assign({}, partialLogEntry, { response: {
                                    included: true,
                                    apiKey: options.apiKey,
                                    takerAddress: requestParams.takerAddress,
                                    txOrigin: requestParams.txOrigin,
                                    statusCode: response.status,
                                    latencyMs,
                                } }),
                        });
                        rfqMakerBlacklist.logTimeoutOrLackThereof(url, latencyMs >= maxResponseTimeMs);
                        return { response: response.data, makerUri: url };
                    }
                    catch (err) {
                        // log error if any
                        const latencyMs = Date.now() - timeBeforeAwait;
                        this._infoLogger({
                            rfqtMakerInteraction: Object.assign({}, partialLogEntry, { response: {
                                    included: false,
                                    apiKey: options.apiKey,
                                    takerAddress: requestParams.takerAddress,
                                    txOrigin: requestParams.txOrigin,
                                    statusCode: err.response ? err.response.status : undefined,
                                    latencyMs,
                                } }),
                        });
                        rfqMakerBlacklist.logTimeoutOrLackThereof(url, latencyMs >= maxResponseTimeMs);
                        this._warningLogger(convertIfAxiosError(err), `Failed to get RFQ-T ${quoteType} quote from market maker endpoint ${url} for API key ${options.apiKey} for taker address ${options.takerAddress} and tx origin ${options.txOrigin}`);
                        return;
                    }
                }
            }));
            const results = (yield Promise.all(quotePromises)).filter(x => x !== undefined);
            return results;
        });
    }
}
exports.QuoteRequestor = QuoteRequestor;
//# sourceMappingURL=quote_requestor.js.map