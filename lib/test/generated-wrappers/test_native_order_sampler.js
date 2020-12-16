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
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
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
                stateMutability: 'pure',
                type: 'function',
            },
            {
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
                        ],
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
                        ],
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
                        ],
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
                        ],
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
                        ],
                    },
                ],
                stateMutability: 'pure',
                type: 'function',
            },
            {
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
                stateMutability: 'view',
                type: 'function',
            },
            {
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
                stateMutability: 'pure',
                type: 'function',
            },
            {
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
                return self._strictEncodeArguments(functionSignature, [count]);
            },
        };
    }
    getAssetProxy(proxyId) {
        const self = this;
        assert_1.assert.isString('proxyId', proxyId);
        const functionSignature = 'getAssetProxy(bytes4)';
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
                return self._strictEncodeArguments(functionSignature, [proxyId]);
            },
        };
    }
    /**
     * Queries the fillable taker asset amounts of native orders.
     * Effectively ignores orders that have empty signatures or
     * @param orders Native orders to query.
     * @param orderSignatures Signatures for each respective order in `orders`.
     * @param exchange The V3 exchange.
     */
    getOrderFillableMakerAssetAmounts(orders, orderSignatures, exchange) {
        const self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getOrderFillableMakerAssetAmounts((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes)[],bytes[],address)';
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
    getOrderFillableTakerAmount(order, signature, exchange) {
        const self = this;
        assert_1.assert.isString('signature', signature);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getOrderFillableTakerAmount((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes),bytes,address)';
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
                return self._strictEncodeArguments(functionSignature, [order, signature, exchange.toLowerCase()]);
            },
        };
    }
    /**
     * Queries the fillable taker asset amounts of native orders.
     * Effectively ignores orders that have empty signatures or
     * maker/taker asset amounts (returning 0).
     * @param orders Native orders to query.
     * @param orderSignatures Signatures for each respective order in `orders`.
     * @param exchange The V3 exchange.
     */
    getOrderFillableTakerAssetAmounts(orders, orderSignatures, exchange) {
        const self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        const functionSignature = 'getOrderFillableTakerAssetAmounts((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes)[],bytes[],address)';
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
                return self._strictEncodeArguments(functionSignature, [
                    orders,
                    orderSignatures,
                    exchange.toLowerCase(),
                ]);
            },
        };
    }
    getOrderInfo(order) {
        const self = this;
        const functionSignature = 'getOrderInfo((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes))';
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
                return self._strictEncodeArguments(functionSignature, [order]);
            },
        };
    }
    getTokenDecimals(makerTokenAddress, takerTokenAddress) {
        const self = this;
        assert_1.assert.isString('makerTokenAddress', makerTokenAddress);
        assert_1.assert.isString('takerTokenAddress', takerTokenAddress);
        const functionSignature = 'getTokenDecimals(address,address)';
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
                return self._strictEncodeArguments(functionSignature, [
                    makerTokenAddress.toLowerCase(),
                    takerTokenAddress.toLowerCase(),
                ]);
            },
        };
    }
    isValidHashSignature(index_0, index_1, signature) {
        const self = this;
        assert_1.assert.isString('index_0', index_0);
        assert_1.assert.isString('index_1', index_1);
        assert_1.assert.isString('signature', signature);
        const functionSignature = 'isValidHashSignature(bytes32,address,bytes)';
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
                return self._strictEncodeArguments(functionSignature, [index_0, index_1.toLowerCase(), signature]);
            },
        };
    }
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
                return self._strictEncodeArguments(functionSignature, [
                    token.toLowerCase(),
                    owner.toLowerCase(),
                    spender.toLowerCase(),
                    balance,
                    allowance,
                ]);
            },
        };
    }
}
/**
 * @ignore
 */
TestNativeOrderSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b50600436106100a35760003560e01c80638171c40711610076578063c662178c1161005b578063c662178c14610171578063e9a8e44214610186578063fcb5c43c14610199576100a3565b80638171c407146101315780639d3fa4b914610151576100a3565b806339b085ad146100a85780633b77ebae146100d157806360704108146100f15780637e1f2bb814610111575b600080fd5b6100bb6100b636600461143b565b6101ba565b6040516100c891906119c8565b60405180910390f35b6100e46100df3660046116bc565b610359565b6040516100c89190611b34565b6101046100ff3660046115a1565b6109a6565b6040516100c891906118f0565b61012461011f366004611731565b6109da565b6040516100c8919061196e565b61014461013f36600461151d565b610a93565b6040516100c89190611a00565b61016461015f366004611683565b610ad9565b6040516100c89190611aa6565b61018461017f3660046115e1565b610b5e565b005b6100bb61019436600461143b565b610bef565b6101ac6101a7366004611403565b610c92565b6040516100c8929190611b3d565b6060835167ffffffffffffffff811180156101d457600080fd5b506040519080825280602002602001820160405280156101fe578160200160208202803683370190505b50905060005b84518114610351573073ffffffffffffffffffffffffffffffffffffffff16633b77ebae62030d4087848151811061023857fe5b602002602001015187858151811061024c57fe5b6020026020010151876040518563ffffffff1660e01b815260040161027393929190611ae8565b60206040518083038187803b15801561028b57600080fd5b5086fa935050505080156102da575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526102d791810190611749565b60015b61032e573d808015610308576040519150601f19603f3d011682016040523d82523d6000602084013e61030d565b606091505b50600083838151811061031c57fe5b60200260200101818152505050610349565b8083838151811061033b57fe5b602002602001018181525050505b600101610204565b509392505050565b600082516000148061036d57506080840151155b8061037a575060a0840151155b156103875750600061099f565b61038f61116f565b6040517f9d3fa4b900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff841690639d3fa4b9906103e1908890600401611ad5565b60606040518083038186803b1580156103f957600080fd5b505afa15801561040d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610431919061163b565b905060038151600681111561044257fe5b1461045157600091505061099f565b602081015185516040517f8171c40700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff861692638171c407926104aa928990600401611a0b565b60206040518083038186803b1580156104c257600080fd5b505afa1580156104d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104fa91906114fd565b61050857600091505061099f565b6040517f6070410800000000000000000000000000000000000000000000000000000000815260009073ffffffffffffffffffffffffffffffffffffffff85169063607041089061057d907ff47261b00000000000000000000000000000000000000000000000000000000090600401611a49565b60206040518083038186803b15801561059557600080fd5b505afa1580156105a9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105cd91906113e7565b905060006105df876101400151610cc0565b905073ffffffffffffffffffffffffffffffffffffffff8116610608576000935050505061099f565b6000808860c001511161061c57600061062a565b61062a886101800151610cc0565b9050600061064985604001518a60a00151610d4f90919063ffffffff16565b905080955060006106ae828b60a001518673ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614610696578c608001516106a9565b60c08d015160808e01516106a991610d73565b610d8f565b8a516040517f70a082310000000000000000000000000000000000000000000000000000000081529192506000916108049173ffffffffffffffffffffffffffffffffffffffff8816916370a082319161070a916004016118f0565b60206040518083038186803b15801561072257600080fd5b505afa158015610736573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061075a9190611749565b8c516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e916107af91908c90600401611911565b60206040518083038186803b1580156107c757600080fd5b505afa1580156107db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107ff9190611749565b610dcb565b90508181101561081c57610819818385610de1565b97505b8473ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415801561086d575073ffffffffffffffffffffffffffffffffffffffff841615155b15610997578a516040517f70a082310000000000000000000000000000000000000000000000000000000081526000916109719173ffffffffffffffffffffffffffffffffffffffff8816916370a08231916108cc91906004016118f0565b60206040518083038186803b1580156108e457600080fd5b505afa1580156108f8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061091c9190611749565b8d516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e916107af91908d90600401611911565b90508b60c0015181101561099557610992896107ff838f60c0015188610de1565b98505b505b505050505050505b9392505050565b6000816040516020016109b99190611a49565b6040516020818303038152906040528051906020012060001c90505b919050565b60608167ffffffffffffffff811180156109f357600080fd5b50604051908082528060200260200182016040528015610a1d578160200160208202803683370190505b50905060005b82811015610a8d57604051610a3790611191565b604051809103906000f080158015610a53573d6000803e3d6000fd5b50828281518110610a6057fe5b73ffffffffffffffffffffffffffffffffffffffff90921660209283029190910190910152600101610a23565b50919050565b60007f5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd28383604051610ac69291906118c4565b6040518091039020149050949350505050565b610ae161116f565b816101200135604051602001610af79190611b34565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081840301815291905280516020918201209082015260ff61012083013581161415610b4a5760058152610b4f565b600381525b61010090910135604082015290565b6040517f3c9dc74d00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff861690633c9dc74d90610bb6908790879087908790600401611938565b600060405180830381600087803b158015610bd057600080fd5b505af1158015610be4573d6000803e3d6000fd5b505050505050505050565b6060610bfc8484846101ba565b905060005b845181101561035157818181518110610c1657fe5b6020026020010151600014610c8a57610c71828281518110610c3457fe5b6020026020010151868381518110610c4857fe5b602002602001015160a00151878481518110610c6057fe5b602002602001015160800151610de1565b828281518110610c7d57fe5b6020026020010181815250505b600101610c01565b6000806000610ca085610e05565b60ff1690506000610cb085610e05565b9193505060ff1690509250929050565b6000815160001415610cd4575060006109d5565b81516024141580610d3157507ff47261b000000000000000000000000000000000000000000000000000000000610d0c836000610ed6565b7fffffffff000000000000000000000000000000000000000000000000000000001614155b15610d3e575060006109d5565b610d49826010610f22565b92915050565b600082821115610d6d57610d6d610d6860028585610f62565b611007565b50900390565b60008282018381101561099f5761099f610d6860008686610f62565b6000610d9c84848461100f565b15610daf57610daf610d68858585611069565b610dc383610dbd8685611088565b906110b9565b949350505050565b6000818310610dda578161099f565b5090919050565b6000610dc383610dbd610df5826001610d4f565b610dff8887611088565b90610d73565b600060129050600060608373ffffffffffffffffffffffffffffffffffffffff166040518060400160405280600481526020017f313ce56700000000000000000000000000000000000000000000000000000000815250604051610e6991906118d4565b600060405180830381855afa9150503d8060008114610ea4576040519150601f19603f3d011682016040523d82523d6000602084013e610ea9565b606091505b5091509150818015610ebc575080516020145b15610ecf57610ecc8160006110e3565b92505b5050919050565b60008160040183511015610ef757610ef7610d6860038551856004016110ef565b5001602001517fffffffff000000000000000000000000000000000000000000000000000000001690565b60008160140183511015610f4357610f43610d6860048551856014016110ef565b50016014015173ffffffffffffffffffffffffffffffffffffffff1690565b606063e946c1bb60e01b848484604051602401610f8193929190611a76565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915290509392505050565b805160208201fd5b60008261102157611021610d6861110e565b81158061102c575083155b156110395750600061099f565b6000838061104357fe5b85840990506110528584611088565b61105e826103e8611088565b101595945050505050565b606063339f3de260e01b848484604051602401610f8193929190611b4b565b60008261109757506000610d49565b828202828482816110a457fe5b041461099f5761099f610d6860018686610f62565b6000816110cf576110cf610d6860038585610f62565b60008284816110da57fe5b04949350505050565b600061099f8383611145565b6060632800659560e01b848484604051602401610f8193929190611a98565b60408051808201909152600481527fa791837c00000000000000000000000000000000000000000000000000000000602082015290565b6000816020018351101561116657611166610d6860058551856020016110ef565b50016020015190565b6040805160608101909152806000815260006020820181905260409091015290565b61022980611bfe83390190565b8035610d4981611bd8565b600082601f8301126111b9578081fd5b81356111cc6111c782611b88565b611b61565b818152915060208083019084810160005b84811015611206576111f4888484358a0101611211565b845292820192908201906001016111dd565b505050505092915050565b600082601f830112611221578081fd5b813567ffffffffffffffff811115611237578182fd5b61126860207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601611b61565b915080825283602082850101111561127f57600080fd5b8060208401602084013760009082016020015292915050565b60006101c08083850312156112ab578182fd5b6112b481611b61565b9150506112c1838361119e565b81526112d0836020840161119e565b60208201526112e2836040840161119e565b60408201526112f4836060840161119e565b60608201526080820135608082015260a082013560a082015260c082013560c082015260e082013560e08201526101008083013581830152506101208083013581830152506101408083013567ffffffffffffffff8082111561135657600080fd5b61136286838701611211565b8385015261016092508285013591508082111561137e57600080fd5b61138a86838701611211565b838501526101809250828501359150808211156113a657600080fd5b6113b286838701611211565b838501526101a09250828501359150808211156113ce57600080fd5b506113db85828601611211565b82840152505092915050565b6000602082840312156113f8578081fd5b815161099f81611bd8565b60008060408385031215611415578081fd5b823561142081611bd8565b9150602083013561143081611bd8565b809150509250929050565b60008060006060848603121561144f578081fd5b833567ffffffffffffffff80821115611466578283fd5b818601915086601f830112611479578283fd5b81356114876111c782611b88565b81815260208082019190858101875b858110156114bf576114ad8d8484358b0101611298565b85529382019390820190600101611496565b509198508901359450505050808211156114d7578283fd5b506114e4868287016111a9565b9250506114f4856040860161119e565b90509250925092565b60006020828403121561150e578081fd5b8151801515811461099f578182fd5b60008060008060608587031215611532578081fd5b84359350602085013561154481611bd8565b9250604085013567ffffffffffffffff80821115611560578283fd5b818701915087601f830112611573578283fd5b813581811115611581578384fd5b886020828501011115611592578384fd5b95989497505060200194505050565b6000602082840312156115b2578081fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811461099f578182fd5b600080600080600060a086880312156115f8578283fd5b853561160381611bd8565b9450602086013561161381611bd8565b9350604086013561162381611bd8565b94979396509394606081013594506080013592915050565b60006060828403121561164c578081fd5b6116566060611b61565b825160078110611664578283fd5b8152602083810151908201526040928301519281019290925250919050565b600060208284031215611694578081fd5b813567ffffffffffffffff8111156116aa578182fd5b82016101c0818503121561099f578182fd5b6000806000606084860312156116d0578081fd5b833567ffffffffffffffff808211156116e7578283fd5b6116f387838801611298565b94506020860135915080821115611708578283fd5b5061171586828701611211565b925050604084013561172681611bd8565b809150509250925092565b600060208284031215611742578081fd5b5035919050565b60006020828403121561175a578081fd5b5051919050565b73ffffffffffffffffffffffffffffffffffffffff169052565b60008151808452611793816020860160208601611ba8565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60006101c06117d5848451611761565b60208301516117e76020860182611761565b5060408301516117fa6040860182611761565b50606083015161180d6060860182611761565b506080830151608085015260a083015160a085015260c083015160c085015260e083015160e08501526101008084015181860152506101208084015181860152506101408084015182828701526118668387018261177b565b925050506101608084015185830382870152611882838261177b565b92505050610180808401518583038287015261189e838261177b565b925050506101a080840151858303828701526118ba838261177b565b9695505050505050565b6000828483379101908152919050565b600082516118e6818460208701611ba8565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff92831681529116602082015260400190565b73ffffffffffffffffffffffffffffffffffffffff94851681529290931660208301526040820152606081019190915260800190565b6020808252825182820181905260009190848201906040850190845b818110156119bc57835173ffffffffffffffffffffffffffffffffffffffff168352928401929184019160010161198a565b50909695505050505050565b6020808252825182820181905260009190848201906040850190845b818110156119bc578351835292840192918401916001016119e4565b901515815260200190565b600084825273ffffffffffffffffffffffffffffffffffffffff8416602083015260606040830152611a40606083018461177b565b95945050505050565b7fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b6060810160048510611a8457fe5b938152602081019290925260409091015290565b6060810160088510611a8457fe5b8151606082019060078110611ab757fe5b80835250602083015160208301526040830151604083015292915050565b60006020825261099f60208301846117c5565b600060608252611afb60608301866117c5565b8281036020840152611b0d818661177b565b91505073ffffffffffffffffffffffffffffffffffffffff83166040830152949350505050565b90815260200190565b918252602082015260400190565b9283526020830191909152604082015260600190565b60405181810167ffffffffffffffff81118282101715611b8057600080fd5b604052919050565b600067ffffffffffffffff821115611b9e578081fd5b5060209081020190565b60005b83811015611bc3578181015183820152602001611bab565b83811115611bd2576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff81168114611bfa57600080fd5b5056fe608060405234801561001057600080fd5b50610209806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80633c9dc74d1461004657806370a082311461005b578063dd62ed3e14610084575b600080fd5b610059610054366004610187565b610097565b005b61006e610069366004610131565b6100d8565b60405161007b91906101ca565b60405180910390f35b61006e610092366004610153565b6100ea565b73ffffffffffffffffffffffffffffffffffffffff938416600090815260208181526040808320949094556001815283822094909516815292909352902055565b60006020819052908152604090205481565b600160209081526000928352604080842090915290825290205481565b803573ffffffffffffffffffffffffffffffffffffffff8116811461012b57600080fd5b92915050565b600060208284031215610142578081fd5b61014c8383610107565b9392505050565b60008060408385031215610165578081fd5b61016f8484610107565b915061017e8460208501610107565b90509250929050565b6000806000806080858703121561019c578182fd5b6101a68686610107565b93506101b58660208701610107565b93969395505050506040820135916060013590565b9081526020019056fea2646970667358221220eb0d2272fed018b3091d495ccb8ebaf5649dc1db7280513f232010fcd540611064736f6c634300060c0033a2646970667358221220ed4f78593596e6e55e8d8c682ee9d4704b164e95f1699910b767b5bf4299434364736f6c634300060c0033';
TestNativeOrderSamplerContract.contractName = 'TestNativeOrderSampler';
exports.TestNativeOrderSamplerContract = TestNativeOrderSamplerContract;
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=test_native_order_sampler.js.map