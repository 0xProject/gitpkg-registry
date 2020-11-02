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
const utils_1 = require("../utils");
const base_order_provider_1 = require("./base_order_provider");
exports.PER_PAGE_DEFAULT = 100;
class BaseSRAOrderProvider extends base_order_provider_1.BaseOrderProvider {
    /**
     * This is an internal class for Websocket and Polling Order Providers
     */
    constructor(orderStore, httpEndpoint, perPage = exports.PER_PAGE_DEFAULT) {
        super(orderStore);
        this._httpClient = new connect_1.HttpClient(httpEndpoint);
        this._perPage = perPage;
    }
    /**
     * Returns the availale Asset pairs from the SRA endpoint. This response is direct from the endpoint
     * so this call blocks until the response arrives.
     */
    getAvailableAssetDatasAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOpts = {
                perPage: this._perPage,
            };
            let recordsToReturn = [];
            let hasMorePages = true;
            let page = 1;
            while (hasMorePages) {
                const { total, records, perPage } = yield utils_1.utils.attemptAsync(() => this._httpClient.getAssetPairsAsync(requestOpts));
                recordsToReturn = [...recordsToReturn, ...records];
                page += 1;
                const lastPage = Math.ceil(total / perPage);
                hasMorePages = page <= lastPage;
            }
            return recordsToReturn;
        });
    }
    /**
     * Submits the SignedOrder to the SRA endpoint
     * @param orders the set of signed orders to add
     */
    addOrdersAsync(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const accepted = [];
            const rejected = [];
            for (const order of orders) {
                try {
                    yield this._httpClient.submitOrderAsync(order);
                    accepted.push(order);
                }
                catch (e) {
                    rejected.push({ order, message: e.message });
                }
            }
            return { accepted, rejected };
        });
    }
    _fetchLatestOrdersAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [latestSellOrders, latestBuyOrders] = yield Promise.all([
                this._getAllPaginatedOrdersAsync(makerAssetData, takerAssetData),
                this._getAllPaginatedOrdersAsync(takerAssetData, makerAssetData),
            ]);
            return [...latestSellOrders, ...latestBuyOrders];
        });
    }
    _getAllPaginatedOrdersAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordsToReturn = [];
            const requestOpts = {
                makerAssetData,
                takerAssetData,
                perPage: this._perPage,
            };
            let hasMorePages = true;
            let page = 1;
            while (hasMorePages) {
                const { total, records, perPage } = yield utils_1.utils.attemptAsync(() => this._httpClient.getOrdersAsync(Object.assign({}, requestOpts, { page })));
                recordsToReturn = [...recordsToReturn, ...records];
                page += 1;
                const lastPage = Math.ceil(total / perPage);
                hasMorePages = page <= lastPage;
            }
            return recordsToReturn;
        });
    }
}
exports.BaseSRAOrderProvider = BaseSRAOrderProvider;
//# sourceMappingURL=base_sra_order_provider.js.map