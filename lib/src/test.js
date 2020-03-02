"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
var dev_utils_1 = require("@0x/dev-utils");
var subproviders_1 = require("@0x/subproviders");
var utils_1 = require("@0x/utils");
var swap_quote_consumer_1 = require("./quote_consumers/swap_quote_consumer");
var swap_quoter_1 = require("./swap_quoter");
var constants_1 = require("./utils/market_operation_utils/constants");
var PLP_REGISTRY = '0x4ff033407b06952110ba2c324dc59d1fb98aeccf';
var MAKER_TOKEN = '0x17811972dcd13936028b0711a51f0747fcef49d5';
var TAKER_TOKEN = '0x9c902b77e521dc9fc7fdee2326237c9890235ae2';
function getWeb3Wrapper(rpcHost, privateKey) {
    var providerEngine = new subproviders_1.Web3ProviderEngine();
    providerEngine.addProvider(new subproviders_1.PrivateKeyWalletSubprovider(privateKey.replace('0x', '')));
    providerEngine.addProvider(new subproviders_1.RPCSubprovider(rpcHost));
    utils_1.providerUtils.startProviderEngine(providerEngine);
    return new dev_utils_1.Web3Wrapper(providerEngine);
}
function testSwapper(client) {
    return __awaiter(this, void 0, void 0, function () {
        var quoter, quote, filler, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    quoter = swap_quoter_1.SwapQuoter.getSwapQuoterForStandardRelayerAPIUrl(client.getProvider(), 'https://api.0x.org/sra/', {
                        liquidityProviderRegistryAddress: PLP_REGISTRY,
                        chainId: 42,
                    });
                    return [4 /*yield*/, quoter.getMarketSellSwapQuoteAsync(MAKER_TOKEN, TAKER_TOKEN, dev_utils_1.Web3Wrapper.toBaseUnitAmount(100, 18), {
                            excludedSources: constants_1.SELL_SOURCES,
                        })];
                case 1:
                    quote = _a.sent();
                    filler = new swap_quote_consumer_1.SwapQuoteConsumer(client.getProvider(), {
                        chainId: 42,
                    });
                    console.log(quote);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, filler.executeSwapQuoteOrThrowAsync(quote, {
                            takerAddress: '0xB0b92DF839eA7De65F4E4F41a27361A9d88A2565',
                        })];
                case 3:
                    result = _a.sent();
                    console.log(result);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client, addresses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getWeb3Wrapper('https://eth-kovan.alchemyapi.io/jsonrpc/U0-ACpzpewvr8EGAlxkkrcQIErx_k6K0', 'a398de00080917128a619898e312dddf3a71b9f4e18c25f499814a8e6dcb4178');
                    addresses = contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Kovan);
                    console.log("Sampler address: " + addresses.erc20BridgeSampler);
                    return [4 /*yield*/, testSwapper(client)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=test.js.map