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
const json_schemas_1 = require("@0x/json-schemas");
const order_utils_1 = require("@0x/order-utils");
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
function getTokenAddressOrThrow(assetData) {
    const decodedAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(assetData);
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
    throw new Error(`Decoded asset data (${JSON.stringify(decodedAssetData)}) does not contain a token address`);
}
function hasExpectedAssetData(expectedMakerAssetData, expectedTakerAssetData, makerAssetDataInQuestion, takerAssetDataInQuestion) {
    const hasExpectedMakerAssetData = makerAssetDataInQuestion.toLowerCase() === expectedMakerAssetData.toLowerCase();
    const hasExpectedTakerAssetData = takerAssetDataInQuestion.toLowerCase() === expectedTakerAssetData.toLowerCase();
    return hasExpectedMakerAssetData && hasExpectedTakerAssetData;
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
class QuoteRequestor {
    constructor(_rfqtAssetOfferings, _warningLogger = constants_1.constants.DEFAULT_WARNING_LOGGER, _infoLogger = constants_1.constants.DEFAULT_INFO_LOGGER, _expiryBufferMs = constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS.expiryBufferMs, _firmQuoteValidator, _indicativeQuoteHook) {
        this._rfqtAssetOfferings = _rfqtAssetOfferings;
        this._warningLogger = _warningLogger;
        this._infoLogger = _infoLogger;
        this._expiryBufferMs = _expiryBufferMs;
        this._firmQuoteValidator = _firmQuoteValidator;
        this._indicativeQuoteHook = _indicativeQuoteHook;
        this._schemaValidator = new json_schemas_1.SchemaValidator();
        this._orderSignatureToMakerUri = {};
        rfqMakerBlacklist.infoLogger = this._infoLogger;
    }
    static makeQueryParameters(takerAddress, marketOperation, makerAssetData, takerAssetData, assetFillAmount, comparisonPrice) {
        const buyTokenAddress = getTokenAddressOrThrow(makerAssetData);
        const sellTokenAddress = getTokenAddressOrThrow(takerAssetData);
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
            takerAddress,
            comparisonPrice: comparisonPrice === undefined ? undefined : comparisonPrice.toString(),
            buyTokenAddress,
            sellTokenAddress,
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
    requestRfqtFirmQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, comparisonPrice, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _opts = Object.assign({}, constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS, options);
            if (_opts.takerAddress === undefined ||
                _opts.takerAddress === '' ||
                _opts.takerAddress === '0x' ||
                !_opts.takerAddress ||
                _opts.takerAddress === constants_1.constants.NULL_ADDRESS) {
                throw new Error('RFQ-T firm quotes require the presence of a taker address');
            }
            const firmQuoteResponses = yield this._getQuotesAsync(// not yet BigNumber
            makerAssetData, takerAssetData, assetFillAmount, marketOperation, comparisonPrice, _opts, 'firm');
            const validatedResponses = [];
            firmQuoteResponses.forEach((firmQuoteResponse) => __awaiter(this, void 0, void 0, function* () {
                const orderWithStringInts = firmQuoteResponse.response.signedOrder;
                try {
                    const hasValidSchema = this._schemaValidator.isValid(orderWithStringInts, json_schemas_1.schemas.signedOrderSchema);
                    if (!hasValidSchema) {
                        throw new Error('Order not valid');
                    }
                }
                catch (err) {
                    this._warningLogger(orderWithStringInts, `Invalid RFQ-t order received, filtering out. ${err.message}`);
                    return;
                }
                if (!hasExpectedAssetData(makerAssetData, takerAssetData, orderWithStringInts.makerAssetData.toLowerCase(), orderWithStringInts.takerAssetData.toLowerCase())) {
                    this._warningLogger(orderWithStringInts, 'Unexpected asset data in RFQ-T order, filtering out');
                    return;
                }
                if (orderWithStringInts.takerAddress.toLowerCase() !== _opts.takerAddress.toLowerCase()) {
                    this._warningLogger(orderWithStringInts, 'Unexpected takerAddress in RFQ-T order, filtering out');
                    return;
                }
                const orderWithBigNumberInts = Object.assign({}, orderWithStringInts, { makerAssetAmount: new utils_1.BigNumber(orderWithStringInts.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(orderWithStringInts.takerAssetAmount), makerFee: new utils_1.BigNumber(orderWithStringInts.makerFee), takerFee: new utils_1.BigNumber(orderWithStringInts.takerFee), expirationTimeSeconds: new utils_1.BigNumber(orderWithStringInts.expirationTimeSeconds), salt: new utils_1.BigNumber(orderWithStringInts.salt) });
                if (order_utils_1.orderCalculationUtils.willOrderExpire(orderWithBigNumberInts, this._expiryBufferMs / constants_1.constants.ONE_SECOND_MS)) {
                    this._warningLogger(orderWithBigNumberInts, 'Expiry too soon in RFQ-T order, filtering out');
                    return;
                }
                // Store makerUri for looking up later
                this._orderSignatureToMakerUri[orderWithBigNumberInts.signature] = firmQuoteResponse.makerUri;
                // Passed all validation
                validatedResponses.push({
                    response: { signedOrder: orderWithBigNumberInts },
                    makerUri: firmQuoteResponse.makerUri,
                });
                return;
            }));
            return this._firmQuoteValidator === undefined
                ? validatedResponses.map(validatedResponse => validatedResponse.response)
                : this._firmQuoteValidator.filterInvalidQuotesAsync(validatedResponses);
        });
    }
    requestRfqtIndicativeQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, comparisonPrice, options) {
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
            const responsesWithStringInts = yield this._getQuotesAsync(// not yet BigNumber
            makerAssetData, takerAssetData, assetFillAmount, marketOperation, comparisonPrice, _opts, 'indicative');
            const validResponsesWithStringInts = responsesWithStringInts.filter(result => {
                const response = result.response;
                if (!this._isValidRfqtIndicativeQuoteResponse(response)) {
                    this._warningLogger(response, 'Invalid RFQ-T indicative quote received, filtering out');
                    return false;
                }
                if (!hasExpectedAssetData(makerAssetData, takerAssetData, response.makerAssetData, response.takerAssetData)) {
                    this._warningLogger(response, 'Unexpected asset data in RFQ-T indicative quote, filtering out');
                    return false;
                }
                return true;
            });
            const validResponses = validResponsesWithStringInts.map(result => {
                const response = result.response;
                return Object.assign({}, result, { response: Object.assign({}, response, { makerAssetAmount: new utils_1.BigNumber(response.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(response.takerAssetAmount), expirationTimeSeconds: new utils_1.BigNumber(response.expirationTimeSeconds) }) });
            });
            const resultsWithSufficientExpiry = validResponses.filter(result => {
                if (this._isExpirationTooSoon(result.response.expirationTimeSeconds)) {
                    this._warningLogger(result, 'Expiry too soon in RFQ-T indicative quote, filtering out');
                    return false;
                }
                return true;
            });
            if (this._indicativeQuoteHook !== undefined) {
                this._indicativeQuoteHook.onValidQuotes(resultsWithSufficientExpiry);
            }
            return resultsWithSufficientExpiry.map(result => result.response);
        });
    }
    /**
     * Given an order signature, returns the makerUri that the order originated from
     */
    getMakerUriForOrderSignature(orderSignature) {
        return this._orderSignatureToMakerUri[orderSignature];
    }
    _isValidRfqtIndicativeQuoteResponse(response) {
        const hasValidMakerAssetAmount = response.makerAssetAmount !== undefined &&
            this._schemaValidator.isValid(response.makerAssetAmount, json_schemas_1.schemas.wholeNumberSchema);
        const hasValidTakerAssetAmount = response.takerAssetAmount !== undefined &&
            this._schemaValidator.isValid(response.takerAssetAmount, json_schemas_1.schemas.wholeNumberSchema);
        const hasValidMakerAssetData = response.makerAssetData !== undefined &&
            this._schemaValidator.isValid(response.makerAssetData, json_schemas_1.schemas.hexSchema);
        const hasValidTakerAssetData = response.takerAssetData !== undefined &&
            this._schemaValidator.isValid(response.takerAssetData, json_schemas_1.schemas.hexSchema);
        const hasValidExpirationTimeSeconds = response.expirationTimeSeconds !== undefined &&
            this._schemaValidator.isValid(response.expirationTimeSeconds, json_schemas_1.schemas.wholeNumberSchema);
        if (hasValidMakerAssetAmount &&
            hasValidTakerAssetAmount &&
            hasValidMakerAssetData &&
            hasValidTakerAssetData &&
            hasValidExpirationTimeSeconds) {
            return true;
        }
        return false;
    }
    _makerSupportsPair(makerUrl, makerAssetData, takerAssetData) {
        const makerTokenAddress = getTokenAddressOrThrow(makerAssetData);
        const takerTokenAddress = getTokenAddressOrThrow(takerAssetData);
        for (const assetPair of this._rfqtAssetOfferings[makerUrl]) {
            if ((assetPair[0] === makerTokenAddress && assetPair[1] === takerTokenAddress) ||
                (assetPair[0] === takerTokenAddress && assetPair[1] === makerTokenAddress)) {
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
    _getQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, comparisonPrice, options, quoteType) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestParams = QuoteRequestor.makeQueryParameters(options.takerAddress, marketOperation, makerAssetData, takerAssetData, assetFillAmount, comparisonPrice);
            const result = [];
            yield Promise.all(Object.keys(this._rfqtAssetOfferings).map((url) => __awaiter(this, void 0, void 0, function* () {
                const isBlacklisted = rfqMakerBlacklist.isMakerBlacklisted(url);
                const partialLogEntry = { url, quoteType, requestParams, isBlacklisted };
                if (isBlacklisted) {
                    this._infoLogger({ rfqtMakerInteraction: Object.assign({}, partialLogEntry) });
                }
                else if (this._makerSupportsPair(url, makerAssetData, takerAssetData)) {
                    const timeBeforeAwait = Date.now();
                    const maxResponseTimeMs = options.makerEndpointMaxResponseTimeMs === undefined
                        ? constants_1.constants.DEFAULT_RFQT_REQUEST_OPTS.makerEndpointMaxResponseTimeMs
                        : options.makerEndpointMaxResponseTimeMs;
                    try {
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
                                    statusCode: response.status,
                                    latencyMs,
                                } }),
                        });
                        rfqMakerBlacklist.logTimeoutOrLackThereof(url, latencyMs >= maxResponseTimeMs);
                        result.push({ response: response.data, makerUri: url });
                    }
                    catch (err) {
                        const latencyMs = Date.now() - timeBeforeAwait;
                        this._infoLogger({
                            rfqtMakerInteraction: Object.assign({}, partialLogEntry, { response: {
                                    included: false,
                                    apiKey: options.apiKey,
                                    takerAddress: requestParams.takerAddress,
                                    statusCode: err.response ? err.response.status : undefined,
                                    latencyMs,
                                } }),
                        });
                        rfqMakerBlacklist.logTimeoutOrLackThereof(url, latencyMs >= maxResponseTimeMs);
                        this._warningLogger(convertIfAxiosError(err), `Failed to get RFQ-T ${quoteType} quote from market maker endpoint ${url} for API key ${options.apiKey} for taker address ${options.takerAddress}`);
                    }
                }
            })));
            return result;
        });
    }
}
exports.QuoteRequestor = QuoteRequestor;
//# sourceMappingURL=quote_requestor.js.map