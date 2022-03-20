import { ChainId } from '@0x/contract-addresses';
export declare class TestDataSampler {
    private static instance;
    private routes;
    private readonly chainId;
    private constructor();
    static getInstance(chainId: ChainId): TestDataSampler;
    sampleRoute(route: any): void;
    len(): number;
}
//# sourceMappingURL=TestDataSampler.d.ts.map