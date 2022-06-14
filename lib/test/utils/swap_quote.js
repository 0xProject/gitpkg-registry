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
exports.getFullyFillableSwapQuoteWithNoFeesAsync = void 0;
const utils_1 = require("@0x/utils");
const src_1 = require("../../src");
const constants_1 = require("../../src/constants");
const types_1 = require("../../src/types");
/**
 * Creates a swap quote given orders.
 */
function getFullyFillableSwapQuoteWithNoFeesAsync(makerToken, takerToken, orders, operation, gasPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        const makerAmount = utils_1.BigNumber.sum(...[0, ...orders.map(o => o.makerAmount)]);
        const takerAmount = utils_1.BigNumber.sum(...[0, ...orders.map(o => o.takerAmount)]);
        const protocolFeePerOrder = constants_1.constants.PROTOCOL_FEE_MULTIPLIER.times(gasPrice);
        const quoteInfo = {
            makerAmount,
            feeTakerTokenAmount: constants_1.constants.ZERO_AMOUNT,
            takerAmount,
            totalTakerAmount: takerAmount,
            protocolFeeInWeiAmount: protocolFeePerOrder.times(orders.length),
            gas: 200e3,
            slippage: 0,
        };
        const breakdown = {
            [src_1.ERC20BridgeSource.Native]: new utils_1.BigNumber(1),
        };
        const quoteBase = {
            makerToken,
            takerToken,
            orders: orders.map(order => (Object.assign(Object.assign({}, order), { fills: [] }))),
            gasPrice,
            bestCaseQuoteInfo: quoteInfo,
            worstCaseQuoteInfo: quoteInfo,
            sourceBreakdown: breakdown,
            isTwoHop: false,
            takerAmountPerEth: constants_1.constants.ZERO_AMOUNT,
            makerAmountPerEth: constants_1.constants.ZERO_AMOUNT,
            makerTokenDecimals: 18,
            takerTokenDecimals: 18,
            blockNumber: 1337420,
        };
        if (operation === types_1.MarketOperation.Buy) {
            return Object.assign(Object.assign({}, quoteBase), { type: types_1.MarketOperation.Buy, makerTokenFillAmount: makerAmount });
        }
        else {
            return Object.assign(Object.assign({}, quoteBase), { type: types_1.MarketOperation.Sell, takerTokenFillAmount: takerAmount });
        }
    });
}
exports.getFullyFillableSwapQuoteWithNoFeesAsync = getFullyFillableSwapQuoteWithNoFeesAsync;
//# sourceMappingURL=swap_quote.js.map