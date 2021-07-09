import { TokenAdjacencyGraph } from './types';
export declare class TokenAdjacencyGraphBuilder {
    private readonly tokenAdjacency;
    constructor(tokenAdjacency: TokenAdjacencyGraph);
    add(from: string, to: string | string[]): TokenAdjacencyGraphBuilder;
    tap(cb: (builder: TokenAdjacencyGraphBuilder) => void): TokenAdjacencyGraphBuilder;
    build(): TokenAdjacencyGraph;
}
//# sourceMappingURL=token_adjacency_graph_builder.d.ts.map