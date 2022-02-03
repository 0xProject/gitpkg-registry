"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSamplerContract = void 0;
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const utils_1 = require("@0x/utils");
const wrappers_1 = require("../../src/wrappers");
const DUMMY_PROVIDER = {
    sendAsync: (..._args) => {
        /* no-op */
    },
};
// tslint:disable: no-unbound-method
class MockSamplerContract extends wrappers_1.ERC20BridgeSamplerContract {
    constructor(handlers = {}) {
        super(contracts_test_utils_1.constants.NULL_ADDRESS, DUMMY_PROVIDER);
        this._handlers = {};
        this._handlers = handlers;
    }
    batchCall(callDatas) {
        return Object.assign(Object.assign({}, super.batchCall(callDatas)), { callAsync: (..._callArgs) => __awaiter(this, void 0, void 0, function* () { return callDatas.map(callData => ({ success: true, data: this._callEncodedFunction(callData) })); }) });
    }
    getLimitOrderFillableMakerAssetAmounts(orders, signatures) {
        return this._wrapCall(super.getLimitOrderFillableMakerAssetAmounts, this._handlers.getLimitOrderFillableMakerAssetAmounts, orders, signatures, contracts_test_utils_1.constants.NULL_ADDRESS);
    }
    getLimitOrderFillableTakerAssetAmounts(orders, signatures) {
        return this._wrapCall(super.getLimitOrderFillableTakerAssetAmounts, this._handlers.getLimitOrderFillableTakerAssetAmounts, orders, signatures, contracts_test_utils_1.constants.NULL_ADDRESS);
    }
    sampleSellsFromKyberNetwork(opts, takerToken, makerToken, takerAssetAmounts) {
        return this._wrapCall(super.sampleSellsFromKyberNetworkGlobal, this._handlers.sampleSellsFromKyberNetworkGlobal, Object.assign(Object.assign({}, opts), { reserveOffset: new utils_1.BigNumber(1), hint: utils_1.NULL_BYTES }), takerToken, makerToken);
    }
    sampleSellsFromUniswap(router, takerToken, makerToken, takerAssetAmounts) {
        return this._wrapCall(super.sampleSellsFromUniswapGlobal, this._handlers.sampleSellsFromUniswapGlobal, router, takerToken, makerToken);
    }
    sampleSellsFromUniswapV2(router, path, takerAssetAmounts) {
        return this._wrapCall(super.sampleSellsFromUniswapV2Global, this._handlers.sampleSellsFromUniswapV2Global, router, path);
    }
    sampleSellsFromLiquidityProvider(providerAddress, takerToken, makerToken, takerAssetAmounts) {
        return this._wrapCall(super.sampleSellsFromLiquidityProviderGlobal, this._handlers.sampleSellsFromLiquidityProviderGlobal, providerAddress, takerToken, makerToken);
    }
    sampleBuysFromUniswap(router, takerToken, makerToken, makerAssetAmounts) {
        return this._wrapCall(super.sampleBuysFromUniswapGlobal, this._handlers.sampleBuysFromUniswapGlobal, router, takerToken, makerToken);
    }
    sampleBuysFromUniswapV2(router, path, makerAssetAmounts) {
        return this._wrapCall(super.sampleBuysFromUniswapV2Global, this._handlers.sampleBuysFromUniswapV2Global, router, path);
    }
    _callEncodedFunction(callData) {
        if (callData === '0x') {
            return callData;
        }
        // tslint:disable-next-line: custom-no-magic-numbers
        const selector = utils_1.hexUtils.slice(callData, 0, 4);
        for (const [name, handler] of Object.entries(this._handlers)) {
            if (handler && this.getSelector(name) === selector) {
                const args = this.getABIDecodedTransactionData(name, callData);
                const result = handler(...args);
                const encoder = this._lookupAbiEncoder(this.getFunctionSignature(name));
                if (encoder.getReturnValueDataItem().components.length === 1) {
                    return encoder.encodeReturnValues([result]);
                }
                else {
                    return encoder.encodeReturnValues(result);
                }
            }
        }
        if (selector === this.getSelector('batchCall')) {
            const calls = this.getABIDecodedTransactionData('batchCall', callData);
            const results = calls.map(cd => ({
                success: true,
                data: this._callEncodedFunction(cd),
            }));
            return this._lookupAbiEncoder(this.getFunctionSignature('batchCall')).encodeReturnValues([results]);
        }
        throw new Error(`Unkown selector: ${selector}`);
    }
    _wrapCall(superFn, handler, 
    // tslint:disable-next-line: trailing-comma
    ...args) {
        return Object.assign(Object.assign({}, superFn.call(this, ...args)), { callAsync: (..._callArgs) => __awaiter(this, void 0, void 0, function* () {
                if (!handler) {
                    throw new Error(`${superFn.name} handler undefined`);
                }
                return handler.call(this, ...args);
            }) });
    }
}
exports.MockSamplerContract = MockSamplerContract;
//# sourceMappingURL=mock_sampler_contract.js.map