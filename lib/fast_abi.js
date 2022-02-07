"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastABI = void 0;
const bignumber_js_1 = require("bignumber.js");
const { Coder } = require('../bin');
class FastABI {
    constructor(abi, opts) {
        this._opts = Object.assign({ BigNumber: bignumber_js_1.BigNumber }, opts) || { BigNumber: bignumber_js_1.BigNumber };
        this._abi = abi;
        this._coder = new Coder(JSON.stringify(abi));
    }
    encodeInput(fnName, values) {
        const found = this._abi.filter((a) => a.name === fnName)[0];
        const args = this._serializeArgsOut(values, found.inputs);
        try {
            const encoded = this._coder.encodeInput(fnName, args);
            return `0x${encoded}`;
        }
        catch (e) {
            throw new Error(`${e.message}.\nvalues=${JSON.stringify(values)}\nargs=${JSON.stringify(args)}`);
        }
    }
    decodeInput(fnName, output) {
        const found = this._abi.filter((a) => a.name === fnName)[0];
        const decoded = this._coder.decodeInput(fnName, output);
        return this._deserializeResultsIn(found.inputs, decoded);
    }
    decodeOutput(fnName, output) {
        const found = this._abi.filter((a) => a.name === fnName)[0];
        const decoded = this._coder.decodeOutput(fnName, output);
        return this._deserializeResultsIn(found.outputs, decoded);
    }
    _deserializeResultIn(abi, value) {
        if (abi.type.indexOf('[]') !== -1) {
            // Pop off the last [] and serialize each sub value
            let type = abi.type.split('[]');
            type.pop();
            let newType = type.join('[]'); // e.g address[][] -> address[]
            return value.map((v) => this._deserializeResultIn(Object.assign(Object.assign({}, abi), { type: newType }), v));
        }
        if (abi.type.indexOf('int') !== -1) {
            return new this._opts.BigNumber(value);
        }
        if (abi.type === 'tuple' && abi.components) {
            const output = {};
            for (const [i, c] of Object.entries(abi.components)) {
                output[c.name] = this._deserializeResultIn(c, value[parseInt(i)]);
            }
            return output;
        }
        return value;
    }
    _deserializeResultsIn(abis, values) {
        const output = [];
        for (const [i, v] of Object.entries(abis)) {
            output.push(this._deserializeResultIn(v, values[parseInt(i)]));
        }
        if (abis.length === 1) {
            return output[0];
        }
        return output;
    }
    // Convert the javascript arguments into the FastAbi preferred arguments
    _serializeArgsOut(abis, args) {
        return abis.map((abi, i) => this._serializeArgOut(args[i], abi));
    }
    _serializeArgOut(abi, arg) {
        if (arg === undefined) {
            throw new Error(`Encountered undefined argument`);
        }
        if (abi.type.indexOf('[]') !== -1) {
            // Pop off the last [] and serialize each sub value
            let type = abi.type.split('[]');
            type.pop();
            let newType = type.join('[]'); // e.g address[][] -> address[]
            return arg.map((v) => this._serializeArgOut(Object.assign(Object.assign({}, abi), { type: newType }), v));
        }
        // Convert from { b: 2, a: 1 } into a component ordered value array, [1,2]
        if (abi.type === 'tuple' && abi.components) {
            const output = [];
            for (const [_i, c] of Object.entries(abi.components)) {
                output.push(this._serializeArgOut(c, arg[c.name]));
            }
            return output;
        }
        if (this._opts.BigNumber.isBigNumber(arg)) {
            return arg.toString(10);
        }
        return arg.toString();
    }
}
exports.FastABI = FastABI;
//# sourceMappingURL=fast_abi.js.map