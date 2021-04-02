import * as express from 'express';
export declare const createMetricsRouter: (metricsService: MetricsService) => express.Router;
export declare class MetricsService {
    private readonly _registry;
    constructor();
    getMetrics(): string;
}
//# sourceMappingURL=metrics.d.ts.map