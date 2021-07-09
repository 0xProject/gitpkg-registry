import { BaseContract, ContractFunctionObj } from '@0x/base-contract';
import { ChainId } from '@0x/contract-addresses';
import { ContractAbi, ContractVersionData, MethodAbi, SupportedProvider } from 'ethereum-types';
import { Chain, ChainEthCallOpts } from './chain';
import { Address, Bytes, DexSample, MultiHopCallInfo } from './types';
export interface ContractWrapperType<T> {
    contractName: string;
    new (address: Address, provider: SupportedProvider, _txDefaults: {}, _logDeps: {}, deployedBytecode: Bytes | undefined, encoderOverrides: {
        encodeInput: (fnName: string, values: any) => Bytes;
        decodeOutput: (fnName: string, data: Bytes) => any;
    }): T;
    ABI(): ContractAbi | MethodAbi[];
}
export declare function getDeterministicContractAddressFromBytecode(bytecode: Bytes): Address;
export declare function getBytecodeFromArtifact(artifact: ContractVersionData): Bytes;
export declare function getDeterministicContractAddressFromArtifact(artifact: ContractVersionData): Address;
export interface GeneratedContract extends BaseContract {
    getABIDecodedReturnData: <T>(methodName: string, returnData: string) => T;
}
export declare type ContractFunction<TArgs extends any[], TReturn> = (...args: TArgs) => ContractFunctionObj<TReturn>;
export declare type ValueByChainId<T> = {
    [k in ChainId]: T;
};
export declare function valueByChainId<T>(rest: Partial<ValueByChainId<T>>, defaultValue: T): {
    [key in ChainId]: T;
};
/**
 * Use this function to create a contract wrapper instance and its equivalent
 * helper (see below) . If no address is provided, the contract is assumed to be
 * undeployed and the helper will use overrides to provide the bytecode during
 * execution. For undeployed contracts, a deterministic address will be used to
 * prevent uploading the same contract twice.
 */
export declare function createContractWrapperAndHelper<TContract extends GeneratedContract>(chain: Chain, contractType: ContractWrapperType<TContract>, artifactName: string, address?: Address): [TContract, ContractHelper<TContract>];
export declare type UnwrapContractFunctionReturnType<T> = T extends ContractFunctionObj<infer U> ? U : never;
/**
 * This class is the preferred method for interaction with contract wrappers to
 * exploit automatic call batching. The methods here ensure the proper overrides
 * are included in the `eth_call` operation. Do not call `callAsync()` directly on a wrapper.
 * Instead, use `ethCallAsync()` here. You need a ContractHelper per contract.
 * The `createContractWrapperAndHelper()` function will create both in a single step.
 */
export declare class ContractHelper<TBaseContract extends GeneratedContract> {
    readonly chain: Chain;
    readonly contract: TBaseContract;
    private readonly _defaultEthCallOpts;
    constructor(chain: Chain, contract: TBaseContract);
    ethCallAsync<TContractFunction extends ContractFunction<TParams, TReturn>, TParams extends any[] = Parameters<TContractFunction>, TReturn = UnwrapContractFunctionReturnType<ReturnType<TContractFunction>>>(fn: TContractFunction, args: Parameters<TContractFunction>, callOpts?: Partial<ChainEthCallOpts>): Promise<TReturn>;
    encodeCall<TArgs extends any[], TReturn>(fn: ContractFunction<TArgs, TReturn>, args: TArgs, callOpts?: Partial<ChainEthCallOpts>): ChainEthCallOpts;
    decodeCallResult<TArgs extends any[], TReturn>(fn: ContractFunction<TArgs, TReturn>, resultData: Bytes): TReturn;
    createMultiHopCallInfo<TArgs extends any[], TReturn, TFillData>(fn: ContractFunction<TArgs, TReturn>, args: TArgs, resultHandler: (result: TReturn) => DexSample<TFillData>, callOpts?: Partial<ChainEthCallOpts>): MultiHopCallInfo;
}
export declare function mergeCallOpts(...callOpts: Array<Partial<ChainEthCallOpts>>): Partial<ChainEthCallOpts>;
export declare function ethCallAsync<TArgs extends any[], TReturn>(chain: Chain, contract: GeneratedContract, fn: ContractFunction<TArgs, TReturn>, args: TArgs, callOpts?: Partial<ChainEthCallOpts>): Promise<TReturn>;
export declare function encodeCall<TArgs extends any[], TReturn>(contract: GeneratedContract, fn: ContractFunction<TArgs, TReturn>, args: TArgs, callOpts?: Partial<ChainEthCallOpts>): ChainEthCallOpts;
export declare function decodeCallResult<TArgs extends any[], TReturn>(contract: GeneratedContract, fn: ContractFunction<TArgs, TReturn>, resultData: Bytes): TReturn;
//# sourceMappingURL=utils.d.ts.map