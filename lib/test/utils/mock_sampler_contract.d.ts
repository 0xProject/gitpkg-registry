import { ContractFunctionObj } from '@0x/base-contract';
import { ERC20BridgeSamplerContract } from '@0x/contract-wrappers';
import { Order } from '@0x/types';
import { BigNumber } from '@0x/utils';
export declare type GetOrderFillableAssetAmountResult = BigNumber[];
export declare type GetOrderFillableAssetAmountHandler = (orders: Order[], signatures: string[], devUtilsAddress: string) => GetOrderFillableAssetAmountResult;
export declare type SampleResults = BigNumber[];
export declare type SampleSellsHandler = (takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleBuysHandler = (takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleBuysMultihopHandler = (path: string[], takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsLPHandler = (registryAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsMultihopHandler = (path: string[], takerTokenAmounts: BigNumber[]) => SampleResults;
export declare type SampleSellsMBHandler = (multiBridgeAddress: string, takerToken: string, intermediateToken: string, makerToken: string, takerTokenAmounts: BigNumber[]) => SampleResults;
interface Handlers {
    getOrderFillableMakerAssetAmounts: GetOrderFillableAssetAmountHandler;
    getOrderFillableTakerAssetAmounts: GetOrderFillableAssetAmountHandler;
    sampleSellsFromKyberNetwork: SampleSellsHandler;
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
    batchCall(callDatas: string[]): ContractFunctionObj<string[]>;
    getOrderFillableMakerAssetAmounts(orders: Order[], signatures: string[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    getOrderFillableTakerAssetAmounts(orders: Order[], signatures: string[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromKyberNetwork(takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromEth2Dai(takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromUniswap(takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromUniswapV2(path: string[], takerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromLiquidityProviderRegistry(registryAddress: string, takerToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleSellsFromMultiBridge(multiBridgeAddress: string, takerToken: string, intermediateToken: string, makerToken: string, takerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleBuysFromEth2Dai(takerToken: string, makerToken: string, makerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleBuysFromUniswap(takerToken: string, makerToken: string, makerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    sampleBuysFromUniswapV2(path: string[], makerAssetAmounts: BigNumber[]): ContractFunctionObj<GetOrderFillableAssetAmountResult>;
    private _callEncodedFunction;
    private _wrapCall;
}
export {};
//# sourceMappingURL=mock_sampler_contract.d.ts.map