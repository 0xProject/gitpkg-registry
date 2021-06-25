"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasuredSamplerContractOperation = void 0;
const utils_1 = require("@0x/utils");
class PathDeregister {
    constructor() {
        // Presence in this registry with a negtive number indicates the Path has been deregistered
        this._registry = {};
        this._MAX_RESULTS = 100;
    }
    static createKey(args) {
        return args
            .map(a => {
            if (typeof a === 'object' && a !== null) {
                return Object.values(a).join('-');
            }
            if (Array.isArray(a)) {
                return a.join('-');
            }
            return a.toString();
        })
            .join('-');
    }
    static getInstance() {
        if (!PathDeregister._instance) {
            PathDeregister._instance = new PathDeregister();
        }
        return PathDeregister._instance;
    }
    static _getRandom() {
        // tslint:disable-next-line: custom-no-magic-numbers
        return Math.floor(Math.random() * (100 - 0 + 1)) + 0;
    }
    isDeregistered(source, key) {
        if (!this._registry[source]) {
            this._registry[source] = {};
        }
        // Randomly allow the ops to be re-registered
        if (PathDeregister._getRandom() === 1) {
            return false;
        }
        return this._registry[source][key] < 0;
    }
    // Registers a successful result. Upon having one single success
    // a Path is no longer deregistered
    handleResult(source, key, result) {
        if (!this._registry[source]) {
            this._registry[source] = {};
        }
        // Defaults to 0
        if (!this._registry[source][key]) {
            this._registry[source][key] = 0;
        }
        if (this._didSucceed(result)) {
            if (this._registry[source][key] < 0) {
                this._registry[source][key] = 0;
            }
            this._registry[source][key] = Math.min(this._MAX_RESULTS, this._registry[source][key] + 1);
        }
        else {
            this._registry[source][key] = Math.max(-this._MAX_RESULTS, this._registry[source][key] - 1);
        }
    }
    // tslint:disable-next-line: prefer-function-over-method
    _didSucceed(result) {
        const nonZeroSample = result.samples.find(s => s.isGreaterThan(0));
        return nonZeroSample !== undefined && result.samples.length > 0;
    }
}
// tslint:disable-next-line: max-classes-per-file
class MeasuredSamplerContractOperation {
    constructor(opts) {
        this.source = opts.source;
        this.fillData = opts.fillData || {}; // tslint:disable-line:no-object-literal-type-assertion
        this._samplerContract = opts.contract;
        this._samplerFunction = opts.function;
        this._params = opts.params;
        this._callback = opts.callback;
        this._deregisterable = opts.deregisterable || false;
        this._log = opts.log || false;
        if (this._deregisterable) {
            this._deregisterKey = PathDeregister.createKey(this._params.slice(0, this._params.length - 1));
        }
    }
    encodeCall() {
        return this._samplerFunction
            .bind(this._samplerContract)(...this._params)
            .getABIEncodedTransactionData();
    }
    handleCallResults(callResults) {
        let result;
        if (this._callback !== undefined) {
            result = this._callback(callResults, this.fillData);
        }
        else {
            const [gasUsed, samples] = this._samplerContract.getABIDecodedReturnData(this._samplerFunction.name, callResults);
            result = { gasUsed, samples };
        }
        if (this._deregisterKey) {
            PathDeregister.getInstance().handleResult(this.source, this._deregisterKey, result);
        }
        if (this._log) {
            utils_1.logUtils.log(Object.assign({ source: this.source, fillData: this.fillData }, result));
        }
        return result;
    }
    handleRevert(callResults) {
        let msg = callResults;
        try {
            msg = utils_1.decodeBytesAsRevertError(callResults).toString();
        }
        catch (e) {
            // do nothing
        }
        utils_1.logUtils.warn(`SamplerContractOperation: ${this.source}.${this._samplerFunction.name} reverted ${msg} ${JSON.stringify(this.fillData, null, 2)}`);
        const result = { gasUsed: [], samples: [] };
        if (this._deregisterKey) {
            PathDeregister.getInstance().handleResult(this.source, this._deregisterKey, result);
        }
        return result;
    }
    isDeregistered() {
        if (this._deregisterKey) {
            return PathDeregister.getInstance().isDeregistered(this.source, this._deregisterKey);
        }
        return false;
    }
}
exports.MeasuredSamplerContractOperation = MeasuredSamplerContractOperation;
//# sourceMappingURL=measured_sampler_contract_operation.js.map