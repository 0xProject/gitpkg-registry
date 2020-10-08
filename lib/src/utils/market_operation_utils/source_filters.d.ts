import { ERC20BridgeSource } from './types';
export declare class SourceFilters {
    private readonly _validSources;
    private readonly _excludedSources;
    private readonly _includedSources;
    static all(): SourceFilters;
    constructor(validSources?: ERC20BridgeSource[], excludedSources?: ERC20BridgeSource[], includedSources?: ERC20BridgeSource[]);
    isAllowed(source: ERC20BridgeSource): boolean;
    areAnyAllowed(sources: ERC20BridgeSource[]): boolean;
    areAllAllowed(sources: ERC20BridgeSource[]): boolean;
    getAllowed(sources?: ERC20BridgeSource[]): ERC20BridgeSource[];
    readonly sources: ERC20BridgeSource[];
    exclude(sources: ERC20BridgeSource | ERC20BridgeSource[]): SourceFilters;
    validate(sources: ERC20BridgeSource | ERC20BridgeSource[]): SourceFilters;
    include(sources: ERC20BridgeSource | ERC20BridgeSource[]): SourceFilters;
    merge(other: SourceFilters): SourceFilters;
}
//# sourceMappingURL=source_filters.d.ts.map