"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class TokenAdjacencyGraphBuilder {
    constructor(tokenAdjacency) {
        this.tokenAdjacency = tokenAdjacency;
    }
    add(from, to) {
        if (!this.tokenAdjacency[from]) {
            this.tokenAdjacency[from] = [...this.tokenAdjacency.default];
        }
        this.tokenAdjacency[from] = [...(Array.isArray(to) ? to : [to]), ...this.tokenAdjacency[from]];
        this.tokenAdjacency[from] = _.uniqBy(this.tokenAdjacency[from], a => a.toLowerCase());
        return this;
    }
    tap(cb) {
        cb(this);
        return this;
    }
    build() {
        return this.tokenAdjacency;
    }
}
exports.TokenAdjacencyGraphBuilder = TokenAdjacencyGraphBuilder;
//# sourceMappingURL=token_adjacency_graph_builder.js.map