import { BigNumber, ERC20BridgeSource, SignedOrder } from '../..';
import { BatchedOperation, DexSample } from './types';
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare const samplerOperations: {
    getOrderFillableTakerAmounts(orders: SignedOrder[]): BatchedOperation<BigNumber[]>;
    getOrderFillableMakerAmounts(orders: SignedOrder[]): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getLiquidityProviderSellQuotes(liquidityProviderRegistryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getLiquidityProviderBuyQuotes(liquidityProviderRegistryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getCurveSellQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getMedianSellRate(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, liquidityProviderRegistryAddress?: string | undefined): BatchedOperation<BigNumber>;
    constant<T>(result: T): BatchedOperation<T>;
    getLiquidityProviderFromRegistry(registryAddress: string, takerToken: string, makerToken: string): BatchedOperation<string>;
    getSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], liquidityProviderRegistryAddress?: string | undefined): BatchedOperation<DexSample[][]>;
    getBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], liquidityProviderRegistryAddress?: string | undefined): BatchedOperation<DexSample[][]>;
};
//# sourceMappingURL=sampler_operations.d.ts.map