"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplexPlpEncoder = exports.multiplexUniswapEncoder = exports.multiplexRfqEncoder = exports.multiplexTransformERC20Encoder = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
exports.multiplexTransformERC20Encoder = utils_1.AbiEncoder.create([
    {
        name: 'transformations',
        type: 'tuple[]',
        components: [
            { name: 'deploymentNonce', type: 'uint32' },
            { name: 'data', type: 'bytes' },
        ],
    },
    { name: 'ethValue', type: 'uint256' },
]);
exports.multiplexRfqEncoder = utils_1.AbiEncoder.create([
    { name: 'order', type: 'tuple', components: protocol_utils_1.RfqOrder.STRUCT_ABI },
    { name: 'signature', type: 'tuple', components: protocol_utils_1.SIGNATURE_ABI },
]);
exports.multiplexUniswapEncoder = utils_1.AbiEncoder.create([
    { name: 'tokens', type: 'address[]' },
    { name: 'isSushi', type: 'bool' },
]);
exports.multiplexPlpEncoder = utils_1.AbiEncoder.create([
    { name: 'provider', type: 'address' },
    { name: 'auxiliaryData', type: 'bytes' },
]);
//# sourceMappingURL=multiplex_encoders.js.map