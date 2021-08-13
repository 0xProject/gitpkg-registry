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
exports.UniswapV3Sampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const constants_1 = require("../../constants");
const wrappers_1 = require("../../wrappers");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const utils_1 = require("../utils");
const { NULL_ADDRESS } = constants_1.constants;
const BASE_GAS = 1e6;
const GAS_PER_SAMPLE = 3 * 500e3;
const UNISWAP_V3_CONFIG_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        quoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
        router: '0xe592427a0aece92de3edee1f18e0157c05861564',
    },
    [contract_addresses_1.ChainId.Ropsten]: {
        quoter: '0x2f9e608fd881861b8916257b76613cb22ee0652c',
        router: '0x03782388516e94fcd4c18666303601a12aa729ea',
    },
}, { quoter: NULL_ADDRESS, router: NULL_ADDRESS });
class UniswapV3Sampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _config) {
        super({
            chain,
            name: types_1.ERC20BridgeSource.UniswapV3,
            sellSamplerContractType: wrappers_1.UniswapV3SellSamplerContract,
            buySamplerContractType: wrappers_1.UniswapV3BuySamplerContract,
            sellContractSellFunctionName: 'sampleSells',
            buyContractBuyFunctionName: 'sampleBuys',
        });
        this._config = _config;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new UniswapV3Sampler(chain, UNISWAP_V3_CONFIG_BY_CHAIN_ID[chain.chainId]);
        });
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    args: [this._config.quoter, tokenAddressPath, takerFillAmounts],
                    getDexSamplesFromResult: ([uniswapPaths, samples]) => uniswapPaths.map((path, i) => ({
                        source: types_1.ERC20BridgeSource.UniswapV3,
                        fillData: {
                            router: this._config.router,
                            tokenAddressPath,
                            uniswapPath: path,
                        },
                        input: takerFillAmounts[i],
                        output: samples[i],
                    })),
                    gas: BASE_GAS + GAS_PER_SAMPLE * takerFillAmounts.length * (tokenAddressPath.length - 1),
                },
            ];
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    args: [this._config.quoter, tokenAddressPath, makerFillAmounts],
                    getDexSamplesFromResult: ([uniswapPaths, samples]) => uniswapPaths.map((path, i) => ({
                        source: types_1.ERC20BridgeSource.UniswapV3,
                        fillData: {
                            router: this._config.router,
                            tokenAddressPath,
                            uniswapPath: path,
                        },
                        input: makerFillAmounts[i],
                        output: samples[i],
                    })),
                    gas: BASE_GAS + GAS_PER_SAMPLE * makerFillAmounts.length * (tokenAddressPath.length - 1),
                },
            ];
        });
    }
}
exports.UniswapV3Sampler = UniswapV3Sampler;
//# sourceMappingURL=uniswap_v3.js.map