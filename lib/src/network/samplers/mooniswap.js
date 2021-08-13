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
exports.MooniswapSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_1 = require("../utils");
const MOONISWAP_REGISTRIES_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [
        '0x71CD6666064C3A1354a3B4dca5fA1E2D3ee7D303',
        '0xc4a8b7e29e3c8ec560cd4945c1cf3461a85a148d',
        '0xbaf9a5d4b0052359326a6cdab54babaa3a3a9643',
    ],
    [contract_addresses_1.ChainId.BSC]: ['0xd41b24bba51fac0e4827b6f94c0d6ddeb183cd64'],
}, []);
const GAS_PER_SAMPLE = 200e3;
class MooniswapSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _registries, _weth) {
        super({
            chain,
            name: types_1.ERC20BridgeSource.Mooniswap,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromMooniswap',
            buyContractBuyFunctionName: 'sampleBuysFromMooniswap',
        });
        this._registries = _registries;
        this._weth = _weth;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new MooniswapSampler(chain, MOONISWAP_REGISTRIES_BY_CHAIN_ID[chain.chainId], tokens_1.WRAPPED_NETWORK_TOKEN_BY_CHAIN_ID[chain.chainId]);
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 2 && this._registries.length > 0;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return this._registries.map(registry => ({
                args: [registry, this._normalizeToken(takerToken), this._normalizeToken(makerToken), takerFillAmounts],
                getDexSamplesFromResult: ([poolAddress, samples]) => takerFillAmounts.map((a, i) => ({
                    source: types_1.ERC20BridgeSource.Mooniswap,
                    fillData: { poolAddress },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * takerFillAmounts.length,
            }));
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return this._registries.map(registry => ({
                args: [registry, this._normalizeToken(takerToken), this._normalizeToken(makerToken), makerFillAmounts],
                getDexSamplesFromResult: ([poolAddress, samples]) => makerFillAmounts.map((a, i) => ({
                    source: types_1.ERC20BridgeSource.Mooniswap,
                    fillData: { poolAddress },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * makerFillAmounts.length * 2,
            }));
        });
    }
    _normalizeToken(token) {
        // Uniswap V1 only deals in ETH, not WETH, and we treat null as ETH in
        // the sampler.
        if (token.toLowerCase() === this._weth.toLowerCase()) {
            return constants_1.NULL_ADDRESS;
        }
        return token;
    }
}
exports.MooniswapSampler = MooniswapSampler;
//# sourceMappingURL=mooniswap.js.map