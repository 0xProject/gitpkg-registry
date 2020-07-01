import { BigNumber, ERC20BridgeSource, SignedOrder } from '../..';
import { BatchedOperation, DexSample, FakeBuyOpts } from './types';
/**
 * Composable operations that can be batched in a single transaction,
 * for use with `DexOrderSampler.executeAsync()`.
 */
export declare const samplerOperations: {
    getOrderFillableTakerAmounts(orders: SignedOrder[]): BatchedOperation<BigNumber[]>;
    getOrderFillableMakerAmounts(orders: SignedOrder[]): BatchedOperation<BigNumber[]>;
    getKyberSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getKyberBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: FakeBuyOpts): BatchedOperation<BigNumber[]>;
    getUniswapSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getUniswapBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getUniswapV2SellQuotes(tokenAddressPath: string[], takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getUniswapV2BuyQuotes(tokenAddressPath: string[], makerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getLiquidityProviderSellQuotes(registryAddress: string, makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getMultiBridgeSellQuotes(multiBridgeAddress: string, makerToken: string, intermediateToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getLiquidityProviderBuyQuotes(registryAddress: string, makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], fakeBuyOpts?: FakeBuyOpts): BatchedOperation<BigNumber[]>;
    getEth2DaiSellQuotes(makerToken: string, takerToken: string, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getEth2DaiBuyQuotes(makerToken: string, takerToken: string, makerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getCurveSellQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, takerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getCurveBuyQuotes(curveAddress: string, fromTokenIdx: number, toTokenIdx: number, makerFillAmounts: BigNumber[]): BatchedOperation<BigNumber[]>;
    getMedianSellRate(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmount: BigNumber, wethAddress: string, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined): BatchedOperation<BigNumber>;
    constant<T>(result: T): BatchedOperation<T>;
    getLiquidityProviderFromRegistry(registryAddress: string, makerToken: string, takerToken: string): BatchedOperation<string>;
    getSellQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, takerFillAmounts: BigNumber[], wethAddress: string, liquidityProviderRegistryAddress?: string | undefined, multiBridgeAddress?: string | undefined): BatchedOperation<DexSample[][]>;
    getBuyQuotes(sources: ERC20BridgeSource[], makerToken: string, takerToken: string, makerFillAmounts: BigNumber[], wethAddress: string, liquidityProviderRegistryAddress?: string | undefined, fakeBuyOpts?: FakeBuyOpts): BatchedOperation<DexSample[][]>;
};
//# sourceMappingURL=sampler_operations.d.ts.map