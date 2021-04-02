/// <reference types="node" />
import { Express } from 'express-serve-static-core';
import { Server } from 'http';
import { Logger } from 'pino';
import { HttpServiceConfig } from './types';
/**
 * creates the NodeJS http server with graceful shutdowns, healthchecks,
 * configured header timeouts and other sane defaults set.
 */
export declare function createDefaultServer(config: HttpServiceConfig, app: Express, logger: Logger, destroyAsync: () => Promise<void>): Server;
//# sourceMappingURL=default_server.d.ts.map