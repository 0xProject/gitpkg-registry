"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_utils_1 = require("@0x/protocol-utils");
const _ = require("lodash");
const types_1 = require("../types");
const types_2 = require("./market_operation_utils/types");
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
function generateQuoteReport(marketOperation, dexQuotes, multiHopQuotes, nativeOrders, liquidityDelivered, comparisonPrice, quoteRequestor) {
    const dexReportSourcesConsidered = dexQuotes.map(quote => _dexSampleToReportSource(quote, marketOperation));
    const nativeOrderSourcesConsidered = nativeOrders.map(order => _nativeOrderToReportEntry(order.type, order, order.fillableTakerAmount, comparisonPrice, quoteRequestor));
    const multiHopSourcesConsidered = multiHopQuotes.map(quote => _multiHopSampleToReportSource(quote, marketOperation));
    const sourcesConsidered = [
        ...dexReportSourcesConsidered,
        ...nativeOrderSourcesConsidered,
        ...multiHopSourcesConsidered,
    ];
    let sourcesDelivered;
    if (Array.isArray(liquidityDelivered)) {
        // create easy way to look up fillable amounts
        const nativeOrderSignaturesToFillableAmounts = _.fromPairs(nativeOrders.map(o => {
            return [_nativeDataToId(o), o.fillableTakerAmount];
        }));
        // map sources delivered
        sourcesDelivered = liquidityDelivered.map(collapsedFill => {
            if (_isNativeOrderFromCollapsedFill(collapsedFill)) {
                return _nativeOrderToReportEntry(collapsedFill.type, collapsedFill.fillData, nativeOrderSignaturesToFillableAmounts[_nativeDataToId(collapsedFill.fillData)], comparisonPrice, quoteRequestor);
            }
            else {
                return _dexSampleToReportSource(collapsedFill, marketOperation);
            }
        });
    }
    else {
        sourcesDelivered = [
            // tslint:disable-next-line: no-unnecessary-type-assertion
            _multiHopSampleToReportSource(liquidityDelivered, marketOperation),
        ];
    }
    return {
        sourcesConsidered,
        sourcesDelivered,
    };
}
exports.generateQuoteReport = generateQuoteReport;
function _nativeDataToId(data) {
    const { v, r, s } = data.signature;
    return `${v}${r}${s}`;
}
function _dexSampleToReportSource(ds, marketOperation) {
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
function _multiHopSampleToReportSource(ds, marketOperation) {
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
function _isNativeOrderFromCollapsedFill(cf) {
    const { type } = cf;
    return type === protocol_utils_1.FillQuoteTransformerOrderType.Limit || type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq;
}
function _nativeOrderToReportEntry(type, fillData, fillableAmount, comparisonPrice, quoteRequestor) {
    const nativeOrderBase = {
        liquiditySource: types_2.ERC20BridgeSource.Native,
        makerAmount: fillData.order.makerAmount,
        takerAmount: fillData.order.takerAmount,
        fillableTakerAmount: fillableAmount,
    };
    // if we find this is an rfqt order, label it as such and associate makerUri
    const isRfqt = type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq;
    const rfqtMakerUri = isRfqt ? quoteRequestor.getMakerUriForSignature(fillData.signature) : undefined;
    if (isRfqt) {
        // tslint:disable-next-line: no-object-literal-type-assertion
        return Object.assign({}, nativeOrderBase, { isRfqt: true, makerUri: rfqtMakerUri || '' }, (comparisonPrice ? { comparisonPrice: comparisonPrice.toNumber() } : {}), { fillData });
    }
    else {
        // tslint:disable-next-line: no-object-literal-type-assertion
        return Object.assign({}, nativeOrderBase, { isRfqt: false, fillData });
    }
}
//# sourceMappingURL=quote_report_generator.js.map