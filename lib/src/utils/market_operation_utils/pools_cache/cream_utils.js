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
exports.CreamPoolsCache = void 0;
const cream_sor_1 = require("cream-sor");
const constants_1 = require("../constants");
const pools_cache_1 = require("./pools_cache");
class CreamPoolsCache extends pools_cache_1.PoolsCache {
    constructor(_cache = {}, maxPoolsFetched = constants_1.BALANCER_MAX_POOLS_FETCHED) {
        super(_cache);
        this.maxPoolsFetched = maxPoolsFetched;
    }
    _fetchPoolsForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const poolData = (yield cream_sor_1.getPoolsWithTokens(takerToken, makerToken)).pools;
                // Sort by maker token balance (descending)
                const pools = cream_sor_1.parsePoolData(poolData, takerToken, makerToken).sort((a, b) => b.balanceOut.minus(a.balanceOut).toNumber());
                return pools.slice(0, this.maxPoolsFetched);
            }
            catch (err) {
                return [];
            }
        });
    }
}
exports.CreamPoolsCache = CreamPoolsCache;
//# sourceMappingURL=cream_utils.js.map