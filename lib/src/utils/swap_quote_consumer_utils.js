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
const order_utils_1 = require("@0x/order-utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const assert_1 = require("./assert");
const utils_1 = require("./utils");
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
    isValidForwarderSwapQuote(swapQuote, wethAssetData) {
        return exports.swapQuoteConsumerUtils.isValidForwarderSignedOrders(swapQuote.orders, wethAssetData);
    },
    isValidForwarderSignedOrders(orders, wethAssetData) {
        return _.every(orders, order => exports.swapQuoteConsumerUtils.isValidForwarderSignedOrder(order, wethAssetData));
    },
    isValidForwarderSignedOrder(order, wethAssetData) {
        return utils_1.isExactAssetData(order.takerAssetData, wethAssetData);
    },
    getExtensionContractTypeForSwapQuoteAsync(quote, contractAddresses, provider, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const wethAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(contractAddresses.etherToken);
            if (exports.swapQuoteConsumerUtils.isValidForwarderSwapQuote(quote, wethAssetData)) {
                if (opts.takerAddress !== undefined) {
                    assert_1.assert.isETHAddressHex('takerAddress', opts.takerAddress);
                }
                const ethAmount = opts.ethAmount ||
                    quote.worstCaseQuoteInfo.takerAssetAmount.plus(quote.worstCaseQuoteInfo.protocolFeeInWeiAmount);
                const takerAddress = yield exports.swapQuoteConsumerUtils.getTakerAddressAsync(provider, opts);
                const takerEthAndWethBalance = takerAddress !== undefined
                    ? yield exports.swapQuoteConsumerUtils.getEthAndWethBalanceAsync(provider, contractAddresses, takerAddress)
                    : [constants_1.constants.ZERO_AMOUNT, constants_1.constants.ZERO_AMOUNT];
                // TODO(david): when considering if there is enough Eth balance, should account for gas costs.
                const isEnoughEthAndWethBalance = _.map(takerEthAndWethBalance, (balance) => balance.isGreaterThanOrEqualTo(ethAmount));
                if (isEnoughEthAndWethBalance[1]) {
                    // should be more gas efficient to use exchange consumer, so if possible use it.
                    return types_1.ExtensionContractType.None;
                }
                else if (isEnoughEthAndWethBalance[0] && !isEnoughEthAndWethBalance[1]) {
                    return types_1.ExtensionContractType.Forwarder;
                }
                // Note: defaulting to forwarderConsumer if takerAddress is null or not enough balance of either wEth or Eth
                return types_1.ExtensionContractType.Forwarder;
            }
            else {
                return types_1.ExtensionContractType.None;
            }
        });
    },
};
//# sourceMappingURL=swap_quote_consumer_utils.js.map