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
const src_1 = require("../src");
const constants_1 = require("../src/constants");
const types_1 = require("../src/types");
const chai_setup_1 = require("./utils/chai_setup");
const swap_quote_1 = require("./utils/swap_quote");
const web3_wrapper_1 = require("./utils/web3_wrapper");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(web3_wrapper_1.web3Wrapper);
const ONE_ETH_IN_WEI = new utils_1.BigNumber(1000000000000000000);
const TESTRPC_CHAIN_ID = 1337;
const GAS_PRICE = new utils_1.BigNumber(contracts_test_utils_1.constants.DEFAULT_GAS_PRICE);
const PARTIAL_PRUNED_SIGNED_ORDERS = [
    {
        takerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
    },
];
const PARTIAL_LARGE_PRUNED_SIGNED_ORDERS = [
    {
        takerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI),
    },
];
describe('swapQuoteConsumerUtils', () => {
    let wethContract;
    let userAddresses;
    let makerAddress;
    let takerAddress;
    let makerTokenAddress;
    let takerTokenAddress;
    let makerAssetData;
    let takerAssetData;
    let wethAssetData;
    let contractAddresses;
    let swapQuoteConsumer;
    let orderFactory;
    let forwarderOrderFactory;
    const chainId = TESTRPC_CHAIN_ID;
    before(() => __awaiter(this, void 0, void 0, function* () {
        contractAddresses = yield migrations_1.migrateOnceAsync(web3_wrapper_1.provider);
        yield blockchainLifecycle.startAsync();
        userAddresses = yield web3_wrapper_1.web3Wrapper.getAvailableAddressesAsync();
        wethContract = new contract_wrappers_1.WETH9Contract(contractAddresses.etherToken, web3_wrapper_1.provider);
        [takerAddress, makerAddress] = userAddresses;
        [makerTokenAddress, takerTokenAddress] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
        [makerAssetData, takerAssetData, wethAssetData] = [
            order_utils_1.assetDataUtils.encodeERC20AssetData(makerTokenAddress),
            order_utils_1.assetDataUtils.encodeERC20AssetData(takerTokenAddress),
            order_utils_1.assetDataUtils.encodeERC20AssetData(contractAddresses.etherToken),
        ];
        const defaultOrderParams = Object.assign({}, contracts_test_utils_1.constants.STATIC_ORDER_PARAMS, { makerAddress, takerAddress: constants_1.constants.NULL_ADDRESS, makerAssetData,
            takerAssetData, makerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, takerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, makerFee: constants_1.constants.ZERO_AMOUNT, takerFee: constants_1.constants.ZERO_AMOUNT, feeRecipientAddress: constants_1.constants.NULL_ADDRESS, exchangeAddress: contractAddresses.exchange, chainId });
        const defaultForwarderOrderParams = Object.assign({}, defaultOrderParams, {
            takerAssetData: wethAssetData,
        });
        const privateKey = contracts_test_utils_1.constants.TESTRPC_PRIVATE_KEYS[userAddresses.indexOf(makerAddress)];
        orderFactory = new contracts_test_utils_1.OrderFactory(privateKey, defaultOrderParams);
        forwarderOrderFactory = new contracts_test_utils_1.OrderFactory(privateKey, defaultForwarderOrderParams);
        swapQuoteConsumer = new src_1.SwapQuoteConsumer(web3_wrapper_1.provider, {
            chainId,
            contractAddresses,
        });
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.startAsync();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    describe('getConsumerTypeForSwapQuoteAsync', () => {
        let forwarderOrders;
        let exchangeOrders;
        let largeForwarderOrders;
        let forwarderSwapQuote;
        let exchangeSwapQuote;
        let largeForwarderSwapQuote;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            exchangeOrders = [];
            for (const partialOrder of PARTIAL_PRUNED_SIGNED_ORDERS) {
                const order = yield orderFactory.newSignedOrderAsync(partialOrder);
                const prunedOrder = Object.assign({}, order, partialOrder);
                exchangeOrders.push(prunedOrder);
            }
            forwarderOrders = [];
            for (const partialOrder of PARTIAL_PRUNED_SIGNED_ORDERS) {
                const order = yield forwarderOrderFactory.newSignedOrderAsync(partialOrder);
                const prunedOrder = Object.assign({}, order, partialOrder);
                forwarderOrders.push(prunedOrder);
            }
            largeForwarderOrders = [];
            for (const partialOrder of PARTIAL_LARGE_PRUNED_SIGNED_ORDERS) {
                const order = yield forwarderOrderFactory.newSignedOrderAsync(partialOrder);
                const prunedOrder = Object.assign({}, order, partialOrder);
                largeForwarderOrders.push(prunedOrder);
            }
            forwarderSwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, wethAssetData, forwarderOrders, types_1.MarketOperation.Sell, GAS_PRICE);
            largeForwarderSwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, wethAssetData, largeForwarderOrders, types_1.MarketOperation.Sell, GAS_PRICE);
            exchangeSwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, takerAssetData, exchangeOrders, types_1.MarketOperation.Sell, GAS_PRICE);
        }));
        it('should return exchange consumer if takerAsset is not wEth', () => __awaiter(this, void 0, void 0, function* () {
            const extensionContractType = yield swapQuoteConsumer.getOptimalExtensionContractTypeAsync(exchangeSwapQuote, { takerAddress });
            expect(extensionContractType).to.equal(types_1.ExtensionContractType.None);
        }));
        it('should return forwarder consumer if takerAsset is wEth and have enough eth balance', () => __awaiter(this, void 0, void 0, function* () {
            const extensionContractType = yield swapQuoteConsumer.getOptimalExtensionContractTypeAsync(forwarderSwapQuote, { takerAddress });
            expect(extensionContractType).to.equal(types_1.ExtensionContractType.Forwarder);
        }));
        it('should return exchange consumer if takerAsset is wEth and taker has enough weth', () => __awaiter(this, void 0, void 0, function* () {
            const etherInWei = new utils_1.BigNumber(20).multipliedBy(ONE_ETH_IN_WEI);
            yield wethContract.deposit().sendTransactionAsync({ value: etherInWei, from: takerAddress });
            const extensionContractType = yield swapQuoteConsumer.getOptimalExtensionContractTypeAsync(forwarderSwapQuote, { takerAddress });
            expect(extensionContractType).to.equal(types_1.ExtensionContractType.None);
        }));
        it('should return forwarder consumer if takerAsset is wEth and takerAddress has no available balance in either weth or eth (defaulting behavior)', () => __awaiter(this, void 0, void 0, function* () {
            const etherInWei = new utils_1.BigNumber(50).multipliedBy(ONE_ETH_IN_WEI);
            yield wethContract.deposit().sendTransactionAsync({ value: etherInWei, from: takerAddress });
            const extensionContractType = yield swapQuoteConsumer.getOptimalExtensionContractTypeAsync(largeForwarderSwapQuote, { takerAddress });
            expect(extensionContractType).to.equal(types_1.ExtensionContractType.Forwarder);
        }));
    });
});
//# sourceMappingURL=swap_quote_consumer_utils_test.js.map