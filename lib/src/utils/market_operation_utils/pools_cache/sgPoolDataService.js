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
exports.SubgraphPoolDataService = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const graphql_request_1 = require("graphql-request");
const queryWithLinear = (0, graphql_request_1.gql) `
    query fetchTopPoolsWithLinear($maxPoolsFetched: Int!) {
        pools: pools(
            first: $maxPoolsFetched
            where: { swapEnabled: true }
            orderBy: totalLiquidity
            orderDirection: desc
        ) {
            id
            address
            poolType
            swapFee
            totalShares
            tokens {
                address
                balance
                decimals
                weight
                priceRate
            }
            tokensList
            totalWeight
            amp
            expiryTime
            unitSeconds
            principalToken
            baseToken
            swapEnabled
            wrappedIndex
            mainIndex
            lowerTarget
            upperTarget
        }
    }
`;
const queryWithOutLinear = (0, graphql_request_1.gql) `
    query fetchTopPoolsWithoutLinear($maxPoolsFetched: Int!) {
        pools: pools(
            first: $maxPoolsFetched
            where: { swapEnabled: true }
            orderBy: totalLiquidity
            orderDirection: desc
        ) {
            id
            address
            poolType
            swapFee
            totalShares
            tokens {
                address
                balance
                decimals
                weight
                priceRate
            }
            tokensList
            totalWeight
            amp
            expiryTime
            unitSeconds
            principalToken
            baseToken
            swapEnabled
        }
    }
`;
const QUERY_BY_CHAIN_ID = {
    [contract_addresses_1.ChainId.Mainnet]: queryWithLinear,
    [contract_addresses_1.ChainId.Polygon]: queryWithOutLinear,
};
const DEFAULT_MAX_POOLS_FETCHED = 96;
/**
 * Simple service to query required info from Subgraph for Balancer Pools.
 * Because Balancer Subgraphs have slightly different schema depending on network the queries are adjusted as needed.
 */
class SubgraphPoolDataService {
    constructor(_config) {
        this._config = _config;
        this._config.maxPoolsFetched = this._config.maxPoolsFetched || DEFAULT_MAX_POOLS_FETCHED;
        this._gqlQuery = QUERY_BY_CHAIN_ID[this._config.chainId];
    }
    // tslint:disable-next-line: async-suffix
    getPools() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._gqlQuery || !this._config.subgraphUrl) {
                return [];
            }
            try {
                const { pools } = yield (0, graphql_request_1.request)(this._config.subgraphUrl, this._gqlQuery, {
                    maxPoolsFetched: this._config.maxPoolsFetched,
                });
                return pools;
            }
            catch (err) {
                utils_1.logUtils.warn(`Failed to fetch BalancerV2 subgraph pools: ${err.message}`);
                return [];
            }
        });
    }
}
exports.SubgraphPoolDataService = SubgraphPoolDataService;
//# sourceMappingURL=sgPoolDataService.js.map