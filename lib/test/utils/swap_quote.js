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
const src_1 = require("../../src");
const constants_1 = require("../../src/constants");
const types_1 = require("../../src/types");
/**
 * Creates a swap quote given orders.
 */
function getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, takerAssetData, orders, operation, gasPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        const makerAssetFillAmount = utils_1.BigNumber.sum(...[0, ...orders.map(o => o.makerAssetAmount)]);
        const totalTakerAssetAmount = utils_1.BigNumber.sum(...[0, ...orders.map(o => o.takerAssetAmount)]);
        const protocolFeePerOrder = constants_1.constants.PROTOCOL_FEE_MULTIPLIER.times(gasPrice);
        const quoteInfo = {
            makerAssetAmount: makerAssetFillAmount,
            feeTakerAssetAmount: constants_1.constants.ZERO_AMOUNT,
            takerAssetAmount: totalTakerAssetAmount,
            totalTakerAssetAmount,
            protocolFeeInWeiAmount: protocolFeePerOrder.times(orders.length),
            gas: 200e3,
        };
        const breakdown = {
            [src_1.ERC20BridgeSource.Native]: new utils_1.BigNumber(1),
        };
        const quoteBase = {
            makerAssetData,
            takerAssetData,
            orders: orders.map(order => (Object.assign({}, order, { fills: [] }))),
            gasPrice,
            bestCaseQuoteInfo: quoteInfo,
            worstCaseQuoteInfo: quoteInfo,
            unoptimizedQuoteInfo: quoteInfo,
            unoptimizedOrders: orders.map(order => (Object.assign({}, order, { fills: [] }))),
            sourceBreakdown: breakdown,
            isTwoHop: false,
        };
        if (operation === types_1.MarketOperation.Buy) {
            return Object.assign({}, quoteBase, { type: types_1.MarketOperation.Buy, makerAssetFillAmount, makerTokenDecimals: 18, takerTokenDecimals: 18 });
        }
        else {
            return Object.assign({}, quoteBase, { type: types_1.MarketOperation.Sell, takerAssetFillAmount: totalTakerAssetAmount, makerTokenDecimals: 18, takerTokenDecimals: 18 });
        }
    });
}
exports.getFullyFillableSwapQuoteWithNoFeesAsync = getFullyFillableSwapQuoteWithNoFeesAsync;
//# sourceMappingURL=swap_quote.js.map