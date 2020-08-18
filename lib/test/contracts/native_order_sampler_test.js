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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var utils_1 = require("@0x/utils");
var artifacts_1 = require("../artifacts");
var wrappers_1 = require("../wrappers");
var NULL_BYTES = contracts_test_utils_1.constants.NULL_BYTES, ZERO_AMOUNT = contracts_test_utils_1.constants.ZERO_AMOUNT;
// tslint:disable: custom-no-magic-numbers
contracts_test_utils_1.blockchainTests.resets('NativeOrderSampler contract', function (env) {
    var testContract;
    var makerToken;
    var takerToken;
    var feeToken;
    var erc20Proxy;
    var ERC20_PROXY_ID = '0xf47261b0';
    var VALID_SIGNATURE = '0x01';
    var INVALID_SIGNATURE = '0x00';
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, NUM_TOKENS;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, wrappers_1.TestNativeOrderSamplerContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestNativeOrderSampler, env.provider, env.txDefaults, {})];
                case 1:
                    testContract = _b.sent();
                    return [4 /*yield*/, testContract.getAssetProxy(ERC20_PROXY_ID).callAsync()];
                case 2:
                    erc20Proxy = _b.sent();
                    NUM_TOKENS = new utils_1.BigNumber(3);
                    return [4 /*yield*/, testContract.createTokens(NUM_TOKENS).callAsync()];
                case 3:
                    _a = __read.apply(void 0, [_b.sent(), 3]), makerToken = _a[0], takerToken = _a[1], feeToken = _a[2];
                    return [4 /*yield*/, testContract.createTokens(NUM_TOKENS).awaitTransactionSuccessAsync()];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    function getPackedHash() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return utils_1.hexUtils.hash(utils_1.hexUtils.concat.apply(utils_1.hexUtils, __spread(args.map(function (a) { return utils_1.hexUtils.toHex(a); }))));
    }
    function getOrderInfo(order) {
        var hash = getPackedHash(utils_1.hexUtils.leftPad(order.salt));
        var orderStatus = order.salt.mod(255).eq(0) ? 3 : 5;
        var filledAmount = order.expirationTimeSeconds;
        return {
            orderStatus: orderStatus,
            orderHash: hash,
            orderTakerAssetFilledAmount: filledAmount,
        };
    }
    function createFillableOrderSalt() {
        return new utils_1.BigNumber(utils_1.hexUtils.concat(utils_1.hexUtils.slice(utils_1.hexUtils.random(), 0, -1), '0x01'));
    }
    function createUnfillableOrderSalt() {
        return new utils_1.BigNumber(utils_1.hexUtils.concat(utils_1.hexUtils.slice(utils_1.hexUtils.random(), 0, -1), '0xff'));
    }
    function getOrderFillableTakerAmount(order) {
        return order.takerAssetAmount.minus(getOrderInfo(order).orderTakerAssetFilledAmount);
    }
    function getERC20AssetData(tokenAddress) {
        return utils_1.hexUtils.concat(ERC20_PROXY_ID, utils_1.hexUtils.leftPad(tokenAddress));
    }
    function createOrder(fields, filledTakerAssetAmount) {
        if (fields === void 0) { fields = {}; }
        if (filledTakerAssetAmount === void 0) { filledTakerAssetAmount = ZERO_AMOUNT; }
        return __assign({ chainId: 1337, exchangeAddress: contracts_test_utils_1.randomAddress(), makerAddress: contracts_test_utils_1.randomAddress(), takerAddress: contracts_test_utils_1.randomAddress(), senderAddress: contracts_test_utils_1.randomAddress(), feeRecipientAddress: contracts_test_utils_1.randomAddress(), makerAssetAmount: contracts_test_utils_1.getRandomInteger(1e18, 10e18), takerAssetAmount: contracts_test_utils_1.getRandomInteger(1e18, 10e18), makerFee: contracts_test_utils_1.getRandomInteger(1e18, 10e18), takerFee: contracts_test_utils_1.getRandomInteger(1e18, 10e18), makerAssetData: getERC20AssetData(makerToken), takerAssetData: getERC20AssetData(takerToken), makerFeeAssetData: getERC20AssetData(feeToken), takerFeeAssetData: getERC20AssetData(contracts_test_utils_1.randomAddress()), salt: createFillableOrderSalt(), 
            // Expiration time will be used to determine filled amount.
            expirationTimeSeconds: filledTakerAssetAmount }, fields);
    }
    function fundMakerAsync(order, assetData, balanceScaling, allowanceScaling) {
        if (balanceScaling === void 0) { balanceScaling = 1; }
        if (allowanceScaling === void 0) { allowanceScaling = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var token, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (assetData === order.makerAssetData) {
                            token = makerToken;
                            amount =
                                order.makerAssetData === order.makerFeeAssetData
                                    ? order.makerAssetAmount.plus(order.makerFee)
                                    : order.makerAssetAmount;
                        }
                        else {
                            token = feeToken;
                            amount = order.makerFee;
                        }
                        amount = amount.times(getOrderFillableTakerAmount(order).div(utils_1.BigNumber.max(1, order.takerAssetAmount)));
                        return [4 /*yield*/, testContract
                                .setTokenBalanceAndAllowance(token, order.makerAddress, erc20Proxy, amount.times(balanceScaling).integerValue(), amount.times(allowanceScaling).integerValue())
                                .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    describe('getOrderFillableTakerAmount()', function () {
        it('returns the full amount for a fully funded order', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        expected = getOrderFillableTakerAmount(order);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the full amount for a fully funded order without maker fees', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({ makerFee: ZERO_AMOUNT });
                        expected = getOrderFillableTakerAmount(order);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the full amount for a fully funded order without maker fee asset data', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({ makerFeeAssetData: NULL_BYTES });
                        expected = getOrderFillableTakerAmount(order);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the full amount for a fully funded order with maker fees denominated in the maker asset', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({ makerFeeAssetData: getERC20AssetData(makerToken) });
                        expected = getOrderFillableTakerAmount(order);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns partial amount with insufficient maker asset balance', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        expected = getOrderFillableTakerAmount(order)
                            .times(0.5)
                            .integerValue(utils_1.BigNumber.ROUND_DOWN);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData, 0.5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns partial amount with insufficient maker asset allowance', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        expected = getOrderFillableTakerAmount(order)
                            .times(0.5)
                            .integerValue(utils_1.BigNumber.ROUND_DOWN);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData, 1, 0.5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns partial amount with insufficient maker fee asset balance', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        expected = getOrderFillableTakerAmount(order)
                            .times(0.5)
                            .integerValue(utils_1.BigNumber.ROUND_DOWN);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData, 0.5)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns partial amount with insufficient maker fee asset allowance', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        expected = getOrderFillableTakerAmount(order)
                            .times(0.5)
                            .integerValue(utils_1.BigNumber.ROUND_DOWN);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData, 1, 0.5)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        actual = _a.sent();
                        contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns partial amount with insufficient maker asset balance (maker asset fees)', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({ makerFeeAssetData: getERC20AssetData(makerToken) });
                        expected = getOrderFillableTakerAmount(order)
                            .times(0.5)
                            .integerValue(utils_1.BigNumber.ROUND_DOWN);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData, 0.5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 2:
                        actual = _a.sent();
                        contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns partial amount with insufficient maker asset allowance (maker asset fees)', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, expected, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({ makerFeeAssetData: getERC20AssetData(makerToken) });
                        expected = getOrderFillableTakerAmount(order)
                            .times(0.5)
                            .integerValue(utils_1.BigNumber.ROUND_DOWN);
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData, 1, 0.5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 2:
                        actual = _a.sent();
                        contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero for an that is not fillable', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, fillableTakerAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = __assign({}, createOrder(), { salt: createUnfillableOrderSalt() });
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        fillableTakerAmount = _a.sent();
                        contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero for an order with zero maker asset amount', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, fillableTakerAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = __assign({}, createOrder(), { makerAssetAmount: ZERO_AMOUNT });
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        fillableTakerAmount = _a.sent();
                        contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero for an order with zero taker asset amount', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, fillableTakerAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = __assign({}, createOrder(), { takerAssetAmount: ZERO_AMOUNT });
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        fillableTakerAmount = _a.sent();
                        contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero for an order with an empty signature', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, fillableTakerAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, NULL_BYTES, testContract.address)
                                .callAsync()];
                    case 3:
                        fillableTakerAmount = _a.sent();
                        contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero for an order with an invalid signature', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, fillableTakerAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerAssetData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fundMakerAsync(order, order.makerFeeAssetData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testContract
                                .getOrderFillableTakerAmount(order, INVALID_SIGNATURE, testContract.address)
                                .callAsync()];
                    case 3:
                        fillableTakerAmount = _a.sent();
                        contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=native_order_sampler_test.js.map