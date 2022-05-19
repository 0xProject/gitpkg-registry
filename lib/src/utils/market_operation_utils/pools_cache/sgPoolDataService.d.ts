import { PoolDataService, SubgraphPoolBase } from '@balancer-labs/sdk';
/**
 * Simple service to query required info from Subgraph for Balancer Pools.
 * Because Balancer Subgraphs have slightly different schema depending on network the queries are adjusted as needed.
 */
export declare class SubgraphPoolDataService implements PoolDataService {
    private readonly _config;
    private readonly _gqlQuery;
    constructor(_config: {
        chainId: number;
        subgraphUrl: string | null;
        maxPoolsFetched?: number;
    });
    getPools(): Promise<SubgraphPoolBase[]>;
}
//# sourceMappingURL=sgPoolDataService.d.ts.map