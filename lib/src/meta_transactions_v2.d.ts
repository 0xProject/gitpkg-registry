import { EIP712TypedData } from '@0x/types';
import { BigNumber } from '@0x/utils';
export interface MetaTransactionV2Fee {
    recipient: string;
    amount: BigNumber;
}
declare const MTX_DEFAULT_VALUES: {
    signer: string;
    sender: string;
    expirationTimeSeconds: BigNumber;
    salt: BigNumber;
    callData: string;
    feeToken: string;
    fees: MetaTransactionV2Fee[];
    chainId: number;
    verifyingContract: string;
};
export declare type MetaTransactionV2Fields = typeof MTX_DEFAULT_VALUES;
export declare class MetaTransactionV2 {
    static readonly FEE_STRUCT_NAME = "MetaTransactionFeeData";
    static readonly FEE_STRUCT_ABI: {
        type: string;
        name: string;
    }[];
    static readonly FEE_TYPE_HASH: string;
    static readonly MTX_STRUCT_NAME = "MetaTransactionDataV2";
    static readonly MTX_STRUCT_ABI: {
        type: string;
        name: string;
    }[];
    static readonly MTX_TYPE_HASH: string;
    signer: string;
    sender: string;
    expirationTimeSeconds: BigNumber;
    salt: BigNumber;
    callData: string;
    feeToken: string;
    fees: MetaTransactionV2Fee[];
    chainId: number;
    verifyingContract: string;
    constructor(fields?: Partial<MetaTransactionV2Fields>);
    clone(fields?: Partial<MetaTransactionV2Fields>): MetaTransactionV2;
    getStructHash(): string;
    getEIP712TypedData(): EIP712TypedData;
    getHash(): string;
}
export {};
//# sourceMappingURL=meta_transactions_v2.d.ts.map