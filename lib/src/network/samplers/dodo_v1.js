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
exports.DodoV1Sampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const utils_1 = require("../utils");
const DODOV1_CONFIG_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        helper: '0x533da777aedce766ceae696bf90f8541a4ba80eb',
        registry: '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950',
    },
    [contract_addresses_1.ChainId.BSC]: {
        helper: '0x0f859706aee7fcf61d5a8939e8cb9dbb6c1eda33',
        registry: '0xca459456a45e300aa7ef447dbb60f87cccb42828',
    },
    [contract_addresses_1.ChainId.Polygon]: {
        helper: '0xdfaf9584f5d229a9dbe5978523317820a8897c5a',
        registry: '0x357c5e9cfa8b834edcef7c7aabd8f9db09119d11',
    },
}, { helper: constants_1.NULL_ADDRESS, registry: constants_1.NULL_ADDRESS });
class DodoV1Sampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _dodoInfo) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromDODO',
            buyContractBuyFunctionName: 'sampleBuysFromDODO',
        });
        this._dodoInfo = _dodoInfo;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DodoV1Sampler(chain, DODOV1_CONFIG_BY_CHAIN_ID[chain.chainId]);
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
                    args: [this._dodoInfo, takerToken, makerToken, takerFillAmounts],
                    getDexSamplesFromResult: ([isSellBase, poolAddress, samples]) => takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Dodo,
                        fillData: {
                            isSellBase,
                            poolAddress,
                            helperAddress: this._dodoInfo.helper,
                        },
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
                    args: [this._dodoInfo, takerToken, makerToken, makerFillAmounts],
                    getDexSamplesFromResult: ([isSellBase, poolAddress, samples]) => makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Dodo,
                        fillData: {
                            isSellBase,
                            poolAddress,
                            helperAddress: this._dodoInfo.helper,
                        },
                        input: a,
                        output: samples[i],
                    })),
                },
            ];
        });
    }
}
exports.DodoV1Sampler = DodoV1Sampler;
//# sourceMappingURL=dodo_v1.js.map