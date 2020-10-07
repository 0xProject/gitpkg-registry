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
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const assert_1 = require("../utils/assert");
const swap_quote_consumer_utils_1 = require("../utils/swap_quote_consumer_utils");
const exchange_proxy_swap_quote_consumer_1 = require("./exchange_proxy_swap_quote_consumer");
const exchange_swap_quote_consumer_1 = require("./exchange_swap_quote_consumer");
const forwarder_swap_quote_consumer_1 = require("./forwarder_swap_quote_consumer");
class SwapQuoteConsumer {
    static getSwapQuoteConsumer(supportedProvider, options = {}) {
        return new SwapQuoteConsumer(supportedProvider, options);
    }
    constructor(supportedProvider, options = {}) {
        const { chainId } = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        assert_1.assert.isNumber('chainId', chainId);
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        this.provider = provider;
        this.chainId = chainId;
        this._contractAddresses = options.contractAddresses || contract_addresses_1.getContractAddressesForChainOrThrow(chainId);
        this._exchangeConsumer = new exchange_swap_quote_consumer_1.ExchangeSwapQuoteConsumer(supportedProvider, this._contractAddresses, options);
        this._forwarderConsumer = new forwarder_swap_quote_consumer_1.ForwarderSwapQuoteConsumer(supportedProvider, this._contractAddresses, options);
        this._exchangeProxyConsumer = new exchange_proxy_swap_quote_consumer_1.ExchangeProxySwapQuoteConsumer(supportedProvider, this._contractAddresses, options);
    }
    /**
     * Given a SwapQuote, returns 'CalldataInfo' for a 0x extesion or exchange call. See type definition of CalldataInfo for more information.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting SmartContractParams. See type definition for more information.
     */
    getCalldataOrThrowAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isValidSwapQuote('quote', quote);
            const consumer = yield this._getConsumerForSwapQuoteAsync(opts);
            return consumer.getCalldataOrThrowAsync(quote, opts);
        });
    }
    /**
     * Given a SwapQuote and desired rate (in takerAsset), attempt to execute the swap with 0x extension or exchange contract.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting CalldataInfo. See type definition for more information.
     */
    executeSwapQuoteOrThrowAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isValidSwapQuote('quote', quote);
            const consumer = yield this._getConsumerForSwapQuoteAsync(opts);
            return consumer.executeSwapQuoteOrThrowAsync(quote, opts);
        });
    }
    /**
     * Given a SwapQuote, returns optimal 0x protocol interface (extension or no extension) to perform the swap.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting optimal exteion contract to fill quote. See type definition for more information.
     */
    getOptimalExtensionContractTypeAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return swap_quote_consumer_utils_1.swapQuoteConsumerUtils.getExtensionContractTypeForSwapQuoteAsync(quote, this._contractAddresses, this.provider, opts);
        });
    }
    _getConsumerForSwapQuoteAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (opts.useExtensionContract) {
                case types_1.ExtensionContractType.Forwarder:
                    return this._forwarderConsumer;
                case types_1.ExtensionContractType.ExchangeProxy:
                    return this._exchangeProxyConsumer;
                default:
                    return this._exchangeConsumer;
            }
        });
    }
}
exports.SwapQuoteConsumer = SwapQuoteConsumer;
//# sourceMappingURL=swap_quote_consumer.js.map