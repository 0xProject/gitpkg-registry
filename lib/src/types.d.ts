import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
export interface AddOrdersOpts {
    keepCancelled?: boolean;
    keepExpired?: boolean;
    keepFullyFilled?: boolean;
    keepUnfunded?: boolean;
}
export interface StatsResponse {
    stats: StringifiedStats;
}
export interface AddOrdersResponse {
    addOrders: StringifiedAddOrdersResults;
}
export interface OrderResponse {
    order: StringifiedOrderWithMetadata | null;
}
export interface OrdersResponse {
    orders: StringifiedOrderWithMetadata[];
}
export interface OrderEventResponse {
    orderEvents: StringifiedOrderEvent[];
}
export interface Stats {
    version: string;
    pubSubTopic: string;
    rendezvous: string;
    secondaryRendezvous: string[];
    peerID: string;
    ethereumChainID: number;
    latestBlock: LatestBlock;
    numPeers: number;
    numOrders: number;
    numOrdersIncludingRemoved: number;
    numPinnedOrders: number;
    maxExpirationTime: BigNumber;
    startOfCurrentUTCDay: Date;
    ethRPCRequestsSentInCurrentUTCDay: number;
    ethRPCRateLimitExpiredRequests: number;
}
export interface LatestBlock {
    number: BigNumber;
    hash: string;
}
export interface OrderWithMetadata extends SignedOrder {
    hash: string;
    fillableTakerAssetAmount: BigNumber;
}
export interface AddOrdersResults {
    accepted: AcceptedOrderResult[];
    rejected: RejectedOrderResult[];
}
export interface AcceptedOrderResult {
    order: OrderWithMetadata;
    isNew: boolean;
}
export interface RejectedOrderResult {
    hash?: string;
    order: SignedOrder;
    code: RejectedOrderCode;
    message: string;
}
export declare enum RejectedOrderCode {
    EthRpcRequestFailed = "ETH_RPC_REQUEST_FAILED",
    OrderHasInvalidMakerAssetAmount = "ORDER_HAS_INVALID_MAKER_ASSET_AMOUNT",
    OrderHasInvalidTakerAssetAmount = "ORDER_HAS_INVALID_TAKER_ASSET_AMOUNT",
    OrderExpired = "ORDER_EXPIRED",
    OrderFullyFilled = "ORDER_FULLY_FILLED",
    OrderCancelled = "ORDER_CANCELLED",
    OrderUnfunded = "ORDER_UNFUNDED",
    OrderHasInvalidMakerAssetData = "ORDER_HAS_INVALID_MAKER_ASSET_DATA",
    OrderHasInvalidMakerFeeAssetData = "ORDER_HAS_INVALID_MAKER_FEE_ASSET_DATA",
    OrderHasInvalidTakerAssetData = "ORDER_HAS_INVALID_TAKER_ASSET_DATA",
    OrderHasInvalidTakerFeeAssetData = "ORDER_HAS_INVALID_TAKER_FEE_ASSET_DATA",
    OrderHasInvalidSignature = "ORDER_HAS_INVALID_SIGNATURE",
    OrderMaxExpirationExceeded = "ORDER_MAX_EXPIRATION_EXCEEDED",
    InternalError = "INTERNAL_ERROR",
    MaxOrderSizeExceeded = "MAX_ORDER_SIZE_EXCEEDED",
    OrderAlreadyStoredAndUnfillable = "ORDER_ALREADY_STORED_AND_UNFILLABLE",
    OrderForIncorrectChain = "ORDER_FOR_INCORRECT_CHAIN",
    IncorrectExchangeAddress = "INCORRECT_EXCHANGE_ADDRESS",
    SenderAddressNotAllowed = "SENDER_ADDRESS_NOT_ALLOWED",
    DatabaseFullOfOrders = "DATABASE_FULL_OF_ORDERS"
}
export interface OrderEvent {
    timestampMs: number;
    order: OrderWithMetadata;
    endState: OrderEventEndState;
    contractEvents: ContractEvent[];
}
export interface ContractEvent {
    blockHash: string;
    txHash: string;
    txIndex: number;
    logIndex: number;
    isRemoved: boolean;
    address: string;
    kind: ContractEventKind;
    parameters: any;
}
export declare enum ContractEventKind {
    ERC20TransferEvent = "ERC20TransferEvent",
    ERC20ApprovalEvent = "ERC20ApprovalEvent",
    ERC721TransferEvent = "ERC721TransferEvent",
    ERC721ApprovalEvent = "ERC721ApprovalEvent",
    ERC721ApprovalForAllEvent = "ERC721ApprovalForAllEvent",
    ERC1155ApprovalForAllEvent = "ERC1155ApprovalForAllEvent",
    ERC1155TransferSingleEvent = "ERC1155TransferSingleEvent",
    ERC1155TransferBatchEvent = "ERC1155TransferBatchEvent",
    ExchangeFillEvent = "ExchangeFillEvent",
    ExchangeCancelEvent = "ExchangeCancelEvent",
    ExchangeCancelUpToEvent = "ExchangeCancelUpToEvent",
    WethDepositEvent = "WethDepositEvent",
    WethWithdrawalEvent = "WethWithdrawalEvent"
}
export declare enum OrderEventEndState {
    Added = "ADDED",
    Filled = "FILLED",
    FullyFilled = "FULLY_FILLED",
    Cancelled = "CANCELLED",
    Expired = "EXPIRED",
    Unexpired = "UNEXPIRED",
    Unfunded = "UNFUNDED",
    FillabilityIncreased = "FILLABILITY_INCREASED",
    StoppedWatching = "STOPPED_WATCHING"
}
export declare type OrderField = Extract<keyof OrderWithMetadata, string>;
export declare enum SortDirection {
    Asc = "ASC",
    Desc = "DESC"
}
export declare enum FilterKind {
    Equal = "EQUAL",
    NotEqual = "NOT_EQUAL",
    Greater = "GREATER",
    GreaterOrEqual = "GREATER_OR_EQUAL",
    Less = "LESS",
    LessOrEqual = "LESS_OR_EQUAL"
}
export interface OrderSort {
    field: OrderField;
    direction: SortDirection;
}
export interface OrderFilter {
    field: OrderField;
    kind: FilterKind;
    value: OrderWithMetadata[OrderField];
}
export interface OrderQuery {
    filters?: OrderFilter[];
    sort?: OrderSort[];
    limit?: number;
}
export interface StringifiedLatestBlock {
    number: string;
    hash: string;
}
export interface StringifiedStats {
    version: string;
    pubSubTopic: string;
    rendezvous: string;
    secondaryRendezvous: string[];
    peerID: string;
    ethereumChainID: number;
    latestBlock: StringifiedLatestBlock;
    numPeers: number;
    numOrders: number;
    numOrdersIncludingRemoved: number;
    numPinnedOrders: number;
    maxExpirationTime: string;
    startOfCurrentUTCDay: string;
    ethRPCRequestsSentInCurrentUTCDay: number;
    ethRPCRateLimitExpiredRequests: number;
}
export interface StringifiedSignedOrder {
    chainId: string;
    exchangeAddress: string;
    makerAddress: string;
    takerAddress: string;
    feeRecipientAddress: string;
    senderAddress: string;
    makerAssetAmount: string;
    takerAssetAmount: string;
    makerFee: string;
    takerFee: string;
    expirationTimeSeconds: string;
    salt: string;
    makerAssetData: string;
    takerAssetData: string;
    makerFeeAssetData: string;
    takerFeeAssetData: string;
    signature: string;
}
export interface StringifiedOrderWithMetadata extends StringifiedSignedOrder {
    hash: string;
    fillableTakerAssetAmount: string;
}
export interface StringifiedAddOrdersResults {
    accepted: StringifiedAcceptedOrderResult[];
    rejected: StringifiedRejectedOrderResult[];
}
export interface StringifiedAcceptedOrderResult {
    order: StringifiedOrderWithMetadata;
    isNew: boolean;
}
export interface StringifiedRejectedOrderResult {
    hash?: string;
    order: StringifiedSignedOrder;
    code: RejectedOrderCode;
    message: string;
}
export interface StringifiedOrderEvent {
    timestamp: string;
    order: StringifiedOrderWithMetadata;
    endState: OrderEventEndState;
    fillableTakerAssetAmount: BigNumber;
    contractEvents: ContractEvent[];
}
/**
 * Converts StringifiedStats to Stats
 */
export declare function fromStringifiedStats(stats: StringifiedStats): Stats;
/**
 * Converts StringifiedLatestBlock to LatestBlock
 */
export declare function fromStringifiedLatestBlock(latestBlock: StringifiedLatestBlock): LatestBlock;
/**
 * Converts SignedOrder to StringifiedSignedOrder
 */
export declare function toStringifiedSignedOrder(order: SignedOrder): StringifiedSignedOrder;
/**
 * Converts StringifiedOrderWithMetadata to OrderWithMetadata
 */
export declare function fromStringifiedOrderWithMetadata(order: StringifiedOrderWithMetadata): OrderWithMetadata;
/**
 * Converts StringifiedSignedOrder to SignedOrder
 */
export declare function fromStringifiedSignedOrder(order: StringifiedSignedOrder): SignedOrder;
/**
 * Converts StringifiedAddOrdersResults to AddOrdersResults
 */
export declare function fromStringifiedAddOrdersResults(results: StringifiedAddOrdersResults): AddOrdersResults;
/**
 * Converts StringifiedAcceptedOrderResult to AcceptedOrderResult
 */
export declare function fromStringifiedAcceptedOrderResult(acceptedResult: StringifiedAcceptedOrderResult): AcceptedOrderResult;
/**
 * Converts StringifiedRejectedOrderResult to RejectedOrderResult
 */
export declare function fromStringifiedRejectedOrderResult(rejectedResult: StringifiedRejectedOrderResult): RejectedOrderResult;
/**
 * Converts StringifiedOrderEvent to OrderEvent
 */
export declare function fromStringifiedOrderEvent(event: StringifiedOrderEvent): OrderEvent;
/**
 * Converts filter.value the the appropriate JSON/GraphQL type (e.g. BigNumber gets converted to string).
 */
export declare function convertFilterValue(filter: OrderFilter): OrderFilter;
//# sourceMappingURL=types.d.ts.map