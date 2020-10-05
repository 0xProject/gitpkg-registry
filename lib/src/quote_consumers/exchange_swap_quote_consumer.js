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
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const assert_1 = require("../utils/assert");
const swap_quote_consumer_utils_1 = require("../utils/swap_quote_consumer_utils");
class ExchangeSwapQuoteConsumer {
    constructor(supportedProvider, contractAddresses, options = {}) {
        this.contractAddresses = contractAddresses;
        const { chainId } = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        assert_1.assert.isNumber('chainId', chainId);
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        this.provider = provider;
        this.chainId = chainId;
        this._exchangeContract = new contract_wrappers_1.ExchangeContract(contractAddresses.exchange, supportedProvider);
    }
    getCalldataOrThrowAsync(quote, _opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isValidSwapQuote('quote', quote);
            const { orders } = quote;
            const signatures = _.map(orders, o => o.signature);
            let calldataHexString;
            if (quote.type === types_1.MarketOperation.Buy) {
                calldataHexString = this._exchangeContract
                    .marketBuyOrdersFillOrKill(orders, quote.makerAssetFillAmount, signatures)
                    .getABIEncodedTransactionData();
            }
            else {
                calldataHexString = this._exchangeContract
                    .marketSellOrdersFillOrKill(orders, quote.takerAssetFillAmount, signatures)
                    .getABIEncodedTransactionData();
            }
            return {
                calldataHexString,
                ethAmount: quote.worstCaseQuoteInfo.protocolFeeInWeiAmount,
                toAddress: this._exchangeContract.address,
                allowanceTarget: this.contractAddresses.erc20Proxy,
            };
        });
    }
    executeSwapQuoteOrThrowAsync(quote, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isValidSwapQuote('quote', quote);
            const { takerAddress, gasLimit, ethAmount } = opts;
            if (takerAddress !== undefined) {
                assert_1.assert.isETHAddressHex('takerAddress', takerAddress);
            }
            if (gasLimit !== undefined) {
                assert_1.assert.isNumber('gasLimit', gasLimit);
            }
            if (ethAmount !== undefined) {
                assert_1.assert.isBigNumber('ethAmount', ethAmount);
            }
            const { orders, gasPrice } = quote;
            const signatures = orders.map(o => o.signature);
            const finalTakerAddress = yield swap_quote_consumer_utils_1.swapQuoteConsumerUtils.getTakerAddressOrThrowAsync(this.provider, opts);
            const value = ethAmount || quote.worstCaseQuoteInfo.protocolFeeInWeiAmount;
            let txHash;
            if (quote.type === types_1.MarketOperation.Buy) {
                const { makerAssetFillAmount } = quote;
                txHash = yield this._exchangeContract
                    .marketBuyOrdersFillOrKill(orders, makerAssetFillAmount, signatures)
                    .sendTransactionAsync({
                    from: finalTakerAddress,
                    gas: gasLimit,
                    gasPrice,
                    value,
                });
            }
            else {
                const { takerAssetFillAmount } = quote;
                txHash = yield this._exchangeContract
                    .marketSellOrdersFillOrKill(orders, takerAssetFillAmount, signatures)
                    .sendTransactionAsync({
                    from: finalTakerAddress,
                    gas: gasLimit,
                    gasPrice,
                    value,
                });
            }
            // TODO(dorothy-zbornak): Handle signature request denied
            // (see contract-wrappers/decorators)
            // and ExchangeRevertErrors.IncompleteFillError.
            return txHash;
        });
    }
}
exports.ExchangeSwapQuoteConsumer = ExchangeSwapQuoteConsumer;
//# sourceMappingURL=exchange_swap_quote_consumer.js.map