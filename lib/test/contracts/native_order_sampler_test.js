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
const contracts_erc20_1 = require("@0x/contracts-erc20");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const utils_1 = require("@0x/utils");
const artifacts_1 = require("../artifacts");
const wrappers_1 = require("../wrappers");
const { NULL_BYTES, ZERO_AMOUNT } = contracts_test_utils_1.constants;
// tslint:disable: custom-no-magic-numbers
contracts_test_utils_1.blockchainTests.resets('NativeOrderSampler contract', env => {
    let testContract;
    let makerToken;
    let takerToken;
    let feeToken;
    let erc20Proxy;
    const ERC20_PROXY_ID = '0xf47261b0';
    const VALID_SIGNATURE = '0x01';
    const INVALID_SIGNATURE = '0x00';
    before(() => __awaiter(this, void 0, void 0, function* () {
        testContract = yield wrappers_1.TestNativeOrderSamplerContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestNativeOrderSampler, env.provider, env.txDefaults, {});
        erc20Proxy = yield testContract.getAssetProxy(ERC20_PROXY_ID).callAsync();
        const NUM_TOKENS = new utils_1.BigNumber(3);
        [makerToken, takerToken, feeToken] = yield testContract.createTokens(NUM_TOKENS).callAsync();
        yield testContract.createTokens(NUM_TOKENS).awaitTransactionSuccessAsync();
    }));
    function getPackedHash(...args) {
        return utils_1.hexUtils.hash(utils_1.hexUtils.concat(...args.map(a => utils_1.hexUtils.toHex(a))));
    }
    function getOrderInfo(order) {
        const hash = getPackedHash(utils_1.hexUtils.leftPad(order.salt));
        const orderStatus = order.salt.mod(255).eq(0) ? 3 : 5;
        const filledAmount = order.expirationTimeSeconds;
        return {
            orderStatus,
            orderHash: hash,
            orderTakerAssetFilledAmount: filledAmount,
        };
    }
    function createFillableOrderSalt() {
        return new utils_1.BigNumber(utils_1.hexUtils.concat(utils_1.hexUtils.slice(utils_1.hexUtils.random(), 0, -1), '0x01'));
    }
    function createUnfillableOrderSalt() {
        return new utils_1.BigNumber(utils_1.hexUtils.concat(utils_1.hexUtils.slice(utils_1.hexUtils.random(), 0, -1), '0xff'));
    }
    function getOrderFillableTakerAmount(order) {
        return order.takerAssetAmount.minus(getOrderInfo(order).orderTakerAssetFilledAmount);
    }
    function getERC20AssetData(tokenAddress) {
        return utils_1.hexUtils.concat(ERC20_PROXY_ID, utils_1.hexUtils.leftPad(tokenAddress));
    }
    function createOrder(fields = {}, filledTakerAssetAmount = ZERO_AMOUNT) {
        return Object.assign({ chainId: 1337, exchangeAddress: contracts_test_utils_1.randomAddress(), makerAddress: contracts_test_utils_1.randomAddress(), takerAddress: contracts_test_utils_1.randomAddress(), senderAddress: contracts_test_utils_1.randomAddress(), feeRecipientAddress: contracts_test_utils_1.randomAddress(), makerAssetAmount: contracts_test_utils_1.getRandomInteger(1e18, 10e18), takerAssetAmount: contracts_test_utils_1.getRandomInteger(1e18, 10e18), makerFee: contracts_test_utils_1.getRandomInteger(1e18, 10e18), takerFee: contracts_test_utils_1.getRandomInteger(1e18, 10e18), makerAssetData: getERC20AssetData(makerToken), takerAssetData: getERC20AssetData(takerToken), makerFeeAssetData: getERC20AssetData(feeToken), takerFeeAssetData: getERC20AssetData(contracts_test_utils_1.randomAddress()), salt: createFillableOrderSalt(), 
            // Expiration time will be used to determine filled amount.
            expirationTimeSeconds: filledTakerAssetAmount }, fields);
    }
    function fundMakerAsync(order, assetData, balanceScaling = 1, allowanceScaling = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let token;
            let amount;
            if (assetData === order.makerAssetData) {
                token = makerToken;
                amount =
                    order.makerAssetData === order.makerFeeAssetData
                        ? order.makerAssetAmount.plus(order.makerFee)
                        : order.makerAssetAmount;
            }
            else {
                token = feeToken;
                amount = order.makerFee;
            }
            amount = amount.times(getOrderFillableTakerAmount(order).div(utils_1.BigNumber.max(1, order.takerAssetAmount)));
            yield testContract
                .setTokenBalanceAndAllowance(token, order.makerAddress, erc20Proxy, amount.times(balanceScaling).integerValue(), amount.times(allowanceScaling).integerValue())
                .awaitTransactionSuccessAsync();
        });
    }
    describe('getTokenDecimals()', () => {
        it('correctly returns the token balances', () => __awaiter(this, void 0, void 0, function* () {
            const newMakerToken = yield contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, env.provider, env.txDefaults, artifacts_1.artifacts, contracts_test_utils_1.constants.DUMMY_TOKEN_NAME, contracts_test_utils_1.constants.DUMMY_TOKEN_SYMBOL, new utils_1.BigNumber(18), contracts_test_utils_1.constants.DUMMY_TOKEN_TOTAL_SUPPLY);
            const newTakerToken = yield contracts_erc20_1.DummyERC20TokenContract.deployFrom0xArtifactAsync(contracts_erc20_1.artifacts.DummyERC20Token, env.provider, env.txDefaults, artifacts_1.artifacts, contracts_test_utils_1.constants.DUMMY_TOKEN_NAME, contracts_test_utils_1.constants.DUMMY_TOKEN_SYMBOL, new utils_1.BigNumber(6), contracts_test_utils_1.constants.DUMMY_TOKEN_TOTAL_SUPPLY);
            const [makerDecimals, takerDecimals] = yield testContract
                .getTokenDecimals(newMakerToken.address, newTakerToken.address)
                .callAsync();
            contracts_test_utils_1.expect(makerDecimals.toString()).to.eql('18');
            contracts_test_utils_1.expect(takerDecimals.toString()).to.eql('6');
        }));
    });
    describe('getOrderFillableTakerAmount()', () => {
        it('returns the full amount for a fully funded order', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder();
            const expected = getOrderFillableTakerAmount(order);
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
        }));
        it('returns the full amount for a fully funded order without maker fees', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder({ makerFee: ZERO_AMOUNT });
            const expected = getOrderFillableTakerAmount(order);
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
        }));
        it('returns the full amount for a fully funded order without maker fee asset data', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder({ makerFeeAssetData: NULL_BYTES });
            const expected = getOrderFillableTakerAmount(order);
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
        }));
        it('returns the full amount for a fully funded order with maker fees denominated in the maker asset', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder({ makerFeeAssetData: getERC20AssetData(makerToken) });
            const expected = getOrderFillableTakerAmount(order);
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(actual).to.bignumber.eq(expected);
        }));
        it('returns partial amount with insufficient maker asset balance', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder();
            const expected = getOrderFillableTakerAmount(order)
                .times(0.5)
                .integerValue(utils_1.BigNumber.ROUND_DOWN);
            yield fundMakerAsync(order, order.makerAssetData, 0.5);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
        }));
        it('returns partial amount with insufficient maker asset allowance', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder();
            const expected = getOrderFillableTakerAmount(order)
                .times(0.5)
                .integerValue(utils_1.BigNumber.ROUND_DOWN);
            yield fundMakerAsync(order, order.makerAssetData, 1, 0.5);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
        }));
        it('returns partial amount with insufficient maker fee asset balance', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder();
            const expected = getOrderFillableTakerAmount(order)
                .times(0.5)
                .integerValue(utils_1.BigNumber.ROUND_DOWN);
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData, 0.5);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
        }));
        it('returns partial amount with insufficient maker fee asset allowance', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder();
            const expected = getOrderFillableTakerAmount(order)
                .times(0.5)
                .integerValue(utils_1.BigNumber.ROUND_DOWN);
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData, 1, 0.5);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
        }));
        it('returns partial amount with insufficient maker asset balance (maker asset fees)', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder({ makerFeeAssetData: getERC20AssetData(makerToken) });
            const expected = getOrderFillableTakerAmount(order)
                .times(0.5)
                .integerValue(utils_1.BigNumber.ROUND_DOWN);
            yield fundMakerAsync(order, order.makerAssetData, 0.5);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
        }));
        it('returns partial amount with insufficient maker asset allowance (maker asset fees)', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder({ makerFeeAssetData: getERC20AssetData(makerToken) });
            const expected = getOrderFillableTakerAmount(order)
                .times(0.5)
                .integerValue(utils_1.BigNumber.ROUND_DOWN);
            yield fundMakerAsync(order, order.makerAssetData, 1, 0.5);
            const actual = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.assertIntegerRoughlyEquals(actual, expected, 100);
        }));
        it('returns zero for an that is not fillable', () => __awaiter(this, void 0, void 0, function* () {
            const order = Object.assign({}, createOrder(), { salt: createUnfillableOrderSalt() });
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const fillableTakerAmount = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
        }));
        it('returns zero for an order with zero maker asset amount', () => __awaiter(this, void 0, void 0, function* () {
            const order = Object.assign({}, createOrder(), { makerAssetAmount: ZERO_AMOUNT });
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const fillableTakerAmount = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
        }));
        it('returns zero for an order with zero taker asset amount', () => __awaiter(this, void 0, void 0, function* () {
            const order = Object.assign({}, createOrder(), { takerAssetAmount: ZERO_AMOUNT });
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const fillableTakerAmount = yield testContract
                .getOrderFillableTakerAmount(order, VALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
        }));
        it('returns zero for an order with an empty signature', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder();
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const fillableTakerAmount = yield testContract
                .getOrderFillableTakerAmount(order, NULL_BYTES, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
        }));
        it('returns zero for an order with an invalid signature', () => __awaiter(this, void 0, void 0, function* () {
            const order = createOrder();
            yield fundMakerAsync(order, order.makerAssetData);
            yield fundMakerAsync(order, order.makerFeeAssetData);
            const fillableTakerAmount = yield testContract
                .getOrderFillableTakerAmount(order, INVALID_SIGNATURE, testContract.address)
                .callAsync();
            contracts_test_utils_1.expect(fillableTakerAmount).to.bignumber.eq(ZERO_AMOUNT);
        }));
    });
});
//# sourceMappingURL=native_order_sampler_test.js.map