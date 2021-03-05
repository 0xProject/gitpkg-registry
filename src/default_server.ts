import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
// tslint:disable-next-line:no-implicit-dependencies
import { Express } from 'express-serve-static-core';
import { createServer, Server } from 'http';

import { createHealthcheckRouter, HealthcheckService } from './healthcheck';
import { createMetricsRouter, MetricsService } from './metrics';
import { createRequestLoggerMiddleware } from './request_logger';
import { GenericLogger, HttpServiceConfig } from './types';

/**
 * creates the NodeJS http server with graceful shutdowns, healthchecks,
 * configured header timeouts and other sane defaults set.
 */
export function createDefaultServer(
    config: HttpServiceConfig,
    app: Express,
    logger: GenericLogger,
    destroyAsync: () => Promise<void>,
): Server {
    app.use(createRequestLoggerMiddleware(logger));
    app.use(cors());
    app.use(bodyParser.json());

    const server = createServer(app);
    server.keepAliveTimeout = config.httpKeepAliveTimeout;
    server.headersTimeout = config.httpHeadersTimeout;
    const healthcheckService = new HealthcheckService();

    server.on('close', () => {
        logger.info('http server shutdown');
    });
    server.on('listening', () => {
        logger.info(`server listening on ${config.httpPort}`);
        healthcheckService.setHealth(true);
    });

    const shutdownFunc = (sig: string) => {
        logger.info(`received: ${sig}, shutting down server`);
        healthcheckService.setHealth(false);
        server.close(async err => {
            await destroyAsync();
            if (!server.listening) {
                process.exit(0);
            }
            if (err) {
                logger.error(`server closed with an error: ${err}, exiting`);
                process.exit(1);
            }
            logger.info('successful shutdown, exiting');
            process.exit(0);
        });
    };
    if (config.httpPort === config.healthcheckHttpPort) {
        app.use(config.healthcheckPath, createHealthcheckRouter(healthcheckService));
    } else {
        // if we don't want to expose the /healthz healthcheck service route to
        // the public, we serve it from a different port. Serving it through a
        // different express app also removes the unnecessary request logging.
        const healthcheckApp = express();
        healthcheckApp.use(config.healthcheckPath, createHealthcheckRouter(healthcheckService));
        healthcheckApp.listen(config.healthcheckHttpPort, () => {
            logger.info(`healthcheckApp listening on ${config.healthcheckHttpPort}`);
        });
    }

    if (config.enablePrometheusMetrics) {
        const metricsService = new MetricsService();
        const metricsRouter = createMetricsRouter(metricsService);
        if (config.prometheusPort === config.httpPort) {
            // if the target prometheus port is the same as the base app port,
            // we just add the router to latter.
            app.use(config.prometheusPath, metricsRouter);
        } else {
            // otherwise we create a separate server for metrics.
            const metricsApp = express();
            metricsApp.use(config.prometheusPath, metricsRouter);
            const metricsServer = metricsApp.listen(config.prometheusPort, () => {
                logger.info(`Metrics (HTTP) listening on port ${config.prometheusPort}`);
            });
            metricsServer.on('error', err => {
                logger.error(err);
            });
        }
    }

    process.on('SIGINT', shutdownFunc);
    process.on('SIGTERM', shutdownFunc);
    process.on('SIGQUIT', shutdownFunc);
    return server;
}
