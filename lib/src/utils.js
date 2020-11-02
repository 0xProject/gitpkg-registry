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
const order_utils_1 = require("@0x/order-utils");
exports.utils = {
    getOrderHash(order) {
        if (order.metaData) {
            const apiOrder = order;
            const orderHash = apiOrder.metaData.orderHash || order_utils_1.orderHashUtils.getOrderHash(apiOrder.order);
            return orderHash;
        }
        else {
            const signedOrder = order;
            const orderHash = order_utils_1.orderHashUtils.getOrderHash(signedOrder);
            return orderHash;
        }
    },
    delayAsync(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable:no-inferred-empty-object-type
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    },
    attemptAsync(fn, opts = { interval: 1000, maxRetries: 10 }) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            let attempt = 0;
            let error;
            let isSuccess = false;
            while (!result && attempt < opts.maxRetries) {
                attempt++;
                try {
                    result = yield fn();
                    isSuccess = true;
                    error = undefined;
                }
                catch (err) {
                    error = err;
                    yield exports.utils.delayAsync(opts.interval);
                }
            }
            if (!isSuccess) {
                throw error;
            }
            return result;
        });
    },
};
//# sourceMappingURL=utils.js.map