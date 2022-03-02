"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonifyFillData = exports.indicativeQuoteToReportEntry = exports.nativeOrderToReportEntry = exports.dexSampleToReportSource = exports.generateExtendedQuoteReportSources = exports.generateQuoteReport = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const types_1 = require("../types");
const types_2 = require("./market_operation_utils/types");
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, and the sources ultimately included in the computed quote.
 */
function generateQuoteReport(opts) {
    const { inputToken, outputToken, side } = opts;
    // Only handle direct taker -> maker raw hops.
    const { nativeOrders } = opts.rawHopQuotes
        .filter(h => h.inputToken === inputToken && h.outputToken === outputToken)
        .flat(1)
        .reduce((a, q) => (Object.assign(Object.assign({}, a), { dexQuotes: a.dexQuotes.concat(q.dexQuotes), nativeOrders: a.nativeOrders.concat(q.nativeOrders) })));
    // According to the old code, we only include RFQT samples in quote report?
    const sourcesConsidered = nativeOrders
        .filter(o => o.type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq)
        .map(o => nativeOrderToReportEntry(side, o, opts.comparisonPrice, opts.quoteRequestor));
    let sourcesDelivered;
    if (opts.hops.length === 1) {
        // Single-hop.
        const [hop] = opts.hops;
        sourcesDelivered = hop.orders.map(o => {
            switch (o.type) {
                default: {
                    const [makerAmount, takerAmount] = side === types_1.MarketOperation.Sell
                        ? [o.outputAmount, o.inputAmount]
                        : [o.inputAmount, o.outputAmount];
                    return {
                        makerAmount,
                        takerAmount,
                        liquiditySource: o.source,
                        fillData: {}, // Does this matter?
                    };
                }
                case protocol_utils_1.FillQuoteTransformerOrderType.Limit:
                case protocol_utils_1.FillQuoteTransformerOrderType.Rfq: {
                    return nativeOrderToReportEntry(side, o, opts.comparisonPrice, opts.quoteRequestor);
                }
            }
        });
    }
    else {
        // Multi-hop.
        const firstHop = opts.hops[0];
        const lastHop = opts.hops[opts.hops.length - 1];
        const [makerAmount, takerAmount] = side === types_1.MarketOperation.Sell
            ? [lastHop.outputAmount, firstHop.inputAmount]
            : [firstHop.inputAmount, lastHop.outputAmount];
        sourcesDelivered = [
            {
                makerAmount,
                takerAmount,
                liquiditySource: types_2.ERC20BridgeSource.MultiHop,
                fillData: {},
                hopSources: opts.hops.map(h => h.orders.map(o => o.source)).flat(1),
            },
        ];
    }
    return {
        sourcesConsidered,
        sourcesDelivered,
    };
}
exports.generateQuoteReport = generateQuoteReport;
/**
 * Generates a report of sources considered while computing the optimized
 * swap quote, the sources ultimately included in the computed quote. This
 * extende version incudes all considered quotes, not only native liquidity.
 */
function generateExtendedQuoteReportSources(opts) {
    const { inputToken, outputToken, side } = opts;
    const directHops = opts.rawHopQuotes
        .filter(h => h.inputToken === inputToken && h.outputToken === outputToken)
        .flat(1)
        .reduce((a, q) => (Object.assign(Object.assign({}, a), { dexQuotes: a.dexQuotes.concat(q.dexQuotes), nativeOrders: a.nativeOrders.concat(q.nativeOrders) })));
    const sourcesConsidered = [];
    // Native orders.
    sourcesConsidered.push(...directHops.nativeOrders
        .filter(o => o.type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq)
        .map(o => nativeOrderToReportEntry(side, o, opts.comparisonPrice, opts.quoteRequestor)));
    // Dex quotes.
    sourcesConsidered.push(
    // Only add the last sample that can satisfy the full input amount.
    ...directHops.dexQuotes.map(samples => samples[samples.length - 1])
        .flat(1)
        .filter(s => s.input.gte(opts.amount))
        .map(s => dexSampleToReportSource(side, s)));
    // TODO: MultiHop
    const sourcesConsideredIndexed = sourcesConsidered.map((quote, index) => {
        return Object.assign(Object.assign({}, quote), { quoteEntryIndex: index, isDelivered: false });
    });
    let sourcesDelivered;
    if (opts.hops.length === 1) {
        // Single-hop.
        const [hop] = opts.hops;
        sourcesDelivered = hop.orders.map(o => {
            switch (o.type) {
                default: {
                    const [makerAmount, takerAmount] = side === types_1.MarketOperation.Sell
                        ? [o.outputAmount, o.inputAmount]
                        : [o.inputAmount, o.outputAmount];
                    return {
                        makerAmount,
                        takerAmount,
                        liquiditySource: o.source,
                        fillData: {}, // Does this matter?
                    };
                }
                case protocol_utils_1.FillQuoteTransformerOrderType.Limit:
                case protocol_utils_1.FillQuoteTransformerOrderType.Rfq: {
                    return nativeOrderToReportEntry(side, o, opts.comparisonPrice, opts.quoteRequestor);
                }
            }
        });
    }
    else {
        // Multi-hop.
        const firstHop = opts.hops[0];
        const lastHop = opts.hops[opts.hops.length - 1];
        const [makerAmount, takerAmount] = side === types_1.MarketOperation.Sell
            ? [lastHop.outputAmount, firstHop.inputAmount]
            : [firstHop.inputAmount, lastHop.outputAmount];
        sourcesDelivered = [
            {
                makerAmount,
                takerAmount,
                liquiditySource: types_2.ERC20BridgeSource.MultiHop,
                fillData: {},
                hopSources: opts.hops.map(h => h.orders.map(o => o.source)).flat(1),
            },
        ];
    }
    const sourcesDeliveredIndexed = sourcesDelivered.map((quote, index) => {
        return Object.assign(Object.assign({}, quote), { quoteEntryIndex: index, isDelivered: false });
    });
    return {
        sourcesConsidered: sourcesConsideredIndexed,
        sourcesDelivered: sourcesDeliveredIndexed,
    };
}
exports.generateExtendedQuoteReportSources = generateExtendedQuoteReportSources;
function dexSampleToReportSource(side, sample) {
    const [makerAmount, takerAmount] = side === types_1.MarketOperation.Sell
        ? [sample.output, sample.input]
        : [sample.input, sample.output];
    return {
        makerAmount,
        takerAmount,
        liquiditySource: sample.source,
        fillData: {}, // Does this matter?
    };
}
exports.dexSampleToReportSource = dexSampleToReportSource;
/**
 * Generates a report entry for a native order
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
function nativeOrderToReportEntry(side, order, comparisonPrice, quoteRequestor) {
    let nativeOrder;
    let makerAmount;
    let takerAmount;
    let fillableTakerAmount;
    let signature;
    if (isOptimizedNativeOrder(order)) {
        nativeOrder = order.fillData.order;
        fillableTakerAmount = order.fillData.fillableTakerAmount;
        signature = order.fillData.signature;
        [makerAmount, takerAmount] = side === types_1.MarketOperation.Sell
            ? [order.outputAmount, order.outputAmount]
            : [order.inputAmount, order.outputAmount];
    }
    else {
        nativeOrder = order.order;
        fillableTakerAmount = order.fillableTakerAmount;
        signature = order.signature;
        [makerAmount, takerAmount] = [nativeOrder.makerAmount, nativeOrder.takerAmount];
    }
    const isRFQ = order.type === protocol_utils_1.FillQuoteTransformerOrderType.Rfq;
    // if we find this is an rfqt order, label it as such and associate makerUri
    const rfqtMakerUri = isRFQ && quoteRequestor ? quoteRequestor.getMakerUriForSignature(signature) : '';
    return Object.assign({ makerAmount,
        takerAmount,
        isRFQ,
        fillableTakerAmount, liquiditySource: types_2.ERC20BridgeSource.Native, fillData: {} }, (isRFQ
        ? Object.assign({ makerUri: rfqtMakerUri, nativeOrder }, (comparisonPrice ? { comparisonPrice: comparisonPrice.toNumber() } : {})) : {}));
}
exports.nativeOrderToReportEntry = nativeOrderToReportEntry;
function isOptimizedNativeOrder(order) {
    return !!order.fillData;
}
/**
 * Generates a report entry for an indicative RFQ Quote
 * NOTE: this is used for the QuoteReport and quote price comparison data
 */
function indicativeQuoteToReportEntry(order, comparisonPrice) {
    const nativeOrderBase = {
        makerAmount: order.makerAmount,
        takerAmount: order.takerAmount,
        fillableTakerAmount: order.takerAmount,
    };
    // tslint:disable-next-line: no-object-literal-type-assertion
    return Object.assign(Object.assign(Object.assign({ liquiditySource: types_2.ERC20BridgeSource.Native }, nativeOrderBase), { isRFQ: true, makerUri: order.makerUri, fillData: {} }), (comparisonPrice ? { comparisonPrice: comparisonPrice.toNumber() } : {}));
}
exports.indicativeQuoteToReportEntry = indicativeQuoteToReportEntry;
/**
 * For the extended quote report, we output the filldata as JSON
 */
function jsonifyFillData(source) {
    return Object.assign(Object.assign({}, source), { fillData: JSON.stringify(source.fillData, (key, value) => {
            if (key === '_samplerContract') {
                return {};
            }
            else {
                return value;
            }
        }) });
}
exports.jsonifyFillData = jsonifyFillData;
//# sourceMappingURL=quote_report_generator.js.map