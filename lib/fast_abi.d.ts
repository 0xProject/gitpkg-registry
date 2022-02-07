import { MethodAbi } from 'ethereum-types';
interface Opts {
    BigNumber: any;
}
export declare class FastABI {
    private readonly _coder;
    private readonly _abi;
    private readonly _opts;
    constructor(abi: MethodAbi[], opts?: Opts);
    encodeInput(fnName: string, values: any[]): string;
    decodeInput(fnName: string, output: string): any;
    decodeOutput(fnName: string, output: string): any;
    private _deserializeResultIn;
    private _deserializeResultsIn;
    private _serializeArgsOut;
    private _serializeArgOut;
}
export {};
//# sourceMappingURL=fast_abi.d.ts.map