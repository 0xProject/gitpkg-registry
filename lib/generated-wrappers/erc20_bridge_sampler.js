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
                name: 'sampleBuysFromEth2Dai',
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
                name: 'sampleSellsFromEth2Dai',
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
     * Sample buy quotes from Eth2Dai/Oasis.
      * @param router Address of the Eth2Dai/Oasis contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
     */
    sampleBuysFromEth2Dai(router, takerToken, makerToken, makerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromEth2Dai(address,address,address,uint256[])';
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
     * Sample sell quotes from Eth2Dai/Oasis.
      * @param router Address of the Eth2Dai/Oasis contract
      * @param takerToken Address of the taker token (what to sell).
      * @param makerToken Address of the maker token (what to buy).
      * @param takerTokenAmounts Taker token sell amount for each sample.
     */
    sampleSellsFromEth2Dai(router, takerToken, makerToken, takerTokenAmounts) {
        const self = this;
        assert_1.assert.isString('router', router);
        assert_1.assert.isString('takerToken', takerToken);
        assert_1.assert.isString('makerToken', makerToken);
        assert_1.assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromEth2Dai(address,address,address,uint256[])';
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
ERC20BridgeSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b506004361061030c5760003560e01c80638e5a0e071161019d578063c25c4138116100e9578063ddd5aa28116100a2578063f1ed7fa41161007c578063f1ed7fa414610751578063f3868e9c14610444578063f5a4994d14610764578063fc9fe41b146107775761030c565b8063ddd5aa2814610718578063e78ac0451461072b578063e8e4af091461073e5761030c565b8063c25c4138146106a6578063c8319084146106b9578063c8c74a37146106cc578063c94706d8146106df578063cc1621c9146106f2578063d9bca372146107055761030c565b8063a0295b8b11610156578063ab00027611610130578063ab0002761461064c578063adc636bf1461065f578063b90cd2fb14610680578063bd71ecf6146106935761030c565b8063a0295b8b14610613578063a469841714610626578063a75e744b146106395761030c565b80638e5a0e07146105765780639209483b1461059857806398777748146105ab5780639bf3ee35146105be5780639e3f05c3146105de5780639ea0ff13146106005761030c565b806340bc03ae1161025c5780635d5b674f11610215578063706e2f9b116101ef578063706e2f9b1461052a57806374c9d2551461053d5780637f7f4f13146105505780638b6d7b44146105635761030c565b80635d5b674f146104e457806366a1ac6b146104f757806368be3cf21461050a5761030c565b806340bc03ae14610457578063494569db1461046a5780634edfb5b21461047d5780635505000a1461049d57806357494b1d146104be5780635aae4e53146104d15761030c565b8063281e3432116102c95780632d753aa4116102a35780632d753aa41461040b57806330d6570d1461041e5780633105fec11461043157806336052391146104445761030c565b8063281e3432146103c357806329fa4aa0146103d65780632aa64319146103e95761030c565b80630496d5dc146103115780631022742b1461033b578063149dab0e1461035b578063162790551461037d5780632339078f1461039d578063252322b3146103b0575b600080fd5b61032461031f366004618c63565b61078a565b604051610332929190619d2e565b60405180910390f35b61034e610349366004619096565b610930565b6040516103329190619e52565b61036e610369366004619313565b610aa3565b60405161033293929190619bfa565b61039061038b36600461893d565b610c03565b6040516103329190619e65565b61034e6103ab366004619294565b610c0d565b61034e6103be366004618ba1565b610e34565b61034e6103d13660046195a9565b61100a565b61034e6103e43660046193cc565b61125f565b6103fc6103f7366004619425565b6112ce565b60405161033293929190619e70565b61034e610419366004618b1c565b6115ab565b61034e61042c366004618ba1565b611734565b61034e61043f366004618c63565b6118a8565b61034e610452366004619425565b611a2c565b61034e6104653660046193cc565b611abe565b610324610478366004618c63565b611c3f565b61049061048b36600461950b565b611dcb565b6040516103329190619ebe565b6104b06104ab3660046191fd565b612048565b604051610332929190619d75565b61034e6104cc366004618ba1565b612293565b6104b06104df3660046191fd565b6127e5565b61034e6104f2366004618ba1565b612a2a565b61034e610505366004619096565b612a90565b61051d610518366004618e70565b612b45565b6040516103329190619ddd565b61034e610538366004618f47565b612ca6565b61036e61054b366004619313565b612d98565b61034e61055e3660046195a9565b612da7565b61034e6105713660046193cc565b612ff4565b610589610584366004618ede565b613357565b6040516103329392919061a185565b61034e6105a63660046193cc565b613570565b61034e6105b9366004618ba1565b613770565b6105d16105cc366004619569565b613ca7565b6040516103329190619e9c565b6105f16105ec366004619454565b613dee565b60405161033293929190619ea5565b6105d161060e366004618c13565b613f14565b61034e610621366004619294565b61412a565b61034e610634366004618ba1565b614326565b6103fc610647366004618cd5565b61447b565b61034e61065a366004618ba1565b6145b8565b61067261066d366004618ba1565b614716565b604051610332929190619f0c565b61034e61068e366004618ba1565b614866565b61034e6106a1366004618f79565b6148cc565b61034e6106b4366004618ba1565b6149c8565b61034e6106c7366004618ba1565b614a2e565b61034e6106da366004618c63565b614beb565b61034e6106ed366004618ba1565b614d57565b6105f1610700366004619454565b614eb5565b6103fc610713366004618cd5565b61509b565b6103fc610726366004619425565b61518a565b61034e610739366004618fbd565b61541d565b61034e61074c366004618ba1565b615512565b6105d161075f3660046194c4565b615645565b610672610772366004618ba1565b6157e4565b610589610785366004618ede565b6158d0565b80516060908190806001600160401b03811180156107a757600080fd5b506040519080825280602002602001820160405280156107d1578160200160208202803683370190505b5091506107de8686615ae5565b92508251600014156107f05750610928565b60005b8181101561092557866001600160a01b031663a8312b1d620249f087848151811061081a57fe5b6020026020010151878a6040518563ffffffff1660e01b81526004016108429392919061a297565b60006040518083038187803b15801561085a57600080fd5b5086fa9350505050801561089057506040513d6000823e601f3d908101601f1916820160405261088d9190810190619165565b60015b6108ca573d8080156108be576040519150601f19603f3d011682016040523d82523d6000602084013e6108c3565b606091505b5050610925565b806001885103815181106108da57fe5b60200260200101518483815181106108ee57fe5b60200260200101818152505083828151811061090657fe5b60200260200101516000141561091c5750610925565b506001016107f3565b50505b935093915050565b606083516001600160401b038111801561094957600080fd5b50604051908082528060200260200182016040528015610973578160200160208202803683370190505b50905060005b84518114610a9b57306001600160a01b0316639bf3ee3562030d408784815181106109a057fe5b60200260200101518785815181106109b457fe5b6020026020010151876040518563ffffffff1660e01b81526004016109db9392919061a247565b60206040518083038187803b1580156109f357600080fd5b5086fa93505050508015610a24575060408051601f3d908101601f19168201909252610a21918101906191b3565b60015b610a78573d808015610a52576040519150601f19603f3d011682016040523d82523d6000602084013e610a57565b606091505b506000838381518110610a6657fe5b60200260200101818152505050610a93565b80838381518110610a8557fe5b602002602001018181525050505b600101610979565b509392505050565b600060608086602001515160001415610abb57610bf9565b610ac787878787615dd4565b855191945092506001600160401b0381118015610ae357600080fd5b50604051908082528060200260200182016040528015610b0d578160200160208202803683370190505b50905060005b8151811015610bf757836001600160a01b0316637f9c0ecd620493e085888581518110610b3c57fe5b60200260200101516040518463ffffffff1660e01b8152600401610b61929190619d53565b60206040518083038187803b158015610b7957600080fd5b5086fa93505050508015610baa575060408051601f3d908101601f19168201909252610ba7918101906191b3565b60015b610bb357610bf7565b80838381518110610bc057fe5b602002602001018181525050828281518110610bd857fe5b602002602001015160001415610bee5750610bf7565b50600101610b13565b505b9450945094915050565b803b15155b919050565b6060610c198385616006565b602085015160408051600280825260608281019093528160200160208202803683370190505090508581600081518110610c4f57fe5b60200260200101906001600160a01b031690816001600160a01b0316815250508481600181518110610c7d57fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b0381118015610cad57600080fd5b50604051908082528060200260200182016040528015610cd7578160200160208202803683370190505b509350610ce2618181565b610cea61603c565b905060005b82811015610e27576060610d168b898481518110610d0957fe5b602002602001015161606b565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e90610d4c9060009085908a908990600401619f5f565b600060405180830381600087803b158015610d6657600080fd5b505af1925050508015610d9b57506040513d6000823e601f3d908101601f19168201604052610d989190810190619013565b60015b610dd6573d808015610dc9576040519150601f19603f3d011682016040523d82523d6000602084013e610dce565b606091505b505050610e27565b600081600181518110610de557fe5b602002602001015160001902905060008113610e0357505050610e27565b80898581518110610e1057fe5b602002602001018181525050505050600101610cef565b5050505050949350505050565b6060610e408385616006565b8151806001600160401b0381118015610e5857600080fd5b50604051908082528060200260200182016040528015610e82578160200160208202803683370190505b50915060006001600160a01b03861615610ea557610ea087876160fd565b610ea8565b60005b905060006001600160a01b03861615610eca57610ec588876160fd565b610ecd565b60005b905060005b83811015610ffe5760016001600160a01b038816610f3057610f0f84632640f62c60e01b898581518110610f0257fe5b602002602001015161617c565b878481518110610f1b57fe5b60200260200101819350828152505050610fca565b6001600160a01b038916610f5657610f0f836359e9486260e01b898581518110610f0257fe5b6000610f70846359e9486260e01b8a8681518110610f0257fe5b925090508015610fad57610f8c856309903d8b60e21b8361617c565b888581518110610f9857fe5b60200260200101819450828152505050610fc8565b6000878481518110610fbb57fe5b6020026020010181815250505b505b801580610fea5750858281518110610fde57fe5b60200260200101516000145b15610ff55750610ffe565b50600101610ed2565b50505050949350505050565b60606110168385616006565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b15801561105a57600080fd5b505afa15801561106e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110929190618959565b8451909150806001600160401b03811180156110ad57600080fd5b506040519080825280602002602001820160405280156110d7578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561111357600080fd5b505afa158015611127573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061114b9190618959565b6001600160a01b0316866001600160a01b0316141580156111ee5750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156111a057600080fd5b505afa1580156111b4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111d89190618959565b6001600160a01b0316876001600160a01b031614155b156111fb57505050611257565b60005b81811015610ffe5760006112298a898b8a868151811061121a57fe5b6020026020010151898961625f565b9050806112365750610ffe565b8086838151811061124357fe5b6020908102919091010152506001016111fe565b949350505050565b6040805160608181019092526112c5908061127e86896080840161a036565b604051602081830303815290604052815260200186886040516020016112a592919061a036565b604051602081830303815290604052815260200161652081525083616653565b95945050505050565b60008060606112dd8587616006565b8351806001600160401b03811180156112f557600080fd5b5060405190808252806020026020018201604052801561131f578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c690611352908a908a90600401619a96565b60206040518083038186803b15801561136a57600080fd5b505afa15801561137e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113a29190618959565b925060006001600160a01b038416156113c05750600193508661145f565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c6906113f1908a908c90600401619a96565b60206040518083038186803b15801561140957600080fd5b505afa15801561141d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114419190618959565b93506001600160a01b038416611458575050610bf9565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561149857600080fd5b505afa1580156114ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114d09190619197565b6114db575050610bf9565b60005b8281101561159e5760006115588a87858e602001516040516020016115069493929190619ab0565b6040516020818303038152906040528a88868f602001516040516020016115309493929190619ab0565b6040516020818303038152906040528a858151811061154b57fe5b6020026020010151616850565b90508085838151811061156757fe5b60200260200101818152505084828151811061157f57fe5b602002602001015160001415611595575061159e565b506001016114de565b5050509450945094915050565b8051606090806001600160401b03811180156115c657600080fd5b506040519080825280602002602001820160405280156115f0578160200160208202803683370190505b5091506001600160a01b03871661160757506112c5565b60005b818110156117295760006060896001600160a01b031662061a80636e79e13360e01b8b8b8b8b898151811061163b57fe5b60200260200101516040516024016116569493929190619b0f565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516116949190619a4d565b6000604051808303818686fa925050503d80600081146116d0576040519150601f19603f3d011682016040523d82523d6000602084013e6116d5565b606091505b5091509150600082156116f957818060200190518101906116f691906191b3565b90505b8061170657505050611729565b8086858151811061171357fe5b602090810291909101015250505060010161160a565b505095945050505050565b60606117408385616006565b8151806001600160401b038111801561175857600080fd5b50604051908082528060200260200182016040528015611782578160200160208202803683370190505b50915060005b8181101561189e57866001600160a01b03166372ea9076620c350088888886815181106117b157fe5b60200260200101516040518563ffffffff1660e01b81526004016117d793929190619b91565b60206040518083038187803b1580156117ef57600080fd5b5086fa93505050508015611820575060408051601f3d908101601f1916820190925261181d918101906191b3565b60015b61185a573d80801561184e576040519150601f19603f3d011682016040523d82523d6000602084013e611853565b606091505b505061189e565b8084838151811061186757fe5b60200260200101818152505083828151811061187f57fe5b602002602001015160001415611895575061189e565b50600101611788565b5050949350505050565b8051606090806001600160401b03811180156118c357600080fd5b506040519080825280602002602001820160405280156118ed578160200160208202803683370190505b50915060005b81811015611a2357856001600160a01b031663d06ca61f620249f086848151811061191a57fe5b6020026020010151886040518463ffffffff1660e01b815260040161194092919061a27e565b60006040518083038187803b15801561195857600080fd5b5086fa9350505050801561198e57506040513d6000823e601f3d908101601f1916820160405261198b9190810190619165565b60015b6119c8573d8080156119bc576040519150601f19603f3d011682016040523d82523d6000602084013e6119c1565b606091505b5050611a23565b806001875103815181106119d857fe5b60200260200101518483815181106119ec57fe5b602002602001018181525050838281518110611a0457fe5b602002602001015160001415611a1a5750611a23565b506001016118f3565b50509392505050565b6060611a388385616006565b84602001516001600160a01b0316846001600160a01b0316141580611a6a575084516001600160a01b03848116911614155b15610a9b5781516060816001600160401b0381118015611a8957600080fd5b50604051908082528060200260200182016040528015611ab3578160200160208202803683370190505b509250611257915050565b8051606090806001600160401b0381118015611ad957600080fd5b50604051908082528060200260200182016040528015611b03578160200160208202803683370190505b50915060005b8181101561189e576000606088600001516001600160a01b0316621e84808a602001518a8a8a8881518110611b3a57fe5b6020026020010151604051602401611b549392919061a018565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611b929190619a4d565b6000604051808303818686fa925050503d8060008114611bce576040519150601f19603f3d011682016040523d82523d6000602084013e611bd3565b606091505b509150915060008215611bf75781806020019051810190611bf491906191b3565b90505b80868581518110611c0457fe5b602002602001018181525050858481518110611c1c57fe5b602002602001015160001415611c345750505061189e565b505050600101611b09565b80516060908190806001600160401b0381118015611c5c57600080fd5b50604051908082528060200260200182016040528015611c86578160200160208202803683370190505b509150611c938686615ae5565b9250825160001415611ca55750610928565b60005b8181101561092557866001600160a01b0316639e269b68620249f0878481518110611ccf57fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401611cf79392919061a297565b60006040518083038187803b158015611d0f57600080fd5b5086fa93505050508015611d4557506040513d6000823e601f3d908101601f19168201604052611d429190810190619165565b60015b611d73573d8080156108be576040519150601f19603f3d011682016040523d82523d6000602084013e6108c3565b80600081518110611d8057fe5b6020026020010151848381518110611d9457fe5b602002602001018181525050838281518110611dac57fe5b602002602001015160001415611dc25750610925565b50600101611ca8565b60208481015160408051600180825281830190925260609384929082810190803683370190505090508581600081518110611e0257fe5b602090810291909101015260606000604051908082528060200260200182016040528015611e3a578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b03161415611f2b576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a12090611e9390899060019088908890600401619c30565b60006040518083038187803b158015611eab57600080fd5b5086fa93505050508015611ee157506040513d6000823e601f3d908101601f19168201604052611ede91908101906191cb565b60015b611f1b573d808015611f0f576040519150601f19603f3d011682016040523d82523d6000602084013e611f14565b606091505b5050611f26565b935061125792505050565b61203d565b87606001516001600160a01b0316856001600160a01b03161415611f81576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a12090611e93908a9060019088908890600401619c30565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a12090611fc1908a90600190889088908d90849084908490600401619c73565b60006040518083038187803b158015611fd957600080fd5b5086fa9350505050801561200f57506040513d6000823e601f3d908101601f1916820160405261200c91908101906191cb565b60015b611f1b573d808015610e27576040519150601f19603f3d011682016040523d82523d6000602084013e610e27565b505050949350505050565b60608060606120c9866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561208957600080fd5b505afa15801561209d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120c19190618959565b866000616989565b905083516001600160401b03811180156120e257600080fd5b5060405190808252806020026020018201604052801561210c578160200160208202803683370190505b50915083516001600160401b038111801561212657600080fd5b5060405190808252806020026020018201604052801561215a57816020015b60608152602001906001900390816121455790505b50925060005b84518110156109255760606000805b845181101561224b5760606121978a87848151811061218a57fe5b6020026020010151616e1f565b90508a6001600160a01b031663cdca1753620493e0838c89815181106121b957fe5b60200260200101516040518463ffffffff1660e01b81526004016121de929190619ed1565b602060405180830381600088803b1580156121f857600080fd5b5087f193505050508015612229575060408051601f3d908101601f19168201909252612226918101906191b3565b60015b61223257612242565b808411612240578093508194505b505b5060010161216f565b5080612258575050610925565b8085848151811061226557fe5b6020026020010181815250508186848151811061227e57fe5b60209081029190910101525050600101612160565b80516060908590806001600160401b03811180156122b057600080fd5b506040519080825280602002602001820160405280156122da578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b6249061230a908990600401619a69565b60206040518083038186803b15801561232257600080fd5b505afa158015612336573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061235a9190619197565b15806123df5750604051630bcded8960e21b81526001600160a01b03831690632f37b6249061238d908890600401619a69565b60206040518083038186803b1580156123a557600080fd5b505afa1580156123b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123dd9190619197565b155b156123eb575050611257565b6123f36181a8565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f9061241f908a90600401619a69565b60206040518083038186803b15801561243757600080fd5b505afa15801561244b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061246f91906191b3565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f9061249d908990600401619a69565b60206040518083038186803b1580156124b557600080fd5b505afa1580156124c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124ed91906191b3565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce69061251e908a90600401619a69565b60206040518083038186803b15801561253657600080fd5b505afa15801561254a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061256e91906191b3565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce6906125a1908990600401619a69565b60206040518083038186803b1580156125b957600080fd5b505afa1580156125cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125f191906191b3565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b15801561263357600080fd5b505afa158015612647573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061266b91906191b3565b608082015260005b82811015610ffe5761269e82602001516003670de0b6b3a76400008161269557fe5b04600101616f7a565b8682815181106126aa57fe5b602002602001015111156126bd57610ffe565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c88815181106126f057fe5b602002602001015189608001516040518863ffffffff1660e01b815260040161271e9695949392919061a2c2565b60206040518083038187803b15801561273657600080fd5b5086fa93505050508015612767575060408051601f3d908101601f19168201909252612764918101906191b3565b60015b6127a1573d808015612795576040519150601f19603f3d011682016040523d82523d6000602084013e61279a565b606091505b5050610ffe565b808683815181106127ae57fe5b6020026020010181815250508582815181106127c657fe5b6020026020010151600014156127dc5750610ffe565b50600101612673565b6060806060612826866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561208957600080fd5b9050606061283386616fd7565b905084516001600160401b038111801561284c57600080fd5b50604051908082528060200260200182016040528015612876578160200160208202803683370190505b50925084516001600160401b038111801561289057600080fd5b506040519080825280602002602001820160405280156128c457816020015b60608152602001906001900390816128af5790505b50935060005b8551811015612a1f5760606000805b85518110156129d7576060612909866129048985815181106128f757fe5b602002602001015161706f565b616e1f565b90508b6001600160a01b0316632f80bb1d620493e0838d898151811061292b57fe5b60200260200101516040518463ffffffff1660e01b8152600401612950929190619ed1565b602060405180830381600088803b15801561296a57600080fd5b5087f19350505050801561299b575060408051601f3d908101601f19168201909252612998918101906191b3565b60015b6129a4576129ce565b8315806129b15750808410155b156129cc578093506129c98c89858151811061218a57fe5b94505b505b506001016128d9565b50806129e4575050612a1f565b808684815181106129f157fe5b60200260200101818152505081878481518110612a0a57fe5b602090810291909101015250506001016128ca565b505050935093915050565b6040805160608181019092526112c59080612a49868960808401619a96565b60405160208183030381529060405281526020018688604051602001612a70929190619a96565b604051602081830303815290604052815260200161710781525083616653565b6060612a9d848484610930565b905060005b8451811015610a9b57818181518110612ab757fe5b6020026020010151600014612b3d57612b24828281518110612ad557fe5b6020026020010151868381518110612ae957fe5b6020026020010151606001516001600160801b0316878481518110612b0a57fe5b6020026020010151604001516001600160801b031661721b565b828281518110612b3057fe5b6020026020010181815250505b600101612aa2565b6060816001600160401b0381118015612b5d57600080fd5b50604051908082528060200260200182016040528015612b9757816020015b612b846181d7565b815260200190600190039081612b7c5790505b50905060005b808314612c9f576001828281518110612bb257fe5b602090810291909101810151911515910152838382818110612bd057fe5b9050602002810190612be2919061a2ea565b15159050612bef57612c97565b30848483818110612bfc57fe5b9050602002810190612c0e919061a2ea565b604051612c1c929190619a3d565b6000604051808303816000865af19150503d8060008114612c59576040519150601f19603f3d011682016040523d82523d6000602084013e612c5e565b606091505b50838381518110612c6b57fe5b6020026020010151602001848481518110612c8257fe5b60209081029190910101519190915290151590525b600101612b9d565b5092915050565b606081516001600160401b0381118015612cbf57600080fd5b50604051908082528060200260200182016040528015612ce9578160200160208202803683370190505b50905060005b82518114612d92577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316838281518110612d2d57fe5b60200260200101516001600160a01b031614612d6d57612d68838281518110612d5257fe5b60200260200101516001600160a01b031661723f565b612d70565b60125b60ff16828281518110612d7f57fe5b6020908102919091010152600101612cef565b50919050565b60006060809450945094915050565b6060612db38385616006565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b158015612df757600080fd5b505afa158015612e0b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612e2f9190618959565b8451909150806001600160401b0381118015612e4a57600080fd5b50604051908082528060200260200182016040528015612e74578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015612eb057600080fd5b505afa158015612ec4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ee89190618959565b6001600160a01b0316866001600160a01b031614158015612f8b5750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015612f3d57600080fd5b505afa158015612f51573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f759190618959565b6001600160a01b0316876001600160a01b031614155b15612f9857505050611257565b60005b81811015610ffe576000612fc68a898b8a8681518110612fb757fe5b602002602001015189896172eb565b905080612fd35750610ffe565b80868381518110612fe057fe5b602090810291909101015250600101612f9b565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b815260040161302b9190619e9c565b60206040518083038186803b15801561304357600080fd5b505afa158015613057573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061307b91906191b3565b8651604051631e01043960e01b81526001600160a01b0390911690631e010439906130ae90600f89900b90600401619e9c565b60206040518083038186803b1580156130c657600080fd5b505afa1580156130da573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130fe91906191b3565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b81526004016131369190619e9c565b60806040518083038186803b15801561314e57600080fd5b505afa158015613162573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061318691906196e3565b935050505080601203600a0a828161319a57fe5b85519190049250806001600160401b03811180156131b757600080fd5b506040519080825280602002602001820160405280156131e1578160200160208202803683370190505b50935060005b81811015610ffe57600060608a600001516001600160a01b0316620927c08c602001518c8c8c888151811061321857fe5b60200260200101516040516024016132329392919061a018565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516132709190619a4d565b6000604051808303818686fa925050503d80600081146132ac576040519150601f19603f3d011682016040523d82523d6000602084013e6132b1565b606091505b5091509150600082156132d557818060200190518101906132d291906191b3565b90505b86811061330f57835b8581101561330657878982815181106132f357fe5b60209081029190910101526001016132de565b50505050610ffe565b8088858151811061331c57fe5b60200260200101818152505087848151811061333457fe5b60200260200101516000141561334c57505050610ffe565b5050506001016131e7565b61335f6181ef565b6133676181ef565b600080805b8751811461346c576133b3602089838151811061338557fe5b60200260200101515103878a848151811061339c57fe5b602002602001015161757d9092919063ffffffff16565b60006060306001600160a01b03168a84815181106133cd57fe5b60200260200101516040516133e29190619a4d565b6000604051808303816000865af19150503d806000811461341f576040519150601f19603f3d011682016040523d82523d6000602084013e613424565b606091505b5091509150811561346257600061344860208351038361758d90919063ffffffff16565b90508481111561346057838852602088018290529350835b505b505060010161336c565b50806134785750613567565b60005b86518114613564576134ab602088838151811061349457fe5b602002602001015151038389848151811061339c57fe5b60006060306001600160a01b03168984815181106134c557fe5b60200260200101516040516134da9190619a4d565b6000604051808303816000865af19150503d8060008114613517576040519150601f19603f3d011682016040523d82523d6000602084013e61351c565b606091505b5091509150811561355a57600061354060208351038361758d90919063ffffffff16565b90508581111561355857838752602087018290529450845b505b505060010161347b565b50505b93509350939050565b60408401516060906001600160e01b0319166135f25760408051606081019091526135eb90806135a486896080840161a036565b604051602081830303815290604052815260200186886040516020016135cb92919061a036565b604051602081830303815290604052815260200161759981525083616653565b9050611257565b8151806001600160401b038111801561360a57600080fd5b50604051908082528060200260200182016040528015613634578160200160208202803683370190505b50915060005b8181101561189e576000606088600001516001600160a01b0316621e84808a604001518a8a8a888151811061366b57fe5b60200260200101516040516024016136859392919061a018565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516136c39190619a4d565b6000604051808303818686fa925050503d80600081146136ff576040519150601f19603f3d011682016040523d82523d6000602084013e613704565b606091505b509150915060008215613728578180602001905181019061372591906191b3565b90505b8086858151811061373557fe5b60200260200101818152505085848151811061374d57fe5b6020026020010151600014156137655750505061189e565b50505060010161363a565b80516060908590806001600160401b038111801561378d57600080fd5b506040519080825280602002602001820160405280156137b7578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b624906137e7908990600401619a69565b60206040518083038186803b1580156137ff57600080fd5b505afa158015613813573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906138379190619197565b15806138bc5750604051630bcded8960e21b81526001600160a01b03831690632f37b6249061386a908890600401619a69565b60206040518083038186803b15801561388257600080fd5b505afa158015613896573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906138ba9190619197565b155b156138c8575050611257565b6138d06181a8565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906138fc908a90600401619a69565b60206040518083038186803b15801561391457600080fd5b505afa158015613928573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061394c91906191b3565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f9061397a908990600401619a69565b60206040518083038186803b15801561399257600080fd5b505afa1580156139a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906139ca91906191b3565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce6906139fb908a90600401619a69565b60206040518083038186803b158015613a1357600080fd5b505afa158015613a27573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613a4b91906191b3565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690613a7e908990600401619a69565b60206040518083038186803b158015613a9657600080fd5b505afa158015613aaa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613ace91906191b3565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015613b1057600080fd5b505afa158015613b24573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613b4891906191b3565b608082015260005b82811015610ffe578151613b6c906706f05b59d3b20000616f7a565b868281518110613b7857fe5b60200260200101511115613b8b57610ffe565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c8881518110613bbe57fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401613bec9695949392919061a2c2565b60206040518083038187803b158015613c0457600080fd5b5086fa93505050508015613c35575060408051601f3d908101601f19168201909252613c32918101906191b3565b60015b613c63573d808015612795576040519150601f19603f3d011682016040523d82523d6000602084013e61279a565b80868381518110613c7057fe5b602002602001018181525050858281518110613c8857fe5b602002602001015160001415613c9e5750610ffe565b50600101613b50565b60008083516003811115613cb757fe5b1480613ccf5750600183516003811115613ccd57fe5b145b80613ce5575060408401516001600160801b0316155b80613cfb575060608401516001600160801b0316155b15613d0857506000613de7565b613d10618209565b600080846001600160a01b0316631fb0979588886040518363ffffffff1660e01b8152600401613d4192919061a22a565b60a06040518083038186803b158015613d5957600080fd5b505afa158015613d6d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613d919190619621565b91945092509050600183602001516004811115613daa57fe5b141580613db5575080155b80613dc8575086516001600160a01b0316155b15613dd95760009350505050613de7565b506001600160801b03169150505b9392505050565b6000606080613dfd8587616006565b613e088787876175ed565b925082613e1457610bf9565b60405163276fdad960e11b81523090634edfb5b290613e3d908a9087908b908b9060040161a1f1565b60006040518083038186803b158015613e5557600080fd5b505afa158015613e69573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052613e9191908101906191cb565b876080018190525086608001519150613f086040518060600160405280878a604051602001613ec1929190619d0a565b6040516020818303038152906040528152602001888a604051602001613ee8929190619d0a565b604051602081830303815290604052815260200161775481525085616653565b90509450945094915050565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b8152600401613f45929190619a96565b60206040518083038186803b158015613f5d57600080fd5b505afa158015613f71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f959190618959565b90506001600160a01b038116613faf576000915050611257565b60006001600160a01b03861615614041576040516370a0823160e01b81526001600160a01b038716906370a0823190613fec908590600401619a69565b60206040518083038186803b15801561400457600080fd5b505afa158015614018573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061403c91906191b3565b61404d565b816001600160a01b0316315b90508381101561406257600092505050611257565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f090614097908a908a908a90600401619b91565b60206040518083038187803b1580156140af57600080fd5b5086fa935050505080156140e0575060408051601f3d908101601f191682019092526140dd918101906191b3565b60015b614120573d80801561410e576040519150601f19603f3d011682016040523d82523d6000602084013e614113565b606091505b5060009350505050611257565b9250611257915050565b60606141368385616006565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061416c57fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061419a57fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b03811180156141ca57600080fd5b506040519080825280602002602001820160405280156141f4578160200160208202803683370190505b5093506141ff618181565b61420761603c565b905060005b82811015610e275760606142268b898481518110610d0957fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e9061425c9060019085908a908990600401619f5f565b600060405180830381600087803b15801561427657600080fd5b505af19250505080156142ab57506040513d6000823e601f3d908101601f191682016040526142a89190810190619013565b60015b6142d9573d808015610dc9576040519150601f19603f3d011682016040523d82523d6000602084013e610dce565b6000816000815181106142e857fe5b602002602001015190506000811361430257505050610e27565b8089858151811061430f57fe5b60200260200101818152505050505060010161420c565b8051606090806001600160401b038111801561434157600080fd5b5060405190808252806020026020018201604052801561436b578160200160208202803683370190505b50915060005b8181101561189e57866001600160a01b031663343fbcdd62061a80888888868151811061439a57fe5b60200260200101516040518563ffffffff1660e01b81526004016143c093929190619b91565b60206040518083038187803b1580156143d857600080fd5b5086fa93505050508015614409575060408051601f3d908101601f19168201909252614406918101906191b3565b60015b614437573d80801561184e576040519150601f19603f3d011682016040523d82523d6000602084013e611853565b8084838151811061444457fe5b60200260200101818152505083828151811061445c57fe5b602002602001015160001415614472575061189e565b50600101614371565b600080606061448a8587616006565b8351806001600160401b03811180156144a257600080fd5b506040519080825280602002602001820160405280156144cc578160200160208202803683370190505b5091506144db8989898961783b565b945092506001600160a01b0383166144f357506145ad565b60005b818110156145aa57600061456489868860405160200161451893929190619b39565b60405160208183030381529060405289878960405160200161453c93929190619b39565b60405160208183030381529060405289858151811061455757fe5b6020026020010151617990565b90508084838151811061457357fe5b60200260200101818152505083828151811061458b57fe5b6020026020010151600014156145a157506145aa565b506001016144f6565b50505b955095509592505050565b60606145c48385616006565b8151806001600160401b03811180156145dc57600080fd5b50604051908082528060200260200182016040528015614606578160200160208202803683370190505b50915060005b8181101561189e57866001600160a01b031663144a2752620f4240878988868151811061463557fe5b60200260200101516040518563ffffffff1660e01b815260040161465b93929190619b91565b60206040518083038187803b15801561467357600080fd5b5086fa935050505080156146a4575060408051601f3d908101601f191682019092526146a1918101906191b3565b60015b6146d2573d80801561184e576040519150601f19603f3d011682016040523d82523d6000602084013e611853565b808483815181106146df57fe5b6020026020010181815250508382815181106146f757fe5b60200260200101516000141561470d575061189e565b5060010161460c565b600060606147248486616006565b8251806001600160401b038111801561473c57600080fd5b50604051908082528060200260200182016040528015614766578160200160208202803683370190505b50915060005b818110156147db57600061479589898989868151811061478857fe5b6020026020010151613f14565b9050808483815181106147a457fe5b6020026020010181815250508382815181106147bc57fe5b6020026020010151600014156147d257506147db565b5060010161476c565b5060405163901754d760e01b81526001600160a01b0388169063901754d79061480a9089908990600401619a96565b60206040518083038186803b15801561482257600080fd5b505afa158015614836573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061485a9190618959565b92505094509492505050565b6040805160608181019092526112c59080614885868960808401619a96565b604051602081830303815290604052815260200186886040516020016148ac929190619a96565b6040516020818303038152906040528152602001617a8281525083616653565b606082516001600160401b03811180156148e557600080fd5b5060405190808252806020026020018201604052801561490f578160200160208202803683370190505b50905060005b83518114612c9f577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031684828151811061495357fe5b60200260200101516001600160a01b03161461499d576149988385838151811061497957fe5b60200260200101516001600160a01b0316617ac990919063ffffffff16565b6149a9565b826001600160a01b0316315b8282815181106149b557fe5b6020908102919091010152600101614915565b6040805160608181019092526112c590806149e7868960808401619a96565b60405160208183030381529060405281526020018688604051602001614a0e929190619a96565b6040516020818303038152906040528152602001617b9381525083616653565b6060614a3a8385616006565b8151806001600160401b0381118015614a5257600080fd5b50604051908082528060200260200182016040528015614a7c578160200160208202803683370190505b50915060006001600160a01b03861615614a9f57614a9a87876160fd565b614aa2565b60005b905060006001600160a01b03861615614ac457614abf88876160fd565b614ac7565b60005b905060005b83811015610ffe5760016001600160a01b038816614b1d57614afc846395b68fe760e01b898581518110610f0257fe5b878481518110614b0857fe5b60200260200101819350828152505050614bb7565b6001600160a01b038916614b4357614afc8363cd7724c360e01b898581518110610f0257fe5b6000614b5d856395b68fe760e01b8a8681518110610f0257fe5b925090508015614b9a57614b798463cd7724c360e01b8361617c565b888581518110614b8557fe5b60200260200101819450828152505050614bb5565b6000878481518110614ba857fe5b6020026020010181815250505b505b801580614bd75750858281518110614bcb57fe5b60200260200101516000145b15614be25750610ffe565b50600101614acc565b8051606090806001600160401b0381118015614c0657600080fd5b50604051908082528060200260200182016040528015614c30578160200160208202803683370190505b50915060005b81811015611a2357856001600160a01b0316631f00ca74620249f0868481518110614c5d57fe5b6020026020010151886040518463ffffffff1660e01b8152600401614c8392919061a27e565b60006040518083038187803b158015614c9b57600080fd5b5086fa93505050508015614cd157506040513d6000823e601f3d908101601f19168201604052614cce9190810190619165565b60015b614cff573d8080156119bc576040519150601f19603f3d011682016040523d82523d6000602084013e6119c1565b80600081518110614d0c57fe5b6020026020010151848381518110614d2057fe5b602002602001018181525050838281518110614d3857fe5b602002602001015160001415614d4e5750611a23565b50600101614c36565b6060614d638385616006565b8151806001600160401b0381118015614d7b57600080fd5b50604051908082528060200260200182016040528015614da5578160200160208202803683370190505b50915060005b8181101561189e57866001600160a01b031663ff1fd974620f42408888888681518110614dd457fe5b60200260200101516040518563ffffffff1660e01b8152600401614dfa93929190619b91565b60206040518083038187803b158015614e1257600080fd5b5086fa93505050508015614e43575060408051601f3d908101601f19168201909252614e40918101906191b3565b60015b614e71573d80801561184e576040519150601f19603f3d011682016040523d82523d6000602084013e611853565b80848381518110614e7e57fe5b602002602001018181525050838281518110614e9657fe5b602002602001015160001415614eac575061189e565b50600101614dab565b6000606080614ec48587616006565b614ecf8787876175ed565b925082614edb57610bf9565b60405163276fdad960e11b81523090634edfb5b290614f04908a9087908b908b9060040161a1f1565b60006040518083038186803b158015614f1c57600080fd5b505afa158015614f30573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052614f5891908101906191cb565b608088018190528451909250806001600160401b0381118015614f7a57600080fd5b50604051908082528060200260200182016040528015614fa4578160200160208202803683370190505b50915060005b8181101561508f576000306001600160a01b031663f1ed7fa48b8b8b8b8781518110614fd257fe5b60200260200101516040518563ffffffff1660e01b8152600401614ff9949392919061a1bb565b60206040518083038186803b15801561501157600080fd5b505afa158015615025573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061504991906191b3565b90508084838151811061505857fe5b60200260200101818152505083828151811061507057fe5b602002602001015160001415615086575061508f565b50600101614faa565b50509450945094915050565b60008060606150aa8587616006565b6150b68888888861783b565b935091506001600160a01b0382166150cd576145ad565b8351806001600160401b03811180156150e557600080fd5b5060405190808252806020026020018201604052801561510f578160200160208202803683370190505b50604080516060810190915290925061517c90806151338987891560808501619b39565b604051602081830303815290604052815260200189868860405160200161515c93929190619b39565b604051602081830303815290604052815260200161799081525086616653565b915050955095509592505050565b60008060606151998587616006565b8351806001600160401b03811180156151b157600080fd5b506040519080825280602002602001820160405280156151db578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c69061520e908a908a90600401619a96565b60206040518083038186803b15801561522657600080fd5b505afa15801561523a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061525e9190618959565b925060006001600160a01b0384161561527c5750600193508661531b565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c6906152ad908a908c90600401619a96565b60206040518083038186803b1580156152c557600080fd5b505afa1580156152d9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906152fd9190618959565b93506001600160a01b038416615314575050610bf9565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561535457600080fd5b505afa158015615368573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061538c9190619197565b615397575050610bf9565b61540f60405180606001604052808987858e602001516040516020016153c09493929190619ab0565b60405160208183030381529060405281526020018a87858e602001516040516020016153ef9493929190619ab0565b604051602081830303815290604052815260200161685081525087616653565b925050509450945094915050565b606083516001600160401b038111801561543657600080fd5b50604051908082528060200260200182016040528015615460578160200160208202803683370190505b50905060005b84518114610a9b577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168582815181106154a457fe5b60200260200101516001600160a01b0316146154f0576154eb84848784815181106154cb57fe5b60200260200101516001600160a01b0316617c489092919063ffffffff16565b6154f3565b60005b8282815181106154ff57fe5b6020908102919091010152600101615466565b8051606090806001600160401b038111801561552d57600080fd5b50604051908082528060200260200182016040528015615557578160200160208202803683370190505b50915060005b8181101561189e57866001600160a01b031663838e6a22620493e0888888868151811061558657fe5b60200260200101516040518563ffffffff1660e01b81526004016155ac93929190619b91565b60206040518083038187803b1580156155c457600080fd5b5086fa935050505080156155f5575060408051601f3d908101601f191682019092526155f2918101906191b3565b60015b615623573d80801561184e576040519150601f19603f3d011682016040523d82523d6000602084013e611853565b8084838151811061563057fe5b6020026020010181815250505060010161555d565b60008460800151516000141561565d57506000611257565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b03161461569757866156ad565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b0316146156d057866156e6565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b815260040161570e959493929190619bb5565b60206040518083038187803b15801561572657600080fd5b5086fa93505050508015615757575060408051601f3d908101601f19168201909252615754918101906191b3565b60015b615795573d808015615785576040519150601f19603f3d011682016040523d82523d6000602084013e61578a565b606091505b506000915050611257565b60006157a085617d14565b60ff16905060006157b087617d14565b60ff169050670de0b6b3a764000081600a0a83600a0a87860202816157d157fe5b04816157d957fe5b049350505050611257565b600060606157f28486616006565b8251806001600160401b038111801561580a57600080fd5b50604051908082528060200260200182016040528015615834578160200160208202803683370190505b50915061589f60405180606001604052808988604051602001615858929190619a96565b6040516020818303038152906040528152602001898960405160200161587f929190619a96565b6040516020818303038152906040528152602001617d1f81525085616653565b60405163901754d760e01b81529092506001600160a01b0388169063901754d79061480a9089908990600401619a96565b6158d86181ef565b6158e06181ef565b6000198060005b865181146159dc57615917602088838151811061590057fe5b602002602001015151038789848151811061339c57fe5b60006060306001600160a01b031689848151811061593157fe5b60200260200101516040516159469190619a4d565b6000604051808303816000865af19150503d8060008114615983576040519150601f19603f3d011682016040523d82523d6000602084013e615988565b606091505b509150915081156159d25760006159ac60208351038361758d90919063ffffffff16565b90506000811180156159bd57508481105b156159d057838752602087018290529350835b505b50506001016158e7565b506000198114156159ed5750613567565b60005b8751811461356457615a206020898381518110615a0957fe5b60200260200101515103838a848151811061339c57fe5b60006060306001600160a01b03168a8481518110615a3a57fe5b6020026020010151604051615a4f9190619a4d565b6000604051808303816000865af19150503d8060008114615a8c576040519150601f19603f3d011682016040523d82523d6000602084013e615a91565b606091505b50915091508115615adb576000615ab560208351038361758d90919063ffffffff16565b9050600081118015615ac657508581105b15615ad957838852602088018290529450845b505b50506001016159f0565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b158015615b2257600080fd5b505afa158015615b36573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615b5a9190618959565b905060018351036001600160401b0381118015615b7657600080fd5b50604051908082528060200260200182016040528015615ba0578160200160208202803683370190505b50915060005b8251811015615dcb576060826001600160a01b0316635b1dc86f620249f0878581518110615bd057fe5b6020026020010151888660010181518110615be757fe5b60200260200101516040518463ffffffff1660e01b8152600401615c0c929190619a96565b60006040518083038187803b158015615c2457600080fd5b5086fa93505050508015615c5a57506040513d6000823e601f3d908101601f19168201604052615c579190810190618d0e565b60015b615ca9573d808015615c88576040519150601f19603f3d011682016040523d82523d6000602084013e615c8d565b606091505b50506040805160008152602081019091529350615dce92505050565b6000600182511015615cd65760405162461bcd60e51b8152600401615ccd9061a11c565b60405180910390fd5b60005b8251811015615dbf576000838281518110615cf057fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015615d3057600080fd5b505afa158015615d44573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615d6891906191b3565b905082811115615db657809250838281518110615d8157fe5b6020026020010151888781518110615d9557fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101615cd9565b50505050600101615ba6565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b158015615e2857600080fd5b505afa158015615e3c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615e6091906191b3565b6040518263ffffffff1660e01b8152600401615e7c9190619e9c565b60206040518083038186803b158015615e9457600080fd5b505afa158015615ea8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615ecc9190618959565b915085602001515160001415615ee157615ffd565b6000805b876020015151811015615ffa57600288602001518281518110615f0457fe5b6020026020010151511015615f1857615ff2565b836001600160a01b0316637f9c0ecd620493e08a602001518481518110615f3b57fe5b60200260200101518860018a510381518110615f5357fe5b60200260200101516040518463ffffffff1660e01b8152600401615f78929190619d53565b60206040518083038187803b158015615f9057600080fd5b5086fa93505050508015615fc1575060408051601f3d908101601f19168201909252615fbe918101906191b3565b60015b615fca57615ff2565b82811115615ff05780925088602001518281518110615fe557fe5b602002602001015193505b505b600101615ee5565b50505b94509492505050565b806001600160a01b0316826001600160a01b031614156160385760405162461bcd60e51b8152600401615ccd9061a092565b5050565b616044618181565b50604080516080810182523080825260006020830181905292820152606081019190915290565b604080516001808252818301909252606091829190816020015b61608d61822b565b8152602001906001900390816160855790505090506040518060a0016040528085600001518152602001600081526020016001815260200184815260200160405180602001604052806000815250815250816000815181106160eb57fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf629061612c908590600401619a69565b60206040518083038186803b15801561614457600080fd5b505afa158015616158573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613de79190618959565b6000806001600160a01b03851661619257610928565b6060856001600160a01b0316620249f086866040516024016161b49190619e9c565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516161f29190619a4d565b6000604051808303818686fa925050503d806000811461622e576040519150601f19603f3d011682016040523d82523d6000602084013e616233565b606091505b5090925090508115616256578080602001905181019061625391906191b3565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b81526004016162959190619e9c565b60a06040518083038186803b1580156162ad57600080fd5b505afa1580156162c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906162e59190619718565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b0316141561640d5760006163248964e8d4a51000617d6f565b905060006163486b033b2e3c9fd0803ce80000006163428885617da5565b90617d6f565b90508481106163605760009650505050505050616516565b60006163ef670de0b6b3a76400006163e98c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156163aa57600080fd5b505afa1580156163be573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906163e291906191b3565b8690617d6f565b90617dc1565b905060006163fd8483617deb565b9850616516975050505050505050565b8a604001516001600160a01b03168a6001600160a01b0316141561650d57878481111561644257600095505050505050616516565b600061645e6b033b2e3c9fd0803ce80000006163428885617deb565b90508381116164765760009650505050505050616516565b60006164fb8a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156164b457600080fd5b505afa1580156164c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906164ec91906191b3565b670de0b6b3a764000090617da5565b905060006163fd826163e98688617d6f565b60009450505050505b9695505050505050565b60008061652b61825d565b8580602001905181019061653f919061925f565b915091506000858060200190518101906165599190619243565b905060006060306322db5ed160e21b8587866165748c617e0a565b604051602401616587949392919061a153565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516165c59190619a4d565b600060405180830381855afa9150503d8060008114616600576040519150601f19603f3d011682016040523d82523d6000602084013e616605565b606091505b50915091508161661d57600095505050505050613de7565b808060200190518101906166319190619165565b60008151811061663d57fe5b6020026020010151955050505050509392505050565b606081516001600160401b038111801561666c57600080fd5b50604051908082528060200260200182016040528015616696578160200160208202803683370190505b5090508151600014156166a857615dce565b60006166d984600001518560200151856000815181106166c457fe5b6020026020010151876040015163ffffffff16565b9050806166e65750615dce565b60006167038560200151866000015184886040015163ffffffff16565b905080616711575050615dce565b60005b84518110156168475760005b60058110156168095761674786838151811061673857fe5b60200260200101518486617e4b565b93508361675357616809565b61676261271561271086617e4b565b93508361676e57616809565b600061678b88602001518960000151878b6040015163ffffffff16565b9050806167985750616809565b8093508683815181106167a757fe5b602002602001015184106168005760008784815181106167c357fe5b60200260200101516127108986815181106167da57fe5b6020026020010151870302816167ec57fe5b049050600581116167fe575050616809565b505b50600101616720565b5061682885828151811061681957fe5b60200260200101518385617e4b565b84828151811061683457fe5b6020908102919091010152600101616714565b50505092915050565b60008060008060008780602001905181019061686c91906189ae565b9350935093509350816001600160a01b0316846001600160a01b03161415616956576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e0906168bf908a90600401619e9c565b60206040518083038187803b1580156168d757600080fd5b5086fa93505050508015616908575060408051601f3d908101601f19168201909252616905918101906191b3565b60015b61694a573d808015616936576040519150601f19603f3d011682016040523d82523d6000602084013e61693b565b606091505b50600095505050505050613de7565b9450613de79350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e0906168bf9087908b90600401619a7d565b606060028284510310156169af5760405162461bcd60e51b8152600401615ccd9061a04e565b6169b761827d565b5060408051606080820183526101f48252610bb860208301526127108284015282516003808252608082019094529192909190816020016020820280368337019050509050600080868681518110616a0b57fe5b602002602001015190506000878760010181518110616a2657fe5b6020026020010151905060005b6003811015616b1b5760008a6001600160a01b0316631698ee8285858a8660038110616a5b57fe5b60200201516040518463ffffffff1660e01b8152600401616a7e93929190619ee4565b60206040518083038186803b158015616a9657600080fd5b505afa158015616aaa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616ace9190618959565b9050616ad981617ea3565b15616b125780868680600101975081518110616af157fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616a33565b50505080616b2b57505050613de7565b8551856002011415616c2157806001600160401b0381118015616b4d57600080fd5b50604051908082528060200260200182016040528015616b8157816020015b6060815260200190600190039081616b6c5790505b50935060005b81811015616c1857604080516001808252818301909252906020808301908036833701905050858281518110616bb957fe5b6020026020010181905250828181518110616bd057fe5b6020026020010151858281518110616be457fe5b6020026020010151600081518110616bf857fe5b6001600160a01b0390921660209283029190910190910152600101616b87565b50505050613de7565b6060616c31888888600101616989565b9050805160001415616c465750505050613de7565b805182026001600160401b0381118015616c5f57600080fd5b50604051908082528060200260200182016040528015616c9357816020015b6060815260200190600190039081616c7e5790505b50945060005b82811015616e135760005b8251811015616e0a578251828102820190849083908110616cc157fe5b6020026020010151516001016001600160401b0381118015616ce257600080fd5b50604051908082528060200260200182016040528015616d0c578160200160208202803683370190505b50888281518110616d1957fe5b6020026020010181905250858381518110616d3057fe5b6020026020010151888281518110616d4457fe5b6020026020010151600081518110616d5857fe5b60200260200101906001600160a01b031690816001600160a01b03168152505060005b848381518110616d8757fe5b602002602001015151811015616e0057848381518110616da357fe5b60200260200101518181518110616db657fe5b6020026020010151898381518110616dca57fe5b60200260200101518260010181518110616de057fe5b6001600160a01b0390921660209283029190910190910152600101616d7b565b5050600101616ca4565b50600101616c99565b50505050509392505050565b60606002835110158015616e37575081516001018351145b616e535760405162461bcd60e51b8152600401615ccd9061a0d7565b81516003028351601402016001600160401b0381118015616e7357600080fd5b506040519080825280601f01601f191660200182016040528015616e9e576020820181803683370190505b5090506020810160005b8451811015615dcb578015616f4d576000846001830381518110616ec857fe5b60200260200101516001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b158015616f0857600080fd5b505afa158015616f1c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616f40919061969d565b60e81b8352506003909101905b6000858281518110616f5b57fe5b602090810291909101015160601b835250601490910190600101616ea8565b60008282028315801590616f97575082848281616f9357fe5b0414155b15616fa6576000915050615dce565b6706f05b59d3b20000810181811015616fc457600092505050615dce565b670de0b6b3a76400009004949350505050565b606081516001600160401b0381118015616ff057600080fd5b5060405190808252806020026020018201604052801561701a578160200160208202803683370190505b50905060005b8251811015612d925782600182855103038151811061703b57fe5b602002602001015182828151811061704f57fe5b6001600160a01b0390921660209283029190910190910152600101617020565b606081516001600160401b038111801561708857600080fd5b506040519080825280602002602001820160405280156170b2578160200160208202803683370190505b50905060005b8251811015612d92578260018285510303815181106170d357fe5b60200260200101518282815181106170e757fe5b6001600160a01b03909216602092830291909101909101526001016170b8565b6000806000858060200190518101906171209190618975565b9150915060008580602001905181019061713a9190618959565b90503063e8e4af0983858461714e8a617e0a565b6040518563ffffffff1660e01b815260040161716d9493929190619adb565b60006040518083038186803b15801561718557600080fd5b505afa9250505080156171ba57506040513d6000823e601f3d908101601f191682016040526171b79190810190619165565b60015b6171fb573d8080156171e8576040519150601f19603f3d011682016040523d82523d6000602084013e6171ed565b606091505b506000945050505050613de7565b8060008151811061720857fe5b6020026020010151945050505050613de7565b6000611257836163e961722f826001617deb565b6172398887617d6f565b90617da5565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b81525060405161727d9190619a4d565b600060405180830381855afa9150503d80600081146172b8576040519150601f19603f3d011682016040523d82523d6000602084013e6172bd565b606091505b50915091508180156172d157506020815110155b156172e4576172e181600061758d565b92505b5050919050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b81526004016173219190619e9c565b60a06040518083038186803b15801561733957600080fd5b505afa15801561734d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906173719190619718565b945094505050925089604001516001600160a01b0316886001600160a01b031614156174885760008790506000617421886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156173da57600080fd5b505afa1580156173ee573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061741291906191b3565b670de0b6b3a764000090617deb565b9050600061743b826163e985670de0b6b3a7640000617d6f565b905060006174596b033b2e3c9fd0803ce80000006163428985617da5565b9050858110617472576000975050505050505050616516565b60006163fd60016172398564e8d4a51000617dc1565b89604001516001600160a01b0316896001600160a01b0316141561756d5760006174b78864e8d4a51000617d6f565b905060006174f7886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b1580156164b457600080fd5b90506000617511670de0b6b3a76400006163e98585617d6f565b90508581111561752a5760009650505050505050616516565b60006175466b033b2e3c9fd0803ce80000006163428985617deb565b905084811161755f576000975050505050505050616516565b509550616516945050505050565b5060009998505050505050505050565b6175888383836180af565b505050565b6000613de783836180d6565b6000806175a461825d565b858060200190518101906175b8919061925f565b915091506000858060200190518101906175d29190619243565b9050600060603063205e01d760e11b8587866165748c617e0a565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b03161461762b5786617641565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b031614617664578661767a565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b169091526176ae92919060019060248101619b5d565b60006040518083038186803b1580156176c657600080fd5b505afa1580156176da573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526177029190810190618da6565b50509050805186600001511061771e575060009150613de79050565b8086600001518151811061772e57fe5b6020026020010151925060f883901c60001c60bb1415611a23575060009150613de79050565b60008061775f61829b565b848060200190518101906177739190618a5c565b9150915060008680602001905181019061778d9190618a5c565b50604051633c7b5fe960e21b8152909150309063f1ed7fa4906177ba908590859088908b9060040161a1bb565b60206040518083038186803b1580156177d257600080fd5b505afa925050508015617802575060408051601f3d908101601f191682019092526177ff918101906191b3565b60015b617830573d8080156171e8576040519150601f19603f3d011682016040523d82523d6000602084013e6171ed565b9350613de792505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b815260040161786e929190619a96565b60006040518083038186803b15801561788657600080fd5b505afa15801561789a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526178c29190810190618d0e565b90506001915080516000141561795b576040516315e8a07760e21b81526001600160a01b038816906357a281dc906179009087908990600401619a96565b60006040518083038186803b15801561791857600080fd5b505afa15801561792c573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526179549190810190618d0e565b9050600091505b80518610617970576000809250925050615ffd565b80868151811061797c57fe5b602002602001015192505094509492505050565b600080600080868060200190518101906179aa9190618a0c565b9250925092508015617a4e57604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e0906179ea906000908a90600401619a7d565b604080518083038187803b158015617a0157600080fd5b5086fa93505050508015617a32575060408051601f3d908101601f19168201909252617a2f918101906196c0565b60015b617a425760009350505050613de7565b509350613de792505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e0906179ea906000908a90600401619a7d565b600080600085806020019051810190617a9b9190618975565b91509150600085806020019051810190617ab59190618959565b9050306330d6570d83858461714e8a617e0a565b6000806060846001600160a01b03166370a0823160e01b85604051602401617af19190619a69565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051617b2f9190619a4d565b600060405180830381855afa9150503d8060008114617b6a576040519150601f19603f3d011682016040523d82523d6000602084013e617b6f565b606091505b5091509150818015617b8357506020815110155b15615dcb576112c581600061758d565b600080600085806020019051810190617bac9190618975565b91509150600085806020019051810190617bc69190618959565b90503063a469841762061a80848685617bde8b617e0a565b6040518663ffffffff1660e01b8152600401617bfd9493929190619adb565b60006040518083038187803b158015617c1557600080fd5b5086fa935050505080156171ba57506040513d6000823e601f3d908101601f191682016040526171b79190810190619165565b6000806060856001600160a01b031663dd62ed3e60e01b8686604051602401617c72929190619a96565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051617cb09190619a4d565b600060405180830381855afa9150503d8060008114617ceb576040519150601f19603f3d011682016040523d82523d6000602084013e617cf0565b606091505b5091509150818015617d0457506020815110155b15611a235761651681600061758d565b6000615dce8261723f565b600080600085806020019051810190617d389190618975565b9150915060008086806020019051810190617d539190618975565b91509150617d6384848389613f14565b98975050505050505050565b600082617d7e57506000615dce565b82820282848281617d8b57fe5b0414613de757613de7617da060018686618100565b61815a565b600082820183811015613de757613de7617da060008686618100565b600081617dd757617dd7617da060038585618100565b6000828481617de257fe5b04949350505050565b600082821115617e0457617e04617da060028585618100565b50900390565b604080516001808252818301909252606091602080830190803683370190505090508181600081518110617e3a57fe5b602002602001018181525050919050565b6000831580617e58575081155b80617e61575082155b15617e6e57506000613de7565b83820282858281617e7b57fe5b0414617e8b576000915050613de7565b8360018503820181617e9957fe5b0495945050505050565b6000813b80617eb6576000915050610c08565b50816001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b158015617ef057600080fd5b505afa158015617f04573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617f289190618959565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401617f539190619a69565b60206040518083038186803b158015617f6b57600080fd5b505afa158015617f7f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617fa391906191b3565b617faf57506000610c08565b816001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b158015617fe857600080fd5b505afa158015617ffc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906180209190618959565b6001600160a01b03166370a08231836040518263ffffffff1660e01b815260040161804b9190619a69565b60206040518083038186803b15801561806357600080fd5b505afa158015618077573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061809b91906191b3565b6180a757506000610c08565b506001919050565b81602001835110156180ce576180ce617da06005855185602001618162565b910160200152565b600081602001835110156180f7576180f7617da06005855185602001618162565b50016020015190565b606063e946c1bb60e01b84848460405160240161811f93929190619f30565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b84848460405160240161811f93929190619f51565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b60408051808201909152606081526000602082015290565b604051806040016040528060008152602001606081525090565b6040805160608101909152600080825260208201908152600060209091015290565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b60405180606001604052806003906020820280368337509192915050565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b8035615dce8161a3e5565b8051615dce8161a3e5565b600082601f83011261830b578081fd5b813561831e6183198261a35b565b61a335565b81815291506020808301908481018184028601820187101561833f57600080fd5b60005b848110156183675781356183558161a3e5565b84529282019290820190600101618342565b505050505092915050565b600082601f830112618382578081fd5b81356183906183198261a35b565b818152915060208083019084810160005b84811015618367576183b8888484358a01016182fb565b845292820192908201906001016183a1565b600082601f8301126183da578081fd5b81356183e86183198261a35b565b818152915060208083019084810160005b8481101561836757618410888484358a01016185b9565b845292820192908201906001016183f9565b600082601f830112618432578081fd5b81356184406183198261a35b565b81815291506020808301908481018184028601820187101561846157600080fd5b60005b848110156183675781356184778161a3e5565b84529282019290820190600101618464565b600082601f830112618499578081fd5b81356184a76183198261a35b565b81815291506020808301908481016080808502870183018810156184ca57600080fd5b60005b858110156184f1576184df89846188b8565b855293830193918101916001016184cd565b50505050505092915050565b600082601f83011261850d578081fd5b813561851b6183198261a35b565b81815291506020808301908481018184028601820187101561853c57600080fd5b60005b848110156183675781358452928201929082019060010161853f565b600082601f83011261856b578081fd5b81516185796183198261a35b565b81815291506020808301908481018184028601820187101561859a57600080fd5b60005b848110156183675781518452928201929082019060010161859d565b600082601f8301126185c9578081fd5b81356185d76183198261a37a565b91508082528360208285010111156185ee57600080fd5b8060208401602084013760009082016020015292915050565b600082601f830112618617578081fd5b81516186256183198261a37a565b915080825283602082850101111561863c57600080fd5b612c9f81602084016020860161a3a8565b805160028110615dce57600080fd5b60006060828403121561866d578081fd5b618677606061a335565b905081356186848161a3e5565b815260208201356186948161a408565b602082015260408201356186a78161a408565b604082015292915050565b6000606082840312156186c3578081fd5b6186cd606061a335565b905081516186da8161a3e5565b815260208201516186ea8161a408565b602082015260408201516186a78161a408565b60006040828403121561870e578081fd5b618718604061a335565b905081356187258161a3e5565b815260208201356187358161a3e5565b602082015292915050565b600060a08284031215618751578081fd5b61875b60a061a335565b905081358152602082013561876f8161a3e5565b602082015260408201356187828161a3e5565b604082015260608201356187958161a3e5565b606082015260808201356001600160401b038111156187b357600080fd5b6187bf848285016185b9565b60808301525092915050565b60006101808083850312156187de578182fd5b6187e78161a335565b9150506187f483836182e5565b815261880383602084016182e5565b6020820152618815836040840161891b565b6040820152618827836060840161891b565b6060820152618839836080840161891b565b608082015261884b8360a084016182e5565b60a082015261885d8360c084016182e5565b60c082015261886f8360e084016182e5565b60e0820152610100618883848285016182e5565b9082015261012082810135908201526101406188a184828501618926565b818301525061016080830135818301525092915050565b6000608082840312156188c9578081fd5b6188d3608061a335565b90508135600481106188e457600080fd5b8152602082013560ff811681146188fa57600080fd5b80602083015250604082013560408201526060820135606082015292915050565b8035615dce8161a42d565b80356001600160401b0381168114615dce57600080fd5b60006020828403121561894e578081fd5b8135613de78161a3e5565b60006020828403121561896a578081fd5b8151613de78161a3e5565b60008060408385031215618987578081fd5b82516189928161a3e5565b60208401519092506189a38161a3e5565b809150509250929050565b600080600080608085870312156189c3578182fd5b84516189ce8161a3e5565b60208601519094506189df8161a3e5565b60408601519093506189f08161a3e5565b6060860151909250618a018161a3e5565b939692955090935050565b600080600060608486031215618a20578081fd5b8351618a2b8161a3e5565b6020850151909350618a3c8161a3e5565b60408501519092508015158114618a51578182fd5b809150509250925092565b60008060408385031215618a6e578182fd5b8251618a798161a3e5565b60208401519092506001600160401b0380821115618a95578283fd5b9084019060a08287031215618aa8578283fd5b618ab260a061a335565b82518152618ac387602085016182f0565b6020820152618ad587604085016182f0565b6040820152618ae787606085016182f0565b6060820152608083015182811115618afd578485fd5b618b0988828601618607565b6080830152508093505050509250929050565b600080600080600060a08688031215618b33578283fd5b8535618b3e8161a3e5565b94506020860135618b4e8161a3e5565b93506040860135618b5e8161a3e5565b92506060860135618b6e8161a3e5565b915060808601356001600160401b03811115618b88578182fd5b618b94888289016184fd565b9150509295509295909350565b60008060008060808587031215618bb6578182fd5b8435618bc18161a3e5565b93506020850135618bd18161a3e5565b92506040850135618be18161a3e5565b915060608501356001600160401b03811115618bfb578182fd5b618c07878288016184fd565b91505092959194509250565b60008060008060808587031215618c28578182fd5b8435618c338161a3e5565b93506020850135618c438161a3e5565b92506040850135618c538161a3e5565b9396929550929360600135925050565b600080600060608486031215618c77578081fd5b8335618c828161a3e5565b925060208401356001600160401b0380821115618c9d578283fd5b618ca9878388016182fb565b93506040860135915080821115618cbe578283fd5b50618ccb868287016184fd565b9150509250925092565b600080600080600060a08688031215618cec578283fd5b8535618cf78161a3e5565b9450602086013593506040860135618b5e8161a3e5565b60006020808385031215618d20578182fd5b82516001600160401b03811115618d35578283fd5b8301601f81018513618d45578283fd5b8051618d536183198261a35b565b8181528381019083850185840285018601891015618d6f578687fd5b8694505b83851015618d9a578051618d868161a3e5565b835260019490940193918501918501618d73565b50979650505050505050565b600080600060608486031215618dba578081fd5b83516001600160401b0380821115618dd0578283fd5b818601915086601f830112618de3578283fd5b8151618df16183198261a35b565b80828252602080830192508086018b828387028901011115618e11578788fd5b8796505b84871015618e33578051845260019690960195928101928101618e15565b508901519097509350505080821115618e4a578283fd5b50618e578682870161855b565b925050618e67856040860161864d565b90509250925092565b60008060208385031215618e82578182fd5b82356001600160401b0380821115618e98578384fd5b818501915085601f830112618eab578384fd5b813581811115618eb9578485fd5b8660208083028501011115618ecc578485fd5b60209290920196919550909350505050565b600080600060608486031215618ef2578081fd5b83356001600160401b0380821115618f08578283fd5b618f14878388016183ca565b94506020860135915080821115618f29578283fd5b50618f36868287016183ca565b925050604084013590509250925092565b600060208284031215618f58578081fd5b81356001600160401b03811115618f6d578182fd5b61125784828501618422565b60008060408385031215618f8b578182fd5b82356001600160401b03811115618fa0578283fd5b618fac85828601618422565b92505060208301356189a38161a3e5565b600080600060608486031215618fd1578081fd5b83356001600160401b03811115618fe6578182fd5b618ff286828701618422565b93505060208401356190038161a3e5565b91506040840135618a518161a3e5565b60006020808385031215619025578182fd5b82516001600160401b0381111561903a578283fd5b8301601f8101851361904a578283fd5b80516190586183198261a35b565b8181528381019083850185840285018601891015619074578687fd5b8694505b83851015618d9a578051835260019490940193918501918501619078565b6000806000606084860312156190aa578081fd5b83356001600160401b03808211156190c0578283fd5b818601915086601f8301126190d3578283fd5b81356190e16183198261a35b565b80828252602080830192508086016101808c838288028a01011115619104578889fd5b8897505b858810156191305761911a8d836187cb565b8552600197909701969382019390810190619108565b50919850890135945050505080821115619148578283fd5b5061915586828701618489565b925050618e6785604086016182e5565b600060208284031215619176578081fd5b81516001600160401b0381111561918b578182fd5b6112578482850161855b565b6000602082840312156191a8578081fd5b8151613de78161a3fa565b6000602082840312156191c4578081fd5b5051919050565b6000602082840312156191dc578081fd5b81516001600160401b038111156191f1578182fd5b61125784828501618607565b600080600060608486031215619211578081fd5b833561921c8161a3e5565b925060208401356001600160401b0380821115619237578283fd5b618ca987838801618422565b600060208284031215619254578081fd5b8151613de78161a41e565b60008060808385031215619271578182fd5b825161927c8161a41e565b915061928b84602085016186b2565b90509250929050565b60008060008084860360a08112156192aa578283fd5b60408112156192b7578283fd5b506192c2604061a335565b8535815260208601356192d48161a3e5565b6020820152935060408501356192e98161a3e5565b925060608501356192f98161a3e5565b915060808501356001600160401b03811115618bfb578182fd5b60008060008060808587031215619328578182fd5b84356001600160401b038082111561933e578384fd5b9086019060408289031215619351578384fd5b61935b604061a335565b61936589846182e5565b8152602083013582811115619378578586fd5b6193848a828601618372565b6020830152508096505061939b88602089016182e5565b94506193aa88604089016182e5565b935060608701359150808211156193bf578283fd5b50618c07878288016184fd565b60008060008060c085870312156193e1578182fd5b6193eb868661865c565b935060608501356193fb8161a41e565b9250608085013561940b8161a41e565b915060a08501356001600160401b03811115618bfb578182fd5b60008060008060a0858703121561943a578182fd5b61944486866186fd565b935060408501356192e98161a3e5565b60008060008060808587031215619469578182fd5b84356001600160401b038082111561947f578384fd5b61948b88838901618740565b95506020870135915061949d8261a3e5565b9093506040860135906194af8261a3e5565b909250606086013590808211156193bf578283fd5b600080600080608085870312156194d9578182fd5b84356001600160401b038111156194ee578283fd5b6194fa87828801618740565b9450506020850135618c438161a3e5565b60008060008060808587031215619520578182fd5b84356001600160401b03811115619535578283fd5b61954187828801618740565b9450506020850135925060408501356195598161a3e5565b91506060850135618a018161a3e5565b6000806000610220848603121561957e578081fd5b61958885856187cb565b92506195988561018086016188b8565b9150610200840135618a518161a3e5565b60008060008084860360c08112156195bf578283fd5b60608112156195cc578283fd5b506195d7606061a335565b85356195e28161a3e5565b81526020868101359082015260408601356195fc8161a3e5565b6040820152935060608501356196118161a3e5565b9250608085013561940b8161a3e5565b600080600083850360a0811215619636578182fd5b6060811215619643578182fd5b5061964e606061a335565b84518152602085015160058110619663578283fd5b602082015260408501516196768161a42d565b6040820152606085015190935061968c8161a42d565b6080850151909250618a518161a3fa565b6000602082840312156196ae578081fd5b815162ffffff81168114613de7578182fd5b600080604083850312156196d2578182fd5b505080516020909101519092909150565b600080600080608085870312156196f8578182fd5b505082516020840151604085015160609095015191969095509092509050565b600080600080600060a0868803121561972f578283fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b6001600160a01b0316815260200190565b600081518352602082015160208401526040820151604084015260608201516060840152608082015160a0608085015261125760a0850182619824565b6001600160a01b03169052565b6000815180845260208085019450808401835b838110156197ea5781516001600160a01b0316875295820195908201906001016197c5565b509495945050505050565b6000815180845260208085019450808401835b838110156197ea57815187529582019590820190600101619808565b6000815180845261983c81602086016020860161a3a8565b601f01601f19169290920160200192915050565b80516001600160a01b031682526020808201516001600160e01b03199081169184019190915260409182015116910152565b80516001600160a01b039081168352602080830151151590840152604080830151909116908301526060908101511515910152565b6000815183526020820151604060208501526112576040850182619824565b600081518352602082015160018060a01b0380821660208601528060408501511660408601528060608501511660608601525050608082015160a0608085015261125760a0850182619824565b61992e8282516197a5565b602081015161994060208401826197a5565b5060408101516199536040840182619a23565b5060608101516199666060840182619a23565b5060808101516199796080840182619a23565b5060a081015161998c60a08401826197a5565b5060c081015161999f60c08401826197a5565b5060e08101516199b260e08401826197a5565b50610100808201516199c6828501826197a5565b50506101208181015190830152610140808201516199e682850182619a30565b505061016090810151910152565b80516199ff8161a3d8565b825260208181015160ff169083015260408082015190830152606090810151910152565b6001600160801b03169052565b6001600160401b03169052565b6000828483379101908152919050565b60008251619a5f81846020870161a3a8565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03948516815292841660208401529083166040830152909116606082015260800190565b6001600160a01b038581168252848116602083015283166040820152608060608201819052600090616516908301846197f5565b6001600160a01b039485168152928416602084015292166040820152606081019190915260800190565b6001600160a01b039384168152919092166020820152901515604082015260600190565b6001600160a01b03858116825284166020820152821515604082015260806060820181905260009061651690830184619824565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090619bef90830184619824565b979650505050505050565b6001600160a01b0384168152606060208201819052600090619c1e908301856197b2565b828103604084015261651681856197f5565b6001600160a01b03851681526000619c478561a3d8565b84602083015260806040830152619c6160808301856197f5565b8281036060840152619bef81856197f5565b6001600160a01b03898116825260009061010090619c908b61a3d8565b8a6020850152816040850152619ca88285018b6197f5565b91508382036060850152619cbc828a6197f5565b90881660808501529050619ccf8661a3d8565b8560a084015282810360c0840152619ce781866197f5565b905082810360e0840152619cfb81856197f5565b9b9a5050505050505050505050565b6001600160a01b0383168152604060208201819052600090611257908301846198d6565b600060408252619d4160408301856197b2565b82810360208401526112c581856197f5565b600060408252619d6660408301856197b2565b90508260208301529392505050565b60006040820160408352808551808352606085019150602092506060838202860101838801855b83811015619dca57605f19888403018552619db8838351619824565b94860194925090850190600101619d9c565b505085810384870152617d6381886197f5565b60208082528251828201819052600091906040908185019080840286018301878501865b83811015619e4457888303603f1901855281518051878552619e2588860182619824565b9189015115159489019490945294870194925090860190600101619e01565b509098975050505050505050565b600060208252613de760208301846197f5565b901515815260200190565b83151581526001600160a01b03831660208201526060604082018190526000906112c5908301846197f5565b90815260200190565b600084825260606020830152619c1e6060830185619824565b600060208252613de76020830184619824565b600060408252619d666040830185619824565b6001600160a01b03938416815291909216602082015262ffffff909116604082015260600190565b6001600160a01b0383168152604060208201819052600090611257908301846197f5565b60608101619f3d8561a3d8565b938152602081019290925260409091015290565b6060810160088510619f3d57fe5b600060e08201619f6e8761a39d565b8352602060e081850152818751619f858185619e9c565b91508193508281028201838a01865b83811015619fbe578683038552619fac838351619768565b94860194925090850190600101619f94565b5050868103604088015280945088519250619fd98382619e9c565b94505050818701845b8281101561a00357619ff5858351619757565b945090830190600101619fe2565b50505050809150506112c56060830184619882565b600f93840b81529190920b6020820152604081019190915260600190565b600f83900b815260808101613de76020830184619850565b60208082526024908201527f556e6973776170563353616d706c65722f746f6b656e5061746820746f6f20736040820152631a1bdc9d60e21b606082015260800190565b60208082526025908201527f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e6040820152642fa820a4a960d91b606082015260800190565b60208082526025908201527f556e6973776170563353616d706c65722f696e76616c69642070617468206c656040820152646e6774687360d81b606082015260800190565b6020808252601e908201527f4b79626572444d4d53616d706c65722f4e4f5f504f4f4c535f464f554e440000604082015260600190565b600061a15f8287619850565b84600f0b606083015283600f0b608083015260c060a083015261651660c08301846197f5565b60006060825261a19860608301866198b7565b828103602084015261a1aa81866198b7565b915050826040830152949350505050565b60006080825261a1ce60808301876198d6565b6001600160a01b0395861660208401529390941660408201526060015292915050565b60006080825261a20460808301876198d6565b6020830195909552506001600160a01b0392831660408201529116606090910152919050565b610200810161a2398285619923565b613de76101808301846199f4565b610220810161a2568286619923565b61a2646101808301856199f4565b6001600160a01b0392909216610200919091015292915050565b60008382526040602083015261125760408301846197b2565b60008482526060602083015261a2b060608301856197b2565b828103604084015261651681856197b2565b958652602086019490945260408501929092526060840152608083015260a082015260c00190565b6000808335601e1984360301811261a300578283fd5b8301803591506001600160401b0382111561a319578283fd5b60200191503681900382131561a32e57600080fd5b9250929050565b6040518181016001600160401b038111828210171561a35357600080fd5b604052919050565b60006001600160401b0382111561a370578081fd5b5060209081020190565b60006001600160401b0382111561a38f578081fd5b50601f01601f191660200190565b8060028110610c0857fe5b60005b8381101561a3c357818101518382015260200161a3ab565b8381111561a3d2576000848401525b50505050565b6004811061a3e257fe5b50565b6001600160a01b038116811461a3e257600080fd5b801515811461a3e257600080fd5b6001600160e01b03198116811461a3e257600080fd5b80600f0b811461a3e257600080fd5b6001600160801b038116811461a3e257600080fdfea2646970667358221220ed25c8b3bf4e0887dfb50ae1f73bb7f9c86607df1f8e9b7e112fcb647600c51d64736f6c634300060c0033';
ERC20BridgeSamplerContract.contractName = 'ERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=erc20_bridge_sampler.js.map