"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
exports.createOrder = (makerAssetData, takerAssetData) => {
    return {
        order: {
            makerAddress: '0x00',
            takerAddress: '0x00',
            makerAssetData,
            takerAssetData,
            makerFeeAssetData: makerAssetData,
            takerFeeAssetData: takerAssetData,
            chainId: 0,
            exchangeAddress: '0x00',
            senderAddress: '0x00',
            makerAssetAmount: new utils_1.BigNumber(1),
            takerAssetAmount: new utils_1.BigNumber(1),
            feeRecipientAddress: '0x00',
            makerFee: new utils_1.BigNumber(0),
            takerFee: new utils_1.BigNumber(0),
            salt: new utils_1.BigNumber(0),
            expirationTimeSeconds: new utils_1.BigNumber(0),
            signature: '0xsig',
        },
        metaData: {
            orderHash: '0x12345',
            remainingFillableTakerAssetAmount: new utils_1.BigNumber(1),
        },
    };
};
//# sourceMappingURL=utils.js.map