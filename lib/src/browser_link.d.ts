import { Mesh } from '@0x/mesh-browser-lite';
import { ApolloLink, FetchResult, Operation } from '@apollo/client/link/core';
import * as Observable from 'zen-observable';
export declare class BrowserLink extends ApolloLink {
    private readonly _mesh;
    constructor(_mesh: Mesh);
    request(operation: Operation): Observable<FetchResult>;
}
//# sourceMappingURL=browser_link.d.ts.map