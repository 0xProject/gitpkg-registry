"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaTransactionV2 = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const constants_1 = require("./constants");
const eip712_utils_1 = require("./eip712_utils");
const MTX_DEFAULT_VALUES = {
    signer: utils_1.NULL_ADDRESS,
    sender: utils_1.NULL_ADDRESS,
    expirationTimeSeconds: constants_1.ZERO,
    salt: constants_1.ZERO,
    callData: utils_1.hexUtils.leftPad(0),
    feeToken: utils_1.NULL_ADDRESS,
    fees: [],
    chainId: 1,
    verifyingContract: (0, contract_addresses_1.getContractAddressesForChainOrThrow)(1).exchangeProxy,
};
class MetaTransactionV2 {
    constructor(fields = {}) {
        const _fields = Object.assign(Object.assign({}, MTX_DEFAULT_VALUES), fields);
        this.signer = _fields.signer;
        this.sender = _fields.sender;
        this.expirationTimeSeconds = _fields.expirationTimeSeconds;
        this.salt = _fields.salt;
        this.callData = _fields.callData;
        this.feeToken = _fields.feeToken;
        this.fees = _fields.fees;
        this.chainId = _fields.chainId;
        this.verifyingContract = _fields.verifyingContract;
    }
    clone(fields = {}) {
        return new MetaTransactionV2(Object.assign({ signer: this.signer, sender: this.sender, expirationTimeSeconds: this.expirationTimeSeconds, salt: this.salt, callData: this.callData, feeToken: this.feeToken, fees: this.fees, chainId: this.chainId, verifyingContract: this.verifyingContract }, fields));
    }
    getStructHash() {
        const feesHash = utils_1.hexUtils.hash(utils_1.hexUtils.concat(...this.fees.map((fee) => utils_1.hexUtils.hash(utils_1.hexUtils.concat(utils_1.hexUtils.leftPad(MetaTransactionV2.FEE_TYPE_HASH), utils_1.hexUtils.leftPad(fee.recipient), utils_1.hexUtils.leftPad(fee.amount))))));
        return utils_1.hexUtils.hash(utils_1.hexUtils.concat(utils_1.hexUtils.leftPad(MetaTransactionV2.MTX_TYPE_HASH), utils_1.hexUtils.leftPad(this.signer), utils_1.hexUtils.leftPad(this.sender), utils_1.hexUtils.leftPad(this.expirationTimeSeconds), utils_1.hexUtils.leftPad(this.salt), utils_1.hexUtils.hash(this.callData), utils_1.hexUtils.leftPad(this.feeToken), utils_1.hexUtils.leftPad(feesHash)));
    }
    getEIP712TypedData() {
        return {
            types: {
                EIP712Domain: eip712_utils_1.EIP712_DOMAIN_PARAMETERS,
                [MetaTransactionV2.MTX_STRUCT_NAME]: MetaTransactionV2.MTX_STRUCT_ABI,
                [MetaTransactionV2.FEE_STRUCT_NAME]: MetaTransactionV2.FEE_STRUCT_ABI,
            },
            domain: (0, eip712_utils_1.createExchangeProxyEIP712Domain)(this.chainId, this.verifyingContract),
            primaryType: MetaTransactionV2.MTX_STRUCT_NAME,
            message: {
                signer: this.signer,
                sender: this.sender,
                expirationTimeSeconds: this.expirationTimeSeconds.toString(10),
                salt: this.salt.toString(10),
                callData: this.callData,
                feeToken: this.feeToken,
                fees: this.fees.map(({ recipient, amount }) => ({
                    recipient,
                    amount: amount.toString(10),
                })),
            },
        };
    }
    getHash() {
        return (0, eip712_utils_1.getExchangeProxyEIP712Hash)(this.getStructHash(), this.chainId, this.verifyingContract);
    }
}
exports.MetaTransactionV2 = MetaTransactionV2;
MetaTransactionV2.FEE_STRUCT_NAME = 'MetaTransactionFeeData';
MetaTransactionV2.FEE_STRUCT_ABI = [
    { type: 'address', name: 'recipient' },
    { type: 'uint256', name: 'amount' },
];
MetaTransactionV2.FEE_TYPE_HASH = (0, eip712_utils_1.getTypeHash)(MetaTransactionV2.FEE_STRUCT_NAME, MetaTransactionV2.FEE_STRUCT_ABI);
MetaTransactionV2.MTX_STRUCT_NAME = 'MetaTransactionDataV2';
MetaTransactionV2.MTX_STRUCT_ABI = [
    { type: 'address', name: 'signer' },
    { type: 'address', name: 'sender' },
    { type: 'uint256', name: 'expirationTimeSeconds' },
    { type: 'uint256', name: 'salt' },
    { type: 'bytes', name: 'callData' },
    { type: 'address', name: 'feeToken' },
    { type: `${MetaTransactionV2.FEE_STRUCT_NAME}[]`, name: 'fees' },
];
MetaTransactionV2.MTX_TYPE_HASH = (0, eip712_utils_1.getTypeHash)(MetaTransactionV2.MTX_STRUCT_NAME, MetaTransactionV2.MTX_STRUCT_ABI, { [MetaTransactionV2.FEE_STRUCT_NAME]: MetaTransactionV2.FEE_STRUCT_ABI });
//# sourceMappingURL=meta_transactions_v2.js.map