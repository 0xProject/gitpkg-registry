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
exports.NetworkUtils = void 0;
const wrappers_1 = require("../wrappers");
const utils_1 = require("./utils");
class NetworkUtils {
    constructor(chain) {
        this.chain = chain;
        this._tokenDecimalsCache = {};
        this._isAddressContractCache = {};
        [this._networkUtilsContract, this._networkUtilsContractHelper] = utils_1.createContractWrapperAndHelper(chain, wrappers_1.NetworkUtilsContract, 'NetworkUtils');
    }
    getTokenDecimalsAsync(tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tokens.length === 0) {
                return [];
            }
            const tokensToFetch = tokens.filter(t => this._tokenDecimalsCache[t] === undefined);
            let fetchedDecimals = [];
            if (tokensToFetch.length > 0) {
                fetchedDecimals = (yield this._networkUtilsContractHelper.ethCallAsync(this._networkUtilsContract.getTokenDecimals, [tokensToFetch], { gas: tokensToFetch.length * 64e3 })).map(d => d.toNumber());
            }
            for (let i = 0; i < tokensToFetch.length; ++i) {
                this._tokenDecimalsCache[tokensToFetch[i]] = fetchedDecimals[i];
            }
            return tokens.map(t => this._tokenDecimalsCache[t]);
        });
    }
    isAddressContractAsync(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isAddressContractCache[address] === undefined) {
                this._isAddressContractCache[address] = yield this._networkUtilsContractHelper.ethCallAsync(this._networkUtilsContract.isContract, [address], { gas: 32e3 });
            }
            return this._isAddressContractCache[address];
        });
    }
}
exports.NetworkUtils = NetworkUtils;
//# sourceMappingURL=network_utils.js.map