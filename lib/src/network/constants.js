"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DUMMY_PROVIDER = exports.MAX_UINT256 = exports.ZERO_AMOUNT = exports.NULL_BYTES32 = exports.NULL_BYTES = exports.NULL_ADDRESS = void 0;
const utils_1 = require("@0x/utils");
exports.NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.NULL_BYTES = '0x';
exports.NULL_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
exports.ZERO_AMOUNT = new utils_1.BigNumber(0);
exports.MAX_UINT256 = new utils_1.BigNumber(2).pow(256).minus(1);
exports.DUMMY_PROVIDER = {
    sendAsync() {
        return;
    },
};
//# sourceMappingURL=constants.js.map