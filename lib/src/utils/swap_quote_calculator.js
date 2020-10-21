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
const order_utils_1 = require("@0x/order-utils");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const constants_1 = require("../constants");
const types_2 = require("../types");
const constants_2 = require("./market_operation_utils/constants");
const orders_1 = require("./market_operation_utils/orders");
const types_3 = require("./market_operation_utils/types");
const quote_simulation_1 = require("./quote_simulation");
const utils_2 = require("./utils");
// TODO(dave4506) How do we want to reintroduce InsufficientAssetLiquidityError?
class SwapQuoteCalculator {
    constructor(marketOperationUtils) {
        this._marketOperationUtils = marketOperationUtils;
    }
    calculateMarketSellSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._calculateSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, types_2.MarketOperation.Sell, opts));
        });
    }
    calculateMarketBuySwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._calculateSwapQuoteAsync(prunedOrders, takerAssetFillAmount, gasPrice, types_2.MarketOperation.Buy, opts));
        });
    }
    calculateBatchMarketBuySwapQuoteAsync(batchPrunedOrders, takerAssetFillAmounts, gasPrice, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._calculateBatchBuySwapQuoteAsync(batchPrunedOrders, takerAssetFillAmounts, gasPrice, types_2.MarketOperation.Buy, opts));
        });
    }
    _calculateBatchBuySwapQuoteAsync(batchPrunedOrders, assetFillAmounts, gasPrice, operation, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const batchSignedOrders = yield this._marketOperationUtils.getBatchMarketBuyOrdersAsync(batchPrunedOrders, assetFillAmounts, opts);
            const batchSwapQuotes = yield Promise.all(batchSignedOrders.map((orders, i) => __awaiter(this, void 0, void 0, function* () {
                if (orders) {
                    const { makerAssetData, takerAssetData } = batchPrunedOrders[i][0];
                    return createSwapQuote(makerAssetData, takerAssetData, orders, operation, assetFillAmounts[i], gasPrice, opts.gasSchedule);
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
            // checks if maker asset is ERC721 or ERC20 and taker asset is ERC20
            if (!utils_2.isSupportedAssetDataInOrders(prunedOrders)) {
                throw Error(types_2.SwapQuoterError.AssetDataUnsupported);
            }
            // since prunedOrders do not have fillState, we will add a buffer of fillable orders to consider that some native are orders are partially filled
            let optimizedOrders;
            let quoteReport;
            let sourceFlags = 0;
            // Scale fees by gas price.
            const _opts = Object.assign({}, opts, { feeSchedule: _.mapValues(opts.feeSchedule, gasCost => (fillData) => gasCost === undefined ? 0 : gasPrice.times(gasCost(fillData))), exchangeProxyOverhead: flags => gasPrice.times(opts.exchangeProxyOverhead(flags)) });
            const firstOrderMakerAssetData = !!prunedOrders[0]
                ? order_utils_1.assetDataUtils.decodeAssetDataOrThrow(prunedOrders[0].makerAssetData)
                : { assetProxyId: '' };
            if (firstOrderMakerAssetData.assetProxyId === types_1.AssetProxyId.ERC721) {
                // HACK: to conform ERC721 orders to the output of market operation utils, assumes complete fillable
                optimizedOrders = prunedOrders.map(o => orders_1.convertNativeOrderToFullyFillableOptimizedOrders(o));
            }
            else {
                if (operation === types_2.MarketOperation.Buy) {
                    const buyResult = yield this._marketOperationUtils.getMarketBuyOrdersAsync(prunedOrders, assetFillAmount, _opts);
                    optimizedOrders = buyResult.optimizedOrders;
                    quoteReport = buyResult.quoteReport;
                    sourceFlags = buyResult.sourceFlags;
                }
                else {
                    const sellResult = yield this._marketOperationUtils.getMarketSellOrdersAsync(prunedOrders, assetFillAmount, _opts);
                    optimizedOrders = sellResult.optimizedOrders;
                    quoteReport = sellResult.quoteReport;
                    sourceFlags = sellResult.sourceFlags;
                }
            }
            // assetData information for the result
            const { makerAssetData, takerAssetData } = prunedOrders[0];
            const swapQuote = sourceFlags === constants_2.SOURCE_FLAGS[types_3.ERC20BridgeSource.MultiHop]
                ? createTwoHopSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, opts.gasSchedule, quoteReport)
                : createSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, opts.gasSchedule, quoteReport);
            // Use the raw gas, not scaled by gas price
            const exchangeProxyOverhead = opts.exchangeProxyOverhead(sourceFlags).toNumber();
            swapQuote.bestCaseQuoteInfo.gas += exchangeProxyOverhead;
            swapQuote.worstCaseQuoteInfo.gas += exchangeProxyOverhead;
            return swapQuote;
        });
    }
}
exports.SwapQuoteCalculator = SwapQuoteCalculator;
function createSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule, quoteReport) {
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
    };
    if (operation === types_2.MarketOperation.Buy) {
        return Object.assign({}, quoteBase, { type: types_2.MarketOperation.Buy, makerAssetFillAmount: assetFillAmount });
    }
    else {
        return Object.assign({}, quoteBase, { type: types_2.MarketOperation.Sell, takerAssetFillAmount: assetFillAmount });
    }
}
function createTwoHopSwapQuote(makerAssetData, takerAssetData, optimizedOrders, operation, assetFillAmount, gasPrice, gasSchedule, quoteReport) {
    const [firstHopOrder, secondHopOrder] = optimizedOrders;
    const [firstHopFill] = firstHopOrder.fills;
    const [secondHopFill] = secondHopOrder.fills;
    const gas = new utils_1.BigNumber(gasSchedule[types_3.ERC20BridgeSource.MultiHop]({
        firstHopSource: _.pick(firstHopFill, 'source', 'fillData'),
        secondHopSource: _.pick(secondHopFill, 'source', 'fillData'),
    })).toNumber();
    const quoteBase = {
        takerAssetData,
        makerAssetData,
        gasPrice,
        bestCaseQuoteInfo: {
            makerAssetAmount: operation === types_2.MarketOperation.Sell ? secondHopFill.output : secondHopFill.input,
            takerAssetAmount: operation === types_2.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
            totalTakerAssetAmount: operation === types_2.MarketOperation.Sell ? firstHopFill.input : firstHopFill.output,
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
            [types_3.ERC20BridgeSource.MultiHop]: {
                proportion: new utils_1.BigNumber(1),
                intermediateToken: utils_2.getTokenFromAssetData(secondHopOrder.takerAssetData),
                hops: [firstHopFill.source, secondHopFill.source],
            },
        },
        orders: optimizedOrders,
        quoteReport,
        isTwoHop: true,
    };
    if (operation === types_2.MarketOperation.Buy) {
        return Object.assign({}, quoteBase, { type: types_2.MarketOperation.Buy, makerAssetFillAmount: assetFillAmount });
    }
    else {
        return Object.assign({}, quoteBase, { type: types_2.MarketOperation.Sell, takerAssetFillAmount: assetFillAmount });
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