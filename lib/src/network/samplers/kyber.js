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
exports.KyberSampler = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_1 = require("../types");
const utils_2 = require("../utils");
const GAS_PER_SAMPLE = 6500e3;
/**
 * Kyber reserve prefixes
 * 0xff Fed price reserve
 * 0xaa Automated price reserve
 * 0xbb Bridged price reserve (i.e Uniswap/Curve)
 */
const KYBER_BRIDGED_LIQUIDITY_PREFIX = '0xbb';
const KYBER_BANNED_RESERVES = ['0xff4f6e65426974205175616e7400000000000000000000000000000000000000'];
const MAX_KYBER_RESERVES_QUERIED = 5;
const KYBER_RESERVE_OFFSETS = Array(MAX_KYBER_RESERVES_QUERIED)
    .fill(0)
    .map((_v, i) => new utils_1.BigNumber(i));
const KYBER_OPTS_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: {
        networkProxy: '0x9aab3f75489902f3a48495025729a0af77d4b11e',
        hintHandler: '0xa1c0fa73c39cfbcc11ec9eb1afc665aba9996e2c',
        weth: tokens_1.MAINNET_TOKENS.WETH,
    },
    [contract_addresses_1.ChainId.Ropsten]: {
        networkProxy: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
        hintHandler: '0x63f773c026093eef988e803bdd5772dd235a8e71',
        weth: tokens_1.ROPSTEN_TOKENS.WETH,
    },
}, {
    networkProxy: constants_1.NULL_ADDRESS,
    hintHandler: constants_1.NULL_ADDRESS,
    weth: constants_1.NULL_ADDRESS,
});
class KyberSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _opts) {
        super({
            chain,
            name: types_1.ERC20BridgeSource.Kyber,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromKyberNetwork',
            buyContractBuyFunctionName: 'sampleBuysFromKyberNetwork',
        });
        this._opts = _opts;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new KyberSampler(chain, KYBER_OPTS_BY_CHAIN_ID[chain.chainId]);
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 2;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return KYBER_RESERVE_OFFSETS.map(reserveOffset => ({
                args: [
                    Object.assign(Object.assign({}, this._opts), { reserveOffset, hint: constants_1.NULL_BYTES }),
                    takerToken,
                    makerToken,
                    takerFillAmounts,
                ],
                getDexSamplesFromResult: ([reserveId, hint, samples]) => isAllowedKyberReserveId(reserveId)
                    ? takerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Kyber,
                        fillData: {
                            hint,
                            reserveId,
                            networkProxy: this._opts.networkProxy,
                        },
                        input: a,
                        output: samples[i],
                    }))
                    : [],
                gas: takerFillAmounts.length * GAS_PER_SAMPLE,
            }));
        });
    }
    _getBuyQuoteCallsAsync(tokenAddressPath, makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            return KYBER_RESERVE_OFFSETS.map(reserveOffset => ({
                args: [
                    Object.assign(Object.assign({}, this._opts), { reserveOffset, hint: constants_1.NULL_BYTES }),
                    takerToken,
                    makerToken,
                    makerFillAmounts,
                ],
                getDexSamplesFromResult: ([reserveId, hint, samples]) => isAllowedKyberReserveId(reserveId)
                    ? makerFillAmounts.map((a, i) => ({
                        source: types_1.ERC20BridgeSource.Kyber,
                        fillData: {
                            hint,
                            reserveId,
                            networkProxy: this._opts.networkProxy,
                        },
                        input: a,
                        output: samples[i],
                    }))
                    : [],
                gas: makerFillAmounts.length * GAS_PER_SAMPLE * 2,
            }));
        });
    }
}
exports.KyberSampler = KyberSampler;
function isAllowedKyberReserveId(reserveId) {
    return (reserveId !== constants_1.NULL_BYTES &&
        !reserveId.startsWith(KYBER_BRIDGED_LIQUIDITY_PREFIX) &&
        !KYBER_BANNED_RESERVES.includes(reserveId));
}
//# sourceMappingURL=kyber.js.map