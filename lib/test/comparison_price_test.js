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
// tslint:disable:custom-no-magic-numbers
const utils_1 = require("@0x/utils");
const chai = require("chai");
require("mocha");
const types_1 = require("../src/types");
const comparison_price_1 = require("../src/utils/market_operation_utils/comparison_price");
const constants_1 = require("../src/utils/market_operation_utils/constants");
const source_filters_1 = require("../src/utils/market_operation_utils/source_filters");
const types_2 = require("../src/utils/market_operation_utils/types");
const chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';
const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const GAS_PRICE = 50e9; // 50 gwei
// DEX samples to fill in MarketSideLiquidity
const kyberSample1 = {
    source: types_2.ERC20BridgeSource.Kyber,
    input: new utils_1.BigNumber(10000),
    output: new utils_1.BigNumber(10001),
    fillData: {},
};
const uniswapSample1 = {
    source: types_2.ERC20BridgeSource.UniswapV2,
    input: new utils_1.BigNumber(10003),
    output: new utils_1.BigNumber(10004),
    fillData: {},
};
const dexQuotes = [kyberSample1, uniswapSample1];
const exchangeProxyOverhead = (sourceFlags) => sourceFlags === constants_1.SOURCE_FLAGS.Native ? new utils_1.BigNumber(220e3).times(GAS_PRICE) : new utils_1.BigNumber(0);
describe('getComparisonPrices', () => __awaiter(this, void 0, void 0, function* () {
    it('should create a proper comparison price for Sells', () => {
        // test selling 10 ETH for DAI
        // here, ETH is the input token
        // and DAI is the output token
        const AMOUNT = new utils_1.BigNumber(10 * 1e18);
        const marketSideLiquidity = {
            // needed params
            ethToOutputRate: new utils_1.BigNumber(500),
            ethToInputRate: new utils_1.BigNumber(1),
            side: types_1.MarketOperation.Sell,
            makerTokenDecimals: 18,
            takerTokenDecimals: 18,
            // extra
            inputAmount: new utils_1.BigNumber(10 * 1e18),
            inputToken: ETH_TOKEN,
            outputToken: DAI_TOKEN,
            dexQuotes: [dexQuotes],
            nativeOrders: [],
            orderFillableAmounts: [],
            twoHopQuotes: [],
            rfqtIndicativeQuotes: [],
            quoteSourceFilters: new source_filters_1.SourceFilters(),
        };
        // raw maker over taker rate, let's say is 500 flat
        const adjustedRate = new utils_1.BigNumber(500);
        const optimizerResult = {
            // needed params
            adjustedRate,
            exchangeProxyOverhead,
            // extraneous
            optimizedOrders: [],
            liquidityDelivered: [],
            sourceFlags: constants_1.SOURCE_FLAGS.Uniswap_V2,
        };
        const comparisonPrices = comparison_price_1.getComparisonPrices(optimizerResult, AMOUNT, marketSideLiquidity);
        // expected outcome
        const EXPECTED_PRICE = new utils_1.BigNumber('500.55');
        expect(comparisonPrices.wholeOrder).to.deep.eq(EXPECTED_PRICE);
    });
    it('should create a proper comparison price for Buys', () => {
        // test buying 10 ETH with DAI
        // here, ETH is the input token
        // and DAI is the output token (now from the maker's perspective)
        const AMOUNT = new utils_1.BigNumber(10 * 1e18);
        const marketSideLiquidity = {
            // needed params
            ethToOutputRate: new utils_1.BigNumber(500),
            ethToInputRate: new utils_1.BigNumber(1),
            side: types_1.MarketOperation.Buy,
            makerTokenDecimals: 18,
            takerTokenDecimals: 18,
            // extra
            inputAmount: new utils_1.BigNumber(10 * 1e18),
            inputToken: ETH_TOKEN,
            outputToken: DAI_TOKEN,
            dexQuotes: [dexQuotes],
            nativeOrders: [],
            orderFillableAmounts: [],
            twoHopQuotes: [],
            rfqtIndicativeQuotes: [],
            quoteSourceFilters: new source_filters_1.SourceFilters(),
        };
        // raw maker over taker rate, let's say is ETH/DAI rate is 500 flat
        const adjustedRate = new utils_1.BigNumber(1).dividedBy(new utils_1.BigNumber(500));
        const optimizerResult = {
            // needed params
            adjustedRate,
            exchangeProxyOverhead,
            // extraneous
            optimizedOrders: [],
            liquidityDelivered: [],
            sourceFlags: constants_1.SOURCE_FLAGS.Uniswap_V2,
        };
        const comparisonPrices = comparison_price_1.getComparisonPrices(optimizerResult, AMOUNT, marketSideLiquidity);
        // expected outcome
        const EXPECTED_PRICE = new utils_1.BigNumber('0.0020022024');
        expect(comparisonPrices.wholeOrder).to.deep.eq(EXPECTED_PRICE);
    });
}));
//# sourceMappingURL=comparison_price_test.js.map