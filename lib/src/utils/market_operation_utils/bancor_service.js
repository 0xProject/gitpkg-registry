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
var utils_1 = require("@0x/utils");
var sdk_1 = require("@bancor/sdk");
var ethereum_1 = require("@bancor/sdk/dist/blockchains/ethereum");
var helpers_1 = require("@bancor/sdk/dist/helpers");
var types_1 = require("@bancor/sdk/dist/types");
/**
 * Converts an address to a Bancor Token type
 */
function token(address, blockchainType) {
    if (blockchainType === void 0) { blockchainType = types_1.BlockchainType.Ethereum; }
    return {
        blockchainType: blockchainType,
        blockchainId: address,
    };
}
exports.token = token;
var BancorService = /** @class */ (function () {
    function BancorService(provider) {
        this.provider = provider;
        // Bancor recommends setting this value to 2% under the expected return amount
        this.minReturnAmountBufferPercentage = 0.99;
    }
    BancorService.prototype.getSDKAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this._sdk) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, sdk_1.SDK.create({ ethereumNodeEndpoint: this.provider })];
                    case 1:
                        _a._sdk = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this._sdk];
                }
            });
        });
    };
    BancorService.prototype.getQuoteAsync = function (fromToken, toToken, amount) {
        if (amount === void 0) { amount = new utils_1.BigNumber(1); }
        return __awaiter(this, void 0, void 0, function () {
            var sdk, blockchain, sourceDecimals, _a, path, rate, targetDecimals, output, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getSDKAsync()];
                    case 1:
                        sdk = _d.sent();
                        blockchain = sdk._core.blockchains[types_1.BlockchainType.Ethereum];
                        return [4 /*yield*/, ethereum_1.getDecimals(blockchain, fromToken)];
                    case 2:
                        sourceDecimals = _d.sent();
                        return [4 /*yield*/, sdk.pricing.getPathAndRate(token(fromToken), token(toToken), helpers_1.fromWei(amount.toString(), sourceDecimals))];
                    case 3:
                        _a = _d.sent(), path = _a.path, rate = _a.rate;
                        return [4 /*yield*/, ethereum_1.getDecimals(blockchain, toToken)];
                    case 4:
                        targetDecimals = _d.sent();
                        output = helpers_1.toWei(rate, targetDecimals);
                        _b = {
                            amount: new utils_1.BigNumber(output).multipliedBy(this.minReturnAmountBufferPercentage).dp(0)
                        };
                        _c = {
                            path: path.map(function (p) { return p.blockchainId; })
                        };
                        return [4 /*yield*/, this.getBancorNetworkAddressAsync()];
                    case 5: return [2 /*return*/, (_b.fillData = (_c.networkAddress = _d.sent(),
                            _c),
                            _b)];
                }
            });
        });
    };
    BancorService.prototype.getBancorNetworkAddressAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sdk, blockchain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSDKAsync()];
                    case 1:
                        sdk = _a.sent();
                        blockchain = sdk._core.blockchains[types_1.BlockchainType.Ethereum];
                        return [2 /*return*/, blockchain.bancorNetwork._address];
                }
            });
        });
    };
    return BancorService;
}());
exports.BancorService = BancorService;
//# sourceMappingURL=bancor_service.js.map