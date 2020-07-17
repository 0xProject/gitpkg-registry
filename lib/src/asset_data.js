"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var wrappers_1 = require("./wrappers");
var assetDataIface = new wrappers_1.IAssetDataContract('0x0000000000000000000000000000000000000000', { isEIP1193: true });
/**
 * Get the proxy ID from encoded asset data.
 */
function getAssetDataProxyId(encoded) {
    // tslint:disable-next-line: no-unnecessary-type-assertion
    return utils_1.hexUtils.slice(encoded, 0, 4);
}
exports.getAssetDataProxyId = getAssetDataProxyId;
/**
 * Decode ERC20 asset data.
 */
function decodeERC20AssetData(encoded) {
    return assetDataIface.getABIDecodedTransactionData('ERC20Token', encoded);
}
exports.decodeERC20AssetData = decodeERC20AssetData;
/**
 * Decode ERC721 asset data.
 */
function decodeERC721AssetData(encoded) {
    return assetDataIface.getABIDecodedTransactionData('ERC721Token', encoded);
}
exports.decodeERC721AssetData = decodeERC721AssetData;
/**
 * Decode ERC1155 asset data.
 */
function decodeERC1155AssetData(encoded) {
    return assetDataIface.getABIDecodedTransactionData('ERC1155Assets', encoded);
}
exports.decodeERC1155AssetData = decodeERC1155AssetData;
/**
 * Decode MultiAsset asset data.
 */
function decodeMultiAssetData(encoded) {
    return assetDataIface.getABIDecodedTransactionData('MultiAsset', encoded);
}
exports.decodeMultiAssetData = decodeMultiAssetData;
/**
 * Decode StaticCall asset data.
 */
function decodeStaticCallAssetData(encoded) {
    return assetDataIface.getABIDecodedTransactionData('StaticCall', encoded);
}
exports.decodeStaticCallAssetData = decodeStaticCallAssetData;
/**
 * Decode ERC20Bridge asset data.
 */
function decodeERC20BridgeAssetData(encoded) {
    return assetDataIface.getABIDecodedTransactionData('ERC20Bridge', encoded);
}
exports.decodeERC20BridgeAssetData = decodeERC20BridgeAssetData;
/**
 * Encode ERC20 asset data.
 */
function encodeERC20AssetData(tokenAddress) {
    return assetDataIface.ERC20Token(tokenAddress).getABIEncodedTransactionData();
}
exports.encodeERC20AssetData = encodeERC20AssetData;
/**
 * Encode ERC721 asset data.
 */
function encodeERC721AssetData(tokenAddress, tokenId) {
    return assetDataIface.ERC721Token(tokenAddress, tokenId).getABIEncodedTransactionData();
}
exports.encodeERC721AssetData = encodeERC721AssetData;
/**
 * Encode ERC1155 asset data.
 */
function encodeERC1155AssetData(tokenAddress, tokenIds, values, callbackData) {
    return assetDataIface.ERC1155Assets(tokenAddress, tokenIds, values, callbackData).getABIEncodedTransactionData();
}
exports.encodeERC1155AssetData = encodeERC1155AssetData;
/**
 * Encode MultiAsset asset data.
 */
function encodeMultiAssetData(values, nestedAssetData) {
    return assetDataIface.MultiAsset(values, nestedAssetData).getABIEncodedTransactionData();
}
exports.encodeMultiAssetData = encodeMultiAssetData;
/**
 * Encode StaticCall asset data.
 */
function encodeStaticCallAssetData(staticCallTargetAddress, staticCallData, expectedReturnDataHash) {
    return assetDataIface
        .StaticCall(staticCallTargetAddress, staticCallData, expectedReturnDataHash)
        .getABIEncodedTransactionData();
}
exports.encodeStaticCallAssetData = encodeStaticCallAssetData;
/**
 * Encode ERC20Bridge asset data.
 */
function encodeERC20BridgeAssetData(tokenAddress, bridgeAddress, bridgeData) {
    return assetDataIface.ERC20Bridge(tokenAddress, bridgeAddress, bridgeData).getABIEncodedTransactionData();
}
exports.encodeERC20BridgeAssetData = encodeERC20BridgeAssetData;
//# sourceMappingURL=asset_data.js.map