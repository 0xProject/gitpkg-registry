"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
var base_contract_1 = require("@0x/base-contract");
var json_schemas_1 = require("@0x/json-schemas");
var utils_1 = require("@0x/utils");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var assert_1 = require("@0x/assert");
var ethers = require("ethers");
// tslint:enable:no-unused-variable
/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
var TestNativeOrderSamplerContract = /** @class */ (function (_super) {
    __extends(TestNativeOrderSamplerContract, _super);
    function TestNativeOrderSamplerContract(address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode) {
        if (deployedBytecode === void 0) { deployedBytecode = TestNativeOrderSamplerContract.deployedBytecode; }
        var _this = _super.call(this, 'TestNativeOrderSampler', TestNativeOrderSamplerContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode) || this;
        _this._methodABIIndex = {};
        utils_1.classUtils.bindAll(_this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
        TestNativeOrderSamplerContract.ABI().forEach(function (item, index) {
            if (item.type === 'function') {
                var methodAbi = item;
                _this._methodABIIndex[methodAbi.name] = index;
            }
        });
        return _this;
    }
    TestNativeOrderSamplerContract.deployFrom0xArtifactAsync = function (artifact, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, provider, bytecode, abi, logDecodeDependenciesAbiOnly, _b, _c, key;
            return __generator(this, function (_d) {
                assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema, [
                    json_schemas_1.schemas.addressSchema,
                    json_schemas_1.schemas.numberSchema,
                    json_schemas_1.schemas.jsNumber,
                ]);
                if (artifact.compilerOutput === undefined) {
                    throw new Error('Compiler output not found in the artifact file');
                }
                provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
                bytecode = artifact.compilerOutput.evm.bytecode.object;
                abi = artifact.compilerOutput.abi;
                logDecodeDependenciesAbiOnly = {};
                if (Object.keys(logDecodeDependencies) !== undefined) {
                    try {
                        for (_b = __values(Object.keys(logDecodeDependencies)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            key = _c.value;
                            logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                return [2 /*return*/, TestNativeOrderSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly)];
            });
        });
    };
    TestNativeOrderSamplerContract.deployWithLibrariesFrom0xArtifactAsync = function (artifact, libraryArtifacts, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, provider, abi, logDecodeDependenciesAbiOnly, _b, _c, key, libraryAddresses, bytecode;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema, [
                            json_schemas_1.schemas.addressSchema,
                            json_schemas_1.schemas.numberSchema,
                            json_schemas_1.schemas.jsNumber,
                        ]);
                        if (artifact.compilerOutput === undefined) {
                            throw new Error('Compiler output not found in the artifact file');
                        }
                        provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
                        abi = artifact.compilerOutput.abi;
                        logDecodeDependenciesAbiOnly = {};
                        if (Object.keys(logDecodeDependencies) !== undefined) {
                            try {
                                for (_b = __values(Object.keys(logDecodeDependencies)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    key = _c.value;
                                    logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                        return [4 /*yield*/, TestNativeOrderSamplerContract._deployLibrariesAsync(artifact, libraryArtifacts, new web3_wrapper_1.Web3Wrapper(provider), txDefaults)];
                    case 1:
                        libraryAddresses = _d.sent();
                        bytecode = base_contract_1.linkLibrariesInBytecode(artifact, libraryAddresses);
                        return [2 /*return*/, TestNativeOrderSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly)];
                }
            });
        });
    };
    TestNativeOrderSamplerContract.deployAsync = function (bytecode, abi, supportedProvider, txDefaults, logDecodeDependencies) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, constructorAbi, iface, deployInfo, txData, web3Wrapper, txDataWithDefaults, txHash, txReceipt, contractInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isHexString('bytecode', bytecode);
                        assert_1.assert.doesConformToSchema('txDefaults', txDefaults, json_schemas_1.schemas.txDataSchema, [
                            json_schemas_1.schemas.addressSchema,
                            json_schemas_1.schemas.numberSchema,
                            json_schemas_1.schemas.jsNumber,
                        ]);
                        provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
                        constructorAbi = base_contract_1.BaseContract._lookupConstructorAbi(abi);
                        base_contract_1.BaseContract._formatABIDataItemList(constructorAbi.inputs, [], base_contract_1.BaseContract._bigNumberToString);
                        iface = new ethers.utils.Interface(abi);
                        deployInfo = iface.deployFunction;
                        txData = deployInfo.encode(bytecode, []);
                        web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider);
                        return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToContractTxDataAsync(__assign({ data: txData }, txDefaults), web3Wrapper.estimateGasAsync.bind(web3Wrapper))];
                    case 1:
                        txDataWithDefaults = _a.sent();
                        return [4 /*yield*/, web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                    case 2:
                        txHash = _a.sent();
                        utils_1.logUtils.log("transactionHash: " + txHash);
                        return [4 /*yield*/, web3Wrapper.awaitTransactionSuccessAsync(txHash)];
                    case 3:
                        txReceipt = _a.sent();
                        utils_1.logUtils.log("TestNativeOrderSampler successfully deployed at " + txReceipt.contractAddress);
                        contractInstance = new TestNativeOrderSamplerContract(txReceipt.contractAddress, provider, txDefaults, logDecodeDependencies);
                        contractInstance.constructorArgs = [];
                        return [2 /*return*/, contractInstance];
                }
            });
        });
    };
    /**
     * @returns      The contract ABI
     */
    TestNativeOrderSamplerContract.ABI = function () {
        var abi = [
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
    };
    TestNativeOrderSamplerContract._deployLibrariesAsync = function (artifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses) {
        if (libraryAddresses === void 0) { libraryAddresses = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var e_3, _a, e_4, _b, links, _c, _d, link, _e, _f, libraryName, libraryArtifact, linkedLibraryBytecode, txDataWithDefaults, txHash, contractAddress, e_4_1, e_3_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        links = artifact.compilerOutput.evm.bytecode.linkReferences;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 15, 16, 17]);
                        _c = __values(Object.values(links)), _d = _c.next();
                        _g.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 14];
                        link = _d.value;
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 11, 12, 13]);
                        _e = __values(Object.keys(link)), _f = _e.next();
                        _g.label = 4;
                    case 4:
                        if (!!_f.done) return [3 /*break*/, 10];
                        libraryName = _f.value;
                        if (!!libraryAddresses[libraryName]) return [3 /*break*/, 9];
                        libraryArtifact = libraryArtifacts[libraryName];
                        if (!libraryArtifact) {
                            throw new Error("Missing artifact for linked library \"" + libraryName + "\"");
                        }
                        // Deploy any dependent libraries used by this library.
                        return [4 /*yield*/, TestNativeOrderSamplerContract._deployLibrariesAsync(libraryArtifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses)];
                    case 5:
                        // Deploy any dependent libraries used by this library.
                        _g.sent();
                        linkedLibraryBytecode = base_contract_1.linkLibrariesInBytecode(libraryArtifact, libraryAddresses);
                        return [4 /*yield*/, base_contract_1.BaseContract._applyDefaultsToContractTxDataAsync(__assign({ data: linkedLibraryBytecode }, txDefaults), web3Wrapper.estimateGasAsync.bind(web3Wrapper))];
                    case 6:
                        txDataWithDefaults = _g.sent();
                        return [4 /*yield*/, web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                    case 7:
                        txHash = _g.sent();
                        utils_1.logUtils.log("transactionHash: " + txHash);
                        return [4 /*yield*/, web3Wrapper.awaitTransactionSuccessAsync(txHash)];
                    case 8:
                        contractAddress = (_g.sent()).contractAddress;
                        utils_1.logUtils.log(libraryArtifact.contractName + " successfully deployed at " + contractAddress);
                        libraryAddresses[libraryArtifact.contractName] = contractAddress;
                        _g.label = 9;
                    case 9:
                        _f = _e.next();
                        return [3 /*break*/, 4];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        e_4_1 = _g.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 13];
                    case 12:
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 13:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 14: return [3 /*break*/, 17];
                    case 15:
                        e_3_1 = _g.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 17];
                    case 16:
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 17: return [2 /*return*/, libraryAddresses];
                }
            });
        });
    };
    TestNativeOrderSamplerContract.prototype.getFunctionSignature = function (methodName) {
        var index = this._methodABIIndex[methodName];
        var methodAbi = TestNativeOrderSamplerContract.ABI()[index]; // tslint:disable-line:no-unnecessary-type-assertion
        var functionSignature = base_contract_1.methodAbiToFunctionSignature(methodAbi);
        return functionSignature;
    };
    TestNativeOrderSamplerContract.prototype.getABIDecodedTransactionData = function (methodName, callData) {
        var functionSignature = this.getFunctionSignature(methodName);
        var self = this;
        var abiEncoder = self._lookupAbiEncoder(functionSignature);
        var abiDecodedCallData = abiEncoder.strictDecode(callData);
        return abiDecodedCallData;
    };
    TestNativeOrderSamplerContract.prototype.getABIDecodedReturnData = function (methodName, callData) {
        var functionSignature = this.getFunctionSignature(methodName);
        var self = this;
        var abiEncoder = self._lookupAbiEncoder(functionSignature);
        var abiDecodedCallData = abiEncoder.strictDecodeReturnValue(callData);
        return abiDecodedCallData;
    };
    TestNativeOrderSamplerContract.prototype.getSelector = function (methodName) {
        var functionSignature = this.getFunctionSignature(methodName);
        var self = this;
        var abiEncoder = self._lookupAbiEncoder(functionSignature);
        return abiEncoder.getSelector();
    };
    TestNativeOrderSamplerContract.prototype.createTokens = function (count) {
        var self = this;
        assert_1.assert.isBigNumber('count', count);
        var functionSignature = 'createTokens(uint256)';
        return {
            sendTransactionAsync: function (txData, opts) {
                if (opts === void 0) { opts = { shouldValidate: true }; }
                return __awaiter(this, void 0, void 0, function () {
                    var txDataWithDefaults;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self._applyDefaultsToTxDataAsync(__assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                if (!(opts.shouldValidate !== false)) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.callAsync(txDataWithDefaults)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                        }
                    });
                });
            },
            awaitTransactionSuccessAsync: function (txData, opts) {
                if (opts === void 0) { opts = { shouldValidate: true }; }
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync: function (txData) {
                return __awaiter(this, void 0, void 0, function () {
                    var txDataWithDefaults;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self._applyDefaultsToTxDataAsync(__assign({ data: this.getABIEncodedTransactionData() }, txData))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [2 /*return*/, self._web3Wrapper.estimateGasAsync(txDataWithDefaults)];
                        }
                    });
                });
            },
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 1:
                                rawCallResult = _a.sent();
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [count
                ]);
            },
        };
    };
    ;
    TestNativeOrderSamplerContract.prototype.getAssetProxy = function (proxyId) {
        var self = this;
        assert_1.assert.isString('proxyId', proxyId);
        var functionSignature = 'getAssetProxy(bytes4)';
        return {
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                if (!self._deployedBytecodeIfExists) return [3 /*break*/, 2];
                                return [4 /*yield*/, self._evmExecAsync(this.getABIEncodedTransactionData())];
                            case 1:
                                rawCallResult = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 3:
                                rawCallResult = _a.sent();
                                _a.label = 4;
                            case 4:
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [proxyId
                ]);
            },
        };
    };
    ;
    /**
     * Queries the fillable taker asset amounts of native orders.
 * Effectively ignores orders that have empty signatures or
      * @param orders Native orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V3 exchange.
    * @returns orderFillableMakerAssetAmounts How much maker asset can be filled         by each order in &#x60;orders&#x60;.
     */
    TestNativeOrderSamplerContract.prototype.getOrderFillableMakerAssetAmounts = function (orders, orderSignatures, exchange) {
        var self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        var functionSignature = 'getOrderFillableMakerAssetAmounts((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes)[],bytes[],address)';
        return {
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 1:
                                rawCallResult = _a.sent();
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [orders,
                    orderSignatures,
                    exchange.toLowerCase()
                ]);
            },
        };
    };
    ;
    /**
     * Get the fillable taker amount of an order, taking into account
 * order state, maker fees, and maker balances.
     */
    TestNativeOrderSamplerContract.prototype.getOrderFillableTakerAmount = function (order, signature, exchange) {
        var self = this;
        assert_1.assert.isString('signature', signature);
        assert_1.assert.isString('exchange', exchange);
        var functionSignature = 'getOrderFillableTakerAmount((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes),bytes,address)';
        return {
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 1:
                                rawCallResult = _a.sent();
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [order,
                    signature,
                    exchange.toLowerCase()
                ]);
            },
        };
    };
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
    TestNativeOrderSamplerContract.prototype.getOrderFillableTakerAssetAmounts = function (orders, orderSignatures, exchange) {
        var self = this;
        assert_1.assert.isArray('orders', orders);
        assert_1.assert.isArray('orderSignatures', orderSignatures);
        assert_1.assert.isString('exchange', exchange);
        var functionSignature = 'getOrderFillableTakerAssetAmounts((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes)[],bytes[],address)';
        return {
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 1:
                                rawCallResult = _a.sent();
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [orders,
                    orderSignatures,
                    exchange.toLowerCase()
                ]);
            },
        };
    };
    ;
    TestNativeOrderSamplerContract.prototype.getOrderInfo = function (order) {
        var self = this;
        var functionSignature = 'getOrderInfo((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes,bytes,bytes))';
        return {
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                if (!self._deployedBytecodeIfExists) return [3 /*break*/, 2];
                                return [4 /*yield*/, self._evmExecAsync(this.getABIEncodedTransactionData())];
                            case 1:
                                rawCallResult = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 3:
                                rawCallResult = _a.sent();
                                _a.label = 4;
                            case 4:
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [order
                ]);
            },
        };
    };
    ;
    TestNativeOrderSamplerContract.prototype.isValidHashSignature = function (index_0, index_1, signature) {
        var self = this;
        assert_1.assert.isString('index_0', index_0);
        assert_1.assert.isString('index_1', index_1);
        assert_1.assert.isString('signature', signature);
        var functionSignature = 'isValidHashSignature(bytes32,address,bytes)';
        return {
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                if (!self._deployedBytecodeIfExists) return [3 /*break*/, 2];
                                return [4 /*yield*/, self._evmExecAsync(this.getABIEncodedTransactionData())];
                            case 1:
                                rawCallResult = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 3:
                                rawCallResult = _a.sent();
                                _a.label = 4;
                            case 4:
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [index_0,
                    index_1.toLowerCase(),
                    signature
                ]);
            },
        };
    };
    ;
    TestNativeOrderSamplerContract.prototype.setTokenBalanceAndAllowance = function (token, owner, spender, balance, allowance) {
        var self = this;
        assert_1.assert.isString('token', token);
        assert_1.assert.isString('owner', owner);
        assert_1.assert.isString('spender', spender);
        assert_1.assert.isBigNumber('balance', balance);
        assert_1.assert.isBigNumber('allowance', allowance);
        var functionSignature = 'setTokenBalanceAndAllowance(address,address,address,uint256,uint256)';
        return {
            sendTransactionAsync: function (txData, opts) {
                if (opts === void 0) { opts = { shouldValidate: true }; }
                return __awaiter(this, void 0, void 0, function () {
                    var txDataWithDefaults;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self._applyDefaultsToTxDataAsync(__assign({ data: this.getABIEncodedTransactionData() }, txData), this.estimateGasAsync.bind(this))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                if (!(opts.shouldValidate !== false)) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.callAsync(txDataWithDefaults)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)];
                        }
                    });
                });
            },
            awaitTransactionSuccessAsync: function (txData, opts) {
                if (opts === void 0) { opts = { shouldValidate: true }; }
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            estimateGasAsync: function (txData) {
                return __awaiter(this, void 0, void 0, function () {
                    var txDataWithDefaults;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self._applyDefaultsToTxDataAsync(__assign({ data: this.getABIEncodedTransactionData() }, txData))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [2 /*return*/, self._web3Wrapper.estimateGasAsync(txDataWithDefaults)];
                        }
                    });
                });
            },
            callAsync: function (callData, defaultBlock) {
                if (callData === void 0) { callData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var rawCallResult, abiEncoder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                base_contract_1.BaseContract._assertCallParams(callData, defaultBlock);
                                return [4 /*yield*/, self._performCallAsync(__assign({ data: this.getABIEncodedTransactionData() }, callData), defaultBlock)];
                            case 1:
                                rawCallResult = _a.sent();
                                abiEncoder = self._lookupAbiEncoder(functionSignature);
                                base_contract_1.BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                                return [2 /*return*/, abiEncoder.strictDecodeReturnValue(rawCallResult)];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function () {
                return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
                    owner.toLowerCase(),
                    spender.toLowerCase(),
                    balance,
                    allowance
                ]);
            },
        };
    };
    ;
    /**
     * @ignore
     */
    TestNativeOrderSamplerContract.deployedBytecode = '0x608060405234801561001057600080fd5b50600436106100885760003560e01c80638171c4071161005b5780638171c407146101165780639d3fa4b914610136578063c662178c14610156578063e9a8e4421461016b57610088565b806339b085ad1461008d5780633b77ebae146100b657806360704108146100d65780637e1f2bb8146100f6575b600080fd5b6100a061009b3660046112c2565b61017e565b6040516100ad919061187c565b60405180910390f35b6100c96100c4366004611546565b610333565b6040516100ad91906119e8565b6100e96100e436600461142a565b610986565b6040516100ad91906117a5565b6101096101043660046115bb565b6109ba565b6040516100ad9190611823565b6101296101243660046113a4565b610a5c565b6040516100ad91906118b4565b61014961014436600461150c565b610a95565b6040516100ad919061195a565b61016961016436600461146a565b610b1a565b005b6100a06101793660046112c2565b610bab565b606083516040519080825280602002602001820160405280156101ab578160200160208202803883390190505b50905060005b8451811461032b57600060603073ffffffffffffffffffffffffffffffffffffffff1662030d40633b77ebae60e01b8986815181106101ec57fe5b602002602001015189878151811061020057fe5b60200260200101518960405160240161021b9392919061199c565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009094169390931790925290516102a49190611760565b6000604051808303818686fa925050503d80600081146102e0576040519150601f19603f3d011682016040523d82523d6000602084013e6102e5565b606091505b5091509150816102f657600061030a565b8080602001905161030a91908101906115d3565b84848151811061031657fe5b602090810291909101015250506001016101b1565b509392505050565b600082516000148061034757506080840151155b80610354575060a0840151155b156103615750600061097f565b61036961102c565b6040517f9d3fa4b900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff841690639d3fa4b9906103bb908890600401611989565b60606040518083038186803b1580156103d357600080fd5b505afa1580156103e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525061040b91908101906114c4565b905060038151600681111561041c57fe5b1461042b57600091505061097f565b602081015185516040517f8171c40700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff861692638171c407926104849289906004016118bf565b60206040518083038186803b15801561049c57600080fd5b505afa1580156104b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506104d49190810190611384565b6104e257600091505061097f565b6040517f6070410800000000000000000000000000000000000000000000000000000000815260009073ffffffffffffffffffffffffffffffffffffffff851690636070410890610557907ff47261b000000000000000000000000000000000000000000000000000000000906004016118fd565b60206040518083038186803b15801561056f57600080fd5b505afa158015610583573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506105a791908101906112a6565b905060006105b9876101400151610c4e565b905073ffffffffffffffffffffffffffffffffffffffff81166105e2576000935050505061097f565b6000808860c00151116105f6576000610604565b610604886101800151610c4e565b9050600061062385604001518a60a00151610ce990919063ffffffff16565b9050809550600061068e828b60a001518673ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614610670578c60800151610689565b60c08d015160808e01516106899163ffffffff610d0d16565b610d29565b8a516040517f70a082310000000000000000000000000000000000000000000000000000000081529192506000916107e49173ffffffffffffffffffffffffffffffffffffffff8816916370a08231916106ea916004016117a5565b60206040518083038186803b15801561070257600080fd5b505afa158015610716573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525061073a91908101906115d3565b8c516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e9161078f91908c906004016117c6565b60206040518083038186803b1580156107a757600080fd5b505afa1580156107bb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506107df91908101906115d3565b610d71565b9050818110156107fc576107f9818385610d87565b97505b8473ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415801561084d575073ffffffffffffffffffffffffffffffffffffffff841615155b15610977578a516040517f70a082310000000000000000000000000000000000000000000000000000000081526000916109519173ffffffffffffffffffffffffffffffffffffffff8816916370a08231916108ac91906004016117a5565b60206040518083038186803b1580156108c457600080fd5b505afa1580156108d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506108fc91908101906115d3565b8d516040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e9161078f91908d906004016117c6565b90508b60c0015181101561097557610972896107df838f60c0015188610d87565b98505b505b505050505050505b9392505050565b60008160405160200161099991906118fd565b6040516020818303038152906040528051906020012060001c90505b919050565b6060816040519080825280602002602001820160405280156109e6578160200160208202803883390190505b50905060005b82811015610a5657604051610a009061104e565b604051809103906000f080158015610a1c573d6000803e3d6000fd5b50828281518110610a2957fe5b73ffffffffffffffffffffffffffffffffffffffff909216602092830291909101909101526001016109ec565b50919050565b6000604051610a6a9061177c565b60405180910390208383604051610a82929190611750565b6040518091039020149050949350505050565b610a9d61102c565b816101200135604051602001610ab391906119e8565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081840301815291905280516020918201209082015260ff61012083013581161415610b065760058152610b0b565b600381525b61010090910135604082015290565b6040517f3c9dc74d00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff861690633c9dc74d90610b729087908790879087906004016117ed565b600060405180830381600087803b158015610b8c57600080fd5b505af1158015610ba0573d6000803e3d6000fd5b505050505050505050565b6060610bb884848461017e565b905060005b845181101561032b57818181518110610bd257fe5b6020026020010151600014610c4657610c2d828281518110610bf057fe5b6020026020010151868381518110610c0457fe5b602002602001015160a00151878481518110610c1c57fe5b602002602001015160800151610d87565b828281518110610c3957fe5b6020026020010181815250505b600101610bbd565b6000815160001415610c62575060006109b5565b81516024141580610cc557507ff47261b000000000000000000000000000000000000000000000000000000000610ca083600063ffffffff610dbd16565b7fffffffff000000000000000000000000000000000000000000000000000000001614155b15610cd2575060006109b5565b610ce382601063ffffffff610e0916565b92915050565b600082821115610d0757610d07610d0260028585610e49565b610eee565b50900390565b60008282018381101561097f5761097f610d0260008686610e49565b6000610d36848484610ef6565b15610d4957610d49610d02858585610f5c565b610d6983610d5d868563ffffffff610f7b16565b9063ffffffff610fac16565b949350505050565b6000818310610d80578161097f565b5090919050565b6000610d6983610d5d610da182600163ffffffff610ce916565b610db1888763ffffffff610f7b16565b9063ffffffff610d0d16565b60008160040183511015610dde57610dde610d026003855185600401610fd6565b5001602001517fffffffff000000000000000000000000000000000000000000000000000000001690565b60008160140183511015610e2a57610e2a610d026004855185601401610fd6565b50016014015173ffffffffffffffffffffffffffffffffffffffff1690565b606063e946c1bb60e01b848484604051602401610e689392919061192a565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915290509392505050565b805160208201fd5b600082610f0857610f08610d02610ff5565b811580610f13575083155b15610f205750600061097f565b60008380610f2a57fe5b8584099050610f3f858463ffffffff610f7b16565b610f51826103e863ffffffff610f7b16565b101595945050505050565b606063339f3de260e01b848484604051602401610e68939291906119f1565b600082610f8a57506000610ce3565b82820282848281610f9757fe5b041461097f5761097f610d0260018686610e49565b600081610fc257610fc2610d0260038585610e49565b6000828481610fcd57fe5b04949350505050565b6060632800659560e01b848484604051602401610e689392919061194c565b60408051808201909152600481527fa791837c00000000000000000000000000000000000000000000000000000000602082015290565b6040805160608101909152806000815260006020820181905260409091015290565b61023680611aa483390190565b8035610ce381611a7e565b600082601f830112611076578081fd5b813561108961108482611a2e565b611a07565b8181529150602080830190840160005b838110156110c6576110b187602084358901016110d0565b83526020928301929190910190600101611099565b5050505092915050565b600082601f8301126110e0578081fd5b813567ffffffffffffffff8111156110f6578182fd5b61112760207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601611a07565b915080825283602082850101111561113e57600080fd5b8060208401602084013760009082016020015292915050565b60006101c080838503121561116a578182fd5b61117381611a07565b915050611180838361105b565b815261118f836020840161105b565b60208201526111a1836040840161105b565b60408201526111b3836060840161105b565b60608201526080820135608082015260a082013560a082015260c082013560c082015260e082013560e08201526101008083013581830152506101208083013581830152506101408083013567ffffffffffffffff8082111561121557600080fd5b611221868387016110d0565b8385015261016092508285013591508082111561123d57600080fd5b611249868387016110d0565b8385015261018092508285013591508082111561126557600080fd5b611271868387016110d0565b838501526101a092508285013591508082111561128d57600080fd5b5061129a858286016110d0565b82840152505092915050565b6000602082840312156112b7578081fd5b815161097f81611a7e565b6000806000606084860312156112d6578182fd5b833567ffffffffffffffff808211156112ed578384fd5b81860187601f8201126112fe578485fd5b8035925061130e61108484611a2e565b83815260208082019190838101885b87811015611346576113348d848435890101611157565b8552938201939082019060010161131d565b5091985089013594505050508082111561135e578384fd5b5061136b86828701611066565b92505061137b856040860161105b565b90509250925092565b600060208284031215611395578081fd5b8151801515811461097f578182fd5b600080600080606085870312156113b9578182fd5b8435935060208501356113cb81611a7e565b9250604085013567ffffffffffffffff808211156113e7578384fd5b81870188601f8201126113f8578485fd5b8035925081831115611408578485fd5b886020848301011115611419578485fd5b959894975050602090940194505050565b60006020828403121561143b578081fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811461097f578182fd5b600080600080600060a08688031215611481578283fd5b853561148c81611a7e565b9450602086013561149c81611a7e565b935060408601356114ac81611a7e565b94979396509394606081013594506080013592915050565b6000606082840312156114d5578081fd5b6114df6060611a07565b8251600781106114ed578283fd5b8152602083810151908201526040928301519281019290925250919050565b60006020828403121561151d578081fd5b813567ffffffffffffffff811115611533578182fd5b8083016101c08186031215610d69578283fd5b60008060006060848603121561155a578081fd5b833567ffffffffffffffff80821115611571578283fd5b61157d87838801611157565b94506020860135915080821115611592578283fd5b5061159f868287016110d0565b92505060408401356115b081611a7e565b809150509250925092565b6000602082840312156115cc578081fd5b5035919050565b6000602082840312156115e4578081fd5b5051919050565b73ffffffffffffffffffffffffffffffffffffffff169052565b6000815180845261161d816020860160208601611a4e565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60006101c061165f8484516115eb565b602083015161167160208601826115eb565b50604083015161168460408601826115eb565b50606083015161169760608601826115eb565b506080830151608085015260a083015160a085015260c083015160c085015260e083015160e08501526101008084015181860152506101208084015181860152506101408084015182828701526116f083870182611605565b9150506101609150818401518582038387015261170d8282611605565b9250505061018080840151858303828701526117298382611605565b9150506101a0915081840151858203838701526117468282611605565b9695505050505050565b6000828483379101908152919050565b60008251611772818460208701611a4e565b9190910192915050565b7f0100000000000000000000000000000000000000000000000000000000000000815260010190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff92831681529116602082015260400190565b73ffffffffffffffffffffffffffffffffffffffff94851681529290931660208301526040820152606081019190915260800190565b602080825282518282018190526000918401906040840190835b8181101561187157835173ffffffffffffffffffffffffffffffffffffffff1683526020938401939092019160010161183d565b509095945050505050565b602080825282518282018190526000918401906040840190835b81811015611871578351835260209384019390920191600101611896565b901515815260200190565b600084825273ffffffffffffffffffffffffffffffffffffffff84166020830152606060408301526118f46060830184611605565b95945050505050565b7fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b606081016004851061193857fe5b938152602081019290925260409091015290565b606081016008851061193857fe5b815160608201906007811061196b57fe5b80835250602083015160208301526040830151604083015292915050565b60006020825261097f602083018461164f565b6000606082526119af606083018661164f565b82810360208401526119c18186611605565b91505073ffffffffffffffffffffffffffffffffffffffff83166040830152949350505050565b90815260200190565b9283526020830191909152604082015260600190565b60405181810167ffffffffffffffff81118282101715611a2657600080fd5b604052919050565b600067ffffffffffffffff821115611a44578081fd5b5060209081020190565b60005b83811015611a69578181015183820152602001611a51565b83811115611a78576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff81168114611aa057600080fd5b5056fe608060405234801561001057600080fd5b50610216806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80633c9dc74d1461004657806370a082311461005b578063dd62ed3e14610084575b600080fd5b610059610054366004610187565b610097565b005b61006e610069366004610131565b6100d8565b60405161007b91906101ca565b60405180910390f35b61006e610092366004610153565b6100ea565b73ffffffffffffffffffffffffffffffffffffffff938416600090815260208181526040808320949094556001815283822094909516815292909352902055565b60006020819052908152604090205481565b600160209081526000928352604080842090915290825290205481565b803573ffffffffffffffffffffffffffffffffffffffff8116811461012b57600080fd5b92915050565b600060208284031215610142578081fd5b61014c8383610107565b9392505050565b60008060408385031215610165578081fd5b61016f8484610107565b915061017e8460208501610107565b90509250929050565b6000806000806080858703121561019c578182fd5b6101a68686610107565b93506101b58660208701610107565b93969395505050506040820135916060013590565b9081526020019056fea365627a7a72315820dba682043d2a3f386bba7008743934515b1883fb5f47e5242efc18749e04afbf6c6578706572696d656e74616cf564736f6c63430005110040a365627a7a723158207174a98fa57b02e31de6887f712fc74f88a514f83cc751278ed7462ac76a99f06c6578706572696d656e74616cf564736f6c63430005110040';
    TestNativeOrderSamplerContract.contractName = 'TestNativeOrderSampler';
    return TestNativeOrderSamplerContract;
}(base_contract_1.BaseContract));
exports.TestNativeOrderSamplerContract = TestNativeOrderSamplerContract;
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=test_native_order_sampler.js.map