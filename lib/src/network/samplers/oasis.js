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
exports.OasisSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const utils_1 = require("../utils");
const OASIS_ROUTER_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x5e3e0548935a83ad29fb2a9153d331dc6d49020f',
}, constants_1.NULL_ADDRESS);
class OasisSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _router) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromEth2Dai',
            buyContractBuyFunctionName: 'sampleBuysFromEth2Dai',
        });
        this._router = _router;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new OasisSampler(chain, OASIS_ROUTER_BY_CHAIN_ID[chain.chainId]);
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 2;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return [
                {
                    args: [this._router, takerToken, makerToken, takerFillAmounts],
                    getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Eth2Dai,
                        fillData: { router: this._router },
                        input: a,
                        output: samples[i],
                    })),
                },
            ];
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return [
                {
                    args: [this._router, takerToken, makerToken, makerFillAmounts],
                    getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Eth2Dai,
                        fillData: { router: this._router },
                        input: a,
                        output: samples[i],
                    })),
                },
            ];
        });
    }
}
exports.OasisSampler = OasisSampler;
//# sourceMappingURL=oasis.js.map