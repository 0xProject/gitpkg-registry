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
const mesh_rpc_client_1 = require("@0x/mesh-rpc-client");
const sinon = require("sinon");
const src_1 = require("../../src");
const order_store_1 = require("../../src/order_store");
const utils_1 = require("../../src/utils");
const utils_2 = require("../utils");
const mock_ws_server_1 = require("./mock_ws_server");
describe('MeshOrderProvider', () => {
    let orderStore;
    let provider;
    const stubs = [];
    const websocketEndpoint = `ws://localhost:${mock_ws_server_1.SERVER_PORT}`;
    const makerAssetData = '0xf47261b000000000000000000000000089d24a6b4ccb1b6faa2625fe562bdd9a23260359';
    const takerAssetData = '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const subscriptionId = 'subscriptionId';
    const addedResponse = {
        jsonrpc: '2.0',
        method: 'mesh_subscription',
        params: {
            subscription: subscriptionId,
            result: [
                {
                    orderHash: '0xa452cc6e2c7756376f0f2379e7dd81aa9285b26515774d0ad8801a4c243a30a3',
                    signedOrder: {
                        chainId: 1337,
                        exchangeAddress: '0x4eacd0af335451709e1e7b570b8ea68edec8bc97',
                        makerAddress: '0x8c5c2671b71bad73d8b6fb7e8ef6fe5ec95ff661',
                        makerAssetData,
                        makerFeeAssetData: '0x',
                        makerAssetAmount: '19501674723',
                        makerFee: '0',
                        takerAddress: '0x0000000000000000000000000000000000000000',
                        takerAssetData,
                        takerFeeAssetData: '0x',
                        takerAssetAmount: '132880707765170593819',
                        takerFee: '0',
                        senderAddress: '0x0000000000000000000000000000000000000000',
                        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
                        expirationTimeSeconds: '1574687060',
                        salt: '1574686820004',
                        signature: '0x1b64e67271f10832485356d9ef203b7e2c855067c1253b4e66ee06e85cd46427b157fc4c60f86bd637291f971d1443f65f631b76b887b7f82ebb36499f2f9cf10d03',
                    },
                    endState: 'ADDED',
                    fillableTakerAssetAmount: '132880707765170593819',
                    contractEvents: [],
                },
            ],
        },
    };
    const removedResponse = Object.assign({}, addedResponse, {
        params: Object.assign({}, addedResponse.params, { result: [Object.assign({}, addedResponse.params.result[0], { endState: 'CANCELLED', fillableTakerAssetAmount: '0' })] }),
    });
    let wsServer;
    let connection;
    afterEach(() => {
        void provider.destroyAsync();
        stubs.forEach(s => s.restore());
        mock_ws_server_1.stopServer();
    });
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        orderStore = new order_store_1.OrderStore();
        stubs.push(sinon
            .stub(mesh_rpc_client_1.WSClient.prototype, '_startInternalLivenessCheckAsync')
            .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve(); })));
    }));
    describe('#createSubscriptionForAssetPairAsync', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            wsServer = yield mock_ws_server_1.setupServerAsync();
            wsServer.on('connect', (conn) => {
                connection = conn;
                conn.on('message', (message) => {
                    const jsonRpcRequest = JSON.parse(message.utf8Data);
                    if (jsonRpcRequest.method === 'mesh_subscribe') {
                        connection.sendUTF(JSON.stringify({
                            id: jsonRpcRequest.id,
                            jsonrpc: '2.0',
                            result: subscriptionId,
                        }));
                    }
                });
            });
        }));
        test('fetches order on  first subscription', () => __awaiter(this, void 0, void 0, function* () {
            const getOrdersStub = sinon
                .stub(mesh_rpc_client_1.WSClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve([]); }));
            stubs.push(getOrdersStub);
            const subscriptionStub = sinon
                .stub(mesh_rpc_client_1.WSClient.prototype, 'subscribeToOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve('suscriptionId'); }));
            stubs.push(subscriptionStub);
            provider = new src_1.MeshOrderProvider({ websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(getOrdersStub.callCount).toBe(1);
            expect(subscriptionStub.callCount).toBe(1);
        }));
        test('fetches once when the same subscription is called', () => __awaiter(this, void 0, void 0, function* () {
            const stub = sinon.stub(mesh_rpc_client_1.WSClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve([]); }));
            stubs.push(stub);
            stubs.push(sinon
                .stub(mesh_rpc_client_1.WSClient.prototype, 'subscribeToOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve(subscriptionId); })));
            provider = new src_1.MeshOrderProvider({ websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            expect(stub.callCount).toBe(1);
        }));
        test('stores the orders', () => __awaiter(this, void 0, void 0, function* () {
            const order = utils_2.createOrder(makerAssetData, takerAssetData);
            const orderInfo = {
                orderHash: '0x00',
                signedOrder: order.order,
                fillableTakerAssetAmount: new mesh_rpc_client_1.BigNumber(1),
            };
            stubs.push(sinon.stub(mesh_rpc_client_1.WSClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve([orderInfo]); })));
            stubs.push(sinon
                .stub(mesh_rpc_client_1.WSClient.prototype, 'subscribeToOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve(subscriptionId); })));
            provider = new src_1.MeshOrderProvider({ websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            const orders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(orders.size()).toBe(1);
        }));
        test('stores the orders from a subscription update', () => __awaiter(this, void 0, void 0, function* () {
            const eventResponse = JSON.stringify(addedResponse);
            stubs.push(sinon.stub(mesh_rpc_client_1.WSClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve([]); })));
            provider = new src_1.MeshOrderProvider({ websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            connection.sendUTF(eventResponse);
            yield utils_1.utils.delayAsync(100);
            const orders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(orders.size()).toBe(1);
        }));
        test('removes orders on a subscription update', () => __awaiter(this, void 0, void 0, function* () {
            const added = JSON.stringify(addedResponse);
            const removed = JSON.stringify(removedResponse);
            stubs.push(sinon.stub(mesh_rpc_client_1.WSClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve([]); })));
            provider = new src_1.MeshOrderProvider({ websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            connection.sendUTF(added);
            yield utils_1.utils.delayAsync(100);
            const orders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(orders.size()).toBe(1);
            connection.sendUTF(removed);
            yield utils_1.utils.delayAsync(100);
            expect(orders.size()).toBe(0);
        }));
    });
    describe('reconnnect', () => {
        test.skip('revalidates all stored orders', () => __awaiter(this, void 0, void 0, function* () {
            wsServer = yield mock_ws_server_1.setupServerAsync();
            const orderInfoResponse = {
                jsonrpc: '2.0',
                result: {
                    accepted: [],
                    rejected: [Object.assign({}, addedResponse.params.result[0], { kind: 'CANCELLED', fillableTakerAssetAmount: 0 })],
                },
            };
            wsServer.on('connect', (conn) => {
                connection = conn;
                conn.on('message', (message) => {
                    const jsonRpcRequest = JSON.parse(message.utf8Data);
                    if (jsonRpcRequest.method === 'mesh_subscribe') {
                        connection.sendUTF(JSON.stringify({
                            id: jsonRpcRequest.id,
                            jsonrpc: '2.0',
                            result: subscriptionId,
                        }));
                    }
                    else if (jsonRpcRequest.method === 'mesh_addOrders') {
                        connection.sendUTF(JSON.stringify(Object.assign({ id: jsonRpcRequest.id }, orderInfoResponse)));
                    }
                });
            });
            const getOrdersStub = sinon
                .stub(mesh_rpc_client_1.WSClient.prototype, 'getOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve([]); }));
            const addOrdersStub = sinon
                .stub(mesh_rpc_client_1.WSClient.prototype, 'addOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve({ accepted: [], rejected: [] }); }));
            stubs.push(getOrdersStub);
            stubs.push(addOrdersStub);
            provider = new src_1.MeshOrderProvider({
                websocketEndpoint,
                wsOpts: {
                    reconnectAfter: 1,
                    clientConfig: {
                        fragmentOutgoingMessages: false,
                    },
                },
            }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            const orders = yield orderStore.getOrderSetForAssetsAsync(makerAssetData, takerAssetData);
            expect(getOrdersStub.callCount).toBe(1);
            // Orders are not added on a subscription, only during reconnnect
            expect(addOrdersStub.callCount).toBe(0);
            const added = JSON.stringify(addedResponse);
            connection.sendUTF(added);
            yield utils_1.utils.delayAsync(100);
            expect(orders.size()).toBe(1);
            // Drop the connection and check orders are re-validated
            connection.drop();
            yield utils_1.utils.delayAsync(100);
            expect(addOrdersStub.callCount).toBe(1);
        }));
    });
    describe('#getAvailableAssetDatasAsync', () => {
        test('stores the orders', () => __awaiter(this, void 0, void 0, function* () {
            const order = utils_2.createOrder(makerAssetData, takerAssetData);
            const orderInfo = {
                orderHash: '0x00',
                signedOrder: order.order,
                fillableTakerAssetAmount: new mesh_rpc_client_1.BigNumber(1),
            };
            stubs.push(sinon.stub(mesh_rpc_client_1.WSClient.prototype, 'getOrdersAsync').callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve([orderInfo]); })));
            stubs.push(sinon
                .stub(mesh_rpc_client_1.WSClient.prototype, 'subscribeToOrdersAsync')
                .callsFake(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve(subscriptionId); })));
            provider = new src_1.MeshOrderProvider({ websocketEndpoint }, orderStore);
            yield provider.createSubscriptionForAssetPairAsync(makerAssetData, takerAssetData);
            const assetPairs = yield provider.getAvailableAssetDatasAsync();
            expect(assetPairs.length).toBe(2);
            const assetDataA = {
                assetData: makerAssetData,
                maxAmount: new mesh_rpc_client_1.BigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935'),
                minAmount: new mesh_rpc_client_1.BigNumber('0'),
                precision: 18,
            };
            const assetDataB = Object.assign({}, assetDataA, { assetData: takerAssetData });
            expect(assetPairs).toMatchObject([
                { assetDataA, assetDataB },
                { assetDataA: assetDataB, assetDataB: assetDataA },
            ]);
        }));
    });
});
//# sourceMappingURL=mesh_order_provider.test.js.map