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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var types_1 = require("@0x/types");
var utils_1 = require("@0x/utils");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.blockchainTests.resets('UniswapBridge unit tests', function (env) {
    var testContract;
    var wethTokenAddress;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrappers_1.TestUniswapBridgeContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestUniswapBridge, env.provider, env.txDefaults, artifacts_1.artifacts)];
                case 1:
                    testContract = _a.sent();
                    return [4 /*yield*/, testContract.wethToken().callAsync()];
                case 2:
                    wethTokenAddress = _a.sent();
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
        function createWithdrawToOpts(opts) {
            return __assign({ fromTokenAddress: contracts_test_utils_1.constants.NULL_ADDRESS, toTokenAddress: contracts_test_utils_1.constants.NULL_ADDRESS, fromTokenBalance: contracts_test_utils_1.getRandomInteger(1, 1e18), toAddress: contracts_test_utils_1.randomAddress(), amount: contracts_test_utils_1.getRandomInteger(1, 1e18), exchangeRevertReason: '', exchangeFillAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), toTokenRevertReason: '', fromTokenRevertReason: '' }, opts);
        }
        function withdrawToAsync(opts) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _opts, callData, createFromTokenFn, createToTokenFn, bridgeTransferFromFn, result, receipt, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _opts = createWithdrawToOpts(opts);
                            callData = { value: new utils_1.BigNumber(_opts.exchangeFillAmount) };
                            createFromTokenFn = testContract.createTokenAndExchange(_opts.fromTokenAddress, _opts.exchangeRevertReason);
                            return [4 /*yield*/, createFromTokenFn.callAsync(callData)];
                        case 1:
                            _a = __read.apply(void 0, [_d.sent(), 1]), _opts.fromTokenAddress = _a[0];
                            return [4 /*yield*/, createFromTokenFn.awaitTransactionSuccessAsync(callData)];
                        case 2:
                            _d.sent();
                            createToTokenFn = testContract.createTokenAndExchange(_opts.toTokenAddress, _opts.exchangeRevertReason);
                            return [4 /*yield*/, createToTokenFn.callAsync(callData)];
                        case 3:
                            _b = __read.apply(void 0, [_d.sent(), 1]), _opts.toTokenAddress = _b[0];
                            return [4 /*yield*/, createToTokenFn.awaitTransactionSuccessAsync(callData)];
                        case 4:
                            _d.sent();
                            return [4 /*yield*/, testContract
                                    .setTokenRevertReason(_opts.toTokenAddress, _opts.toTokenRevertReason)
                                    .awaitTransactionSuccessAsync()];
                        case 5:
                            _d.sent();
                            return [4 /*yield*/, testContract
                                    .setTokenRevertReason(_opts.fromTokenAddress, _opts.fromTokenRevertReason)
                                    .awaitTransactionSuccessAsync()];
                        case 6:
                            _d.sent();
                            // Set the token balance for the token we're converting from.
                            return [4 /*yield*/, testContract.setTokenBalance(_opts.fromTokenAddress).awaitTransactionSuccessAsync({
                                    value: new utils_1.BigNumber(_opts.fromTokenBalance),
                                })];
                        case 7:
                            // Set the token balance for the token we're converting from.
                            _d.sent();
                            bridgeTransferFromFn = testContract.bridgeTransferFrom(
                            // The "to" token address.
                            _opts.toTokenAddress, 
                            // The "from" address.
                            contracts_test_utils_1.randomAddress(), 
                            // The "to" address.
                            _opts.toAddress, 
                            // The amount to transfer to "to"
                            new utils_1.BigNumber(_opts.amount), 
                            // ABI-encoded "from" token address.
                            utils_1.hexUtils.leftPad(_opts.fromTokenAddress));
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
                        case 10: return [2 /*return*/, (_c.blockTime = _d.sent(),
                                _c)];
                    }
                });
            });
        }
        function getExchangeForTokenAsync(tokenAddress) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, testContract.getExchange(tokenAddress).callAsync()];
                });
            });
        }
        it('returns magic bytes on success', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withdrawToAsync()];
                    case 1:
                        result = (_a.sent()).result;
                        contracts_test_utils_1.expect(result).to.eq(types_1.AssetProxyId.ERC20Bridge);
                        return [2 /*return*/];
                }
            });
        }); });
        it('just transfers tokens to `to` if the same tokens are in play', function () { return __awaiter(_this, void 0, void 0, function () {
            var createTokenFn, _a, tokenAddress, _b, opts, result, logs, transfers;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, testContract.createTokenAndExchange(contracts_test_utils_1.constants.NULL_ADDRESS, '')];
                    case 1:
                        createTokenFn = _c.sent();
                        return [4 /*yield*/, createTokenFn.callAsync()];
                    case 2:
                        _a = __read.apply(void 0, [_c.sent(), 1]), tokenAddress = _a[0];
                        return [4 /*yield*/, createTokenFn.awaitTransactionSuccessAsync()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, withdrawToAsync({
                                fromTokenAddress: tokenAddress,
                                toTokenAddress: tokenAddress,
                            })];
                    case 4:
                        _b = _c.sent(), opts = _b.opts, result = _b.result, logs = _b.logs;
                        contracts_test_utils_1.expect(result).to.eq(types_1.AssetProxyId.ERC20Bridge);
                        transfers = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapBridgeEvents.TokenTransfer);
                        contracts_test_utils_1.expect(transfers.length).to.eq(1);
                        contracts_test_utils_1.expect(transfers[0].token).to.eq(tokenAddress);
                        contracts_test_utils_1.expect(transfers[0].from).to.eq(testContract.address);
                        contracts_test_utils_1.expect(transfers[0].to).to.eq(opts.toAddress);
                        contracts_test_utils_1.expect(transfers[0].amount).to.bignumber.eq(opts.amount);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('token -> token', function () {
            it('calls `IUniswapExchange.tokenToTokenTransferInput()', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, opts, logs, blockTime, exchangeAddress, calls;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync()];
                        case 1:
                            _a = _b.sent(), opts = _a.opts, logs = _a.logs, blockTime = _a.blockTime;
                            return [4 /*yield*/, getExchangeForTokenAsync(opts.fromTokenAddress)];
                        case 2:
                            exchangeAddress = _b.sent();
                            calls = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapBridgeEvents.TokenToTokenTransferInput);
                            contracts_test_utils_1.expect(calls.length).to.eq(1);
                            contracts_test_utils_1.expect(calls[0].exchange).to.eq(exchangeAddress);
                            contracts_test_utils_1.expect(calls[0].tokensSold).to.bignumber.eq(opts.fromTokenBalance);
                            contracts_test_utils_1.expect(calls[0].minTokensBought).to.bignumber.eq(opts.amount);
                            contracts_test_utils_1.expect(calls[0].minEthBought).to.bignumber.eq(1);
                            contracts_test_utils_1.expect(calls[0].deadline).to.bignumber.eq(blockTime);
                            contracts_test_utils_1.expect(calls[0].recipient).to.eq(opts.toAddress);
                            contracts_test_utils_1.expect(calls[0].toTokenAddress).to.eq(opts.toTokenAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('sets allowance for "from" token', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, opts, logs, approvals, exchangeAddress;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync()];
                        case 1:
                            _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                            approvals = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapBridgeEvents.TokenApprove);
                            return [4 /*yield*/, getExchangeForTokenAsync(opts.fromTokenAddress)];
                        case 2:
                            exchangeAddress = _b.sent();
                            contracts_test_utils_1.expect(approvals.length).to.eq(1);
                            contracts_test_utils_1.expect(approvals[0].spender).to.eq(exchangeAddress);
                            contracts_test_utils_1.expect(approvals[0].allowance).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('sets allowance for "from" token on subsequent calls', function () { return __awaiter(_this, void 0, void 0, function () {
                var opts, logs, approvals, exchangeAddress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync()];
                        case 1:
                            opts = (_a.sent()).opts;
                            return [4 /*yield*/, withdrawToAsync(opts)];
                        case 2:
                            logs = (_a.sent()).logs;
                            approvals = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapBridgeEvents.TokenApprove);
                            return [4 /*yield*/, getExchangeForTokenAsync(opts.fromTokenAddress)];
                        case 3:
                            exchangeAddress = _a.sent();
                            contracts_test_utils_1.expect(approvals.length).to.eq(1);
                            contracts_test_utils_1.expect(approvals[0].spender).to.eq(exchangeAddress);
                            contracts_test_utils_1.expect(approvals[0].allowance).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails if "from" token does not exist', function () { return __awaiter(_this, void 0, void 0, function () {
                var tx;
                return __generator(this, function (_a) {
                    tx = testContract
                        .bridgeTransferFrom(contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), contracts_test_utils_1.getRandomInteger(1, 1e18), utils_1.hexUtils.leftPad(contracts_test_utils_1.randomAddress()))
                        .awaitTransactionSuccessAsync();
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith('NO_UNISWAP_EXCHANGE_FOR_TOKEN')];
                });
            }); });
            it('fails if the exchange fails', function () { return __awaiter(_this, void 0, void 0, function () {
                var revertReason, tx;
                return __generator(this, function (_a) {
                    revertReason = 'FOOBAR';
                    tx = withdrawToAsync({
                        exchangeRevertReason: revertReason,
                    });
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith(revertReason)];
                });
            }); });
        });
        describe('token -> ETH', function () {
            it('calls `IUniswapExchange.tokenToEthSwapInput()`, `WETH.deposit()`, then `transfer()`', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, opts, logs, blockTime, exchangeAddress, calls;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync({
                                toTokenAddress: wethTokenAddress,
                            })];
                        case 1:
                            _a = _b.sent(), opts = _a.opts, logs = _a.logs, blockTime = _a.blockTime;
                            return [4 /*yield*/, getExchangeForTokenAsync(opts.fromTokenAddress)];
                        case 2:
                            exchangeAddress = _b.sent();
                            calls = contracts_test_utils_1.filterLogs(logs, wrappers_1.TestUniswapBridgeEvents.TokenToEthSwapInput);
                            contracts_test_utils_1.expect(calls.length).to.eq(1);
                            contracts_test_utils_1.expect(calls[0].args.exchange).to.eq(exchangeAddress);
                            contracts_test_utils_1.expect(calls[0].args.tokensSold).to.bignumber.eq(opts.fromTokenBalance);
                            contracts_test_utils_1.expect(calls[0].args.minEthBought).to.bignumber.eq(opts.amount);
                            contracts_test_utils_1.expect(calls[0].args.deadline).to.bignumber.eq(blockTime);
                            calls = contracts_test_utils_1.filterLogs(logs.slice(calls[0].logIndex), wrappers_1.TestUniswapBridgeEvents.WethDeposit);
                            contracts_test_utils_1.expect(calls.length).to.eq(1);
                            contracts_test_utils_1.expect(calls[0].args.amount).to.bignumber.eq(opts.exchangeFillAmount);
                            calls = contracts_test_utils_1.filterLogs(logs.slice(calls[0].logIndex), wrappers_1.TestUniswapBridgeEvents.TokenTransfer);
                            contracts_test_utils_1.expect(calls.length).to.eq(1);
                            contracts_test_utils_1.expect(calls[0].args.token).to.eq(opts.toTokenAddress);
                            contracts_test_utils_1.expect(calls[0].args.from).to.eq(testContract.address);
                            contracts_test_utils_1.expect(calls[0].args.to).to.eq(opts.toAddress);
                            contracts_test_utils_1.expect(calls[0].args.amount).to.bignumber.eq(opts.exchangeFillAmount);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('sets allowance for "from" token', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, opts, logs, transfers, exchangeAddress;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync({
                                toTokenAddress: wethTokenAddress,
                            })];
                        case 1:
                            _a = _b.sent(), opts = _a.opts, logs = _a.logs;
                            transfers = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapBridgeEvents.TokenApprove);
                            return [4 /*yield*/, getExchangeForTokenAsync(opts.fromTokenAddress)];
                        case 2:
                            exchangeAddress = _b.sent();
                            contracts_test_utils_1.expect(transfers.length).to.eq(1);
                            contracts_test_utils_1.expect(transfers[0].spender).to.eq(exchangeAddress);
                            contracts_test_utils_1.expect(transfers[0].allowance).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('sets allowance for "from" token on subsequent calls', function () { return __awaiter(_this, void 0, void 0, function () {
                var opts, logs, approvals, exchangeAddress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync({
                                toTokenAddress: wethTokenAddress,
                            })];
                        case 1:
                            opts = (_a.sent()).opts;
                            return [4 /*yield*/, withdrawToAsync(opts)];
                        case 2:
                            logs = (_a.sent()).logs;
                            approvals = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapBridgeEvents.TokenApprove);
                            return [4 /*yield*/, getExchangeForTokenAsync(opts.fromTokenAddress)];
                        case 3:
                            exchangeAddress = _a.sent();
                            contracts_test_utils_1.expect(approvals.length).to.eq(1);
                            contracts_test_utils_1.expect(approvals[0].spender).to.eq(exchangeAddress);
                            contracts_test_utils_1.expect(approvals[0].allowance).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails if "from" token does not exist', function () { return __awaiter(_this, void 0, void 0, function () {
                var tx;
                return __generator(this, function (_a) {
                    tx = testContract
                        .bridgeTransferFrom(contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), contracts_test_utils_1.getRandomInteger(1, 1e18), utils_1.hexUtils.leftPad(wethTokenAddress))
                        .awaitTransactionSuccessAsync();
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith('NO_UNISWAP_EXCHANGE_FOR_TOKEN')];
                });
            }); });
            it('fails if `WETH.deposit()` fails', function () { return __awaiter(_this, void 0, void 0, function () {
                var revertReason, tx;
                return __generator(this, function (_a) {
                    revertReason = 'FOOBAR';
                    tx = withdrawToAsync({
                        toTokenAddress: wethTokenAddress,
                        toTokenRevertReason: revertReason,
                    });
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith(revertReason)];
                });
            }); });
            it('fails if the exchange fails', function () { return __awaiter(_this, void 0, void 0, function () {
                var revertReason, tx;
                return __generator(this, function (_a) {
                    revertReason = 'FOOBAR';
                    tx = withdrawToAsync({
                        toTokenAddress: wethTokenAddress,
                        exchangeRevertReason: revertReason,
                    });
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith(revertReason)];
                });
            }); });
        });
        describe('ETH -> token', function () {
            it('calls  `WETH.withdraw()`, then `IUniswapExchange.ethToTokenTransferInput()`', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, opts, logs, blockTime, exchangeAddress, calls;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync({
                                fromTokenAddress: wethTokenAddress,
                            })];
                        case 1:
                            _a = _b.sent(), opts = _a.opts, logs = _a.logs, blockTime = _a.blockTime;
                            return [4 /*yield*/, getExchangeForTokenAsync(opts.toTokenAddress)];
                        case 2:
                            exchangeAddress = _b.sent();
                            calls = contracts_test_utils_1.filterLogs(logs, wrappers_1.TestUniswapBridgeEvents.WethWithdraw);
                            contracts_test_utils_1.expect(calls.length).to.eq(1);
                            contracts_test_utils_1.expect(calls[0].args.amount).to.bignumber.eq(opts.fromTokenBalance);
                            calls = contracts_test_utils_1.filterLogs(logs.slice(calls[0].logIndex), wrappers_1.TestUniswapBridgeEvents.EthToTokenTransferInput);
                            contracts_test_utils_1.expect(calls.length).to.eq(1);
                            contracts_test_utils_1.expect(calls[0].args.exchange).to.eq(exchangeAddress);
                            contracts_test_utils_1.expect(calls[0].args.minTokensBought).to.bignumber.eq(opts.amount);
                            contracts_test_utils_1.expect(calls[0].args.deadline).to.bignumber.eq(blockTime);
                            contracts_test_utils_1.expect(calls[0].args.recipient).to.eq(opts.toAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not set any allowance', function () { return __awaiter(_this, void 0, void 0, function () {
                var logs, approvals;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, withdrawToAsync({
                                fromTokenAddress: wethTokenAddress,
                            })];
                        case 1:
                            logs = (_a.sent()).logs;
                            approvals = contracts_test_utils_1.filterLogsToArguments(logs, wrappers_1.TestUniswapBridgeEvents.TokenApprove);
                            contracts_test_utils_1.expect(approvals).to.be.empty('');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails if "to" token does not exist', function () { return __awaiter(_this, void 0, void 0, function () {
                var tx;
                return __generator(this, function (_a) {
                    tx = testContract
                        .bridgeTransferFrom(wethTokenAddress, contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), contracts_test_utils_1.getRandomInteger(1, 1e18), utils_1.hexUtils.leftPad(contracts_test_utils_1.randomAddress()))
                        .awaitTransactionSuccessAsync();
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith('NO_UNISWAP_EXCHANGE_FOR_TOKEN')];
                });
            }); });
            it('fails if the `WETH.withdraw()` fails', function () { return __awaiter(_this, void 0, void 0, function () {
                var revertReason, tx;
                return __generator(this, function (_a) {
                    revertReason = 'FOOBAR';
                    tx = withdrawToAsync({
                        fromTokenAddress: wethTokenAddress,
                        fromTokenRevertReason: revertReason,
                    });
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith(revertReason)];
                });
            }); });
            it('fails if the exchange fails', function () { return __awaiter(_this, void 0, void 0, function () {
                var revertReason, tx;
                return __generator(this, function (_a) {
                    revertReason = 'FOOBAR';
                    tx = withdrawToAsync({
                        fromTokenAddress: wethTokenAddress,
                        exchangeRevertReason: revertReason,
                    });
                    return [2 /*return*/, contracts_test_utils_1.expect(tx).to.eventually.be.rejectedWith(revertReason)];
                });
            }); });
        });
    });
});
//# sourceMappingURL=uniswap_bridge.js.map