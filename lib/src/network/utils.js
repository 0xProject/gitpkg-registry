"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeCallResult = exports.encodeCall = exports.ethCallAsync = exports.mergeCallOpts = exports.ContractHelper = exports.createContractWrapperAndHelper = exports.valueByChainId = exports.getDeterministicContractAddressFromArtifact = exports.getBytecodeFromArtifact = exports.getDeterministicContractAddressFromBytecode = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
const utils_1 = require("@0x/utils");
const fast_abi_1 = require("fast-abi");
const artifacts_1 = require("../artifacts");
const constants_1 = require("./constants");
const ADDRESS_SIZE = 20;
function getDeterministicContractAddressFromBytecode(bytecode) {
    return utils_1.hexUtils.leftPad(utils_1.hexUtils.hash(bytecode), ADDRESS_SIZE);
}
exports.getDeterministicContractAddressFromBytecode = getDeterministicContractAddressFromBytecode;
function getBytecodeFromArtifact(artifact) {
    return artifact.compilerOutput.evm.deployedBytecode.object;
}
exports.getBytecodeFromArtifact = getBytecodeFromArtifact;
function getDeterministicContractAddressFromArtifact(artifact) {
    return getDeterministicContractAddressFromBytecode(getBytecodeFromArtifact(artifact));
}
exports.getDeterministicContractAddressFromArtifact = getDeterministicContractAddressFromArtifact;
// TODO(kimpers): Consolidate this implementation with the one in @0x/token-metadata
function valueByChainId(rest, defaultValue) {
    // TODO I don't like this but iterating through enums is weird
    return Object.assign({ [contract_addresses_1.ChainId.Mainnet]: defaultValue, [contract_addresses_1.ChainId.Ropsten]: defaultValue, [contract_addresses_1.ChainId.Rinkeby]: defaultValue, [contract_addresses_1.ChainId.Kovan]: defaultValue, [contract_addresses_1.ChainId.Ganache]: defaultValue, [contract_addresses_1.ChainId.BSC]: defaultValue, [contract_addresses_1.ChainId.Polygon]: defaultValue, [contract_addresses_1.ChainId.PolygonMumbai]: defaultValue }, (rest || {}));
}
exports.valueByChainId = valueByChainId;
/**
 * Use this function to create a contract wrapper instance and its equivalent
 * helper (see below) . If no address is provided, the contract is assumed to be
 * undeployed and the helper will use overrides to provide the bytecode during
 * execution. For undeployed contracts, a deterministic address will be used to
 * prevent uploading the same contract twice.
 */
function createContractWrapperAndHelper(chain, contractType, artifactName, address) {
    const fastAbi = new fast_abi_1.FastABI(contractType.ABI(), { BigNumber: utils_1.BigNumber });
    const artifact = artifacts_1.artifacts[artifactName];
    const wrapper = new contractType(address || getDeterministicContractAddressFromArtifact(artifact), constants_1.DUMMY_PROVIDER, {}, {}, !address ? artifact.compilerOutput.evm.deployedBytecode.object : undefined, {
        encodeInput: (fnName, values) => fastAbi.encodeInput(fnName, values),
        decodeOutput: (fnName, data) => fastAbi.decodeOutput(fnName, data),
    });
    return [wrapper, new ContractHelper(chain, wrapper)];
}
exports.createContractWrapperAndHelper = createContractWrapperAndHelper;
/**
 * This class is the preferred method for interaction with contract wrappers to
 * exploit automatic call batching. The methods here ensure the proper overrides
 * are included in the `eth_call` operation. Do not call `callAsync()` directly on a wrapper.
 * Instead, use `ethCallAsync()` here. You need a ContractHelper per contract.
 * The `createContractWrapperAndHelper()` function will create both in a single step.
 */
class ContractHelper {
    constructor(chain, contract) {
        this.chain = chain;
        this.contract = contract;
        this._defaultEthCallOpts = Object.assign({ to: contract.address }, (contract._deployedBytecodeIfExists
            ? {
                overrides: {
                    [contract.address]: {
                        code: utils_1.hexUtils.toHex(contract._deployedBytecodeIfExists),
                    },
                },
            }
            : {}));
    }
    ethCallAsync(fn, args, callOpts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultData = yield this.chain.ethCallAsync(this.encodeCall(fn, args, callOpts));
            return this.decodeCallResult(fn, resultData);
        });
    }
    encodeCall(fn, args, callOpts = {}) {
        return encodeCall(this.contract, fn, args, mergeCallOpts(this._defaultEthCallOpts, callOpts));
    }
    decodeCallResult(fn, resultData) {
        return decodeCallResult(this.contract, fn, resultData);
    }
    createMultiHopCallInfo(fn, args, resultHandler, callOpts = {}) {
        const c = this.encodeCall(fn, args, callOpts);
        return {
            quoterData: c.data,
            quoterTarget: c.to,
            overrides: c.overrides || {},
            resultHandler: resultData => resultHandler(this.decodeCallResult(fn, resultData)),
        };
    }
}
exports.ContractHelper = ContractHelper;
function mergeCallOpts(...callOpts) {
    return Object.assign({}, ...callOpts, 
    // Mege overrides separately.
    {
        overrides: Object.assign({}, ...callOpts.map(o => o.overrides || {})),
    });
}
exports.mergeCallOpts = mergeCallOpts;
function ethCallAsync(chain, contract, fn, args, callOpts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultData = yield chain.ethCallAsync(encodeCall(contract, fn, args, callOpts));
        return decodeCallResult(contract, fn, resultData);
    });
}
exports.ethCallAsync = ethCallAsync;
function encodeCall(contract, fn, args, callOpts = {}) {
    return Object.assign({ to: contract.address, data: fn.apply(contract, args).getABIEncodedTransactionData() }, callOpts);
}
exports.encodeCall = encodeCall;
function decodeCallResult(contract, fn, resultData) {
    try {
        return contract.getABIDecodedReturnData(fn.name, resultData);
    }
    catch (err) {
        throw new Error(`eth_call to ${fn.name}() returned unexpected bytes: ${resultData}`);
    }
}
exports.decodeCallResult = decodeCallResult;
//# sourceMappingURL=utils.js.map