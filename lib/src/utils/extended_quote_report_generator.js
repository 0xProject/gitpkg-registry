"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeOrderToReportEntry = exports.multiHopSampleToReportSource = exports.dexSampleToReportSource = exports.generateExtendedQuoteReport = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const _ = require("lodash");
const types_1 = require("../types");
const types_2 = require("./market_operation_utils/types");
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
function generateExtendedQuoteReport(marketOperation, quotes, liquidityDelivered, comparisonPrice, quoteRequestor) {
    let sourcesConsidered = [];
    // NativeOrders
    sourcesConsidered.push(...quotes.nativeOrders.map(order => nativeOrderToReportEntry(order.type, order, order.fillableTakerAmount, comparisonPrice, quoteRequestor)));
    // Indicative requests do not produce a Quote Report
    // quotes.rfqtIndicativeQuotes
    // MultiHop
    sourcesConsidered.push(...quotes.twoHopQuotes.map(quote => multiHopSampleToReportSource(quote, marketOperation)));
    // Dex Quotes
    sourcesConsidered.push(..._.flatten(quotes.dexQuotes.map(dex => dex.map(quote => dexSampleToReportSource(quote, marketOperation)))));
    let sourcesDelivered;
    if (Array.isArray(liquidityDelivered)) {
        // create easy way to look up fillable amounts
        const nativeOrderSignaturesToFillableAmounts = _.fromPairs(quotes.nativeOrders.map(o => {
            return [_nativeDataToId(o), o.fillableTakerAmount];
        }));
        // map sources delivered
        sourcesDelivered = liquidityDelivered.map(collapsedFill => {
            if (_isNativeOrderFromCollapsedFill(collapsedFill)) {
                return nativeOrderToReportEntry(collapsedFill.type, collapsedFill.fillData, nativeOrderSignaturesToFillableAmounts[_nativeDataToId(collapsedFill.fillData)], comparisonPrice, quoteRequestor);
            }
            else {
                return dexSampleToReportSource(collapsedFill, marketOperation);
            }
        });
    }
    else {
        sourcesDelivered = [
            // tslint:disable-next-line: no-unnecessary-type-assertion
            multiHopSampleToReportSource(liquidityDelivered, marketOperation),
        ];
    }
    return {
        sourcesConsidered,
        sourcesDelivered,
    };
}
exports.generateExtendedQuoteReport = generateExtendedQuoteReport;
function _nativeDataToId(data) {
    const { v, r, s } = data.signature;
    return `${v}${r}${s}`;
}
/**
 * Generates a report sample for a DEX source
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
function dexSampleToReportSource(ds, marketOperation) {
    const liquiditySource = ds.source;
    if (liquiditySource === types_2.ERC20BridgeSource.Native) {
        throw new Error(`Unexpected liquidity source Native`);
    }
    // input and output map to different values
    // based on the market operation
    if (marketOperation === types_1.MarketOperation.Buy) {
        return {
            makerAmount: ds.input,
            takerAmount: ds.output,
            liquiditySource,
            fillData: ds.fillData,
        };
    }
    else if (marketOperation === types_1.MarketOperation.Sell) {
        return {
            makerAmount: ds.output,
            takerAmount: ds.input,
            liquiditySource,
            fillData: ds.fillData,
        };
    }
    else {
        throw new Error(`Unexpected marketOperation ${marketOperation}`);
    }
}
exports.dexSampleToReportSource = dexSampleToReportSource;
/**
 * Generates a report sample for a MultiHop source
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
function multiHopSampleToReportSource(ds, marketOperation) {
    const { firstHopSource: firstHop, secondHopSource: secondHop } = ds.fillData;
    // input and output map to different values
    // based on the market operation
    if (marketOperation === types_1.MarketOperation.Buy) {
        return {
            liquiditySource: types_2.ERC20BridgeSource.MultiHop,
            makerAmount: ds.input,
            takerAmount: ds.output,
            fillData: ds.fillData,
            hopSources: [firstHop.source, secondHop.source],
        };
    }
    else if (marketOperation === types_1.MarketOperation.Sell) {
        return {
            liquiditySource: types_2.ERC20BridgeSource.MultiHop,
            makerAmount: ds.output,
            takerAmount: ds.input,
            fillData: ds.fillData,
            hopSources: [firstHop.source, secondHop.source],
        };
    }
    else {
        throw new Error(`Unexpected marketOperation ${marketOperation}`);
    }
}
exports.multiHopSampleToReportSource = multiHopSampleToReportSource;
function _isNativeOrderFromCollapsedFill(cf) {
    const { type } = cf;
    return type === protocol_utils_1.FillQuoteTransformerOrderType.Limit || type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq;
}
/**
 * Generates a report entry for a native order
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
function nativeOrderToReportEntry(type, fillData, fillableAmount, comparisonPrice, quoteRequestor) {
    const nativeOrderBase = {
        makerAmount: fillData.order.makerAmount,
        takerAmount: fillData.order.takerAmount,
        fillableTakerAmount: fillableAmount,
    };
    // if we find this is an rfqt order, label it as such and associate makerUri
    const isRfqt = type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq;
    const rfqtMakerUri = isRfqt && quoteRequestor ? quoteRequestor.getMakerUriForSignature(fillData.signature) : undefined;
    if (isRfqt) {
        const nativeOrder = fillData.order;
        // tslint:disable-next-line: no-object-literal-type-assertion
        return Object.assign(Object.assign(Object.assign(Object.assign({ liquiditySource: types_2.ERC20BridgeSource.Native }, nativeOrderBase), { isRfqt: true, makerUri: rfqtMakerUri || '' }), (comparisonPrice ? { comparisonPrice: comparisonPrice.toNumber() } : {})), { nativeOrder,
            fillData });
    }
    else {
        // tslint:disable-next-line: no-object-literal-type-assertion
        return Object.assign(Object.assign({ liquiditySource: types_2.ERC20BridgeSource.Native }, nativeOrderBase), { isRfqt: false, fillData });
    }
}
exports.nativeOrderToReportEntry = nativeOrderToReportEntry;
//# sourceMappingURL=extended_quote_report_generator.js.map