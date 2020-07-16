"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.blockchainTests.resets('UniswapV2 unit tests', function (env) {
    var FROM_TOKEN_DECIMALS = 6;
    var TO_TOKEN_DECIMALS = 18;
    var FROM_TOKEN_BASE = new utils_1.BigNumber(10).pow(FROM_TOKEN_DECIMALS);
    var TO_TOKEN_BASE = new utils_1.BigNumber(10).pow(TO_TOKEN_DECIMALS);
    var testContract;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrappers_1.TestUniswapV2BridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestUniswapV2Bridge, env.provider, env.txDefaults, artifacts_1.artifacts)];
                case 1:
                    testContract = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('isValidSignature()', function () {
        it('returns success bytes', function () { return __awaiter(_this, void 0, void 0, function () {
            var LEGACY_WALLET_MAGIC_VALUE, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        LEGACY_WALLET_MAGIC_VALUE = '0xb0671381';
                        return [4 /*yield*/, testContract
                                .isValidSignature(utils_1.hexUtils.random(), utils_1.hexUtils.random(_.random(0, 32)))
                                .callAsync()];
                    case 1:
                        result = _a.sent();
                        contracts_test_utils_1.expect(result).to.eq(LEGACY_WALLET_MAGIC_VALUE);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('bridgeTransferFrom()', function () {
        function createTransferFromOpts(opts) {
            var amount = contracts_test_utils_1.getRandomInteger(1, TO_TOKEN_BASE.times(100));
            return __assign({ tokenAddressesPath: Array(2).fill(contracts_test_utils_1.constants.NULL_ADDRESS), amount: amount, toAddress: contracts_test_utils_1.randomAddress(), fromTokenBalance: contracts_test_utils_1.getRandomInteger(1, FROM_TOKEN_BASE.times(100)), routerRevertReason: '' }, opts);
        }
        var bridgeDataEncoder = utils_1.AbiEncoder.create('(address[])');
        function transferFromAsync(opts) {
            return __awaiter(this, void 0, void 0, function () {
                var _opts, i, createFromTokenFn, _a, _b, bridgeTransferFromFn, result, receipt, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _opts = createTransferFromOpts(opts);
                            i = 0;
                            _d.label = 1;
                        case 1:
                            if (!(i < _opts.tokenAddressesPath.length)) return [3 /*break*/, 5];
                            createFromTokenFn = testContract.createToken(_opts.tokenAddressesPath[i]);
                            _a = _opts.tokenAddressesPath;
                            _b = i;
                            return [4 /*yield*/, createFromTokenFn.callAsync()];
                        case 2:
                            _a[_b] = _d.sent();
                            return [4 /*yield*/, createFromTokenFn.awaitTransactionSuccessAsync()];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 1];
                        case 5: 
                        // Set the token balance for the token we're converting from.
                        return [4 /*yield*/, testContract
                                .setTokenBalance(_opts.tokenAddressesPath[0], _opts.fromTokenBalance)
                                .awaitTransactionSuccessAsync()];
                        case 6:
                            // Set the token balance for the token we're converting from.
                            _d.sent();
                            // Set revert reason for the router.
                            return [4 /*yield*/, testContract.setRouterRevertReason(_opts.routerRevertReason).awaitTransactionSuccessAsync()];
                        case 7:
                            // Set revert reason for the router.
                            _d.sent();
                            bridgeTransferFromFn = testContract.bridgeTransferFrom(
                            // Output token
                            _opts.tokenAddressesPath[_opts.tokenAddressesPath.length - 1], 
                            // Random maker address.
                            contracts_test_utils_1.randomAddress(), 
                            // Recipient address.
                            _opts.toAddress, 
                            // Transfer amount.
                            _opts.amount, 
                            // ABI-encode the input token address as the bridge data. // FIXME
                            bridgeDataEncoder.encode([_opts.tokenAddressesPath]));
                            return [4 /*yield*/, bridgeTransferFromFn.callAsync()];
                        case 8:
                            result = _d.sent();
                            return [4 /*yield*/, bridgeTransferFromFn.awaitTransactionSuccessAsync()];
                        case 9:
                            receipt = _d.sent();
                            _c = {
                                opts: _opts,
                                result: result,
                                logs: receipt.logs
                            };
                            return [4 /*yield*/, env.web3Wrapper.getBlockTimestampAsync(receipt.blockNumber)];
                        case 10: return [2 /*return*/, (_c.blocktime = _d.sent(),
                                _c)];
                    }
                });
            });
        }
        it('returns magic bytes on success', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, transferFromAsync()];
                    case 1:
                        result = (_a.sent()).result;
                        contracts_test_utils_1.expect(result).to.eq(types_1.AssetProxyId.ERC20Bridge);
                        return [2 /*return*/];
                }
            });
        }); });
        it('performs transfer when both tokens are the same', function () { return __awaiter(_this, void 0, void 0, function () {
            var createTokenFn, tokenAddress, _a, opts, result, logs, transfers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        createTokenFn = testContract.createToken(contracts_test_utils_1.constants.NULL_ADDRESS);
                        return [4 /*yield*/, createTokenFn.callAsync()];
                    case 1:
                        tokenAddress = _b.sent();
                        return [4 /*yield*/, createTokenFn.awaitTransactionSuccessAsync()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, transferFromAsync({
                                tokenAddressesPath: [tokenAddress, tokenAddress],
                            })];
                    case 3:
                        _a = _b.sent(), opts = _a.opts, result = _a.result, logs = _a.logs;
                        contracts_test_utils_1.expect(result).to.eq(types_1.AssetProxyId.ERC20Bridge, 'asset proxy id');
                        transfers = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapV2BridgeEvents.TokenTransfer);
                        contracts_test_utils_1.expect(transfers.length).to.eq(1);
                        contracts_test_utils_1.expect(transfers[0].token).to.eq(tokenAddress, 'input token address');
                        contracts_test_utils_1.expect(transfers[0].from).to.eq(testContract.address);
                        contracts_test_utils_1.expect(transfers[0].to).to.eq(opts.toAddress, 'recipient address');
                        contracts_test_utils_1.expect(transfers[0].amount).to.bignumber.eq(opts.amount, 'amount');
                        return [2 /*return*/];
                }
            });
        }); });
        describe('token -> token', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                it('calls UniswapV2Router01.swapExactTokensForTokens()', function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, opts, result, logs, blocktime, transfers;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, transferFromAsync()];
                            case 1:
                                _a = _b.sent(), opts = _a.opts, result = _a.result, logs = _a.logs, blocktime = _a.blocktime;
                                contracts_test_utils_1.expect(result).to.eq(types_1.AssetProxyId.ERC20Bridge, 'asset proxy id');
                                transfers = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapV2BridgeEvents.SwapExactTokensForTokensInput);
                                contracts_test_utils_1.expect(transfers.length).to.eq(1);
                                contracts_test_utils_1.expect(transfers[0].toTokenAddress).to.eq(opts.tokenAddressesPath[opts.tokenAddressesPath.length - 1], 'output token address');
                                contracts_test_utils_1.expect(transfers[0].to).to.eq(opts.toAddress, 'recipient address');
                                contracts_test_utils_1.expect(transfers[0].amountIn).to.bignumber.eq(opts.fromTokenBalance, 'input token amount');
                                contracts_test_utils_1.expect(transfers[0].amountOutMin).to.bignumber.eq(opts.amount, 'output token amount');
                                contracts_test_utils_1.expect(transfers[0].deadline).to.bignumber.eq(blocktime, 'deadline');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('sets allowance for "from" token', function () { return __awaiter(_this, void 0, void 0, function () {
                    var logs, approvals, routerAddress;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, transferFromAsync()];
                            case 1:
                                logs = (_a.sent()).logs;
                                approvals = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapV2BridgeEvents.TokenApprove);
                                return [4 /*yield*/, testContract.getRouterAddress().callAsync()];
                            case 2:
                                routerAddress = _a.sent();
                                contracts_test_utils_1.expect(approvals.length).to.eq(1);
                                contracts_test_utils_1.expect(approvals[0].spender).to.eq(routerAddress);
                                contracts_test_utils_1.expect(approvals[0].allowance).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('sets allowance for "from" token on subsequent calls', function () { return __awaiter(_this, void 0, void 0, function () {
                    var opts, logs, approvals, routerAddress;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, transferFromAsync()];
                            case 1:
                                opts = (_a.sent()).opts;
                                return [4 /*yield*/, transferFromAsync(opts)];
                            case 2:
                                logs = (_a.sent()).logs;
                                approvals = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapV2BridgeEvents.TokenApprove);
                                return [4 /*yield*/, testContract.getRouterAddress().callAsync()];
                            case 3:
                                routerAddress = _a.sent();
                                contracts_test_utils_1.expect(approvals.length).to.eq(1);
                                contracts_test_utils_1.expect(approvals[0].spender).to.eq(routerAddress);
                                contracts_test_utils_1.expect(approvals[0].allowance).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if the router fails', function () { return __awaiter(_this, void 0, void 0, function () {
                    var revertReason, tx;
                    return __generator(this, function (_a) {
                        revertReason = 'FOOBAR';
                        tx = transferFromAsync({
                            routerRevertReason: revertReason,
                        });
                        return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith(revertReason)];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe('token -> token -> token', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                it('calls UniswapV2Router01.swapExactTokensForTokens()', function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, opts, result, logs, blocktime, transfers;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, transferFromAsync({
                                    tokenAddressesPath: Array(3).fill(contracts_test_utils_1.constants.NULL_ADDRESS),
                                })];
                            case 1:
                                _a = _b.sent(), opts = _a.opts, result = _a.result, logs = _a.logs, blocktime = _a.blocktime;
                                contracts_test_utils_1.expect(result).to.eq(types_1.AssetProxyId.ERC20Bridge, 'asset proxy id');
                                transfers = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapV2BridgeEvents.SwapExactTokensForTokensInput);
                                contracts_test_utils_1.expect(transfers.length).to.eq(1);
                                contracts_test_utils_1.expect(transfers[0].toTokenAddress).to.eq(opts.tokenAddressesPath[opts.tokenAddressesPath.length - 1], 'output token address');
                                contracts_test_utils_1.expect(transfers[0].to).to.eq(opts.toAddress, 'recipient address');
                                contracts_test_utils_1.expect(transfers[0].amountIn).to.bignumber.eq(opts.fromTokenBalance, 'input token amount');
                                contracts_test_utils_1.expect(transfers[0].amountOutMin).to.bignumber.eq(opts.amount, 'output token amount');
                                contracts_test_utils_1.expect(transfers[0].deadline).to.bignumber.eq(blocktime, 'deadline');
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=uniswapv2_bridge.js.map