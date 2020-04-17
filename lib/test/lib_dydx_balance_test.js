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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_asset_proxy_1 = require("@0x/contracts-asset-proxy");
var contracts_test_utils_1 = require("@0x/contracts-test-utils");
var utils_1 = require("@0x/utils");
var artifacts_1 = require("./artifacts");
var wrappers_1 = require("./wrappers");
contracts_test_utils_1.blockchainTests('LibDydxBalance', function (env) {
    var MARGIN_RATIO = 1.5;
    var PRICE_DECIMALS = 18;
    var MAKER_DECIMALS = 6;
    var TAKER_DECIMALS = 18;
    var INITIAL_TAKER_TOKEN_BALANCE = utils_1.fromTokenUnitAmount(1000, TAKER_DECIMALS);
    var BRIDGE_ADDRESS = contracts_test_utils_1.randomAddress();
    var ACCOUNT_OWNER = contracts_test_utils_1.randomAddress();
    var MAKER_PRICE = 150;
    var TAKER_PRICE = 100;
    var SOLVENT_ACCOUNT_IDX = 0;
    // const MIN_SOLVENT_ACCOUNT_IDX = 1;
    var INSOLVENT_ACCOUNT_IDX = 2;
    var ZERO_BALANCE_ACCOUNT_IDX = 3;
    var DYDX_CONFIG = {
        marginRatio: utils_1.fromTokenUnitAmount(MARGIN_RATIO - 1, PRICE_DECIMALS),
        operators: [{ owner: ACCOUNT_OWNER, operator: BRIDGE_ADDRESS }],
        accounts: [
            {
                owner: ACCOUNT_OWNER,
                accountId: contracts_test_utils_1.getRandomInteger(1, Math.pow(2, 64)),
                // Account exceeds collateralization.
                balances: [utils_1.fromTokenUnitAmount(10, TAKER_DECIMALS), utils_1.fromTokenUnitAmount(-1, MAKER_DECIMALS)],
            },
            {
                owner: ACCOUNT_OWNER,
                accountId: contracts_test_utils_1.getRandomInteger(1, Math.pow(2, 64)),
                // Account is at minimum collateralization.
                balances: [
                    utils_1.fromTokenUnitAmount((MAKER_PRICE / TAKER_PRICE) * MARGIN_RATIO * 5, TAKER_DECIMALS),
                    utils_1.fromTokenUnitAmount(-5, MAKER_DECIMALS),
                ],
            },
            {
                owner: ACCOUNT_OWNER,
                accountId: contracts_test_utils_1.getRandomInteger(1, Math.pow(2, 64)),
                // Account is undercollateralized..
                balances: [utils_1.fromTokenUnitAmount(1, TAKER_DECIMALS), utils_1.fromTokenUnitAmount(-2, MAKER_DECIMALS)],
            },
            {
                owner: ACCOUNT_OWNER,
                accountId: contracts_test_utils_1.getRandomInteger(1, Math.pow(2, 64)),
                // Account has no balance.
                balances: [utils_1.fromTokenUnitAmount(0, TAKER_DECIMALS), utils_1.fromTokenUnitAmount(0, MAKER_DECIMALS)],
            },
        ],
        markets: [
            {
                token: contracts_test_utils_1.constants.NULL_ADDRESS,
                decimals: TAKER_DECIMALS,
                price: utils_1.fromTokenUnitAmount(TAKER_PRICE, PRICE_DECIMALS),
            },
            {
                token: contracts_test_utils_1.constants.NULL_ADDRESS,
                decimals: MAKER_DECIMALS,
                price: utils_1.fromTokenUnitAmount(MAKER_PRICE, PRICE_DECIMALS),
            },
        ],
    };
    var dydx;
    var testContract;
    var assetDataContract;
    var takerTokenAddress;
    var makerTokenAddress;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assetDataContract = new contracts_asset_proxy_1.IAssetDataContract(contracts_test_utils_1.constants.NULL_ADDRESS, env.provider);
                    return [4 /*yield*/, wrappers_1.TestLibDydxBalanceContract.deployWithLibrariesFrom0xArtifactAsync(artifacts_1.artifacts.TestLibDydxBalance, artifacts_1.artifacts, env.provider, env.txDefaults, {})];
                case 1:
                    testContract = _a.sent();
                    return [4 /*yield*/, testContract.createToken(TAKER_DECIMALS).callAsync()];
                case 2:
                    // Create tokens.
                    takerTokenAddress = _a.sent();
                    return [4 /*yield*/, testContract.createToken(TAKER_DECIMALS).awaitTransactionSuccessAsync()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, testContract.createToken(MAKER_DECIMALS).callAsync()];
                case 4:
                    makerTokenAddress = _a.sent();
                    return [4 /*yield*/, testContract.createToken(MAKER_DECIMALS).awaitTransactionSuccessAsync()];
                case 5:
                    _a.sent();
                    DYDX_CONFIG.markets[0].token = takerTokenAddress;
                    DYDX_CONFIG.markets[1].token = makerTokenAddress;
                    return [4 /*yield*/, wrappers_1.TestDydxContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestDydx, env.provider, env.txDefaults, {}, DYDX_CONFIG)];
                case 6:
                    dydx = _a.sent();
                    // Mint taker tokens.
                    return [4 /*yield*/, testContract
                            .setTokenBalance(takerTokenAddress, ACCOUNT_OWNER, INITIAL_TAKER_TOKEN_BALANCE)
                            .awaitTransactionSuccessAsync()];
                case 7:
                    // Mint taker tokens.
                    _a.sent();
                    // Approve the Dydx contract to spend takerToken.
                    return [4 /*yield*/, testContract
                            .setTokenApproval(takerTokenAddress, ACCOUNT_OWNER, dydx.address, contracts_test_utils_1.constants.MAX_UINT256)
                            .awaitTransactionSuccessAsync()];
                case 8:
                    // Approve the Dydx contract to spend takerToken.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    function createBalanceCheckInfo(fields) {
        if (fields === void 0) { fields = {}; }
        return __assign({ dydx: dydx.address, bridgeAddress: BRIDGE_ADDRESS, makerAddress: ACCOUNT_OWNER, makerTokenAddress: DYDX_CONFIG.markets[1].token, takerTokenAddress: DYDX_CONFIG.markets[0].token, orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(10, TAKER_DECIMALS).div(utils_1.fromTokenUnitAmount(5, MAKER_DECIMALS))), accounts: [DYDX_CONFIG.accounts[SOLVENT_ACCOUNT_IDX].accountId], actions: [] }, fields);
    }
    function getFilledAccountCollateralizations(config, checkInfo, makerAssetFillAmount) {
        var values = checkInfo.accounts.map(function (accountId, accountIdx) {
            var e_1, _a;
            var accountBalances = config.accounts[accountIdx].balances.slice();
            try {
                for (var _b = __values(checkInfo.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var action = _c.value;
                    var actionMarketId = action.marketId.toNumber();
                    var actionAccountIdx = action.accountIdx.toNumber();
                    if (checkInfo.accounts[actionAccountIdx] !== accountId) {
                        continue;
                    }
                    var rate = action.conversionRateDenominator.eq(0)
                        ? new utils_1.BigNumber(1)
                        : action.conversionRateNumerator.div(action.conversionRateDenominator);
                    var change = makerAssetFillAmount.times(action.actionType === contracts_asset_proxy_1.DydxBridgeActionType.Deposit ? rate : rate.negated());
                    accountBalances[actionMarketId] = change.plus(accountBalances[actionMarketId]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return accountBalances.map(function (b, marketId) {
                return utils_1.toTokenUnitAmount(b, config.markets[marketId].decimals).times(utils_1.toTokenUnitAmount(config.markets[marketId].price, PRICE_DECIMALS));
            });
        });
        return values
            .map(function (accountValues) {
            return [
                // supply
                utils_1.BigNumber.sum.apply(
                // supply
                utils_1.BigNumber, __spread(accountValues.filter(function (b) { return b.gte(0); }))),
                // borrow
                utils_1.BigNumber.sum.apply(utils_1.BigNumber, __spread(accountValues.filter(function (b) { return b.lt(0); }))).abs(),
            ];
        })
            .map(function (_a) {
            var _b = __read(_a, 2), supply = _b[0], borrow = _b[1];
            return supply.div(borrow);
        });
    }
    function getRandomRate() {
        return contracts_test_utils_1.getRandomFloat(0, 1);
    }
    // Computes a deposit rate that is the minimum to keep an account solvent
    // perpetually.
    function getBalancedDepositRate(withdrawRate, scaling) {
        if (scaling === void 0) { scaling = 1; }
        // Add a small amount to the margin ratio to stay just above insolvency.
        return withdrawRate.times((MAKER_PRICE / TAKER_PRICE) * (MARGIN_RATIO + 1.1e-4)).times(scaling);
    }
    function takerToMakerAmount(takerAmount) {
        return takerAmount.times(new utils_1.BigNumber(10).pow(MAKER_DECIMALS - TAKER_DECIMALS));
    }
    describe('_getSolventMakerAmount()', function () {
        it('computes fillable amount for a solvent maker', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount, cr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate, Math.random());
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        cr = getFilledAccountCollateralizations(DYDX_CONFIG, checkInfo, makerAssetFillAmount);
                        contracts_test_utils_1.expect(cr[0].dp(2)).to.bignumber.eq(MARGIN_RATIO);
                        return [2 /*return*/];
                }
            });
        }); });
        it('computes fillable amount for a solvent maker with zero-sized deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount, cr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = new utils_1.BigNumber(0);
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        cr = getFilledAccountCollateralizations(DYDX_CONFIG, checkInfo, makerAssetFillAmount);
                        contracts_test_utils_1.expect(cr[0].dp(2)).to.bignumber.eq(MARGIN_RATIO);
                        return [2 /*return*/];
                }
            });
        }); });
        it('computes fillable amount for a solvent maker with no deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, checkInfo, makerAssetFillAmount, cr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        cr = getFilledAccountCollateralizations(DYDX_CONFIG, checkInfo, makerAssetFillAmount);
                        contracts_test_utils_1.expect(cr[0].dp(2)).to.bignumber.eq(MARGIN_RATIO);
                        return [2 /*return*/];
                }
            });
        }); });
        it('computes fillable amount for a solvent maker with multiple deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount, cr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate, Math.random());
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate.times(0.75), TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate.times(0.25), TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        cr = getFilledAccountCollateralizations(DYDX_CONFIG, checkInfo, makerAssetFillAmount);
                        contracts_test_utils_1.expect(cr[0].dp(2)).to.bignumber.eq(MARGIN_RATIO);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns infinite amount for a perpetually solvent maker', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate);
                        checkInfo = createBalanceCheckInfo({
                            // Deposit/Withdraw at a rate == marginRatio.
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns infinite amount for a perpetually solvent maker with multiple deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate);
                        checkInfo = createBalanceCheckInfo({
                            // Deposit/Withdraw at a rate == marginRatio.
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate.times(0.25), TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate.times(0.75), TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not count deposits to other accounts', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate);
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate.times(0.5), TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    // Deposit enough to balance out withdraw, but
                                    // into a different account.
                                    accountIdx: new utils_1.BigNumber(1),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate.times(0.5), TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero on an account that is under-collateralized', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate);
                        checkInfo = createBalanceCheckInfo({
                            accounts: [DYDX_CONFIG.accounts[INSOLVENT_ACCOUNT_IDX].accountId],
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero on an account that has no balance if deposit ' +
            'to withdraw ratio is < the minimum collateralization rate', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate, 0.99);
                        checkInfo = createBalanceCheckInfo({
                            accounts: [DYDX_CONFIG.accounts[ZERO_BALANCE_ACCOUNT_IDX].accountId],
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns infinite on an account that has no balance if deposit ' +
            'to withdraw ratio is >= the minimum collateralization rate', function () { return __awaiter(_this, void 0, void 0, function () {
            var withdrawRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        withdrawRate = getRandomRate();
                        depositRate = getBalancedDepositRate(withdrawRate);
                        checkInfo = createBalanceCheckInfo({
                            accounts: [DYDX_CONFIG.accounts[ZERO_BALANCE_ACCOUNT_IDX].accountId],
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(withdrawRate),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getSolventMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    contracts_test_utils_1.blockchainTests.resets('_getDepositableMakerAmount()', function () {
        it('returns infinite if no deposit action', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(10, TAKER_DECIMALS).div(utils_1.fromTokenUnitAmount(100, MAKER_DECIMALS))),
                            actions: [],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns infinite if deposit rate is zero', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(10, TAKER_DECIMALS).div(utils_1.fromTokenUnitAmount(100, MAKER_DECIMALS))),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(0, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns infinite if taker tokens cover the deposit rate', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(10, TAKER_DECIMALS).div(utils_1.fromTokenUnitAmount(100, MAKER_DECIMALS))),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(Math.random() * 0.1, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns correct amount if taker tokens only partially cover deposit rate', function () { return __awaiter(_this, void 0, void 0, function () {
            var exchangeRate, depositRate, checkInfo, makerAssetFillAmount, takerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exchangeRate = 0.1;
                        depositRate = Math.random() + exchangeRate;
                        checkInfo = createBalanceCheckInfo({
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(exchangeRate, TAKER_DECIMALS).div(utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS))),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        takerAssetFillAmount = utils_1.fromTokenUnitAmount(utils_1.toTokenUnitAmount(makerAssetFillAmount, MAKER_DECIMALS)
                            // Reduce the deposit rate by the exchange rate.
                            .times(depositRate - exchangeRate), TAKER_DECIMALS);
                        // Which should equal the entire taker token balance of the account owner.
                        // We do some rounding to account for integer vs FP vs symbolic precision differences.
                        contracts_test_utils_1.expect(utils_1.toTokenUnitAmount(takerAssetFillAmount, TAKER_DECIMALS).dp(5)).to.bignumber.eq(utils_1.toTokenUnitAmount(INITIAL_TAKER_TOKEN_BALANCE, TAKER_DECIMALS).dp(5));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns correct amount if the taker asset not an ERC20', function () { return __awaiter(_this, void 0, void 0, function () {
            var depositRate, checkInfo, makerAssetFillAmount, takerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        depositRate = 0.1;
                        checkInfo = createBalanceCheckInfo({
                            // The `takerTokenAddress` will be zero if the asset is not an ERC20.
                            takerTokenAddress: contracts_test_utils_1.constants.NULL_ADDRESS,
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(0.1, MAKER_DECIMALS)),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        takerAssetFillAmount = utils_1.fromTokenUnitAmount(utils_1.toTokenUnitAmount(makerAssetFillAmount, MAKER_DECIMALS)
                            // Reduce the deposit rate by the exchange rate.
                            .times(depositRate), TAKER_DECIMALS);
                        // Which should equal the entire taker token balance of the account owner.
                        // We do some rounding to account for integer vs FP vs symbolic precision differences.
                        contracts_test_utils_1.expect(utils_1.toTokenUnitAmount(takerAssetFillAmount, TAKER_DECIMALS).dp(6)).to.bignumber.eq(utils_1.toTokenUnitAmount(INITIAL_TAKER_TOKEN_BALANCE, TAKER_DECIMALS).dp(6));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct amount if taker:maker deposit rate is 1:1 and' + 'token != taker token', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            takerTokenAddress: contracts_test_utils_1.randomAddress(),
                            // These amounts should be effectively ignored in the final computation
                            // because the token being deposited is not the taker token.
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(10, TAKER_DECIMALS).div(utils_1.fromTokenUnitAmount(100, MAKER_DECIMALS))),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(1, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(takerToMakerAmount(INITIAL_TAKER_TOKEN_BALANCE));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the smallest viable maker amount with multiple deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var exchangeRate, checkInfo, makerAssetFillAmount, depositRates, maxDepositRate, takerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exchangeRate = 0.1;
                        checkInfo = createBalanceCheckInfo({
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(exchangeRate, TAKER_DECIMALS).div(utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS))),
                            actions: [
                                // Technically, deposits of the same token are not allowed, but the
                                // check isn't done in this function so we'll do this to simulate
                                // two deposits to distinct tokens.
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(Math.random() + exchangeRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(Math.random() + exchangeRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 1:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.not.bignumber.eq(contracts_test_utils_1.constants.MAX_UINT256);
                        depositRates = checkInfo.actions.map(function (a) {
                            return utils_1.toTokenUnitAmount(a.conversionRateNumerator, TAKER_DECIMALS).div(utils_1.toTokenUnitAmount(a.conversionRateDenominator, MAKER_DECIMALS));
                        });
                        maxDepositRate = utils_1.BigNumber.max.apply(utils_1.BigNumber, __spread(depositRates));
                        takerAssetFillAmount = utils_1.fromTokenUnitAmount(utils_1.toTokenUnitAmount(makerAssetFillAmount, MAKER_DECIMALS)
                            // Reduce the deposit rate by the exchange rate.
                            .times(maxDepositRate.minus(exchangeRate)), TAKER_DECIMALS);
                        // Which should equal the entire taker token balance of the account owner.
                        // We do some rounding to account for integer vs FP vs symbolic precision differences.
                        contracts_test_utils_1.expect(utils_1.toTokenUnitAmount(takerAssetFillAmount, TAKER_DECIMALS).dp(5)).to.bignumber.eq(utils_1.toTokenUnitAmount(INITIAL_TAKER_TOKEN_BALANCE, TAKER_DECIMALS).dp(5));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero if the maker has no taker tokens and the deposit rate is' + 'greater than the exchange rate', function () { return __awaiter(_this, void 0, void 0, function () {
            var exchangeRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testContract
                            .setTokenBalance(takerTokenAddress, ACCOUNT_OWNER, contracts_test_utils_1.constants.ZERO_AMOUNT)
                            .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        exchangeRate = 0.1;
                        depositRate = Math.random() + exchangeRate;
                        checkInfo = createBalanceCheckInfo({
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(1 / exchangeRate, MAKER_DECIMALS)),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 2:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns zero if dydx has no taker token allowance and the deposit rate is' +
            'greater than the exchange rate', function () { return __awaiter(_this, void 0, void 0, function () {
            var exchangeRate, depositRate, checkInfo, makerAssetFillAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testContract
                            .setTokenApproval(takerTokenAddress, ACCOUNT_OWNER, dydx.address, contracts_test_utils_1.constants.ZERO_AMOUNT)
                            .awaitTransactionSuccessAsync()];
                    case 1:
                        _a.sent();
                        exchangeRate = 0.1;
                        depositRate = Math.random() + exchangeRate;
                        checkInfo = createBalanceCheckInfo({
                            orderMakerToTakerRate: utils_1.fromTokenUnitAmount(utils_1.fromTokenUnitAmount(1 / exchangeRate, MAKER_DECIMALS)),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: utils_1.fromTokenUnitAmount(depositRate, TAKER_DECIMALS),
                                    conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.getDepositableMakerAmount(checkInfo).callAsync()];
                    case 2:
                        makerAssetFillAmount = _a.sent();
                        contracts_test_utils_1.expect(makerAssetFillAmount).to.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('_areActionsWellFormed()', function () {
        it('Returns false if no actions', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Returns false if there is an account index out of range in deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            accounts: DYDX_CONFIG.accounts.slice(0, 2).map(function (a) { return a.accountId; }),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(2),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Returns false if a market is not unique among deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Returns false if no withdraw at the end', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Returns false if a withdraw comes before a deposit', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Returns false if more than one withdraw', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Returns false if withdraw is not for maker token', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Returns false if withdraw is for an out of range account', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            accounts: DYDX_CONFIG.accounts.slice(0, 2).map(function (a) { return a.accountId; }),
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(2),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Can return true if no deposit', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.true();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Can return true if no deposit', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.true();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Can return true with multiple deposits', function () { return __awaiter(_this, void 0, void 0, function () {
            var checkInfo, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkInfo = createBalanceCheckInfo({
                            actions: [
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(0),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                                {
                                    actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                    accountIdx: new utils_1.BigNumber(0),
                                    marketId: new utils_1.BigNumber(1),
                                    conversionRateNumerator: new utils_1.BigNumber(0),
                                    conversionRateDenominator: new utils_1.BigNumber(0),
                                },
                            ],
                        });
                        return [4 /*yield*/, testContract.areActionsWellFormed(checkInfo).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.be.true();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    function createERC20AssetData(tokenAddress) {
        return assetDataContract.ERC20Token(tokenAddress).getABIEncodedTransactionData();
    }
    function createERC721AssetData(tokenAddress, tokenId) {
        return assetDataContract.ERC721Token(tokenAddress, tokenId).getABIEncodedTransactionData();
    }
    function createBridgeAssetData(makerTokenAddress_, bridgeAddress, data) {
        if (data === void 0) { data = {}; }
        return assetDataContract
            .ERC20Bridge(makerTokenAddress_, bridgeAddress, contracts_asset_proxy_1.dydxBridgeDataEncoder.encode({
            bridgeData: __assign({ accountNumbers: DYDX_CONFIG.accounts.slice(0, 1).map(function (a) { return a.accountId; }), actions: [
                    {
                        actionType: contracts_asset_proxy_1.DydxBridgeActionType.Deposit,
                        accountIdx: new utils_1.BigNumber(0),
                        marketId: new utils_1.BigNumber(0),
                        conversionRateNumerator: utils_1.fromTokenUnitAmount(1, TAKER_DECIMALS),
                        conversionRateDenominator: utils_1.fromTokenUnitAmount(1, MAKER_DECIMALS),
                    },
                    {
                        actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                        accountIdx: new utils_1.BigNumber(0),
                        marketId: new utils_1.BigNumber(1),
                        conversionRateNumerator: new utils_1.BigNumber(0),
                        conversionRateDenominator: new utils_1.BigNumber(0),
                    },
                ] }, data),
        }))
            .getABIEncodedTransactionData();
    }
    function createOrder(orderFields) {
        if (orderFields === void 0) { orderFields = {}; }
        return __assign({ chainId: 1, exchangeAddress: contracts_test_utils_1.randomAddress(), salt: contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256), expirationTimeSeconds: contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256), feeRecipientAddress: contracts_test_utils_1.randomAddress(), makerAddress: ACCOUNT_OWNER, takerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, senderAddress: contracts_test_utils_1.constants.NULL_ADDRESS, makerFee: contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256), takerFee: contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256), makerAssetAmount: utils_1.fromTokenUnitAmount(100, MAKER_DECIMALS), takerAssetAmount: utils_1.fromTokenUnitAmount(10, TAKER_DECIMALS), makerAssetData: createBridgeAssetData(makerTokenAddress, BRIDGE_ADDRESS), takerAssetData: createERC20AssetData(takerTokenAddress), makerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, takerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES }, orderFields);
    }
    describe('getDydxMakerBalance()', function () {
        it('returns nonzero with valid order', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder();
                        return [4 /*yield*/, testContract.getDydxMakerBalance(order, dydx.address).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.not.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns nonzero with valid order with an ERC721 taker asset', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({
                            takerAssetData: createERC721AssetData(contracts_test_utils_1.randomAddress(), contracts_test_utils_1.getRandomInteger(1, contracts_test_utils_1.constants.MAX_UINT256)),
                        });
                        return [4 /*yield*/, testContract.getDydxMakerBalance(order, dydx.address).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.not.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 if bridge is not a local operator', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({
                            makerAssetData: createBridgeAssetData(ACCOUNT_OWNER, contracts_test_utils_1.randomAddress()),
                        });
                        return [4 /*yield*/, testContract.getDydxMakerBalance(order, dydx.address).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 if bridge data does not have well-formed actions', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({
                            makerAssetData: createBridgeAssetData(takerTokenAddress, BRIDGE_ADDRESS, {
                                // Two withdraw actions is invalid.
                                actions: [
                                    {
                                        actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                        accountIdx: new utils_1.BigNumber(0),
                                        marketId: new utils_1.BigNumber(0),
                                        conversionRateNumerator: new utils_1.BigNumber(0),
                                        conversionRateDenominator: new utils_1.BigNumber(0),
                                    },
                                    {
                                        actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                        accountIdx: new utils_1.BigNumber(0),
                                        marketId: new utils_1.BigNumber(1),
                                        conversionRateNumerator: new utils_1.BigNumber(0),
                                        conversionRateDenominator: new utils_1.BigNumber(0),
                                    },
                                ],
                            }),
                        });
                        return [4 /*yield*/, testContract.getDydxMakerBalance(order, dydx.address).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 if the maker token withdraw rate is < 1', function () { return __awaiter(_this, void 0, void 0, function () {
            var order, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = createOrder({
                            makerAssetData: createBridgeAssetData(takerTokenAddress, BRIDGE_ADDRESS, {
                                actions: [
                                    {
                                        actionType: contracts_asset_proxy_1.DydxBridgeActionType.Withdraw,
                                        accountIdx: new utils_1.BigNumber(0),
                                        marketId: new utils_1.BigNumber(1),
                                        conversionRateNumerator: new utils_1.BigNumber(0.99e18),
                                        conversionRateDenominator: new utils_1.BigNumber(1e18),
                                    },
                                ],
                            }),
                        });
                        return [4 /*yield*/, testContract.getDydxMakerBalance(order, dydx.address).callAsync()];
                    case 1:
                        r = _a.sent();
                        contracts_test_utils_1.expect(r).to.bignumber.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=lib_dydx_balance_test.js.map