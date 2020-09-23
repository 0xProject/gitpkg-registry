"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const types_2 = require("./market_operation_utils/types");
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
function generateQuoteReport(marketOperation, dexQuotes, multiHopQuotes, nativeOrders, orderFillableAmounts, liquidityDelivered, quoteRequestor) {
    const dexReportSourcesConsidered = dexQuotes.map(quote => _dexSampleToReportSource(quote, marketOperation));
    const nativeOrderSourcesConsidered = nativeOrders.map((order, idx) => _nativeOrderToReportSource(order, orderFillableAmounts[idx], quoteRequestor));
    const multiHopSourcesConsidered = multiHopQuotes.map(quote => _multiHopSampleToReportSource(quote, marketOperation));
    const sourcesConsidered = [
        ...dexReportSourcesConsidered,
        ...nativeOrderSourcesConsidered,
        ...multiHopSourcesConsidered,
    ];
    let sourcesDelivered;
    if (Array.isArray(liquidityDelivered)) {
        // create easy way to look up fillable amounts
        const nativeOrderSignaturesToFillableAmounts = _nativeOrderSignaturesToFillableAmounts(nativeOrders, orderFillableAmounts);
        // map sources delivered
        sourcesDelivered = liquidityDelivered.map(collapsedFill => {
            const foundNativeOrder = _nativeOrderFromCollapsedFill(collapsedFill);
            if (foundNativeOrder) {
                return _nativeOrderToReportSource(foundNativeOrder, nativeOrderSignaturesToFillableAmounts[foundNativeOrder.signature], quoteRequestor);
            }
            else {
                return _dexSampleToReportSource(collapsedFill, marketOperation);
            }
        });
    }
    else {
        sourcesDelivered = [
            _multiHopSampleToReportSource(liquidityDelivered, marketOperation),
        ];
    }
    return {
        sourcesConsidered,
        sourcesDelivered,
    };
}
exports.generateQuoteReport = generateQuoteReport;
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
        };
    }
    else if (marketOperation === types_1.MarketOperation.Sell) {
        return {
            makerAmount: ds.output,
            takerAmount: ds.input,
            liquiditySource,
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
            hopSources: [firstHop.source, secondHop.source],
        };
    }
    else if (marketOperation === types_1.MarketOperation.Sell) {
        return {
            liquiditySource: types_2.ERC20BridgeSource.MultiHop,
            makerAmount: ds.output,
            takerAmount: ds.input,
            hopSources: [firstHop.source, secondHop.source],
        };
    }
    else {
        throw new Error(`Unexpected marketOperation ${marketOperation}`);
    }
}
function _nativeOrderSignaturesToFillableAmounts(nativeOrders, fillableAmounts) {
    // create easy way to look up fillable amounts based on native order signatures
    if (fillableAmounts.length !== nativeOrders.length) {
        // length mismatch, abort
        throw new Error('orderFillableAmounts must be the same length as nativeOrders');
    }
    const nativeOrderSignaturesToFillableAmounts = {};
    nativeOrders.forEach((nativeOrder, idx) => {
        nativeOrderSignaturesToFillableAmounts[nativeOrder.signature] = fillableAmounts[idx];
    });
    return nativeOrderSignaturesToFillableAmounts;
}
function _nativeOrderFromCollapsedFill(cf) {
    // Cast as NativeCollapsedFill and then check
    // if it really is a NativeCollapsedFill
    const possibleNativeCollapsedFill = cf;
    if (possibleNativeCollapsedFill.fillData && possibleNativeCollapsedFill.fillData.order) {
        return possibleNativeCollapsedFill.fillData.order;
    }
    else {
        return undefined;
    }
}
function _nativeOrderToReportSource(nativeOrder, fillableAmount, quoteRequestor) {
    const nativeOrderBase = {
        liquiditySource: types_2.ERC20BridgeSource.Native,
        makerAmount: nativeOrder.makerAssetAmount,
        takerAmount: nativeOrder.takerAssetAmount,
        fillableTakerAmount: fillableAmount,
        nativeOrder,
    };
    // if we find this is an rfqt order, label it as such and associate makerUri
    const foundRfqtMakerUri = quoteRequestor && quoteRequestor.getMakerUriForOrderSignature(nativeOrder.signature);
    if (foundRfqtMakerUri) {
        const rfqtSource = Object.assign({}, nativeOrderBase, { isRfqt: true, makerUri: foundRfqtMakerUri });
        return rfqtSource;
    }
    else {
        // if it's not an rfqt order, treat as normal
        const regularNativeOrder = Object.assign({}, nativeOrderBase, { isRfqt: false });
        return regularNativeOrder;
    }
}
//# sourceMappingURL=quote_report_generator.js.map