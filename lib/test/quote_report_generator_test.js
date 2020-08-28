"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:custom-no-magic-numbers
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const chai = require("chai");
const _ = require("lodash");
require("mocha");
const TypeMoq = require("typemoq");
const types_1 = require("../src/types");
const types_2 = require("../src/utils/market_operation_utils/types");
const quote_report_generator_1 = require("./../src/utils/quote_report_generator");
const chai_setup_1 = require("./utils/chai_setup");
const test_order_factory_1 = require("./utils/test_order_factory");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const collapsedFillFromNativeOrder = (order) => {
    return {
        sourcePathId: utils_1.hexUtils.random(),
        source: types_2.ERC20BridgeSource.Native,
        input: order.takerAssetAmount,
        output: order.makerAssetAmount,
        fillData: {
            order: Object.assign({}, order, { fillableMakerAssetAmount: new utils_1.BigNumber(1), fillableTakerAssetAmount: new utils_1.BigNumber(1), fillableTakerFeeAmount: new utils_1.BigNumber(1) }),
        },
        subFills: [],
    };
};
describe('generateQuoteReport', () => __awaiter(this, void 0, void 0, function* () {
    it('should generate report properly for sell', () => {
        const marketOperation = types_1.MarketOperation.Sell;
        const kyberSample1 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10000),
            output: new utils_1.BigNumber(10001),
        };
        const kyberSample2 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
        };
        const uniswapSample1 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
        };
        const uniswapSample2 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10005),
            output: new utils_1.BigNumber(10006),
        };
        const dexQuotes = [kyberSample1, kyberSample2, uniswapSample1, uniswapSample2];
        const orderbookOrder1FillableAmount = new utils_1.BigNumber(1000);
        const orderbookOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            signature: 'orderbookOrder1',
            takerAssetAmount: orderbookOrder1FillableAmount,
        });
        const orderbookOrder2FillableAmount = new utils_1.BigNumber(99);
        const orderbookOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            signature: 'orderbookOrder2',
            takerAssetAmount: orderbookOrder2FillableAmount.plus(99),
        });
        const rfqtOrder1FillableAmount = new utils_1.BigNumber(100);
        const rfqtOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            signature: 'rfqtOrder1',
            takerAssetAmount: rfqtOrder1FillableAmount,
        });
        const rfqtOrder2FillableAmount = new utils_1.BigNumber(1001);
        const rfqtOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            signature: 'rfqtOrder2',
            takerAssetAmount: rfqtOrder2FillableAmount.plus(100),
        });
        const nativeOrders = [orderbookOrder1, rfqtOrder1, rfqtOrder2, orderbookOrder2];
        const orderFillableAmounts = [
            orderbookOrder1FillableAmount,
            rfqtOrder1FillableAmount,
            rfqtOrder2FillableAmount,
            orderbookOrder2FillableAmount,
        ];
        // generate path
        const uniswap2Fill = Object.assign({}, uniswapSample2, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
        const kyber2Fill = Object.assign({}, kyberSample2, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
        const orderbookOrder2Fill = collapsedFillFromNativeOrder(orderbookOrder2);
        const rfqtOrder2Fill = collapsedFillFromNativeOrder(rfqtOrder2);
        const pathGenerated = [rfqtOrder2Fill, orderbookOrder2Fill, uniswap2Fill, kyber2Fill];
        // quote generator mock
        const quoteRequestor = TypeMoq.Mock.ofType();
        quoteRequestor
            .setup(qr => qr.getMakerUriForOrderHash(order_utils_1.orderHashUtils.getOrderHash(orderbookOrder2)))
            .returns(() => {
            return undefined;
        })
            .verifiable(TypeMoq.Times.atLeastOnce());
        quoteRequestor
            .setup(qr => qr.getMakerUriForOrderHash(order_utils_1.orderHashUtils.getOrderHash(rfqtOrder1)))
            .returns(() => {
            return 'https://rfqt1.provider.club';
        })
            .verifiable(TypeMoq.Times.atLeastOnce());
        quoteRequestor
            .setup(qr => qr.getMakerUriForOrderHash(order_utils_1.orderHashUtils.getOrderHash(rfqtOrder2)))
            .returns(() => {
            return 'https://rfqt2.provider.club';
        })
            .verifiable(TypeMoq.Times.atLeastOnce());
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, dexQuotes, [], nativeOrders, orderFillableAmounts, pathGenerated, quoteRequestor.object);
        const rfqtOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: rfqtOrder1.makerAssetAmount,
            takerAmount: rfqtOrder1.takerAssetAmount,
            orderHash: order_utils_1.orderHashUtils.getOrderHash(rfqtOrder1),
            nativeOrder: rfqtOrder1,
            fillableTakerAmount: rfqtOrder1FillableAmount,
            isRfqt: true,
            makerUri: 'https://rfqt1.provider.club',
        };
        const rfqtOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: rfqtOrder2.makerAssetAmount,
            takerAmount: rfqtOrder2.takerAssetAmount,
            orderHash: order_utils_1.orderHashUtils.getOrderHash(rfqtOrder2),
            nativeOrder: rfqtOrder2,
            fillableTakerAmount: rfqtOrder2FillableAmount,
            isRfqt: true,
            makerUri: 'https://rfqt2.provider.club',
        };
        const orderbookOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder1.makerAssetAmount,
            takerAmount: orderbookOrder1.takerAssetAmount,
            orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder1),
            nativeOrder: orderbookOrder1,
            fillableTakerAmount: orderbookOrder1FillableAmount,
            isRfqt: false,
        };
        const orderbookOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder2.makerAssetAmount,
            takerAmount: orderbookOrder2.takerAssetAmount,
            orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder2),
            nativeOrder: orderbookOrder2,
            fillableTakerAmount: orderbookOrder2FillableAmount,
            isRfqt: false,
        };
        const uniswap1Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample1.output,
            takerAmount: uniswapSample1.input,
        };
        const uniswap2Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample2.output,
            takerAmount: uniswapSample2.input,
        };
        const kyber1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample1.output,
            takerAmount: kyberSample1.input,
        };
        const kyber2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample2.output,
            takerAmount: kyberSample2.input,
        };
        const expectedSourcesConsidered = [
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
        orderReport.sourcesConsidered.forEach((actualSourcesConsidered, idx) => {
            const expectedSourceConsidered = expectedSourcesConsidered[idx];
            expect(actualSourcesConsidered).to.eql(expectedSourceConsidered, `sourceConsidered incorrect at index ${idx}`);
        });
        const expectedSourcesDelivered = [
            rfqtOrder2Source,
            orderbookOrder2Source,
            uniswap2Source,
            kyber2Source,
        ];
        expect(orderReport.sourcesDelivered.length).to.eql(expectedSourcesDelivered.length);
        orderReport.sourcesDelivered.forEach((actualSourceDelivered, idx) => {
            const expectedSourceDelivered = expectedSourcesDelivered[idx];
            // remove fillable values
            if (actualSourceDelivered.liquiditySource === types_2.ERC20BridgeSource.Native) {
                actualSourceDelivered.nativeOrder = _.omit(actualSourceDelivered.nativeOrder, [
                    'fillableMakerAssetAmount',
                    'fillableTakerAssetAmount',
                    'fillableTakerFeeAmount',
                ]);
            }
            expect(actualSourceDelivered).to.eql(expectedSourceDelivered, `sourceDelivered incorrect at index ${idx}`);
        });
        quoteRequestor.verifyAll();
    });
    it('should handle properly for buy without quoteRequestor', () => {
        const marketOperation = types_1.MarketOperation.Buy;
        const kyberSample1 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10000),
            output: new utils_1.BigNumber(10001),
        };
        const uniswapSample1 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
        };
        const dexQuotes = [kyberSample1, uniswapSample1];
        const orderbookOrder1FillableAmount = new utils_1.BigNumber(1000);
        const orderbookOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            signature: 'orderbookOrder1',
            takerAssetAmount: orderbookOrder1FillableAmount.plus(101),
        });
        const orderbookOrder2FillableAmount = new utils_1.BigNumber(5000);
        const orderbookOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            signature: 'orderbookOrder2',
            takerAssetAmount: orderbookOrder2FillableAmount.plus(101),
        });
        const nativeOrders = [orderbookOrder1, orderbookOrder2];
        const orderFillableAmounts = [orderbookOrder1FillableAmount, orderbookOrder2FillableAmount];
        // generate path
        const orderbookOrder1Fill = collapsedFillFromNativeOrder(orderbookOrder1);
        const uniswap1Fill = Object.assign({}, uniswapSample1, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
        const kyber1Fill = Object.assign({}, kyberSample1, { subFills: [], sourcePathId: utils_1.hexUtils.random() });
        const pathGenerated = [orderbookOrder1Fill, uniswap1Fill, kyber1Fill];
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, dexQuotes, [], nativeOrders, orderFillableAmounts, pathGenerated);
        const orderbookOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder1.makerAssetAmount,
            takerAmount: orderbookOrder1.takerAssetAmount,
            orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder1),
            nativeOrder: orderbookOrder1,
            fillableTakerAmount: orderbookOrder1FillableAmount,
            isRfqt: false,
        };
        const orderbookOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder2.makerAssetAmount,
            takerAmount: orderbookOrder2.takerAssetAmount,
            orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder2),
            nativeOrder: orderbookOrder2,
            fillableTakerAmount: orderbookOrder2FillableAmount,
            isRfqt: false,
        };
        const uniswap1Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample1.input,
            takerAmount: uniswapSample1.output,
        };
        const kyber1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample1.input,
            takerAmount: kyberSample1.output,
        };
        const expectedSourcesConsidered = [
            kyber1Source,
            uniswap1Source,
            orderbookOrder1Source,
            orderbookOrder2Source,
        ];
        expect(orderReport.sourcesConsidered.length).to.eql(expectedSourcesConsidered.length);
        orderReport.sourcesConsidered.forEach((actualSourcesConsidered, idx) => {
            const expectedSourceConsidered = expectedSourcesConsidered[idx];
            expect(actualSourcesConsidered).to.eql(expectedSourceConsidered, `sourceConsidered incorrect at index ${idx}`);
        });
        const expectedSourcesDelivered = [orderbookOrder1Source, uniswap1Source, kyber1Source];
        expect(orderReport.sourcesDelivered.length).to.eql(expectedSourcesDelivered.length);
        orderReport.sourcesDelivered.forEach((actualSourceDelivered, idx) => {
            const expectedSourceDelivered = expectedSourcesDelivered[idx];
            // remove fillable values
            if (actualSourceDelivered.liquiditySource === types_2.ERC20BridgeSource.Native) {
                actualSourceDelivered.nativeOrder = _.omit(actualSourceDelivered.nativeOrder, [
                    'fillableMakerAssetAmount',
                    'fillableTakerAssetAmount',
                    'fillableTakerFeeAmount',
                ]);
            }
            expect(actualSourceDelivered).to.eql(expectedSourceDelivered, `sourceDelivered incorrect at index ${idx}`);
        });
    });
    it('should correctly generate report for a two-hop quote', () => {
        const marketOperation = types_1.MarketOperation.Sell;
        const kyberSample1 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10000),
            output: new utils_1.BigNumber(10001),
        };
        const orderbookOrder1FillableAmount = new utils_1.BigNumber(1000);
        const orderbookOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            signature: 'orderbookOrder1',
            takerAssetAmount: orderbookOrder1FillableAmount.plus(101),
        });
        const twoHopSample = {
            source: types_2.ERC20BridgeSource.MultiHop,
            input: new utils_1.BigNumber(3005),
            output: new utils_1.BigNumber(3006),
            fillData: {
                intermediateToken: utils_1.hexUtils.random(20),
                firstHopSource: {
                    source: types_2.ERC20BridgeSource.Balancer,
                    encodeCall: () => '',
                    handleCallResults: _callResults => [new utils_1.BigNumber(1337)],
                },
                secondHopSource: {
                    source: types_2.ERC20BridgeSource.Curve,
                    encodeCall: () => '',
                    handleCallResults: _callResults => [new utils_1.BigNumber(1337)],
                },
            },
        };
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, [kyberSample1], [twoHopSample], [orderbookOrder1], [orderbookOrder1FillableAmount], twoHopSample);
        const orderbookOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder1.makerAssetAmount,
            takerAmount: orderbookOrder1.takerAssetAmount,
            orderHash: order_utils_1.orderHashUtils.getOrderHash(orderbookOrder1),
            nativeOrder: orderbookOrder1,
            fillableTakerAmount: orderbookOrder1FillableAmount,
            isRfqt: false,
        };
        const kyber1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample1.output,
            takerAmount: kyberSample1.input,
        };
        const twoHopSource = {
            liquiditySource: types_2.ERC20BridgeSource.MultiHop,
            makerAmount: twoHopSample.output,
            takerAmount: twoHopSample.input,
            hopSources: [types_2.ERC20BridgeSource.Balancer, types_2.ERC20BridgeSource.Curve],
        };
        const expectedSourcesConsidered = [kyber1Source, orderbookOrder1Source, twoHopSource];
        expect(orderReport.sourcesConsidered.length).to.eql(expectedSourcesConsidered.length);
        orderReport.sourcesConsidered.forEach((actualSourcesConsidered, idx) => {
            const expectedSourceConsidered = expectedSourcesConsidered[idx];
            expect(actualSourcesConsidered).to.eql(expectedSourceConsidered, `sourceConsidered incorrect at index ${idx}`);
        });
        expect(orderReport.sourcesDelivered.length).to.eql(1);
        expect(orderReport.sourcesDelivered[0]).to.deep.equal(twoHopSource);
    });
}));
//# sourceMappingURL=quote_report_generator_test.js.map