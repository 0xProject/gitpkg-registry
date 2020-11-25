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
    _calculateBatchBuySwapQuoteAsync(batchPrunedOrders, assetFillAmounts, gasPrice, operation, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const optimizerResults = yield this._marketOperationUtils.getBatchMarketBuyOrdersAsync(batchPrunedOrders, assetFillAmounts, opts);
            const batchSwapQuotes = yield Promise.all(optimizerResults.map((result, i) => __awaiter(this, void 0, void 0, function* () {
                if (result) {
                    const { ethToOutputRate, ethToInputRate } = result;
                    const { makerAssetData, takerAssetData } = batchPrunedOrders[i][0];
                    return createSwapQuote(makerAssetData, takerAssetData, result.optimizedOrders, operation, assetFillAmounts[i], gasPrice, opts.gasSchedule, result.marketSideLiquidity.makerTokenDecimals, result.marketSideLiquidity.takerTokenDecimals, ethToOutputRate, ethToInputRate);
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
            let optimizedOrders;
            let quoteReport;
            let sourceFlags = 0;
            let makerTokenDecimals;
            let takerTokenDecimals;
            // Scale fees by gas price.
            const _opts = Object.assign({}, opts, { feeSchedule: _.mapValues(opts.feeSchedule, gasCost => (fillData) => gasCost === undefined ? 0 : gasPrice.times(gasCost(fillData))), exchangeProxyOverhead: flags => gasPrice.times(opts.exchangeProxyOverhead(flags)) });
            const result = operation === types_1.MarketOperation.Buy
                ? yield this._marketOperationUtils.getMarketBuyOrdersAsync(prunedOrders, assetFillAmount, _opts)
                : yield this._marketOperationUtils.getMarketSellOrdersAsync(prunedOrders, assetFillAmount, _opts);
            optimizedOrders = result.optimizedOrders;
            quoteReport = result.quoteReport;
            sourceFlags = result.sourceFlags;
            makerTokenDecimals = result.marketSideLiquidity.makerTokenDecimals;
            takerTokenDecimals = result.marketSideLiquidity.takerTokenDecimals;
            const { ethToInputRate, ethToOutputRate } = result;
            // assetData information for the result
            const { makerAssetData, takerAssetData } = prunedOrders[0];
            const swapQuote = sourceFlags === constants_2.SOURCE_FLAGS[types_2.ERC20BridgeSource.MultiHop]
                ? createTwoHopSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, opts.gasSchedule, makerTokenDecimals, takerTokenDecimals, ethToOutputRate, ethToInputRate, quoteReport)
                : createSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, opts.gasSchedule, makerTokenDecimals, takerTokenDecimals, ethToOutputRate, ethToInputRate, quoteReport);
            // Use the raw gas, not scaled by gas price
            const exchangeProxyOverhead = opts.exchangeProxyOverhead(sourceFlags).toNumber();
            swapQuote.bestCaseQuoteInfo.gas += exchangeProxyOverhead;
            swapQuote.worstCaseQuoteInfo.gas += exchangeProxyOverhead;
            return swapQuote;
        });
    }
}
exports.SwapQuoteCalculator = SwapQuoteCalculator;
function createSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule, makerTokenDecimals, takerTokenDecimals, ethToOutputRate, ethToInputRate, quoteReport) {
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
    const quoteBase = {
        takerAssetData,
        makerAssetData,
        gasPrice,
        bestCaseQuoteInfo: fillResultsToQuoteInfo(bestCaseFillResult),
        worstCaseQuoteInfo: fillResultsToQuoteInfo(worstCaseFillResult),
        sourceBreakdown: getSwapQuoteOrdersBreakdown(bestCaseFillResult.fillAmountBySource),
        orders: optimizedOrders,
        quoteReport,
        isTwoHop: false,
        ethToOutputRate,
        ethToInputRate,
    };
    if (operation === types_1.MarketOperation.Buy) {
        return Object.assign({}, quoteBase, { type: types_1.MarketOperation.Buy, makerAssetFillAmount: assetFillAmount, makerTokenDecimals,
            takerTokenDecimals });
    }
    else {
        return Object.assign({}, quoteBase, { type: types_1.MarketOperation.Sell, takerAssetFillAmount: assetFillAmount, makerTokenDecimals,
            takerTokenDecimals });
    }
}
function createTwoHopSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule, makerTokenDecimals, takerTokenDecimals, ethToOutputRate, ethToInputRate, quoteReport) {
    const [firstHopOrder, secondHopOrder] = optimizedOrders;
    const [firstHopFill] = firstHopOrder.fills;
    const [secondHopFill] = secondHopOrder.fills;
    const gas = new utils_1.BigNumber(gasSchedule[types_2.ERC20BridgeSource.MultiHop]({
        firstHopSource: _.pick(firstHopFill, 'source', 'fillData'),
        secondHopSource: _.pick(secondHopFill, 'source', 'fillData'),
    })).toNumber();
    const quoteBase = {
        takerAssetData,
        makerAssetData,
        gasPrice,
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
        orders: optimizedOrders,
        quoteReport,
        isTwoHop: true,
        ethToOutputRate,
        ethToInputRate,
    };
    if (operation === types_1.MarketOperation.Buy) {
        return Object.assign({}, quoteBase, { type: types_1.MarketOperation.Buy, makerAssetFillAmount: assetFillAmount, makerTokenDecimals,
            takerTokenDecimals });
    }
    else {
        return Object.assign({}, quoteBase, { type: types_1.MarketOperation.Sell, takerAssetFillAmount: assetFillAmount, makerTokenDecimals,
            takerTokenDecimals });
    }
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