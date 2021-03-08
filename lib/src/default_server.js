"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultServer = void 0;
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const http_1 = require("http");
const healthcheck_1 = require("./healthcheck");
const metrics_1 = require("./metrics");
const request_logger_1 = require("./middleware/request_logger");
/**
 * creates the NodeJS http server with graceful shutdowns, healthchecks,
 * configured header timeouts and other sane defaults set.
 */
function createDefaultServer(config, app, logger, destroyAsync) {
    app.use(request_logger_1.createRequestLoggerMiddleware(logger));
    app.use(cors());
    app.use(bodyParser.json());
    const server = http_1.createServer(app);
    server.keepAliveTimeout = config.httpKeepAliveTimeout;
    server.headersTimeout = config.httpHeadersTimeout;
    const healthcheckService = new healthcheck_1.HealthcheckService();
    server.on('close', () => {
        logger.info('http server shutdown');
    });
    server.on('listening', () => {
        logger.info(`server listening on ${config.httpPort}`);
        healthcheckService.setHealth(true);
    });
    const shutdownFunc = (sig) => {
        logger.info(`received: ${sig}, shutting down server`);
        healthcheckService.setHealth(false);
        server.close(async (err) => {
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
        app.use(config.healthcheckPath, healthcheck_1.createHealthcheckRouter(healthcheckService));
    }
    else {
        // if we don't want to expose the /healthz healthcheck service route to
        // the public, we serve it from a different port. Serving it through a
        // different express app also removes the unnecessary request logging.
        const healthcheckApp = express();
        healthcheckApp.use(config.healthcheckPath, healthcheck_1.createHealthcheckRouter(healthcheckService));
        healthcheckApp.listen(config.healthcheckHttpPort, () => {
            logger.info(`healthcheckApp listening on ${config.healthcheckHttpPort}`);
        });
    }
    if (config.enablePrometheusMetrics) {
        const metricsService = new metrics_1.MetricsService();
        const metricsRouter = metrics_1.createMetricsRouter(metricsService);
        if (config.prometheusPort === config.httpPort) {
            // if the target prometheus port is the same as the base app port,
            // we just add the router to latter.
            app.use(config.prometheusPath, metricsRouter);
        }
        else {
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
exports.createDefaultServer = createDefaultServer;
//# sourceMappingURL=default_server.js.map