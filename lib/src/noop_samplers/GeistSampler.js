"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeistSampler = void 0;
const constants_1 = require("../constants");
// tslint:disable-next-line:no-unnecessary-class
class GeistSampler {
    static sampleSellsFromGeist(geistInfo, takerToken, makerToken, takerTokenAmounts) {
        // Deposit/Withdrawal underlying <-> gToken is always 1:1
        if ((takerToken.toLowerCase() === geistInfo.gToken.toLowerCase() &&
            makerToken.toLowerCase() === geistInfo.underlyingToken.toLowerCase()) ||
            (takerToken.toLowerCase() === geistInfo.underlyingToken.toLowerCase() &&
                makerToken.toLowerCase() === geistInfo.gToken.toLowerCase())) {
            return takerTokenAmounts;
        }
        // Not matching the reserve return 0 results
        const numSamples = takerTokenAmounts.length;
        const makerTokenAmounts = new Array(numSamples);
        makerTokenAmounts.fill(constants_1.ZERO_AMOUNT);
        return makerTokenAmounts;
    }
    static sampleBuysFromGeist(geistInfo, takerToken, makerToken, makerTokenAmounts) {
        // Deposit/Withdrawal underlying <-> gToken is always 1:1
        if ((takerToken.toLowerCase() === geistInfo.gToken.toLowerCase() &&
            makerToken.toLowerCase() === geistInfo.underlyingToken.toLowerCase()) ||
            (takerToken.toLowerCase() === geistInfo.underlyingToken.toLowerCase() &&
                makerToken.toLowerCase() === geistInfo.gToken.toLowerCase())) {
            return makerTokenAmounts;
        }
        // Not matching the reserve return 0 results
        const numSamples = makerTokenAmounts.length;
        const takerTokenAmounts = new Array(numSamples);
        takerTokenAmounts.fill(constants_1.ZERO_AMOUNT);
        return takerTokenAmounts;
    }
}
exports.GeistSampler = GeistSampler;
//# sourceMappingURL=GeistSampler.js.map