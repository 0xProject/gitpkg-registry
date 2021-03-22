"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const TOKEN_DECIMALS = 18;
// tslint:disable:custom-no-magic-numbers
exports.baseUnitAmount = (unitAmount, decimals = TOKEN_DECIMALS) => {
    return web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(new utils_1.BigNumber(unitAmount), decimals);
};
// tslint:disable:completed-docs
function generatePseudoRandomSalt() {
    const salt = utils_1.generatePseudoRandom256BitNumber();
    return salt;
}
exports.generatePseudoRandomSalt = generatePseudoRandomSalt;
function getRandomAmount(maxAmount = '1e18') {
    return contracts_test_utils_1.getRandomInteger(1, maxAmount);
}
exports.getRandomAmount = getRandomAmount;
function getRandomSignature() {
    return {
        v: 1,
        r: utils_1.hexUtils.random(32),
        s: utils_1.hexUtils.random(32),
        signatureType: protocol_utils_1.SignatureType.Invalid,
    };
}
exports.getRandomSignature = getRandomSignature;
//# sourceMappingURL=utils.js.map