"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./utils/market_operation_utils/types");
/**
 * Represents the varying smart contracts that can consume a valid swap quote
 */
var ExtensionContractType;
(function (ExtensionContractType) {
    ExtensionContractType["None"] = "NONE";
    ExtensionContractType["Forwarder"] = "FORWARDER";
    ExtensionContractType["ExchangeProxy"] = "EXCHANGE_PROXY";
})(ExtensionContractType = exports.ExtensionContractType || (exports.ExtensionContractType = {}));
/**
 * Automatically resolved protocol fee refund receiver addresses.
 */
var ExchangeProxyRefundReceiver;
(function (ExchangeProxyRefundReceiver) {
    // Refund to the taker address.
    ExchangeProxyRefundReceiver["Taker"] = "0x0000000000000000000000000000000000000001";
    // Refund to the sender address.
    ExchangeProxyRefundReceiver["Sender"] = "0x0000000000000000000000000000000000000002";
})(ExchangeProxyRefundReceiver = exports.ExchangeProxyRefundReceiver || (exports.ExchangeProxyRefundReceiver = {}));
/**
 * Possible error messages thrown by an SwapQuoterConsumer instance or associated static methods.
 */
var SwapQuoteConsumerError;
(function (SwapQuoteConsumerError) {
    SwapQuoteConsumerError["InvalidMarketSellOrMarketBuySwapQuote"] = "INVALID_MARKET_BUY_SELL_SWAP_QUOTE";
    SwapQuoteConsumerError["InvalidForwarderSwapQuote"] = "INVALID_FORWARDER_SWAP_QUOTE_PROVIDED";
    SwapQuoteConsumerError["NoAddressAvailable"] = "NO_ADDRESS_AVAILABLE";
    SwapQuoteConsumerError["SignatureRequestDenied"] = "SIGNATURE_REQUEST_DENIED";
    SwapQuoteConsumerError["TransactionValueTooLow"] = "TRANSACTION_VALUE_TOO_LOW";
})(SwapQuoteConsumerError = exports.SwapQuoteConsumerError || (exports.SwapQuoteConsumerError = {}));
/**
 * Possible error messages thrown by an SwapQuoter instance or associated static methods.
 */
var SwapQuoterError;
(function (SwapQuoterError) {
    SwapQuoterError["NoEtherTokenContractFound"] = "NO_ETHER_TOKEN_CONTRACT_FOUND";
    SwapQuoterError["StandardRelayerApiError"] = "STANDARD_RELAYER_API_ERROR";
    SwapQuoterError["InsufficientAssetLiquidity"] = "INSUFFICIENT_ASSET_LIQUIDITY";
    SwapQuoterError["AssetUnavailable"] = "ASSET_UNAVAILABLE";
    SwapQuoterError["NoGasPriceProvidedOrEstimated"] = "NO_GAS_PRICE_PROVIDED_OR_ESTIMATED";
    SwapQuoterError["AssetDataUnsupported"] = "ASSET_DATA_UNSUPPORTED";
})(SwapQuoterError = exports.SwapQuoterError || (exports.SwapQuoterError = {}));
/**
 * Represents two main market operations supported by asset-swapper.
 */
var MarketOperation;
(function (MarketOperation) {
    MarketOperation["Sell"] = "Sell";
    MarketOperation["Buy"] = "Buy";
})(MarketOperation = exports.MarketOperation || (exports.MarketOperation = {}));
/**
 * Represents varying order takerFee types that can be pruned for by OrderPruner.
 */
var OrderPrunerPermittedFeeTypes;
(function (OrderPrunerPermittedFeeTypes) {
    OrderPrunerPermittedFeeTypes["NoFees"] = "NO_FEES";
    OrderPrunerPermittedFeeTypes["TakerDenominatedTakerFee"] = "TAKER_DENOMINATED_TAKER_FEE";
})(OrderPrunerPermittedFeeTypes = exports.OrderPrunerPermittedFeeTypes || (exports.OrderPrunerPermittedFeeTypes = {}));
//# sourceMappingURL=types.js.map