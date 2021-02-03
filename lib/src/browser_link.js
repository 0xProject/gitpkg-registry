"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLink = void 0;
const core_1 = require("@apollo/client/link/core");
const Observable = require("zen-observable");
class BrowserLink extends core_1.ApolloLink {
    constructor(_mesh) {
        super();
        this._mesh = _mesh;
    }
    request(operation) {
        const wrapper = this._mesh.wrapper;
        if (wrapper === undefined) {
            throw new Error('mesh-graphql-client: Mesh node is not ready to receive requests');
        }
        switch (operation.operationName) {
            case 'AddOrders':
                if (operation.variables.opts.keepCancelled ||
                    operation.variables.opts.keepExpired ||
                    operation.variables.opts.keepFullyFilled ||
                    operation.variables.opts.keepUnfunded) {
                    throw new Error('mesh-graphql-client: Browser nodes do not support true values in AddOrdersOpts');
                }
                return new Observable((observer) => {
                    wrapper
                        .gqlAddOrdersAsync(operation.variables.orders, operation.variables.pinned)
                        .then((addOrders) => {
                        observer.next({ data: { addOrders } });
                        observer.complete();
                        return { data: { addOrders } };
                    })
                        .catch((err) => {
                        throw err;
                    });
                });
            case 'Order':
                return new Observable((observer) => {
                    wrapper
                        .gqlGetOrderAsync(operation.variables.hash)
                        .then((order) => {
                        observer.next({ data: { order } });
                        observer.complete();
                        return { data: { order } };
                    })
                        .catch((err) => {
                        throw err;
                    });
                });
            case 'Orders':
                return new Observable((observer) => {
                    wrapper
                        .gqlFindOrdersAsync(operation.variables.sort, operation.variables.filters, operation.variables.limit)
                        .then((orders) => {
                        observer.next({
                            data: {
                                orders,
                            },
                        });
                        observer.complete();
                        return {
                            data: {
                                orders,
                            },
                        };
                    })
                        .catch((err) => {
                        throw err;
                    });
                });
            case 'Stats':
                return new Observable((observer) => {
                    wrapper
                        .gqlGetStatsAsync()
                        .then((stats) => {
                        observer.next({
                            data: {
                                stats,
                            },
                        });
                        observer.complete();
                        return {
                            data: {
                                stats,
                            },
                        };
                    })
                        .catch((err) => {
                        throw err;
                    });
                });
            default:
                throw new Error('browser link: unrecognized operation name');
        }
    }
}
exports.BrowserLink = BrowserLink;
//# sourceMappingURL=browser_link.js.map