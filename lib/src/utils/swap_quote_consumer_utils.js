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
const contract_wrappers_1 = require("@0x/contract-wrappers");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const _ = require("lodash");
const types_1 = require("../types");
exports.swapQuoteConsumerUtils = {
    getTakerAddressOrThrowAsync(provider, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const takerAddress = yield exports.swapQuoteConsumerUtils.getTakerAddressAsync(provider, opts);
            if (takerAddress === undefined) {
                throw new Error(types_1.SwapQuoteConsumerError.NoAddressAvailable);
            }
            else {
                return takerAddress;
            }
        });
    },
    getTakerAddressAsync(provider, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (opts.takerAddress !== undefined) {
                return opts.takerAddress;
            }
            else {
                const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
                const availableAddresses = yield web3Wrapper.getAvailableAddressesAsync();
                const firstAvailableAddress = _.head(availableAddresses);
                if (firstAvailableAddress !== undefined) {
                    return firstAvailableAddress;
                }
                else {
                    return undefined;
                }
            }
        });
    },
    getEthAndWethBalanceAsync(provider, contractAddresses, takerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const weth = new contract_wrappers_1.WETH9Contract(contractAddresses.etherToken, provider);
            const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
            const ethBalance = yield web3Wrapper.getBalanceInWeiAsync(takerAddress);
            const wethBalance = yield weth.balanceOf(takerAddress).callAsync();
            return [ethBalance, wethBalance];
        });
    },
};
//# sourceMappingURL=swap_quote_consumer_utils.js.map