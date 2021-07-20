import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface DodoV2FillData extends FillData {
    poolAddress: Address;
    isSellBase: boolean;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromDODOV2'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromDODOV2'];
declare type SamplerSellEthCall = SamplerEthCall<DodoV2FillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<DodoV2FillData, BuyContractBuyFunction>;
export declare class DodoV2Sampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, DodoV2FillData> {
    private readonly _factories;
    static createAsync(chain: Chain): Promise<DodoV2Sampler>;
    protected constructor(chain: Chain, _factories: Address[]);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=dodo_v2.d.ts.map