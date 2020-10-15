"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const sdk_1 = require("@bancor/sdk");
const ethereum_1 = require("@bancor/sdk/dist/blockchains/ethereum");
const helpers_1 = require("@bancor/sdk/dist/helpers");
const types_1 = require("@bancor/sdk/dist/types");
/**
 * Converts an address to a Bancor Token type
 */
function token(address, blockchainType = types_1.BlockchainType.Ethereum) {
    return {
        blockchainType,
        blockchainId: address,
    };
}
exports.token = token;
class BancorService {
    constructor(sdk) {
        this.sdk = sdk;
        // Bancor recommends setting this value to 2% under the expected return amount
        this.minReturnAmountBufferPercentage = 0.99;
    }
    static createAsync(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const sdk = yield sdk_1.SDK.create({ ethereumNodeEndpoint: provider });
            const service = new BancorService(sdk);
            return service;
        });
    }
    getQuotesAsync(fromToken, toToken, amounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const sdk = this.sdk;
            const blockchain = sdk._core.blockchains[types_1.BlockchainType.Ethereum];
            const sourceDecimals = yield ethereum_1.getDecimals(blockchain, fromToken);
            const quotes = yield sdk.pricing.getPathAndRates(token(fromToken), token(toToken), amounts.map(amt => helpers_1.fromWei(amt.toString(), sourceDecimals)));
            const targetDecimals = yield ethereum_1.getDecimals(blockchain, toToken);
            const networkAddress = this.getBancorNetworkAddress();
            return quotes.map(quote => {
                const { path, rate } = quote;
                const output = helpers_1.toWei(rate, targetDecimals);
                return {
                    amount: new utils_1.BigNumber(output).multipliedBy(this.minReturnAmountBufferPercentage).dp(0),
                    fillData: {
                        path: path.map(p => p.blockchainId),
                        networkAddress,
                    },
                };
            });
        });
    }
    getBancorNetworkAddress() {
        const blockchain = this.sdk._core.blockchains[types_1.BlockchainType.Ethereum];
        return blockchain.bancorNetwork._address;
    }
}
exports.BancorService = BancorService;
//# sourceMappingURL=bancor_service.js.map