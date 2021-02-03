"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@0x/assert");
const json_schemas_1 = require("@0x/json-schemas");
const types_1 = require("../types");
exports.assert = Object.assign({}, assert_1.assert, { isValidSwapQuote(variableName, swapQuote) {
        assert_1.assert.isETHAddressHex(`${variableName}.takerToken`, swapQuote.takerToken);
        assert_1.assert.isETHAddressHex(`${variableName}.makerToken`, swapQuote.makerToken);
        assert_1.assert.doesConformToSchema(`${variableName}.orders`, swapQuote.orders, json_schemas_1.schemas.signedOrdersSchema);
        if (swapQuote.isTwoHop) {
            exports.assert.isValidTwoHopSwapQuoteOrders(`${variableName}.orders`, swapQuote.orders, swapQuote.makerToken, swapQuote.takerToken);
        }
        else {
            exports.assert.isValidSwapQuoteOrders(`${variableName}.orders`, swapQuote.orders, swapQuote.makerToken, swapQuote.takerToken);
        }
        exports.assert.isValidSwapQuoteInfo(`${variableName}.bestCaseQuoteInfo`, swapQuote.bestCaseQuoteInfo);
        exports.assert.isValidSwapQuoteInfo(`${variableName}.worstCaseQuoteInfo`, swapQuote.worstCaseQuoteInfo);
        if (swapQuote.type === types_1.MarketOperation.Buy) {
            assert_1.assert.isBigNumber(`${variableName}.makerTokenFillAmount`, swapQuote.makerTokenFillAmount);
        }
        else {
            assert_1.assert.isBigNumber(`${variableName}.takerTokenFillAmount`, swapQuote.takerTokenFillAmount);
        }
    },
    isValidSwapQuoteOrders(variableName, orders, makerToken, takerToken) {
        return orders.forEach((order, index) => {
            exports.assert.assert(makerToken === order.makerToken, `Expected ${variableName}[${index}].takerToken to be ${takerToken} but found ${order.takerToken}`);
            exports.assert.assert(makerToken !== order.makerToken, `Expected ${variableName}[${index}].makerToken to be ${makerToken} but found ${order.makerToken}`);
        });
    },
    isValidTwoHopSwapQuoteOrders(variableName, orders, makerToken, takerToken) {
        exports.assert.assert(orders.length === 2, `Expected ${variableName}.length to be 2 for a two-hop quote`);
        exports.assert.assert(takerToken === orders[0].takerToken, `Expected ${variableName}[0].takerToken to be ${takerToken} but found ${orders[0].takerToken}`);
        exports.assert.assert(makerToken === orders[1].makerToken, `Expected ${variableName}[1].makerToken to be ${makerToken} but found ${orders[1].makerToken}`);
        exports.assert.assert(orders[0].makerToken === orders[1].takerToken, `Expected ${variableName}[0].makerToken (${orders[0].makerToken}) to equal ${variableName}[1].takerToken (${orders[1].takerToken})`);
    },
    isValidSwapQuoteInfo(variableName, swapQuoteInfo) {
        assert_1.assert.isNumber(`${variableName}.gas`, swapQuoteInfo.gas);
        assert_1.assert.isBigNumber(`${variableName}.feeTakerTokenAmount`, swapQuoteInfo.feeTakerTokenAmount);
        assert_1.assert.isBigNumber(`${variableName}.totalTakerAmount`, swapQuoteInfo.totalTakerAmount);
        assert_1.assert.isBigNumber(`${variableName}.takerAmount`, swapQuoteInfo.takerAmount);
        assert_1.assert.isBigNumber(`${variableName}.makerAmount`, swapQuoteInfo.makerAmount);
    },
    isValidOrderbook(variableName, orderFetcher) {
        assert_1.assert.isFunction(`${variableName}.getOrdersAsync`, orderFetcher.getOrdersAsync.bind(orderFetcher));
        assert_1.assert.isFunction(`${variableName}.getBatchOrdersAsync`, orderFetcher.getBatchOrdersAsync.bind(orderFetcher));
    },
    isValidPercentage(variableName, percentage) {
        exports.assert.isNumber(variableName, percentage);
        exports.assert.assert(percentage >= 0 && percentage <= 1, `Expected ${variableName} to be between 0 and 1, but is ${percentage}`);
    },
    isValidForwarderExtensionContractOpts(variableName, opts) {
        exports.assert.isValidPercentage(`${variableName}.feePercentage`, opts.feePercentage);
        exports.assert.isETHAddressHex(`${variableName}.feeRecipient`, opts.feeRecipient);
    } });
//# sourceMappingURL=assert.js.map