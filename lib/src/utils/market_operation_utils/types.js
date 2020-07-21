"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    ERC20BridgeSource["Eth2Dai"] = "Eth2Dai";
    ERC20BridgeSource["Kyber"] = "Kyber";
    ERC20BridgeSource["Curve"] = "Curve";
    ERC20BridgeSource["LiquidityProvider"] = "LiquidityProvider";
    ERC20BridgeSource["MultiBridge"] = "MultiBridge";
    ERC20BridgeSource["Balancer"] = "Balancer";
})(ERC20BridgeSource = exports.ERC20BridgeSource || (exports.ERC20BridgeSource = {}));
/**
 * Flags for `Fill` objects.
 */
var FillFlags;
(function (FillFlags) {
    FillFlags[FillFlags["ConflictsWithKyber"] = 1] = "ConflictsWithKyber";
    FillFlags[FillFlags["Kyber"] = 2] = "Kyber";
    FillFlags[FillFlags["ConflictsWithMultiBridge"] = 4] = "ConflictsWithMultiBridge";
    FillFlags[FillFlags["MultiBridge"] = 8] = "MultiBridge";
})(FillFlags = exports.FillFlags || (exports.FillFlags = {}));
//# sourceMappingURL=types.js.map