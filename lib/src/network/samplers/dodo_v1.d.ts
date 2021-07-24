import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface DodoV1FillData extends FillData {
    poolAddress: Address;
    isSellBase: boolean;
    helperAddress: Address;
}
interface DodoV1Info {
    helper: Address;
    registry: Address;
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromDODO'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromDODO'];
declare type SamplerSellEthCall = SamplerEthCall<DodoV1FillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<DodoV1FillData, BuyContractBuyFunction>;
export declare class DodoV1Sampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, DodoV1FillData> {
    private readonly _dodoInfo;
    static createAsync(chain: Chain): Promise<DodoV1Sampler>;
    protected constructor(chain: Chain, _dodoInfo: DodoV1Info);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=dodo_v1.d.ts.map