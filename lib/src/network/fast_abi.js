"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFastAbiEncoderOverrides = void 0;
const utils_1 = require("@0x/utils");
const fast_abi_1 = require("fast-abi");
const utils_2 = require("../utils/utils");
// Cache to avoid creating tons of FastABI instances for commonly used contracts.
const ABI_ENCODER_CACHE = {};
function createFastAbiEncoderOverrides(contractType) {
    let fastAbi = ABI_ENCODER_CACHE[contractType.contractName];
    if (!fastAbi) {
        fastAbi = new fast_abi_1.FastABI(contractType.ABI(), { BigNumber: utils_1.BigNumber });
        ABI_ENCODER_CACHE[contractType.contractName] = fastAbi;
    }
    return {
        encodeInput: (fnName, values) => utils_2.timeIt(() => fastAbi.encodeInput(fnName, values), dt => `${fnName} encode took ${dt}ms`),
        decodeOutput: (fnName, data) => utils_2.timeIt(() => fastAbi.decodeOutput(fnName, data), dt => `${fnName} decode too ${dt}ms`),
    };
}
exports.createFastAbiEncoderOverrides = createFastAbiEncoderOverrides;
//# sourceMappingURL=fast_abi.js.map