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
    constructor(provider) {
        this.provider = provider;
        // Bancor recommends setting this value to 2% under the expected return amount
        this.minReturnAmountBufferPercentage = 0.99;
    }
    getSDKAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._sdk) {
                this._sdk = yield sdk_1.SDK.create({ ethereumNodeEndpoint: this.provider });
            }
            return this._sdk;
        });
    }
    getQuoteAsync(fromToken, toToken, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const sdk = yield this.getSDKAsync();
            const blockchain = sdk._core.blockchains[types_1.BlockchainType.Ethereum];
            const sourceDecimals = yield ethereum_1.getDecimals(blockchain, fromToken);
            const { path, rate } = yield sdk.pricing.getPathAndRate(token(fromToken), token(toToken), helpers_1.fromWei(amount.toString(), sourceDecimals));
            const targetDecimals = yield ethereum_1.getDecimals(blockchain, toToken);
            const output = helpers_1.toWei(rate, targetDecimals);
            return {
                amount: new utils_1.BigNumber(output).multipliedBy(this.minReturnAmountBufferPercentage).dp(0),
                fillData: {
                    path: path.map(p => p.blockchainId),
                    networkAddress: yield this.getBancorNetworkAddressAsync(),
                },
            };
        });
    }
    getBancorNetworkAddressAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const sdk = yield this.getSDKAsync();
            const blockchain = sdk._core.blockchains[types_1.BlockchainType.Ethereum];
            return blockchain.bancorNetwork._address;
        });
    }
}
exports.BancorService = BancorService;
//# sourceMappingURL=bancor_service_LOCAL_60899.js.map