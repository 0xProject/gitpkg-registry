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
    getMedianSellRateAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, takerAmount: BigNumber): Promise<BigNumber>;
    getSellSamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, takerAmounts: BigNumber[]): Promise<DexSample[][]>;
    getBuySamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, makerAmounts: BigNumber[]): Promise<DexSample[][]>;
    getTwoHopSellSamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, takerAmount: BigNumber): Promise<Array<DexSample<TwoHopFillData>>>;
    getTwoHopBuySamplesAsync(sources: ERC20BridgeSource[], takerToken: Address, makerToken: Address, makerAmount: BigNumber): Promise<Array<DexSample<TwoHopFillData>>>;
    private _findSampler;
    private _sampleSellsFromSourceAsync;
    private _sampleBuysFromSourceAsync;
    private _getExpandedTokenPaths;
    private _getTwoHopTokenPaths;
    private _getIntermediateTokens;
}
export {};
//# sourceMappingURL=sassy_sampler.d.ts.map