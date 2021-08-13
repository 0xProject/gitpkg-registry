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
exports.ShellSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_1 = require("../utils");
const SHELL_POOLS_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        StableCoins: {
            poolAddress: '0x8f26d7bab7a73309141a291525c965ecdea7bf42',
            tokens: [tokens_1.MAINNET_TOKENS.USDC, tokens_1.MAINNET_TOKENS.USDT, tokens_1.MAINNET_TOKENS.sUSD, tokens_1.MAINNET_TOKENS.DAI],
        },
        Bitcoin: {
            poolAddress: '0xc2d019b901f8d4fdb2b9a65b5d226ad88c66ee8d',
            tokens: [tokens_1.MAINNET_TOKENS.RenBTC, tokens_1.MAINNET_TOKENS.WBTC, tokens_1.MAINNET_TOKENS.sBTC],
        },
    },
}, {
    StableCoins: {
        poolAddress: constants_1.NULL_ADDRESS,
        tokens: [],
    },
    Bitcoin: {
        poolAddress: constants_1.NULL_ADDRESS,
        tokens: [],
    },
});
const COMPONENT_POOLS_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        USDP_USDC_USDT: {
            poolAddress: '0x49519631b404e06ca79c9c7b0dc91648d86f08db',
            tokens: [tokens_1.MAINNET_TOKENS.USDP, tokens_1.MAINNET_TOKENS.USDC, tokens_1.MAINNET_TOKENS.USDT],
        },
        USDP_DAI_SUSD: {
            poolAddress: '0x6477960dd932d29518d7e8087d5ea3d11e606068',
            tokens: [tokens_1.MAINNET_TOKENS.USDP, tokens_1.MAINNET_TOKENS.DAI, tokens_1.MAINNET_TOKENS.sUSD],
        },
    },
}, {
    USDP_USDC_USDT: {
        poolAddress: constants_1.NULL_ADDRESS,
        tokens: [],
    },
    USDP_DAI_SUSD: {
        poolAddress: constants_1.NULL_ADDRESS,
        tokens: [],
    },
});
const GAS_PER_SAMPLE = 400e3;
class ShellSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, fork, _pools) {
        super({
            chain,
            name: fork,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromShell',
            buyContractBuyFunctionName: 'sampleBuysFromShell',
        });
        this.fork = fork;
        this._pools = _pools;
    }
    static createAsync(chain, fork) {
        return __awaiter(this, void 0, void 0, function* () {
            let pools;
            switch (fork) {
                case types_1.ERC20BridgeSource.Shell:
                    pools = Object.values(SHELL_POOLS_BY_CHAIN_ID[chain.chainId]);
                    break;
                case types_1.ERC20BridgeSource.Component:
                    pools = Object.values(COMPONENT_POOLS_BY_CHAIN_ID[chain.chainId]);
                    break;
                default:
                    throw new Error(`Invalid Shell fork: ${fork}`);
            }
            return new ShellSampler(chain, fork, pools);
        });
    }
    canConvertTokens(tokenAddressPath, pools) {
        if (tokenAddressPath.length !== 2) {
            return false;
        }
        const _pools = pools || this._getPoolsForTokens(tokenAddressPath);
        if (_pools.length === 0) {
            return false;
        }
        return true;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const pools = this._getPoolsForTokens(tokenAddressPath);
            const [takerToken, makerToken] = tokenAddressPath;
            return pools.map(poolAddress => ({
                args: [poolAddress, takerToken, makerToken, takerFillAmounts],
                getDexSamplesFromResult: samples => takerFillAmounts.map((a, i) => ({
                    source: this.fork,
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
            const pools = this._getPoolsForTokens(tokenAddressPath);
            const [takerToken, makerToken] = tokenAddressPath;
            return pools.map(poolAddress => ({
                args: [poolAddress, takerToken, makerToken, makerFillAmounts],
                getDexSamplesFromResult: samples => makerFillAmounts.map((a, i) => ({
                    source: this.fork,
                    fillData: { poolAddress },
                    input: a,
                    output: samples[i],
                })),
                gas: GAS_PER_SAMPLE * makerFillAmounts.length * 2,
            }));
        });
    }
    _getPoolsForTokens(tokens) {
        return this._pools.filter(p => tokens.every(t => p.tokens.includes(t))).map(p => p.poolAddress);
    }
}
exports.ShellSampler = ShellSampler;
//# sourceMappingURL=shell.js.map