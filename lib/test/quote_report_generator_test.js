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
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const chai = require("chai");
const _ = require("lodash");
require("mocha");
const TypeMoq = require("typemoq");
const types_1 = require("../src/types");
const types_2 = require("../src/utils/market_operation_utils/types");
const quote_report_generator_1 = require("./../src/utils/quote_report_generator");
const chai_setup_1 = require("./utils/chai_setup");
const utils_2 = require("./utils/utils");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
function collapsedFillFromNativeOrder(order) {
    return {
        sourcePathId: utils_1.hexUtils.random(),
        source: types_2.ERC20BridgeSource.Native,
        type: order.type,
        input: order.order.takerAmount,
        output: order.order.makerAmount,
        fillData: {
            order: order.order,
            signature: order.signature,
            maxTakerTokenFillAmount: order.fillableTakerAmount,
        },
        subFills: [],
    };
}
describe('generateQuoteReport', () => __awaiter(this, void 0, void 0, function* () {
    it('should generate report properly for sell', () => {
        const marketOperation = types_1.MarketOperation.Sell;
        const kyberSample1 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10000),
            output: new utils_1.BigNumber(10001),
            fillData: {},
        };
        const kyberSample2 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
            fillData: {},
        };
        const uniswapSample1 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
            fillData: {},
        };
        const uniswapSample2 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10005),
            output: new utils_1.BigNumber(10006),
            fillData: {},
        };
        const dexQuotes = [kyberSample1, kyberSample2, uniswapSample1, uniswapSample2];
        const orderbookOrder1 = {
            order: new protocol_utils_1.LimitOrder({ takerAmount: new utils_1.BigNumber(1000) }),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            fillableTakerAmount: new utils_1.BigNumber(1000),
            fillableMakerAmount: utils_2.getRandomAmount(),
            fillableTakerFeeAmount: utils_2.getRandomAmount(),
            signature: utils_2.getRandomSignature(),
        };
        const orderbookOrder2 = {
            order: new protocol_utils_1.LimitOrder({ takerAmount: new utils_1.BigNumber(198) }),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            fillableTakerAmount: new utils_1.BigNumber(99),
            fillableMakerAmount: utils_2.getRandomAmount(),
            fillableTakerFeeAmount: utils_2.getRandomAmount(),
            signature: utils_2.getRandomSignature(),
        };
        const rfqtOrder1 = {
            order: new protocol_utils_1.RfqOrder({ takerAmount: new utils_1.BigNumber(100) }),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
            fillableTakerAmount: new utils_1.BigNumber(100),
            fillableMakerAmount: utils_2.getRandomAmount(),
            fillableTakerFeeAmount: utils_2.getRandomAmount(),
            signature: utils_2.getRandomSignature(),
        };
        const rfqtOrder2 = {
            order: new protocol_utils_1.RfqOrder({ takerAmount: new utils_1.BigNumber(1101) }),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
            fillableTakerAmount: new utils_1.BigNumber(1001),
            fillableMakerAmount: utils_2.getRandomAmount(),
            fillableTakerFeeAmount: utils_2.getRandomAmount(),
            signature: utils_2.getRandomSignature(),
        };
        const nativeOrders = [
            orderbookOrder1,
            rfqtOrder1,
            rfqtOrder2,
            orderbookOrder2,
        ];
        // generate path
        const uniswap2Fill = Object.assign({}, uniswapSample2, { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
        const kyber2Fill = Object.assign({}, kyberSample2, { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
        const orderbookOrder2Fill = collapsedFillFromNativeOrder(orderbookOrder2);
        const rfqtOrder2Fill = collapsedFillFromNativeOrder(rfqtOrder2);
        const pathGenerated = [rfqtOrder2Fill, orderbookOrder2Fill, uniswap2Fill, kyber2Fill];
        // quote generator mock
        const quoteRequestor = TypeMoq.Mock.ofType();
        quoteRequestor
            .setup(qr => qr.getMakerUriForSignature(rfqtOrder1.signature))
            .returns(() => {
            return 'https://rfqt1.provider.club';
        })
            .verifiable(TypeMoq.Times.atLeastOnce());
        quoteRequestor
            .setup(qr => qr.getMakerUriForSignature(rfqtOrder2.signature))
            .returns(() => {
            return 'https://rfqt2.provider.club';
        })
            .verifiable(TypeMoq.Times.atLeastOnce());
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, dexQuotes, [], nativeOrders, pathGenerated, undefined, quoteRequestor.object);
        const rfqtOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: rfqtOrder1.order.makerAmount,
            takerAmount: rfqtOrder1.order.takerAmount,
            nativeOrder: rfqtOrder1.order,
            fillableTakerAmount: rfqtOrder1.fillableTakerAmount,
            isRfqt: true,
            makerUri: 'https://rfqt1.provider.club',
            fillData: {},
        };
        const rfqtOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: rfqtOrder2.order.makerAmount,
            takerAmount: rfqtOrder2.order.takerAmount,
            nativeOrder: rfqtOrder2.order,
            fillableTakerAmount: rfqtOrder2.fillableTakerAmount,
            isRfqt: true,
            makerUri: 'https://rfqt2.provider.club',
            fillData: {},
        };
        const orderbookOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder1.order.makerAmount,
            takerAmount: orderbookOrder1.order.takerAmount,
            nativeOrder: orderbookOrder1.order,
            fillableTakerAmount: orderbookOrder1.fillableTakerAmount,
            isRfqt: false,
            fillData: orderbookOrder1,
        };
        const orderbookOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder2.order.makerAmount,
            takerAmount: orderbookOrder2.order.takerAmount,
            nativeOrder: orderbookOrder2.order,
            fillableTakerAmount: orderbookOrder2.fillableTakerAmount,
            isRfqt: false,
            fillData: orderbookOrder2,
        };
        const uniswap1Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample1.output,
            takerAmount: uniswapSample1.input,
            fillData: {},
        };
        const uniswap2Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample2.output,
            takerAmount: uniswapSample2.input,
            fillData: {},
        };
        const kyber1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample1.output,
            takerAmount: kyberSample1.input,
            fillData: {},
        };
        const kyber2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample2.output,
            takerAmount: kyberSample2.input,
            fillData: {},
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
        orderReport.sourcesConsidered.forEach((actualSourceConsidered, idx) => {
            const expectedSourceConsidered = expectedSourcesConsidered[idx];
            expect(_.omit(actualSourceConsidered, 'fillData')).to.eql(_.omit(expectedSourceConsidered, 'fillData'), `sourceConsidered incorrect at index ${idx}`);
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
                    'fillableMakerAmount',
                    'fillableTakerAmount',
                    'fillableTakerFeeAmount',
                ]);
            }
            expect(_.omit(actualSourceDelivered, 'fillData')).to.eql(_.omit(expectedSourceDelivered, 'fillData'), `sourceDelivered incorrect at index ${idx}`);
        });
        quoteRequestor.verifyAll();
    });
    it('should handle properly for buy without quoteRequestor', () => {
        const marketOperation = types_1.MarketOperation.Buy;
        const kyberSample1 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10000),
            output: new utils_1.BigNumber(10001),
            fillData: {},
        };
        const uniswapSample1 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
            fillData: {},
        };
        const dexQuotes = [kyberSample1, uniswapSample1];
        const orderbookOrder1 = {
            order: new protocol_utils_1.LimitOrder({ takerAmount: new utils_1.BigNumber(1101) }),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            fillableTakerAmount: new utils_1.BigNumber(1000),
            fillableMakerAmount: utils_2.getRandomAmount(),
            fillableTakerFeeAmount: utils_2.getRandomAmount(),
            signature: utils_2.getRandomSignature(),
        };
        const orderbookOrder2 = {
            order: new protocol_utils_1.LimitOrder({ takerAmount: new utils_1.BigNumber(5101) }),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            fillableTakerAmount: new utils_1.BigNumber(5000),
            fillableMakerAmount: utils_2.getRandomAmount(),
            fillableTakerFeeAmount: utils_2.getRandomAmount(),
            signature: utils_2.getRandomSignature(),
        };
        const nativeOrders = [orderbookOrder1, orderbookOrder2];
        // generate path
        const orderbookOrder1Fill = collapsedFillFromNativeOrder(orderbookOrder1);
        const uniswap1Fill = Object.assign({}, uniswapSample1, { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
        const kyber1Fill = Object.assign({}, kyberSample1, { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
        const pathGenerated = [orderbookOrder1Fill, uniswap1Fill, kyber1Fill];
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, dexQuotes, [], nativeOrders, pathGenerated);
        const orderbookOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder1.order.makerAmount,
            takerAmount: orderbookOrder1.order.takerAmount,
            nativeOrder: orderbookOrder1.order,
            fillableTakerAmount: orderbookOrder1.fillableTakerAmount,
            isRfqt: false,
            fillData: {},
        };
        const orderbookOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder2.order.makerAmount,
            takerAmount: orderbookOrder2.order.takerAmount,
            nativeOrder: orderbookOrder2.order,
            fillableTakerAmount: orderbookOrder2.fillableTakerAmount,
            isRfqt: false,
            fillData: {},
        };
        const uniswap1Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample1.input,
            takerAmount: uniswapSample1.output,
            fillData: {},
        };
        const kyber1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample1.input,
            takerAmount: kyberSample1.output,
            fillData: {},
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
            expect(_.omit(actualSourcesConsidered, 'fillData')).to.eql(_.omit(expectedSourceConsidered, 'fillData'), `sourceConsidered incorrect at index ${idx}`);
        });
        const expectedSourcesDelivered = [orderbookOrder1Source, uniswap1Source, kyber1Source];
        expect(orderReport.sourcesDelivered.length).to.eql(expectedSourcesDelivered.length);
        orderReport.sourcesDelivered.forEach((actualSourceDelivered, idx) => {
            const expectedSourceDelivered = expectedSourcesDelivered[idx];
            // remove fillable values
            // if (actualSourceDelivered.liquiditySource === ERC20BridgeSource.Native) {
            //     actualSourceDelivered.nativeOrder = _.omit(actualSourceDelivered.nativeOrder, [
            //         'fillableMakerAmount',
            //         'fillableTakerAmount',
            //         'fillableTakerFeeAmount',
            //     ]) as NativeOrder;
            // }
            expect(_.omit(actualSourceDelivered, 'fillData')).to.eql(_.omit(expectedSourceDelivered, 'fillData'), `sourceDelivered incorrect at index ${idx}`);
        });
    });
    it('should correctly generate report for a two-hop quote', () => {
        const marketOperation = types_1.MarketOperation.Sell;
        const kyberSample1 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10000),
            output: new utils_1.BigNumber(10001),
            fillData: {},
        };
        const orderbookOrder1 = {
            order: new protocol_utils_1.LimitOrder({ takerAmount: new utils_1.BigNumber(1101) }),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            fillableTakerAmount: new utils_1.BigNumber(1000),
            fillableMakerAmount: utils_2.getRandomAmount(),
            fillableTakerFeeAmount: utils_2.getRandomAmount(),
            signature: utils_2.getRandomSignature(),
        };
        const twoHopFillData = {
            intermediateToken: utils_1.hexUtils.random(20),
            firstHopSource: {
                source: types_2.ERC20BridgeSource.Balancer,
                fillData: {},
                encodeCall: () => '',
                handleCallResults: _callResults => [new utils_1.BigNumber(1337)],
                handleRevert: _c => [],
            },
            secondHopSource: {
                source: types_2.ERC20BridgeSource.Curve,
                fillData: {},
                encodeCall: () => '',
                handleCallResults: _callResults => [new utils_1.BigNumber(1337)],
                handleRevert: _c => [],
            },
        };
        const twoHopSample = {
            source: types_2.ERC20BridgeSource.MultiHop,
            input: new utils_1.BigNumber(3005),
            output: new utils_1.BigNumber(3006),
            fillData: twoHopFillData,
        };
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, [kyberSample1], [twoHopSample], [orderbookOrder1], twoHopSample);
        const orderbookOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder1.order.makerAmount,
            takerAmount: orderbookOrder1.order.takerAmount,
            nativeOrder: orderbookOrder1.order,
            fillableTakerAmount: orderbookOrder1.fillableTakerAmount,
            isRfqt: false,
            fillData: {},
        };
        const kyber1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample1.output,
            takerAmount: kyberSample1.input,
            fillData: {},
        };
        const twoHopSource = {
            liquiditySource: types_2.ERC20BridgeSource.MultiHop,
            makerAmount: twoHopSample.output,
            takerAmount: twoHopSample.input,
            hopSources: [types_2.ERC20BridgeSource.Balancer, types_2.ERC20BridgeSource.Curve],
            fillData: twoHopFillData,
        };
        const expectedSourcesConsidered = [kyber1Source, orderbookOrder1Source, twoHopSource];
        expect(orderReport.sourcesConsidered.length).to.eql(expectedSourcesConsidered.length);
        orderReport.sourcesConsidered.forEach((actualSourcesConsidered, idx) => {
            const expectedSourceConsidered = expectedSourcesConsidered[idx];
            expect(_.omit(actualSourcesConsidered, 'fillData')).to.eql(_.omit(expectedSourceConsidered, 'fillData'), `sourceConsidered incorrect at index ${idx}`);
        });
        expect(orderReport.sourcesDelivered.length).to.eql(1);
        expect(orderReport.sourcesDelivered[0]).to.deep.equal(twoHopSource);
    });
}));
//# sourceMappingURL=quote_report_generator_test.js.map