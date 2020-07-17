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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_erc20_1 = require("@0x/contracts-erc20");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
var NULL_RECURRING_BUY = {
    sellAmount: contracts_test_utils_1.constants.ZERO_AMOUNT,
    interval: contracts_test_utils_1.constants.ZERO_AMOUNT,
    minBuyAmount: contracts_test_utils_1.constants.ZERO_AMOUNT,
    maxSlippageBps: contracts_test_utils_1.constants.ZERO_AMOUNT,
    currentBuyWindowStart: contracts_test_utils_1.constants.ZERO_AMOUNT,
    currentIntervalAmountSold: contracts_test_utils_1.constants.ZERO_AMOUNT,
    unwrapWeth: false,
};
var ONE_DAY_IN_SECONDS = new utils_1.BigNumber(24 * 60 * 60);
var BUY_WINDOW_LENGTH = ONE_DAY_IN_SECONDS;
var MIN_INTERVAL_LENGTH = ONE_DAY_IN_SECONDS;
var randomAssetData = function () { return utils_1.hexUtils.random(36); };
var randomAmount = function () { return contracts_test_utils_1.getRandomInteger(0, contracts_test_utils_1.constants.MAX_UINT256); };
var randomTimestamp = function () { return new utils_1.BigNumber(Math.floor(_.now() / 1000) + _.random(0, 34560)); };
var randomSalt = function () { return new utils_1.BigNumber(utils_1.hexUtils.random(contracts_test_utils_1.constants.WORD_LENGTH).substr(2), 16); };
function randomRecurringBuy() {
    var sellAmount = contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256);
    return {
        sellAmount: sellAmount,
        interval: contracts_test_utils_1.getRandomInteger(MIN_INTERVAL_LENGTH, contracts_test_utils_1.constants.MAX_UINT256),
        minBuyAmount: randomAmount(),
        maxSlippageBps: randomAmount(),
        currentBuyWindowStart: randomTimestamp(),
        currentIntervalAmountSold: contracts_test_utils_1.constants.ZERO_AMOUNT,
        unwrapWeth: false,
    };
}
function randomOrder(fields) {
    return __assign({ makerAddress: contracts_test_utils_1.randomAddress(), takerAddress: contracts_test_utils_1.randomAddress(), feeRecipientAddress: contracts_test_utils_1.randomAddress(), senderAddress: contracts_test_utils_1.randomAddress(), takerAssetAmount: randomAmount(), makerAssetAmount: randomAmount(), makerFee: randomAmount(), takerFee: randomAmount(), expirationTimeSeconds: randomTimestamp(), salt: randomSalt(), makerAssetData: randomAssetData(), takerAssetData: randomAssetData(), makerFeeAssetData: randomAssetData(), takerFeeAssetData: randomAssetData(), exchangeAddress: contracts_test_utils_1.constants.NULL_ADDRESS, chainId: 1337 }, (fields || {}));
}
contracts_test_utils_1.blockchainTests.only('RitualBridge unit tests', function (env) {
    var weth;
    var sellToken;
    var buyToken;
    var ritualBridge;
    var recurringBuyer;
    var taker;
    var recurringBuyId;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, contracts_erc20_1.WETH9Contract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.WETH9, env.provider, env.txDefaults, contracts_erc20_1.artifacts)];
                case 1:
                    weth = _e.sent();
                    return [4 /*yield*/, Promise.all(_.times(2, function () {
                            return contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, env.provider, env.txDefaults, contracts_erc20_1.artifacts, contracts_test_utils_1.constants.DUMMY_TOKEN_NAME, contracts_test_utils_1.constants.DUMMY_TOKEN_SYMBOL, contracts_test_utils_1.constants.DUMMY_TOKEN_DECIMALS, contracts_test_utils_1.constants.DUMMY_TOKEN_TOTAL_SUPPLY);
                        }))];
                case 2:
                    _a = __read.apply(void 0, [_e.sent(), 2]), sellToken = _a[0], buyToken = _a[1];
                    return [4 /*yield*/, wrappers_1.TestRitualBridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestRitualBridge, env.provider, env.txDefaults, artifacts_1.artifacts, weth.address)];
                case 3:
                    ritualBridge = _e.sent();
                    return [4 /*yield*/, env.getAccountAddressesAsync()];
                case 4:
                    _b = __read.apply(void 0, [_e.sent(), 3]), recurringBuyer = _b[1], taker = _b[2];
                    return [4 /*yield*/, sellToken
                            .approve(ritualBridge.address, contracts_test_utils_1.constants.INITIAL_ERC20_ALLOWANCE)
                            .awaitTransactionSuccessAsync({ from: recurringBuyer })];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, sellToken.setBalance(recurringBuyer, contracts_test_utils_1.constants.INITIAL_ERC20_BALANCE).awaitTransactionSuccessAsync()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, buyToken.setBalance(taker, contracts_test_utils_1.constants.INITIAL_ERC20_BALANCE).awaitTransactionSuccessAsync()];
                case 7:
                    _e.sent();
                    _d = (_c = buyToken).approve;
                    return [4 /*yield*/, ritualBridge.getExchangeAddress().callAsync()];
                case 8: return [4 /*yield*/, _d.apply(_c, [_e.sent(), contracts_test_utils_1.constants.INITIAL_ERC20_ALLOWANCE])
                        .awaitTransactionSuccessAsync({ from: taker })];
                case 9:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('isValidSignature()', function () {
        it('returns success bytes', function () { return __awaiter(_this, void 0, void 0, function () {
            var LEGACY_WALLET_MAGIC_VALUE, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        LEGACY_WALLET_MAGIC_VALUE = '0xb0671381';
                        return [4 /*yield*/, ritualBridge
                                .isValidSignature(utils_1.hexUtils.random(), utils_1.hexUtils.random(_.random(0, 32)))
                                .callAsync()];
                    case 1:
                        result = _a.sent();
                        contracts_test_utils_1.expect(result).to.eq(LEGACY_WALLET_MAGIC_VALUE);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setRecurringBuy()', function () {
        it('reverts if interval < 1 day', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = ritualBridge
                    .setRecurringBuy(sellToken.address, buyToken.address, contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256), ONE_DAY_IN_SECONDS.minus(1), contracts_test_utils_1.constants.ZERO_AMOUNT, contracts_test_utils_1.constants.MAX_UINT256, false, [], [])
                    .awaitTransactionSuccessAsync();
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('RitualBridge::setRecurringBuy/INTERVAL_TOO_SHORT')];
            });
        }); });
        it('reverts if sellToken == buyToken', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                tx = ritualBridge
                    .setRecurringBuy(sellToken.address, sellToken.address, contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256), contracts_test_utils_1.getRandomInteger(MIN_INTERVAL_LENGTH, contracts_test_utils_1.constants.MAX_UINT256), contracts_test_utils_1.constants.ZERO_AMOUNT, contracts_test_utils_1.constants.MAX_UINT256, false, [], [])
                    .awaitTransactionSuccessAsync();
                return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('RitualBridge::setRecurringBuy/INVALID_TOKEN_PAIR')];
            });
        }); });
        it('sets recurringBuys entry', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, expectedEntry, call, _b, id, amountBought, actualEntry, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        expectedEntry = randomRecurringBuy();
                        call = ritualBridge.setRecurringBuy(sellToken.address, buyToken.address, expectedEntry.sellAmount, expectedEntry.interval, expectedEntry.minBuyAmount, expectedEntry.maxSlippageBps, expectedEntry.unwrapWeth, [], []);
                        return [4 /*yield*/, call.callAsync({ from: recurringBuyer })];
                    case 1:
                        _b = __read.apply(void 0, [_e.sent(), 2]), id = _b[0], amountBought = _b[1];
                        contracts_test_utils_1.expect(amountBought).to.bignumber.equal(contracts_test_utils_1.constants.ZERO_AMOUNT);
                        return [4 /*yield*/, call.awaitTransactionSuccessAsync({ from: recurringBuyer })];
                    case 2:
                        _e.sent();
                        actualEntry = NULL_RECURRING_BUY;
                        return [4 /*yield*/, ritualBridge.recurringBuys(id).callAsync()];
                    case 3:
                        _a = __read.apply(void 0, [_e.sent(), 7]), actualEntry.sellAmount = _a[0], actualEntry.interval = _a[1], actualEntry.minBuyAmount = _a[2], actualEntry.maxSlippageBps = _a[3], actualEntry.currentBuyWindowStart = _a[4], actualEntry.currentIntervalAmountSold = _a[5], actualEntry.unwrapWeth = _a[6];
                        _c = expectedEntry;
                        _d = utils_1.BigNumber.bind;
                        return [4 /*yield*/, env.web3Wrapper.getBlockTimestampAsync('latest')];
                    case 4:
                        _c.currentBuyWindowStart = new (_d.apply(utils_1.BigNumber, [void 0, _e.sent()]))();
                        contracts_test_utils_1.expect(actualEntry).to.deep.equal(expectedEntry);
                        recurringBuyId = id;
                        return [2 /*return*/];
                }
            });
        }); });
        it('updates recurringBuys entry', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, expectedEntry, actualEntry, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        expectedEntry = randomRecurringBuy();
                        return [4 /*yield*/, ritualBridge
                                .setRecurringBuy(sellToken.address, buyToken.address, expectedEntry.sellAmount, expectedEntry.interval, expectedEntry.minBuyAmount, expectedEntry.maxSlippageBps, expectedEntry.unwrapWeth, [], [])
                                .awaitTransactionSuccessAsync({ from: recurringBuyer })];
                    case 1:
                        _d.sent();
                        actualEntry = NULL_RECURRING_BUY;
                        return [4 /*yield*/, ritualBridge.recurringBuys(recurringBuyId).callAsync()];
                    case 2:
                        _a = __read.apply(void 0, [_d.sent(), 7]), actualEntry.sellAmount = _a[0], actualEntry.interval = _a[1], actualEntry.minBuyAmount = _a[2], actualEntry.maxSlippageBps = _a[3], actualEntry.currentBuyWindowStart = _a[4], actualEntry.currentIntervalAmountSold = _a[5], actualEntry.unwrapWeth = _a[6];
                        _b = expectedEntry;
                        _c = utils_1.BigNumber.bind;
                        return [4 /*yield*/, env.web3Wrapper.getBlockTimestampAsync('latest')];
                    case 3:
                        _b.currentBuyWindowStart = new (_c.apply(utils_1.BigNumber, [void 0, _d.sent()]))();
                        contracts_test_utils_1.expect(actualEntry).to.deep.equal(expectedEntry);
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls Exchange.marketSellOrdersNoThrow if orders are provided', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, params, msgValue, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = randomOrder({
                            makerAddress: taker,
                            makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(buyToken.address),
                            takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(sellToken.address),
                            makerAssetAmount: contracts_test_utils_1.toBaseUnitAmount(1),
                            takerAssetAmount: contracts_test_utils_1.toBaseUnitAmount(1),
                            makerFee: contracts_test_utils_1.constants.ZERO_AMOUNT,
                            takerFee: contracts_test_utils_1.constants.ZERO_AMOUNT,
                        });
                        params = __assign({}, randomRecurringBuy(), { sellAmount: contracts_test_utils_1.constants.ONE_ETHER });
                        msgValue = new utils_1.BigNumber(1337);
                        return [4 /*yield*/, ritualBridge
                                .setRecurringBuy(sellToken.address, buyToken.address, params.sellAmount, params.interval, params.minBuyAmount, params.maxSlippageBps, params.unwrapWeth, [order], ['0x'])
                                .awaitTransactionSuccessAsync({ from: recurringBuyer, value: msgValue })];
                    case 1:
                        tx = _a.sent();
                        contracts_test_utils_1.verifyEventsFromLogs(tx.logs, [{ takerAssetFillAmount: params.sellAmount, msgValue: msgValue }], wrappers_1.TestRitualBridgeEvents.MarketSellCalled);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('cancelRecurringBuy()', function () {
        it('deletes recurringBuys entry', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, actualEntry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ritualBridge
                            .cancelRecurringBuy(sellToken.address, buyToken.address)
                            .awaitTransactionSuccessAsync({ from: recurringBuyer })];
                    case 1:
                        _b.sent();
                        actualEntry = NULL_RECURRING_BUY;
                        return [4 /*yield*/, ritualBridge.recurringBuys(recurringBuyId).callAsync()];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 7]), actualEntry.sellAmount = _a[0], actualEntry.interval = _a[1], actualEntry.minBuyAmount = _a[2], actualEntry.maxSlippageBps = _a[3], actualEntry.currentBuyWindowStart = _a[4], actualEntry.currentIntervalAmountSold = _a[5], actualEntry.unwrapWeth = _a[6];
                        contracts_test_utils_1.expect(actualEntry).to.deep.equal(NULL_RECURRING_BUY);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    contracts_test_utils_1.blockchainTests.resets('bridgeTransferFrom()', function () {
        var recurringBuy = __assign({}, NULL_RECURRING_BUY, { sellAmount: contracts_test_utils_1.toBaseUnitAmount(1337), interval: ONE_DAY_IN_SECONDS.times(7), minBuyAmount: contracts_test_utils_1.toBaseUnitAmount(420), maxSlippageBps: new utils_1.BigNumber(123), unwrapWeth: true });
        var bridgeDataEncoder = utils_1.AbiEncoder.create([
            { name: 'takerToken', type: 'address' },
            { name: 'recurringBuyer', type: 'address' },
        ]);
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ritualBridge
                            .setRecurringBuy(sellToken.address, buyToken.address, recurringBuy.sellAmount, recurringBuy.interval, recurringBuy.minBuyAmount, recurringBuy.maxSlippageBps, recurringBuy.unwrapWeth, [], [])
                            .awaitTransactionSuccessAsync({ from: recurringBuyer })];
                    case 1:
                        _c.sent();
                        _a = recurringBuy;
                        _b = utils_1.BigNumber.bind;
                        return [4 /*yield*/, env.web3Wrapper.getBlockTimestampAsync('latest')];
                    case 2:
                        _a.currentBuyWindowStart = new (_b.apply(utils_1.BigNumber, [void 0, _c.sent()]))();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts if there is no active buy', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ritualBridge
                            .cancelRecurringBuy(sellToken.address, buyToken.address)
                            .awaitTransactionSuccessAsync({ from: recurringBuyer })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, recurringBuy.minBuyAmount)
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 2:
                        _a.sent();
                        tx = ritualBridge
                            .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount, bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                            .awaitTransactionSuccessAsync({ from: taker });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('RitualBridge::_validateAndUpdateRecurringBuy/NO_ACTIVE_RECURRING_BUY_FOUND')];
                }
            });
        }); });
        it('Reverts if the order price is worse than the worst acceptable price', function () { return __awaiter(_this, void 0, void 0, function () {
            var worstPrice, takerAssetAmount, minBuyAmountScaled, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        worstPrice = recurringBuy.minBuyAmount.div(recurringBuy.sellAmount);
                        takerAssetAmount = contracts_test_utils_1.getRandomInteger(0, recurringBuy.sellAmount);
                        minBuyAmountScaled = takerAssetAmount.times(worstPrice).integerValue(utils_1.BigNumber.ROUND_DOWN);
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, minBuyAmountScaled.minus(1))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 1:
                        _a.sent();
                        tx = ritualBridge
                            .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, takerAssetAmount, bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                            .awaitTransactionSuccessAsync({ from: taker });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('RitualBridge::_validateAndUpdateRecurringBuy/INVALID_PRICE')];
                }
            });
        }); });
        it('Reverts if executing trade would exceed the sell amount of the recurring buy', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, buyToken
                            .transfer(ritualBridge.address, recurringBuy.minBuyAmount.times(2))
                            .awaitTransactionSuccessAsync({ from: taker })];
                    case 1:
                        _a.sent();
                        tx = ritualBridge
                            .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount.times(2), bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                            .awaitTransactionSuccessAsync({ from: taker });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('RitualBridge::_validateAndUpdateRecurringBuy/EXCEEDS_SELL_AMOUNT')];
                }
            });
        }); });
        it('Reverts if outside of buy window', function () { return __awaiter(_this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, env.web3Wrapper.increaseTimeAsync(BUY_WINDOW_LENGTH.plus(1).toNumber())];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, recurringBuy.minBuyAmount)
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 2:
                        _a.sent();
                        tx = ritualBridge
                            .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount, bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                            .awaitTransactionSuccessAsync({ from: taker });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.revertWith('RitualBridge::_validateAndUpdateRecurringBuy/OUTSIDE_OF_BUY_WINDOW')];
                }
            });
        }); });
        // it('Reverts if outside of slippage range', async () => {
        //     const oracleAddress = await ritualBridge.getOracleAddress().callAsync();
        //     await new TestOracleContract(oracleAddress, env.provider)
        //         .setLatestAnswer(new BigNumber(100000000))
        //         .awaitTransactionSuccessAsync({ from: taker });
        //     await buyToken
        //         .transfer(ritualBridge.address, recurringBuy.minBuyAmount)
        //         .awaitTransactionSuccessAsync({ from: taker });
        //     const tx = ritualBridge
        //         .bridgeTransferFrom(
        //             sellToken.address,
        //             constants.NULL_ADDRESS,
        //             taker,
        //             recurringBuy.sellAmount,
        //             bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer }),
        //         )
        //         .awaitTransactionSuccessAsync({ from: taker });
        //     return expect(tx).to.revertWith(
        //         'RitualBridge::_validateAndUpdateRecurringBuy/EXCEEDS_MAX_ALLOWED_SLIPPAGE',
        //     );
        // });
        it('Succeeds otherwise', function () { return __awaiter(_this, void 0, void 0, function () {
            var recurringBuyerBalanceBefore, takerBalanceBefore, recurringBuyerBalanceAfter, takerBalanceAfter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, buyToken.balanceOf(recurringBuyer).callAsync()];
                    case 1:
                        recurringBuyerBalanceBefore = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 2:
                        takerBalanceBefore = _a.sent();
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, recurringBuy.minBuyAmount)
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ritualBridge
                                .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount, bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, buyToken.balanceOf(recurringBuyer).callAsync()];
                    case 5:
                        recurringBuyerBalanceAfter = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 6:
                        takerBalanceAfter = _a.sent();
                        contracts_test_utils_1.expect(recurringBuyerBalanceAfter).to.bignumber.equal(recurringBuyerBalanceBefore.plus(recurringBuy.minBuyAmount));
                        contracts_test_utils_1.expect(takerBalanceAfter).to.bignumber.equal(takerBalanceBefore.plus(recurringBuy.sellAmount));
                        return [2 /*return*/];
                }
            });
        }); });
        it('Succeeds in consecutive intervals', function () { return __awaiter(_this, void 0, void 0, function () {
            var recurringBuyerBalanceBefore, takerBalanceBefore, recurringBuyerBalanceAfter, takerBalanceAfter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, buyToken.balanceOf(recurringBuyer).callAsync()];
                    case 1:
                        recurringBuyerBalanceBefore = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 2:
                        takerBalanceBefore = _a.sent();
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, recurringBuy.minBuyAmount)
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ritualBridge
                                .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount, bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, env.web3Wrapper.increaseTimeAsync(recurringBuy.interval.plus(BUY_WINDOW_LENGTH.div(2)).toNumber())];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, recurringBuy.minBuyAmount)
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, ritualBridge
                                .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount, bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, buyToken.balanceOf(recurringBuyer).callAsync()];
                    case 8:
                        recurringBuyerBalanceAfter = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 9:
                        takerBalanceAfter = _a.sent();
                        contracts_test_utils_1.expect(recurringBuyerBalanceAfter).to.bignumber.equal(recurringBuyerBalanceBefore.plus(recurringBuy.minBuyAmount.times(2)));
                        contracts_test_utils_1.expect(takerBalanceAfter).to.bignumber.equal(takerBalanceBefore.plus(recurringBuy.sellAmount.times(2)));
                        return [2 /*return*/];
                }
            });
        }); });
        it('Succeeds with two partial fills in the same buy period', function () { return __awaiter(_this, void 0, void 0, function () {
            var recurringBuyerBalanceBefore, takerBalanceBefore, recurringBuyerBalanceAfter, takerBalanceAfter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, buyToken.balanceOf(recurringBuyer).callAsync()];
                    case 1:
                        recurringBuyerBalanceBefore = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 2:
                        takerBalanceBefore = _a.sent();
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, recurringBuy.minBuyAmount.div(2))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ritualBridge
                                .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount.div(2), bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, buyToken
                                .transfer(ritualBridge.address, recurringBuy.minBuyAmount.div(2))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, ritualBridge
                                .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, recurringBuy.sellAmount.div(2), bridgeDataEncoder.encode({ takerToken: buyToken.address, recurringBuyer: recurringBuyer }))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, buyToken.balanceOf(recurringBuyer).callAsync()];
                    case 7:
                        recurringBuyerBalanceAfter = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 8:
                        takerBalanceAfter = _a.sent();
                        contracts_test_utils_1.expect(recurringBuyerBalanceAfter).to.bignumber.equal(recurringBuyerBalanceBefore.plus(recurringBuy.minBuyAmount));
                        contracts_test_utils_1.expect(takerBalanceAfter).to.bignumber.equal(takerBalanceBefore.plus(recurringBuy.sellAmount));
                        return [2 /*return*/];
                }
            });
        }); });
        it('Unwraps wETH before transferring to recurring buyer', function () { return __awaiter(_this, void 0, void 0, function () {
            var recurringBuyerBalanceBefore, takerBalanceBefore, buyAmount, recurringBuyerBalanceAfter, takerBalanceAfter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ritualBridge
                            .setRecurringBuy(sellToken.address, weth.address, recurringBuy.sellAmount, recurringBuy.interval, contracts_test_utils_1.constants.ONE_ETHER, recurringBuy.maxSlippageBps, recurringBuy.unwrapWeth, [], [])
                            .awaitTransactionSuccessAsync({ from: recurringBuyer })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, env.web3Wrapper.getBalanceInWeiAsync(recurringBuyer)];
                    case 2:
                        recurringBuyerBalanceBefore = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 3:
                        takerBalanceBefore = _a.sent();
                        return [4 /*yield*/, weth.deposit().awaitTransactionSuccessAsync({ from: taker, value: contracts_test_utils_1.constants.ONE_ETHER })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, weth
                                .transfer(ritualBridge.address, contracts_test_utils_1.constants.ONE_ETHER)
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 5:
                        _a.sent();
                        buyAmount = contracts_test_utils_1.constants.ONE_ETHER;
                        return [4 /*yield*/, ritualBridge
                                .bridgeTransferFrom(sellToken.address, contracts_test_utils_1.constants.NULL_ADDRESS, taker, buyAmount, bridgeDataEncoder.encode({ takerToken: weth.address, recurringBuyer: recurringBuyer }))
                                .awaitTransactionSuccessAsync({ from: taker })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, env.web3Wrapper.getBalanceInWeiAsync(recurringBuyer)];
                    case 7:
                        recurringBuyerBalanceAfter = _a.sent();
                        return [4 /*yield*/, sellToken.balanceOf(taker).callAsync()];
                    case 8:
                        takerBalanceAfter = _a.sent();
                        contracts_test_utils_1.expect(recurringBuyerBalanceAfter).to.bignumber.equal(recurringBuyerBalanceBefore.plus(contracts_test_utils_1.constants.ONE_ETHER));
                        contracts_test_utils_1.expect(takerBalanceAfter).to.bignumber.equal(takerBalanceBefore.plus(buyAmount));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    contracts_test_utils_1.blockchainTests.resets('fillRecurringBuy()', function () {
        var recurringBuy = __assign({}, NULL_RECURRING_BUY, { sellAmount: contracts_test_utils_1.toBaseUnitAmount(3), interval: ONE_DAY_IN_SECONDS.times(7), minBuyAmount: contracts_test_utils_1.toBaseUnitAmount(4), maxSlippageBps: new utils_1.BigNumber(123), unwrapWeth: true });
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ritualBridge
                            .setRecurringBuy(sellToken.address, buyToken.address, recurringBuy.sellAmount, recurringBuy.interval, recurringBuy.minBuyAmount, recurringBuy.maxSlippageBps, recurringBuy.unwrapWeth, [], [])
                            .awaitTransactionSuccessAsync({ from: recurringBuyer })];
                    case 1:
                        _c.sent();
                        _a = recurringBuy;
                        _b = utils_1.BigNumber.bind;
                        return [4 /*yield*/, env.web3Wrapper.getBlockTimestampAsync('latest')];
                    case 2:
                        _a.currentBuyWindowStart = new (_b.apply(utils_1.BigNumber, [void 0, _c.sent()]))();
                        return [2 /*return*/];
                }
            });
        }); });
        // it('reverts to fill an order when the price is outside of the guardrails', async () => {
        //     const order = randomOrder();
        //     order.makerAssetAmount = recurringBuy.sellAmount;
        //     order.takerAssetAmount = recurringBuy.sellAmount.div(2);
        //     order.makerFee = constants.ZERO_AMOUNT;
        //     order.takerFee = constants.ZERO_AMOUNT;
        //     const msgValue = new BigNumber(1337);
        //     const tx = ritualBridge
        //         .fillRecurringBuy(recurringBuyer, sellToken.address, buyToken.address, [order], ['0x'])
        //         .awaitTransactionSuccessAsync({ from: taker, value: msgValue });
        //     return expect(tx).to.revertWith(
        //         'RitualBridge::_validateAndUpdateRecurringBuy/EXCEEDS_MAX_ALLOWED_SLIPPAGE',
        //     );
        // });
        it('can fill an order when the price is within the guardrails', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, msgValue, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = randomOrder({
                            makerAddress: taker,
                            makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(buyToken.address),
                            takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(sellToken.address),
                            makerAssetAmount: recurringBuy.minBuyAmount,
                            takerAssetAmount: recurringBuy.sellAmount,
                            makerFee: contracts_test_utils_1.constants.ZERO_AMOUNT,
                            takerFee: contracts_test_utils_1.constants.ZERO_AMOUNT,
                        });
                        msgValue = new utils_1.BigNumber(1337);
                        return [4 /*yield*/, ritualBridge
                                .fillRecurringBuy(recurringBuyer, sellToken.address, buyToken.address, [order], ['0x'])
                                .awaitTransactionSuccessAsync({ from: taker, value: msgValue })];
                    case 1:
                        tx = _a.sent();
                        contracts_test_utils_1.verifyEventsFromLogs(tx.logs, [{ takerAssetFillAmount: recurringBuy.sellAmount, msgValue: msgValue }], wrappers_1.TestRitualBridgeEvents.MarketSellCalled);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// tslint:disable max-file-line-count
//# sourceMappingURL=ritual_bridge.js.map