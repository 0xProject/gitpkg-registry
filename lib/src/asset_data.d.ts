import { AssetProxyId } from '@0x/types';
import { BigNumber } from '@0x/utils';
/**
 * Get the proxy ID from encoded asset data.
 */
export declare function getAssetDataProxyId(encoded: string): AssetProxyId;
/**
 * Decode ERC20 asset data.
 */
export declare function decodeERC20AssetData(encoded: string): string;
/**
 * Decode ERC721 asset data.
 */
export declare function decodeERC721AssetData(encoded: string): [string, BigNumber];
/**
 * Decode ERC1155 asset data.
 */
export declare function decodeERC1155AssetData(encoded: string): [string, BigNumber[], BigNumber[], string];
/**
 * Decode MultiAsset asset data.
 */
export declare function decodeMultiAssetData(encoded: string): [BigNumber[], string[]];
/**
 * Decode StaticCall asset data.
 */
export declare function decodeStaticCallAssetData(encoded: string): [string, string, string];
/**
 * Decode ERC20Bridge asset data.
 */
export declare function decodeERC20BridgeAssetData(encoded: string): [string, string, string];
/**
 * Encode ERC20 asset data.
 */
export declare function encodeERC20AssetData(tokenAddress: string): string;
/**
 * Encode ERC721 asset data.
 */
export declare function encodeERC721AssetData(tokenAddress: string, tokenId: BigNumber): string;
/**
 * Encode ERC1155 asset data.
 */
export declare function encodeERC1155AssetData(tokenAddress: string, tokenIds: BigNumber[], values: BigNumber[], callbackData: string): string;
/**
 * Encode MultiAsset asset data.
 */
export declare function encodeMultiAssetData(values: BigNumber[], nestedAssetData: string[]): string;
/**
 * Encode StaticCall asset data.
 */
export declare function encodeStaticCallAssetData(staticCallTargetAddress: string, staticCallData: string, expectedReturnDataHash: string): string;
/**
 * Encode ERC20Bridge asset data.
 */
export declare function encodeERC20BridgeAssetData(tokenAddress: string, bridgeAddress: string, bridgeData: string): string;
//# sourceMappingURL=asset_data.d.ts.map