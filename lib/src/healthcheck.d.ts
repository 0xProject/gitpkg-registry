import * as express from 'express';
export declare const createHealthcheckRouter: (service: HealthcheckService) => express.Router;
export declare class HealthcheckService {
    private _isHealthy;
    constructor();
    setHealth(val: boolean): void;
    isHealthy(): boolean;
}
//# sourceMappingURL=healthcheck.d.ts.map