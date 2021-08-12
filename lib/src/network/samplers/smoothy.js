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
exports.SmoothySampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const wrappers_1 = require("../../wrappers");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_2 = require("../utils");
const curve_1 = require("./curve");
const SMOOTHY_POOLS = {
    syUSD: '0xe5859f4efc09027a9b718781dcb2c6910cac6e91',
};
const SMOOTHY_MAINNET_INFOS = {
    [SMOOTHY_POOLS.syUSD]: {
        exchangeFunctionSelector: curve_1.CurveFunctionSelectors.swap_uint256,
        sellQuoteFunctionSelector: curve_1.CurveFunctionSelectors.get_swap_amount,
        buyQuoteFunctionSelector: curve_1.CurveFunctionSelectors.None,
        poolAddress: SMOOTHY_POOLS.syUSD,
        tokens: [
            tokens_1.MAINNET_TOKENS.USDT,
            tokens_1.MAINNET_TOKENS.USDC,
            tokens_1.MAINNET_TOKENS.DAI,
            tokens_1.MAINNET_TOKENS.TUSD,
            tokens_1.MAINNET_TOKENS.sUSD,
            tokens_1.MAINNET_TOKENS.BUSD,
            tokens_1.MAINNET_TOKENS.PAX,
            tokens_1.MAINNET_TOKENS.GUSD,
        ],
        metaTokens: undefined,
        gasSchedule: 190e3,
    },
};
const SMOOTHY_BSC_INFOS = {
    [SMOOTHY_POOLS.syUSD]: {
        exchangeFunctionSelector: curve_1.CurveFunctionSelectors.swap_uint256,
        sellQuoteFunctionSelector: curve_1.CurveFunctionSelectors.get_swap_amount,
        buyQuoteFunctionSelector: curve_1.CurveFunctionSelectors.None,
        poolAddress: SMOOTHY_POOLS.syUSD,
        tokens: [tokens_1.BSC_TOKENS.BUSD, tokens_1.BSC_TOKENS.USDT, tokens_1.BSC_TOKENS.USDC, tokens_1.BSC_TOKENS.DAI, tokens_1.BSC_TOKENS.PAX, tokens_1.BSC_TOKENS.UST],
        metaTokens: undefined,
        gasSchedule: 90e3,
    },
};
const SMOOTHYLIKE_INFOS_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: Object.assign({}, SMOOTHY_MAINNET_INFOS),
    [contract_addresses_1.ChainId.BSC]: Object.assign({}, SMOOTHY_BSC_INFOS),
}, {});
const GAS_PER_SAMPLE = 700e3;
class SmoothySampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, fork, _curveInfos) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromSmoothy',
            buyContractBuyFunctionName: 'sampleBuysFromSmoothy',
        });
        this.fork = fork;
        this._curveInfos = _curveInfos;
    }
    static createAsync(chain, fork = types_1.ERC20BridgeSource.Smoothy) {
        return __awaiter(this, void 0, void 0, function* () {
            const curveInfos = SMOOTHYLIKE_INFOS_BY_CHAIN_ID[chain.chainId];
            if (!curveInfos) {
                throw new Error(`No smoothy configs for chain ${chain.chainId}`);
            }
            return new SmoothySampler(chain, fork, Object.values(curveInfos));
        });
    }
    canConvertTokens(tokenAddressPath) {
        if (tokenAddressPath.length !== 2) {
            return false;
        }
        return this._curveInfos.some(c => curve_1.isCurveCompatible(c, tokenAddressPath));
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            const curves = this._findCompatibleCurves(tokenAddressPath);
            return curves.map(c => {
                const fromTokenIdx = c.tokens.indexOf(takerToken);
                const toTokenIdx = c.tokens.indexOf(makerToken);
                return {
                    args: [
                        {
                            poolAddress: c.poolAddress,
                            sellQuoteFunctionSelector: c.sellQuoteFunctionSelector,
                            buyQuoteFunctionSelector: c.buyQuoteFunctionSelector,
                        },
                        new utils_1.BigNumber(fromTokenIdx),
                        new utils_1.BigNumber(toTokenIdx),
                        takerFillAmounts,
                    ],
                    getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                        source: this.fork,
                        fillData: { fromTokenIdx, toTokenIdx, pool: c },
                        input: a,
                        output: samples[i],
                    })),
                    gas: GAS_PER_SAMPLE * takerFillAmounts.length,
                };
            });
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            const curves = this._findCompatibleCurves(tokenAddressPath);
            return curves.map(c => {
                const fromTokenIdx = c.tokens.indexOf(takerToken);
                const toTokenIdx = c.tokens.indexOf(makerToken);
                return {
                    args: [
                        {
                            poolAddress: c.poolAddress,
                            sellQuoteFunctionSelector: c.sellQuoteFunctionSelector,
                            buyQuoteFunctionSelector: c.buyQuoteFunctionSelector,
                        },
                        new utils_1.BigNumber(fromTokenIdx),
                        new utils_1.BigNumber(toTokenIdx),
                        makerFillAmounts,
                    ],
                    getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                        source: this.fork,
                        fillData: { fromTokenIdx, toTokenIdx, pool: c },
                        input: a,
                        output: samples[i],
                    })),
                    gas: GAS_PER_SAMPLE * makerFillAmounts.length * 2,
                };
            });
        });
    }
    _findCompatibleCurves(tokenAddressPath) {
        return this._curveInfos.filter(c => curve_1.isCurveCompatible(c, tokenAddressPath));
    }
}
exports.SmoothySampler = SmoothySampler;
//# sourceMappingURL=smoothy.js.map