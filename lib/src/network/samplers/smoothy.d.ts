import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, ERC20BridgeSource } from '../types';
import { CurveFillData, CurveInfo } from './curve';
export declare type SmoothyFillData = CurveFillData;
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromSmoothy'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromSmoothy'];
declare type SamplerSellEthCall = SamplerEthCall<SmoothyFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<SmoothyFillData, BuyContractBuyFunction>;
export declare class SmoothySampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, SmoothyFillData> {
    readonly fork: ERC20BridgeSource;
    private readonly _curveInfos;
    static createAsync(chain: Chain, fork?: ERC20BridgeSource): Promise<SmoothySampler>;
    protected constructor(chain: Chain, fork: ERC20BridgeSource, _curveInfos: CurveInfo[]);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
    private _findCompatibleCurves;
}
export {};
//# sourceMappingURL=smoothy.d.ts.map