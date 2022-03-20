import { ChainId } from '@0x/contract-addresses';
import { OptimizerCapture } from '@0x/neon-router';
export declare const SAMPLE_THRESHOLD = 1;
interface routeData extends OptimizerCapture {
    inputToken: string;
    outputToken: string;
}
export declare class TestDataSampler {
    private static _instance;
    private static readonly _s3Client;
    private _routes;
    private readonly _chainId;
    static getInstance(chainId: ChainId): TestDataSampler;
    static sampleRoute(chainId: ChainId, route: routeData): void;
    len(): number;
    private constructor();
}
export {};
//# sourceMappingURL=router_test_data_sampler.d.ts.map