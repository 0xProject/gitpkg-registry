"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcheckService = exports.createHealthcheckRouter = void 0;
const express = require("express");
const HttpStatus = require("http-status-codes");
// tslint:disable:max-classes-per-file
class Handlers {
    constructor(healthcheckService) {
        this._healthcheckService = healthcheckService;
    }
    serveHealthcheck(_req, res) {
        const isHealthy = this._healthcheckService.isHealthy();
        if (isHealthy) {
            res.status(HttpStatus.OK).send({ isHealthy });
        }
        else {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({ isHealthy });
        }
    }
}
const createHealthcheckRouter = (service) => {
    const router = express.Router();
    const handlers = new Handlers(service);
    /**
     * GET healthcheck endpoint returns the health of the http server.
     */
    router.get('/', handlers.serveHealthcheck.bind(handlers));
    return router;
};
exports.createHealthcheckRouter = createHealthcheckRouter;
class HealthcheckService {
    constructor() {
        this._isHealthy = false;
    }
    setHealth(val) {
        this._isHealthy = val;
    }
    isHealthy() {
        return this._isHealthy;
    }
}
exports.HealthcheckService = HealthcheckService;
//# sourceMappingURL=healthcheck.js.map