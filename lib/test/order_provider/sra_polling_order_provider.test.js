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
const connect_1 = require("@0x/connect");
const sinon = require("sinon");
const src_1 = require("../../src");
const order_store_1 = require("../../src/order_store");
const utils_1 = require("../../src/utils");
const utils_2 = require("../utils");
describe('SRAPollingOrderProvider', () => {
    let orderStore;
    let provider;
    const httpEndpoint = 'https://localhost';
    const makerAssetData = '0xf47261b000000000000000000000000089d24a6b4ccb1b6faa2625fe562bdd9a23260359';
    const takerAssetData = '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const stubs = [];
    afterEach(() => {
        void provider.destroyAsync();
        stubs.forEach(s => s.restore());
    });
    beforeEach(() => {
        orderStore = new order_store_1.OrderStore();
    });
    describe('#createSubscriptionForAssetPairAsync', () => {
        test('fetches order on first subscription', () => __awaiter(this, void 0, void 0, function* () {
            const stub = sinon
                .stub(connect_1.HttpClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ records: [], total: 0, perPage: 0, page: 1 }); }));
            stubs.push(stub);
            provider = new src_1.SRAPollingOrderProvider({ httpEndpoint, pollingIntervalMs: 5 }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(stub.callCount).toBe(2);
        }));
        test('fetches once when the same subscription is created', () => __awaiter(this, void 0, void 0, function* () {
            const stub = sinon
                .stub(connect_1.HttpClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ records: [], total: 0, perPage: 0, page: 1 }); }));
            stubs.push(stub);
            provider = new src_1.SRAPollingOrderProvider({ httpEndpoint, pollingIntervalMs: 5 }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(stub.callCount).toBe(2);
        }));
        test('periodically polls for orders', () => __awaiter(this, void 0, void 0, function* () {
            const stub = sinon.stub(connect_1.HttpClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve({
                    records: [utils_2.createOrder(makerAssetData, takerAssetData)],
                    total: 1,
                    perPage: 1,
                    page: 1,
                });
            }));
            stubs.push(stub);
            provider = new src_1.SRAPollingOrderProvider({ httpEndpoint, pollingIntervalMs: 1 }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            yield utils_1.utils.delayAsync(5);
            expect(stub.callCount).toBeGreaterThan(2);
        }));
        test('stores the orders returned from the API response', () => __awaiter(this, void 0, void 0, function* () {
            const records = [utils_2.createOrder(makerAssetData, takerAssetData)];
            stubs.push(sinon.stub(connect_1.HttpClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve({
                    records,
                    total: 1,
                    perPage: 1,
                    page: 1,
                });
            })));
            provider = new src_1.SRAPollingOrderProvider({ httpEndpoint, pollingIntervalMs: 30000 }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            const orders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(orders.size()).toBe(1);
        }));
        test('removes the order from the set when the API response no longer returns the order', () => __awaiter(this, void 0, void 0, function* () {
            const records = [utils_2.createOrder(makerAssetData, takerAssetData)];
            stubs.push(sinon.stub(connect_1.HttpClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve({
                    records,
                    total: 1,
                    perPage: 1,
                    page: 1,
                });
            })));
            provider = new src_1.SRAPollingOrderProvider({ httpEndpoint, pollingIntervalMs: 1 }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            const orders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(orders.size()).toBe(1);
            // Delete the record from the API response
            records.splice(0, 1);
            yield utils_1.utils.delayAsync(5);
            expect(orders.size()).toBe(0);
        }));
    });
});
//# sourceMappingURL=sra_polling_order_provider.test.js.map