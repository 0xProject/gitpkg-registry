import { ChainId } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { Address } from '../../types';
import { DexSample, ERC20BridgeSource } from './types';
interface TokenInfo {
    decimals: number;
    address: Address;
    gasCost: number;
    symbol: string;
}
export interface Sampler {
    chainId: ChainId;
    getTokenInfosAsync(tokens: Address[]): Promise<TokenInfo[]>;
    getPricesAsync(paths: Address[][], sources: ERC20BridgeSource[], demand?: boolean): Promise<BigNumber[]>;
    getSellLiquidityAsync(path: Address[], takerAmount: BigNumber, sources: ERC20BridgeSource[], numSamples?: number): Promise<DexSample[][]>;
    getBuyLiquidityAsync(path: Address[], makerAmount: BigNumber, sources: ERC20BridgeSource[], numSamples?: number): Promise<DexSample[][]>;
}
export declare class SamplerClient implements Sampler {
    private readonly _chainId;
    private readonly _service;
    static createFromChainIdAndEndpoint(chainId: ChainId, endpoint: string): SamplerClient;
    static createFromEndpointAsync(endpoint: string): Promise<SamplerClient>;
    private constructor();
    get chainId(): ChainId;
    getPricesAsync(paths: Address[][], sources: ERC20BridgeSource[], demand?: boolean): Promise<BigNumber[]>;
    getTokenInfosAsync(tokens: Address[]): Promise<TokenInfo[]>;
    getSellLiquidityAsync(path: Address[], takerAmount: BigNumber, sources: ERC20BridgeSource[], numSamples?: number): Promise<DexSample[][]>;
    getBuyLiquidityAsync(path: Address[], makerAmount: BigNumber, sources: ERC20BridgeSource[], numSamples?: number): Promise<DexSample[][]>;
}
export {};
//# sourceMappingURL=sampler.d.ts.map