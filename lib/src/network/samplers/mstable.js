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
exports.MStableSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_1 = require("../utils");
const MSTABLE_POOLS_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        mUSD: {
            poolAddress: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
            tokens: [tokens_1.MAINNET_TOKENS.DAI, tokens_1.MAINNET_TOKENS.USDC, tokens_1.MAINNET_TOKENS.USDT],
        },
        mBTC: {
            poolAddress: '0x945facb997494cc2570096c74b5f66a3507330a1',
            tokens: [tokens_1.MAINNET_TOKENS.WBTC, tokens_1.MAINNET_TOKENS.RenBTC, tokens_1.MAINNET_TOKENS.sBTC],
        },
    },
    [contract_addresses_1.ChainId.Polygon]: {
        mUSD: {
            poolAddress: '0xe840b73e5287865eec17d250bfb1536704b43b21',
            tokens: [tokens_1.POLYGON_TOKENS.DAI, tokens_1.POLYGON_TOKENS.USDC, tokens_1.POLYGON_TOKENS.USDT],
        },
        mBTC: {
            poolAddress: constants_1.NULL_ADDRESS,
            tokens: [],
        },
    },
}, {
    mUSD: {
        poolAddress: constants_1.NULL_ADDRESS,
        tokens: [],
    },
    mBTC: {
        poolAddress: constants_1.NULL_ADDRESS,
        tokens: [],
    },
});
const GAS_PER_SAMPLE = 900e3;
class MStableSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _pools) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromMStable',
            buyContractBuyFunctionName: 'sampleBuysFromMStable',
        });
        this._pools = _pools;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new MStableSampler(chain, Object.values(MSTABLE_POOLS_BY_CHAIN_ID[chain.chainId]));
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
                    source: types_1.ERC20BridgeSource.MStable,
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
                    source: types_1.ERC20BridgeSource.MStable,
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
exports.MStableSampler = MStableSampler;
//# sourceMappingURL=mstable.js.map