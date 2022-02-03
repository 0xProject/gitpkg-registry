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
exports.AaveV2ReservesCache = void 0;
const utils_1 = require("@0x/utils");
const graphql_request_1 = require("graphql-request");
const constants_1 = require("../../constants");
const RESERVES_GQL_QUERY = graphql_request_1.gql `
    {
        reserves(
            first: 300
            where: { isActive: true, isFrozen: false }
            orderBy: totalLiquidity
            orderDirection: desc
        ) {
            id
            underlyingAsset
            aToken {
                id
            }
            pool {
                id
                lendingPool
            }
        }
    }
`;
// tslint:disable-next-line:custom-no-magic-numbers
const RESERVES_REFRESH_INTERVAL_MS = 30 * constants_1.constants.ONE_MINUTE_MS;
/**
 * Fetches Aave V2 reserve information from the official subgraph(s).
 * The reserve information is updated every 30 minutes and cached
 * so that it can be accessed with the underlying token's address
 */
class AaveV2ReservesCache {
    constructor(_subgraphUrl) {
        this._subgraphUrl = _subgraphUrl;
        this._cache = {};
        const resfreshReserves = () => __awaiter(this, void 0, void 0, function* () { return this.fetchAndUpdateReservesAsync(); });
        // tslint:disable-next-line:no-floating-promises
        resfreshReserves();
        setInterval(resfreshReserves, RESERVES_REFRESH_INTERVAL_MS);
    }
    /**
     * Fetches Aave V2 reserves from the subgraph and updates the cache
     */
    fetchAndUpdateReservesAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reserves } = yield graphql_request_1.request(this._subgraphUrl, RESERVES_GQL_QUERY);
                const newCache = reserves.reduce((memo, reserve) => {
                    const underlyingAsset = reserve.underlyingAsset.toLowerCase();
                    if (!memo[underlyingAsset]) {
                        memo[underlyingAsset] = [];
                    }
                    memo[underlyingAsset].push(reserve);
                    return memo;
                }, {});
                this._cache = newCache;
            }
            catch (err) {
                utils_1.logUtils.warn(`Failed to update Aave V2 reserves cache: ${err.message}`);
                // Empty cache just to be safe
                this._cache = {};
            }
        });
    }
    get(takerToken, makerToken) {
        // Deposit takerToken into reserve
        if (this._cache[takerToken.toLowerCase()]) {
            const matchingReserve = this._cache[takerToken.toLowerCase()].find(r => r.aToken.id === makerToken.toLowerCase());
            if (matchingReserve) {
                return matchingReserve;
            }
        }
        // Withdraw makerToken from reserve
        if (this._cache[makerToken.toLowerCase()]) {
            const matchingReserve = this._cache[makerToken.toLowerCase()].find(r => r.aToken.id === takerToken.toLowerCase());
            if (matchingReserve) {
                return matchingReserve;
            }
        }
        // No match
        return undefined;
    }
}
exports.AaveV2ReservesCache = AaveV2ReservesCache;
//# sourceMappingURL=aave_reserves_cache.js.map