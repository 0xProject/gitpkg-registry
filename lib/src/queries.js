"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderEventsSubscription = exports.ordersQueryV4 = exports.ordersQuery = exports.orderQueryV4 = exports.orderQuery = exports.addOrdersMutationV4 = exports.addOrdersMutation = exports.statsQuery = void 0;
const core_1 = require("@apollo/client/core");
// HACK(kimpers): Since we disabled `_typename` we cannot use GQL fragments.
// Instead use a string with all field names to make sure that the same data is returned everywhere
const ORDER_V4_WITH_METADATA_FIELDS = `
    hash
    chainId
    verifyingContract
    makerToken
    takerToken
    makerAmount
    takerAmount
    takerTokenFeeAmount
    maker
    taker
    sender
    feeRecipient
    pool
    expiry
    salt
    fillableTakerAssetAmount
    signatureType
    signatureV
    signatureR
    signatureS
`;
exports.statsQuery = core_1.gql `
    query Stats {
        stats {
            version
            pubSubTopic
            rendezvous
            peerID
            ethereumChainID
            latestBlock {
                number
                hash
            }
            numPeers
            numOrders
            numOrdersV4
            numOrdersIncludingRemoved
            numOrdersIncludingRemovedV4
            numPinnedOrders
            numPinnedOrdersV4
            startOfCurrentUTCDay
            ethRPCRequestsSentInCurrentUTCDay
            ethRPCRateLimitExpiredRequests
            maxExpirationTime
        }
    }
`;
exports.addOrdersMutation = core_1.gql `
    mutation AddOrders(
        $orders: [NewOrder!]!
        $pinned: Boolean = true
        $opts: AddOrdersOpts = { keepCancelled: false, keepExpired: false, keepFullyFilled: false, keepUnfunded: false }
    ) {
        addOrders(orders: $orders, pinned: $pinned, opts: $opts) {
            accepted {
                order {
                    hash
                    chainId
                    exchangeAddress
                    makerAddress
                    makerAssetData
                    makerAssetAmount
                    makerFeeAssetData
                    makerFee
                    takerAddress
                    takerAssetData
                    takerAssetAmount
                    takerFeeAssetData
                    takerFee
                    senderAddress
                    feeRecipientAddress
                    expirationTimeSeconds
                    salt
                    signature
                    fillableTakerAssetAmount
                }
                isNew
            }
            rejected {
                hash
                code
                message
                order {
                    chainId
                    exchangeAddress
                    makerAddress
                    makerAssetData
                    makerAssetAmount
                    makerFeeAssetData
                    makerFee
                    takerAddress
                    takerAssetData
                    takerAssetAmount
                    takerFeeAssetData
                    takerFee
                    senderAddress
                    feeRecipientAddress
                    expirationTimeSeconds
                    salt
                    signature
                }
            }
        }
    }
`;
exports.addOrdersMutationV4 = core_1.gql `
    mutation AddOrdersV4(
        $orders: [NewOrderV4!]!
        $pinned: Boolean = true
        $opts: AddOrdersOpts = { keepCancelled: false, keepExpired: false, keepFullyFilled: false, keepUnfunded: false }
    ) {
        addOrdersV4(orders: $orders, pinned: $pinned, opts: $opts) {
            accepted {
                order {
                    ${ORDER_V4_WITH_METADATA_FIELDS}
                }
                isNew
            }
            rejected {
                code
                message
                hash
                order {
                    chainId
                    verifyingContract
                    makerToken
                    takerToken
                    makerAmount
                    takerAmount
                    takerTokenFeeAmount
                    maker
                    taker
                    sender
                    feeRecipient
                    pool
                    expiry
                    salt
                    signatureType
                    signatureV
                    signatureR
                    signatureS
                }
            }
        }
    }
`;
exports.orderQuery = core_1.gql `
    query Order($hash: String!) {
        order(hash: $hash) {
            hash
            chainId
            exchangeAddress
            makerAddress
            makerAssetData
            makerAssetAmount
            makerFeeAssetData
            makerFee
            takerAddress
            takerAssetData
            takerAssetAmount
            takerFeeAssetData
            takerFee
            senderAddress
            feeRecipientAddress
            expirationTimeSeconds
            salt
            signature
            fillableTakerAssetAmount
        }
    }
`;
exports.orderQueryV4 = core_1.gql `
    query OrderV4($hash: String!) {
        orderv4(hash: $hash) {
            ${ORDER_V4_WITH_METADATA_FIELDS}
        }
    }
`;
exports.ordersQuery = core_1.gql `
    query Orders(
        $filters: [OrderFilter!] = []
        $sort: [OrderSort!] = [{ field: hash, direction: ASC }]
        $limit: Int = 100
    ) {
        orders(filters: $filters, sort: $sort, limit: $limit) {
            hash
            chainId
            exchangeAddress
            makerAddress
            makerAssetData
            makerAssetAmount
            makerFeeAssetData
            makerFee
            takerAddress
            takerAssetData
            takerAssetAmount
            takerFeeAssetData
            takerFee
            senderAddress
            feeRecipientAddress
            expirationTimeSeconds
            salt
            signature
            fillableTakerAssetAmount
        }
    }
`;
exports.ordersQueryV4 = core_1.gql `
    query Orders(
        $filters: [OrderFilterV4!] = []
        $sort: [OrderSortV4!] = [{ field: hash, direction: ASC }]
        $limit: Int = 100
    ) {
        ordersv4(filters: $filters, sort: $sort, limit: $limit) {
            ${ORDER_V4_WITH_METADATA_FIELDS}
        }
    }
`;
exports.orderEventsSubscription = core_1.gql `
    subscription {
        orderEvents {
            timestamp
            endState
            order {
                hash
                chainId
                exchangeAddress
                makerAddress
                makerAssetData
                makerAssetAmount
                makerFeeAssetData
                makerFee
                takerAddress
                takerAssetData
                takerAssetAmount
                takerFeeAssetData
                takerFee
                senderAddress
                feeRecipientAddress
                expirationTimeSeconds
                salt
                signature
                fillableTakerAssetAmount
            }
            orderv4 {
                ${ORDER_V4_WITH_METADATA_FIELDS}
            }
            contractEvents {
                blockHash
                txHash
                txIndex
                logIndex
                isRemoved
                address
                kind
                parameters
            }
        }
    }
`;
//# sourceMappingURL=queries.js.map