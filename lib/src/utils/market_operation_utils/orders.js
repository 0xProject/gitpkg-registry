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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var order_utils_1 = require("@0x/order-utils");
var utils_1 = require("@0x/utils");
var types_1 = require("../../types");
var constants_1 = require("./constants");
var fills_1 = require("./fills");
var types_2 = require("./types");
// tslint:disable completed-docs
function createDummyOrderForSampler(makerAssetData, takerAssetData, makerAddress) {
    return {
        makerAddress: makerAddress,
        takerAddress: constants_1.NULL_ADDRESS,
        senderAddress: constants_1.NULL_ADDRESS,
        feeRecipientAddress: constants_1.NULL_ADDRESS,
        salt: constants_1.ZERO_AMOUNT,
        expirationTimeSeconds: constants_1.ZERO_AMOUNT,
        makerAssetData: makerAssetData,
        takerAssetData: takerAssetData,
        makerFeeAssetData: constants_1.NULL_BYTES,
        takerFeeAssetData: constants_1.NULL_BYTES,
        makerFee: constants_1.ZERO_AMOUNT,
        takerFee: constants_1.ZERO_AMOUNT,
        makerAssetAmount: constants_1.ZERO_AMOUNT,
        takerAssetAmount: constants_1.ZERO_AMOUNT,
        signature: constants_1.NULL_BYTES,
        chainId: 1,
        exchangeAddress: constants_1.NULL_ADDRESS,
    };
}
exports.createDummyOrderForSampler = createDummyOrderForSampler;
function getNativeOrderTokens(order) {
    var assets = [order.makerAssetData, order.takerAssetData].map(function (a) { return order_utils_1.assetDataUtils.decodeAssetDataOrThrow(a); });
    if (assets.some(function (a) { return a.assetProxyId !== constants_1.ERC20_PROXY_ID; })) {
        throw new Error(types_2.AggregationError.NotERC20AssetData);
    }
    return assets.map(function (a) { return a.tokenAddress.toLowerCase(); });
}
exports.getNativeOrderTokens = getNativeOrderTokens;
function convertNativeOrderToFullyFillableOptimizedOrders(order) {
    return __assign({}, order, { fillableMakerAssetAmount: order.makerAssetAmount, fillableTakerAssetAmount: order.takerAssetAmount, fillableTakerFeeAmount: order.takerFee, fill: {
            source: types_2.ERC20BridgeSource.Native,
            totalMakerAssetAmount: order.makerAssetAmount,
            totalTakerAssetAmount: order.takerAssetAmount,
            subFills: [],
        } });
}
exports.convertNativeOrderToFullyFillableOptimizedOrders = convertNativeOrderToFullyFillableOptimizedOrders;
/**
 * Augments native orders with fillable amounts and filters out unfillable orders.
 */
function createSignedOrdersWithFillableAmounts(side, orders, fillableAmounts) {
    return orders
        .map(function (order, i) {
        var fillableAmount = fillableAmounts[i];
        var fillableMakerAssetAmount = side === types_1.MarketOperation.Buy
            ? fillableAmount
            : order_utils_1.orderCalculationUtils.getMakerFillAmount(order, fillableAmount);
        var fillableTakerAssetAmount = side === types_1.MarketOperation.Sell
            ? fillableAmount
            : order_utils_1.orderCalculationUtils.getTakerFillAmount(order, fillableAmount);
        var fillableTakerFeeAmount = order_utils_1.orderCalculationUtils.getTakerFeeAmount(order, fillableTakerAssetAmount);
        return __assign({}, order, { fillableMakerAssetAmount: fillableMakerAssetAmount,
            fillableTakerAssetAmount: fillableTakerAssetAmount,
            fillableTakerFeeAmount: fillableTakerFeeAmount });
    })
        .filter(function (order) {
        return !order.fillableMakerAssetAmount.isZero() && !order.fillableTakerAssetAmount.isZero();
    });
}
exports.createSignedOrdersWithFillableAmounts = createSignedOrdersWithFillableAmounts;
// Convert sell fills into orders.
function createOrdersFromPath(path, opts) {
    var e_1, _a;
    var collapsedPath = fills_1.collapsePath(opts.side, path);
    var orders = [];
    try {
        for (var collapsedPath_1 = __values(collapsedPath), collapsedPath_1_1 = collapsedPath_1.next(); !collapsedPath_1_1.done; collapsedPath_1_1 = collapsedPath_1.next()) {
            var fill = collapsedPath_1_1.value;
            if (fill.source === types_2.ERC20BridgeSource.Native) {
                orders.push(createNativeOrder(fill));
            }
            else {
                orders.push(createBridgeOrder(fill, opts));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (collapsedPath_1_1 && !collapsedPath_1_1.done && (_a = collapsedPath_1.return)) _a.call(collapsedPath_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return orders;
}
exports.createOrdersFromPath = createOrdersFromPath;
function getBridgeAddressFromSource(source, opts) {
    switch (source) {
        case types_2.ERC20BridgeSource.Eth2Dai:
            return opts.contractAddresses.eth2DaiBridge;
        case types_2.ERC20BridgeSource.Kyber:
            return opts.contractAddresses.kyberBridge;
        case types_2.ERC20BridgeSource.Uniswap:
            return opts.contractAddresses.uniswapBridge;
        case types_2.ERC20BridgeSource.CurveUsdcDai:
        case types_2.ERC20BridgeSource.CurveUsdcDaiUsdt:
        case types_2.ERC20BridgeSource.CurveUsdcDaiUsdtTusd:
        case types_2.ERC20BridgeSource.CurveUsdcDaiUsdtBusd:
            return opts.contractAddresses.curveBridge;
        case types_2.ERC20BridgeSource.LiquidityProvider:
            if (opts.liquidityProviderAddress === undefined) {
                throw new Error('Cannot create a LiquidityProvider order without a LiquidityProvider pool address.');
            }
            return opts.liquidityProviderAddress;
        default:
            break;
    }
    throw new Error(types_2.AggregationError.NoBridgeForSource);
}
function createBridgeOrder(fill, opts) {
    var takerToken = opts.side === types_1.MarketOperation.Sell ? opts.inputToken : opts.outputToken;
    var makerToken = opts.side === types_1.MarketOperation.Sell ? opts.outputToken : opts.inputToken;
    var bridgeAddress = getBridgeAddressFromSource(fill.source, opts);
    var makerAssetData;
    if (Object.keys(constants_1.DEFAULT_CURVE_OPTS).includes(fill.source)) {
        var _a = constants_1.DEFAULT_CURVE_OPTS[fill.source], curveAddress = _a.curveAddress, tokens = _a.tokens, version = _a.version;
        var fromTokenIdx = tokens.indexOf(takerToken);
        var toTokenIdx = tokens.indexOf(makerToken);
        makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createCurveBridgeData(curveAddress, fromTokenIdx, toTokenIdx, version));
    }
    else {
        makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createBridgeData(takerToken));
    }
    return __assign({ makerAddress: bridgeAddress, makerAssetData: makerAssetData, takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(takerToken) }, createCommonBridgeOrderFields(fill, opts));
}
function createBridgeData(tokenAddress) {
    var encoder = utils_1.AbiEncoder.create([{ name: 'tokenAddress', type: 'address' }]);
    return encoder.encode({ tokenAddress: tokenAddress });
}
function createCurveBridgeData(curveAddress, fromTokenIdx, toTokenIdx, version) {
    var curveBridgeDataEncoder = utils_1.AbiEncoder.create([
        { name: 'curveAddress', type: 'address' },
        { name: 'fromTokenIdx', type: 'int128' },
        { name: 'toTokenIdx', type: 'int128' },
        { name: 'version', type: 'int128' },
    ]);
    return curveBridgeDataEncoder.encode([curveAddress, fromTokenIdx, toTokenIdx, version]);
}
function createCommonBridgeOrderFields(fill, opts) {
    var makerAssetAmountAdjustedWithSlippage = opts.side === types_1.MarketOperation.Sell
        ? fill.totalMakerAssetAmount.times(1 - opts.bridgeSlippage).integerValue(utils_1.BigNumber.ROUND_DOWN)
        : fill.totalMakerAssetAmount;
    var takerAssetAmountAdjustedWithSlippage = opts.side === types_1.MarketOperation.Sell
        ? fill.totalTakerAssetAmount
        : fill.totalTakerAssetAmount.times(opts.bridgeSlippage + 1).integerValue(utils_1.BigNumber.ROUND_UP);
    return __assign({ fill: fill, takerAddress: constants_1.NULL_ADDRESS, senderAddress: constants_1.NULL_ADDRESS, feeRecipientAddress: constants_1.NULL_ADDRESS, salt: order_utils_1.generatePseudoRandomSalt(), expirationTimeSeconds: new utils_1.BigNumber(Math.floor(Date.now() / constants_1.ONE_SECOND_MS) + constants_1.ONE_HOUR_IN_SECONDS), makerFeeAssetData: constants_1.NULL_BYTES, takerFeeAssetData: constants_1.NULL_BYTES, makerFee: constants_1.ZERO_AMOUNT, takerFee: constants_1.ZERO_AMOUNT, makerAssetAmount: makerAssetAmountAdjustedWithSlippage, fillableMakerAssetAmount: makerAssetAmountAdjustedWithSlippage, takerAssetAmount: takerAssetAmountAdjustedWithSlippage, fillableTakerAssetAmount: takerAssetAmountAdjustedWithSlippage, fillableTakerFeeAmount: constants_1.ZERO_AMOUNT, signature: constants_1.WALLET_SIGNATURE }, opts.orderDomain);
}
function createNativeOrder(fill) {
    return __assign({ fill: {
            source: fill.source,
            totalMakerAssetAmount: fill.totalMakerAssetAmount,
            totalTakerAssetAmount: fill.totalTakerAssetAmount,
            subFills: fill.subFills,
        } }, fill.nativeOrder);
}
//# sourceMappingURL=orders.js.map