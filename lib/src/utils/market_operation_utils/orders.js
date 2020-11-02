"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const types_1 = require("../../types");
const constants_1 = require("./constants");
const multibridge_utils_1 = require("./multibridge_utils");
const types_2 = require("./types");
// tslint:disable completed-docs no-unnecessary-type-assertion
function createDummyOrderForSampler(makerAssetData, takerAssetData, makerAddress) {
    return {
        makerAddress,
        takerAddress: constants_1.NULL_ADDRESS,
        senderAddress: constants_1.NULL_ADDRESS,
        feeRecipientAddress: constants_1.NULL_ADDRESS,
        salt: constants_1.ZERO_AMOUNT,
        expirationTimeSeconds: constants_1.ZERO_AMOUNT,
        makerAssetData,
        takerAssetData,
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
    const assets = [order.makerAssetData, order.takerAssetData].map(a => order_utils_1.assetDataUtils.decodeAssetDataOrThrow(a));
    if (assets.some(a => a.assetProxyId !== constants_1.ERC20_PROXY_ID)) {
        throw new Error(types_2.AggregationError.NotERC20AssetData);
    }
    return assets.map(a => a.tokenAddress.toLowerCase());
}
exports.getNativeOrderTokens = getNativeOrderTokens;
function convertNativeOrderToFullyFillableOptimizedOrders(order) {
    return Object.assign({}, order, { fillableMakerAssetAmount: order.makerAssetAmount, fillableTakerAssetAmount: order.takerAssetAmount, fillableTakerFeeAmount: order.takerFee, fills: [] });
}
exports.convertNativeOrderToFullyFillableOptimizedOrders = convertNativeOrderToFullyFillableOptimizedOrders;
/**
 * Augments native orders with fillable amounts and filters out unfillable orders.
 */
function createSignedOrdersWithFillableAmounts(side, orders, fillableAmounts) {
    // Quick safety check: ensures that orders maps perfectly to fillable amounts.
    if (orders.length !== fillableAmounts.length) {
        throw new Error(`Number of orders was ${orders.length} but fillable amounts was ${fillableAmounts.length}. This should never happen`);
    }
    return orders
        .map((order, i) => {
        const fillableAmount = fillableAmounts[i];
        const fillableMakerAssetAmount = side === types_1.MarketOperation.Buy
            ? fillableAmount
            : order_utils_1.orderCalculationUtils.getMakerFillAmount(order, fillableAmount);
        const fillableTakerAssetAmount = side === types_1.MarketOperation.Sell
            ? fillableAmount
            : order_utils_1.orderCalculationUtils.getTakerFillAmount(order, fillableAmount);
        const fillableTakerFeeAmount = order_utils_1.orderCalculationUtils.getTakerFeeAmount(order, fillableTakerAssetAmount);
        return Object.assign({}, order, { fillableMakerAssetAmount,
            fillableTakerAssetAmount,
            fillableTakerFeeAmount });
    })
        .filter(order => {
        return !order.fillableMakerAssetAmount.isZero() && !order.fillableTakerAssetAmount.isZero();
    });
}
exports.createSignedOrdersWithFillableAmounts = createSignedOrdersWithFillableAmounts;
function createOrdersFromTwoHopSample(sample, opts) {
    const [makerToken, takerToken] = getMakerTakerTokens(opts);
    const { firstHopSource, secondHopSource, intermediateToken } = sample.fillData;
    const firstHopFill = {
        sourcePathId: '',
        source: firstHopSource.source,
        input: opts.side === types_1.MarketOperation.Sell ? sample.input : constants_1.ZERO_AMOUNT,
        output: opts.side === types_1.MarketOperation.Sell ? constants_1.ZERO_AMOUNT : sample.output,
        subFills: [],
        fillData: firstHopSource.fillData,
    };
    const secondHopFill = {
        sourcePathId: '',
        source: secondHopSource.source,
        input: opts.side === types_1.MarketOperation.Sell ? constants_1.MAX_UINT256 : sample.input,
        output: opts.side === types_1.MarketOperation.Sell ? sample.output : constants_1.MAX_UINT256,
        subFills: [],
        fillData: secondHopSource.fillData,
    };
    return [
        createBridgeOrder(firstHopFill, intermediateToken, takerToken, opts),
        createBridgeOrder(secondHopFill, makerToken, intermediateToken, opts),
    ];
}
exports.createOrdersFromTwoHopSample = createOrdersFromTwoHopSample;
function getBridgeAddressFromFill(fill, opts) {
    switch (fill.source) {
        case types_2.ERC20BridgeSource.Eth2Dai:
            return opts.contractAddresses.eth2DaiBridge;
        case types_2.ERC20BridgeSource.Kyber:
            return opts.contractAddresses.kyberBridge;
        case types_2.ERC20BridgeSource.Uniswap:
            return opts.contractAddresses.uniswapBridge;
        case types_2.ERC20BridgeSource.UniswapV2:
            return opts.contractAddresses.uniswapV2Bridge;
        case types_2.ERC20BridgeSource.SushiSwap:
            return opts.contractAddresses.sushiswapBridge;
        case types_2.ERC20BridgeSource.Curve:
            return opts.contractAddresses.curveBridge;
        case types_2.ERC20BridgeSource.Swerve:
            return opts.contractAddresses.swerveBridge;
        case types_2.ERC20BridgeSource.SnowSwap:
            return opts.contractAddresses.snowswapBridge;
        case types_2.ERC20BridgeSource.Bancor:
            return opts.contractAddresses.bancorBridge;
        case types_2.ERC20BridgeSource.Balancer:
            return opts.contractAddresses.balancerBridge;
        case types_2.ERC20BridgeSource.Cream:
            return opts.contractAddresses.creamBridge;
        case types_2.ERC20BridgeSource.LiquidityProvider:
            return fill.fillData.poolAddress;
        case types_2.ERC20BridgeSource.MultiBridge:
            return fill.fillData.poolAddress;
        case types_2.ERC20BridgeSource.MStable:
            return opts.contractAddresses.mStableBridge;
        case types_2.ERC20BridgeSource.Mooniswap:
            return opts.contractAddresses.mooniswapBridge;
        case types_2.ERC20BridgeSource.Shell:
            return opts.contractAddresses.shellBridge;
        case types_2.ERC20BridgeSource.Dodo:
            return opts.contractAddresses.dodoBridge;
        default:
            break;
    }
    throw new Error(types_2.AggregationError.NoBridgeForSource);
}
function createBridgeOrder(fill, makerToken, takerToken, opts) {
    const bridgeAddress = getBridgeAddressFromFill(fill, opts);
    let makerAssetData;
    switch (fill.source) {
        case types_2.ERC20BridgeSource.Curve:
            const curveFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createCurveBridgeData(curveFillData.pool.poolAddress, curveFillData.pool.exchangeFunctionSelector, takerToken, curveFillData.fromTokenIdx, curveFillData.toTokenIdx));
            break;
        case types_2.ERC20BridgeSource.Swerve:
            const swerveFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createCurveBridgeData(swerveFillData.pool.poolAddress, swerveFillData.pool.exchangeFunctionSelector, takerToken, swerveFillData.fromTokenIdx, swerveFillData.toTokenIdx));
            break;
        case types_2.ERC20BridgeSource.SnowSwap:
            const snowSwapFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createCurveBridgeData(snowSwapFillData.pool.poolAddress, snowSwapFillData.pool.exchangeFunctionSelector, takerToken, snowSwapFillData.fromTokenIdx, snowSwapFillData.toTokenIdx));
            break;
        case types_2.ERC20BridgeSource.Balancer:
            const balancerFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createBalancerBridgeData(takerToken, balancerFillData.poolAddress));
            break;
        case types_2.ERC20BridgeSource.Cream:
            const creamFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createBalancerBridgeData(takerToken, creamFillData.poolAddress));
            break;
        case types_2.ERC20BridgeSource.Bancor:
            const bancorFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createBancorBridgeData(bancorFillData.path, bancorFillData.networkAddress));
            break;
        case types_2.ERC20BridgeSource.UniswapV2:
            const uniswapV2FillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createUniswapV2BridgeData(uniswapV2FillData.tokenAddressPath));
            break;
        case types_2.ERC20BridgeSource.SushiSwap:
            const sushiSwapFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createSushiSwapBridgeData(sushiSwapFillData.tokenAddressPath, sushiSwapFillData.router));
            break;
        case types_2.ERC20BridgeSource.MultiBridge:
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createMultiBridgeData(takerToken, makerToken));
            break;
        case types_2.ERC20BridgeSource.Kyber:
            const kyberFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createKyberBridgeData(takerToken, kyberFillData.hint));
            break;
        case types_2.ERC20BridgeSource.Mooniswap:
            const mooniswapFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createMooniswapBridgeData(takerToken, mooniswapFillData.poolAddress));
            break;
        case types_2.ERC20BridgeSource.Dodo:
            const dodoFillData = fill.fillData; // tslint:disable-line:no-non-null-assertion
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createDODOBridgeData(takerToken, dodoFillData.poolAddress, dodoFillData.isSellBase));
            break;
        default:
            makerAssetData = order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(makerToken, bridgeAddress, createBridgeData(takerToken));
    }
    const [slippedMakerAssetAmount, slippedTakerAssetAmount] = getSlippedBridgeAssetAmounts(fill, opts);
    return Object.assign({ fills: [fill], makerAssetData, takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(takerToken), makerAddress: bridgeAddress, makerAssetAmount: slippedMakerAssetAmount, takerAssetAmount: slippedTakerAssetAmount, fillableMakerAssetAmount: slippedMakerAssetAmount, fillableTakerAssetAmount: slippedTakerAssetAmount }, createCommonBridgeOrderFields(opts.orderDomain));
}
exports.createBridgeOrder = createBridgeOrder;
function getMakerTakerTokens(opts) {
    const makerToken = opts.side === types_1.MarketOperation.Sell ? opts.outputToken : opts.inputToken;
    const takerToken = opts.side === types_1.MarketOperation.Sell ? opts.inputToken : opts.outputToken;
    return [makerToken, takerToken];
}
exports.getMakerTakerTokens = getMakerTakerTokens;
function createBridgeData(tokenAddress) {
    const encoder = utils_1.AbiEncoder.create([{ name: 'tokenAddress', type: 'address' }]);
    return encoder.encode({ tokenAddress });
}
function createMultiBridgeData(takerToken, makerToken) {
    const intermediateToken = multibridge_utils_1.getMultiBridgeIntermediateToken(takerToken, makerToken);
    const encoder = utils_1.AbiEncoder.create([
        { name: 'takerToken', type: 'address' },
        { name: 'intermediateToken', type: 'address' },
    ]);
    return encoder.encode({ takerToken, intermediateToken });
}
function createBalancerBridgeData(takerToken, poolAddress) {
    const encoder = utils_1.AbiEncoder.create([
        { name: 'takerToken', type: 'address' },
        { name: 'poolAddress', type: 'address' },
    ]);
    return encoder.encode({ takerToken, poolAddress });
}
function createBancorBridgeData(path, networkAddress) {
    const encoder = utils_1.AbiEncoder.create([
        { name: 'path', type: 'address[]' },
        { name: 'networkAddress', type: 'address' },
    ]);
    return encoder.encode({ path, networkAddress });
}
function createKyberBridgeData(fromTokenAddress, hint) {
    const encoder = utils_1.AbiEncoder.create([{ name: 'fromTokenAddress', type: 'address' }, { name: 'hint', type: 'bytes' }]);
    return encoder.encode({ fromTokenAddress, hint });
}
function createMooniswapBridgeData(takerToken, poolAddress) {
    const encoder = utils_1.AbiEncoder.create([
        { name: 'takerToken', type: 'address' },
        { name: 'poolAddress', type: 'address' },
    ]);
    return encoder.encode({ takerToken, poolAddress });
}
function createDODOBridgeData(takerToken, poolAddress, isSellBase) {
    const encoder = utils_1.AbiEncoder.create([
        { name: 'takerToken', type: 'address' },
        { name: 'poolAddress', type: 'address' },
        { name: 'isSellBase', type: 'bool' },
    ]);
    return encoder.encode({ takerToken, poolAddress, isSellBase });
}
function createCurveBridgeData(curveAddress, exchangeFunctionSelector, takerToken, fromTokenIdx, toTokenIdx) {
    const encoder = utils_1.AbiEncoder.create([
        { name: 'curveAddress', type: 'address' },
        { name: 'exchangeFunctionSelector', type: 'bytes4' },
        { name: 'fromTokenAddress', type: 'address' },
        { name: 'fromTokenIdx', type: 'int128' },
        { name: 'toTokenIdx', type: 'int128' },
    ]);
    return encoder.encode([curveAddress, exchangeFunctionSelector, takerToken, fromTokenIdx, toTokenIdx]);
}
function createUniswapV2BridgeData(tokenAddressPath) {
    const encoder = utils_1.AbiEncoder.create('(address[])');
    return encoder.encode([tokenAddressPath]);
}
function createSushiSwapBridgeData(tokenAddressPath, router) {
    const encoder = utils_1.AbiEncoder.create('(address[],address)');
    return encoder.encode([tokenAddressPath, router]);
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
            : utils_1.BigNumber.min(fill.output.times(opts.bridgeSlippage + 1).integerValue(utils_1.BigNumber.ROUND_UP), constants_1.MAX_UINT256),
    ];
}
function createCommonBridgeOrderFields(orderDomain) {
    return Object.assign({ takerAddress: constants_1.NULL_ADDRESS, senderAddress: constants_1.NULL_ADDRESS, feeRecipientAddress: constants_1.NULL_ADDRESS, salt: order_utils_1.generatePseudoRandomSalt(), 
        // 2 hours from now
        expirationTimeSeconds: new utils_1.BigNumber(Math.floor(Date.now() / constants_1.ONE_SECOND_MS) + constants_1.ONE_HOUR_IN_SECONDS * 2), makerFeeAssetData: constants_1.NULL_BYTES, takerFeeAssetData: constants_1.NULL_BYTES, makerFee: constants_1.ZERO_AMOUNT, takerFee: constants_1.ZERO_AMOUNT, fillableTakerFeeAmount: constants_1.ZERO_AMOUNT, signature: constants_1.WALLET_SIGNATURE }, orderDomain);
}
function createNativeOrder(fill) {
    return Object.assign({ fills: [fill] }, fill.fillData.order);
}
exports.createNativeOrder = createNativeOrder;
function createSignedOrdersFromRfqtIndicativeQuotes(quotes) {
    return quotes.map(quote => {
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