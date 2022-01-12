"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestLoggerMiddleware = void 0;
const pino_http_1 = __importDefault(require("pino-http"));
const uuid_1 = require("uuid");
/**
 * log middleware
 */
function createRequestLoggerMiddleware(app, logger) {
    const httpLogger = pino_http_1.default({
        logger,
        // Re-use request ID from upstream (i.e. nginx reverse proxy)
        genReqId: (req) => { var _a; return (((_a = req.headers) === null || _a === void 0 ? void 0 : _a['x-request-id']) ? req.headers['x-request-id'] : uuid_1.v4()); },
        useLevelLabels: logger.useLevelLabels,
        autoLogging: true,
        serializers,
        wrapSerializers: true,
    });
    app.use(httpLogger);
}
exports.createRequestLoggerMiddleware = createRequestLoggerMiddleware;
const serializers = {
    req: (req) => {
        req.query = req.raw.query;
        req.body = req.raw.body;
        req.params = req.raw.params;
        return req;
    },
    res: (res) => {
        res.statusMessage = res.raw.statusMessage;
        return res;
    },
};
//# sourceMappingURL=request_logger.js.map