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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundCTokenCache = void 0;
const utils_1 = require("@0x/utils");
const axios_1 = require("axios");
const constants_1 = require("../../constants");
// tslint:disable-next-line:custom-no-magic-numbers
const CTOKEN_REFRESH_INTERVAL_MS = 30 * constants_1.constants.ONE_MINUTE_MS;
/**
 * Fetches a list of CTokens from Compound's official API.
 * The token information is updated every 30 minutes and cached
 * so that it can be accessed with the underlying token's address.
 */
class CompoundCTokenCache {
    constructor(_apiUrl, _wethAddress) {
        this._apiUrl = _apiUrl;
        this._wethAddress = _wethAddress;
        this._cache = {};
        const refreshCTokenCache = () => __awaiter(this, void 0, void 0, function* () { return this.fetchAndUpdateCTokensAsync(); });
        // tslint:disable-next-line:no-floating-promises
        refreshCTokenCache();
        setInterval(refreshCTokenCache, CTOKEN_REFRESH_INTERVAL_MS);
    }
    fetchAndUpdateCTokensAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(`${this._apiUrl}/ctoken`);
                const newCache = data === null || data === void 0 ? void 0 : data.cToken.reduce((memo, cToken) => {
                    // NOTE: Re-map cETH with null underlying token address to WETH address (we only handle WETH internally)
                    const underlyingAddressClean = cToken.underlying_address
                        ? cToken.underlying_address.toLowerCase()
                        : this._wethAddress;
                    const tokenData = {
                        tokenAddress: cToken.token_address.toLowerCase(),
                        underlyingAddress: underlyingAddressClean,
                    };
                    memo[underlyingAddressClean] = tokenData;
                    return memo;
                }, {});
                this._cache = newCache;
            }
            catch (err) {
                utils_1.logUtils.warn(`Failed to update Compound cToken cache: ${err.message}`);
                // NOTE: Safe to keep already cached data as tokens should only be added to the list
            }
        });
    }
    get(takerToken, makerToken) {
        // mint cToken
        let cToken = this._cache[takerToken.toLowerCase()];
        if (cToken && makerToken.toLowerCase() === cToken.tokenAddress.toLowerCase()) {
            return cToken;
        }
        // redeem cToken
        cToken = this._cache[makerToken.toLowerCase()];
        if (cToken && takerToken.toLowerCase() === cToken.tokenAddress.toLowerCase()) {
            return cToken;
        }
        // No match
        return undefined;
    }
}
exports.CompoundCTokenCache = CompoundCTokenCache;
//# sourceMappingURL=compound_ctoken_cache.js.map