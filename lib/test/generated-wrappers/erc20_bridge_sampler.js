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
                        name: 'reader',
                        type: 'address',
                    },
                    {
                        name: 'vault',
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
                name: 'sampleBuysFromGMX',
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
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromPlatypus',
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
                        name: 'reader',
                        type: 'address',
                    },
                    {
                        name: 'vault',
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
                name: 'sampleSellsFromGMX',
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
                        name: 'path',
                        type: 'address[]',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromPlatypus',
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
    sampleBuysFromGMX(reader, vault, path, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('reader', reader);
        assert_1.assert.isString('vault', vault);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromGMX(address,address,address[],uint256[])';
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
                return self._strictEncodeArguments(functionSignature, [reader.toLowerCase(),
                    vault.toLowerCase(),
                    path,
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
    sampleBuysFromPlatypus(pool, path, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('pool', pool);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromPlatypus(address,address[],uint256[])';
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
                    path,
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
    sampleSellsFromGMX(reader, vault, path, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('reader', reader);
        assert_1.assert.isString('vault', vault);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromGMX(address,address,address[],uint256[])';
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
                return self._strictEncodeArguments(functionSignature, [reader.toLowerCase(),
                    vault.toLowerCase(),
                    path,
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
    sampleSellsFromPlatypus(pool, path, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('pool', pool);
        assert_1.assert.isArray('path', path);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromPlatypus(address,address[],uint256[])';
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
                    path,
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
ERC20BridgeSamplerContract.deployedBytecode = '0x6080604052600436106103905760003560e01c80637f7f4f13116101dc578063bd71ecf611610102578063ddd5aa28116100a0578063f3868e9c1161006f578063f3868e9c1461058b578063f5a4994d14610b17578063f6d6794a14610b37578063fc9fe41b14610b5757610397565b8063ddd5aa2814610a97578063e78ac04514610ab7578063e8e4af0914610ad7578063f1ed7fa414610af757610397565b8063c8c74a37116100dc578063c8c74a3714610a17578063cc130e8314610a37578063cc1621c914610a57578063d9bca37214610a7757610397565b8063bd71ecf6146109b7578063c25c4138146109d7578063c8319084146109f757610397565b80639e3f05c31161017a578063a75e744b11610149578063a75e744b14610929578063a76bbec414610949578063adc636bf14610969578063b90cd2fb1461099757610397565b80639e3f05c31461089a5780639ea0ff13146108c9578063a0295b8b146108e9578063a46984171461090957610397565b80638e5a0e07116101b65780638e5a0e071461080b5780639209483b1461083a578063987777481461085a5780639bf3ee351461087a57610397565b80637f7f4f13146107ab5780638a2d1971146107cb5780638b6d7b44146107eb57610397565b80634092e6b1116102c157806357494b1d1161025f57806368be3cf21161022e57806368be3cf21461071e578063706e2f9b1461074b57806374c9d2551461076b5780637f3e7f821461078b57610397565b806357494b1d1461069e5780635aae4e53146106be5780635d5b674f146106de57806366a1ac6b146106fe57610397565b8063494569db1161029b578063494569db1461060d5780634edfb5b21461062d57806351be4eaa1461065a5780635505000a1461066f57610397565b80634092e6b1146105ab57806340bc03ae146105cb57806342cbb15c146105eb57610397565b8063252322b31161032e5780632aa64319116103085780632aa643191461051c57806330d6570d1461054b5780633105fec11461056b578063360523911461058b57610397565b8063252322b3146104bc578063281e3432146104dc57806329fa4aa0146104fc57610397565b8063149dab0e1161036a578063149dab0e14610420578063162790551461044f5780631976f5261461047c5780632339078f1461049c57610397565b8063034eaff91461039c5780630496d5dc146103d25780631022742b1461040057610397565b3661039757005b600080fd5b3480156103a857600080fd5b506103bc6103b736600461a667565b610b77565b6040516103c9919061b6a6565b60405180910390f35b3480156103de57600080fd5b506103f26103ed36600461a1b0565b610d99565b6040516103c992919061b62b565b34801561040c57600080fd5b506103bc61041b36600461a509565b610f3f565b34801561042c57600080fd5b5061044061043b36600461a7c0565b6110b2565b6040516103c99392919061b50a565b34801561045b57600080fd5b5061046f61046a366004619e88565b611212565b6040516103c9919061b6b7565b34801561048857600080fd5b506103bc61049736600461a61d565b61121c565b3480156104a857600080fd5b506103bc6104b736600461a760565b611387565b3480156104c857600080fd5b506103bc6104d736600461a094565b6115b1565b3480156104e857600080fd5b506103bc6104f736600461a99b565b61177b565b34801561050857600080fd5b506103bc61051736600461a7f8565b6119d0565b34801561052857600080fd5b5061053c61053736600461a858565b611a3f565b6040516103c99392919061b6c5565b34801561055757600080fd5b506103bc61056636600461a094565b611d1c565b34801561057757600080fd5b506103bc61058636600461a1b0565b611e90565b34801561059757600080fd5b506103bc6105a636600461a858565b612014565b3480156105b757600080fd5b506103bc6105c636600461a155565b6120a6565b3480156105d757600080fd5b506103bc6105e636600461a7f8565b612221565b3480156105f757600080fd5b506106006123a2565b6040516103c9919061b6f2565b34801561061957600080fd5b506103f261062836600461a1b0565b6123a6565b34801561063957600080fd5b5061064d61064836600461a8ea565b612532565b6040516103c9919061b720565b34801561066657600080fd5b506106006127b0565b34801561067b57600080fd5b5061068f61068a36600461a6c9565b6127b8565b6040516103c99392919061b670565b3480156106aa57600080fd5b506103bc6106b936600461a094565b612aad565b3480156106ca57600080fd5b5061068f6106d936600461a6c9565b613024565b3480156106ea57600080fd5b506103bc6106f936600461a094565b613309565b34801561070a57600080fd5b506103bc61071936600461a509565b61336f565b34801561072a57600080fd5b5061073e61073936600461a351565b613424565b6040516103c9919061b695565b34801561075757600080fd5b506103bc61076636600461a402565b613585565b34801561077757600080fd5b5061044061078636600461a7c0565b613677565b34801561079757600080fd5b506103bc6107a636600461a1b0565b613686565b3480156107b757600080fd5b506103bc6107c636600461a99b565b613796565b3480156107d757600080fd5b506103bc6107e636600461a155565b6139e3565b3480156107f757600080fd5b506103bc61080636600461a7f8565b613af5565b34801561081757600080fd5b5061082b61082636600461a392565b613e58565b6040516103c99392919061b8e6565b34801561084657600080fd5b506103bc61085536600461a7f8565b61406e565b34801561086657600080fd5b506103bc61087536600461a094565b61426e565b34801561088657600080fd5b5061060061089536600461a955565b6147a7565b3480156108a657600080fd5b506108ba6108b536600461a87a565b6148ec565b6040516103c99392919061b700565b3480156108d557600080fd5b506106006108e436600461a100565b614a12565b3480156108f557600080fd5b506103bc61090436600461a760565b614c28565b34801561091557600080fd5b506103bc61092436600461a094565b614e24565b34801561093557600080fd5b5061053c61094436600461a221565b614f79565b34801561095557600080fd5b506103bc61096436600461a667565b6150b6565b34801561097557600080fd5b5061098961098436600461a094565b6152c5565b6040516103c992919061b785565b3480156109a357600080fd5b506103bc6109b236600461a094565b615415565b3480156109c357600080fd5b506103bc6109d236600461a436565b61547b565b3480156109e357600080fd5b506103bc6109f236600461a094565b615577565b348015610a0357600080fd5b506103bc610a1236600461a094565b6155dd565b348015610a2357600080fd5b506103bc610a3236600461a1b0565b61579a565b348015610a4357600080fd5b506103bc610a5236600461a61d565b615906565b348015610a6357600080fd5b506108ba610a7236600461a87a565b615a78565b348015610a8357600080fd5b5061053c610a9236600461a221565b615c5e565b348015610aa357600080fd5b5061053c610ab236600461a858565b615d4d565b348015610ac357600080fd5b506103bc610ad236600461a47c565b615fe0565b348015610ae357600080fd5b506103bc610af236600461a094565b6160d5565b348015610b0357600080fd5b50610600610b1236600461a8b2565b616208565b348015610b2357600080fd5b50610989610b3236600461a094565b6163a7565b348015610b4357600080fd5b506103bc610b5236600461a1b0565b616493565b348015610b6357600080fd5b5061082b610b7236600461a392565b61660c565b8051606090806001600160401b0381118015610b9257600080fd5b50604051908082528060200260200182016040528015610bbc578160200160208202803683370190505b5091506000866001600160a01b031663182df0f56040518163ffffffff1660e01b815260040160206040518083038186803b158015610bfa57600080fd5b505afa158015610c0e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c32919061a5cb565b90506000876001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015610c6f57600080fd5b505afa158015610c83573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca7919061ab9f565b60ff169050876001600160a01b0316866001600160a01b03161415610d1f5760005b83811015610d195781600a0a6402540be4000283878381518110610ce957fe5b60200260200101510281610cf957fe5b04858281518110610d0657fe5b6020908102919091010152600101610cc9565b50610d8e565b876001600160a01b0316876001600160a01b03161415610d8e5760005b83811015610d8c578282600a0a6402540be400888481518110610d5b57fe5b6020026020010151020281610d6c57fe5b04858281518110610d7957fe5b6020908102919091010152600101610d3c565b505b505050949350505050565b80516060908190806001600160401b0381118015610db657600080fd5b50604051908082528060200260200182016040528015610de0578160200160208202803683370190505b509150610ded8686616821565b9250825160001415610dff5750610f37565b60005b81811015610f3457866001600160a01b031663a8312b1d620249f0878481518110610e2957fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401610e519392919061b9b0565b60006040518083038187803b158015610e6957600080fd5b5086fa93505050508015610e9f57506040513d6000823e601f3d908101601f19168201604052610e9c919081019061a579565b60015b610ed9573d808015610ecd576040519150601f19603f3d011682016040523d82523d6000602084013e610ed2565b606091505b5050610f34565b80600188510381518110610ee957fe5b6020026020010151848381518110610efd57fe5b602002602001018181525050838281518110610f1557fe5b602002602001015160001415610f2b5750610f34565b50600101610e02565b50505b935093915050565b606083516001600160401b0381118015610f5857600080fd5b50604051908082528060200260200182016040528015610f82578160200160208202803683370190505b50905060005b845181146110aa57306001600160a01b0316639bf3ee3562030d40878481518110610faf57fe5b6020026020010151878581518110610fc357fe5b6020026020010151876040518563ffffffff1660e01b8152600401610fea9392919061b977565b60206040518083038187803b15801561100257600080fd5b5086fa93505050508015611033575060408051601f3d908101601f191682019092526110309181019061a5cb565b60015b611087573d808015611061576040519150601f19603f3d011682016040523d82523d6000602084013e611066565b606091505b50600083838151811061107557fe5b602002602001018181525050506110a2565b8083838151811061109457fe5b602002602001018181525050505b600101610f88565b509392505050565b6000606080866020015151600014156110ca57611208565b6110d687878787616b11565b855191945092506001600160401b03811180156110f257600080fd5b5060405190808252806020026020018201604052801561111c578160200160208202803683370190505b50905060005b815181101561120657836001600160a01b0316637f9c0ecd620493e08588858151811061114b57fe5b60200260200101516040518463ffffffff1660e01b815260040161117092919061b650565b60206040518083038187803b15801561118857600080fd5b5086fa935050505080156111b9575060408051601f3d908101601f191682019092526111b69181019061a5cb565b60015b6111c257611206565b808383815181106111cf57fe5b6020026020010181815250508282815181106111e757fe5b6020026020010151600014156111fd5750611206565b50600101611122565b505b9450945094915050565b803b15155b919050565b8051606090806001600160401b038111801561123757600080fd5b50604051908082528060200260200182016040528015611261578160200160208202803683370190505b50915061126c619044565b611274616d43565b905060005b82811015610d8e5784818151811061128d57fe5b6020026020010151876000815181106112a257fe5b602090810291909101015160600152604051637c26833760e11b81526001600160a01b0389169063f84d066e906112e4906001908b908b90889060040161b803565b600060405180830381600087803b1580156112fe57600080fd5b505af192505050801561133357506040513d6000823e601f3d908101601f19168201604052611330919081019061a4d5565b60015b61133c57610d8e565b60008160008151811061134b57fe5b6020026020010151905060008113611364575050610d8e565b8086848151811061137157fe5b6020026020010181815250505050600101611279565b60606113938385616d72565b6020850151604080516002808252606082810190935281602001602082028036833701905050905085816000815181106113c957fe5b60200260200101906001600160a01b031690816001600160a01b03168152505084816001815181106113f757fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561142757600080fd5b50604051908082528060200260200182016040528015611451578160200160208202803683370190505b50935061145c619044565b611464616d43565b905060005b828110156115a45760606114908b89848151811061148357fe5b6020026020010151616db1565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906114c69060009085908a90899060040161b803565b600060405180830381600087803b1580156114e057600080fd5b505af192505050801561151557506040513d6000823e601f3d908101601f19168201604052611512919081019061a4d5565b60015b611550573d808015611543576040519150601f19603f3d011682016040523d82523d6000602084013e611548565b606091505b5050506115a4565b60008160018351038151811061156257fe5b602002602001015160001902905060008113611580575050506115a4565b8089858151811061158d57fe5b602002602001018181525050505050600101611469565b5050505050949350505050565b60606115bd8385616d72565b8151806001600160401b03811180156115d557600080fd5b506040519080825280602002602001820160405280156115ff578160200160208202803683370190505b50915060006001600160a01b038616156116225761161d8787616e43565b611625565b60005b905060006001600160a01b03861615611647576116428887616e43565b61164a565b60005b905060005b83811015610d8c5760016001600160a01b0388166116ad5761168c84632640f62c60e01b89858151811061167f57fe5b6020026020010151616ec2565b87848151811061169857fe5b60200260200101819350828152505050611747565b6001600160a01b0389166116d35761168c836359e9486260e01b89858151811061167f57fe5b60006116ed846359e9486260e01b8a868151811061167f57fe5b92509050801561172a57611709856309903d8b60e21b83616ec2565b88858151811061171557fe5b60200260200101819450828152505050611745565b600087848151811061173857fe5b6020026020010181815250505b505b801580611767575085828151811061175b57fe5b60200260200101516000145b156117725750610d8c565b5060010161164f565b60606117878385616d72565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b1580156117cb57600080fd5b505afa1580156117df573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118039190619ea6565b8451909150806001600160401b038111801561181e57600080fd5b50604051908082528060200260200182016040528015611848578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561188457600080fd5b505afa158015611898573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118bc9190619ea6565b6001600160a01b0316866001600160a01b03161415801561195f5750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561191157600080fd5b505afa158015611925573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119499190619ea6565b6001600160a01b0316876001600160a01b031614155b1561196c575050506119c8565b60005b81811015610d8c57600061199a8a898b8a868151811061198b57fe5b60200260200101518989616fa5565b9050806119a75750610d8c565b808683815181106119b457fe5b60209081029190910101525060010161196f565b949350505050565b604080516060818101909252611a3690806119ef86896080840161b861565b60405160208183030381529060405281526020018688604051602001611a1692919061b861565b604051602081830303815290604052815260200161726481525083617397565b95945050505050565b6000806060611a4e8587616d72565b8351806001600160401b0381118015611a6657600080fd5b50604051908082528060200260200182016040528015611a90578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c690611ac3908a908a9060040161b316565b60206040518083038186803b158015611adb57600080fd5b505afa158015611aef573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b139190619ea6565b925060006001600160a01b03841615611b3157506001935086611bd0565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690611b62908a908c9060040161b316565b60206040518083038186803b158015611b7a57600080fd5b505afa158015611b8e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bb29190619ea6565b93506001600160a01b038416611bc9575050611208565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b158015611c0957600080fd5b505afa158015611c1d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c41919061a5ad565b611c4c575050611208565b60005b82811015611d0f576000611cc98a87858e60200151604051602001611c77949392919061b331565b6040516020818303038152906040528a88868f60200151604051602001611ca1949392919061b331565b6040516020818303038152906040528a8581518110611cbc57fe5b60200260200101516175a9565b905080858381518110611cd857fe5b602002602001018181525050848281518110611cf057fe5b602002602001015160001415611d065750611d0f565b50600101611c4f565b5050509450945094915050565b6060611d288385616d72565b8151806001600160401b0381118015611d4057600080fd5b50604051908082528060200260200182016040528015611d6a578160200160208202803683370190505b50915060005b81811015611e8657866001600160a01b03166372ea9076620c35008888888681518110611d9957fe5b60200260200101516040518563ffffffff1660e01b8152600401611dbf9392919061b470565b60206040518083038187803b158015611dd757600080fd5b5086fa93505050508015611e08575060408051601f3d908101601f19168201909252611e059181019061a5cb565b60015b611e42573d808015611e36576040519150601f19603f3d011682016040523d82523d6000602084013e611e3b565b606091505b5050611e86565b80848381518110611e4f57fe5b602002602001018181525050838281518110611e6757fe5b602002602001015160001415611e7d5750611e86565b50600101611d70565b5050949350505050565b8051606090806001600160401b0381118015611eab57600080fd5b50604051908082528060200260200182016040528015611ed5578160200160208202803683370190505b50915060005b8181101561200b57856001600160a01b031663d06ca61f620249f0868481518110611f0257fe5b6020026020010151886040518463ffffffff1660e01b8152600401611f2892919061b9a2565b60006040518083038187803b158015611f4057600080fd5b5086fa93505050508015611f7657506040513d6000823e601f3d908101601f19168201604052611f73919081019061a579565b60015b611fb0573d808015611fa4576040519150601f19603f3d011682016040523d82523d6000602084013e611fa9565b606091505b505061200b565b80600187510381518110611fc057fe5b6020026020010151848381518110611fd457fe5b602002602001018181525050838281518110611fec57fe5b602002602001015160001415612002575061200b565b50600101611edb565b50509392505050565b60606120208385616d72565b84602001516001600160a01b0316846001600160a01b0316141580612052575084516001600160a01b03848116911614155b156110aa5781516060816001600160401b038111801561207157600080fd5b5060405190808252806020026020018201604052801561209b578160200160208202803683370190505b5092506119c8915050565b8051606090806001600160401b03811180156120c157600080fd5b506040519080825280602002602001820160405280156120eb578160200160208202803683370190505b50915060005b81811015611e8657866001600160a01b031663d7176ca9878760008151811061211657fe5b60200260200101518860018151811061212b57fe5b602002602001015188868151811061213f57fe5b60200260200101516040518563ffffffff1660e01b8152600401612166949392919061b7a5565b604080518083038186803b15801561217d57600080fd5b505afa9250505080156121ad575060408051601f3d908101601f191682019092526121aa9181019061aac3565b60015b6121db573d808015611e36576040519150601f19603f3d011682016040523d82523d6000602084013e611e3b565b818584815181106121e857fe5b60200260200101818152505084838151811061220057fe5b602002602001015160001415612217575050611e86565b50506001016120f1565b8051606090806001600160401b038111801561223c57600080fd5b50604051908082528060200260200182016040528015612266578160200160208202803683370190505b50915060005b81811015611e86576000606088600001516001600160a01b0316621e84808a602001518a8a8a888151811061229d57fe5b60200260200101516040516024016122b79392919061b846565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516122f5919061b2e1565b6000604051808303818686fa925050503d8060008114612331576040519150601f19603f3d011682016040523d82523d6000602084013e612336565b606091505b50915091506000821561235a5781806020019051810190612357919061a5cb565b90505b8086858151811061236757fe5b60200260200101818152505085848151811061237f57fe5b60200260200101516000141561239757505050611e86565b50505060010161226c565b4390565b80516060908190806001600160401b03811180156123c357600080fd5b506040519080825280602002602001820160405280156123ed578160200160208202803683370190505b5091506123fa8686616821565b925082516000141561240c5750610f37565b60005b81811015610f3457866001600160a01b0316639e269b68620249f087848151811061243657fe5b6020026020010151878a6040518563ffffffff1660e01b815260040161245e9392919061b9b0565b60006040518083038187803b15801561247657600080fd5b5086fa935050505080156124ac57506040513d6000823e601f3d908101601f191682016040526124a9919081019061a579565b60015b6124da573d808015610ecd576040519150601f19603f3d011682016040523d82523d6000602084013e610ed2565b806000815181106124e757fe5b60200260200101518483815181106124fb57fe5b60200260200101818152505083828151811061251357fe5b6020026020010151600014156125295750610f34565b5060010161240f565b6020848101516040805160018082528183019092526060938492908281019080368337019050509050858160008151811061256957fe5b6020908102919091010152606060006040519080825280602002602001820160405280156125a1578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b03161415612692576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a120906125fa9089906001908890889060040161b53e565b60006040518083038187803b15801561261257600080fd5b5086fa9350505050801561264857506040513d6000823e601f3d908101601f19168201604052612645919081019061a5e9565b60015b612682573d808015612676576040519150601f19603f3d011682016040523d82523d6000602084013e61267b565b606091505b505061268d565b93506119c892505050565b610d8e565b87606001516001600160a01b0316856001600160a01b031614156126e8576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a120906125fa908a906001908890889060040161b53e565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a12090612728908a90600190889088908d9084908490849060040161b56b565b60006040518083038187803b15801561274057600080fd5b5086fa9350505050801561277657506040513d6000823e601f3d908101601f19168201604052612773919081019061a5e9565b60015b612682573d8080156127a4576040519150601f19603f3d011682016040523d82523d6000602084013e6127a9565b606091505b5050610d8e565b60005a905090565b60608060608061283a876001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156127fa57600080fd5b505afa15801561280e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612832919061a6ab565b8760006176e2565b905084516001600160401b038111801561285357600080fd5b5060405190808252806020026020018201604052801561287d578160200160208202803683370190505b50915084516001600160401b038111801561289757600080fd5b506040519080825280602002602001820160405280156128cb57816020015b60608152602001906001900390816128b65790505b50935084516001600160401b03811180156128e557600080fd5b5060405190808252806020026020018201604052801561290f578160200160208202803683370190505b50925060005b8551811015612aa2576000805b8351811015612a3457606061294a8a86848151811061293d57fe5b6020026020010151617b82565b90508a6001600160a01b031663cdca1753620aae60838c888151811061296c57fe5b60200260200101516040518463ffffffff1660e01b815260040161299192919061b731565b600060405180830381600088803b1580156129ab57600080fd5b5087f1935050505080156129e157506040513d6000823e601f3d908101601f191682016040526129de919081019061aa40565b60015b6129ea57612a2b565b838711612a2657839650848c8981518110612a0157fe5b6020026020010181905250808b8981518110612a1957fe5b6020026020010181815250505b505050505b50600101612922565b5080612a815760405180602001604052806000815250868381518110612a5657fe5b60200260200101819052506000858381518110612a6f57fe5b60200260200101818152505050612aa2565b80848381518110612a8e57fe5b602090810291909101015250600101612915565b505093509350939050565b80516060908590806001600160401b0381118015612aca57600080fd5b50604051908082528060200260200182016040528015612af4578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b62490612b2490899060040161b2ed565b60206040518083038186803b158015612b3c57600080fd5b505afa158015612b50573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b74919061a5ad565b1580612bf95750604051630bcded8960e21b81526001600160a01b03831690632f37b62490612ba790889060040161b2ed565b60206040518083038186803b158015612bbf57600080fd5b505afa158015612bd3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bf7919061a5ad565b155b15612c055750506119c8565b612c0d61906b565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612c39908a9060040161b2ed565b60206040518083038186803b158015612c5157600080fd5b505afa158015612c65573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c89919061a5cb565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612cb790899060040161b2ed565b60206040518083038186803b158015612ccf57600080fd5b505afa158015612ce3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612d07919061a5cb565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690612d38908a9060040161b2ed565b60206040518083038186803b158015612d5057600080fd5b505afa158015612d64573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612d88919061a5cb565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690612dbb90899060040161b2ed565b60206040518083038186803b158015612dd357600080fd5b505afa158015612de7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612e0b919061a5cb565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015612e4d57600080fd5b505afa158015612e61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612e85919061a5cb565b608082015260005b82811015610d8c57612eb882602001516003670de0b6b3a764000081612eaf57fe5b04600101617cdd565b868281518110612ec457fe5b60200260200101511115612ed757610d8c565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c8881518110612f0a57fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401612f389695949392919061b9e4565b60206040518083038187803b158015612f5057600080fd5b5086fa93505050508015612f81575060408051601f3d908101601f19168201909252612f7e9181019061a5cb565b60015b612fbb573d808015612faf576040519150601f19603f3d011682016040523d82523d6000602084013e612fb4565b606091505b5050610d8c565b8251612fd3906002670de0b6b3a76400005b04617cdd565b811115612fe05750610d8c565b80868381518110612fed57fe5b60200260200101818152505085828151811061300557fe5b60200260200101516000141561301b5750610d8c565b50600101612e8d565b606080606080613066876001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156127fa57600080fd5b9050606061307387617d3a565b905085516001600160401b038111801561308c57600080fd5b506040519080825280602002602001820160405280156130b6578160200160208202803683370190505b50925085516001600160401b03811180156130d057600080fd5b5060405190808252806020026020018201604052801561310457816020015b60608152602001906001900390816130ef5790505b50945085516001600160401b038111801561311e57600080fd5b50604051908082528060200260200182016040528015613148578160200160208202803683370190505b50935060005b86518110156132fd576000805b845181101561328f57606061318b8561318688858151811061317957fe5b6020026020010151617dd2565b617b82565b90508b6001600160a01b0316632f80bb1d620aae60838d88815181106131ad57fe5b60200260200101516040518463ffffffff1660e01b81526004016131d292919061b731565b600060405180830381600088803b1580156131ec57600080fd5b5087f19350505050801561322257506040513d6000823e601f3d908101601f1916820160405261321f919081019061aa40565b60015b61322b57613286565b8615806132385750838710155b15613281578396506132508f8b888151811061293d57fe5b8d898151811061325c57fe5b6020026020010181905250808c898151811061327457fe5b6020026020010181815250505b505050505b5060010161315b565b50806132dc57604051806020016040528060008152508783815181106132b157fe5b602002602001018190525060008683815181106132ca57fe5b602002602001018181525050506132fd565b808583815181106132e957fe5b60209081029190910101525060010161314e565b50505093509350939050565b604080516060818101909252611a36908061332886896080840161b316565b6040516020818303038152906040528152602001868860405160200161334f92919061b316565b6040516020818303038152906040528152602001617e6a81525083617397565b606061337c848484610f3f565b905060005b84518110156110aa5781818151811061339657fe5b602002602001015160001461341c576134038282815181106133b457fe5b60200260200101518683815181106133c857fe5b6020026020010151606001516001600160801b03168784815181106133e957fe5b6020026020010151604001516001600160801b0316617f7e565b82828151811061340f57fe5b6020026020010181815250505b600101613381565b6060816001600160401b038111801561343c57600080fd5b5060405190808252806020026020018201604052801561347657816020015b61346361909a565b81526020019060019003908161345b5790505b50905060005b80831461357e57600182828151811061349157fe5b6020908102919091018101519115159101528383828181106134af57fe5b90506020028101906134c1919061ba33565b151590506134ce57613576565b308484838181106134db57fe5b90506020028101906134ed919061ba33565b6040516134fb92919061b2d4565b6000604051808303816000865af19150503d8060008114613538576040519150601f19603f3d011682016040523d82523d6000602084013e61353d565b606091505b5083838151811061354a57fe5b602002602001015160200184848151811061356157fe5b60209081029190910101519190915290151590525b60010161347c565b5092915050565b606081516001600160401b038111801561359e57600080fd5b506040519080825280602002602001820160405280156135c8578160200160208202803683370190505b50905060005b82518114613671577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031683828151811061360c57fe5b60200260200101516001600160a01b03161461364c5761364783828151811061363157fe5b60200260200101516001600160a01b0316617fa2565b61364f565b60125b60ff1682828151811061365e57fe5b60209081029190910101526001016135ce565b50919050565b60006060809450945094915050565b604080516002808252606080830184529283929190602083019080368337019050509050836001815181106136b757fe5b6020026020010151816000815181106136cc57fe5b60200260200101906001600160a01b031690816001600160a01b031681525050836000815181106136f957fe5b60200260200101518160018151811061370e57fe5b6001600160a01b0390921660209283029190910190910152604080516060810190915261378b908061374488856080840161b4ea565b6040516020818303038152906040528152602001878760405160200161376b92919061b4ea565b604051602081830303815290604052815260200161804e81525084617397565b9150505b9392505050565b60606137a28385616d72565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b1580156137e657600080fd5b505afa1580156137fa573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061381e9190619ea6565b8451909150806001600160401b038111801561383957600080fd5b50604051908082528060200260200182016040528015613863578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561389f57600080fd5b505afa1580156138b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906138d79190619ea6565b6001600160a01b0316866001600160a01b03161415801561397a5750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561392c57600080fd5b505afa158015613940573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906139649190619ea6565b6001600160a01b0316876001600160a01b031614155b15613987575050506119c8565b60005b81811015610d8c5760006139b58a898b8a86815181106139a657fe5b60200260200101518989618160565b9050806139c25750610d8c565b808683815181106139cf57fe5b60209081029190910101525060010161398a565b60408051600280825260608083018452928392919060208301908036833701905050905083600181518110613a1457fe5b602002602001015181600081518110613a2957fe5b60200260200101906001600160a01b031690816001600160a01b03168152505083600081518110613a5657fe5b602002602001015181600181518110613a6b57fe5b6001600160a01b03909216602092830291909101909101526040805160608101909152613aeb9080613aa28989866080850161b3a0565b6040516020818303038152906040528152602001888888604051602001613acb9392919061b3a0565b60405160208183030381529060405281526020016183f281525084617397565b9695505050505050565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b8152600401613b2c919061b6f2565b60206040518083038186803b158015613b4457600080fd5b505afa158015613b58573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613b7c919061a5cb565b8651604051631e01043960e01b81526001600160a01b0390911690631e01043990613baf90600f89900b9060040161b6f2565b60206040518083038186803b158015613bc757600080fd5b505afa158015613bdb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613bff919061a5cb565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b8152600401613c37919061b6f2565b60806040518083038186803b158015613c4f57600080fd5b505afa158015613c63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c87919061aaf3565b935050505080601203600a0a8281613c9b57fe5b85519190049250806001600160401b0381118015613cb857600080fd5b50604051908082528060200260200182016040528015613ce2578160200160208202803683370190505b50935060005b81811015610d8c57600060608a600001516001600160a01b0316620927c08c602001518c8c8c8881518110613d1957fe5b6020026020010151604051602401613d339392919061b846565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613d71919061b2e1565b6000604051808303818686fa925050503d8060008114613dad576040519150601f19603f3d011682016040523d82523d6000602084013e613db2565b606091505b509150915060008215613dd65781806020019051810190613dd3919061a5cb565b90505b868110613e1057835b85811015613e075787898281518110613df457fe5b6020908102919091010152600101613ddf565b50505050610d8c565b80888581518110613e1d57fe5b602002602001018181525050878481518110613e3557fe5b602002602001015160001415613e4d57505050610d8c565b505050600101613ce8565b613e606190b2565b613e686190b2565b600080805b87518114613f6d57613eb46020898381518110613e8657fe5b60200260200101515103878a8481518110613e9d57fe5b60200260200101516184409092919063ffffffff16565b60006060306001600160a01b03168a8481518110613ece57fe5b6020026020010151604051613ee3919061b2e1565b6000604051808303816000865af19150503d8060008114613f20576040519150601f19603f3d011682016040523d82523d6000602084013e613f25565b606091505b50915091508115613f63576000613f4960208351038361845090919063ffffffff16565b905084811115613f6157838852602088018290529350835b505b5050600101613e6d565b5080613f795750614065565b60005b86518114612aa257613fac6020888381518110613f9557fe5b6020026020010151510383898481518110613e9d57fe5b60006060306001600160a01b0316898481518110613fc657fe5b6020026020010151604051613fdb919061b2e1565b6000604051808303816000865af19150503d8060008114614018576040519150601f19603f3d011682016040523d82523d6000602084013e61401d565b606091505b5091509150811561405b57600061404160208351038361845090919063ffffffff16565b90508581111561405957838752602087018290529450845b505b5050600101613f7c565b93509350939050565b60408401516060906001600160e01b0319166140f05760408051606081019091526140e990806140a286896080840161b861565b604051602081830303815290604052815260200186886040516020016140c992919061b861565b604051602081830303815290604052815260200161845c81525083617397565b90506119c8565b8151806001600160401b038111801561410857600080fd5b50604051908082528060200260200182016040528015614132578160200160208202803683370190505b50915060005b81811015611e86576000606088600001516001600160a01b0316621e84808a604001518a8a8a888151811061416957fe5b60200260200101516040516024016141839392919061b846565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516141c1919061b2e1565b6000604051808303818686fa925050503d80600081146141fd576040519150601f19603f3d011682016040523d82523d6000602084013e614202565b606091505b5091509150600082156142265781806020019051810190614223919061a5cb565b90505b8086858151811061423357fe5b60200260200101818152505085848151811061424b57fe5b60200260200101516000141561426357505050611e86565b505050600101614138565b80516060908590806001600160401b038111801561428b57600080fd5b506040519080825280602002602001820160405280156142b5578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b624906142e590899060040161b2ed565b60206040518083038186803b1580156142fd57600080fd5b505afa158015614311573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614335919061a5ad565b15806143ba5750604051630bcded8960e21b81526001600160a01b03831690632f37b6249061436890889060040161b2ed565b60206040518083038186803b15801561438057600080fd5b505afa158015614394573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906143b8919061a5ad565b155b156143c65750506119c8565b6143ce61906b565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906143fa908a9060040161b2ed565b60206040518083038186803b15801561441257600080fd5b505afa158015614426573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061444a919061a5cb565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f9061447890899060040161b2ed565b60206040518083038186803b15801561449057600080fd5b505afa1580156144a4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906144c8919061a5cb565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce6906144f9908a9060040161b2ed565b60206040518083038186803b15801561451157600080fd5b505afa158015614525573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614549919061a5cb565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce69061457c90899060040161b2ed565b60206040518083038186803b15801561459457600080fd5b505afa1580156145a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906145cc919061a5cb565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b15801561460e57600080fd5b505afa158015614622573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614646919061a5cb565b608082015260005b82811015610d8c57815161466c906002670de0b6b3a7640000612fcd565b86828151811061467857fe5b6020026020010151111561468b57610d8c565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c88815181106146be57fe5b602002602001015189608001516040518863ffffffff1660e01b81526004016146ec9695949392919061b9e4565b60206040518083038187803b15801561470457600080fd5b5086fa93505050508015614735575060408051601f3d908101601f191682019092526147329181019061a5cb565b60015b614763573d808015612faf576040519150601f19603f3d011682016040523d82523d6000602084013e612fb4565b8086838151811061477057fe5b60200260200101818152505085828151811061478857fe5b60200260200101516000141561479e5750610d8c565b5060010161464e565b600080835160038111156147b757fe5b14806147cf57506001835160038111156147cd57fe5b145b806147e5575060408401516001600160801b0316155b806147fb575060608401516001600160801b0316155b156148085750600061378f565b6148106190cc565b600080846001600160a01b0316631fb0979588886040518363ffffffff1660e01b815260040161484192919061b95a565b60a06040518083038186803b15801561485957600080fd5b505afa15801561486d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614891919061a9df565b919450925090506001836020015160048111156148aa57fe5b1415806148b5575080155b806148c8575086516001600160a01b0316155b156148d9576000935050505061378f565b506001600160801b031695945050505050565b60006060806148fb8587616d72565b6149068787876184b0565b92508261491257611208565b60405163276fdad960e11b81523090634edfb5b29061493b908a9087908b908b9060040161b93a565b60006040518083038186803b15801561495357600080fd5b505afa158015614967573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261498f919081019061a5e9565b876080018190525086608001519150614a066040518060600160405280878a6040516020016149bf92919061b5fd565b6040516020818303038152906040528152602001888a6040516020016149e692919061b5fd565b604051602081830303815290604052815260200161861781525085617397565b90509450945094915050565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b8152600401614a4392919061b316565b60206040518083038186803b158015614a5b57600080fd5b505afa158015614a6f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614a939190619ea6565b90506001600160a01b038116614aad5760009150506119c8565b60006001600160a01b03861615614b3f576040516370a0823160e01b81526001600160a01b038716906370a0823190614aea90859060040161b2ed565b60206040518083038186803b158015614b0257600080fd5b505afa158015614b16573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614b3a919061a5cb565b614b4b565b816001600160a01b0316315b905083811015614b60576000925050506119c8565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f090614b95908a908a908a9060040161b470565b60206040518083038187803b158015614bad57600080fd5b5086fa93505050508015614bde575060408051601f3d908101601f19168201909252614bdb9181019061a5cb565b60015b614c1e573d808015614c0c576040519150601f19603f3d011682016040523d82523d6000602084013e614c11565b606091505b50600093505050506119c8565b92506119c8915050565b6060614c348385616d72565b602085015160408051600280825260608281019093528160200160208202803683370190505090508581600081518110614c6a57fe5b60200260200101906001600160a01b031690816001600160a01b0316815250508481600181518110614c9857fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b0381118015614cc857600080fd5b50604051908082528060200260200182016040528015614cf2578160200160208202803683370190505b509350614cfd619044565b614d05616d43565b905060005b828110156115a4576060614d248b89848151811061148357fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e90614d5a9060019085908a90899060040161b803565b600060405180830381600087803b158015614d7457600080fd5b505af1925050508015614da957506040513d6000823e601f3d908101601f19168201604052614da6919081019061a4d5565b60015b614dd7573d808015611543576040519150601f19603f3d011682016040523d82523d6000602084013e611548565b600081600081518110614de657fe5b6020026020010151905060008113614e00575050506115a4565b80898581518110614e0d57fe5b602002602001018181525050505050600101614d0a565b8051606090806001600160401b0381118015614e3f57600080fd5b50604051908082528060200260200182016040528015614e69578160200160208202803683370190505b50915060005b81811015611e8657866001600160a01b031663343fbcdd62061a808888888681518110614e9857fe5b60200260200101516040518563ffffffff1660e01b8152600401614ebe9392919061b76a565b60206040518083038187803b158015614ed657600080fd5b5086fa93505050508015614f07575060408051601f3d908101601f19168201909252614f049181019061a5cb565b60015b614f35573d808015611e36576040519150601f19603f3d011682016040523d82523d6000602084013e611e3b565b80848381518110614f4257fe5b602002602001018181525050838281518110614f5a57fe5b602002602001015160001415614f705750611e86565b50600101614e6f565b6000806060614f888587616d72565b8351806001600160401b0381118015614fa057600080fd5b50604051908082528060200260200182016040528015614fca578160200160208202803683370190505b509150614fd9898989896186fe565b945092506001600160a01b038316614ff157506150ab565b60005b818110156150a85760006150628986886040516020016150169392919061b40e565b60405160208183030381529060405289878960405160200161503a9392919061b40e565b60405160208183030381529060405289858151811061505557fe5b6020026020010151618853565b90508084838151811061507157fe5b60200260200101818152505083828151811061508957fe5b60200260200101516000141561509f57506150a8565b50600101614ff4565b50505b955095509592505050565b8051606090806001600160401b03811180156150d157600080fd5b506040519080825280602002602001820160405280156150fb578160200160208202803683370190505b5091506000866001600160a01b031663182df0f56040518163ffffffff1660e01b815260040160206040518083038186803b15801561513957600080fd5b505afa15801561514d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615171919061a5cb565b90506000876001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b1580156151ae57600080fd5b505afa1580156151c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906151e6919061ab9f565b60ff169050876001600160a01b0316866001600160a01b031614156152585760005b83811015610d19578282600a0a6402540be40088848151811061522757fe5b602002602001015102028161523857fe5b0485828151811061524557fe5b6020908102919091010152600101615208565b876001600160a01b0316876001600160a01b03161415610d8e5760005b83811015610d8c5781600a0a6402540be400028387838151811061529557fe5b602002602001015102816152a557fe5b048582815181106152b257fe5b6020908102919091010152600101615275565b600060606152d38486616d72565b8251806001600160401b03811180156152eb57600080fd5b50604051908082528060200260200182016040528015615315578160200160208202803683370190505b50915060005b8181101561538a57600061534489898989868151811061533757fe5b6020026020010151614a12565b90508084838151811061535357fe5b60200260200101818152505083828151811061536b57fe5b602002602001015160001415615381575061538a565b5060010161531b565b5060405163901754d760e01b81526001600160a01b0388169063901754d7906153b9908990899060040161b316565b60206040518083038186803b1580156153d157600080fd5b505afa1580156153e5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906154099190619ea6565b92505094509492505050565b604080516060818101909252611a36908061543486896080840161b316565b6040516020818303038152906040528152602001868860405160200161545b92919061b316565b604051602081830303815290604052815260200161894581525083617397565b606082516001600160401b038111801561549457600080fd5b506040519080825280602002602001820160405280156154be578160200160208202803683370190505b50905060005b8351811461357e577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031684828151811061550257fe5b60200260200101516001600160a01b03161461554c576155478385838151811061552857fe5b60200260200101516001600160a01b031661898c90919063ffffffff16565b615558565b826001600160a01b0316315b82828151811061556457fe5b60209081029190910101526001016154c4565b604080516060818101909252611a36908061559686896080840161b316565b604051602081830303815290604052815260200186886040516020016155bd92919061b316565b6040516020818303038152906040528152602001618a5681525083617397565b60606155e98385616d72565b8151806001600160401b038111801561560157600080fd5b5060405190808252806020026020018201604052801561562b578160200160208202803683370190505b50915060006001600160a01b0386161561564e576156498787616e43565b615651565b60005b905060006001600160a01b038616156156735761566e8887616e43565b615676565b60005b905060005b83811015610d8c5760016001600160a01b0388166156cc576156ab846395b68fe760e01b89858151811061167f57fe5b8784815181106156b757fe5b60200260200101819350828152505050615766565b6001600160a01b0389166156f2576156ab8363cd7724c360e01b89858151811061167f57fe5b600061570c856395b68fe760e01b8a868151811061167f57fe5b925090508015615749576157288463cd7724c360e01b83616ec2565b88858151811061573457fe5b60200260200101819450828152505050615764565b600087848151811061575757fe5b6020026020010181815250505b505b801580615786575085828151811061577a57fe5b60200260200101516000145b156157915750610d8c565b5060010161567b565b8051606090806001600160401b03811180156157b557600080fd5b506040519080825280602002602001820160405280156157df578160200160208202803683370190505b50915060005b8181101561200b57856001600160a01b0316631f00ca74620249f086848151811061580c57fe5b6020026020010151886040518463ffffffff1660e01b815260040161583292919061b9a2565b60006040518083038187803b15801561584a57600080fd5b5086fa9350505050801561588057506040513d6000823e601f3d908101601f1916820160405261587d919081019061a579565b60015b6158ae573d808015611fa4576040519150601f19603f3d011682016040523d82523d6000602084013e611fa9565b806000815181106158bb57fe5b60200260200101518483815181106158cf57fe5b6020026020010181815250508382815181106158e757fe5b6020026020010151600014156158fd575061200b565b506001016157e5565b8051606090806001600160401b038111801561592157600080fd5b5060405190808252806020026020018201604052801561594b578160200160208202803683370190505b509150615956619044565b61595e616d43565b905060005b82811015610d8e5784818151811061597757fe5b60200260200101518760008151811061598c57fe5b602090810291909101015160600152604051637c26833760e11b81526001600160a01b0389169063f84d066e906159ce906000908b908b90889060040161b803565b600060405180830381600087803b1580156159e857600080fd5b505af1925050508015615a1d57506040513d6000823e601f3d908101601f19168201604052615a1a919081019061a4d5565b60015b615a2657610d8e565b600081600183510381518110615a3857fe5b602002602001015160001902905060008113615a55575050610d8e565b80868481518110615a6257fe5b6020026020010181815250505050600101615963565b6000606080615a878587616d72565b615a928787876184b0565b925082615a9e57611208565b60405163276fdad960e11b81523090634edfb5b290615ac7908a9087908b908b9060040161b93a565b60006040518083038186803b158015615adf57600080fd5b505afa158015615af3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052615b1b919081019061a5e9565b608088018190528451909250806001600160401b0381118015615b3d57600080fd5b50604051908082528060200260200182016040528015615b67578160200160208202803683370190505b50915060005b81811015615c52576000306001600160a01b031663f1ed7fa48b8b8b8b8781518110615b9557fe5b60200260200101516040518563ffffffff1660e01b8152600401615bbc949392919061b91a565b60206040518083038186803b158015615bd457600080fd5b505afa158015615be8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615c0c919061a5cb565b905080848381518110615c1b57fe5b602002602001018181525050838281518110615c3357fe5b602002602001015160001415615c495750615c52565b50600101615b6d565b50509450945094915050565b6000806060615c6d8587616d72565b615c79888888886186fe565b935091506001600160a01b038216615c90576150ab565b8351806001600160401b0381118015615ca857600080fd5b50604051908082528060200260200182016040528015615cd2578160200160208202803683370190505b506040805160608101909152909250615d3f9080615cf6898789156080850161b40e565b6040516020818303038152906040528152602001898688604051602001615d1f9392919061b40e565b604051602081830303815290604052815260200161885381525086617397565b915050955095509592505050565b6000806060615d5c8587616d72565b8351806001600160401b0381118015615d7457600080fd5b50604051908082528060200260200182016040528015615d9e578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c690615dd1908a908a9060040161b316565b60206040518083038186803b158015615de957600080fd5b505afa158015615dfd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615e219190619ea6565b925060006001600160a01b03841615615e3f57506001935086615ede565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690615e70908a908c9060040161b316565b60206040518083038186803b158015615e8857600080fd5b505afa158015615e9c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615ec09190619ea6565b93506001600160a01b038416615ed7575050611208565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b158015615f1757600080fd5b505afa158015615f2b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615f4f919061a5ad565b615f5a575050611208565b615fd260405180606001604052808987858e60200151604051602001615f83949392919061b331565b60405160208183030381529060405281526020018a87858e60200151604051602001615fb2949392919061b331565b60405160208183030381529060405281526020016175a981525087617397565b925050509450945094915050565b606083516001600160401b0381118015615ff957600080fd5b50604051908082528060200260200182016040528015616023578160200160208202803683370190505b50905060005b845181146110aa577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031685828151811061606757fe5b60200260200101516001600160a01b0316146160b3576160ae848487848151811061608e57fe5b60200260200101516001600160a01b0316618b0b9092919063ffffffff16565b6160b6565b60005b8282815181106160c257fe5b6020908102919091010152600101616029565b8051606090806001600160401b03811180156160f057600080fd5b5060405190808252806020026020018201604052801561611a578160200160208202803683370190505b50915060005b81811015611e8657866001600160a01b031663838e6a22620493e0888888868151811061614957fe5b60200260200101516040518563ffffffff1660e01b815260040161616f9392919061b470565b60206040518083038187803b15801561618757600080fd5b5086fa935050505080156161b8575060408051601f3d908101601f191682019092526161b59181019061a5cb565b60015b6161e6573d808015611e36576040519150601f19603f3d011682016040523d82523d6000602084013e611e3b565b808483815181106161f357fe5b60200260200101818152505050600101616120565b600084608001515160001415616220575060006119c8565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b03161461625a5786616270565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b03161461629357866162a9565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b81526004016162d195949392919061b498565b60206040518083038187803b1580156162e957600080fd5b5086fa9350505050801561631a575060408051601f3d908101601f191682019092526163179181019061a5cb565b60015b616358573d808015616348576040519150601f19603f3d011682016040523d82523d6000602084013e61634d565b606091505b5060009150506119c8565b600061636385618bd7565b60ff169050600061637387618bd7565b60ff169050670de0b6b3a764000081600a0a83600a0a878602028161639457fe5b048161639c57fe5b0493505050506119c8565b600060606163b58486616d72565b8251806001600160401b03811180156163cd57600080fd5b506040519080825280602002602001820160405280156163f7578160200160208202803683370190505b5091506164626040518060600160405280898860405160200161641b92919061b316565b6040516020818303038152906040528152602001898960405160200161644292919061b316565b6040516020818303038152906040528152602001618be281525085617397565b60405163901754d760e01b81529092506001600160a01b0388169063901754d7906153b9908990899060040161b316565b8051606090806001600160401b03811180156164ae57600080fd5b506040519080825280602002602001820160405280156164d8578160200160208202803683370190505b50915060005b8181101561200b57856001600160a01b03166343c2e2f58660008151811061650257fe5b60200260200101518760018151811061651757fe5b602002602001015187858151811061652b57fe5b60200260200101516040518463ffffffff1660e01b81526004016165519392919061b470565b604080518083038186803b15801561656857600080fd5b505afa925050508015616598575060408051601f3d908101601f191682019092526165959181019061aac3565b60015b6165c6573d808015611fa4576040519150601f19603f3d011682016040523d82523d6000602084013e611fa9565b818584815181106165d357fe5b6020026020010181815250508483815181106165eb57fe5b60200260200101516000141561660257505061200b565b50506001016164de565b6166146190b2565b61661c6190b2565b6000198060005b8651811461671857616653602088838151811061663c57fe5b6020026020010151510387898481518110613e9d57fe5b60006060306001600160a01b031689848151811061666d57fe5b6020026020010151604051616682919061b2e1565b6000604051808303816000865af19150503d80600081146166bf576040519150601f19603f3d011682016040523d82523d6000602084013e6166c4565b606091505b5091509150811561670e5760006166e860208351038361845090919063ffffffff16565b90506000811180156166f957508481105b1561670c57838752602087018290529350835b505b5050600101616623565b506000198114156167295750614065565b60005b87518114612aa25761675c602089838151811061674557fe5b60200260200101515103838a8481518110613e9d57fe5b60006060306001600160a01b03168a848151811061677657fe5b602002602001015160405161678b919061b2e1565b6000604051808303816000865af19150503d80600081146167c8576040519150601f19603f3d011682016040523d82523d6000602084013e6167cd565b606091505b509150915081156168175760006167f160208351038361845090919063ffffffff16565b905060008111801561680257508581105b1561681557838852602088018290529450845b505b505060010161672c565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561685e57600080fd5b505afa158015616872573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906168969190619ea6565b905060018351036001600160401b03811180156168b257600080fd5b506040519080825280602002602001820160405280156168dc578160200160208202803683370190505b50915060005b8251811015616b08576060826001600160a01b0316635b1dc86f620249f087858151811061690c57fe5b602002602001015188866001018151811061692357fe5b60200260200101516040518463ffffffff1660e01b815260040161694892919061b316565b60006040518083038187803b15801561696057600080fd5b5086fa9350505050801561699657506040513d6000823e601f3d908101601f19168201604052616993919081019061a2ad565b60015b616a04573d8080156169c4576040519150601f19603f3d011682016040523d82523d6000602084013e6169c9565b606091505b506000805b506040519080825280602002602001820160405280156169f8578160200160208202803683370190505b50945050505050616b0b565b8051616a12576000806169ce565b6000805b8251811015616afc576000838281518110616a2d57fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015616a6d57600080fd5b505afa158015616a81573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616aa5919061a5cb565b905082811115616af357809250838281518110616abe57fe5b6020026020010151888781518110616ad257fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616a16565b505050506001016168e2565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b158015616b6557600080fd5b505afa158015616b79573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616b9d919061a5cb565b6040518263ffffffff1660e01b8152600401616bb9919061b6f2565b60206040518083038186803b158015616bd157600080fd5b505afa158015616be5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616c099190619ea6565b915085602001515160001415616c1e57616d3a565b6000805b876020015151811015616d3757600288602001518281518110616c4157fe5b6020026020010151511015616c5557616d2f565b836001600160a01b0316637f9c0ecd620493e08a602001518481518110616c7857fe5b60200260200101518860018a510381518110616c9057fe5b60200260200101516040518463ffffffff1660e01b8152600401616cb592919061b650565b60206040518083038187803b158015616ccd57600080fd5b5086fa93505050508015616cfe575060408051601f3d908101601f19168201909252616cfb9181019061a5cb565b60015b616d0757616d2f565b82811115616d2d5780925088602001518281518110616d2257fe5b602002602001015193505b505b600101616c22565b50505b94509492505050565b616d4b619044565b50604080516080810182523080825260006020830181905292820152606081019190915290565b806001600160a01b0316826001600160a01b03161415616dad5760405162461bcd60e51b8152600401616da49061b88c565b60405180910390fd5b5050565b604080516001808252818301909252606091829190816020015b616dd36190ee565b815260200190600190039081616dcb5790505090506040518060a001604052808560000151815260200160008152602001600181526020018481526020016040518060200160405280600081525081525081600081518110616e3157fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf6290616e7290859060040161b2ed565b60206040518083038186803b158015616e8a57600080fd5b505afa158015616e9e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061378f9190619ea6565b6000806001600160a01b038516616ed857610f37565b6060856001600160a01b0316620249f08686604051602401616efa919061b6f2565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051616f38919061b2e1565b6000604051808303818686fa925050503d8060008114616f74576040519150601f19603f3d011682016040523d82523d6000602084013e616f79565b606091505b5090925090508115616f9c5780806020019051810190616f99919061a5cb565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401616fdb919061b6f2565b60a06040518083038186803b158015616ff357600080fd5b505afa158015617007573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061702b919061ab37565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b0316141561715357600061706a8964e8d4a51000618c32565b9050600061708e6b033b2e3c9fd0803ce80000006170888885618c68565b90618c32565b90508481106170a65760009650505050505050613aeb565b6000617135670de0b6b3a764000061712f8c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156170f057600080fd5b505afa158015617104573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617128919061a5cb565b8690618c32565b90618c84565b905060006171438483618cae565b9850613aeb975050505050505050565b8a604001516001600160a01b03168a6001600160a01b0316141561725357878481111561718857600095505050505050613aeb565b60006171a46b033b2e3c9fd0803ce80000006170888885618cae565b90508381116171bc5760009650505050505050613aeb565b60006172418a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156171fa57600080fd5b505afa15801561720e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617232919061a5cb565b670de0b6b3a764000090618c68565b905060006171438261712f8688618c32565b5060009a9950505050505050505050565b60008061726f619120565b85806020019051810190617283919061a730565b9150915060008580602001905181019061729d919061a712565b905060006060306322db5ed160e21b8587866172b88c618ccd565b6040516024016172cb949392919061b8ac565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051617309919061b2e1565b600060405180830381855afa9150503d8060008114617344576040519150601f19603f3d011682016040523d82523d6000602084013e617349565b606091505b5091509150816173615760009550505050505061378f565b80806020019051810190617375919061a579565b60008151811061738157fe5b6020026020010151955050505050509392505050565b606081516001600160401b03811180156173b057600080fd5b506040519080825280602002602001820160405280156173da578160200160208202803683370190505b5090508151600014156173ec57616b0b565b600061741d846000015185602001518560008151811061740857fe5b6020026020010151876040015163ffffffff16565b90508061742a5750616b0b565b60006174478560200151866000015184886040015163ffffffff16565b905080617455575050616b0b565b60005b84518110156175a0576000805b60058110156175495761748c87848151811061747d57fe5b60200260200101518587618d0e565b94508461749857617549565b6174a761271561271087618d0e565b9450846174b357617549565b60006174d089602001518a60000151888c6040015163ffffffff16565b9050806174dd5750617549565b8094508784815181106174ec57fe5b602002602001015185106175405787848151811061750657fe5b602002602001015161271089868151811061751d57fe5b60200260200101518703028161752f57fe5b049250600583116175405750617549565b50600101617465565b508015806175575750600581115b1561756257506175a0565b61758086838151811061757157fe5b60200260200101518486618d0e565b85838151811061758c57fe5b602090810291909101015250600101617458565b50505092915050565b6000806000806000878060200190518101906175c59190619efe565b9350935093509350816001600160a01b0316846001600160a01b031614156176af576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e090617618908a9060040161b6f2565b60206040518083038187803b15801561763057600080fd5b5086fa93505050508015617661575060408051601f3d908101601f1916820190925261765e9181019061a5cb565b60015b6176a3573d80801561768f576040519150601f19603f3d011682016040523d82523d6000602084013e617694565b606091505b5060009550505050505061378f565b945061378f9350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e0906176189087908b9060040161b61d565b606060028284510310156177085760405162461bcd60e51b8152600401616da49061b87c565b617710619140565b5060408051608081018252606481526101f46020820152610bb8818301526127106060808301919091528251600480825260a08201909452919290919081602001602082028036833701905050905060008086868151811061776e57fe5b60200260200101519050600087876001018151811061778957fe5b6020026020010151905060005b600481101561787e5760008a6001600160a01b0316631698ee8285858a86600481106177be57fe5b60200201516040518463ffffffff1660e01b81526004016177e19392919061b742565b60206040518083038186803b1580156177f957600080fd5b505afa15801561780d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617831919061a6ab565b905061783c81618d66565b15617875578086868060010197508151811061785457fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101617796565b5050508061788e5750505061378f565b855185600201141561798457806001600160401b03811180156178b057600080fd5b506040519080825280602002602001820160405280156178e457816020015b60608152602001906001900390816178cf5790505b50935060005b8181101561797b5760408051600180825281830190925290602080830190803683370190505085828151811061791c57fe5b602002602001018190525082818151811061793357fe5b602002602001015185828151811061794757fe5b602002602001015160008151811061795b57fe5b6001600160a01b03909216602092830291909101909101526001016178ea565b5050505061378f565b60606179948888886001016176e2565b90508051600014156179a9575050505061378f565b805182026001600160401b03811180156179c257600080fd5b506040519080825280602002602001820160405280156179f657816020015b60608152602001906001900390816179e15790505b50945060005b82811015617b765760005b8251811015617b6d578251828102820190849083908110617a2457fe5b6020026020010151516001016001600160401b0381118015617a4557600080fd5b50604051908082528060200260200182016040528015617a6f578160200160208202803683370190505b50888281518110617a7c57fe5b6020026020010181905250858381518110617a9357fe5b6020026020010151888281518110617aa757fe5b6020026020010151600081518110617abb57fe5b60200260200101906001600160a01b031690816001600160a01b03168152505060005b848381518110617aea57fe5b602002602001015151811015617b6357848381518110617b0657fe5b60200260200101518181518110617b1957fe5b6020026020010151898381518110617b2d57fe5b60200260200101518260010181518110617b4357fe5b6001600160a01b0390921660209283029190910190910152600101617ade565b5050600101617a07565b506001016179fc565b50505050509392505050565b60606002835110158015617b9a575081516001018351145b617bb65760405162461bcd60e51b8152600401616da49061b89c565b81516003028351601402016001600160401b0381118015617bd657600080fd5b506040519080825280601f01601f191660200182016040528015617c01576020820181803683370190505b5090506020810160005b8451811015616b08578015617cb0576000846001830381518110617c2b57fe5b60200260200101516001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b158015617c6b57600080fd5b505afa158015617c7f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617ca3919061aa22565b60e81b8352506003909101905b6000858281518110617cbe57fe5b602090810291909101015160601b835250601490910190600101617c0b565b60008282028315801590617cfa575082848281617cf657fe5b0414155b15617d09576000915050616b0b565b6706f05b59d3b20000810181811015617d2757600092505050616b0b565b670de0b6b3a76400009004949350505050565b606081516001600160401b0381118015617d5357600080fd5b50604051908082528060200260200182016040528015617d7d578160200160208202803683370190505b50905060005b825181101561367157826001828551030381518110617d9e57fe5b6020026020010151828281518110617db257fe5b6001600160a01b0390921660209283029190910190910152600101617d83565b606081516001600160401b0381118015617deb57600080fd5b50604051908082528060200260200182016040528015617e15578160200160208202803683370190505b50905060005b825181101561367157826001828551030381518110617e3657fe5b6020026020010151828281518110617e4a57fe5b6001600160a01b0390921660209283029190910190910152600101617e1b565b600080600085806020019051810190617e839190619ec4565b91509150600085806020019051810190617e9d9190619ea6565b90503063e8e4af09838584617eb18a618ccd565b6040518563ffffffff1660e01b8152600401617ed0949392919061b366565b60006040518083038186803b158015617ee857600080fd5b505afa925050508015617f1d57506040513d6000823e601f3d908101601f19168201604052617f1a919081019061a579565b60015b617f5e573d808015617f4b576040519150601f19603f3d011682016040523d82523d6000602084013e617f50565b606091505b50600094505050505061378f565b80600081518110617f6b57fe5b602002602001015194505050505061378f565b60006119c88361712f617f92826001618cae565b617f9c8887618c32565b90618c68565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b815250604051617fe0919061b2e1565b600060405180830381855afa9150503d806000811461801b576040519150601f19603f3d011682016040523d82523d6000602084013e618020565b606091505b509150915081801561803457506020815110155b1561804757618044816000618450565b92505b5050919050565b600080606085806020019051810190618067919061a006565b90925090506000606030637b6b3ca560e11b85856180848a618ccd565b6040516024016180969392919061b50a565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516180d4919061b2e1565b600060405180830381855afa9150503d806000811461810f576040519150601f19603f3d011682016040523d82523d6000602084013e618114565b606091505b50915091508161812b57600094505050505061378f565b8080602001905181019061813f919061a579565b60008151811061814b57fe5b60200260200101519450505050509392505050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401618196919061b6f2565b60a06040518083038186803b1580156181ae57600080fd5b505afa1580156181c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906181e6919061ab37565b945094505050925089604001516001600160a01b0316886001600160a01b031614156182fd5760008790506000618296886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561824f57600080fd5b505afa158015618263573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190618287919061a5cb565b670de0b6b3a764000090618cae565b905060006182b08261712f85670de0b6b3a7640000618c32565b905060006182ce6b033b2e3c9fd0803ce80000006170888985618c68565b90508581106182e7576000975050505050505050613aeb565b60006171436001617f9c8564e8d4a51000618c84565b89604001516001600160a01b0316896001600160a01b031614156183e257600061832c8864e8d4a51000618c32565b9050600061836c886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156171fa57600080fd5b90506000618386670de0b6b3a764000061712f8585618c32565b90508581111561839f5760009650505050505050613aeb565b60006183bb6b033b2e3c9fd0803ce80000006170888985618cae565b90508481116183d4576000975050505050505050613aeb565b509550613aeb945050505050565b5060009998505050505050505050565b600080600060608680602001905181019061840d9190619f5f565b919450925090506000606030634092e6b160e01b86868661842d8c618ccd565b6040516024016172cb949392919061b3cd565b61844b838383618f72565b505050565b600061378f8383618f99565b600080618467619120565b8580602001905181019061847b919061a730565b91509150600085806020019051810190618495919061a712565b9050600060603063205e01d760e11b8587866172b88c618ccd565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b0316146184ee5786618504565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b031614618527578661853d565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b169091526185719291906001906024810161b436565b60006040518083038186803b15801561858957600080fd5b505afa15801561859d573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526185c5919081019061a2e1565b5050905080518660000151106185e157506000915061378f9050565b808660000151815181106185f157fe5b6020026020010151925060f883901c60001c60bb141561200b57506000915061378f9050565b60008061862261915e565b84806020019051810190618636919061a04d565b91509150600086806020019051810190618650919061a04d565b50604051633c7b5fe960e21b8152909150309063f1ed7fa49061867d908590859088908b9060040161b91a565b60206040518083038186803b15801561869557600080fd5b505afa9250505080156186c5575060408051601f3d908101601f191682019092526186c29181019061a5cb565b60015b6186f3573d808015617f4b576040519150601f19603f3d011682016040523d82523d6000602084013e617f50565b935061378f92505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b815260040161873192919061b316565b60006040518083038186803b15801561874957600080fd5b505afa15801561875d573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052618785919081019061a2ad565b90506001915080516000141561881e576040516315e8a07760e21b81526001600160a01b038816906357a281dc906187c3908790899060040161b316565b60006040518083038186803b1580156187db57600080fd5b505afa1580156187ef573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052618817919081019061a2ad565b9050600091505b80518610618833576000809250925050616d3a565b80868151811061883f57fe5b602002602001015192505094509492505050565b6000806000808680602001905181019061886d9190619fc3565b925092509250801561891157604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e0906188ad906000908a9060040161b2fb565b604080518083038187803b1580156188c457600080fd5b5086fa935050505080156188f5575060408051601f3d908101601f191682019092526188f29181019061aac3565b60015b618905576000935050505061378f565b50935061378f92505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e0906188ad906000908a9060040161b2fb565b60008060008580602001905181019061895e9190619ec4565b915091506000858060200190518101906189789190619ea6565b9050306330d6570d838584617eb18a618ccd565b6000806060846001600160a01b03166370a0823160e01b856040516024016189b4919061b2ed565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516189f2919061b2e1565b600060405180830381855afa9150503d8060008114618a2d576040519150601f19603f3d011682016040523d82523d6000602084013e618a32565b606091505b5091509150818015618a4657506020815110155b15616b0857611a36816000618450565b600080600085806020019051810190618a6f9190619ec4565b91509150600085806020019051810190618a899190619ea6565b90503063a469841762061a80848685618aa18b618ccd565b6040518663ffffffff1660e01b8152600401618ac0949392919061b366565b60006040518083038187803b158015618ad857600080fd5b5086fa93505050508015617f1d57506040513d6000823e601f3d908101601f19168201604052617f1a919081019061a579565b6000806060856001600160a01b031663dd62ed3e60e01b8686604051602401618b3592919061b316565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051618b73919061b2e1565b600060405180830381855afa9150503d8060008114618bae576040519150601f19603f3d011682016040523d82523d6000602084013e618bb3565b606091505b5091509150818015618bc757506020815110155b1561200b57613aeb816000618450565b6000616b0b82617fa2565b600080600085806020019051810190618bfb9190619ec4565b9150915060008086806020019051810190618c169190619ec4565b91509150618c2684848389614a12565b98975050505050505050565b600082618c4157506000616b0b565b82820282848281618c4e57fe5b041461378f5761378f618c6360018686618fc3565b61901d565b60008282018381101561378f5761378f618c6360008686618fc3565b600081618c9a57618c9a618c6360038585618fc3565b6000828481618ca557fe5b04949350505050565b600082821115618cc757618cc7618c6360028585618fc3565b50900390565b604080516001808252818301909252606091602080830190803683370190505090508181600081518110618cfd57fe5b602002602001018181525050919050565b6000831580618d1b575081155b80618d24575082155b15618d315750600061378f565b83820282858281618d3e57fe5b0414618d4e57600091505061378f565b8360018503820181618d5c57fe5b0495945050505050565b6000813b80618d79576000915050611217565b50816001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b158015618db357600080fd5b505afa158015618dc7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190618deb919061a6ab565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401618e16919061b2ed565b60206040518083038186803b158015618e2e57600080fd5b505afa158015618e42573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190618e66919061a5cb565b618e7257506000611217565b816001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b158015618eab57600080fd5b505afa158015618ebf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190618ee3919061a6ab565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401618f0e919061b2ed565b60206040518083038186803b158015618f2657600080fd5b505afa158015618f3a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190618f5e919061a5cb565b618f6a57506000611217565b506001919050565b8160200183511015618f9157618f91618c636005855185602001619025565b910160200152565b60008160200183511015618fba57618fba618c636005855185602001619025565b50016020015190565b606063e946c1bb60e01b848484604051602401618fe29392919061b7da565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b848484604051602401618fe29392919061b7f5565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b60408051808201909152606081526000602082015290565b604051806040016040528060008152602001606081525090565b6040805160608101909152600080825260208201908152600060209091015290565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b60405180608001604052806004906020820280368337509192915050565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b8035616b0b8161bc2c565b8051616b0b8161bc2c565b600082601f8301126191cf57600080fd5b81356191e26191dd8261baae565b61ba88565b9150818183526020840193506020810190508385602084028201111561920757600080fd5b60005b83811015619233578161921d88826191a8565b845250602092830192919091019060010161920a565b5050505092915050565b600082601f83011261924e57600080fd5b815161925c6191dd8261baae565b9150818183526020840193506020810190508385602084028201111561928157600080fd5b60005b83811015619233578161929788826191b3565b8452506020928301929190910190600101619284565b600082601f8301126192be57600080fd5b81356192cc6191dd8261baae565b81815260209384019390925082018360005b8381101561923357813586016192f488826191be565b84525060209283019291909101906001016192de565b600082601f83011261931b57600080fd5b81516193296191dd8261baae565b9150818183526020840193506020810190508385602084028201111561934e57600080fd5b60005b8381101561923357816193648882619818565b8452506020928301929190910190600101619351565b60008083601f84011261938c57600080fd5b5081356001600160401b038111156193a357600080fd5b6020830191508360208202830111156193bb57600080fd5b9250929050565b600082601f8301126193d357600080fd5b81356193e16191dd8261baae565b81815260209384019390925082018360005b8381101561923357813586016194098882619839565b84525060209283019291909101906001016193f3565b600082601f83011261943057600080fd5b813561943e6191dd8261baae565b9150818183526020840193506020810190508385602084028201111561946357600080fd5b60005b83811015619233578161947988826198c5565b8452506020928301929190910190600101619466565b600082601f8301126194a057600080fd5b81516194ae6191dd8261baae565b915081818352602084019350602081019050838560208402820111156194d357600080fd5b60005b8381101561923357816194e98882619818565b84525060209283019291909101906001016194d6565b600082601f83011261951057600080fd5b813561951e6191dd8261baae565b81815260209384019390925082018360005b83811015619233578135860161954688826199ab565b8452506020928301929190910190600101619530565b600082601f83011261956d57600080fd5b813561957b6191dd8261baae565b91508181835260208401935060208101905083856101808402820111156195a157600080fd5b60005b8381101561923357816195b78882619c0a565b84525060209092019161018091909101906001016195a4565b600082601f8301126195e157600080fd5b81356195ef6191dd8261baae565b9150818183526020840193506020810190508385608084028201111561961457600080fd5b60005b83811015619233578161962a8882619dc1565b84525060209092019160809190910190600101619617565b600082601f83011261965357600080fd5b81516196616191dd8261baae565b9150818183526020840193506020810190508385602084028201111561968657600080fd5b60005b83811015619233578161969c8882619e46565b8452506020928301929190910190600101619689565b600082601f8301126196c357600080fd5b81356196d16191dd8261baae565b915081818352602084019350602081019050838560208402820111156196f657600080fd5b60005b83811015619233578161970c888261980d565b84525060209283019291909101906001016196f9565b600082601f83011261973357600080fd5b81516197416191dd8261baae565b9150818183526020840193506020810190508385602084028201111561976657600080fd5b60005b83811015619233578161977c8882619818565b8452506020928301929190910190600101619769565b600082601f8301126197a357600080fd5b81516197b16191dd8261baae565b915081818352602084019350602081019050838560208402820111156197d657600080fd5b60005b8381101561923357816197ec8882619e5c565b84525060209283019291909101906001016197d9565b8051616b0b8161bc40565b8035616b0b8161bc49565b8051616b0b8161bc49565b8035616b0b8161bc52565b8051616b0b8161bc52565b600082601f83011261984a57600080fd5b81356198586191dd8261bace565b9150808252602083016020830185838301111561987457600080fd5b6175a083828461bbc9565b600082601f83011261989057600080fd5b815161989e6191dd8261bace565b915080825260208301602083018583830111156198ba57600080fd5b6175a083828461bbd5565b8035616b0b8161bc5b565b8051616b0b8161bc5b565b8051616b0b8161bc64565b8051616b0b8161bc71565b8035616b0b8161bc7e565b8035616b0b8161bc8b565b8051616b0b8161bc8b565b60006040828403121561992457600080fd5b61992e604061ba88565b9050600061993c848461980d565b825250602061994d848483016191a8565b60208301525092915050565b60006040828403121561996b57600080fd5b619975604061ba88565b9050600061998384846198c5565b82525060208201356001600160401b0381111561999f57600080fd5b61994d848285016192ad565b600060a082840312156199bd57600080fd5b6199c760a061ba88565b905060006199d5848461980d565b82525060206199e68484830161980d565b60208301525060406199fa8482850161980d565b6040830152506060619a0e8482850161980d565b60608301525060808201356001600160401b03811115619a2d57600080fd5b619a3984828501619839565b60808301525092915050565b600060608284031215619a5757600080fd5b619a61606061ba88565b90506000619a6f84846191a8565b8252506020619a8084848301619823565b6020830152506040619a9484828501619823565b60408301525092915050565b600060608284031215619ab257600080fd5b619abc606061ba88565b90506000619aca84846191b3565b8252506020619adb8484830161982e565b6020830152506040619a948482850161982e565b600060408284031215619b0157600080fd5b619b0b604061ba88565b9050600061993c84846191a8565b600060a08284031215619b2b57600080fd5b619b3560a061ba88565b90506000619b43848461980d565b8252506020619b54848483016191a8565b6020830152506040619b68848285016191a8565b6040830152506060619a0e848285016191a8565b600060a08284031215619b8e57600080fd5b619b9860a061ba88565b90506000619ba68484619818565b8252506020619bb7848483016191b3565b6020830152506040619bcb848285016191b3565b6040830152506060619bdf848285016191b3565b60608301525060808201516001600160401b03811115619bfe57600080fd5b619a398482850161987f565b60006101808284031215619c1d57600080fd5b619c2861018061ba88565b90506000619c3684846198c5565b8252506020619c47848483016198c5565b6020830152506040619c5b84828501619e30565b6040830152506060619c6f84828501619e30565b6060830152506080619c8384828501619e30565b60808301525060a0619c97848285016191a8565b60a08301525060c0619cab848285016191a8565b60c08301525060e0619cbf848285016191a8565b60e083015250610100619cd4848285016191a8565b61010083015250610120619cea8482850161980d565b61012083015250610140619d0084828501619e67565b61014083015250610160619d168482850161980d565b6101608301525092915050565b600060608284031215619d3557600080fd5b619d3f606061ba88565b90506000619d4d84846191a8565b8252506020619d5e8484830161980d565b6020830152506040619a94848285016191a8565b600060608284031215619d8457600080fd5b619d8e606061ba88565b90506000619d9c8484619818565b8252506020619dad848483016198db565b6020830152506040619a9484828501619e3b565b600060808284031215619dd357600080fd5b619ddd608061ba88565b90506000619deb84846198f1565b8252506020619dfc84848301619e72565b6020830152506040619e108482850161980d565b6040830152506060619e248482850161980d565b60608301525092915050565b8035616b0b8161bc94565b8051616b0b8161bc94565b8051616b0b8161bc9d565b8051616b0b8161bca6565b8051616b0b8161bcaf565b8035616b0b8161bcb8565b8035616b0b8161bcc1565b8051616b0b8161bcc1565b600060208284031215619e9a57600080fd5b60006119c884846191a8565b600060208284031215619eb857600080fd5b60006119c884846191b3565b60008060408385031215619ed757600080fd5b6000619ee385856191b3565b9250506020619ef4858286016191b3565b9150509250929050565b60008060008060808587031215619f1457600080fd5b6000619f2087876191b3565b9450506020619f31878288016191b3565b9350506040619f42878288016191b3565b9250506060619f53878288016191b3565b91505092959194509250565b600080600060608486031215619f7457600080fd5b6000619f8086866191b3565b9350506020619f91868287016191b3565b92505060408401516001600160401b03811115619fad57600080fd5b619fb98682870161923d565b9150509250925092565b600080600060608486031215619fd857600080fd5b6000619fe486866191b3565b9350506020619ff5868287016191b3565b9250506040619fb986828701619802565b6000806040838503121561a01957600080fd5b600061a02585856191b3565b92505060208301516001600160401b0381111561a04157600080fd5b619ef48582860161923d565b6000806040838503121561a06057600080fd5b600061a06c85856191b3565b92505060208301516001600160401b0381111561a08857600080fd5b619ef485828601619b7c565b6000806000806080858703121561a0aa57600080fd5b600061a0b687876191a8565b945050602061a0c7878288016191a8565b935050604061a0d8878288016191a8565b92505060608501356001600160401b0381111561a0f457600080fd5b619f53878288016196b2565b6000806000806080858703121561a11657600080fd5b600061a12287876191a8565b945050602061a133878288016191a8565b935050604061a144878288016191a8565b9250506060619f538782880161980d565b6000806000806080858703121561a16b57600080fd5b600061a17787876191a8565b945050602061a188878288016191a8565b93505060408501356001600160401b0381111561a1a457600080fd5b61a0d8878288016191be565b60008060006060848603121561a1c557600080fd5b600061a1d186866191a8565b93505060208401356001600160401b0381111561a1ed57600080fd5b61a1f9868287016191be565b92505060408401356001600160401b0381111561a21557600080fd5b619fb9868287016196b2565b600080600080600060a0868803121561a23957600080fd5b600061a24588886191a8565b955050602061a2568882890161980d565b945050604061a267888289016191a8565b935050606061a278888289016191a8565b92505060808601356001600160401b0381111561a29457600080fd5b61a2a0888289016196b2565b9150509295509295909350565b60006020828403121561a2bf57600080fd5b81516001600160401b0381111561a2d557600080fd5b6119c88482850161923d565b60008060006060848603121561a2f657600080fd5b83516001600160401b0381111561a30c57600080fd5b61a3188682870161930a565b93505060208401516001600160401b0381111561a33457600080fd5b61a34086828701619722565b9250506040619fb9868287016198e6565b6000806020838503121561a36457600080fd5b82356001600160401b0381111561a37a57600080fd5b61a3868582860161937a565b92509250509250929050565b60008060006060848603121561a3a757600080fd5b83356001600160401b0381111561a3bd57600080fd5b61a3c9868287016193c2565b93505060208401356001600160401b0381111561a3e557600080fd5b61a3f1868287016193c2565b9250506040619fb98682870161980d565b60006020828403121561a41457600080fd5b81356001600160401b0381111561a42a57600080fd5b6119c88482850161941f565b6000806040838503121561a44957600080fd5b82356001600160401b0381111561a45f57600080fd5b61a46b8582860161941f565b9250506020619ef4858286016191a8565b60008060006060848603121561a49157600080fd5b83356001600160401b0381111561a4a757600080fd5b61a4b38682870161941f565b935050602061a4c4868287016191a8565b9250506040619fb9868287016191a8565b60006020828403121561a4e757600080fd5b81516001600160401b0381111561a4fd57600080fd5b6119c88482850161948f565b60008060006060848603121561a51e57600080fd5b83356001600160401b0381111561a53457600080fd5b61a5408682870161955c565b93505060208401356001600160401b0381111561a55c57600080fd5b61a568868287016195d0565b9250506040619fb9868287016198c5565b60006020828403121561a58b57600080fd5b81516001600160401b0381111561a5a157600080fd5b6119c884828501619722565b60006020828403121561a5bf57600080fd5b60006119c88484619802565b60006020828403121561a5dd57600080fd5b60006119c88484619818565b60006020828403121561a5fb57600080fd5b81516001600160401b0381111561a61157600080fd5b6119c88482850161987f565b6000806000806080858703121561a63357600080fd5b600061a63f87876198c5565b94505060208501356001600160401b0381111561a65b57600080fd5b61a188878288016194ff565b6000806000806080858703121561a67d57600080fd5b600061a68987876198c5565b945050602061a69a878288016198c5565b935050604061a0d8878288016198c5565b60006020828403121561a6bd57600080fd5b60006119c884846198d0565b60008060006060848603121561a6de57600080fd5b600061a6ea86866198c5565b93505060208401356001600160401b0381111561a70657600080fd5b61a1f98682870161941f565b60006020828403121561a72457600080fd5b60006119c88484619907565b6000806080838503121561a74357600080fd5b600061a74f8585619907565b9250506020619ef485828601619aa0565b60008060008060a0858703121561a77657600080fd5b600061a7828787619912565b945050604061a793878288016191a8565b935050606061a7a4878288016191a8565b92505060808501356001600160401b0381111561a0f457600080fd5b6000806000806080858703121561a7d657600080fd5b84356001600160401b0381111561a7ec57600080fd5b61a0b687828801619959565b60008060008060c0858703121561a80e57600080fd5b600061a81a8787619a45565b945050606061a82b878288016198fc565b935050608061a83c878288016198fc565b92505060a08501356001600160401b0381111561a0f457600080fd5b60008060008060a0858703121561a86e57600080fd5b600061a7828787619aef565b6000806000806080858703121561a89057600080fd5b84356001600160401b0381111561a8a657600080fd5b61a0b687828801619b19565b6000806000806080858703121561a8c857600080fd5b84356001600160401b0381111561a8de57600080fd5b61a12287828801619b19565b6000806000806080858703121561a90057600080fd5b84356001600160401b0381111561a91657600080fd5b61a92287828801619b19565b945050602061a9338782880161980d565b935050604061a944878288016191a8565b9250506060619f53878288016191a8565b6000806000610220848603121561a96b57600080fd5b600061a9778686619c0a565b93505061018061a98986828701619dc1565b925050610200619fb9868287016198c5565b60008060008060c0858703121561a9b157600080fd5b600061a9bd8787619d23565b945050606061a9ce878288016191a8565b935050608061a83c878288016191a8565b600080600060a0848603121561a9f457600080fd5b600061aa008686619d72565b935050606061aa1186828701619e3b565b9250506080619fb986828701619802565b60006020828403121561aa3457600080fd5b60006119c88484619e51565b6000806000806080858703121561aa5657600080fd5b600061aa628787619818565b94505060208501516001600160401b0381111561aa7e57600080fd5b61aa8a87828801619642565b93505060408501516001600160401b0381111561aaa657600080fd5b61aab287828801619792565b9250506060619f5387828801619818565b6000806040838503121561aad657600080fd5b600061aae28585619818565b9250506020619ef485828601619818565b6000806000806080858703121561ab0957600080fd5b600061ab158787619818565b945050602061ab2687828801619818565b935050604061aab287828801619818565b600080600080600060a0868803121561ab4f57600080fd5b600061ab5b8888619818565b955050602061ab6c88828901619818565b945050604061ab7d88828901619818565b935050606061ab8e88828901619818565b925050608061a2a088828901619818565b60006020828403121561abb157600080fd5b60006119c88484619e7d565b600061abc9838361ac10565b505060200190565b600061abc9838361ae47565b600061378f838361ae78565b600061378f838361afe9565b600061378f838361b04e565b61ac0a8161bb92565b82525050565b61ac0a8161bb08565b600061ac248261bafb565b61ac2e818561baff565b935061ac398361baf5565b8060005b8381101561ac6757815161ac51888261abbd565b975061ac5c8361baf5565b92505060010161ac3d565b509495945050505050565b600061ac7d8261bafb565b61ac87818561baff565b935061ac928361baf5565b8060005b8381101561ac6757815161acaa888261abd1565b975061acb58361baf5565b92505060010161ac96565b600061accb8261bafb565b61acd5818561baff565b93508360208202850161ace78561baf5565b8060005b8581101561ad21578484038952815161ad04858261abdd565b945061ad0f8361baf5565b60209a909a019992505060010161aceb565b5091979650505050505050565b600061ad398261bafb565b61ad43818561baff565b93508360208202850161ad558561baf5565b8060005b8581101561ad21578484038952815161ad72858261abe9565b945061ad7d8361baf5565b60209a909a019992505060010161ad59565b600061ad9a8261bafb565b61ada4818561baff565b93508360208202850161adb68561baf5565b8060005b8581101561ad21578484038952815161add3858261abf5565b945061adde8361baf5565b60209a909a019992505060010161adba565b600061adfb8261bafb565b61ae05818561baff565b935061ae108361baf5565b8060005b8381101561ac6757815161ae28888261abd1565b975061ae338361baf5565b92505060010161ae14565b61ac0a8161bb13565b61ac0a8161bb18565b61ac0a8161bb1b565b600061ae658385611217565b935061ae7283858461bbc9565b50500190565b600061ae838261bafb565b61ae8d818561baff565b935061ae9d81856020860161bbd5565b61aea68161bc01565b9093019392505050565b600061aebb8261bafb565b61aec58185611217565b935061aed581856020860161bbd5565b9290920192915050565b61ac0a8161bb28565b61ac0a8161bb9d565b61ac0a8161bba8565b61ac0a8161bbb3565b61ac0a8161bb51565b61ac0a8161bbbe565b600061af2260248361baff565b7f556e6973776170563353616d706c65722f746f6b656e5061746820746f6f20738152631a1bdc9d60e21b602082015260400192915050565b600061af6860258361baff565b7f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e8152642fa820a4a960d91b602082015260400192915050565b600061afaf60258361baff565b7f556e6973776170563353616d706c65722f696e76616c69642070617468206c658152646e6774687360d81b602082015260400192915050565b805160009060a084019061affd858261ae47565b50602083015161b010602086018261ae47565b50604083015161b023604086018261ae47565b50606083015161b036606086018261ae47565b5060808301518482036080860152611a36828261ae78565b805160408084526000919084019061b066828261ae78565b91505060208301516110aa602086018261ae3e565b8051606083019061b08c848261ac10565b50602082015161b09f602085018261ae50565b50604082015161b0b2604085018261ae50565b50505050565b8051608083019061b0c9848261ac10565b50602082015161b0dc602085018261ae3e565b50604082015161b0ef604085018261ac10565b50606082015161b0b2606085018261ae3e565b8051600090604084019061b116858261ae47565b5060208301518482036020860152611a36828261ae78565b805160009060a084019061b142858261ae47565b50602083015161b155602086018261ac10565b50604083015161b168604086018261ac10565b50606083015161b036606086018261ac10565b805161018083019061b18d848261aedf565b50602082015161b1a0602085018261aedf565b50604082015161b1b3604085018261b2b0565b50606082015161b1c6606085018261b2b0565b50608082015161b1d9608085018261b2b0565b5060a082015161b1ec60a085018261ac10565b5060c082015161b1ff60c085018261ac10565b5060e082015161b21260e085018261ac10565b5061010082015161b22761010085018261ac10565b5061012082015161b23c61012085018261ae47565b5061014082015161b25161014085018261b2c2565b5061016082015161b0b261016085018261ae47565b8051608083019061b277848261aee8565b50602082015161b28a602085018261b2cb565b50604082015161b29d604085018261ae47565b50606082015161b0b2606085018261ae47565b61ac0a8161bb57565b61ac0a8161bb6f565b61ac0a8161bb80565b61ac0a8161bb8c565b60006119c882848661ae59565b600061378f828461aeb0565b60208101616b0b828461ac10565b6040810161b309828561ac01565b61378f602083018461ae47565b6040810161b324828561ac10565b61378f602083018461ac10565b6080810161b33f828761ac10565b61b34c602083018661ac10565b61b359604083018561ac10565b611a36606083018461ac10565b6080810161b374828761ac10565b61b381602083018661ac10565b61b38e604083018561ac10565b8181036060830152613aeb818461adf0565b6060810161b3ae828661ac10565b61b3bb602083018561ac10565b8181036040830152611a36818461ac19565b6080810161b3db828761ac10565b61b3e8602083018661ac10565b818103604083015261b3fa818561ac19565b90508181036060830152613aeb818461adf0565b6060810161b41c828661ac10565b61b429602083018561ac10565b6119c8604083018461ae3e565b6080810161b444828761ac10565b61b451602083018661ac10565b61b45e604083018561ae3e565b8181036060830152613aeb818461ae78565b6060810161b47e828661ac10565b61b48b602083018561ac10565b6119c8604083018461ae47565b60a0810161b4a6828861ac10565b61b4b3602083018761ac10565b61b4c0604083018661ae47565b61b4cd606083018561af0c565b818103608083015261b4df818461ae78565b979650505050505050565b6040810161b4f8828561ac10565b81810360208301526119c8818461ac19565b6060810161b518828661ac10565b818103602083015261b52a818561ac19565b90508181036040830152611a36818461adf0565b6080810161b54c828761ac10565b61b559602083018661aee8565b818103604083015261b3fa818561ac72565b610100810161b57a828b61ac10565b61b587602083018a61aee8565b818103604083015261b599818961ac72565b9050818103606083015261b5ad818861adf0565b905061b5bc608083018761ac10565b61b5c960a083018661aee8565b81810360c083015261b5db818561ac72565b905081810360e083015261b5ef818461adf0565b9a9950505050505050505050565b6040810161b60b828561ac10565b81810360208301526119c8818461b12e565b6040810161b309828561ac10565b6040808252810161b63c818561ac19565b905081810360208301526119c8818461adf0565b6040808252810161b661818561ac19565b905061378f602083018461ae47565b6060808252810161b681818661acc0565b9050818103602083015261b52a818561adf0565b6020808252810161378f818461ad8f565b6020808252810161378f818461adf0565b60208101616b0b828461ae3e565b6060810161b6d3828661ae3e565b61b6e0602083018561ac10565b8181036040830152611a36818461adf0565b60208101616b0b828461ae47565b6060810161b70e828661ae47565b818103602083015261b52a818561ae78565b6020808252810161378f818461ae78565b6040808252810161b661818561ae78565b6060810161b750828661aedf565b61b75d602083018561aedf565b6119c8604083018461b2b9565b6060810161b778828661aedf565b61b48b602083018561aedf565b6040810161b793828561aedf565b81810360208301526119c8818461adf0565b6080810161b7b3828761aedf565b61b7c0602083018661ac10565b61b7cd604083018561ac10565b611a36606083018461ae47565b6060810161b7e8828661aee8565b61b48b602083018561ae47565b6060810161b7e8828661aef1565b60e0810161b811828761aefa565b818103602083015261b823818661ad2e565b9050818103604083015261b837818561ac19565b9050611a36606083018461b0b8565b6060810161b854828661af03565b61b48b602083018561af03565b6080810161b86f828561af03565b61378f602083018461b07b565b60208082528101616b0b8161af15565b60208082528101616b0b8161af5b565b60208082528101616b0b8161afa2565b60c0810161b8ba828761b07b565b61b8c7606083018661af03565b61b8d4608083018561af03565b81810360a0830152613aeb818461adf0565b6060808252810161b8f7818661b102565b9050818103602083015261b90b818561b102565b90506119c8604083018461ae47565b6080808252810161b92b818761b12e565b905061b7c0602083018661ac10565b6080808252810161b94b818761b12e565b905061b34c602083018661ae47565b610200810161b969828561b17b565b61378f61018083018461b266565b610220810161b986828661b17b565b61b99461018083018561b266565b6119c861020083018461aedf565b6040810161b4f8828561ae47565b6060810161b9be828661ae47565b818103602083015261b9d0818561ac19565b90508181036040830152611a36818461ac19565b60c0810161b9f2828961ae47565b61b9ff602083018861ae47565b61ba0c604083018761ae47565b61ba19606083018661ae47565b61ba26608083018561ae47565b61b4df60a083018461ae47565b6000808335601e193685900301811261ba4b57600080fd5b8084019250823591506001600160401b0382111561ba6857600080fd5b60208301925060018202360383131561ba8057600080fd5b509250929050565b6040518181016001600160401b038111828210171561baa657600080fd5b604052919050565b60006001600160401b0382111561bac457600080fd5b5060209081020190565b60006001600160401b0382111561bae457600080fd5b506020601f91909101601f19160190565b60200190565b5190565b90815260200190565b6000616b0b8261bb63565b151590565b90565b6001600160e01b03191690565b6000616b0b8261bb08565b806112178161bc0b565b806112178161bc18565b806112178161bc22565b600f0b90565b6001600160801b031690565b6001600160a01b031690565b62ffffff1690565b63ffffffff1690565b6001600160401b031690565b60ff1690565b6000616b0b8261bb28565b6000616b0b8261bb33565b6000616b0b8261bb3d565b6000616b0b8261bb47565b6000616b0b8261bb18565b82818337506000910152565b60005b8381101561bbf057818101518382015260200161bbd8565b8381111561b0b25750506000910152565b601f01601f191690565b6004811061bc1557fe5b50565b6008811061bc1557fe5b6002811061bc1557fe5b61bc358161bb08565b811461bc1557600080fd5b61bc358161bb13565b61bc358161bb18565b61bc358161bb1b565b61bc358161bb28565b6005811061bc1557600080fd5b6002811061bc1557600080fd5b6004811061bc1557600080fd5b61bc358161bb51565b61bc358161bb57565b61bc358161bb63565b61bc358161bb6f565b61bc358161bb77565b61bc358161bb80565b61bc358161bb8c56fea2646970667358221220a9eea59c681c025710580e5b9e317d4a933f8696559a2a782c721eee9cf351c864736f6c634300060c0033';
ERC20BridgeSamplerContract.contractName = 'ERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=erc20_bridge_sampler.js.map