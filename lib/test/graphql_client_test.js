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
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_erc20_1 = require("@0x/contracts-erc20");
const contracts_exchange_1 = require("@0x/contracts-exchange");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const protocol_utils_1 = require("@0x/protocol-utils");
const dev_utils_1 = require("@0x/dev-utils");
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const client_1 = require("@apollo/client");
require("mocha");
const index_1 = require("../src/index");
const exchangeProxyV4Address = '0x5315e44798395d4a952530d131249fe00f554565';
function getRandomLimitOrder(fields = {}) {
    return new protocol_utils_1.LimitOrder(Object.assign({ chainId: 1, verifyingContract: exchangeProxyV4Address, makerToken: '0x34d402f14d58e001d8efbe6585051bf9706aa064', takerToken: '0xcdb594a32b1cc3479d8746279712c39d18a07fc0', makerAmount: new utils_1.BigNumber(100), takerAmount: new utils_1.BigNumber(42), takerTokenFeeAmount: new utils_1.BigNumber(0), maker: '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb', taker: '0x0000000000000000000000000000000000000000', sender: '0x0000000000000000000000000000000000000000', feeRecipient: '0x0000000000000000000000000000000000000000', pool: '0x0000000000000000000000000000000000000000', expiry: new utils_1.BigNumber(Math.floor(Date.now() / 1000 + 60)), salt: contracts_test_utils_1.getRandomInteger('1e5', '1e6') }, fields));
}
const graphql_server_1 = require("./utils/graphql_server");
contracts_test_utils_1.blockchainTests.resets('GraphQLClient', (env) => {
    describe('integration tests', () => {
        let deployment;
        let exchange;
        let exchangeAddress;
        let makerAddress;
        let orderFactory;
        let provider;
        let makerTokenAddress;
        let feeTokenAddress;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            deployment = yield graphql_server_1.startServerAndClientAsync();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            deployment.mesh.stopMesh();
        }));
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const chainId = yield env.getChainIdAsync();
            const accounts = yield env.getAccountAddressesAsync();
            [makerAddress] = accounts;
            // Create a new provider so that the ganache instance running on port
            // 8545 will be used instead of the in-process ganache instance.
            const providerConfigs = {
                total_accounts: contracts_test_utils_1.constants.NUM_TEST_ACCOUNTS,
                shouldUseInProcessGanache: false,
                shouldAllowUnlimitedContractSize: true,
                unlocked_accounts: [makerAddress],
            };
            provider = dev_utils_1.web3Factory.getRpcProvider(providerConfigs);
            // HACK(jalextowle): We can't currently specify an out of process provider for a blockchainTests
            // suite, so we need to update env.blockchainLifecycle so that the resets suite works as expected.
            env.blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(new web3_wrapper_1.Web3Wrapper(provider));
            exchangeAddress = contract_addresses_1.getContractAddressesForChainOrThrow(chainId).exchange;
            exchange = new contracts_exchange_1.ExchangeContract(exchangeAddress, provider);
            const erc20ProxyAddress = contract_addresses_1.getContractAddressesForChainOrThrow(chainId).erc20Proxy;
            // Configure two tokens and an order factory with a maker address so
            // that valid orders can be created easily in the tests. The two dummy tokens are
            // used in the makerToken and feeToken fields.
            const makerToken = new contracts_erc20_1.DummyERC20TokenContract('0x34d402f14d58e001d8efbe6585051bf9706aa064', provider);
            const feeToken = new contracts_erc20_1.DummyERC20TokenContract('0xcdb594a32b1cc3479d8746279712c39d18a07fc0', provider);
            const mintAmount = new utils_1.BigNumber('100e18');
            // tslint:disable-next-line: await-promise
            yield makerToken.mint(mintAmount).awaitTransactionSuccessAsync({ from: makerAddress });
            // tslint:disable-next-line: await-promise
            yield feeToken.mint(mintAmount).awaitTransactionSuccessAsync({ from: makerAddress });
            // tslint:disable-next-line: await-promise
            yield makerToken
                .approve(erc20ProxyAddress, new utils_1.BigNumber('100e18'))
                .awaitTransactionSuccessAsync({ from: makerAddress });
            // tslint:disable-next-line: await-promise
            yield feeToken
                .approve(erc20ProxyAddress, new utils_1.BigNumber('100e18'))
                .awaitTransactionSuccessAsync({ from: makerAddress });
            // tslint:disable-next-line: await-promise
            yield makerToken
                .approve('0x5315e44798395d4a952530d131249fe00f554565', new utils_1.BigNumber('100e18'))
                .awaitTransactionSuccessAsync({ from: makerAddress });
            // tslint:disable-next-line: await-promise
            yield feeToken
                .approve('0x5315e44798395d4a952530d131249fe00f554565', new utils_1.BigNumber('100e18'))
                .awaitTransactionSuccessAsync({ from: makerAddress });
            makerTokenAddress = makerToken.address;
            feeTokenAddress = feeToken.address;
            orderFactory = new contracts_test_utils_1.OrderFactory(contracts_test_utils_1.constants.TESTRPC_PRIVATE_KEYS[accounts.indexOf(makerAddress)], Object.assign(Object.assign({}, contracts_test_utils_1.constants.STATIC_ORDER_PARAMS), { feeRecipientAddress: contracts_test_utils_1.constants.NULL_ADDRESS, makerAddress,
                exchangeAddress, chainId: 1337, makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(makerToken.address), takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(makerToken.address), makerFeeAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(feeToken.address), takerFeeAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(feeToken.address) }));
        }));
        describe('#LimitOrderV4', () => __awaiter(void 0, void 0, void 0, function* () {
            it('is being signed properly', () => __awaiter(void 0, void 0, void 0, function* () {
                const testOrder = new protocol_utils_1.LimitOrder({
                    chainId: 1,
                    verifyingContract: '0x5315e44798395d4a952530d131249fe00f554565',
                    makerToken: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
                    takerToken: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
                    makerAmount: new utils_1.BigNumber(100),
                    takerAmount: new utils_1.BigNumber(42),
                    takerTokenFeeAmount: new utils_1.BigNumber(0),
                    maker: '0x05cac48d17ecc4d8a9db09dde766a03959b98367',
                    taker: '0x0000000000000000000000000000000000000000',
                    sender: '0x0000000000000000000000000000000000000000',
                    feeRecipient: '0x0000000000000000000000000000000000000000',
                    pool: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    expiry: new utils_1.BigNumber(1611614113),
                    salt: new utils_1.BigNumber(464085317),
                });
                const expectedHash = '0x4de42b085ed2ce2ef4f8e64df51b7d3ee8586f8ab781ffe45fa45ce884cd278d';
                const hash = testOrder.getHash();
                contracts_test_utils_1.expect(hash).to.be.eq(expectedHash);
                const expectedSignature = {
                    signatureType: 3,
                    v: 28,
                    r: '0x575a304e2fe23038a0e4561097b8e47b75270dc28c6bda49bc9a431a6aa9d980',
                    s: '0x43f976de7c59159b0ea2e5594dadc2ec1c7ff4088f76160ab4aa49999996ef7f',
                };
                const signature = testOrder.getSignatureWithKey('0xee094b79aa0315914955f2f09be9abe541dcdc51f0aae5bec5453e9f73a471a6');
                contracts_test_utils_1.expect(signature).to.be.deep.eq(expectedSignature);
            }));
        }));
        describe('#findOrdersV4Async', () => __awaiter(void 0, void 0, void 0, function* () {
            it('returns all orders when no options are provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const ordersLength = 1;
                const orders = [];
                console.log('token addresses', makerTokenAddress, feeTokenAddress);
                for (let i = 0; i < ordersLength; i++) {
                    const order = getRandomLimitOrder().clone({
                        maker: makerAddress,
                        makerToken: makerTokenAddress,
                        takerToken: feeTokenAddress,
                        chainId: 1337,
                    });
                    const signature = yield order.getSignatureWithProviderAsync(provider);
                    const signedOrder = {
                        chainId: order.chainId,
                        verifyingContract: order.verifyingContract,
                        makerToken: order.makerToken,
                        takerToken: order.takerToken,
                        makerAmount: order.makerAmount,
                        takerAmount: order.takerAmount,
                        takerTokenFeeAmount: order.takerTokenFeeAmount,
                        maker: order.maker,
                        taker: order.taker,
                        sender: order.sender,
                        feeRecipient: order.feeRecipient,
                        pool: order.pool,
                        expiry: order.expiry,
                        salt: order.salt,
                        signature: {
                            signatureType: signature.signatureType,
                            v: signature.v,
                            r: signature.r,
                            s: signature.s,
                        },
                    };
                    orders[i] = signedOrder;
                    console.log(signedOrder);
                }
                console.log('adding orders');
                // const newClient = new MeshGraphQLClient({
                //     httpUrl: `http://localhost:60567/graphql`,
                //     webSocketUrl: `ws://localhost:60567/graphql`,
                // });
                const validationResults = yield deployment.client.addOrdersV4Async(orders);
                console.log(validationResults.rejected);
                contracts_test_utils_1.expect(validationResults.accepted.length).to.be.eq(ordersLength);
                // Verify that all of the orders that were added to the mesh node
                // were returned in the response.
                console.log('checking orders');
                const gotOrders = yield deployment.client.findOrdersV4Async();
                console.log(gotOrders);
                // const expectedOrders = orders.map((order) => ({
                //     ...order,
                //     hash: orderHashUtils.getOrderHashHex(order),
                //     fillableTakerAssetAmount: order.takerAssetAmount,
                // }));
                // expectContainsOrders(gotOrders, expectedOrders);
            }));
            it('returns orders that match a given query', () => __awaiter(void 0, void 0, void 0, function* () {
                const ordersLength = 10;
                const orders = [];
                // Create some orders with makerAssetAmount = 1, 2, 3, etc.
                for (let i = 0; i < ordersLength; i++) {
                    orders[i] = yield orderFactory.newSignedOrderAsync({
                        makerAssetAmount: new utils_1.BigNumber(i + 1),
                    });
                }
                const validationResults = yield deployment.client.addOrdersAsync(orders);
                contracts_test_utils_1.expect(validationResults.accepted.length).to.be.eq(ordersLength);
                // Verify that all of the orders that were added to the mesh node
                // were returned in the response.
                const gotOrders = yield deployment.client.findOrdersAsync({
                    filters: [{ field: 'makerAssetAmount', kind: index_1.FilterKind.LessOrEqual, value: new utils_1.BigNumber(7) }],
                    sort: [{ field: 'makerAssetAmount', direction: index_1.SortDirection.Desc }],
                    limit: 5,
                });
                // We expect 5 orders sorted in descending order by makerAssetAmount starting at 7.
                // I.e. orders with makerAmounts of 7, 6, 5, 4, and 3.
                const expectedOrders = orders.map((order) => (Object.assign(Object.assign({}, order), { hash: contracts_test_utils_1.orderHashUtils.getOrderHashHex(order), fillableTakerAssetAmount: order.takerAssetAmount })));
                const sortedExpectedOrders = sortOrdersByMakerAssetAmount(expectedOrders).reverse();
                // tslint:disable-next-line: custom-no-magic-numbers
                contracts_test_utils_1.expect(gotOrders).to.be.deep.eq(sortedExpectedOrders.slice(3, 8));
            }));
        }));
        describe('#addOrdersAsync', () => __awaiter(void 0, void 0, void 0, function* () {
            it('accepts valid order', () => __awaiter(void 0, void 0, void 0, function* () {
                const order = yield orderFactory.newSignedOrderAsync({});
                const validationResults = yield deployment.client.addOrdersAsync([order]);
                contracts_test_utils_1.expect(validationResults).to.be.deep.eq({
                    accepted: [
                        {
                            isNew: true,
                            order: Object.assign(Object.assign({}, order), { hash: contracts_test_utils_1.orderHashUtils.getOrderHashHex(order), fillableTakerAssetAmount: order.takerAssetAmount }),
                        },
                    ],
                    rejected: [],
                });
            }));
            it('accepts expired order with "keepExpired"', () => __awaiter(void 0, void 0, void 0, function* () {
                const order = yield orderFactory.newSignedOrderAsync({
                    expirationTimeSeconds: new utils_1.BigNumber(0),
                });
                const hash = contracts_test_utils_1.orderHashUtils.getOrderHashHex(order);
                const validationResults = yield deployment.client.addOrdersAsync([order], false, { keepExpired: true });
                contracts_test_utils_1.expect(validationResults).to.be.deep.eq({
                    accepted: [],
                    rejected: [
                        {
                            hash,
                            order,
                            code: index_1.RejectedOrderCode.OrderExpired,
                            message: 'order expired according to latest block timestamp',
                        },
                    ],
                });
                const responseOrder = yield deployment.client.getOrderAsync(hash);
                contracts_test_utils_1.expect(responseOrder).to.be.deep.eq(Object.assign(Object.assign({}, order), { fillableTakerAssetAmount: new utils_1.BigNumber(0), hash }));
            }));
            it('rejects order with invalid signature', () => __awaiter(void 0, void 0, void 0, function* () {
                const invalidOrder = Object.assign(Object.assign({}, (yield orderFactory.newSignedOrderAsync({}))), { signature: utils_1.hexUtils.hash('0x0') });
                const validationResults = yield deployment.client.addOrdersAsync([invalidOrder]);
                contracts_test_utils_1.expect(validationResults).to.be.deep.eq({
                    accepted: [],
                    rejected: [
                        {
                            hash: contracts_test_utils_1.orderHashUtils.getOrderHashHex(invalidOrder),
                            order: invalidOrder,
                            code: index_1.RejectedOrderCode.OrderHasInvalidSignature,
                            message: 'order signature must be valid',
                        },
                    ],
                });
            }));
        }));
        describe('#getStatsAsync', () => {
            it('Ensure that the stats are correct when no orders have been added', () => __awaiter(void 0, void 0, void 0, function* () {
                const stats = yield deployment.client.getStatsAsync();
                // NOTE(jalextowle): Ensure that the latest block of the returned
                // stats is valid and then clear the field since we don't know
                // the block number of the stats in this test a priori.
                contracts_test_utils_1.expect(stats.latestBlock).to.not.be.undefined();
                contracts_test_utils_1.expect(stats.latestBlock.number).to.be.bignumber.greaterThan(0);
                stats.latestBlock = {
                    number: new utils_1.BigNumber(0),
                    hash: '',
                };
                contracts_test_utils_1.expect(stats.version).to.not.be.eq('');
                stats.version = '';
                const now = new Date(Date.now());
                const expectedStartOfCurrentUTCDay = `${now.getUTCFullYear()}-${leftPad(now.getUTCMonth() + 1)}-${leftPad(now.getUTCDate())}T00:00:00Z`;
                const expectedStats = {
                    version: '',
                    pubSubTopic: '/0x-orders/version/3/chain/1337/schema/e30=',
                    rendezvous: '/0x-mesh/network/1337/version/2',
                    peerID: deployment.peerID,
                    ethereumChainID: 1337,
                    latestBlock: {
                        number: new utils_1.BigNumber(0),
                        hash: '',
                    },
                    numPeers: 0,
                    numOrders: 0,
                    numOrdersIncludingRemoved: 0,
                    maxExpirationTime: contracts_test_utils_1.constants.MAX_UINT256,
                    startOfCurrentUTCDay: new Date(expectedStartOfCurrentUTCDay),
                    ethRPCRequestsSentInCurrentUTCDay: 0,
                    ethRPCRateLimitExpiredRequests: 0,
                };
                contracts_test_utils_1.expect(stats).to.be.deep.eq(expectedStats);
            }));
        });
        describe('#getOrderAsync', () => __awaiter(void 0, void 0, void 0, function* () {
            it('gets an order by its hash', () => __awaiter(void 0, void 0, void 0, function* () {
                const order = yield orderFactory.newSignedOrderAsync({});
                const validationResults = yield deployment.client.addOrdersAsync([order]);
                contracts_test_utils_1.expect(validationResults.accepted.length).to.be.eq(1);
                const orderHash = contracts_test_utils_1.orderHashUtils.getOrderHashHex(order);
                const foundOrder = yield deployment.client.getOrderAsync(orderHash);
                const expectedOrder = Object.assign(Object.assign({}, order), { hash: orderHash, fillableTakerAssetAmount: order.takerAssetAmount });
                contracts_test_utils_1.expect(foundOrder).to.be.deep.eq(expectedOrder);
            }));
            it('returns null when the order does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                const nonExistentOrderHash = '0xabcd46910c6a8a4730878e6e8a4abb328844c0b58f0cdfbb5b6ad28ee0bae347';
                const foundOrder = yield deployment.client.getOrderAsync(nonExistentOrderHash);
                contracts_test_utils_1.expect(foundOrder).to.be.null();
            }));
        }));
        describe('#findOrdersAsync', () => __awaiter(void 0, void 0, void 0, function* () {
            it('returns all orders when no options are provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const ordersLength = 10;
                const orders = [];
                for (let i = 0; i < ordersLength; i++) {
                    orders[i] = yield orderFactory.newSignedOrderAsync({});
                }
                const validationResults = yield deployment.client.addOrdersAsync(orders);
                contracts_test_utils_1.expect(validationResults.accepted.length).to.be.eq(ordersLength);
                // Verify that all of the orders that were added to the mesh node
                // were returned in the response.
                const gotOrders = yield deployment.client.findOrdersAsync();
                const expectedOrders = orders.map((order) => (Object.assign(Object.assign({}, order), { hash: contracts_test_utils_1.orderHashUtils.getOrderHashHex(order), fillableTakerAssetAmount: order.takerAssetAmount })));
                expectContainsOrders(gotOrders, expectedOrders);
            }));
            it('returns orders that match a given query', () => __awaiter(void 0, void 0, void 0, function* () {
                const ordersLength = 10;
                const orders = [];
                // Create some orders with makerAssetAmount = 1, 2, 3, etc.
                for (let i = 0; i < ordersLength; i++) {
                    orders[i] = yield orderFactory.newSignedOrderAsync({
                        makerAssetAmount: new utils_1.BigNumber(i + 1),
                    });
                }
                const validationResults = yield deployment.client.addOrdersAsync(orders);
                contracts_test_utils_1.expect(validationResults.accepted.length).to.be.eq(ordersLength);
                // Verify that all of the orders that were added to the mesh node
                // were returned in the response.
                const gotOrders = yield deployment.client.findOrdersAsync({
                    filters: [{ field: 'makerAssetAmount', kind: index_1.FilterKind.LessOrEqual, value: new utils_1.BigNumber(7) }],
                    sort: [{ field: 'makerAssetAmount', direction: index_1.SortDirection.Desc }],
                    limit: 5,
                });
                // We expect 5 orders sorted in descending order by makerAssetAmount starting at 7.
                // I.e. orders with makerAmounts of 7, 6, 5, 4, and 3.
                const expectedOrders = orders.map((order) => (Object.assign(Object.assign({}, order), { hash: contracts_test_utils_1.orderHashUtils.getOrderHashHex(order), fillableTakerAssetAmount: order.takerAssetAmount })));
                const sortedExpectedOrders = sortOrdersByMakerAssetAmount(expectedOrders).reverse();
                // tslint:disable-next-line: custom-no-magic-numbers
                contracts_test_utils_1.expect(gotOrders).to.be.deep.eq(sortedExpectedOrders.slice(3, 8));
            }));
        }));
        describe('#rawQueryAsync', () => __awaiter(void 0, void 0, void 0, function* () {
            it('runs a raw query and returns raw results', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield deployment.client.rawQueryAsync({
                    query: client_1.gql `
                        {
                            stats {
                                numOrders
                            }
                        }
                    `,
                });
                const expectedResponse = {
                    data: {
                        stats: {
                            numOrders: 0,
                        },
                    },
                    loading: false,
                    networkStatus: 7,
                };
                contracts_test_utils_1.expect(response).to.be.deep.eq(expectedResponse);
            }));
        }));
        describe('#subscribeToOrdersAsync', () => __awaiter(void 0, void 0, void 0, function* () {
            it('should receive subscription updates about added orders', (done) => {
                (() => __awaiter(void 0, void 0, void 0, function* () {
                    // Keep track of whether or not the test is complete. Used to determine
                    // whether WebSocket errors should be considered test failures.
                    let isDone = false;
                    // Create orders to add to the mesh node.
                    const ordersLength = 10;
                    const orders = [];
                    for (let i = 0; i < ordersLength; i++) {
                        orders[i] = yield orderFactory.newSignedOrderAsync({});
                    }
                    // Subscribe to orders and wait for order events.
                    const orderEvents = deployment.client.onOrderEvents();
                    orderEvents.subscribe({
                        error: (err) => {
                            if (isDone && err.message === 'WebSocket connection lost') {
                                // This error is expected to happen after the server is shut down.
                            }
                            else {
                                // Other errors are not expected.
                                throw err;
                            }
                        },
                        next: (events) => {
                            var _a, _b;
                            contracts_test_utils_1.expect(events.length).to.be.eq(orders.length);
                            for (const orderEvent of events) {
                                contracts_test_utils_1.expect(orderEvent.endState).to.be.eq(index_1.OrderEventEndState.Added);
                                const now = new Date().getUTCMilliseconds();
                                // tslint:disable-next-line:custom-no-magic-numbers
                                assertRoughlyEquals(now, orderEvent.timestampMs, secondsToMs(10));
                            }
                            // Ensure that all of the orders that were added had an associated order event emitted.
                            for (const order of orders) {
                                const orderHash = contracts_test_utils_1.orderHashUtils.getOrderHashHex(order);
                                let hasSeenMatch = false;
                                for (const event of events) {
                                    const orderHash = ((_a = event.order) === null || _a === void 0 ? void 0 : _a.hash) || ((_b = event.orderv4) === null || _b === void 0 ? void 0 : _b.hash) || null;
                                    if (orderHash === orderHash) {
                                        hasSeenMatch = true;
                                        const expectedOrder = Object.assign(Object.assign({}, order), { hash: orderHash, fillableTakerAssetAmount: order.takerAssetAmount });
                                        contracts_test_utils_1.expect(event.order).to.be.deep.eq(expectedOrder);
                                        break;
                                    }
                                }
                                contracts_test_utils_1.expect(hasSeenMatch).to.be.true();
                            }
                            isDone = true;
                            done();
                        },
                    });
                    const validationResults = yield deployment.client.addOrdersAsync(orders);
                    contracts_test_utils_1.expect(validationResults.accepted.length).to.be.eq(ordersLength);
                }))().catch(done);
            });
            it('should receive subscription updates about cancelled orders', (done) => {
                (() => __awaiter(void 0, void 0, void 0, function* () {
                    // Keep track of whether or not the test is complete. Used to determine
                    // whether WebSocket errors should be considered test failures.
                    let isDone = false;
                    // Add an order and then cancel it.
                    const order = yield orderFactory.newSignedOrderAsync({});
                    const validationResults = yield deployment.client.addOrdersAsync([order]);
                    contracts_test_utils_1.expect(validationResults.accepted.length).to.be.eq(1);
                    // Subscribe to order events and assert that only a single cancel event was received.
                    const orderEvents = deployment.client.onOrderEvents();
                    orderEvents.subscribe({
                        error: (err) => {
                            if (isDone && err.message === 'WebSocket connection lost') {
                                // This error is expected to happen after the server is shut down.
                            }
                            else {
                                // Other errors are not expected.
                                throw err;
                            }
                        },
                        next: (events) => {
                            // Ensure that the correct cancel event was logged.
                            contracts_test_utils_1.expect(events.length).to.be.eq(1);
                            const [orderEvent] = events;
                            contracts_test_utils_1.expect(orderEvent.endState).to.be.eq(index_1.OrderEventEndState.Cancelled);
                            const expectedOrder = Object.assign(Object.assign({}, order), { hash: contracts_test_utils_1.orderHashUtils.getOrderHashHex(order), fillableTakerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT });
                            contracts_test_utils_1.expect(orderEvent.order).to.be.deep.eq(expectedOrder);
                            const now = new Date().getUTCMilliseconds();
                            assertRoughlyEquals(orderEvent.timestampMs, now, secondsToMs(2));
                            contracts_test_utils_1.expect(orderEvent.contractEvents.length).to.be.eq(1);
                            // Ensure that the contract event is correct.
                            const [contractEvent] = orderEvent.contractEvents;
                            contracts_test_utils_1.expect(contractEvent.address).to.be.eq(exchangeAddress);
                            contracts_test_utils_1.expect(contractEvent.kind).to.be.equal('ExchangeCancelEvent');
                            contracts_test_utils_1.expect(contractEvent.logIndex).to.be.eq(0);
                            contracts_test_utils_1.expect(contractEvent.isRemoved).to.be.false();
                            contracts_test_utils_1.expect(contractEvent.txIndex).to.be.eq(0);
                            const hashLength = 66;
                            contracts_test_utils_1.expect(contractEvent.blockHash.length).to.be.eq(hashLength);
                            contracts_test_utils_1.expect(contractEvent.blockHash).to.not.be.eq(contracts_test_utils_1.constants.NULL_BYTES32);
                            contracts_test_utils_1.expect(contractEvent.txHash.length).to.be.eq(hashLength);
                            const parameters = contractEvent.parameters;
                            parameters.makerAddress = parameters.makerAddress.toLowerCase();
                            parameters.senderAddress = parameters.makerAddress;
                            contracts_test_utils_1.expect(parameters.feeRecipientAddress.toLowerCase()).to.be.eq(order.feeRecipientAddress);
                            contracts_test_utils_1.expect(parameters.makerAddress.toLowerCase()).to.be.eq(makerAddress);
                            contracts_test_utils_1.expect(parameters.makerAssetData).to.be.eq(order.makerAssetData);
                            contracts_test_utils_1.expect(parameters.orderHash).to.be.eq(contracts_test_utils_1.orderHashUtils.getOrderHashHex(order));
                            contracts_test_utils_1.expect(parameters.senderAddress.toLowerCase()).to.be.eq(makerAddress);
                            contracts_test_utils_1.expect(parameters.takerAssetData).to.be.eq(order.takerAssetData);
                            isDone = true;
                            done();
                        },
                    });
                    // Cancel an order and then wait for the emitted order event.
                    // tslint:disable-next-line: await-promise
                    yield exchange.cancelOrder(order).awaitTransactionSuccessAsync({ from: makerAddress });
                }))().catch(done);
            });
        }));
    });
});
function assertRoughlyEquals(a, b, delta) {
    contracts_test_utils_1.expect(Math.abs(a - b)).to.be.lessThan(delta);
}
function leftPad(a, paddingDigits = 2) {
    return `${'0'.repeat(paddingDigits - a.toString().length)}${a.toString()}`;
}
function secondsToMs(seconds) {
    const msPerSecond = 1000;
    return seconds * msPerSecond;
}
function sortOrdersByMakerAssetAmount(orders) {
    return orders.sort((a, b) => {
        if (a.makerAssetAmount.gt(b.makerAssetAmount)) {
            return 1;
        }
        else if (a.makerAssetAmount.lt(b.makerAssetAmount)) {
            return -1;
        }
        return 0;
    });
}
// Verify that all of the orders that were added to the mesh node
// were returned in the `getOrders` rpc response
function expectContainsOrders(gotOrders, expectedOrders) {
    for (const expectedOrder of expectedOrders) {
        let hasSeenMatch = false;
        for (const gotOrder of gotOrders) {
            if (expectedOrder.hash === gotOrder.hash) {
                hasSeenMatch = true;
                contracts_test_utils_1.expect(gotOrder).to.be.deep.eq(expectedOrder);
                break;
            }
        }
        contracts_test_utils_1.expect(hasSeenMatch).to.be.true();
    }
}
// tslint:disable-line:max-file-line-count
//# sourceMappingURL=graphql_client_test.js.map