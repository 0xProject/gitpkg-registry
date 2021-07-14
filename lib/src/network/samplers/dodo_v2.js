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
exports.DodoV2Sampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const wrappers_1 = require("../../wrappers");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const utils_2 = require("../utils");
const DODOV2_FACTORIES_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [
        '0x6b4fa0bc61eddc928e0df9c7f01e407bfcd3e5ef',
        '0x72d220ce168c4f361dd4dee5d826a01ad8598f6c',
        '0x6fddb76c93299d985f4d3fc7ac468f9a168577a4', // Stability Pool
    ],
    [contract_addresses_1.ChainId.BSC]: [
        '0xafe0a75dffb395eaabd0a7e1bbbd0b11f8609eef',
        '0x790b4a80fb1094589a3c0efc8740aa9b0c1733fb',
        '0x0fb9815938ad069bf90e14fe6c596c514bede767', // Stability Pool
    ],
    [contract_addresses_1.ChainId.Polygon]: [
        '0x95e887adf9eaa22cc1c6e3cb7f07adc95b4b25a8',
        '0x79887f65f83bdf15bcc8736b5e5bcdb48fb8fe13',
        '0x43c49f8dd240e1545f147211ec9f917376ac1e87', // Stability Pool
    ],
}, []);
const MAX_DODOV2_POOLS_QUERIED = 3;
const DODO_V2_OFFSETS = [...new Array(MAX_DODOV2_POOLS_QUERIED)].map((_v, i) => new utils_1.BigNumber(i));
class DodoV2Sampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _factories) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromDODOV2',
            buyContractBuyFunctionName: 'sampleBuysFromDODOV2',
        });
        this._factories = _factories;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DodoV2Sampler(chain, DODOV2_FACTORIES_BY_CHAIN_ID[chain.chainId]);
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 2;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return this._factories
                .map(factory => DODO_V2_OFFSETS.map(offset => ({
                args: [factory, offset, takerToken, makerToken, takerFillAmounts],
                getDexSamplesFromResult: ([isSellBase, poolAddress, samples]) => {
                    return takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.DodoV2,
                        fillData: { poolAddress, isSellBase },
                        input: a,
                        output: samples[i],
                    }));
                },
            })))
                .flat(1);
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return this._factories
                .map(factory => DODO_V2_OFFSETS.map(offset => ({
                args: [factory, offset, takerToken, makerToken, makerFillAmounts],
                getDexSamplesFromResult: ([isSellBase, poolAddress, samples]) => {
                    return makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.DodoV2,
                        fillData: { poolAddress, isSellBase },
                        input: a,
                        output: samples[i],
                    }));
                },
            })))
                .flat(1);
        });
    }
}
exports.DodoV2Sampler = DodoV2Sampler;
//# sourceMappingURL=dodo_v2.js.map