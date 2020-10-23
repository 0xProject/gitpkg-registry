"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_utils_1 = require("@0x/order-utils");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const constants_1 = require("../constants");
// tslint:disable: no-unnecessary-type-assertion completed-docs
function isSupportedAssetDataInOrders(orders) {
    const firstOrderMakerAssetData = !!orders[0]
        ? order_utils_1.assetDataUtils.decodeAssetDataOrThrow(orders[0].makerAssetData)
        : { assetProxyId: '' };
    return orders.every(o => {
        const takerAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(o.takerAssetData);
        const makerAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(o.makerAssetData);
        return ((makerAssetData.assetProxyId === types_1.AssetProxyId.ERC20 ||
            makerAssetData.assetProxyId === types_1.AssetProxyId.ERC721) &&
            takerAssetData.assetProxyId === types_1.AssetProxyId.ERC20 &&
            firstOrderMakerAssetData.assetProxyId === makerAssetData.assetProxyId); // checks that all native order maker assets are of the same type
    });
}
exports.isSupportedAssetDataInOrders = isSupportedAssetDataInOrders;
function numberPercentageToEtherTokenAmountPercentage(percentage) {
    return web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(constants_1.constants.ONE_AMOUNT, constants_1.constants.ETHER_TOKEN_DECIMALS).multipliedBy(percentage);
}
exports.numberPercentageToEtherTokenAmountPercentage = numberPercentageToEtherTokenAmountPercentage;
function isOrderTakerFeePayableWithMakerAsset(order) {
    return !order.takerFee.isZero() && isAssetDataEquivalent(order.takerFeeAssetData, order.makerAssetData);
}
exports.isOrderTakerFeePayableWithMakerAsset = isOrderTakerFeePayableWithMakerAsset;
function isOrderTakerFeePayableWithTakerAsset(order) {
    return !order.takerFee.isZero() && isAssetDataEquivalent(order.takerFeeAssetData, order.takerAssetData);
}
exports.isOrderTakerFeePayableWithTakerAsset = isOrderTakerFeePayableWithTakerAsset;
function getAdjustedMakerAndTakerAmountsFromTakerFees(order) {
    const adjustedMakerAssetAmount = isOrderTakerFeePayableWithMakerAsset(order)
        ? order.makerAssetAmount.minus(order.takerFee)
        : order.makerAssetAmount;
    const adjustedTakerAssetAmount = isOrderTakerFeePayableWithTakerAsset(order)
        ? order.takerAssetAmount.plus(order.takerFee)
        : order.takerAssetAmount;
    return [adjustedMakerAssetAmount, adjustedTakerAssetAmount];
}
exports.getAdjustedMakerAndTakerAmountsFromTakerFees = getAdjustedMakerAndTakerAmountsFromTakerFees;
function isExactAssetData(expectedAssetData, actualAssetData) {
    return expectedAssetData === actualAssetData;
}
exports.isExactAssetData = isExactAssetData;
/**
 * Compare the Asset Data for equivalency. Expected is the asset data the user provided (wanted),
 * actual is the asset data found or created.
 */
function isAssetDataEquivalent(expectedAssetData, actualAssetData) {
    if (isExactAssetData(expectedAssetData, actualAssetData)) {
        return true;
    }
    const decodedExpectedAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(expectedAssetData);
    const decodedActualAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(actualAssetData);
    // ERC20 === ERC20, ERC20 === ERC20Bridge
    if (isERC20EquivalentAssetData(decodedExpectedAssetData) && isERC20EquivalentAssetData(decodedActualAssetData)) {
        const doesTokenAddressMatch = decodedExpectedAssetData.tokenAddress === decodedActualAssetData.tokenAddress;
        return doesTokenAddressMatch;
    }
    // ERC1155 === ERC1155
    if (order_utils_1.assetDataUtils.isERC1155TokenAssetData(decodedExpectedAssetData) &&
        order_utils_1.assetDataUtils.isERC1155TokenAssetData(decodedActualAssetData)) {
        const doesTokenAddressMatch = decodedExpectedAssetData.tokenAddress === decodedActualAssetData.tokenAddress;
        // IDs may be out of order yet still equivalent
        // i.e (["a", "b"], [1,2]) === (["b", "a"], [2, 1])
        //     (["a", "b"], [2,1]) !== (["b", "a"], [2, 1])
        const hasAllIds = decodedExpectedAssetData.tokenIds.every(id => decodedActualAssetData.tokenIds.findIndex(v => id.eq(v)) !== -1);
        const hasAllValues = decodedExpectedAssetData.tokenIds.every((id, i) => decodedExpectedAssetData.tokenValues[i].eq(decodedActualAssetData.tokenValues[decodedActualAssetData.tokenIds.findIndex(v => id.eq(v))]));
        // If expected contains callback data, ensure it is present
        // if actual has callbackdata and expected provided none then ignore it
        const hasEquivalentCallback = decodedExpectedAssetData.callbackData === utils_1.NULL_BYTES ||
            decodedExpectedAssetData.callbackData === decodedActualAssetData.callbackData;
        return doesTokenAddressMatch && hasAllIds && hasAllValues && hasEquivalentCallback;
    }
    // ERC721 === ERC721
    if (order_utils_1.assetDataUtils.isERC721TokenAssetData(decodedExpectedAssetData) ||
        order_utils_1.assetDataUtils.isERC721TokenAssetData(decodedActualAssetData)) {
        // Asset Data should exactly match for ERC721
        return isExactAssetData(expectedAssetData, actualAssetData);
    }
    // TODO(dekz): Unsupported cases
    // ERCXX(token) === MAP(token, staticCall)
    // MAP(a, b) === MAP(b, a) === MAP(b, a, staticCall)
    return false;
}
exports.isAssetDataEquivalent = isAssetDataEquivalent;
function isERC20EquivalentAssetData(assetData) {
    return order_utils_1.assetDataUtils.isERC20TokenAssetData(assetData) || order_utils_1.assetDataUtils.isERC20BridgeAssetData(assetData);
}
exports.isERC20EquivalentAssetData = isERC20EquivalentAssetData;
function getTokenFromAssetData(assetData) {
    const data = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(assetData);
    if (data.assetProxyId !== types_1.AssetProxyId.ERC20 && data.assetProxyId !== types_1.AssetProxyId.ERC20Bridge) {
        throw new Error(`Unsupported exchange proxy quote asset type: ${data.assetProxyId}`);
    }
    // tslint:disable-next-line:no-unnecessary-type-assertion
    return data.tokenAddress;
}
exports.getTokenFromAssetData = getTokenFromAssetData;
//# sourceMappingURL=utils.js.map