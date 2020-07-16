"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0x/utils");
var DydxBridgeActionType;
(function (DydxBridgeActionType) {
    DydxBridgeActionType[DydxBridgeActionType["Deposit"] = 0] = "Deposit";
    DydxBridgeActionType[DydxBridgeActionType["Withdraw"] = 1] = "Withdraw";
})(DydxBridgeActionType = exports.DydxBridgeActionType || (exports.DydxBridgeActionType = {}));
exports.dydxBridgeDataEncoder = utils_1.AbiEncoder.create([
    {
        name: 'bridgeData',
        type: 'tuple',
        components: [
            { name: 'accountNumbers', type: 'uint256[]' },
            {
                name: 'actions',
                type: 'tuple[]',
                components: [
                    { name: 'actionType', type: 'uint8' },
                    { name: 'accountIdx', type: 'uint256' },
                    { name: 'marketId', type: 'uint256' },
                    { name: 'conversionRateNumerator', type: 'uint256' },
                    { name: 'conversionRateDenominator', type: 'uint256' },
                ],
            },
        ],
    },
]);
//# sourceMappingURL=dydx_bridge_encoder.js.map