"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShellsForPair = void 0;
const constants_1 = require("./constants");
// tslint:disable completed-docs
function getShellsForPair(takerToken, makerToken) {
    return Object.values(constants_1.MAINNET_SHELL_POOLS)
        .filter(c => [makerToken, takerToken].every(t => c.tokens.includes(t)))
        .map(i => i.poolAddress);
}
exports.getShellsForPair = getShellsForPair;
//# sourceMappingURL=shell_utils.js.map