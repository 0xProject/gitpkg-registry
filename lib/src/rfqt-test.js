"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var contract_addresses_1 = require("@0x/contract-addresses");
var dev_utils_1 = require("@0x/dev-utils");
var subproviders_1 = require("@0x/subproviders");
var utils_1 = require("@0x/utils");
var axios_1 = require("axios");
var _1 = require(".");
var swap_quoter_1 = require("./swap_quoter");
// const PLP_REGISTRY = '0x4a9f5b10de7b174ce1ce4db30ebfa25ce883ba8c'; // Empty registry
var PLP_REGISTRY = '0x189479d4012c88bcc8e7adaa4fbce0e799459f8e'; // NEW PLP
// const PLP_REGISTRY = '0x4ff033407b06952110ba2c324dc59d1fb98aeccf'; // OLD PLP
var MAKER_TOKEN = '0x9c902b77e521dc9fc7fdee2326237c9890235ae2'; // (XAsset)
var TAKER_TOKEN = '0x17811972dcd13936028b0711a51f0747fcef49d5'; // (YAsset)
var ZWETH_ADDRESS = '0x1FcAf05ABa8c7062D6F08E25c77Bf3746fCe5433';
var ZUSDC_ADDRESS = '0x5a719Cf3E02c17c876F6d294aDb5CB7C6eB47e2F';
function getWeb3Wrapper(rpcHost, privateKey) {
    var providerEngine = new subproviders_1.Web3ProviderEngine();
    // providerEngine.addProvider(new PrivateKeyWalletSubprovider(privateKey.replace('0x', '')));
    providerEngine.addProvider(new subproviders_1.RPCSubprovider(rpcHost));
    utils_1.providerUtils.startProviderEngine(providerEngine);
    return [providerEngine, new dev_utils_1.Web3Wrapper(providerEngine)];
}
var WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
var USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
var ADDRESS = '0xA836ecab8E22C8438E24286c0FCdB45f675B39AD';
var RFQT_SERVER_ADDRESS = '0xE89Bc18ceE87c9AF8b472635A152704B96DAfB8f'.toLowerCase();
var gasSchedule = (_a = {},
    _a[_1.ERC20BridgeSource.Native] = 1.5e5,
    _a[_1.ERC20BridgeSource.Uniswap] = 3e5,
    _a[_1.ERC20BridgeSource.LiquidityProvider] = 3e5,
    _a[_1.ERC20BridgeSource.Eth2Dai] = 5.5e5,
    _a[_1.ERC20BridgeSource.Kyber] = 8e5,
    _a[_1.ERC20BridgeSource.CurveUsdcDai] = 9e5,
    _a[_1.ERC20BridgeSource.CurveUsdcDaiUsdt] = 9e5,
    _a[_1.ERC20BridgeSource.CurveUsdcDaiUsdtTusd] = 10e5,
    _a[_1.ERC20BridgeSource.CurveUsdcDaiUsdtBusd] = 10e5,
    _a[_1.ERC20BridgeSource.CurveUsdcDaiUsdtSusd] = 10e5,
    _a);
var feeSchedule = Object.assign.apply(Object, __spread([{}], Object.keys(gasSchedule).map(function (k) {
    var _a;
    return (_a = {},
        _a[k] = new utils_1.BigNumber(gasSchedule[k] + 1.5e5),
        _a);
})));
exports.DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE = 0.03; // 3% Slippage
exports.DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE = 0.015; // 1.5% Slippage in a fallback route
exports.ASSET_SWAPPER_MARKET_ORDERS_OPTS = {
// excludedSources: [],
// bridgeSlippage: DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE,
// maxFallbackSlippage: DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE,
// numSamples: 13,
// sampleDistributionBase: 1.05,
// feeSchedule,
// gasSchedule,
};
function calllAssetSwapper(quoter, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var quote, isIncluded, wethAmount, usdcAmount, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, quoter.getMarketSellSwapQuoteAsync(WETH, USDC, dev_utils_1.Web3Wrapper.toBaseUnitAmount(amount, 6), __assign({}, exports.ASSET_SWAPPER_MARKET_ORDERS_OPTS, { rfqt: {
                            apiKey: 'q8kpzvR7zrd3zy',
                            intentOnFilling: true,
                            takerAddress: ADDRESS,
                        } }))];
                case 1:
                    quote = _a.sent();
                    isIncluded = quote.orders.find(function (order) { return order.makerAddress.toLowerCase() === RFQT_SERVER_ADDRESS; });
                    wethAmount = dev_utils_1.Web3Wrapper.toUnitAmount(quote.bestCaseQuoteInfo.makerAssetAmount, 18);
                    usdcAmount = dev_utils_1.Web3Wrapper.toUnitAmount(quote.bestCaseQuoteInfo.takerAssetAmount, 6);
                    price = wethAmount.div(usdcAmount).dp(6);
                    // console.log(quote.orders)
                    return [2 /*return*/, [isIncluded !== undefined, price, quote.orders.length, quote.orders.map(function (o) { return o.makerAddress; })]];
            }
        });
    });
}
function callZrxApi(amount) {
    return __awaiter(this, void 0, void 0, function () {
        var amountBaseUnit, response, price, isIncluded, numOrders, makerAddresses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amountBaseUnit = dev_utils_1.Web3Wrapper.toBaseUnitAmount(amount, 6);
                    return [4 /*yield*/, axios_1.default.get("https://api.0x.org/swap/v0/quote?buyToken=WETH&sellToken=USDC&sellAmount=" + amountBaseUnit + "&takerAddress=" + ADDRESS + "&intentOnFilling=true&skipValidation=true", {
                            headers: { '0x-api-key': 'q8kpzvR7zrd3zy' },
                        })];
                case 1:
                    response = _a.sent();
                    price = new utils_1.BigNumber(response.data.price);
                    isIncluded = response.data.orders.find(function (order) { return order.makerAddress.toLowerCase() === RFQT_SERVER_ADDRESS; });
                    numOrders = response.data.orders.length;
                    makerAddresses = response.data.orders.map(function (o) { return o.makerAddress; });
                    return [2 /*return*/, [isIncluded !== undefined, price, numOrders, makerAddresses]];
            }
        });
    });
}
var tests = {};
var prices = {};
function testSwapper(client) {
    return __awaiter(this, void 0, void 0, function () {
        var quoter, i, amount, _a, isIncluded, price, numOrders, makerAddresses;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    quoter = swap_quoter_1.SwapQuoter.getSwapQuoterForStandardRelayerAPIUrl(client.getProvider(), 'https://staging.api.0x.org/sra/', {
                        chainId: 1,
                        rfqt: {
                            makerEndpoints: ['http://18.234.202.118:4000'],
                            takerApiKeyWhitelist: ['q8kpzvR7zrd3zy'],
                        },
                    });
                    i = 1;
                    _b.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 4];
                    amount = i * 10;
                    return [4 /*yield*/, callZrxApi(amount)];
                case 2:
                    _a = __read.apply(void 0, [_b.sent(), 4]), isIncluded = _a[0], price = _a[1], numOrders = _a[2], makerAddresses = _a[3];
                    tests[amount] = isIncluded;
                    prices[amount] = price;
                    console.log("Price of $" + amount + " order " + price.toString() + " " + (isIncluded ? '✅' : '⛔️') + ". # orders: " + numOrders + " - Makers: " + makerAddresses);
                    _b.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, engine, client, addresses, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = __read(getWeb3Wrapper('https://eth-mainnet.alchemyapi.io/jsonrpc/q84sjONE7YbWQ_gf9aYAB2q6wDizXy9S', 'YOUR PK HERE'), 2), engine = _a[0], client = _a[1];
                    addresses = contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Mainnet);
                    console.log("Sampler address: " + addresses.erc20BridgeSampler);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, testSwapper(client)];
                case 2:
                    _b.sent();
                    // await testSwapper(client);
                    // engine.stop();
                    process.exit(0);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=rfqt-test.js.map