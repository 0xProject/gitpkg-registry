import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface LidoInfo {
    stEthToken: string;
    wethToken: string;
}
export interface LidoFillData extends FillData {
    stEthTokenAddress: string;
    takerToken: string;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromLido'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromLido'];
declare type SamplerSellEthCall = SamplerEthCall<LidoFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<LidoFillData, BuyContractBuyFunction>;
export declare class LidoSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, LidoFillData> {
    private readonly _lidoInfo;
    static createAsync(chain: Chain): Promise<LidoSampler>;
    protected constructor(chain: Chain, _lidoInfo: LidoInfo);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=lido.d.ts.map