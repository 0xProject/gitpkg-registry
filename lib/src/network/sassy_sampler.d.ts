import { BigNumber } from '@0x/utils';
import { Chain } from './chain';
import { LiquidityProviderRegistry } from './samplers';
import { TwoHopFillData, TwoHopSampler } from './two_hop_sampler';
import { Address, DexSample, ERC20BridgeSource, SourceSamplerMap, TokenAdjacencyGraph } from './types';
interface SassySamplerCreateFullOpts {
    chain: Chain;
    sources: ERC20BridgeSource[];
    tokenAdjacencyGraph: TokenAdjacencyGraph;
    liquidityProviderRegistry?: LiquidityProviderRegistry;
    maxPriceCacheAgeMs?: number;
}
declare type SassySamplerCreateOpts = Partial<SassySamplerCreateFullOpts> & {
    chain: Chain;
};
export declare class SassySampler {
    readonly chain: Chain;
    private readonly _samplers;
    private readonly _tokenAdjacencyGraph;
    private readonly _twoHopSampler;
    readonly availableSources: ERC20BridgeSource[];
    static createAsync(opts: SassySamplerCreateOpts): Promise<SassySampler>;
    protected constructor(chain: Chain, _samplers: SourceSamplerMap, _tokenAdjacencyGraph: TokenAdjacencyGraph, _twoHopSampler: TwoHopSampler);
    getMedianSellRateAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, takerAmount: BigNumber, batchId?: string): Promise<BigNumber>;
    getSellSamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, takerAmounts: BigNumber[], batchId?: string): Promise<DexSample[][]>;
    getBuySamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, makerAmounts: BigNumber[], batchId?: string): Promise<DexSample[][]>;
    getTwoHopSellSamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, takerAmount: BigNumber, batchId?: string): Promise<Array<DexSample<TwoHopFillData>>>;
    getTwoHopBuySamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, makerAmount: BigNumber, batchId?: string): Promise<Array<DexSample<TwoHopFillData>>>;
    private _sampleSellsFromSourceAsync;
    private _sampleBuysFromSourceAsync;
    private _getExpandedTokenPaths;
    private _getTwoHopTokenPaths;
    private _getIntermediateTokens;
    private _findSampler;
}
export {};
//# sourceMappingURL=sassy_sampler.d.ts.map