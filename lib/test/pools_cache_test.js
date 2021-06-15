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
const chai = require("chai");
require("mocha");
const pools_cache_1 = require("../src/utils/market_operation_utils/pools_cache");
const chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const wbtcAddress = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
const balAddress = '0xba100000625a3754423978a60c9317c58a424e3d';
const creamAddress = '0x2ba592f78db6436527729929aaf6c908497cb200';
const timeoutMs = 5000;
const poolKeys = ['id', 'balanceIn', 'balanceOut', 'weightIn', 'weightOut', 'swapFee'];
describe('Pools Caches for Balancer-based sampling', () => {
    function fetchAndAssertPoolsAsync(cache, takerToken, makerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const pools = yield cache.getFreshPoolsForPairAsync(takerToken, makerToken, timeoutMs);
            expect(pools.length).greaterThan(0, `Failed to find any pools for ${takerToken} and ${makerToken}`);
            expect(pools[0]).not.undefined();
            expect(Object.keys(pools[0])).to.include.members(poolKeys);
            const cachedPoolIds = cache.getCachedPoolAddressesForPair(takerToken, makerToken);
            expect(cachedPoolIds).to.deep.equal(pools.map(p => p.id));
        });
    }
    describe('BalancerPoolsCache', () => {
        const cache = new pools_cache_1.BalancerPoolsCache();
        it('fetches pools', () => __awaiter(void 0, void 0, void 0, function* () {
            const pairs = [
                [usdcAddress, daiAddress],
                [usdcAddress, wethAddress],
                [daiAddress, wethAddress],
            ];
            yield Promise.all(
            // tslint:disable-next-line:promise-function-async
            pairs.map(([takerToken, makerToken]) => fetchAndAssertPoolsAsync(cache, takerToken, makerToken)));
        }));
    });
    describe('BalancerV2PoolsCache', () => {
        const cache = new pools_cache_1.BalancerV2PoolsCache();
        it('fetches pools', () => __awaiter(void 0, void 0, void 0, function* () {
            const pairs = [
                [wethAddress, wbtcAddress],
                [wethAddress, balAddress],
            ];
            yield Promise.all(
            // tslint:disable-next-line:promise-function-async
            pairs.map(([takerToken, makerToken]) => fetchAndAssertPoolsAsync(cache, takerToken, makerToken)));
        }));
    });
    describe('CreamPoolsCache', () => {
        const cache = new pools_cache_1.CreamPoolsCache();
        it('fetches pools', () => __awaiter(void 0, void 0, void 0, function* () {
            const pairs = [
                [usdcAddress, creamAddress],
                [creamAddress, wethAddress],
            ];
            yield Promise.all(
            // tslint:disable-next-line:promise-function-async
            pairs.map(([takerToken, makerToken]) => fetchAndAssertPoolsAsync(cache, takerToken, makerToken)));
        }));
    });
});
//# sourceMappingURL=pools_cache_test.js.map