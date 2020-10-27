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
const contract_wrappers_1 = require("@0x/contract-wrappers");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const dev_utils_1 = require("@0x/dev-utils");
const migrations_1 = require("@0x/migrations");
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const chai = require("chai");
require("mocha");
const constants_1 = require("../src/constants");
const order_state_utils_1 = require("../src/utils/order_state_utils");
const chai_setup_1 = require("./utils/chai_setup");
const web3_wrapper_1 = require("./utils/web3_wrapper");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(web3_wrapper_1.web3Wrapper);
const ONE_ETH_IN_WEI = new utils_1.BigNumber(1000000000000000000);
const TESTRPC_CHAIN_ID = contracts_test_utils_1.constants.TESTRPC_CHAIN_ID;
const GAS_PRICE = new utils_1.BigNumber(contracts_test_utils_1.constants.DEFAULT_GAS_PRICE);
const PROTOCOL_FEE_MULTIPLIER = 70000;
const PROTOCOL_FEE_PER_FILL = GAS_PRICE.times(PROTOCOL_FEE_MULTIPLIER);
const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new utils_1.BigNumber(2).pow(256).minus(1); // tslint:disable-line:custom-no-magic-numbers
const isSignedOrdersWithFillableAmountsNotFillable = (signedOrders) => {
    signedOrders.forEach(order => {
        expect(order.fillableMakerAssetAmount).to.bignumber.eq(constants_1.constants.ZERO_AMOUNT);
        expect(order.fillableTakerAssetAmount).to.bignumber.eq(constants_1.constants.ZERO_AMOUNT);
        expect(order.fillableTakerFeeAmount).to.bignumber.eq(constants_1.constants.ZERO_AMOUNT);
    });
};
// tslint:disable: no-unused-expression
// tslint:disable: custom-no-magic-numbers
describe('OrderStateUtils', () => {
    let erc20MakerTokenContract;
    let erc20TakerTokenContract;
    let exchangeContract;
    let userAddresses;
    let coinbaseAddress;
    let makerAddress;
    let takerAddress;
    let feeRecipient;
    let makerTokenAddress;
    let takerTokenAddress;
    let makerAssetData;
    let takerAssetData;
    let orderFactory;
    let contractAddresses;
    let orderStateUtils;
    let expiredOpenSignedOrder;
    let invalidSignatureOpenSignedOrder;
    let fullyFillableOpenSignedOrder;
    let partiallyFilledOpenSignedOrderFeeless;
    let partiallyFilledOpenSignedOrderFeeInTakerAsset;
    let partiallyFilledOpenSignedOrderFeeInMakerAsset;
    let filledOpenSignedOrder;
    const chainId = TESTRPC_CHAIN_ID;
    const fillableAmount = new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI);
    const partialFillAmount = new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI);
    const takerFeeAmount = new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI);
    before(() => __awaiter(this, void 0, void 0, function* () {
        contractAddresses = yield migrations_1.migrateOnceAsync(web3_wrapper_1.provider);
        yield blockchainLifecycle.startAsync();
        userAddresses = yield web3_wrapper_1.web3Wrapper.getAvailableAddressesAsync();
        [coinbaseAddress, takerAddress, makerAddress, feeRecipient] = userAddresses;
        [makerTokenAddress, takerTokenAddress] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
        erc20MakerTokenContract = new contract_wrappers_1.ERC20TokenContract(makerTokenAddress, web3_wrapper_1.provider);
        erc20TakerTokenContract = new contract_wrappers_1.ERC20TokenContract(takerTokenAddress, web3_wrapper_1.provider);
        exchangeContract = new contract_wrappers_1.ExchangeContract(contractAddresses.exchange, web3_wrapper_1.provider);
        [makerAssetData, takerAssetData] = [
            order_utils_1.assetDataUtils.encodeERC20AssetData(makerTokenAddress),
            order_utils_1.assetDataUtils.encodeERC20AssetData(takerTokenAddress),
        ];
        // Configure order defaults
        const defaultOrderParams = Object.assign({}, contracts_test_utils_1.constants.STATIC_ORDER_PARAMS, { makerAddress, takerAddress: constants_1.constants.NULL_ADDRESS, makerAssetData,
            takerAssetData, makerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, takerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, makerFee: constants_1.constants.ZERO_AMOUNT, takerFee: constants_1.constants.ZERO_AMOUNT, feeRecipientAddress: feeRecipient, exchangeAddress: contractAddresses.exchange, chainId });
        const privateKey = contracts_test_utils_1.constants.TESTRPC_PRIVATE_KEYS[userAddresses.indexOf(makerAddress)];
        orderFactory = new contracts_test_utils_1.OrderFactory(privateKey, defaultOrderParams);
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.startAsync();
        expiredOpenSignedOrder = yield orderFactory.newSignedOrderAsync({
            expirationTimeSeconds: new utils_1.BigNumber(yield contracts_test_utils_1.getLatestBlockTimestampAsync()).minus(10),
        });
        invalidSignatureOpenSignedOrder = yield orderFactory.newSignedOrderAsync({
            takerAddress,
        });
        invalidSignatureOpenSignedOrder.signature = expiredOpenSignedOrder.signature;
        fullyFillableOpenSignedOrder = yield orderFactory.newSignedOrderAsync({
            takerAssetAmount: fillableAmount,
            makerAssetAmount: fillableAmount,
        });
        // give double fillableAmount to maker and taker as buffer
        yield erc20MakerTokenContract
            .transfer(makerAddress, fillableAmount.multipliedBy(4))
            .sendTransactionAsync({ from: coinbaseAddress });
        yield erc20TakerTokenContract
            .transfer(takerAddress, fillableAmount.multipliedBy(4))
            .sendTransactionAsync({ from: coinbaseAddress });
        yield erc20MakerTokenContract
            .approve(contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
            .sendTransactionAsync({ from: makerAddress });
        yield erc20MakerTokenContract
            .approve(contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
            .sendTransactionAsync({ from: takerAddress });
        yield erc20TakerTokenContract
            .approve(contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
            .sendTransactionAsync({ from: takerAddress });
        partiallyFilledOpenSignedOrderFeeless = yield orderFactory.newSignedOrderAsync({
            takerAssetAmount: fillableAmount,
            makerAssetAmount: fillableAmount,
        });
        yield exchangeContract
            .fillOrKillOrder(partiallyFilledOpenSignedOrderFeeless, partialFillAmount, partiallyFilledOpenSignedOrderFeeless.signature)
            .sendTransactionAsync({
            from: takerAddress,
            gasPrice: GAS_PRICE,
            gas: 4000000,
            value: PROTOCOL_FEE_PER_FILL,
        });
        partiallyFilledOpenSignedOrderFeeInTakerAsset = yield orderFactory.newSignedOrderAsync({
            takerAssetAmount: fillableAmount,
            makerAssetAmount: fillableAmount,
            takerFee: takerFeeAmount,
            takerFeeAssetData: takerAssetData,
        });
        yield exchangeContract
            .fillOrKillOrder(partiallyFilledOpenSignedOrderFeeInTakerAsset, partialFillAmount, partiallyFilledOpenSignedOrderFeeInTakerAsset.signature)
            .sendTransactionAsync({
            from: takerAddress,
            gasPrice: GAS_PRICE,
            gas: 4000000,
            value: PROTOCOL_FEE_PER_FILL,
        });
        partiallyFilledOpenSignedOrderFeeInMakerAsset = yield orderFactory.newSignedOrderAsync({
            takerAssetAmount: fillableAmount,
            makerAssetAmount: fillableAmount,
            takerFee: takerFeeAmount,
            takerFeeAssetData: makerAssetData,
        });
        yield exchangeContract
            .fillOrKillOrder(partiallyFilledOpenSignedOrderFeeInMakerAsset, partialFillAmount, partiallyFilledOpenSignedOrderFeeInMakerAsset.signature)
            .sendTransactionAsync({
            from: takerAddress,
            gasPrice: GAS_PRICE,
            gas: 4000000,
            value: PROTOCOL_FEE_PER_FILL,
        });
        filledOpenSignedOrder = yield orderFactory.newSignedOrderAsync({
            takerAssetAmount: fillableAmount,
            makerAssetAmount: fillableAmount,
        });
        yield exchangeContract
            .fillOrKillOrder(filledOpenSignedOrder, fillableAmount, filledOpenSignedOrder.signature)
            .sendTransactionAsync({
            from: takerAddress,
            gasPrice: GAS_PRICE,
            gas: 4000000,
            value: PROTOCOL_FEE_PER_FILL,
        });
        orderStateUtils = new order_state_utils_1.OrderStateUtils(new contract_wrappers_1.DevUtilsContract(contractAddresses.devUtils, web3_wrapper_1.provider));
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    describe('#getSignedOrdersWithFillableAmountsAsync', () => {
        it('should 0 fillableTakerAssetAmount for expired orders', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [expiredOpenSignedOrder];
            const resultOrders = yield orderStateUtils.getSignedOrdersWithFillableAmountsAsync(orders);
            isSignedOrdersWithFillableAmountsNotFillable(resultOrders);
        }));
        it('should filter out invalid signature orders', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [invalidSignatureOpenSignedOrder];
            const resultOrders = yield orderStateUtils.getSignedOrdersWithFillableAmountsAsync(orders);
            isSignedOrdersWithFillableAmountsNotFillable(resultOrders);
        }));
        it('should return 0 fillableTakerAssetAmount for fully filled orders', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [filledOpenSignedOrder];
            const resultOrders = yield orderStateUtils.getSignedOrdersWithFillableAmountsAsync(orders);
            isSignedOrdersWithFillableAmountsNotFillable(resultOrders);
        }));
        it('should provide correct pruned signed orders for fully fillable orders', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [fullyFillableOpenSignedOrder];
            const resultOrders = yield orderStateUtils.getSignedOrdersWithFillableAmountsAsync(orders);
            const order = resultOrders[0];
            expect(order.fillableMakerAssetAmount).to.bignumber.equal(fillableAmount);
            expect(order.fillableTakerAssetAmount).to.bignumber.equal(fillableAmount);
        }));
        it('should provide correct pruned signed orders for partially fillable orders', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [
                partiallyFilledOpenSignedOrderFeeless,
                partiallyFilledOpenSignedOrderFeeInTakerAsset,
                partiallyFilledOpenSignedOrderFeeInMakerAsset,
            ];
            const resultOrders = yield orderStateUtils.getSignedOrdersWithFillableAmountsAsync(orders);
            expect(resultOrders[0].fillableMakerAssetAmount).to.bignumber.equal(fillableAmount.minus(partialFillAmount));
            expect(resultOrders[0].fillableTakerAssetAmount).to.bignumber.equal(fillableAmount.minus(partialFillAmount));
            expect(resultOrders[1].fillableMakerAssetAmount).to.bignumber.equal(fillableAmount.minus(partialFillAmount));
            expect(resultOrders[1].fillableTakerAssetAmount).to.bignumber.equal(fillableAmount.minus(partialFillAmount));
            expect(resultOrders[1].fillableTakerFeeAmount).to.bignumber.equal(new utils_1.BigNumber(1.6).multipliedBy(ONE_ETH_IN_WEI));
            expect(resultOrders[2].fillableMakerAssetAmount).to.bignumber.equal(fillableAmount.minus(partialFillAmount));
            expect(resultOrders[2].fillableTakerAssetAmount).to.bignumber.equal(fillableAmount.minus(partialFillAmount));
            expect(resultOrders[2].fillableTakerFeeAmount).to.bignumber.equal(new utils_1.BigNumber(1.6).multipliedBy(ONE_ETH_IN_WEI));
        }));
    });
});
//# sourceMappingURL=order_state_utils_test.js.map