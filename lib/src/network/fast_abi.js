"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFastAbiEncoderOverrides = void 0;
const utils_1 = require("@0x/utils");
const fast_abi_1 = require("fast-abi");
// Cache to avoid creating tons of FastABI instances for commonly used contracts.
const ABI_ENCODER_CACHE = {};
function createFastAbiEncoderOverrides(contractType) {
    let fastAbi = ABI_ENCODER_CACHE[contractType.contractName];
    if (!fastAbi) {
        fastAbi = new fast_abi_1.FastABI(contractType.ABI(), { BigNumber: utils_1.BigNumber });
        ABI_ENCODER_CACHE[contractType.contractName] = fastAbi;
    }
    return {
        encodeInput: (fnName, values) => fastAbi.encodeInput(fnName, values),
        decodeOutput: (fnName, data) => fastAbi.decodeOutput(fnName, data),
    };
}
exports.createFastAbiEncoderOverrides = createFastAbiEncoderOverrides;
//# sourceMappingURL=fast_abi.js.map