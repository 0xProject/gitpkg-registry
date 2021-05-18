import { SignedOrder } from '@0x/types';
import { ApolloQueryResult, OperationVariables, QueryOptions } from '@apollo/client/core';
import * as Observable from 'zen-observable';
import { AddOrdersOpts, AddOrdersResults, OrderEvent, OrderQuery, OrderWithMetadata, OrderWithMetadataV4, SignedOrderV4, Stats } from './types';
export { SignedOrder } from '@0x/types';
export { ApolloQueryResult, QueryOptions } from '@apollo/client/core';
export { AcceptedOrderResult, AddOrdersResults, FilterKind, OrderEvent, OrderEventEndState, OrderField, OrderFilter, OrderQuery, OrderSort, OrderWithMetadata, OrderWithMetadataV4, RejectedOrderCode, RejectedOrderResult, SortDirection, Stats, } from './types';
export { Observable };
export interface LinkConfig {
    httpUrl?: string;
    webSocketUrl?: string;
}
export declare class MeshGraphQLClient {
    private readonly _subscriptionClient?;
    private readonly _client;
    private readonly _onReconnectedCallbacks;
    constructor(linkConfig: LinkConfig);
    getStatsAsync(): Promise<Stats>;
    addOrdersAsync(orders: SignedOrder[], pinned?: boolean, opts?: AddOrdersOpts): Promise<AddOrdersResults<OrderWithMetadata, SignedOrder>>;
    addOrdersV4Async(orders: SignedOrderV4[], pinned?: boolean, opts?: AddOrdersOpts): Promise<AddOrdersResults<OrderWithMetadataV4, SignedOrderV4>>;
    getOrderAsync(hash: string): Promise<OrderWithMetadata | null>;
    getOrderV4Async(hash: string): Promise<OrderWithMetadataV4 | null>;
    findOrdersAsync(query?: OrderQuery): Promise<OrderWithMetadata[]>;
    findOrdersV4Async(query?: OrderQuery): Promise<OrderWithMetadataV4[]>;
    onReconnected(cb: () => void): void;
    onOrderEvents(): Observable<OrderEvent[]>;
    rawQueryAsync<T = any, TVariables = OperationVariables>(options: QueryOptions<TVariables>): Promise<ApolloQueryResult<T>>;
}
//# sourceMappingURL=index.d.ts.map