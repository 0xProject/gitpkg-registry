import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface OasisFillData extends FillData {
    router: Address;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromEth2Dai'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromEth2Dai'];
declare type SamplerSellEthCall = SamplerEthCall<OasisFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<OasisFillData, BuyContractBuyFunction>;
export declare class OasisSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, OasisFillData> {
    private readonly _router;
    static createAsync(chain: Chain): Promise<OasisSampler>;
    protected constructor(chain: Chain, _router: Address);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=oasis.d.ts.map