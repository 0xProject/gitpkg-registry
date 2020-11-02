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
const utils_1 = require("./utils");
class OrderSet {
    constructor() {
        this._map = new Map();
        this[Symbol.iterator] = this.values;
    }
    size() {
        return this._map.size;
    }
    addAsync(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderHash = utils_1.utils.getOrderHash(item);
            item.metaData.orderHash = orderHash;
            this._map.set(orderHash, item);
        });
    }
    addManyAsync(items) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of items) {
                yield this.addAsync(item);
            }
        });
    }
    hasAsync(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._map.has(utils_1.utils.getOrderHash(order));
        });
    }
    diffAsync(other) {
        return __awaiter(this, void 0, void 0, function* () {
            const added = [];
            const removed = [];
            for (const otherItem of other.values()) {
                const doesContainItem = this._map.has(utils_1.utils.getOrderHash(otherItem));
                if (!doesContainItem) {
                    added.push(otherItem);
                }
            }
            for (const item of this.values()) {
                const doesContainItem = other._map.has(utils_1.utils.getOrderHash(item));
                if (!doesContainItem) {
                    removed.push(item);
                }
            }
            return { added, removed };
        });
    }
    values() {
        return this._map.values();
    }
    deleteAsync(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._map.delete(utils_1.utils.getOrderHash(item));
        });
    }
    deleteManyAsync(items) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of items) {
                yield this.deleteAsync(item);
            }
        });
    }
}
exports.OrderSet = OrderSet;
//# sourceMappingURL=order_set.js.map