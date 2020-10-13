"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
exports.utils = {
    getSignatureTypeIndexIfExists(signature) {
        // tslint:disable-next-line:custom-no-magic-numbers
        const signatureTypeHex = signature.slice(-2);
        const base = 16;
        const signatureTypeInt = parseInt(signatureTypeHex, base);
        return signatureTypeInt;
    },
    getCurrentUnixTimestampSec() {
        const milisecondsInSecond = 1000;
        return new utils_1.BigNumber(Date.now() / milisecondsInSecond).integerValue();
    },
    getPartialAmountFloor(numerator, denominator, target) {
        const fillMakerTokenAmount = numerator
            .multipliedBy(target)
            .div(denominator)
            .integerValue(0);
        return fillMakerTokenAmount;
    },
};
//# sourceMappingURL=utils.js.map