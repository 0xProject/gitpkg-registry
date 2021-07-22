import { BigNumber } from '@0x/utils';
import { Pool } from '@balancer-labs/sor/dist/types';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, ERC20BridgeSource, FillData } from '../types';
import { CacheValue, PoolsCache } from './utils/pools_cache';
export interface BalancerFillData extends FillData {
    poolAddress: Address;
}
interface BalancerPoolResponse {
    id: string;
    swapFee: string;
    tokens: Array<{
        address: Address;
        decimals: number;
        balance: string;
    }>;
    tokensList: Address[];
    totalWeight: string;
}
export declare class BalancerPoolsCache extends PoolsCache {
    private readonly _subgraphUrl;
    private readonly maxPoolsFetched;
    private readonly _topPoolsFetched;
    constructor(_subgraphUrl?: string, cache?: {
        [key: string]: CacheValue;
    }, maxPoolsFetched?: number, _topPoolsFetched?: number);
    protected _fetchPoolsForPairAsync(takerToken: Address, makerToken: Address): Promise<Pool[]>;
    protected _loadTopPoolsAsync(): Promise<void>;
    protected _fetchTopPoolsAsync(): Promise<BalancerPoolResponse[]>;
}
export declare class CreamPoolsCache extends PoolsCache {
    private readonly maxPoolsFetched;
    constructor(_cache?: {
        [key: string]: CacheValue;
    }, maxPoolsFetched?: number);
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromBalancer'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromBalancer'];
declare type SamplerSellEthCall = SamplerEthCall<BalancerFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<BalancerFillData, BuyContractBuyFunction>;
export declare class BalancerSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, BalancerFillData> {
    readonly fork: ERC20BridgeSource;
    private readonly _cache;
    static createAsync(chain: Chain, fork: ERC20BridgeSource): Promise<BalancerSampler>;
    protected constructor(chain: Chain, fork: ERC20BridgeSource, _cache: PoolsCache);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=balancer.d.ts.map