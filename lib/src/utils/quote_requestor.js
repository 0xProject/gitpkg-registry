"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteRequestor = void 0;
const json_schemas_1 = require("@0x/json-schemas");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const axios_1 = require("axios");
const constants_1 = require("../constants");
const types_1 = require("../types");
const alt_mm_implementation_utils_1 = require("./alt_mm_implementation_utils");
const constants_2 = require("./market_operation_utils/constants");
const rfq_maker_blacklist_1 = require("./rfq_maker_blacklist");
const MAKER_TIMEOUT_STREAK_LENGTH = 10;
const MAKER_TIMEOUT_BLACKLIST_DURATION_MINUTES = 10;
const FILL_RATIO_WARNING_LEVEL = 0.99;
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
    constructor(_rfqtAssetOfferings, _rfqmAssetOfferings, _quoteRequestorHttpClient, _altRfqCreds, _warningLogger = constants_1.constants.DEFAULT_WARNING_LOGGER, _infoLogger = constants_1.constants.DEFAULT_INFO_LOGGER, _expiryBufferMs = constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS.expiryBufferMs, _metrics) {
        this._rfqtAssetOfferings = _rfqtAssetOfferings;
        this._rfqmAssetOfferings = _rfqmAssetOfferings;
        this._quoteRequestorHttpClient = _quoteRequestorHttpClient;
        this._altRfqCreds = _altRfqCreds;
        this._warningLogger = _warningLogger;
        this._infoLogger = _infoLogger;
        this._expiryBufferMs = _expiryBufferMs;
        this._metrics = _metrics;
        this._schemaValidator = new json_schemas_1.SchemaValidator();
        this._orderSignatureToMakerUri = {};
        rfqMakerBlacklist.infoLogger = this._infoLogger;
    }
    static makeQueryParameters(txOrigin, takerAddress, marketOperation, buyTokenAddress, // maker token
    sellTokenAddress, // taker token
    assetFillAmount, comparisonPrice, isLastLook, fee) {
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
            buyTokenAddress,
            sellTokenAddress,
            comparisonPrice: comparisonPrice === undefined ? undefined : comparisonPrice.toString(),
            protocolVersion: '4',
        };
        if (isLastLook) {
            if (fee === undefined) {
                throw new Error(`isLastLook cannot be passed without a fee parameter`);
            }
            requestParamsWithBigNumbers.isLastLook = isLastLook.toString();
            requestParamsWithBigNumbers.feeAmount = fee.amount.toString();
            requestParamsWithBigNumbers.feeToken = fee.token;
            requestParamsWithBigNumbers.feeType = fee.type;
        }
        // convert BigNumbers to strings
        // so they are digestible by axios
        if (sellAmountBaseUnits) {
            return Object.assign(Object.assign({}, requestParamsWithBigNumbers), { sellAmountBaseUnits: sellAmountBaseUnits.toString() });
        }
        else if (buyAmountBaseUnits) {
            return Object.assign(Object.assign({}, requestParamsWithBigNumbers), { buyAmountBaseUnits: buyAmountBaseUnits.toString() });
        }
        else {
            throw new Error('Neither "buyAmountBaseUnits" or "sellAmountBaseUnits" were defined');
        }
    }
    /**
     * Gets both standard RFQ makers and "alternative" RFQ makers and combines them together
     * in a single configuration map. If an integration key whitelist is present, it will be used
     * to filter a specific makers.
     *
     * @param options the RfqmRequestOptions passed in
     * @param assetOfferings the RFQM or RFQT maker offerings
     * @returns a list of TypedMakerUrl instances
     */
    static getTypedMakerUrlsAndWhitelist(options, assetOfferings) {
        const standardUrls = Object.keys(assetOfferings).map((mm) => {
            return { pairType: types_1.RfqPairType.Standard, url: mm };
        });
        const altUrls = options.altRfqAssetOfferings
            ? Object.keys(options.altRfqAssetOfferings).map((mm) => {
                return { pairType: types_1.RfqPairType.Alt, url: mm };
            })
            : [];
        let typedMakerUrls = standardUrls.concat(altUrls);
        // If there is a whitelist, only allow approved maker URLs
        if (options.integrator.whitelistIntegratorUrls !== undefined) {
            const whitelist = new Set(options.integrator.whitelistIntegratorUrls.map(key => key.toLowerCase()));
            typedMakerUrls = typedMakerUrls.filter(makerUrl => whitelist.has(makerUrl.url.toLowerCase()));
        }
        return typedMakerUrls;
    }
    static getDurationUntilExpirationMs(expirationTimeSeconds) {
        const expirationTimeMs = expirationTimeSeconds.times(constants_1.constants.ONE_SECOND_MS);
        const currentTimeMs = new utils_1.BigNumber(Date.now());
        return utils_1.BigNumber.max(expirationTimeMs.minus(currentTimeMs), 0);
    }
    static _makerSupportsPair(typedMakerUrl, makerToken, takerToken, altMakerAssetOfferings, assetOfferings) {
        if (typedMakerUrl.pairType === types_1.RfqPairType.Standard && assetOfferings) {
            for (const assetPair of assetOfferings[typedMakerUrl.url]) {
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
    requestRfqmFirmQuotesAsync(makerToken, // maker token
    takerToken, // taker token
    assetFillAmount, marketOperation, comparisonPrice, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS), options);
            return this._fetchAndValidateFirmQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, _opts, this._rfqmAssetOfferings);
        });
    }
    requestRfqtFirmQuotesAsync(makerToken, // maker token
    takerToken, // taker token
    assetFillAmount, marketOperation, comparisonPrice, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS), options);
            if (!_opts.txOrigin || [undefined, '', '0x', utils_1.NULL_ADDRESS].includes(_opts.txOrigin)) {
                throw new Error('RFQ-T firm quotes require the presence of a tx origin');
            }
            return this._fetchAndValidateFirmQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, _opts, this._rfqtAssetOfferings);
        });
    }
    requestRfqmIndicativeQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS), options);
            return this._fetchAndValidateIndicativeQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, _opts, this._rfqmAssetOfferings);
        });
    }
    requestRfqtIndicativeQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign(Object.assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS), options);
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
            return this._fetchAndValidateIndicativeQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, _opts, this._rfqtAssetOfferings);
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
    _getQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options, quoteType, assetOfferings) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestParams = QuoteRequestor.makeQueryParameters(options.txOrigin, options.takerAddress, marketOperation, makerToken, takerToken, assetFillAmount, comparisonPrice, options.isLastLook, options.fee);
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
            const timeoutMs = options.makerEndpointMaxResponseTimeMs ||
                constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS.makerEndpointMaxResponseTimeMs;
            const bufferMs = 20;
            // Set Timeout on CancelToken
            const cancelTokenSource = axios_1.default.CancelToken.source();
            setTimeout(() => {
                cancelTokenSource.cancel('timeout via cancel token');
            }, timeoutMs + bufferMs);
            const typedMakerUrls = QuoteRequestor.getTypedMakerUrlsAndWhitelist(options, assetOfferings);
            const quotePromises = typedMakerUrls.map((typedMakerUrl) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                // filter out requests to skip
                const isBlacklisted = rfqMakerBlacklist.isMakerBlacklisted(typedMakerUrl.url);
                const partialLogEntry = { url: typedMakerUrl.url, quoteType, requestParams, isBlacklisted };
                const { isLastLook, integrator } = options;
                const { sellTokenAddress, buyTokenAddress } = requestParams;
                if (isBlacklisted) {
                    (_a = this._metrics) === null || _a === void 0 ? void 0 : _a.logRfqMakerNetworkInteraction({
                        isLastLook: false,
                        url: typedMakerUrl.url,
                        quoteType,
                        statusCode: undefined,
                        sellTokenAddress,
                        buyTokenAddress,
                        latencyMs: 0,
                        included: false,
                        integrator,
                    });
                    this._infoLogger({ rfqtMakerInteraction: Object.assign({}, partialLogEntry) });
                    return;
                }
                else if (!QuoteRequestor._makerSupportsPair(typedMakerUrl, makerToken, takerToken, options.altRfqAssetOfferings, assetOfferings)) {
                    return;
                }
                else {
                    // make request to MM
                    const timeBeforeAwait = Date.now();
                    try {
                        if (typedMakerUrl.pairType === types_1.RfqPairType.Standard) {
                            const response = yield this._quoteRequestorHttpClient.get(`${typedMakerUrl.url}/${quotePath}`, {
                                headers: {
                                    '0x-api-key': options.integrator.integratorId,
                                    '0x-integrator-id': options.integrator.integratorId,
                                },
                                params: requestParams,
                                timeout: timeoutMs,
                                cancelToken: cancelTokenSource.token,
                            });
                            const latencyMs = Date.now() - timeBeforeAwait;
                            (_b = this._metrics) === null || _b === void 0 ? void 0 : _b.logRfqMakerNetworkInteraction({
                                isLastLook: isLastLook || false,
                                url: typedMakerUrl.url,
                                quoteType,
                                statusCode: response.status,
                                sellTokenAddress,
                                buyTokenAddress,
                                latencyMs,
                                included: true,
                                integrator,
                            });
                            this._infoLogger({
                                rfqtMakerInteraction: Object.assign(Object.assign({}, partialLogEntry), { response: {
                                        included: true,
                                        apiKey: options.integrator.integratorId,
                                        takerAddress: requestParams.takerAddress,
                                        txOrigin: requestParams.txOrigin,
                                        statusCode: response.status,
                                        latencyMs,
                                    } }),
                            });
                            rfqMakerBlacklist.logTimeoutOrLackThereof(typedMakerUrl.url, latencyMs >= timeoutMs);
                            return {
                                response: Object.assign(Object.assign({}, response.data), { makerUri: typedMakerUrl.url }),
                                makerUri: typedMakerUrl.url,
                            };
                        }
                        else {
                            if (this._altRfqCreds === undefined) {
                                throw new Error(`don't have credentials for alt MM`);
                            }
                            const quote = yield (0, alt_mm_implementation_utils_1.returnQuoteFromAltMMAsync)(typedMakerUrl.url, this._altRfqCreds.altRfqApiKey, this._altRfqCreds.altRfqProfile, options.integrator.integratorId, quoteType === 'firm' ? types_1.AltQuoteModel.Firm : types_1.AltQuoteModel.Indicative, makerToken, takerToken, timeoutMs, options.altRfqAssetOfferings || {}, requestParams, this._quoteRequestorHttpClient, this._warningLogger, cancelTokenSource.token);
                            const latencyMs = Date.now() - timeBeforeAwait;
                            (_c = this._metrics) === null || _c === void 0 ? void 0 : _c.logRfqMakerNetworkInteraction({
                                isLastLook: isLastLook || false,
                                url: typedMakerUrl.url,
                                quoteType,
                                statusCode: quote.status,
                                sellTokenAddress,
                                buyTokenAddress,
                                latencyMs,
                                included: true,
                                integrator,
                            });
                            this._infoLogger({
                                rfqtMakerInteraction: Object.assign(Object.assign({}, partialLogEntry), { response: {
                                        included: true,
                                        apiKey: options.integrator.integratorId,
                                        takerAddress: requestParams.takerAddress,
                                        txOrigin: requestParams.txOrigin,
                                        statusCode: quote.status,
                                        latencyMs,
                                    } }),
                            });
                            rfqMakerBlacklist.logTimeoutOrLackThereof(typedMakerUrl.url, latencyMs >= timeoutMs);
                            return { response: quote.data, makerUri: typedMakerUrl.url };
                        }
                    }
                    catch (err) {
                        // log error if any
                        const latencyMs = Date.now() - timeBeforeAwait;
                        (_d = this._metrics) === null || _d === void 0 ? void 0 : _d.logRfqMakerNetworkInteraction({
                            isLastLook: isLastLook || false,
                            url: typedMakerUrl.url,
                            quoteType,
                            statusCode: (_e = err.response) === null || _e === void 0 ? void 0 : _e.status,
                            sellTokenAddress,
                            buyTokenAddress,
                            latencyMs,
                            included: false,
                            integrator,
                        });
                        this._infoLogger({
                            rfqtMakerInteraction: Object.assign(Object.assign({}, partialLogEntry), { response: {
                                    included: false,
                                    apiKey: options.integrator.integratorId,
                                    takerAddress: requestParams.takerAddress,
                                    txOrigin: requestParams.txOrigin,
                                    statusCode: err.response ? err.response.status : undefined,
                                    latencyMs,
                                } }),
                        });
                        rfqMakerBlacklist.logTimeoutOrLackThereof(typedMakerUrl.url, latencyMs >= timeoutMs);
                        this._warningLogger(convertIfAxiosError(err), `Failed to get RFQ-T ${quoteType} quote from market maker endpoint ${typedMakerUrl.url} for integrator ${options.integrator.integratorId} (${options.integrator.label}) for taker address ${options.takerAddress} and tx origin ${options.txOrigin}`);
                        return;
                    }
                }
            }));
            const results = (yield Promise.all(quotePromises)).filter(x => x !== undefined);
            return results;
        });
    }
    _fetchAndValidateFirmQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options, assetOfferings) {
        return __awaiter(this, void 0, void 0, function* () {
            const quotesRaw = yield this._getQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options, 'firm', assetOfferings);
            const quotes = quotesRaw.map(result => (Object.assign(Object.assign({}, result), { response: result.response.signedOrder })));
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
                var _a, _b, _c;
                const order = result.response;
                if (!validationFunction(order)) {
                    this._warningLogger(result, 'Invalid RFQ-T firm quote received, filtering out');
                    return false;
                }
                if (!hasExpectedAddresses([
                    [makerToken, order.makerToken],
                    [takerToken, order.takerToken],
                    [options.takerAddress, order.taker],
                    [options.txOrigin, order.txOrigin],
                ])) {
                    this._warningLogger(order, 'Unexpected token, tx origin or taker address in RFQ-T order, filtering out');
                    return false;
                }
                const isLastLook = Boolean(options.isLastLook);
                const msRemainingUntilExpiration = QuoteRequestor.getDurationUntilExpirationMs(new utils_1.BigNumber(order.expiry));
                const isExpirationTooSoon = msRemainingUntilExpiration.lt(this._expiryBufferMs);
                if (isExpirationTooSoon) {
                    this._warningLogger(order, 'Expiry too soon in RFQ-T firm quote, filtering out');
                    (_a = this._metrics) === null || _a === void 0 ? void 0 : _a.incrementExpirationToSoonCounter(isLastLook, order.maker);
                    return false;
                }
                else {
                    const secondsRemaining = msRemainingUntilExpiration.div(constants_2.ONE_SECOND_MS);
                    (_b = this._metrics) === null || _b === void 0 ? void 0 : _b.measureExpirationForValidOrder(isLastLook, order.maker, secondsRemaining);
                    const takerAmount = new utils_1.BigNumber(order.takerAmount);
                    const fillRatio = takerAmount.div(assetFillAmount);
                    if (fillRatio.lt(1) && fillRatio.gte(FILL_RATIO_WARNING_LEVEL)) {
                        this._warningLogger({
                            makerUri: result.makerUri,
                            fillRatio,
                            assetFillAmount,
                            takerToken,
                            makerToken,
                            takerAmount: order.takerAmount,
                            makerAmount: order.makerAmount,
                        }, 'Fill ratio in warning range');
                        (_c = this._metrics) === null || _c === void 0 ? void 0 : _c.incrementFillRatioWarningCounter(isLastLook, order.maker);
                    }
                    return true;
                }
            });
            // Save the maker URI for later and return just the order
            const rfqQuotes = validQuotes.map(result => {
                const _a = result.response, { signature } = _a, rest = __rest(_a, ["signature"]);
                const order = {
                    order: Object.assign(Object.assign({}, rest), { makerAmount: new utils_1.BigNumber(result.response.makerAmount), takerAmount: new utils_1.BigNumber(result.response.takerAmount), expiry: new utils_1.BigNumber(result.response.expiry), salt: new utils_1.BigNumber(result.response.salt) }),
                    type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
                    signature,
                };
                this._orderSignatureToMakerUri[nativeDataToId(result.response)] = result.makerUri;
                return order;
            });
            return rfqQuotes;
        });
    }
    _fetchAndValidateIndicativeQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options, assetOfferings) {
        return __awaiter(this, void 0, void 0, function* () {
            // fetch quotes
            const rawQuotes = yield this._getQuotesAsync(makerToken, takerToken, assetFillAmount, marketOperation, comparisonPrice, options, 'indicative', assetOfferings);
            // validate
            const validationFunction = (o) => this._isValidRfqtIndicativeQuoteResponse(o);
            const validQuotes = rawQuotes.filter(result => {
                const order = result.response;
                if (!validationFunction(order)) {
                    this._warningLogger(result, 'Invalid RFQ indicative quote received, filtering out');
                    return false;
                }
                if (!hasExpectedAddresses([
                    [makerToken, order.makerToken],
                    [takerToken, order.takerToken],
                ])) {
                    this._warningLogger(order, 'Unexpected token or taker address in RFQ order, filtering out');
                    return false;
                }
                const msRemainingUntilExpiration = QuoteRequestor.getDurationUntilExpirationMs(new utils_1.BigNumber(order.expiry));
                const isExpirationTooSoon = msRemainingUntilExpiration.lt(this._expiryBufferMs);
                if (isExpirationTooSoon) {
                    this._warningLogger(order, 'Expiry too soon in RFQ indicative quote, filtering out');
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
}
exports.QuoteRequestor = QuoteRequestor;
//# sourceMappingURL=quote_requestor.js.map