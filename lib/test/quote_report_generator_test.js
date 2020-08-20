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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:custom-no-magic-numbers
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var chai = require("chai");
var _ = require("lodash");
require("mocha");
var TypeMoq = require("typemoq");
var types_1 = require("../src/types");
var types_2 = require("../src/utils/market_operation_utils/types");
var quote_report_generator_1 = require("./../src/utils/quote_report_generator");
var chai_setup_1 = require("./utils/chai_setup");
var test_order_factory_1 = require("./utils/test_order_factory");
chai_setup_1.chaiSetup.configure();
var expect = chai.expect;
var collapsedFillFromNativeOrder = function (order) {
    return {
        sourcePathId: utils_1.hexUtils.random(),
        source: types_2.ERC20BridgeSource.Native,
        input: order.takerAssetAmount,
        output: order.makerAssetAmount,
        fillData: {
            order: __assign({}, order, { fillableMakerAssetAmount: new utils_1.BigNumber(1), fillableTakerAssetAmount: new utils_1.BigNumber(1), fillableTakerFeeAmount: new utils_1.BigNumber(1) }),
        },
        subFills: [],
    };
};
describe('QuoteReportGenerator', function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        describe('generateReport', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it('should generate report properly for sell', function () {
                    var marketOperation = types_1.MarketOperation.Sell;
                    var kyberSample1 = {
                        source: types_2.ERC20BridgeSource.Kyber,
                        input: new utils_1.BigNumber(10000),
                        output: new utils_1.BigNumber(10001),
                    };
                    var kyberSample2 = {
                        source: types_2.ERC20BridgeSource.Kyber,
                        input: new utils_1.BigNumber(10003),
                        output: new utils_1.BigNumber(10004),
                    };
                    var uniswapSample1 = {
                        source: types_2.ERC20BridgeSource.UniswapV2,
                        input: new utils_1.BigNumber(10003),
                        output: new utils_1.BigNumber(10004),
                    };
                    var uniswapSample2 = {
                        source: types_2.ERC20BridgeSource.UniswapV2,
                        input: new utils_1.BigNumber(10005),
                        output: new utils_1.BigNumber(10006),
                    };
                    var dexQuotes = [kyberSample1, kyberSample2, uniswapSample1, uniswapSample2];
                    var orderbookOrder1FillableAmount = new utils_1.BigNumber(1000);
                    var orderbookOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                        signature: 'orderbookOrder1',
                        takerAssetAmount: orderbookOrder1FillableAmount,
                    });
                    var orderbookOrder2FillableAmount = new utils_1.BigNumber(99);
                    var orderbookOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                        signature: 'orderbookOrder2',
                        takerAssetAmount: orderbookOrder2FillableAmount.plus(99),
                    });
                    var rfqtOrder1FillableAmount = new utils_1.BigNumber(100);
                    var rfqtOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                        signature: 'rfqtOrder1',
                        takerAssetAmount: rfqtOrder1FillableAmount,
                    });
                    var rfqtOrder2FillableAmount = new utils_1.BigNumber(1001);
                    var rfqtOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                        signature: 'rfqtOrder2',
                        takerAssetAmount: rfqtOrder2FillableAmount.plus(100),
                    });
                    var nativeOrders = [orderbookOrder1, rfqtOrder1, rfqtOrder2, orderbookOrder2];
                    var orderFillableAmounts = [
                        orderbookOrder1FillableAmount,
                        rfqtOrder1FillableAmount,
                        rfqtOrder2FillableAmount,
                        orderbookOrder2FillableAmount,
                    ];
                    // generate path
                    var uniswap2Fill = __assign({}, uniswapSample2, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
                    var kyber2Fill = __assign({}, kyberSample2, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
                    var orderbookOrder2Fill = collapsedFillFromNativeOrder(orderbookOrder2);
                    var rfqtOrder2Fill = collapsedFillFromNativeOrder(rfqtOrder2);
                    var pathGenerated = [rfqtOrder2Fill, orderbookOrder2Fill, uniswap2Fill, kyber2Fill];
                    // quote generator mock
                    var quoteRequestor = TypeMoq.Mock.ofType();
                    quoteRequestor
                        .setup(function (qr) { return qr.getMakerUriForOrderHash(order_utils_1.orderHashUtils.getOrderHash(orderbookOrder2)); })
                        .returns(function () {
                        return undefined;
                    })
                        .verifiable(TypeMoq.Times.atLeastOnce());
                    quoteRequestor
                        .setup(function (qr) { return qr.getMakerUriForOrderHash(order_utils_1.orderHashUtils.getOrderHash(rfqtOrder1)); })
                        .returns(function () {
                        return 'https://rfqt1.provider.club';
                    })
                        .verifiable(TypeMoq.Times.atLeastOnce());
                    quoteRequestor
                        .setup(function (qr) { return qr.getMakerUriForOrderHash(order_utils_1.orderHashUtils.getOrderHash(rfqtOrder2)); })
                        .returns(function () {
                        return 'https://rfqt2.provider.club';
                    })
                        .verifiable(TypeMoq.Times.atLeastOnce());
                    var orderReport = new quote_report_generator_1.QuoteReportGenerator(marketOperation, dexQuotes, nativeOrders, orderFillableAmounts, pathGenerated, quoteRequestor.object).generateReport();
                    var rfqtOrder1Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Native,
                        makerAmount: rfqtOrder1.makerAssetAmount,
                        takerAmount: rfqtOrder1.takerAssetAmount,
                        orderHash: order_utils_1.orderHashUtils.getOrderHash(rfqtOrder1),
                        nativeOrder: rfqtOrder1,
                        fillableTakerAmount: rfqtOrder1FillableAmount,
                        isRfqt: true,
                        makerUri: 'https://rfqt1.provider.club',
                    };
                    var rfqtOrder2Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Native,
                        makerAmount: rfqtOrder2.makerAssetAmount,
                        takerAmount: rfqtOrder2.takerAssetAmount,
                        orderHash: order_utils_1.orderHashUtils.getOrderHash(rfqtOrder2),
                        nativeOrder: rfqtOrder2,
                        fillableTakerAmount: rfqtOrder2FillableAmount,
                        isRfqt: true,
                        makerUri: 'https://rfqt2.provider.club',
                    };
                    var orderbookOrder1Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Native,
                        makerAmount: orderbookOrder1.makerAssetAmount,
                        takerAmount: orderbookOrder1.takerAssetAmount,
                        orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder1),
                        nativeOrder: orderbookOrder1,
                        fillableTakerAmount: orderbookOrder1FillableAmount,
                        isRfqt: false,
                    };
                    var orderbookOrder2Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Native,
                        makerAmount: orderbookOrder2.makerAssetAmount,
                        takerAmount: orderbookOrder2.takerAssetAmount,
                        orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder2),
                        nativeOrder: orderbookOrder2,
                        fillableTakerAmount: orderbookOrder2FillableAmount,
                        isRfqt: false,
                    };
                    var uniswap1Source = {
                        liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
                        makerAmount: uniswapSample1.output,
                        takerAmount: uniswapSample1.input,
                    };
                    var uniswap2Source = {
                        liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
                        makerAmount: uniswapSample2.output,
                        takerAmount: uniswapSample2.input,
                    };
                    var kyber1Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Kyber,
                        makerAmount: kyberSample1.output,
                        takerAmount: kyberSample1.input,
                    };
                    var kyber2Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Kyber,
                        makerAmount: kyberSample2.output,
                        takerAmount: kyberSample2.input,
                    };
                    var expectedSourcesConsidered = [
                        kyber1Source,
                        kyber2Source,
                        uniswap1Source,
                        uniswap2Source,
                        orderbookOrder1Source,
                        rfqtOrder1Source,
                        rfqtOrder2Source,
                        orderbookOrder2Source,
                    ];
                    expect(orderReport.sourcesConsidered.length).to.eql(expectedSourcesConsidered.length);
                    orderReport.sourcesConsidered.forEach(function (actualSourcesConsidered, idx) {
                        var expectedSourceConsidered = expectedSourcesConsidered[idx];
                        expect(actualSourcesConsidered).to.eql(expectedSourceConsidered, "sourceConsidered incorrect at index " + idx);
                    });
                    var expectedSourcesDelivered = [
                        rfqtOrder2Source,
                        orderbookOrder2Source,
                        uniswap2Source,
                        kyber2Source,
                    ];
                    expect(orderReport.sourcesDelivered.length).to.eql(expectedSourcesDelivered.length);
                    orderReport.sourcesDelivered.forEach(function (actualSourceDelivered, idx) {
                        var expectedSourceDelivered = expectedSourcesDelivered[idx];
                        // remove fillable values
                        if (actualSourceDelivered.liquiditySource === types_2.ERC20BridgeSource.Native) {
                            actualSourceDelivered.nativeOrder = _.omit(actualSourceDelivered.nativeOrder, [
                                'fillableMakerAssetAmount',
                                'fillableTakerAssetAmount',
                                'fillableTakerFeeAmount',
                            ]);
                        }
                        expect(actualSourceDelivered).to.eql(expectedSourceDelivered, "sourceDelivered incorrect at index " + idx);
                    });
                    quoteRequestor.verifyAll();
                });
                it('should handle properly for buy without quoteRequestor', function () {
                    var marketOperation = types_1.MarketOperation.Buy;
                    var kyberSample1 = {
                        source: types_2.ERC20BridgeSource.Kyber,
                        input: new utils_1.BigNumber(10000),
                        output: new utils_1.BigNumber(10001),
                    };
                    var uniswapSample1 = {
                        source: types_2.ERC20BridgeSource.UniswapV2,
                        input: new utils_1.BigNumber(10003),
                        output: new utils_1.BigNumber(10004),
                    };
                    var dexQuotes = [kyberSample1, uniswapSample1];
                    var orderbookOrder1FillableAmount = new utils_1.BigNumber(1000);
                    var orderbookOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                        signature: 'orderbookOrder1',
                        takerAssetAmount: orderbookOrder1FillableAmount.plus(101),
                    });
                    var orderbookOrder2FillableAmount = new utils_1.BigNumber(5000);
                    var orderbookOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                        signature: 'orderbookOrder2',
                        takerAssetAmount: orderbookOrder2FillableAmount.plus(101),
                    });
                    var nativeOrders = [orderbookOrder1, orderbookOrder2];
                    var orderFillableAmounts = [orderbookOrder1FillableAmount, orderbookOrder2FillableAmount];
                    // generate path
                    var orderbookOrder1Fill = collapsedFillFromNativeOrder(orderbookOrder1);
                    var uniswap1Fill = __assign({}, uniswapSample1, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
                    var kyber1Fill = __assign({}, kyberSample1, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
                    var pathGenerated = [orderbookOrder1Fill, uniswap1Fill, kyber1Fill];
                    var orderReport = new quote_report_generator_1.QuoteReportGenerator(marketOperation, dexQuotes, nativeOrders, orderFillableAmounts, pathGenerated).generateReport();
                    var orderbookOrder1Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Native,
                        makerAmount: orderbookOrder1.makerAssetAmount,
                        takerAmount: orderbookOrder1.takerAssetAmount,
                        orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder1),
                        nativeOrder: orderbookOrder1,
                        fillableTakerAmount: orderbookOrder1FillableAmount,
                        isRfqt: false,
                    };
                    var orderbookOrder2Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Native,
                        makerAmount: orderbookOrder2.makerAssetAmount,
                        takerAmount: orderbookOrder2.takerAssetAmount,
                        orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder2),
                        nativeOrder: orderbookOrder2,
                        fillableTakerAmount: orderbookOrder2FillableAmount,
                        isRfqt: false,
                    };
                    var uniswap1Source = {
                        liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
                        makerAmount: uniswapSample1.input,
                        takerAmount: uniswapSample1.output,
                    };
                    var kyber1Source = {
                        liquiditySource: types_2.ERC20BridgeSource.Kyber,
                        makerAmount: kyberSample1.input,
                        takerAmount: kyberSample1.output,
                    };
                    var expectedSourcesConsidered = [
                        kyber1Source,
                        uniswap1Source,
                        orderbookOrder1Source,
                        orderbookOrder2Source,
                    ];
                    expect(orderReport.sourcesConsidered.length).to.eql(expectedSourcesConsidered.length);
                    orderReport.sourcesConsidered.forEach(function (actualSourcesConsidered, idx) {
                        var expectedSourceConsidered = expectedSourcesConsidered[idx];
                        expect(actualSourcesConsidered).to.eql(expectedSourceConsidered, "sourceConsidered incorrect at index " + idx);
                    });
                    var expectedSourcesDelivered = [orderbookOrder1Source, uniswap1Source, kyber1Source];
                    expect(orderReport.sourcesDelivered.length).to.eql(expectedSourcesDelivered.length);
                    orderReport.sourcesDelivered.forEach(function (actualSourceDelivered, idx) {
                        var expectedSourceDelivered = expectedSourcesDelivered[idx];
                        // remove fillable values
                        if (actualSourceDelivered.liquiditySource === types_2.ERC20BridgeSource.Native) {
                            actualSourceDelivered.nativeOrder = _.omit(actualSourceDelivered.nativeOrder, [
                                'fillableMakerAssetAmount',
                                'fillableTakerAssetAmount',
                                'fillableTakerFeeAmount',
                            ]);
                        }
                        expect(actualSourceDelivered).to.eql(expectedSourceDelivered, "sourceDelivered incorrect at index " + idx);
                    });
                });
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=quote_report_generator_test.js.map