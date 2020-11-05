import { ContractTxFunctionObj } from '@0x/base-contract';
import { Order } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { ERC20BridgeSamplerContract } from '../../src/wrappers';
export declare type GetOrderFillableAssetAmountResult = BigNumber[];
export declare type GetOrderFillableAssetAmountHandler = (orders: Order[], signatures: string[], devUtilsAddress: string) => GetOrderFillableAssetAmountResult;
export declare type SampleResults = BigNumber[];
export declare type SampleSellsHandler = (takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleBuysHandler = (takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsKyberHandler = (reserveId: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => [string, SampleResults];
export declare type SampleBuysKyberHandler = (reserveId: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]) => [string, SampleResults];
export declare type SampleBuysMultihopHandler = (path: string[], takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsLPHandler = (registryAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => [SampleResults, string];
export declare type SampleSellsMultihopHandler = (path: string[], takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsMBHandler = (multiBridgeAddress: string, takerToken: string, intermediateToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => SampleResults;
interface Handlers {
    getOrderFillableMakerAssetAmounts: GetOrderFillableAssetAmountHandler;
    getOrderFillableTakerAssetAmounts: GetOrderFillableAssetAmountHandler;
    sampleSellsFromKyberNetwork: SampleSellsKyberHandler;
    sampleSellsFromLiquidityProviderRegistry: SampleSellsLPHandler;
    sampleSellsFromMultiBridge: SampleSellsMBHandler;
    sampleSellsFromEth2Dai: SampleSellsHandler;
    sampleSellsFromUniswap: SampleSellsHandler;
    sampleSellsFromUniswapV2: SampleSellsMultihopHandler;
    sampleBuysFromEth2Dai: SampleBuysHandler;
    sampleBuysFromUniswap: SampleBuysHandler;
    sampleBuysFromUniswapV2: SampleBuysMultihopHandler;
    sampleBuysFromLiquidityProviderRegistry: SampleSellsLPHandler;
}
export declare class MockSamplerContract extends ERC20BridgeSamplerContract {
    private readonly _handlers;
    constructor(handlers?: Partial<Handlers>);
    batchCall(callDatas: string[]): ContractTxFunctionObj<string[]>;
    getOrderFillableMakerAssetAmounts(orders: Order[], signatures: string[]): ContractTxFunctionObj<GetOrderFillableAssetAmountResult>;
    getOrderFillableTakerAssetAmounts(orders: Order[], signatures: string[]): ContractTxFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromKyberNetwork(reserveId: string, takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<[string, BigNumber[]]>;
    sampleSellsFromEth2Dai(takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSellsFromUniswap(takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSellsFromUniswapV2(path: string[], takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleSellsFromLiquidityProviderRegistry(registryAddress: string, takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<[BigNumber[], string]>;
    sampleSellsFromMultiBridge(multiBridgeAddress: string, takerToken: string, intermediateToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleBuysFromEth2Dai(takerToken: string, makerToken: string, makerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleBuysFromUniswap(takerToken: string, makerToken: string, makerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    sampleBuysFromUniswapV2(path: string[], makerAssetAmounts: BigNumber[]): ContractTxFunctionObj<BigNumber[]>;
    private _callEncodedFunction;
    private _wrapCall;
}
export {};
//# sourceMappingURL=mock_sampler_contract.d.ts.map