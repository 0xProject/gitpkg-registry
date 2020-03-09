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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var contract_addresses_1 = require("@0x/contract-addresses");
var dev_utils_1 = require("@0x/dev-utils");
var subproviders_1 = require("@0x/subproviders");
var utils_1 = require("@0x/utils");
var contracts_extensions_1 = require("@0x/contracts-extensions");
// const PLP_REGISTRY = '0x4a9f5b10de7b174ce1ce4db30ebfa25ce883ba8c'; // Empty registry
var PLP_REGISTRY = '0x189479d4012c88bcc8e7adaa4fbce0e799459f8e'; // NEW PLP
// const PLP_REGISTRY = '0x4ff033407b06952110ba2c324dc59d1fb98aeccf'; // OLD PLP
var MAKER_TOKEN = '0x9c902b77e521dc9fc7fdee2326237c9890235ae2'; // (XAsset)
var TAKER_TOKEN = '0x17811972dcd13936028b0711a51f0747fcef49d5'; // (YAsset)
var ZWETH_ADDRESS = '0x1FcAf05ABa8c7062D6F08E25c77Bf3746fCe5433';
var ZUSDC_ADDRESS = '0x5a719Cf3E02c17c876F6d294aDb5CB7C6eB47e2F';
function getWeb3Wrapper(rpcHost, privateKey) {
    var providerEngine = new subproviders_1.Web3ProviderEngine();
    providerEngine.addProvider(new subproviders_1.PrivateKeyWalletSubprovider(privateKey.replace('0x', '')));
    providerEngine.addProvider(new subproviders_1.RPCSubprovider(rpcHost));
    utils_1.providerUtils.startProviderEngine(providerEngine);
    return [providerEngine, new dev_utils_1.Web3Wrapper(providerEngine)];
}
function testWrapper(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
// async function testSwapper(client: Web3Wrapper) {
//     const addrs = getContractAddressesForChainOrThrow(ChainId.Kovan);
//     console.log(`BridgeSampler address: ${addrs.erc20BridgeSampler}`);
//     const quoter = SwapQuoter.getSwapQuoterForStandardRelayerAPIUrl(
//         client.getProvider(),
//         'https://kovan.api.0x.org/sra/',
//         {
//             liquidityProviderRegistryAddress: PLP_REGISTRY,
//             chainId: 42,
//         },
//     );
//     const quote = await quoter.getMarketSellSwapQuoteAsync(
//         TAKER_TOKEN,
//         MAKER_TOKEN,
//         // ZWETH_ADDRESS,
//         // ZUSDC_ADDRESS,
//         Web3Wrapper.toBaseUnitAmount(100, 18),
//         {
//             // excludedSources: SELL_SOURCES.concat([ERC20BridgeSource.LiquidityProvider]),
//             excludedSources: SELL_SOURCES,
//         },
//     );
//     const filler = new SwapQuoteConsumer(client.getProvider(), {
//         chainId: 42,
//     });
//     console.log(quote);
//     try {
//         const result = await filler.executeSwapQuoteOrThrowAsync(quote, {
//             takerAddress: '0xB0b92DF839eA7De65F4E4F41a27361A9d88A2565',
//         });
//         console.log(result);
//     } catch (e) {
//         console.log(e);
//     }
// }
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, engine, client, addresses, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = __read(getWeb3Wrapper('https://eth-kovan.alchemyapi.io/jsonrpc/U0-ACpzpewvr8EGAlxkkrcQIErx_k6K0', 'a398de00080917128a619898e312dddf3a71b9f4e18c25f499814a8e6dcb4178'), 2), engine = _a[0], client = _a[1];
                    addresses = contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Kovan);
                    console.log("Sampler address: " + addresses.erc20BridgeSampler);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, testWrapper(client)];
                case 2:
                    _b.sent();
                    // engine.stop();
                    process.exit(0);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.log;
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
contracts_extensions_1.encodeMaxGasPriceStaticCallData;
main();
//# sourceMappingURL=test.js.map