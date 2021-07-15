import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface UniswapV1FillData extends FillData {
    router: Address;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromUniswap'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromUniswap'];
declare type SamplerSellEthCall = SamplerEthCall<UniswapV1FillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<UniswapV1FillData, BuyContractBuyFunction>;
export declare class UniswapV1Sampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, UniswapV1FillData> {
    private readonly _router;
    private readonly _weth;
    static createAsync(chain: Chain): Promise<UniswapV1Sampler>;
    protected constructor(chain: Chain, _router: Address, _weth: Address);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
    private _normalizeToken;
}
export {};
//# sourceMappingURL=uniswap_v1.d.ts.map