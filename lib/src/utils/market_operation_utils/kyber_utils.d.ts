import { BigNumber } from '@0x/utils';
/**
 * Filter Kyber reserves which should not be used (0xbb bridged reserves)
 * @param reserveId Kyber reserveId
 */
export declare function isAllowedKyberReserveId(reserveId: string): boolean;
/**
 * Returns the offsets to be used to discover Kyber reserves
 */
export declare function getKyberOffsets(): BigNumber[];
//# sourceMappingURL=kyber_utils.d.ts.map