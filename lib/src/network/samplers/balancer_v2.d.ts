import { BigNumber } from '@0x/utils';
import { Pool } from '@balancer-labs/sor/dist/types';
import { DEFAULT_WARNING_LOGGER } from '../../constants';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, Bytes, FillData } from '../types';
import { CacheValue, PoolsCache } from './utils/pools_cache';
/**
 * Configuration info for a Balancer V2 pool.
 */
interface BalancerV2PoolInfo {
    poolId: Bytes;
    vault: Address;
}
export interface BalancerV2FillData extends FillData, BalancerV2PoolInfo {
}
interface BalancerV2PoolResponse {
    id: string;
    swapFee: string;
    tokens: Array<{
        address: string;
        decimals: number;
        balance: string;
        weight: string;
        symbol: string;
    }>;
    tokensList: string[];
    totalWeight: string;
    totalShares: string;
    amp: string | null;
}
export declare class BalancerV2PoolsCache extends PoolsCache {
    private readonly subgraphUrl;
    private readonly maxPoolsFetched;
    private readonly _topPoolsFetched;
    private readonly _warningLogger;
    private static _parseSubgraphPoolData;
    constructor(subgraphUrl: string, maxPoolsFetched?: number, _topPoolsFetched?: number, _warningLogger?: typeof DEFAULT_WARNING_LOGGER, cache?: {
        [key: string]: CacheValue;
    });
    protected _fetchTopPoolsAsync(): Promise<BalancerV2PoolResponse[]>;
    protected _loadTopPoolsAsync(): Promise<void>;
    protected _fetchPoolsForPairAsync(takerToken: string, makerToken: string): Promise<Pool[]>;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromBalancerV2'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromBalancerV2'];
declare type SamplerSellEthCall = SamplerEthCall<BalancerV2FillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<BalancerV2FillData, BuyContractBuyFunction>;
export declare class BalancerV2Sampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, BalancerV2FillData> {
    private readonly _cache;
    private readonly _vaultAddress;
    static createAsync(chain: Chain): Promise<BalancerV2Sampler>;
    protected constructor(chain: Chain, _cache: PoolsCache, _vaultAddress: Address);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=balancer_v2.d.ts.map