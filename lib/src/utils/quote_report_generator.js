"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_utils_1 = require("@0x/protocol-utils");
const types_1 = require("../types");
const types_2 = require("./market_operation_utils/types");
function isFillDataLimitOrder(fillData) {
    return fillData.order.txOrigin === undefined;
}
function getOrder(fillData) {
    return isFillDataLimitOrder(fillData) ? new protocol_utils_1.LimitOrder(fillData.order) : new protocol_utils_1.RfqOrder(fillData.order);
}
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
function generateQuoteReport(marketOperation, dexQuotes, multiHopQuotes, nativeOrders, liquidityDelivered, comparisonPrice, quoteRequestor) {
    throw new Error('Bleh');
    // const dexReportSourcesConsidered = dexQuotes.map(quote => _dexSampleToReportSource(quote, marketOperation));
    // const nativeOrderSourcesConsidered = nativeOrders.map(order =>
    //    _nativeOrderToReportSource(
    //        { ...order.order, signature: order.signature },
    //        order.fillableTakerAmount,
    //        comparisonPrice,
    //        quoteRequestor,
    //    ),
    // );
    // const multiHopSourcesConsidered = multiHopQuotes.map(quote =>
    //    _multiHopSampleToReportSource(quote, marketOperation),
    // );
    // const sourcesConsidered = [
    //    ...dexReportSourcesConsidered,
    //    ...nativeOrderSourcesConsidered,
    //    ...multiHopSourcesConsidered,
    // ];
    // let sourcesDelivered;
    // if (Array.isArray(liquidityDelivered)) {
    //    // create easy way to look up fillable amounts
    //    const nativeOrderSignaturesToFillableAmounts = Object.fromEntries(
    //        nativeOrders.map(o => {
    //            return [
    //                o.type === FillQuoteTransformerOrderType.Rfq
    //                    ? new RfqOrder(o.order).getHash()
    //                    : new LimitOrder(o.order).getHash(),
    //                o.fillableTakerAmount,
    //            ];
    //        }),
    //    );
    //    // map sources delivered
    //    sourcesDelivered = liquidityDelivered.map(collapsedFill => {
    //        const foundNativeOrder = _nativeOrderFromCollapsedFill(collapsedFill);
    //        if (foundNativeOrder) {
    //            return _nativeOrderToReportSource(
    //                foundNativeOrder,
    //                nativeOrderSignaturesToFillableAmounts[getOrder(foundNativeOrder).getHash()],
    //                comparisonPrice,
    //                quoteRequestor,
    //            );
    //        } else {
    //            return _dexSampleToReportSource(collapsedFill, marketOperation);
    //        }
    //    });
    // } else {
    //    sourcesDelivered = [_multiHopSampleToReportSource(liquidityDelivered, marketOperation)];
    // }
    // return {
    //    sourcesConsidered,
    //    sourcesDelivered,
    // };
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
function _nativeOrderFromCollapsedFill(cf) {
    // Cast as NativeCollapsedFill and then check
    // if it really is a NativeCollapsedFill
    const possibleNativeCollapsedFill = cf;
    if (possibleNativeCollapsedFill.fillData) {
        return possibleNativeCollapsedFill.fillData;
    }
    else {
        return undefined;
    }
}
function _nativeOrderToReportEntry(nativeOrder, fillableAmount, comparisonPrice, quoteRequestor) {
    const nativeOrderBase = {
        liquiditySource: types_2.ERC20BridgeSource.Native,
        makerAmount: nativeOrder.order.makerAmount,
        takerAmount: nativeOrder.order.takerAmount,
        fillableTakerAmount: fillableAmount,
    };
    // if we find this is an rfqt order, label it as such and associate makerUri
    const isRfqt = quoteRequestor &&
        // TODO jacob HACK
        nativeOrder.order.txOrigin;
    const rfqtMakerUri = isRfqt ? quoteRequestor.getMakerUriForSignature(nativeOrder.signature) : undefined;
    if (isRfqt) {
        return Object.assign({}, nativeOrderBase, { nativeOrder: nativeOrder.order, isRfqt: true, makerUri: rfqtMakerUri || '', comparisonPrice: comparisonPrice ? comparisonPrice.toNumber() : comparisonPrice });
    }
    else {
        return Object.assign({}, nativeOrderBase, { isRfqt: false, nativeOrder: nativeOrder.order });
    }
}
//# sourceMappingURL=quote_report_generator.js.map