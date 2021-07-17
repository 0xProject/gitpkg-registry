import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address } from '../types';
import { ShellFillData, ShellPoolInfo } from './shell';
export declare type MStableFillData = ShellFillData;
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromMStable'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromMStable'];
declare type SamplerSellEthCall = SamplerEthCall<MStableFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<MStableFillData, BuyContractBuyFunction>;
export declare class MStableSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, MStableFillData> {
    private readonly _pools;
    static createAsync(chain: Chain): Promise<MStableSampler>;
    protected constructor(chain: Chain, _pools: ShellPoolInfo[]);
    canConvertTokens(tokenAddressPath: Address[], pools?: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
    private _getPoolsForTokens;
}
export {};
//# sourceMappingURL=mstable.d.ts.map