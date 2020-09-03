"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const eip712_utils_1 = require("./eip712_utils");
const order_hash_utils_1 = require("./order_hash_utils");
const transaction_hash_utils_1 = require("./transaction_hash_utils");
/**
 * Compute the EIP712 hash of an order.
 */
function getOrderHash(order) {
    return order_hash_utils_1.orderHashUtils.getOrderHash(order);
}
exports.getOrderHash = getOrderHash;
/**
 * Compute the EIP712 hash of an Exchange meta-transaction.
 */
function getExchangeMetaTransactionHash(tx) {
    return transaction_hash_utils_1.transactionHashUtils.getTransactionHash(tx);
}
exports.getExchangeMetaTransactionHash = getExchangeMetaTransactionHash;
/**
 * Compute the EIP712 hash of an Exchange Proxy meta-transaction.
 */
function getExchangeProxyMetaTransactionHash(mtx) {
    return utils_1.hexUtils.toHex(utils_1.signTypedDataUtils.generateTypedDataHash(eip712_utils_1.eip712Utils.createExchangeProxyMetaTransactionTypedData(mtx)));
}
exports.getExchangeProxyMetaTransactionHash = getExchangeProxyMetaTransactionHash;
//# sourceMappingURL=hash_utils.js.map