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
exports.KyberDmmSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const utils_1 = require("../utils");
const KYBER_DMM_ROUTER_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x1c87257f5e8609940bc751a07bb085bb7f8cdbe6',
    [contract_addresses_1.ChainId.Polygon]: '0x546c79662e028b661dfb4767664d0273184e4dd1',
}, constants_1.NULL_ADDRESS);
const GAS_PER_SAMPLE = 200e3;
class KyberDmmSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _router) {
        super({
            chain,
            name: types_1.ERC20BridgeSource.KyberDmm,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromKyberDmm',
            buyContractBuyFunctionName: 'sampleBuysFromKyberDmm',
        });
        this._router = _router;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const router = KYBER_DMM_ROUTER_BY_CHAIN_ID[chain.chainId];
            if (!router || router === constants_1.NULL_ADDRESS) {
                throw new Error(`No KyberDMM router found for chain ${chain.chainId}`);
            }
            return new KyberDmmSampler(chain, router);
        });
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    args: [this._router, tokenAddressPath, takerFillAmounts],
                    getDexSamplesFromResult: ([pools, samples]) => takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.KyberDmm,
                        fillData: {
                            router: this._router,
                            poolsPath: pools,
                            tokenAddressPath,
                        },
                        input: a,
                        output: samples[i],
                    })),
                    gas: GAS_PER_SAMPLE * takerFillAmounts.length,
                },
            ];
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    args: [this._router, tokenAddressPath, makerFillAmounts],
                    getDexSamplesFromResult: ([pools, samples]) => makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.KyberDmm,
                        fillData: {
                            router: this._router,
                            poolsPath: pools,
                            tokenAddressPath,
                        },
                        input: a,
                        output: samples[i],
                    })),
                    gas: GAS_PER_SAMPLE * makerFillAmounts.length,
                },
            ];
        });
    }
}
exports.KyberDmmSampler = KyberDmmSampler;
//# sourceMappingURL=kyber_dmm.js.map