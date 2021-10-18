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
ERC20BridgeSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b50600436106102d65760003560e01c80638b6d7b4411610182578063bd71ecf6116100e9578063ddd5aa28116100a2578063f1ed7fa41161007c578063f1ed7fa4146106f5578063f3868e9c1461040e578063f5a4994d14610708578063fc9fe41b1461071b576102d6565b8063ddd5aa28146106bc578063e78ac045146106cf578063e8e4af09146106e2576102d6565b8063bd71ecf61461064a578063c25c41381461065d578063c831908414610670578063c8c74a3714610683578063cc1621c914610696578063d9bca372146106a9576102d6565b80639ea0ff131161013b5780639ea0ff13146105ca578063a0295b8b146105dd578063a4698417146105f0578063a75e744b14610603578063adc636bf14610616578063b90cd2fb14610637576102d6565b80638b6d7b441461052d5780638e5a0e07146105405780639209483b1461056257806398777748146105755780639bf3ee35146105885780639e3f05c3146105a8576102d6565b806336052391116102415780635aae4e53116101fa57806368be3cf2116101d457806368be3cf2146104d4578063706e2f9b146104f457806374c9d255146105075780637f7f4f131461051a576102d6565b80635aae4e531461049b5780635d5b674f146104ae57806366a1ac6b146104c1576102d6565b8063360523911461040e57806340bc03ae14610421578063494569db146104345780634edfb5b2146104475780635505000a1461046757806357494b1d14610488576102d6565b8063281e343211610293578063281e34321461038d57806329fa4aa0146103a05780632aa64319146103b35780632d753aa4146103d557806330d6570d146103e85780633105fec1146103fb576102d6565b80630496d5dc146102db5780631022742b14610305578063149dab0e1461032557806316279055146103475780632339078f14610367578063252322b31461037a575b600080fd5b6102ee6102e9366004618910565b61072e565b6040516102fc929190619a30565b60405180910390f35b610318610313366004618d45565b6108d4565b6040516102fc9190619b54565b610338610333366004618fc6565b610a47565b6040516102fc939291906198fc565b61035a6103553660046185f2565b610ba7565b6040516102fc9190619b67565b610318610375366004618f47565b610bb1565b61031861038836600461884e565b610dd8565b61031861039b3660046192ad565b610fae565b6103186103ae3660046190d0565b611203565b6103c66103c1366004619129565b611272565b6040516102fc93929190619b72565b6103186103e33660046187c9565b61154f565b6103186103f636600461884e565b6116d8565b610318610409366004618910565b61184c565b61031861041c366004619129565b6119d0565b61031861042f3660046190d0565b611a62565b6102ee610442366004618910565b611be3565b61045a61045536600461920f565b611d6f565b6040516102fc9190619bc0565b61047a610475366004618eb0565b611fec565b6040516102fc929190619a77565b61031861049636600461884e565b612237565b61047a6104a9366004618eb0565b612789565b6103186104bc36600461884e565b6129ce565b6103186104cf366004618d45565b612a34565b6104e76104e2366004618b14565b612ae9565b6040516102fc9190619adf565b610318610502366004618beb565b612c4a565b610338610515366004618fc6565b612d3c565b6103186105283660046192ad565b612d4b565b61031861053b3660046190d0565b612f98565b61055361054e366004618b82565b6132fb565b6040516102fc93929190619e87565b6103186105703660046190d0565b613514565b61031861058336600461884e565b613714565b61059b61059636600461926d565b613c4b565b6040516102fc9190619b9e565b6105bb6105b6366004619158565b613d92565b6040516102fc93929190619ba7565b61059b6105d83660046188c0565b613eb8565b6103186105eb366004618f47565b6140ce565b6103186105fe36600461884e565b6142ca565b6103c6610611366004618982565b61441f565b61062961062436600461884e565b61455c565b6040516102fc929190619c0e565b61031861064536600461884e565b6146ac565b610318610658366004618c1d565b614712565b61031861066b36600461884e565b61480e565b61031861067e36600461884e565b614874565b610318610691366004618910565b614a31565b6105bb6106a4366004619158565b614b9d565b6103c66106b7366004618982565b614d83565b6103c66106ca366004619129565b614e72565b6103186106dd366004618c61565b615105565b6103186106f036600461884e565b6151fa565b61059b6107033660046191c8565b61532d565b61062961071636600461884e565b6154cc565b610553610729366004618b82565b6155b8565b80516060908190806001600160401b038111801561074b57600080fd5b50604051908082528060200260200182016040528015610775578160200160208202803683370190505b50915061078286866157cd565b925082516000141561079457506108cc565b60005b818110156108c957866001600160a01b031663a8312b1d620249f08784815181106107be57fe5b6020026020010151878a6040518563ffffffff1660e01b81526004016107e693929190619f99565b60006040518083038187803b1580156107fe57600080fd5b5086fa9350505050801561083457506040513d6000823e601f3d908101601f191682016040526108319190810190618e14565b60015b61086e573d808015610862576040519150601f19603f3d011682016040523d82523d6000602084013e610867565b606091505b50506108c9565b8060018851038151811061087e57fe5b602002602001015184838151811061089257fe5b6020026020010181815250508382815181106108aa57fe5b6020026020010151600014156108c057506108c9565b50600101610797565b50505b935093915050565b606083516001600160401b03811180156108ed57600080fd5b50604051908082528060200260200182016040528015610917578160200160208202803683370190505b50905060005b84518114610a3f57306001600160a01b0316639bf3ee3562030d4087848151811061094457fe5b602002602001015187858151811061095857fe5b6020026020010151876040518563ffffffff1660e01b815260040161097f93929190619f49565b60206040518083038187803b15801561099757600080fd5b5086fa935050505080156109c8575060408051601f3d908101601f191682019092526109c591810190618e66565b60015b610a1c573d8080156109f6576040519150601f19603f3d011682016040523d82523d6000602084013e6109fb565b606091505b506000838381518110610a0a57fe5b60200260200101818152505050610a37565b80838381518110610a2957fe5b602002602001018181525050505b60010161091d565b509392505050565b600060608086602001515160001415610a5f57610b9d565b610a6b87878787615abc565b855191945092506001600160401b0381118015610a8757600080fd5b50604051908082528060200260200182016040528015610ab1578160200160208202803683370190505b50905060005b8151811015610b9b57836001600160a01b0316637f9c0ecd620493e085888581518110610ae057fe5b60200260200101516040518463ffffffff1660e01b8152600401610b05929190619a55565b60206040518083038187803b158015610b1d57600080fd5b5086fa93505050508015610b4e575060408051601f3d908101601f19168201909252610b4b91810190618e66565b60015b610b5757610b9b565b80838381518110610b6457fe5b602002602001018181525050828281518110610b7c57fe5b602002602001015160001415610b925750610b9b565b50600101610ab7565b505b9450945094915050565b803b15155b919050565b6060610bbd8385615cee565b602085015160408051600280825260608281019093528160200160208202803683370190505090508581600081518110610bf357fe5b60200260200101906001600160a01b031690816001600160a01b0316815250508481600181518110610c2157fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b0381118015610c5157600080fd5b50604051908082528060200260200182016040528015610c7b578160200160208202803683370190505b509350610c86617e7e565b610c8e615d24565b905060005b82811015610dcb576060610cba8b898481518110610cad57fe5b6020026020010151615d53565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e90610cf09060009085908a908990600401619c61565b600060405180830381600087803b158015610d0a57600080fd5b505af1925050508015610d3f57506040513d6000823e601f3d908101601f19168201604052610d3c9190810190618cc2565b60015b610d7a573d808015610d6d576040519150601f19603f3d011682016040523d82523d6000602084013e610d72565b606091505b505050610dcb565b600081600181518110610d8957fe5b602002602001015160001902905060008113610da757505050610dcb565b80898581518110610db457fe5b602002602001018181525050505050600101610c93565b5050505050949350505050565b6060610de48385615cee565b8151806001600160401b0381118015610dfc57600080fd5b50604051908082528060200260200182016040528015610e26578160200160208202803683370190505b50915060006001600160a01b03861615610e4957610e448787615de5565b610e4c565b60005b905060006001600160a01b03861615610e6e57610e698887615de5565b610e71565b60005b905060005b83811015610fa25760016001600160a01b038816610ed457610eb384632640f62c60e01b898581518110610ea657fe5b6020026020010151615e64565b878481518110610ebf57fe5b60200260200101819350828152505050610f6e565b6001600160a01b038916610efa57610eb3836359e9486260e01b898581518110610ea657fe5b6000610f14846359e9486260e01b8a8681518110610ea657fe5b925090508015610f5157610f30856309903d8b60e21b83615e64565b888581518110610f3c57fe5b60200260200101819450828152505050610f6c565b6000878481518110610f5f57fe5b6020026020010181815250505b505b801580610f8e5750858281518110610f8257fe5b60200260200101516000145b15610f995750610fa2565b50600101610e76565b50505050949350505050565b6060610fba8385615cee565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b158015610ffe57600080fd5b505afa158015611012573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611036919061860e565b8451909150806001600160401b038111801561105157600080fd5b5060405190808252806020026020018201604052801561107b578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156110b757600080fd5b505afa1580156110cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110ef919061860e565b6001600160a01b0316866001600160a01b0316141580156111925750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561114457600080fd5b505afa158015611158573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061117c919061860e565b6001600160a01b0316876001600160a01b031614155b1561119f575050506111fb565b60005b81811015610fa25760006111cd8a898b8a86815181106111be57fe5b60200260200101518989615f47565b9050806111da5750610fa2565b808683815181106111e757fe5b6020908102919091010152506001016111a2565b949350505050565b6040805160608181019092526112699080611222868960808401619d38565b60405160208183030381529060405281526020018688604051602001611249929190619d38565b60405160208183030381529060405281526020016162088152508361633b565b95945050505050565b60008060606112818587615cee565b8351806001600160401b038111801561129957600080fd5b506040519080825280602002602001820160405280156112c3578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c6906112f6908a908a90600401619798565b60206040518083038186803b15801561130e57600080fd5b505afa158015611322573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611346919061860e565b925060006001600160a01b0384161561136457506001935086611403565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690611395908a908c90600401619798565b60206040518083038186803b1580156113ad57600080fd5b505afa1580156113c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113e5919061860e565b93506001600160a01b0384166113fc575050610b9d565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561143c57600080fd5b505afa158015611450573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114749190618e46565b61147f575050610b9d565b60005b828110156115425760006114fc8a87858e602001516040516020016114aa94939291906197b2565b6040516020818303038152906040528a88868f602001516040516020016114d494939291906197b2565b6040516020818303038152906040528a85815181106114ef57fe5b602002602001015161654d565b90508085838151811061150b57fe5b60200260200101818152505084828151811061152357fe5b6020026020010151600014156115395750611542565b50600101611482565b5050509450945094915050565b8051606090806001600160401b038111801561156a57600080fd5b50604051908082528060200260200182016040528015611594578160200160208202803683370190505b5091506001600160a01b0387166115ab5750611269565b60005b818110156116cd5760006060896001600160a01b031662061a80636e79e13360e01b8b8b8b8b89815181106115df57fe5b60200260200101516040516024016115fa9493929190619811565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611638919061974f565b6000604051808303818686fa925050503d8060008114611674576040519150601f19603f3d011682016040523d82523d6000602084013e611679565b606091505b50915091506000821561169d578180602001905181019061169a9190618e66565b90505b806116aa575050506116cd565b808685815181106116b757fe5b60209081029190910101525050506001016115ae565b505095945050505050565b60606116e48385615cee565b8151806001600160401b03811180156116fc57600080fd5b50604051908082528060200260200182016040528015611726578160200160208202803683370190505b50915060005b8181101561184257866001600160a01b03166372ea9076620c3500888888868151811061175557fe5b60200260200101516040518563ffffffff1660e01b815260040161177b93929190619893565b60206040518083038187803b15801561179357600080fd5b5086fa935050505080156117c4575060408051601f3d908101601f191682019092526117c191810190618e66565b60015b6117fe573d8080156117f2576040519150601f19603f3d011682016040523d82523d6000602084013e6117f7565b606091505b5050611842565b8084838151811061180b57fe5b60200260200101818152505083828151811061182357fe5b6020026020010151600014156118395750611842565b5060010161172c565b5050949350505050565b8051606090806001600160401b038111801561186757600080fd5b50604051908082528060200260200182016040528015611891578160200160208202803683370190505b50915060005b818110156119c757856001600160a01b031663d06ca61f620249f08684815181106118be57fe5b6020026020010151886040518463ffffffff1660e01b81526004016118e4929190619f80565b60006040518083038187803b1580156118fc57600080fd5b5086fa9350505050801561193257506040513d6000823e601f3d908101601f1916820160405261192f9190810190618e14565b60015b61196c573d808015611960576040519150601f19603f3d011682016040523d82523d6000602084013e611965565b606091505b50506119c7565b8060018751038151811061197c57fe5b602002602001015184838151811061199057fe5b6020026020010181815250508382815181106119a857fe5b6020026020010151600014156119be57506119c7565b50600101611897565b50509392505050565b60606119dc8385615cee565b84602001516001600160a01b0316846001600160a01b0316141580611a0e575084516001600160a01b03848116911614155b15610a3f5781516060816001600160401b0381118015611a2d57600080fd5b50604051908082528060200260200182016040528015611a57578160200160208202803683370190505b5092506111fb915050565b8051606090806001600160401b0381118015611a7d57600080fd5b50604051908082528060200260200182016040528015611aa7578160200160208202803683370190505b50915060005b81811015611842576000606088600001516001600160a01b0316621e84808a602001518a8a8a8881518110611ade57fe5b6020026020010151604051602401611af893929190619d1a565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051611b36919061974f565b6000604051808303818686fa925050503d8060008114611b72576040519150601f19603f3d011682016040523d82523d6000602084013e611b77565b606091505b509150915060008215611b9b5781806020019051810190611b989190618e66565b90505b80868581518110611ba857fe5b602002602001018181525050858481518110611bc057fe5b602002602001015160001415611bd857505050611842565b505050600101611aad565b80516060908190806001600160401b0381118015611c0057600080fd5b50604051908082528060200260200182016040528015611c2a578160200160208202803683370190505b509150611c3786866157cd565b9250825160001415611c4957506108cc565b60005b818110156108c957866001600160a01b0316639e269b68620249f0878481518110611c7357fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401611c9b93929190619f99565b60006040518083038187803b158015611cb357600080fd5b5086fa93505050508015611ce957506040513d6000823e601f3d908101601f19168201604052611ce69190810190618e14565b60015b611d17573d808015610862576040519150601f19603f3d011682016040523d82523d6000602084013e610867565b80600081518110611d2457fe5b6020026020010151848381518110611d3857fe5b602002602001018181525050838281518110611d5057fe5b602002602001015160001415611d6657506108c9565b50600101611c4c565b60208481015160408051600180825281830190925260609384929082810190803683370190505090508581600081518110611da657fe5b602090810291909101015260606000604051908082528060200260200182016040528015611dde578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b03161415611ecf576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a12090611e3790899060019088908890600401619932565b60006040518083038187803b158015611e4f57600080fd5b5086fa93505050508015611e8557506040513d6000823e601f3d908101601f19168201604052611e829190810190618e7e565b60015b611ebf573d808015611eb3576040519150601f19603f3d011682016040523d82523d6000602084013e611eb8565b606091505b5050611eca565b93506111fb92505050565b611fe1565b87606001516001600160a01b0316856001600160a01b03161415611f25576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a12090611e37908a9060019088908890600401619932565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a12090611f65908a90600190889088908d90849084908490600401619975565b60006040518083038187803b158015611f7d57600080fd5b5086fa93505050508015611fb357506040513d6000823e601f3d908101601f19168201604052611fb09190810190618e7e565b60015b611ebf573d808015610dcb576040519150601f19603f3d011682016040523d82523d6000602084013e610dcb565b505050949350505050565b606080606061206d866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561202d57600080fd5b505afa158015612041573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612065919061860e565b866000616686565b905083516001600160401b038111801561208657600080fd5b506040519080825280602002602001820160405280156120b0578160200160208202803683370190505b50915083516001600160401b03811180156120ca57600080fd5b506040519080825280602002602001820160405280156120fe57816020015b60608152602001906001900390816120e95790505b50925060005b84518110156108c95760606000805b84518110156121ef57606061213b8a87848151811061212e57fe5b6020026020010151616b1c565b90508a6001600160a01b031663cdca1753620493e0838c898151811061215d57fe5b60200260200101516040518463ffffffff1660e01b8152600401612182929190619bd3565b602060405180830381600088803b15801561219c57600080fd5b5087f1935050505080156121cd575060408051601f3d908101601f191682019092526121ca91810190618e66565b60015b6121d6576121e6565b8084116121e4578093508194505b505b50600101612113565b50806121fc5750506108c9565b8085848151811061220957fe5b6020026020010181815250508186848151811061222257fe5b60209081029190910101525050600101612104565b80516060908590806001600160401b038111801561225457600080fd5b5060405190808252806020026020018201604052801561227e578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b624906122ae90899060040161976b565b60206040518083038186803b1580156122c657600080fd5b505afa1580156122da573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122fe9190618e46565b15806123835750604051630bcded8960e21b81526001600160a01b03831690632f37b6249061233190889060040161976b565b60206040518083038186803b15801561234957600080fd5b505afa15801561235d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123819190618e46565b155b1561238f5750506111fb565b612397617ea5565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906123c3908a9060040161976b565b60206040518083038186803b1580156123db57600080fd5b505afa1580156123ef573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124139190618e66565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f9061244190899060040161976b565b60206040518083038186803b15801561245957600080fd5b505afa15801561246d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124919190618e66565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce6906124c2908a9060040161976b565b60206040518083038186803b1580156124da57600080fd5b505afa1580156124ee573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125129190618e66565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce69061254590899060040161976b565b60206040518083038186803b15801561255d57600080fd5b505afa158015612571573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125959190618e66565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b1580156125d757600080fd5b505afa1580156125eb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061260f9190618e66565b608082015260005b82811015610fa25761264282602001516003670de0b6b3a76400008161263957fe5b04600101616c77565b86828151811061264e57fe5b6020026020010151111561266157610fa2565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c888151811061269457fe5b602002602001015189608001516040518863ffffffff1660e01b81526004016126c296959493929190619fc4565b60206040518083038187803b1580156126da57600080fd5b5086fa9350505050801561270b575060408051601f3d908101601f1916820190925261270891810190618e66565b60015b612745573d808015612739576040519150601f19603f3d011682016040523d82523d6000602084013e61273e565b606091505b5050610fa2565b8086838151811061275257fe5b60200260200101818152505085828151811061276a57fe5b6020026020010151600014156127805750610fa2565b50600101612617565b60608060606127ca866001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561202d57600080fd5b905060606127d786616cd4565b905084516001600160401b03811180156127f057600080fd5b5060405190808252806020026020018201604052801561281a578160200160208202803683370190505b50925084516001600160401b038111801561283457600080fd5b5060405190808252806020026020018201604052801561286857816020015b60608152602001906001900390816128535790505b50935060005b85518110156129c35760606000805b855181101561297b5760606128ad866128a889858151811061289b57fe5b6020026020010151616d6c565b616b1c565b90508b6001600160a01b0316632f80bb1d620493e0838d89815181106128cf57fe5b60200260200101516040518463ffffffff1660e01b81526004016128f4929190619bd3565b602060405180830381600088803b15801561290e57600080fd5b5087f19350505050801561293f575060408051601f3d908101601f1916820190925261293c91810190618e66565b60015b61294857612972565b8315806129555750808410155b156129705780935061296d8c89858151811061212e57fe5b94505b505b5060010161287d565b50806129885750506129c3565b8086848151811061299557fe5b602002602001018181525050818784815181106129ae57fe5b6020908102919091010152505060010161286e565b505050935093915050565b60408051606081810190925261126990806129ed868960808401619798565b60405160208183030381529060405281526020018688604051602001612a14929190619798565b6040516020818303038152906040528152602001616e048152508361633b565b6060612a418484846108d4565b905060005b8451811015610a3f57818181518110612a5b57fe5b6020026020010151600014612ae157612ac8828281518110612a7957fe5b6020026020010151868381518110612a8d57fe5b6020026020010151606001516001600160801b0316878481518110612aae57fe5b6020026020010151604001516001600160801b0316616f18565b828281518110612ad457fe5b6020026020010181815250505b600101612a46565b6060816001600160401b0381118015612b0157600080fd5b50604051908082528060200260200182016040528015612b3b57816020015b612b28617ed4565b815260200190600190039081612b205790505b50905060005b808314612c43576001828281518110612b5657fe5b602090810291909101810151911515910152838382818110612b7457fe5b9050602002810190612b869190619fec565b15159050612b9357612c3b565b30848483818110612ba057fe5b9050602002810190612bb29190619fec565b604051612bc092919061973f565b6000604051808303816000865af19150503d8060008114612bfd576040519150601f19603f3d011682016040523d82523d6000602084013e612c02565b606091505b50838381518110612c0f57fe5b6020026020010151602001848481518110612c2657fe5b60209081029190910101519190915290151590525b600101612b41565b5092915050565b606081516001600160401b0381118015612c6357600080fd5b50604051908082528060200260200182016040528015612c8d578160200160208202803683370190505b50905060005b82518114612d36577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316838281518110612cd157fe5b60200260200101516001600160a01b031614612d1157612d0c838281518110612cf657fe5b60200260200101516001600160a01b0316616f3c565b612d14565b60125b60ff16828281518110612d2357fe5b6020908102919091010152600101612c93565b50919050565b60006060809450945094915050565b6060612d578385615cee565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b158015612d9b57600080fd5b505afa158015612daf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612dd3919061860e565b8451909150806001600160401b0381118015612dee57600080fd5b50604051908082528060200260200182016040528015612e18578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015612e5457600080fd5b505afa158015612e68573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612e8c919061860e565b6001600160a01b0316866001600160a01b031614158015612f2f5750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015612ee157600080fd5b505afa158015612ef5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f19919061860e565b6001600160a01b0316876001600160a01b031614155b15612f3c575050506111fb565b60005b81811015610fa2576000612f6a8a898b8a8681518110612f5b57fe5b60200260200101518989616fe8565b905080612f775750610fa2565b80868381518110612f8457fe5b602090810291909101015250600101612f3f565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b8152600401612fcf9190619b9e565b60206040518083038186803b158015612fe757600080fd5b505afa158015612ffb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061301f9190618e66565b8651604051631e01043960e01b81526001600160a01b0390911690631e0104399061305290600f89900b90600401619b9e565b60206040518083038186803b15801561306a57600080fd5b505afa15801561307e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130a29190618e66565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b81526004016130da9190619b9e565b60806040518083038186803b1580156130f257600080fd5b505afa158015613106573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061312a91906193e5565b935050505080601203600a0a828161313e57fe5b85519190049250806001600160401b038111801561315b57600080fd5b50604051908082528060200260200182016040528015613185578160200160208202803683370190505b50935060005b81811015610fa257600060608a600001516001600160a01b0316620927c08c602001518c8c8c88815181106131bc57fe5b60200260200101516040516024016131d693929190619d1a565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613214919061974f565b6000604051808303818686fa925050503d8060008114613250576040519150601f19603f3d011682016040523d82523d6000602084013e613255565b606091505b50915091506000821561327957818060200190518101906132769190618e66565b90505b8681106132b357835b858110156132aa578789828151811061329757fe5b6020908102919091010152600101613282565b50505050610fa2565b808885815181106132c057fe5b6020026020010181815250508784815181106132d857fe5b6020026020010151600014156132f057505050610fa2565b50505060010161318b565b613303617eec565b61330b617eec565b600080805b8751811461341057613357602089838151811061332957fe5b60200260200101515103878a848151811061334057fe5b602002602001015161727a9092919063ffffffff16565b60006060306001600160a01b03168a848151811061337157fe5b6020026020010151604051613386919061974f565b6000604051808303816000865af19150503d80600081146133c3576040519150601f19603f3d011682016040523d82523d6000602084013e6133c8565b606091505b509150915081156134065760006133ec60208351038361728a90919063ffffffff16565b90508481111561340457838852602088018290529350835b505b5050600101613310565b508061341c575061350b565b60005b865181146135085761344f602088838151811061343857fe5b602002602001015151038389848151811061334057fe5b60006060306001600160a01b031689848151811061346957fe5b602002602001015160405161347e919061974f565b6000604051808303816000865af19150503d80600081146134bb576040519150601f19603f3d011682016040523d82523d6000602084013e6134c0565b606091505b509150915081156134fe5760006134e460208351038361728a90919063ffffffff16565b9050858111156134fc57838752602087018290529450845b505b505060010161341f565b50505b93509350939050565b60408401516060906001600160e01b03191661359657604080516060810190915261358f9080613548868960808401619d38565b6040516020818303038152906040528152602001868860405160200161356f929190619d38565b60405160208183030381529060405281526020016172968152508361633b565b90506111fb565b8151806001600160401b03811180156135ae57600080fd5b506040519080825280602002602001820160405280156135d8578160200160208202803683370190505b50915060005b81811015611842576000606088600001516001600160a01b0316621e84808a604001518a8a8a888151811061360f57fe5b602002602001015160405160240161362993929190619d1a565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051613667919061974f565b6000604051808303818686fa925050503d80600081146136a3576040519150601f19603f3d011682016040523d82523d6000602084013e6136a8565b606091505b5091509150600082156136cc57818060200190518101906136c99190618e66565b90505b808685815181106136d957fe5b6020026020010181815250508584815181106136f157fe5b60200260200101516000141561370957505050611842565b5050506001016135de565b80516060908590806001600160401b038111801561373157600080fd5b5060405190808252806020026020018201604052801561375b578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b6249061378b90899060040161976b565b60206040518083038186803b1580156137a357600080fd5b505afa1580156137b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906137db9190618e46565b15806138605750604051630bcded8960e21b81526001600160a01b03831690632f37b6249061380e90889060040161976b565b60206040518083038186803b15801561382657600080fd5b505afa15801561383a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061385e9190618e46565b155b1561386c5750506111fb565b613874617ea5565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906138a0908a9060040161976b565b60206040518083038186803b1580156138b857600080fd5b505afa1580156138cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906138f09190618e66565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f9061391e90899060040161976b565b60206040518083038186803b15801561393657600080fd5b505afa15801561394a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061396e9190618e66565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce69061399f908a9060040161976b565b60206040518083038186803b1580156139b757600080fd5b505afa1580156139cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906139ef9190618e66565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce690613a2290899060040161976b565b60206040518083038186803b158015613a3a57600080fd5b505afa158015613a4e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613a729190618e66565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b158015613ab457600080fd5b505afa158015613ac8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613aec9190618e66565b608082015260005b82811015610fa2578151613b10906706f05b59d3b20000616c77565b868281518110613b1c57fe5b60200260200101511115613b2f57610fa2565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c8881518110613b6257fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401613b9096959493929190619fc4565b60206040518083038187803b158015613ba857600080fd5b5086fa93505050508015613bd9575060408051601f3d908101601f19168201909252613bd691810190618e66565b60015b613c07573d808015612739576040519150601f19603f3d011682016040523d82523d6000602084013e61273e565b80868381518110613c1457fe5b602002602001018181525050858281518110613c2c57fe5b602002602001015160001415613c425750610fa2565b50600101613af4565b60008083516003811115613c5b57fe5b1480613c735750600183516003811115613c7157fe5b145b80613c89575060408401516001600160801b0316155b80613c9f575060608401516001600160801b0316155b15613cac57506000613d8b565b613cb4617f06565b600080846001600160a01b0316631fb0979588886040518363ffffffff1660e01b8152600401613ce5929190619f2c565b60a06040518083038186803b158015613cfd57600080fd5b505afa158015613d11573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613d359190619325565b91945092509050600183602001516004811115613d4e57fe5b141580613d59575080155b80613d6c575086516001600160a01b0316155b15613d7d5760009350505050613d8b565b506001600160801b03169150505b9392505050565b6000606080613da18587615cee565b613dac8787876172ea565b925082613db857610b9d565b60405163276fdad960e11b81523090634edfb5b290613de1908a9087908b908b90600401619ef3565b60006040518083038186803b158015613df957600080fd5b505afa158015613e0d573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052613e359190810190618e7e565b876080018190525086608001519150613eac6040518060600160405280878a604051602001613e65929190619a0c565b6040516020818303038152906040528152602001888a604051602001613e8c929190619a0c565b60405160208183030381529060405281526020016174518152508561633b565b90509450945094915050565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b8152600401613ee9929190619798565b60206040518083038186803b158015613f0157600080fd5b505afa158015613f15573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f39919061860e565b90506001600160a01b038116613f535760009150506111fb565b60006001600160a01b03861615613fe5576040516370a0823160e01b81526001600160a01b038716906370a0823190613f9090859060040161976b565b60206040518083038186803b158015613fa857600080fd5b505afa158015613fbc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613fe09190618e66565b613ff1565b816001600160a01b0316315b905083811015614006576000925050506111fb565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f09061403b908a908a908a90600401619893565b60206040518083038187803b15801561405357600080fd5b5086fa93505050508015614084575060408051601f3d908101601f1916820190925261408191810190618e66565b60015b6140c4573d8080156140b2576040519150601f19603f3d011682016040523d82523d6000602084013e6140b7565b606091505b50600093505050506111fb565b92506111fb915050565b60606140da8385615cee565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061411057fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061413e57fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561416e57600080fd5b50604051908082528060200260200182016040528015614198578160200160208202803683370190505b5093506141a3617e7e565b6141ab615d24565b905060005b82811015610dcb5760606141ca8b898481518110610cad57fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906142009060019085908a908990600401619c61565b600060405180830381600087803b15801561421a57600080fd5b505af192505050801561424f57506040513d6000823e601f3d908101601f1916820160405261424c9190810190618cc2565b60015b61427d573d808015610d6d576040519150601f19603f3d011682016040523d82523d6000602084013e610d72565b60008160008151811061428c57fe5b60200260200101519050600081136142a657505050610dcb565b808985815181106142b357fe5b6020026020010181815250505050506001016141b0565b8051606090806001600160401b03811180156142e557600080fd5b5060405190808252806020026020018201604052801561430f578160200160208202803683370190505b50915060005b8181101561184257866001600160a01b031663343fbcdd62061a80888888868151811061433e57fe5b60200260200101516040518563ffffffff1660e01b815260040161436493929190619893565b60206040518083038187803b15801561437c57600080fd5b5086fa935050505080156143ad575060408051601f3d908101601f191682019092526143aa91810190618e66565b60015b6143db573d8080156117f2576040519150601f19603f3d011682016040523d82523d6000602084013e6117f7565b808483815181106143e857fe5b60200260200101818152505083828151811061440057fe5b6020026020010151600014156144165750611842565b50600101614315565b600080606061442e8587615cee565b8351806001600160401b038111801561444657600080fd5b50604051908082528060200260200182016040528015614470578160200160208202803683370190505b50915061447f89898989617538565b945092506001600160a01b0383166144975750614551565b60005b8181101561454e5760006145088986886040516020016144bc9392919061983b565b6040516020818303038152906040528987896040516020016144e09392919061983b565b6040516020818303038152906040528985815181106144fb57fe5b602002602001015161768d565b90508084838151811061451757fe5b60200260200101818152505083828151811061452f57fe5b602002602001015160001415614545575061454e565b5060010161449a565b50505b955095509592505050565b6000606061456a8486615cee565b8251806001600160401b038111801561458257600080fd5b506040519080825280602002602001820160405280156145ac578160200160208202803683370190505b50915060005b818110156146215760006145db8989898986815181106145ce57fe5b6020026020010151613eb8565b9050808483815181106145ea57fe5b60200260200101818152505083828151811061460257fe5b6020026020010151600014156146185750614621565b506001016145b2565b5060405163901754d760e01b81526001600160a01b0388169063901754d7906146509089908990600401619798565b60206040518083038186803b15801561466857600080fd5b505afa15801561467c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906146a0919061860e565b92505094509492505050565b60408051606081810190925261126990806146cb868960808401619798565b604051602081830303815290604052815260200186886040516020016146f2929190619798565b604051602081830303815290604052815260200161777f8152508361633b565b606082516001600160401b038111801561472b57600080fd5b50604051908082528060200260200182016040528015614755578160200160208202803683370190505b50905060005b83518114612c43577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031684828151811061479957fe5b60200260200101516001600160a01b0316146147e3576147de838583815181106147bf57fe5b60200260200101516001600160a01b03166177c690919063ffffffff16565b6147ef565b826001600160a01b0316315b8282815181106147fb57fe5b602090810291909101015260010161475b565b604080516060818101909252611269908061482d868960808401619798565b60405160208183030381529060405281526020018688604051602001614854929190619798565b60405160208183030381529060405281526020016178908152508361633b565b60606148808385615cee565b8151806001600160401b038111801561489857600080fd5b506040519080825280602002602001820160405280156148c2578160200160208202803683370190505b50915060006001600160a01b038616156148e5576148e08787615de5565b6148e8565b60005b905060006001600160a01b0386161561490a576149058887615de5565b61490d565b60005b905060005b83811015610fa25760016001600160a01b03881661496357614942846395b68fe760e01b898581518110610ea657fe5b87848151811061494e57fe5b602002602001018193508281525050506149fd565b6001600160a01b038916614989576149428363cd7724c360e01b898581518110610ea657fe5b60006149a3856395b68fe760e01b8a8681518110610ea657fe5b9250905080156149e0576149bf8463cd7724c360e01b83615e64565b8885815181106149cb57fe5b602002602001018194508281525050506149fb565b60008784815181106149ee57fe5b6020026020010181815250505b505b801580614a1d5750858281518110614a1157fe5b60200260200101516000145b15614a285750610fa2565b50600101614912565b8051606090806001600160401b0381118015614a4c57600080fd5b50604051908082528060200260200182016040528015614a76578160200160208202803683370190505b50915060005b818110156119c757856001600160a01b0316631f00ca74620249f0868481518110614aa357fe5b6020026020010151886040518463ffffffff1660e01b8152600401614ac9929190619f80565b60006040518083038187803b158015614ae157600080fd5b5086fa93505050508015614b1757506040513d6000823e601f3d908101601f19168201604052614b149190810190618e14565b60015b614b45573d808015611960576040519150601f19603f3d011682016040523d82523d6000602084013e611965565b80600081518110614b5257fe5b6020026020010151848381518110614b6657fe5b602002602001018181525050838281518110614b7e57fe5b602002602001015160001415614b9457506119c7565b50600101614a7c565b6000606080614bac8587615cee565b614bb78787876172ea565b925082614bc357610b9d565b60405163276fdad960e11b81523090634edfb5b290614bec908a9087908b908b90600401619ef3565b60006040518083038186803b158015614c0457600080fd5b505afa158015614c18573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052614c409190810190618e7e565b608088018190528451909250806001600160401b0381118015614c6257600080fd5b50604051908082528060200260200182016040528015614c8c578160200160208202803683370190505b50915060005b81811015614d77576000306001600160a01b031663f1ed7fa48b8b8b8b8781518110614cba57fe5b60200260200101516040518563ffffffff1660e01b8152600401614ce19493929190619ebd565b60206040518083038186803b158015614cf957600080fd5b505afa158015614d0d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614d319190618e66565b905080848381518110614d4057fe5b602002602001018181525050838281518110614d5857fe5b602002602001015160001415614d6e5750614d77565b50600101614c92565b50509450945094915050565b6000806060614d928587615cee565b614d9e88888888617538565b935091506001600160a01b038216614db557614551565b8351806001600160401b0381118015614dcd57600080fd5b50604051908082528060200260200182016040528015614df7578160200160208202803683370190505b506040805160608101909152909250614e649080614e1b898789156080850161983b565b6040516020818303038152906040528152602001898688604051602001614e449392919061983b565b604051602081830303815290604052815260200161768d8152508661633b565b915050955095509592505050565b6000806060614e818587615cee565b8351806001600160401b0381118015614e9957600080fd5b50604051908082528060200260200182016040528015614ec3578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c690614ef6908a908a90600401619798565b60206040518083038186803b158015614f0e57600080fd5b505afa158015614f22573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614f46919061860e565b925060006001600160a01b03841615614f6457506001935086615003565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c690614f95908a908c90600401619798565b60206040518083038186803b158015614fad57600080fd5b505afa158015614fc1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614fe5919061860e565b93506001600160a01b038416614ffc575050610b9d565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561503c57600080fd5b505afa158015615050573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906150749190618e46565b61507f575050610b9d565b6150f760405180606001604052808987858e602001516040516020016150a894939291906197b2565b60405160208183030381529060405281526020018a87858e602001516040516020016150d794939291906197b2565b604051602081830303815290604052815260200161654d8152508761633b565b925050509450945094915050565b606083516001600160401b038111801561511e57600080fd5b50604051908082528060200260200182016040528015615148578160200160208202803683370190505b50905060005b84518114610a3f577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031685828151811061518c57fe5b60200260200101516001600160a01b0316146151d8576151d384848784815181106151b357fe5b60200260200101516001600160a01b03166179459092919063ffffffff16565b6151db565b60005b8282815181106151e757fe5b602090810291909101015260010161514e565b8051606090806001600160401b038111801561521557600080fd5b5060405190808252806020026020018201604052801561523f578160200160208202803683370190505b50915060005b8181101561184257866001600160a01b031663838e6a22620493e0888888868151811061526e57fe5b60200260200101516040518563ffffffff1660e01b815260040161529493929190619893565b60206040518083038187803b1580156152ac57600080fd5b5086fa935050505080156152dd575060408051601f3d908101601f191682019092526152da91810190618e66565b60015b61530b573d8080156117f2576040519150601f19603f3d011682016040523d82523d6000602084013e6117f7565b8084838151811061531857fe5b60200260200101818152505050600101615245565b600084608001515160001415615345575060006111fb565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b03161461537f5786615395565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b0316146153b857866153ce565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b81526004016153f69594939291906198b7565b60206040518083038187803b15801561540e57600080fd5b5086fa9350505050801561543f575060408051601f3d908101601f1916820190925261543c91810190618e66565b60015b61547d573d80801561546d576040519150601f19603f3d011682016040523d82523d6000602084013e615472565b606091505b5060009150506111fb565b600061548885617a11565b60ff169050600061549887617a11565b60ff169050670de0b6b3a764000081600a0a83600a0a87860202816154b957fe5b04816154c157fe5b0493505050506111fb565b600060606154da8486615cee565b8251806001600160401b03811180156154f257600080fd5b5060405190808252806020026020018201604052801561551c578160200160208202803683370190505b50915061558760405180606001604052808988604051602001615540929190619798565b60405160208183030381529060405281526020018989604051602001615567929190619798565b6040516020818303038152906040528152602001617a1c8152508561633b565b60405163901754d760e01b81529092506001600160a01b0388169063901754d7906146509089908990600401619798565b6155c0617eec565b6155c8617eec565b6000198060005b865181146156c4576155ff60208883815181106155e857fe5b602002602001015151038789848151811061334057fe5b60006060306001600160a01b031689848151811061561957fe5b602002602001015160405161562e919061974f565b6000604051808303816000865af19150503d806000811461566b576040519150601f19603f3d011682016040523d82523d6000602084013e615670565b606091505b509150915081156156ba57600061569460208351038361728a90919063ffffffff16565b90506000811180156156a557508481105b156156b857838752602087018290529350835b505b50506001016155cf565b506000198114156156d5575061350b565b60005b875181146135085761570860208983815181106156f157fe5b60200260200101515103838a848151811061334057fe5b60006060306001600160a01b03168a848151811061572257fe5b6020026020010151604051615737919061974f565b6000604051808303816000865af19150503d8060008114615774576040519150601f19603f3d011682016040523d82523d6000602084013e615779565b606091505b509150915081156157c357600061579d60208351038361728a90919063ffffffff16565b90506000811180156157ae57508581105b156157c157838852602088018290529450845b505b50506001016156d8565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b15801561580a57600080fd5b505afa15801561581e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615842919061860e565b905060018351036001600160401b038111801561585e57600080fd5b50604051908082528060200260200182016040528015615888578160200160208202803683370190505b50915060005b8251811015615ab3576060826001600160a01b0316635b1dc86f620249f08785815181106158b857fe5b60200260200101518886600101815181106158cf57fe5b60200260200101516040518463ffffffff1660e01b81526004016158f4929190619798565b60006040518083038187803b15801561590c57600080fd5b5086fa9350505050801561594257506040513d6000823e601f3d908101601f1916820160405261593f91908101906189bb565b60015b615991573d808015615970576040519150601f19603f3d011682016040523d82523d6000602084013e615975565b606091505b50506040805160008152602081019091529350615ab692505050565b60006001825110156159be5760405162461bcd60e51b81526004016159b590619e1e565b60405180910390fd5b60005b8251811015615aa75760008382815181106159d857fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015615a1857600080fd5b505afa158015615a2c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615a509190618e66565b905082811115615a9e57809250838281518110615a6957fe5b6020026020010151888781518110615a7d57fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b506001016159c1565b5050505060010161588e565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b158015615b1057600080fd5b505afa158015615b24573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615b489190618e66565b6040518263ffffffff1660e01b8152600401615b649190619b9e565b60206040518083038186803b158015615b7c57600080fd5b505afa158015615b90573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615bb4919061860e565b915085602001515160001415615bc957615ce5565b6000805b876020015151811015615ce257600288602001518281518110615bec57fe5b6020026020010151511015615c0057615cda565b836001600160a01b0316637f9c0ecd620493e08a602001518481518110615c2357fe5b60200260200101518860018a510381518110615c3b57fe5b60200260200101516040518463ffffffff1660e01b8152600401615c60929190619a55565b60206040518083038187803b158015615c7857600080fd5b5086fa93505050508015615ca9575060408051601f3d908101601f19168201909252615ca691810190618e66565b60015b615cb257615cda565b82811115615cd85780925088602001518281518110615ccd57fe5b602002602001015193505b505b600101615bcd565b50505b94509492505050565b806001600160a01b0316826001600160a01b03161415615d205760405162461bcd60e51b81526004016159b590619d94565b5050565b615d2c617e7e565b50604080516080810182523080825260006020830181905292820152606081019190915290565b604080516001808252818301909252606091829190816020015b615d75617f28565b815260200190600190039081615d6d5790505090506040518060a001604052808560000151815260200160008152602001600181526020018481526020016040518060200160405280600081525081525081600081518110615dd357fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf6290615e1490859060040161976b565b60206040518083038186803b158015615e2c57600080fd5b505afa158015615e40573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613d8b919061860e565b6000806001600160a01b038516615e7a576108cc565b6060856001600160a01b0316620249f08686604051602401615e9c9190619b9e565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051615eda919061974f565b6000604051808303818686fa925050503d8060008114615f16576040519150601f19603f3d011682016040523d82523d6000602084013e615f1b565b606091505b5090925090508115615f3e5780806020019051810190615f3b9190618e66565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401615f7d9190619b9e565b60a06040518083038186803b158015615f9557600080fd5b505afa158015615fa9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615fcd919061941a565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b031614156160f557600061600c8964e8d4a51000617a6c565b905060006160306b033b2e3c9fd0803ce800000061602a8885617aa2565b90617a6c565b905084811061604857600096505050505050506161fe565b60006160d7670de0b6b3a76400006160d18c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561609257600080fd5b505afa1580156160a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906160ca9190618e66565b8690617a6c565b90617abe565b905060006160e58483617ae8565b98506161fe975050505050505050565b8a604001516001600160a01b03168a6001600160a01b031614156161f557878481111561612a576000955050505050506161fe565b60006161466b033b2e3c9fd0803ce800000061602a8885617ae8565b905083811161615e57600096505050505050506161fe565b60006161e38a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b15801561619c57600080fd5b505afa1580156161b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906161d49190618e66565b670de0b6b3a764000090617aa2565b905060006160e5826160d18688617a6c565b60009450505050505b9695505050505050565b600080616213617f5a565b858060200190518101906162279190618f12565b915091506000858060200190518101906162419190618ef6565b905060006060306322db5ed160e21b85878661625c8c617b07565b60405160240161626f9493929190619e55565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516162ad919061974f565b600060405180830381855afa9150503d80600081146162e8576040519150601f19603f3d011682016040523d82523d6000602084013e6162ed565b606091505b50915091508161630557600095505050505050613d8b565b808060200190518101906163199190618e14565b60008151811061632557fe5b6020026020010151955050505050509392505050565b606081516001600160401b038111801561635457600080fd5b5060405190808252806020026020018201604052801561637e578160200160208202803683370190505b50905081516000141561639057615ab6565b60006163c184600001518560200151856000815181106163ac57fe5b6020026020010151876040015163ffffffff16565b9050806163ce5750615ab6565b60006163eb8560200151866000015184886040015163ffffffff16565b9050806163f9575050615ab6565b60005b8451811015616544576000805b60058110156164ed5761643087848151811061642157fe5b60200260200101518587617b48565b94508461643c576164ed565b61644b61271561271087617b48565b945084616457576164ed565b600061647489602001518a60000151888c6040015163ffffffff16565b90508061648157506164ed565b80945087848151811061649057fe5b602002602001015185106164e4578784815181106164aa57fe5b60200260200101516127108986815181106164c157fe5b6020026020010151870302816164d357fe5b049250600583116164e457506164ed565b50600101616409565b508015806164fb5750600581115b156165065750616544565b61652486838151811061651557fe5b60200260200101518486617b48565b85838151811061653057fe5b6020908102919091010152506001016163fc565b50505092915050565b6000806000806000878060200190518101906165699190618663565b9350935093509350816001600160a01b0316846001600160a01b03161415616653576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e0906165bc908a90600401619b9e565b60206040518083038187803b1580156165d457600080fd5b5086fa93505050508015616605575060408051601f3d908101601f1916820190925261660291810190618e66565b60015b616647573d808015616633576040519150601f19603f3d011682016040523d82523d6000602084013e616638565b606091505b50600095505050505050613d8b565b9450613d8b9350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e0906165bc9087908b9060040161977f565b606060028284510310156166ac5760405162461bcd60e51b81526004016159b590619d50565b6166b4617f7a565b5060408051606080820183526101f48252610bb86020830152612710828401528251600380825260808201909452919290919081602001602082028036833701905050905060008086868151811061670857fe5b60200260200101519050600087876001018151811061672357fe5b6020026020010151905060005b60038110156168185760008a6001600160a01b0316631698ee8285858a866003811061675857fe5b60200201516040518463ffffffff1660e01b815260040161677b93929190619be6565b60206040518083038186803b15801561679357600080fd5b505afa1580156167a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906167cb919061860e565b90506167d681617ba0565b1561680f57808686806001019750815181106167ee57fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101616730565b5050508061682857505050613d8b565b855185600201141561691e57806001600160401b038111801561684a57600080fd5b5060405190808252806020026020018201604052801561687e57816020015b60608152602001906001900390816168695790505b50935060005b81811015616915576040805160018082528183019092529060208083019080368337019050508582815181106168b657fe5b60200260200101819052508281815181106168cd57fe5b60200260200101518582815181106168e157fe5b60200260200101516000815181106168f557fe5b6001600160a01b0390921660209283029190910190910152600101616884565b50505050613d8b565b606061692e888888600101616686565b90508051600014156169435750505050613d8b565b805182026001600160401b038111801561695c57600080fd5b5060405190808252806020026020018201604052801561699057816020015b606081526020019060019003908161697b5790505b50945060005b82811015616b105760005b8251811015616b075782518281028201908490839081106169be57fe5b6020026020010151516001016001600160401b03811180156169df57600080fd5b50604051908082528060200260200182016040528015616a09578160200160208202803683370190505b50888281518110616a1657fe5b6020026020010181905250858381518110616a2d57fe5b6020026020010151888281518110616a4157fe5b6020026020010151600081518110616a5557fe5b60200260200101906001600160a01b031690816001600160a01b03168152505060005b848381518110616a8457fe5b602002602001015151811015616afd57848381518110616aa057fe5b60200260200101518181518110616ab357fe5b6020026020010151898381518110616ac757fe5b60200260200101518260010181518110616add57fe5b6001600160a01b0390921660209283029190910190910152600101616a78565b50506001016169a1565b50600101616996565b50505050509392505050565b60606002835110158015616b34575081516001018351145b616b505760405162461bcd60e51b81526004016159b590619dd9565b81516003028351601402016001600160401b0381118015616b7057600080fd5b506040519080825280601f01601f191660200182016040528015616b9b576020820181803683370190505b5090506020810160005b8451811015615ab3578015616c4a576000846001830381518110616bc557fe5b60200260200101516001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b158015616c0557600080fd5b505afa158015616c19573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190616c3d919061939f565b60e81b8352506003909101905b6000858281518110616c5857fe5b602090810291909101015160601b835250601490910190600101616ba5565b60008282028315801590616c94575082848281616c9057fe5b0414155b15616ca3576000915050615ab6565b6706f05b59d3b20000810181811015616cc157600092505050615ab6565b670de0b6b3a76400009004949350505050565b606081516001600160401b0381118015616ced57600080fd5b50604051908082528060200260200182016040528015616d17578160200160208202803683370190505b50905060005b8251811015612d3657826001828551030381518110616d3857fe5b6020026020010151828281518110616d4c57fe5b6001600160a01b0390921660209283029190910190910152600101616d1d565b606081516001600160401b0381118015616d8557600080fd5b50604051908082528060200260200182016040528015616daf578160200160208202803683370190505b50905060005b8251811015612d3657826001828551030381518110616dd057fe5b6020026020010151828281518110616de457fe5b6001600160a01b0390921660209283029190910190910152600101616db5565b600080600085806020019051810190616e1d919061862a565b91509150600085806020019051810190616e37919061860e565b90503063e8e4af09838584616e4b8a617b07565b6040518563ffffffff1660e01b8152600401616e6a94939291906197dd565b60006040518083038186803b158015616e8257600080fd5b505afa925050508015616eb757506040513d6000823e601f3d908101601f19168201604052616eb49190810190618e14565b60015b616ef8573d808015616ee5576040519150601f19603f3d011682016040523d82523d6000602084013e616eea565b606091505b506000945050505050613d8b565b80600081518110616f0557fe5b6020026020010151945050505050613d8b565b60006111fb836160d1616f2c826001617ae8565b616f368887617a6c565b90617aa2565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b815250604051616f7a919061974f565b600060405180830381855afa9150503d8060008114616fb5576040519150601f19603f3d011682016040523d82523d6000602084013e616fba565b606091505b5091509150818015616fce57506020815110155b15616fe157616fde81600061728a565b92505b5050919050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b815260040161701e9190619b9e565b60a06040518083038186803b15801561703657600080fd5b505afa15801561704a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061706e919061941a565b945094505050925089604001516001600160a01b0316886001600160a01b03161415617185576000879050600061711e886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156170d757600080fd5b505afa1580156170eb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061710f9190618e66565b670de0b6b3a764000090617ae8565b90506000617138826160d185670de0b6b3a7640000617a6c565b905060006171566b033b2e3c9fd0803ce800000061602a8985617aa2565b905085811061716f5760009750505050505050506161fe565b60006160e56001616f368564e8d4a51000617abe565b89604001516001600160a01b0316896001600160a01b0316141561726a5760006171b48864e8d4a51000617a6c565b905060006171f4886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b15801561619c57600080fd5b9050600061720e670de0b6b3a76400006160d18585617a6c565b90508581111561722757600096505050505050506161fe565b60006172436b033b2e3c9fd0803ce800000061602a8985617ae8565b905084811161725c5760009750505050505050506161fe565b5095506161fe945050505050565b5060009998505050505050505050565b617285838383617dac565b505050565b6000613d8b8383617dd3565b6000806172a1617f5a565b858060200190518101906172b59190618f12565b915091506000858060200190518101906172cf9190618ef6565b9050600060603063205e01d760e11b85878661625c8c617b07565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b031614617328578661733e565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b0316146173615786617377565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b169091526173ab9291906001906024810161985f565b60006040518083038186803b1580156173c357600080fd5b505afa1580156173d7573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526173ff9190810190618a53565b50509050805186600001511061741b575060009150613d8b9050565b8086600001518151811061742b57fe5b6020026020010151925060f883901c60001c60bb14156119c7575060009150613d8b9050565b60008061745c617f98565b848060200190518101906174709190618709565b9150915060008680602001905181019061748a9190618709565b50604051633c7b5fe960e21b8152909150309063f1ed7fa4906174b7908590859088908b90600401619ebd565b60206040518083038186803b1580156174cf57600080fd5b505afa9250505080156174ff575060408051601f3d908101601f191682019092526174fc91810190618e66565b60015b61752d573d808015616ee5576040519150601f19603f3d011682016040523d82523d6000602084013e616eea565b9350613d8b92505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b815260040161756b929190619798565b60006040518083038186803b15801561758357600080fd5b505afa158015617597573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526175bf91908101906189bb565b905060019150805160001415617658576040516315e8a07760e21b81526001600160a01b038816906357a281dc906175fd9087908990600401619798565b60006040518083038186803b15801561761557600080fd5b505afa158015617629573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261765191908101906189bb565b9050600091505b8051861061766d576000809250925050615ce5565b80868151811061767957fe5b602002602001015192505094509492505050565b600080600080868060200190518101906176a791906186c1565b925092509250801561774b57604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e0906176e7906000908a9060040161977f565b604080518083038187803b1580156176fe57600080fd5b5086fa9350505050801561772f575060408051601f3d908101601f1916820190925261772c918101906193c2565b60015b61773f5760009350505050613d8b565b509350613d8b92505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e0906176e7906000908a9060040161977f565b600080600085806020019051810190617798919061862a565b915091506000858060200190518101906177b2919061860e565b9050306330d6570d838584616e4b8a617b07565b6000806060846001600160a01b03166370a0823160e01b856040516024016177ee919061976b565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b031990941693909317909252905161782c919061974f565b600060405180830381855afa9150503d8060008114617867576040519150601f19603f3d011682016040523d82523d6000602084013e61786c565b606091505b509150915081801561788057506020815110155b15615ab35761126981600061728a565b6000806000858060200190518101906178a9919061862a565b915091506000858060200190518101906178c3919061860e565b90503063a469841762061a808486856178db8b617b07565b6040518663ffffffff1660e01b81526004016178fa94939291906197dd565b60006040518083038187803b15801561791257600080fd5b5086fa93505050508015616eb757506040513d6000823e601f3d908101601f19168201604052616eb49190810190618e14565b6000806060856001600160a01b031663dd62ed3e60e01b868660405160240161796f929190619798565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516179ad919061974f565b600060405180830381855afa9150503d80600081146179e8576040519150601f19603f3d011682016040523d82523d6000602084013e6179ed565b606091505b5091509150818015617a0157506020815110155b156119c7576161fe81600061728a565b6000615ab682616f3c565b600080600085806020019051810190617a35919061862a565b9150915060008086806020019051810190617a50919061862a565b91509150617a6084848389613eb8565b98975050505050505050565b600082617a7b57506000615ab6565b82820282848281617a8857fe5b0414613d8b57613d8b617a9d60018686617dfd565b617e57565b600082820183811015613d8b57613d8b617a9d60008686617dfd565b600081617ad457617ad4617a9d60038585617dfd565b6000828481617adf57fe5b04949350505050565b600082821115617b0157617b01617a9d60028585617dfd565b50900390565b604080516001808252818301909252606091602080830190803683370190505090508181600081518110617b3757fe5b602002602001018181525050919050565b6000831580617b55575081155b80617b5e575082155b15617b6b57506000613d8b565b83820282858281617b7857fe5b0414617b88576000915050613d8b565b8360018503820181617b9657fe5b0495945050505050565b6000813b80617bb3576000915050610bac565b50816001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b158015617bed57600080fd5b505afa158015617c01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617c25919061860e565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401617c50919061976b565b60206040518083038186803b158015617c6857600080fd5b505afa158015617c7c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617ca09190618e66565b617cac57506000610bac565b816001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b158015617ce557600080fd5b505afa158015617cf9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617d1d919061860e565b6001600160a01b03166370a08231836040518263ffffffff1660e01b8152600401617d48919061976b565b60206040518083038186803b158015617d6057600080fd5b505afa158015617d74573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190617d989190618e66565b617da457506000610bac565b506001919050565b8160200183511015617dcb57617dcb617a9d6005855185602001617e5f565b910160200152565b60008160200183511015617df457617df4617a9d6005855185602001617e5f565b50016020015190565b606063e946c1bb60e01b848484604051602401617e1c93929190619c32565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b848484604051602401617e1c93929190619c53565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b60408051808201909152606081526000602082015290565b604051806040016040528060008152602001606081525090565b6040805160608101909152600080825260208201908152600060209091015290565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b60405180606001604052806003906020820280368337509192915050565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b8035615ab68161a0e7565b8051615ab68161a0e7565b600082601f830112618008578081fd5b813561801b6180168261a05d565b61a037565b81815291506020808301908481018184028601820187101561803c57600080fd5b60005b848110156180645781356180528161a0e7565b8452928201929082019060010161803f565b505050505092915050565b600082601f83011261807f578081fd5b813561808d6180168261a05d565b818152915060208083019084810160005b84811015618064576180b5888484358a010161826e565b8452928201929082019060010161809e565b600082601f8301126180d7578081fd5b81356180e56180168261a05d565b81815291506020808301908481018184028601820187101561810657600080fd5b60005b8481101561806457813561811c8161a0e7565b84529282019290820190600101618109565b600082601f83011261813e578081fd5b813561814c6180168261a05d565b818152915060208083019084810160808085028701830188101561816f57600080fd5b60005b8581101561819657618184898461856d565b85529383019391810191600101618172565b50505050505092915050565b600082601f8301126181b2578081fd5b81356181c06180168261a05d565b8181529150602080830190848101818402860182018710156181e157600080fd5b60005b84811015618064578135845292820192908201906001016181e4565b600082601f830112618210578081fd5b815161821e6180168261a05d565b81815291506020808301908481018184028601820187101561823f57600080fd5b60005b8481101561806457815184529282019290820190600101618242565b80518015158114615ab657600080fd5b600082601f83011261827e578081fd5b813561828c6180168261a07c565b91508082528360208285010111156182a357600080fd5b8060208401602084013760009082016020015292915050565b600082601f8301126182cc578081fd5b81516182da6180168261a07c565b91508082528360208285010111156182f157600080fd5b612c4381602084016020860161a0aa565b805160028110615ab657600080fd5b600060608284031215618322578081fd5b61832c606061a037565b905081356183398161a0e7565b815260208201356183498161a0fc565b6020820152604082013561835c8161a0fc565b604082015292915050565b600060608284031215618378578081fd5b618382606061a037565b9050815161838f8161a0e7565b8152602082015161839f8161a0fc565b6020820152604082015161835c8161a0fc565b6000604082840312156183c3578081fd5b6183cd604061a037565b905081356183da8161a0e7565b815260208201356183ea8161a0e7565b602082015292915050565b600060a08284031215618406578081fd5b61841060a061a037565b90508135815260208201356184248161a0e7565b602082015260408201356184378161a0e7565b6040820152606082013561844a8161a0e7565b606082015260808201356001600160401b0381111561846857600080fd5b6184748482850161826e565b60808301525092915050565b6000610180808385031215618493578182fd5b61849c8161a037565b9150506184a98383617fe2565b81526184b88360208401617fe2565b60208201526184ca83604084016185d0565b60408201526184dc83606084016185d0565b60608201526184ee83608084016185d0565b60808201526185008360a08401617fe2565b60a08201526185128360c08401617fe2565b60c08201526185248360e08401617fe2565b60e082015261010061853884828501617fe2565b908201526101208281013590820152610140618556848285016185db565b818301525061016080830135818301525092915050565b60006080828403121561857e578081fd5b618588608061a037565b905081356004811061859957600080fd5b8152602082013560ff811681146185af57600080fd5b80602083015250604082013560408201526060820135606082015292915050565b8035615ab68161a121565b80356001600160401b0381168114615ab657600080fd5b600060208284031215618603578081fd5b8135613d8b8161a0e7565b60006020828403121561861f578081fd5b8151613d8b8161a0e7565b6000806040838503121561863c578081fd5b82516186478161a0e7565b60208401519092506186588161a0e7565b809150509250929050565b60008060008060808587031215618678578182fd5b84516186838161a0e7565b60208601519094506186948161a0e7565b60408601519093506186a58161a0e7565b60608601519092506186b68161a0e7565b939692955090935050565b6000806000606084860312156186d5578081fd5b83516186e08161a0e7565b60208501519093506186f18161a0e7565b9150618700856040860161825e565b90509250925092565b6000806040838503121561871b578182fd5b82516187268161a0e7565b60208401519092506001600160401b0380821115618742578283fd5b9084019060a08287031215618755578283fd5b61875f60a061a037565b825181526187708760208501617fed565b60208201526187828760408501617fed565b60408201526187948760608501617fed565b60608201526080830151828111156187aa578485fd5b6187b6888286016182bc565b6080830152508093505050509250929050565b600080600080600060a086880312156187e0578283fd5b85356187eb8161a0e7565b945060208601356187fb8161a0e7565b9350604086013561880b8161a0e7565b9250606086013561881b8161a0e7565b915060808601356001600160401b03811115618835578182fd5b618841888289016181a2565b9150509295509295909350565b60008060008060808587031215618863578182fd5b843561886e8161a0e7565b9350602085013561887e8161a0e7565b9250604085013561888e8161a0e7565b915060608501356001600160401b038111156188a8578182fd5b6188b4878288016181a2565b91505092959194509250565b600080600080608085870312156188d5578182fd5b84356188e08161a0e7565b935060208501356188f08161a0e7565b925060408501356189008161a0e7565b9396929550929360600135925050565b600080600060608486031215618924578081fd5b833561892f8161a0e7565b925060208401356001600160401b038082111561894a578283fd5b61895687838801617ff8565b9350604086013591508082111561896b578283fd5b50618978868287016181a2565b9150509250925092565b600080600080600060a08688031215618999578283fd5b85356189a48161a0e7565b945060208601359350604086013561880b8161a0e7565b600060208083850312156189cd578182fd5b82516001600160401b038111156189e2578283fd5b8301601f810185136189f2578283fd5b8051618a006180168261a05d565b8181528381019083850185840285018601891015618a1c578687fd5b8694505b83851015618a47578051618a338161a0e7565b835260019490940193918501918501618a20565b50979650505050505050565b600080600060608486031215618a67578081fd5b83516001600160401b0380821115618a7d578283fd5b818601915086601f830112618a90578283fd5b8151618a9e6180168261a05d565b80828252602080830192508086018b828387028901011115618abe578788fd5b8796505b84871015618ae0578051845260019690960195928101928101618ac2565b508901519097509350505080821115618af7578283fd5b50618b0486828701618200565b9250506187008560408601618302565b60008060208385031215618b26578182fd5b82356001600160401b0380821115618b3c578384fd5b818501915085601f830112618b4f578384fd5b813581811115618b5d578485fd5b8660208083028501011115618b70578485fd5b60209290920196919550909350505050565b600080600060608486031215618b96578081fd5b83356001600160401b0380821115618bac578283fd5b618bb88783880161806f565b94506020860135915080821115618bcd578283fd5b50618bda8682870161806f565b925050604084013590509250925092565b600060208284031215618bfc578081fd5b81356001600160401b03811115618c11578182fd5b6111fb848285016180c7565b60008060408385031215618c2f578182fd5b82356001600160401b03811115618c44578283fd5b618c50858286016180c7565b92505060208301356186588161a0e7565b600080600060608486031215618c75578081fd5b83356001600160401b03811115618c8a578182fd5b618c96868287016180c7565b9350506020840135618ca78161a0e7565b91506040840135618cb78161a0e7565b809150509250925092565b60006020808385031215618cd4578182fd5b82516001600160401b03811115618ce9578283fd5b8301601f81018513618cf9578283fd5b8051618d076180168261a05d565b8181528381019083850185840285018601891015618d23578687fd5b8694505b83851015618a47578051835260019490940193918501918501618d27565b600080600060608486031215618d59578081fd5b83356001600160401b0380821115618d6f578283fd5b818601915086601f830112618d82578283fd5b8135618d906180168261a05d565b80828252602080830192508086016101808c838288028a01011115618db3578889fd5b8897505b85881015618ddf57618dc98d83618480565b8552600197909701969382019390810190618db7565b50919850890135945050505080821115618df7578283fd5b50618e048682870161812e565b9250506187008560408601617fe2565b600060208284031215618e25578081fd5b81516001600160401b03811115618e3a578182fd5b6111fb84828501618200565b600060208284031215618e57578081fd5b81518015158114613d8b578182fd5b600060208284031215618e77578081fd5b5051919050565b600060208284031215618e8f578081fd5b81516001600160401b03811115618ea4578182fd5b6111fb848285016182bc565b600080600060608486031215618ec4578081fd5b8335618ecf8161a0e7565b925060208401356001600160401b0380821115618eea578283fd5b618956878388016180c7565b600060208284031215618f07578081fd5b8151613d8b8161a112565b60008060808385031215618f24578182fd5b8251618f2f8161a112565b9150618f3e8460208501618367565b90509250929050565b60008060008084860360a0811215618f5d578283fd5b6040811215618f6a578283fd5b50618f75604061a037565b853581526020860135618f878161a0e7565b602082015293506040850135618f9c8161a0e7565b92506060850135618fac8161a0e7565b915060808501356001600160401b038111156188a8578182fd5b60008060008060808587031215618fdb578182fd5b84356001600160401b0380821115618ff1578384fd5b9086019060408289031215619004578384fd5b61900e604061a037565b82356190198161a0e7565b81526020838101358381111561902d578687fd5b80850194505089601f850112619041578586fd5b833561904f6180168261a05d565b81815282810190868401895b84811015619084576190728f8784358c0101617ff8565b8452928501929085019060010161905b565b5050808486015250505081975061909d8a828b01617fe2565b965050506190ae8860408901617fe2565b935060608701359150808211156190c3578283fd5b506188b4878288016181a2565b60008060008060c085870312156190e5578182fd5b6190ef8686618311565b935060608501356190ff8161a112565b9250608085013561910f8161a112565b915060a08501356001600160401b038111156188a8578182fd5b60008060008060a0858703121561913e578182fd5b61914886866183b2565b93506040850135618f9c8161a0e7565b6000806000806080858703121561916d578182fd5b84356001600160401b0380821115619183578384fd5b61918f888389016183f5565b9550602087013591506191a18261a0e7565b9093506040860135906191b38261a0e7565b909250606086013590808211156190c3578283fd5b600080600080608085870312156191dd578182fd5b84356001600160401b038111156191f2578283fd5b6191fe878288016183f5565b94505060208501356188f08161a0e7565b60008060008060808587031215619224578182fd5b84356001600160401b03811115619239578283fd5b619245878288016183f5565b94505060208501359250604085013561925d8161a0e7565b915060608501356186b68161a0e7565b60008060006102208486031215619282578081fd5b61928c8585618480565b925061929c85610180860161856d565b9150610200840135618cb78161a0e7565b60008060008084860360c08112156192c3578283fd5b60608112156192d0578283fd5b506192db606061a037565b85356192e68161a0e7565b81526020868101359082015260408601356193008161a0e7565b6040820152935060608501356193158161a0e7565b9250608085013561910f8161a0e7565b600080600083850360a081121561933a578182fd5b6060811215619347578182fd5b50619352606061a037565b84518152602085015160058110619367578283fd5b6020820152604085015161937a8161a121565b604082015260608501519093506193908161a121565b9150618700856080860161825e565b6000602082840312156193b0578081fd5b815162ffffff81168114613d8b578182fd5b600080604083850312156193d4578182fd5b505080516020909101519092909150565b600080600080608085870312156193fa578182fd5b505082516020840151604085015160609095015191969095509092509050565b600080600080600060a08688031215619431578283fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b6001600160a01b0316815260200190565b600081518352602082015160208401526040820151604084015260608201516060840152608082015160a060808501526111fb60a0850182619526565b6001600160a01b03169052565b6000815180845260208085019450808401835b838110156194ec5781516001600160a01b0316875295820195908201906001016194c7565b509495945050505050565b6000815180845260208085019450808401835b838110156194ec5781518752958201959082019060010161950a565b6000815180845261953e81602086016020860161a0aa565b601f01601f19169290920160200192915050565b80516001600160a01b031682526020808201516001600160e01b03199081169184019190915260409182015116910152565b80516001600160a01b039081168352602080830151151590840152604080830151909116908301526060908101511515910152565b6000815183526020820151604060208501526111fb6040850182619526565b600081518352602082015160018060a01b0380821660208601528060408501511660408601528060608501511660608601525050608082015160a060808501526111fb60a0850182619526565b6196308282516194a7565b602081015161964260208401826194a7565b5060408101516196556040840182619725565b5060608101516196686060840182619725565b50608081015161967b6080840182619725565b5060a081015161968e60a08401826194a7565b5060c08101516196a160c08401826194a7565b5060e08101516196b460e08401826194a7565b50610100808201516196c8828501826194a7565b50506101208181015190830152610140808201516196e882850182619732565b505061016090810151910152565b80516197018161a0da565b825260208181015160ff169083015260408082015190830152606090810151910152565b6001600160801b03169052565b6001600160401b03169052565b6000828483379101908152919050565b6000825161976181846020870161a0aa565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03948516815292841660208401529083166040830152909116606082015260800190565b6001600160a01b0385811682528481166020830152831660408201526080606082018190526000906161fe908301846194f7565b6001600160a01b039485168152928416602084015292166040820152606081019190915260800190565b6001600160a01b039384168152919092166020820152901515604082015260600190565b6001600160a01b0385811682528416602082015282151560408201526080606082018190526000906161fe90830184619526565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a0608082018190526000906198f190830184619526565b979650505050505050565b6001600160a01b0384168152606060208201819052600090619920908301856194b4565b82810360408401526161fe81856194f7565b6001600160a01b038516815260006199498561a0da565b8460208301526080604083015261996360808301856194f7565b82810360608401526198f181856194f7565b6001600160a01b038981168252600090610100906199928b61a0da565b8a60208501528160408501526199aa8285018b6194f7565b915083820360608501526199be828a6194f7565b908816608085015290506199d18661a0da565b8560a084015282810360c08401526199e981866194f7565b905082810360e08401526199fd81856194f7565b9b9a5050505050505050505050565b6001600160a01b03831681526040602082018190526000906111fb908301846195d8565b600060408252619a4360408301856194b4565b828103602084015261126981856194f7565b600060408252619a6860408301856194b4565b90508260208301529392505050565b60006040820160408352808551808352606085019150602092506060838202860101838801855b83811015619acc57605f19888403018552619aba838351619526565b94860194925090850190600101619a9e565b505085810384870152617a6081886194f7565b60208082528251828201819052600091906040908185019080840286018301878501865b83811015619b4657888303603f1901855281518051878552619b2788860182619526565b9189015115159489019490945294870194925090860190600101619b03565b509098975050505050505050565b600060208252613d8b60208301846194f7565b901515815260200190565b83151581526001600160a01b0383166020820152606060408201819052600090611269908301846194f7565b90815260200190565b6000848252606060208301526199206060830185619526565b600060208252613d8b6020830184619526565b600060408252619a686040830185619526565b6001600160a01b03938416815291909216602082015262ffffff909116604082015260600190565b6001600160a01b03831681526040602082018190526000906111fb908301846194f7565b60608101619c3f8561a0da565b938152602081019290925260409091015290565b6060810160088510619c3f57fe5b600060e08201619c708761a09f565b8352602060e081850152818751619c878185619b9e565b91508193508281028201838a01865b83811015619cc0578683038552619cae83835161946a565b94860194925090850190600101619c96565b5050868103604088015280945088519250619cdb8382619b9e565b94505050818701845b82811015619d0557619cf7858351619459565b945090830190600101619ce4565b50505050809150506112696060830184619584565b600f93840b81529190920b6020820152604081019190915260600190565b600f83900b815260808101613d8b6020830184619552565b60208082526024908201527f556e6973776170563353616d706c65722f746f6b656e5061746820746f6f20736040820152631a1bdc9d60e21b606082015260800190565b60208082526025908201527f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e6040820152642fa820a4a960d91b606082015260800190565b60208082526025908201527f556e6973776170563353616d706c65722f696e76616c69642070617468206c656040820152646e6774687360d81b606082015260800190565b6020808252601e908201527f4b79626572444d4d53616d706c65722f4e4f5f504f4f4c535f464f554e440000604082015260600190565b6000619e618287619552565b84600f0b606083015283600f0b608083015260c060a08301526161fe60c08301846194f7565b600060608252619e9a60608301866195b9565b8281036020840152619eac81866195b9565b915050826040830152949350505050565b600060808252619ed060808301876195d8565b6001600160a01b0395861660208401529390941660408201526060015292915050565b600060808252619f0660808301876195d8565b6020830195909552506001600160a01b0392831660408201529116606090910152919050565b6102008101619f3b8285619625565b613d8b6101808301846196f6565b6102208101619f588286619625565b619f666101808301856196f6565b6001600160a01b0392909216610200919091015292915050565b6000838252604060208301526111fb60408301846194b4565b600084825260606020830152619fb260608301856194b4565b82810360408401526161fe81856194b4565b958652602086019490945260408501929092526060840152608083015260a082015260c00190565b6000808335601e1984360301811261a002578283fd5b8301803591506001600160401b0382111561a01b578283fd5b60200191503681900382131561a03057600080fd5b9250929050565b6040518181016001600160401b038111828210171561a05557600080fd5b604052919050565b60006001600160401b0382111561a072578081fd5b5060209081020190565b60006001600160401b0382111561a091578081fd5b50601f01601f191660200190565b8060028110610bac57fe5b60005b8381101561a0c557818101518382015260200161a0ad565b8381111561a0d4576000848401525b50505050565b6004811061a0e457fe5b50565b6001600160a01b038116811461a0e457600080fd5b6001600160e01b03198116811461a0e457600080fd5b80600f0b811461a0e457600080fd5b6001600160801b038116811461a0e457600080fdfea2646970667358221220e03dd8218c831245be6e290393d1f243bdd63f59581bf984dee5614a1d409e5b64736f6c634300060c0033';
ERC20BridgeSamplerContract.contractName = 'ERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=erc20_bridge_sampler.js.map