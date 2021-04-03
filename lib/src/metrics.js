"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = exports.createMetricsRouter = void 0;
const express = __importStar(require("express"));
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