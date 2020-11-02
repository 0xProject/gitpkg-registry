"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const WebSocket = require("websocket");
const DEFAULT_STATUS_CODE = 404;
exports.SERVER_PORT = 64321;
// tslint:disable-next-line:custom-no-magic-numbers
const sixtyFourMB = 64 * 1024 * 1024; // 64MiB
let server;
let wsServer;
/**
 * Sets up a new test WS server
 * @return A WS server
 */
function setupServerAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            server = http.createServer((_request, response) => {
                response.writeHead(DEFAULT_STATUS_CODE);
                response.end();
            });
            wsServer = new WebSocket.server({
                httpServer: server,
                autoAcceptConnections: true,
                maxReceivedFrameSize: sixtyFourMB,
                maxReceivedMessageSize: sixtyFourMB,
                fragmentOutgoingMessages: false,
                keepalive: false,
                disableNagleAlgorithm: false,
            });
            server.listen(exports.SERVER_PORT, () => {
                resolve(wsServer);
            });
        });
    });
}
exports.setupServerAsync = setupServerAsync;
/**
 * Stops the test WS server
 */
function stopServer() {
    try {
        wsServer.shutDown();
        server.close();
    }
    catch (e) {
        // tslint:disable-next-line:no-console
        console.log('stopServer threw', e);
    }
}
exports.stopServer = stopServer;
//# sourceMappingURL=mock_ws_server.js.map