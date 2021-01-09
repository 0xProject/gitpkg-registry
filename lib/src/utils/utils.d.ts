import { AssetData, ERC20AssetData, ERC20BridgeAssetData, Order, SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { PriceAwareRFQFlags } from '../types';
/**
 * Returns 2 flags (one for firm quotes and another for indicative quotes) that serve as rollout flags for the price-aware RFQ feature.
 * By default, indicative quotes should *always* go through the new price-aware flow. This means that all indicative RFQ requests made to
 * market makers will contain the new price-aware `suggestedPrice` field.
 * The `isPriceAwareRFQEnabled` feature object that is passed in by the 0x API will then control whether firm quotes go through price-aware RFQ.
 *
 * @param isPriceAwareRFQEnabled the feature flag that is passed in by the 0x API.
 */
export declare function getPriceAwareRFQRolloutFlags(priceAwareRFQFlags?: PriceAwareRFQFlags): PriceAwareRFQFlags;
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
export declare function getTokenFromAssetData(assetData: string): string;
//# sourceMappingURL=utils.d.ts.map