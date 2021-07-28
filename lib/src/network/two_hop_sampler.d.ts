import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../wrappers';
import { Chain } from './chain';
import { Address, DexSample, ERC20BridgeSource, FillData, SourceSamplerMap } from './types';
import { ContractHelper } from './utils';
export interface TwoHopFillData extends FillData {
    firstHop: DexSample;
    secondHop: DexSample;
    intermediateToken: Address;
}
export declare class TwoHopSampler {
    readonly chain: Chain;
    private readonly _samplers;
    private readonly _maxCacheAgeMs;
    protected readonly _sellContract: ERC20BridgeSamplerContract;
    protected readonly _buyContract: ERC20BridgeSamplerContract;
    protected readonly _sellContractHelper: ContractHelper<ERC20BridgeSamplerContract>;
    protected readonly _buyContractHelper: ContractHelper<ERC20BridgeSamplerContract>;
    static createAsync(chain: Chain, subSamplers: SourceSamplerMap, maxCacheAgeMs?: number): Promise<TwoHopSampler>;
    protected constructor(chain: Chain, _samplers: SourceSamplerMap, _maxCacheAgeMs?: number);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    getTwoHopSellSampleAsync(sources: ERC20BridgeSource[], tokenAddressPath: Address[], takerFillAmount: BigNumber, batchId?: string): Promise<DexSample<TwoHopFillData> | null>;
    getTwoHopBuySampleAsync(sources: ERC20BridgeSource[], tokenAddressPath: Address[], makerFillAmount: BigNumber, batchId?: string): Promise<DexSample<TwoHopFillData> | null>;
    private _getMultiHopSellCallInfosAsync;
    private _getMultiHopBuyCallInfosAsync;
    private _getEligibleSamplers;
}
//# sourceMappingURL=two_hop_sampler.d.ts.map