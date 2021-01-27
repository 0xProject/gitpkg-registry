import { Mesh } from '@0x/mesh-browser-lite';
import { SignedOrder } from '@0x/types';
import { ApolloQueryResult, OperationVariables, QueryOptions } from '@apollo/client/core';
import * as Observable from 'zen-observable';
import { AddOrdersOpts, AddOrdersResults, OrderEvent, OrderQuery, OrderWithMetadata, OrderWithMetadataV4, SignedOrderV4, Stats } from './types';
export { AddOrdersResults, OrderEvent, OrderQuery, OrderWithMetadata, Stats, OrderFilter, FilterKind, OrderField, OrderSort, SortDirection, OrderEventEndState, RejectedOrderCode, } from './types';
export { SignedOrder } from '@0x/types';
export { ApolloQueryResult, QueryOptions } from '@apollo/client/core';
export { Observable };
export interface LinkConfig {
    httpUrl?: string;
    webSocketUrl?: string;
    mesh?: Mesh;
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
    getOrderAsyncV4(hash: string): Promise<OrderWithMetadataV4 | null>;
    findOrdersAsync(query?: OrderQuery): Promise<OrderWithMetadata[]>;
    findOrdersV4Async(query?: OrderQuery): Promise<OrderWithMetadataV4[]>;
    onReconnected(cb: () => void): void;
    onOrderEvents(): Observable<OrderEvent[]>;
    rawQueryAsync<T = any, TVariables = OperationVariables>(options: QueryOptions<TVariables>): Promise<ApolloQueryResult<T>>;
}
//# sourceMappingURL=index.d.ts.map