import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface MooniswapFillData extends FillData {
    poolAddress: string;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromMooniswap'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromMooniswap'];
declare type SamplerSellEthCall = SamplerEthCall<MooniswapFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<MooniswapFillData, BuyContractBuyFunction>;
export declare class MooniswapSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, MooniswapFillData> {
    private readonly _registries;
    private readonly _weth;
    static createAsync(chain: Chain): Promise<MooniswapSampler>;
    protected constructor(chain: Chain, _registries: Address[], _weth: Address);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
    private _normalizeToken;
}
export {};
//# sourceMappingURL=mooniswap.d.ts.map