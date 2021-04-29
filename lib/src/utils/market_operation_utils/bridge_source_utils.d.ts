import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { CurveInfo, ERC20BridgeSource } from './types';
/**
 * Filter Kyber reserves which should not be used (0xbb bridged reserves)
 * @param reserveId Kyber reserveId
 */
export declare function isAllowedKyberReserveId(reserveId: string): boolean;
export declare function isValidAddress(address: string | String): address is string;
/**
 * Returns the offsets to be used to discover Kyber reserves
 */
export declare function getKyberOffsets(): BigNumber[];
export declare function getDodoV2Offsets(): BigNumber[];
export declare function getShellsForPair(chainId: ChainId, takerToken: string, makerToken: string): string[];
export declare function getComponentForPair(chainId: ChainId, takerToken: string, makerToken: string): string[];
export declare function getCurveInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getSwerveInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getSnowSwapInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getNerveInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getBeltInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getEllipsisInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getSmoothyInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getSaddleInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getShellLikeInfosForPair(chainId: ChainId, takerToken: string, makerToken: string, source: ERC20BridgeSource.Shell | ERC20BridgeSource.Component): string[];
export declare function getCurveLikeInfosForPair(chainId: ChainId, takerToken: string, makerToken: string, source: ERC20BridgeSource.Curve | ERC20BridgeSource.Swerve | ERC20BridgeSource.SnowSwap | ERC20BridgeSource.Nerve | ERC20BridgeSource.Belt | ERC20BridgeSource.Ellipsis | ERC20BridgeSource.Smoothy | ERC20BridgeSource.Saddle): CurveInfo[];
export declare function uniswapV2LikeRouterAddress(chainId: ChainId, source: ERC20BridgeSource.UniswapV2 | ERC20BridgeSource.SushiSwap | ERC20BridgeSource.CryptoCom | ERC20BridgeSource.PancakeSwap | ERC20BridgeSource.BakerySwap | ERC20BridgeSource.KyberDmm | ERC20BridgeSource.PancakeSwapV2): string;
export declare function isBadTokenForSource(token: string, source: ERC20BridgeSource): boolean;
//# sourceMappingURL=bridge_source_utils.d.ts.map