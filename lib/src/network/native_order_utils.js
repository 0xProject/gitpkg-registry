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
exports.NativeOrderUtils = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const constants_1 = require("../constants");
const wrappers_1 = require("../wrappers");
const utils_1 = require("./utils");
const { ZERO_AMOUNT } = constants_1.constants;
class NativeOrderUtils {
    constructor(chain) {
        this.chain = chain;
        [this._nativeOrderUtilsContract, this._nativeOrderUtilsContractHelper] = utils_1.createContractWrapperAndHelper(chain, wrappers_1.NativeOrderUtilsContract, 'NativeOrderUtils');
        this.exchangeProxyAddress = contract_addresses_1.getContractAddressesForChainOrThrow(chain.chainId).exchangeProxy;
    }
    getLimitOrderFillableTakerAmountsAsync(orders, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (orders.length === 0) {
                return [];
            }
            try {
                return this._nativeOrderUtilsContractHelper.ethCallAsync(this._nativeOrderUtilsContract.getLimitOrderFillableTakerAssetAmounts, [orders.map(o => o.order), orders.map(o => o.signature), this.exchangeProxyAddress], { gas: orders.length * 300e3, maxCacheAgeMs: 10e3, batchId });
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to call getLimitOrderFillableMakerAssetAmounts(): ${err}`);
                return orders.map(_o => ZERO_AMOUNT);
            }
        });
    }
    getLimitOrderFillableMakerAmountsAsync(orders, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (orders.length === 0) {
                return [];
            }
            try {
                return this._nativeOrderUtilsContractHelper.ethCallAsync(this._nativeOrderUtilsContract.getLimitOrderFillableMakerAssetAmounts, [orders.map(o => o.order), orders.map(o => o.signature), this.exchangeProxyAddress], { gas: orders.length * 300e3, maxCacheAgeMs: 10e3, batchId });
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(`Failed to call getLimitOrderFillableMakerAssetAmounts(): ${err}`);
                return orders.map(_o => ZERO_AMOUNT);
            }
        });
    }
}
exports.NativeOrderUtils = NativeOrderUtils;
//# sourceMappingURL=native_order_utils.js.map