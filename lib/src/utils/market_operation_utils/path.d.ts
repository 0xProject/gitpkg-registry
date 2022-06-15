import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { CreateOrderFromPathOpts } from './orders';
import { ExchangeProxyOverhead, Fill, OptimizedMarketOrder } from './types';
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
    orders?: OptimizedMarketOrder[];
    sourceFlags: bigint;
    protected _size: PathSize;
    protected _adjustedSize: PathSize;
    static create(side: MarketOperation, fills: ReadonlyArray<Fill>, targetInput?: BigNumber, pathPenaltyOpts?: PathPenaltyOpts): Path;
    protected constructor(side: MarketOperation, fills: ReadonlyArray<Fill>, targetInput: BigNumber, pathPenaltyOpts: PathPenaltyOpts);
    /**
     * Finalizes this path, creating fillable orders with the information required
     * for settlement
     */
    finalize(opts: CreateOrderFromPathOpts): FinalizedPath;
    adjustedSize(): PathSize;
    adjustedCompleteRate(): BigNumber;
    /**
     * Calculates the rate of this path, where the output has been
     * adjusted for penalties (e.g cost)
     */
    adjustedRate(): BigNumber;
    /**
     * Returns the best possible rate this path can offer, given the fills.
     */
    bestRate(): BigNumber;
    /**
     * Compares two paths returning if this adjusted path
     * is better than the other adjusted path
     */
    isAdjustedBetterThan(other: Path): boolean;
    private _addFillSize;
}
export interface FinalizedPath extends Path {
    readonly orders: OptimizedMarketOrder[];
}
//# sourceMappingURL=path.d.ts.map