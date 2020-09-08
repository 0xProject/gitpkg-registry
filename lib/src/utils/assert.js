"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@0x/assert");
const json_schemas_1 = require("@0x/json-schemas");
const _ = require("lodash");
const types_1 = require("../types");
const utils_1 = require("./utils");
exports.assert = Object.assign({}, assert_1.assert, { isValidSwapQuote(variableName, swapQuote) {
        assert_1.assert.isHexString(`${variableName}.takerAssetData`, swapQuote.takerAssetData);
        assert_1.assert.isHexString(`${variableName}.makerAssetData`, swapQuote.makerAssetData);
        assert_1.assert.doesConformToSchema(`${variableName}.orders`, swapQuote.orders, json_schemas_1.schemas.signedOrdersSchema);
        if (swapQuote.isTwoHop) {
            exports.assert.isValidTwoHopSwapQuoteOrders(`${variableName}.orders`, swapQuote.orders, swapQuote.makerAssetData, swapQuote.takerAssetData);
        }
        else {
            exports.assert.isValidSwapQuoteOrders(`${variableName}.orders`, swapQuote.orders, swapQuote.makerAssetData, swapQuote.takerAssetData);
        }
        exports.assert.isValidSwapQuoteInfo(`${variableName}.bestCaseQuoteInfo`, swapQuote.bestCaseQuoteInfo);
        exports.assert.isValidSwapQuoteInfo(`${variableName}.worstCaseQuoteInfo`, swapQuote.worstCaseQuoteInfo);
        if (swapQuote.type === types_1.MarketOperation.Buy) {
            assert_1.assert.isBigNumber(`${variableName}.makerAssetFillAmount`, swapQuote.makerAssetFillAmount);
        }
        else {
            assert_1.assert.isBigNumber(`${variableName}.takerAssetFillAmount`, swapQuote.takerAssetFillAmount);
        }
    },
    isValidSwapQuoteOrders(variableName, orders, makerAssetData, takerAssetData) {
        _.every(orders, (order, index) => {
            exports.assert.assert(utils_1.isAssetDataEquivalent(takerAssetData, order.takerAssetData), `Expected ${variableName}[${index}].takerAssetData to be ${takerAssetData} but found ${order.takerAssetData}`);
            exports.assert.assert(utils_1.isAssetDataEquivalent(makerAssetData, order.makerAssetData), `Expected ${variableName}[${index}].makerAssetData to be ${makerAssetData} but found ${order.makerAssetData}`);
        });
    },
    isValidTwoHopSwapQuoteOrders(variableName, orders, makerAssetData, takerAssetData) {
        exports.assert.assert(orders.length === 2, `Expected ${variableName}.length to be 2 for a two-hop quote`);
        exports.assert.assert(utils_1.isAssetDataEquivalent(takerAssetData, orders[0].takerAssetData), `Expected ${variableName}[0].takerAssetData to be ${takerAssetData} but found ${orders[0].takerAssetData}`);
        exports.assert.assert(utils_1.isAssetDataEquivalent(makerAssetData, orders[1].makerAssetData), `Expected ${variableName}[1].makerAssetData to be ${makerAssetData} but found ${orders[1].makerAssetData}`);
        exports.assert.assert(utils_1.isAssetDataEquivalent(orders[0].makerAssetData, orders[1].takerAssetData), `Expected ${variableName}[0].makerAssetData (${orders[0].makerAssetData}) to equal ${variableName}[1].takerAssetData (${orders[1].takerAssetData})`);
    },
    isValidOrdersForSwapQuoter(variableName, orders) {
        _.every(orders, (order, index) => {
            exports.assert.assert(order.takerFee.isZero() ||
                utils_1.isOrderTakerFeePayableWithTakerAsset(order) ||
                utils_1.isOrderTakerFeePayableWithMakerAsset(order), `Expected ${variableName}[${index}].takerFeeAssetData to be ${order.makerAssetData} or ${order.takerAssetData} but found ${order.takerFeeAssetData}`);
        });
    },
    isValidForwarderSwapQuote(variableName, swapQuote, wethAssetData) {
        exports.assert.isValidSwapQuote(variableName, swapQuote);
        exports.assert.isValidForwarderSignedOrders(`${variableName}.orders`, swapQuote.orders, wethAssetData);
    },
    isValidForwarderSignedOrders(variableName, orders, wethAssetData) {
        _.forEach(orders, (o, i) => {
            exports.assert.isValidForwarderSignedOrder(`${variableName}[${i}]`, o, wethAssetData);
        });
    },
    isValidForwarderSignedOrder(variableName, order, wethAssetData) {
        exports.assert.assert(utils_1.isExactAssetData(order.takerAssetData, wethAssetData), `Expected ${variableName} to have takerAssetData set as ${wethAssetData}, but is ${order.takerAssetData}`);
    },
    isValidSwapQuoteInfo(variableName, swapQuoteInfo) {
        assert_1.assert.isNumber(`${variableName}.gas`, swapQuoteInfo.gas);
        assert_1.assert.isBigNumber(`${variableName}.feeTakerAssetAmount`, swapQuoteInfo.feeTakerAssetAmount);
        assert_1.assert.isBigNumber(`${variableName}.totalTakerAssetAmount`, swapQuoteInfo.totalTakerAssetAmount);
        assert_1.assert.isBigNumber(`${variableName}.takerAssetAmount`, swapQuoteInfo.takerAssetAmount);
        assert_1.assert.isBigNumber(`${variableName}.makerAssetAmount`, swapQuoteInfo.makerAssetAmount);
    },
    isValidOrderbook(variableName, orderFetcher) {
        assert_1.assert.isFunction(`${variableName}.getOrdersAsync`, orderFetcher.getOrdersAsync);
    },
    isValidOrderProviderRequest(variableName, orderFetcherRequest) {
        assert_1.assert.isHexString(`${variableName}.makerAssetData`, orderFetcherRequest.makerAssetData);
        assert_1.assert.isHexString(`${variableName}.takerAssetData`, orderFetcherRequest.takerAssetData);
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