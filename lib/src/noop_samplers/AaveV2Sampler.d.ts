import { BigNumber } from '@0x/utils';
export interface AaveInfo {
    lendingPool: string;
    aToken: string;
    underlyingToken: string;
}
export declare class AaveV2Sampler {
    static sampleSellsFromAaveV2(aaveInfo: AaveInfo, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): BigNumber[];
    static sampleBuysFromAaveV2(aaveInfo: AaveInfo, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): BigNumber[];
}
//# sourceMappingURL=AaveV2Sampler.d.ts.map