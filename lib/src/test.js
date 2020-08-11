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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dev_utils_1 = require("@0x/dev-utils");
var orderbook_1 = require("@0x/orderbook");
var subproviders_1 = require("@0x/subproviders");
var _1 = require(".");
var swap_quoter_1 = require("./swap_quoter");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var engine, client, orderbook, provider, result, sos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = new subproviders_1.Web3ProviderEngine();
                    engine.addProvider(new subproviders_1.RPCSubprovider('https://eth-mainnet.alchemyapi.io/v2/7O6ycPM_4ORm4RQl-akZBqvM98SwzJ-m'));
                    engine.start();
                    client = new dev_utils_1.Web3Wrapper(engine);
                    orderbook = orderbook_1.Orderbook.getOrderbookForProvidedOrders([]);
                    provider = new swap_quoter_1.SwapQuoter(client.getProvider(), orderbook, {
                        chainId: 1,
                        rfqt: {
                            takerApiKeyWhitelist: ['a7cbec71-2062-4321-9091-b40ccbbb3532'],
                            makerAssetOfferings: {
                                'https://rfqt.volleyfire.org': [
                                    ['0x6b175474e89094c44da98b954eedeac495271d0f', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
                                ],
                            },
                        },
                    });
                    return [4 /*yield*/, provider.getMarketSellSwapQuoteAsync('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0x6b175474e89094c44da98b954eedeac495271d0f', dev_utils_1.Web3Wrapper.toBaseUnitAmount(3000, 18), {
                            rfqt: {
                                apiKey: 'a7cbec71-2062-4321-9091-b40ccbbb3532',
                                isIndicative: false,
                                takerAddress: '0xb89a17037c7c39fcd2befc647555f8e68824577d',
                                intentOnFilling: true,
                                nativeExclusivelyRFQT: true,
                            },
                            excludedSources: [
                                _1.ERC20BridgeSource.Uniswap,
                                _1.ERC20BridgeSource.UniswapV2,
                                _1.ERC20BridgeSource.Eth2Dai,
                                _1.ERC20BridgeSource.Kyber,
                                _1.ERC20BridgeSource.Curve,
                                _1.ERC20BridgeSource.LiquidityProvider,
                                _1.ERC20BridgeSource.MultiBridge,
                                _1.ERC20BridgeSource.Balancer,
                            ],
                        })];
                case 1:
                    result = _a.sent();
                    console.log("\uD83D\uDC47-----------------------");
                    console.log("Results count: " + result.orders.length + ". Takers: " + result.orders.map(function (o) { return o.takerAddress; }));
                    console.log("Results count: " + result.orders.length + ". Maker asset amounts: " + result.orders.map(function (o) {
                        return o.makerAssetAmount.toString();
                    }));
                    console.log("Results count: " + result.orders.length + ". Maker asset datas: " + result.orders.map(function (o) { return o.makerAssetData; }));
                    sos = result.orders.map(function (o) {
                        var fills = o.fills, rest = __rest(o, ["fills"]);
                        return rest;
                    });
                    console.log(JSON.stringify(sos, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (k) { return console.log("ERROR! - " + k); })
    .finally(function () { return process.exit(0); });
//# sourceMappingURL=test.js.map