"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFilterValue = exports.fromStringifiedOrderEvent = exports.fromStringifiedRejectedOrderResultV4 = exports.fromStringifiedRejectedOrderResult = exports.fromStringifiedAcceptedOrderResultV4 = exports.fromStringifiedAcceptedOrderResult = exports.fromStringifiedAddOrdersResultsV4 = exports.fromStringifiedAddOrdersResults = exports.fromStringifiedSignedOrderV4 = exports.fromStringifiedSignedOrder = exports.fromStringifiedOrderWithMetadataV4 = exports.fromStringifiedOrderWithMetadata = exports.toStringifiedSignedOrderV4 = exports.toStringifiedSignedOrder = exports.fromStringifiedLatestBlock = exports.fromStringifiedStats = exports.FilterKind = exports.SortDirection = exports.OrderEventEndState = exports.ContractEventKind = exports.RejectedOrderCode = void 0;
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
    RejectedOrderCode["TakerAddressNotAllowed"] = "TAKER_ADDRESS_NOT_ALLOWED";
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
    // Catch all 'Invalid' state when invalid orders are submitted.
    OrderEventEndState["Invalid"] = "INVALID";
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
 * Converts SignedOrderV4 to StringifiedSignedOrderV4
 */
function toStringifiedSignedOrderV4(order) {
    const stringifiedOrder = Object.assign(Object.assign({}, order), { chainId: order.chainId.toString(), makerAmount: order.makerAmount.toString(), takerAmount: order.takerAmount.toString(), takerTokenFeeAmount: order.takerTokenFeeAmount.toString(), expiry: order.expiry.toString(), salt: order.salt.toString(), signatureType: order.signature.signatureType.toString(), signatureV: order.signature.v.toString(), signatureR: order.signature.r.toString(), signatureS: order.signature.s.toString() });
    delete stringifiedOrder.signature;
    return stringifiedOrder;
}
exports.toStringifiedSignedOrderV4 = toStringifiedSignedOrderV4;
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
 * Converts StringifiedOrderWithMetadata to OrderWithMetadata
 */
function fromStringifiedOrderWithMetadataV4(order) {
    const { signatureType, signatureV, signatureR, signatureS } = order, orderRest = __rest(order, ["signatureType", "signatureV", "signatureR", "signatureS"]);
    return Object.assign(Object.assign({}, orderRest), { 
        // tslint:disable-next-line: custom-no-magic-numbers
        chainId: Number.parseInt(order.chainId, 10), makerAmount: new utils_1.BigNumber(order.makerAmount), takerAmount: new utils_1.BigNumber(order.takerAmount), takerTokenFeeAmount: new utils_1.BigNumber(order.takerTokenFeeAmount), expiry: new utils_1.BigNumber(order.expiry), fillableTakerAssetAmount: new utils_1.BigNumber(order.fillableTakerAssetAmount), signature: {
            // tslint:disable-next-line: custom-no-magic-numbers
            signatureType: parseInt(signatureType, 10),
            // tslint:disable-next-line: custom-no-magic-numbers
            v: parseInt(signatureV, 10),
            r: signatureR,
            s: signatureS,
        }, salt: new utils_1.BigNumber(order.salt) });
}
exports.fromStringifiedOrderWithMetadataV4 = fromStringifiedOrderWithMetadataV4;
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
 * Converts StringifiedSignedOrderV4 to SignedOrderV4
 */
function fromStringifiedSignedOrderV4(order) {
    return Object.assign(Object.assign({}, order), { 
        // tslint:disable-next-line: custom-no-magic-numbers
        chainId: Number.parseInt(order.chainId, 10), makerAmount: new utils_1.BigNumber(order.makerAmount), takerAmount: new utils_1.BigNumber(order.takerAmount), takerTokenFeeAmount: new utils_1.BigNumber(order.takerTokenFeeAmount), expiry: new utils_1.BigNumber(order.expiry), signature: {
            signatureType: parseInt(order.signatureType),
            v: parseInt(order.signatureV),
            r: order.signatureR,
            s: order.signatureS,
        }, salt: new utils_1.BigNumber(order.salt) });
}
exports.fromStringifiedSignedOrderV4 = fromStringifiedSignedOrderV4;
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
 * Converts StringifiedAddOrdersResults to AddOrdersResults
 */
function fromStringifiedAddOrdersResultsV4(results) {
    return {
        accepted: results.accepted.map(fromStringifiedAcceptedOrderResultV4),
        rejected: results.rejected.map(fromStringifiedRejectedOrderResultV4),
    };
}
exports.fromStringifiedAddOrdersResultsV4 = fromStringifiedAddOrdersResultsV4;
/**
 * Converts StringifiedAcceptedOrderResult to AcceptedOrderResult
 */
function fromStringifiedAcceptedOrderResult(acceptedResult) {
    return Object.assign(Object.assign({}, acceptedResult), { order: fromStringifiedOrderWithMetadata(acceptedResult.order) });
}
exports.fromStringifiedAcceptedOrderResult = fromStringifiedAcceptedOrderResult;
/**
 * Converts StringifiedAcceptedOrderResult to AcceptedOrderResult
 */
function fromStringifiedAcceptedOrderResultV4(acceptedResult) {
    return Object.assign(Object.assign({}, acceptedResult), { order: fromStringifiedOrderWithMetadataV4(acceptedResult.order) });
}
exports.fromStringifiedAcceptedOrderResultV4 = fromStringifiedAcceptedOrderResultV4;
/**
 * Converts StringifiedRejectedOrderResult to RejectedOrderResult
 */
function fromStringifiedRejectedOrderResult(rejectedResult) {
    return Object.assign(Object.assign({}, rejectedResult), { order: fromStringifiedSignedOrder(rejectedResult.order) });
}
exports.fromStringifiedRejectedOrderResult = fromStringifiedRejectedOrderResult;
/**
 * Converts StringifiedRejectedOrderResultV4 to RejectedOrderResultV4
 */
function fromStringifiedRejectedOrderResultV4(rejectedResult) {
    return Object.assign(Object.assign({}, rejectedResult), { order: fromStringifiedSignedOrderV4(rejectedResult.order) });
}
exports.fromStringifiedRejectedOrderResultV4 = fromStringifiedRejectedOrderResultV4;
/**
 * Converts StringifiedOrderEvent to OrderEvent
 */
function fromStringifiedOrderEvent(event) {
    return Object.assign(Object.assign({}, event), { timestampMs: new Date(event.timestamp).getUTCMilliseconds(), order: event.order ? fromStringifiedOrderWithMetadata(event.order) : undefined, orderv4: event.orderv4 ? fromStringifiedOrderWithMetadataV4(event.orderv4) : undefined });
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