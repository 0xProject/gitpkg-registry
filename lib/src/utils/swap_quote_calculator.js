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
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_1 = require("../types");
const constants_2 = require("./market_operation_utils/constants");
const types_2 = require("./market_operation_utils/types");
const quote_simulation_1 = require("./quote_simulation");
const utils_2 = require("./utils");
// TODO(dave4506) How do we want to reintroduce InsufficientAssetLiquidityError?
class SwapQuoteCalculator {
    constructor(marketOperationUtils) {
        this._marketOperationUtils = marketOperationUtils;
    }
    calculateMarketSellSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._calculateSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, types_1.MarketOperation.Sell, opts));
        });
    }
    calculateMarketBuySwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._calculateSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, types_1.MarketOperation.Buy, opts));
        });
    }
    calculateBatchMarketBuySwapQuoteAsync(batchPrunedOrders, takerAssetFillAmounts, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._calculateBatchBuySwapQuoteAsync(batchPrunedOrders, takerAssetFillAmounts, gasPrice, types_1.MarketOperation.Buy, opts));
        });
    }
    getPricesAsync(nativeOrders, makerAmounts, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const pricesBySourceByTokens = yield this._marketOperationUtils.getPricesAsync(nativeOrders, makerAmounts, opts);
            return pricesBySourceByTokens.map(p => {
                if (!p || p.outputs.length === 0) {
                    return undefined;
                }
                const feeSchedule = _.mapValues(opts.feeSchedule, gasCost => (fillData) => gasCost === undefined ? 0 : gasPrice.times(gasCost(fillData)));
                const outputsAdjusted = p.outputs
                    .map(o => (Object.assign({}, o, { 
                    // Buy Input is the requested amount (i.e 1 base units of maker)
                    // Buy output is the amount it costs (i.e 100 base unit of taker)
                    adjustedPrice: p.input.dividedBy(
                    // Add the eth cost in taker base unit to the output
                    o.output.plus(p.ethToTakerRate.times(feeSchedule[o.source](o.fillData))).integerValue()), price: o.output.dividedBy(p.input), gasCost: opts.gasSchedule[o.source](o.fillData) })))
                    .sort((a, b) => b.adjustedPrice.comparedTo(a.adjustedPrice));
                const bestOutput = outputsAdjusted[0];
                console.log({ sellToken: p.sellToken, buyToken: p.buyToken, outputsAdjusted, source: bestOutput.source });
                return {
                    input: p.input,
                    output: bestOutput.output,
                    source: bestOutput.source,
                    sellToken: p.sellToken,
                    buyToken: p.buyToken,
                };
            });
        });
    }
    _calculateBatchBuySwapQuoteAsync(batchPrunedOrders, assetFillAmounts, gasPrice, operation, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const optimizerResults = yield this._marketOperationUtils.getBatchMarketBuyOrdersAsync(batchPrunedOrders, assetFillAmounts, opts);
            const batchSwapQuotes = yield Promise.all(optimizerResults.map((result, i) => __awaiter(this, void 0, void 0, function* () {
                if (result) {
                    const { makerAssetData, takerAssetData } = batchPrunedOrders[i][0];
                    return createSwapQuote(result, makerAssetData, takerAssetData, operation, assetFillAmounts[i], gasPrice, opts.gasSchedule);
                }
                else {
                    return undefined;
                }
            })));
            return batchSwapQuotes;
        });
    }
    _calculateSwapQuoteAsync(prunedOrders, assetFillAmount, gasPrice, operation, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // checks if maker asset is ERC20 and taker asset is ERC20
            if (!utils_2.isSupportedAssetDataInOrders(prunedOrders)) {
                throw Error(types_1.SwapQuoterError.AssetDataUnsupported);
            }
            // since prunedOrders do not have fillState, we will add a buffer of fillable orders to consider that some native are orders are partially filled
            // Scale fees by gas price.
            const _opts = Object.assign({}, opts, { feeSchedule: _.mapValues(opts.feeSchedule, gasCost => (fillData) => gasCost === undefined ? 0 : gasPrice.times(gasCost(fillData))), exchangeProxyOverhead: flags => gasPrice.times(opts.exchangeProxyOverhead(flags)) });
            const result = operation === types_1.MarketOperation.Buy
                ? yield this._marketOperationUtils.getMarketBuyOrdersAsync(prunedOrders, assetFillAmount, _opts)
                : yield this._marketOperationUtils.getMarketSellOrdersAsync(prunedOrders, assetFillAmount, _opts);
            const { makerAssetData, takerAssetData } = prunedOrders[0];
            const swapQuote = createSwapQuote(result, makerAssetData, takerAssetData, operation, assetFillAmount, gasPrice, opts.gasSchedule);
            // Use the raw gas, not scaled by gas price
            const exchangeProxyOverhead = opts.exchangeProxyOverhead(result.sourceFlags).toNumber();
            swapQuote.bestCaseQuoteInfo.gas += exchangeProxyOverhead;
            swapQuote.worstCaseQuoteInfo.gas += exchangeProxyOverhead;
            swapQuote.unoptimizedQuoteInfo.gas += exchangeProxyOverhead;
            return swapQuote;
        });
    }
}
exports.SwapQuoteCalculator = SwapQuoteCalculator;
function createSwapQuote(optimizerResult, makerAssetData, takerAssetData, operation, assetFillAmount, gasPrice, gasSchedule) {
    const { optimizedOrders, quoteReport, sourceFlags, unoptimizedPath, takerAssetToEthRate, makerAssetToEthRate, } = optimizerResult;
    const isTwoHop = sourceFlags === constants_2.SOURCE_FLAGS[types_2.ERC20BridgeSource.MultiHop];
    // Calculate quote info
    const { bestCaseQuoteInfo, worstCaseQuoteInfo, sourceBreakdown } = isTwoHop
        ? calculateTwoHopQuoteInfo(optimizedOrders, operation, gasSchedule)
        : calculateQuoteInfo(optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule);
    // Calculate the unoptimised alternative
    const unoptimizedOrders = unoptimizedPath !== undefined ? unoptimizedPath.orders : [];
    const unoptimizedFillResult = quote_simulation_1.simulateBestCaseFill({
        gasPrice,
        orders: unoptimizedOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { gasSchedule },
    });
    const unoptimizedQuoteInfo = fillResultsToQuoteInfo(unoptimizedFillResult);
    // Put together the swap quote
    const { makerTokenDecimals, takerTokenDecimals } = optimizerResult.marketSideLiquidity;
    const swapQuote = {
        makerAssetData,
        takerAssetData,
        gasPrice,
        orders: optimizedOrders,
        bestCaseQuoteInfo,
        worstCaseQuoteInfo,
        unoptimizedQuoteInfo,
        unoptimizedOrders,
        sourceBreakdown,
        makerTokenDecimals,
        takerTokenDecimals,
        takerAssetToEthRate,
        makerAssetToEthRate,
        quoteReport,
        isTwoHop,
    };
    if (operation === types_1.MarketOperation.Buy) {
        return Object.assign({}, swapQuote, { type: types_1.MarketOperation.Buy, makerAssetFillAmount: assetFillAmount });
    }
    else {
        return Object.assign({}, swapQuote, { type: types_1.MarketOperation.Sell, takerAssetFillAmount: assetFillAmount });
    }
}
function calculateQuoteInfo(optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule) {
    const bestCaseFillResult = quote_simulation_1.simulateBestCaseFill({
        gasPrice,
        orders: optimizedOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { gasSchedule },
    });
    const worstCaseFillResult = quote_simulation_1.simulateWorstCaseFill({
        gasPrice,
        orders: optimizedOrders,
        side: operation,
        fillAmount: assetFillAmount,
        opts: { gasSchedule },
    });
    return {
        bestCaseQuoteInfo: fillResultsToQuoteInfo(bestCaseFillResult),
        worstCaseQuoteInfo: fillResultsToQuoteInfo(worstCaseFillResult),
        sourceBreakdown: getSwapQuoteOrdersBreakdown(bestCaseFillResult.fillAmountBySource),
    };
}
function calculateTwoHopQuoteInfo(optimizedOrders, operation, gasSchedule) {
    const [firstHopOrder, secondHopOrder] = optimizedOrders;
    const [firstHopFill] = firstHopOrder.fills;
    const [secondHopFill] = secondHopOrder.fills;
    const gas = new utils_1.BigNumber(gasSchedule[types_2.ERC20BridgeSource.MultiHop]({
        firstHopSource: _.pick(firstHopFill, 'source', 'fillData'),
        secondHopSource: _.pick(secondHopFill, 'source', 'fillData'),
    })).toNumber();
    return {
        bestCaseQuoteInfo: {
            makerAssetAmount: operation === types_1.MarketOperation.Sell ? secondHopFill.output : secondHopFill.input,
            takerAssetAmount: operation === types_1.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
            totalTakerAssetAmount: operation === types_1.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
            feeTakerAssetAmount: constants_1.constants.ZERO_AMOUNT,
            protocolFeeInWeiAmount: constants_1.constants.ZERO_AMOUNT,
            gas,
        },
        worstCaseQuoteInfo: {
            makerAssetAmount: secondHopOrder.makerAssetAmount,
            takerAssetAmount: firstHopOrder.takerAssetAmount,
            totalTakerAssetAmount: firstHopOrder.takerAssetAmount,
            feeTakerAssetAmount: constants_1.constants.ZERO_AMOUNT,
            protocolFeeInWeiAmount: constants_1.constants.ZERO_AMOUNT,
            gas,
        },
        sourceBreakdown: {
            [types_2.ERC20BridgeSource.MultiHop]: {
                proportion: new utils_1.BigNumber(1),
                intermediateToken: utils_2.getTokenFromAssetData(secondHopOrder.takerAssetData),
                hops: [firstHopFill.source, secondHopFill.source],
            },
        },
    };
}
function getSwapQuoteOrdersBreakdown(fillAmountBySource) {
    const totalFillAmount = utils_1.BigNumber.sum(...Object.values(fillAmountBySource));
    const breakdown = {};
    Object.entries(fillAmountBySource).forEach(([source, fillAmount]) => {
        breakdown[source] = fillAmount.div(totalFillAmount);
    });
    return breakdown;
}
function fillResultsToQuoteInfo(fr) {
    return {
        makerAssetAmount: fr.totalMakerAssetAmount,
        takerAssetAmount: fr.takerAssetAmount,
        totalTakerAssetAmount: fr.totalTakerAssetAmount,
        feeTakerAssetAmount: fr.takerFeeTakerAssetAmount,
        protocolFeeInWeiAmount: fr.protocolFeeAmount,
        gas: fr.gas,
    };
}
//# sourceMappingURL=swap_quote_calculator.js.map