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
                        ]
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
                        ]
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
                inputs: [],
                name: 'getBlockNumber',
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
                inputs: [],
                name: 'getGasLeft',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'nonpayable',
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        name: 'cToken',
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
                name: 'sampleBuysFromCompound',
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        name: 'uniswapGasUsed',
                        type: 'uint256[]',
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
                        name: 'vault',
                        type: 'address',
                    },
                    {
                        name: 'swapSteps',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'poolId',
                                type: 'bytes32',
                            },
                            {
                                name: 'assetInIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'assetOutIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'amount',
                                type: 'uint256',
                            },
                            {
                                name: 'userData',
                                type: 'bytes',
                            },
                        ]
                    },
                    {
                        name: 'swapAssets',
                        type: 'address[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleMultihopBuysFromBalancerV2',
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
                        name: 'vault',
                        type: 'address',
                    },
                    {
                        name: 'swapSteps',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'poolId',
                                type: 'bytes32',
                            },
                            {
                                name: 'assetInIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'assetOutIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'amount',
                                type: 'uint256',
                            },
                            {
                                name: 'userData',
                                type: 'bytes',
                            },
                        ]
                    },
                    {
                        name: 'swapAssets',
                        type: 'address[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleMultihopSellsFromBalancerV2',
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
                        ]
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
                        ]
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
                        ]
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
                        name: 'cToken',
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
                name: 'sampleSellsFromCompound',
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        name: 'uniswapGasUsed',
                        type: 'uint256[]',
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
            const links = artifact.compilerOutput.evm.bytecode.linkReferences || {};
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [callDatas
                ]);
            },
        };
    }
    ;
    encodeKyberHint(opts, reserveId, takerToken, makerToken) {
        const self = this;
        assert_1.assert.isString('reserveId', reserveId);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        const functionSignature = 'encodeKyberHint((uint256,address,address,address,bytes),bytes32,address,address)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    reserveId,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase()
                ]);
            },
        };
    }
    ;
    getAllowanceOf(tokens, account, spender) {
        const self = this;
        assert_1.assert.isArray('tokens', tokens);
        assert_1.assert.isString('account', account);
        assert_1.assert.isString('spender', spender);
        const functionSignature = 'getAllowanceOf(address[],address,address)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [tokens,
                    account.toLowerCase(),
                    spender.toLowerCase()
                ]);
            },
        };
    }
    ;
    getBalanceOf(tokens, account) {
        const self = this;
        assert_1.assert.isArray('tokens', tokens);
        assert_1.assert.isString('account', account);
        const functionSignature = 'getBalanceOf(address[],address)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [tokens,
                    account.toLowerCase()
                ]);
            },
        };
    }
    ;
    getBlockNumber() {
        const self = this;
        const functionSignature = 'getBlockNumber()';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, []);
            },
        };
    }
    ;
    getGasLeft() {
        const self = this;
        const functionSignature = 'getGasLeft()';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, []);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [orders,
                    orderSignatures,
                    exchange.toLowerCase()
                ]);
            },
        };
    }
    ;
    /**
     * Get the fillable taker amount of an order, taking into account
 * order state, maker fees, and maker balances.
     */
    getLimitOrderFillableTakerAmount(order, signature, exchange) {
        const self = this;
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getLimitOrderFillableTakerAmount((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256),(uint8,uint8,bytes32,bytes32),address)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [order,
                    signature,
                    exchange.toLowerCase()
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [orders,
                    orderSignatures,
                    exchange.toLowerCase()
                ]);
            },
        };
    }
    ;
    getTokenDecimals(tokens) {
        const self = this;
        assert_1.assert.isArray('tokens', tokens);
        const functionSignature = 'getTokenDecimals(address[])';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [tokens
                ]);
            },
        };
    }
    ;
    isContract(account) {
        const self = this;
        assert_1.assert.isString('account', account);
        const functionSignature = 'isContract(address)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [account.toLowerCase()
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [poolAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [poolInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
    sampleBuysFromCompound(cToken, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('cToken', cToken);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromCompound(address,address,address,uint256[])';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [cToken.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [curveInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [registry.toLowerCase(),
                    offset,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    path,
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [lidoInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [providerAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
    sampleBuysFromMakerPsm(psmInfo, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromMakerPsm((address,bytes32,address),address,address,uint256[])';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [psmInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [registry.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [pool.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [smoothyInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    path,
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [quoter.toLowerCase(),
                    path,
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
    /**
     * Sample buy quotes from Balancer V2 supporting multihops.
      * @param swapSteps Array of swap steps (can be >= 1).
      * @param swapAssets Array of token address for swaps.
      * @param makerTokenAmounts Maker token buy amount for each sample.
     */
    sampleMultihopBuysFromBalancerV2(vault, swapSteps, swapAssets, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('vault', vault);
        assert_1.assert.isArray('swapSteps', swapSteps);
        assert_1.assert.isArray('swapAssets', swapAssets);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleMultihopBuysFromBalancerV2(address,(bytes32,uint256,uint256,uint256,bytes)[],address[],uint256[])';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [vault.toLowerCase(),
                    swapSteps,
                    swapAssets,
                    makerTokenAmounts
                ]);
            },
        };
    }
    ;
    /**
     * Sample sell quotes from Balancer V2 supporting multihops.
      * @param swapSteps Array of swap steps (can be >= 1).
      * @param swapAssets Array of token address for swaps.
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleMultihopSellsFromBalancerV2(vault, swapSteps, swapAssets, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('vault', vault);
        assert_1.assert.isArray('swapSteps', swapSteps);
        assert_1.assert.isArray('swapAssets', swapAssets);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleMultihopSellsFromBalancerV2(address,(bytes32,uint256,uint256,uint256,bytes)[],address[],uint256[])';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [vault.toLowerCase(),
                    swapSteps,
                    swapAssets,
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
    sampleSellFromKyberNetwork(opts, takerToken, makerToken, takerTokenAmount) {
        const self = this;
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isBigNumber('takerTokenAmount', takerTokenAmount);
        const functionSignature = 'sampleSellFromKyberNetwork((uint256,address,address,address,bytes),address,address,uint256)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmount
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [poolAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [poolInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
    sampleSellsFromCompound(cToken, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('cToken', cToken);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromCompound(address,address,address,uint256[])';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [cToken.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [curveInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [registry.toLowerCase(),
                    offset,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    path,
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [opts,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [lidoInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [providerAddress.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [psmInfo,
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [registry.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [pool.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [smoothyInfo,
                    fromTokenIdx,
                    toTokenIdx,
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    takerToken.toLowerCase(),
                    makerToken.toLowerCase(),
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [router.toLowerCase(),
                    path,
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
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
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [quoter.toLowerCase(),
                    path,
                    takerTokenAmounts
                ]);
            },
        };
    }
    ;
    sampleSingleSellFromMooniswapPool(registry, mooniswapTakerToken, mooniswapMakerToken, takerTokenAmount) {
        const self = this;
        assert_1.assert.isString('registry', registry);
        assert_1.assert.isString('mooniswapTakerToken', mooniswapTakerToken);
        assert_1.assert.isString('mooniswapMakerToken', mooniswapMakerToken);
        assert_1.assert.isBigNumber('takerTokenAmount', takerTokenAmount);
        const functionSignature = 'sampleSingleSellFromMooniswapPool(address,address,address,uint256)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [registry.toLowerCase(),
                    mooniswapTakerToken.toLowerCase(),
                    mooniswapMakerToken.toLowerCase(),
                    takerTokenAmount
                ]);
            },
        };
    }
    ;
    sampleTwoHopBuy(firstHopCalls, secondHopCalls, buyAmount) {
        const self = this;
        assert_1.assert.isArray('firstHopCalls', firstHopCalls);
        assert_1.assert.isArray('secondHopCalls', secondHopCalls);
        assert_1.assert.isBigNumber('buyAmount', buyAmount);
        const functionSignature = 'sampleTwoHopBuy(bytes[],bytes[],uint256)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [firstHopCalls,
                    secondHopCalls,
                    buyAmount
                ]);
            },
        };
    }
    ;
    sampleTwoHopSell(firstHopCalls, secondHopCalls, sellAmount) {
        const self = this;
        assert_1.assert.isArray('firstHopCalls', firstHopCalls);
        assert_1.assert.isArray('secondHopCalls', secondHopCalls);
        assert_1.assert.isBigNumber('sellAmount', sellAmount);
        const functionSignature = 'sampleTwoHopSell(bytes[],bytes[],uint256)';
        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
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
                return self._strictEncodeArguments(functionSignature, [firstHopCalls,
                    secondHopCalls,
                    sellAmount
                ]);
            },
        };
    }
    ;
}
exports.ERC20BridgeSamplerContract = ERC20BridgeSamplerContract;
/**
 * @ignore
 */
ERC20BridgeSamplerContract.deployedBytecode = '0x6080604052600436106103545760003560e01c80637f7f4f13116101c6578063bd71ecf6116100f7578063ddd5aa2811610095578063f1ed7fa41161006f578063f1ed7fa414610a5b578063f3868e9c1461054f578063f5a4994d14610a7b578063fc9fe41b14610a9b5761035b565b8063ddd5aa28146109fb578063e78ac04514610a1b578063e8e4af0914610a3b5761035b565b8063c8c74a37116100d1578063c8c74a371461097b578063cc130e831461099b578063cc1621c9146109bb578063d9bca372146109db5761035b565b8063bd71ecf61461091b578063c25c41381461093b578063c83190841461095b5761035b565b80639ea0ff1311610164578063a75e744b1161013e578063a75e744b1461088d578063a76bbec4146108ad578063adc636bf146108cd578063b90cd2fb146108fb5761035b565b80639ea0ff131461082d578063a0295b8b1461084d578063a46984171461086d5761035b565b80639209483b116101a05780639209483b1461079e57806398777748146107be5780639bf3ee35146107de5780639e3f05c3146107fe5761035b565b80637f7f4f131461072f5780638b6d7b441461074f5780638e5a0e071461076f5761035b565b806336052391116102a057806357494b1d1161023e57806366a1ac6b1161021857806366a1ac6b146106a257806368be3cf2146106c2578063706e2f9b146106ef57806374c9d2551461070f5761035b565b806357494b1d146106425780635aae4e53146106625780635d5b674f146106825761035b565b8063494569db1161027a578063494569db146105b15780634edfb5b2146105d157806351be4eaa146105fe5780635505000a146106135761035b565b8063360523911461054f57806340bc03ae1461056f57806342cbb15c1461058f5761035b565b80632339078f1161030d57806329fa4aa0116102e757806329fa4aa0146104c05780632aa64319146104e057806330d6570d1461050f5780633105fec11461052f5761035b565b80632339078f14610460578063252322b314610480578063281e3432146104a05761035b565b8063034eaff9146103605780630496d5dc146103965780631022742b146103c4578063149dab0e146103e457806316279055146104135780631976f526146104405761035b565b3661035b57005b600080fd5b34801561036c57600080fd5b5061038061037b366004619e65565b610abb565b60405161038d919061ae2a565b60405180910390f35b3480156103a257600080fd5b506103b66103b1366004619986565b610cdd565b60405161038d92919061adaf565b3480156103d057600080fd5b506103806103df366004619cdf565b610e83565b3480156103f057600080fd5b506104046103ff366004619fbe565b610ff6565b60405161038d9392919061ac7a565b34801561041f57600080fd5b5061043361042e36600461975a565b611156565b60405161038d919061ae3b565b34801561044c57600080fd5b5061038061045b366004619df3565b611160565b34801561046c57600080fd5b5061038061047b366004619f5e565b6112cb565b34801561048c57600080fd5b5061038061049b3660046198c5565b6114f5565b3480156104ac57600080fd5b506103806104bb36600461a199565b6116bf565b3480156104cc57600080fd5b506103806104db366004619ff6565b611914565b3480156104ec57600080fd5b506105006104fb36600461a056565b611983565b60405161038d9392919061ae49565b34801561051b57600080fd5b5061038061052a3660046198c5565b611c60565b34801561053b57600080fd5b5061038061054a366004619986565b611dd4565b34801561055b57600080fd5b5061038061056a36600461a056565b611f58565b34801561057b57600080fd5b5061038061058a366004619ff6565b611fea565b34801561059b57600080fd5b506105a461216b565b60405161038d919061ae76565b3480156105bd57600080fd5b506103b66105cc366004619986565b61216f565b3480156105dd57600080fd5b506105f16105ec36600461a0e8565b6122fb565b60405161038d919061aea4565b34801561060a57600080fd5b506105a4612579565b34801561061f57600080fd5b5061063361062e366004619ec7565b612581565b60405161038d9392919061adf4565b34801561064e57600080fd5b5061038061065d3660046198c5565b612876565b34801561066e57600080fd5b5061063361067d366004619ec7565b612ded565b34801561068e57600080fd5b5061038061069d3660046198c5565b6130d2565b3480156106ae57600080fd5b506103806106bd366004619cdf565b613138565b3480156106ce57600080fd5b506106e26106dd366004619b27565b6131ed565b60405161038d919061ae19565b3480156106fb57600080fd5b5061038061070a366004619bd8565b61334e565b34801561071b57600080fd5b5061040461072a366004619fbe565b613440565b34801561073b57600080fd5b5061038061074a36600461a199565b61344f565b34801561075b57600080fd5b5061038061076a366004619ff6565b61369c565b34801561077b57600080fd5b5061078f61078a366004619b68565b6139ff565b60405161038d9392919061b035565b3480156107aa57600080fd5b506103806107b9366004619ff6565b613c15565b3480156107ca57600080fd5b506103806107d93660046198c5565b613e15565b3480156107ea57600080fd5b506105a46107f936600461a153565b61434e565b34801561080a57600080fd5b5061081e61081936600461a078565b614495565b60405161038d9392919061ae84565b34801561083957600080fd5b506105a4610848366004619931565b6145bb565b34801561085957600080fd5b50610380610868366004619f5e565b6147d1565b34801561087957600080fd5b506103806108883660046198c5565b6149cd565b34801561089957600080fd5b506105006108a83660046199f7565b614b22565b3480156108b957600080fd5b506103806108c8366004619e65565b614c5f565b3480156108d957600080fd5b506108ed6108e83660046198c5565b614e6e565b60405161038d92919061af09565b34801561090757600080fd5b506103806109163660046198c5565b614fbe565b34801561092757600080fd5b50610380610936366004619c0c565b615024565b34801561094757600080fd5b506103806109563660046198c5565b615120565b34801561096757600080fd5b506103806109763660046198c5565b615186565b34801561098757600080fd5b50610380610996366004619986565b615343565b3480156109a757600080fd5b506103806109b6366004619df3565b6154af565b3480156109c757600080fd5b5061081e6109d636600461a078565b615621565b3480156109e757600080fd5b506105006109f63660046199f7565b615807565b348015610a0757600080fd5b50610500610a1636600461a056565b6158f6565b348015610a2757600080fd5b50610380610a36366004619c52565b615b89565b348015610a4757600080fd5b50610380610a563660046198c5565b615c7e565b348015610a6757600080fd5b506105a4610a7636600461a0b0565b615db1565b348015610a8757600080fd5b506108ed610a963660046198c5565b615f50565b348015610aa757600080fd5b5061078f610ab6366004619b68565b61603c565b8051606090806001600160401b0381118015610ad657600080fd5b50604051908082528060200260200182016040528015610b00578160200160208202803683370190505b5091506000866001600160a01b031663182df0f56040518163ffffffff1660e01b815260040160206040518083038186803b158015610b3e57600080fd5b505afa158015610b52573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b769190619da1565b90506000876001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015610bb357600080fd5b505afa158015610bc7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610beb919061a39d565b60ff169050876001600160a01b0316866001600160a01b03161415610c635760005b83811015610c5d5781600a0a6402540be4000283878381518110610c2d57fe5b60200260200101510281610c3d57fe5b04858281518110610c4a57fe5b6020908102919091010152600101610c0d565b50610cd2565b876001600160a01b0316876001600160a01b03161415610cd25760005b83811015610cd0578282600a0a6402540be400888481518110610c9f57fe5b6020026020010151020281610cb057fe5b04858281518110610cbd57fe5b6020908102919091010152600101610c80565b505b505050949350505050565b80516060908190806001600160401b0381118015610cfa57600080fd5b50604051908082528060200260200182016040528015610d24578160200160208202803683370190505b509150610d318686616251565b9250825160001415610d435750610e7b565b60005b81811015610e7857866001600160a01b031663a8312b1d620249f0878481518110610d6d57fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401610d959392919061b12b565b60006040518083038187803b158015610dad57600080fd5b5086fa93505050508015610de357506040513d6000823e601f3d908101601f19168201604052610de09190810190619d4f565b60015b610e1d573d808015610e11576040519150601f19603f3d011682016040523d82523d6000602084013e610e16565b606091505b5050610e78565b80600188510381518110610e2d57fe5b6020026020010151848381518110610e4157fe5b602002602001018181525050838281518110610e5957fe5b602002602001015160001415610e6f5750610e78565b50600101610d46565b50505b935093915050565b606083516001600160401b0381118015610e9c57600080fd5b50604051908082528060200260200182016040528015610ec6578160200160208202803683370190505b50905060005b84518114610fee57306001600160a01b0316639bf3ee3562030d40878481518110610ef357fe5b6020026020010151878581518110610f0757fe5b6020026020010151876040518563ffffffff1660e01b8152600401610f2e9392919061b0e0565b60206040518083038187803b158015610f4657600080fd5b5086fa93505050508015610f77575060408051601f3d908101601f19168201909252610f7491810190619da1565b60015b610fcb573d808015610fa5576040519150601f19603f3d011682016040523d82523d6000602084013e610faa565b606091505b506000838381518110610fb957fe5b60200260200101818152505050610fe6565b80838381518110610fd857fe5b602002602001018181525050505b600101610ecc565b509392505050565b60006060808660200151516000141561100e5761114c565b61101a87878787616541565b855191945092506001600160401b038111801561103657600080fd5b50604051908082528060200260200182016040528015611060578160200160208202803683370190505b50905060005b815181101561114a57836001600160a01b0316637f9c0ecd620493e08588858151811061108f57fe5b60200260200101516040518463ffffffff1660e01b81526004016110b492919061add4565b60206040518083038187803b1580156110cc57600080fd5b5086fa935050505080156110fd575060408051601f3d908101601f191682019092526110fa91810190619da1565b60015b6111065761114a565b8083838151811061111357fe5b60200260200101818152505082828151811061112b57fe5b602002602001015160001415611141575061114a565b50600101611066565b505b9450945094915050565b803b15155b919050565b8051606090806001600160401b038111801561117b57600080fd5b506040519080825280602002602001820160405280156111a5578160200160208202803683370190505b5091506111b0618916565b6111b8616773565b905060005b82811015610cd2578481815181106111d157fe5b6020026020010151876000815181106111e657fe5b602090810291909101015160600152604051637c26833760e11b81526001600160a01b0389169063f84d066e90611228906001908b908b90889060040161af52565b600060405180830381600087803b15801561124257600080fd5b505af192505050801561127757506040513d6000823e601f3d908101601f191682016040526112749190810190619cab565b60015b61128057610cd2565b60008160008151811061128f57fe5b60200260200101519050600081136112a8575050610cd2565b808684815181106112b557fe5b60200260200101818152505050506001016111bd565b60606112d783856167a2565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061130d57fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061133b57fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561136b57600080fd5b50604051908082528060200260200182016040528015611395578160200160208202803683370190505b5093506113a0618916565b6113a8616773565b905060005b828110156114e85760606113d48b8984815181106113c757fe5b60200260200101516167e1565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e9061140a9060009085908a90899060040161af52565b600060405180830381600087803b15801561142457600080fd5b505af192505050801561145957506040513d6000823e601f3d908101601f191682016040526114569190810190619cab565b60015b611494573d808015611487576040519150601f19603f3d011682016040523d82523d6000602084013e61148c565b606091505b5050506114e8565b6000816001835103815181106114a657fe5b6020026020010151600019029050600081136114c4575050506114e8565b808985815181106114d157fe5b6020026020010181815250505050506001016113ad565b5050505050949350505050565b606061150183856167a2565b8151806001600160401b038111801561151957600080fd5b50604051908082528060200260200182016040528015611543578160200160208202803683370190505b50915060006001600160a01b03861615611566576115618787616873565b611569565b60005b905060006001600160a01b0386161561158b576115868887616873565b61158e565b60005b905060005b83811015610cd05760016001600160a01b0388166115f1576115d084632640f62c60e01b8985815181106115c357fe5b60200260200101516168f2565b8784815181106115dc57fe5b6020026020010181935082815250505061168b565b6001600160a01b038916611617576115d0836359e9486260e01b8985815181106115c357fe5b6000611631846359e9486260e01b8a86815181106115c357fe5b92509050801561166e5761164d856309903d8b60e21b836168f2565b88858151811061165957fe5b60200260200101819450828152505050611689565b600087848151811061167c57fe5b6020026020010181815250505b505b8015806116ab575085828151811061169f57fe5b60200260200101516000145b156116b65750610cd0565b50600101611593565b60606116cb83856167a2565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b15801561170f57600080fd5b505afa158015611723573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117479190619778565b8451909150806001600160401b038111801561176257600080fd5b5060405190808252806020026020018201604052801561178c578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156117c857600080fd5b505afa1580156117dc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118009190619778565b6001600160a01b0316866001600160a01b0316141580156118a35750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561185557600080fd5b505afa158015611869573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061188d9190619778565b6001600160a01b0316876001600160a01b031614155b156118b05750505061190c565b60005b81811015610cd05760006118de8a898b8a86815181106118cf57fe5b602002602001015189896169d5565b9050806118eb5750610cd0565b808683815181106118f857fe5b6020908102919091010152506001016118b3565b949350505050565b60408051606081810190925261197a908061193386896080840161afb0565b6040516020818303038152906040528152602001868860405160200161195a92919061afb0565b6040516020818303038152906040528152602001616c9681525083616dc9565b95945050505050565b600080606061199285876167a2565b8351806001600160401b03811180156119aa57600080fd5b506040519080825280602002602001820160405280156119d4578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c690611a07908a908a9060040161ab14565b60206040518083038186803b158015611a1f57600080fd5b505afa158015611a33573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a579190619778565b925060006001600160a01b03841615611a7557506001935086611b14565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690611aa6908a908c9060040161ab14565b60206040518083038186803b158015611abe57600080fd5b505afa158015611ad2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611af69190619778565b93506001600160a01b038416611b0d57505061114c565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b158015611b4d57600080fd5b505afa158015611b61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b859190619d83565b611b9057505061114c565b60005b82811015611c53576000611c0d8a87858e60200151604051602001611bbb949392919061ab2f565b6040516020818303038152906040528a88868f60200151604051602001611be5949392919061ab2f565b6040516020818303038152906040528a8581518110611c0057fe5b6020026020010151616fdb565b905080858381518110611c1c57fe5b602002602001018181525050848281518110611c3457fe5b602002602001015160001415611c4a5750611c53565b50600101611b93565b5050509450945094915050565b6060611c6c83856167a2565b8151806001600160401b0381118015611c8457600080fd5b50604051908082528060200260200182016040528015611cae578160200160208202803683370190505b50915060005b81811015611dca57866001600160a01b03166372ea9076620c35008888888681518110611cdd57fe5b60200260200101516040518563ffffffff1660e01b8152600401611d039392919061ac00565b60206040518083038187803b158015611d1b57600080fd5b5086fa93505050508015611d4c575060408051601f3d908101601f19168201909252611d4991810190619da1565b60015b611d86573d808015611d7a576040519150601f19603f3d011682016040523d82523d6000602084013e611d7f565b606091505b5050611dca565b80848381518110611d9357fe5b602002602001018181525050838281518110611dab57fe5b602002602001015160001415611dc15750611dca565b50600101611cb4565b5050949350505050565b8051606090806001600160401b0381118015611def57600080fd5b50604051908082528060200260200182016040528015611e19578160200160208202803683370190505b50915060005b81811015611f4f57856001600160a01b031663d06ca61f620249f0868481518110611e4657fe5b6020026020010151886040518463ffffffff1660e01b8152600401611e6c92919061b10b565b60006040518083038187803b158015611e8457600080fd5b5086fa93505050508015611eba57506040513d6000823e601f3d908101601f19168201604052611eb79190810190619d4f565b60015b611ef4573d808015611ee8576040519150601f19603f3d011682016040523d82523d6000602084013e611eed565b606091505b5050611f4f565b80600187510381518110611f0457fe5b6020026020010151848381518110611f1857fe5b602002602001018181525050838281518110611f3057fe5b602002602001015160001415611f465750611f4f565b50600101611e1f565b50509392505050565b6060611f6483856167a2565b84602001516001600160a01b0316846001600160a01b0316141580611f96575084516001600160a01b03848116911614155b15610fee5781516060816001600160401b0381118015611fb557600080fd5b50604051908082528060200260200182016040528015611fdf578160200160208202803683370190505b50925061190c915050565b8051606090806001600160401b038111801561200557600080fd5b5060405190808252806020026020018201604052801561202f578160200160208202803683370190505b50915060005b81811015611dca576000606088600001516001600160a01b0316621e84808a602001518a8a8a888151811061206657fe5b60200260200101516040516024016120809392919061af95565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516120be919061aadf565b6000604051808303818686fa925050503d80600081146120fa576040519150601f19603f3d011682016040523d82523d6000602084013e6120ff565b606091505b50915091506000821561212357818060200190518101906121209190619da1565b90505b8086858151811061213057fe5b60200260200101818152505085848151811061214857fe5b60200260200101516000141561216057505050611dca565b505050600101612035565b4390565b80516060908190806001600160401b038111801561218c57600080fd5b506040519080825280602002602001820160405280156121b6578160200160208202803683370190505b5091506121c38686616251565b92508251600014156121d55750610e7b565b60005b81811015610e7857866001600160a01b0316639e269b68620249f08784815181106121ff57fe5b6020026020010151878a6040518563ffffffff1660e01b81526004016122279392919061b12b565b60006040518083038187803b15801561223f57600080fd5b5086fa9350505050801561227557506040513d6000823e601f3d908101601f191682016040526122729190810190619d4f565b60015b6122a3573d808015610e11576040519150601f19603f3d011682016040523d82523d6000602084013e610e16565b806000815181106122b057fe5b60200260200101518483815181106122c457fe5b6020026020010181815250508382815181106122dc57fe5b6020026020010151600014156122f25750610e78565b506001016121d8565b6020848101516040805160018082528183019092526060938492908281019080368337019050509050858160008151811061233257fe5b60209081029190910101526060600060405190808252806020026020018201604052801561236a578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b0316141561245b576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a120906123c39089906001908890889060040161acae565b60006040518083038187803b1580156123db57600080fd5b5086fa9350505050801561241157506040513d6000823e601f3d908101601f1916820160405261240e9190810190619dbf565b60015b61244b573d80801561243f576040519150601f19603f3d011682016040523d82523d6000602084013e612444565b606091505b5050612456565b935061190c92505050565b610cd2565b87606001516001600160a01b0316856001600160a01b031614156124b1576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a120906123c3908a906001908890889060040161acae565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a120906124f1908a90600190889088908d9084908490849060040161acef565b60006040518083038187803b15801561250957600080fd5b5086fa9350505050801561253f57506040513d6000823e601f3d908101601f1916820160405261253c9190810190619dbf565b60015b61244b573d80801561256d576040519150601f19603f3d011682016040523d82523d6000602084013e612572565b606091505b5050610cd2565b60005a905090565b606080606080612603876001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156125c357600080fd5b505afa1580156125d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125fb9190619ea9565b876000617114565b905084516001600160401b038111801561261c57600080fd5b50604051908082528060200260200182016040528015612646578160200160208202803683370190505b50915084516001600160401b038111801561266057600080fd5b5060405190808252806020026020018201604052801561269457816020015b606081526020019060019003908161267f5790505b50935084516001600160401b03811180156126ae57600080fd5b506040519080825280602002602001820160405280156126d8578160200160208202803683370190505b50925060005b855181101561286b576000805b83518110156127fd5760606127138a86848151811061270657fe5b60200260200101516175b4565b90508a6001600160a01b031663cdca1753620aae60838c888151811061273557fe5b60200260200101516040518463ffffffff1660e01b815260040161275a92919061aeb5565b600060405180830381600088803b15801561277457600080fd5b5087f1935050505080156127aa57506040513d6000823e601f3d908101601f191682016040526127a7919081019061a23e565b60015b6127b3576127f4565b8387116127ef57839650848c89815181106127ca57fe5b6020026020010181905250808b89815181106127e257fe5b6020026020010181815250505b505050505b506001016126eb565b508061284a576040518060200160405280600081525086838151811061281f57fe5b6020026020010181905250600085838151811061283857fe5b6020026020010181815250505061286b565b8084838151811061285757fe5b6020908102919091010152506001016126de565b505093509350939050565b80516060908590806001600160401b038111801561289357600080fd5b506040519080825280602002602001820160405280156128bd578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b624906128ed90899060040161aaeb565b60206040518083038186803b15801561290557600080fd5b505afa158015612919573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061293d9190619d83565b15806129c25750604051630bcded8960e21b81526001600160a01b03831690632f37b6249061297090889060040161aaeb565b60206040518083038186803b15801561298857600080fd5b505afa15801561299c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129c09190619d83565b155b156129ce57505061190c565b6129d661893d565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612a02908a9060040161aaeb565b60206040518083038186803b158015612a1a57600080fd5b505afa158015612a2e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a529190619da1565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612a8090899060040161aaeb565b60206040518083038186803b158015612a9857600080fd5b505afa158015612aac573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ad09190619da1565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690612b01908a9060040161aaeb565b60206040518083038186803b158015612b1957600080fd5b505afa158015612b2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b519190619da1565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690612b8490899060040161aaeb565b60206040518083038186803b158015612b9c57600080fd5b505afa158015612bb0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bd49190619da1565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015612c1657600080fd5b505afa158015612c2a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c4e9190619da1565b608082015260005b82811015610cd057612c8182602001516003670de0b6b3a764000081612c7857fe5b0460010161770f565b868281518110612c8d57fe5b60200260200101511115612ca057610cd0565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c8881518110612cd357fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401612d019695949392919061b15f565b60206040518083038187803b158015612d1957600080fd5b5086fa93505050508015612d4a575060408051601f3d908101601f19168201909252612d4791810190619da1565b60015b612d84573d808015612d78576040519150601f19603f3d011682016040523d82523d6000602084013e612d7d565b606091505b5050610cd0565b8251612d9c906002670de0b6b3a76400005b0461770f565b811115612da95750610cd0565b80868381518110612db657fe5b602002602001018181525050858281518110612dce57fe5b602002602001015160001415612de45750610cd0565b50600101612c56565b606080606080612e2f876001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156125c357600080fd5b90506060612e3c8761776c565b905085516001600160401b0381118015612e5557600080fd5b50604051908082528060200260200182016040528015612e7f578160200160208202803683370190505b50925085516001600160401b0381118015612e9957600080fd5b50604051908082528060200260200182016040528015612ecd57816020015b6060815260200190600190039081612eb85790505b50945085516001600160401b0381118015612ee757600080fd5b50604051908082528060200260200182016040528015612f11578160200160208202803683370190505b50935060005b86518110156130c6576000805b8451811015613058576060612f5485612f4f888581518110612f4257fe5b6020026020010151617804565b6175b4565b90508b6001600160a01b0316632f80bb1d620aae60838d8881518110612f7657fe5b60200260200101516040518463ffffffff1660e01b8152600401612f9b92919061aeb5565b600060405180830381600088803b158015612fb557600080fd5b5087f193505050508015612feb57506040513d6000823e601f3d908101601f19168201604052612fe8919081019061a23e565b60015b612ff45761304f565b8615806130015750838710155b1561304a578396506130198f8b888151811061270657fe5b8d898151811061302557fe5b6020026020010181905250808c898151811061303d57fe5b6020026020010181815250505b505050505b50600101612f24565b50806130a5576040518060200160405280600081525087838151811061307a57fe5b6020026020010181905250600086838151811061309357fe5b602002602001018181525050506130c6565b808583815181106130b257fe5b602090810291909101015250600101612f17565b50505093509350939050565b60408051606081810190925261197a90806130f186896080840161ab14565b6040516020818303038152906040528152602001868860405160200161311892919061ab14565b604051602081830303815290604052815260200161789c81525083616dc9565b6060613145848484610e83565b905060005b8451811015610fee5781818151811061315f57fe5b60200260200101516000146131e5576131cc82828151811061317d57fe5b602002602001015186838151811061319157fe5b6020026020010151606001516001600160801b03168784815181106131b257fe5b6020026020010151604001516001600160801b03166179b0565b8282815181106131d857fe5b6020026020010181815250505b60010161314a565b6060816001600160401b038111801561320557600080fd5b5060405190808252806020026020018201604052801561323f57816020015b61322c61896c565b8152602001906001900390816132245790505b50905060005b80831461334757600182828151811061325a57fe5b60209081029190910181015191151591015283838281811061327857fe5b905060200281019061328a919061b1ae565b151590506132975761333f565b308484838181106132a457fe5b90506020028101906132b6919061b1ae565b6040516132c492919061aad2565b6000604051808303816000865af19150503d8060008114613301576040519150601f19603f3d011682016040523d82523d6000602084013e613306565b606091505b5083838151811061331357fe5b602002602001015160200184848151811061332a57fe5b60209081029190910101519190915290151590525b600101613245565b5092915050565b606081516001600160401b038111801561336757600080fd5b50604051908082528060200260200182016040528015613391578160200160208202803683370190505b50905060005b8251811461343a577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168382815181106133d557fe5b60200260200101516001600160a01b031614613415576134108382815181106133fa57fe5b60200260200101516001600160a01b03166179d4565b613418565b60125b60ff1682828151811061342757fe5b6020908102919091010152600101613397565b50919050565b60006060809450945094915050565b606061345b83856167a2565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b15801561349f57600080fd5b505afa1580156134b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906134d79190619778565b8451909150806001600160401b03811180156134f257600080fd5b5060405190808252806020026020018201604052801561351c578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561355857600080fd5b505afa15801561356c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906135909190619778565b6001600160a01b0316866001600160a01b0316141580156136335750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156135e557600080fd5b505afa1580156135f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061361d9190619778565b6001600160a01b0316876001600160a01b031614155b156136405750505061190c565b60005b81811015610cd057600061366e8a898b8a868151811061365f57fe5b60200260200101518989617a80565b90508061367b5750610cd0565b8086838151811061368857fe5b602090810291909101015250600101613643565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b81526004016136d3919061ae76565b60206040518083038186803b1580156136eb57600080fd5b505afa1580156136ff573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906137239190619da1565b8651604051631e01043960e01b81526001600160a01b0390911690631e0104399061375690600f89900b9060040161ae76565b60206040518083038186803b15801561376e57600080fd5b505afa158015613782573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906137a69190619da1565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b81526004016137de919061ae76565b60806040518083038186803b1580156137f657600080fd5b505afa15801561380a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061382e919061a2f1565b935050505080601203600a0a828161384257fe5b85519190049250806001600160401b038111801561385f57600080fd5b50604051908082528060200260200182016040528015613889578160200160208202803683370190505b50935060005b81811015610cd057600060608a600001516001600160a01b0316620927c08c602001518c8c8c88815181106138c057fe5b60200260200101516040516024016138da9392919061af95565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613918919061aadf565b6000604051808303818686fa925050503d8060008114613954576040519150601f19603f3d011682016040523d82523d6000602084013e613959565b606091505b50915091506000821561397d578180602001905181019061397a9190619da1565b90505b8681106139b757835b858110156139ae578789828151811061399b57fe5b6020908102919091010152600101613986565b50505050610cd0565b808885815181106139c457fe5b6020026020010181815250508784815181106139dc57fe5b6020026020010151600014156139f457505050610cd0565b50505060010161388f565b613a07618984565b613a0f618984565b600080805b87518114613b1457613a5b6020898381518110613a2d57fe5b60200260200101515103878a8481518110613a4457fe5b6020026020010151617d129092919063ffffffff16565b60006060306001600160a01b03168a8481518110613a7557fe5b6020026020010151604051613a8a919061aadf565b6000604051808303816000865af19150503d8060008114613ac7576040519150601f19603f3d011682016040523d82523d6000602084013e613acc565b606091505b50915091508115613b0a576000613af0602083510383617d2290919063ffffffff16565b905084811115613b0857838852602088018290529350835b505b5050600101613a14565b5080613b205750613c0c565b60005b8651811461286b57613b536020888381518110613b3c57fe5b6020026020010151510383898481518110613a4457fe5b60006060306001600160a01b0316898481518110613b6d57fe5b6020026020010151604051613b82919061aadf565b6000604051808303816000865af19150503d8060008114613bbf576040519150601f19603f3d011682016040523d82523d6000602084013e613bc4565b606091505b50915091508115613c02576000613be8602083510383617d2290919063ffffffff16565b905085811115613c0057838752602087018290529450845b505b5050600101613b23565b93509350939050565b60408401516060906001600160e01b031916613c97576040805160608101909152613c909080613c4986896080840161afb0565b60405160208183030381529060405281526020018688604051602001613c7092919061afb0565b6040516020818303038152906040528152602001617d2e81525083616dc9565b905061190c565b8151806001600160401b0381118015613caf57600080fd5b50604051908082528060200260200182016040528015613cd9578160200160208202803683370190505b50915060005b81811015611dca576000606088600001516001600160a01b0316621e84808a604001518a8a8a8881518110613d1057fe5b6020026020010151604051602401613d2a9392919061af95565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613d68919061aadf565b6000604051808303818686fa925050503d8060008114613da4576040519150601f19603f3d011682016040523d82523d6000602084013e613da9565b606091505b509150915060008215613dcd5781806020019051810190613dca9190619da1565b90505b80868581518110613dda57fe5b602002602001018181525050858481518110613df257fe5b602002602001015160001415613e0a57505050611dca565b505050600101613cdf565b80516060908590806001600160401b0381118015613e3257600080fd5b50604051908082528060200260200182016040528015613e5c578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b62490613e8c90899060040161aaeb565b60206040518083038186803b158015613ea457600080fd5b505afa158015613eb8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613edc9190619d83565b1580613f615750604051630bcded8960e21b81526001600160a01b03831690632f37b62490613f0f90889060040161aaeb565b60206040518083038186803b158015613f2757600080fd5b505afa158015613f3b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f5f9190619d83565b155b15613f6d57505061190c565b613f7561893d565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90613fa1908a9060040161aaeb565b60206040518083038186803b158015613fb957600080fd5b505afa158015613fcd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613ff19190619da1565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f9061401f90899060040161aaeb565b60206040518083038186803b15801561403757600080fd5b505afa15801561404b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061406f9190619da1565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce6906140a0908a9060040161aaeb565b60206040518083038186803b1580156140b857600080fd5b505afa1580156140cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906140f09190619da1565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce69061412390899060040161aaeb565b60206040518083038186803b15801561413b57600080fd5b505afa15801561414f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906141739190619da1565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b1580156141b557600080fd5b505afa1580156141c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906141ed9190619da1565b608082015260005b82811015610cd0578151614213906002670de0b6b3a7640000612d96565b86828151811061421f57fe5b6020026020010151111561423257610cd0565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c888151811061426557fe5b602002602001015189608001516040518863ffffffff1660e01b81526004016142939695949392919061b15f565b60206040518083038187803b1580156142ab57600080fd5b5086fa935050505080156142dc575060408051601f3d908101601f191682019092526142d991810190619da1565b60015b61430a573d808015612d78576040519150601f19603f3d011682016040523d82523d6000602084013e612d7d565b8086838151811061431757fe5b60200260200101818152505085828151811061432f57fe5b6020026020010151600014156143455750610cd0565b506001016141f5565b6000808351600381111561435e57fe5b1480614376575060018351600381111561437457fe5b145b8061438c575060408401516001600160801b0316155b806143a2575060608401516001600160801b0316155b156143af5750600061448e565b6143b761899e565b600080846001600160a01b0316631fb0979588886040518363ffffffff1660e01b81526004016143e892919061b0c3565b60a06040518083038186803b15801561440057600080fd5b505afa158015614414573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614438919061a1dd565b9194509250905060018360200151600481111561445157fe5b14158061445c575080155b8061446f575086516001600160a01b0316155b15614480576000935050505061448e565b506001600160801b03169150505b9392505050565b60006060806144a485876167a2565b6144af878787617d82565b9250826144bb5761114c565b60405163276fdad960e11b81523090634edfb5b2906144e4908a9087908b908b9060040161b0a3565b60006040518083038186803b1580156144fc57600080fd5b505afa158015614510573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526145389190810190619dbf565b8760800181905250866080015191506145af6040518060600160405280878a60405160200161456892919061ad81565b6040516020818303038152906040528152602001888a60405160200161458f92919061ad81565b6040516020818303038152906040528152602001617ee981525085616dc9565b90509450945094915050565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b81526004016145ec92919061ab14565b60206040518083038186803b15801561460457600080fd5b505afa158015614618573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061463c9190619778565b90506001600160a01b03811661465657600091505061190c565b60006001600160a01b038616156146e8576040516370a0823160e01b81526001600160a01b038716906370a082319061469390859060040161aaeb565b60206040518083038186803b1580156146ab57600080fd5b505afa1580156146bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906146e39190619da1565b6146f4565b816001600160a01b0316315b9050838110156147095760009250505061190c565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f09061473e908a908a908a9060040161ac00565b60206040518083038187803b15801561475657600080fd5b5086fa93505050508015614787575060408051601f3d908101601f1916820190925261478491810190619da1565b60015b6147c7573d8080156147b5576040519150601f19603f3d011682016040523d82523d6000602084013e6147ba565b606091505b506000935050505061190c565b925061190c915050565b60606147dd83856167a2565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061481357fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061484157fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561487157600080fd5b5060405190808252806020026020018201604052801561489b578160200160208202803683370190505b5093506148a6618916565b6148ae616773565b905060005b828110156114e85760606148cd8b8984815181106113c757fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906149039060019085908a90899060040161af52565b600060405180830381600087803b15801561491d57600080fd5b505af192505050801561495257506040513d6000823e601f3d908101601f1916820160405261494f9190810190619cab565b60015b614980573d808015611487576040519150601f19603f3d011682016040523d82523d6000602084013e61148c565b60008160008151811061498f57fe5b60200260200101519050600081136149a9575050506114e8565b808985815181106149b657fe5b6020026020010181815250505050506001016148b3565b8051606090806001600160401b03811180156149e857600080fd5b50604051908082528060200260200182016040528015614a12578160200160208202803683370190505b50915060005b81811015611dca57866001600160a01b031663343fbcdd62061a808888888681518110614a4157fe5b60200260200101516040518563ffffffff1660e01b8152600401614a679392919061aeee565b60206040518083038187803b158015614a7f57600080fd5b5086fa93505050508015614ab0575060408051601f3d908101601f19168201909252614aad91810190619da1565b60015b614ade573d808015611d7a576040519150601f19603f3d011682016040523d82523d6000602084013e611d7f565b80848381518110614aeb57fe5b602002602001018181525050838281518110614b0357fe5b602002602001015160001415614b195750611dca565b50600101614a18565b6000806060614b3185876167a2565b8351806001600160401b0381118015614b4957600080fd5b50604051908082528060200260200182016040528015614b73578160200160208202803683370190505b509150614b8289898989617fd0565b945092506001600160a01b038316614b9a5750614c54565b60005b81811015614c51576000614c0b898688604051602001614bbf9392919061ab9e565b604051602081830303815290604052898789604051602001614be39392919061ab9e565b604051602081830303815290604052898581518110614bfe57fe5b6020026020010151618125565b905080848381518110614c1a57fe5b602002602001018181525050838281518110614c3257fe5b602002602001015160001415614c485750614c51565b50600101614b9d565b50505b955095509592505050565b8051606090806001600160401b0381118015614c7a57600080fd5b50604051908082528060200260200182016040528015614ca4578160200160208202803683370190505b5091506000866001600160a01b031663182df0f56040518163ffffffff1660e01b815260040160206040518083038186803b158015614ce257600080fd5b505afa158015614cf6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614d1a9190619da1565b90506000876001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015614d5757600080fd5b505afa158015614d6b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614d8f919061a39d565b60ff169050876001600160a01b0316866001600160a01b03161415614e015760005b83811015610c5d578282600a0a6402540be400888481518110614dd057fe5b6020026020010151020281614de157fe5b04858281518110614dee57fe5b6020908102919091010152600101614db1565b876001600160a01b0316876001600160a01b03161415610cd25760005b83811015610cd05781600a0a6402540be4000283878381518110614e3e57fe5b60200260200101510281614e4e57fe5b04858281518110614e5b57fe5b6020908102919091010152600101614e1e565b60006060614e7c84866167a2565b8251806001600160401b0381118015614e9457600080fd5b50604051908082528060200260200182016040528015614ebe578160200160208202803683370190505b50915060005b81811015614f33576000614eed898989898681518110614ee057fe5b60200260200101516145bb565b905080848381518110614efc57fe5b602002602001018181525050838281518110614f1457fe5b602002602001015160001415614f2a5750614f33565b50600101614ec4565b5060405163901754d760e01b81526001600160a01b0388169063901754d790614f62908990899060040161ab14565b60206040518083038186803b158015614f7a57600080fd5b505afa158015614f8e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614fb29190619778565b92505094509492505050565b60408051606081810190925261197a9080614fdd86896080840161ab14565b6040516020818303038152906040528152602001868860405160200161500492919061ab14565b604051602081830303815290604052815260200161821781525083616dc9565b606082516001600160401b038111801561503d57600080fd5b50604051908082528060200260200182016040528015615067578160200160208202803683370190505b50905060005b83518114613347577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168482815181106150ab57fe5b60200260200101516001600160a01b0316146150f5576150f0838583815181106150d157fe5b60200260200101516001600160a01b031661825e90919063ffffffff16565b615101565b826001600160a01b0316315b82828151811061510d57fe5b602090810291909101015260010161506d565b60408051606081810190925261197a908061513f86896080840161ab14565b6040516020818303038152906040528152602001868860405160200161516692919061ab14565b604051602081830303815290604052815260200161832881525083616dc9565b606061519283856167a2565b8151806001600160401b03811180156151aa57600080fd5b506040519080825280602002602001820160405280156151d4578160200160208202803683370190505b50915060006001600160a01b038616156151f7576151f28787616873565b6151fa565b60005b905060006001600160a01b0386161561521c576152178887616873565b61521f565b60005b905060005b83811015610cd05760016001600160a01b03881661527557615254846395b68fe760e01b8985815181106115c357fe5b87848151811061526057fe5b6020026020010181935082815250505061530f565b6001600160a01b03891661529b576152548363cd7724c360e01b8985815181106115c357fe5b60006152b5856395b68fe760e01b8a86815181106115c357fe5b9250905080156152f2576152d18463cd7724c360e01b836168f2565b8885815181106152dd57fe5b6020026020010181945082815250505061530d565b600087848151811061530057fe5b6020026020010181815250505b505b80158061532f575085828151811061532357fe5b60200260200101516000145b1561533a5750610cd0565b50600101615224565b8051606090806001600160401b038111801561535e57600080fd5b50604051908082528060200260200182016040528015615388578160200160208202803683370190505b50915060005b81811015611f4f57856001600160a01b0316631f00ca74620249f08684815181106153b557fe5b6020026020010151886040518463ffffffff1660e01b81526004016153db92919061b10b565b60006040518083038187803b1580156153f357600080fd5b5086fa9350505050801561542957506040513d6000823e601f3d908101601f191682016040526154269190810190619d4f565b60015b615457573d808015611ee8576040519150601f19603f3d011682016040523d82523d6000602084013e611eed565b8060008151811061546457fe5b602002602001015184838151811061547857fe5b60200260200101818152505083828151811061549057fe5b6020026020010151600014156154a65750611f4f565b5060010161538e565b8051606090806001600160401b03811180156154ca57600080fd5b506040519080825280602002602001820160405280156154f4578160200160208202803683370190505b5091506154ff618916565b615507616773565b905060005b82811015610cd25784818151811061552057fe5b60200260200101518760008151811061553557fe5b602090810291909101015160600152604051637c26833760e11b81526001600160a01b0389169063f84d066e90615577906000908b908b90889060040161af52565b600060405180830381600087803b15801561559157600080fd5b505af19250505080156155c657506040513d6000823e601f3d908101601f191682016040526155c39190810190619cab565b60015b6155cf57610cd2565b6000816001835103815181106155e157fe5b6020026020010151600019029050600081136155fe575050610cd2565b8086848151811061560b57fe5b602002602001018181525050505060010161550c565b600060608061563085876167a2565b61563b878787617d82565b9250826156475761114c565b60405163276fdad960e11b81523090634edfb5b290615670908a9087908b908b9060040161b0a3565b60006040518083038186803b15801561568857600080fd5b505afa15801561569c573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526156c49190810190619dbf565b608088018190528451909250806001600160401b03811180156156e657600080fd5b50604051908082528060200260200182016040528015615710578160200160208202803683370190505b50915060005b818110156157fb576000306001600160a01b031663f1ed7fa48b8b8b8b878151811061573e57fe5b60200260200101516040518563ffffffff1660e01b8152600401615765949392919061b069565b60206040518083038186803b15801561577d57600080fd5b505afa158015615791573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906157b59190619da1565b9050808483815181106157c457fe5b6020026020010181815250508382815181106157dc57fe5b6020026020010151600014156157f257506157fb565b50600101615716565b50509450945094915050565b600080606061581685876167a2565b61582288888888617fd0565b935091506001600160a01b03821661583957614c54565b8351806001600160401b038111801561585157600080fd5b5060405190808252806020026020018201604052801561587b578160200160208202803683370190505b5060408051606081019091529092506158e8908061589f898789156080850161ab9e565b60405160208183030381529060405281526020018986886040516020016158c89392919061ab9e565b604051602081830303815290604052815260200161812581525086616dc9565b915050955095509592505050565b600080606061590585876167a2565b8351806001600160401b038111801561591d57600080fd5b50604051908082528060200260200182016040528015615947578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c69061597a908a908a9060040161ab14565b60206040518083038186803b15801561599257600080fd5b505afa1580156159a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906159ca9190619778565b925060006001600160a01b038416156159e857506001935086615a87565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690615a19908a908c9060040161ab14565b60206040518083038186803b158015615a3157600080fd5b505afa158015615a45573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615a699190619778565b93506001600160a01b038416615a8057505061114c565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b158015615ac057600080fd5b505afa158015615ad4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615af89190619d83565b615b0357505061114c565b615b7b60405180606001604052808987858e60200151604051602001615b2c949392919061ab2f565b60405160208183030381529060405281526020018a87858e60200151604051602001615b5b949392919061ab2f565b6040516020818303038152906040528152602001616fdb81525087616dc9565b925050509450945094915050565b606083516001600160401b0381118015615ba257600080fd5b50604051908082528060200260200182016040528015615bcc578160200160208202803683370190505b50905060005b84518114610fee577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316858281518110615c1057fe5b60200260200101516001600160a01b031614615c5c57615c578484878481518110615c3757fe5b60200260200101516001600160a01b03166183dd9092919063ffffffff16565b615c5f565b60005b828281518110615c6b57fe5b6020908102919091010152600101615bd2565b8051606090806001600160401b0381118015615c9957600080fd5b50604051908082528060200260200182016040528015615cc3578160200160208202803683370190505b50915060005b81811015611dca57866001600160a01b031663838e6a22620493e08888888681518110615cf257fe5b60200260200101516040518563ffffffff1660e01b8152600401615d189392919061ac00565b60206040518083038187803b158015615d3057600080fd5b5086fa93505050508015615d61575060408051601f3d908101601f19168201909252615d5e91810190619da1565b60015b615d8f573d808015611d7a576040519150601f19603f3d011682016040523d82523d6000602084013e611d7f565b80848381518110615d9c57fe5b60200260200101818152505050600101615cc9565b600084608001515160001415615dc95750600061190c565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b031614615e035786615e19565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b031614615e3c5786615e52565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b8152600401615e7a95949392919061ac28565b60206040518083038187803b158015615e9257600080fd5b5086fa93505050508015615ec3575060408051601f3d908101601f19168201909252615ec091810190619da1565b60015b615f01573d808015615ef1576040519150601f19603f3d011682016040523d82523d6000602084013e615ef6565b606091505b50600091505061190c565b6000615f0c856184a9565b60ff1690506000615f1c876184a9565b60ff169050670de0b6b3a764000081600a0a83600a0a8786020281615f3d57fe5b0481615f4557fe5b04935050505061190c565b60006060615f5e84866167a2565b8251806001600160401b0381118015615f7657600080fd5b50604051908082528060200260200182016040528015615fa0578160200160208202803683370190505b50915061600b60405180606001604052808988604051602001615fc492919061ab14565b60405160208183030381529060405281526020018989604051602001615feb92919061ab14565b60405160208183030381529060405281526020016184b481525085616dc9565b60405163901754d760e01b81529092506001600160a01b0388169063901754d790614f62908990899060040161ab14565b616044618984565b61604c618984565b6000198060005b8651811461614857616083602088838151811061606c57fe5b6020026020010151510387898481518110613a4457fe5b60006060306001600160a01b031689848151811061609d57fe5b60200260200101516040516160b2919061aadf565b6000604051808303816000865af19150503d80600081146160ef576040519150601f19603f3d011682016040523d82523d6000602084013e6160f4565b606091505b5091509150811561613e576000616118602083510383617d2290919063ffffffff16565b905060008111801561612957508481105b1561613c57838752602087018290529350835b505b5050600101616053565b506000198114156161595750613c0c565b60005b8751811461286b5761618c602089838151811061617557fe5b60200260200101515103838a8481518110613a4457fe5b60006060306001600160a01b03168a84815181106161a657fe5b60200260200101516040516161bb919061aadf565b6000604051808303816000865af19150503d80600081146161f8576040519150601f19603f3d011682016040523d82523d6000602084013e6161fd565b606091505b50915091508115616247576000616221602083510383617d2290919063ffffffff16565b905060008111801561623257508581105b1561624557838852602088018290529450845b505b505060010161615c565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561628e57600080fd5b505afa1580156162a2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906162c69190619778565b905060018351036001600160401b03811180156162e257600080fd5b5060405190808252806020026020018201604052801561630c578160200160208202803683370190505b50915060005b8251811015616538576060826001600160a01b0316635b1dc86f620249f087858151811061633c57fe5b602002602001015188866001018151811061635357fe5b60200260200101516040518463ffffffff1660e01b815260040161637892919061ab14565b60006040518083038187803b15801561639057600080fd5b5086fa935050505080156163c657506040513d6000823e601f3d908101601f191682016040526163c39190810190619a83565b60015b616434573d8080156163f4576040519150601f19603f3d011682016040523d82523d6000602084013e6163f9565b606091505b506000805b50604051908082528060200260200182016040528015616428578160200160208202803683370190505b5094505050505061653b565b8051616442576000806163fe565b6000805b825181101561652c57600083828151811061645d57fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b15801561649d57600080fd5b505afa1580156164b1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906164d59190619da1565b905082811115616523578092508382815181106164ee57fe5b602002602001015188878151811061650257fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616446565b50505050600101616312565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b15801561659557600080fd5b505afa1580156165a9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906165cd9190619da1565b6040518263ffffffff1660e01b81526004016165e9919061ae76565b60206040518083038186803b15801561660157600080fd5b505afa158015616615573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906166399190619778565b91508560200151516000141561664e5761676a565b6000805b8760200151518110156167675760028860200151828151811061667157fe5b60200260200101515110156166855761675f565b836001600160a01b0316637f9c0ecd620493e08a6020015184815181106166a857fe5b60200260200101518860018a5103815181106166c057fe5b60200260200101516040518463ffffffff1660e01b81526004016166e592919061add4565b60206040518083038187803b1580156166fd57600080fd5b5086fa9350505050801561672e575060408051601f3d908101601f1916820190925261672b91810190619da1565b60015b6167375761675f565b8281111561675d578092508860200151828151811061675257fe5b602002602001015193505b505b600101616652565b50505b94509492505050565b61677b618916565b50604080516080810182523080825260006020830181905292820152606081019190915290565b806001600160a01b0316826001600160a01b031614156167dd5760405162461bcd60e51b81526004016167d49061afdb565b60405180910390fd5b5050565b604080516001808252818301909252606091829190816020015b6168036189c0565b8152602001906001900390816167fb5790505090506040518060a00160405280856000015181526020016000815260200160018152602001848152602001604051806020016040528060008152508152508160008151811061686157fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf62906168a290859060040161aaeb565b60206040518083038186803b1580156168ba57600080fd5b505afa1580156168ce573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061448e9190619778565b6000806001600160a01b03851661690857610e7b565b6060856001600160a01b0316620249f0868660405160240161692a919061ae76565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051616968919061aadf565b6000604051808303818686fa925050503d80600081146169a4576040519150601f19603f3d011682016040523d82523d6000602084013e6169a9565b606091505b50909250905081156169cc57808060200190518101906169c99190619da1565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401616a0b919061ae76565b60a06040518083038186803b158015616a2357600080fd5b505afa158015616a37573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616a5b919061a335565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b03161415616b83576000616a9a8964e8d4a51000618504565b90506000616abe6b033b2e3c9fd0803ce8000000616ab8888561853a565b90618504565b9050848110616ad65760009650505050505050616c8c565b6000616b65670de0b6b3a7640000616b5f8c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b158015616b2057600080fd5b505afa158015616b34573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616b589190619da1565b8690618504565b90618556565b90506000616b738483618580565b9850616c8c975050505050505050565b8a604001516001600160a01b03168a6001600160a01b03161415616c83578784811115616bb857600095505050505050616c8c565b6000616bd46b033b2e3c9fd0803ce8000000616ab88885618580565b9050838111616bec5760009650505050505050616c8c565b6000616c718a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b158015616c2a57600080fd5b505afa158015616c3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616c629190619da1565b670de0b6b3a76400009061853a565b90506000616b7382616b5f8688618504565b60009450505050505b9695505050505050565b600080616ca16189f2565b85806020019051810190616cb59190619f2e565b91509150600085806020019051810190616ccf9190619f10565b905060006060306322db5ed160e21b858786616cea8c61859f565b604051602401616cfd949392919061affb565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051616d3b919061aadf565b600060405180830381855afa9150503d8060008114616d76576040519150601f19603f3d011682016040523d82523d6000602084013e616d7b565b606091505b509150915081616d935760009550505050505061448e565b80806020019051810190616da79190619d4f565b600081518110616db357fe5b6020026020010151955050505050509392505050565b606081516001600160401b0381118015616de257600080fd5b50604051908082528060200260200182016040528015616e0c578160200160208202803683370190505b509050815160001415616e1e5761653b565b6000616e4f8460000151856020015185600081518110616e3a57fe5b6020026020010151876040015163ffffffff16565b905080616e5c575061653b565b6000616e798560200151866000015184886040015163ffffffff16565b905080616e8757505061653b565b60005b8451811015616fd2576000805b6005811015616f7b57616ebe878481518110616eaf57fe5b602002602001015185876185e0565b945084616eca57616f7b565b616ed9612715612710876185e0565b945084616ee557616f7b565b6000616f0289602001518a60000151888c6040015163ffffffff16565b905080616f0f5750616f7b565b809450878481518110616f1e57fe5b60200260200101518510616f7257878481518110616f3857fe5b6020026020010151612710898681518110616f4f57fe5b602002602001015187030281616f6157fe5b04925060058311616f725750616f7b565b50600101616e97565b50801580616f895750600581115b15616f945750616fd2565b616fb2868381518110616fa357fe5b602002602001015184866185e0565b858381518110616fbe57fe5b602090810291909101015250600101616e8a565b50505092915050565b600080600080600087806020019051810190616ff791906197d0565b9350935093509350816001600160a01b0316846001600160a01b031614156170e1576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e09061704a908a9060040161ae76565b60206040518083038187803b15801561706257600080fd5b5086fa93505050508015617093575060408051601f3d908101601f1916820190925261709091810190619da1565b60015b6170d5573d8080156170c1576040519150601f19603f3d011682016040523d82523d6000602084013e6170c6565b606091505b5060009550505050505061448e565b945061448e9350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e09061704a9087908b9060040161ada1565b6060600282845103101561713a5760405162461bcd60e51b81526004016167d49061afcb565b617142618a12565b5060408051608081018252606481526101f46020820152610bb8818301526127106060808301919091528251600480825260a0820190945291929091908160200160208202803683370190505090506000808686815181106171a057fe5b6020026020010151905060008787600101815181106171bb57fe5b6020026020010151905060005b60048110156172b05760008a6001600160a01b0316631698ee8285858a86600481106171f057fe5b60200201516040518463ffffffff1660e01b81526004016172139392919061aec6565b60206040518083038186803b15801561722b57600080fd5b505afa15801561723f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906172639190619ea9565b905061726e81618638565b156172a7578086868060010197508151811061728657fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b506001016171c8565b505050806172c05750505061448e565b85518560020114156173b657806001600160401b03811180156172e257600080fd5b5060405190808252806020026020018201604052801561731657816020015b60608152602001906001900390816173015790505b50935060005b818110156173ad5760408051600180825281830190925290602080830190803683370190505085828151811061734e57fe5b602002602001018190525082818151811061736557fe5b602002602001015185828151811061737957fe5b602002602001015160008151811061738d57fe5b6001600160a01b039092166020928302919091019091015260010161731c565b5050505061448e565b60606173c6888888600101617114565b90508051600014156173db575050505061448e565b805182026001600160401b03811180156173f457600080fd5b5060405190808252806020026020018201604052801561742857816020015b60608152602001906001900390816174135790505b50945060005b828110156175a85760005b825181101561759f57825182810282019084908390811061745657fe5b6020026020010151516001016001600160401b038111801561747757600080fd5b506040519080825280602002602001820160405280156174a1578160200160208202803683370190505b508882815181106174ae57fe5b60200260200101819052508583815181106174c557fe5b60200260200101518882815181106174d957fe5b60200260200101516000815181106174ed57fe5b60200260200101906001600160a01b031690816001600160a01b03168152505060005b84838151811061751c57fe5b6020026020010151518110156175955784838151811061753857fe5b6020026020010151818151811061754b57fe5b602002602001015189838151811061755f57fe5b6020026020010151826001018151811061757557fe5b6001600160a01b0390921660209283029190910190910152600101617510565b5050600101617439565b5060010161742e565b50505050509392505050565b606060028351101580156175cc575081516001018351145b6175e85760405162461bcd60e51b81526004016167d49061afeb565b81516003028351601402016001600160401b038111801561760857600080fd5b506040519080825280601f01601f191660200182016040528015617633576020820181803683370190505b5090506020810160005b84518110156165385780156176e257600084600183038151811061765d57fe5b60200260200101516001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b15801561769d57600080fd5b505afa1580156176b1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906176d5919061a220565b60e81b8352506003909101905b60008582815181106176f057fe5b602090810291909101015160601b83525060149091019060010161763d565b6000828202831580159061772c57508284828161772857fe5b0414155b1561773b57600091505061653b565b6706f05b59d3b200008101818110156177595760009250505061653b565b670de0b6b3a76400009004949350505050565b606081516001600160401b038111801561778557600080fd5b506040519080825280602002602001820160405280156177af578160200160208202803683370190505b50905060005b825181101561343a578260018285510303815181106177d057fe5b60200260200101518282815181106177e457fe5b6001600160a01b03909216602092830291909101909101526001016177b5565b606081516001600160401b038111801561781d57600080fd5b50604051908082528060200260200182016040528015617847578160200160208202803683370190505b50905060005b825181101561343a5782600182855103038151811061786857fe5b602002602001015182828151811061787c57fe5b6001600160a01b039092166020928302919091019091015260010161784d565b6000806000858060200190518101906178b59190619796565b915091506000858060200190518101906178cf9190619778565b90503063e8e4af098385846178e38a61859f565b6040518563ffffffff1660e01b8152600401617902949392919061ab64565b60006040518083038186803b15801561791a57600080fd5b505afa92505050801561794f57506040513d6000823e601f3d908101601f1916820160405261794c9190810190619d4f565b60015b617990573d80801561797d576040519150601f19603f3d011682016040523d82523d6000602084013e617982565b606091505b50600094505050505061448e565b8060008151811061799d57fe5b602002602001015194505050505061448e565b600061190c83616b5f6179c4826001618580565b6179ce8887618504565b9061853a565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b815250604051617a12919061aadf565b600060405180830381855afa9150503d8060008114617a4d576040519150601f19603f3d011682016040523d82523d6000602084013e617a52565b606091505b5091509150818015617a6657506020815110155b15617a7957617a76816000617d22565b92505b5050919050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401617ab6919061ae76565b60a06040518083038186803b158015617ace57600080fd5b505afa158015617ae2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617b06919061a335565b945094505050925089604001516001600160a01b0316886001600160a01b03161415617c1d5760008790506000617bb6886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b158015617b6f57600080fd5b505afa158015617b83573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617ba79190619da1565b670de0b6b3a764000090618580565b90506000617bd082616b5f85670de0b6b3a7640000618504565b90506000617bee6b033b2e3c9fd0803ce8000000616ab8898561853a565b9050858110617c07576000975050505050505050616c8c565b6000616b7360016179ce8564e8d4a51000618556565b89604001516001600160a01b0316896001600160a01b03161415617d02576000617c4c8864e8d4a51000618504565b90506000617c8c886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b158015616c2a57600080fd5b90506000617ca6670de0b6b3a7640000616b5f8585618504565b905085811115617cbf5760009650505050505050616c8c565b6000617cdb6b033b2e3c9fd0803ce8000000616ab88985618580565b9050848111617cf4576000975050505050505050616c8c565b509550616c8c945050505050565b5060009998505050505050505050565b617d1d838383618844565b505050565b600061448e838361886b565b600080617d396189f2565b85806020019051810190617d4d9190619f2e565b91509150600085806020019051810190617d679190619f10565b9050600060603063205e01d760e11b858786616cea8c61859f565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b031614617dc05786617dd6565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b031614617df95786617e0f565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b16909152617e439291906001906024810161abc6565b60006040518083038186803b158015617e5b57600080fd5b505afa158015617e6f573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052617e979190810190619ab7565b505090508051866000015110617eb357506000915061448e9050565b80866000015181518110617ec357fe5b6020026020010151925060f883901c60001c60bb1415611f4f57506000915061448e9050565b600080617ef4618a30565b84806020019051810190617f08919061987e565b91509150600086806020019051810190617f22919061987e565b50604051633c7b5fe960e21b8152909150309063f1ed7fa490617f4f908590859088908b9060040161b069565b60206040518083038186803b158015617f6757600080fd5b505afa925050508015617f97575060408051601f3d908101601f19168201909252617f9491810190619da1565b60015b617fc5573d80801561797d576040519150601f19603f3d011682016040523d82523d6000602084013e617982565b935061448e92505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b815260040161800392919061ab14565b60006040518083038186803b15801561801b57600080fd5b505afa15801561802f573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526180579190810190619a83565b9050600191508051600014156180f0576040516315e8a07760e21b81526001600160a01b038816906357a281dc90618095908790899060040161ab14565b60006040518083038186803b1580156180ad57600080fd5b505afa1580156180c1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526180e99190810190619a83565b9050600091505b8051861061810557600080925092505061676a565b80868151811061811157fe5b602002602001015192505094509492505050565b6000806000808680602001905181019061813f9190619831565b92509250925080156181e357604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e09061817f906000908a9060040161aaf9565b604080518083038187803b15801561819657600080fd5b5086fa935050505080156181c7575060408051601f3d908101601f191682019092526181c49181019061a2c1565b60015b6181d7576000935050505061448e565b50935061448e92505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e09061817f906000908a9060040161aaf9565b6000806000858060200190518101906182309190619796565b9150915060008580602001905181019061824a9190619778565b9050306330d6570d8385846178e38a61859f565b6000806060846001600160a01b03166370a0823160e01b85604051602401618286919061aaeb565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516182c4919061aadf565b600060405180830381855afa9150503d80600081146182ff576040519150601f19603f3d011682016040523d82523d6000602084013e618304565b606091505b509150915081801561831857506020815110155b156165385761197a816000617d22565b6000806000858060200190518101906183419190619796565b9150915060008580602001905181019061835b9190619778565b90503063a469841762061a808486856183738b61859f565b6040518663ffffffff1660e01b8152600401618392949392919061ab64565b60006040518083038187803b1580156183aa57600080fd5b5086fa9350505050801561794f57506040513d6000823e601f3d908101601f1916820160405261794c9190810190619d4f565b6000806060856001600160a01b031663dd62ed3e60e01b868660405160240161840792919061ab14565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051618445919061aadf565b600060405180830381855afa9150503d8060008114618480576040519150601f19603f3d011682016040523d82523d6000602084013e618485565b606091505b509150915081801561849957506020815110155b15611f4f57616c8c816000617d22565b600061653b826179d4565b6000806000858060200190518101906184cd9190619796565b91509150600080868060200190518101906184e89190619796565b915091506184f8848483896145bb565b98975050505050505050565b6000826185135750600061653b565b8282028284828161852057fe5b041461448e5761448e61853560018686618895565b6188ef565b60008282018381101561448e5761448e61853560008686618895565b60008161856c5761856c61853560038585618895565b600082848161857757fe5b04949350505050565b6000828211156185995761859961853560028585618895565b50900390565b6040805160018082528183019092526060916020808301908036833701905050905081816000815181106185cf57fe5b602002602001018181525050919050565b60008315806185ed575081155b806185f6575082155b156186035750600061448e565b8382028285828161861057fe5b041461862057600091505061448e565b836001850382018161862e57fe5b0495945050505050565b6000813b8061864b57600091505061115b565b50816001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561868557600080fd5b505afa158015618699573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906186bd9190619ea9565b6001600160a01b03166370a08231836040518263ffffffff1660e01b81526004016186e8919061aaeb565b60206040518083038186803b15801561870057600080fd5b505afa158015618714573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906187389190619da1565b6187445750600061115b565b816001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b15801561877d57600080fd5b505afa158015618791573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906187b59190619ea9565b6001600160a01b03166370a08231836040518263ffffffff1660e01b81526004016187e0919061aaeb565b60206040518083038186803b1580156187f857600080fd5b505afa15801561880c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906188309190619da1565b61883c5750600061115b565b506001919050565b81602001835110156188635761886361853560058551856020016188f7565b910160200152565b6000816020018351101561888c5761888c61853560058551856020016188f7565b50016020015190565b606063e946c1bb60e01b8484846040516024016188b49392919061af29565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b8484846040516024016188b49392919061af44565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b60408051808201909152606081526000602082015290565b604051806040016040528060008152602001606081525090565b6040805160608101909152600080825260208201908152600060209091015290565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b60405180608001604052806004906020820280368337509192915050565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b803561653b8161b3a7565b805161653b8161b3a7565b600082601f830112618aa157600080fd5b8135618ab4618aaf8261b229565b61b203565b91508181835260208401935060208101905083856020840282011115618ad957600080fd5b60005b83811015618b055781618aef8882618a7a565b8452506020928301929190910190600101618adc565b5050505092915050565b600082601f830112618b2057600080fd5b8151618b2e618aaf8261b229565b91508181835260208401935060208101905083856020840282011115618b5357600080fd5b60005b83811015618b055781618b698882618a85565b8452506020928301929190910190600101618b56565b600082601f830112618b9057600080fd5b8135618b9e618aaf8261b229565b81815260209384019390925082018360005b83811015618b055781358601618bc68882618a90565b8452506020928301929190910190600101618bb0565b600082601f830112618bed57600080fd5b8151618bfb618aaf8261b229565b91508181835260208401935060208101905083856020840282011115618c2057600080fd5b60005b83811015618b055781618c3688826190ea565b8452506020928301929190910190600101618c23565b60008083601f840112618c5e57600080fd5b5081356001600160401b03811115618c7557600080fd5b602083019150836020820283011115618c8d57600080fd5b9250929050565b600082601f830112618ca557600080fd5b8135618cb3618aaf8261b229565b81815260209384019390925082018360005b83811015618b055781358601618cdb888261910b565b8452506020928301929190910190600101618cc5565b600082601f830112618d0257600080fd5b8135618d10618aaf8261b229565b91508181835260208401935060208101905083856020840282011115618d3557600080fd5b60005b83811015618b055781618d4b8882619197565b8452506020928301929190910190600101618d38565b600082601f830112618d7257600080fd5b8151618d80618aaf8261b229565b91508181835260208401935060208101905083856020840282011115618da557600080fd5b60005b83811015618b055781618dbb88826190ea565b8452506020928301929190910190600101618da8565b600082601f830112618de257600080fd5b8135618df0618aaf8261b229565b81815260209384019390925082018360005b83811015618b055781358601618e18888261927d565b8452506020928301929190910190600101618e02565b600082601f830112618e3f57600080fd5b8135618e4d618aaf8261b229565b9150818183526020840193506020810190508385610180840282011115618e7357600080fd5b60005b83811015618b055781618e8988826194dc565b8452506020909201916101809190910190600101618e76565b600082601f830112618eb357600080fd5b8135618ec1618aaf8261b229565b91508181835260208401935060208101905083856080840282011115618ee657600080fd5b60005b83811015618b055781618efc8882619693565b84525060209092019160809190910190600101618ee9565b600082601f830112618f2557600080fd5b8151618f33618aaf8261b229565b91508181835260208401935060208101905083856020840282011115618f5857600080fd5b60005b83811015618b055781618f6e8882619718565b8452506020928301929190910190600101618f5b565b600082601f830112618f9557600080fd5b8135618fa3618aaf8261b229565b91508181835260208401935060208101905083856020840282011115618fc857600080fd5b60005b83811015618b055781618fde88826190df565b8452506020928301929190910190600101618fcb565b600082601f83011261900557600080fd5b8151619013618aaf8261b229565b9150818183526020840193506020810190508385602084028201111561903857600080fd5b60005b83811015618b05578161904e88826190ea565b845250602092830192919091019060010161903b565b600082601f83011261907557600080fd5b8151619083618aaf8261b229565b915081818352602084019350602081019050838560208402820111156190a857600080fd5b60005b83811015618b0557816190be888261972e565b84525060209283019291909101906001016190ab565b805161653b8161b3bb565b803561653b8161b3c4565b805161653b8161b3c4565b803561653b8161b3cd565b805161653b8161b3cd565b600082601f83011261911c57600080fd5b813561912a618aaf8261b249565b9150808252602083016020830185838301111561914657600080fd5b616fd283828461b344565b600082601f83011261916257600080fd5b8151619170618aaf8261b249565b9150808252602083016020830185838301111561918c57600080fd5b616fd283828461b350565b803561653b8161b3d6565b805161653b8161b3d6565b805161653b8161b3df565b805161653b8161b3ec565b803561653b8161b3f9565b803561653b8161b406565b805161653b8161b406565b6000604082840312156191f657600080fd5b619200604061b203565b9050600061920e84846190df565b825250602061921f84848301618a7a565b60208301525092915050565b60006040828403121561923d57600080fd5b619247604061b203565b905060006192558484619197565b82525060208201356001600160401b0381111561927157600080fd5b61921f84828501618b7f565b600060a0828403121561928f57600080fd5b61929960a061b203565b905060006192a784846190df565b82525060206192b8848483016190df565b60208301525060406192cc848285016190df565b60408301525060606192e0848285016190df565b60608301525060808201356001600160401b038111156192ff57600080fd5b61930b8482850161910b565b60808301525092915050565b60006060828403121561932957600080fd5b619333606061b203565b905060006193418484618a7a565b8252506020619352848483016190f5565b6020830152506040619366848285016190f5565b60408301525092915050565b60006060828403121561938457600080fd5b61938e606061b203565b9050600061939c8484618a85565b82525060206193ad84848301619100565b602083015250604061936684828501619100565b6000604082840312156193d357600080fd5b6193dd604061b203565b9050600061920e8484618a7a565b600060a082840312156193fd57600080fd5b61940760a061b203565b9050600061941584846190df565b825250602061942684848301618a7a565b602083015250604061943a84828501618a7a565b60408301525060606192e084828501618a7a565b600060a0828403121561946057600080fd5b61946a60a061b203565b9050600061947884846190ea565b825250602061948984848301618a85565b602083015250604061949d84828501618a85565b60408301525060606194b184828501618a85565b60608301525060808201516001600160401b038111156194d057600080fd5b61930b84828501619151565b600061018082840312156194ef57600080fd5b6194fa61018061b203565b905060006195088484619197565b825250602061951984848301619197565b602083015250604061952d84828501619702565b604083015250606061954184828501619702565b606083015250608061955584828501619702565b60808301525060a061956984828501618a7a565b60a08301525060c061957d84828501618a7a565b60c08301525060e061959184828501618a7a565b60e0830152506101006195a684828501618a7a565b610100830152506101206195bc848285016190df565b610120830152506101406195d284828501619739565b610140830152506101606195e8848285016190df565b6101608301525092915050565b60006060828403121561960757600080fd5b619611606061b203565b9050600061961f8484618a7a565b8252506020619630848483016190df565b602083015250604061936684828501618a7a565b60006060828403121561965657600080fd5b619660606061b203565b9050600061966e84846190ea565b825250602061967f848483016191ad565b60208301525060406193668482850161970d565b6000608082840312156196a557600080fd5b6196af608061b203565b905060006196bd84846191c3565b82525060206196ce84848301619744565b60208301525060406196e2848285016190df565b60408301525060606196f6848285016190df565b60608301525092915050565b803561653b8161b40f565b805161653b8161b40f565b805161653b8161b418565b805161653b8161b421565b805161653b8161b42a565b803561653b8161b433565b803561653b8161b43c565b805161653b8161b43c565b60006020828403121561976c57600080fd5b600061190c8484618a7a565b60006020828403121561978a57600080fd5b600061190c8484618a85565b600080604083850312156197a957600080fd5b60006197b58585618a85565b92505060206197c685828601618a85565b9150509250929050565b600080600080608085870312156197e657600080fd5b60006197f28787618a85565b945050602061980387828801618a85565b935050604061981487828801618a85565b925050606061982587828801618a85565b91505092959194509250565b60008060006060848603121561984657600080fd5b60006198528686618a85565b935050602061986386828701618a85565b9250506040619874868287016190d4565b9150509250925092565b6000806040838503121561989157600080fd5b600061989d8585618a85565b92505060208301516001600160401b038111156198b957600080fd5b6197c68582860161944e565b600080600080608085870312156198db57600080fd5b60006198e78787618a7a565b94505060206198f887828801618a7a565b935050604061990987828801618a7a565b92505060608501356001600160401b0381111561992557600080fd5b61982587828801618f84565b6000806000806080858703121561994757600080fd5b60006199538787618a7a565b945050602061996487828801618a7a565b935050604061997587828801618a7a565b9250506060619825878288016190df565b60008060006060848603121561999b57600080fd5b60006199a78686618a7a565b93505060208401356001600160401b038111156199c357600080fd5b6199cf86828701618a90565b92505060408401356001600160401b038111156199eb57600080fd5b61987486828701618f84565b600080600080600060a08688031215619a0f57600080fd5b6000619a1b8888618a7a565b9550506020619a2c888289016190df565b9450506040619a3d88828901618a7a565b9350506060619a4e88828901618a7a565b92505060808601356001600160401b03811115619a6a57600080fd5b619a7688828901618f84565b9150509295509295909350565b600060208284031215619a9557600080fd5b81516001600160401b03811115619aab57600080fd5b61190c84828501618b0f565b600080600060608486031215619acc57600080fd5b83516001600160401b03811115619ae257600080fd5b619aee86828701618bdc565b93505060208401516001600160401b03811115619b0a57600080fd5b619b1686828701618ff4565b9250506040619874868287016191b8565b60008060208385031215619b3a57600080fd5b82356001600160401b03811115619b5057600080fd5b619b5c85828601618c4c565b92509250509250929050565b600080600060608486031215619b7d57600080fd5b83356001600160401b03811115619b9357600080fd5b619b9f86828701618c94565b93505060208401356001600160401b03811115619bbb57600080fd5b619bc786828701618c94565b9250506040619874868287016190df565b600060208284031215619bea57600080fd5b81356001600160401b03811115619c0057600080fd5b61190c84828501618cf1565b60008060408385031215619c1f57600080fd5b82356001600160401b03811115619c3557600080fd5b619c4185828601618cf1565b92505060206197c685828601618a7a565b600080600060608486031215619c6757600080fd5b83356001600160401b03811115619c7d57600080fd5b619c8986828701618cf1565b9350506020619c9a86828701618a7a565b925050604061987486828701618a7a565b600060208284031215619cbd57600080fd5b81516001600160401b03811115619cd357600080fd5b61190c84828501618d61565b600080600060608486031215619cf457600080fd5b83356001600160401b03811115619d0a57600080fd5b619d1686828701618e2e565b93505060208401356001600160401b03811115619d3257600080fd5b619d3e86828701618ea2565b925050604061987486828701619197565b600060208284031215619d6157600080fd5b81516001600160401b03811115619d7757600080fd5b61190c84828501618ff4565b600060208284031215619d9557600080fd5b600061190c84846190d4565b600060208284031215619db357600080fd5b600061190c84846190ea565b600060208284031215619dd157600080fd5b81516001600160401b03811115619de757600080fd5b61190c84828501619151565b60008060008060808587031215619e0957600080fd5b6000619e158787619197565b94505060208501356001600160401b03811115619e3157600080fd5b619e3d87828801618dd1565b93505060408501356001600160401b03811115619e5957600080fd5b61990987828801618a90565b60008060008060808587031215619e7b57600080fd5b6000619e878787619197565b9450506020619e9887828801619197565b935050604061990987828801619197565b600060208284031215619ebb57600080fd5b600061190c84846191a2565b600080600060608486031215619edc57600080fd5b6000619ee88686619197565b93505060208401356001600160401b03811115619f0457600080fd5b6199cf86828701618cf1565b600060208284031215619f2257600080fd5b600061190c84846191d9565b60008060808385031215619f4157600080fd5b6000619f4d85856191d9565b92505060206197c685828601619372565b60008060008060a08587031215619f7457600080fd5b6000619f8087876191e4565b9450506040619f9187828801618a7a565b9350506060619fa287828801618a7a565b92505060808501356001600160401b0381111561992557600080fd5b60008060008060808587031215619fd457600080fd5b84356001600160401b03811115619fea57600080fd5b6198e78782880161922b565b60008060008060c0858703121561a00c57600080fd5b600061a0188787619317565b945050606061a029878288016191ce565b935050608061a03a878288016191ce565b92505060a08501356001600160401b0381111561992557600080fd5b60008060008060a0858703121561a06c57600080fd5b6000619f8087876193c1565b6000806000806080858703121561a08e57600080fd5b84356001600160401b0381111561a0a457600080fd5b6198e7878288016193eb565b6000806000806080858703121561a0c657600080fd5b84356001600160401b0381111561a0dc57600080fd5b619953878288016193eb565b6000806000806080858703121561a0fe57600080fd5b84356001600160401b0381111561a11457600080fd5b61a120878288016193eb565b945050602061a131878288016190df565b935050604061a14287828801618a7a565b925050606061982587828801618a7a565b6000806000610220848603121561a16957600080fd5b600061a17586866194dc565b93505061018061a18786828701619693565b92505061020061987486828701619197565b60008060008060c0858703121561a1af57600080fd5b600061a1bb87876195f5565b945050606061a1cc87828801618a7a565b935050608061a03a87828801618a7a565b600080600060a0848603121561a1f257600080fd5b600061a1fe8686619644565b935050606061a20f8682870161970d565b9250506080619874868287016190d4565b60006020828403121561a23257600080fd5b600061190c8484619723565b6000806000806080858703121561a25457600080fd5b600061a26087876190ea565b94505060208501516001600160401b0381111561a27c57600080fd5b61a28887828801618f14565b93505060408501516001600160401b0381111561a2a457600080fd5b61a2b087828801619064565b9250506060619825878288016190ea565b6000806040838503121561a2d457600080fd5b600061a2e085856190ea565b92505060206197c6858286016190ea565b6000806000806080858703121561a30757600080fd5b600061a31387876190ea565b945050602061a324878288016190ea565b935050604061a2b0878288016190ea565b600080600080600060a0868803121561a34d57600080fd5b600061a35988886190ea565b955050602061a36a888289016190ea565b945050604061a37b888289016190ea565b935050606061a38c888289016190ea565b9250506080619a76888289016190ea565b60006020828403121561a3af57600080fd5b600061190c848461974f565b600061a3c7838361a40e565b505060200190565b600061a3c7838361a645565b600061448e838361a676565b600061448e838361a7e7565b600061448e838361a84c565b61a4088161b30d565b82525050565b61a4088161b283565b600061a4228261b276565b61a42c818561b27a565b935061a4378361b270565b8060005b8381101561a46557815161a44f888261a3bb565b975061a45a8361b270565b92505060010161a43b565b509495945050505050565b600061a47b8261b276565b61a485818561b27a565b935061a4908361b270565b8060005b8381101561a46557815161a4a8888261a3cf565b975061a4b38361b270565b92505060010161a494565b600061a4c98261b276565b61a4d3818561b27a565b93508360208202850161a4e58561b270565b8060005b8581101561a51f578484038952815161a502858261a3db565b945061a50d8361b270565b60209a909a019992505060010161a4e9565b5091979650505050505050565b600061a5378261b276565b61a541818561b27a565b93508360208202850161a5538561b270565b8060005b8581101561a51f578484038952815161a570858261a3e7565b945061a57b8361b270565b60209a909a019992505060010161a557565b600061a5988261b276565b61a5a2818561b27a565b93508360208202850161a5b48561b270565b8060005b8581101561a51f578484038952815161a5d1858261a3f3565b945061a5dc8361b270565b60209a909a019992505060010161a5b8565b600061a5f98261b276565b61a603818561b27a565b935061a60e8361b270565b8060005b8381101561a46557815161a626888261a3cf565b975061a6318361b270565b92505060010161a612565b61a4088161b28e565b61a4088161b293565b61a4088161b296565b600061a663838561115b565b935061a67083858461b344565b50500190565b600061a6818261b276565b61a68b818561b27a565b935061a69b81856020860161b350565b61a6a48161b37c565b9093019392505050565b600061a6b98261b276565b61a6c3818561115b565b935061a6d381856020860161b350565b9290920192915050565b61a4088161b2a3565b61a4088161b318565b61a4088161b323565b61a4088161b32e565b61a4088161b2cc565b61a4088161b339565b600061a72060248361b27a565b7f556e6973776170563353616d706c65722f746f6b656e5061746820746f6f20738152631a1bdc9d60e21b602082015260400192915050565b600061a76660258361b27a565b7f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e8152642fa820a4a960d91b602082015260400192915050565b600061a7ad60258361b27a565b7f556e6973776170563353616d706c65722f696e76616c69642070617468206c658152646e6774687360d81b602082015260400192915050565b805160009060a084019061a7fb858261a645565b50602083015161a80e602086018261a645565b50604083015161a821604086018261a645565b50606083015161a834606086018261a645565b506080830151848203608086015261197a828261a676565b805160408084526000919084019061a864828261a676565b9150506020830151610fee602086018261a63c565b8051606083019061a88a848261a40e565b50602082015161a89d602085018261a64e565b50604082015161a8b0604085018261a64e565b50505050565b8051608083019061a8c7848261a40e565b50602082015161a8da602085018261a63c565b50604082015161a8ed604085018261a40e565b50606082015161a8b0606085018261a63c565b8051600090604084019061a914858261a645565b506020830151848203602086015261197a828261a676565b805160009060a084019061a940858261a645565b50602083015161a953602086018261a40e565b50604083015161a966604086018261a40e565b50606083015161a834606086018261a40e565b805161018083019061a98b848261a6dd565b50602082015161a99e602085018261a6dd565b50604082015161a9b1604085018261aaae565b50606082015161a9c4606085018261aaae565b50608082015161a9d7608085018261aaae565b5060a082015161a9ea60a085018261a40e565b5060c082015161a9fd60c085018261a40e565b5060e082015161aa1060e085018261a40e565b5061010082015161aa2561010085018261a40e565b5061012082015161aa3a61012085018261a645565b5061014082015161aa4f61014085018261aac0565b5061016082015161a8b061016085018261a645565b8051608083019061aa75848261a6e6565b50602082015161aa88602085018261aac9565b50604082015161aa9b604085018261a645565b50606082015161a8b0606085018261a645565b61a4088161b2d2565b61a4088161b2ea565b61a4088161b2fb565b61a4088161b307565b600061190c82848661a657565b600061448e828461a6ae565b6020810161653b828461a40e565b6040810161ab07828561a3ff565b61448e602083018461a645565b6040810161ab22828561a40e565b61448e602083018461a40e565b6080810161ab3d828761a40e565b61ab4a602083018661a40e565b61ab57604083018561a40e565b61197a606083018461a40e565b6080810161ab72828761a40e565b61ab7f602083018661a40e565b61ab8c604083018561a40e565b8181036060830152616c8c818461a5ee565b6060810161abac828661a40e565b61abb9602083018561a40e565b61190c604083018461a63c565b6080810161abd4828761a40e565b61abe1602083018661a40e565b61abee604083018561a63c565b8181036060830152616c8c818461a676565b6060810161ac0e828661a40e565b61ac1b602083018561a40e565b61190c604083018461a645565b60a0810161ac36828861a40e565b61ac43602083018761a40e565b61ac50604083018661a645565b61ac5d606083018561a70a565b818103608083015261ac6f818461a676565b979650505050505050565b6060810161ac88828661a40e565b818103602083015261ac9a818561a417565b9050818103604083015261197a818461a5ee565b6080810161acbc828761a40e565b61acc9602083018661a6e6565b818103604083015261acdb818561a470565b90508181036060830152616c8c818461a5ee565b610100810161acfe828b61a40e565b61ad0b602083018a61a6e6565b818103604083015261ad1d818961a470565b9050818103606083015261ad31818861a5ee565b905061ad40608083018761a40e565b61ad4d60a083018661a6e6565b81810360c083015261ad5f818561a470565b905081810360e083015261ad73818461a5ee565b9a9950505050505050505050565b6040810161ad8f828561a40e565b818103602083015261190c818461a92c565b6040810161ab07828561a40e565b6040808252810161adc0818561a417565b9050818103602083015261190c818461a5ee565b6040808252810161ade5818561a417565b905061448e602083018461a645565b6060808252810161ae05818661a4be565b9050818103602083015261ac9a818561a5ee565b6020808252810161448e818461a58d565b6020808252810161448e818461a5ee565b6020810161653b828461a63c565b6060810161ae57828661a63c565b61ae64602083018561a40e565b818103604083015261197a818461a5ee565b6020810161653b828461a645565b6060810161ae92828661a645565b818103602083015261ac9a818561a676565b6020808252810161448e818461a676565b6040808252810161ade5818561a676565b6060810161aed4828661a6dd565b61aee1602083018561a6dd565b61190c604083018461aab7565b6060810161aefc828661a6dd565b61ac1b602083018561a6dd565b6040810161af17828561a6dd565b818103602083015261190c818461a5ee565b6060810161af37828661a6e6565b61ac1b602083018561a645565b6060810161af37828661a6ef565b60e0810161af60828761a6f8565b818103602083015261af72818661a52c565b9050818103604083015261af86818561a417565b905061197a606083018461a8b6565b6060810161afa3828661a701565b61ac1b602083018561a701565b6080810161afbe828561a701565b61448e602083018461a879565b6020808252810161653b8161a713565b6020808252810161653b8161a759565b6020808252810161653b8161a7a0565b60c0810161b009828761a879565b61b016606083018661a701565b61b023608083018561a701565b81810360a0830152616c8c818461a5ee565b6060808252810161b046818661a900565b9050818103602083015261b05a818561a900565b905061190c604083018461a645565b6080808252810161b07a818761a92c565b905061b089602083018661a40e565b61b096604083018561a40e565b61197a606083018461a645565b6080808252810161b0b4818761a92c565b905061ab4a602083018661a645565b610200810161b0d2828561a979565b61448e61018083018461aa64565b610220810161b0ef828661a979565b61b0fd61018083018561aa64565b61190c61020083018461a6dd565b6040810161b119828561a645565b818103602083015261190c818461a417565b6060810161b139828661a645565b818103602083015261b14b818561a417565b9050818103604083015261197a818461a417565b60c0810161b16d828961a645565b61b17a602083018861a645565b61b187604083018761a645565b61b194606083018661a645565b61b1a1608083018561a645565b61ac6f60a083018461a645565b6000808335601e193685900301811261b1c657600080fd5b8084019250823591506001600160401b0382111561b1e357600080fd5b60208301925060018202360383131561b1fb57600080fd5b509250929050565b6040518181016001600160401b038111828210171561b22157600080fd5b604052919050565b60006001600160401b0382111561b23f57600080fd5b5060209081020190565b60006001600160401b0382111561b25f57600080fd5b506020601f91909101601f19160190565b60200190565b5190565b90815260200190565b600061653b8261b2de565b151590565b90565b6001600160e01b03191690565b600061653b8261b283565b8061115b8161b386565b8061115b8161b393565b8061115b8161b39d565b600f0b90565b6001600160801b031690565b6001600160a01b031690565b62ffffff1690565b63ffffffff1690565b6001600160401b031690565b60ff1690565b600061653b8261b2a3565b600061653b8261b2ae565b600061653b8261b2b8565b600061653b8261b2c2565b600061653b8261b293565b82818337506000910152565b60005b8381101561b36b57818101518382015260200161b353565b8381111561a8b05750506000910152565b601f01601f191690565b6004811061b39057fe5b50565b6008811061b39057fe5b6002811061b39057fe5b61b3b08161b283565b811461b39057600080fd5b61b3b08161b28e565b61b3b08161b293565b61b3b08161b296565b61b3b08161b2a3565b6005811061b39057600080fd5b6002811061b39057600080fd5b6004811061b39057600080fd5b61b3b08161b2cc565b61b3b08161b2d2565b61b3b08161b2de565b61b3b08161b2ea565b61b3b08161b2f2565b61b3b08161b2fb565b61b3b08161b30756fea2646970667358221220353c0343807449e781ddd456a2ca4b39fadf6fdfd88814f8387ccad0074a693664736f6c634300060c0033';
ERC20BridgeSamplerContract.contractName = 'ERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=erc20_bridge_sampler.js.map