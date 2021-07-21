import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { ERC20BridgeSource, FillData } from '../types';
export interface UniswapV2FillData extends FillData {
    tokenAddressPath: string[];
    router: string;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromUniswapV2'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromUniswapV2'];
declare type SamplerSellEthCall = SamplerEthCall<UniswapV2FillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<UniswapV2FillData, BuyContractBuyFunction>;
export declare class UniswapV2Sampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, UniswapV2FillData> {
    readonly fork: ERC20BridgeSource;
    private readonly _router;
    static createAsync(chain: Chain, fork: ERC20BridgeSource): Promise<UniswapV2Sampler>;
    protected constructor(chain: Chain, fork: ERC20BridgeSource);
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=uniswap_v2.d.ts.map