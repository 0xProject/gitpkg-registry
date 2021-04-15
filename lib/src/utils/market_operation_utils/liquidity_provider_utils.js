"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiquidityProvidersForPair = void 0;
// tslint:disable completed-docs
function getLiquidityProvidersForPair(registry, takerToken, makerToken) {
    return Object.entries(registry)
        .filter(([, plp]) => [makerToken, takerToken].every(t => plp.tokens.includes(t)))
        .map(([providerAddress]) => providerAddress);
}
exports.getLiquidityProvidersForPair = getLiquidityProvidersForPair;
//# sourceMappingURL=liquidity_provider_utils.js.map