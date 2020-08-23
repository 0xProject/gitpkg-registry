"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    ERC20BridgeSource["Bancor"] = "Bancor";
    ERC20BridgeSource["MStable"] = "mStable";
    ERC20BridgeSource["MultiHop"] = "MultiHop";
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
})(CurveFunctionSelectors = exports.CurveFunctionSelectors || (exports.CurveFunctionSelectors = {}));
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
class SamplerContractOperation {
    constructor(opts) {
        this.source = opts.source;
        this.fillData = opts.fillData || {}; // tslint:disable-line:no-object-literal-type-assertion
        this._samplerContract = opts.contract;
        this._samplerFunction = opts.function;
        this._params = opts.params;
        this._callback = opts.callback;
    }
    encodeCall() {
        return this._samplerFunction
            .bind(this._samplerContract)(...this._params)
            .getABIEncodedTransactionData();
    }
    handleCallResultsAsync(callResults) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._callback !== undefined) {
                return this._callback(callResults, this.fillData);
            }
            else {
                return this._samplerContract.getABIDecodedReturnData(this._samplerFunction.name, callResults);
            }
        });
    }
}
exports.SamplerContractOperation = SamplerContractOperation;
//# sourceMappingURL=types.js.map