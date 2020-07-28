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
var _this = this;
// tslint:disable
var subproviders_1 = require("@0x/subproviders");
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var swap_quoter_1 = require("./swap_quoter");
var index_1 = require("./index");
// import { NativeOrderSource } from './utils/quote_reporter';
// import { QuoteReporter, QuoteReport } from './utils/quote_reporter';
var apiKey = 'c695b154-2296-441f-9785-115c6b2df24e';
var takerAddress = '0x8B58750df7D41F91a281A496e160A827fdc4De0A';
var buyTokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // USDC
var sellTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // WETH
var sellAmount = 0.2;
var sellTokenDecimals = 18;
var buyAmount = 50;
var buyTokenDecimals = 6;
// Params to emulate 0x API params
var GAS_SCHEDULE_V0 = (_a = {},
    _a[index_1.ERC20BridgeSource.Native] = function () { return 1.5e5; },
    _a[index_1.ERC20BridgeSource.Uniswap] = function () { return 3e5; },
    _a[index_1.ERC20BridgeSource.LiquidityProvider] = function () { return 3e5; },
    _a[index_1.ERC20BridgeSource.Eth2Dai] = function () { return 5.5e5; },
    _a[index_1.ERC20BridgeSource.Kyber] = function () { return 8e5; },
    _a[index_1.ERC20BridgeSource.Curve] = function (fillData) {
        switch (fillData.curve.poolAddress.toLowerCase()) {
            case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56':
            case '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c':
                return 9e5;
            case '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51':
            case '0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27':
                return 10e5;
            case '0xa5407eae9ba41422680e2e00537571bcc53efbfd':
                return 6e5;
            default:
                throw new Error('Unrecognized Curve address');
        }
    },
    _a[index_1.ERC20BridgeSource.MultiBridge] = function () { return 6.5e5; },
    _a[index_1.ERC20BridgeSource.UniswapV2] = function (fillData) {
        var gas = 3e5;
        if (fillData.tokenAddressPath.length > 2) {
            gas += 5e4;
        }
        return gas;
    },
    _a[index_1.ERC20BridgeSource.Balancer] = function () { return 4.5e5; },
    _a);
var PROTOCOL_FEE_MULTIPLIER = new index_1.BigNumber(70000);
var FEE_SCHEDULE_V0 = Object.assign.apply(Object, __spread([{}], Object.keys(GAS_SCHEDULE_V0).map(function (k) {
    var _a;
    return (_a = {},
        _a[k] = function (fillData) { return PROTOCOL_FEE_MULTIPLIER.plus(GAS_SCHEDULE_V0[k](fillData)); },
        _a);
})));
var DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE = 0.03; // 3% Slippage
var DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE = 0.015; // 1.5% Slippage in a fallback route
exports.ASSET_SWAPPER_MARKET_ORDERS_OPTS = {
    excludedSources: [],
    bridgeSlippage: DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE,
    maxFallbackSlippage: DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE,
    numSamples: 13,
    sampleDistributionBase: 1.05,
    feeSchedule: FEE_SCHEDULE_V0,
    gasSchedule: GAS_SCHEDULE_V0,
};
var getQuoter = function () {
    var providerEngine = new subproviders_1.Web3ProviderEngine();
    providerEngine.addProvider(new subproviders_1.RPCSubprovider('https://eth-mainnet.alchemyapi.io/v2/xV8dg5YmFyi1EvKnDzQdwB4W3_FM3P-H'));
    utils_1.providerUtils.startProviderEngine(providerEngine);
    var web3Wrapper = new web3_wrapper_1.Web3Wrapper(providerEngine);
    var quoter = swap_quoter_1.SwapQuoter.getSwapQuoterForStandardRelayerAPIUrl(web3Wrapper.getProvider(), 'https://api.0x.org/sra/', {
        chainId: 1,
        rfqt: {
            makerAssetOfferings: {
                'https://eth-usdc.pscope.xyz': [
                    ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
                ],
            },
            takerApiKeyWhitelist: [apiKey],
        },
    });
    return quoter;
};
var go = function () { return __awaiter(_this, void 0, void 0, function () {
    var quoter, theQuote, quoteReport, sources;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                quoter = getQuoter();
                return [4 /*yield*/, quoter.getMarketSellSwapQuoteAsync(buyTokenAddress, sellTokenAddress, web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(sellAmount, sellTokenDecimals), __assign({}, exports.ASSET_SWAPPER_MARKET_ORDERS_OPTS, { rfqt: { apiKey: apiKey, intentOnFilling: true, isIndicative: false, takerAddress: takerAddress } }))];
            case 1:
                theQuote = _a.sent();
                console.log('sellQuote received');
                quoteReport = theQuote.quoteReport;
                if (!quoteReport) {
                    console.error('no quote report');
                    return [2 /*return*/];
                }
                sources = quoteReport.sourcesConsidered.map(function (sc) {
                    var nativeOrderInfo = sc.liquiditySource === index_1.ERC20BridgeSource.Native
                        ? { isRfqt: sc.isRfqt, makerAddress: sc.nativeOrder.makerAddress }
                        : undefined;
                    return {
                        makerAmount: sc.makerAmount,
                        takerAmount: sc.takerAmount,
                        liquiditySource: sc.liquiditySource,
                        nativeOrderInfo: nativeOrderInfo,
                    };
                });
                // console.log('sources', sources);
                // console.log('considered', quoteReport.sourcesConsidered);
                console.log('delivered', quoteReport.sourcesDelivered);
                console.log('any rfqt sources?', sources.filter(function (s) { return (s.nativeOrderInfo ? s.nativeOrderInfo.isRfqt : false); }));
                return [2 /*return*/];
        }
    });
}); };
go()
    .then(function () {
    console.log('done');
    process.exit();
})
    .catch(function (e) {
    console.log('error');
    console.error(e);
    process.exit();
});
//# sourceMappingURL=demo.js.map