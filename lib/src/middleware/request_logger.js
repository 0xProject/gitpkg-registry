"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestLoggerMiddleware = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pino_1 = require("pino");
const pino_http_1 = __importDefault(require("pino-http"));
const uuid_1 = require("uuid");
/**
 * log middleware
 */
function createRequestLoggerMiddleware(app, logger) {
    const httpLogger = pino_http_1.default({
        logger,
        genReqId: (req) => uuid_1.v4(),
        useLevelLabels: logger.useLevelLabels,
        autoLogging: true,
        serializers,
        wrapSerializers: false,
    });
    app.use(httpLogger);
}
exports.createRequestLoggerMiddleware = createRequestLoggerMiddleware;
const serializers = {
    req: (req) => {
        const serialized = pino_1.stdSerializers.req(req);
        serialized.query = req.query;
        serialized.body = req.body;
        serialized.params = req.params;
        return serialized;
    },
    res: (res) => {
        // TODO (xianny): NOT WORKING
        // const origWrite = res.write;
        // const origEnd = res.end;
        const chunks = [];
        // res.write = function (...args: any[]) {
        //     chunks.push(Buffer.from(args[0]));
        //     return origWrite.bind(res)(...args);
        // }
        // res.end = function (...args: any[]) {
        //     chunks.push(Buffer.from(args[0]));
        //     return origEnd.bind(res)(...args);
        // }
        // res.on('close', (err: any, resp: any) => {
        //     console.log(`in close!!!! `, err, resp)
        // })
        const serialized = pino_1.stdSerializers.res(res);
        serialized.statusMessage = res.statusMessage;
        serialized.errorBody =
            res.statusCode >= http_status_codes_1.default.BAD_REQUEST ? Buffer.concat(chunks).toString('utf8') : undefined;
        return serialized;
    },
};
//# sourceMappingURL=request_logger.js.map