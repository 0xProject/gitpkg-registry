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
exports.UniswapV1Sampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_1 = require("../utils");
const UNISWAPV1_ROUTER_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95',
    [contract_addresses_1.ChainId.Ropsten]: '0x9c83dce8ca20e9aaf9d3efc003b2ea62abc08351',
}, constants_1.NULL_ADDRESS);
const BAD_TOKENS = [
    '0xb8c77482e45f1f44de1745f52c74426c631bdd52', // BNB
];
const GAS_PER_SAMPLE = 250e3;
class UniswapV1Sampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _router, _weth) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromUniswap',
            buyContractBuyFunctionName: 'sampleBuysFromUniswap',
        });
        this._router = _router;
        this._weth = _weth;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new UniswapV1Sampler(chain, UNISWAPV1_ROUTER_BY_CHAIN_ID[chain.chainId], tokens_1.WRAPPED_NETWORK_TOKEN_BY_CHAIN_ID[chain.chainId]);
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 2 && tokenAddressPath.every(t => !BAD_TOKENS.includes(t));
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return [
                {
                    args: [
                        this._router,
                        this._normalizeToken(takerToken),
                        this._normalizeToken(makerToken),
                        takerFillAmounts,
                    ],
                    getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Uniswap,
                        fillData: { router: this._router },
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
                    args: [
                        this._router,
                        this._normalizeToken(takerToken),
                        this._normalizeToken(makerToken),
                        makerFillAmounts,
                    ],
                    getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Uniswap,
                        fillData: { router: this._router },
                        input: a,
                        output: samples[i],
                    })),
                    gas: GAS_PER_SAMPLE * makerFillAmounts.length,
                },
            ];
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
exports.UniswapV1Sampler = UniswapV1Sampler;
//# sourceMappingURL=uniswap_v1.js.map