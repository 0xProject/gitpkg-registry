import { BigNumber } from '@0x/utils';
/**
 * This has been copied from https://github.com/balancer-labs/balancer-sor/blob/john/rc2/src/helpers.ts.
 * Still awaiting V2 support for @balancer-labs/sor, once full V2 support is shipped we can upgrade sor and delete this file
 */
export declare const parsePoolData: (directPools: SubGraphPoolDictionary, tokenIn: string, tokenOut: string, mostLiquidPoolsFirstHop?: SubGraphPool[], mostLiquidPoolsSecondHop?: SubGraphPool[], hopTokens?: string[]) => [SubGraphPoolDictionary, Path[]];
interface SubGraphPool {
    id: string;
    swapFee: string;
    totalWeight: string;
    totalShares: string;
    tokens: SubGraphToken[];
    tokensList: string[];
    poolType?: string;
    amp: string;
    lpShares?: BigNumber;
    time?: BigNumber;
    principalToken?: string;
    baseToken?: string;
}
interface SubGraphPoolDictionary {
    [poolId: string]: SubGraphPool;
}
interface SubGraphToken {
    address: string;
    balance: string;
    decimals: string | number;
    weight?: string;
}
interface Path {
    id: string;
    swaps: Swap[];
    poolPairData?: PoolPairData[];
    limitAmount?: BigNumber;
    filterEffectivePrice?: BigNumber;
}
interface Swap {
    pool: string;
    tokenIn: string;
    tokenOut: string;
    swapAmount?: string;
    limitReturnAmount?: string;
    maxPrice?: string;
    tokenInDecimals: number;
    tokenOutDecimals: number;
}
export interface PoolPairData {
    id: string;
    poolType?: string;
    pairType?: string;
    tokenIn: string;
    tokenOut: string;
    balanceIn?: BigNumber;
    balanceOut?: BigNumber;
    decimalsIn: number;
    decimalsOut: number;
    swapFee: BigNumber;
    weightIn?: BigNumber;
    weightOut?: BigNumber;
    allBalances: BigNumber[];
    invariant?: BigNumber;
    amp?: BigNumber;
    tokenIndexIn?: number;
    tokenIndexOut?: number;
    lpShares?: BigNumber;
    time?: BigNumber;
    principalToken?: string;
    baseToken?: string;
}
export {};
//# sourceMappingURL=balancer_sor_v2.d.ts.map