"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const TOKEN_DECIMALS = 18;
// tslint:disable:custom-no-magic-numbers
exports.baseUnitAmount = (unitAmount, decimals = TOKEN_DECIMALS) => {
    return web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(new utils_1.BigNumber(unitAmount), decimals);
};
//# sourceMappingURL=utils.js.map