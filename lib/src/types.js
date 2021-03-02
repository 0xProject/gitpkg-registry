"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./utils/market_operation_utils/types");
var AffiliateFeeType;
(function (AffiliateFeeType) {
    AffiliateFeeType[AffiliateFeeType["None"] = 0] = "None";
    AffiliateFeeType[AffiliateFeeType["PercentageFee"] = 1] = "PercentageFee";
    AffiliateFeeType[AffiliateFeeType["PositiveSlippageFee"] = 2] = "PositiveSlippageFee";
})(AffiliateFeeType = exports.AffiliateFeeType || (exports.AffiliateFeeType = {}));
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
var RfqPairType;
(function (RfqPairType) {
    RfqPairType["Standard"] = "standard";
    RfqPairType["Alt"] = "alt";
})(RfqPairType = exports.RfqPairType || (exports.RfqPairType = {}));
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
var AltQuoteModel;
(function (AltQuoteModel) {
    AltQuoteModel["Firm"] = "firm";
    AltQuoteModel["Indicative"] = "indicative";
})(AltQuoteModel = exports.AltQuoteModel || (exports.AltQuoteModel = {}));
var AltQuoteSide;
(function (AltQuoteSide) {
    AltQuoteSide["Buy"] = "buy";
    AltQuoteSide["Sell"] = "sell";
})(AltQuoteSide = exports.AltQuoteSide || (exports.AltQuoteSide = {}));
// export enum ChainId {
//    Mainnet = 1,
//    Ropsten = 3,
//    Rinkeby = 4,
//    Kovan = 42,
//    // tslint:disable-next-line: enum-naming
//    BSC = 56,
//    Ganache = 1337,
// }
//# sourceMappingURL=types.js.map