"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFilterValue = exports.fromStringifiedOrderEvent = exports.fromStringifiedRejectedOrderResult = exports.fromStringifiedAcceptedOrderResult = exports.fromStringifiedAddOrdersResults = exports.fromStringifiedSignedOrder = exports.fromStringifiedOrderWithMetadata = exports.toStringifiedSignedOrder = exports.fromStringifiedLatestBlock = exports.fromStringifiedStats = exports.FilterKind = exports.SortDirection = exports.OrderEventEndState = exports.ContractEventKind = exports.RejectedOrderCode = void 0;
const utils_1 = require("@0x/utils");
var RejectedOrderCode;
(function (RejectedOrderCode) {
    RejectedOrderCode["EthRpcRequestFailed"] = "ETH_RPC_REQUEST_FAILED";
    RejectedOrderCode["OrderHasInvalidMakerAssetAmount"] = "ORDER_HAS_INVALID_MAKER_ASSET_AMOUNT";
    RejectedOrderCode["OrderHasInvalidTakerAssetAmount"] = "ORDER_HAS_INVALID_TAKER_ASSET_AMOUNT";
    RejectedOrderCode["OrderExpired"] = "ORDER_EXPIRED";
    RejectedOrderCode["OrderFullyFilled"] = "ORDER_FULLY_FILLED";
    RejectedOrderCode["OrderCancelled"] = "ORDER_CANCELLED";
    RejectedOrderCode["OrderUnfunded"] = "ORDER_UNFUNDED";
    RejectedOrderCode["OrderHasInvalidMakerAssetData"] = "ORDER_HAS_INVALID_MAKER_ASSET_DATA";
    RejectedOrderCode["OrderHasInvalidMakerFeeAssetData"] = "ORDER_HAS_INVALID_MAKER_FEE_ASSET_DATA";
    RejectedOrderCode["OrderHasInvalidTakerAssetData"] = "ORDER_HAS_INVALID_TAKER_ASSET_DATA";
    RejectedOrderCode["OrderHasInvalidTakerFeeAssetData"] = "ORDER_HAS_INVALID_TAKER_FEE_ASSET_DATA";
    RejectedOrderCode["OrderHasInvalidSignature"] = "ORDER_HAS_INVALID_SIGNATURE";
    RejectedOrderCode["OrderMaxExpirationExceeded"] = "ORDER_MAX_EXPIRATION_EXCEEDED";
    RejectedOrderCode["InternalError"] = "INTERNAL_ERROR";
    RejectedOrderCode["MaxOrderSizeExceeded"] = "MAX_ORDER_SIZE_EXCEEDED";
    RejectedOrderCode["OrderAlreadyStoredAndUnfillable"] = "ORDER_ALREADY_STORED_AND_UNFILLABLE";
    RejectedOrderCode["OrderForIncorrectChain"] = "ORDER_FOR_INCORRECT_CHAIN";
    RejectedOrderCode["IncorrectExchangeAddress"] = "INCORRECT_EXCHANGE_ADDRESS";
    RejectedOrderCode["SenderAddressNotAllowed"] = "SENDER_ADDRESS_NOT_ALLOWED";
    RejectedOrderCode["DatabaseFullOfOrders"] = "DATABASE_FULL_OF_ORDERS";
})(RejectedOrderCode = exports.RejectedOrderCode || (exports.RejectedOrderCode = {}));
var ContractEventKind;
(function (ContractEventKind) {
    ContractEventKind["ERC20TransferEvent"] = "ERC20TransferEvent";
    ContractEventKind["ERC20ApprovalEvent"] = "ERC20ApprovalEvent";
    ContractEventKind["ERC721TransferEvent"] = "ERC721TransferEvent";
    ContractEventKind["ERC721ApprovalEvent"] = "ERC721ApprovalEvent";
    ContractEventKind["ERC721ApprovalForAllEvent"] = "ERC721ApprovalForAllEvent";
    ContractEventKind["ERC1155ApprovalForAllEvent"] = "ERC1155ApprovalForAllEvent";
    ContractEventKind["ERC1155TransferSingleEvent"] = "ERC1155TransferSingleEvent";
    ContractEventKind["ERC1155TransferBatchEvent"] = "ERC1155TransferBatchEvent";
    ContractEventKind["ExchangeFillEvent"] = "ExchangeFillEvent";
    ContractEventKind["ExchangeCancelEvent"] = "ExchangeCancelEvent";
    ContractEventKind["ExchangeCancelUpToEvent"] = "ExchangeCancelUpToEvent";
    ContractEventKind["WethDepositEvent"] = "WethDepositEvent";
    ContractEventKind["WethWithdrawalEvent"] = "WethWithdrawalEvent";
})(ContractEventKind = exports.ContractEventKind || (exports.ContractEventKind = {}));
var OrderEventEndState;
(function (OrderEventEndState) {
    // The order was successfully validated and added to the Mesh node. The order is now being watched and any changes to
    // the fillability will result in subsequent order events.
    OrderEventEndState["Added"] = "ADDED";
    // The order was filled for a partial amount. The order is still fillable up to the fillableTakerAssetAmount.
    OrderEventEndState["Filled"] = "FILLED";
    // The order was fully filled and its remaining fillableTakerAssetAmount is 0. The order is no longer fillable.
    OrderEventEndState["FullyFilled"] = "FULLY_FILLED";
    // The order was cancelled and is no longer fillable.
    OrderEventEndState["Cancelled"] = "CANCELLED";
    // The order expired and is no longer fillable.
    OrderEventEndState["Expired"] = "EXPIRED";
    // The order was previously expired, but due to a block re-org it is no longer considered expired (should be rare).
    OrderEventEndState["Unexpired"] = "UNEXPIRED";
    // The order has become unfunded and is no longer fillable. This can happen if the maker makes a transfer or changes their allowance.
    OrderEventEndState["Unfunded"] = "UNFUNDED";
    // The fillability of the order has increased. This can happen if a previously processed fill event gets reverted due to a block re-org,
    // or if a maker makes a transfer or changes their allowance.
    OrderEventEndState["FillabilityIncreased"] = "FILLABILITY_INCREASED";
    // The order is potentially still valid but was removed for a different reason (e.g.
    // the database is full or the peer that sent the order was misbehaving). The order will no longer be watched
    // and no further events for this order will be emitted. In some cases, the order may be re-added in the
    // future.
    OrderEventEndState["StoppedWatching"] = "STOPPED_WATCHING";
})(OrderEventEndState = exports.OrderEventEndState || (exports.OrderEventEndState = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "ASC";
    SortDirection["Desc"] = "DESC";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var FilterKind;
(function (FilterKind) {
    FilterKind["Equal"] = "EQUAL";
    FilterKind["NotEqual"] = "NOT_EQUAL";
    FilterKind["Greater"] = "GREATER";
    FilterKind["GreaterOrEqual"] = "GREATER_OR_EQUAL";
    FilterKind["Less"] = "LESS";
    FilterKind["LessOrEqual"] = "LESS_OR_EQUAL";
})(FilterKind = exports.FilterKind || (exports.FilterKind = {}));
/**
 * Converts StringifiedStats to Stats
 */
function fromStringifiedStats(stats) {
    return Object.assign(Object.assign({}, stats), { latestBlock: fromStringifiedLatestBlock(stats.latestBlock), maxExpirationTime: new utils_1.BigNumber(stats.maxExpirationTime), startOfCurrentUTCDay: new Date(stats.startOfCurrentUTCDay) });
}
exports.fromStringifiedStats = fromStringifiedStats;
/**
 * Converts StringifiedLatestBlock to LatestBlock
 */
function fromStringifiedLatestBlock(latestBlock) {
    return Object.assign(Object.assign({}, latestBlock), { number: new utils_1.BigNumber(latestBlock.number) });
}
exports.fromStringifiedLatestBlock = fromStringifiedLatestBlock;
/**
 * Converts SignedOrder to StringifiedSignedOrder
 */
function toStringifiedSignedOrder(order) {
    return Object.assign(Object.assign({}, order), { chainId: order.chainId.toString(), makerAssetAmount: order.makerAssetAmount.toString(), takerAssetAmount: order.takerAssetAmount.toString(), makerFee: order.makerFee.toString(), takerFee: order.takerFee.toString(), expirationTimeSeconds: order.expirationTimeSeconds.toString(), salt: order.salt.toString() });
}
exports.toStringifiedSignedOrder = toStringifiedSignedOrder;
/**
 * Converts StringifiedOrderWithMetadata to OrderWithMetadata
 */
function fromStringifiedOrderWithMetadata(order) {
    return Object.assign(Object.assign({}, order), { 
        // tslint:disable-next-line: custom-no-magic-numbers
        chainId: Number.parseInt(order.chainId, 10), makerAssetAmount: new utils_1.BigNumber(order.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(order.takerAssetAmount), makerFee: new utils_1.BigNumber(order.makerFee), takerFee: new utils_1.BigNumber(order.takerFee), expirationTimeSeconds: new utils_1.BigNumber(order.expirationTimeSeconds), salt: new utils_1.BigNumber(order.salt), fillableTakerAssetAmount: new utils_1.BigNumber(order.fillableTakerAssetAmount) });
}
exports.fromStringifiedOrderWithMetadata = fromStringifiedOrderWithMetadata;
/**
 * Converts StringifiedSignedOrder to SignedOrder
 */
function fromStringifiedSignedOrder(order) {
    return Object.assign(Object.assign({}, order), { 
        // tslint:disable-next-line: custom-no-magic-numbers
        chainId: Number.parseInt(order.chainId, 10), makerAssetAmount: new utils_1.BigNumber(order.makerAssetAmount), takerAssetAmount: new utils_1.BigNumber(order.takerAssetAmount), makerFee: new utils_1.BigNumber(order.makerFee), takerFee: new utils_1.BigNumber(order.takerFee), expirationTimeSeconds: new utils_1.BigNumber(order.expirationTimeSeconds), salt: new utils_1.BigNumber(order.salt) });
}
exports.fromStringifiedSignedOrder = fromStringifiedSignedOrder;
/**
 * Converts StringifiedAddOrdersResults to AddOrdersResults
 */
function fromStringifiedAddOrdersResults(results) {
    return {
        accepted: results.accepted.map(fromStringifiedAcceptedOrderResult),
        rejected: results.rejected.map(fromStringifiedRejectedOrderResult),
    };
}
exports.fromStringifiedAddOrdersResults = fromStringifiedAddOrdersResults;
/**
 * Converts StringifiedAcceptedOrderResult to AcceptedOrderResult
 */
function fromStringifiedAcceptedOrderResult(acceptedResult) {
    return Object.assign(Object.assign({}, acceptedResult), { order: fromStringifiedOrderWithMetadata(acceptedResult.order) });
}
exports.fromStringifiedAcceptedOrderResult = fromStringifiedAcceptedOrderResult;
/**
 * Converts StringifiedRejectedOrderResult to RejectedOrderResult
 */
function fromStringifiedRejectedOrderResult(rejectedResult) {
    return Object.assign(Object.assign({}, rejectedResult), { order: fromStringifiedSignedOrder(rejectedResult.order) });
}
exports.fromStringifiedRejectedOrderResult = fromStringifiedRejectedOrderResult;
/**
 * Converts StringifiedOrderEvent to OrderEvent
 */
function fromStringifiedOrderEvent(event) {
    return Object.assign(Object.assign({}, event), { timestampMs: new Date(event.timestamp).getUTCMilliseconds(), order: fromStringifiedOrderWithMetadata(event.order) });
}
exports.fromStringifiedOrderEvent = fromStringifiedOrderEvent;
/**
 * Converts filter.value the the appropriate JSON/GraphQL type (e.g. BigNumber gets converted to string).
 */
function convertFilterValue(filter) {
    return Object.assign(Object.assign({}, filter), { value: utils_1.BigNumber.isBigNumber(filter.value) ? filter.value.toString() : filter.value });
}
exports.convertFilterValue = convertFilterValue;
//# sourceMappingURL=types.js.map