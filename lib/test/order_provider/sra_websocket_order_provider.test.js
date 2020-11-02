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
// tslint:disable-next-line:no-empty
const NOOP = () => { };
describe('SRAWebsocketOrderProvider', () => {
    let orderStore;
    let provider;
    const httpEndpoint = 'https://localhost';
    const websocketEndpoint = 'wss://localhost';
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
        test('fetches order on  first subscription', () => __awaiter(this, void 0, void 0, function* () {
            const httpStub = sinon
                .stub(connect_1.HttpClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ records: [], total: 0, perPage: 0, page: 1 }); }));
            stubs.push(sinon
                .stub(connect_1.ordersChannelFactory, 'createWebSocketOrdersChannelAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ subscribe: NOOP, close: NOOP }); })));
            stubs.push(httpStub);
            provider = new src_1.SRAWebsocketOrderProvider({ httpEndpoint, websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(httpStub.callCount).toBe(2);
        }));
        test('fetches once when the same subscription is called', () => __awaiter(this, void 0, void 0, function* () {
            const stub = sinon
                .stub(connect_1.HttpClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ records: [], total: 0, perPage: 0, page: 1 }); }));
            stubs.push(sinon
                .stub(connect_1.ordersChannelFactory, 'createWebSocketOrdersChannelAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ subscribe: NOOP, close: NOOP }); })));
            stubs.push(stub);
            provider = new src_1.SRAWebsocketOrderProvider({ httpEndpoint, websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(stub.callCount).toBe(2);
        }));
        test('adds orders from the subscription', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [];
            const stub = sinon.stub(connect_1.HttpClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve({
                    records: orders,
                    total: orders.length,
                    perPage: 1,
                    page: 1,
                });
            }));
            stubs.push(stub);
            let handler;
            const wsStub = sinon
                .stub(connect_1.ordersChannelFactory, 'createWebSocketOrdersChannelAsync')
                .callsFake((_url, updateHandler) => __awaiter(this, void 0, void 0, function* () {
                handler = updateHandler;
                return Promise.resolve({ subscribe: NOOP, close: NOOP });
            }));
            stubs.push(wsStub);
            provider = new src_1.SRAWebsocketOrderProvider({ httpEndpoint, websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(handler).not.toBe(undefined);
            if (handler) {
                const channel = '';
                const subscriptionOpts = {};
                orders.push(utils_2.createOrder(makerAssetData, takerAssetData));
                handler.onUpdate(channel, subscriptionOpts, orders);
            }
            expect(stub.callCount).toBe(2);
            expect(wsStub.callCount).toBe(1);
            yield utils_1.utils.delayAsync(5);
            const storedOrders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(storedOrders.size()).toBe(1);
        }));
        test('stores the orders', () => __awaiter(this, void 0, void 0, function* () {
            stubs.push(sinon.stub(connect_1.HttpClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve({
                    records: [utils_2.createOrder(makerAssetData, takerAssetData)],
                    total: 1,
                    perPage: 1,
                    page: 1,
                });
            })));
            stubs.push(sinon
                .stub(connect_1.ordersChannelFactory, 'createWebSocketOrdersChannelAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ subscribe: NOOP, close: NOOP }); })));
            provider = new src_1.SRAWebsocketOrderProvider({ httpEndpoint, websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            const orders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(orders.size()).toBe(1);
        }));
        test('reconnects on channel close', () => __awaiter(this, void 0, void 0, function* () {
            stubs.push(sinon.stub(connect_1.HttpClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve({
                    records: [],
                    total: 0,
                    perPage: 1,
                    page: 1,
                });
            })));
            let handler;
            const wsStub = sinon
                .stub(connect_1.ordersChannelFactory, 'createWebSocketOrdersChannelAsync')
                .callsFake((_url, updateHandler) => __awaiter(this, void 0, void 0, function* () {
                handler = updateHandler;
                return Promise.resolve({ subscribe: NOOP, close: NOOP });
            }));
            stubs.push(wsStub);
            provider = new src_1.SRAWebsocketOrderProvider({ httpEndpoint, websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(handler).not.toBe(undefined);
            handler.onClose(undefined);
            yield utils_1.utils.delayAsync(5);
            // Creates the new connection
            expect(wsStub.callCount).toBe(2);
        }));
    });
});
//# sourceMappingURL=sra_websocket_order_provider.test.js.map