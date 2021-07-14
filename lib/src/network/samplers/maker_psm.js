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
exports.MakerPsmSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const utils_2 = require("../utils");
const MAKER_PSM_INFO_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        // Currently only USDC is supported
        gemTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        ilkIdentifier: packStringAsBytes32('PSM-USDC-A'),
        psmAddress: '0x89b78cfa322f6c5de0abceecab66aee45393cc5a',
    },
}, {
    gemTokenAddress: constants_1.NULL_ADDRESS,
    ilkIdentifier: constants_1.NULL_BYTES32,
    psmAddress: constants_1.NULL_ADDRESS,
});
function packStringAsBytes32(s) {
    return utils_1.hexUtils.rightPad(utils_1.hexUtils.toHex(Buffer.from(s)), 32);
}
class MakerPsmSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _psmInfo) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromMakerPsm',
            buyContractBuyFunctionName: 'sampleBuysFromMakerPsm',
        });
        this._psmInfo = _psmInfo;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new MakerPsmSampler(chain, MAKER_PSM_INFO_BY_CHAIN_ID[chain.chainId]);
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
                    args: [this._psmInfo, takerToken, makerToken, takerFillAmounts],
                    getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.MakerPsm,
                        fillData: Object.assign(Object.assign({}, this._psmInfo), { takerToken }),
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
                    args: [this._psmInfo, takerToken, makerToken, makerFillAmounts],
                    getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.MakerPsm,
                        fillData: Object.assign(Object.assign({}, this._psmInfo), { takerToken }),
                        input: a,
                        output: samples[i],
                    })),
                },
            ];
        });
    }
}
exports.MakerPsmSampler = MakerPsmSampler;
//# sourceMappingURL=maker_psm.js.map