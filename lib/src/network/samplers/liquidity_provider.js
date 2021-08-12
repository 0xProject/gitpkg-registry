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
exports.LiquidityProviderSampler = exports.mergeLiquidityProviderRegistries = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_1 = require("../utils");
const DEFAULT_LIQUIDITY_PROVIDER_REGISTRY_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        // OBQ
        ['0x1d0d407c5af8c86f0a6494de86e56ae21e46a951']: {
            tokens: [
                tokens_1.MAINNET_TOKENS.WETH,
                tokens_1.MAINNET_TOKENS.USDC,
                tokens_1.MAINNET_TOKENS.USDT,
                tokens_1.MAINNET_TOKENS.WBTC,
                tokens_1.MAINNET_TOKENS.PAX,
                tokens_1.MAINNET_TOKENS.LINK,
                tokens_1.MAINNET_TOKENS.KNC,
                tokens_1.MAINNET_TOKENS.MANA,
                tokens_1.MAINNET_TOKENS.DAI,
                tokens_1.MAINNET_TOKENS.BUSD,
                tokens_1.MAINNET_TOKENS.AAVE,
                tokens_1.MAINNET_TOKENS.HT,
            ],
            gasCost: (takerToken, makerToken) => [takerToken, makerToken].includes(tokens_1.MAINNET_TOKENS.WETH) ? 160e3 : 280e3,
        },
    },
}, {});
function mergeLiquidityProviderRegistries(
// tslint:disable-next-line: trailing-comma
...registries) {
    return Object.assign({}, Object.values(contract_addresses_1.ChainId).map(c => ({
        [c]: Object.assign({}, registries.map(r => r[c])),
    })));
}
exports.mergeLiquidityProviderRegistries = mergeLiquidityProviderRegistries;
const GAS_PER_SAMPLE = 450e3;
class LiquidityProviderSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _registry) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromLiquidityProvider',
            buyContractBuyFunctionName: 'sampleBuysFromLiquidityProvider',
        });
        this._registry = _registry;
    }
    static createAsync(chain, registry) {
        return __awaiter(this, void 0, void 0, function* () {
            return new LiquidityProviderSampler(chain, Object.assign(Object.assign({}, DEFAULT_LIQUIDITY_PROVIDER_REGISTRY_BY_CHAIN_ID[chain.chainId]), registry));
        });
    }
    canConvertTokens(tokenAddressPath) {
        if (tokenAddressPath.length !== 2) {
            return false;
        }
        return this._findCompatibleProviders(tokenAddressPath).length !== 0;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const providers = this._findCompatibleProviders(tokenAddressPath);
            const [takerToken, makerToken] = tokenAddressPath;
            return providers.map(p => ({
                args: [p, takerToken, makerToken, takerFillAmounts],
                getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                    source: types_1.ERC20BridgeSource.LiquidityProvider,
                    fillData: {
                        poolAddress: p,
                        gasCost: getProviderGasCost(this._registry[p], takerToken, makerToken),
                    },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * takerFillAmounts.length,
            }));
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const providers = this._findCompatibleProviders(tokenAddressPath);
            const [takerToken, makerToken] = tokenAddressPath;
            return providers.map(p => ({
                args: [p, takerToken, makerToken, makerFillAmounts],
                getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                    source: types_1.ERC20BridgeSource.LiquidityProvider,
                    fillData: {
                        poolAddress: p,
                        gasCost: getProviderGasCost(this._registry[p], takerToken, makerToken),
                    },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * makerFillAmounts.length * 2,
            }));
        });
    }
    _findCompatibleProviders(tokens) {
        return Object.entries(this._registry)
            .filter(([, v]) => tokens.every(t => v.tokens.includes(t)))
            .map(([k]) => k);
    }
}
exports.LiquidityProviderSampler = LiquidityProviderSampler;
function getProviderGasCost(providerInfo, takerToken, makerToken) {
    return typeof providerInfo.gasCost === 'number'
        ? providerInfo.gasCost
        : providerInfo.gasCost(takerToken, makerToken);
}
//# sourceMappingURL=liquidity_provider.js.map