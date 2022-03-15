import { ChainId } from '@0x/contract-addresses';
import { OptimizerCapture } from '@0x/neon-router';
export declare const SAMPLE_THRESHOLD = 0.003;
export declare class TestDataSampler {
    private static _instance;
    private static readonly _s3Client;
    private _routes;
    private readonly _chainId;
    static getInstance(chainId: ChainId): TestDataSampler;
    static sampleRoute(chainId: ChainId, route: OptimizerCapture): void;
    len(): number;
    private constructor();
}
//# sourceMappingURL=router_test_data_sampler.d.ts.map