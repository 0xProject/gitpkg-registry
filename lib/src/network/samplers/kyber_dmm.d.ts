import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address } from '../types';
import { UniswapV2FillData } from './uniswap_v2';
export interface KyberDmmFillData extends UniswapV2FillData {
    poolsPath: Address[];
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromKyberDmm'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromKyberDmm'];
declare type SamplerSellEthCall = SamplerEthCall<KyberDmmFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<KyberDmmFillData, BuyContractBuyFunction>;
export declare class KyberDmmSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, KyberDmmFillData> {
    private readonly _router;
    static createAsync(chain: Chain): Promise<KyberDmmSampler>;
    protected constructor(chain: Chain, _router: Address);
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=kyber_dmm.d.ts.map