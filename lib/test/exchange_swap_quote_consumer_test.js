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
const exchange_swap_quote_consumer_1 = require("../src/quote_consumers/exchange_swap_quote_consumer");
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
const UNLIMITED_ALLOWANCE = new utils_1.BigNumber(2).pow(256).minus(1); // tslint:disable-line:custom-no-magic-numbers
const PARTIAL_PRUNED_SIGNED_ORDERS_FEELESS = [
    {
        takerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(3).multipliedBy(ONE_ETH_IN_WEI),
    },
    {
        takerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        makerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
        fillableTakerAssetAmount: new utils_1.BigNumber(2).multipliedBy(ONE_ETH_IN_WEI),
        fillableMakerAssetAmount: new utils_1.BigNumber(5).multipliedBy(ONE_ETH_IN_WEI),
    },
];
const expectMakerAndTakerBalancesAsyncFactory = (erc20TokenContract, makerAddress, takerAddress) => (expectedMakerBalance, expectedTakerBalance) => __awaiter(this, void 0, void 0, function* () {
    const makerBalance = yield erc20TokenContract.balanceOf(makerAddress).callAsync();
    const takerBalance = yield erc20TokenContract.balanceOf(takerAddress).callAsync();
    expect(makerBalance).to.bignumber.equal(expectedMakerBalance);
    expect(takerBalance).to.bignumber.equal(expectedTakerBalance);
});
describe('ExchangeSwapQuoteConsumer', () => {
    let userAddresses;
    let erc20MakerTokenContract;
    let erc20TakerTokenContract;
    let coinbaseAddress;
    let makerAddress;
    let takerAddress;
    let orderFactory;
    let feeRecipient;
    let makerTokenAddress;
    let takerTokenAddress;
    let makerAssetData;
    let takerAssetData;
    let contractAddresses;
    let exchangeContract;
    const chainId = TESTRPC_CHAIN_ID;
    let orders;
    let marketSellSwapQuote;
    let marketBuySwapQuote;
    let swapQuoteConsumer;
    let expectMakerAndTakerBalancesForMakerAssetAsync;
    let expectMakerAndTakerBalancesForTakerAssetAsync;
    before(() => __awaiter(this, void 0, void 0, function* () {
        contractAddresses = yield migrations_1.migrateOnceAsync(web3_wrapper_1.provider);
        yield blockchainLifecycle.startAsync();
        userAddresses = yield web3_wrapper_1.web3Wrapper.getAvailableAddressesAsync();
        [coinbaseAddress, takerAddress, makerAddress, feeRecipient] = userAddresses;
        [makerTokenAddress, takerTokenAddress] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
        [makerAssetData, takerAssetData] = [
            order_utils_1.assetDataUtils.encodeERC20AssetData(makerTokenAddress),
            order_utils_1.assetDataUtils.encodeERC20AssetData(takerTokenAddress),
        ];
        erc20MakerTokenContract = new contract_wrappers_1.ERC20TokenContract(makerTokenAddress, web3_wrapper_1.provider);
        erc20TakerTokenContract = new contract_wrappers_1.ERC20TokenContract(takerTokenAddress, web3_wrapper_1.provider);
        exchangeContract = new contract_wrappers_1.ExchangeContract(contractAddresses.exchange, web3_wrapper_1.provider);
        // Configure order defaults
        const defaultOrderParams = Object.assign({}, contracts_test_utils_1.constants.STATIC_ORDER_PARAMS, { makerAddress,
            takerAddress,
            makerAssetData,
            takerAssetData, makerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, takerFeeAssetData: constants_1.constants.NULL_ERC20_ASSET_DATA, makerFee: constants_1.constants.ZERO_AMOUNT, takerFee: constants_1.constants.ZERO_AMOUNT, feeRecipientAddress: feeRecipient, exchangeAddress: contractAddresses.exchange, chainId });
        const privateKey = contracts_test_utils_1.constants.TESTRPC_PRIVATE_KEYS[userAddresses.indexOf(makerAddress)];
        orderFactory = new contracts_test_utils_1.OrderFactory(privateKey, defaultOrderParams);
        expectMakerAndTakerBalancesForTakerAssetAsync = expectMakerAndTakerBalancesAsyncFactory(erc20TakerTokenContract, makerAddress, takerAddress);
        expectMakerAndTakerBalancesForMakerAssetAsync = expectMakerAndTakerBalancesAsyncFactory(erc20MakerTokenContract, makerAddress, takerAddress);
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.startAsync();
        orders = [];
        for (const partialOrder of PARTIAL_PRUNED_SIGNED_ORDERS_FEELESS) {
            const order = yield orderFactory.newSignedOrderAsync(partialOrder);
            const prunedOrder = Object.assign({}, order, partialOrder);
            orders.push(prunedOrder);
        }
        marketSellSwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, takerAssetData, orders, types_1.MarketOperation.Sell, GAS_PRICE);
        marketBuySwapQuote = yield swap_quote_1.getFullyFillableSwapQuoteWithNoFeesAsync(makerAssetData, takerAssetData, orders, types_1.MarketOperation.Buy, GAS_PRICE);
        swapQuoteConsumer = new exchange_swap_quote_consumer_1.ExchangeSwapQuoteConsumer(web3_wrapper_1.provider, contractAddresses, {
            chainId,
        });
        yield erc20MakerTokenContract
            .transfer(makerAddress, marketBuySwapQuote.worstCaseQuoteInfo.makerAssetAmount)
            .sendTransactionAsync({
            from: coinbaseAddress,
        });
        yield erc20TakerTokenContract
            .transfer(takerAddress, marketBuySwapQuote.worstCaseQuoteInfo.totalTakerAssetAmount)
            .sendTransactionAsync({
            from: coinbaseAddress,
        });
        yield erc20MakerTokenContract
            .approve(contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE)
            .sendTransactionAsync({ from: makerAddress });
        yield erc20TakerTokenContract
            .approve(contractAddresses.erc20Proxy, UNLIMITED_ALLOWANCE)
            .sendTransactionAsync({ from: takerAddress });
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    describe('#executeSwapQuoteOrThrowAsync', () => {
        /*
         * Testing that SwapQuoteConsumer logic correctly performs a execution (doesn't throw or revert)
         * Does not test the validity of the state change performed by the forwarder smart contract
         */
        it('should perform a marketSell execution when provided a MarketSell type swapQuote', () => __awaiter(this, void 0, void 0, function* () {
            yield expectMakerAndTakerBalancesForMakerAssetAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
            yield expectMakerAndTakerBalancesForTakerAssetAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            yield swapQuoteConsumer.executeSwapQuoteOrThrowAsync(marketSellSwapQuote, {
                takerAddress,
                gasLimit: 4000000,
            });
            yield expectMakerAndTakerBalancesForMakerAssetAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            yield expectMakerAndTakerBalancesForTakerAssetAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
        }));
        it('should perform a marketBuy execution when provided a MarketBuy type swapQuote', () => __awaiter(this, void 0, void 0, function* () {
            yield expectMakerAndTakerBalancesForMakerAssetAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
            yield expectMakerAndTakerBalancesForTakerAssetAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            yield swapQuoteConsumer.executeSwapQuoteOrThrowAsync(marketBuySwapQuote, {
                takerAddress,
                gasLimit: 4000000,
            });
            yield expectMakerAndTakerBalancesForMakerAssetAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            yield expectMakerAndTakerBalancesForTakerAssetAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
        }));
    });
    describe('#getCalldataOrThrow', () => {
        describe('valid swap quote', () => __awaiter(this, void 0, void 0, function* () {
            it('provide correct and optimized calldata options with default options for a marketSell SwapQuote (no affiliate fees)', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesForMakerAssetAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const { calldataHexString, toAddress, ethAmount } = yield swapQuoteConsumer.getCalldataOrThrowAsync(marketSellSwapQuote, {});
                expect(toAddress).to.deep.equal(exchangeContract.address);
                yield web3_wrapper_1.web3Wrapper.sendTransactionAsync({
                    from: takerAddress,
                    to: toAddress,
                    data: calldataHexString,
                    gas: 4000000,
                    gasPrice: GAS_PRICE,
                    value: ethAmount,
                });
                yield expectMakerAndTakerBalancesForMakerAssetAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            }));
            it('provide correct and optimized calldata options with default options for a marketBuy SwapQuote (no affiliate fees)', () => __awaiter(this, void 0, void 0, function* () {
                yield expectMakerAndTakerBalancesForMakerAssetAsync(new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI), constants_1.constants.ZERO_AMOUNT);
                const { calldataHexString, toAddress, ethAmount } = yield swapQuoteConsumer.getCalldataOrThrowAsync(marketBuySwapQuote, {});
                expect(toAddress).to.deep.equal(exchangeContract.address);
                yield web3_wrapper_1.web3Wrapper.sendTransactionAsync({
                    from: takerAddress,
                    to: toAddress,
                    data: calldataHexString,
                    gas: 4000000,
                    gasPrice: GAS_PRICE,
                    value: ethAmount,
                });
                yield expectMakerAndTakerBalancesForMakerAssetAsync(constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(10).multipliedBy(ONE_ETH_IN_WEI));
            }));
        }));
    });
});
//# sourceMappingURL=exchange_swap_quote_consumer_test.js.map