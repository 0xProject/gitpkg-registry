"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const constants_1 = require("./constants");
const order_hash_utils_1 = require("./order_hash_utils");
const salt_1 = require("./salt");
const signature_utils_1 = require("./signature_utils");
exports.orderFactory = {
    createOrderFromPartial(partialOrder) {
        const chainId = getChainIdFromPartial(partialOrder);
        const defaultOrder = generateEmptyOrder(chainId);
        return Object.assign({}, defaultOrder, partialOrder);
    },
    createSignedOrderFromPartial(partialSignedOrder) {
        const chainId = getChainIdFromPartial(partialSignedOrder);
        const defaultOrder = generateEmptySignedOrder(chainId);
        return Object.assign({}, defaultOrder, partialSignedOrder);
    },
    createOrder(makerAddress, makerAssetAmount, makerAssetData, takerAssetAmount, takerAssetData, exchangeAddress, chainId, createOrderOpts = generateDefaultCreateOrderOpts()) {
        const defaultCreateOrderOpts = generateDefaultCreateOrderOpts();
        const order = {
            makerAddress,
            makerAssetAmount,
            takerAssetAmount,
            makerAssetData,
            takerAssetData,
            makerFeeAssetData: createOrderOpts.makerFeeAssetData || makerAssetData,
            takerFeeAssetData: createOrderOpts.takerFeeAssetData || takerAssetData,
            takerAddress: createOrderOpts.takerAddress || defaultCreateOrderOpts.takerAddress,
            senderAddress: createOrderOpts.senderAddress || defaultCreateOrderOpts.senderAddress,
            makerFee: createOrderOpts.makerFee || defaultCreateOrderOpts.makerFee,
            takerFee: createOrderOpts.takerFee || defaultCreateOrderOpts.takerFee,
            feeRecipientAddress: createOrderOpts.feeRecipientAddress || defaultCreateOrderOpts.feeRecipientAddress,
            salt: createOrderOpts.salt || defaultCreateOrderOpts.salt,
            expirationTimeSeconds: createOrderOpts.expirationTimeSeconds || defaultCreateOrderOpts.expirationTimeSeconds,
            exchangeAddress,
            chainId,
        };
        return order;
    },
    createSignedOrderAsync(supportedProvider, makerAddress, makerAssetAmount, makerAssetData, takerAssetAmount, takerAssetData, exchangeAddress, createOrderOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = exports.orderFactory.createOrder(makerAddress, makerAssetAmount, makerAssetData, takerAssetAmount, takerAssetData, exchangeAddress, yield utils_1.providerUtils.getChainIdAsync(supportedProvider), createOrderOpts);
            const orderHash = order_hash_utils_1.orderHashUtils.getOrderHash(order);
            const signature = yield signature_utils_1.signatureUtils.ecSignHashAsync(supportedProvider, orderHash, makerAddress);
            const signedOrder = Object.assign({}, order, { signature });
            return signedOrder;
        });
    },
};
function getChainIdFromPartial(partialOrder) {
    const chainId = partialOrder.chainId;
    if (chainId === undefined || !Number.isInteger(chainId)) {
        throw new Error('chainId must be valid');
    }
    return chainId;
}
function generateEmptySignedOrder(chainId) {
    return Object.assign({}, generateEmptyOrder(chainId), { signature: constants_1.constants.NULL_BYTES });
}
function generateEmptyOrder(chainId) {
    return {
        senderAddress: constants_1.constants.NULL_ADDRESS,
        makerAddress: constants_1.constants.NULL_ADDRESS,
        takerAddress: constants_1.constants.NULL_ADDRESS,
        makerFee: constants_1.constants.ZERO_AMOUNT,
        takerFee: constants_1.constants.ZERO_AMOUNT,
        makerAssetAmount: constants_1.constants.ZERO_AMOUNT,
        takerAssetAmount: constants_1.constants.ZERO_AMOUNT,
        makerAssetData: constants_1.constants.NULL_BYTES,
        takerAssetData: constants_1.constants.NULL_BYTES,
        makerFeeAssetData: constants_1.constants.NULL_BYTES,
        takerFeeAssetData: constants_1.constants.NULL_BYTES,
        salt: salt_1.generatePseudoRandomSalt(),
        feeRecipientAddress: constants_1.constants.NULL_ADDRESS,
        expirationTimeSeconds: constants_1.constants.INFINITE_TIMESTAMP_SEC,
        exchangeAddress: constants_1.constants.NULL_ADDRESS,
        chainId,
    };
}
function generateDefaultCreateOrderOpts() {
    return {
        takerAddress: constants_1.constants.NULL_ADDRESS,
        senderAddress: constants_1.constants.NULL_ADDRESS,
        makerFee: constants_1.constants.ZERO_AMOUNT,
        takerFee: constants_1.constants.ZERO_AMOUNT,
        feeRecipientAddress: constants_1.constants.NULL_ADDRESS,
        salt: salt_1.generatePseudoRandomSalt(),
        expirationTimeSeconds: constants_1.constants.INFINITE_TIMESTAMP_SEC,
    };
}
//# sourceMappingURL=order_factory.js.map