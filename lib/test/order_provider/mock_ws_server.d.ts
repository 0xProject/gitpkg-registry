import * as WebSocket from 'websocket';
export declare const SERVER_PORT = 64321;
/**
 * Sets up a new test WS server
 * @return A WS server
 */
export declare function setupServerAsync(): Promise<WebSocket.server>;
/**
 * Stops the test WS server
 */
export declare function stopServer(): void;
//# sourceMappingURL=mock_ws_server.d.ts.map