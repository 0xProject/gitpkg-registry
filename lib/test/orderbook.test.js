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
const src_1 = require("../src");
const utils_1 = require("./utils");
describe('Orderbook', () => {
    const httpEndpoint = 'https://localhost';
    const makerAssetData = '0xf47261b000000000000000000000000089d24a6b4ccb1b6faa2625fe562bdd9a23260359';
    const takerAssetData = '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const stubs = [];
    afterEach(() => {
        stubs.forEach(s => s.restore());
    });
    describe('#getOrdersAsync', () => {
        test('returns the orders stored', () => __awaiter(this, void 0, void 0, function* () {
            const records = [utils_1.createOrder(makerAssetData, takerAssetData)];
            stubs.push(sinon.stub(connect_1.HttpClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve({
                    records,
                    total: 1,
                    perPage: 1,
                    page: 1,
                });
            })));
            const orderbook = src_1.Orderbook.getOrderbookForPollingProvider({ httpEndpoint, pollingIntervalMs: 5 });
            const orders = yield orderbook.getOrdersAsync(makerAssetData, takerAssetData);
            expect(orders.length).toBe(1);
        }));
    });
    describe('#addOrdersAsync', () => {
        test('propagates the order rejection', () => __awaiter(this, void 0, void 0, function* () {
            stubs.push(sinon
                .stub(connect_1.HttpClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ records: [], total: 0, perPage: 0, page: 1 }); })));
            stubs.push(sinon
                .stub(connect_1.HttpClient.prototype, 'submitOrderAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.reject('INVALID_ORDER'); })));
            const orderbook = src_1.Orderbook.getOrderbookForPollingProvider({ httpEndpoint, pollingIntervalMs: 5 });
            const result = yield orderbook.addOrdersAsync([utils_1.createOrder(makerAssetData, takerAssetData).order]);
            expect(result.rejected.length).toBe(1);
            expect(result.accepted.length).toBe(0);
        }));
        test('propagates the order accepted', () => __awaiter(this, void 0, void 0, function* () {
            stubs.push(sinon
                .stub(connect_1.HttpClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ records: [], total: 0, perPage: 0, page: 1 }); })));
            stubs.push(sinon.stub(connect_1.HttpClient.prototype, 'submitOrderAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve(); })));
            const orderbook = src_1.Orderbook.getOrderbookForPollingProvider({ httpEndpoint, pollingIntervalMs: 5 });
            const result = yield orderbook.addOrdersAsync([utils_1.createOrder(makerAssetData, takerAssetData).order]);
            expect(result.rejected.length).toBe(0);
            expect(result.accepted.length).toBe(1);
        }));
    });
    describe('#getAvailableAssetDatasAsync', () => {
        test('gets the available assets', () => __awaiter(this, void 0, void 0, function* () {
            stubs.push(sinon
                .stub(connect_1.HttpClient.prototype, 'getAssetPairsAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ records: [], total: 0, perPage: 0, page: 1 }); })));
            const orderbook = src_1.Orderbook.getOrderbookForPollingProvider({ httpEndpoint, pollingIntervalMs: 5 });
            const result = yield orderbook.getAvailableAssetDatasAsync();
            expect(result.length).toBe(0);
        }));
    });
});
//# sourceMappingURL=orderbook.test.js.map