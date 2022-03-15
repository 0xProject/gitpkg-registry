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
exports.SamplerClient = void 0;
const sampler_service_rpc_client_1 = require("./sampler_service_rpc_client");
const DEFAULT_LIQUIDITY_SAMPLES = 16;
class SamplerClient {
    constructor(_chainId, _service) {
        this._chainId = _chainId;
        this._service = _service;
    }
    static createFromChainIdAndEndpoint(chainId, endpoint) {
        return new SamplerClient(chainId, new sampler_service_rpc_client_1.SamplerServiceRpcClient(endpoint));
    }
    static createFromEndpointAsync(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new sampler_service_rpc_client_1.SamplerServiceRpcClient(endpoint);
            const chainId = yield service.getChainIdAsync();
            return new SamplerClient(chainId, service);
        });
    }
    get chainId() {
        return this._chainId;
    }
    getPricesAsync(paths, sources, demand = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.getPricesAsync(paths.map(p => ({
                tokenPath: p,
                demand,
                sources,
            })));
        });
    }
    getTokenInfosAsync(tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.getTokensAsync(tokens);
        });
    }
    getSellLiquidityAsync(path, takerAmount, sources, numSamples = DEFAULT_LIQUIDITY_SAMPLES) {
        return __awaiter(this, void 0, void 0, function* () {
            const liquidity = yield this._service.getSellLiquidityAsync(sources.map(s => ({
                numSamples,
                tokenPath: path,
                inputAmount: takerAmount,
                source: s,
                demand: true,
            })));
            return liquidity.map(liq => liq.liquidityCurves.map(pts => pts.map(pt => ({
                input: pt.sellAmount,
                output: pt.buyAmount,
                encodedFillData: pt.encodedFillData,
                metadata: pt.metadata,
                gasCost: pt.gasCost,
                source: liq.source,
            })))).flat(1);
        });
    }
    getBuyLiquidityAsync(path, makerAmount, sources, numSamples = DEFAULT_LIQUIDITY_SAMPLES) {
        return __awaiter(this, void 0, void 0, function* () {
            const liquidity = yield this._service.getBuyLiquidityAsync(sources.map(s => ({
                numSamples,
                tokenPath: path,
                inputAmount: makerAmount,
                source: s,
                demand: true,
            })));
            return liquidity.map(liq => liq.liquidityCurves.map(pts => pts.map(pt => ({
                input: pt.buyAmount,
                output: pt.sellAmount,
                encodedFillData: pt.encodedFillData,
                metadata: pt.metadata,
                gasCost: pt.gasCost,
                source: liq.source,
            })))).flat(1);
        });
    }
}
exports.SamplerClient = SamplerClient;
//# sourceMappingURL=sampler.js.map