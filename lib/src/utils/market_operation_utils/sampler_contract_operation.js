"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    handleCallResults(callResults) {
        if (this._callback !== undefined) {
            return this._callback(callResults, this.fillData);
        }
        else {
            return this._samplerContract.getABIDecodedReturnData(this._samplerFunction.name, callResults);
        }
    }
}
exports.SamplerContractOperation = SamplerContractOperation;
//# sourceMappingURL=sampler_contract_operation.js.map