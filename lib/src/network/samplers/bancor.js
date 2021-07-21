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
exports.BancorSampler = exports.BancorService = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const sdk_1 = require("@bancor/sdk");
const types_1 = require("@bancor/sdk/dist/types");
const wrappers_1 = require("../../wrappers");
const constants_1 = require("../constants");
const source_sampler_1 = require("../source_sampler");
const tokens_1 = require("../tokens");
const types_2 = require("../types");
const utils_1 = require("../utils");
const findToken = (tokenAddress, graph) => 
// If we're looking for WETH it is stored by Bancor as the 0xeee address
tokenAddress.toLowerCase() === tokens_1.MAINNET_TOKENS.WETH.toLowerCase()
    ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    : Object.keys(graph).filter(k => k.toLowerCase() === tokenAddress.toLowerCase())[0];
class BancorService {
    constructor(sdk) {
        this.sdk = sdk;
    }
    static createAsync(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const sdk = yield sdk_1.SDK.create({ ethereumNodeEndpoint: provider });
            const service = new BancorService(sdk);
            return service;
        });
    }
    getPaths(_fromToken, _toToken) {
        // HACK: We reach into the blockchain object and pull in it's cache of tokens
        // and we use it's internal non-async getPathsFunc
        try {
            const blockchain = this.sdk._core.blockchains[types_1.BlockchainType.Ethereum];
            const fromToken = findToken(_fromToken, blockchain.graph);
            const toToken = findToken(_toToken, blockchain.graph);
            return blockchain.getPathsFunc.bind(blockchain)(fromToken, toToken);
        }
        catch (e) {
            return [];
        }
    }
}
exports.BancorService = BancorService;
const GAS_PER_SAMPLE = 500e3;
const BANCOR_REGISTRY_BY_CHAIN_ID = utils_1.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4',
}, constants_1.NULL_ADDRESS);
class BancorSampler extends source_sampler_1.OnChainSourceSampler {
    constructor(chain, _registry, _bancorService) {
        super({
            chain,
            sellSamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            buySamplerContractType: wrappers_1.ERC20BridgeSamplerContract,
            sellContractSellFunctionName: 'sampleSellsFromBancor',
            buyContractBuyFunctionName: 'sampleBuysFromBancor',
        });
        this._registry = _registry;
        this._bancorService = _bancorService;
    }
    static createAsync(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return new BancorSampler(chain, BANCOR_REGISTRY_BY_CHAIN_ID[chain.chainId], yield BancorService.createAsync(chain.provider));
        });
    }
    canConvertTokens(tokenAddressPath) {
        return tokenAddressPath.length === 2;
    }
    _getSellQuoteCallsAsync(tokenAddressPath, takerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const [takerToken, makerToken] = tokenAddressPath;
            const paths = this._bancorService ? this._bancorService.getPaths(takerToken, makerToken) : [];
            return [
                {
                    args: [{ registry: this._registry, paths }, takerToken, makerToken, takerFillAmounts],
                    getDexSamplesFromResult: ([networkAddress, path, samples]) => takerFillAmounts.map((a, i) => ({
                        source: types_2.ERC20BridgeSource.Bancor,
                        fillData: {
                            networkAddress,
                            path,
                        },
                        input: a,
                        output: samples[i],
                    })),
                    gas: takerFillAmounts.length * GAS_PER_SAMPLE,
                },
            ];
        });
    }
    _getBuyQuoteCallsAsync(_tokenAddressPath, _makerFillAmounts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not implemented for Bancor.
            return [];
        });
    }
}
exports.BancorSampler = BancorSampler;
//# sourceMappingURL=bancor.js.map