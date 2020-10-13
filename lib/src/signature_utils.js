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
const json_schemas_1 = require("@0x/json-schemas");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const ethUtil = require("ethereumjs-util");
const _ = require("lodash");
const assert_1 = require("./assert");
const eip712_utils_1 = require("./eip712_utils");
const hash_utils_1 = require("./hash_utils");
const order_hash_utils_1 = require("./order_hash_utils");
const transaction_hash_utils_1 = require("./transaction_hash_utils");
const types_2 = require("./types");
exports.signatureUtils = {
    /**
     * Signs an order and returns a SignedOrder. First `eth_signTypedData` is requested
     * then a fallback to `eth_sign` if not available on the supplied provider.
     * @param   supportedProvider      Web3 provider to use for all JSON RPC requests
     * @param   order The Order to sign.
     * @param   signerAddress   The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the supplied Provider.
     * @return  A SignedOrder containing the order and Elliptic curve signature with Signature Type.
     */
    ecSignOrderAsync(supportedProvider, order, signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema, [json_schemas_1.schemas.hexSchema]);
            try {
                const signedOrder = yield exports.signatureUtils.ecSignTypedDataOrderAsync(supportedProvider, order, signerAddress);
                return signedOrder;
            }
            catch (err) {
                // HACK: We are unable to handle specific errors thrown since provider is not an object
                //       under our control. It could be Metamask Web3, Ethers, or any general RPC provider.
                //       We check for a user denying the signature request in a way that supports Metamask and
                //       Coinbase Wallet. Unfortunately for signers with a different error message,
                //       they will receive two signature requests.
                if (err.message.includes('User denied message signature')) {
                    throw err;
                }
                const orderHash = order_hash_utils_1.orderHashUtils.getOrderHash(order);
                const signatureHex = yield exports.signatureUtils.ecSignHashAsync(supportedProvider, orderHash, signerAddress);
                const signedOrder = Object.assign({}, order, { signature: signatureHex });
                return signedOrder;
            }
        });
    },
    /**
     * Signs an order using `eth_signTypedData` and returns a SignedOrder.
     * @param   supportedProvider      Web3 provider to use for all JSON RPC requests
     * @param   order The Order to sign.
     * @param   signerAddress   The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the supplied Provider.
     * @return  A SignedOrder containing the order and Elliptic curve signature with Signature Type.
     */
    ecSignTypedDataOrderAsync(supportedProvider, order, signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
            assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
            assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema, [json_schemas_1.schemas.hexSchema]);
            const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
            yield assert_1.assert.isSenderAddressAsync('signerAddress', signerAddress, web3Wrapper);
            const normalizedSignerAddress = signerAddress.toLowerCase();
            const typedData = eip712_utils_1.eip712Utils.createOrderTypedData(order);
            try {
                const signature = yield web3Wrapper.signTypedDataAsync(normalizedSignerAddress, typedData);
                const ecSignatureRSV = parseSignatureHexAsRSV(signature);
                const signatureBuffer = Buffer.concat([
                    ethUtil.toBuffer(ecSignatureRSV.v),
                    ethUtil.toBuffer(ecSignatureRSV.r),
                    ethUtil.toBuffer(ecSignatureRSV.s),
                    ethUtil.toBuffer(types_1.SignatureType.EIP712),
                ]);
                const signatureHex = `0x${signatureBuffer.toString('hex')}`;
                return Object.assign({}, order, { signature: signatureHex });
            }
            catch (err) {
                // Detect if Metamask to transition users to the MetamaskSubprovider
                if (provider.isMetaMask) {
                    throw new Error(types_2.TypedDataError.InvalidMetamaskSigner);
                }
                else {
                    throw err;
                }
            }
        });
    },
    /**
     * Signs a transaction and returns a SignedZeroExTransaction. First `eth_signTypedData` is requested
     * then a fallback to `eth_sign` if not available on the supplied provider.
     * @param   supportedProvider      Web3 provider to use for all JSON RPC requests
     * @param   transaction The ZeroExTransaction to sign.
     * @param   signerAddress   The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the supplied Provider.
     * @return  A SignedTransaction containing the order and Elliptic curve signature with Signature Type.
     */
    ecSignTransactionAsync(supportedProvider, transaction, signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.doesConformToSchema('transaction', transaction, json_schemas_1.schemas.zeroExTransactionSchema, [json_schemas_1.schemas.hexSchema]);
            try {
                const signedTransaction = yield exports.signatureUtils.ecSignTypedDataTransactionAsync(supportedProvider, transaction, signerAddress);
                return signedTransaction;
            }
            catch (err) {
                // HACK: We are unable to handle specific errors thrown since provider is not an object
                //       under our control. It could be Metamask Web3, Ethers, or any general RPC provider.
                //       We check for a user denying the signature request in a way that supports Metamask and
                //       Coinbase Wallet. Unfortunately for signers with a different error message,
                //       they will receive two signature requests.
                if (err.message.includes('User denied message signature')) {
                    throw err;
                }
                const transactionHash = transaction_hash_utils_1.transactionHashUtils.getTransactionHash(transaction);
                const signatureHex = yield exports.signatureUtils.ecSignHashAsync(supportedProvider, transactionHash, signerAddress);
                const signedTransaction = Object.assign({}, transaction, { signature: signatureHex });
                return signedTransaction;
            }
        });
    },
    /**
     * Signs a ZeroExTransaction using `eth_signTypedData` and returns a SignedZeroExTransaction.
     * @param   supportedProvider      Web3 provider to use for all JSON RPC requests
     * @param   transaction            The ZeroEx Transaction to sign.
     * @param   signerAddress          The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the supplied Provider.
     * @return  A SignedZeroExTransaction containing the ZeroExTransaction and Elliptic curve signature with Signature Type.
     */
    ecSignTypedDataTransactionAsync(supportedProvider, transaction, signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
            assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
            assert_1.assert.doesConformToSchema('transaction', transaction, json_schemas_1.schemas.zeroExTransactionSchema, [json_schemas_1.schemas.hexSchema]);
            const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
            yield assert_1.assert.isSenderAddressAsync('signerAddress', signerAddress, web3Wrapper);
            const normalizedSignerAddress = signerAddress.toLowerCase();
            const typedData = eip712_utils_1.eip712Utils.createZeroExTransactionTypedData(transaction);
            try {
                const signature = yield web3Wrapper.signTypedDataAsync(normalizedSignerAddress, typedData);
                const ecSignatureRSV = parseSignatureHexAsRSV(signature);
                const signatureBuffer = Buffer.concat([
                    ethUtil.toBuffer(ecSignatureRSV.v),
                    ethUtil.toBuffer(ecSignatureRSV.r),
                    ethUtil.toBuffer(ecSignatureRSV.s),
                    ethUtil.toBuffer(types_1.SignatureType.EIP712),
                ]);
                const signatureHex = `0x${signatureBuffer.toString('hex')}`;
                return Object.assign({}, transaction, { signature: signatureHex });
            }
            catch (err) {
                // Detect if Metamask to transition users to the MetamaskSubprovider
                if (provider.isMetaMask) {
                    throw new Error(types_2.TypedDataError.InvalidMetamaskSigner);
                }
                else {
                    throw err;
                }
            }
        });
    },
    /**
     * Signs an Exchange Proxy meta-transaction and returns a SignedExchangeProxyMetaTransaction.
     * First `eth_signTypedData` is requested then a fallback to `eth_sign` if not
     * available on the supplied provider.
     * @param   supportedProvider  Web3 provider to use for all JSON RPC requests
     * @param   transaction The ExchangeProxyMetaTransaction to sign.
     * @param   signerAddress The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the supplied Provider.
     * @return  A SignedExchangeProxyMetaTransaction containing the order and
     *          elliptic curve signature with Signature Type.
     */
    ecSignExchangeProxyMetaTransactionAsync(supportedProvider, transaction, signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.doesConformToSchema('transaction', transaction, json_schemas_1.schemas.exchangeProxyMetaTransactionSchema, [
                json_schemas_1.schemas.hexSchema,
            ]);
            try {
                const signedTransaction = yield exports.signatureUtils.ecSignTypedDataExchangeProxyMetaTransactionAsync(supportedProvider, transaction, signerAddress);
                return signedTransaction;
            }
            catch (err) {
                // HACK: We are unable to handle specific errors thrown since provider is not an object
                //       under our control. It could be Metamask Web3, Ethers, or any general RPC provider.
                //       We check for a user denying the signature request in a way that supports Metamask and
                //       Coinbase Wallet. Unfortunately for signers with a different error message,
                //       they will receive two signature requests.
                if (err.message.includes('User denied message signature')) {
                    throw err;
                }
                const transactionHash = hash_utils_1.getExchangeProxyMetaTransactionHash(transaction);
                const signatureHex = yield exports.signatureUtils.ecSignHashAsync(supportedProvider, transactionHash, signerAddress);
                const signedTransaction = Object.assign({}, transaction, { signature: signatureHex });
                return signedTransaction;
            }
        });
    },
    /**
     * Signs an Exchange Proxy meta-transaction using `eth_signTypedData` and
     * returns a SignedZeroExTransaction.
     * @param   supportedProvider      Web3 provider to use for all JSON RPC requests
     * @param   transaction            The Exchange Proxy transaction to sign.
     * @param   signerAddress          The hex encoded Ethereum address you wish
     *          to sign it with. This address must be available via the supplied Provider.
     * @return  A SignedExchangeProxyMetaTransaction containing the
     *          ExchangeProxyMetaTransaction and elliptic curve signature with Signature Type.
     */
    ecSignTypedDataExchangeProxyMetaTransactionAsync(supportedProvider, transaction, signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
            assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
            assert_1.assert.doesConformToSchema('transaction', transaction, json_schemas_1.schemas.exchangeProxyMetaTransactionSchema, [
                json_schemas_1.schemas.hexSchema,
            ]);
            const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
            yield assert_1.assert.isSenderAddressAsync('signerAddress', signerAddress, web3Wrapper);
            const normalizedSignerAddress = signerAddress.toLowerCase();
            const typedData = eip712_utils_1.eip712Utils.createExchangeProxyMetaTransactionTypedData(transaction);
            try {
                const signature = yield web3Wrapper.signTypedDataAsync(normalizedSignerAddress, typedData);
                const ecSignatureRSV = parseSignatureHexAsRSV(signature);
                const signatureHex = utils_1.hexUtils.concat(ecSignatureRSV.v, ecSignatureRSV.r, ecSignatureRSV.s, types_1.SignatureType.EIP712);
                return Object.assign({}, transaction, { signature: signatureHex });
            }
            catch (err) {
                // Detect if Metamask to transition users to the MetamaskSubprovider
                if (provider.isMetaMask) {
                    throw new Error(types_2.TypedDataError.InvalidMetamaskSigner);
                }
                else {
                    throw err;
                }
            }
        });
    },
    /**
     * Signs a hash using `eth_sign` and returns its elliptic curve signature and signature type.
     * @param   supportedProvider      Web3 provider to use for all JSON RPC requests
     * @param   msgHash       Hex encoded message to sign.
     * @param   signerAddress   The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the supplied Provider.
     * @return  A hex encoded string containing the Elliptic curve signature generated by signing the msgHash and the Signature Type.
     */
    ecSignHashAsync(supportedProvider, msgHash, signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
            assert_1.assert.isHexString('msgHash', msgHash);
            assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
            const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
            yield assert_1.assert.isSenderAddressAsync('signerAddress', signerAddress, web3Wrapper);
            const normalizedSignerAddress = signerAddress.toLowerCase();
            const signature = yield web3Wrapper.signMessageAsync(normalizedSignerAddress, msgHash);
            const prefixedMsgHashHex = exports.signatureUtils.addSignedMessagePrefix(msgHash);
            // HACK: There is no consensus on whether the signatureHex string should be formatted as
            // v + r + s OR r + s + v, and different clients (even different versions of the same client)
            // return the signature params in different orders. In order to support all client implementations,
            // we parse the signature in both ways, and evaluate if either one is a valid signature.
            // r + s + v is the most prevalent format from eth_sign, so we attempt this first.
            // tslint:disable-next-line:custom-no-magic-numbers
            const validVParamValues = [27, 28];
            const ecSignatureRSV = parseSignatureHexAsRSV(signature);
            if (_.includes(validVParamValues, ecSignatureRSV.v)) {
                const isValidRSVSignature = isValidECSignature(prefixedMsgHashHex, ecSignatureRSV, normalizedSignerAddress);
                if (isValidRSVSignature) {
                    const convertedSignatureHex = exports.signatureUtils.convertECSignatureToSignatureHex(ecSignatureRSV);
                    return convertedSignatureHex;
                }
            }
            const ecSignatureVRS = parseSignatureHexAsVRS(signature);
            if (_.includes(validVParamValues, ecSignatureVRS.v)) {
                const isValidVRSSignature = isValidECSignature(prefixedMsgHashHex, ecSignatureVRS, normalizedSignerAddress);
                if (isValidVRSSignature) {
                    const convertedSignatureHex = exports.signatureUtils.convertECSignatureToSignatureHex(ecSignatureVRS);
                    return convertedSignatureHex;
                }
            }
            // Detect if Metamask to transition users to the MetamaskSubprovider
            if (provider.isMetaMask) {
                throw new Error(types_2.TypedDataError.InvalidMetamaskSigner);
            }
            else {
                throw new Error(types_2.TypedDataError.InvalidSignature);
            }
        });
    },
    /**
     * Combines ECSignature with V,R,S and the EthSign signature type for use in 0x protocol
     * @param ecSignature The ECSignature of the signed data
     * @return Hex encoded string of signature (v,r,s) with Signature Type
     */
    convertECSignatureToSignatureHex(ecSignature) {
        const signatureHex = utils_1.hexUtils.concat(ecSignature.v, ecSignature.r, ecSignature.s);
        const signatureWithType = exports.signatureUtils.convertToSignatureWithType(signatureHex, types_1.SignatureType.EthSign);
        return signatureWithType;
    },
    /**
     * Combines the signature proof and the Signature Type.
     * @param signature The hex encoded signature proof
     * @param signatureType The signature type, i.e EthSign, Wallet etc.
     * @return Hex encoded string of signature proof with Signature Type
     */
    convertToSignatureWithType(signature, signatureType) {
        const signatureBuffer = Buffer.concat([ethUtil.toBuffer(signature), ethUtil.toBuffer(signatureType)]);
        const signatureHex = `0x${signatureBuffer.toString('hex')}`;
        return signatureHex;
    },
    /**
     * Adds the relevant prefix to the message being signed.
     * @param message Message to sign
     * @return Prefixed message
     */
    addSignedMessagePrefix(message) {
        assert_1.assert.isString('message', message);
        const msgBuff = ethUtil.toBuffer(message);
        const prefixedMsgBuff = ethUtil.hashPersonalMessage(msgBuff);
        const prefixedMsgHex = ethUtil.bufferToHex(prefixedMsgBuff);
        return prefixedMsgHex;
    },
    /**
     * Parse a hex-encoded Validator signature into validator address and signature components
     * @param signature A hex encoded Validator 0x Protocol signature
     * @return A ValidatorSignature with validatorAddress and signature parameters
     */
    parseValidatorSignature(signature) {
        assert_1.assert.isOneOfExpectedSignatureTypes(signature, [types_1.SignatureType.Validator]);
        // tslint:disable:custom-no-magic-numbers
        const validatorSignature = {
            validatorAddress: `0x${signature.slice(-42, -2)}`,
            signature: signature.slice(0, -42),
        };
        // tslint:enable:custom-no-magic-numbers
        return validatorSignature;
    },
};
/**
 * Parses a signature hex string, which is assumed to be in the VRS format.
 */
function parseSignatureHexAsVRS(signatureHex) {
    const signatureBuffer = ethUtil.toBuffer(signatureHex);
    let v = signatureBuffer[0];
    // HACK: Sometimes v is returned as [0, 1] and sometimes as [27, 28]
    // If it is returned as [0, 1], add 27 to both so it becomes [27, 28]
    const lowestValidV = 27;
    const isProperlyFormattedV = v >= lowestValidV;
    if (!isProperlyFormattedV) {
        v += lowestValidV;
    }
    // signatureBuffer contains vrs
    const vEndIndex = 1;
    const rsIndex = 33;
    const r = signatureBuffer.slice(vEndIndex, rsIndex);
    const sEndIndex = 65;
    const s = signatureBuffer.slice(rsIndex, sEndIndex);
    const ecSignature = {
        v,
        r: ethUtil.bufferToHex(r),
        s: ethUtil.bufferToHex(s),
    };
    return ecSignature;
}
exports.parseSignatureHexAsVRS = parseSignatureHexAsVRS;
function parseSignatureHexAsRSV(signatureHex) {
    const { v, r, s } = ethUtil.fromRpcSig(signatureHex);
    const ecSignature = {
        v,
        r: ethUtil.bufferToHex(r),
        s: ethUtil.bufferToHex(s),
    };
    return ecSignature;
}
/**
 * Checks if the supplied elliptic curve signature corresponds to signing `data` with
 * the private key corresponding to `signerAddress`
 * @param   data          The hex encoded data signed by the supplied signature.
 * @param   signature     An object containing the elliptic curve signature parameters.
 * @param   signerAddress The hex encoded address that signed the data, producing the supplied signature.
 * @return Whether the ECSignature is valid.
 */
function isValidECSignature(data, signature, signerAddress) {
    assert_1.assert.isHexString('data', data);
    assert_1.assert.doesConformToSchema('signature', signature, json_schemas_1.schemas.ecSignatureSchema);
    assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
    const normalizedSignerAddress = signerAddress.toLowerCase();
    const msgHashBuff = ethUtil.toBuffer(data);
    try {
        const pubKey = ethUtil.ecrecover(msgHashBuff, signature.v, ethUtil.toBuffer(signature.r), ethUtil.toBuffer(signature.s));
        const retrievedAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
        const normalizedRetrievedAddress = retrievedAddress.toLowerCase();
        return normalizedRetrievedAddress === normalizedSignerAddress;
    }
    catch (err) {
        return false;
    }
}
exports.isValidECSignature = isValidECSignature;
// tslint:disable:max-file-line-count
//# sourceMappingURL=signature_utils.js.map