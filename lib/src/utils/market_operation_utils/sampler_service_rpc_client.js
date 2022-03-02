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
exports.SamplerServiceRpcClient = void 0;
const utils_1 = require("@0x/utils");
const client_js_1 = require("@open-rpc/client-js");
class SamplerServiceRpcClient {
    constructor(url) {
        const transport = new client_js_1.HTTPTransport(url);
        // HACK(dorothy-zbornak): One of AS/API's deps globally registers a version of
        // isometric-fetch that doesn't work with open-rpc. It seems to disagree on
        // the type of 'headers'.
        transport.headers = { 'content-type': 'application/json' };
        this._rpcClient = new client_js_1.Client(new client_js_1.RequestManager([transport]));
    }
    _requestAsync(method, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._rpcClient.request({ method, params });
            }
            catch (err) {
                throw new Error(`Error making RPC request "${method}" to sampler service: ${err}`);
            }
        });
    }
    getChainIdAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._requestAsync('get_chain_id');
        });
    }
    getSellLiquidityAsync(reqs) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._requestAsync('get_sell_liquidity', [
                reqs.map(r => (Object.assign(Object.assign({}, r), { inputAmount: r.inputAmount.toString(10) }))),
            ]);
            return resp.map(r => (Object.assign(Object.assign({}, r), { liquidityCurves: r.liquidityCurves.map(a => a.map(c => (Object.assign(Object.assign({}, c), { buyAmount: new utils_1.BigNumber(c.buyAmount), sellAmount: new utils_1.BigNumber(c.sellAmount), metadata: decodeMetadata(c.jsonMetadata) })))) })));
        });
    }
    getBuyLiquidityAsync(reqs) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._requestAsync('get_buy_liquidity', [
                reqs.map(r => (Object.assign(Object.assign({}, r), { inputAmount: r.inputAmount.toString(10) }))),
            ]);
            return resp.map(r => (Object.assign(Object.assign({}, r), { liquidityCurves: r.liquidityCurves.map(a => a.map(c => (Object.assign(Object.assign({}, c), { buyAmount: new utils_1.BigNumber(c.buyAmount), sellAmount: new utils_1.BigNumber(c.sellAmount), metadata: decodeMetadata(c.jsonMetadata) })))) })));
        });
    }
    getPricesAsync(reqs) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this._requestAsync('get_prices', [reqs]);
            return resp.map(r => new utils_1.BigNumber(r));
        });
    }
    getTokensAsync(addresses) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._requestAsync('get_tokens', [addresses]);
        });
    }
}
exports.SamplerServiceRpcClient = SamplerServiceRpcClient;
function decodeMetadata(jsonMetadata) {
    if (!jsonMetadata) {
        return undefined;
    }
    return unmarshallMetadata(JSON.parse(jsonMetadata));
}
function unmarshallMetadata(v) {
    switch (typeof (v)) {
        case 'string':
            if (/^\d+n$/.test(v)) {
                return new utils_1.BigNumber(v.slice(0, -1));
            }
            return v;
        case 'object':
            if (Array.isArray(v)) {
                return v.map(v => unmarshallMetadata(v));
            }
            return Object.assign({}, ...Object.entries(v).map(([k, v]) => ({ [k]: v })));
    }
    return v;
}
//# sourceMappingURL=sampler_service_rpc_client.js.map