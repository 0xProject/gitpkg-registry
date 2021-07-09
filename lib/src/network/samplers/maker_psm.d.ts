import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
/**
 * Configuration for a specific PSM vault
 */
interface MakerPsmInfo {
    psmAddress: Address;
    ilkIdentifier: string;
    gemTokenAddress: Address;
}
export declare type MakerPsmFillData = FillData & MakerPsmInfo & {
    takerToken: Address;
};
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromMakerPsm'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromMakerPsm'];
declare type SamplerSellEthCall = SamplerEthCall<MakerPsmFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<MakerPsmFillData, BuyContractBuyFunction>;
export declare class MakerPsmSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, MakerPsmFillData> {
    private readonly _psmInfo;
    static createAsync(chain: Chain): Promise<MakerPsmSampler>;
    protected constructor(chain: Chain, _psmInfo: MakerPsmInfo);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=maker_psm.d.ts.map