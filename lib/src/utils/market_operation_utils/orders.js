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
var multibridge_utils_1 = require("./multibridge_utils");
var types_2 = require("./types");
var dexForwarderBridgeDataEncoder = utils_1.AbiEncoder.create([
    { name: 'inputToken', type: 'address' },
    {
        name: 'calls',
        type: 'tuple[]',
        components: [
            { name: 'target', type: 'address' },
            { name: 'inputTokenAmount', type: 'uint256' },
            { name: 'outputTokenAmount', type: 'uint256' },
            { name: 'bridgeData', type: 'bytes' },
        ],
    },
]);
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
    return __assign({}, order, { fillableMakerAssetAmount: order.makerAssetAmount, fillableTakerAssetAmount: order.takerAssetAmount, fillableTakerFeeAmount: order.takerFee, fills: [] });
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
    var collapsedPath = fills_1.collapsePath(path);
    var orders = [];
    for (var i = 0; i < collapsedPath.length;) {
        if (collapsedPath[i].source === types_2.ERC20BridgeSource.Native) {
            orders.push(createNativeOrder(collapsedPath[i]));
            ++i;
            continue;
        }
        // If there are contiguous bridge orders, we can batch them together.
        var contiguousBridgeFills = [collapsedPath[i]];
        for (var j = i + 1; j < collapsedPath.length; ++j) {
            if (collapsedPath[j].source === types_2.ERC20BridgeSource.Native) {
                break;
            }
            contiguousBridgeFills.push(collapsedPath[j]);
        }
        // Always use DexForwarderBridge unless configured not to
        if (!opts.shouldBatchBridgeOrders) {
            orders.push(createBridgeOrder(contiguousBridgeFills[0], opts));
            i += 1;
        }
        else {
            orders.push(createBatchedBridgeOrder(contiguousBridgeFills, opts));
            i += contiguousBridgeFills.length;
        }
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
        case types_2.ERC20BridgeSource.UniswapV2:
            return opts.contractAddresses.uniswapV2Bridge;
        case types_2.ERC20BridgeSource.Curve:
            return opts.contractAddresses.curveBridge;
        case types_2.ERC20BridgeSource.Balancer:
            return opts.contractAddresses.balancerBridge;
        case types_2.ERC20BridgeSource.LiquidityProvider:
            if (opts.liquidityProviderAddress === undefined) {
                throw new Error('Cannot create a LiquidityProvider order without a LiquidityProvider pool address.');
            }
            return opts.liquidityProviderAddress;
        case types_2.ERC20BridgeSource.MultiBridge:
            if (opts.multiBridgeAddress === undefined) {
                throw new Error('Cannot create a MultiBridge order without a MultiBridge address.');
            }
            return opts.multiBridgeAddress;
        default:
            break;
    }
    throw new Error(types_2.AggregationError.NoBridgeForSource);
}
function createBridgeOrder(fill, opts) {
    var _a = __read(getMakerTakerTokens(opts), 2), makerToken = _a[0], takerToken = _a[1];
    var bridgeAddress = getBridgeAddressFromSource(fill.source, opts);
    var makerAssetData;
    switch (fill.source) {
        case types_2.ERC20BridgeSource.Curve:
            var curveFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createCurveBridgeData(curveFillData.poolAddress, curveFillData.fromTokenIdx, curveFillData.toTokenIdx, 1));
            break;
        case types_2.ERC20BridgeSource.Balancer:
            var balancerFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createBalancerBridgeData(takerToken, balancerFillData.poolAddress));
            break;
        case types_2.ERC20BridgeSource.UniswapV2:
            var uniswapV2FillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createUniswapV2BridgeData(uniswapV2FillData.tokenAddressPath));
            break;
        case types_2.ERC20BridgeSource.MultiBridge:
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createMultiBridgeData(takerToken, makerToken));
            break;
        default:
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createBridgeData(takerToken));
    }
    var _b = __read(getSlippedBridgeAssetAmounts(fill, opts), 2), slippedMakerAssetAmount = _b[0], slippedTakerAssetAmount = _b[1];
    return __assign({ fills: [fill], makerAssetData: makerAssetData, takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(takerToken), makerAddress: bridgeAddress, makerAssetAmount: slippedMakerAssetAmount, takerAssetAmount: slippedTakerAssetAmount, fillableMakerAssetAmount: slippedMakerAssetAmount, fillableTakerAssetAmount: slippedTakerAssetAmount }, createCommonBridgeOrderFields(opts));
}
function createBatchedBridgeOrder(fills, opts) {
    var e_1, _a;
    var _b = __read(getMakerTakerTokens(opts), 2), makerToken = _b[0], takerToken = _b[1];
    var totalMakerAssetAmount = constants_1.ZERO_AMOUNT;
    var totalTakerAssetAmount = constants_1.ZERO_AMOUNT;
    var batchedBridgeData = {
        inputToken: takerToken,
        calls: [],
    };
    try {
        for (var fills_2 = __values(fills), fills_2_1 = fills_2.next(); !fills_2_1.done; fills_2_1 = fills_2.next()) {
            var fill = fills_2_1.value;
            var bridgeOrder = createBridgeOrder(fill, opts);
            totalMakerAssetAmount = totalMakerAssetAmount.plus(bridgeOrder.makerAssetAmount);
            totalTakerAssetAmount = totalTakerAssetAmount.plus(bridgeOrder.takerAssetAmount);
            var _c = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(bridgeOrder.makerAssetData), bridgeAddress = _c.bridgeAddress, orderBridgeData = _c.bridgeData;
            batchedBridgeData.calls.push({
                target: bridgeAddress,
                bridgeData: orderBridgeData,
                inputTokenAmount: bridgeOrder.takerAssetAmount,
                outputTokenAmount: bridgeOrder.makerAssetAmount,
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (fills_2_1 && !fills_2_1.done && (_a = fills_2.return)) _a.call(fills_2);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var batchedBridgeAddress = opts.contractAddresses.dexForwarderBridge;
    var batchedMakerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, batchedBridgeAddress, dexForwarderBridgeDataEncoder.encode(batchedBridgeData));
    return __assign({ fills: fills, makerAssetData: batchedMakerAssetData, takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(takerToken), makerAddress: batchedBridgeAddress, makerAssetAmount: totalMakerAssetAmount, takerAssetAmount: totalTakerAssetAmount, fillableMakerAssetAmount: totalMakerAssetAmount, fillableTakerAssetAmount: totalTakerAssetAmount }, createCommonBridgeOrderFields(opts));
}
function getMakerTakerTokens(opts) {
    var makerToken = opts.side === types_1.MarketOperation.Sell ? opts.outputToken : opts.inputToken;
    var takerToken = opts.side === types_1.MarketOperation.Sell ? opts.inputToken : opts.outputToken;
    return [makerToken, takerToken];
}
function createBridgeData(tokenAddress) {
    var encoder = utils_1.AbiEncoder.create([{ name: 'tokenAddress', type: 'address' }]);
    return encoder.encode({ tokenAddress: tokenAddress });
}
function createMultiBridgeData(takerToken, makerToken) {
    var intermediateToken = multibridge_utils_1.getMultiBridgeIntermediateToken(takerToken, makerToken);
    var encoder = utils_1.AbiEncoder.create([
        { name: 'takerToken', type: 'address' },
        { name: 'intermediateToken', type: 'address' },
    ]);
    return encoder.encode({ takerToken: takerToken, intermediateToken: intermediateToken });
}
function createBalancerBridgeData(takerToken, poolAddress) {
    var encoder = utils_1.AbiEncoder.create([
        { name: 'takerToken', type: 'address' },
        { name: 'poolAddress', type: 'address' },
    ]);
    return encoder.encode({ takerToken: takerToken, poolAddress: poolAddress });
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
function createUniswapV2BridgeData(tokenAddressPath) {
    var uniswapV2BridgeDataEncoder = utils_1.AbiEncoder.create('(address[])');
    return uniswapV2BridgeDataEncoder.encode([tokenAddressPath]);
}
function getSlippedBridgeAssetAmounts(fill, opts) {
    return [
        // Maker asset amount.
        opts.side === types_1.MarketOperation.Sell
            ? fill.output.times(1 - opts.bridgeSlippage).integerValue(utils_1.BigNumber.ROUND_DOWN)
            : fill.input,
        // Taker asset amount.
        opts.side === types_1.MarketOperation.Sell
            ? fill.input
            : fill.output.times(opts.bridgeSlippage + 1).integerValue(utils_1.BigNumber.ROUND_UP),
    ];
}
function createCommonBridgeOrderFields(opts) {
    return __assign({ takerAddress: constants_1.NULL_ADDRESS, senderAddress: constants_1.NULL_ADDRESS, feeRecipientAddress: constants_1.NULL_ADDRESS, salt: order_utils_1.generatePseudoRandomSalt(), 
        // 2 hours from now
        expirationTimeSeconds: new utils_1.BigNumber(Math.floor(Date.now() / constants_1.ONE_SECOND_MS) + constants_1.ONE_HOUR_IN_SECONDS * 2), makerFeeAssetData: constants_1.NULL_BYTES, takerFeeAssetData: constants_1.NULL_BYTES, makerFee: constants_1.ZERO_AMOUNT, takerFee: constants_1.ZERO_AMOUNT, fillableTakerFeeAmount: constants_1.ZERO_AMOUNT, signature: constants_1.WALLET_SIGNATURE }, opts.orderDomain);
}
function createNativeOrder(fill) {
    return __assign({ fills: [fill] }, fill.fillData.order);
}
function createSignedOrdersFromRfqtIndicativeQuotes(quotes) {
    return quotes.map(function (quote) {
        return {
            fillableMakerAssetAmount: quote.makerAssetAmount,
            fillableTakerAssetAmount: quote.takerAssetAmount,
            makerAssetAmount: quote.makerAssetAmount,
            takerAssetAmount: quote.takerAssetAmount,
            makerAssetData: quote.makerAssetData,
            takerAssetData: quote.takerAssetData,
            takerAddress: constants_1.NULL_ADDRESS,
            makerAddress: constants_1.NULL_ADDRESS,
            senderAddress: constants_1.NULL_ADDRESS,
            feeRecipientAddress: constants_1.NULL_ADDRESS,
            salt: constants_1.ZERO_AMOUNT,
            expirationTimeSeconds: quote.expirationTimeSeconds,
            makerFeeAssetData: constants_1.NULL_BYTES,
            takerFeeAssetData: constants_1.NULL_BYTES,
            makerFee: constants_1.ZERO_AMOUNT,
            takerFee: constants_1.ZERO_AMOUNT,
            fillableTakerFeeAmount: constants_1.ZERO_AMOUNT,
            signature: constants_1.WALLET_SIGNATURE,
            chainId: 0,
            exchangeAddress: constants_1.NULL_ADDRESS,
        };
    });
}
exports.createSignedOrdersFromRfqtIndicativeQuotes = createSignedOrdersFromRfqtIndicativeQuotes;
//# sourceMappingURL=orders.js.map