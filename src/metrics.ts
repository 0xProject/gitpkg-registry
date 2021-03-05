import * as express from 'express';
import { collectDefaultMetrics, register, Registry } from 'prom-client';

// tslint:disable:max-classes-per-file
export const createMetricsRouter = (metricsService: MetricsService): express.Router => {
    const router = express.Router();
    const handlers = new MetricsHandlers(metricsService);
    /**
     * GET metrics endpoint returns the prometheus metrics stored in the
     * metricsService registry.
     */
    router.get('/', handlers.servePrometheusMetrics.bind(handlers));
    return router;
};

class MetricsHandlers {
    private readonly _metricsService: MetricsService;

    constructor(metricsService: MetricsService) {
        this._metricsService = metricsService;
    }

    public servePrometheusMetrics(_req: express.Request, res: express.Response): void {
        res.send(this._metricsService.getMetrics());
    }
}

export class MetricsService {
    private readonly _registry: Registry;
    constructor() {
        // we use the default register provided by prom-client.
        this._registry = register;
        collectDefaultMetrics({ register: this._registry });
    }

    public getMetrics(): string {
        return this._registry.metrics();
    }
}
