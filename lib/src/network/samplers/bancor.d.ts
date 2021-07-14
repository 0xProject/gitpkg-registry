import { SupportedProvider } from '@0x/dev-utils';
import { BigNumber } from '@0x/utils';
import { SDK } from '@bancor/sdk';
import { ERC20BridgeSamplerContract } from '../../wrappers';
import { Chain } from '../chain';
import { OnChainSourceSampler, SamplerEthCall } from '../source_sampler';
import { Address, FillData } from '../types';
export interface BancorFillData extends FillData {
    path: Address[];
    networkAddress: Address;
}
export declare class BancorService {
    sdk: SDK;
    static createAsync(provider: SupportedProvider): Promise<BancorService>;
    constructor(sdk: SDK);
    getPaths(_fromToken: string, _toToken: string): string[][];
}
declare type SellContract = ERC20BridgeSamplerContract;
declare type BuyContract = ERC20BridgeSamplerContract;
declare type SellContractSellFunction = SellContract['sampleSellsFromBancor'];
declare type BuyContractBuyFunction = BuyContract['sampleBuysFromBancor'];
declare type SamplerSellEthCall = SamplerEthCall<BancorFillData, SellContractSellFunction>;
declare type SamplerBuyEthCall = SamplerEthCall<BancorFillData, BuyContractBuyFunction>;
export declare class BancorSampler extends OnChainSourceSampler<SellContract, BuyContract, SellContractSellFunction, BuyContractBuyFunction, BancorFillData> {
    private readonly _registry;
    private readonly _bancorService;
    static createAsync(chain: Chain): Promise<BancorSampler>;
    protected constructor(chain: Chain, _registry: Address, _bancorService: BancorService);
    canConvertTokens(tokenAddressPath: Address[]): boolean;
    protected _getSellQuoteCallsAsync(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): Promise<SamplerSellEthCall[]>;
    protected _getBuyQuoteCallsAsync(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): Promise<SamplerBuyEthCall[]>;
}
export {};
//# sourceMappingURL=bancor.d.ts.map