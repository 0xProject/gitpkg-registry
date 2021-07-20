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
exports.LidoSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_1 = require("../utils");
const LIDO_INFO_BY_CHAIN = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        stEthToken: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        wethToken: tokens_1.MAINNET_TOKENS.WETH,
    },
}, {
    stEthToken: constants_1.NULL_ADDRESS,
    wethToken: constants_1.NULL_ADDRESS,
});
const GAS_PER_SAMPLE = 30e3;
class LidoSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _lidoInfo) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromLido',
            buyContractBuyFunctionName: 'sampleBuysFromLido',
        });
        this._lidoInfo = _lidoInfo;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new LidoSampler(chain, LIDO_INFO_BY_CHAIN[chain.chainId]);
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
                    args: [this._lidoInfo, takerToken, makerToken, takerFillAmounts],
                    getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Uniswap,
                        fillData: { takerToken, stEthTokenAddress: this._lidoInfo.stEthToken },
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
            const [takerToken, makerToken] = tokenAddressPath;
            return [
                {
                    args: [this._lidoInfo, takerToken, makerToken, makerFillAmounts],
                    getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Uniswap,
                        fillData: { takerToken, stEthTokenAddress: this._lidoInfo.stEthToken },
                        input: a,
                        output: samples[i],
                    })),
                    gas: GAS_PER_SAMPLE * makerFillAmounts.length,
                },
            ];
        });
    }
}
exports.LidoSampler = LidoSampler;
//# sourceMappingURL=lido.js.map