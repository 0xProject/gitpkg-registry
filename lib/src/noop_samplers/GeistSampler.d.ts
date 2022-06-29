import { BigNumber } from '@0x/utils';
export interface GeistInfo {
    lendingPool: string;
    gToken: string;
    underlyingToken: string;
}
export declare class GeistSampler {
    static sampleSellsFromGeist(geistInfo: GeistInfo, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): BigNumber[];
    static sampleBuysFromGeist(geistInfo: GeistInfo, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): BigNumber[];
}
//# sourceMappingURL=GeistSampler.d.ts.map