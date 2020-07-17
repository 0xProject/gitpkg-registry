import { AssetData, ERC20AssetData, ERC20BridgeAssetData, Order, SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
export declare function isSupportedAssetDataInOrders(orders: SignedOrder[]): boolean;
export declare function numberPercentageToEtherTokenAmountPercentage(percentage: number): BigNumber;
export declare function isOrderTakerFeePayableWithMakerAsset<T extends Order>(order: T): boolean;
export declare function isOrderTakerFeePayableWithTakerAsset<T extends Order>(order: T): boolean;
export declare function getAdjustedMakerAndTakerAmountsFromTakerFees<T extends Order>(order: T): [BigNumber, BigNumber];
export declare function isExactAssetData(expectedAssetData: string, actualAssetData: string): boolean;
/**
 * Compare the Asset Data for equivalency. Expected is the asset data the user provided (wanted),
 * actual is the asset data found or created.
 */
export declare function isAssetDataEquivalent(expectedAssetData: string, actualAssetData: string): boolean;
export declare function isERC20EquivalentAssetData(assetData: AssetData): assetData is ERC20AssetData | ERC20BridgeAssetData;
/**
 * Gets the difference between two sets.
 */
export declare function difference<T>(a: T[], b: T[]): T[];
//# sourceMappingURL=utils.d.ts.map