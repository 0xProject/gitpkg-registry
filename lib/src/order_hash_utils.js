"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const eip712_utils_1 = require("./eip712_utils");
exports.orderHashUtils = {
    getOrderHash: (order) => {
        return utils_1.hexUtils.toHex(utils_1.signTypedDataUtils.generateTypedDataHash(eip712_utils_1.eip712Utils.createOrderTypedData(order)));
    },
};
//# sourceMappingURL=order_hash_utils.js.map