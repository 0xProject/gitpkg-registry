"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GET_MARKET_ORDERS_OPTS = exports.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS = exports.DEFAULT_FEE_SCHEDULE = exports.DEFAULT_GAS_SCHEDULE = exports.MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID = exports.CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID = exports.NATIVE_FEE_TOKEN_AMOUNT_BY_CHAIN_ID = exports.SOURCE_FLAGS = exports.FEE_QUOTE_SOURCES_BY_CHAIN_ID = exports.PROTOCOL_FEE_MULTIPLIER = exports.BUY_SOURCE_FILTER_BY_CHAIN_ID = exports.SELL_SOURCE_FILTER_BY_CHAIN_ID = exports.COMPARISON_PRICE_DECIMALS = exports.NULL_ADDRESS = exports.NULL_BYTES = exports.ONE_SECOND_MS = exports.ONE_HOUR_IN_SECONDS = exports.MAX_UINT256 = exports.ZERO_AMOUNT = exports.POSITIVE_INF = exports.NEGATIVE_INF = exports.ONE_ETHER = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const source_filters_1 = require("../../network/source_filters");
const types_1 = require("../../network/types");
const utils_2 = require("../../network/utils");
// tslint:disable: custom-no-magic-numbers no-bitwise
exports.ONE_ETHER = new utils_1.BigNumber(1e18);
exports.NEGATIVE_INF = new utils_1.BigNumber('-Infinity');
exports.POSITIVE_INF = new utils_1.BigNumber('Infinity');
exports.ZERO_AMOUNT = new utils_1.BigNumber(0);
exports.MAX_UINT256 = new utils_1.BigNumber(2).pow(256).minus(1);
exports.ONE_HOUR_IN_SECONDS = 60 * 60;
exports.ONE_SECOND_MS = 1000;
exports.NULL_BYTES = '0x';
exports.NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.COMPARISON_PRICE_DECIMALS = 10;
/**
 * Valid sources for market sell.
 */
exports.SELL_SOURCE_FILTER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        // ERC20BridgeSource.Eth2Dai, // Disabled for poor liquidity.
        types_1.ERC20BridgeSource.Kyber,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Balancer,
        types_1.ERC20BridgeSource.BalancerV2,
        types_1.ERC20BridgeSource.Bancor,
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.Swerve,
        types_1.ERC20BridgeSource.SnowSwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Shell,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Cream,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.CryptoCom,
        types_1.ERC20BridgeSource.Linkswap,
        types_1.ERC20BridgeSource.Lido,
        types_1.ERC20BridgeSource.MakerPsm,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.Component,
        types_1.ERC20BridgeSource.Saddle,
        types_1.ERC20BridgeSource.XSigma,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.ShibaSwap,
    ]),
    [contract_addresses_1.ChainId.Ropsten]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Kyber,
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Mooniswap,
    ]),
    [contract_addresses_1.ChainId.Rinkeby]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Kovan]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Ganache]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.BSC]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.BakerySwap,
        types_1.ERC20BridgeSource.Belt,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Ellipsis,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Nerve,
        types_1.ERC20BridgeSource.PancakeSwap,
        types_1.ERC20BridgeSource.PancakeSwapV2,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.CafeSwap,
        types_1.ERC20BridgeSource.CheeseSwap,
        types_1.ERC20BridgeSource.JulSwap,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.ACryptos,
    ]),
    [contract_addresses_1.ChainId.Polygon]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.QuickSwap,
        types_1.ERC20BridgeSource.ComethSwap,
        types_1.ERC20BridgeSource.Dfyn,
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.Polydex,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.BalancerV2,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.IronSwap,
    ]),
}, new source_filters_1.SourceFilters([]));
/**
 * Valid sources for market buy.
 */
exports.BUY_SOURCE_FILTER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        // ERC20BridgeSource.Eth2Dai, // Disabled for poor liquidity.
        types_1.ERC20BridgeSource.Kyber,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Balancer,
        types_1.ERC20BridgeSource.BalancerV2,
        // ERC20BridgeSource.Bancor, // FIXME: Bancor Buys not implemented in Sampler
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.Shell,
        types_1.ERC20BridgeSource.Swerve,
        types_1.ERC20BridgeSource.SnowSwap,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Cream,
        types_1.ERC20BridgeSource.Lido,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.CryptoCom,
        types_1.ERC20BridgeSource.Linkswap,
        types_1.ERC20BridgeSource.MakerPsm,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.Component,
        types_1.ERC20BridgeSource.Saddle,
        types_1.ERC20BridgeSource.XSigma,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.ShibaSwap,
    ]),
    [contract_addresses_1.ChainId.Ropsten]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.Kyber,
        types_1.ERC20BridgeSource.Native,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Uniswap,
        types_1.ERC20BridgeSource.UniswapV2,
        types_1.ERC20BridgeSource.UniswapV3,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.Mooniswap,
    ]),
    [contract_addresses_1.ChainId.Rinkeby]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Kovan]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.Ganache]: new source_filters_1.SourceFilters([types_1.ERC20BridgeSource.Native]),
    [contract_addresses_1.ChainId.BSC]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.BakerySwap,
        types_1.ERC20BridgeSource.Belt,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Ellipsis,
        types_1.ERC20BridgeSource.Mooniswap,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.Nerve,
        types_1.ERC20BridgeSource.PancakeSwap,
        types_1.ERC20BridgeSource.PancakeSwapV2,
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.Smoothy,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.CafeSwap,
        types_1.ERC20BridgeSource.CheeseSwap,
        types_1.ERC20BridgeSource.JulSwap,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.ACryptos,
    ]),
    [contract_addresses_1.ChainId.Polygon]: new source_filters_1.SourceFilters([
        types_1.ERC20BridgeSource.SushiSwap,
        types_1.ERC20BridgeSource.QuickSwap,
        types_1.ERC20BridgeSource.ComethSwap,
        types_1.ERC20BridgeSource.Dfyn,
        types_1.ERC20BridgeSource.MStable,
        types_1.ERC20BridgeSource.Curve,
        types_1.ERC20BridgeSource.DodoV2,
        types_1.ERC20BridgeSource.Dodo,
        types_1.ERC20BridgeSource.CurveV2,
        types_1.ERC20BridgeSource.WaultSwap,
        types_1.ERC20BridgeSource.Polydex,
        types_1.ERC20BridgeSource.ApeSwap,
        types_1.ERC20BridgeSource.FirebirdOneSwap,
        types_1.ERC20BridgeSource.BalancerV2,
        types_1.ERC20BridgeSource.KyberDmm,
        types_1.ERC20BridgeSource.LiquidityProvider,
        types_1.ERC20BridgeSource.MultiHop,
        types_1.ERC20BridgeSource.JetSwap,
        types_1.ERC20BridgeSource.IronSwap,
    ]),
}, new source_filters_1.SourceFilters([]));
/**
 *  0x Protocol Fee Multiplier
 */
exports.PROTOCOL_FEE_MULTIPLIER = new utils_1.BigNumber(70000);
/**
 * Sources to poll for ETH fee price estimates.
 */
exports.FEE_QUOTE_SOURCES_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: [types_1.ERC20BridgeSource.UniswapV2, types_1.ERC20BridgeSource.SushiSwap, types_1.ERC20BridgeSource.UniswapV3],
    [contract_addresses_1.ChainId.BSC]: [types_1.ERC20BridgeSource.PancakeSwap, types_1.ERC20BridgeSource.Mooniswap, types_1.ERC20BridgeSource.SushiSwap],
    [contract_addresses_1.ChainId.Ropsten]: [types_1.ERC20BridgeSource.UniswapV2, types_1.ERC20BridgeSource.SushiSwap],
    [contract_addresses_1.ChainId.Polygon]: [types_1.ERC20BridgeSource.QuickSwap, types_1.ERC20BridgeSource.SushiSwap],
}, []);
// HACK(mzhu25): Limit and RFQ orders need to be treated as different sources
//               when computing the exchange proxy gas overhead.
exports.SOURCE_FLAGS = Object.assign({}, ...['RfqOrder', 'LimitOrder', ...Object.values(types_1.ERC20BridgeSource)].map((source, index) => ({
    [source]: source === types_1.ERC20BridgeSource.Native ? BigInt(0) : BigInt(1) << BigInt(index),
})));
exports.NATIVE_FEE_TOKEN_AMOUNT_BY_CHAIN_ID = utils_2.valueByChainId({ [contract_addresses_1.ChainId.Mainnet]: exports.ONE_ETHER.times(0.1) }, exports.ONE_ETHER);
exports.CURVE_LIQUIDITY_PROVIDER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0x561b94454b65614ae3db0897b74303f4acf7cc75',
    [contract_addresses_1.ChainId.Ropsten]: '0xae241c6fc7f28f6dc0cb58b4112ba7f63fcaf5e2',
}, exports.NULL_ADDRESS);
exports.MOONISWAP_LIQUIDITY_PROVIDER_BY_CHAIN_ID = utils_2.valueByChainId({
    [contract_addresses_1.ChainId.Mainnet]: '0xa2033d6ba88756ce6a87584d69dc87bda9a4f889',
    [contract_addresses_1.ChainId.Ropsten]: '0x87e0393aee0fb8c10b8653c6507c182264fe5a34',
}, exports.NULL_ADDRESS);
const uniswapV2CloneGasSchedule = (fillData) => {
    // TODO: Different base cost if to/from ETH.
    let gas = 90e3;
    const path = fillData.tokenAddressPath;
    if (path.length > 2) {
        gas += (path.length - 2) * 60e3; // +60k for each hop.
    }
    return gas;
};
/**
 * Calculated gross gas cost of the underlying exchange.
 * The cost of switching from one source to another, assuming
 * we are in the middle of a transaction.
 * I.e remove the overhead cost of ExchangeProxy (130k) and
 * the ethereum transaction cost (21k)
 */
// tslint:disable:custom-no-magic-numbers
exports.DEFAULT_GAS_SCHEDULE = {
    [types_1.ERC20BridgeSource.Native]: fillData => {
        const nativeFillData = fillData;
        return nativeFillData && nativeFillData.type === protocol_utils_1.FillQuoteTransformerOrderType.Limit
            ? exports.PROTOCOL_FEE_MULTIPLIER.plus(100e3).toNumber()
            : // TODO jacob revisit wth v4 LimitOrders
                100e3;
    },
    [types_1.ERC20BridgeSource.Uniswap]: () => 90e3,
    [types_1.ERC20BridgeSource.LiquidityProvider]: fillData => {
        return fillData.gasCost || 100e3;
    },
    [types_1.ERC20BridgeSource.Eth2Dai]: () => 400e3,
    [types_1.ERC20BridgeSource.Kyber]: () => 450e3,
    [types_1.ERC20BridgeSource.Curve]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.CurveV2]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.Swerve]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.SnowSwap]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.Nerve]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.Belt]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.Ellipsis]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.Smoothy]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.Saddle]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.IronSwap]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.XSigma]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.FirebirdOneSwap]: fillData => fillData.pool.gasSchedule,
    [types_1.ERC20BridgeSource.MultiBridge]: () => 350e3,
    [types_1.ERC20BridgeSource.UniswapV2]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.SushiSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.CryptoCom]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.Linkswap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.ShibaSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.Balancer]: () => 120e3,
    [types_1.ERC20BridgeSource.BalancerV2]: () => 100e3,
    [types_1.ERC20BridgeSource.Cream]: () => 120e3,
    [types_1.ERC20BridgeSource.MStable]: () => 200e3,
    [types_1.ERC20BridgeSource.MakerPsm]: (fillData) => {
        const psmFillData = fillData;
        return psmFillData.takerToken === psmFillData.gemTokenAddress ? 210e3 : 290e3;
    },
    [types_1.ERC20BridgeSource.Mooniswap]: () => 130e3,
    [types_1.ERC20BridgeSource.Shell]: () => 170e3,
    [types_1.ERC20BridgeSource.Component]: () => 188e3,
    [types_1.ERC20BridgeSource.MultiHop]: (fillData) => {
        const firstHop = fillData.firstHop;
        const secondHop = fillData.secondHop;
        const firstHopGas = exports.DEFAULT_GAS_SCHEDULE[firstHop.source](firstHop.fillData);
        const secondHopGas = exports.DEFAULT_GAS_SCHEDULE[secondHop.source](secondHop.fillData);
        return new utils_1.BigNumber(firstHopGas)
            .plus(secondHopGas)
            .plus(30e3)
            .toNumber();
    },
    [types_1.ERC20BridgeSource.Dodo]: (fillData) => {
        const isSellBase = fillData.isSellBase;
        // Sell base is cheaper as it is natively supported
        // sell quote requires additional calculation and overhead
        return isSellBase ? 180e3 : 300e3;
    },
    [types_1.ERC20BridgeSource.DodoV2]: (_fillData) => 100e3,
    [types_1.ERC20BridgeSource.Bancor]: (fillData) => {
        let gas = 200e3;
        const path = fillData.path;
        if (path.length > 2) {
            gas += (path.length - 2) * 60e3; // +60k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.KyberDmm]: (fillData) => {
        // TODO: Different base cost if to/from ETH.
        let gas = 95e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 65e3; // +65k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.UniswapV3]: (fillData) => {
        let gas = 100e3;
        const path = fillData.tokenAddressPath;
        if (path.length > 2) {
            gas += (path.length - 2) * 32e3; // +32k for each hop.
        }
        return gas;
    },
    [types_1.ERC20BridgeSource.Lido]: () => 226e3,
    //
    // BSC
    //
    [types_1.ERC20BridgeSource.PancakeSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.PancakeSwapV2]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.BakerySwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.ApeSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.CafeSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.CheeseSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.JulSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.WaultSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.ACryptos]: fillData => fillData.pool.gasSchedule,
    //
    // Polygon
    //
    [types_1.ERC20BridgeSource.QuickSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.ComethSwap]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.Dfyn]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.Polydex]: uniswapV2CloneGasSchedule,
    [types_1.ERC20BridgeSource.JetSwap]: uniswapV2CloneGasSchedule,
};
exports.DEFAULT_FEE_SCHEDULE = Object.assign({}, exports.DEFAULT_GAS_SCHEDULE);
exports.POSITIVE_SLIPPAGE_FEE_TRANSFORMER_GAS = new utils_1.BigNumber(20000);
// tslint:enable:custom-no-magic-numbers
exports.DEFAULT_GET_MARKET_ORDERS_OPTS = {
    // tslint:disable-next-line: custom-no-magic-numbers
    runLimit: Math.pow(2, 15),
    excludedSources: [],
    excludedFeeSources: [],
    includedSources: [],
    bridgeSlippage: 0.005,
    maxFallbackSlippage: 0.05,
    numSamples: 13,
    sampleDistributionBase: 1.05,
    feeSchedule: exports.DEFAULT_FEE_SCHEDULE,
    gasSchedule: exports.DEFAULT_GAS_SCHEDULE,
    exchangeProxyOverhead: () => exports.ZERO_AMOUNT,
    allowFallback: true,
    shouldGenerateQuoteReport: true,
    shouldIncludePriceComparisonsReport: false,
    tokenAdjacencyGraph: { default: [] },
};
//# sourceMappingURL=constants.js.map