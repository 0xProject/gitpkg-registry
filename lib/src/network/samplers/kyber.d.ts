import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, Bytes, FillData } from '../types';
interface KyberSamplerOpts {
    networkProxy: Address;
    hintHandler: Address;
    weth: Address;
}
export interface KyberFillData extends FillData {
    hint: Bytes;
    reserveId: string;
    networkProxy: Address;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromKyberNetwork'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromKyberNetwork'];
declare type SamplerSellEthCall = SamplerEthCall<KyberFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<KyberFillData, BuyContractBuyFunction>;
export declare class KyberSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, KyberFillData> {
    private readonly _opts;
    static createAsync(chain: Chain): Promise<KyberSampler>;
    protected constructor(chain: Chain, _opts: KyberSamplerOpts);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=kyber.d.ts.map