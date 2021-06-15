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
exports.MockBalancerPoolsCache = void 0;
const balancer_utils_1 = require("../../src/utils/market_operation_utils/balancer_utils");
class MockBalancerPoolsCache extends balancer_utils_1.BalancerPoolsCache {
    constructor(handlers) {
        super();
        this.handlers = handlers;
    }
    getPoolsForPairAsync(takerToken, makerToken) {
        const _super = Object.create(null, {
            getPoolsForPairAsync: { get: () => super.getPoolsForPairAsync }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this.handlers.getPoolsForPairAsync
                ? this.handlers.getPoolsForPairAsync(takerToken, makerToken)
                : _super.getPoolsForPairAsync.call(this, takerToken, makerToken);
        });
    }
    _fetchPoolsForPairAsync(takerToken, makerToken) {
        const _super = Object.create(null, {
            _fetchPoolsForPairAsync: { get: () => super._fetchPoolsForPairAsync }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this.handlers._fetchPoolsForPairAsync
                ? this.handlers._fetchPoolsForPairAsync(takerToken, makerToken)
                : _super._fetchPoolsForPairAsync.call(this, takerToken, makerToken);
        });
    }
    _loadTopPoolsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.handlers && this.handlers._loadTopPoolsAsync) {
                return this.handlers._loadTopPoolsAsync();
            }
        });
    }
}
exports.MockBalancerPoolsCache = MockBalancerPoolsCache;
//# sourceMappingURL=mock_balancer_pools_cache.js.map