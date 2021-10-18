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
exports.TestERC20BridgeSamplerContract = void 0;
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
class TestERC20BridgeSamplerContract extends base_contract_1.BaseContract {
    constructor(address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode = TestERC20BridgeSamplerContract.deployedBytecode, encoderOverrides) {
        super('TestERC20BridgeSampler', TestERC20BridgeSamplerContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode, encoderOverrides);
        this._methodABIIndex = {};
        utils_1.classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
        TestERC20BridgeSamplerContract.ABI().forEach((item, index) => {
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
            return TestERC20BridgeSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly);
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
            const libraryAddresses = yield TestERC20BridgeSamplerContract._deployLibrariesAsync(artifact, libraryArtifacts, new web3_wrapper_1.Web3Wrapper(provider), txDefaults);
            const bytecode = base_contract_1.linkLibrariesInBytecode(artifact, libraryAddresses);
            return TestERC20BridgeSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly);
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
            utils_1.logUtils.log(`TestERC20BridgeSampler successfully deployed at ${txReceipt.contractAddress}`);
            const contractInstance = new TestERC20BridgeSamplerContract(txReceipt.contractAddress, provider, txDefaults, logDecodeDependencies);
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
                inputs: [],
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'constructor',
            },
            {
                inputs: [],
                name: 'FAILURE_ADDRESS',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
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
                        name: 'tokenAddresses',
                        type: 'address[]',
                    },
                ],
                name: 'createTokenExchanges',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'enableFailTrigger',
                outputs: [],
                stateMutability: 'payable',
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
                        name: 'index_1',
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
                        name: 'index_2',
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
                inputs: [],
                name: 'kyber',
                outputs: [
                    {
                        name: '',
                        type: 'address',
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
            {
                inputs: [],
                name: 'uniswap',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'uniswapV2Router',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
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
                        yield TestERC20BridgeSamplerContract._deployLibrariesAsync(libraryArtifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses);
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
        const methodAbi = TestERC20BridgeSamplerContract.ABI()[index]; // tslint:disable-line:no-unnecessary-type-assertion
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
    FAILURE_ADDRESS() {
        const self = this;
        const functionSignature = 'FAILURE_ADDRESS()';
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
                return self._strictEncodeArguments(functionSignature, []);
            },
        };
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
    createTokenExchanges(tokenAddresses) {
        const self = this;
        assert_1.assert.isArray('tokenAddresses', tokenAddresses);
        const functionSignature = 'createTokenExchanges(address[])';
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
                return self._strictEncodeArguments(functionSignature, [tokenAddresses]);
            },
        };
    }
    enableFailTrigger() {
        const self = this;
        const functionSignature = 'enableFailTrigger()';
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
                return self._strictEncodeArguments(functionSignature, []);
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
    getLimitOrderFillableTakerAmount(order, index_1, index_2) {
        const self = this;
        assert_1.assert.isString('index_2', index_2);
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
                return self._strictEncodeArguments(functionSignature, [order, index_1, index_2.toLowerCase()]);
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
    kyber() {
        const self = this;
        const functionSignature = 'kyber()';
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
                return self._strictEncodeArguments(functionSignature, []);
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
    uniswap() {
        const self = this;
        const functionSignature = 'uniswap()';
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
                return self._strictEncodeArguments(functionSignature, []);
            },
        };
    }
    uniswapV2Router() {
        const self = this;
        const functionSignature = 'uniswapV2Router()';
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
                return self._strictEncodeArguments(functionSignature, []);
            },
        };
    }
}
exports.TestERC20BridgeSamplerContract = TestERC20BridgeSamplerContract;
/**
 * @ignore
 */
TestERC20BridgeSamplerContract.deployedBytecode = '0x60806040526004361061036b5760003560e01c80637f7f4f13116101c6578063bd71ecf6116100f7578063ddd5aa2811610095578063f1ed7fa41161006f578063f1ed7fa414610a6b578063f3868e9c146105a0578063f5a4994d14610a8b578063fc9fe41b14610aab5761036b565b8063ddd5aa2814610a0b578063e78ac04514610a2b578063e8e4af0914610a4b5761036b565b8063c8c74a37116100d1578063c8c74a3714610996578063cc1621c9146109b6578063cd72d789146109d6578063d9bca372146109eb5761036b565b8063bd71ecf614610936578063c25c413814610956578063c8319084146109765761036b565b80639ea0ff1311610164578063a46984171161013e578063a4698417146108a8578063a75e744b146108c8578063adc636bf146108e8578063b90cd2fb146109165761036b565b80639ea0ff1314610853578063a0295b8b14610873578063a2d10ba5146108935761036b565b80639209483b116101a05780639209483b146107b757806398777748146107d75780639bf3ee35146107f75780639e3f05c3146108245761036b565b80637f7f4f13146107485780638b6d7b44146107685780638e5a0e07146107885761036b565b80633105fec1116102a057806357494b1d1161023e57806366a1ac6b1161021857806366a1ac6b146106bb57806368be3cf2146106db578063706e2f9b1461070857806374c9d255146107285761036b565b806357494b1d1461065b5780635aae4e531461067b5780635d5b674f1461069b5761036b565b806340bc03ae1161027a57806340bc03ae146105c0578063494569db146105e05780634edfb5b2146106005780635505000a1461062d5761036b565b80633105fec114610560578063312686571461058057806336052391146105a05761036b565b8063252322b31161030d57806329fa4aa0116102e757806329fa4aa0146104d15780632aa64319146104f15780632d753aa41461052057806330d6570d146105405761036b565b8063252322b31461047c5780632681f7e41461049c578063281e3432146104b15761036b565b8063149dab0e11610349578063149dab0e146103de578063162790551461040d5780631694505e1461043a5780632339078f1461045c5761036b565b80630496d5dc146103705780631022742b146103a757806311f2928b146103d4575b600080fd5b34801561037c57600080fd5b5061039061038b366004618d38565b610acb565b60405161039e929190619d47565b60405180910390f35b3480156103b357600080fd5b506103c76103c236600461913c565b610c71565b60405161039e9190619e6b565b6103dc610de4565b005b3480156103ea57600080fd5b506103fe6103f93660046193bd565b610e27565b60405161039e93929190619bc5565b34801561041957600080fd5b5061042d610428366004618a12565b610f87565b60405161039e9190619e7e565b34801561044657600080fd5b5061044f610f91565b60405161039e9190619a34565b34801561046857600080fd5b506103c761047736600461933e565b610fa0565b34801561048857600080fd5b506103c7610497366004618c76565b6111c7565b3480156104a857600080fd5b5061044f61139d565b3480156104bd57600080fd5b506103c76104cc3660046196a4565b6113ac565b3480156104dd57600080fd5b506103c76104ec3660046194c7565b611601565b3480156104fd57600080fd5b5061051161050c366004619520565b611670565b60405161039e93929190619e89565b34801561052c57600080fd5b506103c761053b366004618bf1565b61194d565b34801561054c57600080fd5b506103c761055b366004618c76565b611ad6565b34801561056c57600080fd5b506103c761057b366004618d38565b611c4a565b34801561058c57600080fd5b506103dc61059b366004618de3565b611dce565b3480156105ac57600080fd5b506103c76105bb366004619520565b611e36565b3480156105cc57600080fd5b506103c76105db3660046194c7565b611ec8565b3480156105ec57600080fd5b506103906105fb366004618d38565b612049565b34801561060c57600080fd5b5061062061061b366004619606565b6121d5565b60405161039e9190619ed7565b34801561063957600080fd5b5061064d6106483660046192a7565b612452565b60405161039e929190619d8e565b34801561066757600080fd5b506103c7610676366004618c76565b61269d565b34801561068757600080fd5b5061064d6106963660046192a7565b612bef565b3480156106a757600080fd5b506103c76106b6366004618c76565b612e34565b3480156106c757600080fd5b506103c76106d636600461913c565b612e9a565b3480156106e757600080fd5b506106fb6106f6366004618de3565b612f4f565b60405161039e9190619df6565b34801561071457600080fd5b506103c7610723366004618fed565b6130b0565b34801561073457600080fd5b506103fe6107433660046193bd565b6131a2565b34801561075457600080fd5b506103c76107633660046196a4565b6131b1565b34801561077457600080fd5b506103c76107833660046194c7565b6133fe565b34801561079457600080fd5b506107a86107a3366004618f84565b613761565b60405161039e9392919061a19e565b3480156107c357600080fd5b506103c76107d23660046194c7565b61397a565b3480156107e357600080fd5b506103c76107f2366004618c76565b613b7a565b34801561080357600080fd5b50610817610812366004619664565b6140b1565b60405161039e9190619eb5565b34801561083057600080fd5b5061084461083f36600461954f565b614102565b60405161039e93929190619ebe565b34801561085f57600080fd5b5061081761086e366004618ce8565b614228565b34801561087f57600080fd5b506103c761088e36600461933e565b61443e565b34801561089f57600080fd5b5061044f61463a565b3480156108b457600080fd5b506103c76108c3366004618c76565b614649565b3480156108d457600080fd5b506105116108e3366004618daa565b61479e565b3480156108f457600080fd5b50610908610903366004618c76565b6148db565b60405161039e929190619f25565b34801561092257600080fd5b506103c7610931366004618c76565b614a2b565b34801561094257600080fd5b506103c761095136600461901f565b614a91565b34801561096257600080fd5b506103c7610971366004618c76565b614b8d565b34801561098257600080fd5b506103c7610991366004618c76565b614bf3565b3480156109a257600080fd5b506103c76109b1366004618d38565b614db0565b3480156109c257600080fd5b506108446109d136600461954f565b614f1c565b3480156109e257600080fd5b5061044f615102565b3480156109f757600080fd5b50610511610a06366004618daa565b61511a565b348015610a1757600080fd5b50610511610a26366004619520565b615209565b348015610a3757600080fd5b506103c7610a46366004619063565b61549c565b348015610a5757600080fd5b506103c7610a66366004618c76565b615591565b348015610a7757600080fd5b50610817610a863660046195bf565b6156c4565b348015610a9757600080fd5b50610908610aa6366004618c76565b615863565b348015610ab757600080fd5b506107a8610ac6366004618f84565b61594f565b80516060908190806001600160401b0381118015610ae857600080fd5b50604051908082528060200260200182016040528015610b12578160200160208202803683370190505b509150610b1f8686615b64565b9250825160001415610b315750610c69565b60005b81811015610c6657866001600160a01b031663a8312b1d620249f0878481518110610b5b57fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401610b839392919061a351565b60006040518083038187803b158015610b9b57600080fd5b5086fa93505050508015610bd157506040513d6000823e601f3d908101601f19168201604052610bce919081019061920b565b60015b610c0b573d808015610bff576040519150601f19603f3d011682016040523d82523d6000602084013e610c04565b606091505b5050610c66565b80600188510381518110610c1b57fe5b6020026020010151848381518110610c2f57fe5b602002602001018181525050838281518110610c4757fe5b602002602001015160001415610c5d5750610c66565b50600101610b34565b50505b935093915050565b606083516001600160401b0381118015610c8a57600080fd5b50604051908082528060200260200182016040528015610cb4578160200160208202803683370190505b50905060005b84518114610ddc57306001600160a01b0316639bf3ee3562030d40878481518110610ce157fe5b6020026020010151878581518110610cf557fe5b6020026020010151876040518563ffffffff1660e01b8152600401610d1c9392919061a243565b60206040518083038187803b158015610d3457600080fd5b5086fa93505050508015610d65575060408051601f3d908101601f19168201909252610d629181019061925d565b60015b610db9573d808015610d93576040519150601f19603f3d011682016040523d82523d6000602084013e610d98565b606091505b506000838381518110610da757fe5b60200260200101818152505050610dd4565b80838381518110610dc657fe5b602002602001018181525050505b600101610cba565b509392505050565b60405173e9db8717bc5dfb20aaf538b4a5a02b7791ff430c903480156108fc02916000818181858888f19350505050158015610e24573d6000803e3d6000fd5b50565b600060608086602001515160001415610e3f57610f7d565b610e4b87878787615e53565b855191945092506001600160401b0381118015610e6757600080fd5b50604051908082528060200260200182016040528015610e91578160200160208202803683370190505b50905060005b8151811015610f7b57836001600160a01b0316637f9c0ecd620493e085888581518110610ec057fe5b60200260200101516040518463ffffffff1660e01b8152600401610ee5929190619d6c565b60206040518083038187803b158015610efd57600080fd5b5086fa93505050508015610f2e575060408051601f3d908101601f19168201909252610f2b9181019061925d565b60015b610f3757610f7b565b80838381518110610f4457fe5b602002602001018181525050828281518110610f5c57fe5b602002602001015160001415610f725750610f7b565b50600101610e97565b505b9450945094915050565b803b15155b919050565b6001546001600160a01b031681565b6060610fac8385616085565b602085015160408051600280825260608281019093528160200160208202803683370190505090508581600081518110610fe257fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061101057fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561104057600080fd5b5060405190808252806020026020018201604052801561106a578160200160208202803683370190505b50935061107561827c565b61107d6160bb565b905060005b828110156111ba5760606110a98b89848151811061109c57fe5b60200260200101516160ea565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906110df9060009085908a908990600401619f78565b600060405180830381600087803b1580156110f957600080fd5b505af192505050801561112e57506040513d6000823e601f3d908101601f1916820160405261112b91908101906190b9565b60015b611169573d80801561115c576040519150601f19603f3d011682016040523d82523d6000602084013e611161565b606091505b5050506111ba565b60008160018151811061117857fe5b602002602001015160001902905060008113611196575050506111ba565b808985815181106111a357fe5b602002602001018181525050505050600101611082565b5050505050949350505050565b60606111d38385616085565b8151806001600160401b03811180156111eb57600080fd5b50604051908082528060200260200182016040528015611215578160200160208202803683370190505b50915060006001600160a01b0386161561123857611233878761617c565b61123b565b60005b905060006001600160a01b0386161561125d57611258888761617c565b611260565b60005b905060005b838110156113915760016001600160a01b0388166112c3576112a284632640f62c60e01b89858151811061129557fe5b60200260200101516161fb565b8784815181106112ae57fe5b6020026020010181935082815250505061135d565b6001600160a01b0389166112e9576112a2836359e9486260e01b89858151811061129557fe5b6000611303846359e9486260e01b8a868151811061129557fe5b9250905080156113405761131f856309903d8b60e21b836161fb565b88858151811061132b57fe5b6020026020010181945082815250505061135b565b600087848151811061134e57fe5b6020026020010181815250505b505b80158061137d575085828151811061137157fe5b60200260200101516000145b156113885750611391565b50600101611265565b50505050949350505050565b6000546001600160a01b031681565b60606113b88385616085565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b1580156113fc57600080fd5b505afa158015611410573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114349190618a2e565b8451909150806001600160401b038111801561144f57600080fd5b50604051908082528060200260200182016040528015611479578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156114b557600080fd5b505afa1580156114c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114ed9190618a2e565b6001600160a01b0316866001600160a01b0316141580156115905750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561154257600080fd5b505afa158015611556573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061157a9190618a2e565b6001600160a01b0316876001600160a01b031614155b1561159d575050506115f9565b60005b818110156113915760006115cb8a898b8a86815181106115bc57fe5b602002602001015189896162de565b9050806115d85750611391565b808683815181106115e557fe5b6020908102919091010152506001016115a0565b949350505050565b604080516060818101909252611667908061162086896080840161a04f565b6040516020818303038152906040528152602001868860405160200161164792919061a04f565b604051602081830303815290604052815260200161659f815250836166d2565b95945050505050565b600080606061167f8587616085565b8351806001600160401b038111801561169757600080fd5b506040519080825280602002602001820160405280156116c1578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c6906116f4908a908a90600401619a61565b60206040518083038186803b15801561170c57600080fd5b505afa158015611720573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117449190618a2e565b925060006001600160a01b0384161561176257506001935086611801565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690611793908a908c90600401619a61565b60206040518083038186803b1580156117ab57600080fd5b505afa1580156117bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117e39190618a2e565b93506001600160a01b0384166117fa575050610f7d565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561183a57600080fd5b505afa15801561184e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611872919061923d565b61187d575050610f7d565b60005b828110156119405760006118fa8a87858e602001516040516020016118a89493929190619a7b565b6040516020818303038152906040528a88868f602001516040516020016118d29493929190619a7b565b6040516020818303038152906040528a85815181106118ed57fe5b60200260200101516168e4565b90508085838151811061190957fe5b60200260200101818152505084828151811061192157fe5b6020026020010151600014156119375750611940565b50600101611880565b5050509450945094915050565b8051606090806001600160401b038111801561196857600080fd5b50604051908082528060200260200182016040528015611992578160200160208202803683370190505b5091506001600160a01b0387166119a95750611667565b60005b81811015611acb5760006060896001600160a01b031662061a80636e79e13360e01b8b8b8b8b89815181106119dd57fe5b60200260200101516040516024016119f89493929190619ada565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611a369190619a18565b6000604051808303818686fa925050503d8060008114611a72576040519150601f19603f3d011682016040523d82523d6000602084013e611a77565b606091505b509150915060008215611a9b5781806020019051810190611a98919061925d565b90505b80611aa857505050611acb565b80868581518110611ab557fe5b60209081029190910101525050506001016119ac565b505095945050505050565b6060611ae28385616085565b8151806001600160401b0381118015611afa57600080fd5b50604051908082528060200260200182016040528015611b24578160200160208202803683370190505b50915060005b81811015611c4057866001600160a01b03166372ea9076620c35008888888681518110611b5357fe5b60200260200101516040518563ffffffff1660e01b8152600401611b7993929190619b5c565b60206040518083038187803b158015611b9157600080fd5b5086fa93505050508015611bc2575060408051601f3d908101601f19168201909252611bbf9181019061925d565b60015b611bfc573d808015611bf0576040519150601f19603f3d011682016040523d82523d6000602084013e611bf5565b606091505b5050611c40565b80848381518110611c0957fe5b602002602001018181525050838281518110611c2157fe5b602002602001015160001415611c375750611c40565b50600101611b2a565b5050949350505050565b8051606090806001600160401b0381118015611c6557600080fd5b50604051908082528060200260200182016040528015611c8f578160200160208202803683370190505b50915060005b81811015611dc557856001600160a01b031663d06ca61f620249f0868481518110611cbc57fe5b6020026020010151886040518463ffffffff1660e01b8152600401611ce292919061a338565b60006040518083038187803b158015611cfa57600080fd5b5086fa93505050508015611d3057506040513d6000823e601f3d908101601f19168201604052611d2d919081019061920b565b60015b611d6a573d808015611d5e576040519150601f19603f3d011682016040523d82523d6000602084013e611d63565b606091505b5050611dc5565b80600187510381518110611d7a57fe5b6020026020010151848381518110611d8e57fe5b602002602001018181525050838281518110611da657fe5b602002602001015160001415611dbc5750611dc5565b50600101611c95565b50509392505050565b600054604051633126865760e01b81526001600160a01b0390911690633126865790611e009085908590600401619cf9565b600060405180830381600087803b158015611e1a57600080fd5b505af1158015611e2e573d6000803e3d6000fd5b505050505050565b6060611e428385616085565b84602001516001600160a01b0316846001600160a01b0316141580611e74575084516001600160a01b03848116911614155b15610ddc5781516060816001600160401b0381118015611e9357600080fd5b50604051908082528060200260200182016040528015611ebd578160200160208202803683370190505b5092506115f9915050565b8051606090806001600160401b0381118015611ee357600080fd5b50604051908082528060200260200182016040528015611f0d578160200160208202803683370190505b50915060005b81811015611c40576000606088600001516001600160a01b0316621e84808a602001518a8a8a8881518110611f4457fe5b6020026020010151604051602401611f5e9392919061a031565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611f9c9190619a18565b6000604051808303818686fa925050503d8060008114611fd8576040519150601f19603f3d011682016040523d82523d6000602084013e611fdd565b606091505b5091509150600082156120015781806020019051810190611ffe919061925d565b90505b8086858151811061200e57fe5b60200260200101818152505085848151811061202657fe5b60200260200101516000141561203e57505050611c40565b505050600101611f13565b80516060908190806001600160401b038111801561206657600080fd5b50604051908082528060200260200182016040528015612090578160200160208202803683370190505b50915061209d8686615b64565b92508251600014156120af5750610c69565b60005b81811015610c6657866001600160a01b0316639e269b68620249f08784815181106120d957fe5b6020026020010151878a6040518563ffffffff1660e01b81526004016121019392919061a351565b60006040518083038187803b15801561211957600080fd5b5086fa9350505050801561214f57506040513d6000823e601f3d908101601f1916820160405261214c919081019061920b565b60015b61217d573d808015610bff576040519150601f19603f3d011682016040523d82523d6000602084013e610c04565b8060008151811061218a57fe5b602002602001015184838151811061219e57fe5b6020026020010181815250508382815181106121b657fe5b6020026020010151600014156121cc5750610c66565b506001016120b2565b6020848101516040805160018082528183019092526060938492908281019080368337019050509050858160008151811061220c57fe5b602090810291909101015260606000604051908082528060200260200182016040528015612244578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b03161415612335576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a1209061229d90899060019088908890600401619bfb565b60006040518083038187803b1580156122b557600080fd5b5086fa935050505080156122eb57506040513d6000823e601f3d908101601f191682016040526122e89190810190619275565b60015b612325573d808015612319576040519150601f19603f3d011682016040523d82523d6000602084013e61231e565b606091505b5050612330565b93506115f992505050565b612447565b87606001516001600160a01b0316856001600160a01b0316141561238b576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a1209061229d908a9060019088908890600401619bfb565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a120906123cb908a90600190889088908d90849084908490600401619c3e565b60006040518083038187803b1580156123e357600080fd5b5086fa9350505050801561241957506040513d6000823e601f3d908101601f191682016040526124169190810190619275565b60015b612325573d8080156111ba576040519150601f19603f3d011682016040523d82523d6000602084013e6111ba565b505050949350505050565b60608060606124d3866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561249357600080fd5b505afa1580156124a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124cb9190618a2e565b866000616a1d565b905083516001600160401b03811180156124ec57600080fd5b50604051908082528060200260200182016040528015612516578160200160208202803683370190505b50915083516001600160401b038111801561253057600080fd5b5060405190808252806020026020018201604052801561256457816020015b606081526020019060019003908161254f5790505b50925060005b8451811015610c665760606000805b84518110156126555760606125a18a87848151811061259457fe5b6020026020010151616eb3565b90508a6001600160a01b031663cdca1753620493e0838c89815181106125c357fe5b60200260200101516040518463ffffffff1660e01b81526004016125e8929190619eea565b602060405180830381600088803b15801561260257600080fd5b5087f193505050508015612633575060408051601f3d908101601f191682019092526126309181019061925d565b60015b61263c5761264c565b80841161264a578093508194505b505b50600101612579565b5080612662575050610c66565b8085848151811061266f57fe5b6020026020010181815250508186848151811061268857fe5b6020908102919091010152505060010161256a565b80516060908590806001600160401b03811180156126ba57600080fd5b506040519080825280602002602001820160405280156126e4578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b62490612714908990600401619a34565b60206040518083038186803b15801561272c57600080fd5b505afa158015612740573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612764919061923d565b15806127e95750604051630bcded8960e21b81526001600160a01b03831690632f37b62490612797908890600401619a34565b60206040518083038186803b1580156127af57600080fd5b505afa1580156127c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127e7919061923d565b155b156127f55750506115f9565b6127fd6182a3565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612829908a90600401619a34565b60206040518083038186803b15801561284157600080fd5b505afa158015612855573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612879919061925d565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906128a7908990600401619a34565b60206040518083038186803b1580156128bf57600080fd5b505afa1580156128d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128f7919061925d565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690612928908a90600401619a34565b60206040518083038186803b15801561294057600080fd5b505afa158015612954573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612978919061925d565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce6906129ab908990600401619a34565b60206040518083038186803b1580156129c357600080fd5b505afa1580156129d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129fb919061925d565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015612a3d57600080fd5b505afa158015612a51573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a75919061925d565b608082015260005b8281101561139157612aa882602001516003670de0b6b3a764000081612a9f57fe5b0460010161700e565b868281518110612ab457fe5b60200260200101511115612ac757611391565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c8881518110612afa57fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401612b289695949392919061a37c565b60206040518083038187803b158015612b4057600080fd5b5086fa93505050508015612b71575060408051601f3d908101601f19168201909252612b6e9181019061925d565b60015b612bab573d808015612b9f576040519150601f19603f3d011682016040523d82523d6000602084013e612ba4565b606091505b5050611391565b80868381518110612bb857fe5b602002602001018181525050858281518110612bd057fe5b602002602001015160001415612be65750611391565b50600101612a7d565b6060806060612c30866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561249357600080fd5b90506060612c3d8661706b565b905084516001600160401b0381118015612c5657600080fd5b50604051908082528060200260200182016040528015612c80578160200160208202803683370190505b50925084516001600160401b0381118015612c9a57600080fd5b50604051908082528060200260200182016040528015612cce57816020015b6060815260200190600190039081612cb95790505b50935060005b8551811015612e295760606000805b8551811015612de1576060612d1386612d0e898581518110612d0157fe5b6020026020010151617103565b616eb3565b90508b6001600160a01b0316632f80bb1d620493e0838d8981518110612d3557fe5b60200260200101516040518463ffffffff1660e01b8152600401612d5a929190619eea565b602060405180830381600088803b158015612d7457600080fd5b5087f193505050508015612da5575060408051601f3d908101601f19168201909252612da29181019061925d565b60015b612dae57612dd8565b831580612dbb5750808410155b15612dd657809350612dd38c89858151811061259457fe5b94505b505b50600101612ce3565b5080612dee575050612e29565b80868481518110612dfb57fe5b60200260200101818152505081878481518110612e1457fe5b60209081029190910101525050600101612cd4565b505050935093915050565b6040805160608181019092526116679080612e53868960808401619a61565b60405160208183030381529060405281526020018688604051602001612e7a929190619a61565b604051602081830303815290604052815260200161719b815250836166d2565b6060612ea7848484610c71565b905060005b8451811015610ddc57818181518110612ec157fe5b6020026020010151600014612f4757612f2e828281518110612edf57fe5b6020026020010151868381518110612ef357fe5b6020026020010151606001516001600160801b0316878481518110612f1457fe5b6020026020010151604001516001600160801b03166172af565b828281518110612f3a57fe5b6020026020010181815250505b600101612eac565b6060816001600160401b0381118015612f6757600080fd5b50604051908082528060200260200182016040528015612fa157816020015b612f8e6182d2565b815260200190600190039081612f865790505b50905060005b8083146130a9576001828281518110612fbc57fe5b602090810291909101810151911515910152838382818110612fda57fe5b9050602002810190612fec919061a3a4565b15159050612ff9576130a1565b3084848381811061300657fe5b9050602002810190613018919061a3a4565b604051613026929190619a08565b6000604051808303816000865af19150503d8060008114613063576040519150601f19603f3d011682016040523d82523d6000602084013e613068565b606091505b5083838151811061307557fe5b602002602001015160200184848151811061308c57fe5b60209081029190910101519190915290151590525b600101612fa7565b5092915050565b606081516001600160401b03811180156130c957600080fd5b506040519080825280602002602001820160405280156130f3578160200160208202803683370190505b50905060005b8251811461319c577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031683828151811061313757fe5b60200260200101516001600160a01b0316146131775761317283828151811061315c57fe5b60200260200101516001600160a01b03166172d3565b61317a565b60125b60ff1682828151811061318957fe5b60209081029190910101526001016130f9565b50919050565b60006060809450945094915050565b60606131bd8385616085565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b15801561320157600080fd5b505afa158015613215573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906132399190618a2e565b8451909150806001600160401b038111801561325457600080fd5b5060405190808252806020026020018201604052801561327e578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156132ba57600080fd5b505afa1580156132ce573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906132f29190618a2e565b6001600160a01b0316866001600160a01b0316141580156133955750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561334757600080fd5b505afa15801561335b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061337f9190618a2e565b6001600160a01b0316876001600160a01b031614155b156133a2575050506115f9565b60005b818110156113915760006133d08a898b8a86815181106133c157fe5b6020026020010151898961737f565b9050806133dd5750611391565b808683815181106133ea57fe5b6020908102919091010152506001016133a5565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b81526004016134359190619eb5565b60206040518083038186803b15801561344d57600080fd5b505afa158015613461573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613485919061925d565b8651604051631e01043960e01b81526001600160a01b0390911690631e010439906134b890600f89900b90600401619eb5565b60206040518083038186803b1580156134d057600080fd5b505afa1580156134e4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613508919061925d565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b81526004016135409190619eb5565b60806040518083038186803b15801561355857600080fd5b505afa15801561356c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906135909190619762565b935050505080601203600a0a82816135a457fe5b85519190049250806001600160401b03811180156135c157600080fd5b506040519080825280602002602001820160405280156135eb578160200160208202803683370190505b50935060005b8181101561139157600060608a600001516001600160a01b0316620927c08c602001518c8c8c888151811061362257fe5b602002602001015160405160240161363c9392919061a031565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b031990941693909317909252905161367a9190619a18565b6000604051808303818686fa925050503d80600081146136b6576040519150601f19603f3d011682016040523d82523d6000602084013e6136bb565b606091505b5091509150600082156136df57818060200190518101906136dc919061925d565b90505b86811061371957835b8581101561371057878982815181106136fd57fe5b60209081029190910101526001016136e8565b50505050611391565b8088858151811061372657fe5b60200260200101818152505087848151811061373e57fe5b60200260200101516000141561375657505050611391565b5050506001016135f1565b6137696182ea565b6137716182ea565b600080805b87518114613876576137bd602089838151811061378f57fe5b60200260200101515103878a84815181106137a657fe5b60200260200101516176119092919063ffffffff16565b60006060306001600160a01b03168a84815181106137d757fe5b60200260200101516040516137ec9190619a18565b6000604051808303816000865af19150503d8060008114613829576040519150601f19603f3d011682016040523d82523d6000602084013e61382e565b606091505b5091509150811561386c57600061385260208351038361762190919063ffffffff16565b90508481111561386a57838852602088018290529350835b505b5050600101613776565b50806138825750613971565b60005b8651811461396e576138b5602088838151811061389e57fe5b60200260200101515103838984815181106137a657fe5b60006060306001600160a01b03168984815181106138cf57fe5b60200260200101516040516138e49190619a18565b6000604051808303816000865af19150503d8060008114613921576040519150601f19603f3d011682016040523d82523d6000602084013e613926565b606091505b5091509150811561396457600061394a60208351038361762190919063ffffffff16565b90508581111561396257838752602087018290529450845b505b5050600101613885565b50505b93509350939050565b60408401516060906001600160e01b0319166139fc5760408051606081019091526139f590806139ae86896080840161a04f565b604051602081830303815290604052815260200186886040516020016139d592919061a04f565b604051602081830303815290604052815260200161762d815250836166d2565b90506115f9565b8151806001600160401b0381118015613a1457600080fd5b50604051908082528060200260200182016040528015613a3e578160200160208202803683370190505b50915060005b81811015611c40576000606088600001516001600160a01b0316621e84808a604001518a8a8a8881518110613a7557fe5b6020026020010151604051602401613a8f9392919061a031565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613acd9190619a18565b6000604051808303818686fa925050503d8060008114613b09576040519150601f19603f3d011682016040523d82523d6000602084013e613b0e565b606091505b509150915060008215613b325781806020019051810190613b2f919061925d565b90505b80868581518110613b3f57fe5b602002602001018181525050858481518110613b5757fe5b602002602001015160001415613b6f57505050611c40565b505050600101613a44565b80516060908590806001600160401b0381118015613b9757600080fd5b50604051908082528060200260200182016040528015613bc1578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b62490613bf1908990600401619a34565b60206040518083038186803b158015613c0957600080fd5b505afa158015613c1d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c41919061923d565b1580613cc65750604051630bcded8960e21b81526001600160a01b03831690632f37b62490613c74908890600401619a34565b60206040518083038186803b158015613c8c57600080fd5b505afa158015613ca0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613cc4919061923d565b155b15613cd25750506115f9565b613cda6182a3565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90613d06908a90600401619a34565b60206040518083038186803b158015613d1e57600080fd5b505afa158015613d32573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613d56919061925d565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90613d84908990600401619a34565b60206040518083038186803b158015613d9c57600080fd5b505afa158015613db0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613dd4919061925d565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690613e05908a90600401619a34565b60206040518083038186803b158015613e1d57600080fd5b505afa158015613e31573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613e55919061925d565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690613e88908990600401619a34565b60206040518083038186803b158015613ea057600080fd5b505afa158015613eb4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613ed8919061925d565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015613f1a57600080fd5b505afa158015613f2e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f52919061925d565b608082015260005b82811015611391578151613f76906706f05b59d3b2000061700e565b868281518110613f8257fe5b60200260200101511115613f9557611391565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c8881518110613fc857fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401613ff69695949392919061a37c565b60206040518083038187803b15801561400e57600080fd5b5086fa9350505050801561403f575060408051601f3d908101601f1916820190925261403c9181019061925d565b60015b61406d573d808015612b9f576040519150601f19603f3d011682016040523d82523d6000602084013e612ba4565b8086838151811061407a57fe5b60200260200101818152505085828151811061409257fe5b6020026020010151600014156140a85750611391565b50600101613f5a565b600083606001516001600160801b03168461016001516040516020016140d79190619eb5565b6040516020818303038152906040528051906020012060001c816140f757fe5b0690505b9392505050565b60006060806141118587616085565b61411c878787617681565b92508261412857610f7d565b60405163276fdad960e11b81523090634edfb5b290614151908a9087908b908b9060040161a20a565b60006040518083038186803b15801561416957600080fd5b505afa15801561417d573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526141a59190810190619275565b87608001819052508660800151915061421c6040518060600160405280878a6040516020016141d5929190619cd5565b6040516020818303038152906040528152602001888a6040516020016141fc929190619cd5565b60405160208183030381529060405281526020016177e8815250856166d2565b90509450945094915050565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b8152600401614259929190619a61565b60206040518083038186803b15801561427157600080fd5b505afa158015614285573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906142a99190618a2e565b90506001600160a01b0381166142c35760009150506115f9565b60006001600160a01b03861615614355576040516370a0823160e01b81526001600160a01b038716906370a0823190614300908590600401619a34565b60206040518083038186803b15801561431857600080fd5b505afa15801561432c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614350919061925d565b614361565b816001600160a01b0316315b905083811015614376576000925050506115f9565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f0906143ab908a908a908a90600401619b5c565b60206040518083038187803b1580156143c357600080fd5b5086fa935050505080156143f4575060408051601f3d908101601f191682019092526143f19181019061925d565b60015b614434573d808015614422576040519150601f19603f3d011682016040523d82523d6000602084013e614427565b606091505b50600093505050506115f9565b92506115f9915050565b606061444a8385616085565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061448057fe5b60200260200101906001600160a01b031690816001600160a01b03168152505084816001815181106144ae57fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b03811180156144de57600080fd5b50604051908082528060200260200182016040528015614508578160200160208202803683370190505b50935061451361827c565b61451b6160bb565b905060005b828110156111ba57606061453a8b89848151811061109c57fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906145709060019085908a908990600401619f78565b600060405180830381600087803b15801561458a57600080fd5b505af19250505080156145bf57506040513d6000823e601f3d908101601f191682016040526145bc91908101906190b9565b60015b6145ed573d80801561115c576040519150601f19603f3d011682016040523d82523d6000602084013e611161565b6000816000815181106145fc57fe5b6020026020010151905060008113614616575050506111ba565b8089858151811061462357fe5b602002602001018181525050505050600101614520565b6002546001600160a01b031681565b8051606090806001600160401b038111801561466457600080fd5b5060405190808252806020026020018201604052801561468e578160200160208202803683370190505b50915060005b81811015611c4057866001600160a01b031663343fbcdd62061a8088888886815181106146bd57fe5b60200260200101516040518563ffffffff1660e01b81526004016146e393929190619b5c565b60206040518083038187803b1580156146fb57600080fd5b5086fa9350505050801561472c575060408051601f3d908101601f191682019092526147299181019061925d565b60015b61475a573d808015611bf0576040519150601f19603f3d011682016040523d82523d6000602084013e611bf5565b8084838151811061476757fe5b60200260200101818152505083828151811061477f57fe5b6020026020010151600014156147955750611c40565b50600101614694565b60008060606147ad8587616085565b8351806001600160401b03811180156147c557600080fd5b506040519080825280602002602001820160405280156147ef578160200160208202803683370190505b5091506147fe898989896178cf565b945092506001600160a01b03831661481657506148d0565b60005b818110156148cd57600061488789868860405160200161483b93929190619b04565b60405160208183030381529060405289878960405160200161485f93929190619b04565b60405160208183030381529060405289858151811061487a57fe5b6020026020010151617a24565b90508084838151811061489657fe5b6020026020010181815250508382815181106148ae57fe5b6020026020010151600014156148c457506148cd565b50600101614819565b50505b955095509592505050565b600060606148e98486616085565b8251806001600160401b038111801561490157600080fd5b5060405190808252806020026020018201604052801561492b578160200160208202803683370190505b50915060005b818110156149a057600061495a89898989868151811061494d57fe5b6020026020010151614228565b90508084838151811061496957fe5b60200260200101818152505083828151811061498157fe5b60200260200101516000141561499757506149a0565b50600101614931565b5060405163901754d760e01b81526001600160a01b0388169063901754d7906149cf9089908990600401619a61565b60206040518083038186803b1580156149e757600080fd5b505afa1580156149fb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614a1f9190618a2e565b92505094509492505050565b6040805160608181019092526116679080614a4a868960808401619a61565b60405160208183030381529060405281526020018688604051602001614a71929190619a61565b6040516020818303038152906040528152602001617b16815250836166d2565b606082516001600160401b0381118015614aaa57600080fd5b50604051908082528060200260200182016040528015614ad4578160200160208202803683370190505b50905060005b835181146130a9577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316848281518110614b1857fe5b60200260200101516001600160a01b031614614b6257614b5d83858381518110614b3e57fe5b60200260200101516001600160a01b0316617b5d90919063ffffffff16565b614b6e565b826001600160a01b0316315b828281518110614b7a57fe5b6020908102919091010152600101614ada565b6040805160608181019092526116679080614bac868960808401619a61565b60405160208183030381529060405281526020018688604051602001614bd3929190619a61565b6040516020818303038152906040528152602001617c27815250836166d2565b6060614bff8385616085565b8151806001600160401b0381118015614c1757600080fd5b50604051908082528060200260200182016040528015614c41578160200160208202803683370190505b50915060006001600160a01b03861615614c6457614c5f878761617c565b614c67565b60005b905060006001600160a01b03861615614c8957614c84888761617c565b614c8c565b60005b905060005b838110156113915760016001600160a01b038816614ce257614cc1846395b68fe760e01b89858151811061129557fe5b878481518110614ccd57fe5b60200260200101819350828152505050614d7c565b6001600160a01b038916614d0857614cc18363cd7724c360e01b89858151811061129557fe5b6000614d22856395b68fe760e01b8a868151811061129557fe5b925090508015614d5f57614d3e8463cd7724c360e01b836161fb565b888581518110614d4a57fe5b60200260200101819450828152505050614d7a565b6000878481518110614d6d57fe5b6020026020010181815250505b505b801580614d9c5750858281518110614d9057fe5b60200260200101516000145b15614da75750611391565b50600101614c91565b8051606090806001600160401b0381118015614dcb57600080fd5b50604051908082528060200260200182016040528015614df5578160200160208202803683370190505b50915060005b81811015611dc557856001600160a01b0316631f00ca74620249f0868481518110614e2257fe5b6020026020010151886040518463ffffffff1660e01b8152600401614e4892919061a338565b60006040518083038187803b158015614e6057600080fd5b5086fa93505050508015614e9657506040513d6000823e601f3d908101601f19168201604052614e93919081019061920b565b60015b614ec4573d808015611d5e576040519150601f19603f3d011682016040523d82523d6000602084013e611d63565b80600081518110614ed157fe5b6020026020010151848381518110614ee557fe5b602002602001018181525050838281518110614efd57fe5b602002602001015160001415614f135750611dc5565b50600101614dfb565b6000606080614f2b8587616085565b614f36878787617681565b925082614f4257610f7d565b60405163276fdad960e11b81523090634edfb5b290614f6b908a9087908b908b9060040161a20a565b60006040518083038186803b158015614f8357600080fd5b505afa158015614f97573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052614fbf9190810190619275565b608088018190528451909250806001600160401b0381118015614fe157600080fd5b5060405190808252806020026020018201604052801561500b578160200160208202803683370190505b50915060005b818110156150f6576000306001600160a01b031663f1ed7fa48b8b8b8b878151811061503957fe5b60200260200101516040518563ffffffff1660e01b8152600401615060949392919061a1d4565b60206040518083038186803b15801561507857600080fd5b505afa15801561508c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906150b0919061925d565b9050808483815181106150bf57fe5b6020026020010181815250508382815181106150d757fe5b6020026020010151600014156150ed57506150f6565b50600101615011565b50509450945094915050565b73e9db8717bc5dfb20aaf538b4a5a02b7791ff430c81565b60008060606151298587616085565b615135888888886178cf565b935091506001600160a01b03821661514c576148d0565b8351806001600160401b038111801561516457600080fd5b5060405190808252806020026020018201604052801561518e578160200160208202803683370190505b5060408051606081019091529092506151fb90806151b28987891560808501619b04565b60405160208183030381529060405281526020018986886040516020016151db93929190619b04565b6040516020818303038152906040528152602001617a24815250866166d2565b915050955095509592505050565b60008060606152188587616085565b8351806001600160401b038111801561523057600080fd5b5060405190808252806020026020018201604052801561525a578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c69061528d908a908a90600401619a61565b60206040518083038186803b1580156152a557600080fd5b505afa1580156152b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906152dd9190618a2e565b925060006001600160a01b038416156152fb5750600193508661539a565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c69061532c908a908c90600401619a61565b60206040518083038186803b15801561534457600080fd5b505afa158015615358573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061537c9190618a2e565b93506001600160a01b038416615393575050610f7d565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b1580156153d357600080fd5b505afa1580156153e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061540b919061923d565b615416575050610f7d565b61548e60405180606001604052808987858e6020015160405160200161543f9493929190619a7b565b60405160208183030381529060405281526020018a87858e6020015160405160200161546e9493929190619a7b565b60405160208183030381529060405281526020016168e4815250876166d2565b925050509450945094915050565b606083516001600160401b03811180156154b557600080fd5b506040519080825280602002602001820160405280156154df578160200160208202803683370190505b50905060005b84518114610ddc577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031685828151811061552357fe5b60200260200101516001600160a01b03161461556f5761556a848487848151811061554a57fe5b60200260200101516001600160a01b0316617cdc9092919063ffffffff16565b615572565b60005b82828151811061557e57fe5b60209081029190910101526001016154e5565b8051606090806001600160401b03811180156155ac57600080fd5b506040519080825280602002602001820160405280156155d6578160200160208202803683370190505b50915060005b81811015611c4057866001600160a01b031663838e6a22620493e0888888868151811061560557fe5b60200260200101516040518563ffffffff1660e01b815260040161562b93929190619b5c565b60206040518083038187803b15801561564357600080fd5b5086fa93505050508015615674575060408051601f3d908101601f191682019092526156719181019061925d565b60015b6156a2573d808015611bf0576040519150601f19603f3d011682016040523d82523d6000602084013e611bf5565b808483815181106156af57fe5b602002602001018181525050506001016155dc565b6000846080015151600014156156dc575060006115f9565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b031614615716578661572c565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b03161461574f5786615765565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b815260040161578d959493929190619b80565b60206040518083038187803b1580156157a557600080fd5b5086fa935050505080156157d6575060408051601f3d908101601f191682019092526157d39181019061925d565b60015b615814573d808015615804576040519150601f19603f3d011682016040523d82523d6000602084013e615809565b606091505b5060009150506115f9565b600061581f85617da8565b60ff169050600061582f87617da8565b60ff169050670de0b6b3a764000081600a0a83600a0a878602028161585057fe5b048161585857fe5b0493505050506115f9565b600060606158718486616085565b8251806001600160401b038111801561588957600080fd5b506040519080825280602002602001820160405280156158b3578160200160208202803683370190505b50915061591e604051806060016040528089886040516020016158d7929190619a61565b604051602081830303815290604052815260200189896040516020016158fe929190619a61565b6040516020818303038152906040528152602001617db3815250856166d2565b60405163901754d760e01b81529092506001600160a01b0388169063901754d7906149cf9089908990600401619a61565b6159576182ea565b61595f6182ea565b6000198060005b86518114615a5b57615996602088838151811061597f57fe5b60200260200101515103878984815181106137a657fe5b60006060306001600160a01b03168984815181106159b057fe5b60200260200101516040516159c59190619a18565b6000604051808303816000865af19150503d8060008114615a02576040519150601f19603f3d011682016040523d82523d6000602084013e615a07565b606091505b50915091508115615a51576000615a2b60208351038361762190919063ffffffff16565b9050600081118015615a3c57508481105b15615a4f57838752602087018290529350835b505b5050600101615966565b50600019811415615a6c5750613971565b60005b8751811461396e57615a9f6020898381518110615a8857fe5b60200260200101515103838a84815181106137a657fe5b60006060306001600160a01b03168a8481518110615ab957fe5b6020026020010151604051615ace9190619a18565b6000604051808303816000865af19150503d8060008114615b0b576040519150601f19603f3d011682016040523d82523d6000602084013e615b10565b606091505b50915091508115615b5a576000615b3460208351038361762190919063ffffffff16565b9050600081118015615b4557508581105b15615b5857838852602088018290529450845b505b5050600101615a6f565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b158015615ba157600080fd5b505afa158015615bb5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615bd99190618a2e565b905060018351036001600160401b0381118015615bf557600080fd5b50604051908082528060200260200182016040528015615c1f578160200160208202803683370190505b50915060005b8251811015615e4a576060826001600160a01b0316635b1dc86f620249f0878581518110615c4f57fe5b6020026020010151888660010181518110615c6657fe5b60200260200101516040518463ffffffff1660e01b8152600401615c8b929190619a61565b60006040518083038187803b158015615ca357600080fd5b5086fa93505050508015615cd957506040513d6000823e601f3d908101601f19168201604052615cd69190810190618e22565b60015b615d28573d808015615d07576040519150601f19603f3d011682016040523d82523d6000602084013e615d0c565b606091505b50506040805160008152602081019091529350615e4d92505050565b6000600182511015615d555760405162461bcd60e51b8152600401615d4c9061a135565b60405180910390fd5b60005b8251811015615e3e576000838281518110615d6f57fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015615daf57600080fd5b505afa158015615dc3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615de7919061925d565b905082811115615e3557809250838281518110615e0057fe5b6020026020010151888781518110615e1457fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101615d58565b50505050600101615c25565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b158015615ea757600080fd5b505afa158015615ebb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615edf919061925d565b6040518263ffffffff1660e01b8152600401615efb9190619eb5565b60206040518083038186803b158015615f1357600080fd5b505afa158015615f27573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615f4b9190618a2e565b915085602001515160001415615f605761607c565b6000805b87602001515181101561607957600288602001518281518110615f8357fe5b6020026020010151511015615f9757616071565b836001600160a01b0316637f9c0ecd620493e08a602001518481518110615fba57fe5b60200260200101518860018a510381518110615fd257fe5b60200260200101516040518463ffffffff1660e01b8152600401615ff7929190619d6c565b60206040518083038187803b15801561600f57600080fd5b5086fa93505050508015616040575060408051601f3d908101601f1916820190925261603d9181019061925d565b60015b61604957616071565b8281111561606f578092508860200151828151811061606457fe5b602002602001015193505b505b600101615f64565b50505b94509492505050565b806001600160a01b0316826001600160a01b031614156160b75760405162461bcd60e51b8152600401615d4c9061a0ab565b5050565b6160c361827c565b50604080516080810182523080825260006020830181905292820152606081019190915290565b604080516001808252818301909252606091829190816020015b61610c618304565b8152602001906001900390816161045790505090506040518060a00160405280856000015181526020016000815260200160018152602001848152602001604051806020016040528060008152508152508160008151811061616a57fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf62906161ab908590600401619a34565b60206040518083038186803b1580156161c357600080fd5b505afa1580156161d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906140fb9190618a2e565b6000806001600160a01b03851661621157610c69565b6060856001600160a01b0316620249f086866040516024016162339190619eb5565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516162719190619a18565b6000604051808303818686fa925050503d80600081146162ad576040519150601f19603f3d011682016040523d82523d6000602084013e6162b2565b606091505b50909250905081156162d557808060200190518101906162d2919061925d565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b81526004016163149190619eb5565b60a06040518083038186803b15801561632c57600080fd5b505afa158015616340573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906163649190619797565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b0316141561648c5760006163a38964e8d4a51000617e03565b905060006163c76b033b2e3c9fd0803ce80000006163c18885617e39565b90617e03565b90508481106163df5760009650505050505050616595565b600061646e670de0b6b3a76400006164688c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561642957600080fd5b505afa15801561643d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616461919061925d565b8690617e03565b90617e55565b9050600061647c8483617e7f565b9850616595975050505050505050565b8a604001516001600160a01b03168a6001600160a01b0316141561658c5787848111156164c157600095505050505050616595565b60006164dd6b033b2e3c9fd0803ce80000006163c18885617e7f565b90508381116164f55760009650505050505050616595565b600061657a8a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b15801561653357600080fd5b505afa158015616547573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061656b919061925d565b670de0b6b3a764000090617e39565b9050600061647c826164688688617e03565b60009450505050505b9695505050505050565b6000806165aa618336565b858060200190518101906165be9190619309565b915091506000858060200190518101906165d891906192ed565b905060006060306322db5ed160e21b8587866165f38c617e9e565b604051602401616606949392919061a16c565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516166449190619a18565b600060405180830381855afa9150503d806000811461667f576040519150601f19603f3d011682016040523d82523d6000602084013e616684565b606091505b50915091508161669c576000955050505050506140fb565b808060200190518101906166b0919061920b565b6000815181106166bc57fe5b6020026020010151955050505050509392505050565b606081516001600160401b03811180156166eb57600080fd5b50604051908082528060200260200182016040528015616715578160200160208202803683370190505b50905081516000141561672757615e4d565b6000616758846000015185602001518560008151811061674357fe5b6020026020010151876040015163ffffffff16565b9050806167655750615e4d565b60006167828560200151866000015184886040015163ffffffff16565b905080616790575050615e4d565b60005b84518110156168db576000805b6005811015616884576167c78784815181106167b857fe5b60200260200101518587617edf565b9450846167d357616884565b6167e261271561271087617edf565b9450846167ee57616884565b600061680b89602001518a60000151888c6040015163ffffffff16565b9050806168185750616884565b80945087848151811061682757fe5b6020026020010151851061687b5787848151811061684157fe5b602002602001015161271089868151811061685857fe5b60200260200101518703028161686a57fe5b0492506005831161687b5750616884565b506001016167a0565b508015806168925750600581115b1561689d57506168db565b6168bb8683815181106168ac57fe5b60200260200101518486617edf565b8583815181106168c757fe5b602090810291909101015250600101616793565b50505092915050565b6000806000806000878060200190518101906169009190618a83565b9350935093509350816001600160a01b0316846001600160a01b031614156169ea576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e090616953908a90600401619eb5565b60206040518083038187803b15801561696b57600080fd5b5086fa9350505050801561699c575060408051601f3d908101601f191682019092526169999181019061925d565b60015b6169de573d8080156169ca576040519150601f19603f3d011682016040523d82523d6000602084013e6169cf565b606091505b506000955050505050506140fb565b94506140fb9350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e0906169539087908b90600401619a48565b60606002828451031015616a435760405162461bcd60e51b8152600401615d4c9061a067565b616a4b618356565b5060408051606080820183526101f48252610bb860208301526127108284015282516003808252608082019094529192909190816020016020820280368337019050509050600080868681518110616a9f57fe5b602002602001015190506000878760010181518110616aba57fe5b6020026020010151905060005b6003811015616baf5760008a6001600160a01b0316631698ee8285858a8660038110616aef57fe5b60200201516040518463ffffffff1660e01b8152600401616b1293929190619efd565b60206040518083038186803b158015616b2a57600080fd5b505afa158015616b3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616b629190618a2e565b9050616b6d81617f37565b15616ba65780868680600101975081518110616b8557fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616ac7565b50505080616bbf575050506140fb565b8551856002011415616cb557806001600160401b0381118015616be157600080fd5b50604051908082528060200260200182016040528015616c1557816020015b6060815260200190600190039081616c005790505b50935060005b81811015616cac57604080516001808252818301909252906020808301908036833701905050858281518110616c4d57fe5b6020026020010181905250828181518110616c6457fe5b6020026020010151858281518110616c7857fe5b6020026020010151600081518110616c8c57fe5b6001600160a01b0390921660209283029190910190910152600101616c1b565b505050506140fb565b6060616cc5888888600101616a1d565b9050805160001415616cda57505050506140fb565b805182026001600160401b0381118015616cf357600080fd5b50604051908082528060200260200182016040528015616d2757816020015b6060815260200190600190039081616d125790505b50945060005b82811015616ea75760005b8251811015616e9e578251828102820190849083908110616d5557fe5b6020026020010151516001016001600160401b0381118015616d7657600080fd5b50604051908082528060200260200182016040528015616da0578160200160208202803683370190505b50888281518110616dad57fe5b6020026020010181905250858381518110616dc457fe5b6020026020010151888281518110616dd857fe5b6020026020010151600081518110616dec57fe5b60200260200101906001600160a01b031690816001600160a01b03168152505060005b848381518110616e1b57fe5b602002602001015151811015616e9457848381518110616e3757fe5b60200260200101518181518110616e4a57fe5b6020026020010151898381518110616e5e57fe5b60200260200101518260010181518110616e7457fe5b6001600160a01b0390921660209283029190910190910152600101616e0f565b5050600101616d38565b50600101616d2d565b50505050509392505050565b60606002835110158015616ecb575081516001018351145b616ee75760405162461bcd60e51b8152600401615d4c9061a0f0565b81516003028351601402016001600160401b0381118015616f0757600080fd5b506040519080825280601f01601f191660200182016040528015616f32576020820181803683370190505b5090506020810160005b8451811015615e4a578015616fe1576000846001830381518110616f5c57fe5b60200260200101516001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b158015616f9c57600080fd5b505afa158015616fb0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616fd4919061971c565b60e81b8352506003909101905b6000858281518110616fef57fe5b602090810291909101015160601b835250601490910190600101616f3c565b6000828202831580159061702b57508284828161702757fe5b0414155b1561703a576000915050615e4d565b6706f05b59d3b2000081018181101561705857600092505050615e4d565b670de0b6b3a76400009004949350505050565b606081516001600160401b038111801561708457600080fd5b506040519080825280602002602001820160405280156170ae578160200160208202803683370190505b50905060005b825181101561319c578260018285510303815181106170cf57fe5b60200260200101518282815181106170e357fe5b6001600160a01b03909216602092830291909101909101526001016170b4565b606081516001600160401b038111801561711c57600080fd5b50604051908082528060200260200182016040528015617146578160200160208202803683370190505b50905060005b825181101561319c5782600182855103038151811061716757fe5b602002602001015182828151811061717b57fe5b6001600160a01b039092166020928302919091019091015260010161714c565b6000806000858060200190518101906171b49190618a4a565b915091506000858060200190518101906171ce9190618a2e565b90503063e8e4af098385846171e28a617e9e565b6040518563ffffffff1660e01b81526004016172019493929190619aa6565b60006040518083038186803b15801561721957600080fd5b505afa92505050801561724e57506040513d6000823e601f3d908101601f1916820160405261724b919081019061920b565b60015b61728f573d80801561727c576040519150601f19603f3d011682016040523d82523d6000602084013e617281565b606091505b5060009450505050506140fb565b8060008151811061729c57fe5b60200260200101519450505050506140fb565b60006115f9836164686172c3826001617e7f565b6172cd8887617e03565b90617e39565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b8152506040516173119190619a18565b600060405180830381855afa9150503d806000811461734c576040519150601f19603f3d011682016040523d82523d6000602084013e617351565b606091505b509150915081801561736557506020815110155b1561737857617375816000617621565b92505b5050919050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b81526004016173b59190619eb5565b60a06040518083038186803b1580156173cd57600080fd5b505afa1580156173e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906174059190619797565b945094505050925089604001516001600160a01b0316886001600160a01b0316141561751c57600087905060006174b5886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561746e57600080fd5b505afa158015617482573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906174a6919061925d565b670de0b6b3a764000090617e7f565b905060006174cf8261646885670de0b6b3a7640000617e03565b905060006174ed6b033b2e3c9fd0803ce80000006163c18985617e39565b9050858110617506576000975050505050505050616595565b600061647c60016172cd8564e8d4a51000617e55565b89604001516001600160a01b0316896001600160a01b0316141561760157600061754b8864e8d4a51000617e03565b9050600061758b886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b15801561653357600080fd5b905060006175a5670de0b6b3a76400006164688585617e03565b9050858111156175be5760009650505050505050616595565b60006175da6b033b2e3c9fd0803ce80000006163c18985617e7f565b90508481116175f3576000975050505050505050616595565b509550616595945050505050565b5060009998505050505050505050565b61761c838383618143565b505050565b60006140fb838361816a565b600080617638618336565b8580602001905181019061764c9190619309565b9150915060008580602001905181019061766691906192ed565b9050600060603063205e01d760e11b8587866165f38c617e9e565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b0316146176bf57866176d5565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b0316146176f8578661770e565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b1690915261774292919060019060248101619b28565b60006040518083038186803b15801561775a57600080fd5b505afa15801561776e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526177969190810190618eba565b5050905080518660000151106177b25750600091506140fb9050565b808660000151815181106177c257fe5b6020026020010151925060f883901c60001c60bb1415611dc55750600091506140fb9050565b6000806177f3618374565b848060200190518101906178079190618b31565b915091506000868060200190518101906178219190618b31565b50604051633c7b5fe960e21b8152909150309063f1ed7fa49061784e908590859088908b9060040161a1d4565b60206040518083038186803b15801561786657600080fd5b505afa925050508015617896575060408051601f3d908101601f191682019092526178939181019061925d565b60015b6178c4573d80801561727c576040519150601f19603f3d011682016040523d82523d6000602084013e617281565b93506140fb92505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b8152600401617902929190619a61565b60006040518083038186803b15801561791a57600080fd5b505afa15801561792e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526179569190810190618e22565b9050600191508051600014156179ef576040516315e8a07760e21b81526001600160a01b038816906357a281dc906179949087908990600401619a61565b60006040518083038186803b1580156179ac57600080fd5b505afa1580156179c0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526179e89190810190618e22565b9050600091505b80518610617a0457600080925092505061607c565b808681518110617a1057fe5b602002602001015192505094509492505050565b60008060008086806020019051810190617a3e9190618ae1565b9250925092508015617ae257604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e090617a7e906000908a90600401619a48565b604080518083038187803b158015617a9557600080fd5b5086fa93505050508015617ac6575060408051601f3d908101601f19168201909252617ac39181019061973f565b60015b617ad657600093505050506140fb565b5093506140fb92505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e090617a7e906000908a90600401619a48565b600080600085806020019051810190617b2f9190618a4a565b91509150600085806020019051810190617b499190618a2e565b9050306330d6570d8385846171e28a617e9e565b6000806060846001600160a01b03166370a0823160e01b85604051602401617b859190619a34565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051617bc39190619a18565b600060405180830381855afa9150503d8060008114617bfe576040519150601f19603f3d011682016040523d82523d6000602084013e617c03565b606091505b5091509150818015617c1757506020815110155b15615e4a57611667816000617621565b600080600085806020019051810190617c409190618a4a565b91509150600085806020019051810190617c5a9190618a2e565b90503063a469841762061a80848685617c728b617e9e565b6040518663ffffffff1660e01b8152600401617c919493929190619aa6565b60006040518083038187803b158015617ca957600080fd5b5086fa9350505050801561724e57506040513d6000823e601f3d908101601f1916820160405261724b919081019061920b565b6000806060856001600160a01b031663dd62ed3e60e01b8686604051602401617d06929190619a61565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051617d449190619a18565b600060405180830381855afa9150503d8060008114617d7f576040519150601f19603f3d011682016040523d82523d6000602084013e617d84565b606091505b5091509150818015617d9857506020815110155b15611dc557616595816000617621565b6000615e4d82618194565b600080600085806020019051810190617dcc9190618a4a565b9150915060008086806020019051810190617de79190618a4a565b91509150617df784848389614228565b98975050505050505050565b600082617e1257506000615e4d565b82820282848281617e1f57fe5b04146140fb576140fb617e34600186866181fb565b618255565b6000828201838110156140fb576140fb617e34600086866181fb565b600081617e6b57617e6b617e34600385856181fb565b6000828481617e7657fe5b04949350505050565b600082821115617e9857617e98617e34600285856181fb565b50900390565b604080516001808252818301909252606091602080830190803683370190505090508181600081518110617ece57fe5b602002602001018181525050919050565b6000831580617eec575081155b80617ef5575082155b15617f02575060006140fb565b83820282858281617f0f57fe5b0414617f1f5760009150506140fb565b8360018503820181617f2d57fe5b0495945050505050565b6000813b80617f4a576000915050610f8c565b50816001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b158015617f8457600080fd5b505afa158015617f98573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617fbc9190618a2e565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401617fe79190619a34565b60206040518083038186803b158015617fff57600080fd5b505afa158015618013573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190618037919061925d565b61804357506000610f8c565b816001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b15801561807c57600080fd5b505afa158015618090573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906180b49190618a2e565b6001600160a01b03166370a08231836040518263ffffffff1660e01b81526004016180df9190619a34565b60206040518083038186803b1580156180f757600080fd5b505afa15801561810b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061812f919061925d565b61813b57506000610f8c565b506001919050565b816020018351101561816257618162617e34600585518560200161825d565b910160200152565b6000816020018351101561818b5761818b617e34600585518560200161825d565b50016020015190565b60006001600160a01b03821673c02aaa39b223fe8d0a0e5c4f27ead9083c756cc214156181c357506012610f8c565b6000826040516020016181d691906199eb565b60408051808303601f190181529190528051602090910120600f166004019392505050565b606063e946c1bb60e01b84848460405160240161821a93929190619f49565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b84848460405160240161821a93929190619f6a565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b60408051808201909152606081526000602082015290565b604051806040016040528060008152602001606081525090565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b60405180606001604052806003906020820280368337509192915050565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b8035615e4d8161a495565b8051615e4d8161a495565b60008083601f8401126183e5578182fd5b5081356001600160401b038111156183fb578182fd5b602083019150836020808302850101111561841557600080fd5b9250929050565b600082601f83011261842c578081fd5b813561843f61843a8261a40e565b61a3e8565b81815291506020808301908481018184028601820187101561846057600080fd5b60005b848110156184885781356184768161a495565b84529282019290820190600101618463565b505050505092915050565b600082601f8301126184a3578081fd5b81356184b161843a8261a40e565b818152915060208083019084810160005b84811015618488576184d9888484358a0101618682565b845292820192908201906001016184c2565b600082601f8301126184fb578081fd5b813561850961843a8261a40e565b81815291506020808301908481018184028601820187101561852a57600080fd5b60005b848110156184885781356185408161a495565b8452928201929082019060010161852d565b600082601f830112618562578081fd5b813561857061843a8261a40e565b818152915060208083019084810160808085028701830188101561859357600080fd5b60005b858110156185ba576185a88984618981565b85529383019391810191600101618596565b50505050505092915050565b600082601f8301126185d6578081fd5b81356185e461843a8261a40e565b81815291506020808301908481018184028601820187101561860557600080fd5b60005b8481101561848857813584529282019290820190600101618608565b600082601f830112618634578081fd5b815161864261843a8261a40e565b81815291506020808301908481018184028601820187101561866357600080fd5b60005b8481101561848857815184529282019290820190600101618666565b600082601f830112618692578081fd5b81356186a061843a8261a42d565b91508082528360208285010111156186b757600080fd5b8060208401602084013760009082016020015292915050565b600082601f8301126186e0578081fd5b81516186ee61843a8261a42d565b915080825283602082850101111561870557600080fd5b6130a981602084016020860161a45b565b805160028110615e4d57600080fd5b600060608284031215618736578081fd5b618740606061a3e8565b9050813561874d8161a495565b8152602082013561875d8161a4aa565b602082015260408201356187708161a4aa565b604082015292915050565b60006060828403121561878c578081fd5b618796606061a3e8565b905081516187a38161a495565b815260208201516187b38161a4aa565b602082015260408201516187708161a4aa565b6000604082840312156187d7578081fd5b6187e1604061a3e8565b905081356187ee8161a495565b815260208201356187fe8161a495565b602082015292915050565b600060a0828403121561881a578081fd5b61882460a061a3e8565b90508135815260208201356188388161a495565b6020820152604082013561884b8161a495565b6040820152606082013561885e8161a495565b606082015260808201356001600160401b0381111561887c57600080fd5b61888884828501618682565b60808301525092915050565b60006101808083850312156188a7578182fd5b6188b08161a3e8565b9150506188bd83836183be565b81526188cc83602084016183be565b60208201526188de83604084016189e4565b60408201526188f083606084016189e4565b606082015261890283608084016189e4565b60808201526189148360a084016183be565b60a08201526189268360c084016183be565b60c08201526189388360e084016183be565b60e082015261010061894c848285016183be565b90820152610120828101359082015261014061896a848285016189fb565b818301525061016080830135818301525092915050565b600060808284031215618992578081fd5b61899c608061a3e8565b90508135600481106189ad57600080fd5b8152602082013560ff811681146189c357600080fd5b80602083015250604082013560408201526060820135606082015292915050565b80356001600160801b0381168114615e4d57600080fd5b80356001600160401b0381168114615e4d57600080fd5b600060208284031215618a23578081fd5b81356140fb8161a495565b600060208284031215618a3f578081fd5b81516140fb8161a495565b60008060408385031215618a5c578081fd5b8251618a678161a495565b6020840151909250618a788161a495565b809150509250929050565b60008060008060808587031215618a98578182fd5b8451618aa38161a495565b6020860151909450618ab48161a495565b6040860151909350618ac58161a495565b6060860151909250618ad68161a495565b939692955090935050565b600080600060608486031215618af5578081fd5b8351618b008161a495565b6020850151909350618b118161a495565b60408501519092508015158114618b26578182fd5b809150509250925092565b60008060408385031215618b43578182fd5b8251618b4e8161a495565b60208401519092506001600160401b0380821115618b6a578283fd5b9084019060a08287031215618b7d578283fd5b618b8760a061a3e8565b82518152618b9887602085016183c9565b6020820152618baa87604085016183c9565b6040820152618bbc87606085016183c9565b6060820152608083015182811115618bd2578485fd5b618bde888286016186d0565b6080830152508093505050509250929050565b600080600080600060a08688031215618c08578283fd5b8535618c138161a495565b94506020860135618c238161a495565b93506040860135618c338161a495565b92506060860135618c438161a495565b915060808601356001600160401b03811115618c5d578182fd5b618c69888289016185c6565b9150509295509295909350565b60008060008060808587031215618c8b578182fd5b8435618c968161a495565b93506020850135618ca68161a495565b92506040850135618cb68161a495565b915060608501356001600160401b03811115618cd0578182fd5b618cdc878288016185c6565b91505092959194509250565b60008060008060808587031215618cfd578182fd5b8435618d088161a495565b93506020850135618d188161a495565b92506040850135618d288161a495565b9396929550929360600135925050565b600080600060608486031215618d4c578081fd5b8335618d578161a495565b925060208401356001600160401b0380821115618d72578283fd5b618d7e8783880161841c565b93506040860135915080821115618d93578283fd5b50618da0868287016185c6565b9150509250925092565b600080600080600060a08688031215618dc1578283fd5b8535618dcc8161a495565b9450602086013593506040860135618c338161a495565b60008060208385031215618df5578182fd5b82356001600160401b03811115618e0a578283fd5b618e16858286016183d4565b90969095509350505050565b60006020808385031215618e34578182fd5b82516001600160401b03811115618e49578283fd5b8301601f81018513618e59578283fd5b8051618e6761843a8261a40e565b8181528381019083850185840285018601891015618e83578687fd5b8694505b83851015618eae578051618e9a8161a495565b835260019490940193918501918501618e87565b50979650505050505050565b600080600060608486031215618ece578081fd5b83516001600160401b0380821115618ee4578283fd5b818601915086601f830112618ef7578283fd5b8151618f0561843a8261a40e565b80828252602080830192508086018b828387028901011115618f25578788fd5b8796505b84871015618f47578051845260019690960195928101928101618f29565b508901519097509350505080821115618f5e578283fd5b50618f6b86828701618624565b925050618f7b8560408601618716565b90509250925092565b600080600060608486031215618f98578081fd5b83356001600160401b0380821115618fae578283fd5b618fba87838801618493565b94506020860135915080821115618fcf578283fd5b50618fdc86828701618493565b925050604084013590509250925092565b600060208284031215618ffe578081fd5b81356001600160401b03811115619013578182fd5b6115f9848285016184eb565b60008060408385031215619031578182fd5b82356001600160401b03811115619046578283fd5b619052858286016184eb565b9250506020830135618a788161a495565b600080600060608486031215619077578081fd5b83356001600160401b0381111561908c578182fd5b619098868287016184eb565b93505060208401356190a98161a495565b91506040840135618b268161a495565b600060208083850312156190cb578182fd5b82516001600160401b038111156190e0578283fd5b8301601f810185136190f0578283fd5b80516190fe61843a8261a40e565b818152838101908385018584028501860189101561911a578687fd5b8694505b83851015618eae57805183526001949094019391850191850161911e565b600080600060608486031215619150578081fd5b83356001600160401b0380821115619166578283fd5b818601915086601f830112619179578283fd5b813561918761843a8261a40e565b80828252602080830192508086016101808c838288028a010111156191aa578889fd5b8897505b858810156191d6576191c08d83618894565b85526001979097019693820193908101906191ae565b509198508901359450505050808211156191ee578283fd5b506191fb86828701618552565b925050618f7b85604086016183be565b60006020828403121561921c578081fd5b81516001600160401b03811115619231578182fd5b6115f984828501618624565b60006020828403121561924e578081fd5b815180151581146140fb578182fd5b60006020828403121561926e578081fd5b5051919050565b600060208284031215619286578081fd5b81516001600160401b0381111561929b578182fd5b6115f9848285016186d0565b6000806000606084860312156192bb578081fd5b83356192c68161a495565b925060208401356001600160401b03808211156192e1578283fd5b618d7e878388016184eb565b6000602082840312156192fe578081fd5b81516140fb8161a4c0565b6000806080838503121561931b578182fd5b82516193268161a4c0565b9150619335846020850161877b565b90509250929050565b60008060008084860360a0811215619354578283fd5b6040811215619361578283fd5b5061936c604061a3e8565b85358152602086013561937e8161a495565b6020820152935060408501356193938161a495565b925060608501356193a38161a495565b915060808501356001600160401b03811115618cd0578182fd5b600080600080608085870312156193d2578182fd5b84356001600160401b03808211156193e8578384fd5b90860190604082890312156193fb578384fd5b619405604061a3e8565b82356194108161a495565b815260208381013583811115619424578687fd5b80850194505089601f850112619438578586fd5b833561944661843a8261a40e565b81815282810190868401895b8481101561947b576194698f8784358c010161841c565b84529285019290850190600101619452565b505080848601525050508197506194948a828b016183be565b965050506194a588604089016183be565b935060608701359150808211156194ba578283fd5b50618cdc878288016185c6565b60008060008060c085870312156194dc578182fd5b6194e68686618725565b935060608501356194f68161a4c0565b925060808501356195068161a4c0565b915060a08501356001600160401b03811115618cd0578182fd5b60008060008060a08587031215619535578182fd5b61953f86866187c6565b935060408501356193938161a495565b60008060008060808587031215619564578182fd5b84356001600160401b038082111561957a578384fd5b61958688838901618809565b9550602087013591506195988261a495565b9093506040860135906195aa8261a495565b909250606086013590808211156194ba578283fd5b600080600080608085870312156195d4578182fd5b84356001600160401b038111156195e9578283fd5b6195f587828801618809565b9450506020850135618d188161a495565b6000806000806080858703121561961b578182fd5b84356001600160401b03811115619630578283fd5b61963c87828801618809565b9450506020850135925060408501356196548161a495565b91506060850135618ad68161a495565b60008060006102208486031215619679578081fd5b6196838585618894565b9250619693856101808601618981565b9150610200840135618b268161a495565b60008060008084860360c08112156196ba578283fd5b60608112156196c7578283fd5b506196d2606061a3e8565b85356196dd8161a495565b81526020868101359082015260408601356196f78161a495565b60408201529350606085013561970c8161a495565b925060808501356195068161a495565b60006020828403121561972d578081fd5b815162ffffff811681146140fb578182fd5b60008060408385031215619751578182fd5b505080516020909101519092909150565b60008060008060808587031215619777578182fd5b505082516020840151604085015160609095015191969095509092509050565b600080600080600060a086880312156197ae578283fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b6001600160a01b0316815260200190565b600081518352602082015160208401526040820151604084015260608201516060840152608082015160a060808501526115f960a08501826198a3565b6001600160a01b03169052565b6000815180845260208085019450808401835b838110156198695781516001600160a01b031687529582019590820190600101619844565b509495945050505050565b6000815180845260208085019450808401835b8381101561986957815187529582019590820190600101619887565b600081518084526198bb81602086016020860161a45b565b601f01601f19169290920160200192915050565b80516001600160a01b031682526020808201516001600160e01b03199081169184019190915260409182015116910152565b80516001600160a01b039081168352602080830151151590840152604080830151909116908301526060908101511515910152565b6000815183526020820151604060208501526115f960408501826198a3565b600081518352602082015160018060a01b0380821660208601528060408501511660408601528060608501511660608601525050608082015160a060808501526115f960a08501826198a3565b80516199ad8161a48b565b825260208181015160ff169083015260408082015190830152606090810151910152565b6001600160801b03169052565b6001600160401b03169052565b60609190911b6bffffffffffffffffffffffff1916815260140190565b6000828483379101908152919050565b60008251619a2a81846020870161a45b565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03948516815292841660208401529083166040830152909116606082015260800190565b6001600160a01b03858116825284811660208301528316604082015260806060820181905260009061659590830184619874565b6001600160a01b039485168152928416602084015292166040820152606081019190915260800190565b6001600160a01b039384168152919092166020820152901515604082015260600190565b6001600160a01b038581168252841660208201528215156040820152608060608201819052600090616595908301846198a3565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090619bba908301846198a3565b979650505050505050565b6001600160a01b0384168152606060208201819052600090619be990830185619831565b82810360408401526165958185619874565b6001600160a01b03851681526000619c128561a48b565b84602083015260806040830152619c2c6080830185619874565b8281036060840152619bba8185619874565b6001600160a01b03898116825260009061010090619c5b8b61a48b565b8a6020850152816040850152619c738285018b619874565b91508382036060850152619c87828a619874565b90881660808501529050619c9a8661a48b565b8560a084015282810360c0840152619cb28186619874565b905082810360e0840152619cc68185619874565b9b9a5050505050505050505050565b6001600160a01b03831681526040602082018190526000906115f990830184619955565b60208082528181018390526000908460408401835b86811015619d3c578235619d218161a495565b6001600160a01b031682529183019190830190600101619d0e565b509695505050505050565b600060408252619d5a6040830185619831565b82810360208401526116678185619874565b600060408252619d7f6040830185619831565b90508260208301529392505050565b60006040820160408352808551808352606085019150602092506060838202860101838801855b83811015619de357605f19888403018552619dd18383516198a3565b94860194925090850190600101619db5565b505085810384870152617df78188619874565b60208082528251828201819052600091906040908185019080840286018301878501865b83811015619e5d57888303603f1901855281518051878552619e3e888601826198a3565b9189015115159489019490945294870194925090860190600101619e1a565b509098975050505050505050565b6000602082526140fb6020830184619874565b901515815260200190565b83151581526001600160a01b038316602082015260606040820181905260009061166790830184619874565b90815260200190565b600084825260606020830152619be960608301856198a3565b6000602082526140fb60208301846198a3565b600060408252619d7f60408301856198a3565b6001600160a01b03938416815291909216602082015262ffffff909116604082015260600190565b6001600160a01b03831681526040602082018190526000906115f990830184619874565b60608101619f568561a48b565b938152602081019290925260409091015290565b6060810160088510619f5657fe5b600060e08201619f878761a450565b8352602060e081850152818751619f9e8185619eb5565b91508193508281028201838a01865b83811015619fd7578683038552619fc58383516197e7565b94860194925090850190600101619fad565b5050868103604088015280945088519250619ff28382619eb5565b94505050818701845b8281101561a01c5761a00e8583516197d6565b945090830190600101619ffb565b50505050809150506116676060830184619901565b600f93840b81529190920b6020820152604081019190915260600190565b600f83900b8152608081016140fb60208301846198cf565b60208082526024908201527f556e6973776170563353616d706c65722f746f6b656e5061746820746f6f20736040820152631a1bdc9d60e21b606082015260800190565b60208082526025908201527f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e6040820152642fa820a4a960d91b606082015260800190565b60208082526025908201527f556e6973776170563353616d706c65722f696e76616c69642070617468206c656040820152646e6774687360d81b606082015260800190565b6020808252601e908201527f4b79626572444d4d53616d706c65722f4e4f5f504f4f4c535f464f554e440000604082015260600190565b600061a17882876198cf565b84600f0b606083015283600f0b608083015260c060a083015261659560c0830184619874565b60006060825261a1b16060830186619936565b828103602084015261a1c38186619936565b915050826040830152949350505050565b60006080825261a1e76080830187619955565b6001600160a01b0395861660208401529390941660408201526060015292915050565b60006080825261a21d6080830187619955565b6020830195909552506001600160a01b0392831660408201529116606090910152919050565b60006102208201905061a257828651619824565b602085015161a2696020840182619824565b50604085015161a27c60408401826199d1565b50606085015161a28f60608401826199d1565b50608085015161a2a260808401826199d1565b5060a085015161a2b560a0840182619824565b5060c085015161a2c860c0840182619824565b5060e085015161a2db60e0840182619824565b506101008086015161a2ef82850182619824565b505061012085810151908301526101408086015161a30f828501826199de565b5050610160858101519083015261a32a6101808301856199a2565b6115f9610200830184619824565b6000838252604060208301526115f96040830184619831565b60008482526060602083015261a36a6060830185619831565b82810360408401526165958185619831565b958652602086019490945260408501929092526060840152608083015260a082015260c00190565b6000808335601e1984360301811261a3ba578283fd5b8301803591506001600160401b0382111561a3d3578283fd5b60200191503681900382131561841557600080fd5b6040518181016001600160401b038111828210171561a40657600080fd5b604052919050565b60006001600160401b0382111561a423578081fd5b5060209081020190565b60006001600160401b0382111561a442578081fd5b50601f01601f191660200190565b8060028110610f8c57fe5b60005b8381101561a47657818101518382015260200161a45e565b8381111561a485576000848401525b50505050565b60048110610e2457fe5b6001600160a01b0381168114610e2457600080fd5b6001600160e01b031981168114610e2457600080fd5b80600f0b8114610e2457600080fdfea2646970667358221220ce76e8a0698d975100b2a8419178e3291794d0ad73e21e0a8412dfe6df7c7c8064736f6c634300060c0033';
TestERC20BridgeSamplerContract.contractName = 'TestERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=test_erc20_bridge_sampler.js.map