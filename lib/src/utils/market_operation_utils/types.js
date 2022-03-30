"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveFunctionSelectors = exports.ERC20BridgeSource = exports.AggregationError = void 0;
/**
 * Common exception messages thrown by aggregation logic.
 */
var AggregationError;
(function (AggregationError) {
    AggregationError["NoOptimalPath"] = "NO_OPTIMAL_PATH";
    AggregationError["EmptyOrders"] = "EMPTY_ORDERS";
    AggregationError["NotERC20AssetData"] = "NOT_ERC20ASSET_DATA";
    AggregationError["NoBridgeForSource"] = "NO_BRIDGE_FOR_SOURCE";
})(AggregationError = exports.AggregationError || (exports.AggregationError = {}));
/**
 * DEX sources to aggregate.
 */
var ERC20BridgeSource;
(function (ERC20BridgeSource) {
    ERC20BridgeSource["Native"] = "Native";
    ERC20BridgeSource["Uniswap"] = "Uniswap";
    ERC20BridgeSource["UniswapV2"] = "Uniswap_V2";
    ERC20BridgeSource["Curve"] = "Curve";
    ERC20BridgeSource["LiquidityProvider"] = "LiquidityProvider";
    ERC20BridgeSource["MultiBridge"] = "MultiBridge";
    ERC20BridgeSource["Balancer"] = "Balancer";
    ERC20BridgeSource["BalancerV2"] = "Balancer_V2";
    ERC20BridgeSource["Cream"] = "CREAM";
    ERC20BridgeSource["Bancor"] = "Bancor";
    ERC20BridgeSource["MakerPsm"] = "MakerPsm";
    ERC20BridgeSource["MStable"] = "mStable";
    ERC20BridgeSource["Mooniswap"] = "Mooniswap";
    ERC20BridgeSource["MultiHop"] = "MultiHop";
    ERC20BridgeSource["Shell"] = "Shell";
    ERC20BridgeSource["Swerve"] = "Swerve";
    ERC20BridgeSource["SnowSwap"] = "SnowSwap";
    ERC20BridgeSource["SushiSwap"] = "SushiSwap";
    ERC20BridgeSource["Dodo"] = "DODO";
    ERC20BridgeSource["DodoV2"] = "DODO_V2";
    ERC20BridgeSource["CryptoCom"] = "CryptoCom";
    ERC20BridgeSource["Linkswap"] = "Linkswap";
    ERC20BridgeSource["KyberDmm"] = "KyberDMM";
    ERC20BridgeSource["Smoothy"] = "Smoothy";
    ERC20BridgeSource["Component"] = "Component";
    ERC20BridgeSource["Saddle"] = "Saddle";
    ERC20BridgeSource["XSigma"] = "xSigma";
    ERC20BridgeSource["UniswapV3"] = "Uniswap_V3";
    ERC20BridgeSource["CurveV2"] = "Curve_V2";
    ERC20BridgeSource["Lido"] = "Lido";
    ERC20BridgeSource["ShibaSwap"] = "ShibaSwap";
    ERC20BridgeSource["AaveV2"] = "Aave_V2";
    ERC20BridgeSource["Compound"] = "Compound";
    ERC20BridgeSource["Synapse"] = "Synapse";
    // BSC only
    ERC20BridgeSource["PancakeSwap"] = "PancakeSwap";
    ERC20BridgeSource["PancakeSwapV2"] = "PancakeSwap_V2";
    ERC20BridgeSource["BakerySwap"] = "BakerySwap";
    ERC20BridgeSource["Nerve"] = "Nerve";
    ERC20BridgeSource["Belt"] = "Belt";
    ERC20BridgeSource["Ellipsis"] = "Ellipsis";
    ERC20BridgeSource["ApeSwap"] = "ApeSwap";
    ERC20BridgeSource["CafeSwap"] = "CafeSwap";
    ERC20BridgeSource["CheeseSwap"] = "CheeseSwap";
    ERC20BridgeSource["JulSwap"] = "JulSwap";
    ERC20BridgeSource["ACryptos"] = "ACryptoS";
    // Polygon only
    ERC20BridgeSource["QuickSwap"] = "QuickSwap";
    ERC20BridgeSource["ComethSwap"] = "ComethSwap";
    ERC20BridgeSource["Dfyn"] = "Dfyn";
    ERC20BridgeSource["WaultSwap"] = "WaultSwap";
    ERC20BridgeSource["Polydex"] = "Polydex";
    ERC20BridgeSource["FirebirdOneSwap"] = "FirebirdOneSwap";
    ERC20BridgeSource["JetSwap"] = "JetSwap";
    ERC20BridgeSource["IronSwap"] = "IronSwap";
    // Avalanche
    ERC20BridgeSource["Pangolin"] = "Pangolin";
    ERC20BridgeSource["TraderJoe"] = "TraderJoe";
    // Celo only
    ERC20BridgeSource["UbeSwap"] = "UbeSwap";
    ERC20BridgeSource["MobiusMoney"] = "MobiusMoney";
    // Fantom
    ERC20BridgeSource["SpiritSwap"] = "SpiritSwap";
    ERC20BridgeSource["SpookySwap"] = "SpookySwap";
    ERC20BridgeSource["Beethovenx"] = "Beethovenx";
    ERC20BridgeSource["MorpheusSwap"] = "MorpheusSwap";
    ERC20BridgeSource["Geist"] = "Geist";
})(ERC20BridgeSource = exports.ERC20BridgeSource || (exports.ERC20BridgeSource = {}));
// tslint:disable: enum-naming
/**
 * Curve contract function selectors.
 */
var CurveFunctionSelectors;
(function (CurveFunctionSelectors) {
    CurveFunctionSelectors["None"] = "0x00000000";
    CurveFunctionSelectors["exchange"] = "0x3df02124";
    CurveFunctionSelectors["exchange_underlying"] = "0xa6417ed6";
    CurveFunctionSelectors["get_dy_underlying"] = "0x07211ef7";
    CurveFunctionSelectors["get_dx_underlying"] = "0x0e71d1b9";
    CurveFunctionSelectors["get_dy"] = "0x5e0d443f";
    CurveFunctionSelectors["get_dx"] = "0x67df02ca";
    // Curve V2
    CurveFunctionSelectors["exchange_v2"] = "0x5b41b908";
    CurveFunctionSelectors["exchange_underlying_v2"] = "0x65b2489b";
    CurveFunctionSelectors["get_dy_v2"] = "0x556d6e9f";
    CurveFunctionSelectors["get_dy_underlying_v2"] = "0x85f11d1e";
    // Smoothy
    CurveFunctionSelectors["swap_uint256"] = "0x5673b02d";
    CurveFunctionSelectors["get_swap_amount"] = "0x45cf2ef6";
    // Nerve BSC, Saddle Mainnet
    CurveFunctionSelectors["swap"] = "0x91695586";
    CurveFunctionSelectors["calculateSwap"] = "0xa95b089f";
})(CurveFunctionSelectors = exports.CurveFunctionSelectors || (exports.CurveFunctionSelectors = {}));
//# sourceMappingURL=types.js.map