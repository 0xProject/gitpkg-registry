import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { CurveInfo, ERC20BridgeSource, SnowSwapInfo, SwerveInfo } from './types';
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
export declare function getShellsForPair(chainId: ChainId, takerToken: string, makerToken: string): string[];
export declare function getCurveInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getSwerveInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): SwerveInfo[];
export declare function getSnowSwapInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): SnowSwapInfo[];
export declare function uniswapV2LikeRouterAddress(chainId: ChainId, source: ERC20BridgeSource.UniswapV2 | ERC20BridgeSource.SushiSwap | ERC20BridgeSource.CryptoCom | ERC20BridgeSource.PancakeSwap | ERC20BridgeSource.BakerySwap): string;
//# sourceMappingURL=bridge_source_utils_REMOTE_37624.d.ts.map