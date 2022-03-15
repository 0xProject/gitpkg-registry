import { BigNumber } from '@0x/utils';
import { Address, MarketOperation } from '../../types';
import { CollapsedFill, ExchangeProxyOverhead, Fill, OptimizedOrder } from './types';
export interface PathSize {
    input: BigNumber;
    output: BigNumber;
}
export interface PathPenaltyOpts {
    outputAmountPerEth: BigNumber;
    inputAmountPerEth: BigNumber;
    exchangeProxyOverhead: ExchangeProxyOverhead;
    gasPrice: BigNumber;
}
export declare const DEFAULT_PATH_PENALTY_OPTS: PathPenaltyOpts;
export declare class Path {
    protected readonly side: MarketOperation;
    fills: ReadonlyArray<Fill>;
    protected readonly targetInput: BigNumber;
    readonly pathPenaltyOpts: PathPenaltyOpts;
    collapsedFills?: ReadonlyArray<CollapsedFill>;
    orders?: OptimizedOrder[];
    sourceFlags: bigint;
    protected _size: PathSize;
    protected _adjustedSize: PathSize;
    private _fallbackFillsStartIndex;
    static create(side: MarketOperation, fills: ReadonlyArray<Fill>, targetInput?: BigNumber, pathPenaltyOpts?: PathPenaltyOpts): Path;
    static clone(base: Path): Path;
    protected constructor(side: MarketOperation, fills: ReadonlyArray<Fill>, targetInput: BigNumber, pathPenaltyOpts: PathPenaltyOpts);
    append(fill: Fill): this;
    /**
     * Add a fallback path to the current path
     * Fallback must contain exclusive fills that are
     * not present in this path
     */
    addFallback(fallback: Path): this;
    collapse(opts: {
        side: MarketOperation;
        inputToken: Address;
        outputToken: Address;
    }): CollapsedPath;
    size(): PathSize;
    adjustedSize(): PathSize;
    adjustedCompleteMakerToTakerRate(): BigNumber;
    adjustedRate(): BigNumber;
    /**
     * Returns the best possible rate this path can offer, given the fills.
     */
    bestRate(): BigNumber;
    adjustedSlippage(maxRate: BigNumber): number;
    isBetterThan(other: Path): boolean;
    isComplete(): boolean;
    isValid(quick?: boolean): boolean;
    isValidNextFill(fill: Fill): boolean;
    private _collapseFills;
    private _addFillSize;
}
export interface CollapsedPath extends Path {
    readonly collapsedFills: ReadonlyArray<CollapsedFill>;
    readonly orders: OptimizedOrder[];
}
//# sourceMappingURL=path.d.ts.map