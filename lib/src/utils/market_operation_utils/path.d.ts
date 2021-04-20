import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { CreateOrderFromPathOpts } from './orders';
import { CollapsedFill, ExchangeProxyOverhead, Fill, OptimizedMarketOrder } from './types';
export interface PathSize {
    input: BigNumber;
    output: BigNumber;
}
export interface PathPenaltyOpts {
    outputAmountPerEth: BigNumber;
    inputAmountPerEth: BigNumber;
    exchangeProxyOverhead: ExchangeProxyOverhead;
}
export declare const DEFAULT_PATH_PENALTY_OPTS: PathPenaltyOpts;
export declare class Path {
    protected readonly side: MarketOperation;
    fills: ReadonlyArray<Fill>;
    protected readonly targetInput: BigNumber;
    readonly pathPenaltyOpts: PathPenaltyOpts;
    collapsedFills?: ReadonlyArray<CollapsedFill>;
    orders?: OptimizedMarketOrder[];
    sourceFlags: number;
    protected _size: PathSize;
    protected _adjustedSize: PathSize;
    private _bestFill?;
    static create(side: MarketOperation, fills: ReadonlyArray<Fill>, targetInput?: BigNumber, pathPenaltyOpts?: PathPenaltyOpts): Path;
    static clone(base: Path): Path;
    protected constructor(side: MarketOperation, fills: ReadonlyArray<Fill>, targetInput: BigNumber, pathPenaltyOpts: PathPenaltyOpts);
    append(fill: Fill): this;
    addFallback(fallback: Path): this;
    collapse(opts: CreateOrderFromPathOpts): CollapsedPath;
    size(): PathSize;
    adjustedSize(): PathSize;
    adjustedCompleteRate(): BigNumber;
    adjustedRate(): BigNumber;
    /**
     * Returns the best possible rate this path can offer, given the fills.
     */
    bestRate(): BigNumber;
    adjustedSlippage(maxRate: BigNumber): number;
    isBetterThan(other: Path): boolean;
    isComplete(): boolean;
    isValid(skipDuplicateCheck?: boolean): boolean;
    isValidNextFill(fill: Fill): boolean;
    private _collapseFills;
    private _addFillSize;
}
export interface CollapsedPath extends Path {
    readonly collapsedFills: ReadonlyArray<CollapsedFill>;
    readonly orders: OptimizedMarketOrder[];
}
//# sourceMappingURL=path.d.ts.map