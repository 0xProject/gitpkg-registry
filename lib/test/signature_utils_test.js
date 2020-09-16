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
const assert_1 = require("@0x/assert");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const chai = require("chai");
const ethUtil = require("ethereumjs-util");
const _ = require("lodash");
require("mocha");
const src_1 = require("../src");
const constants_1 = require("../src/constants");
const order_hash_utils_1 = require("../src/order_hash_utils");
const signature_utils_1 = require("../src/signature_utils");
const transaction_hash_utils_1 = require("../src/transaction_hash_utils");
const chai_setup_1 = require("./utils/chai_setup");
const web3_wrapper_1 = require("./utils/web3_wrapper");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
describe('Signature utils', () => {
    let makerAddress;
    const fakeExchangeContractAddress = '0x1dc4c1cefef38a777b15aa20260a54e584b16c48';
    const fakeChainId = 1337;
    let order;
    let transaction;
    before(() => __awaiter(this, void 0, void 0, function* () {
        const availableAddreses = yield web3_wrapper_1.web3Wrapper.getAvailableAddressesAsync();
        makerAddress = availableAddreses[0];
        order = {
            makerAddress,
            takerAddress: constants_1.constants.NULL_ADDRESS,
            senderAddress: constants_1.constants.NULL_ADDRESS,
            feeRecipientAddress: constants_1.constants.NULL_ADDRESS,
            makerAssetData: constants_1.constants.NULL_ADDRESS,
            takerAssetData: constants_1.constants.NULL_ADDRESS,
            makerFeeAssetData: constants_1.constants.NULL_ADDRESS,
            takerFeeAssetData: constants_1.constants.NULL_ADDRESS,
            salt: new utils_1.BigNumber(0),
            makerFee: new utils_1.BigNumber(0),
            takerFee: new utils_1.BigNumber(0),
            makerAssetAmount: new utils_1.BigNumber(0),
            takerAssetAmount: new utils_1.BigNumber(0),
            expirationTimeSeconds: new utils_1.BigNumber(0),
            exchangeAddress: fakeExchangeContractAddress,
            chainId: fakeChainId,
        };
        transaction = {
            domain: {
                verifyingContract: fakeExchangeContractAddress,
                chainId: fakeChainId,
            },
            salt: src_1.generatePseudoRandomSalt(),
            signerAddress: makerAddress,
            data: '0x6927e990021d23b1eb7b8789f6a6feaf98fe104bb0cf8259421b79f9a34222b0',
            expirationTimeSeconds: new utils_1.BigNumber(0),
            gasPrice: new utils_1.BigNumber(0),
        };
    }));
    describe('#isValidECSignature', () => {
        const signature = {
            v: 27,
            r: '0xaca7da997ad177f040240cdccf6905b71ab16b74434388c3a72f34fd25d64393',
            s: '0x46b2bac274ff29b48b3ea6e2d04c1336eaceafda3c53ab483fc3ff12fac3ebf2',
        };
        const data = '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad';
        const address = '0x0e5cb767cce09a7f3ca594df118aa519be5e2b5a';
        it("should return false if the data doesn't pertain to the signature & address", () => __awaiter(this, void 0, void 0, function* () {
            expect(signature_utils_1.isValidECSignature('0x0', signature, address)).to.be.false();
        }));
        it("should return false if the address doesn't pertain to the signature & data", () => __awaiter(this, void 0, void 0, function* () {
            const validUnrelatedAddress = '0x8b0292b11a196601ed2ce54b665cafeca0347d42';
            expect(signature_utils_1.isValidECSignature(data, signature, validUnrelatedAddress)).to.be.false();
        }));
        it("should return false if the signature doesn't pertain to the data & address", () => __awaiter(this, void 0, void 0, function* () {
            const wrongSignature = _.assign({}, signature, { v: 28 });
            expect(signature_utils_1.isValidECSignature(data, wrongSignature, address)).to.be.false();
        }));
        it('should return true if the signature does pertain to the data & address', () => __awaiter(this, void 0, void 0, function* () {
            const isValidSignatureLocal = signature_utils_1.isValidECSignature(data, signature, address);
            expect(isValidSignatureLocal).to.be.true();
        }));
    });
    describe('#generateSalt', () => {
        it('generates different salts', () => {
            const isEqual = src_1.generatePseudoRandomSalt().eq(src_1.generatePseudoRandomSalt());
            expect(isEqual).to.be.false();
        });
        it('generates salt in range [0..2^256)', () => {
            const salt = src_1.generatePseudoRandomSalt();
            expect(salt.isGreaterThanOrEqualTo(0)).to.be.true();
            // tslint:disable-next-line:custom-no-magic-numbers
            const twoPow256 = new utils_1.BigNumber(2).pow(256);
            expect(salt.isLessThan(twoPow256)).to.be.true();
        });
    });
    describe('#parseValidatorSignature', () => {
        const ethSignSignature = '0x1c3582f06356a1314dbf1c0e534c4d8e92e59b056ee607a7ff5a825f5f2cc5e6151c5cc7fdd420f5608e4d5bef108e42ad90c7a4b408caef32e24374cf387b0d7603';
        const validatorAddress = '0x63ac26ad9477d6be19a5fabe394bcc4886057c53';
        const signature = `${ethSignSignature}${validatorAddress.substr(2)}05`;
        it('throws if signature type is not Validator type signature', () => {
            expect(signature_utils_1.signatureUtils.parseValidatorSignature.bind(null, ethSignSignature)).to.throw('Unexpected signatureType: 3. Valid signature types: 5');
        });
        it('extracts signature and validator address', () => {
            const validatorSignature = signature_utils_1.signatureUtils.parseValidatorSignature(signature);
            expect(validatorSignature.validatorAddress).to.equal(validatorAddress);
            expect(validatorSignature.signature).to.equal(ethSignSignature);
        });
    });
    describe('#ecSignOrderAsync', () => {
        it('should default to eth_sign if eth_signTypedData is unavailable', () => __awaiter(this, void 0, void 0, function* () {
            const expectedSignature = '0x1bea7883d76c4d8d0cd5915ec613f8dedf3b5f03e6a1f74aa171e700b0becdc8b47ade1ede08a5496ff31e34715bc6ac5da5aba709d3d8989a48127c18ef2f56d503';
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_signTypedData') {
                            callback(new Error('Internal RPC Error'));
                        }
                        else if (payload.method === 'eth_sign') {
                            const [address, message] = payload.params;
                            const signature = yield web3_wrapper_1.web3Wrapper.signMessageAsync(address, message);
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: signature,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            const signedOrder = yield signature_utils_1.signatureUtils.ecSignOrderAsync(fakeProvider, order, makerAddress);
            expect(signedOrder.signature).to.equal(expectedSignature);
        }));
        it('should throw if the user denies the signing request', () => __awaiter(this, void 0, void 0, function* () {
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_signTypedData') {
                            callback(new Error('User denied message signature'));
                        }
                        else if (payload.method === 'eth_sign') {
                            const [address, message] = payload.params;
                            const signature = yield web3_wrapper_1.web3Wrapper.signMessageAsync(address, message);
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: signature,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            expect(signature_utils_1.signatureUtils.ecSignOrderAsync(fakeProvider, order, makerAddress)).to.to.be.rejectedWith('User denied message signature');
        }));
    });
    describe('#ecSignTransactionAsync', () => {
        it('should default to eth_sign if eth_signTypedData is unavailable', () => __awaiter(this, void 0, void 0, function* () {
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_signTypedData') {
                            callback(new Error('Internal RPC Error'));
                        }
                        else if (payload.method === 'eth_sign') {
                            const [address, message] = payload.params;
                            const signature = yield web3_wrapper_1.web3Wrapper.signMessageAsync(address, message);
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: signature,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            const signedTransaction = yield signature_utils_1.signatureUtils.ecSignTransactionAsync(fakeProvider, transaction, makerAddress);
            assert_1.assert.isHexString('signedTransaction.signature', signedTransaction.signature);
        }));
        it('should throw if the user denies the signing request', () => __awaiter(this, void 0, void 0, function* () {
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_signTypedData') {
                            callback(new Error('User denied message signature'));
                        }
                        else if (payload.method === 'eth_sign') {
                            const [address, message] = payload.params;
                            const signature = yield web3_wrapper_1.web3Wrapper.signMessageAsync(address, message);
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: signature,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            expect(signature_utils_1.signatureUtils.ecSignTransactionAsync(fakeProvider, transaction, makerAddress)).to.to.be.rejectedWith('User denied message signature');
        }));
    });
    describe('#ecSignHashAsync', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            const availableAddreses = yield web3_wrapper_1.web3Wrapper.getAvailableAddressesAsync();
            makerAddress = availableAddreses[0];
        }));
        it('should return the correct Signature', () => __awaiter(this, void 0, void 0, function* () {
            const orderHash = '0x6927e990021d23b1eb7b8789f6a6feaf98fe104bb0cf8259421b79f9a34222b0';
            const expectedSignature = '0x1b61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc3340349190569279751135161d22529dc25add4f6069af05be04cacbda2ace225403';
            const ecSignature = yield signature_utils_1.signatureUtils.ecSignHashAsync(web3_wrapper_1.provider, orderHash, makerAddress);
            expect(ecSignature).to.equal(expectedSignature);
        }));
        it('should return the correct Signature for signatureHex concatenated as R + S + V', () => __awaiter(this, void 0, void 0, function* () {
            const orderHash = '0x34decbedc118904df65f379a175bb39ca18209d6ce41d5ed549d54e6e0a95004';
            const expectedSignature = '0x1b117902c86dfb95fe0d1badd983ee166ad259b27acb220174cbb4460d872871137feabdfe76e05924b484789f79af4ee7fa29ec006cedce1bbf369320d034e10b03';
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_sign') {
                            const [address, message] = payload.params;
                            expect(message).to.equal(orderHash);
                            const signature = yield web3_wrapper_1.web3Wrapper.signMessageAsync(address, message);
                            // tslint:disable-next-line:custom-no-magic-numbers
                            const rsvHex = `0x${signature.substr(130)}${signature.substr(2, 128)}`;
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: rsvHex,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            const ecSignature = yield signature_utils_1.signatureUtils.ecSignHashAsync(fakeProvider, orderHash, makerAddress);
            expect(ecSignature).to.equal(expectedSignature);
        }));
        it('should return the correct Signature for signatureHex concatenated as V + R + S', () => __awaiter(this, void 0, void 0, function* () {
            const orderHash = '0x34decbedc118904df65f379a175bb39ca18209d6ce41d5ed549d54e6e0a95004';
            const expectedSignature = '0x1b117902c86dfb95fe0d1badd983ee166ad259b27acb220174cbb4460d872871137feabdfe76e05924b484789f79af4ee7fa29ec006cedce1bbf369320d034e10b03';
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_sign') {
                            const [address, message] = payload.params;
                            const signature = yield web3_wrapper_1.web3Wrapper.signMessageAsync(address, message);
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: signature,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            const ecSignature = yield signature_utils_1.signatureUtils.ecSignHashAsync(fakeProvider, orderHash, makerAddress);
            expect(ecSignature).to.equal(expectedSignature);
        }));
        it('should return a valid signature', () => __awaiter(this, void 0, void 0, function* () {
            const expectedSignature = '0x1b117902c86dfb95fe0d1badd983ee166ad259b27acb220174cbb4460d872871137feabdfe76e05924b484789f79af4ee7fa29ec006cedce1bbf369320d034e10b03';
            const orderHash = '0x34decbedc118904df65f379a175bb39ca18209d6ce41d5ed549d54e6e0a95004';
            const ecSignature = yield signature_utils_1.signatureUtils.ecSignHashAsync(web3_wrapper_1.provider, orderHash, makerAddress);
            expect(ecSignature).to.equal(expectedSignature);
        }));
    });
    describe('#ecSignTypedDataOrderAsync', () => {
        it('should result in the same signature as signing the order hash without an ethereum message prefix', () => __awaiter(this, void 0, void 0, function* () {
            // Note: Since order hash is an EIP712 hash the result of a valid EIP712 signature
            //       of order hash is the same as signing the order without the Ethereum Message prefix.
            const orderHashHex = order_hash_utils_1.orderHashUtils.getOrderHash(order);
            const sig = ethUtil.ecsign(ethUtil.toBuffer(orderHashHex), Buffer.from('F2F48EE19680706196E2E339E5DA3491186E0C4C5030670656B0E0164837257D', 'hex'));
            const signatureBuffer = Buffer.concat([
                ethUtil.toBuffer(sig.v),
                ethUtil.toBuffer(sig.r),
                ethUtil.toBuffer(sig.s),
                ethUtil.toBuffer(types_1.SignatureType.EIP712),
            ]);
            const signatureHex = `0x${signatureBuffer.toString('hex')}`;
            const signedOrder = yield signature_utils_1.signatureUtils.ecSignTypedDataOrderAsync(web3_wrapper_1.provider, order, makerAddress);
            expect(signatureHex).to.eq(signedOrder.signature);
        }));
        it('should return the correct signature for signatureHex concatenated as R + S + V', () => __awaiter(this, void 0, void 0, function* () {
            const expectedSignature = '0x1b65b7b6205a4511cc81ec8f1b3eb475b398d60985089a3041c74735109f207e99542c7f0f81b0a988317e89b8280ec72829c8532a04c376f1f1236589c911545002';
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_signTypedData') {
                            const [address, typedData] = payload.params;
                            const signature = yield web3_wrapper_1.web3Wrapper.signTypedDataAsync(address, typedData);
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: signature,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            const signedOrder = yield signature_utils_1.signatureUtils.ecSignTypedDataOrderAsync(fakeProvider, order, makerAddress);
            expect(signedOrder.signature).to.equal(expectedSignature);
        }));
    });
    describe('#ecSignTypedDataTransactionAsync', () => {
        it('should result in the same signature as signing the order hash without an ethereum message prefix', () => __awaiter(this, void 0, void 0, function* () {
            // Note: Since order hash is an EIP712 hash the result of a valid EIP712 signature
            //       of order hash is the same as signing the order without the Ethereum Message prefix.
            const transactionHashHex = transaction_hash_utils_1.transactionHashUtils.getTransactionHash(transaction);
            const sig = ethUtil.ecsign(ethUtil.toBuffer(transactionHashHex), Buffer.from('F2F48EE19680706196E2E339E5DA3491186E0C4C5030670656B0E0164837257D', 'hex'));
            const signatureBuffer = Buffer.concat([
                ethUtil.toBuffer(sig.v),
                ethUtil.toBuffer(sig.r),
                ethUtil.toBuffer(sig.s),
                ethUtil.toBuffer(types_1.SignatureType.EIP712),
            ]);
            const signatureHex = `0x${signatureBuffer.toString('hex')}`;
            const signedTransaction = yield signature_utils_1.signatureUtils.ecSignTypedDataTransactionAsync(web3_wrapper_1.provider, transaction, makerAddress);
            expect(signatureHex).to.eq(signedTransaction.signature);
        }));
        it('should return the correct Signature for signatureHex concatenated as R + S + V', () => __awaiter(this, void 0, void 0, function* () {
            const fakeProvider = {
                sendAsync(payload, callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (payload.method === 'eth_signTypedData') {
                            const [address, typedData] = payload.params;
                            const signature = yield web3_wrapper_1.web3Wrapper.signTypedDataAsync(address, typedData);
                            callback(null, {
                                id: 42,
                                jsonrpc: '2.0',
                                result: signature,
                            });
                        }
                        else {
                            callback(null, { id: 42, jsonrpc: '2.0', result: [makerAddress] });
                        }
                    });
                },
            };
            const signedTransaction = yield signature_utils_1.signatureUtils.ecSignTypedDataTransactionAsync(fakeProvider, transaction, makerAddress);
            assert_1.assert.isHexString('signedTransaction.signature', signedTransaction.signature);
        }));
    });
    describe('#convertECSignatureToSignatureHex', () => {
        const ecSignature = {
            v: 27,
            r: '0xaca7da997ad177f040240cdccf6905b71ab16b74434388c3a72f34fd25d64393',
            s: '0x46b2bac274ff29b48b3ea6e2d04c1336eaceafda3c53ab483fc3ff12fac3ebf2',
        };
        it('should concatenate v,r,s and append the EthSign signature type', () => __awaiter(this, void 0, void 0, function* () {
            const expectedSignatureWithSignatureType = '0x1baca7da997ad177f040240cdccf6905b71ab16b74434388c3a72f34fd25d6439346b2bac274ff29b48b3ea6e2d04c1336eaceafda3c53ab483fc3ff12fac3ebf203';
            const signatureWithSignatureType = signature_utils_1.signatureUtils.convertECSignatureToSignatureHex(ecSignature);
            expect(signatureWithSignatureType).to.equal(expectedSignatureWithSignatureType);
        }));
    });
});
//# sourceMappingURL=signature_utils_test.js.map