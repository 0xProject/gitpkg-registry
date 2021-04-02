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
exports.MeshGraphQLClient = exports.Observable = exports.RejectedOrderCode = exports.OrderEventEndState = exports.SortDirection = exports.FilterKind = void 0;
const client_1 = require("@apollo/client");
const core_1 = require("@apollo/client/core");
const error_1 = require("@apollo/client/link/error");
const ws_1 = require("@apollo/client/link/ws");
const utilities_1 = require("@apollo/client/utilities");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const ws = require("ws");
const Observable = require("zen-observable");
exports.Observable = Observable;
const browser_link_1 = require("./browser_link");
const queries_1 = require("./queries");
const types_1 = require("./types");
var types_2 = require("./types");
Object.defineProperty(exports, "FilterKind", { enumerable: true, get: function () { return types_2.FilterKind; } });
Object.defineProperty(exports, "SortDirection", { enumerable: true, get: function () { return types_2.SortDirection; } });
Object.defineProperty(exports, "OrderEventEndState", { enumerable: true, get: function () { return types_2.OrderEventEndState; } });
Object.defineProperty(exports, "RejectedOrderCode", { enumerable: true, get: function () { return types_2.RejectedOrderCode; } });
const defaultOrderQueryLimit = 100;
class MeshGraphQLClient {
    constructor(linkConfig) {
        this._onReconnectedCallbacks = [];
        let link;
        if (linkConfig.httpUrl && linkConfig.webSocketUrl) {
            if (!linkConfig.httpUrl || !linkConfig.webSocketUrl) {
                throw new Error('mesh-graphql-client: Both "httpUrl" and "webSocketUrl" must be provided in "linkConfig" if a network link is used');
            }
            // Set up an apollo client with WebSocket and HTTP links. This allows
            // us to use the appropriate transport based on the type of the query.
            const httpLink = new client_1.HttpLink({
                uri: linkConfig.httpUrl,
            });
            const wsSubClient = new subscriptions_transport_ws_1.SubscriptionClient(linkConfig.webSocketUrl, {
                reconnect: true,
            }, 
            // Use ws in Node.js and native WebSocket in browsers.
            process.browser ? undefined : ws);
            const wsLink = new ws_1.WebSocketLink(wsSubClient);
            // HACK(kimpers): See https://github.com/apollographql/apollo-client/issues/5115#issuecomment-572318778
            // @ts-ignore at the time of writing the field is private and untyped
            const subscriptionClient = wsLink.subscriptionClient;
            subscriptionClient.onReconnected(() => {
                for (const cb of this._onReconnectedCallbacks) {
                    cb();
                }
            });
            const splitLink = client_1.split(({ query }) => {
                const definition = utilities_1.getMainDefinition(query);
                return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
            }, wsLink, httpLink);
            const errorLink = error_1.onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors != null && graphQLErrors.length > 0) {
                    const allMessages = graphQLErrors.map((err) => err.message).join('\n');
                    throw new Error(`GraphQL error(s): ${allMessages}`);
                }
                if (networkError != null) {
                    throw new Error(`Network error: ${networkError.message}`);
                }
            });
            link = client_1.from([errorLink, splitLink]);
            this._subscriptionClient = wsSubClient;
        }
        else {
            if (!linkConfig.mesh) {
                throw new Error('mesh-graphql-client: "httpUrl" and "webSocketUrl" cannot be provided if a browser link is used');
            }
            link = new browser_link_1.BrowserLink(linkConfig.mesh);
        }
        this._client = new core_1.ApolloClient({
            cache: new core_1.InMemoryCache({
                resultCaching: false,
                // This custom merge function is required for our orderEvents subscription.
                // See https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function
                typePolicies: {
                    Subscription: {
                        fields: {
                            orderEvents: {
                                merge(existing = [], incoming) {
                                    return [...existing, ...incoming];
                                },
                            },
                        },
                    },
                },
                // Stop apollo client from injecting `__typename` fields. These extra fields mess up our tests.
                addTypename: false,
            }),
            link,
        });
    }
    getStatsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._client.query({
                fetchPolicy: 'no-cache',
                query: queries_1.statsQuery,
            });
            if (resp.data === undefined) {
                throw new Error('received no data');
            }
            const stats = resp.data.stats;
            return types_1.fromStringifiedStats(stats);
        });
    }
    addOrdersAsync(orders, pinned = true, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._client.mutate({
                mutation: queries_1.addOrdersMutation,
                variables: {
                    orders: orders.map(types_1.toStringifiedSignedOrder),
                    pinned,
                    opts: Object.assign({ keepCancelled: false, keepExpired: false, keepFullyFilled: false, keepUnfunded: false }, opts),
                },
            });
            if (resp.data == null) {
                throw new Error('received no data');
            }
            const results = resp.data.addOrders;
            return types_1.fromStringifiedAddOrdersResults(results);
        });
    }
    addOrdersV4Async(orders, pinned = true, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._client.mutate({
                mutation: queries_1.addOrdersMutationV4,
                variables: {
                    orders: orders.map(types_1.toStringifiedSignedOrderV4),
                    pinned,
                    opts: Object.assign({ keepCancelled: false, keepExpired: false, keepFullyFilled: false, keepUnfunded: false }, opts),
                },
            });
            if (resp.data == null) {
                throw new Error('received no data');
            }
            const results = resp.data.addOrdersV4;
            return types_1.fromStringifiedAddOrdersResultsV4(results);
        });
    }
    getOrderAsync(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._client.query({
                query: queries_1.orderQuery,
                fetchPolicy: 'no-cache',
                variables: {
                    hash,
                },
            });
            if (resp.data == null) {
                throw new Error('received no data');
            }
            if (resp.data.order == null) {
                return null;
            }
            return types_1.fromStringifiedOrderWithMetadata(resp.data.order);
        });
    }
    getOrderV4Async(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._client.query({
                query: queries_1.orderQueryV4,
                fetchPolicy: 'no-cache',
                variables: {
                    hash,
                },
            });
            if (resp.data == null) {
                throw new Error('received no data');
            }
            if (resp.data.orderv4 == null) {
                return null;
            }
            return types_1.fromStringifiedOrderWithMetadataV4(resp.data.orderv4);
        });
    }
    findOrdersAsync(query = { sort: [], filters: [], limit: defaultOrderQueryLimit }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._client.query({
                query: queries_1.ordersQuery,
                fetchPolicy: 'no-cache',
                variables: {
                    sort: query.sort || [],
                    filters: ((_a = query.filters) === null || _a === void 0 ? void 0 : _a.map(types_1.convertFilterValue)) || [],
                    limit: query.limit || defaultOrderQueryLimit,
                },
            });
            if (resp.data == null) {
                throw new Error('received no data');
            }
            return resp.data.orders.map(types_1.fromStringifiedOrderWithMetadata);
        });
    }
    findOrdersV4Async(query = { sort: [], filters: [], limit: defaultOrderQueryLimit }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._client.query({
                query: queries_1.ordersQueryV4,
                fetchPolicy: 'no-cache',
                variables: {
                    sort: query.sort || [],
                    filters: ((_a = query.filters) === null || _a === void 0 ? void 0 : _a.map(types_1.convertFilterValue)) || [],
                    limit: query.limit || defaultOrderQueryLimit,
                },
            });
            if (resp.data == null) {
                throw new Error('received no data');
            }
            return resp.data.ordersv4.map(types_1.fromStringifiedOrderWithMetadataV4);
        });
    }
    onReconnected(cb) {
        this._onReconnectedCallbacks.push(cb);
    }
    onOrderEvents() {
        if (this._subscriptionClient !== undefined) {
            // NOTE(jalextowle): We must use a variable here because Typescript
            // thinks that this._subscriptionClient can become undefined between
            // Observable events.
            const subscriptionClient = this._subscriptionClient;
            // We handle incomingObservable and return a new outgoingObservable. This
            // can be thought of as "wrapping" the observable and we do it for two reasons:
            //
            // 1. Convert FetchResult<OrderEventResponse> to OrderEvent[]
            // 2. Handle errors and disconnects from the underlying websocket transport. If we don't
            //    do this, Apollo Client just ignores them completely and acts like everything is fine :(
            //
            const incomingObservable = this._client.subscribe({
                fetchPolicy: 'no-cache',
                query: queries_1.orderEventsSubscription,
            });
            const outgoingObservable = new Observable((observer) => {
                subscriptionClient.onError((err) => {
                    observer.error(new Error(err.message));
                });
                subscriptionClient.onDisconnected((event) => {
                    observer.error(new Error('WebSocket connection lost'));
                });
                incomingObservable.subscribe({
                    next: (result) => {
                        if (result.errors != null && result.errors.length > 0) {
                            result.errors.forEach((err) => observer.error(err));
                        }
                        else if (result.data == null) {
                            observer.error(new Error('received no data'));
                        }
                        else {
                            observer.next(result.data.orderEvents.map(types_1.fromStringifiedOrderEvent));
                        }
                    },
                    error: (err) => observer.error(err),
                    complete: () => observer.complete(),
                });
            });
            return outgoingObservable;
        }
        else {
            throw new Error('mesh-graphql-client: Browser GraphQl API does not support subscriptions. Please use the legacy API to listen to events and errors');
        }
    }
    rawQueryAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._subscriptionClient) {
                throw new Error('mesh-graphql-client: Raw queries are not currently supported by browser nodes');
            }
            return this._client.query(options);
        });
    }
}
exports.MeshGraphQLClient = MeshGraphQLClient;
//# sourceMappingURL=index.js.map