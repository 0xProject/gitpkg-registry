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
// tslint:disable: no-unbound-method
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const _ = require("lodash");
const TypeMoq = require("typemoq");
const src_1 = require("../src");
const market_operation_utils_1 = require("../src/utils/market_operation_utils/");
const balancer_utils_1 = require("../src/utils/market_operation_utils/balancer_utils");
const constants_1 = require("../src/utils/market_operation_utils/constants");
const cream_utils_1 = require("../src/utils/market_operation_utils/cream_utils");
const fills_1 = require("../src/utils/market_operation_utils/fills");
const sampler_operations_1 = require("../src/utils/market_operation_utils/sampler_operations");
const source_filters_1 = require("../src/utils/market_operation_utils/source_filters");
const types_1 = require("../src/utils/market_operation_utils/types");
const MAKER_TOKEN = contracts_test_utils_1.randomAddress();
const TAKER_TOKEN = contracts_test_utils_1.randomAddress();
const DEFAULT_EXCLUDED = [
    types_1.ERC20BridgeSource.UniswapV2,
    types_1.ERC20BridgeSource.Curve,
    types_1.ERC20BridgeSource.Balancer,
    types_1.ERC20BridgeSource.MStable,
    types_1.ERC20BridgeSource.Mooniswap,
    types_1.ERC20BridgeSource.Bancor,
    types_1.ERC20BridgeSource.Swerve,
    types_1.ERC20BridgeSource.SnowSwap,
    types_1.ERC20BridgeSource.SushiSwap,
    types_1.ERC20BridgeSource.MultiHop,
    types_1.ERC20BridgeSource.Shell,
    types_1.ERC20BridgeSource.Cream,
    types_1.ERC20BridgeSource.Dodo,
    types_1.ERC20BridgeSource.DodoV2,
    types_1.ERC20BridgeSource.LiquidityProvider,
    types_1.ERC20BridgeSource.CryptoCom,
    types_1.ERC20BridgeSource.Linkswap,
    types_1.ERC20BridgeSource.PancakeSwap,
    types_1.ERC20BridgeSource.BakerySwap,
];
const BUY_SOURCES = constants_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet].sources;
const SELL_SOURCES = constants_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet].sources;
const TOKEN_ADJACENCY_GRAPH = { default: [] };
const SIGNATURE = { v: 1, r: utils_1.NULL_BYTES, s: utils_1.NULL_BYTES, signatureType: protocol_utils_1.SignatureType.EthSign };
/**
 * gets the orders required for a market sell operation by (potentially) merging native orders with
 * generated bridge orders.
 * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
 * @param takerAmount Amount of taker asset to sell.
 * @param opts Options object.
 * @return object with optimized orders and a QuoteReport
 */
function getMarketSellOrdersAsync(utils, nativeOrders, takerAmount, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return utils.getOptimizerResultAsync(nativeOrders, takerAmount, src_1.MarketOperation.Sell, opts);
    });
}
/**
 * gets the orders required for a market buy operation by (potentially) merging native orders with
 * generated bridge orders.
 * @param nativeOrders Native orders. Assumes LimitOrders not RfqOrders
 * @param makerAmount Amount of maker asset to buy.
 * @param opts Options object.
 * @return object with optimized orders and a QuoteReport
 */
function getMarketBuyOrdersAsync(utils, nativeOrders, makerAmount, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return utils.getOptimizerResultAsync(nativeOrders, makerAmount, src_1.MarketOperation.Buy, opts);
    });
}
// tslint:disable: custom-no-magic-numbers promise-function-async
describe('MarketOperationUtils tests', () => {
    const CHAIN_ID = contract_addresses_1.ChainId.Mainnet;
    const contractAddresses = Object.assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID));
    function getMockedQuoteRequestor(type, results, verifiable) {
        const args = [
            TypeMoq.It.isAny(),
            TypeMoq.It.isAny(),
            TypeMoq.It.isAny(),
            TypeMoq.It.isAny(),
            TypeMoq.It.isAny(),
            TypeMoq.It.isAny(),
        ];
        const requestor = TypeMoq.Mock.ofType(src_1.QuoteRequestor, TypeMoq.MockBehavior.Loose, true);
        if (type === 'firm') {
            requestor
                .setup(r => r.requestRfqtFirmQuotesAsync(...args))
                .returns(() => __awaiter(this, void 0, void 0, function* () { return results; }))
                .verifiable(verifiable);
        }
        else {
            requestor
                .setup(r => r.requestRfqtIndicativeQuotesAsync(...args))
                .returns(() => __awaiter(this, void 0, void 0, function* () { return results.map(r => r.order); }))
                .verifiable(verifiable);
        }
        return requestor;
    }
    function createOrdersFromSellRates(takerAmount, rates) {
        const singleTakerAmount = takerAmount.div(rates.length).integerValue(utils_1.BigNumber.ROUND_UP);
        return rates.map(r => {
            const o = {
                order: Object.assign({}, new protocol_utils_1.LimitOrder({
                    makerAmount: singleTakerAmount.times(r).integerValue(),
                    takerAmount: singleTakerAmount,
                })),
                signature: SIGNATURE,
                type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            };
            return o;
        });
    }
    function createOrdersFromBuyRates(makerAmount, rates) {
        const singleMakerAmount = makerAmount.div(rates.length).integerValue(utils_1.BigNumber.ROUND_UP);
        return rates.map(r => {
            const o = {
                order: Object.assign({}, new protocol_utils_1.LimitOrder({
                    makerAmount: singleMakerAmount,
                    takerAmount: singleMakerAmount.div(r).integerValue(),
                })),
                signature: SIGNATURE,
                type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            };
            return o;
        });
    }
    const ORDER_DOMAIN = {
        exchangeAddress: contractAddresses.exchange,
        chainId: CHAIN_ID,
    };
    function createSamplesFromRates(source, inputs, rates, fillData) {
        const samples = [];
        inputs.forEach((input, i) => {
            const rate = rates[i];
            samples.push({
                source,
                fillData: fillData || DEFAULT_FILL_DATA[source],
                input: new utils_1.BigNumber(input),
                output: new utils_1.BigNumber(input)
                    .minus(i === 0 ? 0 : samples[i - 1].input)
                    .times(rate)
                    .plus(i === 0 ? 0 : samples[i - 1].output)
                    .integerValue(),
            });
        });
        return samples;
    }
    function createGetMultipleSellQuotesOperationFromRates(rates) {
        return (sources, _makerToken, _takerToken, fillAmounts, _wethAddress) => {
            return sampler_operations_1.BATCH_SOURCE_FILTERS.getAllowed(sources).map(s => createSamplesFromRates(s, fillAmounts, rates[s]));
        };
    }
    function createGetMultipleBuyQuotesOperationFromRates(rates) {
        return (sources, _makerToken, _takerToken, fillAmounts, _wethAddress) => {
            return sampler_operations_1.BATCH_SOURCE_FILTERS.getAllowed(sources).map(s => createSamplesFromRates(s, fillAmounts, rates[s].map(r => new utils_1.BigNumber(1).div(r))));
        };
    }
    function createGetMedianSellRate(rate) {
        return (_sources, _makerToken, _takerToken, _fillAmounts, _wethAddress) => {
            return new utils_1.BigNumber(rate);
        };
    }
    function createDecreasingRates(count) {
        const rates = [];
        const initialRate = contracts_test_utils_1.getRandomFloat(1e-3, 1e2);
        _.times(count, () => contracts_test_utils_1.getRandomFloat(0.95, 1)).forEach((r, i) => {
            const prevRate = i === 0 ? initialRate : rates[i - 1];
            rates.push(prevRate.times(r));
        });
        return rates;
    }
    const NUM_SAMPLES = 3;
    const ZERO_RATES = {
        [types_1.ERC20BridgeSource.Native]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Eth2Dai]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Uniswap]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Kyber]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.UniswapV2]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Balancer]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Bancor]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Curve]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.LiquidityProvider]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.MStable]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Mooniswap]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Swerve]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.SnowSwap]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.SushiSwap]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.MultiHop]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Shell]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Cream]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Dodo]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.DodoV2]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.CryptoCom]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.Linkswap]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.PancakeSwap]: _.times(NUM_SAMPLES, () => 0),
        [types_1.ERC20BridgeSource.BakerySwap]: _.times(NUM_SAMPLES, () => 0),
    };
    const DEFAULT_RATES = Object.assign({}, ZERO_RATES, { [types_1.ERC20BridgeSource.Native]: createDecreasingRates(NUM_SAMPLES), [types_1.ERC20BridgeSource.Eth2Dai]: createDecreasingRates(NUM_SAMPLES), [types_1.ERC20BridgeSource.Uniswap]: createDecreasingRates(NUM_SAMPLES) });
    const DEFAULT_FILL_DATA = {
        [types_1.ERC20BridgeSource.UniswapV2]: { tokenAddressPath: [] },
        [types_1.ERC20BridgeSource.Balancer]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.Bancor]: { path: [], networkAddress: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.Kyber]: { hint: '0x', reserveId: '0x', networkAddress: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.Curve]: {
            pool: {
                poolAddress: contracts_test_utils_1.randomAddress(),
                tokens: [TAKER_TOKEN, MAKER_TOKEN],
                exchangeFunctionSelector: utils_1.hexUtils.random(4),
                sellQuoteFunctionSelector: utils_1.hexUtils.random(4),
                buyQuoteFunctionSelector: utils_1.hexUtils.random(4),
            },
            fromTokenIdx: 0,
            toTokenIdx: 1,
        },
        [types_1.ERC20BridgeSource.Swerve]: {
            pool: {
                poolAddress: contracts_test_utils_1.randomAddress(),
                tokens: [TAKER_TOKEN, MAKER_TOKEN],
                exchangeFunctionSelector: utils_1.hexUtils.random(4),
                sellQuoteFunctionSelector: utils_1.hexUtils.random(4),
                buyQuoteFunctionSelector: utils_1.hexUtils.random(4),
            },
            fromTokenIdx: 0,
            toTokenIdx: 1,
        },
        [types_1.ERC20BridgeSource.SnowSwap]: {
            pool: {
                poolAddress: contracts_test_utils_1.randomAddress(),
                tokens: [TAKER_TOKEN, MAKER_TOKEN],
                exchangeFunctionSelector: utils_1.hexUtils.random(4),
                sellQuoteFunctionSelector: utils_1.hexUtils.random(4),
                buyQuoteFunctionSelector: utils_1.hexUtils.random(4),
            },
            fromTokenIdx: 0,
            toTokenIdx: 1,
        },
        [types_1.ERC20BridgeSource.LiquidityProvider]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.SushiSwap]: { tokenAddressPath: [] },
        [types_1.ERC20BridgeSource.Mooniswap]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.Native]: { order: new protocol_utils_1.LimitOrder() },
        [types_1.ERC20BridgeSource.MultiHop]: {},
        [types_1.ERC20BridgeSource.Shell]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.Cream]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.Dodo]: {},
        [types_1.ERC20BridgeSource.DodoV2]: {},
        [types_1.ERC20BridgeSource.CryptoCom]: { tokenAddressPath: [] },
        [types_1.ERC20BridgeSource.Linkswap]: { tokenAddressPath: [] },
        [types_1.ERC20BridgeSource.Uniswap]: { router: contracts_test_utils_1.randomAddress() },
        [types_1.ERC20BridgeSource.Eth2Dai]: { router: contracts_test_utils_1.randomAddress() },
    };
    const DEFAULT_OPS = {
        getTokenDecimals(_makerAddress, _takerAddress) {
            const result = new utils_1.BigNumber(18);
            return [result, result];
        },
        getLimitOrderFillableTakerAmounts(orders) {
            return orders.map(o => o.order.takerAmount);
        },
        getLimitOrderFillableMakerAmounts(orders) {
            return orders.map(o => o.order.makerAmount);
        },
        getSellQuotes: createGetMultipleSellQuotesOperationFromRates(DEFAULT_RATES),
        getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(DEFAULT_RATES),
        getMedianSellRate: createGetMedianSellRate(1),
        getBalancerSellQuotesOffChainAsync: (_makerToken, _takerToken, takerFillAmounts) => [
            createSamplesFromRates(types_1.ERC20BridgeSource.Balancer, takerFillAmounts, createDecreasingRates(takerFillAmounts.length), DEFAULT_FILL_DATA[types_1.ERC20BridgeSource.Balancer]),
        ],
        getBalancerBuyQuotesOffChainAsync: (_makerToken, _takerToken, makerFillAmounts) => [
            createSamplesFromRates(types_1.ERC20BridgeSource.Balancer, makerFillAmounts, createDecreasingRates(makerFillAmounts.length).map(r => new utils_1.BigNumber(1).div(r)), DEFAULT_FILL_DATA[types_1.ERC20BridgeSource.Balancer]),
        ],
        getCreamSellQuotesOffChainAsync: (_makerToken, _takerToken, takerFillAmounts) => [
            createSamplesFromRates(types_1.ERC20BridgeSource.Cream, takerFillAmounts, createDecreasingRates(takerFillAmounts.length), DEFAULT_FILL_DATA[types_1.ERC20BridgeSource.Cream]),
        ],
        getCreamBuyQuotesOffChainAsync: (_makerToken, _takerToken, makerFillAmounts) => [
            createSamplesFromRates(types_1.ERC20BridgeSource.Cream, makerFillAmounts, createDecreasingRates(makerFillAmounts.length).map(r => new utils_1.BigNumber(1).div(r)), DEFAULT_FILL_DATA[types_1.ERC20BridgeSource.Cream]),
        ],
        getBancorSellQuotesOffChainAsync: (_makerToken, _takerToken, takerFillAmounts) => createSamplesFromRates(types_1.ERC20BridgeSource.Bancor, takerFillAmounts, createDecreasingRates(takerFillAmounts.length), DEFAULT_FILL_DATA[types_1.ERC20BridgeSource.Bancor]),
        getTwoHopSellQuotes: (..._params) => [],
        getTwoHopBuyQuotes: (..._params) => [],
        isAddressContract: (..._params) => false,
    };
    const MOCK_SAMPLER = {
        executeAsync(...ops) {
            return __awaiter(this, void 0, void 0, function* () {
                return MOCK_SAMPLER.executeBatchAsync(ops);
            });
        },
        executeBatchAsync(ops) {
            return __awaiter(this, void 0, void 0, function* () {
                return ops;
            });
        },
        balancerPoolsCache: new balancer_utils_1.BalancerPoolsCache(),
        creamPoolsCache: new cream_utils_1.CreamPoolsCache(),
        liquidityProviderRegistry: {},
        chainId: CHAIN_ID,
    };
    function replaceSamplerOps(ops = {}) {
        Object.assign(MOCK_SAMPLER, DEFAULT_OPS);
        Object.assign(MOCK_SAMPLER, ops);
    }
    describe('MarketOperationUtils', () => {
        let marketOperationUtils;
        before(() => __awaiter(this, void 0, void 0, function* () {
            marketOperationUtils = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
        }));
        describe('getMarketSellOrdersAsync()', () => {
            const FILL_AMOUNT = new utils_1.BigNumber('100e18');
            const ORDERS = createOrdersFromSellRates(FILL_AMOUNT, _.times(NUM_SAMPLES, i => DEFAULT_RATES[types_1.ERC20BridgeSource.Native][i]));
            const DEFAULT_OPTS = {
                numSamples: NUM_SAMPLES,
                sampleDistributionBase: 1,
                bridgeSlippage: 0,
                maxFallbackSlippage: 100,
                excludedSources: DEFAULT_EXCLUDED,
                allowFallback: false,
                gasSchedule: {},
                feeSchedule: {},
            };
            beforeEach(() => {
                replaceSamplerOps();
            });
            it('queries `numSamples` samples', () => __awaiter(this, void 0, void 0, function* () {
                const numSamples = _.random(1, NUM_SAMPLES);
                let actualNumSamples = 0;
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        actualNumSamples = amounts.length;
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                });
                yield getMarketSellOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples }));
                contracts_test_utils_1.expect(actualNumSamples).eq(numSamples);
            }));
            it('polls all DEXes if `excludedSources` is empty', () => __awaiter(this, void 0, void 0, function* () {
                let sourcesPolled = [];
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                    getTwoHopSellQuotes: (...args) => {
                        sourcesPolled.push(types_1.ERC20BridgeSource.MultiHop);
                        return DEFAULT_OPS.getTwoHopSellQuotes(...args);
                    },
                    getBalancerSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                    getCreamSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Cream);
                        return DEFAULT_OPS.getCreamSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                });
                yield getMarketSellOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [] }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(SELL_SOURCES.slice().sort());
            }));
            it('does not poll DEXes in `excludedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const excludedSources = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                    getTwoHopSellQuotes: (sources, ...args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_1.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopSellQuotes(...args);
                    },
                    getBalancerSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                    getCreamSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Cream);
                        return DEFAULT_OPS.getCreamSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                });
                yield getMarketSellOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(_.without(SELL_SOURCES, ...excludedSources).sort());
            }));
            it('only polls DEXes in `includedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const includedSources = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                    getTwoHopSellQuotes: (sources, ...args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_1.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopSellQuotes(sources, ...args);
                    },
                    getBalancerSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                    getCreamSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Cream);
                        return DEFAULT_OPS.getCreamSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                });
                yield getMarketSellOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [], includedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(includedSources.sort());
            }));
            // // TODO (xianny): v4 will have a new way of representing bridge data
            // it('generates bridge orders with correct asset data', async () => {
            //     const improvedOrdersResponse = await getMarketSellOrdersAsync(
            //         marketOperationUtils,
            //         // Pass in empty orders to prevent native orders from being used.
            //         ORDERS.map(o => ({ ...o, makerAmount: constants.ZERO_AMOUNT })),
            //         FILL_AMOUNT,
            //         DEFAULT_OPTS,
            //     );
            //     const improvedOrders = improvedOrdersResponse.optimizedOrders;
            //     expect(improvedOrders).to.not.be.length(0);
            //     for (const order of improvedOrders) {
            //         expect(getSourceFromAssetData(order.makerAssetData)).to.exist('');
            //         const makerAssetDataPrefix = hexUtils.slice(
            //             assetDataUtils.encodeERC20BridgeAssetData(
            //                 MAKER_TOKEN,
            //                 constants.NULL_ADDRESS,
            //                 constants.NULL_BYTES,
            //             ),
            //             0,
            //             36,
            //         );
            //         assertSamePrefix(order.makerAssetData, makerAssetDataPrefix);
            //         expect(order.takerAssetData).to.eq(TAKER_ASSET_DATA);
            //     }
            // });
            it('getMarketSellOrdersAsync() optimizer will be called once only if price-aware RFQ is disabled', () => __awaiter(this, void 0, void 0, function* () {
                const mockedMarketOpUtils = TypeMoq.Mock.ofType(market_operation_utils_1.MarketOperationUtils, TypeMoq.MockBehavior.Loose, false, MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                mockedMarketOpUtils.callBase = true;
                // Ensure that `_generateOptimizedOrdersAsync` is only called once
                mockedMarketOpUtils
                    .setup(m => m._generateOptimizedOrdersAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .returns((a, b) => __awaiter(this, void 0, void 0, function* () { return mockedMarketOpUtils.target._generateOptimizedOrdersAsync(a, b); }))
                    .verifiable(TypeMoq.Times.once());
                const totalAssetAmount = ORDERS.map(o => o.order.takerAmount).reduce((a, b) => a.plus(b));
                yield mockedMarketOpUtils.object.getOptimizerResultAsync(ORDERS, totalAssetAmount, src_1.MarketOperation.Sell, DEFAULT_OPTS);
                mockedMarketOpUtils.verifyAll();
            }));
            it('optimizer will send in a comparison price to RFQ providers', () => __awaiter(this, void 0, void 0, function* () {
                // Set up mocked quote requestor, will return an order that is better
                // than the best of the orders.
                const mockedQuoteRequestor = TypeMoq.Mock.ofType(src_1.QuoteRequestor, TypeMoq.MockBehavior.Loose, false, {});
                let requestedComparisonPrice;
                // to get a comparisonPrice, you need a feeschedule for a native order
                const feeSchedule = {
                    [types_1.ERC20BridgeSource.Native]: _.constant(new utils_1.BigNumber(1)),
                };
                mockedQuoteRequestor
                    .setup(mqr => mqr.requestRfqtFirmQuotesAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .callback((_makerToken, _takerToken, _assetFillAmount, _marketOperation, comparisonPrice, _options) => {
                    requestedComparisonPrice = comparisonPrice;
                })
                    .returns(() => __awaiter(this, void 0, void 0, function* () {
                    return [
                        {
                            order: Object.assign({}, new protocol_utils_1.RfqOrder({
                                makerToken: MAKER_TOKEN,
                                takerToken: TAKER_TOKEN,
                                makerAmount: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(321, 6),
                                takerAmount: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(1, 18),
                            })),
                            signature: SIGNATURE,
                            type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
                        },
                    ];
                }));
                // Set up sampler, will only return 1 on-chain order
                const mockedMarketOpUtils = TypeMoq.Mock.ofType(market_operation_utils_1.MarketOperationUtils, TypeMoq.MockBehavior.Loose, false, MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                mockedMarketOpUtils.callBase = true;
                mockedMarketOpUtils
                    .setup(mou => mou.getMarketSellLiquidityAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .returns(() => __awaiter(this, void 0, void 0, function* () {
                    return {
                        side: src_1.MarketOperation.Sell,
                        inputAmount: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(1, 18),
                        inputToken: MAKER_TOKEN,
                        outputToken: TAKER_TOKEN,
                        inputAmountPerEth: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(1, 18),
                        outputAmountPerEth: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(1, 6),
                        quoteSourceFilters: new source_filters_1.SourceFilters(),
                        makerTokenDecimals: 6,
                        takerTokenDecimals: 18,
                        quotes: {
                            dexQuotes: [],
                            rfqtIndicativeQuotes: [],
                            twoHopQuotes: [],
                            nativeOrders: [
                                {
                                    order: new protocol_utils_1.LimitOrder({
                                        makerToken: MAKER_TOKEN,
                                        takerToken: TAKER_TOKEN,
                                        makerAmount: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(320, 6),
                                        takerAmount: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(1, 18),
                                    }),
                                    fillableTakerAmount: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(1, 18),
                                    fillableMakerAmount: web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(320, 6),
                                    fillableTakerFeeAmount: new utils_1.BigNumber(0),
                                    type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
                                    signature: SIGNATURE,
                                },
                            ],
                        },
                        isRfqSupported: true,
                    };
                }));
                const result = yield mockedMarketOpUtils.object.getOptimizerResultAsync(ORDERS, web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(1, 18), src_1.MarketOperation.Sell, Object.assign({}, DEFAULT_OPTS, { feeSchedule, rfqt: {
                        isIndicative: false,
                        apiKey: 'foo',
                        takerAddress: contracts_test_utils_1.randomAddress(),
                        txOrigin: contracts_test_utils_1.randomAddress(),
                        intentOnFilling: true,
                        quoteRequestor: {
                            requestRfqtFirmQuotesAsync: mockedQuoteRequestor.object.requestRfqtFirmQuotesAsync,
                        },
                    } }));
                contracts_test_utils_1.expect(result.optimizedOrders.length).to.eql(1);
                // tslint:disable-next-line:no-unnecessary-type-assertion
                contracts_test_utils_1.expect(requestedComparisonPrice.toString()).to.eql('320');
                contracts_test_utils_1.expect(result.optimizedOrders[0].makerAmount.toString()).to.eql('321000000');
                contracts_test_utils_1.expect(result.optimizedOrders[0].takerAmount.toString()).to.eql('1000000000000000000');
            }));
            it('getMarketSellOrdersAsync() will not rerun the optimizer if no orders are returned', () => __awaiter(this, void 0, void 0, function* () {
                // Ensure that `_generateOptimizedOrdersAsync` is only called once
                const mockedMarketOpUtils = TypeMoq.Mock.ofType(market_operation_utils_1.MarketOperationUtils, TypeMoq.MockBehavior.Loose, false, MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                mockedMarketOpUtils.callBase = true;
                mockedMarketOpUtils
                    .setup(m => m._generateOptimizedOrdersAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .returns((a, b) => __awaiter(this, void 0, void 0, function* () { return mockedMarketOpUtils.target._generateOptimizedOrdersAsync(a, b); }))
                    .verifiable(TypeMoq.Times.once());
                const requestor = getMockedQuoteRequestor('firm', [], TypeMoq.Times.once());
                const totalAssetAmount = ORDERS.map(o => o.order.takerAmount).reduce((a, b) => a.plus(b));
                yield mockedMarketOpUtils.object.getOptimizerResultAsync(ORDERS, totalAssetAmount, src_1.MarketOperation.Sell, Object.assign({}, DEFAULT_OPTS, { rfqt: {
                        isIndicative: false,
                        apiKey: 'foo',
                        takerAddress: contracts_test_utils_1.randomAddress(),
                        intentOnFilling: true,
                        txOrigin: contracts_test_utils_1.randomAddress(),
                        quoteRequestor: {
                            requestRfqtFirmQuotesAsync: requestor.object.requestRfqtFirmQuotesAsync,
                        },
                    } }));
                mockedMarketOpUtils.verifyAll();
                requestor.verifyAll();
            }));
            it('getMarketSellOrdersAsync() will rerun the optimizer if one or more indicative are returned', () => __awaiter(this, void 0, void 0, function* () {
                const requestor = getMockedQuoteRequestor('indicative', [ORDERS[0], ORDERS[1]], TypeMoq.Times.once());
                const numOrdersInCall = [];
                const numIndicativeQuotesInCall = [];
                const mockedMarketOpUtils = TypeMoq.Mock.ofType(market_operation_utils_1.MarketOperationUtils, TypeMoq.MockBehavior.Loose, false, MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                mockedMarketOpUtils.callBase = true;
                mockedMarketOpUtils
                    .setup(m => m._generateOptimizedOrdersAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .callback((msl, _opts) => __awaiter(this, void 0, void 0, function* () {
                    numOrdersInCall.push(msl.quotes.nativeOrders.length);
                    numIndicativeQuotesInCall.push(msl.quotes.rfqtIndicativeQuotes.length);
                }))
                    .returns((a, b) => __awaiter(this, void 0, void 0, function* () { return mockedMarketOpUtils.target._generateOptimizedOrdersAsync(a, b); }))
                    .verifiable(TypeMoq.Times.exactly(2));
                const totalAssetAmount = ORDERS.map(o => o.order.takerAmount).reduce((a, b) => a.plus(b));
                yield mockedMarketOpUtils.object.getOptimizerResultAsync(ORDERS.slice(2, ORDERS.length), totalAssetAmount, src_1.MarketOperation.Sell, Object.assign({}, DEFAULT_OPTS, { rfqt: {
                        isIndicative: true,
                        apiKey: 'foo',
                        takerAddress: contracts_test_utils_1.randomAddress(),
                        txOrigin: contracts_test_utils_1.randomAddress(),
                        intentOnFilling: true,
                        quoteRequestor: {
                            requestRfqtIndicativeQuotesAsync: requestor.object.requestRfqtIndicativeQuotesAsync,
                        },
                    } }));
                mockedMarketOpUtils.verifyAll();
                requestor.verifyAll();
                // The first and second optimizer call contains same number of RFQ orders.
                contracts_test_utils_1.expect(numOrdersInCall.length).to.eql(2);
                contracts_test_utils_1.expect(numOrdersInCall[0]).to.eql(1);
                contracts_test_utils_1.expect(numOrdersInCall[1]).to.eql(1);
                // The first call to optimizer will have no RFQ indicative quotes. The second call will have
                // two indicative quotes.
                contracts_test_utils_1.expect(numIndicativeQuotesInCall.length).to.eql(2);
                contracts_test_utils_1.expect(numIndicativeQuotesInCall[0]).to.eql(0);
                contracts_test_utils_1.expect(numIndicativeQuotesInCall[1]).to.eql(2);
            }));
            it('getMarketSellOrdersAsync() will rerun the optimizer if one or more RFQ orders are returned', () => __awaiter(this, void 0, void 0, function* () {
                const requestor = getMockedQuoteRequestor('firm', [ORDERS[0]], TypeMoq.Times.once());
                // Ensure that `_generateOptimizedOrdersAsync` is only called once
                // TODO: Ensure fillable amounts increase too
                const numOrdersInCall = [];
                const mockedMarketOpUtils = TypeMoq.Mock.ofType(market_operation_utils_1.MarketOperationUtils, TypeMoq.MockBehavior.Loose, false, MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                mockedMarketOpUtils.callBase = true;
                mockedMarketOpUtils
                    .setup(m => m._generateOptimizedOrdersAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .callback((msl, _opts) => __awaiter(this, void 0, void 0, function* () {
                    numOrdersInCall.push(msl.quotes.nativeOrders.length);
                }))
                    .returns((a, b) => __awaiter(this, void 0, void 0, function* () { return mockedMarketOpUtils.target._generateOptimizedOrdersAsync(a, b); }))
                    .verifiable(TypeMoq.Times.exactly(2));
                const totalAssetAmount = ORDERS.map(o => o.order.takerAmount).reduce((a, b) => a.plus(b));
                yield mockedMarketOpUtils.object.getOptimizerResultAsync(ORDERS.slice(1, ORDERS.length), totalAssetAmount, src_1.MarketOperation.Sell, Object.assign({}, DEFAULT_OPTS, { rfqt: {
                        isIndicative: false,
                        apiKey: 'foo',
                        takerAddress: contracts_test_utils_1.randomAddress(),
                        intentOnFilling: true,
                        txOrigin: contracts_test_utils_1.randomAddress(),
                        quoteRequestor: {
                            requestRfqtFirmQuotesAsync: requestor.object.requestRfqtFirmQuotesAsync,
                        },
                    } }));
                mockedMarketOpUtils.verifyAll();
                requestor.verifyAll();
                contracts_test_utils_1.expect(numOrdersInCall.length).to.eql(2);
                // The first call to optimizer was without an RFQ order.
                // The first call to optimizer was with an extra RFQ order.
                contracts_test_utils_1.expect(numOrdersInCall[0]).to.eql(2);
                contracts_test_utils_1.expect(numOrdersInCall[1]).to.eql(3);
            }));
            it('getMarketSellOrdersAsync() will not raise a NoOptimalPath error if no initial path was found during on-chain DEX optimization, but a path was found after RFQ optimization', () => __awaiter(this, void 0, void 0, function* () {
                let hasFirstOptimizationRun = false;
                let hasSecondOptimizationRun = false;
                const requestor = getMockedQuoteRequestor('firm', [ORDERS[0], ORDERS[1]], TypeMoq.Times.once());
                const mockedMarketOpUtils = TypeMoq.Mock.ofType(market_operation_utils_1.MarketOperationUtils, TypeMoq.MockBehavior.Loose, false, MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                mockedMarketOpUtils.callBase = true;
                mockedMarketOpUtils
                    .setup(m => m._generateOptimizedOrdersAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .returns((msl, _opts) => __awaiter(this, void 0, void 0, function* () {
                    if (msl.quotes.nativeOrders.length === 1) {
                        hasFirstOptimizationRun = true;
                        throw new Error(types_1.AggregationError.NoOptimalPath);
                    }
                    else if (msl.quotes.nativeOrders.length === 3) {
                        hasSecondOptimizationRun = true;
                        return mockedMarketOpUtils.target._generateOptimizedOrdersAsync(msl, _opts);
                    }
                    else {
                        throw new Error('Invalid path. this error message should never appear');
                    }
                }))
                    .verifiable(TypeMoq.Times.exactly(2));
                const totalAssetAmount = ORDERS.map(o => o.order.takerAmount).reduce((a, b) => a.plus(b));
                yield mockedMarketOpUtils.object.getOptimizerResultAsync(ORDERS.slice(2, ORDERS.length), totalAssetAmount, src_1.MarketOperation.Sell, Object.assign({}, DEFAULT_OPTS, { rfqt: {
                        isIndicative: false,
                        apiKey: 'foo',
                        takerAddress: contracts_test_utils_1.randomAddress(),
                        txOrigin: contracts_test_utils_1.randomAddress(),
                        intentOnFilling: true,
                        quoteRequestor: {
                            requestRfqtFirmQuotesAsync: requestor.object.requestRfqtFirmQuotesAsync,
                        },
                    } }));
                mockedMarketOpUtils.verifyAll();
                requestor.verifyAll();
                contracts_test_utils_1.expect(hasFirstOptimizationRun).to.eql(true);
                contracts_test_utils_1.expect(hasSecondOptimizationRun).to.eql(true);
            }));
            it('getMarketSellOrdersAsync() will raise a NoOptimalPath error if no path was found during on-chain DEX optimization and RFQ optimization', () => __awaiter(this, void 0, void 0, function* () {
                const mockedMarketOpUtils = TypeMoq.Mock.ofType(market_operation_utils_1.MarketOperationUtils, TypeMoq.MockBehavior.Loose, false, MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                mockedMarketOpUtils.callBase = true;
                mockedMarketOpUtils
                    .setup(m => m._generateOptimizedOrdersAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                    .returns((msl, _opts) => __awaiter(this, void 0, void 0, function* () {
                    throw new Error(types_1.AggregationError.NoOptimalPath);
                }))
                    .verifiable(TypeMoq.Times.exactly(1));
                try {
                    yield mockedMarketOpUtils.object.getOptimizerResultAsync(ORDERS.slice(2, ORDERS.length), ORDERS[0].order.takerAmount, src_1.MarketOperation.Sell, DEFAULT_OPTS);
                    contracts_test_utils_1.expect.fail(`Call should have thrown "${types_1.AggregationError.NoOptimalPath}" but instead succeded`);
                }
                catch (e) {
                    if (e.message !== types_1.AggregationError.NoOptimalPath) {
                        contracts_test_utils_1.expect.fail(e);
                    }
                }
                mockedMarketOpUtils.verifyAll();
            }));
            it('generates bridge orders with correct taker amount', () => __awaiter(this, void 0, void 0, function* () {
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, 
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, DEFAULT_OPTS);
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const totaltakerAmount = utils_1.BigNumber.sum(...improvedOrders.map(o => o.takerAmount));
                contracts_test_utils_1.expect(totaltakerAmount).to.bignumber.gte(FILL_AMOUNT);
            }));
            it('generates bridge orders with max slippage of `bridgeSlippage`', () => __awaiter(this, void 0, void 0, function* () {
                const bridgeSlippage = _.random(0.1, true);
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, 
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { bridgeSlippage }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                for (const order of improvedOrders) {
                    const expectedMakerAmount = order.fills[0].output;
                    const slippage = new utils_1.BigNumber(1).minus(order.makerAmount.div(expectedMakerAmount.plus(1)));
                    contracts_test_utils_1.assertRoughlyEquals(slippage, bridgeSlippage, 1);
                }
            }));
            it('can mix convex sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, DEFAULT_RATES);
                rates[types_1.ERC20BridgeSource.Native] = [0.4, 0.3, 0.2, 0.1];
                rates[types_1.ERC20BridgeSource.Uniswap] = [0.5, 0.05, 0.05, 0.05];
                rates[types_1.ERC20BridgeSource.Eth2Dai] = [0.6, 0.05, 0.05, 0.05];
                rates[types_1.ERC20BridgeSource.Kyber] = [0, 0, 0, 0]; // unused
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_1.ERC20BridgeSource.Eth2Dai,
                    types_1.ERC20BridgeSource.Uniswap,
                    types_1.ERC20BridgeSource.Native,
                    types_1.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            const ETH_TO_MAKER_RATE = 1.5;
            it('factors in fees for native orders', () => __awaiter(this, void 0, void 0, function* () {
                // Native orders will have the best rates but have fees,
                // dropping their effective rates.
                const nativeFeeRate = 0.06;
                const rates = {
                    [types_1.ERC20BridgeSource.Native]: [1, 0.99, 0.98, 0.97],
                    [types_1.ERC20BridgeSource.Uniswap]: [0.96, 0.1, 0.1, 0.1],
                    [types_1.ERC20BridgeSource.Eth2Dai]: [0.95, 0.1, 0.1, 0.1],
                    [types_1.ERC20BridgeSource.Kyber]: [0.1, 0.1, 0.1, 0.1],
                };
                const feeSchedule = {
                    [types_1.ERC20BridgeSource.Native]: _.constant(FILL_AMOUNT.div(4)
                        .times(nativeFeeRate)
                        .dividedToIntegerBy(ETH_TO_MAKER_RATE)),
                };
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                });
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_1.ERC20BridgeSource.Native,
                    types_1.ERC20BridgeSource.Uniswap,
                    types_1.ERC20BridgeSource.Eth2Dai,
                    types_1.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('factors in fees for dexes', () => __awaiter(this, void 0, void 0, function* () {
                // Kyber will have the best rates but will have fees,
                // dropping its effective rates.
                const uniswapFeeRate = 0.2;
                const rates = {
                    [types_1.ERC20BridgeSource.Native]: [0.95, 0.1, 0.1, 0.1],
                    [types_1.ERC20BridgeSource.Kyber]: [0.1, 0.1, 0.1, 0.1],
                    [types_1.ERC20BridgeSource.Eth2Dai]: [0.92, 0.1, 0.1, 0.1],
                    // Effectively [0.8, ~0.5, ~0, ~0]
                    [types_1.ERC20BridgeSource.Uniswap]: [1, 0.7, 0.2, 0.2],
                };
                const feeSchedule = {
                    [types_1.ERC20BridgeSource.Uniswap]: _.constant(FILL_AMOUNT.div(4)
                        .times(uniswapFeeRate)
                        .dividedToIntegerBy(ETH_TO_MAKER_RATE)),
                };
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                });
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_1.ERC20BridgeSource.Native,
                    types_1.ERC20BridgeSource.Eth2Dai,
                    types_1.ERC20BridgeSource.Uniswap,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('can mix one concave source', () => __awaiter(this, void 0, void 0, function* () {
                const rates = {
                    [types_1.ERC20BridgeSource.Kyber]: [0, 0, 0, 0],
                    [types_1.ERC20BridgeSource.Eth2Dai]: [0.5, 0.85, 0.75, 0.75],
                    [types_1.ERC20BridgeSource.Uniswap]: [0.96, 0.2, 0.1, 0.1],
                    [types_1.ERC20BridgeSource.Native]: [0.95, 0.2, 0.2, 0.1],
                };
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                });
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_1.ERC20BridgeSource.Eth2Dai,
                    types_1.ERC20BridgeSource.Uniswap,
                    types_1.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('fallback orders use different sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = {};
                rates[types_1.ERC20BridgeSource.Native] = [0.9, 0.8, 0.5, 0.5];
                rates[types_1.ERC20BridgeSource.Uniswap] = [0.6, 0.05, 0.01, 0.01];
                rates[types_1.ERC20BridgeSource.Eth2Dai] = [0.4, 0.3, 0.01, 0.01];
                rates[types_1.ERC20BridgeSource.Kyber] = [0.35, 0.2, 0.01, 0.01];
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = orderSources.slice(0, 4);
                const secondSources = orderSources.slice(4);
                contracts_test_utils_1.expect(_.intersection(firstSources, secondSources)).to.be.length(0);
            }));
            it('does not create a fallback if below maxFallbackSlippage', () => __awaiter(this, void 0, void 0, function* () {
                const rates = {};
                rates[types_1.ERC20BridgeSource.Native] = [1, 1, 0.01, 0.01];
                rates[types_1.ERC20BridgeSource.Uniswap] = [1, 1, 0.01, 0.01];
                rates[types_1.ERC20BridgeSource.Eth2Dai] = [0.49, 0.49, 0.49, 0.49];
                rates[types_1.ERC20BridgeSource.Kyber] = [0.35, 0.2, 0.01, 0.01];
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield getMarketSellOrdersAsync(marketOperationUtils, createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true, maxFallbackSlippage: 0.25 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = [types_1.ERC20BridgeSource.Native, types_1.ERC20BridgeSource.Native, types_1.ERC20BridgeSource.Uniswap];
                const secondSources = [];
                contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
            }));
            it('is able to create a order from LiquidityProvider', () => __awaiter(this, void 0, void 0, function* () {
                const liquidityProviderAddress = DEFAULT_FILL_DATA[types_1.ERC20BridgeSource.LiquidityProvider]
                    .poolAddress;
                const rates = {};
                rates[types_1.ERC20BridgeSource.LiquidityProvider] = [1, 1, 1, 1];
                MOCK_SAMPLER.liquidityProviderRegistry[liquidityProviderAddress] = {
                    tokens: [MAKER_TOKEN, TAKER_TOKEN],
                    gasCost: 0,
                };
                replaceSamplerOps({
                    getLimitOrderFillableTakerAmounts: () => [contracts_test_utils_1.constants.ZERO_AMOUNT],
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const sampler = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                const ordersAndReport = yield sampler.getOptimizerResultAsync([
                    {
                        order: new protocol_utils_1.LimitOrder({
                            makerToken: MAKER_TOKEN,
                            takerToken: TAKER_TOKEN,
                        }),
                        type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
                        signature: {},
                    },
                ], FILL_AMOUNT, src_1.MarketOperation.Sell, {
                    includedSources: [types_1.ERC20BridgeSource.LiquidityProvider],
                    excludedSources: [],
                    numSamples: 4,
                    bridgeSlippage: 0,
                });
                const result = ordersAndReport.optimizedOrders;
                contracts_test_utils_1.expect(result.length).to.eql(1);
                contracts_test_utils_1.expect(result[0].fillData.poolAddress).to.eql(liquidityProviderAddress);
                // // TODO (xianny): decode bridge data in v4 format
                // // tslint:disable-next-line:no-unnecessary-type-assertion
                // const decodedAssetData = assetDataUtils.decodeAssetDataOrThrow(
                //     result[0].makerAssetData,
                // ) as ERC20BridgeAssetData;
                // expect(decodedAssetData.assetProxyId).to.eql(AssetProxyId.ERC20Bridge);
                // expect(decodedAssetData.bridgeAddress).to.eql(liquidityProviderAddress);
                // expect(result[0].takerAmount).to.bignumber.eql(FILL_AMOUNT);
            }));
            it('factors in exchange proxy gas overhead', () => __awaiter(this, void 0, void 0, function* () {
                // Uniswap has a slightly better rate than LiquidityProvider,
                // but LiquidityProvider is better accounting for the EP gas overhead.
                const rates = {
                    [types_1.ERC20BridgeSource.Native]: [0.01, 0.01, 0.01, 0.01],
                    [types_1.ERC20BridgeSource.Uniswap]: [1, 1, 1, 1],
                    [types_1.ERC20BridgeSource.LiquidityProvider]: [0.9999, 0.9999, 0.9999, 0.9999],
                };
                MOCK_SAMPLER.liquidityProviderRegistry[contracts_test_utils_1.randomAddress()] = {
                    tokens: [MAKER_TOKEN, TAKER_TOKEN],
                    gasCost: 0,
                };
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                });
                const optimizer = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                const gasPrice = 100e9; // 100 gwei
                const exchangeProxyOverhead = (sourceFlags) => sourceFlags === constants_1.SOURCE_FLAGS.LiquidityProvider
                    ? contracts_test_utils_1.constants.ZERO_AMOUNT
                    : new utils_1.BigNumber(1.3e5).times(gasPrice);
                const improvedOrdersResponse = yield optimizer.getOptimizerResultAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, src_1.MarketOperation.Sell, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, includedSources: [
                        types_1.ERC20BridgeSource.Native,
                        types_1.ERC20BridgeSource.Uniswap,
                        types_1.ERC20BridgeSource.LiquidityProvider,
                    ], excludedSources: [], exchangeProxyOverhead }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [types_1.ERC20BridgeSource.LiquidityProvider];
                contracts_test_utils_1.expect(orderSources).to.deep.eq(expectedSources);
            }));
        });
        describe('getMarketBuyOrdersAsync()', () => {
            const FILL_AMOUNT = new utils_1.BigNumber('100e18');
            const ORDERS = createOrdersFromBuyRates(FILL_AMOUNT, _.times(NUM_SAMPLES, () => DEFAULT_RATES[types_1.ERC20BridgeSource.Native][0]));
            const DEFAULT_OPTS = {
                numSamples: NUM_SAMPLES,
                sampleDistributionBase: 1,
                bridgeSlippage: 0,
                maxFallbackSlippage: 100,
                excludedSources: DEFAULT_EXCLUDED,
                allowFallback: false,
                gasSchedule: {},
                feeSchedule: {},
            };
            beforeEach(() => {
                replaceSamplerOps();
            });
            it('queries `numSamples` samples', () => __awaiter(this, void 0, void 0, function* () {
                const numSamples = _.random(1, 16);
                let actualNumSamples = 0;
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        actualNumSamples = amounts.length;
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                });
                yield getMarketBuyOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples }));
                contracts_test_utils_1.expect(actualNumSamples).eq(numSamples);
            }));
            it('polls all DEXes if `excludedSources` is empty', () => __awaiter(this, void 0, void 0, function* () {
                let sourcesPolled = [];
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                    getTwoHopBuyQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_1.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopBuyQuotes(..._args);
                    },
                    getBalancerBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                    getCreamBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Cream);
                        return DEFAULT_OPS.getCreamBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                });
                yield getMarketBuyOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [] }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(BUY_SOURCES.sort());
            }));
            it('does not poll DEXes in `excludedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const excludedSources = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                    getTwoHopBuyQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_1.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopBuyQuotes(..._args);
                    },
                    getBalancerBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                    getCreamBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Cream);
                        return DEFAULT_OPS.getCreamBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                });
                yield getMarketBuyOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.eq(_.without(BUY_SOURCES, ...excludedSources).sort());
            }));
            it('only polls DEXes in `includedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const includedSources = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress, TOKEN_ADJACENCY_GRAPH);
                    },
                    getTwoHopBuyQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_1.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopBuyQuotes(..._args);
                    },
                    getBalancerBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                    getCreamBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_1.ERC20BridgeSource.Cream);
                        return DEFAULT_OPS.getCreamBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                });
                yield getMarketBuyOrdersAsync(marketOperationUtils, ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [], includedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.eq(includedSources.sort());
            }));
            // it('generates bridge orders with correct asset data', async () => {
            //     const improvedOrdersResponse = await getMarketBuyOrdersAsync(
            //         marketOperationUtils,
            //         // Pass in empty orders to prevent native orders from being used.
            //         ORDERS.map(o => ({ ...o, makerAmount: constants.ZERO_AMOUNT })),
            //         FILL_AMOUNT,
            //         DEFAULT_OPTS,
            //     );
            //     const improvedOrders = improvedOrdersResponse.optimizedOrders;
            //     expect(improvedOrders).to.not.be.length(0);
            //     for (const order of improvedOrders) {
            //         expect(getSourceFromAssetData(order.makerAssetData)).to.exist('');
            //         const makerAssetDataPrefix = hexUtils.slice(
            //             assetDataUtils.encodeERC20BridgeAssetData(
            //                 MAKER_TOKEN,
            //                 constants.NULL_ADDRESS,
            //                 constants.NULL_BYTES,
            //             ),
            //             0,
            //             36,
            //         );
            //         assertSamePrefix(order.makerAssetData, makerAssetDataPrefix);
            //         expect(order.takerAssetData).to.eq(TAKER_ASSET_DATA);
            //     }
            // });
            it('generates bridge orders with correct maker amount', () => __awaiter(this, void 0, void 0, function* () {
                const improvedOrdersResponse = yield getMarketBuyOrdersAsync(marketOperationUtils, 
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, DEFAULT_OPTS);
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const totalmakerAmount = utils_1.BigNumber.sum(...improvedOrders.map(o => o.makerAmount));
                contracts_test_utils_1.expect(totalmakerAmount).to.bignumber.gte(FILL_AMOUNT);
            }));
            it('generates bridge orders with max slippage of `bridgeSlippage`', () => __awaiter(this, void 0, void 0, function* () {
                const bridgeSlippage = _.random(0.1, true);
                const improvedOrdersResponse = yield getMarketBuyOrdersAsync(marketOperationUtils, 
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { bridgeSlippage }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                for (const order of improvedOrders) {
                    const expectedTakerAmount = order.fills[0].output;
                    const slippage = order.takerAmount.div(expectedTakerAmount.plus(1)).minus(1);
                    contracts_test_utils_1.assertRoughlyEquals(slippage, bridgeSlippage, 1);
                }
            }));
            it('can mix convex sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, ZERO_RATES);
                rates[types_1.ERC20BridgeSource.Native] = [0.4, 0.3, 0.2, 0.1];
                rates[types_1.ERC20BridgeSource.Uniswap] = [0.5, 0.05, 0.05, 0.05];
                rates[types_1.ERC20BridgeSource.Eth2Dai] = [0.6, 0.05, 0.05, 0.05];
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield getMarketBuyOrdersAsync(marketOperationUtils, createOrdersFromBuyRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_1.ERC20BridgeSource.Eth2Dai,
                    types_1.ERC20BridgeSource.Uniswap,
                    types_1.ERC20BridgeSource.Native,
                    types_1.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            const ETH_TO_TAKER_RATE = 1.5;
            it('factors in fees for native orders', () => __awaiter(this, void 0, void 0, function* () {
                // Native orders will have the best rates but have fees,
                // dropping their effective rates.
                const nativeFeeRate = 0.06;
                const rates = Object.assign({}, ZERO_RATES, { [types_1.ERC20BridgeSource.Native]: [1, 0.99, 0.98, 0.97], [types_1.ERC20BridgeSource.Uniswap]: [0.96, 0.1, 0.1, 0.1], [types_1.ERC20BridgeSource.Eth2Dai]: [0.95, 0.1, 0.1, 0.1], [types_1.ERC20BridgeSource.Kyber]: [0.1, 0.1, 0.1, 0.1] });
                const feeSchedule = {
                    [types_1.ERC20BridgeSource.Native]: _.constant(FILL_AMOUNT.div(4)
                        .times(nativeFeeRate)
                        .dividedToIntegerBy(ETH_TO_TAKER_RATE)),
                };
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_TAKER_RATE),
                });
                const improvedOrdersResponse = yield getMarketBuyOrdersAsync(marketOperationUtils, createOrdersFromBuyRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_1.ERC20BridgeSource.Uniswap,
                    types_1.ERC20BridgeSource.Eth2Dai,
                    types_1.ERC20BridgeSource.Native,
                    types_1.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('factors in fees for dexes', () => __awaiter(this, void 0, void 0, function* () {
                // Uniswap will have the best rates but will have fees,
                // dropping its effective rates.
                const uniswapFeeRate = 0.2;
                const rates = Object.assign({}, ZERO_RATES, { [types_1.ERC20BridgeSource.Native]: [0.95, 0.1, 0.1, 0.1], 
                    // Effectively [0.8, ~0.5, ~0, ~0]
                    [types_1.ERC20BridgeSource.Uniswap]: [1, 0.7, 0.2, 0.2], [types_1.ERC20BridgeSource.Eth2Dai]: [0.92, 0.1, 0.1, 0.1] });
                const feeSchedule = {
                    [types_1.ERC20BridgeSource.Uniswap]: _.constant(FILL_AMOUNT.div(4)
                        .times(uniswapFeeRate)
                        .dividedToIntegerBy(ETH_TO_TAKER_RATE)),
                };
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_TAKER_RATE),
                });
                const improvedOrdersResponse = yield getMarketBuyOrdersAsync(marketOperationUtils, createOrdersFromBuyRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_1.ERC20BridgeSource.Native,
                    types_1.ERC20BridgeSource.Eth2Dai,
                    types_1.ERC20BridgeSource.Uniswap,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('fallback orders use different sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, ZERO_RATES);
                rates[types_1.ERC20BridgeSource.Native] = [0.9, 0.8, 0.5, 0.5];
                rates[types_1.ERC20BridgeSource.Uniswap] = [0.6, 0.05, 0.01, 0.01];
                rates[types_1.ERC20BridgeSource.Eth2Dai] = [0.4, 0.3, 0.01, 0.01];
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield getMarketBuyOrdersAsync(marketOperationUtils, createOrdersFromBuyRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = orderSources.slice(0, 4);
                const secondSources = orderSources.slice(4);
                contracts_test_utils_1.expect(_.intersection(firstSources, secondSources)).to.be.length(0);
            }));
            it('does not create a fallback if below maxFallbackSlippage', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, ZERO_RATES);
                rates[types_1.ERC20BridgeSource.Native] = [1, 1, 0.01, 0.01];
                rates[types_1.ERC20BridgeSource.Uniswap] = [1, 1, 0.01, 0.01];
                rates[types_1.ERC20BridgeSource.Eth2Dai] = [0.49, 0.49, 0.49, 0.49];
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield getMarketBuyOrdersAsync(marketOperationUtils, createOrdersFromBuyRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true, maxFallbackSlippage: 0.25 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = [types_1.ERC20BridgeSource.Native, types_1.ERC20BridgeSource.Native, types_1.ERC20BridgeSource.Uniswap];
                const secondSources = [];
                contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
            }));
            it('factors in exchange proxy gas overhead', () => __awaiter(this, void 0, void 0, function* () {
                // Uniswap has a slightly better rate than LiquidityProvider,
                // but LiquidityProvider is better accounting for the EP gas overhead.
                const rates = {
                    [types_1.ERC20BridgeSource.Native]: [0.01, 0.01, 0.01, 0.01],
                    [types_1.ERC20BridgeSource.Uniswap]: [1, 1, 1, 1],
                    [types_1.ERC20BridgeSource.LiquidityProvider]: [0.9999, 0.9999, 0.9999, 0.9999],
                };
                MOCK_SAMPLER.liquidityProviderRegistry[contracts_test_utils_1.randomAddress()] = {
                    tokens: [MAKER_TOKEN, TAKER_TOKEN],
                    gasCost: 0,
                };
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_TAKER_RATE),
                });
                const optimizer = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
                const gasPrice = 100e9; // 100 gwei
                const exchangeProxyOverhead = (sourceFlags) => sourceFlags === constants_1.SOURCE_FLAGS.LiquidityProvider
                    ? contracts_test_utils_1.constants.ZERO_AMOUNT
                    : new utils_1.BigNumber(1.3e5).times(gasPrice);
                const improvedOrdersResponse = yield optimizer.getOptimizerResultAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_1.ERC20BridgeSource.Native]), FILL_AMOUNT, src_1.MarketOperation.Buy, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, includedSources: [
                        types_1.ERC20BridgeSource.Native,
                        types_1.ERC20BridgeSource.Uniswap,
                        types_1.ERC20BridgeSource.LiquidityProvider,
                    ], excludedSources: [], exchangeProxyOverhead }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [types_1.ERC20BridgeSource.LiquidityProvider];
                contracts_test_utils_1.expect(orderSources).to.deep.eq(expectedSources);
            }));
        });
    });
    describe('createFills', () => {
        const takerAmount = new utils_1.BigNumber(5000000);
        const outputAmountPerEth = new utils_1.BigNumber(0.5);
        // tslint:disable-next-line:no-object-literal-type-assertion
        const smallOrder = {
            order: Object.assign({}, new protocol_utils_1.LimitOrder({
                chainId: 1,
                maker: 'SMALL_ORDER',
                takerAmount,
                makerAmount: takerAmount.times(2),
            })),
            fillableMakerAmount: takerAmount.times(2),
            fillableTakerAmount: takerAmount,
            fillableTakerFeeAmount: new utils_1.BigNumber(0),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            signature: SIGNATURE,
        };
        const largeOrder = {
            order: Object.assign({}, new protocol_utils_1.LimitOrder({
                chainId: 1,
                maker: 'LARGE_ORDER',
                takerAmount: smallOrder.order.takerAmount.times(2),
                makerAmount: smallOrder.order.makerAmount.times(2),
            })),
            fillableTakerAmount: smallOrder.fillableTakerAmount.times(2),
            fillableMakerAmount: smallOrder.fillableMakerAmount.times(2),
            fillableTakerFeeAmount: new utils_1.BigNumber(0),
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
            signature: SIGNATURE,
        };
        const orders = [smallOrder, largeOrder];
        const feeSchedule = {
            [types_1.ERC20BridgeSource.Native]: _.constant(2e5),
        };
        it('penalizes native fill based on target amount when target is smaller', () => {
            const path = fills_1.createFills({
                side: src_1.MarketOperation.Sell,
                orders,
                dexQuotes: [],
                targetInput: takerAmount.minus(1),
                outputAmountPerEth,
                feeSchedule,
            });
            contracts_test_utils_1.expect(path[0][0].fillData.order.maker).to.eq(smallOrder.order.maker);
            contracts_test_utils_1.expect(path[0][0].input).to.be.bignumber.eq(takerAmount.minus(1));
        });
        it('penalizes native fill based on available amount when target is larger', () => {
            const path = fills_1.createFills({
                side: src_1.MarketOperation.Sell,
                orders,
                dexQuotes: [],
                targetInput: constants_1.POSITIVE_INF,
                outputAmountPerEth,
                feeSchedule,
            });
            contracts_test_utils_1.expect(path[0][0].fillData.order.maker).to.eq(largeOrder.order.maker);
            contracts_test_utils_1.expect(path[0][1].fillData.order.maker).to.eq(smallOrder.order.maker);
        });
    });
});
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=market_operation_utils_test.js.map