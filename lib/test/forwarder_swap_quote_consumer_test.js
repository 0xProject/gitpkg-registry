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
const forwarder_swap_quote_consumer_1 = require("../src/quote_consumers/forwarder_swap_quote_consumer");
const types_1 = require("../src/types");
const chai_setup_1 = require("./utils/chai_setup");
const swap_quote_1 = require("./utils/swap_quote");
const web3_wrapper_1 = require("./utils/web3_wrapper");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(web3_wrapper_1.web3Wrapper);
const GAS_PRICE = new utils_1.BigNumber(contracts_test_utils_1.constants.DEFAULT_GAS_PRICE);
const ONE_ETH_IN_WEI = new utils_1.BigNumber(1000000000000000000);
const TESTRPC_CHAIN_ID = contracts_test_utils_1.constants.TESTRPC_CHAIN_ID;
const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new utils_1.BigNumber(2).pow(256).minus(1); // tslint:disable-line:custom-no-magic-numbers
const FEE_PERCENTAGE = 0.05;
const PARTIAL_PRUNED_SIGNED_ORDERS_FEELESS = [
    {
        takerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(1).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(1).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(1).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(1).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
    },
];
const expectMakerAndTakerBalancesAsyncFactory = (erc20TokenContract, makerAddress, takerAddress) => (expectedMakerBalance, expectedTakerBalance) => __awaiter(this, void 0, void 0, function* () {
    const makerBalance = yield erc20TokenContract.balanceOf(makerAddress).callAsync();
    const takerBalance = yield erc20TokenContract.balanceOf(takerAddress).callAsync();
    expect(makerBalance).to.bignumber.equal(expectedMakerBalance);
    expect(takerBalance).to.bignumber.equal(expectedTakerBalance);
});
describe('ForwarderSwapQuoteConsumer', () => {
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
    let invalidOrderFactory;
    let wethAssetData;
    let contractAddresses;
    let erc20TokenContract;
    let forwarderContract;
    let orders;
    let invalidOrders;
    let marketSellSwapQuote;
    let marketBuySwapQuote;
    let invalidMarketBuySwapQuote;
    let swapQuoteConsumer;
    let expectMakerAndTakerBalancesAsync;
    const chainId = TESTRPC_CHAIN_ID;
    before(() => __awaiter(this, void 0, void 0, function* () {
        contractAddresses = yield migrations_1.migrateOnceAsync(web3_wrapper_1.provider);
        yield blockchainLifecycle.startAsync();
        userAddresses = yield web3_wrapper_1.web3Wrapper.getAvailableAddressesAsync();
        [coinbaseAddress, takerAddress, makerAddress, feeRecipient] = userAddresses;
        [makerTokenAddress, takerTokenAddress] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
        erc20TokenContract = new contract_wrappers_1.ERC20TokenContract(makerTokenAddress, web3_wrapper_1.provider);
        forwarderContract = new contract_wrappers_1.ForwarderContract(contractAddresses.forwarder, web3_wrapper_1.provider);
        [makerAssetData, takerAssetData, wethAssetData] = [
            order_utils_1.assetDataUtils.encodeERC20AssetData(makerTokenAddress),
            order_utils_1.assetDataUtils.encodeERC20AssetData(takerTokenAddress),
            order_utils_1.assetDataUtils.encodeERC20AssetData(contractAddresses.etherToken),
        ];
        // Configure order defaults
        const defaultOrderParams = Object.assign({}, contracts_test_utils_1.constants.STATIC_ORDER_PARAMS, { makerAddress, takerAddress: constants_1.constants.NULL_ADDRESS, makerAssetData, takerAssetData: wethAssetData, makerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, takerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, makerFee: constants_1.constants.ZERO_AMOUNT, takerFee: constants_1.constants.ZERO_AMOUNT, feeRecipientAddress: feeRecipient, exchangeAddress: contractAddresses.exchange, chainId });
        const invalidDefaultOrderParams = Object.assign({}, defaultOrderParams, {
            takerAssetData,
        });
        const privateKey = contracts_test_utils_1.constants.TESTRPC_PRIVATE_KEYS[userAddresses.indexOf(makerAddress)];
        orderFactory = new contracts_test_utils_1.OrderFactory(privateKey, defaultOrderParams);
        expectMakerAndTakerBalancesAsync = expectMakerAndTakerBalancesAsyncFactory(erc20TokenContract, makerAddress, takerAddress);
        invalidOrderFactory = new contracts_test_utils_1.OrderFactory(privateKey, invalidDefaultOrderParams);
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.startAsync();
        const UNLIMITED_ALLOWANCE = UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
        const totalFillableAmount = new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI);
        yield erc20TokenContract.transfer(makerAddress, totalFillableAmount).sendTransactionAsync({
            from: coinbaseAddress,
        });
        yield erc20TokenContract
            .approve(contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE)
            .sendTransactionAsync({ from: makerAddress });
        yield forwarderContract.approveMakerAssetProxy(makerAssetData).sendTransactionAsync({ from: makerAddress });
        orders = [];
        for (const partialOrder of PARTIAL_PRUNED_SIGNED_ORDERS_FEELESS) {
            const order = yield orderFactory.newSignedOrderAsync(partialOrder);
            const prunedOrder = Object.assign({}, order, partialOrder);
            orders.push(prunedOrder);
        }
        invalidOrders = [];
        for (const partialOrder of PARTIAL_PRUNED_SIGNED_ORDERS_FEELESS) {
            const order = yield invalidOrderFactory.newSignedOrderAsync(partialOrder);
            const prunedOrder = Object.assign({}, order, partialOrder);
            invalidOrders.push(prunedOrder);
        }
        marketSellSwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, wethAssetData, orders, types_1.MarketOperation.Sell, GAS_PRICE);
        marketBuySwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, wethAssetData, orders, types_1.MarketOperation.Buy, GAS_PRICE);
        invalidMarketBuySwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, takerAssetData, invalidOrders, types_1.MarketOperation.Buy, GAS_PRICE);
        swapQuoteConsumer = new forwarder_swap_quote_consumer_1.ForwarderSwapQuoteConsumer(web3_wrapper_1.provider, contractAddresses, {
            chainId,
        });
        swapQuoteConsumer.buyQuoteSellAmountScalingFactor = 1;
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    describe('#executeSwapQuoteOrThrowAsync', () => {
        describe('validation', () => {
            it('should throw if swapQuote provided is not a valid forwarder SwapQuote (taker asset is wEth)', () => __awaiter(this, void 0, void 0, function* () {
                expect(swapQuoteConsumer.executeSwapQuoteOrThrowAsync(invalidMarketBuySwapQuote, { takerAddress })).to.be.rejectedWith(`Expected quote.orders[0] to have takerAssetData set as ${wethAssetData}, but is ${takerAssetData}`);
            }));
        });
        // TODO(david) test execution of swap quotes with fee orders
        describe('valid swap quote', () => {
            /*
             * Testing that SwapQuoteConsumer logic correctly performs a execution (doesn't throw or revert)
             * Does not test the validity of the state change performed by the forwarder smart contract
             */
            it('should perform a marketBuy execution when provided a MarketBuy type swapQuote', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                yield swapQuoteConsumer.executeSwapQuoteOrThrowAsync(marketBuySwapQuote, {
                    takerAddress,
                    gasLimit: 4000000,
                    ethAmount: new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI),
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            }));
            it('should perform a marketSell execution when provided a MarketSell type swapQuote', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                yield swapQuoteConsumer.executeSwapQuoteOrThrowAsync(marketSellSwapQuote, {
                    takerAddress,
                    gasLimit: 4000000,
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            }));
            it('should perform a marketBuy execution with affiliate fees', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const feeRecipientEthBalanceBefore = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                yield swapQuoteConsumer.executeSwapQuoteOrThrowAsync(marketBuySwapQuote, {
                    takerAddress,
                    gasLimit: 4000000,
                    extensionContractOpts: {
                        feePercentage: 0.05,
                        feeRecipient,
                    },
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
                const feeRecipientEthBalanceAfter = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                const totalEthSpent = marketBuySwapQuote.bestCaseQuoteInfo.totalTakerAssetAmount.plus(marketBuySwapQuote.bestCaseQuoteInfo.protocolFeeInWeiAmount);
                expect(feeRecipientEthBalanceAfter.minus(feeRecipientEthBalanceBefore)).to.bignumber.equal(new utils_1.BigNumber(FEE_PERCENTAGE).times(totalEthSpent));
            }));
            it('should perform a marketSell execution with affiliate fees', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const feeRecipientEthBalanceBefore = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                yield swapQuoteConsumer.executeSwapQuoteOrThrowAsync(marketSellSwapQuote, {
                    takerAddress,
                    gasLimit: 4000000,
                    extensionContractOpts: {
                        feePercentage: 0.05,
                        feeRecipient,
                    },
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
                const feeRecipientEthBalanceAfter = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                const totalEthSpent = marketBuySwapQuote.bestCaseQuoteInfo.totalTakerAssetAmount.plus(marketBuySwapQuote.bestCaseQuoteInfo.protocolFeeInWeiAmount);
                expect(feeRecipientEthBalanceAfter.minus(feeRecipientEthBalanceBefore)).to.bignumber.equal(new utils_1.BigNumber(FEE_PERCENTAGE).times(totalEthSpent));
            }));
        });
    });
    describe('#getCalldataOrThrow', () => {
        describe('validation', () => {
            it('should throw if swap quote provided is not a valid forwarder SwapQuote (taker asset is WETH)', () => __awaiter(this, void 0, void 0, function* () {
                expect(swapQuoteConsumer.getCalldataOrThrowAsync(invalidMarketBuySwapQuote, {})).to.be.rejectedWith(`Expected quote.orders[0] to have takerAssetData set as ${wethAssetData}, but is ${takerAssetData}`);
            }));
        });
        describe('valid swap quote', () => __awaiter(this, void 0, void 0, function* () {
            it('provide correct and optimized calldata options with default options for a marketSell SwapQuote (no affiliate fees)', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const { calldataHexString, toAddress, ethAmount } = yield swapQuoteConsumer.getCalldataOrThrowAsync(marketSellSwapQuote, {});
                expect(toAddress).to.deep.equal(forwarderContract.address);
                yield web3_wrapper_1.web3Wrapper.sendTransactionAsync({
                    from: takerAddress,
                    to: toAddress,
                    data: calldataHexString,
                    value: ethAmount,
                    gasPrice: GAS_PRICE,
                    gas: 4000000,
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            }));
            it('provide correct and optimized calldata options with default options for a marketBuy SwapQuote (no affiliate fees)', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const { calldataHexString, toAddress, ethAmount } = yield swapQuoteConsumer.getCalldataOrThrowAsync(marketBuySwapQuote, {});
                expect(toAddress).to.deep.equal(contractAddresses.forwarder);
                yield web3_wrapper_1.web3Wrapper.sendTransactionAsync({
                    from: takerAddress,
                    to: toAddress,
                    data: calldataHexString,
                    value: ethAmount,
                    gasPrice: GAS_PRICE,
                    gas: 4000000,
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            }));
            it('provide correct and optimized calldata options with affiliate fees for a marketSell SwapQuote', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const feeRecipientEthBalanceBefore = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                const { calldataHexString, toAddress, ethAmount } = yield swapQuoteConsumer.getCalldataOrThrowAsync(marketSellSwapQuote, {
                    extensionContractOpts: {
                        feePercentage: 0.05,
                        feeRecipient,
                    },
                });
                expect(toAddress).to.deep.equal(contractAddresses.forwarder);
                yield web3_wrapper_1.web3Wrapper.sendTransactionAsync({
                    from: takerAddress,
                    to: toAddress,
                    data: calldataHexString,
                    value: ethAmount,
                    gasPrice: GAS_PRICE,
                    gas: 4000000,
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
                const totalEthSpent = marketBuySwapQuote.bestCaseQuoteInfo.totalTakerAssetAmount.plus(marketBuySwapQuote.bestCaseQuoteInfo.protocolFeeInWeiAmount);
                const feeRecipientEthBalanceAfter = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                expect(feeRecipientEthBalanceAfter.minus(feeRecipientEthBalanceBefore)).to.bignumber.equal(new utils_1.BigNumber(FEE_PERCENTAGE).times(totalEthSpent));
            }));
            it('provide correct and optimized calldata options with affiliate fees for a marketBuy SwapQuote', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const feeRecipientEthBalanceBefore = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                const { calldataHexString, toAddress, ethAmount } = yield swapQuoteConsumer.getCalldataOrThrowAsync(marketBuySwapQuote, {
                    extensionContractOpts: {
                        feePercentage: 0.05,
                        feeRecipient,
                    },
                });
                expect(toAddress).to.deep.equal(contractAddresses.forwarder);
                yield web3_wrapper_1.web3Wrapper.sendTransactionAsync({
                    from: takerAddress,
                    to: toAddress,
                    data: calldataHexString,
                    value: ethAmount,
                    gasPrice: GAS_PRICE,
                    gas: 4000000,
                });
                yield expectMakerAndTakerBalancesAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
                const totalEthSpent = marketBuySwapQuote.bestCaseQuoteInfo.totalTakerAssetAmount.plus(marketBuySwapQuote.bestCaseQuoteInfo.protocolFeeInWeiAmount);
                const feeRecipientEthBalanceAfter = yield web3_wrapper_1.web3Wrapper.getBalanceInWeiAsync(feeRecipient);
                expect(feeRecipientEthBalanceAfter.minus(feeRecipientEthBalanceBefore)).to.bignumber.equal(new utils_1.BigNumber(FEE_PERCENTAGE).times(totalEthSpent));
            }));
        }));
    });
    // tslint:disable-next-line: max-file-line-count
});
//# sourceMappingURL=forwarder_swap_quote_consumer_test.js.map