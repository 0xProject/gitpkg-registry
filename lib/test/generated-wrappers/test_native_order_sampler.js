"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
class TestNativeOrderSamplerContract extends base_contract_1.BaseContract {
    constructor(address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode = TestNativeOrderSamplerContract.deployedBytecode) {
        super('TestNativeOrderSampler', TestNativeOrderSamplerContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode);
        this._methodABIIndex = {};
        utils_1.classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
        TestNativeOrderSamplerContract.ABI().forEach((item, index) => {
            if (item.type === 'function') {
                const methodAbi = item;
                this._methodABIIndex[methodAbi.name] = index;
            }
        });
    }
    static deployFrom0xArtifactAsync(artifact, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema, [
                json_schemas_1.schemas.addressSchema,
                json_schemas_1.schemas.numberSchema,
                json_schemas_1.schemas.jsNumber,
            ]);
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
            return TestNativeOrderSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly);
        });
    }
    static deployWithLibrariesFrom0xArtifactAsync(artifact, libraryArtifacts, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema, [
                json_schemas_1.schemas.addressSchema,
                json_schemas_1.schemas.numberSchema,
                json_schemas_1.schemas.jsNumber,
            ]);
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
            const libraryAddresses = yield TestNativeOrderSamplerContract._deployLibrariesAsync(artifact, libraryArtifacts, new web3_wrapper_1.Web3Wrapper(provider), txDefaults);
            const bytecode = base_contract_1.linkLibrariesInBytecode(artifact, libraryAddresses);
            return TestNativeOrderSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly);
        });
    }
    static deployAsync(bytecode, abi, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isHexString('bytecode', bytecode);
            assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema, [
                json_schemas_1.schemas.addressSchema,
                json_schemas_1.schemas.numberSchema,
                json_schemas_1.schemas.jsNumber,
            ]);
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
            utils_1.logUtils.log(`TestNativeOrderSampler successfully deployed at ${txReceipt.contractAddress}`);
            const contractInstance = new TestNativeOrderSamplerContract(txReceipt.contractAddress, provider, txDefaults, logDecodeDependencies);
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
                constant: false,
                inputs: [
                    {
                        name: 'count',
                        type: 'uint256',
                    },
                ],
                name: 'createTokens',
                outputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'proxyId',
                        type: 'bytes4',
                    },
                ],
                name: 'getAssetProxy',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'pure',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'orders',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'makerAddress',
                                type: 'address',
                            },
                            {
                                name: 'takerAddress',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipientAddress',
                                type: 'address',
                            },
                            {
                                name: 'senderAddress',
                                type: 'address',
                            },
                            {
                                name: 'makerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'takerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'makerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'takerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'expirationTimeSeconds',
                                type: 'uint256',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                            {
                                name: 'makerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'makerFeeAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerFeeAssetData',
                                type: 'bytes',
                            },
                        ]
                    },
                    {
                        name: 'orderSignatures',
                        type: 'bytes[]',
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getOrderFillableMakerAssetAmounts',
                outputs: [
                    {
                        name: 'orderFillableMakerAssetAmounts',
                        type: 'uint256[]',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'order',
                        type: 'tuple',
                        components: [
                            {
                                name: 'makerAddress',
                                type: 'address',
                            },
                            {
                                name: 'takerAddress',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipientAddress',
                                type: 'address',
                            },
                            {
                                name: 'senderAddress',
                                type: 'address',
                            },
                            {
                                name: 'makerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'takerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'makerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'takerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'expirationTimeSeconds',
                                type: 'uint256',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                            {
                                name: 'makerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'makerFeeAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerFeeAssetData',
                                type: 'bytes',
                            },
                        ]
                    },
                    {
                        name: 'signature',
                        type: 'bytes',
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getOrderFillableTakerAmount',
                outputs: [
                    {
                        name: 'fillableTakerAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'orders',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'makerAddress',
                                type: 'address',
                            },
                            {
                                name: 'takerAddress',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipientAddress',
                                type: 'address',
                            },
                            {
                                name: 'senderAddress',
                                type: 'address',
                            },
                            {
                                name: 'makerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'takerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'makerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'takerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'expirationTimeSeconds',
                                type: 'uint256',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                            {
                                name: 'makerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'makerFeeAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerFeeAssetData',
                                type: 'bytes',
                            },
                        ]
                    },
                    {
                        name: 'orderSignatures',
                        type: 'bytes[]',
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getOrderFillableTakerAssetAmounts',
                outputs: [
                    {
                        name: 'orderFillableTakerAssetAmounts',
                        type: 'uint256[]',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'order',
                        type: 'tuple',
                        components: [
                            {
                                name: 'makerAddress',
                                type: 'address',
                            },
                            {
                                name: 'takerAddress',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipientAddress',
                                type: 'address',
                            },
                            {
                                name: 'senderAddress',
                                type: 'address',
                            },
                            {
                                name: 'makerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'takerAssetAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'makerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'takerFee',
                                type: 'uint256',
                            },
                            {
                                name: 'expirationTimeSeconds',
                                type: 'uint256',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                            {
                                name: 'makerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'makerFeeAssetData',
                                type: 'bytes',
                            },
                            {
                                name: 'takerFeeAssetData',
                                type: 'bytes',
                            },
                        ]
                    },
                ],
                name: 'getOrderInfo',
                outputs: [
                    {
                        name: 'orderInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'orderStatus',
                                type: 'uint8',
                            },
                            {
                                name: 'orderHash',
                                type: 'bytes32',
                            },
                            {
                                name: 'orderTakerAssetFilledAmount',
                                type: 'uint256',
                            },
                        ]
                    },
                ],
                payable: false,
                stateMutability: 'pure',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'makerTokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAddress',
                        type: 'address',
                    },
                ],
                name: 'getTokenDecimals',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'bytes32',
                    },
                    {
                        name: 'index_1',
                        type: 'address',
                    },
                    {
                        name: 'signature',
                        type: 'bytes',
                    },
                ],
                name: 'isValidHashSignature',
                outputs: [
                    {
                        name: 'isValid',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'pure',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'token',
                        type: 'address',
                    },
                    {
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        name: 'balance',
                        type: 'uint256',
                    },
                    {
                        name: 'allowance',
                        type: 'uint256',
                    },
                ],
                name: 'setTokenBalanceAndAllowance',
                outputs: [],
                payable: false,
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
                        yield TestNativeOrderSamplerContract._deployLibrariesAsync(libraryArtifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses);
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
        const methodAbi = TestNativeOrderSamplerContract.ABI()[index]; // tslint:disable-line:no-unnecessary-type-assertion
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
    createTokens(count) {
        const self = this;
        assert_1.assert.isBigNumber('count', count);
        const functionSignature = 'createTokens(uint256)';
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
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [count
                ]);
            },
        };
    }
    ;
    getAssetProxy(proxyId) {
        const self = this;
        assert_1.assert.isString('proxyId', proxyId);
        const functionSignature = 'getAssetProxy(bytes4)';
        return {
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
                return self._strictEncodeArguments(functionSignature, [proxyId
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
      * @param exchange The V3 exchange.
    * @returns orderFillableMakerAssetAmounts How much maker asset can be filled         by each order in &#x60;orders&#x60;.
     */
    getOrderFillableMakerAssetAmounts(orders, orderSignatures, exchange) {
        const self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getOrderFillableMakerAssetAmounts((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes)[],bytes[],address)';
        return {
            callAsync(callData = {}, defaultBlock) {
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
    getOrderFillableTakerAmount(order, signature, exchange) {
        const self = this;
        assert_1.assert.isString('signature', signature);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getOrderFillableTakerAmount((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes),bytes,address)';
        return {
            callAsync(callData = {}, defaultBlock) {
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
      * @param orders Native orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V3 exchange.
    * @returns orderFillableTakerAssetAmounts How much taker asset can be filled         by each order in &#x60;orders&#x60;.
     */
    getOrderFillableTakerAssetAmounts(orders, orderSignatures, exchange) {
        const self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getOrderFillableTakerAssetAmounts((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes)[],bytes[],address)';
        return {
            callAsync(callData = {}, defaultBlock) {
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
    getOrderInfo(order) {
        const self = this;
        const functionSignature = 'getOrderInfo((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes))';
        return {
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
                return self._strictEncodeArguments(functionSignature, [order
                ]);
            },
        };
    }
    ;
    getTokenDecimals(makerTokenAddress, takerTokenAddress) {
        const self = this;
        assert_1.assert.isString('makerTokenAddress', makerTokenAddress);
        assert_1.assert.isString('takerTokenAddress', takerTokenAddress);
        const functionSignature = 'getTokenDecimals(address,address)';
        return {
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [makerTokenAddress.toLowerCase(),
                    takerTokenAddress.toLowerCase()
                ]);
            },
        };
    }
    ;
    isValidHashSignature(index_0, index_1, signature) {
        const self = this;
        assert_1.assert.isString('index_0', index_0);
        assert_1.assert.isString('index_1', index_1);
        assert_1.assert.isString('signature', signature);
        const functionSignature = 'isValidHashSignature(bytes32,address,bytes)';
        return {
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
                return self._strictEncodeArguments(functionSignature, [index_0,
                    index_1.toLowerCase(),
                    signature
                ]);
            },
        };
    }
    ;
    setTokenBalanceAndAllowance(token, owner, spender, balance, allowance) {
        const self = this;
        assert_1.assert.isString('token', token);
        assert_1.assert.isString('owner', owner);
        assert_1.assert.isString('spender', spender);
        assert_1.assert.isBigNumber('balance', balance);
        assert_1.assert.isBigNumber('allowance', allowance);
        const functionSignature = 'setTokenBalanceAndAllowance(address,address,address,uint256,uint256)';
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
            callAsync(callData = {}, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                    const rawCallResult = yield self._performCallAsync(Object.assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock);
                    const abiEncoder = self._lookupAbiEncoder(functionSignature);
                    base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                    return abiEncoder.strictDecodeReturnValue(rawCallResult);
                });
            },
            getABIEncodedTransactionData() {
                return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
                    owner.toLowerCase(),
                    spender.toLowerCase(),
                    balance,
                    allowance
                ]);
            },
        };
    }
    ;
}
/**
 * @ignore
 */
TestNativeOrderSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b50600436106100a35760003560e01c80638171c40711610076578063c662178c1161005b578063c662178c14610171578063e9a8e44214610186578063fcb5c43c14610199576100a3565b80638171c407146101315780639d3fa4b914610151576100a3565b806339b085ad146100a85780633b77ebae146100d157806360704108146100f15780637e1f2bb814610111575b600080fd5b6100bb6100b636600461146b565b6101ba565b6040516100c89190611a25565b60405180910390f35b6100e46100df3660046116ef565b61036f565b6040516100c89190611b91565b6101046100ff3660046115d3565b6109c2565b6040516100c8919061194e565b61012461011f366004611764565b6109f6565b6040516100c891906119cc565b61014461013f36600461154d565b610a98565b6040516100c89190611a5d565b61016461015f3660046116b5565b610ad1565b6040516100c89190611b03565b61018461017f366004611613565b610b56565b005b6100bb61019436600461146b565b610be7565b6101ac6101a7366004611433565b610c8a565b6040516100c8929190611b9a565b606083516040519080825280602002602001820160405280156101e7578160200160208202803883390190505b50905060005b8451811461036757600060603073ffffffffffffffffffffffffffffffffffffffff1662030d40633b77ebae60e01b89868151811061022857fe5b602002602001015189878151811061023c57fe5b60200260200101518960405160240161025793929190611b45565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009094169390931790925290516102e09190611909565b6000604051808303818686fa925050503d806000811461031c576040519150601f19603f3d011682016040523d82523d6000602084013e610321565b606091505b509150915081610332576000610346565b80806020019051610346919081019061177c565b84848151811061035257fe5b602090810291909101015250506001016101ed565b509392505050565b600082516000148061038357506080840151155b80610390575060a0840151155b1561039d575060006109bb565b6103a561119d565b6040517f9d3fa4b900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff841690639d3fa4b9906103f7908890600401611b32565b60606040518083038186803b15801561040f57600080fd5b505afa158015610423573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250610447919081019061166d565b905060038151600681111561045857fe5b146104675760009150506109bb565b602081015185516040517f8171c40700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff861692638171c407926104c0928990600401611a68565b60206040518083038186803b1580156104d857600080fd5b505afa1580156104ec573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250610510919081019061152d565b61051e5760009150506109bb565b6040517f6070410800000000000000000000000000000000000000000000000000000000815260009073ffffffffffffffffffffffffffffffffffffffff851690636070410890610593907ff47261b00000000000000000000000000000000000000000000000000000000090600401611aa6565b60206040518083038186803b1580156105ab57600080fd5b505afa1580156105bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506105e39190810190611417565b905060006105f5876101400151610cb8565b905073ffffffffffffffffffffffffffffffffffffffff811661061e57600093505050506109bb565b6000808860c0015111610632576000610640565b610640886101800151610cb8565b9050600061065f85604001518a60a00151610d5390919063ffffffff16565b905080955060006106ca828b60a001518673ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16146106ac578c608001516106c5565b60c08d015160808e01516106c59163ffffffff610d7716565b610d93565b8a516040517f70a082310000000000000000000000000000000000000000000000000000000081529192506000916108209173ffffffffffffffffffffffffffffffffffffffff8816916370a08231916107269160040161194e565b60206040518083038186803b15801561073e57600080fd5b505afa158015610752573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250610776919081019061177c565b8c516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e916107cb91908c9060040161196f565b60206040518083038186803b1580156107e357600080fd5b505afa1580156107f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525061081b919081019061177c565b610ddb565b90508181101561083857610835818385610df1565b97505b8473ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614158015610889575073ffffffffffffffffffffffffffffffffffffffff841615155b156109b3578a516040517f70a0823100000000000000000000000000000000000000000000000000000000815260009161098d9173ffffffffffffffffffffffffffffffffffffffff8816916370a08231916108e8919060040161194e565b60206040518083038186803b15801561090057600080fd5b505afa158015610914573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250610938919081019061177c565b8d516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e916107cb91908d9060040161196f565b90508b60c001518110156109b1576109ae8961081b838f60c0015188610df1565b98505b505b505050505050505b9392505050565b6000816040516020016109d59190611aa6565b6040516020818303038152906040528051906020012060001c90505b919050565b606081604051908082528060200260200182016040528015610a22578160200160208202803883390190505b50905060005b82811015610a9257604051610a3c906111bf565b604051809103906000f080158015610a58573d6000803e3d6000fd5b50828281518110610a6557fe5b73ffffffffffffffffffffffffffffffffffffffff90921660209283029190910190910152600101610a28565b50919050565b6000604051610aa690611925565b60405180910390208383604051610abe9291906118f9565b6040518091039020149050949350505050565b610ad961119d565b816101200135604051602001610aef9190611b91565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081840301815291905280516020918201209082015260ff61012083013581161415610b425760058152610b47565b600381525b61010090910135604082015290565b6040517f3c9dc74d00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff861690633c9dc74d90610bae908790879087908790600401611996565b600060405180830381600087803b158015610bc857600080fd5b505af1158015610bdc573d6000803e3d6000fd5b505050505050505050565b6060610bf48484846101ba565b905060005b845181101561036757818181518110610c0e57fe5b6020026020010151600014610c8257610c69828281518110610c2c57fe5b6020026020010151868381518110610c4057fe5b602002602001015160a00151878481518110610c5857fe5b602002602001015160800151610df1565b828281518110610c7557fe5b6020026020010181815250505b600101610bf9565b6000806000610c9885610e27565b60ff1690506000610ca885610e27565b9193505060ff1690509250929050565b6000815160001415610ccc575060006109f1565b81516024141580610d2f57507ff47261b000000000000000000000000000000000000000000000000000000000610d0a83600063ffffffff610ef816565b7fffffffff000000000000000000000000000000000000000000000000000000001614155b15610d3c575060006109f1565b610d4d82601063ffffffff610f4416565b92915050565b600082821115610d7157610d71610d6c60028585610f84565b611029565b50900390565b6000828201838110156109bb576109bb610d6c60008686610f84565b6000610da0848484611031565b15610db357610db3610d6c858585611097565b610dd383610dc7868563ffffffff6110b616565b9063ffffffff6110e716565b949350505050565b6000818310610dea57816109bb565b5090919050565b6000610dd383610dc7610e0b82600163ffffffff610d5316565b610e1b888763ffffffff6110b616565b9063ffffffff610d7716565b600060129050600060608373ffffffffffffffffffffffffffffffffffffffff166040518060400160405280600481526020017f313ce56700000000000000000000000000000000000000000000000000000000815250604051610e8b9190611909565b600060405180830381855afa9150503d8060008114610ec6576040519150601f19603f3d011682016040523d82523d6000602084013e610ecb565b606091505b5091509150818015610ede575080516020145b15610ef157610eee816000611111565b92505b5050919050565b60008160040183511015610f1957610f19610d6c600385518560040161111d565b5001602001517fffffffff000000000000000000000000000000000000000000000000000000001690565b60008160140183511015610f6557610f65610d6c600485518560140161111d565b50016014015173ffffffffffffffffffffffffffffffffffffffff1690565b606063e946c1bb60e01b848484604051602401610fa393929190611ad3565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915290509392505050565b805160208201fd5b60008261104357611043610d6c61113c565b81158061104e575083155b1561105b575060006109bb565b6000838061106557fe5b858409905061107a858463ffffffff6110b616565b61108c826103e863ffffffff6110b616565b101595945050505050565b606063339f3de260e01b848484604051602401610fa393929190611ba8565b6000826110c557506000610d4d565b828202828482816110d257fe5b04146109bb576109bb610d6c60018686610f84565b6000816110fd576110fd610d6c60038585610f84565b600082848161110857fe5b04949350505050565b60006109bb8383611173565b6060632800659560e01b848484604051602401610fa393929190611af5565b60408051808201909152600481527fa791837c00000000000000000000000000000000000000000000000000000000602082015290565b6000816020018351101561119457611194610d6c600585518560200161111d565b50016020015190565b6040805160608101909152806000815260006020820181905260409091015290565b61023680611c5b83390190565b8035610d4d81611c35565b600082601f8301126111e7578081fd5b81356111fa6111f582611be5565b611bbe565b8181529150602080830190840160005b83811015611237576112228760208435890101611241565b8352602092830192919091019060010161120a565b5050505092915050565b600082601f830112611251578081fd5b813567ffffffffffffffff811115611267578182fd5b61129860207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601611bbe565b91508082528360208285010111156112af57600080fd5b8060208401602084013760009082016020015292915050565b60006101c08083850312156112db578182fd5b6112e481611bbe565b9150506112f183836111cc565b815261130083602084016111cc565b602082015261131283604084016111cc565b604082015261132483606084016111cc565b60608201526080820135608082015260a082013560a082015260c082013560c082015260e082013560e08201526101008083013581830152506101208083013581830152506101408083013567ffffffffffffffff8082111561138657600080fd5b61139286838701611241565b838501526101609250828501359150808211156113ae57600080fd5b6113ba86838701611241565b838501526101809250828501359150808211156113d657600080fd5b6113e286838701611241565b838501526101a09250828501359150808211156113fe57600080fd5b5061140b85828601611241565b82840152505092915050565b600060208284031215611428578081fd5b81516109bb81611c35565b60008060408385031215611445578081fd5b823561145081611c35565b9150602083013561146081611c35565b809150509250929050565b60008060006060848603121561147f578081fd5b833567ffffffffffffffff80821115611496578283fd5b81860187601f8201126114a7578384fd5b803592506114b76111f584611be5565b83815260208082019190838101875b878110156114ef576114dd8d8484358901016112c8565b855293820193908201906001016114c6565b50919850890135945050505080821115611507578283fd5b50611514868287016111d7565b92505061152485604086016111cc565b90509250925092565b60006020828403121561153e578081fd5b815180151581146109bb578182fd5b60008060008060608587031215611562578182fd5b84359350602085013561157481611c35565b9250604085013567ffffffffffffffff80821115611590578384fd5b81870188601f8201126115a1578485fd5b80359250818311156115b1578485fd5b8860208483010111156115c2578485fd5b959894975050602090940194505050565b6000602082840312156115e4578081fd5b81357fffffffff00000000000000000000000000000000000000000000000000000000811681146109bb578182fd5b600080600080600060a0868803121561162a578283fd5b853561163581611c35565b9450602086013561164581611c35565b9350604086013561165581611c35565b94979396509394606081013594506080013592915050565b60006060828403121561167e578081fd5b6116886060611bbe565b825160078110611696578283fd5b8152602083810151908201526040928301519281019290925250919050565b6000602082840312156116c6578081fd5b813567ffffffffffffffff8111156116dc578182fd5b8083016101c08186031215610dd3578283fd5b600080600060608486031215611703578081fd5b833567ffffffffffffffff8082111561171a578283fd5b611726878388016112c8565b9450602086013591508082111561173b578283fd5b5061174886828701611241565b925050604084013561175981611c35565b809150509250925092565b600060208284031215611775578081fd5b5035919050565b60006020828403121561178d578081fd5b5051919050565b73ffffffffffffffffffffffffffffffffffffffff169052565b600081518084526117c6816020860160208601611c05565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60006101c0611808848451611794565b602083015161181a6020860182611794565b50604083015161182d6040860182611794565b5060608301516118406060860182611794565b506080830151608085015260a083015160a085015260c083015160c085015260e083015160e0850152610100808401518186015250610120808401518186015250610140808401518282870152611899838701826117ae565b915050610160915081840151858203838701526118b682826117ae565b9250505061018080840151858303828701526118d283826117ae565b9150506101a0915081840151858203838701526118ef82826117ae565b9695505050505050565b6000828483379101908152919050565b6000825161191b818460208701611c05565b9190910192915050565b7f0100000000000000000000000000000000000000000000000000000000000000815260010190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff92831681529116602082015260400190565b73ffffffffffffffffffffffffffffffffffffffff94851681529290931660208301526040820152606081019190915260800190565b602080825282518282018190526000918401906040840190835b81811015611a1a57835173ffffffffffffffffffffffffffffffffffffffff168352602093840193909201916001016119e6565b509095945050505050565b602080825282518282018190526000918401906040840190835b81811015611a1a578351835260209384019390920191600101611a3f565b901515815260200190565b600084825273ffffffffffffffffffffffffffffffffffffffff8416602083015260606040830152611a9d60608301846117ae565b95945050505050565b7fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b6060810160048510611ae157fe5b938152602081019290925260409091015290565b6060810160088510611ae157fe5b8151606082019060078110611b1457fe5b80835250602083015160208301526040830151604083015292915050565b6000602082526109bb60208301846117f8565b600060608252611b5860608301866117f8565b8281036020840152611b6a81866117ae565b91505073ffffffffffffffffffffffffffffffffffffffff83166040830152949350505050565b90815260200190565b918252602082015260400190565b9283526020830191909152604082015260600190565b60405181810167ffffffffffffffff81118282101715611bdd57600080fd5b604052919050565b600067ffffffffffffffff821115611bfb578081fd5b5060209081020190565b60005b83811015611c20578181015183820152602001611c08565b83811115611c2f576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff81168114611c5757600080fd5b5056fe608060405234801561001057600080fd5b50610216806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80633c9dc74d1461004657806370a082311461005b578063dd62ed3e14610084575b600080fd5b610059610054366004610187565b610097565b005b61006e610069366004610131565b6100d8565b60405161007b91906101ca565b60405180910390f35b61006e610092366004610153565b6100ea565b73ffffffffffffffffffffffffffffffffffffffff938416600090815260208181526040808320949094556001815283822094909516815292909352902055565b60006020819052908152604090205481565b600160209081526000928352604080842090915290825290205481565b803573ffffffffffffffffffffffffffffffffffffffff8116811461012b57600080fd5b92915050565b600060208284031215610142578081fd5b61014c8383610107565b9392505050565b60008060408385031215610165578081fd5b61016f8484610107565b915061017e8460208501610107565b90509250929050565b6000806000806080858703121561019c578182fd5b6101a68686610107565b93506101b58660208701610107565b93969395505050506040820135916060013590565b9081526020019056fea365627a7a723158201e0b9379945f287645aa869e0ba8d8b1d30b367c0c9086e42d07fc729f1dfc346c6578706572696d656e74616cf564736f6c63430005110040a365627a7a723158202caf224e0e542c571f381ef44967cd1c8817663f1d9efc9fc5469b2b84f3d8cd6c6578706572696d656e74616cf564736f6c63430005110040';
TestNativeOrderSamplerContract.contractName = 'TestNativeOrderSampler';
exports.TestNativeOrderSamplerContract = TestNativeOrderSamplerContract;
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=test_native_order_sampler.js.map