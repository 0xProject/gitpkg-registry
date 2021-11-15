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
exports.ERC20BridgeSamplerContract = void 0;
// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
const base_contract_1 = require("@0x/base-contract");
const json_schemas_1 = require("@0x/json-schemas");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const assert_1 = require("@0x/assert");
const ethers = require("ethers");
// tslint:enable:no-unused-variable
/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
class ERC20BridgeSamplerContract extends base_contract_1.BaseContract {
    constructor(address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode = ERC20BridgeSamplerContract.deployedBytecode, encoderOverrides) {
        super('ERC20BridgeSampler', ERC20BridgeSamplerContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode, encoderOverrides);
        this._methodABIIndex = {};
        utils_1.classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
        ERC20BridgeSamplerContract.ABI().forEach((item, index) => {
            if (item.type === 'function') {
                const methodAbi = item;
                this._methodABIIndex[methodAbi.name] = index;
            }
        });
    }
    static deployFrom0xArtifactAsync(artifact, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema);
            if (artifact.compilerOutput === undefined) {
                throw new Error('Compiler output not found in the artifact file');
            }
            const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
            const bytecode = artifact.compilerOutput.evm.bytecode.object;
            const abi = artifact.compilerOutput.abi;
            const logDecodeDependenciesAbiOnly = {};
            if (Object.keys(logDecodeDependencies) !== undefined) {
                for (const key of Object.keys(logDecodeDependencies)) {
                    logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
                }
            }
            return ERC20BridgeSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly);
        });
    }
    static deployWithLibrariesFrom0xArtifactAsync(artifact, libraryArtifacts, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema);
            if (artifact.compilerOutput === undefined) {
                throw new Error('Compiler output not found in the artifact file');
            }
            const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
            const abi = artifact.compilerOutput.abi;
            const logDecodeDependenciesAbiOnly = {};
            if (Object.keys(logDecodeDependencies) !== undefined) {
                for (const key of Object.keys(logDecodeDependencies)) {
                    logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
                }
            }
            const libraryAddresses = yield ERC20BridgeSamplerContract._deployLibrariesAsync(artifact, libraryArtifacts, new web3_wrapper_1.Web3Wrapper(provider), txDefaults);
            const bytecode = base_contract_1.linkLibrariesInBytecode(artifact, libraryAddresses);
            return ERC20BridgeSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly);
        });
    }
    static deployAsync(bytecode, abi, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isHexString('bytecode', bytecode);
            assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema);
            const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
            const constructorAbi = base_contract_1.BaseContract._lookupConstructorAbi(abi);
            [] = base_contract_1.BaseContract._formatABIDataItemList(constructorAbi.inputs, [], base_contract_1.BaseContract._bigNumberToString);
            const iface = new ethers.utils.Interface(abi);
            const deployInfo = iface.deployFunction;
            const txData = deployInfo.encode(bytecode, []);
            const web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
            const txDataWithDefaults = yield base_contract_1.BaseContract._applyDefaultsToContractTxDataAsync(Object.assign({ data: txData }, txDefaults), web3Wrapper.estimateGasAsync.bind(web3Wrapper));
            const txHash = yield web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            utils_1.logUtils.log(`transactionHash: ${txHash}`);
            const txReceipt = yield web3Wrapper.awaitTransactionSuccessAsync(txHash);
            utils_1.logUtils.log(`ERC20BridgeSampler successfully deployed at ${txReceipt.contractAddress}`);
            const contractInstance = new ERC20BridgeSamplerContract(txReceipt.contractAddress, provider, txDefaults, logDecodeDependencies);
            contractInstance.constructorArgs = [];
            return contractInstance;
        });
    }
    /**
     * @returns      The contract ABI
     */
    static ABI() {
        const abi = [
            {
                inputs: [
                    {
                        name: 'callDatas',
                        type: 'bytes[]',
                    },
                ],
                name: 'batchCall',
                outputs: [
                    {
                        name: 'callResults',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'data',
                                type: 'bytes',
                            },
                            {
                                name: 'success',
                                type: 'bool',
                            },
                        ],
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'reserveOffset',
                                type: 'uint256',
                            },
                            {
                                name: 'hintHandler',
                                type: 'address',
                            },
                            {
                                name: 'networkProxy',
                                type: 'address',
                            },
                            {
                                name: 'weth',
                                type: 'address',
                            },
                            {
                                name: 'hint',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'reserveId',
                        type: 'bytes32',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                ],
                name: 'encodeKyberHint',
                outputs: [
                    {
                        name: 'hint',
                        type: 'bytes',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                    {
                        name: 'account',
                        type: 'address',
                    },
                    {
                        name: 'spender',
                        type: 'address',
                    },
                ],
                name: 'getAllowanceOf',
                outputs: [
                    {
                        name: 'allowances',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'getBalanceOf',
                outputs: [
                    {
                        name: 'balances',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'orders',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'makerToken',
                                type: 'address',
                            },
                            {
                                name: 'takerToken',
                                type: 'address',
                            },
                            {
                                name: 'makerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerTokenFeeAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'maker',
                                type: 'address',
                            },
                            {
                                name: 'taker',
                                type: 'address',
                            },
                            {
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipient',
                                type: 'address',
                            },
                            {
                                name: 'pool',
                                type: 'bytes32',
                            },
                            {
                                name: 'expiry',
                                type: 'uint64',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                        ],
                    },
                    {
                        name: 'orderSignatures',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'signatureType',
                                type: 'uint8',
                            },
                            {
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                name: 's',
                                type: 'bytes32',
                            },
                        ],
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getLimitOrderFillableMakerAssetAmounts',
                outputs: [
                    {
                        name: 'orderFillableMakerAssetAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'order',
                        type: 'tuple',
                        components: [
                            {
                                name: 'makerToken',
                                type: 'address',
                            },
                            {
                                name: 'takerToken',
                                type: 'address',
                            },
                            {
                                name: 'makerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerTokenFeeAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'maker',
                                type: 'address',
                            },
                            {
                                name: 'taker',
                                type: 'address',
                            },
                            {
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipient',
                                type: 'address',
                            },
                            {
                                name: 'pool',
                                type: 'bytes32',
                            },
                            {
                                name: 'expiry',
                                type: 'uint64',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                        ],
                    },
                    {
                        name: 'signature',
                        type: 'tuple',
                        components: [
                            {
                                name: 'signatureType',
                                type: 'uint8',
                            },
                            {
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                name: 's',
                                type: 'bytes32',
                            },
                        ],
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getLimitOrderFillableTakerAmount',
                outputs: [
                    {
                        name: 'fillableTakerAmount',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'orders',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'makerToken',
                                type: 'address',
                            },
                            {
                                name: 'takerToken',
                                type: 'address',
                            },
                            {
                                name: 'makerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerTokenFeeAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'maker',
                                type: 'address',
                            },
                            {
                                name: 'taker',
                                type: 'address',
                            },
                            {
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipient',
                                type: 'address',
                            },
                            {
                                name: 'pool',
                                type: 'bytes32',
                            },
                            {
                                name: 'expiry',
                                type: 'uint64',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                        ],
                    },
                    {
                        name: 'orderSignatures',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'signatureType',
                                type: 'uint8',
                            },
                            {
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                name: 's',
                                type: 'bytes32',
                            },
                        ],
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getLimitOrderFillableTakerAssetAmounts',
                outputs: [
                    {
                        name: 'orderFillableTakerAssetAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                ],
                name: 'getTokenDecimals',
                outputs: [
                    {
                        name: 'decimals',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'isContract',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'poolAddress',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromBalancer',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'poolInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'poolId',
                                type: 'bytes32',
                            },
                            {
                                name: 'vault',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromBalancerV2',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'registry',
                                type: 'address',
                            },
                            {
                                name: 'paths',
                                type: 'address[][]',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromBancor',
                outputs: [
                    {
                        name: 'bancorNetwork',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'curveInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'poolAddress',
                                type: 'address',
                            },
                            {
                                name: 'sellQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                            {
                                name: 'buyQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                        ],
                    },
                    {
                        name: 'fromTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'toTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromCurve',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'registry',
                                type: 'address',
                            },
                            {
                                name: 'helper',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromDODO',
                outputs: [
                    {
                        name: 'sellBase',
                        type: 'bool',
                    },
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'registry',
                        type: 'address',
                    },
                    {
                        name: 'offset',
                        type: 'uint256',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromDODOV2',
                outputs: [
                    {
                        name: 'sellBase',
                        type: 'bool',
                    },
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromKyberDmm',
                outputs: [
                    {
                        name: 'pools',
                        type: 'address[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'reserveOffset',
                                type: 'uint256',
                            },
                            {
                                name: 'hintHandler',
                                type: 'address',
                            },
                            {
                                name: 'networkProxy',
                                type: 'address',
                            },
                            {
                                name: 'weth',
                                type: 'address',
                            },
                            {
                                name: 'hint',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromKyberNetwork',
                outputs: [
                    {
                        name: 'reserveId',
                        type: 'bytes32',
                    },
                    {
                        name: 'hint',
                        type: 'bytes',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'lidoInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'stEthToken',
                                type: 'address',
                            },
                            {
                                name: 'wethToken',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromLido',
                outputs: [
                    {
                        name: '',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'pure',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'providerAddress',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromLiquidityProvider',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromMStable',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'psmInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'psmAddress',
                                type: 'address',
                            },
                            {
                                name: 'ilkIdentifier',
                                type: 'bytes32',
                            },
                            {
                                name: 'gemTokenAddress',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromMakerPsm',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'registry',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromMooniswap',
                outputs: [
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromShell',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'smoothyInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'poolAddress',
                                type: 'address',
                            },
                            {
                                name: 'sellQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                            {
                                name: 'buyQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                        ],
                    },
                    {
                        name: 'fromTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'toTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromSmoothy',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromUniswap',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromUniswapV2',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'quoter',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromUniswapV3',
                outputs: [
                    {
                        name: 'uniswapPaths',
                        type: 'bytes[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'reserveOffset',
                                type: 'uint256',
                            },
                            {
                                name: 'hintHandler',
                                type: 'address',
                            },
                            {
                                name: 'networkProxy',
                                type: 'address',
                            },
                            {
                                name: 'weth',
                                type: 'address',
                            },
                            {
                                name: 'hint',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmount',
                        type: 'uint256',
                    },
                ],
                name: 'sampleSellFromKyberNetwork',
                outputs: [
                    {
                        name: 'makerTokenAmount',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'poolAddress',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromBalancer',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'poolInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'poolId',
                                type: 'bytes32',
                            },
                            {
                                name: 'vault',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromBalancerV2',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'registry',
                                type: 'address',
                            },
                            {
                                name: 'paths',
                                type: 'address[][]',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromBancor',
                outputs: [
                    {
                        name: 'bancorNetwork',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'curveInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'poolAddress',
                                type: 'address',
                            },
                            {
                                name: 'sellQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                            {
                                name: 'buyQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                        ],
                    },
                    {
                        name: 'fromTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'toTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromCurve',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'registry',
                                type: 'address',
                            },
                            {
                                name: 'helper',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromDODO',
                outputs: [
                    {
                        name: 'sellBase',
                        type: 'bool',
                    },
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'registry',
                        type: 'address',
                    },
                    {
                        name: 'offset',
                        type: 'uint256',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromDODOV2',
                outputs: [
                    {
                        name: 'sellBase',
                        type: 'bool',
                    },
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromKyberDmm',
                outputs: [
                    {
                        name: 'pools',
                        type: 'address[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'opts',
                        type: 'tuple',
                        components: [
                            {
                                name: 'reserveOffset',
                                type: 'uint256',
                            },
                            {
                                name: 'hintHandler',
                                type: 'address',
                            },
                            {
                                name: 'networkProxy',
                                type: 'address',
                            },
                            {
                                name: 'weth',
                                type: 'address',
                            },
                            {
                                name: 'hint',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromKyberNetwork',
                outputs: [
                    {
                        name: 'reserveId',
                        type: 'bytes32',
                    },
                    {
                        name: 'hint',
                        type: 'bytes',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'lidoInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'stEthToken',
                                type: 'address',
                            },
                            {
                                name: 'wethToken',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromLido',
                outputs: [
                    {
                        name: '',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'pure',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'providerAddress',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromLiquidityProvider',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromMStable',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'psmInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'psmAddress',
                                type: 'address',
                            },
                            {
                                name: 'ilkIdentifier',
                                type: 'bytes32',
                            },
                            {
                                name: 'gemTokenAddress',
                                type: 'address',
                            },
                        ],
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromMakerPsm',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'registry',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromMooniswap',
                outputs: [
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'multibridge',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'intermediateToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromMultiBridge',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'pool',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromShell',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'smoothyInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'poolAddress',
                                type: 'address',
                            },
                            {
                                name: 'sellQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                            {
                                name: 'buyQuoteFunctionSelector',
                                type: 'bytes4',
                            },
                        ],
                    },
                    {
                        name: 'fromTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'toTokenIdx',
                        type: 'int128',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromSmoothy',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromUniswap',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'router',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromUniswapV2',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'quoter',
                        type: 'address',
                    },
                    {
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromUniswapV3',
                outputs: [
                    {
                        name: 'uniswapPaths',
                        type: 'bytes[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'registry',
                        type: 'address',
                    },
                    {
                        name: 'mooniswapTakerToken',
                        type: 'address',
                    },
                    {
                        name: 'mooniswapMakerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmount',
                        type: 'uint256',
                    },
                ],
                name: 'sampleSingleSellFromMooniswapPool',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'firstHopCalls',
                        type: 'bytes[]',
                    },
                    {
                        name: 'secondHopCalls',
                        type: 'bytes[]',
                    },
                    {
                        name: 'buyAmount',
                        type: 'uint256',
                    },
                ],
                name: 'sampleTwoHopBuy',
                outputs: [
                    {
                        name: 'firstHop',
                        type: 'tuple',
                        components: [
                            {
                                name: 'sourceIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'returnData',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'secondHop',
                        type: 'tuple',
                        components: [
                            {
                                name: 'sourceIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'returnData',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'sellAmount',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        name: 'firstHopCalls',
                        type: 'bytes[]',
                    },
                    {
                        name: 'secondHopCalls',
                        type: 'bytes[]',
                    },
                    {
                        name: 'sellAmount',
                        type: 'uint256',
                    },
                ],
                name: 'sampleTwoHopSell',
                outputs: [
                    {
                        name: 'firstHop',
                        type: 'tuple',
                        components: [
                            {
                                name: 'sourceIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'returnData',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'secondHop',
                        type: 'tuple',
                        components: [
                            {
                                name: 'sourceIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'returnData',
                                type: 'bytes',
                            },
                        ],
                    },
                    {
                        name: 'buyAmount',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];
        return abi;
    }
    static _deployLibrariesAsync(artifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const links = artifact.compilerOutput.evm.bytecode.linkReferences;
            // Go through all linked libraries, recursively deploying them if necessary.
            for (const link of Object.values(links)) {
                for (const libraryName of Object.keys(link)) {
                    if (!libraryAddresses[libraryName]) {
                        // Library not yet deployed.
                        const libraryArtifact = libraryArtifacts[libraryName];
                        if (!libraryArtifact) {
                            throw new Error(`Missing artifact for linked library "${libraryName}"`);
                        }
                        // Deploy any dependent libraries used by this library.
                        yield ERC20BridgeSamplerContract._deployLibrariesAsync(libraryArtifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses);
                        // Deploy this library.
                        const linkedLibraryBytecode = base_contract_1.linkLibrariesInBytecode(libraryArtifact, libraryAddresses);
                        const txDataWithDefaults = yield base_contract_1.BaseContract._applyDefaultsToContractTxDataAsync(Object.assign({ data: linkedLibraryBytecode }, txDefaults), web3Wrapper.estimateGasAsync.bind(web3Wrapper));
                        const txHash = yield web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                        utils_1.logUtils.log(`transactionHash: ${txHash}`);
                        const { contractAddress } = yield web3Wrapper.awaitTransactionSuccessAsync(txHash);
                        utils_1.logUtils.log(`${libraryArtifact.contractName} successfully deployed at ${contractAddress}`);
                        libraryAddresses[libraryArtifact.contractName] = contractAddress;
                    }
                }
            }
            return libraryAddresses;
        });
    }
    getFunctionSignature(methodName) {
        const index = this._methodABIIndex[methodName];
        const methodAbi = ERC20BridgeSamplerContract.ABI()[index]; // tslint:disable-line:no-unnecessary-type-assertion
        const functionSignature = base_contract_1.methodAbiToFunctionSignature(methodAbi);
        return functionSignature;
    }
    getABIDecodedTransactionData(methodName, callData) {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = this;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecode(callData);
        return abiDecodedCallData;
    }
    getABIDecodedReturnData(methodName, callData) {
        if (this._encoderOverrides.decodeOutput) {
            return this._encoderOverrides.decodeOutput(methodName, callData);
        }
        const functionSignature = this.getFunctionSignature(methodName);
        const self = this;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecodeReturnValue(callData);
        return abiDecodedCallData;
    }
    getSelector(methodName) {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = this;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        return abiEncoder.getSelector();
    }
    /**
     * Call multiple public functions on this contract in a single transaction.
     * @param callDatas ABI-encoded call data for each function call.
     */
    batchCall(callDatas) {
        const self = this;
        assert_1.assert.isArray('callDatas', callDatas);
        const functionSignature = 'batchCall(bytes[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [callDatas]);
            },
        };
    }
    encodeKyberHint(opts, reserveId, takerToken, makerToken) {
        const self = this;
        assert_1.assert.isString('reserveId', reserveId);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        const functionSignature = 'encodeKyberHint((uint256,address,address,address,bytes),bytes32,address,address)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    reserveId,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                ]);
            },
        };
    }
    getAllowanceOf(tokens, account, spender) {
        const self = this;
        assert_1.assert.isArray('tokens', tokens);
        assert_1.assert.isString('account', account);
        assert_1.assert.isString('spender', spender);
        const functionSignature = 'getAllowanceOf(address[],address,address)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    tokens,
                    account.toLowerCase(),
                    spender.toLowerCase(),
                ]);
            },
        };
    }
    getBalanceOf(tokens, account) {
        const self = this;
        assert_1.assert.isArray('tokens', tokens);
        assert_1.assert.isString('account', account);
        const functionSignature = 'getBalanceOf(address[],address)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [tokens, account.toLowerCase()]);
            },
        };
    }
    /**
     * Queries the fillable taker asset amounts of native orders.
     * Effectively ignores orders that have empty signatures or
     * @param orders Native orders to query.
     * @param orderSignatures Signatures for each respective order in `orders`.
     * @param exchange The V4 exchange.
     */
    getLimitOrderFillableMakerAssetAmounts(orders, orderSignatures, exchange) {
        const self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getLimitOrderFillableMakerAssetAmounts((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256)[],(uint8,uint8,bytes32,bytes32)[],address)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    orders,
                    orderSignatures,
                    exchange.toLowerCase(),
                ]);
            },
        };
    }
    /**
     * Get the fillable taker amount of an order, taking into account
     * order state, maker fees, and maker balances.
     */
    getLimitOrderFillableTakerAmount(order, signature, exchange) {
        const self = this;
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getLimitOrderFillableTakerAmount((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256),(uint8,uint8,bytes32,bytes32),address)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [order, signature, exchange.toLowerCase()]);
            },
        };
    }
    /**
     * Queries the fillable taker asset amounts of native orders.
     * Effectively ignores orders that have empty signatures or
     * maker/taker asset amounts (returning 0).
     * @param orders Native limit orders to query.
     * @param orderSignatures Signatures for each respective order in `orders`.
     * @param exchange The V4 exchange.
     */
    getLimitOrderFillableTakerAssetAmounts(orders, orderSignatures, exchange) {
        const self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getLimitOrderFillableTakerAssetAmounts((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256)[],(uint8,uint8,bytes32,bytes32)[],address)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    orders,
                    orderSignatures,
                    exchange.toLowerCase(),
                ]);
            },
        };
    }
    getTokenDecimals(tokens) {
        const self = this;
        assert_1.assert.isArray('tokens', tokens);
        const functionSignature = 'getTokenDecimals(address[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [tokens]);
            },
        };
    }
    isContract(account) {
        const self = this;
        assert_1.assert.isString('account', account);
        const functionSignature = 'isContract(address)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [account.toLowerCase()]);
            },
        };
    }
    /**
     * Sample buy quotes from Balancer.
     * @param poolAddress Address of the Balancer pool to query.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromBalancer(poolAddress, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('poolAddress', poolAddress);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromBalancer(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    poolAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Balancer V2.
     * @param poolInfo Struct with pool related data
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromBalancerV2(poolInfo, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromBalancerV2((bytes32,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    poolInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Bancor. Unimplemented
     * @param opts BancorSamplerOpts The Bancor registry contract address and paths
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromBancor(opts, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromBancor((address,address[][]),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Curve.
     * @param curveInfo Curve information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromCurve(curveInfo, fromTokenIdx, toTokenIdx, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isBigNumber('fromTokenIdx', fromTokenIdx);
        assert_1.assert.isBigNumber('toTokenIdx', toTokenIdx);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromCurve((address,bytes4,bytes4),int128,int128,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    curveInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from DODO.
     * @param opts DODOSamplerOpts DODO Registry and helper addresses
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromDODO(opts, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromDODO((address,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from DODO.
     * @param registry Address of the registry to look up.
     * @param offset offset index for the pool in the registry.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromDODOV2(registry, offset, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('registry', registry);
        assert_1.assert.isBigNumber('offset', offset);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromDODOV2(address,uint256,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    registry.toLowerCase(),
                    offset,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from KyberDmm.
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken.
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromKyberDmm(router, path, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromKyberDmm(address,address[],uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(), path, makerTokenAmounts]);
            },
        };
    }
    /**
     * Sample buy quotes from Kyber.
     * @param opts KyberSamplerOpts The nth reserve
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromKyberNetwork(opts, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromKyberNetwork((uint256,address,address,address,bytes),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Lido.
     * @param lidoInfo Info regarding a specific Lido deployment
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromLido(lidoInfo, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromLido((address,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    let rawCallResult;
                    if (self._deployedBytecodeIfExists) {
                        rawCallResult = yield self._evmExecAsync(this.getABIEncodedTransactionData());
                    }
                    else {
                        rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    }
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    lidoInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from an arbitrary on-chain liquidity provider.
     * @param providerAddress Address of the liquidity provider.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromLiquidityProvider(providerAddress, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('providerAddress', providerAddress);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromLiquidityProvider(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    providerAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from MStable contract
     * @param router Address of the mStable contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromMStable(router, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromMStable(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    sampleBuysFromMakerPsm(psmInfo, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromMakerPsm((address,bytes32,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    psmInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Mooniswap.
     * @param registry Address of the Mooniswap Registry.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromMooniswap(registry, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('registry', registry);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromMooniswap(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    registry.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Shell pool contract
     * @param pool Address of the Shell pool contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromShell(pool, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('pool', pool);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromShell(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    pool.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Smoothy.
     * @param smoothyInfo Smoothy information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromSmoothy(smoothyInfo, fromTokenIdx, toTokenIdx, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isBigNumber('fromTokenIdx', fromTokenIdx);
        assert_1.assert.isBigNumber('toTokenIdx', toTokenIdx);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromSmoothy((address,bytes4,bytes4),int128,int128,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    smoothyInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from Uniswap.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param makerTokenAmounts Maker token sell amount for each sample.
     */
    sampleBuysFromUniswap(router, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromUniswap(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample buy quotes from UniswapV2.
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken.
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromUniswapV2(router, path, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromUniswapV2(address,address[],uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(), path, makerTokenAmounts]);
            },
        };
    }
    /**
     * Sample buy quotes from UniswapV3.
     * @param quoter UniswapV3 Quoter contract.
     * @param path Token route. Should be takerToken -> makerToken.
     * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleBuysFromUniswapV3(quoter, path, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('quoter', quoter);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromUniswapV3(address,address[],uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [quoter.toLowerCase(), path, makerTokenAmounts]);
            },
        };
    }
    sampleSellFromKyberNetwork(opts, takerToken, makerToken, takerTokenAmount) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isBigNumber('takerTokenAmount', takerTokenAmount);
        const functionSignature = 'sampleSellFromKyberNetwork((uint256,address,address,address,bytes),address,address,uint256)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmount,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Balancer.
     * @param poolAddress Address of the Balancer pool to query.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromBalancer(poolAddress, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('poolAddress', poolAddress);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromBalancer(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    poolAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Balancer V2.
     * @param poolInfo Struct with pool related data
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromBalancerV2(poolInfo, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromBalancerV2((bytes32,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    poolInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Bancor.
     * @param opts BancorSamplerOpts The Bancor registry contract address and paths
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromBancor(opts, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromBancor((address,address[][]),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Curve.
     * @param curveInfo Curve information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromCurve(curveInfo, fromTokenIdx, toTokenIdx, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isBigNumber('fromTokenIdx', fromTokenIdx);
        assert_1.assert.isBigNumber('toTokenIdx', toTokenIdx);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromCurve((address,bytes4,bytes4),int128,int128,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    curveInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from DODO.
     * @param opts DODOSamplerOpts DODO Registry and helper addresses
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromDODO(opts, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromDODO((address,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from DODO V2.
     * @param registry Address of the registry to look up.
     * @param offset offset index for the pool in the registry.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromDODOV2(registry, offset, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('registry', registry);
        assert_1.assert.isBigNumber('offset', offset);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromDODOV2(address,uint256,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    registry.toLowerCase(),
                    offset,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from KyberDmm.
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromKyberDmm(router, path, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromKyberDmm(address,address[],uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(), path, takerTokenAmounts]);
            },
        };
    }
    /**
     * Sample sell quotes from Kyber.
     * @param opts KyberSamplerOpts The nth reserve
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromKyberNetwork(opts, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromKyberNetwork((uint256,address,address,address,bytes),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Lido
     * @param lidoInfo Info regarding a specific Lido deployment
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromLido(lidoInfo, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromLido((address,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    let rawCallResult;
                    if (self._deployedBytecodeIfExists) {
                        rawCallResult = yield self._evmExecAsync(this.getABIEncodedTransactionData());
                    }
                    else {
                        rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    }
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    lidoInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from an arbitrary on-chain liquidity provider.
     * @param providerAddress Address of the liquidity provider.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromLiquidityProvider(providerAddress, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('providerAddress', providerAddress);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromLiquidityProvider(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    providerAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from the mStable contract
     * @param router Address of the mStable contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMStable(router, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromMStable(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Maker PSM
     */
    sampleSellsFromMakerPsm(psmInfo, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromMakerPsm((address,bytes32,address),address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    psmInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Mooniswap.
     * @param registry Address of the Mooniswap Registry.
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMooniswap(registry, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('registry', registry);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromMooniswap(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    registry.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from MultiBridge.
     * @param multibridge Address of the MultiBridge contract.
     * @param takerToken Address of the taker token (what to sell).
     * @param intermediateToken The address of the intermediate token to        use
     *     in an indirect route.
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromMultiBridge(multibridge, takerToken, intermediateToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('multibridge', multibridge);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('intermediateToken', intermediateToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromMultiBridge(address,address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    multibridge.toLowerCase(),
                    takerToken.toLowerCase(),
                    intermediateToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from the Shell pool contract
     * @param pool Address of the Shell pool contract
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromShell(pool, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('pool', pool);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromShell(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    pool.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Smoothy.
     * @param smoothyInfo Smoothy information specific to this token pair.
     * @param fromTokenIdx Index of the taker token (what to sell).
     * @param toTokenIdx Index of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromSmoothy(smoothyInfo, fromTokenIdx, toTokenIdx, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isBigNumber('fromTokenIdx', fromTokenIdx);
        assert_1.assert.isBigNumber('toTokenIdx', toTokenIdx);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromSmoothy((address,bytes4,bytes4),int128,int128,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    smoothyInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from Uniswap.
     * @param router Address of the Uniswap Router
     * @param takerToken Address of the taker token (what to sell).
     * @param makerToken Address of the maker token (what to buy).
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswap(router, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromUniswap(address,address,address,uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts,
                ]);
            },
        };
    }
    /**
     * Sample sell quotes from UniswapV2.
     * @param router Router to look up tokens and amounts
     * @param path Token route. Should be takerToken -> makerToken
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswapV2(router, path, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromUniswapV2(address,address[],uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(), path, takerTokenAmounts]);
            },
        };
    }
    /**
     * Sample sell quotes from UniswapV3.
     * @param quoter UniswapV3 Quoter contract.
     * @param path Token route. Should be takerToken -> makerToken
     * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromUniswapV3(quoter, path, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('quoter', quoter);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromUniswapV3(address,address[],uint256[])';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [quoter.toLowerCase(), path, takerTokenAmounts]);
            },
        };
    }
    sampleSingleSellFromMooniswapPool(registry, mooniswapTakerToken, mooniswapMakerToken, takerTokenAmount) {
        const self = this;
        assert_1.assert.isString('registry', registry);
        assert_1.assert.isString('mooniswapTakerToken', mooniswapTakerToken);
        assert_1.assert.isString('mooniswapMakerToken', mooniswapMakerToken);
        assert_1.assert.isBigNumber('takerTokenAmount', takerTokenAmount);
        const functionSignature = 'sampleSingleSellFromMooniswapPool(address,address,address,uint256)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [
                    registry.toLowerCase(),
                    mooniswapTakerToken.toLowerCase(),
                    mooniswapMakerToken.toLowerCase(),
                    takerTokenAmount,
                ]);
            },
        };
    }
    sampleTwoHopBuy(firstHopCalls, secondHopCalls, buyAmount) {
        const self = this;
        assert_1.assert.isArray('firstHopCalls', firstHopCalls);
        assert_1.assert.isArray('secondHopCalls', secondHopCalls);
        assert_1.assert.isBigNumber('buyAmount', buyAmount);
        const functionSignature = 'sampleTwoHopBuy(bytes[],bytes[],uint256)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [firstHopCalls, secondHopCalls, buyAmount]);
            },
        };
    }
    sampleTwoHopSell(firstHopCalls, secondHopCalls, sellAmount) {
        const self = this;
        assert_1.assert.isArray('firstHopCalls', firstHopCalls);
        assert_1.assert.isArray('secondHopCalls', secondHopCalls);
        assert_1.assert.isBigNumber('sellAmount', sellAmount);
        const functionSignature = 'sampleTwoHopSell(bytes[],bytes[],uint256)';
        return {
            sendTransactionAsync(txData, opts = { shouldValidate: true }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this));
                    if (opts.shouldValidate !== false) {
                        yield this.callAsync(txDataWithDefaults);
                    }
                    return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                });
            },
            awaitTransactionSuccessAsync(txData, opts = { shouldValidate: true }) {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync(txData) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
                });
            },
            createAccessListAsync(txData, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const txDataWithDefaults = yield self._applyDefaultsToTxDataAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, txData));
                    return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
                });
            },
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [firstHopCalls, secondHopCalls, sellAmount]);
            },
        };
    }
}
exports.ERC20BridgeSamplerContract = ERC20BridgeSamplerContract;
/**
 * @ignore
 */
ERC20BridgeSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b50600436106102d65760003560e01c80638b6d7b4411610182578063bd71ecf6116100e9578063ddd5aa28116100a2578063f1ed7fa41161007c578063f1ed7fa4146106f5578063f3868e9c1461040e578063f5a4994d14610708578063fc9fe41b1461071b576102d6565b8063ddd5aa28146106bc578063e78ac045146106cf578063e8e4af09146106e2576102d6565b8063bd71ecf61461064a578063c25c41381461065d578063c831908414610670578063c8c74a3714610683578063cc1621c914610696578063d9bca372146106a9576102d6565b80639ea0ff131161013b5780639ea0ff13146105ca578063a0295b8b146105dd578063a4698417146105f0578063a75e744b14610603578063adc636bf14610616578063b90cd2fb14610637576102d6565b80638b6d7b441461052d5780638e5a0e07146105405780639209483b1461056257806398777748146105755780639bf3ee35146105885780639e3f05c3146105a8576102d6565b806336052391116102415780635aae4e53116101fa57806368be3cf2116101d457806368be3cf2146104d4578063706e2f9b146104f457806374c9d255146105075780637f7f4f131461051a576102d6565b80635aae4e531461049b5780635d5b674f146104ae57806366a1ac6b146104c1576102d6565b8063360523911461040e57806340bc03ae14610421578063494569db146104345780634edfb5b2146104475780635505000a1461046757806357494b1d14610488576102d6565b8063281e343211610293578063281e34321461038d57806329fa4aa0146103a05780632aa64319146103b35780632d753aa4146103d557806330d6570d146103e85780633105fec1146103fb576102d6565b80630496d5dc146102db5780631022742b14610305578063149dab0e1461032557806316279055146103475780632339078f14610367578063252322b31461037a575b600080fd5b6102ee6102e9366004618991565b61072e565b6040516102fc929190619a5c565b60405180910390f35b610318610313366004618dc4565b6108d4565b6040516102fc9190619b80565b610338610333366004619041565b610a47565b6040516102fc93929190619928565b61035a61035536600461866b565b610ba7565b6040516102fc9190619b93565b610318610375366004618fc2565b610bb1565b6103186103883660046188cf565b610dd8565b61031861039b3660046192d7565b610fae565b6103186103ae3660046190fa565b611203565b6103c66103c1366004619153565b611272565b6040516102fc93929190619b9e565b6103186103e336600461884a565b61154f565b6103186103f63660046188cf565b6116d8565b610318610409366004618991565b61184c565b61031861041c366004619153565b6119d0565b61031861042f3660046190fa565b611a62565b6102ee610442366004618991565b611be3565b61045a610455366004619239565b611d6f565b6040516102fc9190619bec565b61047a610475366004618f2b565b611fec565b6040516102fc929190619aa3565b6103186104963660046188cf565b612237565b61047a6104a9366004618f2b565b6127ae565b6103186104bc3660046188cf565b6129f3565b6103186104cf366004618dc4565b612a59565b6104e76104e2366004618b9e565b612b0e565b6040516102fc9190619b0b565b610318610502366004618c75565b612c6f565b610338610515366004619041565b612d61565b6103186105283660046192d7565b612d70565b61031861053b3660046190fa565b612fbd565b61055361054e366004618c0c565b613320565b6040516102fc93929190619e7c565b6103186105703660046190fa565b613539565b6103186105833660046188cf565b613739565b61059b610596366004619297565b613c72565b6040516102fc9190619bca565b6105bb6105b6366004619182565b613db9565b6040516102fc93929190619bd3565b61059b6105d8366004618941565b613edf565b6103186105eb366004618fc2565b6140f5565b6103186105fe3660046188cf565b6142f1565b6103c6610611366004618a03565b614446565b6106296106243660046188cf565b614583565b6040516102fc929190619c3a565b6103186106453660046188cf565b6146d3565b610318610658366004618ca7565b614739565b61031861066b3660046188cf565b614835565b61031861067e3660046188cf565b61489b565b610318610691366004618991565b614a58565b6105bb6106a4366004619182565b614bc4565b6103c66106b7366004618a03565b614daa565b6103c66106ca366004619153565b614e99565b6103186106dd366004618ceb565b61512c565b6103186106f03660046188cf565b615221565b61059b6107033660046191f2565b615354565b6106296107163660046188cf565b6154f3565b610553610729366004618c0c565b6155df565b80516060908190806001600160401b038111801561074b57600080fd5b50604051908082528060200260200182016040528015610775578160200160208202803683370190505b50915061078286866157f4565b925082516000141561079457506108cc565b60005b818110156108c957866001600160a01b031663a8312b1d620249f08784815181106107be57fe5b6020026020010151878a6040518563ffffffff1660e01b81526004016107e693929190619f8e565b60006040518083038187803b1580156107fe57600080fd5b5086fa9350505050801561083457506040513d6000823e601f3d908101601f191682016040526108319190810190618e93565b60015b61086e573d808015610862576040519150601f19603f3d011682016040523d82523d6000602084013e610867565b606091505b50506108c9565b8060018851038151811061087e57fe5b602002602001015184838151811061089257fe5b6020026020010181815250508382815181106108aa57fe5b6020026020010151600014156108c057506108c9565b50600101610797565b50505b935093915050565b606083516001600160401b03811180156108ed57600080fd5b50604051908082528060200260200182016040528015610917578160200160208202803683370190505b50905060005b84518114610a3f57306001600160a01b0316639bf3ee3562030d4087848151811061094457fe5b602002602001015187858151811061095857fe5b6020026020010151876040518563ffffffff1660e01b815260040161097f93929190619f3e565b60206040518083038187803b15801561099757600080fd5b5086fa935050505080156109c8575060408051601f3d908101601f191682019092526109c591810190618ee1565b60015b610a1c573d8080156109f6576040519150601f19603f3d011682016040523d82523d6000602084013e6109fb565b606091505b506000838381518110610a0a57fe5b60200260200101818152505050610a37565b80838381518110610a2957fe5b602002602001018181525050505b60010161091d565b509392505050565b600060608086602001515160001415610a5f57610b9d565b610a6b87878787615ae4565b855191945092506001600160401b0381118015610a8757600080fd5b50604051908082528060200260200182016040528015610ab1578160200160208202803683370190505b50905060005b8151811015610b9b57836001600160a01b0316637f9c0ecd620493e085888581518110610ae057fe5b60200260200101516040518463ffffffff1660e01b8152600401610b05929190619a81565b60206040518083038187803b158015610b1d57600080fd5b5086fa93505050508015610b4e575060408051601f3d908101601f19168201909252610b4b91810190618ee1565b60015b610b5757610b9b565b80838381518110610b6457fe5b602002602001018181525050828281518110610b7c57fe5b602002602001015160001415610b925750610b9b565b50600101610ab7565b505b9450945094915050565b803b15155b919050565b6060610bbd8385615d16565b602085015160408051600280825260608281019093528160200160208202803683370190505090508581600081518110610bf357fe5b60200260200101906001600160a01b031690816001600160a01b0316815250508481600181518110610c2157fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b0381118015610c5157600080fd5b50604051908082528060200260200182016040528015610c7b578160200160208202803683370190505b509350610c86617eaf565b610c8e615d55565b905060005b82811015610dcb576060610cba8b898481518110610cad57fe5b6020026020010151615d84565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e90610cf09060009085908a908990600401619c8d565b600060405180830381600087803b158015610d0a57600080fd5b505af1925050508015610d3f57506040513d6000823e601f3d908101601f19168201604052610d3c9190810190618d41565b60015b610d7a573d808015610d6d576040519150601f19603f3d011682016040523d82523d6000602084013e610d72565b606091505b505050610dcb565b600081600181518110610d8957fe5b602002602001015160001902905060008113610da757505050610dcb565b80898581518110610db457fe5b602002602001018181525050505050600101610c93565b5050505050949350505050565b6060610de48385615d16565b8151806001600160401b0381118015610dfc57600080fd5b50604051908082528060200260200182016040528015610e26578160200160208202803683370190505b50915060006001600160a01b03861615610e4957610e448787615e16565b610e4c565b60005b905060006001600160a01b03861615610e6e57610e698887615e16565b610e71565b60005b905060005b83811015610fa25760016001600160a01b038816610ed457610eb384632640f62c60e01b898581518110610ea657fe5b6020026020010151615e95565b878481518110610ebf57fe5b60200260200101819350828152505050610f6e565b6001600160a01b038916610efa57610eb3836359e9486260e01b898581518110610ea657fe5b6000610f14846359e9486260e01b8a8681518110610ea657fe5b925090508015610f5157610f30856309903d8b60e21b83615e95565b888581518110610f3c57fe5b60200260200101819450828152505050610f6c565b6000878481518110610f5f57fe5b6020026020010181815250505b505b801580610f8e5750858281518110610f8257fe5b60200260200101516000145b15610f995750610fa2565b50600101610e76565b50505050949350505050565b6060610fba8385615d16565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b158015610ffe57600080fd5b505afa158015611012573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110369190618687565b8451909150806001600160401b038111801561105157600080fd5b5060405190808252806020026020018201604052801561107b578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156110b757600080fd5b505afa1580156110cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110ef9190618687565b6001600160a01b0316866001600160a01b0316141580156111925750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561114457600080fd5b505afa158015611158573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061117c9190618687565b6001600160a01b0316876001600160a01b031614155b1561119f575050506111fb565b60005b81811015610fa25760006111cd8a898b8a86815181106111be57fe5b60200260200101518989615f78565b9050806111da5750610fa2565b808683815181106111e757fe5b6020908102919091010152506001016111a2565b949350505050565b6040805160608181019092526112699080611222868960808401619d64565b60405160208183030381529060405281526020018688604051602001611249929190619d64565b60405160208183030381529060405281526020016162398152508361636c565b95945050505050565b60008060606112818587615d16565b8351806001600160401b038111801561129957600080fd5b506040519080825280602002602001820160405280156112c3578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c6906112f6908a908a906004016197c4565b60206040518083038186803b15801561130e57600080fd5b505afa158015611322573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113469190618687565b925060006001600160a01b0384161561136457506001935086611403565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690611395908a908c906004016197c4565b60206040518083038186803b1580156113ad57600080fd5b505afa1580156113c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113e59190618687565b93506001600160a01b0384166113fc575050610b9d565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561143c57600080fd5b505afa158015611450573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114749190618ec5565b61147f575050610b9d565b60005b828110156115425760006114fc8a87858e602001516040516020016114aa94939291906197de565b6040516020818303038152906040528a88868f602001516040516020016114d494939291906197de565b6040516020818303038152906040528a85815181106114ef57fe5b602002602001015161657e565b90508085838151811061150b57fe5b60200260200101818152505084828151811061152357fe5b6020026020010151600014156115395750611542565b50600101611482565b5050509450945094915050565b8051606090806001600160401b038111801561156a57600080fd5b50604051908082528060200260200182016040528015611594578160200160208202803683370190505b5091506001600160a01b0387166115ab5750611269565b60005b818110156116cd5760006060896001600160a01b031662061a80636e79e13360e01b8b8b8b8b89815181106115df57fe5b60200260200101516040516024016115fa949392919061983d565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611638919061977b565b6000604051808303818686fa925050503d8060008114611674576040519150601f19603f3d011682016040523d82523d6000602084013e611679565b606091505b50915091506000821561169d578180602001905181019061169a9190618ee1565b90505b806116aa575050506116cd565b808685815181106116b757fe5b60209081029190910101525050506001016115ae565b505095945050505050565b60606116e48385615d16565b8151806001600160401b03811180156116fc57600080fd5b50604051908082528060200260200182016040528015611726578160200160208202803683370190505b50915060005b8181101561184257866001600160a01b03166372ea9076620c3500888888868151811061175557fe5b60200260200101516040518563ffffffff1660e01b815260040161177b939291906198bf565b60206040518083038187803b15801561179357600080fd5b5086fa935050505080156117c4575060408051601f3d908101601f191682019092526117c191810190618ee1565b60015b6117fe573d8080156117f2576040519150601f19603f3d011682016040523d82523d6000602084013e6117f7565b606091505b5050611842565b8084838151811061180b57fe5b60200260200101818152505083828151811061182357fe5b6020026020010151600014156118395750611842565b5060010161172c565b5050949350505050565b8051606090806001600160401b038111801561186757600080fd5b50604051908082528060200260200182016040528015611891578160200160208202803683370190505b50915060005b818110156119c757856001600160a01b031663d06ca61f620249f08684815181106118be57fe5b6020026020010151886040518463ffffffff1660e01b81526004016118e4929190619f75565b60006040518083038187803b1580156118fc57600080fd5b5086fa9350505050801561193257506040513d6000823e601f3d908101601f1916820160405261192f9190810190618e93565b60015b61196c573d808015611960576040519150601f19603f3d011682016040523d82523d6000602084013e611965565b606091505b50506119c7565b8060018751038151811061197c57fe5b602002602001015184838151811061199057fe5b6020026020010181815250508382815181106119a857fe5b6020026020010151600014156119be57506119c7565b50600101611897565b50509392505050565b60606119dc8385615d16565b84602001516001600160a01b0316846001600160a01b0316141580611a0e575084516001600160a01b03848116911614155b15610a3f5781516060816001600160401b0381118015611a2d57600080fd5b50604051908082528060200260200182016040528015611a57578160200160208202803683370190505b5092506111fb915050565b8051606090806001600160401b0381118015611a7d57600080fd5b50604051908082528060200260200182016040528015611aa7578160200160208202803683370190505b50915060005b81811015611842576000606088600001516001600160a01b0316621e84808a602001518a8a8a8881518110611ade57fe5b6020026020010151604051602401611af893929190619d46565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611b36919061977b565b6000604051808303818686fa925050503d8060008114611b72576040519150601f19603f3d011682016040523d82523d6000602084013e611b77565b606091505b509150915060008215611b9b5781806020019051810190611b989190618ee1565b90505b80868581518110611ba857fe5b602002602001018181525050858481518110611bc057fe5b602002602001015160001415611bd857505050611842565b505050600101611aad565b80516060908190806001600160401b0381118015611c0057600080fd5b50604051908082528060200260200182016040528015611c2a578160200160208202803683370190505b509150611c3786866157f4565b9250825160001415611c4957506108cc565b60005b818110156108c957866001600160a01b0316639e269b68620249f0878481518110611c7357fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401611c9b93929190619f8e565b60006040518083038187803b158015611cb357600080fd5b5086fa93505050508015611ce957506040513d6000823e601f3d908101601f19168201604052611ce69190810190618e93565b60015b611d17573d808015610862576040519150601f19603f3d011682016040523d82523d6000602084013e610867565b80600081518110611d2457fe5b6020026020010151848381518110611d3857fe5b602002602001018181525050838281518110611d5057fe5b602002602001015160001415611d6657506108c9565b50600101611c4c565b60208481015160408051600180825281830190925260609384929082810190803683370190505090508581600081518110611da657fe5b602090810291909101015260606000604051908082528060200260200182016040528015611dde578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b03161415611ecf576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a12090611e379089906001908890889060040161995e565b60006040518083038187803b158015611e4f57600080fd5b5086fa93505050508015611e8557506040513d6000823e601f3d908101601f19168201604052611e829190810190618ef9565b60015b611ebf573d808015611eb3576040519150601f19603f3d011682016040523d82523d6000602084013e611eb8565b606091505b5050611eca565b93506111fb92505050565b611fe1565b87606001516001600160a01b0316856001600160a01b03161415611f25576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a12090611e37908a906001908890889060040161995e565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a12090611f65908a90600190889088908d908490849084906004016199a1565b60006040518083038187803b158015611f7d57600080fd5b5086fa93505050508015611fb357506040513d6000823e601f3d908101601f19168201604052611fb09190810190618ef9565b60015b611ebf573d808015610dcb576040519150601f19603f3d011682016040523d82523d6000602084013e610dcb565b505050949350505050565b606080606061206d866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561202d57600080fd5b505afa158015612041573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120659190618687565b8660006166b7565b905083516001600160401b038111801561208657600080fd5b506040519080825280602002602001820160405280156120b0578160200160208202803683370190505b50915083516001600160401b03811180156120ca57600080fd5b506040519080825280602002602001820160405280156120fe57816020015b60608152602001906001900390816120e95790505b50925060005b84518110156108c95760606000805b84518110156121ef57606061213b8a87848151811061212e57fe5b6020026020010151616b4d565b90508a6001600160a01b031663cdca1753620493e0838c898151811061215d57fe5b60200260200101516040518463ffffffff1660e01b8152600401612182929190619bff565b602060405180830381600088803b15801561219c57600080fd5b5087f1935050505080156121cd575060408051601f3d908101601f191682019092526121ca91810190618ee1565b60015b6121d6576121e6565b8084116121e4578093508194505b505b50600101612113565b50806121fc5750506108c9565b8085848151811061220957fe5b6020026020010181815250508186848151811061222257fe5b60209081029190910101525050600101612104565b80516060908590806001600160401b038111801561225457600080fd5b5060405190808252806020026020018201604052801561227e578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b624906122ae908990600401619797565b60206040518083038186803b1580156122c657600080fd5b505afa1580156122da573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122fe9190618ec5565b15806123835750604051630bcded8960e21b81526001600160a01b03831690632f37b62490612331908890600401619797565b60206040518083038186803b15801561234957600080fd5b505afa15801561235d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123819190618ec5565b155b1561238f5750506111fb565b612397617ed6565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906123c3908a90600401619797565b60206040518083038186803b1580156123db57600080fd5b505afa1580156123ef573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124139190618ee1565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612441908990600401619797565b60206040518083038186803b15801561245957600080fd5b505afa15801561246d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124919190618ee1565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce6906124c2908a90600401619797565b60206040518083038186803b1580156124da57600080fd5b505afa1580156124ee573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125129190618ee1565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690612545908990600401619797565b60206040518083038186803b15801561255d57600080fd5b505afa158015612571573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125959190618ee1565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b1580156125d757600080fd5b505afa1580156125eb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061260f9190618ee1565b608082015260005b82811015610fa25761264282602001516003670de0b6b3a76400008161263957fe5b04600101616ca8565b86828151811061264e57fe5b6020026020010151111561266157610fa2565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c888151811061269457fe5b602002602001015189608001516040518863ffffffff1660e01b81526004016126c296959493929190619fb9565b60206040518083038187803b1580156126da57600080fd5b5086fa9350505050801561270b575060408051601f3d908101601f1916820190925261270891810190618ee1565b60015b612745573d808015612739576040519150601f19603f3d011682016040523d82523d6000602084013e61273e565b606091505b5050610fa2565b825161275d906002670de0b6b3a76400005b04616ca8565b81111561276a5750610fa2565b8086838151811061277757fe5b60200260200101818152505085828151811061278f57fe5b6020026020010151600014156127a55750610fa2565b50600101612617565b60608060606127ef866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561202d57600080fd5b905060606127fc86616d05565b905084516001600160401b038111801561281557600080fd5b5060405190808252806020026020018201604052801561283f578160200160208202803683370190505b50925084516001600160401b038111801561285957600080fd5b5060405190808252806020026020018201604052801561288d57816020015b60608152602001906001900390816128785790505b50935060005b85518110156129e85760606000805b85518110156129a05760606128d2866128cd8985815181106128c057fe5b6020026020010151616d9d565b616b4d565b90508b6001600160a01b0316632f80bb1d620493e0838d89815181106128f457fe5b60200260200101516040518463ffffffff1660e01b8152600401612919929190619bff565b602060405180830381600088803b15801561293357600080fd5b5087f193505050508015612964575060408051601f3d908101601f1916820190925261296191810190618ee1565b60015b61296d57612997565b83158061297a5750808410155b15612995578093506129928c89858151811061212e57fe5b94505b505b506001016128a2565b50806129ad5750506129e8565b808684815181106129ba57fe5b602002602001018181525050818784815181106129d357fe5b60209081029190910101525050600101612893565b505050935093915050565b6040805160608181019092526112699080612a128689608084016197c4565b60405160208183030381529060405281526020018688604051602001612a399291906197c4565b6040516020818303038152906040528152602001616e358152508361636c565b6060612a668484846108d4565b905060005b8451811015610a3f57818181518110612a8057fe5b6020026020010151600014612b0657612aed828281518110612a9e57fe5b6020026020010151868381518110612ab257fe5b6020026020010151606001516001600160801b0316878481518110612ad357fe5b6020026020010151604001516001600160801b0316616f49565b828281518110612af957fe5b6020026020010181815250505b600101612a6b565b6060816001600160401b0381118015612b2657600080fd5b50604051908082528060200260200182016040528015612b6057816020015b612b4d617f05565b815260200190600190039081612b455790505b50905060005b808314612c68576001828281518110612b7b57fe5b602090810291909101810151911515910152838382818110612b9957fe5b9050602002810190612bab9190619fe1565b15159050612bb857612c60565b30848483818110612bc557fe5b9050602002810190612bd79190619fe1565b604051612be592919061976b565b6000604051808303816000865af19150503d8060008114612c22576040519150601f19603f3d011682016040523d82523d6000602084013e612c27565b606091505b50838381518110612c3457fe5b6020026020010151602001848481518110612c4b57fe5b60209081029190910101519190915290151590525b600101612b66565b5092915050565b606081516001600160401b0381118015612c8857600080fd5b50604051908082528060200260200182016040528015612cb2578160200160208202803683370190505b50905060005b82518114612d5b577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316838281518110612cf657fe5b60200260200101516001600160a01b031614612d3657612d31838281518110612d1b57fe5b60200260200101516001600160a01b0316616f6d565b612d39565b60125b60ff16828281518110612d4857fe5b6020908102919091010152600101612cb8565b50919050565b60006060809450945094915050565b6060612d7c8385615d16565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b158015612dc057600080fd5b505afa158015612dd4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612df89190618687565b8451909150806001600160401b0381118015612e1357600080fd5b50604051908082528060200260200182016040528015612e3d578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015612e7957600080fd5b505afa158015612e8d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612eb19190618687565b6001600160a01b0316866001600160a01b031614158015612f545750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015612f0657600080fd5b505afa158015612f1a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f3e9190618687565b6001600160a01b0316876001600160a01b031614155b15612f61575050506111fb565b60005b81811015610fa2576000612f8f8a898b8a8681518110612f8057fe5b60200260200101518989617019565b905080612f9c5750610fa2565b80868381518110612fa957fe5b602090810291909101015250600101612f64565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b8152600401612ff49190619bca565b60206040518083038186803b15801561300c57600080fd5b505afa158015613020573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130449190618ee1565b8651604051631e01043960e01b81526001600160a01b0390911690631e0104399061307790600f89900b90600401619bca565b60206040518083038186803b15801561308f57600080fd5b505afa1580156130a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130c79190618ee1565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b81526004016130ff9190619bca565b60806040518083038186803b15801561311757600080fd5b505afa15801561312b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061314f9190619411565b935050505080601203600a0a828161316357fe5b85519190049250806001600160401b038111801561318057600080fd5b506040519080825280602002602001820160405280156131aa578160200160208202803683370190505b50935060005b81811015610fa257600060608a600001516001600160a01b0316620927c08c602001518c8c8c88815181106131e157fe5b60200260200101516040516024016131fb93929190619d46565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613239919061977b565b6000604051808303818686fa925050503d8060008114613275576040519150601f19603f3d011682016040523d82523d6000602084013e61327a565b606091505b50915091506000821561329e578180602001905181019061329b9190618ee1565b90505b8681106132d857835b858110156132cf57878982815181106132bc57fe5b60209081029190910101526001016132a7565b50505050610fa2565b808885815181106132e557fe5b6020026020010181815250508784815181106132fd57fe5b60200260200101516000141561331557505050610fa2565b5050506001016131b0565b613328617f1d565b613330617f1d565b600080805b875181146134355761337c602089838151811061334e57fe5b60200260200101515103878a848151811061336557fe5b60200260200101516172ab9092919063ffffffff16565b60006060306001600160a01b03168a848151811061339657fe5b60200260200101516040516133ab919061977b565b6000604051808303816000865af19150503d80600081146133e8576040519150601f19603f3d011682016040523d82523d6000602084013e6133ed565b606091505b5091509150811561342b5760006134116020835103836172bb90919063ffffffff16565b90508481111561342957838852602088018290529350835b505b5050600101613335565b50806134415750613530565b60005b8651811461352d57613474602088838151811061345d57fe5b602002602001015151038389848151811061336557fe5b60006060306001600160a01b031689848151811061348e57fe5b60200260200101516040516134a3919061977b565b6000604051808303816000865af19150503d80600081146134e0576040519150601f19603f3d011682016040523d82523d6000602084013e6134e5565b606091505b509150915081156135235760006135096020835103836172bb90919063ffffffff16565b90508581111561352157838752602087018290529450845b505b5050600101613444565b50505b93509350939050565b60408401516060906001600160e01b0319166135bb5760408051606081019091526135b4908061356d868960808401619d64565b60405160208183030381529060405281526020018688604051602001613594929190619d64565b60405160208183030381529060405281526020016172c78152508361636c565b90506111fb565b8151806001600160401b03811180156135d357600080fd5b506040519080825280602002602001820160405280156135fd578160200160208202803683370190505b50915060005b81811015611842576000606088600001516001600160a01b0316621e84808a604001518a8a8a888151811061363457fe5b602002602001015160405160240161364e93929190619d46565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b031990941693909317909252905161368c919061977b565b6000604051808303818686fa925050503d80600081146136c8576040519150601f19603f3d011682016040523d82523d6000602084013e6136cd565b606091505b5091509150600082156136f157818060200190518101906136ee9190618ee1565b90505b808685815181106136fe57fe5b60200260200101818152505085848151811061371657fe5b60200260200101516000141561372e57505050611842565b505050600101613603565b80516060908590806001600160401b038111801561375657600080fd5b50604051908082528060200260200182016040528015613780578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b624906137b0908990600401619797565b60206040518083038186803b1580156137c857600080fd5b505afa1580156137dc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906138009190618ec5565b15806138855750604051630bcded8960e21b81526001600160a01b03831690632f37b62490613833908890600401619797565b60206040518083038186803b15801561384b57600080fd5b505afa15801561385f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906138839190618ec5565b155b156138915750506111fb565b613899617ed6565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906138c5908a90600401619797565b60206040518083038186803b1580156138dd57600080fd5b505afa1580156138f1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906139159190618ee1565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90613943908990600401619797565b60206040518083038186803b15801561395b57600080fd5b505afa15801561396f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906139939190618ee1565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce6906139c4908a90600401619797565b60206040518083038186803b1580156139dc57600080fd5b505afa1580156139f0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613a149190618ee1565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690613a47908990600401619797565b60206040518083038186803b158015613a5f57600080fd5b505afa158015613a73573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613a979190618ee1565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015613ad957600080fd5b505afa158015613aed573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613b119190618ee1565b608082015260005b82811015610fa2578151613b37906002670de0b6b3a7640000612757565b868281518110613b4357fe5b60200260200101511115613b5657610fa2565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c8881518110613b8957fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401613bb796959493929190619fb9565b60206040518083038187803b158015613bcf57600080fd5b5086fa93505050508015613c00575060408051601f3d908101601f19168201909252613bfd91810190618ee1565b60015b613c2e573d808015612739576040519150601f19603f3d011682016040523d82523d6000602084013e61273e565b80868381518110613c3b57fe5b602002602001018181525050858281518110613c5357fe5b602002602001015160001415613c695750610fa2565b50600101613b19565b60008083516003811115613c8257fe5b1480613c9a5750600183516003811115613c9857fe5b145b80613cb0575060408401516001600160801b0316155b80613cc6575060608401516001600160801b0316155b15613cd357506000613db2565b613cdb617f37565b600080846001600160a01b0316631fb0979588886040518363ffffffff1660e01b8152600401613d0c929190619f21565b60a06040518083038186803b158015613d2457600080fd5b505afa158015613d38573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613d5c919061934f565b91945092509050600183602001516004811115613d7557fe5b141580613d80575080155b80613d93575086516001600160a01b0316155b15613da45760009350505050613db2565b506001600160801b03169150505b9392505050565b6000606080613dc88587615d16565b613dd387878761731b565b925082613ddf57610b9d565b60405163276fdad960e11b81523090634edfb5b290613e08908a9087908b908b90600401619ee8565b60006040518083038186803b158015613e2057600080fd5b505afa158015613e34573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052613e5c9190810190618ef9565b876080018190525086608001519150613ed36040518060600160405280878a604051602001613e8c929190619a38565b6040516020818303038152906040528152602001888a604051602001613eb3929190619a38565b60405160208183030381529060405281526020016174828152508561636c565b90509450945094915050565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b8152600401613f109291906197c4565b60206040518083038186803b158015613f2857600080fd5b505afa158015613f3c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f609190618687565b90506001600160a01b038116613f7a5760009150506111fb565b60006001600160a01b0386161561400c576040516370a0823160e01b81526001600160a01b038716906370a0823190613fb7908590600401619797565b60206040518083038186803b158015613fcf57600080fd5b505afa158015613fe3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906140079190618ee1565b614018565b816001600160a01b0316315b90508381101561402d576000925050506111fb565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f090614062908a908a908a906004016198bf565b60206040518083038187803b15801561407a57600080fd5b5086fa935050505080156140ab575060408051601f3d908101601f191682019092526140a891810190618ee1565b60015b6140eb573d8080156140d9576040519150601f19603f3d011682016040523d82523d6000602084013e6140de565b606091505b50600093505050506111fb565b92506111fb915050565b60606141018385615d16565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061413757fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061416557fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561419557600080fd5b506040519080825280602002602001820160405280156141bf578160200160208202803683370190505b5093506141ca617eaf565b6141d2615d55565b905060005b82811015610dcb5760606141f18b898481518110610cad57fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906142279060019085908a908990600401619c8d565b600060405180830381600087803b15801561424157600080fd5b505af192505050801561427657506040513d6000823e601f3d908101601f191682016040526142739190810190618d41565b60015b6142a4573d808015610d6d576040519150601f19603f3d011682016040523d82523d6000602084013e610d72565b6000816000815181106142b357fe5b60200260200101519050600081136142cd57505050610dcb565b808985815181106142da57fe5b6020026020010181815250505050506001016141d7565b8051606090806001600160401b038111801561430c57600080fd5b50604051908082528060200260200182016040528015614336578160200160208202803683370190505b50915060005b8181101561184257866001600160a01b031663343fbcdd62061a80888888868151811061436557fe5b60200260200101516040518563ffffffff1660e01b815260040161438b939291906198bf565b60206040518083038187803b1580156143a357600080fd5b5086fa935050505080156143d4575060408051601f3d908101601f191682019092526143d191810190618ee1565b60015b614402573d8080156117f2576040519150601f19603f3d011682016040523d82523d6000602084013e6117f7565b8084838151811061440f57fe5b60200260200101818152505083828151811061442757fe5b60200260200101516000141561443d5750611842565b5060010161433c565b60008060606144558587615d16565b8351806001600160401b038111801561446d57600080fd5b50604051908082528060200260200182016040528015614497578160200160208202803683370190505b5091506144a689898989617569565b945092506001600160a01b0383166144be5750614578565b60005b8181101561457557600061452f8986886040516020016144e393929190619867565b60405160208183030381529060405289878960405160200161450793929190619867565b60405160208183030381529060405289858151811061452257fe5b60200260200101516176be565b90508084838151811061453e57fe5b60200260200101818152505083828151811061455657fe5b60200260200101516000141561456c5750614575565b506001016144c1565b50505b955095509592505050565b600060606145918486615d16565b8251806001600160401b03811180156145a957600080fd5b506040519080825280602002602001820160405280156145d3578160200160208202803683370190505b50915060005b818110156146485760006146028989898986815181106145f557fe5b6020026020010151613edf565b90508084838151811061461157fe5b60200260200101818152505083828151811061462957fe5b60200260200101516000141561463f5750614648565b506001016145d9565b5060405163901754d760e01b81526001600160a01b0388169063901754d79061467790899089906004016197c4565b60206040518083038186803b15801561468f57600080fd5b505afa1580156146a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906146c79190618687565b92505094509492505050565b60408051606081810190925261126990806146f28689608084016197c4565b604051602081830303815290604052815260200186886040516020016147199291906197c4565b60405160208183030381529060405281526020016177b08152508361636c565b606082516001600160401b038111801561475257600080fd5b5060405190808252806020026020018201604052801561477c578160200160208202803683370190505b50905060005b83518114612c68577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168482815181106147c057fe5b60200260200101516001600160a01b03161461480a57614805838583815181106147e657fe5b60200260200101516001600160a01b03166177f790919063ffffffff16565b614816565b826001600160a01b0316315b82828151811061482257fe5b6020908102919091010152600101614782565b60408051606081810190925261126990806148548689608084016197c4565b6040516020818303038152906040528152602001868860405160200161487b9291906197c4565b60405160208183030381529060405281526020016178c18152508361636c565b60606148a78385615d16565b8151806001600160401b03811180156148bf57600080fd5b506040519080825280602002602001820160405280156148e9578160200160208202803683370190505b50915060006001600160a01b0386161561490c576149078787615e16565b61490f565b60005b905060006001600160a01b038616156149315761492c8887615e16565b614934565b60005b905060005b83811015610fa25760016001600160a01b03881661498a57614969846395b68fe760e01b898581518110610ea657fe5b87848151811061497557fe5b60200260200101819350828152505050614a24565b6001600160a01b0389166149b0576149698363cd7724c360e01b898581518110610ea657fe5b60006149ca856395b68fe760e01b8a8681518110610ea657fe5b925090508015614a07576149e68463cd7724c360e01b83615e95565b8885815181106149f257fe5b60200260200101819450828152505050614a22565b6000878481518110614a1557fe5b6020026020010181815250505b505b801580614a445750858281518110614a3857fe5b60200260200101516000145b15614a4f5750610fa2565b50600101614939565b8051606090806001600160401b0381118015614a7357600080fd5b50604051908082528060200260200182016040528015614a9d578160200160208202803683370190505b50915060005b818110156119c757856001600160a01b0316631f00ca74620249f0868481518110614aca57fe5b6020026020010151886040518463ffffffff1660e01b8152600401614af0929190619f75565b60006040518083038187803b158015614b0857600080fd5b5086fa93505050508015614b3e57506040513d6000823e601f3d908101601f19168201604052614b3b9190810190618e93565b60015b614b6c573d808015611960576040519150601f19603f3d011682016040523d82523d6000602084013e611965565b80600081518110614b7957fe5b6020026020010151848381518110614b8d57fe5b602002602001018181525050838281518110614ba557fe5b602002602001015160001415614bbb57506119c7565b50600101614aa3565b6000606080614bd38587615d16565b614bde87878761731b565b925082614bea57610b9d565b60405163276fdad960e11b81523090634edfb5b290614c13908a9087908b908b90600401619ee8565b60006040518083038186803b158015614c2b57600080fd5b505afa158015614c3f573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052614c679190810190618ef9565b608088018190528451909250806001600160401b0381118015614c8957600080fd5b50604051908082528060200260200182016040528015614cb3578160200160208202803683370190505b50915060005b81811015614d9e576000306001600160a01b031663f1ed7fa48b8b8b8b8781518110614ce157fe5b60200260200101516040518563ffffffff1660e01b8152600401614d089493929190619eb2565b60206040518083038186803b158015614d2057600080fd5b505afa158015614d34573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614d589190618ee1565b905080848381518110614d6757fe5b602002602001018181525050838281518110614d7f57fe5b602002602001015160001415614d955750614d9e565b50600101614cb9565b50509450945094915050565b6000806060614db98587615d16565b614dc588888888617569565b935091506001600160a01b038216614ddc57614578565b8351806001600160401b0381118015614df457600080fd5b50604051908082528060200260200182016040528015614e1e578160200160208202803683370190505b506040805160608101909152909250614e8b9080614e428987891560808501619867565b6040516020818303038152906040528152602001898688604051602001614e6b93929190619867565b60405160208183030381529060405281526020016176be8152508661636c565b915050955095509592505050565b6000806060614ea88587615d16565b8351806001600160401b0381118015614ec057600080fd5b50604051908082528060200260200182016040528015614eea578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c690614f1d908a908a906004016197c4565b60206040518083038186803b158015614f3557600080fd5b505afa158015614f49573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614f6d9190618687565b925060006001600160a01b03841615614f8b5750600193508661502a565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690614fbc908a908c906004016197c4565b60206040518083038186803b158015614fd457600080fd5b505afa158015614fe8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061500c9190618687565b93506001600160a01b038416615023575050610b9d565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561506357600080fd5b505afa158015615077573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061509b9190618ec5565b6150a6575050610b9d565b61511e60405180606001604052808987858e602001516040516020016150cf94939291906197de565b60405160208183030381529060405281526020018a87858e602001516040516020016150fe94939291906197de565b604051602081830303815290604052815260200161657e8152508761636c565b925050509450945094915050565b606083516001600160401b038111801561514557600080fd5b5060405190808252806020026020018201604052801561516f578160200160208202803683370190505b50905060005b84518114610a3f577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168582815181106151b357fe5b60200260200101516001600160a01b0316146151ff576151fa84848784815181106151da57fe5b60200260200101516001600160a01b03166179769092919063ffffffff16565b615202565b60005b82828151811061520e57fe5b6020908102919091010152600101615175565b8051606090806001600160401b038111801561523c57600080fd5b50604051908082528060200260200182016040528015615266578160200160208202803683370190505b50915060005b8181101561184257866001600160a01b031663838e6a22620493e0888888868151811061529557fe5b60200260200101516040518563ffffffff1660e01b81526004016152bb939291906198bf565b60206040518083038187803b1580156152d357600080fd5b5086fa93505050508015615304575060408051601f3d908101601f1916820190925261530191810190618ee1565b60015b615332573d8080156117f2576040519150601f19603f3d011682016040523d82523d6000602084013e6117f7565b8084838151811061533f57fe5b6020026020010181815250505060010161526c565b60008460800151516000141561536c575060006111fb565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b0316146153a657866153bc565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b0316146153df57866153f5565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b815260040161541d9594939291906198e3565b60206040518083038187803b15801561543557600080fd5b5086fa93505050508015615466575060408051601f3d908101601f1916820190925261546391810190618ee1565b60015b6154a4573d808015615494576040519150601f19603f3d011682016040523d82523d6000602084013e615499565b606091505b5060009150506111fb565b60006154af85617a42565b60ff16905060006154bf87617a42565b60ff169050670de0b6b3a764000081600a0a83600a0a87860202816154e057fe5b04816154e857fe5b0493505050506111fb565b600060606155018486615d16565b8251806001600160401b038111801561551957600080fd5b50604051908082528060200260200182016040528015615543578160200160208202803683370190505b5091506155ae604051806060016040528089886040516020016155679291906197c4565b6040516020818303038152906040528152602001898960405160200161558e9291906197c4565b6040516020818303038152906040528152602001617a4d8152508561636c565b60405163901754d760e01b81529092506001600160a01b0388169063901754d79061467790899089906004016197c4565b6155e7617f1d565b6155ef617f1d565b6000198060005b865181146156eb57615626602088838151811061560f57fe5b602002602001015151038789848151811061336557fe5b60006060306001600160a01b031689848151811061564057fe5b6020026020010151604051615655919061977b565b6000604051808303816000865af19150503d8060008114615692576040519150601f19603f3d011682016040523d82523d6000602084013e615697565b606091505b509150915081156156e15760006156bb6020835103836172bb90919063ffffffff16565b90506000811180156156cc57508481105b156156df57838752602087018290529350835b505b50506001016155f6565b506000198114156156fc5750613530565b60005b8751811461352d5761572f602089838151811061571857fe5b60200260200101515103838a848151811061336557fe5b60006060306001600160a01b03168a848151811061574957fe5b602002602001015160405161575e919061977b565b6000604051808303816000865af19150503d806000811461579b576040519150601f19603f3d011682016040523d82523d6000602084013e6157a0565b606091505b509150915081156157ea5760006157c46020835103836172bb90919063ffffffff16565b90506000811180156157d557508581105b156157e857838852602088018290529450845b505b50506001016156ff565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561583157600080fd5b505afa158015615845573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906158699190618687565b905060018351036001600160401b038111801561588557600080fd5b506040519080825280602002602001820160405280156158af578160200160208202803683370190505b50915060005b8251811015615adb576060826001600160a01b0316635b1dc86f620249f08785815181106158df57fe5b60200260200101518886600101815181106158f657fe5b60200260200101516040518463ffffffff1660e01b815260040161591b9291906197c4565b60006040518083038187803b15801561593357600080fd5b5086fa9350505050801561596957506040513d6000823e601f3d908101601f191682016040526159669190810190618a3c565b60015b6159d7573d808015615997576040519150601f19603f3d011682016040523d82523d6000602084013e61599c565b606091505b506000805b506040519080825280602002602001820160405280156159cb578160200160208202803683370190505b50945050505050615ade565b80516159e5576000806159a1565b6000805b8251811015615acf576000838281518110615a0057fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015615a4057600080fd5b505afa158015615a54573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615a789190618ee1565b905082811115615ac657809250838281518110615a9157fe5b6020026020010151888781518110615aa557fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b506001016159e9565b505050506001016158b5565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b158015615b3857600080fd5b505afa158015615b4c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615b709190618ee1565b6040518263ffffffff1660e01b8152600401615b8c9190619bca565b60206040518083038186803b158015615ba457600080fd5b505afa158015615bb8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615bdc9190618687565b915085602001515160001415615bf157615d0d565b6000805b876020015151811015615d0a57600288602001518281518110615c1457fe5b6020026020010151511015615c2857615d02565b836001600160a01b0316637f9c0ecd620493e08a602001518481518110615c4b57fe5b60200260200101518860018a510381518110615c6357fe5b60200260200101516040518463ffffffff1660e01b8152600401615c88929190619a81565b60206040518083038187803b158015615ca057600080fd5b5086fa93505050508015615cd1575060408051601f3d908101601f19168201909252615cce91810190618ee1565b60015b615cda57615d02565b82811115615d005780925088602001518281518110615cf557fe5b602002602001015193505b505b600101615bf5565b50505b94509492505050565b806001600160a01b0316826001600160a01b03161415615d515760405162461bcd60e51b8152600401615d4890619dc0565b60405180910390fd5b5050565b615d5d617eaf565b50604080516080810182523080825260006020830181905292820152606081019190915290565b604080516001808252818301909252606091829190816020015b615da6617f59565b815260200190600190039081615d9e5790505090506040518060a001604052808560000151815260200160008152602001600181526020018481526020016040518060200160405280600081525081525081600081518110615e0457fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf6290615e45908590600401619797565b60206040518083038186803b158015615e5d57600080fd5b505afa158015615e71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613db29190618687565b6000806001600160a01b038516615eab576108cc565b6060856001600160a01b0316620249f08686604051602401615ecd9190619bca565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051615f0b919061977b565b6000604051808303818686fa925050503d8060008114615f47576040519150601f19603f3d011682016040523d82523d6000602084013e615f4c565b606091505b5090925090508115615f6f5780806020019051810190615f6c9190618ee1565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401615fae9190619bca565b60a06040518083038186803b158015615fc657600080fd5b505afa158015615fda573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615ffe9190619446565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b0316141561612657600061603d8964e8d4a51000617a9d565b905060006160616b033b2e3c9fd0803ce800000061605b8885617ad3565b90617a9d565b9050848110616079576000965050505050505061622f565b6000616108670de0b6b3a76400006161028c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156160c357600080fd5b505afa1580156160d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906160fb9190618ee1565b8690617a9d565b90617aef565b905060006161168483617b19565b985061622f975050505050505050565b8a604001516001600160a01b03168a6001600160a01b0316141561622657878481111561615b5760009550505050505061622f565b60006161776b033b2e3c9fd0803ce800000061605b8885617b19565b905083811161618f576000965050505050505061622f565b60006162148a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156161cd57600080fd5b505afa1580156161e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906162059190618ee1565b670de0b6b3a764000090617ad3565b90506000616116826161028688617a9d565b60009450505050505b9695505050505050565b600080616244617f8b565b858060200190518101906162589190618f8d565b915091506000858060200190518101906162729190618f71565b905060006060306322db5ed160e21b85878661628d8c617b38565b6040516024016162a09493929190619e4a565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516162de919061977b565b600060405180830381855afa9150503d8060008114616319576040519150601f19603f3d011682016040523d82523d6000602084013e61631e565b606091505b50915091508161633657600095505050505050613db2565b8080602001905181019061634a9190618e93565b60008151811061635657fe5b6020026020010151955050505050509392505050565b606081516001600160401b038111801561638557600080fd5b506040519080825280602002602001820160405280156163af578160200160208202803683370190505b5090508151600014156163c157615ade565b60006163f284600001518560200151856000815181106163dd57fe5b6020026020010151876040015163ffffffff16565b9050806163ff5750615ade565b600061641c8560200151866000015184886040015163ffffffff16565b90508061642a575050615ade565b60005b8451811015616575576000805b600581101561651e5761646187848151811061645257fe5b60200260200101518587617b79565b94508461646d5761651e565b61647c61271561271087617b79565b9450846164885761651e565b60006164a589602001518a60000151888c6040015163ffffffff16565b9050806164b2575061651e565b8094508784815181106164c157fe5b60200260200101518510616515578784815181106164db57fe5b60200260200101516127108986815181106164f257fe5b60200260200101518703028161650457fe5b04925060058311616515575061651e565b5060010161643a565b5080158061652c5750600581115b156165375750616575565b61655586838151811061654657fe5b60200260200101518486617b79565b85838151811061656157fe5b60209081029190910101525060010161642d565b50505092915050565b60008060008060008780602001905181019061659a91906186dc565b9350935093509350816001600160a01b0316846001600160a01b03161415616684576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e0906165ed908a90600401619bca565b60206040518083038187803b15801561660557600080fd5b5086fa93505050508015616636575060408051601f3d908101601f1916820190925261663391810190618ee1565b60015b616678573d808015616664576040519150601f19603f3d011682016040523d82523d6000602084013e616669565b606091505b50600095505050505050613db2565b9450613db29350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e0906165ed9087908b906004016197ab565b606060028284510310156166dd5760405162461bcd60e51b8152600401615d4890619d7c565b6166e5617fab565b5060408051606080820183526101f48252610bb86020830152612710828401528251600380825260808201909452919290919081602001602082028036833701905050905060008086868151811061673957fe5b60200260200101519050600087876001018151811061675457fe5b6020026020010151905060005b60038110156168495760008a6001600160a01b0316631698ee8285858a866003811061678957fe5b60200201516040518463ffffffff1660e01b81526004016167ac93929190619c12565b60206040518083038186803b1580156167c457600080fd5b505afa1580156167d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906167fc9190618687565b905061680781617bd1565b15616840578086868060010197508151811061681f57fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616761565b5050508061685957505050613db2565b855185600201141561694f57806001600160401b038111801561687b57600080fd5b506040519080825280602002602001820160405280156168af57816020015b606081526020019060019003908161689a5790505b50935060005b81811015616946576040805160018082528183019092529060208083019080368337019050508582815181106168e757fe5b60200260200101819052508281815181106168fe57fe5b602002602001015185828151811061691257fe5b602002602001015160008151811061692657fe5b6001600160a01b03909216602092830291909101909101526001016168b5565b50505050613db2565b606061695f8888886001016166b7565b90508051600014156169745750505050613db2565b805182026001600160401b038111801561698d57600080fd5b506040519080825280602002602001820160405280156169c157816020015b60608152602001906001900390816169ac5790505b50945060005b82811015616b415760005b8251811015616b385782518281028201908490839081106169ef57fe5b6020026020010151516001016001600160401b0381118015616a1057600080fd5b50604051908082528060200260200182016040528015616a3a578160200160208202803683370190505b50888281518110616a4757fe5b6020026020010181905250858381518110616a5e57fe5b6020026020010151888281518110616a7257fe5b6020026020010151600081518110616a8657fe5b60200260200101906001600160a01b031690816001600160a01b03168152505060005b848381518110616ab557fe5b602002602001015151811015616b2e57848381518110616ad157fe5b60200260200101518181518110616ae457fe5b6020026020010151898381518110616af857fe5b60200260200101518260010181518110616b0e57fe5b6001600160a01b0390921660209283029190910190910152600101616aa9565b50506001016169d2565b506001016169c7565b50505050509392505050565b60606002835110158015616b65575081516001018351145b616b815760405162461bcd60e51b8152600401615d4890619e05565b81516003028351601402016001600160401b0381118015616ba157600080fd5b506040519080825280601f01601f191660200182016040528015616bcc576020820181803683370190505b5090506020810160005b8451811015615adb578015616c7b576000846001830381518110616bf657fe5b60200260200101516001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b158015616c3657600080fd5b505afa158015616c4a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616c6e91906193cb565b60e81b8352506003909101905b6000858281518110616c8957fe5b602090810291909101015160601b835250601490910190600101616bd6565b60008282028315801590616cc5575082848281616cc157fe5b0414155b15616cd4576000915050615ade565b6706f05b59d3b20000810181811015616cf257600092505050615ade565b670de0b6b3a76400009004949350505050565b606081516001600160401b0381118015616d1e57600080fd5b50604051908082528060200260200182016040528015616d48578160200160208202803683370190505b50905060005b8251811015612d5b57826001828551030381518110616d6957fe5b6020026020010151828281518110616d7d57fe5b6001600160a01b0390921660209283029190910190910152600101616d4e565b606081516001600160401b0381118015616db657600080fd5b50604051908082528060200260200182016040528015616de0578160200160208202803683370190505b50905060005b8251811015612d5b57826001828551030381518110616e0157fe5b6020026020010151828281518110616e1557fe5b6001600160a01b0390921660209283029190910190910152600101616de6565b600080600085806020019051810190616e4e91906186a3565b91509150600085806020019051810190616e689190618687565b90503063e8e4af09838584616e7c8a617b38565b6040518563ffffffff1660e01b8152600401616e9b9493929190619809565b60006040518083038186803b158015616eb357600080fd5b505afa925050508015616ee857506040513d6000823e601f3d908101601f19168201604052616ee59190810190618e93565b60015b616f29573d808015616f16576040519150601f19603f3d011682016040523d82523d6000602084013e616f1b565b606091505b506000945050505050613db2565b80600081518110616f3657fe5b6020026020010151945050505050613db2565b60006111fb83616102616f5d826001617b19565b616f678887617a9d565b90617ad3565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b815250604051616fab919061977b565b600060405180830381855afa9150503d8060008114616fe6576040519150601f19603f3d011682016040523d82523d6000602084013e616feb565b606091505b5091509150818015616fff57506020815110155b156170125761700f8160006172bb565b92505b5050919050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b815260040161704f9190619bca565b60a06040518083038186803b15801561706757600080fd5b505afa15801561707b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061709f9190619446565b945094505050925089604001516001600160a01b0316886001600160a01b031614156171b6576000879050600061714f886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561710857600080fd5b505afa15801561711c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906171409190618ee1565b670de0b6b3a764000090617b19565b905060006171698261610285670de0b6b3a7640000617a9d565b905060006171876b033b2e3c9fd0803ce800000061605b8985617ad3565b90508581106171a057600097505050505050505061622f565b60006161166001616f678564e8d4a51000617aef565b89604001516001600160a01b0316896001600160a01b0316141561729b5760006171e58864e8d4a51000617a9d565b90506000617225886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156161cd57600080fd5b9050600061723f670de0b6b3a76400006161028585617a9d565b905085811115617258576000965050505050505061622f565b60006172746b033b2e3c9fd0803ce800000061605b8985617b19565b905084811161728d57600097505050505050505061622f565b50955061622f945050505050565b5060009998505050505050505050565b6172b6838383617ddd565b505050565b6000613db28383617e04565b6000806172d2617f8b565b858060200190518101906172e69190618f8d565b915091506000858060200190518101906173009190618f71565b9050600060603063205e01d760e11b85878661628d8c617b38565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b031614617359578661736f565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b03161461739257866173a8565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b169091526173dc9291906001906024810161988b565b60006040518083038186803b1580156173f457600080fd5b505afa158015617408573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526174309190810190618ad4565b50509050805186600001511061744c575060009150613db29050565b8086600001518151811061745c57fe5b6020026020010151925060f883901c60001c60bb14156119c7575060009150613db29050565b60008061748d617fc9565b848060200190518101906174a1919061878a565b915091506000868060200190518101906174bb919061878a565b50604051633c7b5fe960e21b8152909150309063f1ed7fa4906174e8908590859088908b90600401619eb2565b60206040518083038186803b15801561750057600080fd5b505afa925050508015617530575060408051601f3d908101601f1916820190925261752d91810190618ee1565b60015b61755e573d808015616f16576040519150601f19603f3d011682016040523d82523d6000602084013e616f1b565b9350613db292505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b815260040161759c9291906197c4565b60006040518083038186803b1580156175b457600080fd5b505afa1580156175c8573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526175f09190810190618a3c565b905060019150805160001415617689576040516315e8a07760e21b81526001600160a01b038816906357a281dc9061762e90879089906004016197c4565b60006040518083038186803b15801561764657600080fd5b505afa15801561765a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526176829190810190618a3c565b9050600091505b8051861061769e576000809250925050615d0d565b8086815181106176aa57fe5b602002602001015192505094509492505050565b600080600080868060200190518101906176d8919061873a565b925092509250801561777c57604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e090617718906000908a906004016197ab565b604080518083038187803b15801561772f57600080fd5b5086fa93505050508015617760575060408051601f3d908101601f1916820190925261775d918101906193ee565b60015b6177705760009350505050613db2565b509350613db292505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e090617718906000908a906004016197ab565b6000806000858060200190518101906177c991906186a3565b915091506000858060200190518101906177e39190618687565b9050306330d6570d838584616e7c8a617b38565b6000806060846001600160a01b03166370a0823160e01b8560405160240161781f9190619797565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b031990941693909317909252905161785d919061977b565b600060405180830381855afa9150503d8060008114617898576040519150601f19603f3d011682016040523d82523d6000602084013e61789d565b606091505b50915091508180156178b157506020815110155b15615adb576112698160006172bb565b6000806000858060200190518101906178da91906186a3565b915091506000858060200190518101906178f49190618687565b90503063a469841762061a8084868561790c8b617b38565b6040518663ffffffff1660e01b815260040161792b9493929190619809565b60006040518083038187803b15801561794357600080fd5b5086fa93505050508015616ee857506040513d6000823e601f3d908101601f19168201604052616ee59190810190618e93565b6000806060856001600160a01b031663dd62ed3e60e01b86866040516024016179a09291906197c4565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516179de919061977b565b600060405180830381855afa9150503d8060008114617a19576040519150601f19603f3d011682016040523d82523d6000602084013e617a1e565b606091505b5091509150818015617a3257506020815110155b156119c75761622f8160006172bb565b6000615ade82616f6d565b600080600085806020019051810190617a6691906186a3565b9150915060008086806020019051810190617a8191906186a3565b91509150617a9184848389613edf565b98975050505050505050565b600082617aac57506000615ade565b82820282848281617ab957fe5b0414613db257613db2617ace60018686617e2e565b617e88565b600082820183811015613db257613db2617ace60008686617e2e565b600081617b0557617b05617ace60038585617e2e565b6000828481617b1057fe5b04949350505050565b600082821115617b3257617b32617ace60028585617e2e565b50900390565b604080516001808252818301909252606091602080830190803683370190505090508181600081518110617b6857fe5b602002602001018181525050919050565b6000831580617b86575081155b80617b8f575082155b15617b9c57506000613db2565b83820282858281617ba957fe5b0414617bb9576000915050613db2565b8360018503820181617bc757fe5b0495945050505050565b6000813b80617be4576000915050610bac565b50816001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b158015617c1e57600080fd5b505afa158015617c32573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617c569190618687565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401617c819190619797565b60206040518083038186803b158015617c9957600080fd5b505afa158015617cad573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617cd19190618ee1565b617cdd57506000610bac565b816001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b158015617d1657600080fd5b505afa158015617d2a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617d4e9190618687565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401617d799190619797565b60206040518083038186803b158015617d9157600080fd5b505afa158015617da5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617dc99190618ee1565b617dd557506000610bac565b506001919050565b8160200183511015617dfc57617dfc617ace6005855185602001617e90565b910160200152565b60008160200183511015617e2557617e25617ace6005855185602001617e90565b50016020015190565b606063e946c1bb60e01b848484604051602401617e4d93929190619c5e565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b848484604051602401617e4d93929190619c7f565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b60408051808201909152606081526000602082015290565b604051806040016040528060008152602001606081525090565b6040805160608101909152600080825260208201908152600060209091015290565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b60405180606001604052806003906020820280368337509192915050565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b8035615ade8161a0dc565b8051615ade8161a0dc565b600082601f830112618039578081fd5b813561804c6180478261a052565b61a02c565b81815291506020808301908481018184028601820187101561806d57600080fd5b60005b848110156180955781356180838161a0dc565b84529282019290820190600101618070565b505050505092915050565b600082601f8301126180b0578081fd5b81356180be6180478261a052565b818152915060208083019084810160005b84811015618095576180e6888484358a0101618029565b845292820192908201906001016180cf565b600082601f830112618108578081fd5b81356181166180478261a052565b818152915060208083019084810160005b848110156180955761813e888484358a01016182e7565b84529282019290820190600101618127565b600082601f830112618160578081fd5b813561816e6180478261a052565b81815291506020808301908481018184028601820187101561818f57600080fd5b60005b848110156180955781356181a58161a0dc565b84529282019290820190600101618192565b600082601f8301126181c7578081fd5b81356181d56180478261a052565b81815291506020808301908481016080808502870183018810156181f857600080fd5b60005b8581101561821f5761820d89846185e6565b855293830193918101916001016181fb565b50505050505092915050565b600082601f83011261823b578081fd5b81356182496180478261a052565b81815291506020808301908481018184028601820187101561826a57600080fd5b60005b848110156180955781358452928201929082019060010161826d565b600082601f830112618299578081fd5b81516182a76180478261a052565b8181529150602080830190848101818402860182018710156182c857600080fd5b60005b84811015618095578151845292820192908201906001016182cb565b600082601f8301126182f7578081fd5b81356183056180478261a071565b915080825283602082850101111561831c57600080fd5b8060208401602084013760009082016020015292915050565b600082601f830112618345578081fd5b81516183536180478261a071565b915080825283602082850101111561836a57600080fd5b612c6881602084016020860161a09f565b805160028110615ade57600080fd5b60006060828403121561839b578081fd5b6183a5606061a02c565b905081356183b28161a0dc565b815260208201356183c28161a0ff565b602082015260408201356183d58161a0ff565b604082015292915050565b6000606082840312156183f1578081fd5b6183fb606061a02c565b905081516184088161a0dc565b815260208201516184188161a0ff565b602082015260408201516183d58161a0ff565b60006040828403121561843c578081fd5b618446604061a02c565b905081356184538161a0dc565b815260208201356184638161a0dc565b602082015292915050565b600060a0828403121561847f578081fd5b61848960a061a02c565b905081358152602082013561849d8161a0dc565b602082015260408201356184b08161a0dc565b604082015260608201356184c38161a0dc565b606082015260808201356001600160401b038111156184e157600080fd5b6184ed848285016182e7565b60808301525092915050565b600061018080838503121561850c578182fd5b6185158161a02c565b9150506185228383618013565b81526185318360208401618013565b60208201526185438360408401618649565b60408201526185558360608401618649565b60608201526185678360808401618649565b60808201526185798360a08401618013565b60a082015261858b8360c08401618013565b60c082015261859d8360e08401618013565b60e08201526101006185b184828501618013565b9082015261012082810135908201526101406185cf84828501618654565b818301525061016080830135818301525092915050565b6000608082840312156185f7578081fd5b618601608061a02c565b905081356004811061861257600080fd5b8152602082013560ff8116811461862857600080fd5b80602083015250604082013560408201526060820135606082015292915050565b8035615ade8161a124565b80356001600160401b0381168114615ade57600080fd5b60006020828403121561867c578081fd5b8135613db28161a0dc565b600060208284031215618698578081fd5b8151613db28161a0dc565b600080604083850312156186b5578081fd5b82516186c08161a0dc565b60208401519092506186d18161a0dc565b809150509250929050565b600080600080608085870312156186f1578182fd5b84516186fc8161a0dc565b602086015190945061870d8161a0dc565b604086015190935061871e8161a0dc565b606086015190925061872f8161a0dc565b939692955090935050565b60008060006060848603121561874e578081fd5b83516187598161a0dc565b602085015190935061876a8161a0dc565b6040850151909250801515811461877f578182fd5b809150509250925092565b6000806040838503121561879c578182fd5b82516187a78161a0dc565b60208401519092506001600160401b03808211156187c3578283fd5b9084019060a082870312156187d6578283fd5b6187e060a061a02c565b825181526187f1876020850161801e565b6020820152618803876040850161801e565b6040820152618815876060850161801e565b606082015260808301518281111561882b578485fd5b61883788828601618335565b6080830152508093505050509250929050565b600080600080600060a08688031215618861578283fd5b853561886c8161a0dc565b9450602086013561887c8161a0dc565b9350604086013561888c8161a0dc565b9250606086013561889c8161a0dc565b915060808601356001600160401b038111156188b6578182fd5b6188c28882890161822b565b9150509295509295909350565b600080600080608085870312156188e4578182fd5b84356188ef8161a0dc565b935060208501356188ff8161a0dc565b9250604085013561890f8161a0dc565b915060608501356001600160401b03811115618929578182fd5b6189358782880161822b565b91505092959194509250565b60008060008060808587031215618956578182fd5b84356189618161a0dc565b935060208501356189718161a0dc565b925060408501356189818161a0dc565b9396929550929360600135925050565b6000806000606084860312156189a5578081fd5b83356189b08161a0dc565b925060208401356001600160401b03808211156189cb578283fd5b6189d787838801618029565b935060408601359150808211156189ec578283fd5b506189f98682870161822b565b9150509250925092565b600080600080600060a08688031215618a1a578283fd5b8535618a258161a0dc565b945060208601359350604086013561888c8161a0dc565b60006020808385031215618a4e578182fd5b82516001600160401b03811115618a63578283fd5b8301601f81018513618a73578283fd5b8051618a816180478261a052565b8181528381019083850185840285018601891015618a9d578687fd5b8694505b83851015618ac8578051618ab48161a0dc565b835260019490940193918501918501618aa1565b50979650505050505050565b600080600060608486031215618ae8578081fd5b83516001600160401b0380821115618afe578283fd5b818601915086601f830112618b11578283fd5b8151618b1f6180478261a052565b80828252602080830192508086018b828387028901011115618b3f578788fd5b8796505b84871015618b61578051845260019690960195928101928101618b43565b508901519097509350505080821115618b78578283fd5b50618b8586828701618289565b925050618b95856040860161837b565b90509250925092565b60008060208385031215618bb0578182fd5b82356001600160401b0380821115618bc6578384fd5b818501915085601f830112618bd9578384fd5b813581811115618be7578485fd5b8660208083028501011115618bfa578485fd5b60209290920196919550909350505050565b600080600060608486031215618c20578081fd5b83356001600160401b0380821115618c36578283fd5b618c42878388016180f8565b94506020860135915080821115618c57578283fd5b50618c64868287016180f8565b925050604084013590509250925092565b600060208284031215618c86578081fd5b81356001600160401b03811115618c9b578182fd5b6111fb84828501618150565b60008060408385031215618cb9578182fd5b82356001600160401b03811115618cce578283fd5b618cda85828601618150565b92505060208301356186d18161a0dc565b600080600060608486031215618cff578081fd5b83356001600160401b03811115618d14578182fd5b618d2086828701618150565b9350506020840135618d318161a0dc565b9150604084013561877f8161a0dc565b60006020808385031215618d53578182fd5b82516001600160401b03811115618d68578283fd5b8301601f81018513618d78578283fd5b8051618d866180478261a052565b8181528381019083850185840285018601891015618da2578687fd5b8694505b83851015618ac8578051835260019490940193918501918501618da6565b600080600060608486031215618dd8578081fd5b83356001600160401b0380821115618dee578283fd5b818601915086601f830112618e01578283fd5b8135618e0f6180478261a052565b80828252602080830192508086016101808c838288028a01011115618e32578889fd5b8897505b85881015618e5e57618e488d836184f9565b8552600197909701969382019390810190618e36565b50919850890135945050505080821115618e76578283fd5b50618e83868287016181b7565b925050618b958560408601618013565b600060208284031215618ea4578081fd5b81516001600160401b03811115618eb9578182fd5b6111fb84828501618289565b600060208284031215618ed6578081fd5b8151613db28161a0f1565b600060208284031215618ef2578081fd5b5051919050565b600060208284031215618f0a578081fd5b81516001600160401b03811115618f1f578182fd5b6111fb84828501618335565b600080600060608486031215618f3f578081fd5b8335618f4a8161a0dc565b925060208401356001600160401b0380821115618f65578283fd5b6189d787838801618150565b600060208284031215618f82578081fd5b8151613db28161a115565b60008060808385031215618f9f578182fd5b8251618faa8161a115565b9150618fb984602085016183e0565b90509250929050565b60008060008084860360a0811215618fd8578283fd5b6040811215618fe5578283fd5b50618ff0604061a02c565b8535815260208601356190028161a0dc565b6020820152935060408501356190178161a0dc565b925060608501356190278161a0dc565b915060808501356001600160401b03811115618929578182fd5b60008060008060808587031215619056578182fd5b84356001600160401b038082111561906c578384fd5b908601906040828903121561907f578384fd5b619089604061a02c565b6190938984618013565b81526020830135828111156190a6578586fd5b6190b28a8286016180a0565b602083015250809650506190c98860208901618013565b94506190d88860408901618013565b935060608701359150808211156190ed578283fd5b506189358782880161822b565b60008060008060c0858703121561910f578182fd5b619119868661838a565b935060608501356191298161a115565b925060808501356191398161a115565b915060a08501356001600160401b03811115618929578182fd5b60008060008060a08587031215619168578182fd5b619172868661842b565b935060408501356190178161a0dc565b60008060008060808587031215619197578182fd5b84356001600160401b03808211156191ad578384fd5b6191b98883890161846e565b9550602087013591506191cb8261a0dc565b9093506040860135906191dd8261a0dc565b909250606086013590808211156190ed578283fd5b60008060008060808587031215619207578182fd5b84356001600160401b0381111561921c578283fd5b6192288782880161846e565b94505060208501356189718161a0dc565b6000806000806080858703121561924e578182fd5b84356001600160401b03811115619263578283fd5b61926f8782880161846e565b9450506020850135925060408501356192878161a0dc565b9150606085013561872f8161a0dc565b600080600061022084860312156192ac578081fd5b6192b685856184f9565b92506192c68561018086016185e6565b915061020084013561877f8161a0dc565b60008060008084860360c08112156192ed578283fd5b60608112156192fa578283fd5b50619305606061a02c565b85356193108161a0dc565b815260208681013590820152604086013561932a8161a0dc565b60408201529350606085013561933f8161a0dc565b925060808501356191398161a0dc565b600080600083850360a0811215619364578182fd5b6060811215619371578182fd5b5061937c606061a02c565b84518152602085015160058110619391578283fd5b602082015260408501516193a48161a124565b604082015260608501519093506193ba8161a124565b608085015190925061877f8161a0f1565b6000602082840312156193dc578081fd5b815162ffffff81168114613db2578182fd5b60008060408385031215619400578182fd5b505080516020909101519092909150565b60008060008060808587031215619426578182fd5b505082516020840151604085015160609095015191969095509092509050565b600080600080600060a0868803121561945d578283fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b6001600160a01b0316815260200190565b600081518352602082015160208401526040820151604084015260608201516060840152608082015160a060808501526111fb60a0850182619552565b6001600160a01b03169052565b6000815180845260208085019450808401835b838110156195185781516001600160a01b0316875295820195908201906001016194f3565b509495945050505050565b6000815180845260208085019450808401835b8381101561951857815187529582019590820190600101619536565b6000815180845261956a81602086016020860161a09f565b601f01601f19169290920160200192915050565b80516001600160a01b031682526020808201516001600160e01b03199081169184019190915260409182015116910152565b80516001600160a01b039081168352602080830151151590840152604080830151909116908301526060908101511515910152565b6000815183526020820151604060208501526111fb6040850182619552565b600081518352602082015160018060a01b0380821660208601528060408501511660408601528060608501511660608601525050608082015160a060808501526111fb60a0850182619552565b61965c8282516194d3565b602081015161966e60208401826194d3565b5060408101516196816040840182619751565b5060608101516196946060840182619751565b5060808101516196a76080840182619751565b5060a08101516196ba60a08401826194d3565b5060c08101516196cd60c08401826194d3565b5060e08101516196e060e08401826194d3565b50610100808201516196f4828501826194d3565b50506101208181015190830152610140808201516197148285018261975e565b505061016090810151910152565b805161972d8161a0cf565b825260208181015160ff169083015260408082015190830152606090810151910152565b6001600160801b03169052565b6001600160401b03169052565b6000828483379101908152919050565b6000825161978d81846020870161a09f565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03948516815292841660208401529083166040830152909116606082015260800190565b6001600160a01b03858116825284811660208301528316604082015260806060820181905260009061622f90830184619523565b6001600160a01b039485168152928416602084015292166040820152606081019190915260800190565b6001600160a01b039384168152919092166020820152901515604082015260600190565b6001600160a01b03858116825284166020820152821515604082015260806060820181905260009061622f90830184619552565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a06080820181905260009061991d90830184619552565b979650505050505050565b6001600160a01b038416815260606020820181905260009061994c908301856194e0565b828103604084015261622f8185619523565b6001600160a01b038516815260006199758561a0cf565b8460208301526080604083015261998f6080830185619523565b828103606084015261991d8185619523565b6001600160a01b038981168252600090610100906199be8b61a0cf565b8a60208501528160408501526199d68285018b619523565b915083820360608501526199ea828a619523565b908816608085015290506199fd8661a0cf565b8560a084015282810360c0840152619a158186619523565b905082810360e0840152619a298185619523565b9b9a5050505050505050505050565b6001600160a01b03831681526040602082018190526000906111fb90830184619604565b600060408252619a6f60408301856194e0565b82810360208401526112698185619523565b600060408252619a9460408301856194e0565b90508260208301529392505050565b60006040820160408352808551808352606085019150602092506060838202860101838801855b83811015619af857605f19888403018552619ae6838351619552565b94860194925090850190600101619aca565b505085810384870152617a918188619523565b60208082528251828201819052600091906040908185019080840286018301878501865b83811015619b7257888303603f1901855281518051878552619b5388860182619552565b9189015115159489019490945294870194925090860190600101619b2f565b509098975050505050505050565b600060208252613db26020830184619523565b901515815260200190565b83151581526001600160a01b038316602082015260606040820181905260009061126990830184619523565b90815260200190565b60008482526060602083015261994c6060830185619552565b600060208252613db26020830184619552565b600060408252619a946040830185619552565b6001600160a01b03938416815291909216602082015262ffffff909116604082015260600190565b6001600160a01b03831681526040602082018190526000906111fb90830184619523565b60608101619c6b8561a0cf565b938152602081019290925260409091015290565b6060810160088510619c6b57fe5b600060e08201619c9c8761a094565b8352602060e081850152818751619cb38185619bca565b91508193508281028201838a01865b83811015619cec578683038552619cda838351619496565b94860194925090850190600101619cc2565b5050868103604088015280945088519250619d078382619bca565b94505050818701845b82811015619d3157619d23858351619485565b945090830190600101619d10565b505050508091505061126960608301846195b0565b600f93840b81529190920b6020820152604081019190915260600190565b600f83900b815260808101613db2602083018461957e565b60208082526024908201527f556e6973776170563353616d706c65722f746f6b656e5061746820746f6f20736040820152631a1bdc9d60e21b606082015260800190565b60208082526025908201527f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e6040820152642fa820a4a960d91b606082015260800190565b60208082526025908201527f556e6973776170563353616d706c65722f696e76616c69642070617468206c656040820152646e6774687360d81b606082015260800190565b6000619e56828761957e565b84600f0b606083015283600f0b608083015260c060a083015261622f60c0830184619523565b600060608252619e8f60608301866195e5565b8281036020840152619ea181866195e5565b915050826040830152949350505050565b600060808252619ec56080830187619604565b6001600160a01b0395861660208401529390941660408201526060015292915050565b600060808252619efb6080830187619604565b6020830195909552506001600160a01b0392831660408201529116606090910152919050565b6102008101619f308285619651565b613db2610180830184619722565b6102208101619f4d8286619651565b619f5b610180830185619722565b6001600160a01b0392909216610200919091015292915050565b6000838252604060208301526111fb60408301846194e0565b600084825260606020830152619fa760608301856194e0565b828103604084015261622f81856194e0565b958652602086019490945260408501929092526060840152608083015260a082015260c00190565b6000808335601e19843603018112619ff7578283fd5b8301803591506001600160401b0382111561a010578283fd5b60200191503681900382131561a02557600080fd5b9250929050565b6040518181016001600160401b038111828210171561a04a57600080fd5b604052919050565b60006001600160401b0382111561a067578081fd5b5060209081020190565b60006001600160401b0382111561a086578081fd5b50601f01601f191660200190565b8060028110610bac57fe5b60005b8381101561a0ba57818101518382015260200161a0a2565b8381111561a0c9576000848401525b50505050565b6004811061a0d957fe5b50565b6001600160a01b038116811461a0d957600080fd5b801515811461a0d957600080fd5b6001600160e01b03198116811461a0d957600080fd5b80600f0b811461a0d957600080fd5b6001600160801b038116811461a0d957600080fdfea2646970667358221220f1961ccb480a7f3a09293fe737cb4fdcc25cfd3e9a8078be777469b26a0fd9d564736f6c634300060c0033';
ERC20BridgeSamplerContract.contractName = 'ERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=erc20_bridge_sampler.js.map