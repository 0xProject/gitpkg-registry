import { BigNumber } from '@0x/utils';
import { CurveInfo, SnowSwapInfo, SwerveInfo } from './types';
/**
 * Filter Kyber reserves which should not be used (0xbb bridged reserves)
 * @param reserveId Kyber reserveId
 */
export declare function isAllowedKyberReserveId(reserveId: string): boolean;
export declare function isValidAddress(address: any): address is string;
/**
 * Returns the offsets to be used to discover Kyber reserves
 */
export declare function getKyberOffsets(): BigNumber[];
export declare function getDodoV2Offsets(): BigNumber[];
export declare function getShellsForPair(takerToken: string, makerToken: string): string[];
export declare function getCurveInfosForPair(takerToken: string, makerToken: string): CurveInfo[];
export declare function getSwerveInfosForPair(takerToken: string, makerToken: string): SwerveInfo[];
export declare function getSnowSwapInfosForPair(takerToken: string, makerToken: string): SnowSwapInfo[];
//# sourceMappingURL=bridge_source_utils_BASE_37624.d.ts.map