import { BigNumber } from '@0x/utils';
import { UniswapV3BuySamplerContract, UniswapV3SellSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, Bytes, FillData } from '../types';
interface SamplerConfig {
    quoter: Address;
    router: Address;
}
export interface UniswapV3FillData extends FillData {
    tokenAddressPath: Address[];
    router: Address;
    uniswapPath: Bytes;
}
declare type SellContract = UniswapV3SellSamplerContract;
declare type BuyContract = UniswapV3BuySamplerContract;
declare type SellContractSellFunction = SellContract['sampleSells'];
declare type BuyContractBuyFunction = BuyContract['sampleBuys'];
declare type SamplerSellEthCall = SamplerEthCall<UniswapV3FillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<UniswapV3FillData, BuyContractBuyFunction>;
export declare class UniswapV3Sampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, UniswapV3FillData> {
    private readonly _config;
    static createAsync(chain: Chain): Promise<UniswapV3Sampler>;
    protected constructor(chain: Chain, _config: SamplerConfig);
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=uniswap_v3.d.ts.map