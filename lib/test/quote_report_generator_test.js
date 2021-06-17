"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:custom-no-magic-numbers
// tslint:disable:no-object-literal-type-assertion
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const chai = require("chai");
const _ = require("lodash");
require("mocha");
const TypeMoq = require("typemoq");
const types_1 = require("../src/types");
const constants_1 = require("../src/utils/market_operation_utils/constants");
const types_2 = require("../src/utils/market_operation_utils/types");
const quote_report_generator_1 = require("./../src/utils/quote_report_generator");
const chai_setup_1 = require("./utils/chai_setup");
const utils_2 = require("./utils/utils");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const ONE = new utils_1.BigNumber(1);
const GAS_USED = ONE;
function collapsedFillFromNativeOrder(order) {
    const fillData = {
        order: order.order,
        signature: order.signature,
        maxTakerTokenFillAmount: order.fillableTakerAmount,
    };
    return {
        sourcePathId: utils_1.hexUtils.random(),
        source: types_2.ERC20BridgeSource.Native,
        type: order.type,
        input: order.order.takerAmount,
        output: order.order.makerAmount,
        fillData: order.type === protocol_utils_1.FillQuoteTransformerOrderType.Limit
            ? fillData
            : fillData,
        subFills: [],
        gasUsed: order.type === protocol_utils_1.FillQuoteTransformerOrderType.Limit ? constants_1.NATIVE_LIMIT_ORDER_GAS_USED : constants_1.NATIVE_RFQT_GAS_USED,
    };
}
describe('generateQuoteReport', () => __awaiter(void 0, void 0, void 0, function* () {
    it('should generate report properly for sell', () => {
        const marketOperation = types_1.MarketOperation.Sell;
        const kyberSample2 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
            fillData: {},
            gasUsed: GAS_USED,
        };
        const uniswapSample2 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10005),
            output: new utils_1.BigNumber(10006),
            fillData: {},
            gasUsed: GAS_USED,
        };
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
        const uniswap2Fill = Object.assign(Object.assign({}, uniswapSample2), { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
        const kyber2Fill = Object.assign(Object.assign({}, kyberSample2), { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
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
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, nativeOrders, pathGenerated, undefined, quoteRequestor.object);
        const rfqtOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: rfqtOrder1.order.makerAmount,
            takerAmount: rfqtOrder1.order.takerAmount,
            fillableTakerAmount: rfqtOrder1.fillableTakerAmount,
            isRfqt: true,
            makerUri: 'https://rfqt1.provider.club',
            nativeOrder: rfqtOrder1.order,
            fillData: {
                order: rfqtOrder1.order,
            },
            gasUsed: constants_1.NATIVE_RFQT_GAS_USED,
        };
        const rfqtOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: rfqtOrder2.order.makerAmount,
            takerAmount: rfqtOrder2.order.takerAmount,
            fillableTakerAmount: rfqtOrder2.fillableTakerAmount,
            isRfqt: true,
            makerUri: 'https://rfqt2.provider.club',
            nativeOrder: rfqtOrder2.order,
            fillData: {
                order: rfqtOrder2.order,
            },
            gasUsed: constants_1.NATIVE_RFQT_GAS_USED,
        };
        const orderbookOrder2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder2.order.makerAmount,
            takerAmount: orderbookOrder2.order.takerAmount,
            fillableTakerAmount: orderbookOrder2.fillableTakerAmount,
            isRfqt: false,
            fillData: {
                order: orderbookOrder2.order,
            },
            gasUsed: constants_1.NATIVE_LIMIT_ORDER_GAS_USED,
        };
        const uniswap2Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample2.output,
            takerAmount: uniswapSample2.input,
            fillData: {},
            gasUsed: GAS_USED,
        };
        const kyber2Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample2.output,
            takerAmount: kyberSample2.input,
            fillData: {},
            gasUsed: GAS_USED,
        };
        const expectedSourcesConsidered = [rfqtOrder1Source, rfqtOrder2Source];
        const expectedSourcesDelivered = [
            rfqtOrder2Source,
            orderbookOrder2Source,
            uniswap2Source,
            kyber2Source,
        ];
        expectEqualQuoteReportEntries(orderReport.sourcesConsidered, expectedSourcesConsidered, `sourcesConsidered`);
        expectEqualQuoteReportEntries(orderReport.sourcesDelivered, expectedSourcesDelivered, `sourcesDelivered`);
        quoteRequestor.verifyAll();
    });
    it('should handle properly for buy without quoteRequestor', () => {
        const marketOperation = types_1.MarketOperation.Buy;
        const kyberSample1 = {
            source: types_2.ERC20BridgeSource.Kyber,
            input: new utils_1.BigNumber(10000),
            output: new utils_1.BigNumber(10001),
            fillData: {},
            gasUsed: GAS_USED,
        };
        const uniswapSample1 = {
            source: types_2.ERC20BridgeSource.UniswapV2,
            input: new utils_1.BigNumber(10003),
            output: new utils_1.BigNumber(10004),
            fillData: {},
            gasUsed: GAS_USED,
        };
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
        const uniswap1Fill = Object.assign(Object.assign({}, uniswapSample1), { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
        const kyber1Fill = Object.assign(Object.assign({}, kyberSample1), { subFills: [], sourcePathId: utils_1.hexUtils.random(), type: protocol_utils_1.FillQuoteTransformerOrderType.Bridge });
        const pathGenerated = [orderbookOrder1Fill, uniswap1Fill, kyber1Fill];
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, nativeOrders, pathGenerated);
        const orderbookOrder1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Native,
            makerAmount: orderbookOrder1.order.makerAmount,
            takerAmount: orderbookOrder1.order.takerAmount,
            fillableTakerAmount: orderbookOrder1.fillableTakerAmount,
            isRfqt: false,
            fillData: {
                order: orderbookOrder1.order,
            },
            gasUsed: constants_1.NATIVE_LIMIT_ORDER_GAS_USED,
        };
        const uniswap1Source = {
            liquiditySource: types_2.ERC20BridgeSource.UniswapV2,
            makerAmount: uniswapSample1.input,
            takerAmount: uniswapSample1.output,
            fillData: {},
            gasUsed: GAS_USED,
        };
        const kyber1Source = {
            liquiditySource: types_2.ERC20BridgeSource.Kyber,
            makerAmount: kyberSample1.input,
            takerAmount: kyberSample1.output,
            fillData: {},
            gasUsed: GAS_USED,
        };
        // No order is considered here because only Native RFQ orders are considered.
        const expectedSourcesConsidered = [];
        const expectedSourcesDelivered = [orderbookOrder1Source, uniswap1Source, kyber1Source];
        expectEqualQuoteReportEntries(orderReport.sourcesConsidered, expectedSourcesConsidered, `sourcesConsidered`);
        expectEqualQuoteReportEntries(orderReport.sourcesDelivered, expectedSourcesDelivered, `sourcesDelivered`);
    });
    it('should correctly generate report for a two-hop quote', () => {
        const marketOperation = types_1.MarketOperation.Sell;
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
                handleCallResults: _callResults => ({ gasUsed: [], samples: [new utils_1.BigNumber(1337)] }),
                handleRevert: _c => ({ gasUsed: [], samples: [] }),
            },
            secondHopSource: {
                source: types_2.ERC20BridgeSource.Curve,
                fillData: {},
                encodeCall: () => '',
                handleCallResults: _callResults => ({ gasUsed: [], samples: [new utils_1.BigNumber(1337)] }),
                handleRevert: _c => ({ gasUsed: [], samples: [] }),
            },
        };
        const twoHopSample = {
            source: types_2.ERC20BridgeSource.MultiHop,
            input: new utils_1.BigNumber(3005),
            output: new utils_1.BigNumber(3006),
            fillData: twoHopFillData,
            gasUsed: GAS_USED,
        };
        const orderReport = quote_report_generator_1.generateQuoteReport(marketOperation, [orderbookOrder1], twoHopSample);
        const twoHopSource = {
            liquiditySource: types_2.ERC20BridgeSource.MultiHop,
            makerAmount: twoHopSample.output,
            takerAmount: twoHopSample.input,
            hopSources: [types_2.ERC20BridgeSource.Balancer, types_2.ERC20BridgeSource.Curve],
            fillData: twoHopFillData,
            gasUsed: GAS_USED,
        };
        // No entry is present in considered because No RFQ orders were reported.
        const expectedSourcesConsidered = [];
        expectEqualQuoteReportEntries(orderReport.sourcesConsidered, expectedSourcesConsidered, `sourcesConsidered`);
        expect(orderReport.sourcesDelivered.length).to.eql(1);
        expect(orderReport.sourcesDelivered[0]).to.deep.equal(twoHopSource);
    });
}));
function expectEqualQuoteReportEntries(actual, expected, variableName = 'quote report entries') {
    expect(actual.length).to.eql(expected.length);
    actual.forEach((actualEntry, idx) => {
        const expectedEntry = expected[idx];
        // remove fillable values
        if (actualEntry.liquiditySource === types_2.ERC20BridgeSource.Native) {
            actualEntry.fillData.order = _.omit(actualEntry.fillData.order, [
                'fillableMakerAmount',
                'fillableTakerAmount',
                'fillableTakerFeeAmount',
            ]);
            expect(actualEntry.fillData.order).to.eql(
            // tslint:disable-next-line:no-unnecessary-type-assertion
            expectedEntry.fillData.order, `${actualEntry.liquiditySource} ${variableName} incorrect at index ${idx}`);
        }
        expect(_.omit(actualEntry, 'fillData')).to.eql(_.omit(expectedEntry, 'fillData'), `${actualEntry.liquiditySource} ${variableName} incorrect at index ${idx}`);
    });
}
//# sourceMappingURL=quote_report_generator_test.js.map