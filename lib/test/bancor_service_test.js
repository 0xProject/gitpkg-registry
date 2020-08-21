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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var dev_utils_1 = require("@0x/dev-utils");
var chai = require("chai");
require("mocha");
var src_1 = require("../src");
var bancor_service_1 = require("../src/utils/market_operation_utils/bancor_service");
var chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
var expect = chai.expect;
var ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;
var RPC_URL = "https://mainnet.infura.io/v3/" + process.env.INFURA_PROJECT_ID;
var provider = dev_utils_1.web3Factory.getRpcProvider({ rpcUrl: RPC_URL });
// tslint:disable:custom-no-magic-numbers
// These tests test the bancor SDK against mainnet
// TODO (xianny): After we move asset-swapper out of the monorepo, we should add an env variable to circle CI to run this test
describe.skip('Bancor Service', function () {
    var bancorService = new bancor_service_1.BancorService(provider);
    var eth = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    var bnt = '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c';
    it('should retrieve the bancor network address', function () { return __awaiter(_this, void 0, void 0, function () {
        var networkAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bancorService.getBancorNetworkAddressAsync()];
                case 1:
                    networkAddress = _a.sent();
                    expect(networkAddress).to.match(ADDRESS_REGEX);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should retrieve a quote', function () { return __awaiter(_this, void 0, void 0, function () {
        var amt, quote, fillData, sdk, expectedAmt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amt = new src_1.BigNumber(2);
                    return [4 /*yield*/, bancorService.getQuoteAsync(eth, bnt, amt)];
                case 1:
                    quote = _a.sent();
                    fillData = quote.fillData;
                    return [4 /*yield*/, bancorService.getSDKAsync()];
                case 2:
                    sdk = _a.sent();
                    return [4 /*yield*/, sdk.pricing.getRateByPath(fillData.path.map(function (s) { return bancor_service_1.token(s); }), amt.toString())];
                case 3:
                    expectedAmt = _a.sent();
                    expect(fillData.networkAddress).to.match(ADDRESS_REGEX);
                    expect(fillData.path).to.be.an.instanceOf(Array);
                    expect(fillData.path).to.have.lengthOf(3);
                    expect(quote.amount.dp(0)).to.bignumber.eq(new src_1.BigNumber(expectedAmt).multipliedBy(bancorService.minReturnAmountBufferPercentage).dp(0));
                    return [2 /*return*/];
            }
        });
    }); });
    // HACK (xianny): for exploring SDK results
    it('should retrieve multiple quotes', function () { return __awaiter(_this, void 0, void 0, function () {
        var amts, quotes;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amts = [1, 10, 100, 1000].map(function (a) { return new src_1.BigNumber(a).multipliedBy(10e18); });
                    return [4 /*yield*/, Promise.all(amts.map(function (amount) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, bancorService.getQuoteAsync(eth, bnt, amount)];
                        }); }); }))];
                case 1:
                    quotes = _a.sent();
                    quotes.map(function (q, i) {
                        // tslint:disable:no-console
                        var fillData = q.fillData;
                        console.log("Input " + amts[i].toExponential() + "; Output: " + q.amount + "; Path: " + fillData.path.length + "\nPath: " + JSON.stringify(fillData.path));
                        // tslint:enable:no-console
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=bancor_service_test.js.map