import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { CurveInfo, ERC20BridgeSource, PlatypusInfo } from './types';
export declare function isValidAddress(address: string | String): address is string;
export declare function getDodoV2Offsets(): BigNumber[];
export declare function getShellsForPair(chainId: ChainId, takerToken: string, makerToken: string): string[];
export declare function getComponentForPair(chainId: ChainId, takerToken: string, makerToken: string): string[];
export declare function getMStableForPair(chainId: ChainId, takerToken: string, makerToken: string): string[];
export declare function getCurveInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getCurveV2InfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getNerveInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getSynapseInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getFirebirdOneSwapInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getBeltInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getEllipsisInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getSaddleInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getIronSwapInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getXSigmaInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getAcryptosInfosForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getMobiusMoneyInfoForPair(chainId: ChainId, takerToken: string, makerToken: string): CurveInfo[];
export declare function getPlatypusInfoForPair(chainId: ChainId, takerToken: string, makerToken: string): PlatypusInfo[];
export declare function getShellLikeInfosForPair(chainId: ChainId, takerToken: string, makerToken: string, source: ERC20BridgeSource.Shell | ERC20BridgeSource.Component | ERC20BridgeSource.MStable): string[];
export interface CurveDetailedInfo extends CurveInfo {
    makerTokenIdx: number;
    takerTokenIdx: number;
}
export declare function getCurveLikeInfosForPair(chainId: ChainId, takerToken: string, makerToken: string, source: ERC20BridgeSource.Curve | ERC20BridgeSource.CurveV2 | ERC20BridgeSource.Nerve | ERC20BridgeSource.Synapse | ERC20BridgeSource.Belt | ERC20BridgeSource.Ellipsis | ERC20BridgeSource.Saddle | ERC20BridgeSource.IronSwap | ERC20BridgeSource.XSigma | ERC20BridgeSource.FirebirdOneSwap | ERC20BridgeSource.ACryptos | ERC20BridgeSource.MobiusMoney): CurveDetailedInfo[];
export declare function uniswapV2LikeRouterAddress(chainId: ChainId, source: ERC20BridgeSource.UniswapV2 | ERC20BridgeSource.SushiSwap | ERC20BridgeSource.CryptoCom | ERC20BridgeSource.PancakeSwap | ERC20BridgeSource.PancakeSwapV2 | ERC20BridgeSource.BakerySwap | ERC20BridgeSource.ApeSwap | ERC20BridgeSource.CheeseSwap | ERC20BridgeSource.QuickSwap | ERC20BridgeSource.Dfyn | ERC20BridgeSource.WaultSwap | ERC20BridgeSource.ShibaSwap | ERC20BridgeSource.TraderJoe | ERC20BridgeSource.Pangolin | ERC20BridgeSource.UbeSwap | ERC20BridgeSource.MorpheusSwap | ERC20BridgeSource.SpookySwap | ERC20BridgeSource.SpiritSwap | ERC20BridgeSource.BiSwap | ERC20BridgeSource.Yoshi | ERC20BridgeSource.MDex | ERC20BridgeSource.KnightSwap | ERC20BridgeSource.MeshSwap): string;
export declare function isBadTokenForSource(token: string, source: ERC20BridgeSource): boolean;
//# sourceMappingURL=bridge_source_utils.d.ts.map