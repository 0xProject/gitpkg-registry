"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
// tslint:disable custom-no-magic-numbers
exports.constants = {
    NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
    MAINNET_CHAIN_ID: 1,
    ZERO_AMOUNT: new utils_1.BigNumber(0),
    TWO_WEEKS_IN_SEC: new utils_1.BigNumber(14)
        .times(24)
        .times(60)
        .times(60),
    TEN_DAYS_IN_SEC: new utils_1.BigNumber(10)
        .times(24)
        .times(60)
        .times(60),
    TWENTY_DAYS_IN_SEC: new utils_1.BigNumber(20)
        .times(24)
        .times(60)
        .times(60),
};
//# sourceMappingURL=constants.js.map