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
exports.BalancerV2PoolsCache = void 0;
// import { getPoolsWithTokens, parsePoolData } from '@balancer-labs/sor'; // TODO - upgrade to v2
const utils_1 = require("@0x/utils");
const graphql_request_1 = require("graphql-request");
const constants_1 = require("../constants");
const pools_cache_1 = require("./pools_cache");
class BalancerV2PoolsCache extends pools_cache_1.PoolsCache {
    constructor(subgraphUrl = constants_1.BALANCER_V2_SUBGRAPH_URL, maxPoolsFetched = constants_1.BALANCER_MAX_POOLS_FETCHED, cache = {}) {
        super(cache);
        this.subgraphUrl = subgraphUrl;
        this.maxPoolsFetched = maxPoolsFetched;
    }
    // protected async _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]> {
    //     try {
    //         const poolData = (await getPoolsWithTokens(takerToken, makerToken)).pools;
    //         // Sort by maker token balance (descending)
    //         const pools = parsePoolData(poolData, takerToken, makerToken).sort((a, b) =>
    //             b.balanceOut.minus(a.balanceOut).toNumber(),
    //         );
    //         return pools.length > this.maxPoolsFetched ? pools.slice(0, this.maxPoolsFetched) : pools;
    //     } catch (err) {
    //         return [];
    //     }
    // }
    _fetchPoolsForPairAsync(takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        query getPools {
            pools(
              first: ${this.maxPoolsFetched},
              where: {
                tokensList_contains: ["${takerToken}", "${makerToken}"]
              }
            ) {
                id
                tokens {
                    address
                    balance
                    weight
                }
              swapFee
              swaps(
                orderBy: timestamp, orderDirection: desc, first: 1,
                  where:{
                  tokenIn: "${takerToken}",
                  tokenOut: "${makerToken}"
                }
              ) {
                tokenAmountIn
                tokenAmountOut
              }
            }
          }
          `;
            const { pools } = yield graphql_request_1.request(this.subgraphUrl, query);
            return pools.map((pool) => {
                const tToken = pool.tokens.find((t) => t.address === takerToken);
                const mToken = pool.tokens.find((t) => t.address === makerToken);
                const swap = pool.swaps[0];
                const tokenAmountOut = swap ? swap.tokenAmountOut : undefined;
                const tokenAmountIn = swap ? swap.tokenAmountIn : undefined;
                const spotPrice = tokenAmountOut && tokenAmountIn ? new utils_1.BigNumber(tokenAmountOut).div(tokenAmountIn) : undefined; // TODO: xianny check
                return {
                    id: pool.id,
                    balanceIn: new utils_1.BigNumber(tToken.balance),
                    balanceOut: new utils_1.BigNumber(mToken.balance),
                    weightIn: new utils_1.BigNumber(tToken.weight),
                    weightOut: new utils_1.BigNumber(mToken.weight),
                    swapFee: new utils_1.BigNumber(pool.swapFee),
                    spotPrice,
                };
            });
        });
    }
}
exports.BalancerV2PoolsCache = BalancerV2PoolsCache;
//# sourceMappingURL=balancer_v2_utils.js.map