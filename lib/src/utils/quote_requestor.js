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
const constants_1 = require("../constants");
const types_1 = require("../types");
const alt_mm_implementation_utils_1 = require("./alt_mm_implementation_utils");
const rfq_maker_blacklist_1 = require("./rfq_maker_blacklist");
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
    constructor(_rfqtAssetOfferings, _quoteRequestorHttpClient, _altRfqCreds, _warningLogger = constants_1.constants.DEFAULT_WARNING_LOGGER, _infoLogger = constants_1.constants.DEFAULT_INFO_LOGGER, _expiryBufferMs = constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS.expiryBufferMs) {
        this._rfqtAssetOfferings = _rfqtAssetOfferings;
        this._quoteRequestorHttpClient = _quoteRequestorHttpClient;
        this._altRfqCreds = _altRfqCreds;
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
        return this._orderSignatureToMakerUri[nativeDataToId({ signature })];
    }
    _isValidRfqtIndicativeQuoteResponse(response) {
        const requiredKeys = [
            'makerAmount',
            'takerAmount',
            'makerToken',
            'takerToken',
            'expiry',
        ];
        for (const k of requiredKeys) {
            if (response[k] === undefined) {
                return false;
            }
        }
        // TODO (jacob): I have a feeling checking 5 schemas is slower then checking one
        const hasValidMakerAssetAmount = this._schemaValidator.isValid(response.makerAmount, json_schemas_1.schemas.wholeNumberSchema);
        const hasValidTakerAssetAmount = this._schemaValidator.isValid(response.takerAmount, json_schemas_1.schemas.wholeNumberSchema);
        const hasValidMakerToken = this._schemaValidator.isValid(response.makerToken, json_schemas_1.schemas.hexSchema);
        const hasValidTakerToken = this._schemaValidator.isValid(response.takerToken, json_schemas_1.schemas.hexSchema);
        const hasValidExpirationTimeSeconds = this._schemaValidator.isValid(response.expiry, json_schemas_1.schemas.wholeNumberSchema);
        if (!hasValidMakerAssetAmount ||
            !hasValidTakerAssetAmount ||
            !hasValidMakerToken ||
            !hasValidTakerToken ||
            !hasValidExpirationTimeSeconds) {
            return false;
        }
        return true;
    }
    _makerSupportsPair(typedMakerUrl, makerToken, takerToken, altMakerAssetOfferings) {
        if (typedMakerUrl.pairType === types_1.RfqPairType.Standard) {
            for (const assetPair of this._rfqtAssetOfferings[typedMakerUrl.url]) {
                if ((assetPair[0] === makerToken && assetPair[1] === takerToken) ||
                    (assetPair[0] === takerToken && assetPair[1] === makerToken)) {
                    return true;
                }
            }
        }
        else if (typedMakerUrl.pairType === types_1.RfqPairType.Alt && altMakerAssetOfferings) {
            for (const altAssetPair of altMakerAssetOfferings[typedMakerUrl.url]) {
                if ((altAssetPair.baseAsset === makerToken && altAssetPair.quoteAsset === takerToken) ||
                    (altAssetPair.baseAsset === takerToken && altAssetPair.quoteAsset === makerToken)) {
                    return true;
                }
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
            const standardUrls = Object.keys(this._rfqtAssetOfferings).map((mm) => {
                return { pairType: types_1.RfqPairType.Standard, url: mm };
            });
            const altUrls = options.altRfqtAssetOfferings
                ? Object.keys(options.altRfqtAssetOfferings).map((mm) => {
                    return { pairType: types_1.RfqPairType.Alt, url: mm };
                })
                : [];
            const typedMakerUrls = standardUrls.concat(altUrls);
            const quotePromises = typedMakerUrls.map((typedMakerUrl) => __awaiter(this, void 0, void 0, function* () {
                // filter out requests to skip
                const isBlacklisted = rfqMakerBlacklist.isMakerBlacklisted(typedMakerUrl.url);
                const partialLogEntry = { url: typedMakerUrl.url, quoteType, requestParams, isBlacklisted };
                if (isBlacklisted) {
                    this._infoLogger({ rfqtMakerInteraction: Object.assign({}, partialLogEntry) });
                    return;
                }
                else if (!this._makerSupportsPair(typedMakerUrl, makerToken, takerToken, options.altRfqtAssetOfferings)) {
                    return;
                }
                else {
                    // make request to MM
                    const timeBeforeAwait = Date.now();
                    const maxResponseTimeMs = options.makerEndpointMaxResponseTimeMs === undefined
                        ? constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS.makerEndpointMaxResponseTimeMs
                        : options.makerEndpointMaxResponseTimeMs;
                    try {
                        if (typedMakerUrl.pairType === types_1.RfqPairType.Standard) {
                            const response = yield this._quoteRequestorHttpClient.get(`${typedMakerUrl.url}/${quotePath}`, {
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
                            rfqMakerBlacklist.logTimeoutOrLackThereof(typedMakerUrl.url, latencyMs >= maxResponseTimeMs);
                            return { response: response.data, makerUri: typedMakerUrl.url };
                        }
                        else {
                            if (this._altRfqCreds === undefined) {
                                throw new Error(`don't have credentials for alt MM`);
                            }
                            const quote = yield alt_mm_implementation_utils_1.returnQuoteFromAltMMAsync(typedMakerUrl.url, this._altRfqCreds.altRfqApiKey, this._altRfqCreds.altRfqProfile, options.apiKey, quoteType === 'firm' ? types_1.AltQuoteModel.Firm : types_1.AltQuoteModel.Indicative, makerToken, takerToken, maxResponseTimeMs, options.altRfqtAssetOfferings || {}, requestParams, this._quoteRequestorHttpClient);
                            const latencyMs = Date.now() - timeBeforeAwait;
                            this._infoLogger({
                                rfqtMakerInteraction: Object.assign({}, partialLogEntry, { response: {
                                        included: true,
                                        apiKey: options.apiKey,
                                        takerAddress: requestParams.takerAddress,
                                        txOrigin: requestParams.txOrigin,
                                        statusCode: quote.status,
                                        latencyMs,
                                    } }),
                            });
                            rfqMakerBlacklist.logTimeoutOrLackThereof(typedMakerUrl.url, latencyMs >= maxResponseTimeMs);
                            return { response: quote.data, makerUri: typedMakerUrl.url };
                        }
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
                        rfqMakerBlacklist.logTimeoutOrLackThereof(typedMakerUrl.url, latencyMs >= maxResponseTimeMs);
                        this._warningLogger(convertIfAxiosError(err), `Failed to get RFQ-T ${quoteType} quote from market maker endpoint ${typedMakerUrl.url} for API key ${options.apiKey} for taker address ${options.takerAddress} and tx origin ${options.txOrigin}`);
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