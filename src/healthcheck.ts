import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

// tslint:disable:max-classes-per-file
class Handlers {
    private readonly _healthcheckService: HealthcheckService;

    constructor(healthcheckService: HealthcheckService) {
        this._healthcheckService = healthcheckService;
    }

    public serveHealthcheck(_req: express.Request, res: express.Response): void {
        const isHealthy = this._healthcheckService.isHealthy();
        if (isHealthy) {
            res.status(HttpStatus.OK).send({ isHealthy });
        } else {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({ isHealthy });
        }
    }
}

export const createHealthcheckRouter = (service: HealthcheckService): express.Router => {
    const router = express.Router();
    const handlers = new Handlers(service);
    /**
     * GET healthcheck endpoint returns the health of the http server.
     */
    router.get('/', handlers.serveHealthcheck.bind(handlers));
    return router;
};

export class HealthcheckService {
    private _isHealthy: boolean;
    constructor() {
        this._isHealthy = false;
    }

    public setHealth(val: boolean): void {
        this._isHealthy = val;
    }

    public isHealthy(): boolean {
        return this._isHealthy;
    }
}
