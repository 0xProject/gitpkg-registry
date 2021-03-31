import { ContractTxFunctionObj } from '@0x/base-contract';
import { LimitOrderFields, Signature } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { SamplerCallResult } from '../../src/types';
import { ERC20BridgeSamplerContract } from '../../src/wrappers';
export declare type GetOrderFillableAssetAmountResult = BigNumber[];
export declare type GetOrderFillableAssetAmountHandler = (orders: LimitOrderFields[], signatures: Signature[], devUtilsAddress: string) => GetOrderFillableAssetAmountResult;
export declare type SampleResults = BigNumber[];
export declare type SampleSellsHandler = (takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleBuysHandler = (takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsKyberHandler = (reserveOffset: BigNumber, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => [string, string, SampleResults];
export declare type SampleBuysKyberHandler = (reserveId: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]) => [string, SampleResults];
export declare type SampleUniswapV2Handler = (router: string, path: string[], assetAmounts: BigNumber[]) => SampleResults;
export declare type SampleBuysMultihopHandler = (path: string[], takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsLPHandler = (providerAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsMultihopHandler = (path: string[], takerTokenAmounts: BigNumber[]) => SampleResults;
interface Handlers {
    getLimitOrderFillableMakerAssetAmounts: GetOrderFillableAssetAmountHandler;
    getLimitOrderFillableTakerAssetAmounts: GetOrderFillableAssetAmountHandler;
    sampleSellsFromKyberNetwork: SampleSellsKyberHandler;
    sampleSellsFromLiquidityProvider: SampleSellsLPHandler;
    sampleSellsFromEth2Dai: SampleSellsHandler;
    sampleSellsFromUniswap: SampleSellsHandler;
    sampleSellsFromUniswapV2: SampleUniswapV2Handler;
    sampleBuysFromEth2Dai: SampleBuysHandler;
    sampleBuysFromUniswap: SampleBuysHandler;
    sampleBuysFromUniswapV2: SampleUniswapV2Handler;
    sampleBuysFromLiquidityProvider: SampleSellsLPHandler;
}
export declare class MockSamplerContract extends ERC20BridgeSamplerContract {
    private readonly _handlers;
    constructor(handlers?: Partial<Handlers>);
    batchCall(callDatas: string[]): ContractTxFunctionObj<SamplerCallResult[]>;
    getLimitOrderFillableMakerAssetAmounts(orders: LimitOrderFields[], signatures: Signature[]): ContractTxFunctionObj<GetOrderFillableAssetAmountResult>;
    getLimitOrderFillableTakerAssetAmounts(orders: LimitOrderFields[], signatures: Signature[]): ContractTxFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromKyberNetwork(reserveOffset: BigNumber, takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<[string, string, BigNumber[]]>;
    sampleSellsFromEth2Dai(takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSellsFromUniswap(takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSellsFromUniswapV2(router: string, path: string[], takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSellsFromLiquidityProvider(providerAddress: string, takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleBuysFromEth2Dai(takerToken: string, makerToken: string, makerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleBuysFromUniswap(takerToken: string, makerToken: string, makerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleBuysFromUniswapV2(router: string, path: string[], makerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    private _callEncodedFunction;
    private _wrapCall;
}
export {};
//# sourceMappingURL=mock_sampler_contract.d.ts.map