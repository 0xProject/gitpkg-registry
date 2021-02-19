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
const utils_1 = require("@0x/utils");
const constants_1 = require("../constants");
const types_1 = require("../types");
function getAltMarketInfo(offerings, buyTokenAddress, sellTokenAddress) {
    for (const offering of offerings) {
        if ((buyTokenAddress.toLowerCase() === offering.baseAsset.toLowerCase() &&
            sellTokenAddress.toLowerCase() === offering.quoteAsset.toLowerCase()) ||
            (sellTokenAddress.toLowerCase() === offering.baseAsset.toLowerCase() &&
                buyTokenAddress.toLowerCase() === offering.quoteAsset.toLowerCase())) {
            return offering;
        }
    }
    return undefined;
}
function parseFirmQuoteResponseFromAltMM(altFirmQuoteReponse) {
    return {
        signedOrder: altFirmQuoteReponse.data['0xv4order'],
    };
}
function parseIndicativeQuoteResponseFromAltMM(altIndicativeQuoteResponse, altPair, makerToken, takerToken) {
    let makerAmount;
    let takerAmount;
    let quoteAmount;
    let baseAmount;
    if (!altIndicativeQuoteResponse.price) {
        throw new Error('Price not returned by alt MM');
    }
    if (altIndicativeQuoteResponse.amount) {
        // if amount is specified, amount is the base token amount
        baseAmount = dev_utils_1.Web3Wrapper.toBaseUnitAmount(new utils_1.BigNumber(altIndicativeQuoteResponse.amount), altPair.baseAssetDecimals);
        // if amount is specified, use the price (quote/base) to get the quote amount
        quoteAmount = dev_utils_1.Web3Wrapper.toBaseUnitAmount(new utils_1.BigNumber(altIndicativeQuoteResponse.amount)
            .times(new utils_1.BigNumber(altIndicativeQuoteResponse.price))
            .decimalPlaces(altPair.quoteAssetDecimals, utils_1.BigNumber.ROUND_DOWN), altPair.quoteAssetDecimals);
    }
    else if (altIndicativeQuoteResponse.value) {
        // if value is specified, value is the quote token amount
        quoteAmount = dev_utils_1.Web3Wrapper.toBaseUnitAmount(new utils_1.BigNumber(altIndicativeQuoteResponse.value), altPair.quoteAssetDecimals);
        // if value is specified, use the price (quote/base) to get the base amount
        baseAmount = dev_utils_1.Web3Wrapper.toBaseUnitAmount(new utils_1.BigNumber(altIndicativeQuoteResponse.value)
            .dividedBy(new utils_1.BigNumber(altIndicativeQuoteResponse.price))
            .decimalPlaces(altPair.baseAssetDecimals, utils_1.BigNumber.ROUND_DOWN), altPair.baseAssetDecimals);
    }
    else {
        throw new Error('neither amount or value were specified');
    }
    if (makerToken.toLowerCase() === altPair.baseAsset.toLowerCase()) {
        makerAmount = baseAmount;
        takerAmount = quoteAmount;
    }
    else if (makerToken.toLowerCase() === altPair.quoteAsset.toLowerCase()) {
        makerAmount = quoteAmount;
        takerAmount = baseAmount;
    }
    else {
        throw new Error(`Base, quote tokens don't align with maker, taker tokens`);
    }
    return {
        makerToken,
        makerAmount,
        takerToken,
        takerAmount,
        // HACK: alt implementation does not return an expiration with indicative quotes
        // return now + { IMPUTED EXPIRY SECONDS } to have it included after order checks
        expiry: 
        // tslint:disable-next-line:custom-no-magic-numbers
        new utils_1.BigNumber(Date.now() / 1000)
            .integerValue(utils_1.BigNumber.ROUND_DOWN)
            .plus(constants_1.constants.ALT_MM_IMPUTED_INDICATIVE_EXPIRY_SECONDS),
    };
}
/**
 * Turn a standard quote request into an alt quote request
 * and return the appropriate standard quote response
 */
function returnQuoteFromAltMMAsync(url, apiKey, profile, integratorKey, quoteModel, makerToken, takerToken, maxResponseTimeMs, altRfqtAssetOfferings, takerRequestQueryParams, axiosInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        const altPair = getAltMarketInfo(altRfqtAssetOfferings[url], takerRequestQueryParams.buyTokenAddress, takerRequestQueryParams.sellTokenAddress);
        if (altPair) {
            const side = altPair.baseAsset === takerRequestQueryParams.buyTokenAddress ? types_1.AltQuoteSide.Buy : types_1.AltQuoteSide.Sell;
            // comparison price needs to be quote/base
            // in the standard implementation, it's maker/taker
            let altComparisonPrice;
            if (altPair.quoteAsset === makerToken) {
                altComparisonPrice = takerRequestQueryParams.comparisonPrice
                    ? takerRequestQueryParams.comparisonPrice
                    : undefined;
            }
            else {
                altComparisonPrice = takerRequestQueryParams.comparisonPrice
                    ? new utils_1.BigNumber(takerRequestQueryParams.comparisonPrice).pow(-1).toString()
                    : undefined;
            }
            let data;
            data = {
                market: `${altPair.id}`,
                model: quoteModel,
                profile,
                side,
                meta: {
                    txOrigin: takerRequestQueryParams.txOrigin,
                    taker: takerRequestQueryParams.takerAddress,
                    client: integratorKey,
                },
            };
            // specify a comparison price if it exists
            if (altComparisonPrice) {
                data.meta.existingOrder = {
                    price: altComparisonPrice,
                };
            }
            // need to specify amount or value
            // amount is units of the base asset
            // value is units of the quote asset
            let requestSize;
            if (takerRequestQueryParams.buyAmountBaseUnits) {
                requestSize = dev_utils_1.Web3Wrapper.toUnitAmount(new utils_1.BigNumber(takerRequestQueryParams.buyAmountBaseUnits), takerRequestQueryParams.buyTokenAddress === altPair.baseAsset
                    ? altPair.baseAssetDecimals
                    : altPair.quoteAssetDecimals).toString();
                if (takerRequestQueryParams.buyTokenAddress === altPair.baseAsset) {
                    data.amount = requestSize;
                    // add to 'existing order' if there is a comparison price
                    if (data.meta.existingOrder) {
                        data.meta.existingOrder.value = requestSize;
                    }
                }
                else {
                    data.value = requestSize;
                    // add to 'existing order' if there is a comparison price
                    if (data.meta.existingOrder) {
                        data.meta.existingOrder.amount = requestSize;
                    }
                }
            }
            else if (takerRequestQueryParams.sellAmountBaseUnits) {
                requestSize = dev_utils_1.Web3Wrapper.toUnitAmount(new utils_1.BigNumber(takerRequestQueryParams.sellAmountBaseUnits), takerRequestQueryParams.sellTokenAddress === altPair.baseAsset
                    ? altPair.baseAssetDecimals
                    : altPair.quoteAssetDecimals).toString();
                if (takerRequestQueryParams.sellTokenAddress === altPair.baseAsset) {
                    data.amount = requestSize;
                    if (data.meta.existingOrder) {
                        data.meta.existingOrder.value = requestSize;
                    }
                }
                else {
                    data.value = requestSize;
                    if (data.meta.existingOrder) {
                        data.meta.existingOrder.amount = requestSize;
                    }
                }
            }
            const response = yield axiosInstance.post(`${url}/quotes`, data, {
                headers: { Authorization: `Bearer ${apiKey}` },
                timeout: maxResponseTimeMs,
            });
            if (response.data.status === 'rejected') {
                throw new Error('alt MM rejected quote');
            }
            const parsedResponse = quoteModel === 'firm'
                ? parseFirmQuoteResponseFromAltMM(response.data)
                : parseIndicativeQuoteResponseFromAltMM(response.data, altPair, makerToken, takerToken);
            return {
                // hack to appease type checking
                data: parsedResponse,
                status: response.status,
            };
        }
        else {
            throw new Error(`Couldn't find asset pair info`);
        }
    });
}
exports.returnQuoteFromAltMMAsync = returnQuoteFromAltMMAsync;
//# sourceMappingURL=alt_mm_implementation_utils.js.map