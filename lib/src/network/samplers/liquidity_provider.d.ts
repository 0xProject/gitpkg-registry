import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface LiquidityProviderFillData extends FillData {
    poolAddress: Address;
    gasCost: number;
}
export interface LiquidityProviderInfo {
    tokens: Address[];
    gasCost: number | ((takerToken: Address, makerToken: Address) => number);
}
export interface LiquidityProviderRegistry {
    [address: string]: LiquidityProviderInfo;
}
declare const DEFAULT_LIQUIDITY_PROVIDER_REGISTRY_BY_CHAIN_ID: {
    1: LiquidityProviderRegistry;
    3: LiquidityProviderRegistry;
    4: LiquidityProviderRegistry;
    42: LiquidityProviderRegistry;
    1337: LiquidityProviderRegistry;
    56: LiquidityProviderRegistry;
    137: LiquidityProviderRegistry;
    80001: LiquidityProviderRegistry;
};
export declare type LiquidityProviderRegistryByChainId = typeof DEFAULT_LIQUIDITY_PROVIDER_REGISTRY_BY_CHAIN_ID;
export declare function mergeLiquidityProviderRegistries(...registries: LiquidityProviderRegistryByChainId[]): LiquidityProviderRegistryByChainId;
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromLiquidityProvider'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromLiquidityProvider'];
declare type SamplerSellEthCall = SamplerEthCall<LiquidityProviderFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<LiquidityProviderFillData, BuyContractBuyFunction>;
export declare class LiquidityProviderSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, LiquidityProviderFillData> {
    private readonly _registry;
    static createAsync(chain: Chain, registry?: LiquidityProviderRegistry): Promise<LiquidityProviderSampler>;
    protected constructor(chain: Chain, _registry: LiquidityProviderRegistry);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
    private _findCompatibleProviders;
}
export {};
//# sourceMappingURL=liquidity_provider.d.ts.map