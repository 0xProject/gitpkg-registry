import { BigNumber } from '@0x/utils';
import { Address, Bytes } from '../../types';
export interface LiquidityCurvePoint {
    sellAmount: BigNumber;
    buyAmount: BigNumber;
    encodedFillData: Bytes;
    metadata: object;
    gasCost: number;
}
export interface LiquidityRequest {
    tokenPath: Address[];
    inputAmount: BigNumber;
    source: string;
    demand?: boolean;
    numSamples?: number;
}
export interface PriceRequest {
    tokenPath: Address[];
    sources?: string[];
    demand?: boolean;
}
export interface LiquidityResponse {
    source: string;
    liquidityCurves: LiquidityCurvePoint[][];
}
export interface TokenResponse {
    address: Address;
    symbol: string;
    decimals: number;
    gasCost: number;
}
export declare class SamplerServiceRpcClient {
    private _rpcClient;
    constructor(url: string);
    private _requestAsync;
    getChainIdAsync(): Promise<number>;
    getSellLiquidityAsync(reqs: LiquidityRequest[]): Promise<LiquidityResponse[]>;
    getBuyLiquidityAsync(reqs: LiquidityRequest[]): Promise<LiquidityResponse[]>;
    getPricesAsync(reqs: PriceRequest[]): Promise<BigNumber[]>;
    getTokensAsync(addresses: Address[]): Promise<TokenResponse[]>;
}
//# sourceMappingURL=sampler_service_rpc_client.d.ts.map