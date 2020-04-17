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
var LibAssetDataContract = /** @class */ (function (_super) {
    __extends(LibAssetDataContract, _super);
    function LibAssetDataContract(address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode) {
        if (deployedBytecode === void 0) { deployedBytecode = LibAssetDataContract.deployedBytecode; }
        var _this = _super.call(this, 'LibAssetData', LibAssetDataContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode) || this;
        _this._methodABIIndex = {};
        utils_1.classUtils.bindAll(_this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
        LibAssetDataContract.ABI().forEach(function (item, index) {
            if (item.type === 'function') {
                var methodAbi = item;
                _this._methodABIIndex[methodAbi.name] = index;
            }
        });
        return _this;
    }
    LibAssetDataContract.deployFrom0xArtifactAsync = function (artifact, supportedProvider, txDefaults, logDecodeDependencies) {
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
                return [2 /*return*/, LibAssetDataContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly)];
            });
        });
    };
    LibAssetDataContract.deployWithLibrariesFrom0xArtifactAsync = function (artifact, libraryArtifacts, supportedProvider, txDefaults, logDecodeDependencies) {
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
                        return [4 /*yield*/, LibAssetDataContract._deployLibrariesAsync(artifact, libraryArtifacts, new web3_wrapper_1.Web3Wrapper(provider), txDefaults)];
                    case 1:
                        libraryAddresses = _d.sent();
                        bytecode = base_contract_1.linkLibrariesInBytecode(artifact, libraryAddresses);
                        return [2 /*return*/, LibAssetDataContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly)];
                }
            });
        });
    };
    LibAssetDataContract.deployAsync = function (bytecode, abi, supportedProvider, txDefaults, logDecodeDependencies) {
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
                        utils_1.logUtils.log("LibAssetData successfully deployed at " + txReceipt.contractAddress);
                        contractInstance = new LibAssetDataContract(txReceipt.contractAddress, provider, txDefaults, logDecodeDependencies);
                        contractInstance.constructorArgs = [];
                        return [2 /*return*/, contractInstance];
                }
            });
        });
    };
    /**
     * @returns      The contract ABI
     */
    LibAssetDataContract.ABI = function () {
        var abi = [
            {
                constant: true,
                inputs: [
                    {
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'decodeAssetProxyId',
                outputs: [
                    {
                        name: 'assetProxyId',
                        type: 'bytes4',
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
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'decodeERC1155AssetData',
                outputs: [
                    {
                        name: 'assetProxyId',
                        type: 'bytes4',
                    },
                    {
                        name: 'tokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'tokenIds',
                        type: 'uint256[]',
                    },
                    {
                        name: 'tokenValues',
                        type: 'uint256[]',
                    },
                    {
                        name: 'callbackData',
                        type: 'bytes',
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
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'decodeERC20AssetData',
                outputs: [
                    {
                        name: 'assetProxyId',
                        type: 'bytes4',
                    },
                    {
                        name: 'tokenAddress',
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
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'decodeERC20BridgeAssetData',
                outputs: [
                    {
                        name: 'assetProxyId',
                        type: 'bytes4',
                    },
                    {
                        name: 'tokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'bridgeAddress',
                        type: 'address',
                    },
                    {
                        name: 'bridgeData',
                        type: 'bytes',
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
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'decodeERC721AssetData',
                outputs: [
                    {
                        name: 'assetProxyId',
                        type: 'bytes4',
                    },
                    {
                        name: 'tokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'tokenId',
                        type: 'uint256',
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
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'decodeMultiAssetData',
                outputs: [
                    {
                        name: 'assetProxyId',
                        type: 'bytes4',
                    },
                    {
                        name: 'amounts',
                        type: 'uint256[]',
                    },
                    {
                        name: 'nestedAssetData',
                        type: 'bytes[]',
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
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'decodeStaticCallAssetData',
                outputs: [
                    {
                        name: 'assetProxyId',
                        type: 'bytes4',
                    },
                    {
                        name: 'staticCallTargetAddress',
                        type: 'address',
                    },
                    {
                        name: 'staticCallData',
                        type: 'bytes',
                    },
                    {
                        name: 'expectedReturnDataHash',
                        type: 'bytes32',
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
                        name: 'tokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'tokenIds',
                        type: 'uint256[]',
                    },
                    {
                        name: 'tokenValues',
                        type: 'uint256[]',
                    },
                    {
                        name: 'callbackData',
                        type: 'bytes',
                    },
                ],
                name: 'encodeERC1155AssetData',
                outputs: [
                    {
                        name: 'assetData',
                        type: 'bytes',
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
                        name: 'tokenAddress',
                        type: 'address',
                    },
                ],
                name: 'encodeERC20AssetData',
                outputs: [
                    {
                        name: 'assetData',
                        type: 'bytes',
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
                        name: 'tokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'tokenId',
                        type: 'uint256',
                    },
                ],
                name: 'encodeERC721AssetData',
                outputs: [
                    {
                        name: 'assetData',
                        type: 'bytes',
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
                        name: 'amounts',
                        type: 'uint256[]',
                    },
                    {
                        name: 'nestedAssetData',
                        type: 'bytes[]',
                    },
                ],
                name: 'encodeMultiAssetData',
                outputs: [
                    {
                        name: 'assetData',
                        type: 'bytes',
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
                        name: 'staticCallTargetAddress',
                        type: 'address',
                    },
                    {
                        name: 'staticCallData',
                        type: 'bytes',
                    },
                    {
                        name: 'expectedReturnDataHash',
                        type: 'bytes32',
                    },
                ],
                name: 'encodeStaticCallAssetData',
                outputs: [
                    {
                        name: 'assetData',
                        type: 'bytes',
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
                        name: 'assetData',
                        type: 'bytes',
                    },
                ],
                name: 'revertIfInvalidAssetData',
                outputs: [],
                payable: false,
                stateMutability: 'pure',
                type: 'function',
            },
        ];
        return abi;
    };
    LibAssetDataContract._deployLibrariesAsync = function (artifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses) {
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
                        return [4 /*yield*/, LibAssetDataContract._deployLibrariesAsync(libraryArtifact, libraryArtifacts, web3Wrapper, txDefaults, libraryAddresses)];
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
    LibAssetDataContract.prototype.getFunctionSignature = function (methodName) {
        var index = this._methodABIIndex[methodName];
        var methodAbi = LibAssetDataContract.ABI()[index]; // tslint:disable-line:no-unnecessary-type-assertion
        var functionSignature = base_contract_1.methodAbiToFunctionSignature(methodAbi);
        return functionSignature;
    };
    LibAssetDataContract.prototype.getABIDecodedTransactionData = function (methodName, callData) {
        var functionSignature = this.getFunctionSignature(methodName);
        var self = this;
        var abiEncoder = self._lookupAbiEncoder(functionSignature);
        var abiDecodedCallData = abiEncoder.strictDecode(callData);
        return abiDecodedCallData;
    };
    LibAssetDataContract.prototype.getABIDecodedReturnData = function (methodName, callData) {
        var functionSignature = this.getFunctionSignature(methodName);
        var self = this;
        var abiEncoder = self._lookupAbiEncoder(functionSignature);
        var abiDecodedCallData = abiEncoder.strictDecodeReturnValue(callData);
        return abiDecodedCallData;
    };
    LibAssetDataContract.prototype.getSelector = function (methodName) {
        var functionSignature = this.getFunctionSignature(methodName);
        var self = this;
        var abiEncoder = self._lookupAbiEncoder(functionSignature);
        return abiEncoder.getSelector();
    };
    /**
     * Decode AssetProxy identifier
      * @param assetData AssetProxy-compliant asset data describing an ERC-20, ERC-
     *     721, ERC1155, or MultiAsset asset.
    * @returns The AssetProxy identifier
     */
    LibAssetDataContract.prototype.decodeAssetProxyId = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'decodeAssetProxyId(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * Decode ERC-1155 asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC-1155 set
     *     of assets.
    * @returns The ERC-1155 AssetProxy identifier, the address of the ERC-1155 contract hosting the assets, an array of the identifiers of the assets to be traded, an array of asset amounts to be traded, and callback data.  Each element of the arrays corresponds to the same-indexed element of the other array.  Return values specified as &#x60;memory&#x60; are returned as pointers to locations within the memory of the input parameter &#x60;assetData&#x60;.
     */
    LibAssetDataContract.prototype.decodeERC1155AssetData = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'decodeERC1155AssetData(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * Decode ERC-20 asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC-20 asset.
    * @returns The AssetProxy identifier, and the address of the ERC-20 contract hosting this asset.
     */
    LibAssetDataContract.prototype.decodeERC20AssetData = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'decodeERC20AssetData(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * Decode ERC20Bridge asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC20Bridge
     *     asset
    * @returns The ERC20BridgeProxy identifier, the address of the ERC20 token to transfer, the address of the bridge contract, and extra data to be passed to the bridge contract.
     */
    LibAssetDataContract.prototype.decodeERC20BridgeAssetData = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'decodeERC20BridgeAssetData(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * Decode ERC-721 asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing an ERC-721
     *     asset.
    * @returns The ERC-721 AssetProxy identifier, the address of the ERC-721 contract hosting this asset, and the identifier of the specific asset to be traded.
     */
    LibAssetDataContract.prototype.decodeERC721AssetData = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'decodeERC721AssetData(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * Decode multi-asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant data describing a multi-asset basket.
    * @returns The Multi-Asset AssetProxy identifier, an array of the amounts of the assets to be traded, and an array of the AssetProxy-compliant data describing each asset to be traded.  Each element of the arrays corresponds to the same-indexed element of the other array.
     */
    LibAssetDataContract.prototype.decodeMultiAssetData = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'decodeMultiAssetData(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * Decode StaticCall asset data from the format described in the AssetProxy contract specification.
      * @param assetData AssetProxy-compliant asset data describing a StaticCall
     *     asset
    * @returns The StaticCall AssetProxy identifier, the target address of the StaticCAll, the data to be passed to the target address, and the expected Keccak-256 hash of the static call return data.
     */
    LibAssetDataContract.prototype.decodeStaticCallAssetData = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'decodeStaticCallAssetData(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * Encode ERC-1155 asset data into the format described in the AssetProxy contract specification.
      * @param tokenAddress The address of the ERC-1155 contract hosting the
     *     asset(s) to be traded.
      * @param tokenIds The identifiers of the specific assets to be traded.
      * @param tokenValues The amounts of each asset to be traded.
      * @param callbackData Data to be passed to receiving contracts when a transfer
     *     is performed.
    * @returns AssetProxy-compliant asset data describing the set of assets.
     */
    LibAssetDataContract.prototype.encodeERC1155AssetData = function (tokenAddress, tokenIds, tokenValues, callbackData) {
        var self = this;
        assert_1.assert.isString('tokenAddress', tokenAddress);
        assert_1.assert.isArray('tokenIds', tokenIds);
        assert_1.assert.isArray('tokenValues', tokenValues);
        assert_1.assert.isString('callbackData', callbackData);
        var functionSignature = 'encodeERC1155AssetData(address,uint256[],uint256[],bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [tokenAddress.toLowerCase(),
                    tokenIds,
                    tokenValues,
                    callbackData
                ]);
            },
        };
    };
    ;
    /**
     * Encode ERC-20 asset data into the format described in the AssetProxy contract specification.
      * @param tokenAddress The address of the ERC-20 contract hosting the asset to
     *     be traded.
    * @returns AssetProxy-compliant data describing the asset.
     */
    LibAssetDataContract.prototype.encodeERC20AssetData = function (tokenAddress) {
        var self = this;
        assert_1.assert.isString('tokenAddress', tokenAddress);
        var functionSignature = 'encodeERC20AssetData(address)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [tokenAddress.toLowerCase()
                ]);
            },
        };
    };
    ;
    /**
     * Encode ERC-721 asset data into the format described in the AssetProxy specification.
      * @param tokenAddress The address of the ERC-721 contract hosting the asset to
     *     be traded.
      * @param tokenId The identifier of the specific asset to be traded.
    * @returns AssetProxy-compliant asset data describing the asset.
     */
    LibAssetDataContract.prototype.encodeERC721AssetData = function (tokenAddress, tokenId) {
        var self = this;
        assert_1.assert.isString('tokenAddress', tokenAddress);
        assert_1.assert.isBigNumber('tokenId', tokenId);
        var functionSignature = 'encodeERC721AssetData(address,uint256)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [tokenAddress.toLowerCase(),
                    tokenId
                ]);
            },
        };
    };
    ;
    /**
     * Encode data for multiple assets, per the AssetProxy contract specification.
      * @param amounts The amounts of each asset to be traded.
      * @param nestedAssetData AssetProxy-compliant data describing each asset to be
     *     traded.
    * @returns AssetProxy-compliant data describing the set of assets.
     */
    LibAssetDataContract.prototype.encodeMultiAssetData = function (amounts, nestedAssetData) {
        var self = this;
        assert_1.assert.isArray('amounts', amounts);
        assert_1.assert.isArray('nestedAssetData', nestedAssetData);
        var functionSignature = 'encodeMultiAssetData(uint256[],bytes[])';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [amounts,
                    nestedAssetData
                ]);
            },
        };
    };
    ;
    /**
     * Encode StaticCall asset data into the format described in the AssetProxy contract specification.
      * @param staticCallTargetAddress Target address of StaticCall.
      * @param staticCallData Data that will be passed to staticCallTargetAddress in
     *     the StaticCall.
      * @param expectedReturnDataHash Expected Keccak-256 hash of the StaticCall
     *     return data.
    * @returns AssetProxy-compliant asset data describing the set of assets.
     */
    LibAssetDataContract.prototype.encodeStaticCallAssetData = function (staticCallTargetAddress, staticCallData, expectedReturnDataHash) {
        var self = this;
        assert_1.assert.isString('staticCallTargetAddress', staticCallTargetAddress);
        assert_1.assert.isString('staticCallData', staticCallData);
        assert_1.assert.isString('expectedReturnDataHash', expectedReturnDataHash);
        var functionSignature = 'encodeStaticCallAssetData(address,bytes,bytes32)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [staticCallTargetAddress.toLowerCase(),
                    staticCallData,
                    expectedReturnDataHash
                ]);
            },
        };
    };
    ;
    /**
     * Reverts if assetData is not of a valid format for its given proxy id.
      * @param assetData AssetProxy compliant asset data.
     */
    LibAssetDataContract.prototype.revertIfInvalidAssetData = function (assetData) {
        var self = this;
        assert_1.assert.isString('assetData', assetData);
        var functionSignature = 'revertIfInvalidAssetData(bytes)';
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
                            case 2: return [4 /*yield*/, self._performCallAsync(__assign({}, callData, { data: this.getABIEncodedTransactionData() }), defaultBlock)];
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
                return self._strictEncodeArguments(functionSignature, [assetData
                ]);
            },
        };
    };
    ;
    /**
     * @ignore
     */
    LibAssetDataContract.deployedBytecode = '0x73000000000000000000000000000000000000000030146080604052600436106100e95760003560e01c80639eadc83511610096578063bbb2dcf611610070578063bbb2dcf6146101ef578063ca49f47c14610211578063d3d862d114610234578063d469502814610247576100e9565b80639eadc835146101a5578063a6627e9f146101c9578063b43cffe1146101dc576100e9565b806363eb3992116100c757806363eb39921461014e578063750bdb30146101615780638f4ce47914610184576100e9565b806304a5618a146100ee57806346eb65cb14610119578063590aa8751461012e575b600080fd5b6101016100fc3660046111c6565b610267565b60405161011093929190611515565b60405180910390f35b61012c6101273660046111c6565b6102fb565b005b61014161013c366004610e6d565b6104af565b60405161011091906115cc565b61014161015c366004610fda565b610533565b61017461016f3660046111c6565b6105bd565b6040516101109493929190611402565b6101976101923660046111c6565b610654565b6040516101109291906113d2565b6101b86101b33660046111c6565b6106ca565b604051610110959493929190611455565b6101416101d7366004611031565b61075b565b6101416101ea366004610f43565b6107e2565b6102026101fd3660046111c6565b61086f565b6040516101109392919061154d565b61022461021f3660046111c6565b610902565b60405161011094939291906114c5565b61014161024236600461105c565b61098c565b61025a6102553660046111c6565b6109c4565b60405161011091906113bd565b6000808061027b848263ffffffff610af616565b92506001600160e01b031983167f0257179200000000000000000000000000000000000000000000000000000000146102cf5760405162461bcd60e51b81526004016102c690611601565b60405180910390fd5b6102e084601063ffffffff610b2f16565b91506102f384602463ffffffff610b6f16565b929491935050565b600061030d828263ffffffff610af616565b90506001600160e01b031981167ff47261b00000000000000000000000000000000000000000000000000000000014156103515761034a82610654565b50506104ab565b6001600160e01b031981167f025717920000000000000000000000000000000000000000000000000000000014156103945761038c82610267565b5050506104ab565b6001600160e01b031981167fa7cb5fb70000000000000000000000000000000000000000000000000000000014156103d9576103cf826106ca565b50505050506104ab565b6001600160e01b031981167f94cfcdd70000000000000000000000000000000000000000000000000000000014156104145761038c8261086f565b6001600160e01b031981167fc339d10a0000000000000000000000000000000000000000000000000000000014156104585761044f82610902565b505050506104ab565b6001600160e01b031981167fdc1600f30000000000000000000000000000000000000000000000000000000014156104935761044f826105bd565b60405162461bcd60e51b81526004016102c690611601565b5050565b6040516060907ff47261b000000000000000000000000000000000000000000000000000000000906104e5908490602401611268565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166001600160e01b0319909316929092179091529050919050565b6040516060907fc339d10a000000000000000000000000000000000000000000000000000000009061056d908690869086906024016112e8565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166001600160e01b03199093169290921790915290509392505050565b6000808060606105d3858363ffffffff610af616565b93506001600160e01b031984167fdc1600f3000000000000000000000000000000000000000000000000000000001461061e5760405162461bcd60e51b81526004016102c690611601565b845161063490869060049063ffffffff610b8216565b8060200190516106479190810190610e89565b9597919650949350915050565b600080610667838263ffffffff610af616565b91506001600160e01b031982167ff47261b000000000000000000000000000000000000000000000000000000000146106b25760405162461bcd60e51b81526004016102c690611601565b6106c383601063ffffffff610b2f16565b9050915091565b600080606080806106e1868563ffffffff610af616565b94506001600160e01b031985167fa7cb5fb7000000000000000000000000000000000000000000000000000000001461072c5760405162461bcd60e51b81526004016102c690611601565b505050506024828101516044840151606485015160848601519496929591820184019490820184019391010190565b6040516060907f0257179200000000000000000000000000000000000000000000000000000000906107939085908590602401611327565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166001600160e01b031990931692909217909152905092915050565b6040516060907fa7cb5fb7000000000000000000000000000000000000000000000000000000009061081e908790879087908790602401611289565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166001600160e01b0319909316929092179091529050949350505050565b6000606080610884848463ffffffff610af616565b92506001600160e01b031983167f94cfcdd700000000000000000000000000000000000000000000000000000000146108cf5760405162461bcd60e51b81526004016102c690611601565b83516108e590859060049063ffffffff610b8216565b8060200190516108f8919081019061110c565b9395909450915050565b600080606081610918858263ffffffff610af616565b93506001600160e01b031984167fc339d10a00000000000000000000000000000000000000000000000000000000146109635760405162461bcd60e51b81526004016102c690611601565b845161097990869060049063ffffffff610b8216565b8060200190516106479190810190610eeb565b6040516060907f94cfcdd70000000000000000000000000000000000000000000000000000000090610793908590859060240161134d565b60006109d6828263ffffffff610af616565b90506001600160e01b031981167ff47261b0000000000000000000000000000000000000000000000000000000001480610a3957506001600160e01b031981167f0257179200000000000000000000000000000000000000000000000000000000145b80610a6d57506001600160e01b031981167fa7cb5fb700000000000000000000000000000000000000000000000000000000145b80610aa157506001600160e01b031981167f94cfcdd700000000000000000000000000000000000000000000000000000000145b80610ad557506001600160e01b031981167fc339d10a00000000000000000000000000000000000000000000000000000000145b610af15760405162461bcd60e51b81526004016102c690611601565b919050565b60008160040183511015610b1c57610b1c610b176003855185600401610c02565b610c21565b5001602001516001600160e01b03191690565b60008160140183511015610b5057610b50610b176004855185601401610c02565b50016014015173ffffffffffffffffffffffffffffffffffffffff1690565b6000610b7b8383610c29565b9392505050565b606081831115610b9b57610b9b610b1760008585610c02565b8351821115610bb457610bb4610b176001848751610c02565b8282036040519080825280601f01601f191660200182016040528015610be1576020820181803883390190505b509050610b7b610bf082610c53565b84610bfa87610c53565b018351610c59565b6060632800659560e01b84848460405160240161056d939291906115df565b805160208201fd5b60008160200183511015610c4a57610c4a610b176005855185602001610c02565b50016020015190565b60200190565b6020811015610c83576001816020036101000a038019835116818551168082178652505050610cfa565b82821415610c9057610cfa565b82821115610cca5760208103905080820181840181515b82851015610cc2578451865260209586019590940193610ca7565b905250610cfa565b60208103905080820181840183515b81861215610cf55782518252601f199283019290910190610cd9565b855250505b505050565b600082601f830112610d0f578081fd5b8151610d22610d1d8261165f565b611638565b8181529150602080830190840160005b83811015610d5f57610d4a8760208451890101610e20565b83526020928301929190910190600101610d32565b5050505092915050565b600082601f830112610d79578081fd5b8135610d87610d1d8261165f565b818152915060208083019084810181840286018201871015610da857600080fd5b60005b84811015610dc757813584529282019290820190600101610dab565b505050505092915050565b600082601f830112610de2578081fd5b8135610df0610d1d8261167f565b9150808252836020828501011115610e0757600080fd5b8060208401602084013760009082016020015292915050565b600082601f830112610e30578081fd5b8151610e3e610d1d8261167f565b9150808252836020828501011115610e5557600080fd5b610e668160208401602086016116a3565b5092915050565b600060208284031215610e7e578081fd5b8135610b7b816116d3565b600080600060608486031215610e9d578182fd5b8351610ea8816116d3565b6020850151909350610eb9816116d3565b604085015190925067ffffffffffffffff811115610ed5578182fd5b610ee186828701610e20565b9150509250925092565b600080600060608486031215610eff578283fd5b8351610f0a816116d3565b602085015190935067ffffffffffffffff811115610f26578283fd5b610f3286828701610e20565b925050604084015190509250925092565b60008060008060808587031215610f58578081fd5b8435610f63816116d3565b9350602085013567ffffffffffffffff80821115610f7f578283fd5b610f8b88838901610d69565b94506040870135915080821115610fa0578283fd5b610fac88838901610d69565b93506060870135915080821115610fc1578283fd5b50610fce87828801610dd2565b91505092959194509250565b600080600060608486031215610fee578283fd5b8335610ff9816116d3565b9250602084013567ffffffffffffffff811115611014578283fd5b61102086828701610dd2565b925050604084013590509250925092565b60008060408385031215611043578182fd5b823561104e816116d3565b946020939093013593505050565b6000806040838503121561106e578182fd5b823567ffffffffffffffff80821115611085578384fd5b61109186838701610d69565b93506020915081850135818111156110a7578384fd5b85019050601f810186136110b9578283fd5b80356110c7610d1d8261165f565b81815283810190838501865b848110156110fc576110ea8b888435890101610dd2565b845292860192908601906001016110d3565b5096999098509650505050505050565b6000806040838503121561111e578182fd5b825167ffffffffffffffff80821115611135578384fd5b81850186601f820112611146578485fd5b80519250611156610d1d8461165f565b80848252602080830192508084018a828389028701011115611176578889fd5b8894505b8685101561119857805184526001949094019392810192810161117a565b5088015190965093505050808211156111af578283fd5b506111bc85828601610cff565b9150509250929050565b6000602082840312156111d7578081fd5b813567ffffffffffffffff8111156111ed578182fd5b6111f984828501610dd2565b949350505050565b6000815180845260208401935060208301825b82811015611232578151865260209586019590910190600101611214565b5093949350505050565b600081518084526112548160208601602086016116a3565b601f01601f19169290920160200192915050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff86168252608060208301526112b86080830186611201565b82810360408401526112ca8186611201565b83810360608501526112dc818661123c565b98975050505050505050565b600073ffffffffffffffffffffffffffffffffffffffff8516825260606020830152611317606083018561123c565b9050826040830152949350505050565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6000604082526113606040830185611201565b602083820381850152818551808452828401915082838202850101838801865b838110156113ae57601f1987840301855261139c83835161123c565b94860194925090850190600101611380565b50909998505050505050505050565b6001600160e01b031991909116815260200190565b6001600160e01b031992909216825273ffffffffffffffffffffffffffffffffffffffff16602082015260400190565b60006001600160e01b03198616825273ffffffffffffffffffffffffffffffffffffffff80861660208401528085166040840152506080606083015261144b608083018461123c565b9695505050505050565b60006001600160e01b03198716825273ffffffffffffffffffffffffffffffffffffffff8616602083015260a0604083015261149460a0830186611201565b82810360608401526114a68186611201565b83810360808501526114b8818661123c565b9998505050505050505050565b60006001600160e01b03198616825273ffffffffffffffffffffffffffffffffffffffff8516602083015260806040830152611504608083018561123c565b905082606083015295945050505050565b6001600160e01b031993909316835273ffffffffffffffffffffffffffffffffffffffff919091166020830152604082015260600190565b60006001600160e01b03198516825260206060818401526115716060840186611201565b838103604085015284518082528282019083810283018401848801865b838110156115bc57601f198684030185526115aa83835161123c565b9487019492509086019060010161158e565b50909a9950505050505050505050565b600060208252610b7b602083018461123c565b60608101600885106115ed57fe5b938152602081019290925260409091015290565b6020808252600e908201527f57524f4e475f50524f58595f4944000000000000000000000000000000000000604082015260600190565b60405181810167ffffffffffffffff8111828210171561165757600080fd5b604052919050565b600067ffffffffffffffff821115611675578081fd5b5060209081020190565b600067ffffffffffffffff821115611695578081fd5b50601f01601f191660200190565b60005b838110156116be5781810151838201526020016116a6565b838111156116cd576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff811681146116f557600080fd5b5056fea365627a7a723158206650427dfc938335d083f36f89ea0af6cd8ee865a96a42e65de6184d08f4d0ba6c6578706572696d656e74616cf564736f6c63430005110040';
    LibAssetDataContract.contractName = 'LibAssetData';
    return LibAssetDataContract;
}(base_contract_1.BaseContract));
exports.LibAssetDataContract = LibAssetDataContract;
// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
//# sourceMappingURL=lib_asset_data.js.map