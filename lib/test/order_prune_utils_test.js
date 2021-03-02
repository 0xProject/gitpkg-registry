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
const types_1 = require("../src/types");
const order_prune_utils_1 = require("../src/utils/order_prune_utils");
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
const EXPIRY_BUFFER_MS = 120000;
// tslint:disable: no-unused-expression
// tslint:disable: custom-no-magic-numbers
describe('orderPrunerUtils', () => {
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
    let nonOpenSignedOrder;
    let expiredOpenSignedOrder;
    let partiallyFilledOpenSignedOrderFeeless;
    let partiallyFilledOpenSignedOrderFeeInTakerAsset;
    let partiallyFilledOpenSignedOrderFeeInMakerAsset;
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
        nonOpenSignedOrder = yield orderFactory.newSignedOrderAsync({
            takerAddress,
        });
        expiredOpenSignedOrder = yield orderFactory.newSignedOrderAsync({
            expirationTimeSeconds: new utils_1.BigNumber(yield contracts_test_utils_1.getLatestBlockTimestampAsync()).plus(60000),
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
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    describe('prunedForUsableSignedOrders', () => {
        it('should filter for only feeless orders if options permit only feeless orders', () => __awaiter(this, void 0, void 0, function* () {
            const permittedOrderFeeTypes = new Set([types_1.OrderPrunerPermittedFeeTypes.NoFees]);
            const orders = [
                partiallyFilledOpenSignedOrderFeeInMakerAsset,
                partiallyFilledOpenSignedOrderFeeInTakerAsset,
                partiallyFilledOpenSignedOrderFeeless,
            ];
            const resultPrunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, permittedOrderFeeTypes, EXPIRY_BUFFER_MS);
            // checks for one order in results and check for signature of orders
            expect(resultPrunedOrders.length).to.be.equal(1);
            expect(resultPrunedOrders[0].signature).to.be.deep.equal(partiallyFilledOpenSignedOrderFeeless.signature);
        }));
        it('should filter for only takerFee in takerAsset orders if options permit only takerFee in takerAsset orders', () => __awaiter(this, void 0, void 0, function* () {
            const permittedOrderFeeTypes = new Set([
                types_1.OrderPrunerPermittedFeeTypes.TakerDenominatedTakerFee,
            ]);
            const orders = [
                partiallyFilledOpenSignedOrderFeeInMakerAsset,
                partiallyFilledOpenSignedOrderFeeInTakerAsset,
                partiallyFilledOpenSignedOrderFeeless,
            ];
            const resultPrunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, permittedOrderFeeTypes, EXPIRY_BUFFER_MS);
            // checks for one order in results and check for signature of orders
            expect(resultPrunedOrders.length).to.be.equal(1);
            expect(resultPrunedOrders[0].signature).to.be.deep.equal(partiallyFilledOpenSignedOrderFeeInTakerAsset.signature);
        }));
        it('should filter for only makerFee in takerAsset orders if options permit only makerFee orders', () => __awaiter(this, void 0, void 0, function* () {
            const permittedOrderFeeTypes = new Set([
                types_1.OrderPrunerPermittedFeeTypes.MakerDenominatedTakerFee,
            ]);
            const orders = [
                partiallyFilledOpenSignedOrderFeeInMakerAsset,
                partiallyFilledOpenSignedOrderFeeInTakerAsset,
                partiallyFilledOpenSignedOrderFeeless,
            ];
            const resultPrunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, permittedOrderFeeTypes, EXPIRY_BUFFER_MS);
            // checks for one order in results and check for signature of orders
            expect(resultPrunedOrders.length).to.be.equal(1);
            expect(resultPrunedOrders[0].signature).to.be.deep.equal(partiallyFilledOpenSignedOrderFeeInMakerAsset.signature);
        }));
        it('should filter out non open orders', () => __awaiter(this, void 0, void 0, function* () {
            const permittedOrderFeeTypes = new Set([
                types_1.OrderPrunerPermittedFeeTypes.MakerDenominatedTakerFee,
                types_1.OrderPrunerPermittedFeeTypes.NoFees,
                types_1.OrderPrunerPermittedFeeTypes.TakerDenominatedTakerFee,
            ]);
            const orders = [nonOpenSignedOrder];
            const resultPrunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, permittedOrderFeeTypes, EXPIRY_BUFFER_MS);
            expect(resultPrunedOrders).to.be.empty;
        }));
        it('should filter out expired orders', () => __awaiter(this, void 0, void 0, function* () {
            const permittedOrderFeeTypes = new Set([
                types_1.OrderPrunerPermittedFeeTypes.MakerDenominatedTakerFee,
                types_1.OrderPrunerPermittedFeeTypes.NoFees,
                types_1.OrderPrunerPermittedFeeTypes.TakerDenominatedTakerFee,
            ]);
            const orders = [expiredOpenSignedOrder];
            const resultPrunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, permittedOrderFeeTypes, EXPIRY_BUFFER_MS);
            expect(resultPrunedOrders).to.be.empty;
        }));
    });
});
//# sourceMappingURL=order_prune_utils_test.js.map