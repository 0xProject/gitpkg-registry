import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, ERC20BridgeSource, FillData } from '../types';
export interface ShellFillData extends FillData {
    poolAddress: string;
}
export interface ShellPoolInfo {
    poolAddress: Address;
    tokens: Address[];
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromShell'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromShell'];
declare type SamplerSellEthCall = SamplerEthCall<ShellFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<ShellFillData, BuyContractBuyFunction>;
export declare class ShellSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, ShellFillData> {
    readonly fork: ERC20BridgeSource;
    private readonly _pools;
    static createAsync(chain: Chain, fork: ERC20BridgeSource): Promise<ShellSampler>;
    protected constructor(chain: Chain, fork: ERC20BridgeSource, _pools: ShellPoolInfo[]);
    canConvertTokens(tokenAddressPath: Address[], pools?: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
    private _getPoolsForTokens;
}
export {};
//# sourceMappingURL=shell.d.ts.map