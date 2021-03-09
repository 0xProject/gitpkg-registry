"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = exports.createMetricsRouter = void 0;
const express = require("express");
const prom_client_1 = require("prom-client");
// tslint:disable:max-classes-per-file
const createMetricsRouter = (metricsService) => {
    const router = express.Router();
    const handlers = new MetricsHandlers(metricsService);
    /**
     * GET metrics endpoint returns the prometheus metrics stored in the
     * metricsService registry.
     */
    router.get('/', handlers.servePrometheusMetrics.bind(handlers));
    return router;
};
exports.createMetricsRouter = createMetricsRouter;
class MetricsHandlers {
    constructor(metricsService) {
        this._metricsService = metricsService;
    }
    servePrometheusMetrics(_req, res) {
        res.send(this._metricsService.getMetrics());
    }
}
class MetricsService {
    constructor() {
        // we use the default register provided by prom-client.
        this._registry = prom_client_1.register;
        prom_client_1.collectDefaultMetrics({ register: this._registry });
    }
    getMetrics() {
        return this._registry.metrics();
    }
}
exports.MetricsService = MetricsService;
//# sourceMappingURL=metrics.js.map