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
// AssetPairItem requires precision but some OrderProviders may not
// enforce any precision. This is not the token decimal but the
// maximum precision for an orderbook.
exports.DEFAULT_TOKEN_PRECISION = 18;
class BaseOrderProvider {
    constructor(orderStore) {
        this._orderStore = orderStore;
    }
    _updateStoreAsync(addedRemoved) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._orderStore.updateAsync(addedRemoved);
        });
    }
}
exports.BaseOrderProvider = BaseOrderProvider;
//# sourceMappingURL=base_order_provider.js.map