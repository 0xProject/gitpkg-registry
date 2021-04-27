"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshHarness = exports.startServerAndClientAsync = void 0;
const child_process_1 = require("child_process");
const jsonstream = require("jsonstream");
const path_1 = require("path");
const rimraf = require("rimraf");
const src_1 = require("../../src");
const dataDir = '/tmp/mesh-graphql-integration-testing/data/';
function buildBinaryAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = path_1.join(__dirname, '../../../../../').normalize();
        const build = child_process_1.spawn('make', ['mesh'], { cwd });
        yield new Promise((resolve, reject) => {
            build.on('close', (code) => {
                code === 0 ? resolve() : reject(new Error('Failed to build 0x-mesh'));
            });
            build.on('error', (error) => {
                reject(error);
            });
        });
    });
}
function cleanupAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            rimraf(dataDir, (err) => {
                if (err != null) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}
// The amount of time to wait after seeing the "starting GraphQL server" log message
// before attempting to connect to the GraphQL server.
const serverStartWaitTimeMs = 100;
/**
 * Start a GraphQL client connected to a GraphQL server that is ready for use.
 * @return A mesh deployment including a GraphQL client, mesh manager, and the
 *         peer ID of the mesh process that is running in the mesh manager.
 */
function startServerAndClientAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cleanupAsync();
        yield buildBinaryAsync();
        const mesh = new MeshHarness();
        const log = yield mesh.waitForPatternAsync(/starting GraphQL server/);
        const peerID = JSON.parse(log.toString()).myPeerID;
        yield sleepAsync(serverStartWaitTimeMs);
        const client = new src_1.MeshGraphQLClient({
            httpUrl: `http://localhost:${mesh._graphQLServerPort}/graphql`,
            webSocketUrl: `ws://localhost:${mesh._graphQLServerPort}/graphql`,
        });
        return {
            client,
            mesh,
            peerID,
        };
    });
}
exports.startServerAndClientAsync = startServerAndClientAsync;
class MeshHarness {
    constructor() {
        this._killed = false;
        const env = Object.create(process.env);
        this._graphQLServerPort = MeshHarness._serverPort++;
        env.DATA_DIR = dataDir;
        env.ETHEREUM_RPC_URL = 'http://localhost:8545';
        env.ETHEREUM_CHAIN_ID = '1337';
        env.VERBOSITY = '5';
        env.USE_BOOTSTRAP_LIST = false;
        env.ENABLE_GRAPHQL_SERVER = true;
        env.GRAPHQL_SERVER_ADDR = `localhost:${this._graphQLServerPort}`;
        this._mesh = child_process_1.spawn('mesh', [], { env });
        this._mesh.stderr.on('error', (error) => {
            throw new Error(`${error.name} - ${error.message}`);
        });
    }
    /**
     * Wait for a log on the mesh process's stderr that matches the given regex pattern.
     * @param pattern The regex pattern to use when testing incoming logs.
     * @param timeout An optional timeout parameter to schedule an end to waiting on the logs.
     */
    waitForPatternAsync(pattern, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._killed) {
                throw new Error('mesh instance has already been killed');
            }
            return new Promise((resolve, reject) => {
                const stream = jsonstream.parse(true);
                stream.on('data', (data) => {
                    // Note(albrow): Uncomment this if you need to see the output from the server.
                    // console.log(data);
                    const dataString = JSON.stringify(data);
                    if (pattern.test(dataString)) {
                        resolve(dataString);
                    }
                });
                this._mesh.stderr.pipe(stream);
                setTimeout(reject, timeout || MeshHarness.DEFAULT_TIMEOUT);
            });
        });
    }
    /**
     * Kill the mesh process of this mesh instance.
     */
    stopMesh() {
        this._killed = true;
        this._mesh.kill('SIGKILL');
    }
}
exports.MeshHarness = MeshHarness;
MeshHarness.DEFAULT_TIMEOUT = 1000;
MeshHarness._serverPort = 64321;
function sleepAsync(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
}
//# sourceMappingURL=graphql_server.js.map