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
exports.UniswapV2Sampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const source_sampler_1 = require("../source_sampler");
const types_1 = require("../types");
const UNISWAP_V2_ROUTER_BY_CHAIN_ID_BY_FORK = {
    [contract_addresses_1.ChainId.Mainnet]: {
        [types_1.ERC20BridgeSource.UniswapV2]: '0xf164fc0ec4e93095b804a4795bbe1e041497b92a',
        [types_1.ERC20BridgeSource.SushiSwap]: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
        [types_1.ERC20BridgeSource.CryptoCom]: '0xceb90e4c17d626be0facd78b79c9c87d7ca181b3',
        [types_1.ERC20BridgeSource.Linkswap]: '0xa7ece0911fe8c60bff9e99f8fafcdbe56e07aff1',
        [types_1.ERC20BridgeSource.ShibaSwap]: '0x03f7724180aa6b939894b5ca4314783b0b36b329',
    },
    [contract_addresses_1.ChainId.Ropsten]: {
        [types_1.ERC20BridgeSource.UniswapV2]: '0xf164fc0ec4e93095b804a4795bbe1e041497b92a',
        [types_1.ERC20BridgeSource.SushiSwap]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
    },
    [contract_addresses_1.ChainId.BSC]: {
        [types_1.ERC20BridgeSource.SushiSwap]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
        [types_1.ERC20BridgeSource.PancakeSwap]: '0x05ff2b0db69458a0750badebc4f9e13add608c7f',
        [types_1.ERC20BridgeSource.PancakeSwapV2]: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
        [types_1.ERC20BridgeSource.BakerySwap]: '0xcde540d7eafe93ac5fe6233bee57e1270d3e330f',
        [types_1.ERC20BridgeSource.ApeSwap]: '0xc0788a3ad43d79aa53b09c2eacc313a787d1d607',
        [types_1.ERC20BridgeSource.CafeSwap]: '0x933daea3a5995fb94b14a7696a5f3ffd7b1e385a',
        [types_1.ERC20BridgeSource.CheeseSwap]: '0x3047799262d8d2ef41ed2a222205968bc9b0d895',
        [types_1.ERC20BridgeSource.JulSwap]: '0xbd67d157502a23309db761c41965600c2ec788b2',
        [types_1.ERC20BridgeSource.WaultSwap]: '0xd48745e39bbed146eec15b79cbf964884f9877c2',
    },
    [contract_addresses_1.ChainId.Polygon]: {
        [types_1.ERC20BridgeSource.Dfyn]: '0xa102072a4c07f06ec3b4900fdc4c7b80b6c57429',
        [types_1.ERC20BridgeSource.ComethSwap]: '0x93bcdc45f7e62f89a8e901dc4a0e2c6c427d9f25',
        [types_1.ERC20BridgeSource.QuickSwap]: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff',
        [types_1.ERC20BridgeSource.ApeSwap]: '0xc0788a3ad43d79aa53b09c2eacc313a787d1d607',
        [types_1.ERC20BridgeSource.WaultSwap]: '0x3a1d87f206d12415f5b0a33e786967680aab4f6d',
        [types_1.ERC20BridgeSource.Polydex]: '0xe5c67ba380fb2f70a47b489e94bced486bb8fb74',
    },
};
class UniswapV2Sampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, fork) {
        var _a;
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromUniswapV2',
            buyContractBuyFunctionName: 'sampleBuysFromUniswapV2',
        });
        this.fork = fork;
        this._router = (_a = UNISWAP_V2_ROUTER_BY_CHAIN_ID_BY_FORK[chain.chainId]) === null || _a === void 0 ? void 0 : _a[fork];
    }
    static createAsync(chain, fork) {
        return __awaiter(this, void 0, void 0, function* () {
            return new UniswapV2Sampler(chain, fork);
        });
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    args: [this._router, tokenAddressPath, takerFillAmounts],
                    getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                        source: this.fork,
                        fillData: {
                            router: this._router,
                            tokenAddressPath,
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
            return [
                {
                    args: [this._router, tokenAddressPath, makerFillAmounts],
                    getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                        source: this.fork,
                        fillData: {
                            router: this._router,
                            tokenAddressPath,
                        },
                        input: a,
                        output: samples[i],
                    })),
                },
            ];
        });
    }
}
exports.UniswapV2Sampler = UniswapV2Sampler;
//# sourceMappingURL=uniswap_v2.js.map