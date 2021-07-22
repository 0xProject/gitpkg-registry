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
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'to',
                                type: 'address',
                            },
                            {
                                name: 'data',
                                type: 'bytes',
                            },
                            {
                                name: 'gas',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'secondHopCalls',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'to',
                                type: 'address',
                            },
                            {
                                name: 'data',
                                type: 'bytes',
                            },
                            {
                                name: 'gas',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'buyAmount',
                        type: 'uint256',
                    },
                ],
                name: 'sampleTwoHopBuy',
                outputs: [
                    {
                        name: 'result',
                        type: 'tuple',
                        components: [
                            {
                                name: 'outputAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'firstHopIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'firstHopResult',
                                type: 'bytes',
                            },
                            {
                                name: 'secondHopIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'secondHopResult',
                                type: 'bytes',
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
                        name: 'firstHopCalls',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'to',
                                type: 'address',
                            },
                            {
                                name: 'data',
                                type: 'bytes',
                            },
                            {
                                name: 'gas',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'secondHopCalls',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'to',
                                type: 'address',
                            },
                            {
                                name: 'data',
                                type: 'bytes',
                            },
                            {
                                name: 'gas',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'sellAmount',
                        type: 'uint256',
                    },
                ],
                name: 'sampleTwoHopSell',
                outputs: [
                    {
                        name: 'result',
                        type: 'tuple',
                        components: [
                            {
                                name: 'outputAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'firstHopIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'firstHopResult',
                                type: 'bytes',
                            },
                            {
                                name: 'secondHopIndex',
                                type: 'uint256',
                            },
                            {
                                name: 'secondHopResult',
                                type: 'bytes',
                            },
                        ]
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
        const functionSignature = 'sampleTwoHopBuy((address,bytes,uint256)[],(address,bytes,uint256)[],uint256)';
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
        const functionSignature = 'sampleTwoHopSell((address,bytes,uint256)[],(address,bytes,uint256)[],uint256)';
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
ERC20BridgeSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b506004361061025e5760003560e01c80639877774811610146578063c25c4138116100c3578063d9bca37211610087578063d9bca37214610595578063ddd5aa28146105a8578063e8e4af09146105bb578063f1ed7fa4146105ce578063f3868e9c14610363578063f5a4994d146105e15761025e565b8063c25c413814610536578063c831908414610549578063c8c74a371461055c578063c94706d81461056f578063cc1621c9146105825761025e565b8063a46984171161010a578063a4698417146104c9578063a75e744b146104dc578063ab000276146104ef578063adc636bf14610502578063b90cd2fb146105235761025e565b8063987777481461044e5780639e3f05c3146104615780639e4a2a69146104835780639ea0ff1314610496578063a0295b8b146104b65761025e565b806336052391116101df57806357494b1d116101a357806357494b1d146103dc5780635d5b674f146103ef57806374c9d255146104025780637f7f4f13146104155780638b6d7b44146104285780639209483b1461043b5761025e565b8063360523911461036357806340bc03ae1461037657806344a3acba14610389578063494569db146103a95780634edfb5b2146103bc5761025e565b806329fa4aa01161022657806329fa4aa0146102f55780632aa64319146103085780632d753aa41461032a57806330d6570d1461033d5780633105fec1146103505761025e565b80630496d5dc14610263578063149dab0e1461028d5780632339078f146102af578063252322b3146102cf578063281e3432146102e2575b600080fd5b610276610271366004617201565b6105f4565b604051610284929190617e49565b60405180910390f35b6102a061029b366004617666565b61079a565b60405161028493929190617d18565b6102c26102bd3660046175e7565b6108fa565b6040516102849190617e90565b6102c26102dd36600461713f565b610b21565b6102c26102f03660046178bc565b610cf7565b6102c261030336600461771f565b610f4c565b61031b610316366004617778565b610fbb565b60405161028493929190617ea3565b6102c26103383660046170ba565b611298565b6102c261034b36600461713f565b611421565b6102c261035e366004617201565b611595565b6102c2610371366004617778565b611719565b6102c261038436600461771f565b6117b3565b61039c610397366004617491565b611934565b604051610284919061812d565b6102766103b7366004617201565b611b8e565b6103cf6103ca36600461785e565b611d1a565b6040516102849190617ef1565b6102c26103ea36600461713f565b611f97565b6102c26103fd36600461713f565b6124e9565b6102a0610410366004617666565b61254f565b6102c26104233660046178bc565b61255e565b6102c261043636600461771f565b6127ab565b6102c261044936600461771f565b612b0e565b6102c261045c36600461713f565b612d0e565b61047461046f3660046177a7565b613245565b60405161028493929190617ed8565b61039c610491366004617491565b61336b565b6104a96104a43660046171b1565b6135df565b6040516102849190617ecf565b6102c26104c43660046175e7565b6137f5565b6102c26104d736600461713f565b6139f1565b61031b6104ea366004617273565b613b46565b6102c26104fd36600461713f565b613c83565b61051561051036600461713f565b613de1565b604051610284929190617f04565b6102c261053136600461713f565b613f31565b6102c261054436600461713f565b613f97565b6102c261055736600461713f565b613ffd565b6102c261056a366004617201565b6141ba565b6102c261057d36600461713f565b614326565b6104746105903660046177a7565b614484565b61031b6105a3366004617273565b61466a565b61031b6105b6366004617778565b614759565b6102c26105c936600461713f565b6149ec565b6104a96105dc366004617817565b614b1f565b6105156105ef36600461713f565b614cbe565b80516060908190806001600160401b038111801561061157600080fd5b5060405190808252806020026020018201604052801561063b578160200160208202803683370190505b5091506106488686614daa565b925082516000141561065a5750610792565b60005b8181101561078f57866001600160a01b031663a8312b1d620249f087848151811061068457fe5b6020026020010151878a6040518563ffffffff1660e01b81526004016106ac9392919061819d565b60006040518083038187803b1580156106c457600080fd5b5086fa935050505080156106fa57506040513d6000823e601f3d908101601f191682016040526106f791908101906174fa565b60015b610734573d808015610728576040519150601f19603f3d011682016040523d82523d6000602084013e61072d565b606091505b505061078f565b8060018851038151811061074457fe5b602002602001015184838151811061075857fe5b60200260200101818152505083828151811061077057fe5b602002602001015160001415610786575061078f565b5060010161065d565b50505b935093915050565b6000606080866020015151600014156107b2576108f0565b6107be8787878761508f565b855191945092506001600160401b03811180156107da57600080fd5b50604051908082528060200260200182016040528015610804578160200160208202803683370190505b50905060005b81518110156108ee57836001600160a01b0316637f9c0ecd620493e08588858151811061083357fe5b60200260200101516040518463ffffffff1660e01b8152600401610858929190617e6e565b60206040518083038187803b15801561087057600080fd5b5086fa935050505080156108a1575060408051601f3d908101601f1916820190925261089e9181019061754c565b60015b6108aa576108ee565b808383815181106108b757fe5b6020026020010181815250508282815181106108cf57fe5b6020026020010151600014156108e557506108ee565b5060010161080a565b505b9450945094915050565b606061090683856152c1565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061093c57fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061096a57fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561099a57600080fd5b506040519080825280602002602001820160405280156109c4578160200160208202803683370190505b5093506109cf61696c565b6109d7615300565b905060005b82811015610b14576060610a038b8984815181106109f657fe5b602002602001015161532f565b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e90610a399060009085908a908990600401617f58565b600060405180830381600087803b158015610a5357600080fd5b505af1925050508015610a8857506040513d6000823e601f3d908101601f19168201604052610a85919081019061740e565b60015b610ac3573d808015610ab6576040519150601f19603f3d011682016040523d82523d6000602084013e610abb565b606091505b505050610b14565b600081600181518110610ad257fe5b602002602001015160001902905060008113610af057505050610b14565b80898581518110610afd57fe5b6020026020010181815250505050506001016109dc565b5050505050949350505050565b6060610b2d83856152c1565b8151806001600160401b0381118015610b4557600080fd5b50604051908082528060200260200182016040528015610b6f578160200160208202803683370190505b50915060006001600160a01b03861615610b9257610b8d87876153c1565b610b95565b60005b905060006001600160a01b03861615610bb757610bb288876153c1565b610bba565b60005b905060005b83811015610ceb5760016001600160a01b038816610c1d57610bfc84632640f62c60e01b898581518110610bef57fe5b6020026020010151615440565b878481518110610c0857fe5b60200260200101819350828152505050610cb7565b6001600160a01b038916610c4357610bfc836359e9486260e01b898581518110610bef57fe5b6000610c5d846359e9486260e01b8a8681518110610bef57fe5b925090508015610c9a57610c79856309903d8b60e21b83615440565b888581518110610c8557fe5b60200260200101819450828152505050610cb5565b6000878481518110610ca857fe5b6020026020010181815250505b505b801580610cd75750858281518110610ccb57fe5b60200260200101516000145b15610ce25750610ceb565b50600101610bbf565b50505050949350505050565b6060610d0383856152c1565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b158015610d4757600080fd5b505afa158015610d5b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d7f9190616ef7565b8451909150806001600160401b0381118015610d9a57600080fd5b50604051908082528060200260200182016040528015610dc4578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015610e0057600080fd5b505afa158015610e14573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e389190616ef7565b6001600160a01b0316866001600160a01b031614158015610edb5750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b158015610e8d57600080fd5b505afa158015610ea1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ec59190616ef7565b6001600160a01b0316876001600160a01b031614155b15610ee857505050610f44565b60005b81811015610ceb576000610f168a898b8a8681518110610f0757fe5b60200260200101518989615523565b905080610f235750610ceb565b80868381518110610f3057fe5b602090810291909101015250600101610eeb565b949350505050565b604080516060818101909252610fb29080610f6b86896080840161802f565b60405160208183030381529060405281526020018688604051602001610f9292919061802f565b60405160208183030381529060405281526020016157e481525083615917565b95945050505050565b6000806060610fca85876152c1565b8351806001600160401b0381118015610fe257600080fd5b5060405190808252806020026020018201604052801561100c578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c69061103f908a908a90600401617bb4565b60206040518083038186803b15801561105757600080fd5b505afa15801561106b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061108f9190616ef7565b925060006001600160a01b038416156110ad5750600193508661114c565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c6906110de908a908c90600401617bb4565b60206040518083038186803b1580156110f657600080fd5b505afa15801561110a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061112e9190616ef7565b93506001600160a01b0384166111455750506108f0565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561118557600080fd5b505afa158015611199573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111bd919061752c565b6111c85750506108f0565b60005b8281101561128b5760006112458a87858e602001516040516020016111f39493929190617bce565b6040516020818303038152906040528a88868f6020015160405160200161121d9493929190617bce565b6040516020818303038152906040528a858151811061123857fe5b6020026020010151615b14565b90508085838151811061125457fe5b60200260200101818152505084828151811061126c57fe5b602002602001015160001415611282575061128b565b506001016111cb565b5050509450945094915050565b8051606090806001600160401b03811180156112b357600080fd5b506040519080825280602002602001820160405280156112dd578160200160208202803683370190505b5091506001600160a01b0387166112f45750610fb2565b60005b818110156114165760006060896001600160a01b031662061a80636e79e13360e01b8b8b8b8b898151811061132857fe5b60200260200101516040516024016113439493929190617c2d565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516113819190617b6b565b6000604051808303818686fa925050503d80600081146113bd576040519150601f19603f3d011682016040523d82523d6000602084013e6113c2565b606091505b5091509150600082156113e657818060200190518101906113e3919061754c565b90505b806113f357505050611416565b8086858151811061140057fe5b60209081029190910101525050506001016112f7565b505095945050505050565b606061142d83856152c1565b8151806001600160401b038111801561144557600080fd5b5060405190808252806020026020018201604052801561146f578160200160208202803683370190505b50915060005b8181101561158b57866001600160a01b03166372ea9076620c3500888888868151811061149e57fe5b60200260200101516040518563ffffffff1660e01b81526004016114c493929190617caf565b60206040518083038187803b1580156114dc57600080fd5b5086fa9350505050801561150d575060408051601f3d908101601f1916820190925261150a9181019061754c565b60015b611547573d80801561153b576040519150601f19603f3d011682016040523d82523d6000602084013e611540565b606091505b505061158b565b8084838151811061155457fe5b60200260200101818152505083828151811061156c57fe5b602002602001015160001415611582575061158b565b50600101611475565b5050949350505050565b8051606090806001600160401b03811180156115b057600080fd5b506040519080825280602002602001820160405280156115da578160200160208202803683370190505b50915060005b8181101561171057856001600160a01b031663d06ca61f620249f086848151811061160757fe5b6020026020010151886040518463ffffffff1660e01b815260040161162d929190618184565b60006040518083038187803b15801561164557600080fd5b5086fa9350505050801561167b57506040513d6000823e601f3d908101601f1916820160405261167891908101906174fa565b60015b6116b5573d8080156116a9576040519150601f19603f3d011682016040523d82523d6000602084013e6116ae565b606091505b5050611710565b806001875103815181106116c557fe5b60200260200101518483815181106116d957fe5b6020026020010181815250508382815181106116f157fe5b6020026020010151600014156117075750611710565b506001016115e0565b50509392505050565b606061172583856152c1565b84602001516001600160a01b0316846001600160a01b0316141580611757575084516001600160a01b03848116911614155b156117ab5781516060816001600160401b038111801561177657600080fd5b506040519080825280602002602001820160405280156117a0578160200160208202803683370190505b509250610f44915050565b509392505050565b8051606090806001600160401b03811180156117ce57600080fd5b506040519080825280602002602001820160405280156117f8578160200160208202803683370190505b50915060005b8181101561158b576000606088600001516001600160a01b0316621e84808a602001518a8a8a888151811061182f57fe5b602002602001015160405160240161184993929190618011565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516118879190617b6b565b6000604051808303818686fa925050503d80600081146118c3576040519150601f19603f3d011682016040523d82523d6000602084013e6118c8565b606091505b5091509150600082156118ec57818060200190518101906118e9919061754c565b90505b808685815181106118f957fe5b60200260200101818152505085848151811061191157fe5b6020026020010151600014156119295750505061158b565b5050506001016117fe565b61193c616993565b6000805b85518114611a5b57606086828151811061195657fe5b602002602001015160200151905061197d60208251038683615c4d9092919063ffffffff16565b6000606088848151811061198d57fe5b6020026020010151600001516001600160a01b03168985815181106119ae57fe5b602002602001015160400151846040516119c89190617b6b565b60006040518083038160008787f1925050503d8060008114611a06576040519150601f19603f3d011682016040523d82523d6000602084013e611a0b565b606091505b50915091508115611a4d576000611a2f602083510383615c5d90919063ffffffff16565b905085811115611a4b5760208701859052604087018290529450845b505b505050806001019050611940565b5080611a675750611b87565b60005b84518114611710576060858281518110611a8057fe5b6020026020010151602001519050611aa760208251038483615c4d9092919063ffffffff16565b60006060878481518110611ab757fe5b6020026020010151600001516001600160a01b0316888581518110611ad857fe5b60200260200101516040015184604051611af29190617b6b565b60006040518083038160008787f1925050503d8060008114611b30576040519150601f19603f3d011682016040523d82523d6000602084013e611b35565b606091505b50915091508115611b79576000611b59602083510383615c5d90919063ffffffff16565b8751909150811115611b775780875260608701859052608087018290525b505b505050806001019050611a6a565b9392505050565b80516060908190806001600160401b0381118015611bab57600080fd5b50604051908082528060200260200182016040528015611bd5578160200160208202803683370190505b509150611be28686614daa565b9250825160001415611bf45750610792565b60005b8181101561078f57866001600160a01b0316639e269b68620249f0878481518110611c1e57fe5b6020026020010151878a6040518563ffffffff1660e01b8152600401611c469392919061819d565b60006040518083038187803b158015611c5e57600080fd5b5086fa93505050508015611c9457506040513d6000823e601f3d908101601f19168201604052611c9191908101906174fa565b60015b611cc2573d808015610728576040519150601f19603f3d011682016040523d82523d6000602084013e61072d565b80600081518110611ccf57fe5b6020026020010151848381518110611ce357fe5b602002602001018181525050838281518110611cfb57fe5b602002602001015160001415611d11575061078f565b50600101611bf7565b60208481015160408051600180825281830190925260609384929082810190803683370190505090508581600081518110611d5157fe5b602090810291909101015260606000604051908082528060200260200182016040528015611d89578160200160208202803683370190505b50905087606001516001600160a01b0316866001600160a01b03161415611e7a576040516381efcbdd60e01b81526001600160a01b038416906381efcbdd906207a12090611de290899060019088908890600401617d4e565b60006040518083038187803b158015611dfa57600080fd5b5086fa93505050508015611e3057506040513d6000823e601f3d908101601f19168201604052611e2d9190810190617564565b60015b611e6a573d808015611e5e576040519150601f19603f3d011682016040523d82523d6000602084013e611e63565b606091505b5050611e75565b9350610f4492505050565b611f8c565b87606001516001600160a01b0316856001600160a01b03161415611ed0576040516361e597f960e01b81526001600160a01b038416906361e597f9906207a12090611de2908a9060019088908890600401617d4e565b6040516302b9a6cd60e11b81526001600160a01b038416906305734d9a906207a12090611f10908a90600190889088908d90849084908490600401617d90565b60006040518083038187803b158015611f2857600080fd5b5086fa93505050508015611f5e57506040513d6000823e601f3d908101601f19168201604052611f5b9190810190617564565b60015b611e6a573d808015610b14576040519150601f19603f3d011682016040523d82523d6000602084013e610b14565b505050949350505050565b80516060908590806001600160401b0381118015611fb457600080fd5b50604051908082528060200260200182016040528015611fde578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b6249061200e908990600401617b87565b60206040518083038186803b15801561202657600080fd5b505afa15801561203a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061205e919061752c565b15806120e35750604051630bcded8960e21b81526001600160a01b03831690632f37b62490612091908890600401617b87565b60206040518083038186803b1580156120a957600080fd5b505afa1580156120bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120e1919061752c565b155b156120ef575050610f44565b6120f76169c2565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612123908a90600401617b87565b60206040518083038186803b15801561213b57600080fd5b505afa15801561214f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612173919061754c565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f906121a1908990600401617b87565b60206040518083038186803b1580156121b957600080fd5b505afa1580156121cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121f1919061754c565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690612222908a90600401617b87565b60206040518083038186803b15801561223a57600080fd5b505afa15801561224e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612272919061754c565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce6906122a5908990600401617b87565b60206040518083038186803b1580156122bd57600080fd5b505afa1580156122d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122f5919061754c565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b15801561233757600080fd5b505afa15801561234b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061236f919061754c565b608082015260005b82811015610ceb576123a282602001516003670de0b6b3a76400008161239957fe5b04600101615c69565b8682815181106123ae57fe5b602002602001015111156123c157610ceb565b836001600160a01b031663f8d6aed4620493e084600001518560400151866020015187606001518c88815181106123f457fe5b602002602001015189608001516040518863ffffffff1660e01b8152600401612422969594939291906181c8565b60206040518083038187803b15801561243a57600080fd5b5086fa9350505050801561246b575060408051601f3d908101601f191682019092526124689181019061754c565b60015b6124a5573d808015612499576040519150601f19603f3d011682016040523d82523d6000602084013e61249e565b606091505b5050610ceb565b808683815181106124b257fe5b6020026020010181815250508582815181106124ca57fe5b6020026020010151600014156124e05750610ceb565b50600101612377565b604080516060818101909252610fb29080612508868960808401617bb4565b6040516020818303038152906040528152602001868860405160200161252f929190617bb4565b6040516020818303038152906040528152602001615cc681525083615917565b60006060809450945094915050565b606061256a83856152c1565b6000856000015190506000816001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b1580156125ae57600080fd5b505afa1580156125c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125e69190616ef7565b8451909150806001600160401b038111801561260157600080fd5b5060405190808252806020026020018201604052801561262b578160200160208202803683370190505b509350826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b15801561266757600080fd5b505afa15801561267b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061269f9190616ef7565b6001600160a01b0316866001600160a01b0316141580156127425750826001600160a01b031663f4b9fa756040518163ffffffff1660e01b815260040160206040518083038186803b1580156126f457600080fd5b505afa158015612708573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061272c9190616ef7565b6001600160a01b0316876001600160a01b031614155b1561274f57505050610f44565b60005b81811015610ceb57600061277d8a898b8a868151811061276e57fe5b60200260200101518989615dda565b90508061278a5750610ceb565b8086838151811061279757fe5b602090810291909101015250600101612752565b6060600085600001516001600160a01b031663bbd7f25585600f0b6040518263ffffffff1660e01b81526004016127e29190617ecf565b60206040518083038186803b1580156127fa57600080fd5b505afa15801561280e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612832919061754c565b8651604051631e01043960e01b81526001600160a01b0390911690631e0104399061286590600f89900b90600401617ecf565b60206040518083038186803b15801561287d57600080fd5b505afa158015612891573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128b5919061754c565b039050600086600001516001600160a01b031663c582951486600f0b6040518263ffffffff1660e01b81526004016128ed9190617ecf565b60806040518083038186803b15801561290557600080fd5b505afa158015612919573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061293d9190617957565b935050505080601203600a0a828161295157fe5b85519190049250806001600160401b038111801561296e57600080fd5b50604051908082528060200260200182016040528015612998578160200160208202803683370190505b50935060005b81811015610ceb57600060608a600001516001600160a01b0316620927c08c602001518c8c8c88815181106129cf57fe5b60200260200101516040516024016129e993929190618011565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051612a279190617b6b565b6000604051808303818686fa925050503d8060008114612a63576040519150601f19603f3d011682016040523d82523d6000602084013e612a68565b606091505b509150915060008215612a8c5781806020019051810190612a89919061754c565b90505b868110612ac657835b85811015612abd5787898281518110612aaa57fe5b6020908102919091010152600101612a95565b50505050610ceb565b80888581518110612ad357fe5b602002602001018181525050878481518110612aeb57fe5b602002602001015160001415612b0357505050610ceb565b50505060010161299e565b60408401516060906001600160e01b031916612b90576040805160608101909152612b899080612b4286896080840161802f565b60405160208183030381529060405281526020018688604051602001612b6992919061802f565b604051602081830303815290604052815260200161607281525083615917565b9050610f44565b8151806001600160401b0381118015612ba857600080fd5b50604051908082528060200260200182016040528015612bd2578160200160208202803683370190505b50915060005b8181101561158b576000606088600001516001600160a01b0316621e84808a604001518a8a8a8881518110612c0957fe5b6020026020010151604051602401612c2393929190618011565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b0319909416939093179092529051612c619190617b6b565b6000604051808303818686fa925050503d8060008114612c9d576040519150601f19603f3d011682016040523d82523d6000602084013e612ca2565b606091505b509150915060008215612cc65781806020019051810190612cc3919061754c565b90505b80868581518110612cd357fe5b602002602001018181525050858481518110612ceb57fe5b602002602001015160001415612d035750505061158b565b505050600101612bd8565b80516060908590806001600160401b0381118015612d2b57600080fd5b50604051908082528060200260200182016040528015612d55578160200160208202803683370190505b50604051630bcded8960e21b81529093506001600160a01b03831690632f37b62490612d85908990600401617b87565b60206040518083038186803b158015612d9d57600080fd5b505afa158015612db1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612dd5919061752c565b1580612e5a5750604051630bcded8960e21b81526001600160a01b03831690632f37b62490612e08908890600401617b87565b60206040518083038186803b158015612e2057600080fd5b505afa158015612e34573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612e58919061752c565b155b15612e66575050610f44565b612e6e6169c2565b60405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612e9a908a90600401617b87565b60206040518083038186803b158015612eb257600080fd5b505afa158015612ec6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612eea919061754c565b815260405163f8b2cb4f60e01b81526001600160a01b0384169063f8b2cb4f90612f18908990600401617b87565b60206040518083038186803b158015612f3057600080fd5b505afa158015612f44573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f68919061754c565b6020820152604051634a46c67360e11b81526001600160a01b0384169063948d8ce690612f99908a90600401617b87565b60206040518083038186803b158015612fb157600080fd5b505afa158015612fc5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612fe9919061754c565b60408083019190915251634a46c67360e11b81526001600160a01b0384169063948d8ce69061301c908990600401617b87565b60206040518083038186803b15801561303457600080fd5b505afa158015613048573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061306c919061754c565b816060018181525050826001600160a01b031663d4cadf686040518163ffffffff1660e01b815260040160206040518083038186803b1580156130ae57600080fd5b505afa1580156130c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130e6919061754c565b608082015260005b82811015610ceb57815161310a906706f05b59d3b20000615c69565b86828151811061311657fe5b6020026020010151111561312957610ceb565b836001600160a01b031663ba9530a6620493e084600001518560400151866020015187606001518c888151811061315c57fe5b602002602001015189608001516040518863ffffffff1660e01b815260040161318a969594939291906181c8565b60206040518083038187803b1580156131a257600080fd5b5086fa935050505080156131d3575060408051601f3d908101601f191682019092526131d09181019061754c565b60015b613201573d808015612499576040519150601f19603f3d011682016040523d82523d6000602084013e61249e565b8086838151811061320e57fe5b60200260200101818152505085828151811061322657fe5b60200260200101516000141561323c5750610ceb565b506001016130ee565b600060608061325485876152c1565b61325f8787876160c6565b92508261326b576108f0565b60405163276fdad960e11b81523090634edfb5b290613294908a9087908b908b906004016180f4565b60006040518083038186803b1580156132ac57600080fd5b505afa1580156132c0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526132e89190810190617564565b87608001819052508660800151915061335f6040518060600160405280878a604051602001613318929190617e25565b6040516020818303038152906040528152602001888a60405160200161333f929190617e25565b604051602081830303815290604052815260200161622d81525085615917565b90509450945094915050565b613373616993565b60001980825260005b845181146134a357606085828151811061339257fe5b60200260200101516020015190506133b960208251038683615c4d9092919063ffffffff16565b600060608784815181106133c957fe5b6020026020010151600001516001600160a01b03168885815181106133ea57fe5b602002602001015160400151846040516134049190617b6b565b60006040518083038160008787f1925050503d8060008114613442576040519150601f19603f3d011682016040523d82523d6000602084013e613447565b606091505b5091509150811561349557600061346b602083510383615c5d90919063ffffffff16565b905060008111801561347c57508581105b156134935760608701859052608087018290529450845b505b50505080600101905061337c565b506000198114156134b45750611b87565b60005b855181146117105760608682815181106134cd57fe5b60200260200101516020015190506134f460208251038483615c4d9092919063ffffffff16565b6000606088848151811061350457fe5b6020026020010151600001516001600160a01b031689858151811061352557fe5b6020026020010151604001518460405161353f9190617b6b565b60006040518083038160008787f1925050503d806000811461357d576040519150601f19603f3d011682016040523d82523d6000602084013e613582565b606091505b509150915081156135d15760006135a6602083510383615c5d90919063ffffffff16565b90506000811180156135b85750865181105b156135cf5780875260208701859052604087018290525b505b5050508060010190506134b7565b600080856001600160a01b031663901754d786866040518363ffffffff1660e01b8152600401613610929190617bb4565b60206040518083038186803b15801561362857600080fd5b505afa15801561363c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906136609190616ef7565b90506001600160a01b03811661367a576000915050610f44565b60006001600160a01b0386161561370c576040516370a0823160e01b81526001600160a01b038716906370a08231906136b7908590600401617b87565b60206040518083038186803b1580156136cf57600080fd5b505afa1580156136e3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613707919061754c565b613718565b816001600160a01b0316315b90508381101561372d57600092505050610f44565b6040516303c2803f60e31b81526001600160a01b03831690631e1401f890620249f090613762908a908a908a90600401617caf565b60206040518083038187803b15801561377a57600080fd5b5086fa935050505080156137ab575060408051601f3d908101601f191682019092526137a89181019061754c565b60015b6137eb573d8080156137d9576040519150601f19603f3d011682016040523d82523d6000602084013e6137de565b606091505b5060009350505050610f44565b9250610f44915050565b606061380183856152c1565b60208501516040805160028082526060828101909352816020016020820280368337019050509050858160008151811061383757fe5b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061386557fe5b6001600160a01b03909216602092830291909101909101528351806001600160401b038111801561389557600080fd5b506040519080825280602002602001820160405280156138bf578160200160208202803683370190505b5093506138ca61696c565b6138d2615300565b905060005b82811015610b145760606138f18b8984815181106109f657fe5b604051637c26833760e11b81529091506001600160a01b0387169063f84d066e906139279060019085908a908990600401617f58565b600060405180830381600087803b15801561394157600080fd5b505af192505050801561397657506040513d6000823e601f3d908101601f19168201604052613973919081019061740e565b60015b6139a4573d808015610ab6576040519150601f19603f3d011682016040523d82523d6000602084013e610abb565b6000816000815181106139b357fe5b60200260200101519050600081136139cd57505050610b14565b808985815181106139da57fe5b6020026020010181815250505050506001016138d7565b8051606090806001600160401b0381118015613a0c57600080fd5b50604051908082528060200260200182016040528015613a36578160200160208202803683370190505b50915060005b8181101561158b57866001600160a01b031663343fbcdd62061a808888888681518110613a6557fe5b60200260200101516040518563ffffffff1660e01b8152600401613a8b93929190617caf565b60206040518083038187803b158015613aa357600080fd5b5086fa93505050508015613ad4575060408051601f3d908101601f19168201909252613ad19181019061754c565b60015b613b02573d80801561153b576040519150601f19603f3d011682016040523d82523d6000602084013e611540565b80848381518110613b0f57fe5b602002602001018181525050838281518110613b2757fe5b602002602001015160001415613b3d575061158b565b50600101613a3c565b6000806060613b5585876152c1565b8351806001600160401b0381118015613b6d57600080fd5b50604051908082528060200260200182016040528015613b97578160200160208202803683370190505b509150613ba689898989616314565b945092506001600160a01b038316613bbe5750613c78565b60005b81811015613c75576000613c2f898688604051602001613be393929190617c57565b604051602081830303815290604052898789604051602001613c0793929190617c57565b604051602081830303815290604052898581518110613c2257fe5b6020026020010151616469565b905080848381518110613c3e57fe5b602002602001018181525050838281518110613c5657fe5b602002602001015160001415613c6c5750613c75565b50600101613bc1565b50505b955095509592505050565b6060613c8f83856152c1565b8151806001600160401b0381118015613ca757600080fd5b50604051908082528060200260200182016040528015613cd1578160200160208202803683370190505b50915060005b8181101561158b57866001600160a01b031663144a2752620f42408789888681518110613d0057fe5b60200260200101516040518563ffffffff1660e01b8152600401613d2693929190617caf565b60206040518083038187803b158015613d3e57600080fd5b5086fa93505050508015613d6f575060408051601f3d908101601f19168201909252613d6c9181019061754c565b60015b613d9d573d80801561153b576040519150601f19603f3d011682016040523d82523d6000602084013e611540565b80848381518110613daa57fe5b602002602001018181525050838281518110613dc257fe5b602002602001015160001415613dd8575061158b565b50600101613cd7565b60006060613def84866152c1565b8251806001600160401b0381118015613e0757600080fd5b50604051908082528060200260200182016040528015613e31578160200160208202803683370190505b50915060005b81811015613ea6576000613e60898989898681518110613e5357fe5b60200260200101516135df565b905080848381518110613e6f57fe5b602002602001018181525050838281518110613e8757fe5b602002602001015160001415613e9d5750613ea6565b50600101613e37565b5060405163901754d760e01b81526001600160a01b0388169063901754d790613ed59089908990600401617bb4565b60206040518083038186803b158015613eed57600080fd5b505afa158015613f01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f259190616ef7565b92505094509492505050565b604080516060818101909252610fb29080613f50868960808401617bb4565b60405160208183030381529060405281526020018688604051602001613f77929190617bb4565b604051602081830303815290604052815260200161655b81525083615917565b604080516060818101909252610fb29080613fb6868960808401617bb4565b60405160208183030381529060405281526020018688604051602001613fdd929190617bb4565b60405160208183030381529060405281526020016165a281525083615917565b606061400983856152c1565b8151806001600160401b038111801561402157600080fd5b5060405190808252806020026020018201604052801561404b578160200160208202803683370190505b50915060006001600160a01b0386161561406e5761406987876153c1565b614071565b60005b905060006001600160a01b038616156140935761408e88876153c1565b614096565b60005b905060005b83811015610ceb5760016001600160a01b0388166140ec576140cb846395b68fe760e01b898581518110610bef57fe5b8784815181106140d757fe5b60200260200101819350828152505050614186565b6001600160a01b038916614112576140cb8363cd7724c360e01b898581518110610bef57fe5b600061412c856395b68fe760e01b8a8681518110610bef57fe5b925090508015614169576141488463cd7724c360e01b83615440565b88858151811061415457fe5b60200260200101819450828152505050614184565b600087848151811061417757fe5b6020026020010181815250505b505b8015806141a6575085828151811061419a57fe5b60200260200101516000145b156141b15750610ceb565b5060010161409b565b8051606090806001600160401b03811180156141d557600080fd5b506040519080825280602002602001820160405280156141ff578160200160208202803683370190505b50915060005b8181101561171057856001600160a01b0316631f00ca74620249f086848151811061422c57fe5b6020026020010151886040518463ffffffff1660e01b8152600401614252929190618184565b60006040518083038187803b15801561426a57600080fd5b5086fa935050505080156142a057506040513d6000823e601f3d908101601f1916820160405261429d91908101906174fa565b60015b6142ce573d8080156116a9576040519150601f19603f3d011682016040523d82523d6000602084013e6116ae565b806000815181106142db57fe5b60200260200101518483815181106142ef57fe5b60200260200101818152505083828151811061430757fe5b60200260200101516000141561431d5750611710565b50600101614205565b606061433283856152c1565b8151806001600160401b038111801561434a57600080fd5b50604051908082528060200260200182016040528015614374578160200160208202803683370190505b50915060005b8181101561158b57866001600160a01b031663ff1fd974620f424088888886815181106143a357fe5b60200260200101516040518563ffffffff1660e01b81526004016143c993929190617caf565b60206040518083038187803b1580156143e157600080fd5b5086fa93505050508015614412575060408051601f3d908101601f1916820190925261440f9181019061754c565b60015b614440573d80801561153b576040519150601f19603f3d011682016040523d82523d6000602084013e611540565b8084838151811061444d57fe5b60200260200101818152505083828151811061446557fe5b60200260200101516000141561447b575061158b565b5060010161437a565b600060608061449385876152c1565b61449e8787876160c6565b9250826144aa576108f0565b60405163276fdad960e11b81523090634edfb5b2906144d3908a9087908b908b906004016180f4565b60006040518083038186803b1580156144eb57600080fd5b505afa1580156144ff573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526145279190810190617564565b608088018190528451909250806001600160401b038111801561454957600080fd5b50604051908082528060200260200182016040528015614573578160200160208202803683370190505b50915060005b8181101561465e576000306001600160a01b031663f1ed7fa48b8b8b8b87815181106145a157fe5b60200260200101516040518563ffffffff1660e01b81526004016145c894939291906180be565b60206040518083038186803b1580156145e057600080fd5b505afa1580156145f4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614618919061754c565b90508084838151811061462757fe5b60200260200101818152505083828151811061463f57fe5b602002602001015160001415614655575061465e565b50600101614579565b50509450945094915050565b600080606061467985876152c1565b61468588888888616314565b935091506001600160a01b03821661469c57613c78565b8351806001600160401b03811180156146b457600080fd5b506040519080825280602002602001820160405280156146de578160200160208202803683370190505b50604080516060810190915290925061474b90806147028987891560808501617c57565b604051602081830303815290604052815260200189868860405160200161472b93929190617c57565b604051602081830303815290604052815260200161646981525086615917565b915050955095509592505050565b600080606061476885876152c1565b8351806001600160401b038111801561478057600080fd5b506040519080825280602002602001820160405280156147aa578160200160208202803683370190505b508851604051630939d86360e11b81529193506001600160a01b031690631273b0c6906147dd908a908a90600401617bb4565b60206040518083038186803b1580156147f557600080fd5b505afa158015614809573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061482d9190616ef7565b925060006001600160a01b0384161561484b575060019350866148ea565b8851604051630939d86360e11b81526001600160a01b0390911690631273b0c69061487c908a908c90600401617bb4565b60206040518083038186803b15801561489457600080fd5b505afa1580156148a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906148cc9190616ef7565b93506001600160a01b0384166148e35750506108f0565b5060009350855b836001600160a01b031663dd58b41c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561492357600080fd5b505afa158015614937573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061495b919061752c565b6149665750506108f0565b6149de60405180606001604052808987858e6020015160405160200161498f9493929190617bce565b60405160208183030381529060405281526020018a87858e602001516040516020016149be9493929190617bce565b6040516020818303038152906040528152602001615b1481525087615917565b925050509450945094915050565b8051606090806001600160401b0381118015614a0757600080fd5b50604051908082528060200260200182016040528015614a31578160200160208202803683370190505b50915060005b8181101561158b57866001600160a01b031663838e6a22620493e08888888681518110614a6057fe5b60200260200101516040518563ffffffff1660e01b8152600401614a8693929190617caf565b60206040518083038187803b158015614a9e57600080fd5b5086fa93505050508015614acf575060408051601f3d908101601f19168201909252614acc9181019061754c565b60015b614afd573d80801561153b576040519150601f19603f3d011682016040523d82523d6000602084013e611540565b80848381518110614b0a57fe5b60200260200101818152505050600101614a37565b600084608001515160001415614b3757506000610f44565b84604001516001600160a01b031663418436bc6207a12087606001516001600160a01b0316876001600160a01b031614614b715786614b87565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b031614614baa5786614bc0565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b8660008b608001516040518763ffffffff1660e01b8152600401614be8959493929190617cd3565b60206040518083038187803b158015614c0057600080fd5b5086fa93505050508015614c31575060408051601f3d908101601f19168201909252614c2e9181019061754c565b60015b614c6f573d808015614c5f576040519150601f19603f3d011682016040523d82523d6000602084013e614c64565b606091505b506000915050610f44565b6000614c7a85616657565b60ff1690506000614c8a87616657565b60ff169050670de0b6b3a764000081600a0a83600a0a8786020281614cab57fe5b0481614cb357fe5b049350505050610f44565b60006060614ccc84866152c1565b8251806001600160401b0381118015614ce457600080fd5b50604051908082528060200260200182016040528015614d0e578160200160208202803683370190505b509150614d7960405180606001604052808988604051602001614d32929190617bb4565b60405160208183030381529060405281526020018989604051602001614d59929190617bb4565b604051602081830303815290604052815260200161666a81525085615917565b60405163901754d760e01b81529092506001600160a01b0388169063901754d790613ed59089908990600401617bb4565b60606000836001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b158015614de757600080fd5b505afa158015614dfb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614e1f9190616ef7565b905060018351036001600160401b0381118015614e3b57600080fd5b50604051908082528060200260200182016040528015614e65578160200160208202803683370190505b50915060005b825181101561508657816001600160a01b0316635b1dc86f620249f0868481518110614e9357fe5b6020026020010151878560010181518110614eaa57fe5b60200260200101516040518463ffffffff1660e01b8152600401614ecf929190617bb4565b60006040518083038187803b158015614ee757600080fd5b5086fa93505050508015614f1d57506040513d6000823e601f3d908101601f19168201604052614f1a91908101906172ac565b60015b614f6b573d808015614f4b576040519150601f19603f3d011682016040523d82523d6000602084013e614f50565b606091505b50506040805160008152602081019091529250615089915050565b6000815160001415614f925750506040805160008152602081019091529250615089915050565b60005b825181101561507b576000838281518110614fac57fe5b60200260200101516001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015614fec57600080fd5b505afa158015615000573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615024919061754c565b9050828111156150725780925083828151811061503d57fe5b602002602001015187868151811061505157fe5b60200260200101906001600160a01b031690816001600160a01b0316815250505b50600101614f95565b505050600101614e6b565b50505b92915050565b6000606085600001516001600160a01b03166321f8a72187600001516001600160a01b0316639232494e6040518163ffffffff1660e01b815260040160206040518083038186803b1580156150e357600080fd5b505afa1580156150f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061511b919061754c565b6040518263ffffffff1660e01b81526004016151379190617ecf565b60206040518083038186803b15801561514f57600080fd5b505afa158015615163573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906151879190616ef7565b91508560200151516000141561519c576152b8565b6000805b8760200151518110156152b5576002886020015182815181106151bf57fe5b60200260200101515110156151d3576152ad565b836001600160a01b0316637f9c0ecd620493e08a6020015184815181106151f657fe5b60200260200101518860018a51038151811061520e57fe5b60200260200101516040518463ffffffff1660e01b8152600401615233929190617e6e565b60206040518083038187803b15801561524b57600080fd5b5086fa9350505050801561527c575060408051601f3d908101601f191682019092526152799181019061754c565b60015b615285576152ad565b828111156152ab57809250886020015182815181106152a057fe5b602002602001015193505b505b6001016151a0565b50505b94509492505050565b806001600160a01b0316826001600160a01b031614156152fc5760405162461bcd60e51b81526004016152f390618047565b60405180910390fd5b5050565b61530861696c565b50604080516080810182523080825260006020830181905292820152606081019190915290565b604080516001808252818301909252606091829190816020015b6153516169f1565b8152602001906001900390816153495790505090506040518060a0016040528085600001518152602001600081526020016001815260200184815260200160405180602001604052806000815250815250816000815181106153af57fe5b60209081029190910101529392505050565b6040516303795fb160e11b81526000906001600160a01b038416906306f2bf62906153f0908590600401617b87565b60206040518083038186803b15801561540857600080fd5b505afa15801561541c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b879190616ef7565b6000806001600160a01b03851661545657610792565b6060856001600160a01b0316620249f086866040516024016154789190617ecf565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516154b69190617b6b565b6000604051808303818686fa925050503d80600081146154f2576040519150601f19603f3d011682016040523d82523d6000602084013e6154f7565b606091505b509092509050811561551a5780806020019051810190615517919061754c565b92505b50935093915050565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b81526004016155599190617ecf565b60a06040518083038186803b15801561557157600080fd5b505afa158015615585573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906155a9919061798c565b94509450505092506000620f424090508a604001516001600160a01b0316896001600160a01b031614156156d15760006155e88964e8d4a510006166ba565b9050600061560c6b033b2e3c9fd0803ce800000061560688856166f0565b906166ba565b905084811061562457600096505050505050506157da565b60006156b3670de0b6b3a76400006156ad8c6001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561566e57600080fd5b505afa158015615682573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906156a6919061754c565b86906166ba565b9061670c565b905060006156c18483616736565b98506157da975050505050505050565b8a604001516001600160a01b03168a6001600160a01b031614156157d1578784811115615706576000955050505050506157da565b60006157226b033b2e3c9fd0803ce80000006156068885616736565b905083811161573a57600096505050505050506157da565b60006157bf8a6001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b15801561577857600080fd5b505afa15801561578c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906157b0919061754c565b670de0b6b3a7640000906166f0565b905060006156c1826156ad86886166ba565b60009450505050505b9695505050505050565b6000806157ef616a23565b8580602001905181019061580391906175b2565b9150915060008580602001905181019061581d9190617596565b905060006060306322db5ed160e21b8587866158388c616755565b60405160240161584b949392919061808c565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516158899190617b6b565b600060405180830381855afa9150503d80600081146158c4576040519150601f19603f3d011682016040523d82523d6000602084013e6158c9565b606091505b5091509150816158e157600095505050505050611b87565b808060200190518101906158f591906174fa565b60008151811061590157fe5b6020026020010151955050505050509392505050565b606081516001600160401b038111801561593057600080fd5b5060405190808252806020026020018201604052801561595a578160200160208202803683370190505b50905081516000141561596c57615089565b600061599d846000015185602001518560008151811061598857fe5b6020026020010151876040015163ffffffff16565b9050806159aa5750615089565b60006159c78560200151866000015184886040015163ffffffff16565b9050806159d5575050615089565b60005b8451811015615b0b5760005b6005811015615acd57615a0b8683815181106159fc57fe5b60200260200101518486616796565b935083615a1757615acd565b615a2661271561271086616796565b935083615a3257615acd565b6000615a4f88602001518960000151878b6040015163ffffffff16565b905080615a5c5750615acd565b809350868381518110615a6b57fe5b60200260200101518410615ac4576000878481518110615a8757fe5b6020026020010151612710898681518110615a9e57fe5b602002602001015187030281615ab057fe5b04905060058111615ac2575050615acd565b505b506001016159e4565b50615aec858281518110615add57fe5b60200260200101518385616796565b848281518110615af857fe5b60209081029190910101526001016159d8565b50505092915050565b600080600080600087806020019051810190615b309190616f4c565b9350935093509350816001600160a01b0316846001600160a01b03161415615c1a576040516351400f0b60e11b81526001600160a01b0384169063a2801e1690620493e090615b83908a90600401617ecf565b60206040518083038187803b158015615b9b57600080fd5b5086fa93505050508015615bcc575060408051601f3d908101601f19168201909252615bc99181019061754c565b60015b615c0e573d808015615bfa576040519150601f19603f3d011682016040523d82523d6000602084013e615bff565b606091505b50600095505050505050611b87565b9450611b879350505050565b60405163ca19ebd960e01b81526001600160a01b0382169063ca19ebd990620493e090615b839087908b90600401617b9b565b615c588383836167ee565b505050565b6000611b878383616815565b60008282028315801590615c86575082848281615c8257fe5b0414155b15615c95576000915050615089565b6706f05b59d3b20000810181811015615cb357600092505050615089565b670de0b6b3a76400009004949350505050565b600080600085806020019051810190615cdf9190616f13565b91509150600085806020019051810190615cf99190616ef7565b90503063e8e4af09838584615d0d8a616755565b6040518563ffffffff1660e01b8152600401615d2c9493929190617bf9565b60006040518083038186803b158015615d4457600080fd5b505afa925050508015615d7957506040513d6000823e601f3d908101601f19168201604052615d7691908101906174fa565b60015b615dba573d808015615da7576040519150601f19603f3d011682016040523d82523d6000602084013e615dac565b606091505b506000945050505050611b87565b80600081518110615dc757fe5b6020026020010151945050505050611b87565b600080600080846001600160a01b031663d9638d368b602001516040518263ffffffff1660e01b8152600401615e109190617ecf565b60a06040518083038186803b158015615e2857600080fd5b505afa158015615e3c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615e60919061798c565b945094505050925089604001516001600160a01b0316886001600160a01b03161415615f7d5760008790506000615f10886001600160a01b031663568d4b6f6040518163ffffffff1660e01b815260040160206040518083038186803b158015615ec957600080fd5b505afa158015615edd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190615f01919061754c565b670de0b6b3a764000090616736565b90506000615f2a826156ad85670de0b6b3a76400006166ba565b90506000615f486b033b2e3c9fd0803ce800000061560689856166f0565b9050858110615f615760009750505050505050506157da565b60006156c16001615f778564e8d4a5100061670c565b906166f0565b89604001516001600160a01b0316896001600160a01b03161415616062576000615fac8864e8d4a510006166ba565b90506000615fec886001600160a01b031663fae036d56040518163ffffffff1660e01b815260040160206040518083038186803b15801561577857600080fd5b90506000616006670de0b6b3a76400006156ad85856166ba565b90508581111561601f57600096505050505050506157da565b600061603b6b033b2e3c9fd0803ce80000006156068985616736565b90508481116160545760009750505050505050506157da565b5095506157da945050505050565b5060009998505050505050505050565b60008061607d616a23565b8580602001905181019061609191906175b2565b915091506000858060200190518101906160ab9190617596565b9050600060603063205e01d760e11b8587866158388c616755565b600080846020015190506060816001600160a01b031663910ffc7187606001516001600160a01b0316876001600160a01b031614616104578661611a565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b88606001516001600160a01b0316876001600160a01b03161461613d5786616153565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee5b604080516000815260208101918290526001600160e01b031960e086901b1690915261618792919060019060248101617c7b565b60006040518083038186803b15801561619f57600080fd5b505afa1580156161b3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526161db9190810190617344565b5050905080518660000151106161f7575060009150611b879050565b8086600001518151811061620757fe5b6020026020010151925060f883901c60001c60bb1415611710575060009150611b879050565b600080616238616a43565b8480602001905181019061624c9190616ffa565b915091506000868060200190518101906162669190616ffa565b50604051633c7b5fe960e21b8152909150309063f1ed7fa490616293908590859088908b906004016180be565b60206040518083038186803b1580156162ab57600080fd5b505afa9250505080156162db575060408051601f3d908101601f191682019092526162d89181019061754c565b60015b616309573d808015615da7576040519150601f19603f3d011682016040523d82523d6000602084013e615dac565b9350611b8792505050565b6000806060866001600160a01b03166357a281dc86866040518363ffffffff1660e01b8152600401616347929190617bb4565b60006040518083038186803b15801561635f57600080fd5b505afa158015616373573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261639b91908101906172ac565b905060019150805160001415616434576040516315e8a07760e21b81526001600160a01b038816906357a281dc906163d99087908990600401617bb4565b60006040518083038186803b1580156163f157600080fd5b505afa158015616405573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261642d91908101906172ac565b9050600091505b805186106164495760008092509250506152b8565b80868151811061645557fe5b602002602001015192505094509492505050565b600080600080868060200190518101906164839190616faa565b925092509250801561652757604051633cd0243b60e11b81526001600160a01b038316906379a0487690620493e0906164c3906000908a90600401617b9b565b604080518083038187803b1580156164da57600080fd5b5086fa9350505050801561650b575060408051601f3d908101601f1916820190925261650891810190617934565b60015b61651b5760009350505050611b87565b509350611b8792505050565b6040516366410a2160e01b81526001600160a01b038316906366410a2190620493e0906164c3906000908a90600401617b9b565b6000806000858060200190518101906165749190616f13565b9150915060008580602001905181019061658e9190616ef7565b9050306330d6570d838584615d0d8a616755565b6000806000858060200190518101906165bb9190616f13565b915091506000858060200190518101906165d59190616ef7565b90503063a469841762061a808486856165ed8b616755565b6040518663ffffffff1660e01b815260040161660c9493929190617bf9565b60006040518083038187803b15801561662457600080fd5b5086fa93505050508015615d7957506040513d6000823e601f3d908101601f19168201604052615d7691908101906174fa565b60006166628261683f565b90505b919050565b6000806000858060200190518101906166839190616f13565b915091506000808680602001905181019061669e9190616f13565b915091506166ae848483896135df565b98975050505050505050565b6000826166c957506000615089565b828202828482816166d657fe5b0414611b8757611b876166eb600186866168eb565b616945565b600082820183811015611b8757611b876166eb600086866168eb565b600081616722576167226166eb600385856168eb565b600082848161672d57fe5b04949350505050565b60008282111561674f5761674f6166eb600285856168eb565b50900390565b60408051600180825281830190925260609160208083019080368337019050509050818160008151811061678557fe5b602002602001018181525050919050565b60008315806167a3575081155b806167ac575082155b156167b957506000611b87565b838202828582816167c657fe5b04146167d6576000915050611b87565b83600185038201816167e457fe5b0495945050505050565b816020018351101561680d5761680d6166eb600585518560200161694d565b910160200152565b60008160200183511015616836576168366166eb600585518560200161694d565b50016020015190565b60006012905060006060836001600160a01b031660405180604001604052806004815260200163313ce56760e01b81525060405161687d9190617b6b565b600060405180830381855afa9150503d80600081146168b8576040519150601f19603f3d011682016040523d82523d6000602084013e6168bd565b606091505b50915091508180156168d157506020815110155b156168e4576168e1816000615c5d565b92505b5050919050565b606063e946c1bb60e01b84848460405160240161690a93929190617f28565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915290509392505050565b805160208201fd5b6060632800659560e01b84848460405160240161690a93929190617f4a565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6040518060a0016040528060008152602001600081526020016060815260200160008152602001606081525090565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b6040518060a0016040528060008019168152602001600081526020016000815260200160008152602001606081525090565b604080516060810182526000808252602082018190529181019190915290565b6040518060a001604052806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001606081525090565b80356150898161829e565b80516150898161829e565b600082601f830112616ab3578081fd5b8135616ac6616ac182618216565b6181f0565b818152915060208083019084810181840286018201871015616ae757600080fd5b60005b84811015616b0f578135616afd8161829e565b84529282019290820190600101616aea565b505050505092915050565b600082601f830112616b2a578081fd5b8135616b38616ac182618216565b818152915060208083019084810160005b84811015616b0f57616b60888484358a0101616aa3565b84529282019290820190600101616b49565b600082601f830112616b82578081fd5b8135616b90616ac182618216565b818152915060208083019084810160005b84811015616b0f5781358701606080601f19838c03011215616bc257600080fd5b616bcb816181f0565b85830135616bd88161829e565b81526040838101356001600160401b03811115616bf457600080fd5b616c028d8983880101616cde565b888401525091909201359082015284529282019290820190600101616ba1565b600082601f830112616c32578081fd5b8135616c40616ac182618216565b818152915060208083019084810181840286018201871015616c6157600080fd5b60005b84811015616b0f57813584529282019290820190600101616c64565b600082601f830112616c90578081fd5b8151616c9e616ac182618216565b818152915060208083019084810181840286018201871015616cbf57600080fd5b60005b84811015616b0f57815184529282019290820190600101616cc2565b600082601f830112616cee578081fd5b8135616cfc616ac182618235565b9150808252836020828501011115616d1357600080fd5b8060208401602084013760009082016020015292915050565b600082601f830112616d3c578081fd5b8151616d4a616ac182618235565b9150808252836020828501011115616d6157600080fd5b616d7281602084016020860161826e565b5092915050565b80516002811061508957600080fd5b600060608284031215616d99578081fd5b616da360606181f0565b90508135616db08161829e565b81526020820135616dc0816182b6565b60208201526040820135616dd3816182b6565b604082015292915050565b600060608284031215616def578081fd5b616df960606181f0565b90508151616e068161829e565b81526020820151616e16816182b6565b60208201526040820151616dd3816182b6565b600060408284031215616e3a578081fd5b616e4460406181f0565b90508135616e518161829e565b81526020820135616e618161829e565b602082015292915050565b600060a08284031215616e7d578081fd5b616e8760a06181f0565b9050813581526020820135616e9b8161829e565b60208201526040820135616eae8161829e565b60408201526060820135616ec18161829e565b606082015260808201356001600160401b03811115616edf57600080fd5b616eeb84828501616cde565b60808301525092915050565b600060208284031215616f08578081fd5b8151611b878161829e565b60008060408385031215616f25578081fd5b8251616f308161829e565b6020840151909250616f418161829e565b809150509250929050565b60008060008060808587031215616f61578182fd5b8451616f6c8161829e565b6020860151909450616f7d8161829e565b6040860151909350616f8e8161829e565b6060860151909250616f9f8161829e565b939692955090935050565b600080600060608486031215616fbe578081fd5b8351616fc98161829e565b6020850151909350616fda8161829e565b60408501519092508015158114616fef578182fd5b809150509250925092565b6000806040838503121561700c578182fd5b82516170178161829e565b60208401519092506001600160401b0380821115617033578283fd5b9084019060a08287031215617046578283fd5b61705060a06181f0565b825181526170618760208501616a98565b60208201526170738760408501616a98565b60408201526170858760608501616a98565b606082015260808301518281111561709b578485fd5b6170a788828601616d2c565b6080830152508093505050509250929050565b600080600080600060a086880312156170d1578283fd5b85356170dc8161829e565b945060208601356170ec8161829e565b935060408601356170fc8161829e565b9250606086013561710c8161829e565b915060808601356001600160401b03811115617126578182fd5b61713288828901616c22565b9150509295509295909350565b60008060008060808587031215617154578182fd5b843561715f8161829e565b9350602085013561716f8161829e565b9250604085013561717f8161829e565b915060608501356001600160401b03811115617199578182fd5b6171a587828801616c22565b91505092959194509250565b600080600080608085870312156171c6578182fd5b84356171d18161829e565b935060208501356171e18161829e565b925060408501356171f18161829e565b9396929550929360600135925050565b600080600060608486031215617215578081fd5b83356172208161829e565b925060208401356001600160401b038082111561723b578283fd5b61724787838801616aa3565b9350604086013591508082111561725c578283fd5b5061726986828701616c22565b9150509250925092565b600080600080600060a0868803121561728a578283fd5b85356172958161829e565b94506020860135935060408601356170fc8161829e565b600060208083850312156172be578182fd5b82516001600160401b038111156172d3578283fd5b8301601f810185136172e3578283fd5b80516172f1616ac182618216565b818152838101908385018584028501860189101561730d578687fd5b8694505b838510156173385780516173248161829e565b835260019490940193918501918501617311565b50979650505050505050565b600080600060608486031215617358578081fd5b83516001600160401b038082111561736e578283fd5b818601915086601f830112617381578283fd5b815161738f616ac182618216565b80828252602080830192508086018b8283870289010111156173af578788fd5b8796505b848710156173d15780518452600196909601959281019281016173b3565b5089015190975093505050808211156173e8578283fd5b506173f586828701616c80565b9250506174058560408601616d79565b90509250925092565b60006020808385031215617420578182fd5b82516001600160401b03811115617435578283fd5b8301601f81018513617445578283fd5b8051617453616ac182618216565b818152838101908385018584028501860189101561746f578687fd5b8694505b83851015617338578051835260019490940193918501918501617473565b6000806000606084860312156174a5578081fd5b83356001600160401b03808211156174bb578283fd5b6174c787838801616b72565b945060208601359150808211156174dc578283fd5b506174e986828701616b72565b925050604084013590509250925092565b60006020828403121561750b578081fd5b81516001600160401b03811115617520578182fd5b610f4484828501616c80565b60006020828403121561753d578081fd5b81518015158114611b87578182fd5b60006020828403121561755d578081fd5b5051919050565b600060208284031215617575578081fd5b81516001600160401b0381111561758a578182fd5b610f4484828501616d2c565b6000602082840312156175a7578081fd5b8151611b87816182cc565b600080608083850312156175c4578182fd5b82516175cf816182cc565b91506175de8460208501616dde565b90509250929050565b60008060008084860360a08112156175fd578283fd5b604081121561760a578283fd5b5061761560406181f0565b8535815260208601356176278161829e565b60208201529350604085013561763c8161829e565b9250606085013561764c8161829e565b915060808501356001600160401b03811115617199578182fd5b6000806000806080858703121561767b578182fd5b84356001600160401b0380821115617691578384fd5b90860190604082890312156176a4578384fd5b6176ae60406181f0565b6176b88984616a8d565b81526020830135828111156176cb578586fd5b6176d78a828601616b1a565b602083015250809650506176ee8860208901616a8d565b94506176fd8860408901616a8d565b93506060870135915080821115617712578283fd5b506171a587828801616c22565b60008060008060c08587031215617734578182fd5b61773e8686616d88565b9350606085013561774e816182cc565b9250608085013561775e816182cc565b915060a08501356001600160401b03811115617199578182fd5b60008060008060a0858703121561778d578182fd5b6177978686616e29565b9350604085013561763c8161829e565b600080600080608085870312156177bc578182fd5b84356001600160401b03808211156177d2578384fd5b6177de88838901616e6c565b9550602087013591506177f08261829e565b9093506040860135906178028261829e565b90925060608601359080821115617712578283fd5b6000806000806080858703121561782c578182fd5b84356001600160401b03811115617841578283fd5b61784d87828801616e6c565b94505060208501356171e18161829e565b60008060008060808587031215617873578182fd5b84356001600160401b03811115617888578283fd5b61789487828801616e6c565b9450506020850135925060408501356178ac8161829e565b91506060850135616f9f8161829e565b60008060008084860360c08112156178d2578283fd5b60608112156178df578283fd5b506178ea60606181f0565b85356178f58161829e565b815260208681013590820152604086013561790f8161829e565b6040820152935060608501356179248161829e565b9250608085013561775e8161829e565b60008060408385031215617946578182fd5b505080516020909101519092909150565b6000806000806080858703121561796c578182fd5b505082516020840151604085015160609095015191969095509092509050565b600080600080600060a086880312156179a3578283fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b6001600160a01b0316815260200190565b600081518352602082015160208401526040820151604084015260608201516060840152608082015160a06080850152610f4460a0850182617a8b565b6000815180845260208085019450808401835b83811015617a515781516001600160a01b031687529582019590820190600101617a2c565b509495945050505050565b6000815180845260208085019450808401835b83811015617a5157815187529582019590820190600101617a6f565b60008151808452617aa381602086016020860161826e565b601f01601f19169290920160200192915050565b80516001600160a01b031682526020808201516001600160e01b03199081169184019190915260409182015116910152565b80516001600160a01b039081168352602080830151151590840152604080830151909116908301526060908101511515910152565b600081518352602082015160018060a01b0380821660208601528060408501511660408601528060608501511660608601525050608082015160a06080850152610f4460a0850182617a8b565b60008251617b7d81846020870161826e565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03948516815292841660208401529083166040830152909116606082015260800190565b6001600160a01b0385811682528481166020830152831660408201526080606082018190526000906157da90830184617a5c565b6001600160a01b039485168152928416602084015292166040820152606081019190915260800190565b6001600160a01b039384168152919092166020820152901515604082015260600190565b6001600160a01b0385811682528416602082015282151560408201526080606082018190526000906157da90830184617a8b565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090617d0d90830184617a8b565b979650505050505050565b6001600160a01b0384168152606060208201819052600090617d3c90830185617a19565b82810360408401526157da8185617a5c565b6001600160a01b03851681526000617d6585618258565b602083015260806040830152617d7e6080830185617a5c565b8281036060840152617d0d8185617a5c565b6001600160a01b03898116825260009061010090617dad8b618258565b6020850152816040850152617dc48285018b617a5c565b91508382036060850152617dd8828a617a5c565b90881660808501529050617deb86618258565b60a084015282810360c0840152617e028186617a5c565b905082810360e0840152617e168185617a5c565b9b9a5050505050505050505050565b6001600160a01b0383168152604060208201819052600090610f4490830184617b1e565b600060408252617e5c6040830185617a19565b8281036020840152610fb28185617a5c565b600060408252617e816040830185617a19565b90508260208301529392505050565b600060208252611b876020830184617a5c565b83151581526001600160a01b0383166020820152606060408201819052600090610fb290830184617a5c565b90815260200190565b600084825260606020830152617d3c6060830185617a8b565b600060208252611b876020830184617a8b565b6001600160a01b0383168152604060208201819052600090610f4490830184617a5c565b6060810160048510617f3657fe5b938152602081019290925260409091015290565b6060810160088510617f3657fe5b600060e08201617f6787618263565b8352602060e081850152818751617f7e8185617ecf565b91508193508281028201838a01865b83811015617fb7578683038552617fa58383516179dc565b94860194925090850190600101617f8d565b5050868103604088015280945088519250617fd28382617ecf565b94505050818701845b82811015617ffc57617fee8583516179cb565b945090830190600101617fdb565b5050505080915050610fb26060830184617ae9565b600f93840b81529190920b6020820152604081019190915260600190565b600f83900b815260808101611b876020830184617ab7565b60208082526025908201527f455243323042726964676553616d706c65722f494e56414c49445f544f4b454e6040820152642fa820a4a960d91b606082015260800190565b60006180988287617ab7565b84600f0b606083015283600f0b608083015260c060a08301526157da60c0830184617a5c565b6000608082526180d16080830187617b1e565b6001600160a01b0395861660208401529390941660408201526060015292915050565b6000608082526181076080830187617b1e565b6020830195909552506001600160a01b0392831660408201529116606090910152919050565b6000602082528251602083015260208301516040830152604083015160a0606084015261815d60c0840182617a8b565b9050606084015160808401526080840151601f198483030160a0850152610fb28282617a8b565b600083825260406020830152610f446040830184617a19565b6000848252606060208301526181b66060830185617a19565b82810360408401526157da8185617a19565b958652602086019490945260408501929092526060840152608083015260a082015260c00190565b6040518181016001600160401b038111828210171561820e57600080fd5b604052919050565b60006001600160401b0382111561822b578081fd5b5060209081020190565b60006001600160401b0382111561824a578081fd5b50601f01601f191660200190565b806004811061666557fe5b806002811061666557fe5b60005b83811015618289578181015183820152602001618271565b83811115618298576000848401525b50505050565b6001600160a01b03811681146182b357600080fd5b50565b6001600160e01b0319811681146182b357600080fd5b80600f0b81146182b357600080fdfea2646970667358221220c846e5c34b8eff5cb868f478c4dfd272689d72a8d95f05785cbf7fba7711201764736f6c634300060c0033';
ERC20BridgeSamplerContract.contractName = 'ERC20BridgeSampler';
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=erc20_bridge_sampler.js.map