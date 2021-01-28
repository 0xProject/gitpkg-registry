import { LimitOrderFields as Order } from '@0x/protocol-utils';
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
export declare function numberPercentageToEtherTokenAmountPercentage(percentage: number): BigNumber;
export declare function getAdjustedTakerAmountFromFees<T extends Order>(order: T): BigNumber;
//# sourceMappingURL=utils.d.ts.map