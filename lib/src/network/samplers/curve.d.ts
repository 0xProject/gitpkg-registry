import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, ERC20BridgeSource, FillData } from '../types';
/**
 * Configuration info on a Curve pool.
 */
export interface CurveInfo {
    exchangeFunctionSelector: CurveFunctionSelectors;
    sellQuoteFunctionSelector: CurveFunctionSelectors;
    buyQuoteFunctionSelector: CurveFunctionSelectors;
    poolAddress: Address;
    tokens: Address[];
    metaTokens: string[] | undefined;
    gasSchedule: number;
}
export interface CurveFillData extends FillData {
    fromTokenIdx: number;
    toTokenIdx: number;
    pool: CurveInfo;
}
/**
 * Curve contract function selectors.
 */
export declare enum CurveFunctionSelectors {
    None = "0x00000000",
    exchange = "0x3df02124",
    exchange_underlying = "0xa6417ed6",
    get_dy_underlying = "0x07211ef7",
    get_dx_underlying = "0x0e71d1b9",
    get_dy = "0x5e0d443f",
    get_dx = "0x67df02ca",
    swap_uint256 = "0x5673b02d",
    get_swap_amount = "0x45cf2ef6",
    swap = "0x91695586",
    calculateSwap = "0xa95b089f",
    exchange_v2 = "0x5b41b908",
    exchange_underlying_v2 = "0x65b2489b",
    get_dy_v2 = "0x556d6e9f",
    get_dy_underlying_v2 = "0x85f11d1e"
}
export declare const IRONSWAP_POOLS: {
    is3usd: string;
};
export declare const CURVE_V2_MAINNET_INFOS: {
    [name: string]: CurveInfo;
};
export declare const IRONSWAP_POLYGON_INFOS: {
    [name: string]: CurveInfo;
};
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromCurve'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromCurve'];
declare type SamplerSellEthCall = SamplerEthCall<CurveFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<CurveFillData, BuyContractBuyFunction>;
export declare class CurveSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, CurveFillData> {
    readonly fork: ERC20BridgeSource;
    private readonly _curveInfos;
    static createAsync(chain: Chain, fork: ERC20BridgeSource): Promise<CurveSampler>;
    protected constructor(chain: Chain, fork: ERC20BridgeSource, _curveInfos: CurveInfo[]);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
    private _findCompatibleCurves;
}
export declare function isCurveCompatible(curve: CurveInfo, tokens: Address[]): boolean;
export {};
//# sourceMappingURL=curve.d.ts.map