import { MeshGraphQLClient } from '../../src';
export interface MeshDeployment {
    client: MeshGraphQLClient;
    mesh: MeshHarness;
    peerID: string;
}
/**
 * Start a GraphQL client connected to a GraphQL server that is ready for use.
 * @return A mesh deployment including a GraphQL client, mesh manager, and the
 *         peer ID of the mesh process that is running in the mesh manager.
 */
export declare function startServerAndClientAsync(): Promise<MeshDeployment>;
export declare class MeshHarness {
    static readonly DEFAULT_TIMEOUT = 1000;
    protected static _serverPort: number;
    readonly _graphQLServerPort: number;
    private readonly _mesh;
    private _killed;
    /**
     * Wait for a log on the mesh process's stderr that matches the given regex pattern.
     * @param pattern The regex pattern to use when testing incoming logs.
     * @param timeout An optional timeout parameter to schedule an end to waiting on the logs.
     */
    waitForPatternAsync(pattern: RegExp, timeout?: number): Promise<string>;
    /**
     * Kill the mesh process of this mesh instance.
     */
    stopMesh(): void;
    constructor();
}
//# sourceMappingURL=graphql_server.d.ts.map