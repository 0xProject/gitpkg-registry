import { BigNumber } from '@0x/utils';
import { Chain, ChainEthCallOpts } from './chain';
import { Address, DexSample, FillData, MultiHopCallInfo, SourceSampler } from './types';
import { ContractFunction, ContractHelper, ContractWrapperType, GeneratedContract, UnwrapContractFunctionReturnType } from './utils';
export declare abstract class SourceSamplerBase implements SourceSampler {
    protected constructor();
    canConvertTokens(_tokenAddressPath: Address[]): boolean;
    abstract getSellSamplesAsync(tokenAddressPath: Address[], takerFillAmounts: BigNumber[]): Promise<DexSample[][]>;
    abstract getBuySamplesAsync(tokenAddressPath: Address[], makerFillAmounts: BigNumber[]): Promise<DexSample[][]>;
    abstract getMultiHopSellCallInfosAsync(tokenAddressPath: Address[], takerFillAmount: BigNumber): Promise<MultiHopCallInfo[]>;
    abstract getMultiHopBuyCallInfosAsync(tokenAddressPath: Address[], makerFillAmount: BigNumber): Promise<MultiHopCallInfo[]>;
}
interface OnChainSourceSamplerOptions<TSellSamplerContract extends GeneratedContract, TBuySamplerContract extends GeneratedContract, TSellSamplerFunctionName = keyof TSellSamplerContract, TBuySamplerFunctionName = keyof TBuySamplerContract> {
    chain: Chain;
    sellSamplerContractArtifactName?: string;
    buySamplerContractArtifactName?: string;
    sellSamplerContractType: ContractWrapperType<TSellSamplerContract>;
    buySamplerContractType: ContractWrapperType<TBuySamplerContract>;
    sellContractSellFunctionName: TSellSamplerFunctionName;
    buyContractBuyFunctionName: TBuySamplerFunctionName;
}
export interface SamplerEthCall<TFillData, TSamplerFunction extends ContractFunction<TParams, TReturn>, TParams extends any[] = Parameters<TSamplerFunction>, TReturn = UnwrapContractFunctionReturnType<ReturnType<TSamplerFunction>>> {
    args: Parameters<TSamplerFunction>;
    gas?: number;
    getDexSamplesFromResult(result: TReturn): Array<DexSample<TFillData>>;
}
export declare abstract class OnChainSourceSampler<TSellSamplerContract extends GeneratedContract, TBuySamplerContract extends GeneratedContract, TSellSamplerFunction extends ContractFunction<TSellSamplerFunctionArgs, TSellSamplerFunctionReturn>, TBuySamplerFunction extends ContractFunction<TBuySamplerFunctionArgs, TBuySamplerFunctionReturn>, TFillData extends FillData, TSellSamplerFunctionName extends keyof TSellSamplerContract = keyof TSellSamplerContract, TBuySamplerFunctionName extends keyof TBuySamplerContract = keyof TBuySamplerContract, TSellSamplerFunctionArgs extends any[] = Parameters<TSellSamplerFunction>, TBuySamplerFunctionArgs extends any[] = Parameters<TBuySamplerFunction>, TSellSamplerFunctionReturn = UnwrapContractFunctionReturnType<ReturnType<TSellSamplerFunction>>, TBuySamplerFunctionReturn = UnwrapContractFunctionReturnType<ReturnType<TBuySamplerFunction>>, TOpts extends OnChainSourceSamplerOptions<TSellSamplerContract, TBuySamplerContract, TSellSamplerFunctionName, TBuySamplerFunctionName> = OnChainSourceSamplerOptions<TSellSamplerContract, TBuySamplerContract, TSellSamplerFunctionName, TBuySamplerFunctionName>> extends SourceSamplerBase {
    protected readonly _chain: Chain;
    protected readonly _sellContract: TSellSamplerContract;
    protected readonly _buyContract: TBuySamplerContract;
    protected readonly _sellContractHelper: ContractHelper<TSellSamplerContract>;
    protected readonly _buyContractHelper: ContractHelper<TBuySamplerContract>;
    protected readonly _sellContractFunction: ContractFunction<TSellSamplerFunctionArgs, TSellSamplerFunctionReturn>;
    protected readonly _buyContractFunction: ContractFunction<TBuySamplerFunctionArgs, TBuySamplerFunctionReturn>;
    protected constructor(opts: TOpts);
    canConvertTokens(_tokenAddressPath: Address[]): boolean;
    getSellSamplesAsync(tokenAddressPath: Address[], takerFillAmounts: BigNumber[]): Promise<DexSample[][]>;
    getBuySamplesAsync(tokenAddressPath: Address[], makerFillAmounts: BigNumber[]): Promise<DexSample[][]>;
    getMultiHopSellCallInfosAsync(tokenAddressPath: Address[], takerFillAmount: BigNumber, callOpts?: Partial<ChainEthCallOpts>): Promise<MultiHopCallInfo[]>;
    getMultiHopBuyCallInfosAsync(tokenAddressPath: Address[], makerFillAmount: BigNumber, callOpts?: Partial<ChainEthCallOpts>): Promise<MultiHopCallInfo[]>;
    protected abstract _getSellQuoteCallsAsync(tokenAddressPath: Address[], takerFillAmounts: BigNumber[]): Promise<Array<SamplerEthCall<TFillData, ContractFunction<TSellSamplerFunctionArgs, TSellSamplerFunctionReturn>>>>;
    protected abstract _getBuyQuoteCallsAsync(tokenAddressPath: Address[], takerFillAmounts: BigNumber[]): Promise<Array<SamplerEthCall<TFillData, ContractFunction<TBuySamplerFunctionArgs, TBuySamplerFunctionReturn>>>>;
}
export {};
//# sourceMappingURL=source_sampler.d.ts.map