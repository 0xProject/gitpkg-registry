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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var types_1 = require("../src/types");
var types_2 = require("../src/utils/market_operation_utils/types");
var quote_simulation_1 = require("../src/utils/quote_simulation");
// tslint:disable: custom-no-magic-numbers
describe('quote_simulation tests', function () { return __awaiter(_this, void 0, void 0, function () {
    // Check if two numbers are within `maxError` error rate within each other (default 1 bps).
    function assertRoughlyEquals(n1, n2, maxError) {
        if (maxError === void 0) { maxError = 1e-12; }
        // |n2-n1| / max(|n1|, |n2|)
        var err = n2
            .minus(n1)
            .abs()
            .div(utils_1.BigNumber.max(n1.abs(), n2.abs()));
        contracts_test_utils_1.expect(err).to.bignumber.lt(maxError);
    }
    function createQuoteFillOrders(opts) {
        if (opts === void 0) { opts = {}; }
        var _a = __assign({ fillableInput: getRandomOrderSize(), fillableOutput: getRandomOrderSize(), inputFeeRate: 0, outputFeeRate: 0, count: 3, fillsCount: 3, side: types_1.MarketOperation.Sell }, opts), fillableInput = _a.fillableInput, fillableOutput = _a.fillableOutput, inputFeeRate = _a.inputFeeRate, outputFeeRate = _a.outputFeeRate, count = _a.count, fillsCount = _a.fillsCount, side = _a.side;
        var _inputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
        var _outputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
        var fillableInputs = subdivideAmount(fillableInput, count);
        var fillableOutputs = subdivideAmount(fillableOutput, count);
        var filledInputs = subdivideAmount(fillableInput.times(0.5), count);
        var filledOutputs = [];
        var totalInputs = [];
        var totalOutputs = [];
        var inputFees = [];
        var outputFees = [];
        _.times(count).forEach(function (i) {
            var f = filledInputs[i].div(fillableInputs[i]);
            filledOutputs.push(fillableOutputs[i].times(f).integerValue(utils_1.BigNumber.ROUND_DOWN));
            totalInputs.push(fillableInputs[i].plus(filledInputs[i]));
            totalOutputs.push(fillableOutputs[i].plus(filledOutputs[i]));
            inputFees.push(totalInputs[i].times(_inputFeeRate).integerValue());
            outputFees.push(totalOutputs[i].times(_outputFeeRate).integerValue());
        });
        return _.times(count, function (i) {
            return {
                order: createQuoteFillOrderOrder(totalInputs[i], totalOutputs[i], {
                    side: side,
                    fillsCount: fillsCount,
                    filledInput: filledInputs[i],
                    takerInputFee: inputFees[i].abs(),
                    takerOutputFee: outputFees[i].abs(),
                }),
                totalOrderInput: totalInputs[i],
                totalOrderOutput: totalOutputs[i],
                totalOrderInputFee: inputFees[i],
                totalOrderOutputFee: outputFees[i],
            };
        });
    }
    function createQuoteFillOrderOrder(input, output, opts) {
        if (opts === void 0) { opts = {}; }
        var _a = __assign({ side: types_1.MarketOperation.Sell, filledInput: ZERO, fillsCount: 3, takerInputFee: ZERO, takerOutputFee: ZERO }, opts), filledInput = _a.filledInput, fillsCount = _a.fillsCount, side = _a.side, takerInputFee = _a.takerInputFee, takerOutputFee = _a.takerOutputFee;
        var filledOutput = filledInput
            .div(input)
            .times(output)
            .integerValue(utils_1.BigNumber.ROUND_DOWN);
        var fillableInput = input.minus(filledInput);
        var fillableOutput = output.minus(filledOutput);
        var makerAssetAmount = side === types_1.MarketOperation.Sell ? output : input;
        var takerAssetAmount = side === types_1.MarketOperation.Sell ? input : output;
        var fillableMakerAssetAmount = side === types_1.MarketOperation.Sell ? fillableOutput : fillableInput;
        var fillableTakerAssetAmount = side === types_1.MarketOperation.Sell ? fillableInput : fillableOutput;
        var takerFee = utils_1.BigNumber.max(takerInputFee, takerOutputFee);
        var takerFeeAssetData = '0x';
        if (!takerInputFee.eq(0)) {
            takerFeeAssetData = side === types_1.MarketOperation.Sell ? DEFAULT_TAKER_ASSET_DATA : DEFAULT_MAKER_ASSET_DATA;
        }
        else if (!takerOutputFee.eq(0)) {
            takerFeeAssetData = side === types_1.MarketOperation.Sell ? DEFAULT_MAKER_ASSET_DATA : DEFAULT_TAKER_ASSET_DATA;
        }
        var fillableTakerFeeAmount = fillableTakerAssetAmount
            .div(takerAssetAmount)
            .times(takerFee)
            .integerValue(utils_1.BigNumber.ROUND_DOWN);
        return {
            makerAssetAmount: makerAssetAmount,
            takerAssetAmount: takerAssetAmount,
            fillableTakerAssetAmount: fillableTakerAssetAmount,
            fillableMakerAssetAmount: fillableMakerAssetAmount,
            fillableTakerFeeAmount: fillableTakerFeeAmount,
            takerFee: takerFee,
            takerFeeAssetData: takerFeeAssetData,
            fills: createOrderCollapsedFills(fillableInput, fillableOutput, fillsCount),
            chainId: 1,
            exchangeAddress: NULL_ADDRESS,
            expirationTimeSeconds: ZERO,
            feeRecipientAddress: NULL_ADDRESS,
            senderAddress: NULL_ADDRESS,
            makerAddress: NULL_ADDRESS,
            takerAddress: NULL_ADDRESS,
            makerAssetData: DEFAULT_MAKER_ASSET_DATA,
            takerAssetData: DEFAULT_TAKER_ASSET_DATA,
            makerFeeAssetData: '0x',
            salt: ZERO,
            makerFee: ZERO,
            signature: '0x',
        };
    }
    function createOrderCollapsedFills(input, output, count) {
        var inputs = subdivideAmount(input, count);
        var outputs = subdivideAmount(output, count);
        return _.times(count, function (i) {
            var subFillInputs = subdivideAmount(inputs[i], count);
            var subFillOutputs = subdivideAmount(outputs[i], count);
            return {
                source: types_2.ERC20BridgeSource.Native,
                input: inputs[i],
                output: outputs[i],
                subFills: _.times(count, function (j) { return ({
                    input: subFillInputs[j],
                    output: subFillOutputs[j],
                }); }),
            };
        });
    }
    function countCollapsedFills(fillOrders) {
        var e_1, _a, e_2, _b;
        var count = 0;
        if (fillOrders[0].fills) {
            var orders = fillOrders;
            try {
                for (var orders_1 = __values(orders), orders_1_1 = orders_1.next(); !orders_1_1.done; orders_1_1 = orders_1.next()) {
                    var o = orders_1_1.value;
                    count += o.fills.length;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (orders_1_1 && !orders_1_1.done && (_a = orders_1.return)) _a.call(orders_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            var orders = fillOrders;
            try {
                for (var orders_2 = __values(orders), orders_2_1 = orders_2.next(); !orders_2_1.done; orders_2_1 = orders_2.next()) {
                    var fo = orders_2_1.value;
                    count += fo.order.fills.length;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (orders_2_1 && !orders_2_1.done && (_b = orders_2.return)) _b.call(orders_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return count;
    }
    function randomSide() {
        return _.sampleSize(Object.values(types_1.MarketOperation), 1)[0];
    }
    function getRandomOrderSize() {
        return contracts_test_utils_1.getRandomInteger('100e18', '1000e18');
    }
    function getRandomFeeRate() {
        return _.random(0.01, 0.25, true);
    }
    function assertEqualRates(actual, expected) {
        contracts_test_utils_1.expect(new utils_1.BigNumber(actual).times(1e4).integerValue()).to.bignumber.eq(new utils_1.BigNumber(expected).times(1e4).integerValue());
    }
    function subdivideAmount(amount, count) {
        var amounts = [];
        for (var i = 0; i < count; ++i) {
            var remaining = amount.minus(utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread([0], amounts)));
            if (i !== count - 1) {
                amounts.push(remaining.times(Math.random()).integerValue());
            }
            else {
                amounts.push(remaining.integerValue());
            }
        }
        return amounts;
    }
    function slipOrder(order, orderSlippage, side) {
        var makerScaling = side === types_1.MarketOperation.Sell ? 1 - orderSlippage : 1;
        var takerScaling = side === types_1.MarketOperation.Sell ? 1 : orderSlippage + 1;
        return __assign({}, order, { makerAssetAmount: order.makerAssetAmount.times(makerScaling), fillableMakerAssetAmount: order.fillableMakerAssetAmount.times(makerScaling), takerAssetAmount: order.takerAssetAmount.times(takerScaling), fillableTakerAssetAmount: order.fillableTakerAssetAmount.times(takerScaling) });
    }
    var _a, NULL_ADDRESS, ZERO, ONE, MAKER_TOKEN, TAKER_TOKEN, DEFAULT_MAKER_ASSET_DATA, DEFAULT_TAKER_ASSET_DATA, GAS_SCHEDULE;
    var _this = this;
    return __generator(this, function (_b) {
        NULL_ADDRESS = contracts_test_utils_1.constants.NULL_ADDRESS;
        ZERO = new utils_1.BigNumber(0);
        ONE = new utils_1.BigNumber(1);
        MAKER_TOKEN = contracts_test_utils_1.randomAddress();
        TAKER_TOKEN = contracts_test_utils_1.randomAddress();
        DEFAULT_MAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(MAKER_TOKEN);
        DEFAULT_TAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(TAKER_TOKEN);
        GAS_SCHEDULE = (_a = {}, _a[types_2.ERC20BridgeSource.Native] = 1, _a);
        describe('fillQuoteOrders()', function () {
            describe('single order', function () {
                it('can exactly fill one order', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, fillableInput, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    contracts_test_utils_1.expect(totalFilledInput).to.bignumber.eq(fillableInput);
                    assertRoughlyEquals(totalFilledOutput, fillableOutput);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.eq(fillsCount);
                });
                it('can partially fill one simple order', function () {
                    var side = randomSide();
                    var fillsCount = 1;
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var inputFillAmount = fillableInput.times(2 / 3).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    contracts_test_utils_1.expect(totalFilledInput).to.bignumber.eq(inputFillAmount);
                    var expectedOutputFilledAmount = inputFillAmount
                        .div(fillableInput)
                        .times(fillableOutput)
                        .integerValue();
                    assertRoughlyEquals(totalFilledOutput, expectedOutputFilledAmount);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.eq(1);
                });
                it('can partially fill one batched order', function () {
                    var side = randomSide();
                    var fillsCount = 3;
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var inputFillAmount = fillableInput.times(2 / 3).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    contracts_test_utils_1.expect(totalFilledInput).to.bignumber.eq(inputFillAmount);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.lt(fillableOutput);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.gte(1);
                    contracts_test_utils_1.expect(result.gas).to.lte(fillsCount);
                });
                it('does not over fill one order', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var inputFillAmount = fillableInput.times(3 / 2).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    contracts_test_utils_1.expect(totalFilledInput).to.bignumber.eq(fillableInput);
                    assertRoughlyEquals(totalFilledOutput, fillableOutput);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.eq(fillsCount);
                });
                it('can exactly fill one order with input fees', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    var totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, totalFillableInput, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, totalFillableInput);
                    assertRoughlyEquals(totalFilledOutput, fillableOutput);
                    assertEqualRates(result.inputFee.div(result.input), signedInputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.eq(fillsCount);
                });
                it('can partially fill one order with input fees', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    var totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    var inputFillAmount = totalFillableInput.times(2 / 3).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, inputFillAmount);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.lt(fillableOutput);
                    assertEqualRates(result.inputFee.div(result.input), signedInputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.lte(fillsCount);
                });
                it('does not over fill one order with input fees', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    var totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    var inputFillAmount = totalFillableInput.times(3 / 2).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, totalFillableInput);
                    assertRoughlyEquals(totalFilledOutput, fillableOutput);
                    assertEqualRates(result.inputFee.div(result.input), signedInputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.eq(fillsCount);
                });
                it('can exactly fill one order with output fees', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var outputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var signedOutputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
                    var totalFillableOutput = fillableOutput.times(signedOutputFeeRate + 1).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, fillableInput, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, fillableInput);
                    assertRoughlyEquals(totalFilledOutput, totalFillableOutput);
                    assertEqualRates(result.outputFee.div(result.output), signedOutputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.eq(fillsCount);
                });
                it('can partial fill one order with output fees', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var outputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var signedOutputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
                    var totalFillableOutput = fillableOutput.times(signedOutputFeeRate + 1).integerValue();
                    var inputFillAmount = fillableInput.times(2 / 3).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, inputFillAmount);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.lt(totalFillableOutput);
                    assertEqualRates(result.outputFee.div(result.output), signedOutputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.lte(fillsCount);
                });
                it('does not over fill one order with output fees', function () {
                    var side = randomSide();
                    var fillsCount = _.random(1, 3);
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var outputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                        fillsCount: fillsCount,
                        count: 1,
                    });
                    var signedOutputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
                    var totalFillableOutput = fillableOutput.times(signedOutputFeeRate + 1).integerValue();
                    var inputFillAmount = fillableInput.times(3 / 2).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, fillableInput);
                    assertRoughlyEquals(totalFilledOutput, totalFillableOutput);
                    assertEqualRates(result.outputFee.div(result.output), signedOutputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(1);
                    contracts_test_utils_1.expect(result.gas).to.eq(fillsCount);
                });
            });
            describe('multiple orders', function () {
                it('can exactly fill orders', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var fillOrders = createQuoteFillOrders({ fillableInput: fillableInput, fillableOutput: fillableOutput, side: side });
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, fillableInput, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    contracts_test_utils_1.expect(totalFilledInput).to.bignumber.eq(fillableInput);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.eq(fillableOutput);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(fillOrders));
                });
                it('can partial fill orders', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFillAmount = fillableInput.times(2 / 3).integerValue();
                    var fillOrders = createQuoteFillOrders({ fillableInput: fillableInput, fillableOutput: fillableOutput, side: side });
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    contracts_test_utils_1.expect(totalFilledInput).to.bignumber.eq(inputFillAmount);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.lt(fillableOutput);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.gte(1);
                });
                it('does not over fill orders', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFillAmount = fillableInput.times(3 / 2).integerValue();
                    var fillOrders = createQuoteFillOrders({ fillableInput: fillableInput, fillableOutput: fillableOutput, side: side });
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    contracts_test_utils_1.expect(totalFilledInput).to.bignumber.eq(fillableInput);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.eq(fillableOutput);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(fillOrders));
                });
                it('can exactly fill orders with input fees', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                    });
                    var signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    var totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, totalFillableInput, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, totalFillableInput);
                    assertRoughlyEquals(totalFilledOutput, fillableOutput);
                    assertEqualRates(result.inputFee.div(result.input), signedInputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(fillOrders));
                });
                it('can partial fill orders with input fees', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                    });
                    var signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    var totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    var inputFillAmount = totalFillableInput.times(2 / 3).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, inputFillAmount);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.lt(fillableOutput);
                    assertEqualRates(result.inputFee.div(result.input), signedInputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.lte(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.lte(countCollapsedFills(fillOrders));
                });
                it('does not over fill orders with input fees', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var inputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                    });
                    var signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    var totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    var inputFillAmount = totalFillableInput.times(3 / 2).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, totalFillableInput);
                    assertRoughlyEquals(totalFilledOutput, fillableOutput);
                    assertEqualRates(result.inputFee.div(result.input), signedInputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(fillOrders));
                });
                it('can exactly fill orders with output fees', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var outputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                    });
                    var signedOutputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
                    var totalFillableOutput = fillableOutput.times(signedOutputFeeRate + 1).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, fillableInput, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, fillableInput);
                    assertRoughlyEquals(totalFilledOutput, totalFillableOutput);
                    assertEqualRates(result.outputFee.div(result.output), signedOutputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(fillOrders));
                });
                it('can partial fill orders with output fees', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var outputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                    });
                    var signedOutputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
                    var totalFillableOutput = fillableOutput.times(signedOutputFeeRate + 1).integerValue();
                    var inputFillAmount = fillableInput.times(2 / 3).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, inputFillAmount);
                    contracts_test_utils_1.expect(totalFilledOutput).to.bignumber.lt(totalFillableOutput);
                    assertEqualRates(result.outputFee.div(result.output), signedOutputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.lte(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.lte(countCollapsedFills(fillOrders));
                });
                it('does not over fill orders with output fees', function () {
                    var side = randomSide();
                    var fillableInput = getRandomOrderSize();
                    var fillableOutput = getRandomOrderSize();
                    var outputFeeRate = getRandomFeeRate();
                    var fillOrders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                    });
                    var signedOutputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
                    var totalFillableOutput = fillableOutput.times(signedOutputFeeRate + 1).integerValue();
                    var inputFillAmount = fillableInput.times(3 / 2).integerValue();
                    var result = quote_simulation_1.fillQuoteOrders(fillOrders, inputFillAmount, ONE, GAS_SCHEDULE);
                    var totalFilledInput = result.input.plus(result.inputFee);
                    var totalFilledOutput = result.output.plus(result.outputFee);
                    assertRoughlyEquals(totalFilledInput, fillableInput);
                    assertRoughlyEquals(totalFilledOutput, totalFillableOutput);
                    assertEqualRates(result.outputFee.div(result.output), signedOutputFeeRate);
                    contracts_test_utils_1.expect(result.protocolFee).to.bignumber.eq(fillOrders.length);
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(fillOrders));
                });
            });
        });
        describe('simulateBestCaseFill()', function () {
            it('ignores order slippage', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, orderSlippage, orders, result;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    orderSlippage = getRandomFeeRate();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                    }).map(function (fo) { return slipOrder(fo.order, orderSlippage, side); });
                    result = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: fillableInput,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    if (side === types_1.MarketOperation.Sell) {
                        contracts_test_utils_1.expect(result.totalMakerAssetAmount).to.be.bignumber.eq(fillableOutput);
                        contracts_test_utils_1.expect(result.totalTakerAssetAmount).to.be.bignumber.eq(fillableInput);
                    }
                    else {
                        contracts_test_utils_1.expect(result.totalMakerAssetAmount).to.be.bignumber.eq(fillableInput);
                        contracts_test_utils_1.expect(result.totalTakerAssetAmount).to.be.bignumber.eq(fillableOutput);
                    }
                    return [2 /*return*/];
                });
            }); });
            it('can fully fill orders', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, orders, result;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                    }).map(function (fo) { return fo.order; });
                    result = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: fillableInput,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(orders));
                    contracts_test_utils_1.expect(result.protocolFeeAmount).to.bignumber.gt(orders.length);
                    contracts_test_utils_1.expect(result.takerFeeTakerAssetAmount).to.bignumber.eq(0);
                    contracts_test_utils_1.expect(result.takerFeeMakerAssetAmount).to.bignumber.eq(0);
                    contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.eq(result.totalMakerAssetAmount);
                    contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.eq(result.totalTakerAssetAmount);
                    if (side === types_1.MarketOperation.Sell) {
                        contracts_test_utils_1.expect(result.totalMakerAssetAmount).to.be.bignumber.eq(fillableOutput);
                        contracts_test_utils_1.expect(result.totalTakerAssetAmount).to.be.bignumber.eq(fillableInput);
                    }
                    else {
                        contracts_test_utils_1.expect(result.totalMakerAssetAmount).to.be.bignumber.eq(fillableInput);
                        contracts_test_utils_1.expect(result.totalTakerAssetAmount).to.be.bignumber.eq(fillableOutput);
                    }
                    return [2 /*return*/];
                });
            }); });
            it('can partial fill orders', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, orders, inputFillAmount, result;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                    }).map(function (fo) { return fo.order; });
                    inputFillAmount = fillableInput.times(Math.random()).integerValue();
                    result = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: inputFillAmount,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    contracts_test_utils_1.expect(result.gas).to.gt(0);
                    contracts_test_utils_1.expect(result.protocolFeeAmount).to.bignumber.gt(0);
                    contracts_test_utils_1.expect(result.takerFeeTakerAssetAmount).to.bignumber.eq(0);
                    contracts_test_utils_1.expect(result.takerFeeMakerAssetAmount).to.bignumber.eq(0);
                    contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.eq(result.totalMakerAssetAmount);
                    contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.eq(result.totalTakerAssetAmount);
                    if (side === types_1.MarketOperation.Sell) {
                        contracts_test_utils_1.expect(result.totalMakerAssetAmount).to.be.bignumber.lt(fillableOutput);
                        contracts_test_utils_1.expect(result.totalTakerAssetAmount).to.be.bignumber.eq(inputFillAmount);
                    }
                    else {
                        contracts_test_utils_1.expect(result.totalMakerAssetAmount).to.be.bignumber.eq(inputFillAmount);
                        contracts_test_utils_1.expect(result.totalTakerAssetAmount).to.be.bignumber.lt(fillableOutput);
                    }
                    return [2 /*return*/];
                });
            }); });
            it('can fully fill orders with input fees', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, inputFeeRate, orders, signedInputFeeRate, totalFillableInput, result;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    inputFeeRate = getRandomFeeRate();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                    }).map(function (fo) { return fo.order; });
                    signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    result = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: totalFillableInput,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(orders));
                    contracts_test_utils_1.expect(result.protocolFeeAmount).to.bignumber.gt(orders.length);
                    if (side === types_1.MarketOperation.Sell) {
                        assertRoughlyEquals(result.takerAssetAmount, fillableInput);
                        assertRoughlyEquals(result.totalTakerAssetAmount, totalFillableInput);
                        assertRoughlyEquals(result.makerAssetAmount, fillableOutput);
                        assertRoughlyEquals(result.totalMakerAssetAmount, fillableOutput);
                        contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.eq(result.totalMakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeMakerAssetAmount).to.bignumber.eq(0);
                    }
                    else {
                        assertRoughlyEquals(result.makerAssetAmount, fillableInput);
                        assertRoughlyEquals(result.totalMakerAssetAmount, totalFillableInput);
                        assertRoughlyEquals(result.takerAssetAmount, fillableOutput);
                        assertRoughlyEquals(result.totalTakerAssetAmount, fillableOutput);
                        contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.eq(result.totalTakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeTakerAssetAmount).to.bignumber.eq(0);
                    }
                    return [2 /*return*/];
                });
            }); });
            it('can partially fill orders with input fees', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, inputFeeRate, orders, signedInputFeeRate, totalFillableInput, inputFillAmount, result;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    inputFeeRate = getRandomFeeRate();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        inputFeeRate: inputFeeRate,
                        side: side,
                    }).map(function (fo) { return fo.order; });
                    signedInputFeeRate = side === types_1.MarketOperation.Sell ? inputFeeRate : -inputFeeRate;
                    totalFillableInput = fillableInput.times(signedInputFeeRate + 1).integerValue();
                    inputFillAmount = totalFillableInput.times(2 / 3).integerValue();
                    result = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: inputFillAmount,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    contracts_test_utils_1.expect(result.gas).to.gt(0);
                    contracts_test_utils_1.expect(result.protocolFeeAmount).to.bignumber.gt(0);
                    if (side === types_1.MarketOperation.Sell) {
                        assertRoughlyEquals(result.totalTakerAssetAmount, inputFillAmount);
                        contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.lt(fillableOutput);
                        contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.eq(result.totalMakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeMakerAssetAmount).to.bignumber.eq(0);
                    }
                    else {
                        assertRoughlyEquals(result.totalMakerAssetAmount, inputFillAmount);
                        contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.lt(fillableOutput);
                        contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.eq(result.totalTakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeTakerAssetAmount).to.bignumber.eq(0);
                    }
                    return [2 /*return*/];
                });
            }); });
            it('can fully fill orders with output fees', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, outputFeeRate, orders, signedOutputFeeRate, totalFillableOutput, result;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    outputFeeRate = getRandomFeeRate();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                    }).map(function (fo) { return fo.order; });
                    signedOutputFeeRate = side === types_1.MarketOperation.Sell ? -outputFeeRate : outputFeeRate;
                    totalFillableOutput = fillableOutput.times(signedOutputFeeRate + 1).integerValue();
                    result = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: fillableInput,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    contracts_test_utils_1.expect(result.gas).to.eq(countCollapsedFills(orders));
                    contracts_test_utils_1.expect(result.protocolFeeAmount).to.bignumber.gt(orders.length);
                    if (side === types_1.MarketOperation.Sell) {
                        assertRoughlyEquals(result.takerAssetAmount, fillableInput);
                        assertRoughlyEquals(result.totalTakerAssetAmount, fillableInput);
                        assertRoughlyEquals(result.makerAssetAmount, fillableOutput);
                        assertRoughlyEquals(result.totalMakerAssetAmount, totalFillableOutput);
                        contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.eq(result.totalTakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeTakerAssetAmount).to.bignumber.eq(0);
                    }
                    else {
                        assertRoughlyEquals(result.makerAssetAmount, fillableInput);
                        assertRoughlyEquals(result.totalMakerAssetAmount, fillableInput);
                        assertRoughlyEquals(result.takerAssetAmount, fillableOutput);
                        assertRoughlyEquals(result.totalTakerAssetAmount, totalFillableOutput);
                        contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.eq(result.totalMakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeMakerAssetAmount).to.bignumber.eq(0);
                    }
                    return [2 /*return*/];
                });
            }); });
            it('can partially fill orders with output fees', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, outputFeeRate, orders, inputFillAmount, result;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    outputFeeRate = getRandomFeeRate();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        outputFeeRate: outputFeeRate,
                        side: side,
                    }).map(function (fo) { return fo.order; });
                    inputFillAmount = fillableInput.times(2 / 3).integerValue();
                    result = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: inputFillAmount,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    contracts_test_utils_1.expect(result.gas).to.gt(0);
                    contracts_test_utils_1.expect(result.protocolFeeAmount).to.bignumber.gt(0);
                    if (side === types_1.MarketOperation.Sell) {
                        assertRoughlyEquals(result.totalTakerAssetAmount, inputFillAmount);
                        contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.lt(fillableOutput);
                        contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.eq(result.totalTakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeTakerAssetAmount).to.bignumber.eq(0);
                    }
                    else {
                        assertRoughlyEquals(result.totalMakerAssetAmount, inputFillAmount);
                        contracts_test_utils_1.expect(result.takerAssetAmount).to.bignumber.lt(fillableOutput);
                        contracts_test_utils_1.expect(result.makerAssetAmount).to.bignumber.eq(result.totalMakerAssetAmount);
                        contracts_test_utils_1.expect(result.takerFeeMakerAssetAmount).to.bignumber.eq(0);
                    }
                    return [2 /*return*/];
                });
            }); });
        });
        describe('simulateWorstCaseFill()', function () {
            it('includes order slippage', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, orderSlippage, orders, result, slippedOutput, slippedOutput;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    orderSlippage = getRandomFeeRate();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                    }).map(function (fo) { return slipOrder(fo.order, orderSlippage, side); });
                    result = quote_simulation_1.simulateWorstCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: fillableInput,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    if (side === types_1.MarketOperation.Sell) {
                        slippedOutput = fillableOutput.times(1 - orderSlippage).integerValue();
                        assertRoughlyEquals(result.totalMakerAssetAmount, slippedOutput);
                        assertRoughlyEquals(result.totalTakerAssetAmount, fillableInput);
                    }
                    else {
                        slippedOutput = fillableOutput.times(orderSlippage + 1).integerValue();
                        assertRoughlyEquals(result.totalMakerAssetAmount, fillableInput);
                        assertRoughlyEquals(result.totalTakerAssetAmount, slippedOutput);
                    }
                    return [2 /*return*/];
                });
            }); });
            it('expects worse price than the best case, even if orders are unsorted', function () { return __awaiter(_this, void 0, void 0, function () {
                var side, fillableInput, fillableOutput, orderSlippage, orders, bestCase, worstCase, bestPrice, worstPrice;
                return __generator(this, function (_a) {
                    side = randomSide();
                    fillableInput = getRandomOrderSize();
                    fillableOutput = getRandomOrderSize();
                    orderSlippage = getRandomFeeRate();
                    orders = createQuoteFillOrders({
                        fillableInput: fillableInput,
                        fillableOutput: fillableOutput,
                        side: side,
                    }).map(function (fo) { return slipOrder(fo.order, orderSlippage, side); });
                    orders = __spread(orders.slice(1), [orders[0]]);
                    bestCase = quote_simulation_1.simulateBestCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: fillableInput,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    worstCase = quote_simulation_1.simulateWorstCaseFill({
                        orders: orders,
                        side: side,
                        fillAmount: fillableInput,
                        gasPrice: ONE,
                        opts: { gasSchedule: GAS_SCHEDULE },
                    });
                    bestPrice = bestCase.makerAssetAmount.div(bestCase.totalTakerAssetAmount);
                    worstPrice = worstCase.makerAssetAmount.div(worstCase.totalTakerAssetAmount);
                    contracts_test_utils_1.expect(worstPrice).to.be.bignumber.lt(bestPrice);
                    return [2 /*return*/];
                });
            }); });
        });
        return [2 /*return*/];
    });
}); }); // tslint:disable: max-file-line-count
//# sourceMappingURL=quote_simulation_test.js.map