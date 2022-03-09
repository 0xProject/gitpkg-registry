"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplexBatchSellEncoder = exports.multiplexPlpEncoder = exports.multiplexUniswapEncoder = exports.multiplexRfqEncoder = exports.multiplexTransformERC20Encoder = exports.MultiplexSubcall = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
var MultiplexSubcall;
(function (MultiplexSubcall) {
    MultiplexSubcall[MultiplexSubcall["Invalid"] = 0] = "Invalid";
    MultiplexSubcall[MultiplexSubcall["Rfq"] = 1] = "Rfq";
    MultiplexSubcall[MultiplexSubcall["Otc"] = 2] = "Otc";
    MultiplexSubcall[MultiplexSubcall["UniswapV2"] = 3] = "UniswapV2";
    MultiplexSubcall[MultiplexSubcall["UniswapV3"] = 4] = "UniswapV3";
    MultiplexSubcall[MultiplexSubcall["LiquidityProvider"] = 5] = "LiquidityProvider";
    MultiplexSubcall[MultiplexSubcall["TransformERC20"] = 6] = "TransformERC20";
    MultiplexSubcall[MultiplexSubcall["BatchSell"] = 7] = "BatchSell";
    MultiplexSubcall[MultiplexSubcall["MultiHopSell"] = 8] = "MultiHopSell";
})(MultiplexSubcall = exports.MultiplexSubcall || (exports.MultiplexSubcall = {}));
exports.multiplexTransformERC20Encoder = utils_1.AbiEncoder.create([
    {
        name: 'transformations',
        type: 'tuple[]',
        components: [
            { name: 'deploymentNonce', type: 'uint32' },
            { name: 'data', type: 'bytes' },
        ],
    },
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
exports.multiplexBatchSellEncoder = utils_1.AbiEncoder.create([
    {
        name: 'subcalls',
        type: 'tuple[]',
        components: [
            { name: 'id', type: 'uint8' },
            { name: 'sellAmount', type: 'uint256' },
            { name: 'data', type: 'bytes' },
        ],
    },
]);
//# sourceMappingURL=multiplex_encoders.js.map