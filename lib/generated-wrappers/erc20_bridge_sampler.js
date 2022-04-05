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
            const bytecode = (0, base_contract_1.linkLibrariesInBytecode)(artifact, libraryAddresses);
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
                        const linkedLibraryBytecode = (0, base_contract_1.linkLibrariesInBytecode)(libraryArtifact, libraryAddresses);
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
        const functionSignature = (0, base_contract_1.methodAbiToFunctionSignature)(methodAbi);
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
                return self._strictEncodeArguments(functionSignature, [multibridge.toLowerCase(),
                    takerToken.toLowerCase(),
                    intermediateToken.toLowerCase(),
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
ERC20BridgeSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b50600436106103425760003560e01c80637f7f4f13116101b8578063b90cd2fb11610104578063ddd5aa28116100a2578063f1ed7fa41161007c578063f1ed7fa414610798578063f3868e9c1461048d578063f5a4994d146107ab578063fc9fe41b146107be57610342565b8063ddd5aa281461075f578063e78ac04514610772578063e8e4af091461078557610342565b8063c8319084116100de578063c831908414610713578063c8c74a3714610726578063cc1621c914610739578063d9bca3721461074c57610342565b8063b90cd2fb146106da578063bd71ecf6146106ed578063c25c41381461070057610342565b80639e3f05c311610171578063a46984171161014b578063a469841714610680578063a75e744b14610693578063a76bbec4146106a6578063adc636bf146106b957610342565b80639e3f05c3146106385780639ea0ff131461065a578063a0295b8b1461066d57610342565b80637f7f4f13146105b75780638b6d7b44146105ca5780638e5a0e07146105dd5780639209483b146105ff57806398777748146106125780639bf3ee351461062557610342565b8063360523911161029257806357494b1d1161023057806366a1ac6b1161020a57806366a1ac6b1461055e57806368be3cf214610571578063706e2f9b1461059157806374c9d255146105a457610342565b806357494b1d146105255780635aae4e53146105385780635d5b674f1461054b57610342565b8063494569db1161026c578063494569db146104c85780634edfb5b2146104db57806351be4eaa146104fb5780635505000a1461050357610342565b8063360523911461048d57806340bc03ae146104a057806342cbb15c146104b357610342565b8063252322b3116102ff5780632aa64319116102d95780632aa64319146104325780632d753aa41461045457806330d6570d146104675780633105fec11461047a57610342565b8063252322b3146103f9578063281e34321461040c57806329fa4aa01461041f57610342565b8063034eaff9146103475780630496d5dc146103705780631022742b14610391578063149dab0e146103a457806316279055146103c65780632339078f146103e6575b600080fd5b61035a610355366004618f62565b6107d1565b604051610367919061a318565b60405180910390f35b61038361037e366004619024565b6109f3565b60405161036792919061a1dd565b61035a61039f366004619457565b610b99565b6103b76103b23660046196d4565b610d0c565b6040516103679392919061a0a9565b6103d96103d4366004618cfb565b610e6c565b604051610367919061a32b565b61035a6103f4366004619655565b610e76565b61035a610407366004618f62565b61109d565b61035a61041a36600461996a565b611267565b61035a61042d36600461978d565b6114bc565b6104456104403660046197e6565b61152b565b6040516103679392919061a336565b61035a610462366004618edd565b611808565b61035a610475366004618f62565b611991565b61035a610488366004619024565b611b05565b61035a61049b3660046197e6565b611c89565b61035a6104ae36600461978d565b611d1b565b6104bb611e9c565b604051610367919061a362565b6103836104d6366004619024565b611ea0565b6104ee6104e93660046198cc565b61202c565b604051610367919061a384565b6104bb6122aa565b6105166105113660046195be565b6122b2565b6040516103679392919061a224565b61035a610533366004618f62565b6125a7565b6105166105463660046195be565b612b1e565b61035a610559366004618f62565b612e03565b61035a61056c366004619457565b612e69565b61058461057f366004619231565b612f1e565b604051610367919061a2a3565b61035a61059f366004619308565b61307f565b6103b76105b23660046196d4565b613171565b61035a6105c536600461996a565b613180565b61035a6105d836600461978d565b6133cd565b6105f06105eb36600461929f565b613730565b6040516103679392919061a614565b61035a61060d36600461978d565b613946565b61035a610620366004618f62565b613b46565b6104bb61063336600461992a565b61407f565b61064b610646366004619815565b6141c6565b6040516103679392919061a36b565b6104bb610668366004618fd4565b6142ec565b61035a61067b366004619655565b614502565b61035a61068e366004618f62565b6146fe565b6104456106a1366004619096565b614853565b61035a6106b4366004618f62565b614990565b6106cc6106c7366004618f62565b614b9f565b60405161036792919061a3d2565b61035a6106e8366004618f62565b614cef565b61035a6106fb36600461933a565b614d55565b61035a61070e366004618f62565b614e51565b61035a610721366004618f62565b614eb7565b61035a610734366004619024565b615074565b61064b610747366004619815565b6151e0565b61044561075a366004619096565b6153c6565b61044561076d3660046197e6565b6154b5565b61035a61078036600461937e565b615748565b61035a610793366004618f62565b61583d565b6104bb6107a6366004619885565b615970565b6106cc6107b9366004618f62565b615b0f565b6105f06107cc36600461929f565b615bfb565b8051606090806001600160401b03811180156107ec57600080fd5b50604051908082528060200260200182016040528015610816578160200160208202803683370190505b5091506000866001600160a01b031663182df0f56040518163ffffffff1660e01b815260040160206040518083038186803b15801561085457600080fd5b505afa158015610868573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061088c9190619574565b90506000876001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b1580156108c957600080fd5b505afa1580156108dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109019190619bea565b60ff169050876001600160a01b0316866001600160a01b031614156109795760005b838110156109735781600a0a6402540be400028387838151811061094357fe5b6020026020010151028161095357fe5b0485828151811061096057fe5b6020908102919091010152600101610923565b506109e8565b876001600160a01b0316876001600160a01b031614156109e85760005b838110156109e6578282600a0a6402540be4008884815181106109b557fe5b60200260200101510202816109c657fe5b048582815181106109d357fe5b6020908102919091010152600101610996565b505b505050949350505050565b80516060908190806001600160401b0381118015610a1057600080fd5b50604051908082528060200260200182016040528015610a3a578160200160208202803683370190505b509150610a478686615e10565b9250825160001415610a595750610b91565b60005b81811015610b8e57866001600160a01b031663a8312b1d620249f0878481518110610a8357fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401610aab9392919061a726565b60006040518083038187803b158015610ac357600080fd5b5086fa93505050508015610af957506040513d6000823e601f3d908101601f19168201604052610af69190810190619526565b60015b610b33573d808015610b27576040519150601f19603f3d011682016040523d82523d6000602084013e610b2c565b606091505b5050610b8e565b80600188510381518110610b4357fe5b6020026020010151848381518110610b5757fe5b602002602001018181525050838281518110610b6f57fe5b602002602001015160001415610b855750610b8e565b50600101610a5c565b50505b935093915050565b606083516001600160401b0381118015610bb257600080fd5b50604051908082528060200260200182016040528015610bdc578160200160208202803683370190505b50905060005b84518114610d0457306001600160a01b0316639bf3ee3562030d40878481518110610c0957fe5b6020026020010151878581518110610c1d57fe5b6020026020010151876040518563ffffffff1660e01b8152600401610c449392919061a6d6565b60206040518083038187803b158015610c5c57600080fd5b5086fa93505050508015610c8d575060408051601f3d908101601f19168201909252610c8a91810190619574565b60015b610ce1573d808015610cbb576040519150601f19603f3d011682016040523d82523d6000602084013e610cc0565b606091505b506000838381518110610ccf57fe5b60200260200101818152505050610cfc565b80838381518110610cee57fe5b602002602001018181525050505b600101610be2565b509392505050565b600060608086602001515160001415610d2457610e62565b610d3087878787616100565b855191945092506001600160401b0381118015610d4c57600080fd5b50604051908082528060200260200182016040528015610d76578160200160208202803683370190505b50905060005b8151811015610e6057836001600160a01b0316637f9c0ecd620493e085888581518110610da557fe5b60200260200101516040518463ffffffff1660e01b8152600401610dca92919061a202565b60206040518083038187803b158015610de257600080fd5b5086fa93505050508015610e13575060408051601f3d908101601f19168201909252610e1091810190619574565b60015b610e1c57610e60565b80838381518110610e2957fe5b602002602001018181525050828281518110610e4157fe5b602002602001015160001415610e575750610e60565b50600101610d7c565b505b9450945094915050565b803b15155b919050565b6060610e828385616332565b602085015160408051600280825260608281019093528160200160208202803683370190505090508581600081518110610eb857fe5b60200260200101906001600160a01b031690816001600160a01b0316815250508481600181518110610ee657fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b0381118015610f1657600080fd5b50604051908082528060200260200182016040528015610f40578160200160208202803683370190505b509350610f4b6184d5565b610f53616371565b905060005b82811015611090576060610f7f8b898481518110610f7257fe5b60200260200101516163a0565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e90610fb59060009085908a90899060040161a425565b600060405180830381600087803b158015610fcf57600080fd5b505af192505050801561100457506040513d6000823e601f3d908101601f1916820160405261100191908101906193d4565b60015b61103f573d808015611032576040519150601f19603f3d011682016040523d82523d6000602084013e611037565b606091505b505050611090565b60008160018151811061104e57fe5b60200260200101516000190290506000811361106c57505050611090565b8089858151811061107957fe5b602002602001018181525050505050600101610f58565b5050505050949350505050565b60606110a98385616332565b8151806001600160401b03811180156110c157600080fd5b506040519080825280602002602001820160405280156110eb578160200160208202803683370190505b50915060006001600160a01b0386161561110e576111098787616432565b611111565b60005b905060006001600160a01b038616156111335761112e8887616432565b611136565b60005b905060005b838110156109e65760016001600160a01b0388166111995761117884632640f62c60e01b89858151811061116b57fe5b60200260200101516164b1565b87848151811061118457fe5b60200260200101819350828152505050611233565b6001600160a01b0389166111bf57611178836359e9486260e01b89858151811061116b57fe5b60006111d9846359e9486260e01b8a868151811061116b57fe5b925090508015611216576111f5856309903d8b60e21b836164b1565b88858151811061120157fe5b60200260200101819450828152505050611231565b600087848151811061122457fe5b6020026020010181815250505b505b801580611253575085828151811061124757fe5b60200260200101516000145b1561125e57506109e6565b5060010161113b565b60606112738385616332565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b1580156112b757600080fd5b505afa1580156112cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112ef9190618d17565b8451909150806001600160401b038111801561130a57600080fd5b50604051908082528060200260200182016040528015611334578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561137057600080fd5b505afa158015611384573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113a89190618d17565b6001600160a01b0316866001600160a01b03161415801561144b5750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156113fd57600080fd5b505afa158015611411573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114359190618d17565b6001600160a01b0316876001600160a01b031614155b15611458575050506114b4565b60005b818110156109e65760006114868a898b8a868151811061147757fe5b60200260200101518989616594565b90508061149357506109e6565b808683815181106114a057fe5b60209081029190910101525060010161145b565b949350505050565b60408051606081810190925261152290806114db86896080840161a4fc565b6040516020818303038152906040528152602001868860405160200161150292919061a4fc565b604051602081830303815290604052815260200161685581525083616988565b95945050505050565b600080606061153a8587616332565b8351806001600160401b038111801561155257600080fd5b5060405190808252806020026020018201604052801561157c578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c6906115af908a908a90600401619f45565b60206040518083038186803b1580156115c757600080fd5b505afa1580156115db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115ff9190618d17565b925060006001600160a01b0384161561161d575060019350866116bc565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c69061164e908a908c90600401619f45565b60206040518083038186803b15801561166657600080fd5b505afa15801561167a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061169e9190618d17565b93506001600160a01b0384166116b5575050610e62565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b1580156116f557600080fd5b505afa158015611709573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061172d9190619558565b611738575050610e62565b60005b828110156117fb5760006117b58a87858e602001516040516020016117639493929190619f5f565b6040516020818303038152906040528a88868f6020015160405160200161178d9493929190619f5f565b6040516020818303038152906040528a85815181106117a857fe5b6020026020010151616b9a565b9050808583815181106117c457fe5b6020026020010181815250508482815181106117dc57fe5b6020026020010151600014156117f257506117fb565b5060010161173b565b5050509450945094915050565b8051606090806001600160401b038111801561182357600080fd5b5060405190808252806020026020018201604052801561184d578160200160208202803683370190505b5091506001600160a01b0387166118645750611522565b60005b818110156119865760006060896001600160a01b031662061a80636e79e13360e01b8b8b8b8b898151811061189857fe5b60200260200101516040516024016118b39493929190619fbe565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516118f19190619efc565b6000604051808303818686fa925050503d806000811461192d576040519150601f19603f3d011682016040523d82523d6000602084013e611932565b606091505b50915091506000821561195657818060200190518101906119539190619574565b90505b8061196357505050611986565b8086858151811061197057fe5b6020908102919091010152505050600101611867565b505095945050505050565b606061199d8385616332565b8151806001600160401b03811180156119b557600080fd5b506040519080825280602002602001820160405280156119df578160200160208202803683370190505b50915060005b81811015611afb57866001600160a01b03166372ea9076620c35008888888681518110611a0e57fe5b60200260200101516040518563ffffffff1660e01b8152600401611a349392919061a040565b60206040518083038187803b158015611a4c57600080fd5b5086fa93505050508015611a7d575060408051601f3d908101601f19168201909252611a7a91810190619574565b60015b611ab7573d808015611aab576040519150601f19603f3d011682016040523d82523d6000602084013e611ab0565b606091505b5050611afb565b80848381518110611ac457fe5b602002602001018181525050838281518110611adc57fe5b602002602001015160001415611af25750611afb565b506001016119e5565b5050949350505050565b8051606090806001600160401b0381118015611b2057600080fd5b50604051908082528060200260200182016040528015611b4a578160200160208202803683370190505b50915060005b81811015611c8057856001600160a01b031663d06ca61f620249f0868481518110611b7757fe5b6020026020010151886040518463ffffffff1660e01b8152600401611b9d92919061a70d565b60006040518083038187803b158015611bb557600080fd5b5086fa93505050508015611beb57506040513d6000823e601f3d908101601f19168201604052611be89190810190619526565b60015b611c25573d808015611c19576040519150601f19603f3d011682016040523d82523d6000602084013e611c1e565b606091505b5050611c80565b80600187510381518110611c3557fe5b6020026020010151848381518110611c4957fe5b602002602001018181525050838281518110611c6157fe5b602002602001015160001415611c775750611c80565b50600101611b50565b50509392505050565b6060611c958385616332565b84602001516001600160a01b0316846001600160a01b0316141580611cc7575084516001600160a01b03848116911614155b15610d045781516060816001600160401b0381118015611ce657600080fd5b50604051908082528060200260200182016040528015611d10578160200160208202803683370190505b5092506114b4915050565b8051606090806001600160401b0381118015611d3657600080fd5b50604051908082528060200260200182016040528015611d60578160200160208202803683370190505b50915060005b81811015611afb576000606088600001516001600160a01b0316621e84808a602001518a8a8a8881518110611d9757fe5b6020026020010151604051602401611db19392919061a4de565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611def9190619efc565b6000604051808303818686fa925050503d8060008114611e2b576040519150601f19603f3d011682016040523d82523d6000602084013e611e30565b606091505b509150915060008215611e545781806020019051810190611e519190619574565b90505b80868581518110611e6157fe5b602002602001018181525050858481518110611e7957fe5b602002602001015160001415611e9157505050611afb565b505050600101611d66565b4390565b80516060908190806001600160401b0381118015611ebd57600080fd5b50604051908082528060200260200182016040528015611ee7578160200160208202803683370190505b509150611ef48686615e10565b9250825160001415611f065750610b91565b60005b81811015610b8e57866001600160a01b0316639e269b68620249f0878481518110611f3057fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401611f589392919061a726565b60006040518083038187803b158015611f7057600080fd5b5086fa93505050508015611fa657506040513d6000823e601f3d908101601f19168201604052611fa39190810190619526565b60015b611fd4573d808015610b27576040519150601f19603f3d011682016040523d82523d6000602084013e610b2c565b80600081518110611fe157fe5b6020026020010151848381518110611ff557fe5b60200260200101818152505083828151811061200d57fe5b6020026020010151600014156120235750610b8e565b50600101611f09565b6020848101516040805160018082528183019092526060938492908281019080368337019050509050858160008151811061206357fe5b60209081029190910101526060600060405190808252806020026020018201604052801561209b578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b0316141561218c576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a120906120f49089906001908890889060040161a0df565b60006040518083038187803b15801561210c57600080fd5b5086fa9350505050801561214257506040513d6000823e601f3d908101601f1916820160405261213f919081019061958c565b60015b61217c573d808015612170576040519150601f19603f3d011682016040523d82523d6000602084013e612175565b606091505b5050612187565b93506114b492505050565b6109e8565b87606001516001600160a01b0316856001600160a01b031614156121e2576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a120906120f4908a906001908890889060040161a0df565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a12090612222908a90600190889088908d9084908490849060040161a122565b60006040518083038187803b15801561223a57600080fd5b5086fa9350505050801561227057506040513d6000823e601f3d908101601f1916820160405261226d919081019061958c565b60015b61217c573d80801561229e576040519150601f19603f3d011682016040523d82523d6000602084013e6122a3565b606091505b50506109e8565b60005a905090565b606080606080612334876001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156122f457600080fd5b505afa158015612308573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061232c9190618d17565b876000616cd3565b905084516001600160401b038111801561234d57600080fd5b50604051908082528060200260200182016040528015612377578160200160208202803683370190505b50915084516001600160401b038111801561239157600080fd5b506040519080825280602002602001820160405280156123c557816020015b60608152602001906001900390816123b05790505b50935084516001600160401b03811180156123df57600080fd5b50604051908082528060200260200182016040528015612409578160200160208202803683370190505b50925060005b855181101561259c576000805b835181101561252e5760606124448a86848151811061243757fe5b6020026020010151617173565b90508a6001600160a01b031663cdca1753620aae60838c888151811061246657fe5b60200260200101516040518463ffffffff1660e01b815260040161248b92919061a397565b600060405180830381600088803b1580156124a557600080fd5b5087f1935050505080156124db57506040513d6000823e601f3d908101601f191682016040526124d89190810190619a81565b60015b6124e457612525565b83871161252057839650848c89815181106124fb57fe5b6020026020010181905250808b898151811061251357fe5b6020026020010181815250505b505050505b5060010161241c565b508061257b576040518060200160405280600081525086838151811061255057fe5b6020026020010181905250600085838151811061256957fe5b6020026020010181815250505061259c565b8084838151811061258857fe5b60209081029190910101525060010161240f565b505093509350939050565b80516060908590806001600160401b03811180156125c457600080fd5b506040519080825280602002602001820160405280156125ee578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b6249061261e908990600401619f18565b60206040518083038186803b15801561263657600080fd5b505afa15801561264a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061266e9190619558565b15806126f35750604051630bcded8960e21b81526001600160a01b03831690632f37b624906126a1908890600401619f18565b60206040518083038186803b1580156126b957600080fd5b505afa1580156126cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906126f19190619558565b155b156126ff5750506114b4565b6127076184fc565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612733908a90600401619f18565b60206040518083038186803b15801561274b57600080fd5b505afa15801561275f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127839190619574565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906127b1908990600401619f18565b60206040518083038186803b1580156127c957600080fd5b505afa1580156127dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128019190619574565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690612832908a90600401619f18565b60206040518083038186803b15801561284a57600080fd5b505afa15801561285e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128829190619574565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce6906128b5908990600401619f18565b60206040518083038186803b1580156128cd57600080fd5b505afa1580156128e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129059190619574565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b15801561294757600080fd5b505afa15801561295b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061297f9190619574565b608082015260005b828110156109e6576129b282602001516003670de0b6b3a7640000816129a957fe5b046001016172ce565b8682815181106129be57fe5b602002602001015111156129d1576109e6565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c8881518110612a0457fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401612a329695949392919061a751565b60206040518083038187803b158015612a4a57600080fd5b5086fa93505050508015612a7b575060408051601f3d908101601f19168201909252612a7891810190619574565b60015b612ab5573d808015612aa9576040519150601f19603f3d011682016040523d82523d6000602084013e612aae565b606091505b50506109e6565b8251612acd906002670de0b6b3a76400005b046172ce565b811115612ada57506109e6565b80868381518110612ae757fe5b602002602001018181525050858281518110612aff57fe5b602002602001015160001415612b1557506109e6565b50600101612987565b606080606080612b60876001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156122f457600080fd5b90506060612b6d8761732b565b905085516001600160401b0381118015612b8657600080fd5b50604051908082528060200260200182016040528015612bb0578160200160208202803683370190505b50925085516001600160401b0381118015612bca57600080fd5b50604051908082528060200260200182016040528015612bfe57816020015b6060815260200190600190039081612be95790505b50945085516001600160401b0381118015612c1857600080fd5b50604051908082528060200260200182016040528015612c42578160200160208202803683370190505b50935060005b8651811015612df7576000805b8451811015612d89576060612c8585612c80888581518110612c7357fe5b60200260200101516173c3565b617173565b90508b6001600160a01b0316632f80bb1d620aae60838d8881518110612ca757fe5b60200260200101516040518463ffffffff1660e01b8152600401612ccc92919061a397565b600060405180830381600088803b158015612ce657600080fd5b5087f193505050508015612d1c57506040513d6000823e601f3d908101601f19168201604052612d199190810190619a81565b60015b612d2557612d80565b861580612d325750838710155b15612d7b57839650612d4a8f8b888151811061243757fe5b8d8981518110612d5657fe5b6020026020010181905250808c8981518110612d6e57fe5b6020026020010181815250505b505050505b50600101612c55565b5080612dd65760405180602001604052806000815250878381518110612dab57fe5b60200260200101819052506000868381518110612dc457fe5b60200260200101818152505050612df7565b80858381518110612de357fe5b602090810291909101015250600101612c48565b50505093509350939050565b6040805160608181019092526115229080612e22868960808401619f45565b60405160208183030381529060405281526020018688604051602001612e49929190619f45565b604051602081830303815290604052815260200161745b81525083616988565b6060612e76848484610b99565b905060005b8451811015610d0457818181518110612e9057fe5b6020026020010151600014612f1657612efd828281518110612eae57fe5b6020026020010151868381518110612ec257fe5b6020026020010151606001516001600160801b0316878481518110612ee357fe5b6020026020010151604001516001600160801b031661756f565b828281518110612f0957fe5b6020026020010181815250505b600101612e7b565b6060816001600160401b0381118015612f3657600080fd5b50604051908082528060200260200182016040528015612f7057816020015b612f5d61852b565b815260200190600190039081612f555790505b50905060005b808314613078576001828281518110612f8b57fe5b602090810291909101810151911515910152838382818110612fa957fe5b9050602002810190612fbb919061a779565b15159050612fc857613070565b30848483818110612fd557fe5b9050602002810190612fe7919061a779565b604051612ff5929190619eec565b6000604051808303816000865af19150503d8060008114613032576040519150601f19603f3d011682016040523d82523d6000602084013e613037565b606091505b5083838151811061304457fe5b602002602001015160200184848151811061305b57fe5b60209081029190910101519190915290151590525b600101612f76565b5092915050565b606081516001600160401b038111801561309857600080fd5b506040519080825280602002602001820160405280156130c2578160200160208202803683370190505b50905060005b8251811461316b577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031683828151811061310657fe5b60200260200101516001600160a01b0316146131465761314183828151811061312b57fe5b60200260200101516001600160a01b0316617593565b613149565b60125b60ff1682828151811061315857fe5b60209081029190910101526001016130c8565b50919050565b60006060809450945094915050565b606061318c8385616332565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b1580156131d057600080fd5b505afa1580156131e4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906132089190618d17565b8451909150806001600160401b038111801561322357600080fd5b5060405190808252806020026020018201604052801561324d578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561328957600080fd5b505afa15801561329d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906132c19190618d17565b6001600160a01b0316866001600160a01b0316141580156133645750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561331657600080fd5b505afa15801561332a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061334e9190618d17565b6001600160a01b0316876001600160a01b031614155b15613371575050506114b4565b60005b818110156109e657600061339f8a898b8a868151811061339057fe5b6020026020010151898961763f565b9050806133ac57506109e6565b808683815181106133b957fe5b602090810291909101015250600101613374565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b8152600401613404919061a362565b60206040518083038186803b15801561341c57600080fd5b505afa158015613430573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906134549190619574565b8651604051631e01043960e01b81526001600160a01b0390911690631e0104399061348790600f89900b9060040161a362565b60206040518083038186803b15801561349f57600080fd5b505afa1580156134b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906134d79190619574565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b815260040161350f919061a362565b60806040518083038186803b15801561352757600080fd5b505afa15801561353b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061355f9190619b76565b935050505080601203600a0a828161357357fe5b85519190049250806001600160401b038111801561359057600080fd5b506040519080825280602002602001820160405280156135ba578160200160208202803683370190505b50935060005b818110156109e657600060608a600001516001600160a01b0316620927c08c602001518c8c8c88815181106135f157fe5b602002602001015160405160240161360b9392919061a4de565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516136499190619efc565b6000604051808303818686fa925050503d8060008114613685576040519150601f19603f3d011682016040523d82523d6000602084013e61368a565b606091505b5091509150600082156136ae57818060200190518101906136ab9190619574565b90505b8681106136e857835b858110156136df57878982815181106136cc57fe5b60209081029190910101526001016136b7565b505050506109e6565b808885815181106136f557fe5b60200260200101818152505087848151811061370d57fe5b602002602001015160001415613725575050506109e6565b5050506001016135c0565b613738618543565b613740618543565b600080805b875181146138455761378c602089838151811061375e57fe5b60200260200101515103878a848151811061377557fe5b60200260200101516178d19092919063ffffffff16565b60006060306001600160a01b03168a84815181106137a657fe5b60200260200101516040516137bb9190619efc565b6000604051808303816000865af19150503d80600081146137f8576040519150601f19603f3d011682016040523d82523d6000602084013e6137fd565b606091505b5091509150811561383b5760006138216020835103836178e190919063ffffffff16565b90508481111561383957838852602088018290529350835b505b5050600101613745565b5080613851575061393d565b60005b8651811461259c57613884602088838151811061386d57fe5b602002602001015151038389848151811061377557fe5b60006060306001600160a01b031689848151811061389e57fe5b60200260200101516040516138b39190619efc565b6000604051808303816000865af19150503d80600081146138f0576040519150601f19603f3d011682016040523d82523d6000602084013e6138f5565b606091505b509150915081156139335760006139196020835103836178e190919063ffffffff16565b90508581111561393157838752602087018290529450845b505b5050600101613854565b93509350939050565b60408401516060906001600160e01b0319166139c85760408051606081019091526139c1908061397a86896080840161a4fc565b604051602081830303815290604052815260200186886040516020016139a192919061a4fc565b60405160208183030381529060405281526020016178ed81525083616988565b90506114b4565b8151806001600160401b03811180156139e057600080fd5b50604051908082528060200260200182016040528015613a0a578160200160208202803683370190505b50915060005b81811015611afb576000606088600001516001600160a01b0316621e84808a604001518a8a8a8881518110613a4157fe5b6020026020010151604051602401613a5b9392919061a4de565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613a999190619efc565b6000604051808303818686fa925050503d8060008114613ad5576040519150601f19603f3d011682016040523d82523d6000602084013e613ada565b606091505b509150915060008215613afe5781806020019051810190613afb9190619574565b90505b80868581518110613b0b57fe5b602002602001018181525050858481518110613b2357fe5b602002602001015160001415613b3b57505050611afb565b505050600101613a10565b80516060908590806001600160401b0381118015613b6357600080fd5b50604051908082528060200260200182016040528015613b8d578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b62490613bbd908990600401619f18565b60206040518083038186803b158015613bd557600080fd5b505afa158015613be9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c0d9190619558565b1580613c925750604051630bcded8960e21b81526001600160a01b03831690632f37b62490613c40908890600401619f18565b60206040518083038186803b158015613c5857600080fd5b505afa158015613c6c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c909190619558565b155b15613c9e5750506114b4565b613ca66184fc565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90613cd2908a90600401619f18565b60206040518083038186803b158015613cea57600080fd5b505afa158015613cfe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613d229190619574565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90613d50908990600401619f18565b60206040518083038186803b158015613d6857600080fd5b505afa158015613d7c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613da09190619574565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690613dd1908a90600401619f18565b60206040518083038186803b158015613de957600080fd5b505afa158015613dfd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613e219190619574565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690613e54908990600401619f18565b60206040518083038186803b158015613e6c57600080fd5b505afa158015613e80573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613ea49190619574565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015613ee657600080fd5b505afa158015613efa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f1e9190619574565b608082015260005b828110156109e6578151613f44906002670de0b6b3a7640000612ac7565b868281518110613f5057fe5b60200260200101511115613f63576109e6565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c8881518110613f9657fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401613fc49695949392919061a751565b60206040518083038187803b158015613fdc57600080fd5b5086fa9350505050801561400d575060408051601f3d908101601f1916820190925261400a91810190619574565b60015b61403b573d808015612aa9576040519150601f19603f3d011682016040523d82523d6000602084013e612aae565b8086838151811061404857fe5b60200260200101818152505085828151811061406057fe5b60200260200101516000141561407657506109e6565b50600101613f26565b6000808351600381111561408f57fe5b14806140a757506001835160038111156140a557fe5b145b806140bd575060408401516001600160801b0316155b806140d3575060608401516001600160801b0316155b156140e0575060006141bf565b6140e861855d565b600080846001600160a01b0316631fb0979588886040518363ffffffff1660e01b815260040161411992919061a6b9565b60a06040518083038186803b15801561413157600080fd5b505afa158015614145573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061416991906199e2565b9194509250905060018360200151600481111561418257fe5b14158061418d575080155b806141a0575086516001600160a01b0316155b156141b157600093505050506141bf565b506001600160801b03169150505b9392505050565b60006060806141d58587616332565b6141e0878787617941565b9250826141ec57610e62565b60405163276fdad960e11b81523090634edfb5b290614215908a9087908b908b9060040161a680565b60006040518083038186803b15801561422d57600080fd5b505afa158015614241573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052614269919081019061958c565b8760800181905250866080015191506142e06040518060600160405280878a60405160200161429992919061a1b9565b6040516020818303038152906040528152602001888a6040516020016142c092919061a1b9565b6040516020818303038152906040528152602001617aa881525085616988565b90509450945094915050565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b815260040161431d929190619f45565b60206040518083038186803b15801561433557600080fd5b505afa158015614349573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061436d9190618d17565b90506001600160a01b0381166143875760009150506114b4565b60006001600160a01b03861615614419576040516370a0823160e01b81526001600160a01b038716906370a08231906143c4908590600401619f18565b60206040518083038186803b1580156143dc57600080fd5b505afa1580156143f0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906144149190619574565b614425565b816001600160a01b0316315b90508381101561443a576000925050506114b4565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f09061446f908a908a908a9060040161a040565b60206040518083038187803b15801561448757600080fd5b5086fa935050505080156144b8575060408051601f3d908101601f191682019092526144b591810190619574565b60015b6144f8573d8080156144e6576040519150601f19603f3d011682016040523d82523d6000602084013e6144eb565b606091505b50600093505050506114b4565b92506114b4915050565b606061450e8385616332565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061454457fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061457257fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b03811180156145a257600080fd5b506040519080825280602002602001820160405280156145cc578160200160208202803683370190505b5093506145d76184d5565b6145df616371565b905060005b828110156110905760606145fe8b898481518110610f7257fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906146349060019085908a90899060040161a425565b600060405180830381600087803b15801561464e57600080fd5b505af192505050801561468357506040513d6000823e601f3d908101601f1916820160405261468091908101906193d4565b60015b6146b1573d808015611032576040519150601f19603f3d011682016040523d82523d6000602084013e611037565b6000816000815181106146c057fe5b60200260200101519050600081136146da57505050611090565b808985815181106146e757fe5b6020026020010181815250505050506001016145e4565b8051606090806001600160401b038111801561471957600080fd5b50604051908082528060200260200182016040528015614743578160200160208202803683370190505b50915060005b81811015611afb57866001600160a01b031663343fbcdd62061a80888888868151811061477257fe5b60200260200101516040518563ffffffff1660e01b81526004016147989392919061a040565b60206040518083038187803b1580156147b057600080fd5b5086fa935050505080156147e1575060408051601f3d908101601f191682019092526147de91810190619574565b60015b61480f573d808015611aab576040519150601f19603f3d011682016040523d82523d6000602084013e611ab0565b8084838151811061481c57fe5b60200260200101818152505083828151811061483457fe5b60200260200101516000141561484a5750611afb565b50600101614749565b60008060606148628587616332565b8351806001600160401b038111801561487a57600080fd5b506040519080825280602002602001820160405280156148a4578160200160208202803683370190505b5091506148b389898989617b8f565b945092506001600160a01b0383166148cb5750614985565b60005b8181101561498257600061493c8986886040516020016148f093929190619fe8565b60405160208183030381529060405289878960405160200161491493929190619fe8565b60405160208183030381529060405289858151811061492f57fe5b6020026020010151617ce4565b90508084838151811061494b57fe5b60200260200101818152505083828151811061496357fe5b6020026020010151600014156149795750614982565b506001016148ce565b50505b955095509592505050565b8051606090806001600160401b03811180156149ab57600080fd5b506040519080825280602002602001820160405280156149d5578160200160208202803683370190505b5091506000866001600160a01b031663182df0f56040518163ffffffff1660e01b815260040160206040518083038186803b158015614a1357600080fd5b505afa158015614a27573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614a4b9190619574565b90506000876001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015614a8857600080fd5b505afa158015614a9c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614ac09190619bea565b60ff169050876001600160a01b0316866001600160a01b03161415614b325760005b83811015610973578282600a0a6402540be400888481518110614b0157fe5b6020026020010151020281614b1257fe5b04858281518110614b1f57fe5b6020908102919091010152600101614ae2565b876001600160a01b0316876001600160a01b031614156109e85760005b838110156109e65781600a0a6402540be4000283878381518110614b6f57fe5b60200260200101510281614b7f57fe5b04858281518110614b8c57fe5b6020908102919091010152600101614b4f565b60006060614bad8486616332565b8251806001600160401b0381118015614bc557600080fd5b50604051908082528060200260200182016040528015614bef578160200160208202803683370190505b50915060005b81811015614c64576000614c1e898989898681518110614c1157fe5b60200260200101516142ec565b905080848381518110614c2d57fe5b602002602001018181525050838281518110614c4557fe5b602002602001015160001415614c5b5750614c64565b50600101614bf5565b5060405163901754d760e01b81526001600160a01b0388169063901754d790614c939089908990600401619f45565b60206040518083038186803b158015614cab57600080fd5b505afa158015614cbf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614ce39190618d17565b92505094509492505050565b6040805160608181019092526115229080614d0e868960808401619f45565b60405160208183030381529060405281526020018688604051602001614d35929190619f45565b6040516020818303038152906040528152602001617dd681525083616988565b606082516001600160401b0381118015614d6e57600080fd5b50604051908082528060200260200182016040528015614d98578160200160208202803683370190505b50905060005b83518114613078577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316848281518110614ddc57fe5b60200260200101516001600160a01b031614614e2657614e2183858381518110614e0257fe5b60200260200101516001600160a01b0316617e1d90919063ffffffff16565b614e32565b826001600160a01b0316315b828281518110614e3e57fe5b6020908102919091010152600101614d9e565b6040805160608181019092526115229080614e70868960808401619f45565b60405160208183030381529060405281526020018688604051602001614e97929190619f45565b6040516020818303038152906040528152602001617ee781525083616988565b6060614ec38385616332565b8151806001600160401b0381118015614edb57600080fd5b50604051908082528060200260200182016040528015614f05578160200160208202803683370190505b50915060006001600160a01b03861615614f2857614f238787616432565b614f2b565b60005b905060006001600160a01b03861615614f4d57614f488887616432565b614f50565b60005b905060005b838110156109e65760016001600160a01b038816614fa657614f85846395b68fe760e01b89858151811061116b57fe5b878481518110614f9157fe5b60200260200101819350828152505050615040565b6001600160a01b038916614fcc57614f858363cd7724c360e01b89858151811061116b57fe5b6000614fe6856395b68fe760e01b8a868151811061116b57fe5b925090508015615023576150028463cd7724c360e01b836164b1565b88858151811061500e57fe5b6020026020010181945082815250505061503e565b600087848151811061503157fe5b6020026020010181815250505b505b801580615060575085828151811061505457fe5b60200260200101516000145b1561506b57506109e6565b50600101614f55565b8051606090806001600160401b038111801561508f57600080fd5b506040519080825280602002602001820160405280156150b9578160200160208202803683370190505b50915060005b81811015611c8057856001600160a01b0316631f00ca74620249f08684815181106150e657fe5b6020026020010151886040518463ffffffff1660e01b815260040161510c92919061a70d565b60006040518083038187803b15801561512457600080fd5b5086fa9350505050801561515a57506040513d6000823e601f3d908101601f191682016040526151579190810190619526565b60015b615188573d808015611c19576040519150601f19603f3d011682016040523d82523d6000602084013e611c1e565b8060008151811061519557fe5b60200260200101518483815181106151a957fe5b6020026020010181815250508382815181106151c157fe5b6020026020010151600014156151d75750611c80565b506001016150bf565b60006060806151ef8587616332565b6151fa878787617941565b92508261520657610e62565b60405163276fdad960e11b81523090634edfb5b29061522f908a9087908b908b9060040161a680565b60006040518083038186803b15801561524757600080fd5b505afa15801561525b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052615283919081019061958c565b608088018190528451909250806001600160401b03811180156152a557600080fd5b506040519080825280602002602001820160405280156152cf578160200160208202803683370190505b50915060005b818110156153ba576000306001600160a01b031663f1ed7fa48b8b8b8b87815181106152fd57fe5b60200260200101516040518563ffffffff1660e01b8152600401615324949392919061a64a565b60206040518083038186803b15801561533c57600080fd5b505afa158015615350573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906153749190619574565b90508084838151811061538357fe5b60200260200101818152505083828151811061539b57fe5b6020026020010151600014156153b157506153ba565b506001016152d5565b50509450945094915050565b60008060606153d58587616332565b6153e188888888617b8f565b935091506001600160a01b0382166153f857614985565b8351806001600160401b038111801561541057600080fd5b5060405190808252806020026020018201604052801561543a578160200160208202803683370190505b5060408051606081019091529092506154a7908061545e8987891560808501619fe8565b604051602081830303815290604052815260200189868860405160200161548793929190619fe8565b6040516020818303038152906040528152602001617ce481525086616988565b915050955095509592505050565b60008060606154c48587616332565b8351806001600160401b03811180156154dc57600080fd5b50604051908082528060200260200182016040528015615506578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c690615539908a908a90600401619f45565b60206040518083038186803b15801561555157600080fd5b505afa158015615565573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906155899190618d17565b925060006001600160a01b038416156155a757506001935086615646565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c6906155d8908a908c90600401619f45565b60206040518083038186803b1580156155f057600080fd5b505afa158015615604573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906156289190618d17565b93506001600160a01b03841661563f575050610e62565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561567f57600080fd5b505afa158015615693573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906156b79190619558565b6156c2575050610e62565b61573a60405180606001604052808987858e602001516040516020016156eb9493929190619f5f565b60405160208183030381529060405281526020018a87858e6020015160405160200161571a9493929190619f5f565b6040516020818303038152906040528152602001616b9a81525087616988565b925050509450945094915050565b606083516001600160401b038111801561576157600080fd5b5060405190808252806020026020018201604052801561578b578160200160208202803683370190505b50905060005b84518114610d04577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168582815181106157cf57fe5b60200260200101516001600160a01b03161461581b5761581684848784815181106157f657fe5b60200260200101516001600160a01b0316617f9c9092919063ffffffff16565b61581e565b60005b82828151811061582a57fe5b6020908102919091010152600101615791565b8051606090806001600160401b038111801561585857600080fd5b50604051908082528060200260200182016040528015615882578160200160208202803683370190505b50915060005b81811015611afb57866001600160a01b031663838e6a22620493e088888886815181106158b157fe5b60200260200101516040518563ffffffff1660e01b81526004016158d79392919061a040565b60206040518083038187803b1580156158ef57600080fd5b5086fa93505050508015615920575060408051601f3d908101601f1916820190925261591d91810190619574565b60015b61594e573d808015611aab576040519150601f19603f3d011682016040523d82523d6000602084013e611ab0565b8084838151811061595b57fe5b60200260200101818152505050600101615888565b600084608001515160001415615988575060006114b4565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b0316146159c257866159d8565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b0316146159fb5786615a11565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b8152600401615a3995949392919061a064565b60206040518083038187803b158015615a5157600080fd5b5086fa93505050508015615a82575060408051601f3d908101601f19168201909252615a7f91810190619574565b60015b615ac0573d808015615ab0576040519150601f19603f3d011682016040523d82523d6000602084013e615ab5565b606091505b5060009150506114b4565b6000615acb85618068565b60ff1690506000615adb87618068565b60ff169050670de0b6b3a764000081600a0a83600a0a8786020281615afc57fe5b0481615b0457fe5b0493505050506114b4565b60006060615b1d8486616332565b8251806001600160401b0381118015615b3557600080fd5b50604051908082528060200260200182016040528015615b5f578160200160208202803683370190505b509150615bca60405180606001604052808988604051602001615b83929190619f45565b60405160208183030381529060405281526020018989604051602001615baa929190619f45565b604051602081830303815290604052815260200161807381525085616988565b60405163901754d760e01b81529092506001600160a01b0388169063901754d790614c939089908990600401619f45565b615c03618543565b615c0b618543565b6000198060005b86518114615d0757615c426020888381518110615c2b57fe5b602002602001015151038789848151811061377557fe5b60006060306001600160a01b0316898481518110615c5c57fe5b6020026020010151604051615c719190619efc565b6000604051808303816000865af19150503d8060008114615cae576040519150601f19603f3d011682016040523d82523d6000602084013e615cb3565b606091505b50915091508115615cfd576000615cd76020835103836178e190919063ffffffff16565b9050600081118015615ce857508481105b15615cfb57838752602087018290529350835b505b5050600101615c12565b50600019811415615d18575061393d565b60005b8751811461259c57615d4b6020898381518110615d3457fe5b60200260200101515103838a848151811061377557fe5b60006060306001600160a01b03168a8481518110615d6557fe5b6020026020010151604051615d7a9190619efc565b6000604051808303816000865af19150503d8060008114615db7576040519150601f19603f3d011682016040523d82523d6000602084013e615dbc565b606091505b50915091508115615e06576000615de06020835103836178e190919063ffffffff16565b9050600081118015615df157508581105b15615e0457838852602088018290529450845b505b5050600101615d1b565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b158015615e4d57600080fd5b505afa158015615e61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615e859190618d17565b905060018351036001600160401b0381118015615ea157600080fd5b50604051908082528060200260200182016040528015615ecb578160200160208202803683370190505b50915060005b82518110156160f7576060826001600160a01b0316635b1dc86f620249f0878581518110615efb57fe5b6020026020010151888660010181518110615f1257fe5b60200260200101516040518463ffffffff1660e01b8152600401615f37929190619f45565b60006040518083038187803b158015615f4f57600080fd5b5086fa93505050508015615f8557506040513d6000823e601f3d908101601f19168201604052615f8291908101906190cf565b60015b615ff3573d808015615fb3576040519150601f19603f3d011682016040523d82523d6000602084013e615fb8565b606091505b506000805b50604051908082528060200260200182016040528015615fe7578160200160208202803683370190505b509450505050506160fa565b805161600157600080615fbd565b6000805b82518110156160eb57600083828151811061601c57fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b15801561605c57600080fd5b505afa158015616070573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906160949190619574565b9050828111156160e2578092508382815181106160ad57fe5b60200260200101518887815181106160c157fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616005565b50505050600101615ed1565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b15801561615457600080fd5b505afa158015616168573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061618c9190619574565b6040518263ffffffff1660e01b81526004016161a8919061a362565b60206040518083038186803b1580156161c057600080fd5b505afa1580156161d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906161f89190618d17565b91508560200151516000141561620d57616329565b6000805b8760200151518110156163265760028860200151828151811061623057fe5b60200260200101515110156162445761631e565b836001600160a01b0316637f9c0ecd620493e08a60200151848151811061626757fe5b60200260200101518860018a51038151811061627f57fe5b60200260200101516040518463ffffffff1660e01b81526004016162a492919061a202565b60206040518083038187803b1580156162bc57600080fd5b5086fa935050505080156162ed575060408051601f3d908101601f191682019092526162ea91810190619574565b60015b6162f65761631e565b8281111561631c578092508860200151828151811061631157fe5b602002602001015193505b505b600101616211565b50505b94509492505050565b806001600160a01b0316826001600160a01b0316141561636d5760405162461bcd60e51b81526004016163649061a558565b60405180910390fd5b5050565b6163796184d5565b50604080516080810182523080825260006020830181905292820152606081019190915290565b604080516001808252818301909252606091829190816020015b6163c261857f565b8152602001906001900390816163ba5790505090506040518060a00160405280856000015181526020016000815260200160018152602001848152602001604051806020016040528060008152508152508160008151811061642057fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf6290616461908590600401619f18565b60206040518083038186803b15801561647957600080fd5b505afa15801561648d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906141bf9190618d17565b6000806001600160a01b0385166164c757610b91565b6060856001600160a01b0316620249f086866040516024016164e9919061a362565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516165279190619efc565b6000604051808303818686fa925050503d8060008114616563576040519150601f19603f3d011682016040523d82523d6000602084013e616568565b606091505b509092509050811561658b57808060200190518101906165889190619574565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b81526004016165ca919061a362565b60a06040518083038186803b1580156165e257600080fd5b505afa1580156165f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061661a9190619bab565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b031614156167425760006166598964e8d4a510006180c3565b9050600061667d6b033b2e3c9fd0803ce800000061667788856180f9565b906180c3565b9050848110616695576000965050505050505061684b565b6000616724670de0b6b3a764000061671e8c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156166df57600080fd5b505afa1580156166f3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906167179190619574565b86906180c3565b90618115565b90506000616732848361813f565b985061684b975050505050505050565b8a604001516001600160a01b03168a6001600160a01b031614156168425787848111156167775760009550505050505061684b565b60006167936b033b2e3c9fd0803ce8000000616677888561813f565b90508381116167ab576000965050505050505061684b565b60006168308a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156167e957600080fd5b505afa1580156167fd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906168219190619574565b670de0b6b3a7640000906180f9565b905060006167328261671e86886180c3565b60009450505050505b9695505050505050565b6000806168606185b1565b858060200190518101906168749190619620565b9150915060008580602001905181019061688e9190619604565b905060006060306322db5ed160e21b8587866168a98c61815e565b6040516024016168bc949392919061a5e2565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516168fa9190619efc565b600060405180830381855afa9150503d8060008114616935576040519150601f19603f3d011682016040523d82523d6000602084013e61693a565b606091505b509150915081616952576000955050505050506141bf565b808060200190518101906169669190619526565b60008151811061697257fe5b6020026020010151955050505050509392505050565b606081516001600160401b03811180156169a157600080fd5b506040519080825280602002602001820160405280156169cb578160200160208202803683370190505b5090508151600014156169dd576160fa565b6000616a0e84600001518560200151856000815181106169f957fe5b6020026020010151876040015163ffffffff16565b905080616a1b57506160fa565b6000616a388560200151866000015184886040015163ffffffff16565b905080616a465750506160fa565b60005b8451811015616b91576000805b6005811015616b3a57616a7d878481518110616a6e57fe5b6020026020010151858761819f565b945084616a8957616b3a565b616a986127156127108761819f565b945084616aa457616b3a565b6000616ac189602001518a60000151888c6040015163ffffffff16565b905080616ace5750616b3a565b809450878481518110616add57fe5b60200260200101518510616b3157878481518110616af757fe5b6020026020010151612710898681518110616b0e57fe5b602002602001015187030281616b2057fe5b04925060058311616b315750616b3a565b50600101616a56565b50801580616b485750600581115b15616b535750616b91565b616b71868381518110616b6257fe5b6020026020010151848661819f565b858381518110616b7d57fe5b602090810291909101015250600101616a49565b50505092915050565b600080600080600087806020019051810190616bb69190618d6c565b9350935093509350816001600160a01b0316846001600160a01b03161415616ca0576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e090616c09908a9060040161a362565b60206040518083038187803b158015616c2157600080fd5b5086fa93505050508015616c52575060408051601f3d908101601f19168201909252616c4f91810190619574565b60015b616c94573d808015616c80576040519150601f19603f3d011682016040523d82523d6000602084013e616c85565b606091505b506000955050505050506141bf565b94506141bf9350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e090616c099087908b90600401619f2c565b60606002828451031015616cf95760405162461bcd60e51b81526004016163649061a514565b616d016185d1565b5060408051608081018252606481526101f46020820152610bb8818301526127106060808301919091528251600480825260a082019094529192909190816020016020820280368337019050509050600080868681518110616d5f57fe5b602002602001015190506000878760010181518110616d7a57fe5b6020026020010151905060005b6004811015616e6f5760008a6001600160a01b0316631698ee8285858a8660048110616daf57fe5b60200201516040518463ffffffff1660e01b8152600401616dd29392919061a3aa565b60206040518083038186803b158015616dea57600080fd5b505afa158015616dfe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616e229190618d17565b9050616e2d816181f7565b15616e665780868680600101975081518110616e4557fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616d87565b50505080616e7f575050506141bf565b8551856002011415616f7557806001600160401b0381118015616ea157600080fd5b50604051908082528060200260200182016040528015616ed557816020015b6060815260200190600190039081616ec05790505b50935060005b81811015616f6c57604080516001808252818301909252906020808301908036833701905050858281518110616f0d57fe5b6020026020010181905250828181518110616f2457fe5b6020026020010151858281518110616f3857fe5b6020026020010151600081518110616f4c57fe5b6001600160a01b0390921660209283029190910190910152600101616edb565b505050506141bf565b6060616f85888888600101616cd3565b9050805160001415616f9a57505050506141bf565b805182026001600160401b0381118015616fb357600080fd5b50604051908082528060200260200182016040528015616fe757816020015b6060815260200190600190039081616fd25790505b50945060005b828110156171675760005b825181101561715e57825182810282019084908390811061701557fe5b6020026020010151516001016001600160401b038111801561703657600080fd5b50604051908082528060200260200182016040528015617060578160200160208202803683370190505b5088828151811061706d57fe5b602002602001018190525085838151811061708457fe5b602002602001015188828151811061709857fe5b60200260200101516000815181106170ac57fe5b60200260200101906001600160a01b031690816001600160a01b03168152505060005b8483815181106170db57fe5b602002602001015151811015617154578483815181106170f757fe5b6020026020010151818151811061710a57fe5b602002602001015189838151811061711e57fe5b6020026020010151826001018151811061713457fe5b6001600160a01b03909216602092830291909101909101526001016170cf565b5050600101616ff8565b50600101616fed565b50505050509392505050565b6060600283511015801561718b575081516001018351145b6171a75760405162461bcd60e51b81526004016163649061a59d565b81516003028351601402016001600160401b03811180156171c757600080fd5b506040519080825280601f01601f1916602001820160405280156171f2576020820181803683370190505b5090506020810160005b84518110156160f75780156172a157600084600183038151811061721c57fe5b60200260200101516001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b15801561725c57600080fd5b505afa158015617270573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906172949190619a5e565b60e81b8352506003909101905b60008582815181106172af57fe5b602090810291909101015160601b8352506014909101906001016171fc565b600082820283158015906172eb5750828482816172e757fe5b0414155b156172fa5760009150506160fa565b6706f05b59d3b20000810181811015617318576000925050506160fa565b670de0b6b3a76400009004949350505050565b606081516001600160401b038111801561734457600080fd5b5060405190808252806020026020018201604052801561736e578160200160208202803683370190505b50905060005b825181101561316b5782600182855103038151811061738f57fe5b60200260200101518282815181106173a357fe5b6001600160a01b0390921660209283029190910190910152600101617374565b606081516001600160401b03811180156173dc57600080fd5b50604051908082528060200260200182016040528015617406578160200160208202803683370190505b50905060005b825181101561316b5782600182855103038151811061742757fe5b602002602001015182828151811061743b57fe5b6001600160a01b039092166020928302919091019091015260010161740c565b6000806000858060200190518101906174749190618d33565b9150915060008580602001905181019061748e9190618d17565b90503063e8e4af098385846174a28a61815e565b6040518563ffffffff1660e01b81526004016174c19493929190619f8a565b60006040518083038186803b1580156174d957600080fd5b505afa92505050801561750e57506040513d6000823e601f3d908101601f1916820160405261750b9190810190619526565b60015b61754f573d80801561753c576040519150601f19603f3d011682016040523d82523d6000602084013e617541565b606091505b5060009450505050506141bf565b8060008151811061755c57fe5b60200260200101519450505050506141bf565b60006114b48361671e61758382600161813f565b61758d88876180c3565b906180f9565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b8152506040516175d19190619efc565b600060405180830381855afa9150503d806000811461760c576040519150601f19603f3d011682016040523d82523d6000602084013e617611565b606091505b509150915081801561762557506020815110155b15617638576176358160006178e1565b92505b5050919050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401617675919061a362565b60a06040518083038186803b15801561768d57600080fd5b505afa1580156176a1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906176c59190619bab565b945094505050925089604001516001600160a01b0316886001600160a01b031614156177dc5760008790506000617775886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561772e57600080fd5b505afa158015617742573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906177669190619574565b670de0b6b3a76400009061813f565b9050600061778f8261671e85670de0b6b3a76400006180c3565b905060006177ad6b033b2e3c9fd0803ce800000061667789856180f9565b90508581106177c657600097505050505050505061684b565b6000616732600161758d8564e8d4a51000618115565b89604001516001600160a01b0316896001600160a01b031614156178c157600061780b8864e8d4a510006180c3565b9050600061784b886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156167e957600080fd5b90506000617865670de0b6b3a764000061671e85856180c3565b90508581111561787e576000965050505050505061684b565b600061789a6b033b2e3c9fd0803ce8000000616677898561813f565b90508481116178b357600097505050505050505061684b565b50955061684b945050505050565b5060009998505050505050505050565b6178dc838383618403565b505050565b60006141bf838361842a565b6000806178f86185b1565b8580602001905181019061790c9190619620565b915091506000858060200190518101906179269190619604565b9050600060603063205e01d760e11b8587866168a98c61815e565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b03161461797f5786617995565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b0316146179b857866179ce565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b16909152617a029291906001906024810161a00c565b60006040518083038186803b158015617a1a57600080fd5b505afa158015617a2e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052617a569190810190619167565b505090508051866000015110617a725750600091506141bf9050565b80866000015181518110617a8257fe5b6020026020010151925060f883901c60001c60bb1415611c805750600091506141bf9050565b600080617ab36185ef565b84806020019051810190617ac79190618e1a565b91509150600086806020019051810190617ae19190618e1a565b50604051633c7b5fe960e21b8152909150309063f1ed7fa490617b0e908590859088908b9060040161a64a565b60206040518083038186803b158015617b2657600080fd5b505afa925050508015617b56575060408051601f3d908101601f19168201909252617b5391810190619574565b60015b617b84573d80801561753c576040519150601f19603f3d011682016040523d82523d6000602084013e617541565b93506141bf92505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b8152600401617bc2929190619f45565b60006040518083038186803b158015617bda57600080fd5b505afa158015617bee573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052617c1691908101906190cf565b905060019150805160001415617caf576040516315e8a07760e21b81526001600160a01b038816906357a281dc90617c549087908990600401619f45565b60006040518083038186803b158015617c6c57600080fd5b505afa158015617c80573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052617ca891908101906190cf565b9050600091505b80518610617cc4576000809250925050616329565b808681518110617cd057fe5b602002602001015192505094509492505050565b60008060008086806020019051810190617cfe9190618dca565b9250925092508015617da257604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e090617d3e906000908a90600401619f2c565b604080518083038187803b158015617d5557600080fd5b5086fa93505050508015617d86575060408051601f3d908101601f19168201909252617d8391810190619b53565b60015b617d9657600093505050506141bf565b5093506141bf92505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e090617d3e906000908a90600401619f2c565b600080600085806020019051810190617def9190618d33565b91509150600085806020019051810190617e099190618d17565b9050306330d6570d8385846174a28a61815e565b6000806060846001600160a01b03166370a0823160e01b85604051602401617e459190619f18565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051617e839190619efc565b600060405180830381855afa9150503d8060008114617ebe576040519150601f19603f3d011682016040523d82523d6000602084013e617ec3565b606091505b5091509150818015617ed757506020815110155b156160f7576115228160006178e1565b600080600085806020019051810190617f009190618d33565b91509150600085806020019051810190617f1a9190618d17565b90503063a469841762061a80848685617f328b61815e565b6040518663ffffffff1660e01b8152600401617f519493929190619f8a565b60006040518083038187803b158015617f6957600080fd5b5086fa9350505050801561750e57506040513d6000823e601f3d908101601f1916820160405261750b9190810190619526565b6000806060856001600160a01b031663dd62ed3e60e01b8686604051602401617fc6929190619f45565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516180049190619efc565b600060405180830381855afa9150503d806000811461803f576040519150601f19603f3d011682016040523d82523d6000602084013e618044565b606091505b509150915081801561805857506020815110155b15611c805761684b8160006178e1565b60006160fa82617593565b60008060008580602001905181019061808c9190618d33565b91509150600080868060200190518101906180a79190618d33565b915091506180b7848483896142ec565b98975050505050505050565b6000826180d2575060006160fa565b828202828482816180df57fe5b04146141bf576141bf6180f460018686618454565b6184ae565b6000828201838110156141bf576141bf6180f460008686618454565b60008161812b5761812b6180f460038585618454565b600082848161813657fe5b04949350505050565b600082821115618158576181586180f460028585618454565b50900390565b60408051600180825281830190925260609160208083019080368337019050509050818160008151811061818e57fe5b602002602001018181525050919050565b60008315806181ac575081155b806181b5575082155b156181c2575060006141bf565b838202828582816181cf57fe5b04146181df5760009150506141bf565b83600185038201816181ed57fe5b0495945050505050565b6000813b8061820a576000915050610e71565b50816001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561824457600080fd5b505afa158015618258573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061827c9190618d17565b6001600160a01b03166370a08231836040518263ffffffff1660e01b81526004016182a79190619f18565b60206040518083038186803b1580156182bf57600080fd5b505afa1580156182d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906182f79190619574565b61830357506000610e71565b816001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b15801561833c57600080fd5b505afa158015618350573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906183749190618d17565b6001600160a01b03166370a08231836040518263ffffffff1660e01b815260040161839f9190619f18565b60206040518083038186803b1580156183b757600080fd5b505afa1580156183cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906183ef9190619574565b6183fb57506000610e71565b506001919050565b8160200183511015618422576184226180f460058551856020016184b6565b910160200152565b6000816020018351101561844b5761844b6180f460058551856020016184b6565b50016020015190565b606063e946c1bb60e01b8484846040516024016184739392919061a3f6565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b8484846040516024016184739392919061a417565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b60408051808201909152606081526000602082015290565b604051806040016040528060008152602001606081525090565b6040805160608101909152600080825260208201908152600060209091015290565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b60405180608001604052806004906020820280368337509192915050565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b80356160fa8161a874565b600082601f830112618654578081fd5b81356186676186628261a7ea565b61a7c4565b81815291506020808301908481018184028601820187101561868857600080fd5b60005b848110156186b057813561869e8161a874565b8452928201929082019060010161868b565b505050505092915050565b600082601f8301126186cb578081fd5b81356186d96186628261a7ea565b818152915060208083019084810160005b848110156186b057618701888484358a0101618644565b845292820192908201906001016186ea565b600082601f830112618723578081fd5b81356187316186628261a7ea565b818152915060208083019084810160005b848110156186b057618759888484358a0101618972565b84529282019290820190600101618742565b600082601f83011261877b578081fd5b81356187896186628261a7ea565b8181529150602080830190848101818402860182018710156187aa57600080fd5b60005b848110156186b05781356187c08161a874565b845292820192908201906001016187ad565b600082601f8301126187e2578081fd5b81356187f06186628261a7ea565b818152915060208083019084810160808085028701830188101561881357600080fd5b60005b8581101561883a576188288984618c71565b85529383019391810191600101618816565b50505050505092915050565b600082601f830112618856578081fd5b81356188646186628261a7ea565b81815291506020808301908481018184028601820187101561888557600080fd5b60005b848110156186b057813584529282019290820190600101618888565b600082601f8301126188b4578081fd5b81516188c26186628261a7ea565b8181529150602080830190848101818402860182018710156188e357600080fd5b60005b848110156186b0578151845292820192908201906001016188e6565b600082601f830112618912578081fd5b81516189206186628261a7ea565b81815291506020808301908481018184028601820187101561894157600080fd5b6000805b8581101561883a57825163ffffffff81168114618960578283fd5b85529383019391830191600101618945565b600082601f830112618982578081fd5b81356189906186628261a809565b91508082528360208285010111156189a757600080fd5b8060208401602084013760009082016020015292915050565b600082601f8301126189d0578081fd5b81516189de6186628261a809565b91508082528360208285010111156189f557600080fd5b61307881602084016020860161a837565b8051600281106160fa57600080fd5b600060608284031215618a26578081fd5b618a30606061a7c4565b90508135618a3d8161a874565b81526020820135618a4d8161a897565b60208201526040820135618a608161a897565b604082015292915050565b600060608284031215618a7c578081fd5b618a86606061a7c4565b90508151618a938161a874565b81526020820151618aa38161a897565b60208201526040820151618a608161a897565b600060408284031215618ac7578081fd5b618ad1604061a7c4565b90508135618ade8161a874565b81526020820135618aee8161a874565b602082015292915050565b600060a08284031215618b0a578081fd5b618b1460a061a7c4565b9050813581526020820135618b288161a874565b60208201526040820135618b3b8161a874565b60408201526060820135618b4e8161a874565b606082015260808201356001600160401b03811115618b6c57600080fd5b618b7884828501618972565b60808301525092915050565b6000610180808385031215618b97578182fd5b618ba08161a7c4565b915050618bad8383618639565b8152618bbc8360208401618639565b6020820152618bce8360408401618cce565b6040820152618be08360608401618cce565b6060820152618bf28360808401618cce565b6080820152618c048360a08401618639565b60a0820152618c168360c08401618639565b60c0820152618c288360e08401618639565b60e0820152610100618c3c84828501618639565b908201526101208281013590820152610140618c5a84828501618ce4565b818301525061016080830135818301525092915050565b600060808284031215618c82578081fd5b618c8c608061a7c4565b9050813560048110618c9d57600080fd5b81526020820135618cad8161a8d1565b80602083015250604082013560408201526060820135606082015292915050565b80356160fa8161a8bc565b80516160fa8161a874565b80356001600160401b03811681146160fa57600080fd5b600060208284031215618d0c578081fd5b81356141bf8161a874565b600060208284031215618d28578081fd5b81516141bf8161a874565b60008060408385031215618d45578081fd5b8251618d508161a874565b6020840151909250618d618161a874565b809150509250929050565b60008060008060808587031215618d81578182fd5b8451618d8c8161a874565b6020860151909450618d9d8161a874565b6040860151909350618dae8161a874565b6060860151909250618dbf8161a874565b939692955090935050565b600080600060608486031215618dde578081fd5b8351618de98161a874565b6020850151909350618dfa8161a874565b60408501519092508015158114618e0f578182fd5b809150509250925092565b60008060408385031215618e2c578182fd5b8251618e378161a874565b60208401519092506001600160401b0380821115618e53578283fd5b9084019060a08287031215618e66578283fd5b618e7060a061a7c4565b825181526020830151618e828161a874565b60208201526040830151618e958161a874565b60408201526060830151618ea88161a874565b6060820152608083015182811115618ebe578485fd5b618eca888286016189c0565b6080830152508093505050509250929050565b600080600080600060a08688031215618ef4578283fd5b8535618eff8161a874565b94506020860135618f0f8161a874565b93506040860135618f1f8161a874565b92506060860135618f2f8161a874565b915060808601356001600160401b03811115618f49578182fd5b618f5588828901618846565b9150509295509295909350565b60008060008060808587031215618f77578182fd5b8435618f828161a874565b93506020850135618f928161a874565b92506040850135618fa28161a874565b915060608501356001600160401b03811115618fbc578182fd5b618fc887828801618846565b91505092959194509250565b60008060008060808587031215618fe9578182fd5b8435618ff48161a874565b935060208501356190048161a874565b925060408501356190148161a874565b9396929550929360600135925050565b600080600060608486031215619038578081fd5b83356190438161a874565b925060208401356001600160401b038082111561905e578283fd5b61906a87838801618644565b9350604086013591508082111561907f578283fd5b5061908c86828701618846565b9150509250925092565b600080600080600060a086880312156190ad578283fd5b85356190b88161a874565b9450602086013593506040860135618f1f8161a874565b600060208083850312156190e1578182fd5b82516001600160401b038111156190f6578283fd5b8301601f81018513619106578283fd5b80516191146186628261a7ea565b8181528381019083850185840285018601891015619130578687fd5b8694505b8385101561915b5780516191478161a874565b835260019490940193918501918501619134565b50979650505050505050565b60008060006060848603121561917b578081fd5b83516001600160401b0380821115619191578283fd5b818601915086601f8301126191a4578283fd5b81516191b26186628261a7ea565b80828252602080830192508086018b8283870289010111156191d2578788fd5b8796505b848710156191f45780518452600196909601959281019281016191d6565b50890151909750935050508082111561920b578283fd5b50619218868287016188a4565b9250506192288560408601618a06565b90509250925092565b60008060208385031215619243578182fd5b82356001600160401b0380821115619259578384fd5b818501915085601f83011261926c578384fd5b81358181111561927a578485fd5b866020808302850101111561928d578485fd5b60209290920196919550909350505050565b6000806000606084860312156192b3578081fd5b83356001600160401b03808211156192c9578283fd5b6192d587838801618713565b945060208601359150808211156192ea578283fd5b506192f786828701618713565b925050604084013590509250925092565b600060208284031215619319578081fd5b81356001600160401b0381111561932e578182fd5b6114b48482850161876b565b6000806040838503121561934c578182fd5b82356001600160401b03811115619361578283fd5b61936d8582860161876b565b9250506020830135618d618161a874565b600080600060608486031215619392578081fd5b83356001600160401b038111156193a7578182fd5b6193b38682870161876b565b93505060208401356193c48161a874565b91506040840135618e0f8161a874565b600060208083850312156193e6578182fd5b82516001600160401b038111156193fb578283fd5b8301601f8101851361940b578283fd5b80516194196186628261a7ea565b8181528381019083850185840285018601891015619435578687fd5b8694505b8385101561915b578051835260019490940193918501918501619439565b60008060006060848603121561946b578081fd5b83356001600160401b0380821115619481578283fd5b818601915086601f830112619494578283fd5b81356194a26186628261a7ea565b80828252602080830192508086016101808c838288028a010111156194c5578889fd5b8897505b858810156194f1576194db8d83618b84565b85526001979097019693820193908101906194c9565b50919850890135945050505080821115619509578283fd5b50619516868287016187d2565b9250506192288560408601618639565b600060208284031215619537578081fd5b81516001600160401b0381111561954c578182fd5b6114b4848285016188a4565b600060208284031215619569578081fd5b81516141bf8161a889565b600060208284031215619585578081fd5b5051919050565b60006020828403121561959d578081fd5b81516001600160401b038111156195b2578182fd5b6114b4848285016189c0565b6000806000606084860312156195d2578081fd5b83356195dd8161a874565b925060208401356001600160401b03808211156195f8578283fd5b61906a8783880161876b565b600060208284031215619615578081fd5b81516141bf8161a8ad565b60008060808385031215619632578182fd5b825161963d8161a8ad565b915061964c8460208501618a6b565b90509250929050565b60008060008084860360a081121561966b578283fd5b6040811215619678578283fd5b50619683604061a7c4565b8535815260208601356196958161a874565b6020820152935060408501356196aa8161a874565b925060608501356196ba8161a874565b915060808501356001600160401b03811115618fbc578182fd5b600080600080608085870312156196e9578182fd5b84356001600160401b03808211156196ff578384fd5b9086019060408289031215619712578384fd5b61971c604061a7c4565b6197268984618639565b8152602083013582811115619739578586fd5b6197458a8286016186bb565b6020830152508096505061975c8860208901618639565b945061976b8860408901618639565b93506060870135915080821115619780578283fd5b50618fc887828801618846565b60008060008060c085870312156197a2578182fd5b6197ac8686618a15565b935060608501356197bc8161a8ad565b925060808501356197cc8161a8ad565b915060a08501356001600160401b03811115618fbc578182fd5b60008060008060a085870312156197fb578182fd5b6198058686618ab6565b935060408501356196aa8161a874565b6000806000806080858703121561982a578182fd5b84356001600160401b0380821115619840578384fd5b61984c88838901618af9565b95506020870135915061985e8261a874565b9093506040860135906198708261a874565b90925060608601359080821115619780578283fd5b6000806000806080858703121561989a578182fd5b84356001600160401b038111156198af578283fd5b6198bb87828801618af9565b94505060208501356190048161a874565b600080600080608085870312156198e1578182fd5b84356001600160401b038111156198f6578283fd5b61990287828801618af9565b94505060208501359250604085013561991a8161a874565b91506060850135618dbf8161a874565b6000806000610220848603121561993f578081fd5b6199498585618b84565b9250619959856101808601618c71565b9150610200840135618e0f8161a874565b60008060008084860360c0811215619980578283fd5b606081121561998d578283fd5b50619998606061a7c4565b85356199a38161a874565b81526020868101359082015260408601356199bd8161a874565b6040820152935060608501356199d28161a874565b925060808501356197cc8161a874565b600080600083850360a08112156199f7578182fd5b6060811215619a04578182fd5b50619a0f606061a7c4565b84518152602085015160058110619a24578283fd5b60208201526040850151619a378161a8bc565b60408201526060850151909350619a4d8161a8bc565b6080850151909250618e0f8161a889565b600060208284031215619a6f578081fd5b815162ffffff811681146141bf578182fd5b60008060008060808587031215619a96578182fd5b845193506020808601516001600160401b0380821115619ab4578485fd5b818801915088601f830112619ac7578485fd5b8151619ad56186628261a7ea565b81815284810190848601868402860187018d1015619af1578889fd5b8895505b83861015619b1b57619b078d82618cd9565b835260019590950194918601918601619af5565b5060408b01519098509450505080831115619b34578485fd5b5050619b4287828801618902565b606096909601519497939650505050565b60008060408385031215619b65578182fd5b505080516020909101519092909150565b60008060008060808587031215619b8b578182fd5b505082516020840151604085015160609095015191969095509092509050565b600080600080600060a08688031215619bc2578283fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b600060208284031215619bfb578081fd5b81516141bf8161a8d1565b6001600160a01b0316815260200190565b600081518352602082015160208401526040820151604084015260608201516060840152608082015160a060808501526114b460a0850182619cd3565b6001600160a01b03169052565b6000815180845260208085019450808401835b83811015619c995781516001600160a01b031687529582019590820190600101619c74565b509495945050505050565b6000815180845260208085019450808401835b83811015619c9957815187529582019590820190600101619cb7565b60008151808452619ceb81602086016020860161a837565b601f01601f19169290920160200192915050565b80516001600160a01b031682526020808201516001600160e01b03199081169184019190915260409182015116910152565b80516001600160a01b039081168352602080830151151590840152604080830151909116908301526060908101511515910152565b6000815183526020820151604060208501526114b46040850182619cd3565b600081518352602082015160018060a01b0380821660208601528060408501511660408601528060608501511660608601525050608082015160a060808501526114b460a0850182619cd3565b619ddd828251619c54565b6020810151619def6020840182619c54565b506040810151619e026040840182619ed2565b506060810151619e156060840182619ed2565b506080810151619e286080840182619ed2565b5060a0810151619e3b60a0840182619c54565b5060c0810151619e4e60c0840182619c54565b5060e0810151619e6160e0840182619c54565b5061010080820151619e7582850182619c54565b5050610120818101519083015261014080820151619e9582850182619edf565b505061016090810151910152565b8051619eae8161a867565b825260208181015160ff169083015260408082015190830152606090810151910152565b6001600160801b03169052565b6001600160401b03169052565b6000828483379101908152919050565b60008251619f0e81846020870161a837565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03948516815292841660208401529083166040830152909116606082015260800190565b6001600160a01b03858116825284811660208301528316604082015260806060820181905260009061684b90830184619ca4565b6001600160a01b039485168152928416602084015292166040820152606081019190915260800190565b6001600160a01b039384168152919092166020820152901515604082015260600190565b6001600160a01b03858116825284166020820152821515604082015260806060820181905260009061684b90830184619cd3565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a06080820181905260009061a09e90830184619cd3565b979650505050505050565b6001600160a01b038416815260606020820181905260009061a0cd90830185619c61565b828103604084015261684b8185619ca4565b6001600160a01b0385168152600061a0f68561a867565b8460208301526080604083015261a1106080830185619ca4565b828103606084015261a09e8185619ca4565b6001600160a01b0389811682526000906101009061a13f8b61a867565b8a602085015281604085015261a1578285018b619ca4565b9150838203606085015261a16b828a619ca4565b9088166080850152905061a17e8661a867565b8560a084015282810360c084015261a1968186619ca4565b905082810360e084015261a1aa8185619ca4565b9b9a5050505050505050505050565b6001600160a01b03831681526040602082018190526000906114b490830184619d85565b60006040825261a1f06040830185619c61565b82810360208401526115228185619ca4565b60006040825261a2156040830185619c61565b90508260208301529392505050565b60006060820160608352808651808352608085019150602092506080838202860101838901855b8381101561a27957607f1988840301855261a267838351619cd3565b9486019492509085019060010161a24b565b50508581038487015261a28c8189619ca4565b9350505050828103604084015261684b8185619ca4565b60208082528251828201819052600091906040908185019080840286018301878501865b8381101561a30a57888303603f190185528151805187855261a2eb88860182619cd3565b918901511515948901949094529487019492509086019060010161a2c7565b509098975050505050505050565b6000602082526141bf6020830184619ca4565b901515815260200190565b83151581526001600160a01b038316602082015260606040820181905260009061152290830184619ca4565b90815260200190565b60008482526060602083015261a0cd6060830185619cd3565b6000602082526141bf6020830184619cd3565b60006040825261a2156040830185619cd3565b6001600160a01b03938416815291909216602082015262ffffff909116604082015260600190565b6001600160a01b03831681526040602082018190526000906114b490830184619ca4565b6060810161a4038561a867565b938152602081019290925260409091015290565b606081016008851061a40357fe5b600060e0820161a4348761a82c565b8352602060e08185015281875161a44b818561a362565b91508193508281028201838a01865b8381101561a48457868303855261a472838351619c17565b9486019492509085019060010161a45a565b505086810360408801528094508851925061a49f838261a362565b94505050818701845b8281101561a4c95761a4bb858351619c06565b94509083019060010161a4a8565b50505050809150506115226060830184619d31565b600f93840b81529190920b6020820152604081019190915260600190565b600f83900b8152608081016141bf6020830184619cff565b60208082526024908201527f556e6973776170563353616d706c65722f746f6b656e5061746820746f6f20736040820152631a1bdc9d60e21b606082015260800190565b60208082526025908201527f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e6040820152642fa820a4a960d91b606082015260800190565b60208082526025908201527f556e6973776170563353616d706c65722f696e76616c69642070617468206c656040820152646e6774687360d81b606082015260800190565b600061a5ee8287619cff565b84600f0b606083015283600f0b608083015260c060a083015261684b60c0830184619ca4565b60006060825261a6276060830186619d66565b828103602084015261a6398186619d66565b915050826040830152949350505050565b60006080825261a65d6080830187619d85565b6001600160a01b0395861660208401529390941660408201526060015292915050565b60006080825261a6936080830187619d85565b6020830195909552506001600160a01b0392831660408201529116606090910152919050565b610200810161a6c88285619dd2565b6141bf610180830184619ea3565b610220810161a6e58286619dd2565b61a6f3610180830185619ea3565b6001600160a01b0392909216610200919091015292915050565b6000838252604060208301526114b46040830184619c61565b60008482526060602083015261a73f6060830185619c61565b828103604084015261684b8185619c61565b958652602086019490945260408501929092526060840152608083015260a082015260c00190565b6000808335601e1984360301811261a78f578283fd5b8301803591506001600160401b0382111561a7a8578283fd5b60200191503681900382131561a7bd57600080fd5b9250929050565b6040518181016001600160401b038111828210171561a7e257600080fd5b604052919050565b60006001600160401b0382111561a7ff578081fd5b5060209081020190565b60006001600160401b0382111561a81e578081fd5b50601f01601f191660200190565b8060028110610e7157fe5b60005b8381101561a85257818101518382015260200161a83a565b8381111561a861576000848401525b50505050565b6004811061a87157fe5b50565b6001600160a01b038116811461a87157600080fd5b801515811461a87157600080fd5b6001600160e01b03198116811461a87157600080fd5b80600f0b811461a87157600080fd5b6001600160801b038116811461a87157600080fd5b60ff8116811461a87157600080fdfea26469706673582212209da2a874317d63d50314220982dafe1fa22428ec91a95c303d9ecabbc50ce2a264736f6c634300060c0033';
ERC20BridgeSamplerContract.contractName = 'ERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=erc20_bridge_sampler.js.map