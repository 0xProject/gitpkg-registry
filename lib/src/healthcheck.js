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
exports.HealthcheckService = exports.createHealthcheckRouter = void 0;
const express = __importStar(require("express"));
const HttpStatus = __importStar(require("http-status-codes"));
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