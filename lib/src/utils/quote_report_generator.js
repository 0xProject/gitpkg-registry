"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var order_utils_1 = require("@0x/order-utils");
var __1 = require("..");
var types_1 = require("../types");
var nativeOrderFromCollapsedFill = function (cf) {
    // Cast as NativeCollapsedFill and then check
    // if it really is a NativeCollapsedFill
    var possibleNativeCollapsedFill = cf;
    if (possibleNativeCollapsedFill.fillData && possibleNativeCollapsedFill.fillData.order) {
        return possibleNativeCollapsedFill.fillData.order;
    }
    else {
        return undefined;
    }
};
var QuoteReportGenerator = /** @class */ (function () {
    function QuoteReportGenerator(marketOperation, dexQuotes, nativeOrders, orderFillableAmounts, collapsedFills, quoteRequestor) {
        this._dexQuotes = dexQuotes;
        this._nativeOrders = nativeOrders;
        this._marketOperation = marketOperation;
        this._quoteRequestor = quoteRequestor;
        this._collapsedFills = collapsedFills;
        // convert order fillable amount array to easy to look up hash
        if (orderFillableAmounts.length !== nativeOrders.length) {
            // length mismatch, abort
            this._orderHashesToFillableAmounts = {};
            return;
        }
        var orderHashesToFillableAmounts = {};
        nativeOrders.forEach(function (nativeOrder, idx) {
            orderHashesToFillableAmounts[order_utils_1.orderHashUtils.getOrderHash(nativeOrder)] = orderFillableAmounts[idx];
        });
        this._orderHashesToFillableAmounts = orderHashesToFillableAmounts;
    }
    QuoteReportGenerator.prototype.generateReport = function () {
        var _this = this;
        var dexReportSourcesConsidered = this._dexQuotes.map(function (dq) { return _this._dexSampleToReportSource(dq); });
        var nativeOrderSourcesConsidered = this._nativeOrders.map(function (no) { return _this._nativeOrderToReportSource(no); });
        var sourcesConsidered = __spread(dexReportSourcesConsidered, nativeOrderSourcesConsidered);
        var sourcesDelivered = this._collapsedFills.map(function (collapsedFill) {
            var foundNativeOrder = nativeOrderFromCollapsedFill(collapsedFill);
            if (foundNativeOrder) {
                return _this._nativeOrderToReportSource(foundNativeOrder);
            }
            else {
                return _this._dexSampleToReportSource(collapsedFill);
            }
        });
        return {
            sourcesConsidered: sourcesConsidered,
            sourcesDelivered: sourcesDelivered,
        };
    };
    QuoteReportGenerator.prototype._dexSampleToReportSource = function (ds) {
        var liquiditySource = ds.source;
        if (liquiditySource === __1.ERC20BridgeSource.Native) {
            throw new Error("Unexpected liquidity source Native");
        }
        // input and output map to different values
        // based on the market operation
        if (this._marketOperation === types_1.MarketOperation.Buy) {
            return {
                makerAmount: ds.input,
                takerAmount: ds.output,
                liquiditySource: liquiditySource,
            };
        }
        else if (this._marketOperation === types_1.MarketOperation.Sell) {
            return {
                makerAmount: ds.output,
                takerAmount: ds.input,
                liquiditySource: liquiditySource,
            };
        }
        else {
            throw new Error("Unexpected marketOperation " + this._marketOperation);
        }
    };
    QuoteReportGenerator.prototype._nativeOrderToReportSource = function (nativeOrder) {
        var orderHash = order_utils_1.orderHashUtils.getOrderHash(nativeOrder);
        var nativeOrderBase = {
            liquiditySource: __1.ERC20BridgeSource.Native,
            makerAmount: nativeOrder.makerAssetAmount,
            takerAmount: nativeOrder.takerAssetAmount,
            fillableTakerAmount: this._orderHashesToFillableAmounts[orderHash],
            nativeOrder: nativeOrder,
            orderHash: orderHash,
        };
        // if we find this is an rfqt order, label it as such and associate makerUri
        var foundRfqtMakerUri = this._quoteRequestor && this._quoteRequestor.getMakerUriForOrderHash(orderHash);
        if (foundRfqtMakerUri) {
            var rfqtSource = __assign({}, nativeOrderBase, { isRfqt: true, makerUri: foundRfqtMakerUri });
            return rfqtSource;
        }
        else {
            // if it's not an rfqt order, treat as normal
            var regularNativeOrder = __assign({}, nativeOrderBase, { isRfqt: false });
            return regularNativeOrder;
        }
    };
    return QuoteReportGenerator;
}());
exports.QuoteReportGenerator = QuoteReportGenerator;
//# sourceMappingURL=quote_report_generator.js.map