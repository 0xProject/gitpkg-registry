import { ExchangeProxyMetaTransaction, Order, ZeroExTransaction } from '@0x/types';
/**
 * Compute the EIP712 hash of an order.
 */
export declare function getOrderHash(order: Order): string;
/**
 * Compute the EIP712 hash of an Exchange meta-transaction.
 */
export declare function getExchangeMetaTransactionHash(tx: ZeroExTransaction): string;
/**
 * Compute the EIP712 hash of an Exchange Proxy meta-transaction.
 */
export declare function getExchangeProxyMetaTransactionHash(mtx: ExchangeProxyMetaTransaction): string;
//# sourceMappingURL=hash_utils.d.ts.map