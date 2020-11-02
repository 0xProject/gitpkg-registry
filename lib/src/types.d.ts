import { APIOrder, SignedOrder } from '@0x/connect';
import { WSOpts } from '@0x/mesh-rpc-client';
export interface AddedRemovedOrders {
    assetPairKey: string;
    added: APIOrder[];
    removed: APIOrder[];
}
export interface RejectedOrder {
    message: string;
    order: SignedOrder;
}
export interface AcceptedRejectedOrders {
    accepted: SignedOrder[];
    rejected: RejectedOrder[];
}
export declare type AddedRemovedListeners = (addedRemoved: AddedRemovedOrders) => void;
/**
 * Constructor options for a SRA Websocket Order Provider
 */
export interface SRAWebsocketOrderProviderOpts {
    httpEndpoint: string;
    websocketEndpoint: string;
}
/**
 * Constructor options for a SRA Polling Order Provider
 */
export interface SRAPollingOrderProviderOpts {
    httpEndpoint: string;
    pollingIntervalMs: number;
    perPage?: number;
    chainId?: number;
}
/**
 * Constructor options for a Mesh Order Provider
 */
export interface MeshOrderProviderOpts {
    websocketEndpoint: string;
    wsOpts?: WSOpts;
}
//# sourceMappingURL=types.d.ts.map