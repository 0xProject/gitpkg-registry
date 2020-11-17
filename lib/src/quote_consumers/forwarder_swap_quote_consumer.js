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
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const affiliate_fee_utils_1 = require("../utils/affiliate_fee_utils");
const assert_1 = require("../utils/assert");
const swap_quote_consumer_utils_1 = require("../utils/swap_quote_consumer_utils");
const { NULL_ADDRESS } = constants_1.constants;
class ForwarderSwapQuoteConsumer {
    constructor(supportedProvider, contractAddresses, options = {}) {
        this.contractAddresses = contractAddresses;
        this.buyQuoteSellAmountScalingFactor = 1.0001; // 100% + 1 bps
        const { chainId } = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        assert_1.assert.isNumber('chainId', chainId);
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        this.provider = provider;
        this.chainId = chainId;
        this._forwarder = new contract_wrappers_1.ForwarderContract(contractAddresses.forwarder, supportedProvider);
    }
    /**
     * Given a SwapQuote, returns 'CalldataInfo' for a forwarder extension call. See type definition of CalldataInfo for more information.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting CalldataInfo. See type definition for more information.
     */
    getCalldataOrThrowAsync(quote, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isValidForwarderSwapQuote('quote', quote, this._getEtherTokenAssetDataOrThrow());
            const { extensionContractOpts } = Object.assign({}, constants_1.constants.DEFAULT_FORWARDER_SWAP_QUOTE_GET_OPTS, opts);
            assert_1.assert.isValidForwarderExtensionContractOpts('extensionContractOpts', extensionContractOpts);
            const { feeRecipient, feePercentage } = extensionContractOpts;
            const { orders, worstCaseQuoteInfo } = quote;
            const normalizedFeeRecipientAddress = feeRecipient.toLowerCase();
            const signatures = _.map(orders, o => o.signature);
            const ethAmountWithFees = affiliate_fee_utils_1.affiliateFeeUtils.getTotalEthAmountWithAffiliateFee(Object.assign({}, worstCaseQuoteInfo, (quote.type === types_1.MarketOperation.Buy
                ? {
                    // tslint:disable-next-line: custom-no-magic-numbers
                    totalTakerAssetAmount: worstCaseQuoteInfo.totalTakerAssetAmount
                        .times(this.buyQuoteSellAmountScalingFactor)
                        .integerValue(),
                }
                : {})), feePercentage);
            const feeAmount = affiliate_fee_utils_1.affiliateFeeUtils.getFeeAmount(worstCaseQuoteInfo, feePercentage);
            let calldataHexString;
            if (quote.type === types_1.MarketOperation.Buy) {
                calldataHexString = this._forwarder
                    .marketBuyOrdersWithEth(orders, quote.makerAssetFillAmount, signatures, [feeAmount], [normalizedFeeRecipientAddress])
                    .getABIEncodedTransactionData();
            }
            else {
                calldataHexString = this._forwarder
                    .marketSellAmountWithEth(orders, quote.takerAssetFillAmount, signatures, [feeAmount], [normalizedFeeRecipientAddress])
                    .getABIEncodedTransactionData();
            }
            return {
                calldataHexString,
                toAddress: this._forwarder.address,
                ethAmount: ethAmountWithFees,
                allowanceTarget: NULL_ADDRESS,
            };
        });
    }
    /**
     * Given a SwapQuote and desired rate (in Eth), attempt to execute the swap.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting CalldataInfo. See type definition for more information.
     */
    executeSwapQuoteOrThrowAsync(quote, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isValidForwarderSwapQuote('quote', quote, this._getEtherTokenAssetDataOrThrow());
            const { ethAmount: providedEthAmount, takerAddress, gasLimit, extensionContractOpts } = Object.assign({}, constants_1.constants.DEFAULT_FORWARDER_SWAP_QUOTE_EXECUTE_OPTS, opts);
            assert_1.assert.isValidForwarderExtensionContractOpts('extensionContractOpts', extensionContractOpts);
            const { feeRecipient, feePercentage } = extensionContractOpts;
            if (providedEthAmount !== undefined) {
                assert_1.assert.isBigNumber('ethAmount', providedEthAmount);
            }
            if (takerAddress !== undefined) {
                assert_1.assert.isETHAddressHex('takerAddress', takerAddress);
            }
            if (gasLimit !== undefined) {
                assert_1.assert.isNumber('gasLimit', gasLimit);
            }
            const { orders, gasPrice } = quote; // tslint:disable-line:no-unused-variable
            const signatures = orders.map(o => o.signature);
            // get taker address
            const finalTakerAddress = yield swap_quote_consumer_utils_1.swapQuoteConsumerUtils.getTakerAddressOrThrowAsync(this.provider, opts);
            // if no ethAmount is provided, default to the worst totalTakerAssetAmount
            const ethAmountWithFees = providedEthAmount ||
                affiliate_fee_utils_1.affiliateFeeUtils.getTotalEthAmountWithAffiliateFee(quote.worstCaseQuoteInfo, feePercentage);
            const feeAmount = affiliate_fee_utils_1.affiliateFeeUtils.getFeeAmount(Object.assign({}, quote.worstCaseQuoteInfo, (quote.type === types_1.MarketOperation.Buy
                ? {
                    // tslint:disable-next-line: custom-no-magic-numbers
                    totalTakerAssetAmount: quote.worstCaseQuoteInfo.totalTakerAssetAmount
                        .times(this.buyQuoteSellAmountScalingFactor)
                        .integerValue(),
                }
                : {})), feePercentage);
            let txHash;
            if (quote.type === types_1.MarketOperation.Buy) {
                const { makerAssetFillAmount } = quote;
                txHash = yield this._forwarder
                    .marketBuyOrdersWithEth(orders, makerAssetFillAmount, signatures, [feeAmount], [feeRecipient])
                    .sendTransactionAsync({
                    from: finalTakerAddress,
                    gas: gasLimit,
                    gasPrice,
                    value: ethAmountWithFees,
                });
            }
            else {
                txHash = yield this._forwarder
                    .marketSellAmountWithEth(orders, quote.takerAssetFillAmount, signatures, [feeAmount], [feeRecipient])
                    .sendTransactionAsync({
                    from: finalTakerAddress,
                    gas: gasLimit,
                    gasPrice,
                    value: ethAmountWithFees,
                });
            }
            // TODO(dorothy-zbornak): Handle signature request denied
            // (see contract-wrappers/decorators)
            // and ForwarderRevertErrors.CompleteBuyFailed.
            return txHash;
        });
    }
    _getEtherTokenAssetDataOrThrow() {
        return order_utils_1.assetDataUtils.encodeERC20AssetData(this.contractAddresses.etherToken);
    }
}
exports.ForwarderSwapQuoteConsumer = ForwarderSwapQuoteConsumer;
//# sourceMappingURL=forwarder_swap_quote_consumer.js.map